'use strict';

var mess      = require('./../../errorMess/messagse.json');
var fs = require('fs');

module.exports = function(Comment) {

	const enabledRemoteMethods = ['find', 'create'];
  Comment.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    // console.log(methodName);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      Comment.disableRemoteMethodByName(methodName);
    }
  });

  Comment.upload = function(file, id, cb) {

    file.req.params.container = 'files';
    let dirRoot = Comment.app.get('dirUpload');
    let dirPath = `${dirRoot}/files`;
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);

    Comment.app.models.storagess.upload(file.req, file.result, {}, function(err, fileS){
      if(err) return Promise.reject(err);

      let data        = fileS.files['file'][0];
      let patchRoot   = Comment.app.baseUrl;
      let urlImg      = `${patchRoot}/uploads/files/${data.name}`;
      data.url 		  = urlImg;
    	
    	let { socketID, userCurrent } = Comment.app;

	    let cmt = {
	     	taskId         : id,
	     	groupUserID    : userCurrent.groupUserID,
	     	userId         : userCurrent.id,
	     	content        : "",
	     	files          : data,
	     	time           : Date.now(),
        parentId       : "null"
	    }

      
      Comment.create(cmt)
      	.then(e => {
      		if(!e) return Promise.reject(mess.SERVER_DISCONNECT);
      		let { taskId, groupUserID, userId } = e.__data;

      		Comment.app.models.task.findById(taskId)
      			.then(task => {
      				if(!!task){
      					let { memberCmt } = task.__data;
      					for(let key of memberCmt){
			  					if(key !== userCurrent.id.toString()) {
										let dataMess = {
											userID: userCurrent.id,
											userIdTo: key,
											nameAction: "tải tệp lên",
											nameWork: task.name,
											idWork: task.id,
											groupUserID,
											link: `/task/view/${task.id}`,
											time: Date.now()
										}

										Comment.app.models.messages.create(dataMess)
							  			.then(ress => {
							  				if(!!ress){
							  					Comment.app.models.messages.findById(ress.id, {
							  						include: [
							                {relation: "usersFrom", scope: { fields: { fullname: true, avatar: true }}},
							                {relation: "userTo", scope: { fields: { fullname: true, avatar: true }}},
							              ]
							  					})
							  						.then(mess => {
							  							!!socketID[groupUserID] && !!socketID[groupUserID][key] && !!mess && socketID[groupUserID][key].emit('SERVER_SEND_MESS', mess)
							  							!!socketID[groupUserID] && !!socketID[groupUserID][key] && !!mess && socketID[groupUserID][key].emit('SERVER_SEND_COMMENT', e)
							  						})
							  				}
							  			});
									}
			  				}
      				}
      			})
      		cb(null, e.__data)
      	})
      	.catch(e => cb(e))
    });

  };

  Comment.remoteMethod(
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

  Comment.afterRemote('find', async function(ctx, res, next) {

    if (!!res) { 
      let data = [];
      for(let cmt of res){
        let { id } = cmt;
        if(!!id){

          let children = await Comment.find({
            where: {parentId: id},
            order: "id ASC"
          })
          cmt.children = children;
        
        }
        
        data.push(cmt);
      }
      ctx.result = data;
      next()
    } else next(mess.SERVER_DISCONNECT);
  })

  Comment.afterRemote('create', async function(ctx, res, next) {
    let { taskId, groupUserID, userId } = res;
    let { socketID, userCurrent } = Comment.app;

    Comment.app.models.task.findById(taskId)
    	.then(task => {
    		if(!!task){
    			let { memberCmt } = task.__data;
    			if(memberCmt.indexOf(userCurrent.id.toString()) === -1){
    				memberCmt.push(userCurrent.id.toString());
    			}

    			for(let tag of res.userTags){
    				if(memberCmt.indexOf(tag.value) === -1)
    					memberCmt.push(tag.value);
    			}

    			if(memberCmt.indexOf(userId) === -1)
    					memberCmt.push(userId);

    			task.memberCmt = memberCmt;

  				for(let id of memberCmt){
  					if(id !== userCurrent.id.toString()) {
							let dataMess = {
								userID: userCurrent.id,
								userIdTo: id,
								nameAction: "đã bình luận vào",
								nameWork: task.name,
								idWork: task.id,
								groupUserID,
								link: `/task/view/${task.id}`,
								time: Date.now()
							}

							Comment.app.models.messages.create(dataMess)
				  			.then(ress => {
				  				if(!!ress){
				  					Comment.app.models.messages.findById(ress.id, {
				  						include: [
				                {relation: "usersFrom", scope: { fields: { fullname: true, avatar: true }}},
				                {relation: "userTo", scope: { fields: { fullname: true, avatar: true }}},
				              ]
				  					})
				  						.then(mess => {
				  							!!socketID[groupUserID] && !!socketID[groupUserID][id] && !!mess && socketID[groupUserID][id].emit('SERVER_SEND_MESS', mess)
				  							!!socketID[groupUserID] && !!socketID[groupUserID][id] && !!mess && socketID[groupUserID][id].emit('SERVER_SEND_COMMENT', res)
				  						})
				  				}
				  			});
						}
  				}
  				task.save();
    			
    		}
    	})
    next();
  })

};
