'use strict';

var loopback  = require('loopback');
var boot      = require('loopback-boot');
var mess      = require('./../errorMess/messagse.json');
var app       = module.exports = loopback();

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
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
  if (require.main === module)
    app.start();
});

// app.options("*", cors());
// app.use(cors());

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
                {or: [{account_type: 0}, {account_type: 1}]}
              ]}
            })
          }, e => Promise.reject(e))
          .then(dataU => {
            if (null === dataU) return Promise.reject(mess.ACCESS_TOKEN_INVALID);
            let { account_type, groupUserID } = dataU;
            app.userCurrent = dataU;
            if(!!account_type){
              app.models.groupUser.findById(groupUserID)
                .then(userGr => {
                  if(!userGr) return res.json({error: mess.YOU_NOT_PERMISSION, data: null});
                  if(!userGr.status) return res.json({error: mess.USER_DISABLED, data: null}); 

                  let { begin, end } = userGr;
                  let now = Date.now();
                  if(begin > now || now > end) return res.json({error: mess.YOU_NOT_PERMISSION, data: null});
                  next();
                })
            } else next();
          }, e => Promise.reject(e))
          .catch(e => res.json({error: e, data: null}));
    } else next();
  } else return res.json({error: mess.SERECT_KEY_NOT_EXIST, data: null});
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
