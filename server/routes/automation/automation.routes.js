const router = require('express').Router();
const automationController = require('./../../controllers/automation.controller');

/**
 * Get list of templates
 * Return Type: Array
 */

router.get('/templates', (req, res) => {
  let appType = req.query.app;

  automationController.getTemplateList(appType)
    .then((templates) => {
      res.send(templates);
    }, (error) => {
      res.send(error);
    });

  /**
   * Sample:
   * [{
      "uuid": "sample-uuid-123",
      "name": "Move Cell Content",
      "meta": {
        "version": 1,
        "description": "Test template for skill related to move cell content",
        "skill": "move cell content",
        "app": "excel"
        }
    }]
   */

});

module.exports = router;
