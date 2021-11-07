// tilesheet.png has 1024 glyphs, arranged in 32 rows, with 32 glyphs in each
// row.
// Each glyph is 16x16 pixels 
// Another name for spritesheet is "atlas"


// A "tilemap" is a data structure, with the following data:
//     tile size (length and height, in pixels) 16
//     pointer to the spritesheet being used
//     map dimensions (32 by 32) 
//     visual grid (shows indexes that should be used at each area)
//     logic grid (used for collision detection, path finding, etc)
//     


let visual_grid = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];



const game_scene = {
    
    preload: function () {
       
        this.load.bitmapFont("arcade_font", "../font/arcade.png", "../font/arcade.xml");

        this.load.spritesheet('roguelike_tilesheet', '../assets/roguelike_spritesheet.png', 
            { frameWidth: 16, 
              frameHeight: 16, 
              spacing: 1 }
        );

    },

    create: function () {
        
        this.arrow_keys = this.input.keyboard.createCursorKeys();

        // Convert visual grid numbers to actual index values
        const wall = 554;
        const floor = 0;
        visual_grid = visual_grid.map(r => r.map(t => t == 1 ? wall : floor));

        // Create a tilemap
        const tileSize = 16;
        const tilemap_config = {
            data: visual_grid,
            tileWidth: tileSize,
            tileHeight: tileSize,
        };
        const tilemap = this.make.tilemap(tilemap_config);
        const tileset = tilemap.addTilesetImage('roguelike_tilesheet', 'roguelike_tilesheet', 
            tileSize, tileSize, 0, 1);
       
        // Render map
        tilemap.createStaticLayer(0, tileset, 0, 0);

        // Render text
        this.my_text = this.add.bitmapText(10, 10, "arcade_font", "Dungeon Map").setOrigin(0.5);
    },

    update: function () {
        
        if(this.arrow_keys.left.isDown) {
            this.my_text.x -= 10;
        }
        if(this.arrow_keys.right.isDown) {
            this.my_text.x += 10;
        }
        if(this.arrow_keys.up.isDown) {
            this.my_text.y -= 10;
        }
        if(this.arrow_keys.down.isDown) {
            this.my_text.y += 10;
        }

    }
}

const config = {

    type: Phaser.AUTO,
    width: 20 * 16,
    height: 15 * 16,
    backgroundColor: "#000",
    parent: "game",
    pixelArt: true,
    zoom: 2,
    scene: game_scene,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 }
        }
    }
}

const game = new Phaser.Game(config)
