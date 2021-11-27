import level from "./level_1.js"
import turn_manager from "./turn_manager.js"

// The board object will be responsible for:
//   1. Rendering the board itself
//   2. Moving sprites around the board
//
// Some definitions:
//
//     "sprite" and "tile" both refer to the glyphs found in the master
//     spritesheet. Tiles are static and Sprites are dynamic, in the game logic,
//     but really they both just refer to glyphs.
//
//     "tilemap" is a complex container that holds many things: a link to the
//     master spritesheet, the tile geometry, a 2d array of the gameboard.
//
//     Externally, the board object has "tilemap_layer", since each tilemap can
//     have several layers, and its the layer that we want to work with.
//
// The 'board' object:
//
//     Properties:
//
//         tile_index (an object that converts strings like 'wall' into a real
//                     index where the tile/sprite can be found in the master 
//                     spritesheet.)
//
//         tile_size  (actual pixel size of each tile/sprite)
//
//         scene      (a link to the game's main scene object - this particular
//                     game has only one scene - just the active game itself).
//
//         level      (a big 2d array that just holds two values: 0 and 1, for
//                     open space and walls)
//
//         tilemap_layer   (the single layer used in this game, from a tilemap
//                          that holds the data 
//
//     Methods:
//
//         initialize(scene)   
//         initialize_entity_graphics(entity)
//         move_entity_to(entity, x, y) 
//         is_walkable_location(x, y) 
//         entity_at_location(x,y) 
//
       

let board = {

    // where are certain tiles on the master spritesheet?
    tile_index: {
        floor: 0,
        wall: 554,
    },
       
    // how big are the tiles on the master spritesheet?
    tile_size: 16,

    initialize: function (scene) {

        this.scene = scene;
        this.level = level;

        // change 1s and 0s to actual tile indexes
        this.converted_level = level.map(r => r.map(t => t == 1 ? 
            this.tile_index.wall : this.tile_index.floor));

        // Now to construct the "tilemap", which is a data structure that holds
        // several things: the 2d converted array, a link to the spritesheet,
        // the configuration data for the sprites and tiles found in that
        // spritesheet (pixel width and height of each glyph, and the pixel
        // spacing between glyphs).
        const config = {
            data: this.converted_level,
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

    // a boolean test to see if a particular location is "walkable" or not -
    // meaning that it doesn't contain another entity, nor a wall - this
    // function will return 'true' if the requested space is free/open.
    is_walkable_location: function (x, y) {

        // check to make sure we're not trying to walk into a square that is
        // currently occupied by another entity
        let entity_set_copy = [...turn_manager.entity_set];
        for (let i = 0; i < entity_set_copy.length; i++) {

            let e = entity_set_copy[i];

            if (e.x == x && e.y == y) {
                return false;
            }
        }

        // check to make sure we're not trying to walk into a wall
        let tile_at_destination = board.tilemap_layer.getTileAt(x,y);
        return tile_at_destination.index !== board.tile_index.wall;
    },

    // find the entity that is currently at a specific location on the board,
    // or 'false' if that space is empty or a wall or something else.
    entity_at_location: function(x,y) {

        let entity_set_copy = [...turn_manager.entity_set];
        for (let i = 0; i < entity_set_copy.length; i++) {

            let e = entity_set_copy[i];

            if (e.x == x && e.y == y) {
                return e;
            }
        }
        return false;
    },

    remove_entity: function(e) {
         
        turn_manager.entity_set.delete(e);
        e.sprite_handle.destroy();
        e.on_destroy();
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
    },

    distance_between_entities: function(e1, e2) {

        let grid = new PF.Grid(board.level);
        let finder = new PF.AStarFinder(
            {
                allowDiagonal: true
            }
        );
        let path = finder.findPath(e1.x, e1.y, e2.x, e2.y, grid);
        if (path.length >= 2) {
            return path.length;
        } else {
            return false;
        }
    },

    attack_entity: function(e1, e2) {

        e1.tweening = true;
        e1.tweens = e1.tweens || 0;   // no idea what this does
        e1.tweens += 1;

        this.scene.tweens.add(
            {
                targets: e1.sprite_handle,
                onComplete: () => {
                    e1.sprite_handle.x = this.tilemap_layer.tileToWorldX(e1.x);
                    e1.sprite_handle.y = this.tilemap_layer.tileToWorldY(e1.y);

                    e1.tweening = false;
                    e1.tweens -= 1;

                    let damage = e1.attack();
                    e2.hp -= damage;

                    console.log(`${e1.name} does ${damage} damage to ${e2.name} which now has ${e2.hp} life left`);
                    if(e2.hp <= 0) {
                        this.remove_entity(e2);
                    }
                },
                x: this.tilemap_layer.tileToWorldX(e2.x),
                y: this.tilemap_layer.tileToWorldX(e2.y),
                ease: "Power2",
                hold: 20,
                duration: 80,
                delay: e1.tweens * 200,
                yoyo: true
            }
        );

        console.log("attack_enemy() over");
    }
}

export default board 
