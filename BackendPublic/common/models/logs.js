'use strict';

module.exports = function(Logs) {
	const enabledRemoteMethods = ['find', 'create'];
  Logs.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    // console.log(methodName);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      Logs.disableRemoteMethodByName(methodName);
    }
  });
};
