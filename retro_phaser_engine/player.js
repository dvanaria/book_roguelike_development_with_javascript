import board from "./board.js"

// All entities in the game (player, monsters, etc) must implement the following
// methods:
//
//     constructor() - sets movement_points, sets up a handle to keyboard input
//                     and sets initial location in dungeon. The index of the 
//                     glyph to use from the spritesheet is defined. 
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
        this.name = "The Player";
        this.movement_points = 2;
        this.action_points = 2;
        this.hp = 10;
        this.arrow_keys = board.scene.input.keyboard.createCursorKeys();
        this.x = x;
        this.y = y;
        this.sprite_index = 29;
        this.tweening = false;   // to allow for "tweens"
        board.initialize_entity_graphics(this);
    }

    refresh_turn() {
        this.movement_points = 2;
        this.action_points = 2;
    }

    attack() {
        return 1;
    }

    take_turn() {

        let old_x = this.x;
        let old_y = this.y;
        let moved = false;
        let new_x = this.x;
        let new_y = this.y;

        if (this.movement_points > 0) {

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

                if( !board.is_walkable_location(new_x, new_y) ) {
                    let enemy = board.entity_at_location(new_x, new_y);

                    if(enemy && this.action_points > 0) {
                        board.attack_entity(this, enemy);
                        this.action_points -= 1;
                    }

                    new_x = old_x;
                    new_y = old_y;
                }

                if(new_x !== old_x || new_y !== old_y) {
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

    on_destroy() {
        alert("OMG! You died!");
        location.reload();
    }
}
