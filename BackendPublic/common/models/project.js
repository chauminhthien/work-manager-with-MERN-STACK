'use strict';

var pubsub 		= require('../../server/boot/pubsub.js');
var mess      = require('./../../errorMess/messagse.json');
var fs = require('fs');

module.exports = function(Project) {
  const enabledRemoteMethods = ['find', 'prototype.patchAttributes', 'create'];
  Project.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    // console.log(methodName);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      Project.disableRemoteMethodByName(methodName);
    }
  });

  Project.upload = function(file, id, cb) {

    Project.findById(id)
      .then(res => {
        if(!res) return Promise.reject(mess.DATA_NOT_EXIST);

        file.req.params.container = `files`;
        let dirRoot = Project.app.get('dirUpload');
  			let dirPath = `${dirRoot}/files`;

        if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);

        let datafiles = [];
        Project.app.models.storagess.upload(file.req, file.result, {}, function(err, fileS){
          if(err) return Promise.reject(err);

          fileS.files['file'].forEach(e => {
          	let patchRoot   = Project.app.baseUrl;
          	let urlImg      = `${patchRoot}/uploads/files/${e.name}`;
          	datafiles.push({...e, url: urlImg})

          })

          res.files = [...res.files, ...datafiles];

          let { memberJoins, id, groupUserID } = res;
  			let { socketID, userCurrent } = Project.app;

  			memberJoins.forEach(e => {
		  		let dataMess = {
						userID: userCurrent.id,
						userIdTo: e.value,
						nameAction: "thêm file trong",
						nameWork: res.name,
						idWork: id,
						groupUserID,
						link: `/project/view/${id}`,
						time: Date.now()
					}

					Project.app.models.messages.create(dataMess)
		  			.then(res => {
		  				if(!!res){
		  					Project.app.models.messages.findById(res.id, {
		  						include: [
		                {relation: "usersFrom", scope: { fields: { fullname: true, avatar: true }}},
		                {relation: "userTo", scope: { fields: { fullname: true, avatar: true }}},
		              ]
		  					})
		  						.then(mess => {
		  							!!socketID[groupUserID][e.value] && !!mess && socketID[groupUserID][e.value].emit('SERVER_SEND_MESS', mess)
		  						})
		  				}
		  			})
				})

				let dataLog = {
						userID 			: userCurrent.id,
						nameAction	: "thêm file trong ",
						nameWork		: res.name,
						nameTask		: "",
						groupUserID,
						time				: Date.now()
					}

					// console.log(dataLog)

					Project.app.models.logs.create(dataLog)
						.then(log => {
							if(!!log){
								Project.app.models.logs.findById(log.id, {
									include : [
					          {relation: "users", scope: { fields: { fullname: true, avatar: true }}},
					        ]
								})
									.then(log => {
										!!log && !!socketID[groupUserID][userCurrent.id] && socketID[groupUserID][userCurrent.id].emit('SERVER_SEND_LOG', log);
										if(!!log && userCurrent.account_type === 2){
											Project.app.models.users.findOne({fields: ['id'], where: {groupUserID, account_type: 1}})
												.then(use => {
													!!use && !!use.id && socketID[groupUserID][use.id].emit('SERVER_SEND_LOG', log);
												})
										}
									})
								
							}
					})

          res.save();
          cb(null, {...res.__data});
        });

      }, e => Promise.reject(e))
      .catch(e => cb(e));
  };

  Project.remoteMethod(
      'upload',
      {
       http: {path: '/upload/:id', verb: 'post'},
       accepts: [
          {arg: 'file', type: 'object', 'http': {source: 'context'}},
          {arg: 'id', type: 'string', "required": true}
       ],
       returns: {arg: 'status', type: 'string'}
      }
  );

  Project.afterRemote('create', function (ctx, res, next) {
  	let { memberJoins, id, name, groupUserID } = res;
  	let { socketID, userCurrent } = Project.app;

  	let mail = `
  				<h2>
  					Bạn vừa mới được thêm vào một project,
  					<a href="http://acac.com/ascascac" >${name}</a>
  				</h2>`;
  	let socketGroup = socketID[groupUserID];
  	let dataLog = {
				userID 			: userCurrent.id,
				nameAction	: "thêm mới dự án",
				nameWork		: name,
				nameTask		: "",
				groupUserID,
				time				: Date.now()
			}

		Project.app.models.logs.create(dataLog)
			.then(log => {
				if(!!log){
					Project.app.models.logs.findById(log.id, {
						include : [
		          {relation: "users", scope: { fields: { fullname: true, avatar: true }}},
		        ]
					})
						.then(log => {
							!!log && !!socketID[groupUserID][userCurrent.id] && socketID[groupUserID][userCurrent.id].emit('SERVER_SEND_LOG', log);
							if(!!log && userCurrent.account_type === 2){
								Project.app.models.users.findOne({fields: ['id'], where: {groupUserID, account_type: 1}})
									.then(use => { console.log(use)
										!!use && !!use.id && socketID[groupUserID][use.id].emit('SERVER_SEND_LOG', log);
									})
							}
						})
					
				}
			})

  	memberJoins.forEach(e => {
  		if(!!socketGroup){
  			if(!!socketID[groupUserID][e.value])
  				!!socketID[groupUserID][e.value] && socketID[groupUserID][e.value].emit('SERVER_SEND_PROJECT_NEW', res)
  		}

  		let dataMess = {
					userID: userCurrent.id,
					userIdTo: e.value,
					nameAction: "Thêm bạn vào project",
					nameWork: name,
					idWork: id,
					groupUserID,
					link: `/project/view/${id}`,
					time: Date.now()
				}

  		Project.app.models.messages.create(dataMess)
  			.then(res => {
  				if(!!res){
  					Project.app.models.messages.findById(res.id, {
  						include: [
                {relation: "usersFrom", scope: { fields: { fullname: true, avatar: true }}},
                {relation: "userTo", scope: { fields: { fullname: true, avatar: true }}},
              ]
  					})
  						.then(mess => {
  							!!socketID[groupUserID][e.value] && !!mess && socketID[groupUserID][e.value].emit('SERVER_SEND_MESS', mess)
  						})
  				}
  			})

  		Project.app.models.email.sendEmail({
  			to: e.email,
  			subject: "Bạn vừa được thêm vào một dựa án",
  			html: mail
  		})
  	})

  	next();
  })

  Project.removeFile = function(name, id, cb) {

    Project.findById(id)
      .then(res => {
        if(!res) return Promise.reject(mess.DATA_NOT_EXIST);

        let dirRoot = Project.app.get('dirUpload');
  			let dirPath = `${dirRoot}/files/${name}`;

        if (fs.existsSync(dirPath)) fs.unlink(dirPath);

        res.files = res.files.filter(e => e.name !== name);

        let { memberJoins, id, groupUserID } = res;
  		let { socketID, userCurrent } = Project.app;

		memberJoins.forEach(e => {
	  		let dataMess = {
					userID: userCurrent.id,
					userIdTo: e.value,
					nameAction: "xoá file trong",
					nameWork: res.name,
					idWork: id,
					groupUserID,
					link: `/project/view/${id}`,
					time: Date.now()
				}

			Project.app.models.messages.create(dataMess)
	  			.then(res => {
	  				if(!!res){
	  					Project.app.models.messages.findById(res.id, {
	  						include: [
	                {relation: "usersFrom", scope: { fields: { fullname: true, avatar: true }}},
	                {relation: "userTo", scope: { fields: { fullname: true, avatar: true }}},
	              ]
	  					})
	  						.then(mess => {
	  							!!socketID[groupUserID][e.value] && !!mess && socketID[groupUserID][e.value].emit('SERVER_SEND_MESS', mess)
	  						})
	  				}
	  			})
		})

			let dataLog = {
					userID 			: userCurrent.id,
					nameAction	: "xoá file trong ",
					nameWork		: res.name,
					nameTask		: "",
					groupUserID,
					time				: Date.now()
				}

				// console.log(dataLog)

			Project.app.models.logs.create(dataLog)
				.then(log => {
					if(!!log){
						Project.app.models.logs.findById(log.id, {
							include : [
			          {relation: "users", scope: { fields: { fullname: true, avatar: true }}},
			        ]
						})
							.then(log => { 
								!!log && !!socketID[groupUserID][userCurrent.id] && socketID[groupUserID][userCurrent.id].emit('SERVER_SEND_LOG', log);
								if(!!log && userCurrent.account_type === 2){
									Project.app.models.users.findOne({fields: ['id'], where: {groupUserID, account_type: 1}})
										.then(use => { console.log(use.id)
											!!use && !!use.id && socketID[groupUserID][use.id].emit('SERVER_SEND_LOG', log);
										})
								}
							})
						
					}
				})

			res.save();

        cb(null, res);

      }, e => Promise.reject(e))
      .catch(e => cb(e));
  };

  Project.remoteMethod(
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


  Project.beforeRemote('prototype.patchAttributes', function (ctx, res, next) {
  	let { instance, args } = ctx;
  	let { data } =  args;

  	let { memberJoins, groupUserID } = data;
  	let { socketID, userCurrent } = Project.app;

  	let memberKill = [];
  	for(let val1 of instance.memberJoins){
		for(let val2 of memberJoins){ 
			if(val1.value === val2.value)  memberKill.push(val1.value);
  		}
	}

	// console.log(memberKill);

	let dataLog = {
		userID 			: userCurrent.id,
		nameAction		: (instance.name === data.name) ? "cập nhật dự án " : "đổi tên thành",
		nameWork		: instance.name,
		nameTask		: instance.name === data.name ? "" : `thành ${data.name}`,
		groupUserID,
		time			: Date.now()
	}
	Project.app.models.logs.create(dataLog)
		.then(log => {
			if(!!log){
				Project.app.models.logs.findById(log.id, {
					include : [
	          {relation: "users", scope: { fields: { fullname: true, avatar: true }}},
	        ]
				})
					.then(log => { 
						!!log && !!socketID[groupUserID][userCurrent.id] && socketID[groupUserID][userCurrent.id].emit('SERVER_SEND_LOG', log);
						if(!!log && userCurrent.account_type === 2){
							Project.app.models.users.findOne({fields: ['id'], where: {groupUserID, account_type: 1}})
								.then(use => { console.log(use.id)
									!!use && !!use.id && socketID[groupUserID][use.id].emit('SERVER_SEND_LOG', log);
								})
						}
					})
				
			}
		})

  		memberJoins.forEach(e => {
  			let dataMess = {
				userID: userCurrent.id,
				userIdTo: e.value,
				nameAction: "Cập nhật dự án",
				nameWork: data.name,
				idWork: instance.id,
				groupUserID,
				link: `/project/view/${instance.id}`,
				time: Date.now()
			}

  			if(memberKill.indexOf(e.value) === -1) {
  				let kill = true;
  				for(let val1 of instance.memberJoins){
  					if(val1.value === e.value) {
  						kill = false;
  						break;
  					}
  				}

  				if(!kill){
  					dataMess.nameAction = "Xoá bạn khỏi dự án";
  					dataMess.link 		= "#";
  					dataMess.status 	= 1;
  				}else{
  					dataMess.nameAction = "thêm bạn vào dự án";
  				}
  			}
	  		
			Project.app.models.messages.create(dataMess)
	  			.then(res => {
	  				if(!!res){
	  					Project.app.models.messages.findById(res.id, {
	  						include: [
				                {relation: "usersFrom", scope: { fields: { fullname: true, avatar: true }}},
				                {relation: "userTo", scope: { fields: { fullname: true, avatar: true }}},
				              ]
	  					})
  						.then(mess => {
  							!!socketID[groupUserID][e.value] && !!mess && socketID[groupUserID][e.value].emit('SERVER_SEND_MESS', mess)
  						})
	  				}
	  			})
		})

		next();

  	})

};
