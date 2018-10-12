'use strict';
//Writing pubsub module for socket.io
const app = require('loopback');

module.exports = {
    //Publishing a event..
  publish: function(socket, options ){
    if(options){
      var collectionName = options.collectionName;
      var method         = options.method;
      var data           = options.data;
      var modelId        = options.modelId;

      if(method === 'POST'){
          
        var name = '/' + collectionName + '/' + method;
        
        socket.emit(name, data);
      }
      else{
        var name = '/' + collectionName + '/' + modelId + '/' + method;
        socket.emit(name, data);
      }  
    }else{
      throw 'Error: Option must be an object type';
    }
  },

  toID: function(id, socket, options ){
    if(options){
      let { name, data } = options;
      
      !!socket[id] && socket[id].emit(name, data);
    }else{
      throw 'Error: Option must be an object type';
    }
  }, 

  isEmpty:function (obj) {
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    // null and undefined are "empty"
    if (obj == null) return true;

    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    for (var key in obj) {
        if (this.hasOwnProperty.call(obj, key)) return false;
    }
    return true;
  } 
}