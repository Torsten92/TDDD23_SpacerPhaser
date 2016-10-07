class Breaker extends Enemy {
	constructor(game, index, makeParticles) {
		super(game, index, 'breaker', 150);

		this.laser = game.add.weapon(10, 'missile');
		this.laser.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
		this.laser.bulletSpeed = 200;
		this.laser.fireRate = 500;
		this.laserSide = false;
		this.laser.trackSprite(this.object, 10, 0, true);
		var _this = this;
		this.laser.onFire.add(function() {
			_this.laserSide = _this.laserSide ? false : true;
		});
		this.makeParticles = makeParticles;
		//could be expanded to store additional data
		this.bulletData = [ {lifetime: 0}, 
							{lifetime: 0}, 
							{lifetime: 0},
							{lifetime: 0},
							{lifetime: 0},
							{lifetime: 0},
							{lifetime: 0},
							{lifetime: 0},
							{lifetime: 0},
							{lifetime: 0} ]; //10 values. One for every bullet

		// The normal state is to just move towards player. All enemies start with this and changes state when 
		// close to player.
		this.stateHuntPlayer = function(playerX, playerY) {
			var playerDir = { x: playerX - this.object.x, y: playerY - this.object.y };
			var playerDirNorm = normalize(playerDir);
			var forwardDir = normalize({ x: Math.cos(this.object.rotation+Math.PI/2), y: Math.sin(this.object.rotation+Math.PI/2) });

			//in case missiles have been created, we still want to handle their movement
			this.handleMissiles(playerX, playerY);

			this.object.body.angularVelocity = 200*(dot(playerDirNorm, forwardDir));
			this.object.body.acceleration.x = -100*(this.object.x-playerX)/Math.abs((this.object.x-playerX));
			this.object.body.acceleration.y = -100*(this.object.y-playerY)/Math.abs((this.object.y-playerY));

			if(length(playerDir) < 350) {
				this.setState('huntFire');
				this.object.body.velocity.x = this.object.body.velocity.x * 0.5;
				this.object.body.velocity.y = this.object.body.velocity.y * 0.5;
			}
		}

		// Like normal state, exept enemy now start to fire at player, and move a bit slower.
		this.stateHuntFire = function(playerX, playerY) {
			var playerDir = { x: playerX - this.object.x, y: playerY - this.object.y };
			var playerDirNorm = normalize(playerDir);
			var standardRadian = this.object.rotation > 0 ? 2*Math.PI - this.object.rotation : -this.object.rotation; //phaser uses a weird radian system
			var forwardDir = normalize({ x: Math.cos(this.object.rotation+Math.PI/2), y: Math.sin(this.object.rotation+Math.PI/2) });

			var angle = this.object.rotation;
			if(this.laserSide) {
				this.laser.trackOffset.x = Math.cos(angle)*30+Math.sin(angle)*20;
				this.laser.trackOffset.y = Math.sin(angle)*30-Math.cos(angle)*20;
			}
			else {
				this.laser.trackOffset.x = Math.cos(angle)*30-Math.sin(angle)*20;
				this.laser.trackOffset.y = Math.sin(angle)*30+Math.cos(angle)*20;
			}
			this.handleMissiles(playerX, playerY);
			this.laser.fire();

			this.object.body.angularVelocity = 200*(dot(playerDirNorm, forwardDir));
			this.object.body.acceleration.x = -20*(this.object.x-playerX)/Math.abs((this.object.x-playerX));
			this.object.body.acceleration.y = -20*(this.object.y-playerY)/Math.abs((this.object.y-playerY));

			if(length(playerDir) > 450) {
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

		this.handleMissiles = function(playerX, playerY) {
			for (var i = 0; i < this.laser.bullets.children.length; i++) {
				var bullet = this.laser.bullets.children[i];
				var playerbulletDir = normalize({ x: playerX - bullet.x, y: playerY - bullet.y });
				var bulletDir = normalize({ x: Math.cos(bullet.rotation+Math.PI/2), y: Math.sin(bullet.rotation+Math.PI/2) });
				if(!bullet.alive) {
					this.bulletData[i].lifetime = 0;
				}
				else if(this.bulletData[i].lifetime < 5000) {
					this.bulletData[i].lifetime += game.time.elapsed;
					makeParticles('explosion_mini', bullet.x, bullet.y, 1, 10);
					bullet.body.angularVelocity = 100*(dot(playerbulletDir, bulletDir));
					var standardRadianBullet = bullet.rotation > 0 ? 2*Math.PI - bullet.rotation : -bullet.rotation; //phaser uses a weird radian system
					bullet.body.velocity.x = 350*Math.cos(standardRadianBullet);
					bullet.body.velocity.y = -350*Math.sin(standardRadianBullet);
				}
				else {
					this.makeParticles('explosion', bullet.x, bullet.y, 30, 150);
					bullet.kill();
				}
			}
		}

		this.removeAllMissiles = function() {
			for (var i = 0; i < this.laser.bullets.children.length; i++) {
				if(this.laser.bullets.children[i].alive) {
					this.makeParticles('explosion', this.laser.bullets.children[i].x, this.laser.bullets.children[i].y, 30, 150);
					this.laser.bullets.children[i].kill();
				}
			}
		}
	}


	get huntPlayerState() { return this.stateHuntPlayer; }
	set normalState_(val) { this.stateHuntPlayer = val; }
	get las() { return this.laser; }
	set las(val) { this.laser = val; }
	get lasSide() { return this.laserSide; }
	set lasSide(val) { this.laserSide = val; }
	get bullData() { return this.bulletData; }
	set bullData(val) { this.bulletData = val; }
	get remAll() { return this.removeAllMissiles; }
	set remAll(val) { this.removeAllMissiles = val; }
	get handMissiles() { return this.handleMissiles; }
	set handMissiles(val) { this.handleMissiles = val; }
	get makePart() { return this.makeParticles; }
	set makePart(val) { this.makeParticles = val; }

}

