class Asteroid extends GameObject {
	constructor(game, index) {
		super(game, index, 'asteroid', 150);

		this.spawn_properties = function(game) {
			this.object.body.velocity.x = -50 + Math.random() * 50;
			this.object.body.velocity.y = -50 + Math.random() * 50;
		}
	}


}
