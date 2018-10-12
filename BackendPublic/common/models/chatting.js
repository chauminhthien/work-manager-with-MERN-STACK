'use strict';

var pubsub = require('../../server/boot/pubsub.js');
var mess      = require('./../../errorMess/messagse.json');
module.exports = function(Chatting) {

	const enabledRemoteMethods = ['find', 'prototype.patchAttributes', 'create'];
  Chatting.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    // console.log(methodName);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      Chatting.disableRemoteMethodByName(methodName);
    }
  });

  Chatting.afterRemote('create', function (ctx, res, next) {

    // var socket = Chatting.app.io;
    let id = ctx.result.idFriend;

    let { socketID, userCurrent } = Chatting.app;
    let socket = socketID[userCurrent.groupUserID] ? socketID[userCurrent.groupUserID] : {};

    Chatting.findById(ctx.result.id, {
      include: [
        {relation: "me", scope: { fields: { avatar: true }}},
        {relation: "friend", scope: { fields: { avatar: true }}},
      ]
    })
    .then(res => {
      if(!res) return Promise.reject(mess.SERVER_DISCONNECT);
      pubsub.toID(id, socket, {
        name : 'CHATTING_NEW_MESS',
        data: res,
      });

      ctx.result = res;
      next();
    })
    .catch(e => next(e))
	});


  // ========================== METHOD fetchMessAllFr ================================//
  Chatting.findData  = async function(idMe, data){
    let result = {};
    try {
      for(let idFr of data){
        let dt = await Chatting.find({where: {
            and: [
              {
                or :[ { idFriend: idFr }, { idFriend: idMe } ]
              },
              {
                or :[ { idMe: idFr }, { idMe: idMe } ]
              }
            ]
          },
          limit: 10, skip: 0,
          order: "id DESC",
          include: [
            {relation: "me", scope: { fields: { avatar: true }}},
            {relation: "friend", scope: { fields: { avatar: true }}},
          ]
        })

        result[idFr] = dt.reverse();
      }
      return Promise.resolve(result);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  Chatting.fetchMessAllFr = async function(res, cb) {
    let idMe = Chatting.app.userCurrent.id;
    let { data } = res;
    let result = {};


    if(!!data && data.length > 0){
      try {
        let dt = await this.findData(idMe, data, cb);

        return cb(null, dt);
      } catch (err) {
        throw err;
      }
      
    }else return cb(mess.DATA_NO_MATCH)
  };

  Chatting.remoteMethod(
    'fetchMessAllFr', {
      http: {path: '/fetchMessAllFr', verb: 'post'},
      accepts: {arg: 'data', type: 'object', http: {source: 'body'}},
      returns: {arg: 'res', type: 'object', root: true},
    }
  );

   
};
