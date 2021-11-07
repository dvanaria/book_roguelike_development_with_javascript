import level from "./level_1.js"

const play_game_scene = {

    /* Phaser.Loader. LoaderPlugin
     *
     * The Loader handles loading all external content such as Images, Sounds, 
     * Texture Atlases and data files. You typically interact with it via 
     * this.load in your Scene. Scenes can have a preload method, which is 
     * always called before the Scenes create method, allowing you to preload 
     * assets that the Scene may need.
     *
     * If you call any this.load methods from outside of Scene.preload then you
     * need to start the Loader going yourself by calling Loader.start(). It's
     * only automatically started during the Scene preload.
     *
     */

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
    
        const tile_size = 16;

        // Key to mapping the logical/useful 2D array values to the actual
        // index values used in the spritesheet:
        const wall = 554;
        const floor = 0;

        let converted_level = level.map(r => r.map(t => t == 1 ? wall : floor));

        // Now to construct the "tilemap", which is a data structure that holds
        // several things: the 2d converted array, a link to the spritesheet,
        // the configuration data for the sprites and tiles found in that
        // spritesheet (pixel width and height of each glyph, and the pixel
        // spacing between glyphs).
        const config = {
            data: converted_level,
            tileWidth: tile_size,
            tileHeight: tile_size,
        }
        const tilemap = this.make.tilemap(config);

        // Next attach the tilesheet to this tilemap, and keep a reference to
        // the sheet itself (it will be used later when creating layers for this
        // tilemap). 
        const tilesheet = tilemap.addTilesetImage('spritesheet', 'spritesheet', 
            tile_size, tile_size, 0, 1); 

        // Last step: each tilemap may contain several "layers", which are
        // like plastic sheets of animation layers. Here we just define our
        // single tilemap to have a single layer, and that one is static (it
        // will be unchanging).
        tilemap.createStaticLayer(0, tilesheet, 0, 0);

    },

    update: function () {

    }

}

const game_configuration = {
    
    type: Phaser.AUTO,
    width: 80 * 16,
    height: 50 * 16,
    backgroundColor: "#000",
    parent: "game",
    pixelArt: true,
    zoom: 1,
    scene: play_game_scene,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 }
        }
    }
};

const game = new Phaser.Game(game_configuration);
