const turn_manager = {
    
    entity_set: new Set(),   // values will be unique, iterate in insertion order
                             // functions: add(), remove()
    
    add_entity: (e) => turn_manager.entity_set.add(e),

    remove_entity: (e) => turn_manager.entity_set.remove(e),

    current_index: 0,

    refresh_all_turns: () => {
        turn_manager.entity_set.forEach(e => e.refresh_turn());
        turn_manager.current_index = 0;
    },

    take_current_entity_turn: () => {

        if (turn_manager.entity_set.size > 0) {

            // convert set to array in order to access specific element
            let entity_set_copy = [...turn_manager.entity_set]; 
            let e = entity_set_copy[turn_manager.current_index];

            if (!e.turn_is_over()) {
                e.take_turn();
            } else {
                turn_manager.current_index++;
            }
        }
    },

    all_turns_are_over: () => [...turn_manager.entity_set].every(e => e.turn_is_over()),
}

export default turn_manager
