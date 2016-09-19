var scale = 1.0;

function resize() {
	game.scale.setGameSize(800 * scale, 600 * scale);
	hud.width = 900 * scale;
	hud.height = 200 * scale;
	hud.cameraOffset.y = 536 * scale;
	
	healthbar_back.width = 300 * scale;
	healthbar_back.height = 16 * scale;
	healthbar_back.cameraOffset.y = 552 * scale;
	
	healthbar_mid.width = 300 * scale;
	healthbar_mid.height = 16 * scale;
	healthbar_mid.cameraOffset.y = 552 * scale;
	
	healthbar_front.width = 300 * scale;
	healthbar_front.height = 16 * scale;
	healthbar_front.cameraOffset.y = 552 * scale;

	weapon_text.cameraOffset.x = 500 * scale;
	weapon_text.cameraOffset.y = 542 * scale;
	weapon_text.fontSize = 12 * scale;

	engine_text.cameraOffset.x = 500 * scale;
	engine_text.cameraOffset.y = 558 * scale;
	engine_text.fontSize = 12 * scale;

	shield_text.cameraOffset.x = 500 * scale;
	shield_text.cameraOffset.y = 576 * scale;
	shield_text.fontSize = 12 * scale;
}