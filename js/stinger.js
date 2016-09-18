class Stinger extends Enemy {
	constructor(game, index) {
		super(game, index, 'stinger', 50);

		this.laser = game.add.weapon(3, 'laser_green');
		this.laser.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
		this.laser.bulletSpeed = 600;
		this.laser.fireRate = 1000;
		this.laser.trackSprite(this.object, 10, 0, true);

		// The normal state is to just move towards player. All enemies start with this and changes state when 
		// close to player.
		this.stateHuntPlayer = function(playerX, playerY) {
			var playerDir = { x: playerX - this.object.x, y: playerY - this.object.y };
			var playerDirNorm = normalize(playerDir);
			var forwardDir = normalize({ x: Math.cos(this.object.rotation+Math.PI/2), y: Math.sin(this.object.rotation+Math.PI/2) });

			this.object.body.angularVelocity = 300*(dot(playerDirNorm, forwardDir));
			this.object.body.acceleration.x = -200*(this.object.x-playerX)/Math.abs((this.object.x-playerX));
			this.object.body.acceleration.y = -200*(this.object.y-playerY)/Math.abs((this.object.y-playerY));

			if(length(playerDir) < 300) {
				this.setState('huntFire');
			}
		}

		// Like normal state, exept enemy now start to fire at player, and move a bit slower.
		this.stateHuntFire = function(playerX, playerY) {
			var playerDir = { x: playerX - this.object.x, y: playerY - this.object.y };
			var playerDirNorm = normalize(playerDir);
			var forwardDir = normalize({ x: Math.cos(this.object.rotation+Math.PI/2), y: Math.sin(this.object.rotation+Math.PI/2) });

			this.laser.trackOffset.x = Math.cos(this.object.rotation)*10;
			this.laser.trackOffset.y = Math.sin(this.object.rotation)*10;
			this.laser.fire();

			this.object.body.angularVelocity = 300*(dot(playerDirNorm, forwardDir));
			this.object.body.acceleration.x = -100*(this.object.x-playerX)/Math.abs((this.object.x-playerX));
			this.object.body.acceleration.y = -100*(this.object.y-playerY)/Math.abs((this.object.y-playerY));

			if(length(playerDir) > 400) {
				this.setState('huntPlayer');
			}
		}

		this.setState = function(newState) {
			if(newState == 'huntPlayer') {
				this.activeState = this.stateHuntPlayer;
				this.object.body.maxVelocity.set(250);
			}
			else if(newState == 'huntFire') {
				this.activeState = this.stateHuntFire;
				this.object.body.maxVelocity.set(150);
			}
		}

		this.spawn_properties = function(game) {
			this.setState('huntPlayer');
		}
	}


	get huntPlayerState() { return this.stateHuntPlayer; }
	set normalState_(val) { this.stateHuntPlayer = val; }
	get las() { return this.laser; }
	set las(val) { this.laser = val; }

}