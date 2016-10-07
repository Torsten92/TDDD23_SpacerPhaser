var ingameText;
var interpolateTimer = 0;
var ingameTextFontSize;
var ingameTextPosX, ingameTextPosY;

var ingameTextCounter;
var ingametTextVictory;

function initIngameText(game) {
	ingameText = game.add.text(400, 125, '', { font: "8px Arial", fill: "#ff0000" });
	ingameText.anchor.set(0.5);
	ingameText.fixedToCamera = true;
	ingameTextFontSize = 8;
	ingameTextPosX = 400;
	ingameTextPosY = 125;

	ingameTextCounter = game.add.text(785, 50, '', { font: "14px Arial", fill: "#ff0000" });
	ingameTextCounter.anchor.set(1.0);
	ingameTextCounter.fixedToCamera = true;

	ingameTextVictory = game.add.text(400, 125, '', { font: "8px Arial", fill: "#ff0000" });
	ingameTextVictory.anchor.set(0.5);
	ingameTextVictory.fixedToCamera = true;
}

function resetIngameText() {
	ingameTextFontSize = 8;
	ingameTextPosX = 400;
	ingameTextPosY = 125;
	interpolateTimer = 0.0;
	ingameText.anchor.set(0.5);
	ingameText.text = "";
	ingameTextCounter.text = "";
}

function createIngameText(dt, type, amount, destroyed) {
	ingameText.text = "Destroy " + amount + " " + type + "s!";
	interpolateIngameText(dt);

	if(interpolateTimer > 2.0) {
		ingameTextCounter.text = destroyed + " / " + amount;
	}
}

function interpolateIngameText(dt) {
	if(interpolateTimer <= 0.3) {
		ingameTextFontSize = 8 + interpolateTimer * 100;
		ingameText.fontSize = ingameTextFontSize;
	}

	//Interpolate from x = 400 to 785, and y = 125 to 30
	if(interpolateTimer > 1.0 && interpolateTimer <= 1.5) {
		ingameTextFontSize = 38 - 2 * 24 * (interpolateTimer - 1.0); // font size from 38 to 14
		ingameTextPosX = 400 + 2 * 385 * (interpolateTimer - 1.0);
		ingameTextPosY = 125 - 2 * 95 * (interpolateTimer - 1.0);
		ingameText.anchor.set(0.5 + (interpolateTimer - 1.0));
	}

	ingameText.fontSize = ingameTextFontSize;
	ingameTextCounter.fontSize = ingameTextFontSize;
	ingameText.cameraOffset.x = ingameTextPosX * scale;
	ingameText.cameraOffset.y = ingameTextPosY * scale;
	interpolateTimer += dt;
}

function createVictoryText() {

}