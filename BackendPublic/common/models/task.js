'use strict';
var fs = require('fs');
var mess      = require('./../../errorMess/messagse.json');

module.exports = function(Task) {
	const enabledRemoteMethods = ['find', 'prototype.patchAttributes', 'create'];
  Task.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    // console.log(methodName);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      Task.disableRemoteMethodByName(methodName);
    }
  });

  //========================

  Task.afterRemote('create', function (ctx, res, next) {
  	let { memberId, id, name, groupUserID, projectId } = res.__data;
  	let { socketID, userCurrent } = Task.app;

  	let mail = `
  				<h2>
  					Bạn vừa mới được thêm vào một Task,
  					<a href="http://acac.com/ascascac" >${name}</a>
  				</h2>`;
  	let socketGroup = socketID[groupUserID];
  	let dataLog = {
				userID 			: userCurrent.id,
				nameAction	: "thêm mới taks",
				nameWork		: name,
				nameTask		: "",
				groupUserID,
				time				: Date.now()
			}

		Task.app.models.project.findById(projectId)
			.then(pro => {
				if(!!pro) dataLog.nameTask = pro.name;

				Task.app.models.logs.create(dataLog)
					.then(log => {
						if(!!log){
							Task.app.models.logs.findById(log.id, {
								include : [
				          {relation: "users", scope: { fields: { fullname: true, avatar: true }}},
				        ]
							})
								.then(log => {
									!!log && !!socketID[groupUserID][userCurrent.id] && socketID[groupUserID][userCurrent.id].emit('SERVER_SEND_LOG', log);
									if(!!log && userCurrent.account_type === 2){
										Task.app.models.users.findOne({fields: ['id'], where: {groupUserID, account_type: 1}})
											.then(use => { console.log(use)
												!!use && !!use.id && socketID[groupUserID][use.id].emit('SERVER_SEND_LOG', log);
											})
									}
								})
							
						}
					})
			})

			let dataMess = {
				userID: userCurrent.id,
				userIdTo: memberId,
				nameAction: "Thêm bạn vào Task",
				nameWork: name,
				idWork: id,
				groupUserID,
				link: `/task/view/${id}`,
				time: Date.now()
			}


			if(memberId !== userCurrent.id){
				Task.app.models.messages.create(dataMess)
	  			.then(ress => {
	  				if(!!ress){
	  					Task.app.models.messages.findById(ress.id, {
	  						include: [
	                {relation: "usersFrom", scope: { fields: { fullname: true, avatar: true }}},
	                {relation: "userTo", scope: { fields: { fullname: true, avatar: true }}},
	              ]
	  					})
	  						.then(mess => { console.log(mess)
	  							!!socketID[groupUserID] && !!socketID[groupUserID][memberId] && !!mess && socketID[groupUserID][memberId].emit('SERVER_SEND_MESS', mess)
	  						})
	  				}
	  			});

	  		Task.app.models.users.findById(memberId)
	  			.then(r => {
	  				!!r && Task.app.models.email.sendEmail({
						  			to: r.email,
						  			subject: "Bạn vừa được thêm vào một stask của dựa án",
						  			html: mail
						  		})
	  			})
	  		
			}

  	next();
  })

  // =======================================================

  Task.upload = function(file, id, cb) {
		let { socketID, userCurrent } = Task.app;

    Task.findById(id)
      .then(res => {
      	if(!res) return Promise.reject(mess.DATA_NOT_EXIST);

      	file.req.params.container = `files`;
      	let dirRoot = Task.app.get('dirUpload');
  			let dirPath = `${dirRoot}/files`;
  			if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);

  			let datafiles = [];

  			Task.app.models.storagess.upload(file.req, file.result, {}, function(err, fileS){
  			 	if(err) return Promise.reject(err);

  			 	fileS.files['file'].forEach(e => {
          	let patchRoot   = Task.app.baseUrl;
          	let urlImg      = `${patchRoot}/uploads/files/${e.name}`;
          	datafiles.push({...e, url: urlImg})
          })

          res.files = [...res.files, ...datafiles];

          let { memberId, name, id, groupUserID, projectId } = res.__data;

          let dataLog = {
						userID 			: userCurrent.id,
						nameAction	: "thêm mới file trong ",
						nameWork		: name,
						nameTask		: "",
						groupUserID,
						time				: Date.now()
					}

					Task.app.models.project.findById(projectId)
						.then(pro => {
							if(!!pro) dataLog.nameTask = pro.name;

							Task.app.models.logs.create(dataLog)
								.then(log => {
									if(!!log){
										Task.app.models.logs.findById(log.id, {
											include : [
							          {relation: "users", scope: { fields: { fullname: true, avatar: true }}},
							        ]
										})
											.then(log => {
												!!log && !!socketID[groupUserID][userCurrent.id] && socketID[groupUserID][userCurrent.id].emit('SERVER_SEND_LOG', log);
												if(!!log && userCurrent.account_type === 2){
													Task.app.models.users.findOne({fields: ['id'], where: {groupUserID, account_type: 1}})
														.then(use => { console.log(use)
															!!use && !!use.id && socketID[groupUserID][use.id].emit('SERVER_SEND_LOG', log);
														})
												}
											})
										
									}
								})
						})

						let dataMess = {
							userID: userCurrent.id,
							userIdTo: memberId,
							nameAction: "Thêm file vào task",
							nameWork: name,
							idWork: id,
							groupUserID,
							link: `/task/view/${id}`,
							time: Date.now()
						}


						if(memberId !== userCurrent.id){
							Task.app.models.messages.create(dataMess)
				  			.then(ress => {
				  				if(!!ress){
				  					Task.app.models.messages.findById(ress.id, {
				  						include: [
				                {relation: "usersFrom", scope: { fields: { fullname: true, avatar: true }}},
				                {relation: "userTo", scope: { fields: { fullname: true, avatar: true }}},
				              ]
				  					})
				  						.then(mess => { console.log(mess)
				  							!!socketID[groupUserID] && !!socketID[groupUserID][memberId] && !!mess && socketID[groupUserID][memberId].emit('SERVER_SEND_MESS', mess)
				  						})
				  				}
				  			});

				  		Task.app.models.users.findById(memberId)
				  			.then(r => {
				  				!!r && Task.app.models.email.sendEmail({
									  			to: r.email,
									  			subject: "Bạn vừa được thêm vào một stask của dựa án",
									  			html: mail
									  		})
				  			})
				  		
						}

					res.save();
          cb(null, {...res.__data});


  			}, e => Promise.reject(e))
  			.catch(e => cb(e));
      })
  };

  Task.remoteMethod(
      'upload',
      {
       http: {path: '/upload/:id', verb: 'post'},
       accepts: [
          {arg: 'file', type: 'object', 'http': {source: 'context'}},
          {arg: 'id', type: 'string', "required": true}
       ],
       returns: {arg: 'res', type: 'object', root: true}
      }
  );

};
