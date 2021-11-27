import board from "./board.js"
import turn_manager from "./turn_manager.js"
import PlayerCharacter from "./player.js"
import BasicMonster from "./monster.js"

// game.js
//
//     a "scene" object is created, basically an object that overrides certain
//     methods like preload, create, and update. These are the main functions
//     that the Phaser game engine utilizes to control the game. All the setup
//     and game code goes in these functions!
//
//     update is called 1 time every 60 seconds. Because of this, the engine is
//     biased toward Real Time games and you have to put in your own checks for
//     implementing a turn-based system.
//
//     For a roguelike, basically we are implementing update() to just call the
//     turn_manager object every frame. The pseudocode looks like this:
//         1. If all game objects have taken their turn, reset all turns.
//         2. Call the turn() method of whatever the "current" game object is.
//

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
        turn_manager.add_entity(new BasicMonster(20, 20));
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
    zoom: 2,
    scene: play_game_scene,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 }
        }
    },
    /*
     * autoCenter: Phaser.Scale.CENTER_BOTH,
     * scale: {
     * mode: Phaser.Scale.FIT
     * },
     */
}


console.log("Game starting...");
console.log("window.innerWidth x window.innerHeight = " + 
    window.innerWidth + " x " + window.innerHeight);
console.log("USING Device Pixel Ratio also = window.innerWidth x window.innerHeight = " + 
    (window.innerWidth * window.devicePixelRatio) + " x " + 
    (window.innerHeight * window.devicePixelRatio) );

post("Game starting... POST");


const game = new Phaser.Game(game_configuration);



export var debug = true;

export function post(m) {

    if( debug === true ) {
        console.log(m);
    }
}
