const baseSkill = require("../../common/baseSkill");
//Excel based Common Functionality goes here 
// var sheetArr = [];


const xmlUtil = require("../../../../utils/xmlUtil");

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

    genImageJsonResFolderPath(stateId){
        
        return "state" + stateId + "/";
    }

    genImageJsonResFolderPath1(stepIdx, stateId){
        // patch fix
        return stepIdx + "/state" + stateId + "/";
    }

    createImageJson (skillParams, callback){
        
      var taskParams = skillParams.taskParams;
      var paramValueObj = skillParams.paramsObj;
    //   var stateId = 1;
      var finalObject = {};
      finalObject["folderPath"] = xmlUtil.generateTaskFolderPath(taskParams.taskId) + this.genImageJsonResFolderPath1(taskParams.stepIndex, taskParams.stateId);

      skillParams.taskParams.parentFolder = this.genImageJsonResFolderPath(taskParams.stateId);

      var promiseArr = [];
      var self = this;
      for(var iterator = 0 ; iterator < paramValueObj["sheets"].length; ++iterator){
        
        promiseArr.push(self.genSheetPromise(skillParams ,iterator));

        // requestArr1.push(promiseObj);
        
        // Promise.all(requestArr[iterator]).then(function(resolveParam){
        //     console.log("Single sheet operation success");
        //     // callback(null,resolveParam.finalObject, resolveParam.preloadResArr);
        //     //update folder name
        //     resolve("resolved");

        //     },function(err){
        //     console.log("Single sheet operation Failed");
        //     reject(error);
        //     // callback(err)

        //     });

      }

      Promise.all(promiseArr).then(function(resolveParam){
        console.log("folder operation success");
        finalObject["sheetImages"] = [];
        var preloadResArr = [];
        for(var index = 0; index < resolveParam.length; ++index){
            finalObject["sheetImages"].push(resolveParam[index].sheetObject);
            for(var iterator = 0; iterator < resolveParam[index].preloadResArr.length; ++iterator){
                preloadResArr.push(resolveParam[index].preloadResArr[iterator]);
            }
        }
        
        let abc = JSON.stringify(finalObject);
        callback(null, abc, preloadResArr);

      },function(err){
        console.log("folder operation Failed");
        callback(err)

      });


        // taskParams.dbFilestoreMgr.copyAssetFolderContents(paramValueObj["sheets"][0]["path"], taskParams.stepIndex,taskParams.taskId, function(error, newFolderPath){
        //     if(!error){
        //         var finalObject = {};
        //         // finalObject['folderPath'] = paramValueObj["sheets"][0]["path"];
        //         finalObject['folderPath'] = newFolderPath;
        //         // only this path needds to be changed.
        //         var sheetArr = []
        //         var requestArray = [];
        //         var preloadResArr = [];
          
<<<<<<< HEAD
                for(var iterator = 0 ; iterator < paramValueObj["sheets"].length; ++iterator){
                    sheetArr[iterator] = {};
                    sheetArr[iterator]['sheetNo'] = this.getSheetNumber(paramValueObj["sheets"][iterator].name);
=======
        //         for(var iterator = 0 ; iterator < paramValueObj["sheets"].length; ++iterator){
        //             sheetArr[iterator] = {};
        //             sheetArr[iterator]['sheetNo'] = 1;
>>>>>>> develop
                    
        //             sheetArr[iterator]['gridImg'] = paramValueObj["sheets"][iterator].gridImage.name;
        //             preloadResArr.push({"path":""+ newFolderPath + sheetArr[iterator]['gridImg'] ,"type":"img"})
                    
        //             sheetArr[iterator]['rowImg'] = paramValueObj["sheets"][iterator].rowImage.name
        //             preloadResArr.push({"path":""+ newFolderPath + sheetArr[iterator]['rowImg'] ,"type":"img"})
                    
        //             sheetArr[iterator]['colImg'] = paramValueObj["sheets"][iterator].cellImage.name;
        //             preloadResArr.push({"path":""+ newFolderPath + sheetArr[iterator]['colImg'] ,"type":"img"})
        //             // requestArray.push(returnPromiseObj(finalObject['folderPath'] + sheetArr[iterator]['colImg']))
                    
        //             sheetArr[iterator]['cellImg'] = paramValueObj["sheets"][iterator].columnImage.name;
        //             preloadResArr.push({"path":""+ newFolderPath + sheetArr[iterator]['cellImg'] ,"type":"img"})

        //         }    
                
        //         finalObject['sheetImages'] = sheetArr;
        //         finalObject = JSON.stringify(finalObject);
        //         callback(null, finalObject, preloadResArr);
        // }
        // else{
        //     callback(error)
        // }
        // })

    }


    genSheetPromise(skillParams ,iterator, imageName){
      var taskParams = skillParams.taskParams;
      var paramValueObj = skillParams.paramsObj;
      var self = this;
      return new Promise(function(resolve,reject){
        
        var requestArr = [];


        requestArr.push(self.genFilePromise(skillParams , iterator, {"gridImage":"gridImg"}));
        requestArr.push(self.genFilePromise(skillParams , iterator, {"rowImage":"rowImg"}));
        requestArr.push(self.genFilePromise(skillParams , iterator, {"cellImage":"cellImg"}));
        requestArr.push(self.genFilePromise(skillParams , iterator, {"columnImage":"colImg"}));
        // genFilePromise(skillParams ,iterator, imageName);
        Promise.all(requestArr).then(function(resolveParam){
            console.log("single sheet success");
            //update the attrParam for that sheet
            var resolveObj = {};
            var preloadResArr = [];
            for(var index = 0; index < resolveParam.length;++index){
                var pathKey = Object.keys(resolveParam[index])[0];
                resolveObj[pathKey] = resolveParam[index][pathKey];
                preloadResArr.push({"path": resolveObj[pathKey],"type": resolveParam[index]["fileType"] }) 
            }
            
            var sheetObject = {};
                sheetObject["sheetNo"] = 1;
                sheetObject["gridImg"] = resolveObj["gridImage"].split("/")[resolveObj["gridImage"].split("/").length - 1];
                sheetObject["rowImg"] = resolveObj["rowImage"].split("/")[resolveObj["rowImage"].split("/").length - 1];
                sheetObject["cellImg"] = resolveObj["cellImage"].split("/")[resolveObj["cellImage"].split("/").length - 1];
                sheetObject["colImg"] = resolveObj["columnImage"].split("/")[resolveObj["columnImage"].split("/").length-1];

            var resolveParam = {"sheetObject":sheetObject,"preloadResArr":preloadResArr};
            resolve(resolveParam);
        },function(error){
            console.log("single sheet failure");
            reject(error);
        })
      })

    }

    genFilePromise(skillParams ,iterator, imageObj){
        
      var taskParams = skillParams.taskParams;
      var paramValueObj = skillParams.paramsObj;
        
        return new Promise(function(resolve, reject){
            var filepath = paramValueObj["sheets"][iterator][Object.keys(imageObj)[0]]["path"];
            taskParams.dbFilestoreMgr.copyTaskAssetFile(filepath, taskParams, function (error, xmlPath, fileType) {
            if (!error) {
                // sheetArr[iterator] = [];
                // sheetArr[iterator][imageObj] = paramValueObj["sheets"]["value"][iterator][Object.keys(imageObj)[0]].name;
                //  xmlPath; //for this file
                var preloadResArr = [];
                // preloadResArr.push({"path":""+ xmlPath +"/"+ sheetArr[iterator]['gridImg'] ,"type":"img"});
                //where to update the folder path
                var resolveParam = {}
                resolveParam[Object.keys(imageObj)[0]] = xmlPath;
                resolveParam["fileType"] = fileType;
                resolve(resolveParam);
            }
            else {
                // console.log("error in the createSheetCellData");
                // callback(error);
                reject(error);
            }

        })
});   

    }






    // genFilePromise(paramValueObj , iterator, stepIndex, taskId){
        
    //     return new Promise(function(resolve,reject){
    //         taskParams.dbFilestoreMgr.copyAssetFolderContents(paramValueObj["sheets"]["value"][iterator]["filepath"], taskParams.stepIndex,taskParams.taskId, function(error, newFolderPath){
    //         if(!error){
    //             var finalObject = {};
    //             // finalObject['folderPath'] = paramValueObj["sheets"][0]["path"];
    //             finalObject['folderPath'] = newFolderPath;
    //             // only this path needds to be changed.
    //             var sheetArr = []
    //             var requestArray = [];
    //             var preloadResArr = [];
          
    //             // for(var iterator = 0 ; iterator < paramValueObj["sheets"].length; ++iterator){
    //                 sheetArr[iterator] = {};
    //                 sheetArr[iterator]['sheetNo'] = 1;
                    
    //                 sheetArr[iterator]['gridImg'] = paramValueObj["sheets"][iterator].gridImage.name;
    //                 preloadResArr.push({"path":""+ newFolderPath + sheetArr[iterator]['gridImg'] ,"type":"img"})
    //                 preloadResArr.push({"path":""+ newFolderPath + sheetArr[iterator]['gridImg'] ,"type":"img"})
                    
    //                 sheetArr[iterator]['rowImg'] = paramValueObj["sheets"][iterator].rowImage.name
    //                 preloadResArr.push({"path":""+ newFolderPath + sheetArr[iterator]['rowImg'] ,"type":"img"})
                    
    //                 sheetArr[iterator]['colImg'] = paramValueObj["sheets"][iterator].cellImage.name;
    //                 preloadResArr.push({"path":""+ newFolderPath + sheetArr[iterator]['colImg'] ,"type":"img"})
    //                 // requestArray.push(returnPromiseObj(finalObject['folderPath'] + sheetArr[iterator]['colImg']))
                    
    //                 sheetArr[iterator]['cellImg'] = paramValueObj["sheets"][iterator].columnImage.name;
    //                 preloadResArr.push({"path":""+ newFolderPath + sheetArr[iterator]['cellImg'] ,"type":"img"})

    //             // }    
                
    //             finalObject['sheetImages'] = sheetArr;
    //             finalObject = JSON.stringify(finalObject);
    //             // callback(null, finalObject, preloadResArr);
    //             resolveParam = {"finalObject": finalObject, "preloadResArr":preloadResArr}
    //             resolve(resolveParam);
    //     }
    //     else{
    //         reject(error)
    //     }
    //     })

    //     })
    // }
}
