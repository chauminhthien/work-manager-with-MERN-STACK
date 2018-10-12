'use strict';

var loopback  = require('loopback');
var boot      = require('loopback-boot');
var mess      = require('./../errorMess/messagse.json');
var app       = module.exports = loopback();

let socketID = {};

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    app.baseUrl = app.get('baseUrl');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;
  
  // start the server if `$ node server.js`
  if (require.main === module){

    app.io = require('socket.io')(app.start());

    app.io.on('connection', function(socket){
      let id = null;
      socket.on('setSocketId', (id) => {


        app.models.users.findById(id, {fields: ['groupUserID']})
          .then(res => {
            if(!!res) {
              let { groupUserID } = res;
              socketID[groupUserID] = {
                ...socketID[groupUserID],
                [id]: app.io.sockets.connected[socket.id]
              };
              app.socketID = socketID;
              let dataClientOnlie = Object.keys(socketID[groupUserID]);
              for(let i in socketID[groupUserID]){
                socketID[groupUserID][i].emit('SERVER_SEND_UERS_ONLINE', dataClientOnlie)
              }
            }
          })
      })

      socket.on('disconnect', function(){
        let { id } = socket;
        let idG = null;
        let fl = true;
        for (let idGroup in socketID){
          if(!!socketID[idGroup]){
            let group = socketID[idGroup];

            for(let idUer in group){
              if(id === group[idUer].id){
                idG = idGroup;
                fl = false;
                delete socketID[idGroup][idUer];
                break;
              }
            }

            if(!!fl) break;
          }
        }

        if(!!socketID[idG]){
          let dataClientOnlie = Object.keys(socketID[idG]);
          for(let i in socketID[idG]){
            socketID[idG][i].emit('SERVER_SEND_UERS_ONLINE', dataClientOnlie)
          }
        }

      });
    });
  }

});

app.use(function(req, res, next) {
 
  let restApiRoot        = app.get('restApiRoot');
  let serectkey          = req.headers['serectkey'];
  let keyConfig          = app.get('serectkey');
  let serectKeyModel     = app.models.serectServer;
  let ip                 = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  let accessToken        = req.headers['access-token'];
  let urlReuest          = req.url;

  let noAccessToken = [
    `${restApiRoot}/users/login`,
    `${restApiRoot}/users/forgotPassword`,
    `${restApiRoot}/users/checkToken`,
    `${restApiRoot}/users/accessForgotPassword`,
    `${restApiRoot}/emails/sendEmail`,
  ];

  if(urlReuest.indexOf(restApiRoot) !== -1){
    if (undefined !== serectkey || serectkey !== keyConfig) {
      if (noAccessToken.indexOf(urlReuest) === -1) {

        if (undefined === accessToken || accessToken == "") 
          return res.json({error: {...mess.ACCESS_TOKEN_NOT_EXIST, messagse: "You not permisstion"}, data: null});

          app.models.AccessToken.findById(accessToken)
            .then(dataToken => {
              if (null === dataToken) return Promise.reject(mess.ACCESS_TOKEN_INVALID);
              return app.models.Users.findOne({
                where: { and: [
                  {id: dataToken.userId},
                  {or: [{account_type: 1}, {account_type: 2}]}
                ]}
              })
            }, e => Promise.reject(e))
            .then(dataU => {
              if (null === dataU) return Promise.reject(mess.ACCESS_TOKEN_INVALID);
              if(dataU.status === 0 ) return Promise.reject(mess.USER_DISABLED);
              app.userCurrent = dataU;

              next();
            }, e => Promise.reject(e))
            .catch(e => res.json({error: e, data: null}));
      } else next();
    } else return res.json({error: mess.SERECT_KEY_NOT_EXIST, data: null});
  } else next()

});

app.get('remoting').errorHandler = {
  handler: function(error, req, res, next) {
    if (error instanceof Error) {
      let {message, statusCode, name, ...rest} = error;
      res.json({
        error: {
          messagse: message,
          statusCode,
          name,
          num: statusCode,
          ...rest
        },
        data: null
      });
    }
    next();
  },
  disableStackTrace: true,
};
