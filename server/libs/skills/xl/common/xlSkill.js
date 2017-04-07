const baseSkill = require("../../common/baseSkill");
//Excel based Common Functionality goes here 
module.exports = class ExcelBaseSkill extends baseSkill{
//this function moved to  Base Excel Skill 
// Sheet number still hardcoded, should be generated by the component handler
    
    init(data, callback) {
        var self = this;
        var initDocJSonPath = data.initDocJSonPath;
        var dbMgr = data.dbMgr;
        dbMgr.readFileFromFileStore(initDocJSonPath, function(error, initDocJson){
               if(!error){
                 self.initDocJson = JSON.parse(initDocJson);
                 self.generateSheetNamesMap();
                 callback(null);
               }
               else{
                 callback(error);
               }
           });
    }

    generateSheetNamesMap(){
        this.sheetNameMap = {};
        for(var index = 0; index < this.initDocJson.sheets.length; ++index){
            this.sheetNameMap[this.initDocJson.sheets[index].name] = (index+1);
        }
    }

    getSheetNumber(sheetName){
        return this.sheetNameMap[sheetName];
    }

    createImageJson (skillParams, callback){
        
      var taskParams = skillParams.taskParams;
      var paramValueObj = skillParams.paramsObj;
        
        taskParams.dbFilestoreMgr.copyAssetFolderContents(paramValueObj["sheets"][0]["path"], taskParams.stepIndex,taskParams.taskId, function(error,newFolderPath){
            if(!error){
                var finalObject = {};
                finalObject['folderPath'] = newFolderPath;
                // only this path needds to be changed.
                var sheetArr = []
                var requestArray = [];
                var preloadResArr = [];
          
                for(var iterator = 0 ; iterator < paramValueObj["sheets"].length; ++iterator){
                    sheetArr[iterator] = {};
                    sheetArr[iterator]['sheetNo'] = this.getSheetNumber(paramValueObj["sheets"][iterator].name);
                    
                    sheetArr[iterator]['gridImg'] = paramValueObj["sheets"][iterator].gridImage.name;
                    preloadResArr.push({"path":""+ newFolderPath +"/"+ sheetArr[iterator]['gridImg'] ,"type":"img"})
                    
                    sheetArr[iterator]['rowImg'] = paramValueObj["sheets"][iterator].rowImage.name
                    preloadResArr.push({"path":""+ newFolderPath +"/"+ sheetArr[iterator]['rowImg'] ,"type":"img"})
                    
                    sheetArr[iterator]['colImg'] = paramValueObj["sheets"][iterator].cellImage.name;
                    preloadResArr.push({"path":""+ newFolderPath +"/"+ sheetArr[iterator]['colImg'] ,"type":"img"})
                    // requestArray.push(returnPromiseObj(finalObject['folderPath'] + sheetArr[iterator]['colImg']))
                    
                    sheetArr[iterator]['cellImg'] = paramValueObj["sheets"][iterator].columnImage.name;
                    preloadResArr.push({"path":""+ newFolderPath +"/"+ sheetArr[iterator]['cellImg'] ,"type":"img"})

                }    
                
                finalObject['sheetImages'] = sheetArr;
                finalObject = JSON.stringify(finalObject);
                callback(null, finalObject, preloadResArr);
        }
        else{
            callback(error)
        }
        })

    }
}
