import board from "./board.js"

// All entities in the game (player, monsters, etc) must implement the following
// methods:
//
//     constructor() - mostly the same as player.js, but instead of a handle
//                     to keyboard input, a name (string) is given for the
//                     monster.
//
//     refresh_turn()  - called at the beginning of a new turn, resets movement
//                  points
//
//     take_turn() - expends are action points this entity is allowed
//
//     turn_is_over() - a test (boolean) - is this entity done with it's turn?
//


export default class BasicMonster {

    constructor(x, y) {

        this.name = "A Dangerous Monster";

        this.movement_points = 1;
        this.action_points = 3;
        this.hp = 1;

        this.x = x;
        this.y = y;
        this.sprite_index = 26;

        // this.tweening = false;   // to allow for "tweens"

        board.initialize_entity_graphics(this);
    }

    refresh_turn() {
        this.movement_points = 1;
        this.action_points = 3;
    }

    attack() {
        return 1;
    }

    take_turn() {

        let old_x = this.x;
        let old_y = this.y;
        let player_x = board.player.x;
        let player_y = board.player.y;
            
        let level_grid = new PF.Grid(board.level);
        let path_finder = new PF.AStarFinder();  // uses A* algorithm
        let path = path_finder.findPath(old_x, old_y, player_x, player_y, level_grid);

        if (this.movement_points > 0) {

            if (path.length > 2) {
                board.move_entity_to(this, path[1][0], path[1][1]);

                console.log('path[0][0]: ' + path[0][0] + '      path[0][1]: ' + path[0][1]);
                console.log('path[1][0]: ' + path[1][0] + '      path[1][1]: ' + path[1][1]);

            }

            this.movement_points -= 1;

        }

        if (this.action_points > 0) {

            if (board.distance_between_entities(this, board.player) <= 2) {
                board.attack_entity(this, board.player);
            }

            this.action_points -= 1;

        }

    }

    turn_is_over() {

        return this.movement_points == 0 && 
              !this.tweening &&
               this.action_points == 0;

    }

    on_destroy() {

        console.log(`${this.name} was killed`);

    }
}
