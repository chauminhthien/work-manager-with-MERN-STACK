'use strict';

module.exports = function(Task) {
	const enabledRemoteMethods = ['find', 'prototype.patchAttributes', 'create'];
  Task.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    // console.log(methodName);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      Task.disableRemoteMethodByName(methodName);
    }
  });
};
