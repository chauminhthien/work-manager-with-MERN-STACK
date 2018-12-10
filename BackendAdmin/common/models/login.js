'use strict';

module.exports = function(Login) {
	const enabledRemoteMethods = ['find'];
  Login.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    // console.log(methodName);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      Login.disableRemoteMethodByName(methodName);
    }
  });

  Login.getChart = async function(cb) {
    let timeNow = Date.now();
    let fullDate = new Date(timeNow);
    let { userCurrent } = Login.app;

    let result = {
    	labels: [],
    	data : []
    }

    let where = !userCurrent.account_type ? {} : {
    	groupUserID: userCurrent.groupUserID,
      type : 0
    };


    let dd   = fullDate.getDate();
  	if( dd < 10 )  dd = '0' + dd;
  	let ddE = (+dd - 15 > 0) ? dd - 15 : 1;

  	let mm   = fullDate.getMonth() + 1;
  	if( mm < 10 )  mm = '0' + mm;

  	let yyyy   = fullDate.getFullYear();


  	for(let i = ddE; i <= dd; ++i){

  		let d        = `${mm}-${i}-${yyyy}`;
  		result.labels.push(d);

	    let timeStar = `${d} 00:00:00`; // strtotime($d . ' 00:00:00' );
	    let timeEnd  = `${d} 23:59:59`; // strtotime($d . ' 23:59:59' );

	    timeStar 	= new Date(timeStar).getTime();
	    timeEnd 	= new Date(timeEnd).getTime();

	    where = {
	    	...where,
	    	and : [
	    		{time : {gte: timeStar}},
	    		{time : {lte: timeEnd}},
	    	]
	    }

	    let count = await Login.count(where);
	    result.data.push(count);
	    
  	}
    cb(null, result)

  };

  Login.remoteMethod(
    'getChart', {
      http: {path: '/getChart', verb: 'get'},
      returns: {arg: '', type: 'object', root: true},
    }
  );

};
