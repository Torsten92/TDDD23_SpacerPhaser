class Destroyer extends Enemy {
	constructor(game, index) {
		super(game, index, 'destroyer', 600);

		this.cannons = [];
		this.cannons[0] = new Destroyer_Cannon(game, -22, -21);
		this.cannons[1] = new Destroyer_Cannon(game,   3, -21);
		this.cannons[2] = new Destroyer_Cannon(game,  27, -21);
		this.cannons[3] = new Destroyer_Cannon(game, -22,  21);
		this.cannons[4] = new Destroyer_Cannon(game,   3,  21);
		this.cannons[5] = new Destroyer_Cannon(game,  27,  21);

		this.stateHuntPlayer = function(playerX, playerY) {
			var playerDir = { x: playerX - this.object.x, y: playerY - this.object.y };
			var playerDirNorm = normalize(playerDir);
			var forwardDir = normalize({ x: Math.cos(this.object.rotation+Math.PI/2), y: Math.sin(this.object.rotation+Math.PI/2) });

			this.object.body.angularVelocity = 100*(dot(playerDirNorm, forwardDir));
			this.object.body.acceleration.x = -100*(this.object.x-playerX)/Math.abs((this.object.x-playerX));
			this.object.body.acceleration.y = -100*(this.object.y-playerY)/Math.abs((this.object.y-playerY));

			this.updateCannons(playerX, playerY);

			if(length(playerDir) < 400) {
				this.setState('huntFire');
			}
		}

		this.stateHuntFire = function(playerX, playerY) {
			var playerDir = { x: playerX - this.object.x, y: playerY - this.object.y };
			var playerDirNorm = normalize(playerDir);
			var forwardDir = normalize({ x: Math.cos(this.object.rotation+Math.PI/2), y: Math.sin(this.object.rotation+Math.PI/2) });

			//rotate 90 degrees
			var rotDir = dot(playerDirNorm, forwardDir) > 0 ? -Math.PI/2 : Math.PI/2;
			var playerDirRot = { 
				x: Math.cos(rotDir) * playerDirNorm.x - Math.sin(rotDir) * playerDirNorm.y, 
				y: Math.sin(rotDir) * playerDirNorm.x + Math.cos(rotDir) * playerDirNorm.y 
			}
			
			this.object.body.angularVelocity = 120*(dot(playerDirRot, forwardDir));
			this.object.body.acceleration.x = (100*playerDirRot.x / Math.abs(forwardDir.x)) +
											  (length(playerDir) < 200 ? -playerDirNorm.x * 100 : playerDirNorm.x * 100);
			this.object.body.acceleration.y = (100*playerDirRot.y / Math.abs(forwardDir.y)) +
											  (length(playerDir) < 200 ? -playerDirNorm.y * 100 : playerDirNorm.y * 100);

			//try not to collide with other destroyers
			for(var id in this.otherDestroyers) {
				if(id != this.index && this.otherDestroyers[id].object.alive) {
					var dir = { x: this.otherDestroyers[id].object.x - this.object.x, y: this.otherDestroyers[id].object.y - this.object.y };
					var dirNorm = normalize(dir);

					if(length(dir) < 200) {
						this.object.body.acceleration.x = this.object.body.acceleration.x - dirNorm.x * 300;
						this.object.body.acceleration.y = this.object.body.acceleration.y - dirNorm.y * 300;
					}
				}
			}

			this.updateCannons(playerX, playerY);

			if(length(playerDir) > 500) {
				this.setState('huntPlayer');
			}
		}

		this.setState = function(newState) {
			if(newState == 'huntPlayer') {
				this.activeState = this.stateHuntPlayer;
				this.object.body.maxVelocity.set(200);
			}
			else if(newState == 'huntFire') {
				this.activeState = this.stateHuntFire;
				this.object.body.maxVelocity.set(100);
			}
		}

		this.updateCannons = function(playerX, playerY) {
			for(var i = 0; i < 6; i++) {
				var angle = this.object.rotation;
				this.cannons[i].object.position.x = this.object.position.x + Math.cos(angle) * this.cannons[i].posX - Math.sin(angle) * this.cannons[i].posY;
				this.cannons[i].object.position.y = this.object.position.y + Math.sin(angle) * this.cannons[i].posX + Math.cos(angle) * this.cannons[i].posY;
				var cannonAngle = i < 3 ? fixAngleLimits(angle) + Math.PI/2 : fixAngleLimits(angle) - Math.PI/2;
				cannonAngle = cannonAngle % (2*Math.PI); // no angle overflow
				this.cannons[i].trackPlayer(playerX, playerY, cannonAngle);
			}
		}

		this.spawn_properties = function(game) {
			this.setState('huntPlayer');

			for(var i = 0; i < 6; i++) {
				this.cannons[i].object.reset(this.object.position.x, this.object.position.y);
			}
		}

		this.removeCannons = function() {
			for(var i = 0; i < 6; i++) {
				this.cannons[i].object.kill();
			}
		}
	}

	get cannons_() { return this.cannons; }
	set cannons_(val) { this.cannons = val; }
	get huntPlayerState() { return this.stateHuntPlayer; }
	set huntPlayerState(val) { this.stateHuntPlayer = val; }
	get huntFireState() { return this.stateHuntFire; }
	set huntFireState(val) { this.stateHuntFire = val; }
	get update_cannons() { return this.updateCannons; }
	set update_cannons(val) { this.updateCannons = val; }
	get other_destroyers() { return this.otherDestroyers; }
	set other_destroyers(val) { this.otherDestroyers = val; }
}


//Each Destroyer holds six of these
class Destroyer_Cannon {
	constructor(game, x, y) {
   		this.object = game.add.sprite(0, 0, 'destroyer_cannon');
   		this.object.anchor.set(0.5);
		this.posX = x;
		this.posY = y;
		this.object.kill();

		this.laser = game.add.weapon(10, 'laser_green');
		this.laser.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
		this.laser.bulletSpeed = 900;
		this.laser.fireRate = 300;
		this.laser.bulletAngleVariance = 5;
		this.laser.trackSprite(this.object, 10, 0, true);

		this.trackPlayer = function(playerX, playerY, frontAngle) {
			var playerDir = { x: playerX - this.object.x, y: playerY - this.object.y };
			var playerDirNorm = normalize(playerDir);
			playerDirNorm.y = -playerDirNorm.y; //neccessary for function compability (phaser sees up as -y)
			var zeroDir = { x: 1.0, y: 0.0 };

			var angle = angleBetween(playerDirNorm, zeroDir);
			if(playerDirNorm.y < 0) angle = 2 * Math.PI - angle;

			//cannon can rotate +-45 degrees from its frontAngle
			var limit1 = limitAngle(frontAngle + Math.PI/4);
			var limit2 = limitAngle(frontAngle - Math.PI/4);
			//var angle = fixAngleLimits(desiredValue);
			var resAngle = limit1 > limit2 ? Math.max(Math.min(angle, limit1), limit2) : 
							(angle < limit1 || angle > limit2 ? angle : (angle < Math.PI ? limit1 : limit2));
			this.object.rotation = resetAngleLimits(resAngle);

			if(resAngle == angle) {
				this.laser.trackOffset.x = Math.cos(this.object.rotation)*10;
				this.laser.trackOffset.y = Math.sin(this.object.rotation)*10;
				this.laser.fire();
			}
		}
	}

	//holds many similarities to gameobject, but since it do not collide etc. with the rest of the world 
	//it is considered a unique class. Could be made into an abstact superclass or something, but this 
	//will have to do for now.
	get obj() { return this.object; }
	set obj(sprite) { this.object = sprite; }
	get pos_x() { return this.posX; }
	set pos_x(val) { this.posX = val; }
	get pos_y() { return this.posY; }
	set pos_y(val) { this.posY = val; }
	get las() { return this.laser; }
	set las(val) { this.laser = val; }
	get track_player() { return this.trackPlayer; }
	set track_player(val) { this.trackPlayer = val; }
}