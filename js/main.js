
window.onload = function() {
	spacerPhaser();
};

//holds the phaser game data
var game;

//after player death or victory, it takes an amount of time before returning to main menu
var deathTimer = 0.75;
var victoryTimer = 1.0;

function spacerPhaser() {

	game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
	var STATES = { MENU: 0, INGAME: 1, VICTORY: 2, CREDITS: 3 };
	var state = STATES.MENU;

	//Loads all game resources
	function preload() {

		game.load.image('background','sprites/background.png');
		game.load.image('player','sprites/player.png');
		game.load.image('stinger','sprites/stinger.png');
		game.load.image('breaker','sprites/breaker.png');
		game.load.image('destroyer','sprites/destroyer.png');
		game.load.image('destroyer_cannon','sprites/destroyer_cannon.png');
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
		game.load.image('shieldbar_mid','sprites/menu/shieldbar_mid.png');
		game.load.image('shieldbar_super_mid','sprites/menu/shieldbar_super_mid.png');
		game.load.image('menu_background','sprites/menu/menu_background.png');
		game.load.image('menu_infobox','sprites/menu/menu_infobox.png');
		game.load.image('menu_upgradesbox','sprites/menu/menu_upgradesbox.png');
		game.load.image('menu_levelbox','sprites/menu/menu_levelbox.png');
		game.load.image('menu_button','sprites/menu/menu_button.png');
		game.load.image('menu_pointer','sprites/menu/menu_pointer.png');

		game.load.audio('audio_menu_music', 'audio/music_menu.mp3');
		game.load.audio('audio_music', 'audio/music_ingame.mp3');
		game.load.audio('audio_credits', 'audio/music_credits.mp3');
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
	var NUM_DESTROYERS = 2;
	var NUM_POWERUPS = 10;
	var gameObjects; // contains all colliders in the scene
	var powerups; // contains all powerups in the scene
	var cursors;
	var fireButton, buttonW, buttonA, buttonD;

	var audioMusic;
	var audioMenuMusic;
	var audioLaserCounter = 0;
	var audioLaser = [];
	var audioMissileCounter = 0;
	var audioMissile = [];
	var audioExplosionCounter = 0;
	var audioExplosion = [];
	var emitterCounter = 0;
	var emitters = [];

	var menuKeyDown = false;
	var current_level; //the currently selected level

	//Hold the count of current destroyed enemies in a level
	var destroyedAsteroids, destroyedStingers, destroyedBreakers, destroyedDestroyers;

	//Instantiates the state of the game on startup
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

		audioMenuMusic = game.add.audio('audio_menu_music');
		audioMusic = game.add.audio('audio_music');
		audioCredits = game.add.audio('audio_credits');

		//we want to be able to play several instances of a sound at a time
		for(var i = 0; i < 20; i++) {
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
				audioLaserCounter = audioLaserCounter >= 19 ? 0 : audioLaserCounter+1;
				audioLaser[audioLaserCounter].play();
			});
		}
		for(var i = 0; i < NUM_BREAKERS; i++) {
			var temp = guid();
			gameObjects[temp] = new Breaker(game, temp, makeParticles);
			gameObjects[temp].laser.onFire.add(function() {
				audioMissileCounter = audioMissileCounter >= 19 ? 0 : audioMissileCounter+1;
				audioMissile[audioMissileCounter].play();
			});
		}
		var destroyers = new Array(); //temporary array to be held by each destroyer
		for(var i = 0; i < NUM_DESTROYERS; i++) {
			var temp = guid();
			gameObjects[temp] = new Destroyer(game, temp);
			
			//only the two middle cannons make sound
			gameObjects[temp].cannons[1].laser.onFire.add(function() {
				audioLaserCounter = audioLaserCounter >= 19 ? 0 : audioLaserCounter+1;
				audioLaser[audioLaserCounter].play();
			});
			gameObjects[temp].cannons[4].laser.onFire.add(function() {
				audioLaserCounter = audioLaserCounter >= 19 ? 0 : audioLaserCounter+1;
				audioLaser[audioLaserCounter].play();
			});
			destroyers[temp] = gameObjects[temp];
			gameObjects[temp].otherDestroyers = destroyers;
		}

		//create all powerups
		for(var i = 0; i < NUM_POWERUPS; i++) {
			var temp = guid();
			powerups[temp] = new Powerup(game, temp, 'powerup_weapon'); //this will be changed on use
		}

		player.laser.onFire.add(function() {
			player.laserSide = player.laserSide ? false : true;
			audioLaserCounter = audioLaserCounter >= 19 ? 0 : audioLaserCounter+1;
			audioLaser[audioLaserCounter].play();
		});

		//declared in menu.js
		createMenu(game);
		createHUD(game);
		createCredits(game);
		
		//declared in ingametext.js
		initIngameText(game);

		setState(STATES.MENU);
	}

	//The main update loop that is called every frame
	function update() {
		dt = (Date.now() - time) / 1000;
		time = Date.now();

		if(state == STATES.MENU) {
			//do nothing
		}
		else if(state == STATES.INGAME) {
			game.world.wrap(player.object, 10);
			game.world.setBounds(player.object.x - 960, player.object.y - 960, 1920, 1920);

			//scale healthbar and shieldbar to show damage taken
			healthbar_mid.scale.x = player.hp/player.hpMax * scale;
			if(player.shieldMax > 0) {
				shieldbar_mid.scale.x = Math.min(player.shield / 200, 1.0) * scale;
				shieldbar_super_mid.scale.x = Math.min(Math.max(player.shield - 200, 0.0) / 200, 1.0) * scale;
			}

			//create a parallax-like effect on background
			var xBase = player.object.x - game.world.width / 2;
			var yBase = player.object.y - game.world.height / 2;
			var radius = game.math.distance(xBase, yBase, 0, 0);
			background.x = xBase - 100*Math.atan(xBase*(radius == 0 ? 0 : Math.abs(xBase)/radius)/1000);
			background.y = yBase - 100*Math.atan(yBase*(radius == 0 ? 0 : Math.abs(yBase)/radius)/1000);

			//handle per-object computations
			for(var id in gameObjects) {
				if(gameObjects[id].object.alive) {

					//remove if out of bounds. Built in method was troublesome to use here.
					if(gameObjects[id].object.x < player.object.x - 960 || 
					   gameObjects[id].object.x > player.object.x + 960 ||
					   gameObjects[id].object.y < player.object.y - 960 || 
					   gameObjects[id].object.y > player.object.y + 960) {
						gameObjects[id].object.kill();
						continue;
					}

					if(gameObjects[id].shieldMax > 0.0) {
						gameObjects[id].regenerateShield(dt);
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
				else if(gameObjects[id] instanceof Destroyer) {
					gameObjects[id].removeCannons();
				}
			}

			//handle all powerups
			for(var id in powerups) {
				if(powerups[id].object.alive) {
					powerups[id].update(player);
				}
			}

			//Perform level-specific computations
			if(current_level == 1) {
				createIngameText(dt, "Asteroid", 5, destroyedAsteroids);

				if(Math.random() < 0.03) createObject(Asteroid, player.object.x, player.object.y);
				
				if(destroyedAsteroids >= 5 && player.hp > 0.0) {
					setState(STATES.VICTORY, true);
				}
			}
			if(current_level == 2) {
				createIngameText(dt, "Stinger", 6, destroyedStingers);

				if(Math.random() < 0.03) createObject(Asteroid, player.object.x, player.object.y);
				if(Math.random() < 0.005) createObject(Stinger, player.object.x, player.object.y);

				if(destroyedStingers >= 6 && player.hp > 0.0) {
					setState(STATES.VICTORY, true);
				}
			}
			if(current_level == 3) {
				createIngameText(dt, "Stinger", 10, destroyedStingers);

				if(Math.random() < 0.02) createObject(Asteroid, player.object.x, player.object.y);
				if(Math.random() < 0.01) createObject(Stinger, player.object.x, player.object.y);

				if(destroyedStingers >= 10 && player.hp > 0.0) {
					setState(STATES.VICTORY, true);
				}
			}
			if(current_level == 4) {
				createIngameText(dt, "Breaker", 3, destroyedBreakers);

				if(Math.random() < 0.02) createObject(Asteroid, player.object.x, player.object.y);
				if(Math.random() < 0.005) createObject(Stinger, player.object.x, player.object.y);
				if(Math.random() < 0.001) createObject(Breaker, player.object.x, player.object.y);

				if(destroyedBreakers >= 3 && player.hp > 0.0) {
					setState(STATES.VICTORY, true);
				}
			}
			if(current_level == 5) {
				createIngameText(dt, "Breaker", 8, destroyedBreakers);

				if(Math.random() < 0.01) createObject(Asteroid, player.object.x, player.object.y);
				if(Math.random() < 0.008) createObject(Stinger, player.object.x, player.object.y);
				if(Math.random() < 0.003) createObject(Breaker, player.object.x, player.object.y);

				if(destroyedBreakers >= 8 && player.hp > 0.0) {
					setState(STATES.VICTORY, true);
				}
			}
			if(current_level == 6) {
				createIngameText(dt, "Destroyer", 5, destroyedDestroyers);

				if(Math.random() < 0.01) createObject(Asteroid, player.object.x, player.object.y);
				if(Math.random() < 0.008) createObject(Stinger, player.object.x, player.object.y);
				if(Math.random() < 0.005) createObject(Breaker, player.object.x, player.object.y);
				if(Math.random() < 0.003) createObject(Destroyer, player.object.x, player.object.y);


				if(destroyedDestroyers >= 1 && player.hp > 0.0) {
					setState(STATES.VICTORY, true);
				}
			}

			//check for game over
			if(player.hp <= 0.0) {
				player.hp = 0.0;
				game.camera.unfollow();
				if(Math.random() < 0.1)
					makeParticles('explosion', game.camera.x+400*scale, game.camera.y+300*scale, 150, 300);
				deathTimer -= dt;
				if(deathTimer < 0.0) {
					setState(STATES.MENU);
				}
			}
			else {
				var angle = player.object.rotation;
				var amount = length(player.object.body.velocity) / 10;
				if(amount > 0) {
					makeParticles('explosion_mini', 
						player.object.x - Math.cos(angle)*12,
						player.object.y - Math.sin(angle)*12,
						1, amount
					);
					if(amount > 20) {
						makeParticles('explosion_mini', 
							player.object.x - Math.cos(angle)*10 + Math.sin(angle)*10,
							player.object.y - Math.sin(angle)*10 - Math.cos(angle)*10,
							1, amount / 20
						);
						makeParticles('explosion_mini', 
							player.object.x - Math.cos(angle)*10 - Math.sin(angle)*10,
							player.object.y - Math.sin(angle)*10 + Math.cos(angle)*10,
							1, amount / 20
						);
					}
				}

			}
		}
		else if(state == STATES.VICTORY) {
			createVictoryText(dt);
			victoryTimer -= dt;
			if(victoryTimer < 0.0) {
				setState(STATES.MENU, true);

				//Check if game complete
				if(level_unlocked > 6) {
					setState(STATES.CREDITS);
				}
			}
		}
		else if(state == STATES.CREDITS) {
			//do nothing
		}

		//input handling is always performed
		handleInput();
	}


	//Collision handling for bullets(lasers) and objects
	function bulletObjectCollision(o1, o2) {
		if(o2 instanceof Phaser.Bullet) {
			var intensity = 0;
			o2.kill();
			if(o2.key == 'laser_red') {
				makeParticles('particle_red', o2.x, o2.y);
				intensity = 10;
				gameObjects[o1.name].takeDamage(10);
			}
			if(o2.key == 'laser_green') {
				makeParticles('particle_green', o2.x, o2.y);
				intensity = 10;
				gameObjects[o1.name].takeDamage(10);
			}
			if(o2.key == 'missile') {
				makeParticles('explosion', o2.x, o2.y, 30, 150);
				intensity = 30;
				gameObjects[o1.name].takeDamage(30);
			}

			
			if(gameObjects[o1.name].hp <= 0) {
				o1.kill();
				addObjectCounter(o1);

				makeParticles('explosion', o1.x, o1.y, 150, 300);
				createPowerupChance(gameObjects[o1.name]);
			}
		}
		if(gameObjects[o1.name] instanceof Player) {
			game.camera.shake(0.0002*intensity, 500);
		}
	}

	//Collision handling for objects
	function objectObjectCollision(o1, o2) {
		var intensity = 0;
		while(gameObjects[o1.name].hp > 0 && gameObjects[o2.name].hp > 0) {
			//gameObjects[o1.name].hp -= 1;
			//gameObjects[o2.name].hp -= 1;
			gameObjects[o1.name].takeDamage(5);
			gameObjects[o2.name].takeDamage(5);

			intensity++;
		}
		if(gameObjects[o1.name] instanceof Player || gameObjects[o2.name] instanceof Player) {
			game.camera.shake(0.0002*intensity, 500);
		}
		if(gameObjects[o1.name].hp <= 0) {
			o1.kill();
			addObjectCounter(o1);

			makeParticles('explosion', o1.x, o1.y, 150, 300);
			createPowerupChance(gameObjects[o1.name]);
		}
		if(gameObjects[o2.name].hp <= 0) {
			o2.kill();
			addObjectCounter(o2);

			makeParticles('explosion', o2.x, o2.y, 150, 300);
			createPowerupChance(gameObjects[o2.name]);
		}
	}

	//Adds a counter for the object that was destroyed. Counter is used to determine mission objectives.
	function addObjectCounter(o) {
		// We don't count objects outside of view
		if(gameObjects[o.name].object.position.x < player.object.position.x - 400 * scale ||
		   gameObjects[o.name].object.position.x > player.object.position.x + 400 * scale ||
		   gameObjects[o.name].object.position.y < player.object.position.y - 300 * scale ||
		   gameObjects[o.name].object.position.y > player.object.position.y + 300 * scale) {
			return;
		}

		if(gameObjects[o.name] instanceof Asteroid) {
			destroyedAsteroids++;
		}
		if(gameObjects[o.name] instanceof Stinger) {
			destroyedStingers++;
		}
		if(gameObjects[o.name] instanceof Breaker) {
			destroyedBreakers++;
		}
		if(gameObjects[o.name] instanceof Destroyer) {
			destroyedDestroyers++;
			gameObjects[o.name].removeCannons(); // quick fix to prevent a mission complete bug
		}
	}

	//Creates a temporary particle system at position (x,y)
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

	//Create a new object of the specified type if there is an empty slot in the corresponding object pool
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

	//Called to evaluate chance of a powerup spawning upon object death
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
	//Spawns a powerup of the specified type at position (x,y)
	function createPowerup(type, x, y) {
		for(var o in powerups) {
			if(!powerups[o].object.alive) {
				powerups[o].spawn(game, type, x, y);
				break;
			}
		}
	}

	// All game input is handled here. Separates menu- and ingame input handling in the same function.
	function handleInput() {
		if(state == STATES.MENU) {
			if(!menuKeyDown) {
				if (cursors.down.isDown || buttonS.isDown) {
					menuKeyDown = true;
					audioLaserCounter = audioLaserCounter >= 9 ? 0 : audioLaserCounter+1;
					audioLaser[audioLaserCounter].play();
					menu_pointer_pos = menu_pointer_pos < level_unlocked ? menu_pointer_pos + 1 : 1;
				}
				if (cursors.up.isDown || buttonW.isDown) {
					menuKeyDown = true;
					audioLaserCounter = audioLaserCounter >= 9 ? 0 : audioLaserCounter+1;
					audioLaser[audioLaserCounter].play();
					menu_pointer_pos = menu_pointer_pos > 1 ? menu_pointer_pos - 1 : level_unlocked;
				}

				if(fireButton.isDown) {
					current_level = menu_pointer_pos;
					setState(STATES.INGAME);
				}

				menu_pointer.position.x = 60 * scale;
				menu_pointer.position.y =  (65 + 70 * menu_pointer_pos) * scale;
			}
			else if(!cursors.down.isDown && !buttonS.isDown && !cursors.up.isDown && !buttonW.isDown && 
					!fireButton.isDown) {
				menuKeyDown = false;
			}
		}
		else if(state == STATES.INGAME) {

			if (cursors.up.isDown || buttonW.isDown) {
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
					player.laser.trackOffset.x = Math.cos(angle)*20+Math.sin(angle)*10;
					player.laser.trackOffset.y = Math.sin(angle)*20-Math.cos(angle)*10;
				}
				else {
					player.laser.trackOffset.x = Math.cos(angle)*20-Math.sin(angle)*10;
					player.laser.trackOffset.y = Math.sin(angle)*20+Math.cos(angle)*10;
				}
				player.laser.fire();
			}
		}
		else if(state == STATES.CREDITS) {
			if(!menuKeyDown && fireButton.isDown) {
				resetStats();
				setState(STATES.MENU);
			}
			else if(!cursors.down.isDown && !buttonS.isDown && !cursors.up.isDown && !buttonW.isDown && 
					!fireButton.isDown) {
				menuKeyDown = false;
			}
		}
	}

	//Changes the current game state. The win variable tells if player just won a level.
	function setState(val, win = false) {
		resetIngameText();

		if(val == STATES.MENU) {
			menuKeyDown = true; // to prevent accidental instant restart
			audioMusic.stop();
			audioCredits.stop();
			audioMenuMusic.play('', 0, 0.2, true, true);
			game.world.setBounds(0, 0, 1920, 1920);
			game.camera.reset();
			background.x = -960;
			background.y = -960;
			
			if(win) {
				weapon_level = player.weaponLevel;
				engine_level = player.engineLevel;
				shield_level = player.shieldLevel;
				level_unlocked = level_unlocked < current_level + 1 ? current_level + 1 : level_unlocked;
			}

			killHUD();
			killCredits();
			resetMenu();

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
			audioMenuMusic.stop();
			audioCredits.stop();
			audioMusic.play('', 0, 0.2, true, true);
			deathTimer = 0.75;
			victoryTimer = 1.0;
			player.spawn(game, 400*scale, 300*scale);
			game.world.setBounds(player.object.x - 960, player.object.y - 960, 1920, 1920);
			game.camera.follow(player.object, Phaser.Camera.FOLLOW_LOCKON, 0.4, 0.4);

			destroyedAsteroids = 0;
			destroyedStingers = 0;
			destroyedBreakers = 0;
			destroyedDestroyers = 0;

			killMenu();
			killCredits();
			resetHUD();
		}

		if(val == STATES.CREDITS) {
			audioMenuMusic.stop();
			audioMusic.stop();
			audioCredits.play('', 0, 0.2, true, true);

			killMenu();
			killHUD();
			resetCredits();
		}

		state = val;
	}

	function render() {
		//game.debug.cameraInfo(game.camera, 32, 32);
		//game.debug.spriteCoords(player.object, 32, 500);
	}
}
