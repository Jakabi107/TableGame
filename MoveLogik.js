        const ANIMATION_END = {
            cloneRemove: function(clone){
                document.body.removeChild(clone);
                afterAnimationCompleted();
            },
            cloneRemoveUpdate : function(clone){
                document.body.removeChild(clone);
                afterAnimationCompleted();
                updateTable(model, "tblId_");
            }
        }
        
        
        //needs "globalFunctions.js"

        function playerMove (verizontale, dierection, model) {
            var playerCords = elementDetect(PLAYER, model);
            var returnValue = {succes: false, model:model}  
            for (z = 0; z < playerCords.customLength; z++){
                returnValue.succes = true;
                returnValue["player_"+ z] = moveElement(playerCords["cellCoord_" + z].x, playerCords["cellCoord_" + z].y , verizontale, dierection, false, true, model)
            }
            return returnValue;
        }


        /**
         * returns Cords of a element
        */function elementDetect (cell, model) {
            var i = 0
            var cellCords = {customLength:0,};
            for (x = 0; x < model.length; x++){
                for (y = 0; y < model[0].length; y++){
                    if (model[x][y] == cell) {
                        cellCords.customLength = cellCords.customLength + 1;
                        cellCords["cellCoord_"+i] = {x:x,y:y};
                        i++;
                    }
                }
            }
            return cellCords;
        }



        /**
         * Moves the Element forward
         * -x y cordinates 
         * -dierection -1/1  left/right or up/down
         * -verzizontale 0 or 1 horicantale or verticale
         * -slide if slide-block true
         * 
         * returns true/false if function worked properly/failed 
        */function moveElement(x, y, verizontale, dierection, slide, player, model) {
            if (verizontale == 0) {
                if (moveCheck(x, y, verizontale, dierection, slide, player, model)) {
                    //checks if it has to move two or only one Blocks
                    if (model[x][y + dierection] != AIR) {
                        //with this code 2 it moves 2 blocks
                        model[x][y + dierection + dierection] = model[x][y + dierection];
                        if (!slide) linearAnimation({x:x,y:y+dierection}, {x:x, y:y+dierection+dierection}, "tblId_", 0, 10, 1, ANIMATION_END.cloneRemove,false)
                    }
                        model[x][y + dierection] = model[x][y];
                        model[x][y] = AIR;
                        if (!slide) linearAnimation({x:x,y:y}, {x:x, y:y+dierection}, "tblId_", 0, 10, 1, ANIMATION_END.cloneRemoveUpdate,true)
                        //to give the Information where the Block was moved
                        var returnInf = {succes: true ,newX : x,newY : y + dierection, model: model}
                        return returnInf; 
                }
                else{
                    if (!slide) afterAnimationCompleted()
                    return {succes: false, model: model}
                }
            }	
            //same but for verticale "stuff"
            else {
                if (moveCheck(x, y, verizontale, dierection, slide, player, model)) {
                    if (model[x + dierection][y] != AIR) {
                        model[x + dierection + dierection][y] = model[x + dierection][y];
                        if (!slide) {
                            linearAnimation({y:y,x:x+dierection}, {y:y, x:x+dierection+dierection}, "tblId_", 1, 10, 1, ANIMATION_END.cloneRemove,false)
                        }
                    }
                        model[x + dierection][y] = model[x][y];
                        model[x][y] = AIR;
                        if (!slide) {
                            linearAnimation({x:x,y:y}, {y:y, x:x+dierection}, "tblId_", 1, 10, 1, ANIMATION_END.cloneRemoveUpdate,true)
                        }
                        var returnInf = {succes: true,newX : x + dierection,newY : y, model: model}
                        return returnInf	
                }
                else {
                    if (!slide) afterAnimationCompleted()
                    return {succes: false, model: model}
                }
            }
        }



        /**
         * checks if move is possible
         * -x y cordinates
         * -dierection -1 or 1 
         * -verzizontale 0 or 1
         * -second true if it only can "go throug air"
         * 
         * returns: true/false
         * @param {number} x
         * @param {number} y
         * @param {number} verizontale
         * @param {number} dierection
        */function moveCheck(x, y, verizontale, dierection, second, player, model)	{
            if (verizontale == 0) {
                //looks if ther's air infront of the objekt
                if (model[x][y + dierection] == AIR) {
                    return true 
                }
                //looks if there's the "first" moveable objekt infront and do a move check for this objekt 
                else if (MOVEABLE_BLOCKS.includes(model[x][y + dierection]) && !second){
                    if (moveCheck(x, y+dierection, verizontale, dierection, true, false, model)){
                        return true 
                    }
                }

                //for all cells with special Movement
                else if (SPECIAL_BLOCKS_MOVE.includes(model[x][y + dierection])) {
                    if (specialBlocksMovement(x, y + dierection, verizontale, dierection, second, player, model)) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else{
                    return false;
                }
            } else {
                if (model[x + dierection][y] == AIR) {
                    return true 
                }
                else if (MOVEABLE_BLOCKS.includes(model[x + dierection][y]) && !second){
                    if (moveCheck(x + dierection, y, verizontale, dierection, true, false, model)){
                        return true
                    }					
                }
                else if (SPECIAL_BLOCKS_MOVE.includes(model[x+dierection][y])) {
                    if (specialBlocksMovement(x+dierection, y, verizontale, dierection, second, player, model)) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else{
                    return false;
                }
            }
        }



        //all with extra blocks: 

        function specialBlocksMovement(x, y, verizontale, dierection, second, player, model){
            //Slide_block - repetes the move Element function until it crushes something
            if (model[x][y] == SLIDE && !second) {
                var j = true
                var newX = x
                var newY = y
                var i = 0
                while (j) {
                    var lastCellCords = {newX:newX, newY: newY}
                    if (!moveCheck(newX, newY, verizontale, dierection, true, false, model)){
                        j = false 
                        if (i > 0){
                            model[lastCellCords.newX][lastCellCords.newY] = SLIDE;
                            moveElement(lastCellCords.newX, lastCellCords.newY, verizontale, dierection, true, false, model);
                            model[x][y] = AIR;
                        } 
                    } 
                    if (verizontale== 0) {
                        newY = newY + dierection
                    }else{
                        newX = newX +dierection
                    }
                    i++;
                }
                if (i>1) {
                    var clone = linearAnimation({x:x, y:y}, {x:lastCellCords.newX, y:lastCellCords.newY}, "tblId_", verizontale, i*7, 1, ANIMATION_END.cloneRemove, false);
                    return true;
                }
            }
            //Bomb - delets every Bomb destroyable Block around it and activate other bombs (List of Blocks beginging of the algorithm)
            if 	(model[x][y] == BOMB && !player) {
                const BOMB_DESTROYABLE_BLOCKS= [
                    BREAKABLE_BLOCK
                ]
                model[x][y] = AIR;
                for (j = -1 ; j <=1; j++){
                    for (i = -1 ; i <=1; i++) {
                        if (BOMB_DESTROYABLE_BLOCKS.includes(model[x+j][y+i])) {
                            model[x+j][y+i] = AIR
                        }	
                        //other Bombs activation
                        if (model[x+j][y+i] == BOMB) {
                            specialBlocksMovement(x+j,y+i, verizontale, dierection, second, player, model)
                        }
                    }
                }
                return true;
            }
            //Bounce or gravaty fields - they take something what wants to move in them and moves them by move element in the dierection they are facing 
            var splitBlockName = model[x][y].split ("_",1)
            if (splitBlockName == "bounce"){
                //backup to save the bounce field data
                var backup = model[x][y]
                if (verizontale == 0){
                    //moving the Block on the position of field and deleting the field and the original pos of the block
                    model[x][y] = model[x][y - dierection]
                    model[x][y - dierection] = AIR
                }
                else{
                    model[x][y] = model[x - dierection][y]
                    model[x-dierection][y] = AIR
                }
                //moving the block in the dierection the field was looking
                moveElement(x, y,  EXTRA_INFORMATION[backup][0], EXTRA_INFORMATION[backup][1], true, player, model)
                //re-replacing the field
                if (model[x][y] == AIR){ 
                    model[x][y] = backup
                }
                else {
                    sessionStorage.setItem("bounceBackup_"+ x +"_"+y, JSON.stringify({coordX: x, coordY: y, backup:backup}))
                }
                //return false to make sure to not move the field (look at move element)
                return false;
            
            
            }

            
            if (model[x][y] == LOCK && !player){
                function lockOpened(newX,newY){
                    model[x][y] =  AIR;
                    model[newX][newY] = AIR;
                    return true;
                }
                if (verizontale == 0){
                    if (model[x][y-dierection] == KEY){
                        if (lockOpened(x, y- dierection)){
                            return true;
                        }
                    }
                }
                else{
                    if (model[x-dierection][y] == KEY){
                        if(lockOpened(x-dierection, y)){
                            return true;
                        }
                    }
                }
            }
            if (model[x][y] == GOAL && player){
                alert ("LevelCompleted")
            } 
            if (model[x][y] == NO_PLAYER && !player){
                if (verizontale == 0){
                    if (model[x][y+dierection]== AIR){
                        var block = model[x][y - dierection];
                        model[x][y+ dierection] = block;
                        model[x][y - dierection] = AIR;
                        linearAnimation({y:y - dierection,x:x}, {y:y + dierection, x:x}, "tblId_", 0, 20, 1, ANIMATION_END.cloneRemove,false)
                        return true
                    }
                    else{
                        return false
                    }
                }
                else {
                    if (model[x +dierection][y]== AIR){
                        var block = model[x - dierection][y];
                        model[x+ dierection][y] = block;
                        model[x - dierection][y] = AIR;
                        linearAnimation({y:y,x:x - dierection}, {y:y, x:x + dierection}, "tblId_", 1, 20, 1, ANIMATION_END.cloneRemove,false)
                        return true
                    }
                    else{
                        return false
                    }
                }
            }
        }


            /**
         * Updates one placing unit
         * x-y = cords
         * 
        */function placingUpdate(x,y) { 
            //todo - besser gestalten
            //for all gravaty simulator variants
            var splitBlockName = model[x][y].split ("_",2)
            if (splitBlockName[1] == "gravity"){
                if(EXTRA_INFORMATION[model[x][y]] == "right"){
                    //loop it as long as the function returns true
                    while (bouncePlace(x,y, BOUNCE_ZONE_RIGHT,0,1)){
                        y++
                    }
                }
                if(EXTRA_INFORMATION[model[x][y]] == "left"){
                    while (bouncePlace(x,y, BOUNCE_ZONE_LEFT,0,-1)){
                        y = y - 1
                    }
                }
                if(EXTRA_INFORMATION[model[x][y]] == "up"){
                    while (bouncePlace(x,y, BOUNCE_ZONE_UP,1,-1)){
                        x = x-1
                    }
                }
                if(EXTRA_INFORMATION[model[x][y]] == "down"){
                    while (bouncePlace(x,y, BOUNCE_ZONE_DOWN,1,1)){
                        x++
                    }
                }
            }
        }

        //have to modify this function to not delet everything in the row/colummn by udating it
        function bouncePlace(x,y, cell, verizontale, dierection){
            var splitBlockName = model[x][y].split ("_",1)
            if (verizontale ==0){
                if (model [x][y + dierection + dierection] != UNBREAKABLE_BLOCK && model[x][y + dierection + dierection] != null && model[x][y+dierection].split ("_",1) != "gravity") {
                    model[x][y+dierection] = cell; 
                    return true
                    }
                }
            else{
                if (model [x + dierection + dierection][y] != UNBREAKABLE_BLOCK && model[x + dierection + dierection][y] != null && model[x+dierection][y].split ("_",1) != "gravity") {
                    model[x+dierection][y] = cell; 
                    return true
                    }
            }
        }


        function placingUpdateAll(){
            for (x=0; x < model.length; x++){
                for (y=0; y < model[x].length; y++){
                    placingUpdate(x,y);
                }
            }
        }

