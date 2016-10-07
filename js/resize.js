var scale = 1.0; // the scale variable is set by a slider in the index.html file

function resize() {
	game.scale.setGameSize(800 * scale, 600 * scale);

	
	//HUD stuff

	scaleSprite(hud, -50, 536, 900, 200);
	hud.cameraOffset.y = 536 * scale;
	
	scaleSprite(healthbar_back, 100, 552, 300, 16);
	healthbar_back.cameraOffset.y = 552 * scale;
	
	scaleSprite(healthbar_mid, 100, 552, 300, 16);
	healthbar_mid.cameraOffset.y = 552 * scale;
	
	scaleSprite(healthbar_front, 100, 552, 300, 16);
	healthbar_front.cameraOffset.y = 552 * scale;

	scaleSprite(shieldbar_mid, 100, 572, 300, 16);
	shieldbar_mid.cameraOffset.y = 572 * scale;
	
	scaleSprite(shieldbar_super_mid, 100, 572, 300, 16);
	shieldbar_super_mid.cameraOffset.y = 572 * scale;

	scaleSprite(shieldbar_front, 100, 572, 300, 16);
	shieldbar_front.cameraOffset.y = 572 * scale;

	scaleText(weapon_text, 500, 542, 12, true);
	scaleText(engine_text, 500, 558, 12, true);
	scaleText(shield_text, 500, 576, 12, true);

	scaleText(ingameText, ingameTextPosX, ingameTextPosY, ingameTextFontSize, true);
	scaleText(ingameTextCounter, 785, 50, ingameTextFontSize, true);
	scaleText(ingameTextVictory, 400, 125, ingameTextFontSize, true);


	//Menu stuff

	scaleSprite(menu_background, 0, 0, 800, 600);
	scaleSprite(menu_levelbox, 40, 40, 260, 520);
	scaleSprite(menu_infobox, 400, 40, 350, 200);
	scaleSprite(menu_upgradesbox, 400, 320, 350, 200);

	scaleSprite(menu_pointer, 60, 65 + 70 * menu_pointer_pos, 10, 10);

	scaleSprite(menu_button_1, 70, 110, 200, 60);
	scaleSprite(menu_button_2, 70, 180, 200, 60);
	scaleSprite(menu_button_3, 70, 250, 200, 60);
	scaleSprite(menu_button_4, 70, 320, 200, 60);
	scaleSprite(menu_button_5, 70, 390, 200, 60);
	scaleSprite(menu_button_6, 70, 460, 200, 60);

	scaleText(button_1_text, 125, 125, 24);
	scaleText(button_2_text, 125, 195, 24);
	scaleText(button_3_text, 125, 265, 24);
	scaleText(button_4_text, 125, 335, 24);
	scaleText(button_5_text, 125, 405, 24);
	scaleText(button_6_text, 125, 475, 24);

	scaleSprite(pu_weapon_icon, 510, 390, 16, 16);
	scaleSprite(pu_engine_icon, 510, 420, 16, 16);
	scaleSprite(pu_shield_icon, 510, 450, 16, 16);

	scaleText(puweapon_text1, 440, 390, 14);
	scaleText(puweapon_text2, 530, 390, 14);
	scaleText(puengine_text1, 440, 420, 14);
	scaleText(puengine_text2, 530, 420, 14);
	scaleText(pushield_text1, 440, 450, 14);
	scaleText(pushield_text2, 530, 450, 14);

}

function scaleSprite(sprite, x, y, width, height) {
	sprite.x = x * scale;
	sprite.y = y * scale;
	sprite.width = width * scale; 
	sprite.height = height * scale; 
}

function scaleText(text, x, y, size, fixedtocamera = false) {
	if(fixedtocamera) {
		text.cameraOffset.x = x * scale;
		text.cameraOffset.y = y * scale;
	}
	else {
		text.x = x * scale;
		text.y = y * scale;
	}
	text.fontSize = size * scale;
}