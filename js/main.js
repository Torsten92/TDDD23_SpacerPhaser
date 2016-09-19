
window.onload = function() {
	spacerPhaser();
};

//holds the phaser game data
var game;

//menu sprites that may need to be resized
var hud, healthbar_back, healthbar_mid, healthbar_front, weapon_text, engine_text, shield_text;


function spacerPhaser() {

	game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
	var STATES = { MENU: 0, INGAME: 1 };
	var state = STATES.MENU;

	function preload() {

		game.load.image('background','sprites/background.png');
		game.load.image('player','sprites/player.png');
		game.load.image('stinger','sprites/stinger.png');
		game.load.image('breaker','sprites/breaker.png');
		game.load.image('asteroid','sprites/asteroid.png');
		game.load.image('laser_red','sprites/laser_red.png');
		game.load.image('laser_green','sprites/laser_green.png');
		game.load.image('missile','sprites/missile.png');
		game.load.image('particle_red','sprites/particles/red.png');
		game.load.image('particle_green','sprites/particles/green.png');
		game.load.image('particle_yellow','sprites/particles/yellow.png');
		game.load.image('explosion','sprites/particles/explosion.png');
		game.load.image('explosion_mini','sprites/particles/explosion_mini.png');
		game.load.image('powerup_weapon','sprites/powerup_weapon.png');
		game.load.image('powerup_engine','sprites/powerup_engine.png');
		game.load.image('powerup_shield','sprites/powerup_shield.png');
		game.load.image('powerup_health','sprites/powerup_health.png');
		game.load.image('hud','sprites/menu/HUD.png');
		game.load.image('healthbar_back','sprites/menu/healthbar_back.png');
		game.load.image('healthbar_mid','sprites/menu/healthbar_mid.png');
		game.load.image('healthbar_front','sprites/menu/healthbar_front.png');

		game.load.audio('audio_laser', 'audio/laser.wav');
		game.load.audio('audio_missile', 'audio/missile.wav');
		game.load.audio('audio_explosion', 'audio/explosion.wav');
		game.load.audio('audio_powerup', 'audio/powerup.wav');

	}

	var time = Date.now();
	var dt;

	var background;
	var player;

	var NUM_ASTEROIDS = 10;
	var NUM_STINGERS = 10;
	var NUM_BREAKERS = 5;
	var NUM_POWERUPS = 10;
	var gameObjects; // contains all colliders in the scene
	var powerups; // contains all powerups in the scene
	var cursors;
	var fireButton, buttonW, buttonA, buttonD;

	var audioLaserCounter = 0;
	var audioLaser = [];
	var audioMissileCounter = 0;
	var audioMissile = [];
	var audioExplosionCounter = 0;
	var audioExplosion = [];
	var emitterCounter = 0;
	var emitters = [];

	function create() {

		background = game.add.tileSprite(0, 0, 1920, 1920, 'background');
		game.physics.startSystem(Phaser.Physics.P2JS);

		gameObjects = new Array();
		gameObjects[0] = new Player(game);
		player = gameObjects[0];

		powerups = new Array();

		cursors = game.input.keyboard.createCursorKeys();
		fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
		buttonW = this.input.keyboard.addKey(Phaser.KeyCode.W);
		buttonA = this.input.keyboard.addKey(Phaser.KeyCode.A);
		buttonS = this.input.keyboard.addKey(Phaser.KeyCode.S);
		buttonD = this.input.keyboard.addKey(Phaser.KeyCode.D);

		//we want to be able to play several instances of a sound at a time
		for(var i = 0; i < 10; i++) {
			audioLaser[i] = game.add.audio('audio_laser');
			audioLaser[i].volume = 0.2;
			audioMissile[i] = game.add.audio('audio_missile');
			audioMissile[i].volume = 0.1;
			audioExplosion[i] = game.add.audio('audio_explosion');
			audioExplosion[i].volume = 0.1;
		}

		//we want to be able to run several instances of particle systems at a time
		for(var i = 0; i < 100; i++) {
			emitters[i] = game.add.emitter(0, 0, 100);
			emitters[i].makeParticles('explosion'); //this will be changed on use
		}

		//create all objects
		for(var i = 0; i < NUM_ASTEROIDS; i++) {
			var temp = guid();
			gameObjects[temp] = new Asteroid(game, temp);
		}
		for(var i = 0; i < NUM_STINGERS; i++) {
			var temp = guid();
			gameObjects[temp] = new Stinger(game, temp);
			gameObjects[temp].laser.onFire.add(function() {
				audioLaserCounter = audioLaserCounter >= 9 ? 0 : audioLaserCounter+1;
				audioLaser[audioLaserCounter].play();
			});
		}
		for(var i = 0; i < NUM_BREAKERS; i++) {
			var temp = guid();
			gameObjects[temp] = new Breaker(game, temp, makeParticles);
			gameObjects[temp].laser.onFire.add(function() {
				//gameObjects[temp].laserSide = gameObjects[temp].laserSide ? false : true;
				audioMissileCounter = audioMissileCounter >= 9 ? 0 : audioMissileCounter+1;
				audioMissile[audioMissileCounter].play();
			});
		}

		//create all powerups
		for(var i = 0; i < NUM_POWERUPS; i++) {
			var temp = guid();
			powerups[temp] = new Powerup(game, temp, 'powerup_weapon'); //this will be changed on use
		}

		player.laser.onFire.add(function() {
			player.laserSide = player.laserSide ? false : true;
			audioLaserCounter = audioLaserCounter >= 9 ? 0 : audioLaserCounter+1;
			audioLaser[audioLaserCounter].play();
		});

		createHUD();

		setState(STATES.MENU);
	}

	function update() {
		dt = Date.now() - time;
		time = Date.now();

		if(state == STATES.MENU) {
			//do nothing
		}
		else if(state == STATES.INGAME) {
			
			game.world.wrap(player.object, 10);
			game.world.setBounds(player.object.x - 960, player.object.y - 960, 1920, 1920);
			
			//scale healthbar to show damage taken
			healthbar_mid.scale.x = player.hp/player.hpMax * scale, 1.0 * scale;

			//create a parallax-like effect on background
			var xBase = player.object.x - game.world.width / 2;
			var yBase = player.object.y - game.world.height / 2;
			var radius = game.math.distance(xBase, yBase, 0, 0);
			background.x = xBase - 100*Math.atan(xBase*(radius == 0 ? 0 : Math.abs(xBase)/radius)/1000);
			background.y = yBase - 100*Math.atan(yBase*(radius == 0 ? 0 : Math.abs(yBase)/radius)/1000);

			//handle per-object computations
			for(var id in gameObjects) {
				if(gameObjects[id].object.alive) {
					//remove if out of bounds. Built in method was troublesome here. (probably just me that's stupid or something)
					if(gameObjects[id].object.x < player.object.x - 960 || 
					   gameObjects[id].object.x > player.object.x + 960 ||
					   gameObjects[id].object.y < player.object.y - 960 || 
					   gameObjects[id].object.y > player.object.y + 960) {
						gameObjects[id].object.kill();
						continue;
					}

					//handle object-object collisions
					for(var id2 in gameObjects) {
						if(gameObjects[id].object.alive) {
							game.physics.arcade.collide(gameObjects[id].object, gameObjects[id2].object, objectObjectCollision, null, this);
						}
					}
					//handle bullet(laser)-object collisions
					game.physics.arcade.collide(player.laser.bullets, gameObjects[id].object, bulletObjectCollision, null, this);
					

					if(gameObjects[id] instanceof Asteroid) {
						gameObjects[id].object.body.rotation += 1;
					}

					if(gameObjects[id] instanceof Enemy) {
						gameObjects[id].update(game, gameObjects, player, bulletObjectCollision);
					}
				}
				else if(gameObjects[id] instanceof Breaker) {
					gameObjects[id].removeAllMissiles();
				}
			}

			//handle all powerups
			for(var id in powerups) {
				if(powerups[id].object.alive) {
					powerups[id].update(player);
				}
			}

			//spawn new objects
			if(Math.random() < 0.03) {
				createObject(Asteroid, player.object.x, player.object.y);
			}
			if(Math.random() < 0.005) {
				createObject(Stinger, player.object.x, player.object.y);
			}
			if(Math.random() < 0.001) {
				createObject(Breaker, player.object.x, player.object.y);
			}

			if(player.hp <= 0.0) {
				setState(STATES.MENU);
			}
		}

		//console.log(player.object);
		//input handling is always performed
		handleInput();
	}

	function bulletObjectCollision(o1, o2) {
		if(o2 instanceof Phaser.Bullet) {
			var intensity = 0;
			o2.kill();
			if(o2.key == 'laser_red') {
				makeParticles('particle_red', o2.x, o2.y);
				intensity = 10;
				gameObjects[o1.name].hp = gameObjects[o1.name].hp - 10;
			}
			if(o2.key == 'laser_green') {
				makeParticles('particle_green', o2.x, o2.y);
				intensity = 10;
				gameObjects[o1.name].hp = gameObjects[o1.name].hp - 10;
			}
			if(o2.key == 'missile') {
				makeParticles('explosion', o2.x, o2.y, 30, 150);
				intensity = 30;
				gameObjects[o1.name].hp = gameObjects[o1.name].hp - 30;
			}

			
			if(gameObjects[o1.name].hp <= 0) {
				o1.kill();
				makeParticles('explosion', o1.x, o1.y, 150, 300);
				createPowerupChance(gameObjects[o1.name]);
			}
		}
		if(gameObjects[o1.name] instanceof Player) {
			game.camera.shake(0.0002*intensity, 500);
		}
	}

	function objectObjectCollision(o1, o2) {
		var intensity = 0;
		while(gameObjects[o1.name].hp > 0 && gameObjects[o2.name].hp > 0) {
			gameObjects[o1.name].hp -= 1;
			gameObjects[o2.name].hp -= 1;
			intensity++;
		}
		if(gameObjects[o1.name] instanceof Player || gameObjects[o2.name] instanceof Player) {
			game.camera.shake(0.0002*intensity, 500);
		}
		if(gameObjects[o1.name].hp <= 0) {
			o1.kill();
			makeParticles('explosion', o1.x, o1.y, 150, 300);
			createPowerupChance(gameObjects[o1.name]);
		}
		if(gameObjects[o2.name].hp <= 0) {
			o2.kill();
			makeParticles('explosion', o2.x, o2.y, 150, 300);
			createPowerupChance(gameObjects[o2.name]);
		}
	}

	var makeParticles = function(name, x, y, amount = 20, duration = 100) {
		emitterCounter = emitterCounter >= 99 ? 0 : emitterCounter+1;
		emitters[emitterCounter].forEach(function(particle){ particle.loadTexture(name);});
		emitters[emitterCounter].x = x;
		emitters[emitterCounter].y = y;
		emitters[emitterCounter].start(true, duration, null, amount);

		if(name == 'explosion' && amount > 100 && duration > 200) {
			audioExplosionCounter = audioExplosionCounter >= 9 ? 0 : audioExplosionCounter+1;
			audioExplosion[audioExplosionCounter].play();
		}
	}

	function createObject(type, playerX, playerY) {
		for(var o in gameObjects) {
			if(gameObjects[o] instanceof type && !gameObjects[o].object.alive) {
				var axis = Math.random() < 0.5; // spawn along x-axis or y-axis
				var side = Math.random() < 0.5; // up or down for x-axis, and left or right for y-axis
				gameObjects[o].spawn( game,
					(axis ? (side ? playerX - 680 : playerX + 680) : playerX - 680 + Math.random()*1360),
					(axis ? playerY - 630 + Math.random()*1260 : (side ? playerY - 630 : playerY + 630))
				);
				break;
			}
		}
	}

	function createPowerupChance(gameObject) {
		if(Math.random() < 0.3) {
			if(gameObject instanceof Enemy || gameObject instanceof Asteroid) {
				var type = game.rnd.integerInRange(0, 3);
				if(type == 0) {
					createPowerup('powerup_weapon', gameObject.object.x, gameObject.object.y);
				}
				if(type == 1) {
					createPowerup('powerup_engine', gameObject.object.x, gameObject.object.y);
				}
				if(type == 2) {
					createPowerup('powerup_shield', gameObject.object.x, gameObject.object.y);
				}
				if(type == 3) {
					createPowerup('powerup_health', gameObject.object.x, gameObject.object.y);
				}
			}
		}
	}
	function createPowerup(type, x, y) {
		for(var o in powerups) {
			if(!powerups[o].object.alive) {
				powerups[o].spawn(game, type, x, y);
				break;
			}
		}
	}

	function handleInput() {
		if(state == STATES.MENU) {
			if (cursors.down.isDown || buttonS.isDown) {
				setState(STATES.INGAME);
			}
		}
		else if(state == STATES.INGAME) {

			if (cursors.up.isDown || buttonW.isDown) {
				//console.log("player pos: " + player.object.x + ", " + player.object.y);
				game.physics.arcade.accelerationFromRotation(player.object.rotation, 300+10*player.engineLevel, player.object.body.acceleration);
			}
			else {
				player.object.body.acceleration.set(0);
			}

			if (cursors.left.isDown || buttonA.isDown) {
				player.object.body.angularVelocity = -300 - 10 * player.engineLevel;
			}
			else if (cursors.right.isDown || buttonD.isDown) {
				player.object.body.angularVelocity = 300 + 10 * player.engineLevel;
			}
			else {
				player.object.body.angularVelocity = 0;
			}

			if (fireButton.isDown) {
				//player switches between left-side laser and right-side
				var angle = player.object.rotation;
				if(player.laserSide) {
					player.laser.trackOffset.x = Math.cos(angle)*16+Math.sin(angle)*10;
					player.laser.trackOffset.y = Math.sin(angle)*16-Math.cos(angle)*10;
				}
				else {
					player.laser.trackOffset.x = Math.cos(angle)*16-Math.sin(angle)*10;
					player.laser.trackOffset.y = Math.sin(angle)*16+Math.cos(angle)*10;
				}
				player.laser.fire();
			}
		}
	}

	function createHUD() {
		hud = game.add.sprite(-50, 536, 'hud');
		healthbar_back = game.add.sprite(100, 552, 'healthbar_back');
		healthbar_mid = game.add.sprite(100, 552, 'healthbar_mid');
		healthbar_front = game.add.sprite(100, 552, 'healthbar_front');
		weapon_text = game.add.text(500, 542, '', { font: "15px Arial", fill: "#ff0000" });
		engine_text = game.add.text(500, 558, '', { font: "15px Arial", fill: "#ffff00" });
		shield_text = game.add.text(500, 576, '', { font: "15px Arial", fill: "#0088ff" });
		hud.fixedToCamera = true;
		healthbar_back.fixedToCamera = true;
		healthbar_mid.fixedToCamera = true;
		healthbar_front.fixedToCamera = true;
		weapon_text.fixedToCamera = true;
		engine_text.fixedToCamera = true;
		shield_text.fixedToCamera = true;
	}

	function setState(val) {
		if(val == STATES.MENU) {
			game.camera.shake(0);
			background.x = -960;
			background.y = -960;
			game.camera.unfollow();
			hud.kill();
			healthbar_back.kill();
			healthbar_mid.kill();
			healthbar_front.kill();
			player.setWeaponLevel(0);
			player.setEngineLevel(0);
			player.setShieldLevel(0);
			weapon_text.text = "";
			engine_text.text = "";
			shield_text.text = "";

			for(var id in gameObjects) {
				gameObjects[id].object.kill();
				if(gameObjects[id] instanceof Breaker) {
					for(var bullet in gameObjects[id].laser.bullets.children) {
						gameObjects[id].laser.bullets.children[bullet].kill();
					}
				}
				if(gameObjects[id] instanceof Stinger) {
					for(var bullet in gameObjects[id].laser.bullets.children) {
						gameObjects[id].laser.bullets.children[bullet].kill();
					}
				}
			}
			for(var bullet in player.laser.bullets.children) {
				player.laser.bullets.children[bullet].kill();
			}
			for(var id in powerups) {
				powerups[id].remove();
			}
			for(var id in emitters) {
				emitters[id].forEach(function(particle){ particle.kill();});
			}
		}

		if(val == STATES.INGAME) {
			player.spawn(game, 0, 0);
			game.world.setBounds(player.object.x - 960, player.object.y - 960, 1920, 1920);
			game.camera.follow(player.object, Phaser.Camera.FOLLOW_LOCKON, 0.4, 0.4);

			hud.reset(-50, 536);
			healthbar_back.reset(100, 552*scale);
			healthbar_mid.reset(100, 552*scale);
			healthbar_front.reset(100, 552*scale);
		}

		state = val;
	}

	function render() {
		//game.debug.cameraInfo(game.camera, 32, 32);
		//game.debug.spriteCoords(player.object, 32, 500);
	}
}
