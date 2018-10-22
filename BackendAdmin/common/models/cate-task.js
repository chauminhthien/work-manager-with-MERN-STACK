'use strict';

module.exports = function(Catetask) {
	const enabledRemoteMethods = ['find', 'create', 'deleteById', 'prototype.patchAttributes'];
  Catetask.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    // console.log(methodName);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      Catetask.disableRemoteMethodByName(methodName);
    }
  });
};
