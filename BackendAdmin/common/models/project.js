'use strict';

module.exports = function(Project) {
  const enabledRemoteMethods = ['find'];
  Project.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    // console.log(methodName);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      Project.disableRemoteMethodByName(methodName);
    }
  });

  Project.getChart = async function(idProject, cb) {
    let timeNow = Date.now();
    let fullDate = new Date(timeNow);
    let { userCurrent } = Project.app;

    let result = [];

	let listTask = await Project.app.models.task.find({where: {projectId: idProject}})
   	
   	let com 	= 0;
   	let pen 	= 0;
   	let notC 	= 0;
   	let no 		= 0;
   	let time 	= Date.now();

   	if(!!listTask){
   		for(let val of listTask){
   			if(time < val.begin && !val.finish) ++no;
   			else if(time > val.end && !val.finish) ++notC;
   			else if(!!val.finish) ++com;
   			else ++pen
   		}
   	}

   	result = [
   		{ key: 0, data: [com] },
   		{ key: 1, data: [pen] },
   		{ key: 2, data: [notC] },
   		{ key: 3, data: [no] },
   	]
    

    cb(null, result)

  };

  Project.remoteMethod(
    'getChart', {
      http: {path: '/getChart', verb: 'post'},
      accepts: {arg: 'idProject', type: 'string'},
      returns: {arg: '', type: 'object', root: true},
    }
  );

};
