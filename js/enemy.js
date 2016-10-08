class Enemy extends GameObject {
	constructor(game, index, type, hp) {
		super(game, index, type, hp);

		this.update = function(game, gameObjects, player, bulletObjectCollision) {
			if(this instanceof Stinger || this instanceof Breaker) {
				for(var id in gameObjects) {
					if(gameObjects[id].object.alive) {
						game.physics.arcade.collide(this.laser.bullets, gameObjects[id].object, bulletObjectCollision, null, this);
					}
				}
			}
			else if(this instanceof Destroyer){
				for(var id in gameObjects) {
					if(gameObjects[id].object.alive) {
						for(var i = 0; i < 6; i++) {
							game.physics.arcade.collide(this.cannons[i].laser.bullets, gameObjects[id].object, bulletObjectCollision, null, this);
						}
					}
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

//returns scalar/dot product of two vectors
var dot = function(in1, in2) {
	return in1.x * in2.x + in1.y * in2.y;
}

//returns the length of a vector
var length = function(vec2) {
	return Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y);
}

//returns the angle between two vectors
var angleBetween = function(in1, in2) {
	return Math.acos( dot(in1, in2) / (length(in1)*length(in2)) );
}

//returns a normalized vector
var normalize = function(inVec2) {
	var vec2 = { x: inVec2.x, y: inVec2.y }; //we want copy, not reference
	var length = Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y);
	vec2.x /= length;
	vec2.y /= length;

	return vec2;
}

//Takes an angle in phaser coordinates (0-pi / (-pi)-0), and converts it to standard radians (0-2*pi)
var fixAngleLimits = function(angle) {
	return (angle > 0) ? 2 * Math.PI - angle : -angle;
}

//Takes an angle in normal coordinates (0-2*pi), and converts it to phaser coordinates (0-pi / (-pi)-0)
var resetAngleLimits = function(angle) {
	return (angle > Math.PI) ? 2 * Math.PI - angle : -angle;
}

//makes sure angle stays within (0-2*pi) after modifications like additions or subtractions
//ex: 0.1 - 1.0 = -0.9 would result in 2*pi-0.9 = 5.38
var limitAngle = function(angle) {
	return angle > 0 ? (angle % (2*Math.PI)) : ((2*Math.PI + angle) % (2*Math.PI));
}