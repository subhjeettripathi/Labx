// var npawType
// var USER_ACCOUNT_id
// var appVersion=localStorage.getItem("appVersion")
// if (localStorage.getItem("taploginInfo") === null) {
//     npawType = "Unregistered";
//     USER_ACCOUNT_id = "Unregistered user";
//   } else {
//     const taplogininfo: any = localStorage.getItem("taploginInfo");
//     USER_ACCOUNT_id = JSON.parse(taplogininfo);
//     const is_subscriber: any = localStorage.getItem("is_subscriber")
//     if(is_subscriber == '0'){
//     npawType = "Registered";
//      }else{
//     npawType = "Subscribed";
//      }
//     }
// var npaw = require('npawlib')
//      var plugin= new npaw.Plugin({
//         'accountCode': 'multitv',
//        'user.name': USER_ACCOUNT_id.id,
//        "user.type": npawType,
//       "app.name": "ALTT",
//        'app.releaseVersion': appVersion,
//        "device.type": "PC"
//               })
//               export const plugins=plugin
