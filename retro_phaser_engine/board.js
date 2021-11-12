import level from "./level_1.js"

// The board object will be responsible for:
//   1. Rendering the board itself
//   2. Moving sprites around the board

let board = {

    tile_index: {
        floor: 0,
        wall: 554,
    },
        
    tile_size: 16,

    initialize: function (scene) {

        this.scene = scene;
        this.level = level;

        let converted_level = level.map(r => r.map(t => t == 1 ? 
            this.tile_index.wall : this.tile_index.floor));

        // Now to construct the "tilemap", which is a data structure that holds
        // several things: the 2d converted array, a link to the spritesheet,
        // the configuration data for the sprites and tiles found in that
        // spritesheet (pixel width and height of each glyph, and the pixel
        // spacing between glyphs).
        const config = {
            data: converted_level,
            tileWidth: this.tile_size,
            tileHeight: this.tile_size,
        }
        
        const tilemap = scene.make.tilemap(config);

        // Next attach the tilesheet to this tilemap, and keep a reference to
        // the sheet itself (it will be used later when creating layers for this
        // tilemap). 
        const tilesheet = tilemap.addTilesetImage('spritesheet', 'spritesheet', 
            this.tile_size, this.tile_size, 0, 1); 

        // Last step: each tilemap may contain several "layers", which are
        // like plastic sheets of animation layers. Here we just define our
        // single tilemap to have a single layer, and that one is static (it
        // will be unchanging).
        this.tilemap_layer = tilemap.createDynamicLayer(0, tilesheet, 0, 0);
    },

    is_walkable_tile: function (c, r) {
        // return true if this tile == 0
        // return false if this tile == 1
        return level[r][c] !== 1;
    },

    initialize_entity_graphics: function(entity) {
        
        // get the pixel coordinates where tile is on the actual screen
        let x = this.tilemap_layer.tileToWorldX(entity.x);
        let y = this.tilemap_layer.tileToWorldY(entity.y);

        // call the Phaser screen's "add.sprite()" method, sending it the x,y
        // actual pixel coordinates, the name of the spritesheet, and the index
        // that the sprite can be found at on that big image
        entity.sprite_handle = this.scene.add.sprite(x, y, 'spritesheet', entity.sprite_index);

        // not sure what this does
        entity.sprite_handle.setOrigin(0);
    },

    move_entity_to: function(entity, x, y) {

        entity.tweening = true;
         
        this.scene.tweens.add( {
            targets: entity.sprite_handle,
            onComplete: () => {
                entity.tweening = false;
                entity.x = x;
                entity.y = y;
            },
            x: this.tilemap_layer.tileToWorldX(x),
            y: this.tilemap_layer.tileToWorldY(y),
            ease: "Power2",
            duration: 200
        })
    }
}

export default board 
