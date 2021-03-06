var express = require('express');
var router = express.Router();
var loginRouter = require('./login/login.route');
var taskBuilderData = require('./taskBuilderData');
var skillRoutes = require('./skill.routes');
var verifyToken = require('./login/verifyToken');
var userData = require('./userData');
var taskPreviewRouter = require('./taskpreview/taskPreview'),
    skilltestRoutes  = require('./skilltest/skilltest.routes.index');


module.exports = function () {
	router.use('/login', loginRouter());

	router.use('*', verifyToken);

	router.use('/taskPreview', taskPreviewRouter());
	router.use('/skill', skillRoutes);
  router.use('/fetchTaskData', taskBuilderData);
	router.use('/user', userData);
  router.use('/skilltest', skilltestRoutes);

  return router;
};
