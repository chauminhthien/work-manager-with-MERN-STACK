'use strict';

module.exports = function(Comment) {

	const enabledRemoteMethods = ['find', 'create'];
  Comment.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    // console.log(methodName);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      Comment.disableRemoteMethodByName(methodName);
    }
  });
};
