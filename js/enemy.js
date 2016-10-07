class Enemy extends GameObject {
	constructor(game, index, type, hp) {
		super(game, index, type, hp);

		this.update = function(game, gameObjects, player, bulletObjectCollision) {
			if(!(this instanceof Destroyer)) {
				for(var id in gameObjects) {
					if(gameObjects[id].object.alive && this.laser instanceof Phaser.Weapon) {
						game.physics.arcade.collide(this.laser.bullets, gameObjects[id].object, bulletObjectCollision, null, this);
					}
					game.physics.arcade.collide(this.laser.bullets, player.object, bulletObjectCollision, null, this);
				}
			}
			this.activeState(player.object.x, player.object.y);
		}

		this.activeState = function(playerX, playerY) {} //empty state. Overridden by subclasses
	}

	get update_() { return this.update; }
	set update_(val) { this.update = val; }
	get activeState_() { return this.activeState; }
	set activeState_(val) { this.activeState = val; }
}

//Utility functions used by enemy classes
var dot = function(in1, in2) {
	return in1.x * in2.x + in1.y * in2.y;
}

var length = function(vec2) {
	return Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y);
}

var angleq = function(in1, in2) {
	return Math.acos( dot(in1, in2) / (length(in1)*length(in2)) );
}

var normalize = function(inVec2) {
	var vec2 ={ x: inVec2.x, y: inVec2.y };	//we want copy, not reference
	var length = Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y);
	vec2.x /= length;
	vec2.y /= length;

	return vec2;
}