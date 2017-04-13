module.exports = class baseSkill{
    // This is the function of the TaskBar tooltip image path
    createTooltipImagePath(skillParams, callback){
            
      var taskParams = skillParams.taskParams;
      var paramValueObj = skillParams.paramsObj;
        return taskParams.dbFilestoreMgr.copyTaskAssetFile(paramValueObj["tbPrvImage"], taskParams)
        .then(function(resolveParam){
           var preloadResArr = [];
           preloadResArr.push({"path":"" + resolveParam.filePath ,"type":"img"});
           var resolveParams = {"attrValue": resolveParam.filePath, "preloadResArr":resolveParam.preloadResArr};
           return Promise.resolve(resolveParams);
        },function(error){
           return Promise.reject(error);
        });
  }
  
    extractSingleParamVal(skillParams, callback){

      var paramValueObj = skillParams.paramsObj;
      var resolveParam = {"attrValue" : paramValueObj[Object.keys(paramValueObj)[0]]};
     return Promise.resolve(resolveParam);
        
    }
}