class Player extends GameObject {
	constructor(game) {
		super(game, 0, 'player', 200); //make invincible for development
		this.laser = game.add.weapon(50, 'laser_red');
		this.laser.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
		this.laser.bulletSpeed = 600;
		this.laser.fireRate = 150;
		this.laserSide = false;
		this.laser.trackSprite(this.object, 16, 0, true);
		this.weaponLevel = 1;

		//Give player sprite a random color tint
		var red = Math.round(255 * (0.5 + Math.random() * 0.5));
		var green = Math.round(255 * (0.5 + Math.random() * 0.5));
		var blue = Math.round(255 * (0.5 + Math.random() * 0.5));
		this.object.tint = 0x10000 * red + 0x1 * green + 0x100 * blue;
		
		this.setWeaponLevel = function(val) {
			
			this.weaponLevel = Math.min(Math.max(val, 0), 3);
			this.laser.bulletSpeed = 450 + 150 * this.weaponLevel;
			this.laser.fireRate = 300 / (this.weaponLevel + 1);
		}

		this.spawn_properties = function(game) {
			this.object.body.drag.set(50);
		}
	}


	get las() { return this.laser; }
	set las(val) { this.laser = val; }
	get lasSide() { return this.laserSide; }
	set lasSide(val) { this.laserSide = val; }
	get setWeaponLvl() { return this.setWeaponLevel; }
	set setWeaponLvl(val) { this.setWeaponLevel = val; }
	get weaponLvl() { return this.weaponLevel; }
	set weaponLvl(val) { this.weaponLevel = val; }

}
