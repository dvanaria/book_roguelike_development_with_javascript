import board from "./board.js"

// All entities in the game (player, monsters, etc) must implement the following
// methods:
//
//     refresh()  - called at the beginning of a new turn, resets movement
//                  points
//
//     turn() - expends are action points this entity is allowed
//
//     done() - a test (boolean) - is this entity done with it's turn?
//
//


export default class PlayerCharacter {

    constructor(x, y) {

        this.movement_points = 1;
        this.arrow_keys = board.scene.input.keyboard.createCursorKeys();
        this.x = x;
        this.y = y;
        this.sprite_index = 29;

        board.tilemap.putTileAt(this.sprite_index, this.x, this.y);
    }

    refresh() {
        this.movement_points = 1;
    }

    turn() {

        let old_x = this.x;
        let old_y = this.y;
        let moved = false;

        if (this.movement_points > 0) {

            if (this.arrow_keys.left.isDown) {
                this.x -= 1;
                moved = true;
            }

            if (this.arrow_keys.right.isDown) {
                this.x += 1;
                moved = true;
            }

            if (this.arrow_keys.up.isDown) {
                this.y -= 1;
                moved = true;
            }

            if (this.arrow_keys.down.isDown) {
                this.y += 1;
                moved = true;
            }

            if (moved) {
                this.movement_points -= 1;
            }
        }

        // wall collision check
        let tile_at_destination = board.tilemap.getTileAt(this.x, this.y);
        if (tile_at_destination.index == board.tile_index.wall) {
            this.x = old_x;
            this.y = old_y;
        }

        // tile movement code
        if (this.x !== old_x || this.y !== old_y) {
            board.tilemap.putTileAt(this.sprite_index, this.x, this.y);
            board.tilemap.putTileAt(board.tile_index.floor, old_x, old_y);
        }
    }

    over() {
        return this.movement_points == 0;
    }
}
