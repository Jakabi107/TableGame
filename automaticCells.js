let allAuto = [
    //{type:"", id:"", row:"", column:""}
]

const AUTO_CELLS = [
    DUPLICATOR
]

const AUTO_FUNCTIONS = {
    "duplicator": duplicatorFunction
}

function updateAllAuto(allAuto, model){
    let givenId = [];
    loopOverModel(model, function(row, column, model){
        if (AUTO_CELLS.includes(model[row][column])){
            let id = generateId(10)
            while (givenId.includes(id)){
                id = generateId(10)
            }
            givenId[givenId.length] = id;
            allAuto[allAuto.length] = {"type":model[row][column], "id":id, "row":row, "column":column}
        }
    }
    )
    return allAuto;
}

function runAllSpecialCells(cells, model){
    for (let i = 0; i < allAuto.length; i++){
        let cell = allAuto[i];
        AUTO_FUNCTIONS[cell.type](cell.row, cell.column, model)
    }
}

function duplicatorFunction(x,y,model){
    const NON_DUPABLE = [
        PLAYER,
        AIR,
        UNBREAKABLE_BLOCK
    ]
    if (!NON_DUPABLE.includes(model[x - 1][y])){
        model[x + 1][y] = model[x - 1][y];
    }
}



