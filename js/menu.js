
//menu objects that is resized by the function defined in resize.js
var hud, healthbar_back, healthbar_mid, healthbar_front, shieldbar_mid, shieldbar_super_mid, shieldbar_front, 
	weapon_text, engine_text, shield_text, menu_background, menu_infobox, menu_upgradesbox, menu_levelbox, 
	menu_button_1, menu_button_2, menu_button_3, menu_button_4, menu_button_5, menu_button_6,
	button_1_text, button_2_text, button_3_text, button_4_text, button_5_text, button_6_text,
	pu_weapon_icon, pu_engine_icon, pu_shield_icon, puweapon_text1, pu_engine_text1, pu_shield_text1,
	puweapon_text2, pu_engine_text2, pu_shield_text2;

//menu pointer is handled a bit different, but pretty much the same with resize and stuff
var menu_pointer, menu_pointer_pos;


//Credits stuff
var creditsTextHeader, creditsText;


// --- Main menu ---

function createMenu(game) {
	menu_background = game.add.sprite(0,0,'menu_background');
	menu_levelbox = game.add.sprite(40,40,'menu_levelbox');
	menu_infobox = game.add.sprite(400, 40,'menu_infobox');
	menu_upgradesbox = game.add.sprite(400, 320,'menu_upgradesbox');

	menu_button_1 = game.add.sprite(50, 110, 'menu_button');
	menu_button_2 = game.add.sprite(70, 180, 'menu_button');
	menu_button_3 = game.add.sprite(70, 250, 'menu_button');
	menu_button_4 = game.add.sprite(70, 320, 'menu_button');
	menu_button_5 = game.add.sprite(70, 390, 'menu_button');
	menu_button_6 = game.add.sprite(70, 460, 'menu_button');

	button_1_text = game.add.text(125, 125, 'Level 1', { font: "24px Arial", fill: "#000000" });
	button_2_text = game.add.text(125, 195, 'Level 2', { font: "24px Arial", fill: "#000000" });
	button_3_text = game.add.text(125, 265, 'Level 3', { font: "24px Arial", fill: "#000000" });
	button_4_text = game.add.text(125, 335, 'Level 4', { font: "24px Arial", fill: "#000000" });
	button_5_text = game.add.text(125, 405, 'Level 5', { font: "24px Arial", fill: "#000000" });
	button_6_text = game.add.text(125, 475, 'Level 6', { font: "24px Arial", fill: "#000000" });

	lockLevelsMenu();
	menu_pointer = game.add.sprite(60, 65 + 70 * menu_pointer_pos,'menu_pointer');

	puweapon_text1 = game.add.text(440, 390, 'Weapons:', { font: "14px Arial", fill: "#000000" });
	puengine_text1 = game.add.text(440, 420, 'Engines:', { font: "14px Arial", fill: "#000000" });
	pushield_text1 = game.add.text(440, 450, 'Shields:', { font: "14px Arial", fill: "#000000" });

	pu_weapon_icon = game.add.sprite(510, 390, 'powerup_weapon');
	pu_engine_icon = game.add.sprite(510, 420, 'powerup_engine');
	pu_shield_icon = game.add.sprite(510, 450, 'powerup_shield');

	puweapon_text2 = game.add.text(530, 390, 'x 0', { font: "14px Arial", fill: "#000000" });
	puengine_text2 = game.add.text(530, 420, 'x 0', { font: "14px Arial", fill: "#000000" });
	pushield_text2 = game.add.text(530, 450, 'x 0', { font: "14px Arial", fill: "#000000" });

}

function lockLevelsMenu() {
	// locked levels are transparent
	menu_button_2.alpha = 0.2;
	menu_button_3.alpha = 0.2;
	menu_button_4.alpha = 0.2;
	menu_button_5.alpha = 0.2;
	menu_button_6.alpha = 0.2;
	button_2_text.alpha = 0.2;
	button_3_text.alpha = 0.2;
	button_4_text.alpha = 0.2;
	button_5_text.alpha = 0.2;
	button_6_text.alpha = 0.2;

	menu_pointer_pos = 1;
}

function killMenu() {
	menu_background.kill();
	menu_levelbox.kill();
	menu_infobox.kill();
	menu_upgradesbox.kill();

	menu_button_1.kill();
	menu_button_2.kill();
	menu_button_3.kill();
	menu_button_4.kill();
	menu_button_5.kill();
	menu_button_6.kill();

	button_1_text.text = "";
	button_2_text.text = "";
	button_3_text.text = "";
	button_4_text.text = "";
	button_5_text.text = "";
	button_6_text.text = "";

	menu_pointer.kill();

	puweapon_text1.text = "";
	puweapon_text2.text = "";
	puengine_text1.text = "";
	puengine_text2.text = "";
	pushield_text1.text = "";
	pushield_text2.text = "";

	pu_weapon_icon.kill();
	pu_engine_icon.kill();
	pu_shield_icon.kill();
}

function resetMenu() {
	menu_background.reset(0, 0);
	menu_levelbox.reset(40*scale, 40*scale);
	menu_infobox.reset(400*scale, 40*scale);
	menu_upgradesbox.reset(400*scale, 320*scale);

	menu_button_1.reset(70*scale, 110*scale);
	menu_button_2.reset(70*scale, 180*scale);
	menu_button_3.reset(70*scale, 250*scale);
	menu_button_4.reset(70*scale, 320*scale);
	menu_button_5.reset(70*scale, 390*scale);
	menu_button_6.reset(70*scale, 460*scale);

	button_1_text.text = "Level 1";
	button_2_text.text = "Level 2";
	button_3_text.text = "Level 3";
	button_4_text.text = "Level 4";
	button_5_text.text = "Level 5";
	button_6_text.text = "Level 6";

	menu_pointer.reset(60, 65 + 70 * menu_pointer_pos);

	puweapon_text1.text = "Weapons:";
	puweapon_text2.text = "x " + weapon_level;
	puengine_text1.text = "Engines:";
	puengine_text2.text = "x " + engine_level;
	pushield_text1.text = "Shields:";
	pushield_text2.text = "x " + shield_level;

	pu_weapon_icon.reset(510*scale, 390*scale);
	pu_engine_icon.reset(510*scale, 420*scale);
	pu_shield_icon.reset(510*scale, 450*scale);

	if(level_unlocked >= 2) {
		menu_button_2.alpha = 1.0;
		button_2_text.alpha = 1.0;
	}
	if(level_unlocked >= 3) {
		menu_button_3.alpha = 1.0;
		button_3_text.alpha = 1.0;
	}
	if(level_unlocked >= 4) {
		menu_button_4.alpha = 1.0;
		button_4_text.alpha = 1.0;
	}
	if(level_unlocked >= 5) {
		menu_button_5.alpha = 1.0;
		button_5_text.alpha = 1.0;
	}
	if(level_unlocked >= 6) {
		menu_button_6.alpha = 1.0;
		button_6_text.alpha = 1.0;
	}
}


// --- HUD ---

function createHUD(game) {
	hud = game.add.sprite(-50, 536, 'hud');
	healthbar_back = game.add.sprite(100, 552, 'healthbar_back');
	healthbar_mid = game.add.sprite(100, 552, 'healthbar_mid');
	healthbar_front = game.add.sprite(100, 552, 'healthbar_front');
	shieldbar_mid = game.add.sprite(100, 572, 'shieldbar_mid');
	shieldbar_super_mid = game.add.sprite(100, 572, 'shieldbar_super_mid');
	shieldbar_front = game.add.sprite(100, 572, 'healthbar_front');

	weapon_text = game.add.text(500, 542, '', { font: "15px Arial", fill: "#ff0000" });
	engine_text = game.add.text(500, 558, '', { font: "15px Arial", fill: "#ffff00" });
	shield_text = game.add.text(500, 576, '', { font: "15px Arial", fill: "#0088ff" });
	
	hud.fixedToCamera = true;
	healthbar_back.fixedToCamera = true;
	healthbar_mid.fixedToCamera = true;
	healthbar_front.fixedToCamera = true;
	shieldbar_mid.fixedToCamera = true;
	shieldbar_super_mid.fixedToCamera = true;
	shieldbar_front.fixedToCamera = true;
	weapon_text.fixedToCamera = true;
	engine_text.fixedToCamera = true;
	shield_text.fixedToCamera = true;
}

function killHUD() {
	hud.kill();
	healthbar_back.kill();
	healthbar_mid.kill();
	healthbar_front.kill();
	shieldbar_mid.kill();
	shieldbar_super_mid.kill();
	shieldbar_front.kill();

	weapon_text.text = "";
	engine_text.text = "";
	shield_text.text = "";
}

function resetHUD() {
	hud.reset(-50*scale, 536*scale);
	healthbar_back.reset(100*scale, 552*scale);
	healthbar_mid.reset(100*scale, 552*scale);
	healthbar_front.reset(100*scale, 552*scale);

	if(shield_level > 0) {
		shieldbar_mid.reset(100*scale, 572*scale);
		shieldbar_super_mid.reset(100*scale, 572*scale);
		shieldbar_front.reset(100*scale, 572*scale);
	}
}


// Credits

function createCredits() {
	creditsTextHeader = game.add.text(400, 100, '', { font: "36px Arial", fill: "#ff0000" });
	creditsTextHeader.anchor.set(0.5);
	creditsText = [];
	creditsText[0] = game.add.text(400, 150, '', { font: "20px Arial", fill: "#ff0000" });
	creditsText[1] = game.add.text(400, 250, '', { font: "20px Arial", fill: "#ff0000" });
	creditsText[2] = game.add.text(400, 275, '', { font: "20px Arial", fill: "#ff0000" });
	creditsText[3] = game.add.text(400, 350, '', { font: "20px Arial", fill: "#ff0000" });
	creditsText[0].anchor.set(0.5);
	creditsText[1].anchor.set(0.5);
	creditsText[2].anchor.set(0.5);
	creditsText[3].anchor.set(0.5);
}

function killCredits() {
	menu_background.kill();
	creditsTextHeader.text = "";
	creditsText[0].text = "";
	creditsText[1].text = "";
	creditsText[2].text = "";
	creditsText[3].text = "";
}

function resetCredits() {
	menu_background.reset(0, 0);
	creditsTextHeader.text = "Congratulations hero!";
	creditsText[0].text = "You have saved the galaxy from the evil empire!";
	creditsText[1].text = "This game was developed by Torsten Gustafsson";
	creditsText[2].text = "for the course TDDD23 at Linköping University";
	creditsText[3].text = "Thank you for playing Spacer Phaser! Press space to restart the game.";
}