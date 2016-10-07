class GameObject{
	constructor(game, index, type, hp) {
   		this.index = index;
   		this.type = type;
   		this.hp = hp;
   		this.hpMax = hp;
   		this.shield = 0.0;
   		this.shieldMax = 0.0;
   		this.shieldTimer = 0.0;

   		this.object = game.add.sprite(0, 0, this.type);
		game.physics.arcade.enable(this.object); 
		game.physics.enable(this.object, Phaser.Physics.P2JS);

		this.object.body.maxVelocity.set(200);
		this.object.anchor.set(0.5);
		this.object.body.collideWorldBounds = false;
		this.object.body.immovable = true;
		this.object.kill();

   		this.spawn = function(game, x, y) {
			this.object.reset(x, y);
			this.hp = this.hpMax;
			this.shield = this.shieldMax;

			//used to identify object through its sprite
			this.object.name = this.index;

			this.spawn_properties(game);
		}

		//special member function that is overridden by subclasses
		this.spawn_properties = function(game) {
			//do nothing
		}

		this.takeDamage = function(val) {
			this.shieldTimer = 5.0;
			if(this.shield > 0.0) {
				this.shield = this.shield - val;
				var remainingDamage = this.shield < 0.0 ? -this.shield : 0.0;
				this.hp = Math.max(this.hp - remainingDamage, 0.0);
				this.shield = this.shield < 0.0 ? 0.0 : this.shield;
			}
			else {
				this.hp = Math.max(this.hp - val, 0.0);
			}
		}

		//Regenerates 10% shields per second
		this.regenerateShield = function(dt) {
			if(this.shieldTimer <= 0.0 && this.shield < this.shieldMax) {
				this.shield = Math.min(this.shield + (this.shieldMax / 10.0) * dt , this.shieldMax);
			}
			this.shieldTimer -= dt;
		}

	}


	get obj() { return this.object; }
	set obj(sprite) { this.object = sprite; }
	get type_() { return this.type; }
	set type_(val) { this.type = val; }
	get index_() { return this.index; }
	set index_(val) { this.index = val; }
	get hp_() { return this.hp; }
	set hp_(val) { this.hp = val; }
	get hp_max() { return this.hpMax; }
	set hp_max(val) { this.hpMax = val; }
	get shield_() { return this.shield; }
	set shield_(val) { this.shield = val; }
	get shield_max() { return this.shieldMax; }
	set shield_max(val) { this.shieldMax = val; }
	get shield_timer() { return this.shieldTimer; }
	set shield_timer(val) { this.shieldTimer = val; }
	get spawn_() { return this.spawn; } // spawn is the spawning function called when object is to be added to the scene
	set spawn_(val) { this.spawn = val; }
	get spawn_properties_() { return this.spawn_properties; } // spawn_properties is called by spawn and may be overridden by subclasses for extended functionality
	set spawn_properties_(val) { this.spawn_properties = val; }
	get take_damage() { return this.takeDamage; } // function that is called whenever object takes damage
	set take_damage(val) { this.takeDamage = val; }
	get regen_shield() { return this.regenerateShield; } // function that handles shield regeneration of the object
	set regen_shield(val) { this.regenerateShield = val; }

}
