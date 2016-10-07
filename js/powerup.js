class Powerup{
	constructor(game, index, type) {
   		this.index = index;

   		this.object = game.add.sprite(0, 0, type);
		game.physics.arcade.enable(this.object); 
		game.physics.enable(this.object, Phaser.Physics.ARCADE);
		this.object.body.maxVelocity.set(50);
		this.object.anchor.set(0.5);
		this.object.body.collideWorldBounds = false;
		this.object.body.immovable = true;
		this.object.kill();

		this.data = {lifetime: 0, scale: 1.0, emitter: game.add.emitter(0, 0, 30), type: type, sound: game.add.audio('audio_powerup')};
		this.data.emitter.makeParticles('particle_yellow');
		this.data.emitter.start(false, 200, 250);
		this.data.emitter.on = false;
		this.data.sound.volume = 0.3;

   		this.spawn = function(game, type, x, y) {
			this.object.loadTexture(type);
			this.object.reset(x, y);
			this.data.emitter.x = x;
			this.data.emitter.y = y;
			this.data.emitter.on = true;
			this.data.type = type;

			//used to identify object through its sprite
			this.object.name = this.index;
		}

		this.update = function(player) {
			if(this.data.lifetime < 10000) {
				this.data.lifetime += game.time.elapsed;
				this.data.scale = Math.sin(Math.abs(this.data.lifetime)/1000);
				this.object.scale.setTo(this.data.scale, 1.0);

				var vecToPlayer = {x:this.object.x-player.object.x, y:this.object.y-player.object.y};
				if(length(vecToPlayer) < 100) {
					this.object.x -= vecToPlayer.x * Math.min(100 / Math.pow(length(vecToPlayer), 2), 10);
					this.object.y -= vecToPlayer.y * Math.min(100 / Math.pow(length(vecToPlayer), 2), 10);
					this.data.emitter.x = this.object.x;
					this.data.emitter.y = this.object.y;
				}
				if(length(vecToPlayer) < 20) {
					this.remove();
					this.data.sound.play();
					if(this.data.type == 'powerup_weapon') {
						player.setWeaponLevel(player.weaponLevel + 1);
					}
					if(this.data.type == 'powerup_engine') {
						player.setEngineLevel(player.engineLevel + 1);
					}
					if(this.data.type == 'powerup_shield') {
						player.setShieldLevel(player.shieldLevel + 1);

						//create shieldbar when player first gains shields
						if(player.shieldLevel == 1) {
							shieldbar_mid.reset(100*scale, 572*scale);
							shieldbar_front.reset(100*scale, 572*scale);
						}
					}
					else if(this.data.type == 'powerup_health' && player.hp > 0.0) {
						player.hp = Math.min(player.hp+100, player.hpMax);
					}

				}
			}
			else {
				this.remove();
			}
		}

		this.remove = function() {
			this.object.kill(); //kill if not picked up after 10 seconds to allow new ones to spawn
			this.data.lifetime = 0;
			this.data.scale = 1.0;
			this.data.emitter.on = false;
		}
	}


	get obj() { return this.object; }
	set obj(sprite) { this.object = sprite; }
	get index_() { return this.index; }
	set index_(val) { this.index = val; }
	get data_() { return this.data; }
	set data_(val) { this.data = val; }
	get spawn_() { return this.spawn; } // spawn is the spawning function called when object is to be added to the scene
	set spawn_(val) { this.spawn = val; }
	get update_() { return this.update; }
	set update_(val) { this.update = val; }
	get remove_() { return this.remove; }
	set remove_(val) { this.remove = val; }
}

var length = function(vec2) {
	return Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y);
}