'use strict';

var pubsub 		= require('../../server/boot/pubsub.js');
var mess      = require('./../../errorMess/messagse.json');

module.exports = function(Project) {
	const enabledRemoteMethods = ['find', 'prototype.patchAttributes', 'create'];
  Project.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    // console.log(methodName);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      Project.disableRemoteMethodByName(methodName);
    }
  });
};
