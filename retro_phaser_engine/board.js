import level from "./level_1.js"

let board = {

    tile_index: {
        floor: 0,
        wall: 554,
    },

    initialize: function (scene) {

        this.scene = scene;

        const tile_size = 16;

        scene.converted_level = level.map(r => 
            r.map(t => t == 1 ? this.tile_index.wall : this.tile_index.floor));

        // Now to construct the "tilemap", which is a data structure that holds
        // several things: the 2d converted array, a link to the spritesheet,
        // the configuration data for the sprites and tiles found in that
        // spritesheet (pixel width and height of each glyph, and the pixel
        // spacing between glyphs).
        const config = {
            data: scene.converted_level,
            tileWidth: tile_size,
            tileHeight: tile_size,
        }
        this.tilemap = scene.make.tilemap(config);

        // Next attach the tilesheet to this tilemap, and keep a reference to
        // the sheet itself (it will be used later when creating layers for this
        // tilemap). 
        this.tilesheet = this.tilemap.addTilesetImage('spritesheet', 'spritesheet', 
            tile_size, tile_size, 0, 1); 

        // Last step: each tilemap may contain several "layers", which are
        // like plastic sheets of animation layers. Here we just define our
        // single tilemap to have a single layer, and that one is static (it
        // will be unchanging).
        this.tilemap.createStaticLayer(0, this.tilesheet, 0, 0);
    }
}

export default board 
