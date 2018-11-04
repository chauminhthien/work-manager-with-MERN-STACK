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
											.then(use => { 
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
	  						.then(mess => {
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
														.then(use => {
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

						if(memberId !== userCurrent.id.toString()){
							Task.app.models.messages.create(dataMess)
				  			.then(ress => {
				  				if(!!ress){
				  					Task.app.models.messages.findById(ress.id, {
				  						include: [
				                {relation: "usersFrom", scope: { fields: { fullname: true, avatar: true }}},
				                {relation: "userTo", scope: { fields: { fullname: true, avatar: true }}},
				              ]
				  					})
				  						.then(mess => { 
				  							!!socketID[groupUserID] && !!socketID[groupUserID][memberId] && !!mess && socketID[groupUserID][memberId].emit('SERVER_SEND_MESS', mess)
				  						})
				  				}
				  			});
						}

					res.save();
          cb(null, {...res.__data});
  			}, e => Promise.reject(e))
      })
      .catch(e => cb(e));
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

  //=======================================================

  Task.removeFile = function(name, id, cb) {

    Task.findById(id)
      .then(res => {
        if(!res) return Promise.reject(mess.DATA_NOT_EXIST);

        let dirRoot = Task.app.get('dirUpload');
  			let dirPath = `${dirRoot}/files/${name}`;

        if (fs.existsSync(dirPath)) fs.unlink(dirPath);
        res.files = res.files.filter(e => e.name !== name);


        let { memberId, name: nameTask, id, groupUserID, projectId } = res.__data;
  			let { socketID, userCurrent } = Task.app;

				let dataLog = {
					userID 			: userCurrent.id,
					nameAction	: "xoá mới file trong ",
					nameWork		: nameTask,
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
													.then(use => {
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
					nameAction: "xoá file vào task",
					nameWork: nameTask,
					idWork: id,
					groupUserID,
					link: `/task/view/${id}`,
					time: Date.now()
				}

				if(memberId !== userCurrent.id.toString()){
					Task.app.models.messages.create(dataMess)
		  			.then(ress => {
		  				if(!!ress){
		  					Task.app.models.messages.findById(ress.id, {
		  						include: [
		                {relation: "usersFrom", scope: { fields: { fullname: true, avatar: true }}},
		                {relation: "userTo", scope: { fields: { fullname: true, avatar: true }}},
		              ]
		  					})
		  						.then(mess => { 
		  							!!socketID[groupUserID] && !!socketID[groupUserID][memberId] && !!mess && socketID[groupUserID][memberId].emit('SERVER_SEND_MESS', mess)
		  						})
		  				}
		  			});
				}

				res.save();
        cb(null, {...res.__data});
      }, e => Promise.reject(e))
      .catch(e => cb(e));
  };

  Task.remoteMethod(
      'removeFile',
      {
       http: {path: '/removeFile/:id', verb: 'post'},
       accepts: [
          {arg: 'name', type: 'string', "required": true},
          {arg: 'id', type: 'string', "required": true}
       ],
       returns: {arg: 'status', type: 'string'}
      }
  );

  //============================================

  Task.beforeRemote('prototype.patchAttributes', function (ctx, res, next) {
  	let { instance, args } = ctx;
  	let { data } =  args;

  	let { groupUserID, id, name, memberId } = instance;

  	let { socketID, userCurrent } 	= Task.app;
  	
  	if(instance.process === data.process){
	  	let dataLog = {
				userID 			: userCurrent.id,
				nameAction		: (instance.name === data.name) ? "cập nhật task " : "đổi tên thành",
				nameWork		: instance.name,
				nameTask		: instance.name === data.name ? "" : `thành ${data.name}`,
				groupUserID,
				time			: Date.now()
			}

			let mail = `
	  				<h2>
	  					Bạn vừa mới được thêm vào một Task,
	  					<a href="http://acac.com/ascascac" >${name}</a>
	  				</h2>`;

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
										.then(use => {
											!!use && !!use.id && socketID[groupUserID][use.id].emit('SERVER_SEND_LOG', log);
										})
								}
							})
					}
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
	  						.then(mess => {
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
		}else{
			let { id } = instance;

			let cmt = {
	     	taskId: id,
	     	groupUserID: userCurrent.groupUserID,
	     	userId: userCurrent.id,
	     	content: "Cập nhật tiến độ công việc",
	     	files: [],
	     	time: Date.now()
	    }

	    Task.app.models.comment.create(cmt)
	    	.then(e => {
	    		if(!!e){
	    			let { taskId, groupUserID, userId } = e.__data;

	    			Task.findById(taskId)
	    				.then(task => {
	    					if(!!task){
	    						if(data.process === 100){
	    							task.timeFisnish = Date.now();
	    							task.save();
	    						}

	    						let { memberCmt } = task.__data;
	    						if(memberCmt.indexOf(userCurrent.id.toString()) === -1)
    								memberCmt.push(userCurrent.id.toString());

    							for(let key of memberCmt){
    								let dataMess = {
											userID: userCurrent.id,
											userIdTo: key,
											nameAction: "Cập nhật tiến độ công việc",
											nameWork: task.name,
											idWork: task.id,
											groupUserID,
											link: `/task/view/${task.id}`,
											time: Date.now()
										}

										console.log(key !== userCurrent.id.toString());
										if(key !== userCurrent.id.toString()) {
											Task.app.models.messages.create(dataMess)
								  			.then(ress => {
								  				if(!!ress){
								  					Task.app.models.messages.findById(ress.id, {
								  						include: [
								                {relation: "usersFrom", scope: { fields: { fullname: true, avatar: true }}},
								                {relation: "userTo", scope: { fields: { fullname: true, avatar: true }}},
								              ]
								  					})
								  						.then(mess => {
								  							!!socketID[groupUserID] && !!socketID[groupUserID][key] && !!mess && socketID[groupUserID][key].emit('SERVER_SEND_MESS', mess);
								  							!!socketID[groupUserID] && !!socketID[groupUserID][key] && !!mess && socketID[groupUserID][key].emit('SERVER_SEND_TASK', task);
								  						})
								  				}
								  			});
								  		
								  		// !!socketID[groupUserID] && !!socketID[groupUserID][key] && !!mess && socketID[groupUserID][key].emit('SERVER_SEND_COMMENT', e);
										}
										!!socketID[groupUserID] && !!socketID[groupUserID][key] && !!mess && socketID[groupUserID][key].emit('SERVER_SEND_COMMENT', e);
    							}
	    					}
	    				})
	    		}
	    	})

		}

		next();
  })
};
