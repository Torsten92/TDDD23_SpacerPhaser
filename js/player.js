class Player extends GameObject {
	constructor(game) {
		super(game, 0, 'player', 200); //make invincible for development
		this.laser = game.add.weapon(50, 'laser_red');
		this.laser.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
		this.laser.bulletSpeed = 600;
		this.laser.fireRate = 150;
		this.laserSide = false;
		this.laser.trackSprite(this.object, 16, 0, true);
		this.weaponLevel = 0;
		this.engineLevel = 0;
		this.shieldLevel = 0;

		//Give player sprite a random color tint
		var red = Math.round(255 * (0.5 + Math.random() * 0.5));
		var green = Math.round(255 * (0.5 + Math.random() * 0.5));
		var blue = Math.round(255 * (0.5 + Math.random() * 0.5));
		this.object.tint = 0x10000 * red + 0x1 * green + 0x100 * blue;
		
		this.setWeaponLevel = function(val) {
			
			this.weaponLevel = Math.min(Math.max(val, 0), 10);
			this.laser.bulletSpeed = 600 + 75 * this.weaponLevel;
			this.laser.fireRate = 230 - 50 * Math.sqrt(this.weaponLevel); // goes from 230 to 71.9
			this.laser.bulletAngleVariance = 0.2 * this.weaponLevel;
			weapon_text.text = this.weaponLevel > 0 ? "Weapon Level: " + this.weaponLevel : "";
		}

		this.setEngineLevel = function(val) {
			
			this.engineLevel = Math.min(Math.max(val, 0), 10);
			this.object.body.maxVelocity.set(200 + 10 * this.engineLevel);
			engine_text.text = this.engineLevel > 0 ? "Engine Level: " + this.engineLevel : "";
		}


		this.setShieldLevel = function(val) {
			
			this.shieldLevel = Math.min(Math.max(val, 0), 10);
			this.shieldMax = 40 * this.shieldLevel;
			this.shieldTimer = 0.0;
			shield_text.text = this.shieldLevel > 0 ? "Shield Level: " + this.shieldLevel : "";
		}

		this.spawn_properties = function(game) {
			this.object.body.drag.set(50);
			this.setWeaponLevel(weapon_level);
			this.setEngineLevel(engine_level);
			this.setShieldLevel(shield_level);
			this.shield = this.shieldMax;
		}
	}


	get las() { return this.laser; }
	set las(val) { this.laser = val; }
	get lasSide() { return this.laserSide; }
	set lasSide(val) { this.laserSide = val; }
	
	get setWeaponLvl() { return this.setWeaponLevel; }
	set setWeaponLvl(val) { this.setWeaponLevel = val; }
	get setEngineLvl() { return this.setWeaponLevel; }
	set setEngineLvl(val) { this.setWeaponLevel = val; }
	get setShieldLvl() { return this.setWeaponLevel; }
	set setShieldLvl(val) { this.setWeaponLevel = val; }

	get weaponLvl() { return this.weaponLevel; }
	set weaponLvl(val) { this.weaponLevel = val; }
	get engineLvl() { return this.weaponLevel; }
	set engineLvl(val) { this.weaponLevel = val; }
	get shieldLvl() { return this.weaponLevel; }
	set shieldLvl(val) { this.weaponLevel = val; }

}
