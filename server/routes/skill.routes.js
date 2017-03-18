const express = require('express');
const router = express.Router();
const skillControllerObj = require('../controllers/skill.controller');
//const dbFilestoreMgr = require('../modules/skill/dbFilestoreMgr');

router.get('/uiconfig/:templateId', (req, res) => {
    let templateId = req.params.templateId;
    let data = {};
    skillControllerObj.getUIConfig(req.params.templateId, data, (error, data) => {
        if(!error) {
            res.json(JSON.parse(data));
        }
        else {
            res.json(error);
        }
    });
});
/*
router.get('/skillxml/:templateId', (req, res) => {
    dbFilestoreMgr.getSkillXML(req.params.templateId, (error, data) => {
        if(!error) {
            res.json(data);
        }
        else {
            res.json(error);
        }
    });
});

router.get('/iomap/:templateId', (req, res) => {
    dbFilestoreMgr.getIOMap(req.params.templateId, (error, data) => {
        if(!error) {
            res.json(JSON.parse(data));
        }
        else {
            res.json(error);
        }
    });
});

router.get('/skillmodel/:templateId', (req, res) => {
    dbFilestoreMgr.getSkillModel(req.params.templateId, (error, data) => {
        if(!error) {
            res.json(JSON.parse(data));
        }
        else {
            res.json(error);
        }
    });
});

router.get('/stepui/:taskId/:stepIndex', (req, res) => {
    dbFilestoreMgr.getStepUIState(req.params.taskId, req.params.stepIndex, (data, error) => {
        if(!error) {
            res.json(data);
        }
        else {
            res.json(error);
        }
    });
});
*/
router.post('/taskstep/:taskId/:stepIndex', (req, res) => {
    let data = req.body.data;
    skillControllerObj.saveStepUIState(req.params.taskId, req.params.stepIndex, data, (error, data) => {
        if(!error) {
            res.json(data);
        }
        else {
            res.json(error);
        }
    });
});

router.get('/generatexml/:templateId/:taskid/:stepidx', (req, res) => {
    let templateId = req.params.templateId;
    let taskId = req.params.taskid;
    let stepIdx = req.params.stepidx;
    
    skillControllerObj.generateXML(templateId, taskId, stepIdx, (error) => {
        if (!error) {
            res.end("success");
        } else {
            res.send(error);
        }
    });
});

router.post("/uploadresource", (req, res) => {
    let templateId = "";
    let taskId = "EXP16.WD.03.01.03.T1";
    let stepIndex = 1;
    let upload = skillControllerObj.saveResourceFile(templateId, taskId, stepIndex);
    upload(req, res, (error) => {
        if(error) {
            res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});

module.exports = router;