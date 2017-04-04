const multer = require('multer');
const mkdirp = require('mkdirp');

const uiHandler = require('../modules/skill/uiHandler');
const dbFilestoreMgr = require('../modules/skill/dbFilestoreMgr');
const xmlGenerationHandler = require('../modules/skill/xmlGenerationHandler');
const skillFactory  = require("../modules/skill/skillFactory")

class SkillController {

    getStepUIConfig(templateId, taskId, stepIndex) {
        return uiHandler.getStepUIConfig(templateId, taskId, stepIndex);
    }
    
    getUIConfig(templateId) {
        return dbFilestoreMgr.getUIConfig(templateId);
    }

    getSkillModel(templateId) {
        return dbFilestoreMgr.getSkillModel(templateId);
    }

    getStepUIState(taskId, stepIndex) {
        return dbFilestoreMgr.getStepUIState(taskId, stepIndex);
    }

    saveStepUIState(taskId, stepIndex, stepUIData) {
        return dbFilestoreMgr.saveStepUIState(taskId, stepIndex, stepUIData);
    }

    generateXML(templateId, taskId, stepIdx, callback) {
        var skill = skillFactory.getSkillObject(templateId);
        xmlGenerationHandler.generateStepXML(templateId, taskId, stepIdx, skill, callback);
    }

    saveResourceFile() {
        return dbFilestoreMgr.saveResourceFile();
    }
};

module.exports = new SkillController();


