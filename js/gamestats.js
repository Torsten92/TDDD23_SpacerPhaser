//Standard values are: 1, 0, 0, 0.

var level_unlocked = 1; // current unlocked level
var weapon_level = 0; // current powerup level of weapons
var engine_level = 0; // current powerup level of engines
var shield_level = 0; // current powerup level of shields

function resetStats() {
	level_unlocked = 1;
	weapon_level = 0;
	engine_level = 0;
	shield_level = 0;

	lockLevelsMenu();
}