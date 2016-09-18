class GameObject{
	constructor(game, index, type, hp) {
   		this.index = index;
   		this.type = type;
   		this.hp = hp;
   		this.hpMax = hp;

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

			//used to identify object through its sprite
			this.object.name = this.index;

			this.spawn_properties(game);
		}

		//special member function that is overridden by subclasses
		this.spawn_properties = function(game) {
			//do nothing
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
	get spawn_() { return this.spawn; } // spawn is the spawning function called when object is to be added to the scene
	set spawn_(val) { this.spawn = val; }
	get spawn_properties_() { return this.spawn_properties; } // spawn_properties is called by spawn and may be overridden by subclasses for extended functionality
	set spawn_properties_(val) { this.spawn_properties = val; }
}
