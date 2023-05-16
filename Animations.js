
var animationsRunning = 0;




function getAbsoluteCoords(coords, cellId){
    var absoluteCoordinates = document.getElementById(cellId + coords.x + "_" + coords.y).childNodes[0].getBoundingClientRect("");
    //.left .top 
    return absoluteCoordinates
}


function createTblImageClone(tblField, left, top){
    var clone = document.createElement("img");
    clone.src = tblField.childNodes[0].src
    document.body.appendChild(clone)
    clone.style.position = "absolute"
    clone.style.left = left;
    clone.style.top = top;
    return clone 
}


function calculateIntervallNumber(time, intervall){
    var intervallNumber  = time / intervall;
    return intervallNumber;
}


function calculateLinearAnimation(oldCoord, newCoord, time, intervall){
    const distance = newCoord-oldCoord;
    const intervallNumber = calculateIntervallNumber(time, intervall);
    const intervallCoords = distance / intervallNumber;
    var linearAnimationData ={intervallNumber:intervallNumber, intervallCoords:intervallCoords}
    return linearAnimationData;
}



function isAnimationRunning() {
    return animationsRunning != 0;
}

/**
 * @param {*} onAnimationComplete A function that is called when the animation is complete.
 */
function linearAnimation(oldCoords, newCoords, cellId, verizontale, time, fps, onAnimationComplete, pushing){
    animationsRunning++;
    const tblField = document.getElementById(cellId+ oldCoords.x + "_" + oldCoords.y)
    const futurTblField = document.getElementById(cellId + newCoords.x+"_"+ newCoords.y)

    const oldAbsoluteCoordinates = getAbsoluteCoords(oldCoords, cellId);
    const oldLeft = oldAbsoluteCoordinates.left + window.scrollX
    const oldTop = oldAbsoluteCoordinates.top + window.scrollY
    const newAbsoluteCoordinates = getAbsoluteCoords(newCoords, cellId);
    const newLeft = newAbsoluteCoordinates.left + window.scrollX
    const newTop = newAbsoluteCoordinates.top + window.scrollY
    //step 1 img clone (absolute) 
    if(!pushing)  var futurPosClone = createTblImageClone (futurTblField, newLeft, newTop)
    var clone = createTblImageClone(tblField, oldLeft, oldTop)

    //step 2 background image = Air
    var imgAir = document.createElement("img");
    imgAir.src = "Textures/block-air.png";
    tblField.removeChild(tblField.childNodes[0]);
    tblField.appendChild(imgAir);
    
    //step 3 move block in the time to new pos 
    if (verizontale == 0){
        var animationData =  calculateLinearAnimation(oldLeft, newLeft, time, fps)
        var intervallTimes = animationData.intervallNumber
        var left = oldLeft
        var animateMoveElement = setInterval(
            function(){
                if (intervallTimes > 0){
                left = left + animationData.intervallCoords;
                clone.style.left = left 
                intervallTimes = intervallTimes -1;
                }else{
                    clearInterval(animateMoveElement)
                    animationsRunning--;
                    onAnimationComplete(clone);
                    if (!pushing) document.body.removeChild(futurPosClone)
                }

            },
            fps
        )
    }else {
        var animationData =  calculateLinearAnimation(oldTop, newTop, time, fps)
        var intervallTimes = animationData.intervallNumber
        var top = oldTop
        var animateMoveElement = setInterval(
            function(){
                if (intervallTimes > 0){
                top = top + animationData.intervallCoords;
                clone.style.top = top
                intervallTimes = intervallTimes -1;
                }else{
                    clearInterval(animateMoveElement)
                    animationsRunning--;
                    onAnimationComplete(clone);
                    if (!pushing) document.body.removeChild(futurPosClone)
                }

            },
            fps
        )
    }
    return clone;
    //updateTable
}

