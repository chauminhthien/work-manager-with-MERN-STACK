'use strict';

module.exports = function(Comment) {

	const enabledRemoteMethods = ['find'];
  Comment.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    // console.log(methodName);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      Comment.disableRemoteMethodByName(methodName);
    }
  });

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


};
