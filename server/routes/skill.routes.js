const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skill.controller');
//const dbFileStoreController = require('../controllers/dbFileStoreController');

router.get('/uiconfig/:templateId', (req, res) => {
    let templateId = req.params.templateId;
    let data = {};
    skillController.getUIConfig(req.params.templateId, data, (error, data) => {
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
    dbFileStoreController.getSkillXML(req.params.templateId, (error, data) => {
        if(!error) {
            res.json(data);
        }
        else {
            res.json(error);
        }
    });
});

router.get('/iomap/:templateId', (req, res) => {
    dbFileStoreController.getIOMap(req.params.templateId, (error, data) => {
        if(!error) {
            res.json(JSON.parse(data));
        }
        else {
            res.json(error);
        }
    });
});

router.get('/skillmodel/:templateId', (req, res) => {
    dbFileStoreController.getSkillModel(req.params.templateId, (error, data) => {
        if(!error) {
            res.json(JSON.parse(data));
        }
        else {
            res.json(error);
        }
    });
});

router.get('/stepui/:taskId/:stateIndex', (req, res) => {
    dbFileStoreController.getStepUIState(req.params.taskId, req.params.stateIndex, (data, error) => {
        if(!error) {
            res.json(data);
        }
        else {
            res.json(error);
        }
    });
});*/

module.exports = router;