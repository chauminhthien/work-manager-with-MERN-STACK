'use strict';
var app = require('../server');

module.exports = function(Noti) {
// console.log(Noti.userCurrent)

  // console.log(Noti.userCurrent);
  setInterval(function(){
    let now = Date.now();
    let min = 1000*60;

    Noti.models.task.find({where: {
      and: [
            { finish: 0 },
            { process: {lt: 100} },
        ]
    }})
    .then(resData => {
      if(!!resData){
        let { socketID } = Noti;

        for(let data of resData){
          let { name, memberId, groupUserID, begin, end, createAt, relateMember } = data.__data;

          //=================== begin === now
          let range = now - begin;
          range = range < 0 ? range*(-1) : range;

          if(range >= 0 && range <= min){
            if(!!socketID && socketID[groupUserID]){
              if(!!socketID[groupUserID][memberId]){
                socketID[groupUserID][memberId].emit('SERVER_SEND_TASK_NOT_NOTY', {data, mess: {type: 0, m: "Bạn có một công việc sắp bắt đầu"}});

                let mess = `
                  <h1>Công việc <strong>${name} </strong> của bạn sẽ bắt đầu từ lúc ${convertTime(begin)}.</h1>
                  Chúc bạn một ngày làm việc vui vẽ`;
                sendMail(Noti, memberId, mess);
              } 

              if(!!socketID[groupUserID][createAt]){
                socketID[groupUserID][createAt].emit('SERVER_SEND_TASK_NOT_NOTY', {data, mess: {type: 0, m: "Bạn có một công việc sắp bắt đầu"}});

                let mess = `
                  <h1>Công việc <strong>${name} đã giao </strong> sẽ bắt đầu từ lúc ${convertTime(begin)}.</h1>
                  Chúc bạn một ngày làm việc vui vẽ`;
                sendMail(Noti, createAt, mess);

              }

              if(!!relateMember){
                for(let m of relateMember){
                  if(!!m && !!socketID[groupUserID][m.value]){
                    let mess = `
                      <h1>Công việc <strong>${name} </strong> sẽ bắt đầu từ lúc ${convertTime(begin)}.</h1>
                      Chúc bạn một ngày làm việc vui vẽ`;
                    sendMail(Noti, m.value, mess);
                    socketID[groupUserID][m.value].emit('SERVER_SEND_TASK_NOT_NOTY', {data});
                  } 
                }
              }
            }
          }

          range = end - now;
          range = range < 0 ? range*(-1) : range;

          if(range >= 0 && range <= min){
            if(!!socketID && socketID[groupUserID]){
              if(!!socketID[groupUserID][memberId]){
                socketID[groupUserID][memberId].emit('SERVER_SEND_TASK_NOT_NOTY', {data, mess: {type: 1, m: "Bạn có một công việc sắp kết thúc"}});

                let mess = `
                  <h1>Công việc <strong>${name} đã giao </strong> sẽ kết thúc vào lúc ${convertTime(end)}.</h1>
                  Chúc bạn một ngày làm việc vui vẽ`;
                sendMail(Noti, memberId, mess);

              } 

              if(socketID[groupUserID][createAt]){
                socketID[groupUserID][createAt].emit('SERVER_SEND_TASK_NOT_NOTY', {data, mess: {type: 1, m: "Bạn có một công việc sắp kết thúc"}});

                let mess = `
                  <h1>Công việc <strong>${name} đã giao </strong> sẽ kết thúc vào lúc ${convertTime(end)}.</h1>
                  Chúc bạn một ngày làm việc vui vẽ`;
                sendMail(Noti, createAt, mess);

              }

              if(!!relateMember){
                for(let m of relateMember){
                  if(!!m && !!socketID[groupUserID][m.value] ){
                    socketID[groupUserID][m.value].emit('SERVER_SEND_TASK_NOT_NOTY', {data});

                    let mess = `
                      <h1>Công việc <strong>${name} đã giao </strong> sẽ kết thúc vào lúc ${convertTime(end)}.</h1>
                      Chúc bạn một ngày làm việc vui vẽ`;
                    sendMail(Noti, m.value, mess);
                  } 
                }
              }
            }
          }

        }
        
      }
    })
    
  }, 1000*60)
};

function sendMail(Noti, idUse, mess){
  if(!!idUse){
    Noti.models.users.findById(idUse, {fields: ['email']})
    .then(u => {
      if(!!u){ console.log(u)
        let { email } = u.__data;
        Noti.models.email.sendEmail({
                    to: email,
                    subject: "Thông báo",
                    html: mess
                  })
      }
    })
  }
}

function convertTime(date, currency){
  if(!currency) currency = "-";
  let now = new Date();
  let fullDate = new Date(date);

  let dd   = fullDate.getDate();
  if( dd < 10 )  dd = '0' + dd;

  let mm   = fullDate.getMonth() + 1;
  if( mm < 10 )  mm = '0' + mm;

  let yyyy   = fullDate.getFullYear();

  let h           = fullDate.getHours();
  if( h < 10 )  h = '0' + h;

  let min             = fullDate.getMinutes();
  if( min < 10 )  min = '0' + min;

  let time = `${h}:${min}`;
  
  if(+h > 12) time = `${time} PM`;
  else time = `${time} AM`;
  return time;
  
}