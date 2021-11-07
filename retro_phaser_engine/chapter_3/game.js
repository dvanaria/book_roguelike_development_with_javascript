import board from "./board.js"
import turn_manager from "./turn_manager.js"
import PlayerCharacter from "./player.js"

const play_game_scene = {

    preload: function () {
        
        const tile_size = 16;

        // Load tiles and sprites (glyphs for both of these are all contained in
        // the "spritesheet" .png master image). The "handle" to access this
        // loaded asset, confusingly, becomes the supplied string argument 
        // "spritesheet".
        this.load.spritesheet('spritesheet', 'assets/roguelike_spritesheet.png', 
            { frameWidth: tile_size, frameHeight: tile_size, spacing: 1 });

    },

    create: function () {

        board.initialize(this);
        let player = new PlayerCharacter(15, 15);
        turn_manager.addEntity(player)
    },

    update: function () {

        // This is the main game loop. It will be called 60 times per second.

        // step one: if the previous turn is over, reset all entities
        // action/movement points to 0
        if (turn_manager.over()) {
            turn_manager.refresh();
        }

        // step two: have the turn manager update every entity's turn() until
        // they have each expended all their action points
        turn_manager.turn();
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
