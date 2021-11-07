const turn_manager = {
    
    interval: 150,   // is this millisecond?

    entity_set: new Set(),   // values will be unique, iterate in insertion order
                             // functions: add(), remove()
    
    lastCall: Date.now(),  // ms
               // 233

    addEntity: (e) => turn_manager.entity_set.add(e),

    removeEntity: (e) => turn_manager.entity_set.remove(e),

    refresh: () => turn_manager.entity_set.forEach(e => e.refresh()),  // not sure what this does

    turn: () => {

        let now = Date.now(); 

        // only allow this turn to run if 150 ms has elapsed since the last
        // turn, so the player can't just hold down the arrow key and cause
        // turns to happen at blistering speeds.
        let limit = turn_manager.lastCall + turn_manager.interval;   

        if (now > limit) {   // if (233 > 150)

            for (let e of turn_manager.entity_set) {
                
                if (!e.over()) {

                    e.turn();

                    break; // jump out of for loop
                }
            }
            
            turn_manager.lastCall = Date.now();   // 275
        }
    },

    over: () => [...turn_manager.entity_set].every(e => e.over()),   // shouldn't this be a ;
}

export default turn_manager
