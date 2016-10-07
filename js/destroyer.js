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

			if(length(playerDir) < 350) {
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

			this.updateCannons(playerX, playerY);

			if(length(playerDir) > 450) {
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
				this.cannons[i].trackPlayer(playerX, playerY);
			}
		}

		this.spawn_properties = function(game) {
			this.setState('huntPlayer');

			for(var i = 0; i < 6; i++) {
				this.cannons[i].object.reset(this.object.position.x, this.object.position.y);
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
		this.laser.trackSprite(this.object, 10, 0, true);

		this.trackPlayer = function(x, y) {
			//TODO
			this.object.rotation += 0.1;
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