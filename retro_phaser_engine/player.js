import board from "./board.js"

// All entities in the game (player, monsters, etc) must implement the following
// methods:
//
//     refresh_turn()  - called at the beginning of a new turn, resets movement
//                  points
//
//     take_turn() - expends are action points this entity is allowed
//
//     turn_is_over() - a test (boolean) - is this entity done with it's turn?
//
//


export default class PlayerCharacter {

    constructor(x, y) {

        this.movement_points = 2;
        this.arrow_keys = board.scene.input.keyboard.createCursorKeys();
        this.x = x;
        this.y = y;
        this.sprite_index = 29;
        this.hp = 10;
        this.tweening = false;   // to allow for "tweens"

        board.initialize_entity_graphics(this);
    }

    refresh_turn() {
        this.movement_points = 2;
    }

    take_turn() {

        let new_x = this.x;
        let new_y = this.y;
        let moved = false;

        if (this.movement_points > 0 && !this.tweening) {

            if (this.arrow_keys.left.isDown) {
                new_x -= 1;
                moved = true;
            }

            if (this.arrow_keys.right.isDown) {
                new_x += 1;
                moved = true;
            }

            if (this.arrow_keys.up.isDown) {
                new_y -= 1;
                moved = true;
            }

            if (this.arrow_keys.down.isDown) {
                new_y += 1;
                moved = true;
            }

            if (moved) {
                this.movement_points -= 1;

                if( board.is_walkable_tile(new_x, new_y) ) {
                    board.move_entity_to(this, new_x, new_y);
                }
            }
        }
    
        if (this.hp <= 3) {
            this.sprite_handle.tint = Phaser.Display.Color.GetColor(255,0,0);
        }
    
    }

    turn_is_over() {
        return this.movement_points == 0 && !this.tweening;
    }
}
