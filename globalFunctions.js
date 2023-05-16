		const PLAYER = "player"
		const UNBREAKABLE_BLOCK = "block-unbreakable_block";
		const AIR = "block-air"; 
		const ONE_WAY = "block-one-way";
		const MOVE = "block-move";
		const GOAL = "block_goal"
		const SLIDE = "block-move-slide";
		const BOMB = "block-bomb";
		const BREAKABLE_BLOCK = "block-breakable-block";
		const BOUNCE_ZONE_UP= "bounce_up";
		const BOUNCE_ZONE_DOWN= "bounce_down";
		const BOUNCE_ZONE_RIGHT= "bounce_right";
		const BOUNCE_ZONE_LEFT= "bounce_left";
		const GRAVATY_SIM_RIGHT= "block_gravity_simulator_right";
		const GRAVATY_SIM_LEFT= "block_gravity_simulator_left";
		const GRAVATY_SIM_UP= "block_gravity_simulator_up";
		const GRAVATY_SIM_DOWN= "block_gravity_simulator_down";
		const LOCK = "block_lock";
		const KEY = "block_key";
		const NO_PLAYER = "block-no-player";
		const POWER = "block_power";
		const DUPLICATOR = "duplicator";

		var EXTRA_INFORMATION = {
			player: {maxElements: 2},
			block_goal: {maxElements: 1},
			bounce_up: [1, -1],
			bounce_down:[1, 1],
			bounce_right:[0, 1],
			bounce_left: [0, -1],
			block_gravity_simulator_right: ["right"],
			block_gravity_simulator_left: ["left"],
			block_gravity_simulator_up: ["up"],
			block_gravity_simulator_down: ["down"],
			block_power: 4
		}

		const MOVEABLE_BLOCKS = [
			MOVE,
			KEY
		]

		//special blocks based on their movement
		const SPECIAL_BLOCKS_MOVE = [
			SLIDE,
			BOMB,
			BOUNCE_ZONE_DOWN,
			BOUNCE_ZONE_LEFT,
			BOUNCE_ZONE_RIGHT,
			BOUNCE_ZONE_UP,
			LOCK,
			GOAL,
			NO_PLAYER
		]

		var coordCellX = 0;
		var coordCellY = 0;
		

		/**
		 * Creates a table and model for the game
		 * 
		 * -to change size change:
		 * --column
		 * --row
		 * 
		 * -returns: null
		 * 
		 */function createTable(rows, columns, tableID, cellID) {
			var body = document.getElementsByTagName("body")[0];
			removeOldTable(tableID);
			//creating the table and tbody
			var table = document.createElement("table");
			var tableBody = document.createElement("tbody");
			for (x = 0; x < rows; x++) {
				//creating the row
				var row = document.createElement("tr")
				for (y = 0; y < columns; y++) {
					//creating cells and giving them their ID
					var cell = document.createElement("td");
					cell.id = (cellID + x + "_" + y);
					cell.setAttribute("coord_x", x);
					cell.setAttribute("coord_y", y);
					var cellTxt = document.createTextNode("x");
					//asign every Elemnt
					cell.appendChild(cellTxt);
					row.appendChild(cell);
				};
				tableBody.appendChild(row);
			};
			table.appendChild(tableBody);
			body.appendChild(table);
			table.id = (tableID)
			document.getElementById(tableID).classList.add ("playingTable");
			return table;
		}

		function removeOldTable (tableID) {
			try {
				document.body.removeChild(document.getElementById(tableID));
			} catch (e) {
			}
		}

		function modifyModel(modelName, rows, columns) {
			modelProt = [[]] 
			for (y = 0; y < columns; y++) {
				modelProt[0][y] = UNBREAKABLE_BLOCK
			};
			for (x = 0; x < rows; x++) {
				modelProt[x] = modelProt[0].slice(0, modelProt[0].length); 
			};
			return modelProt;
		}

        /**
		 * You visuelise the model in the table
		 * 
		 * -input - model data 
		 * -returns: null
		*/function updateTable(modelName ,cellID) {
			const CONNECTING_TEXTURES = [
				"block-unbreakable_block",
			]
			updateGravatyFields(modelName);
			for (x = 0; x < modelName.length; x++) {
				for (y = 0; y < modelName[x].length; y++) {
					if(CONNECTING_TEXTURES.includes(modelName[x][y])){
						connectTextures (modelName ,x, y, cellID)
					} else{
						insertImages(modelName[x][y], x, y, cellID, modelName)
					}
				}	
			}
		}


		function updateGravatyFields(modelName){
			for (x = 0; x < modelName.length; x++) {
				for (y = 0; y < modelName[x].length; y++) {
					if (sessionStorage.getItem("bounceBackup_"+ x + "_" +y)){
						var fieldData = JSON.parse(sessionStorage.getItem("bounceBackup_"+ x +"_"+y));
						if (model[fieldData.coordX][fieldData.coordY] == AIR){
							var fieldDataBackup = JSON.stringify(fieldData.backup)
							model[fieldData.coordX][fieldData.coordY] = fieldData.backup
							sessionStorage.removeItem("bounceBackup_"+ x +"_"+y);
						}
					}
				}
			}
		}


		function insertImages (imgData, x, y, cellID, modelName) {
			var cell = document.getElementById(cellID+x+ "_" +y);
			var img = cell.childNodes[0];
			if(img == undefined || img.nodeType != Node.ELEMENT_NODE) {
				img = document.createElement("img");
				cell.textContent = "";
				cell.appendChild(img);
			}
			var src = "Textures/" +imgData + ".png";
			if(img.getAttribute("src") != src) {
				img.src = src;
			}
		} 

		function connectTextures (modelName ,x, y, cellID) {
			var connectData = "";
			for (j = 0; j <= 2 ; j = j + 2) {
				try {
					if (modelName[x -1 + j][y] == modelName[x][y]) {	
						connectData = connectData + "1"
					}
					else{
						connectData = connectData + "0"
					}
				} catch {
					connectData = connectData + "0"
				}
				try {
					if (modelName[x][y -1 + j] == modelName[x][y]) {	
						connectData = connectData + "1"
					}
					else {
						connectData = connectData + "0"
					}
				} catch {
					connectData = connectData + "0"
				}
			}
			var imgData = modelName[x][y] + connectData
			insertImages(imgData, x, y, cellID);
		}


		/**
		 * retunrns
		 * 
		 *  
		*/
		function tableCellOnclickDet(table) {
			var cells = table.querySelectorAll("td");
			for (i = 0; i < cells.length; i++) {
				cells[i].onclick = cellDetection(cells[i]);
			}
		}

		function cellDetection (cell) {
			return function(){
				coordCellX = Number(cell.getAttribute("coord_x"));
				coordCellY = Number(cell.getAttribute("coord_y"));
			};
		}


		function temporySaveLevelData(model){
			const createdLevelData = JSON.stringify({sizeX:model.length, sizeY:model[0].length, model:model, levelName: undefined})
			sessionStorage.removeItem("temporyLevelData");
			sessionStorage.setItem("temporyLevelData",createdLevelData);
		}


		function createPlayingTemplate(levelData, tableID, cellID){
			createTable(levelData.sizeX, levelData.sizeY, tableID, cellID);
			return levelData.model;
		}


		/**
		* loops over the model and calls the function by params row, column
		*
		**/function loopOverModel(model, func){
			for (let row = 0; row < model.length; row++){
				for(let column = 0; column < model[row].length; column++){
					func(row, column, model)
				}
			}
		}

		
		function generateId(length){
			function getRandLetter() {
				const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789012345678901234567890123456789';
				return LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
			}
			let result = ""
			for (let i = 0; i < length; i++){
				result += getRandLetter()
			}
			return result
		}
