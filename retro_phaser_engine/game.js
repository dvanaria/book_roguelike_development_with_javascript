import board from "./board.js"
import turn_manager from "./turn_manager.js"
import PlayerCharacter from "./player.js"
import BasicMonster from "./monster.js"

const play_game_scene = {

    preload: function () {
        
        // Load tiles and sprites (glyphs for both of these are all contained in
        // the "spritesheet" .png master image). The "handle" to access this
        // loaded asset, confusingly, becomes the supplied string argument 
        // "spritesheet".
        this.load.spritesheet('spritesheet', 'assets/roguelike_spritesheet.png', 
            { 
                frameWidth: 16, 
                frameHeight: 16, 
                spacing: 1 
            });
    },

    create: function () {

        board.initialize(this);
        board.player = new PlayerCharacter(15, 15);
        turn_manager.add_entity(board.player);
        turn_manager.add_entity(new BasicMonster(70, 8));
        turn_manager.add_entity(new BasicMonster(34, 5));
        turn_manager.add_entity(new BasicMonster(44, 18));
    },

    update: function () {

        // This is the main game loop. It will be called 60 times per second.

        // step one: if the previous turn is over, reset all entities
        // action/movement points to 0
        if (turn_manager.all_turns_are_over()) {
            turn_manager.refresh_all_turns();
        }

        // step two: have the turn manager update every entity's turn() until
        // they have each expended all their action points
        turn_manager.take_current_entity_turn();
    }
}

const game_configuration = {

    type: Phaser.AUTO,
    width: 80 * 16,
    height: 50 * 16,
    backgroundColor: "#000",
    parent: "game_div",  // the HTML element to hold the rendered output
    pixelArt: true,
    zoom: 1,
    scene: play_game_scene,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 }
        }
    }
}

const game = new Phaser.Game(game_configuration);
