//this file contains the object type implementation for the parameters of an attribute

var attrParam = function (attrName, attrObject, stepUIState, skillobject, IOMapRef) {
  this.attrName = attrName;
  this.attrObject = attrObject;
  this.stepUIState = stepUIState;
  this.skillobject = skillobject;
};

var attrTaskParam = function (taskId, stepIndex, stateId, dbFilestoreMgr) {

  this.taskId = taskId;
  this.stepIndex = stepIndex;
  this.stateId = stateId;
  this.dbFilestoreMgr = dbFilestoreMgr;
};

class IOTranslator {

  genPromise(attrParams, taskParam) {
    var self = this;
    return new Promise(function (resolve, reject) {
      self.evaluateAttribute(attrParams, taskParam).then(function (resolveParams) {
        resolve(resolveParams);
      }, function (error) {
        console.log("promise rejection at genPromise");
        reject(error);
      });
    });
  }

  //common function for getting the param array for the passed array of params
  getEvaluatedParams(paramObj, stepUIState) {

    var evalexp = "stepUIState.";
    // var finalArray = [];

    for (var param in paramObj) {
      paramObj[param] = eval(evalexp + paramObj[param]);
    }
    return paramObj;
  }

  evaluateFromFunc(attrParams, paramsObj, taskParam) {

    var functionName = attrParams.attrObject["function-name"];

    if (!attrParams.skillobject[functionName]) {
      functionName = "extractSingleParamVal";
    }

    var skillParams = { "paramsObj": paramsObj, "taskParams": taskParam };
    return attrParams.skillobject[functionName](skillParams);
  }

  evaluateAttribute(attrParams, taskParam) {

    var evaluatedParams = [];
    var attrObjectValue = "";
    //the attr params currentky contains the string values , the LOC below converts it into values from the Step UI Json 
    evaluatedParams = this.getEvaluatedParams(attrParams.attrObject.params, attrParams.stepUIState);
    return this.evaluateFromFunc(attrParams, evaluatedParams, taskParam);
  }

  /**
   * returns the promise which fills the value of an individual attribute 
   * using stepUIState in the corresponding node of IOMap
   * @param {*} attrObj : it's an object having the following
   * IOMap, stepUIState, 
   * skillRef (object of skill specific class. It was generated by skill factory), 
   * taskId, stepIndex and reference of dbFilestoreMgr 
   * @param {*} data : it's an object having four values which are parentObj, keyName, stateId and compId
   * @param {*} PromiseRequestsArr : An array in which promise object has to be pushed. 
   * Later on in the execution cycle this whole array is passed to the Promise.All()
   */

  _executeIOMapFunction(attrObj, data, PromiseRequestsArr) {
    let attrParams = new attrParam(data.keyName, data.parentObj[data.keyName], attrObj.stepUIState, attrObj.skillRef),
        taskParam = new attrTaskParam(attrObj.taskId, attrObj.stepIndex, data.stateId, attrObj.dbFilestoreMgr);

    PromiseRequestsArr.push(this.genPromise(attrParams, taskParam).then(resolveParams => {
      data.parentObj[data.keyName] = resolveParams.attrValue;
      if (resolveParams.preloadResArr) {
        this.appendPreloadRes(resolveParams.preloadResArr, attrObj.IOMap);
      }
    }, error => {
      return Promise.reject(error);
    }));
  }

  /**
   * Input: IOMap JSON 
   * @param attrObj: it's an object having the following
   * IOMap, stepUIState, 
   * skillRef (object of skill specific class. It was generated by skill factory), 
   * taskId, stepIndex and reference of dbFilestoreMgr 
   * Output: Attribute value map Json
   */
  readIOMap(attrObj) {
    let iomap = attrObj.IOMap;

    return attrObj.skillRef["init"](attrObj).then(() => {
      let self = this,
          PromiseRequestsArr = [];

      /**
       * Recursive function to traverse the IO Map to translate IO Map into Attribute Value Map
       */
      (function traverseIOMap(parentObj, keyName, stateId, compId) {
        for (let key in parentObj[keyName]) {

          //Get StateID and CompID
          switch (keyName) {
            case "states":
              stateId = key;
              break;
            case "components":
              compId = key;
              break;
            default:
              break;
          }

          // if check to ensure that this iteration is for an element in which some translation has to be done
          // and not for some element in the hierarchy which doesn't need any translation for itself but has some child elements
          if (key === "function-name") {
            self._executeIOMapFunction(attrObj, { parentObj, keyName, stateId, compId }, PromiseRequestsArr);
          } else if (typeof parentObj[keyName][key] === "object") {
            traverseIOMap(parentObj[keyName], key, stateId, compId);
          }
        }
      })({ "iomap": iomap }, "iomap");

      return Promise.all(PromiseRequestsArr).then(() => {
        iomap.preloadResources = self._removeDuplicatePreloadResources(iomap.preloadResources);
        return Promise.resolve(iomap);
      }).catch(err => {
        console.log("Error in traverseIOMap function of IOTranslator: " + err.message);
        return Promise.reject(err);
      });
    }).catch(error => {
      console.log("Error in readIOMap function of IOTranslator: " + error.message);
      return Promise.reject(error);
    });
  }

  /**
   * Input: Preload Resources Array.
   * @param {*} preloadArray : It's an array that contains multiple objects each having file path and 
   * file type of preload resource.
   * Output: Array having Unique Preload Resources.
   */
  _removeDuplicatePreloadResources(preloadArray) {
    let tempObj = {};
    return preloadArray.filter(obj => {
      return tempObj[obj.path] ? false : tempObj[obj.path] = true;
    });
  }

  appendPreloadRes(preloadResArr, IOMap) {
    if (!IOMap["preloadResources"]) {
      IOMap["preloadResources"] = [];
    }
    for (var index = 0; index < preloadResArr.length; ++index) {
      IOMap["preloadResources"].push(preloadResArr[index]);
    }
  }

  getAttrValueMap(attrObj) {
    return this.readIOMap(attrObj).then(function (ioMap) {
      return Promise.resolve(ioMap);
    }, function (error) {
      return Promise.reject(error);
    });
  }
}
var iotranslatorobj = new IOTranslator();
module.exports = iotranslatorobj;