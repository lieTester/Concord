const queryManager = require("../querys.js");

var basicManage = {};

basicManage.acceptcall = async function (user, callback) {
  // console.log(user);
  function callReturn(name) {
    // console.log(name);
    callback(name);
  }
  switch (user[0]) {
    case "TablesExistence":
      console.log(user[0], "basicManager");
      queryManager.CreateIfNotExist(callReturn);
      break;

    case "GetPlaylists":
      queryManager.GetPlaylists(callReturn);
      break;
      
    case "DeletePlaylist":
      queryManager.DeletePlaylist(user, callReturn);
      break;

    case "GetHistory":
      queryManager.GetHistory(callReturn);
      break;

    case "DeleteHistory":
      queryManager.DeleteHistory(user,callReturn);
      break;

    case "re_arrangePlaylist":
      queryManager.re_arrangePlaylist(user, callReturn);
      break;
    
    

    case "updateProfile":
      queryManager.updateProfile(user[1], callReturn);
      break;

    case "updateName":
      queryManager.updateName(user[1], callReturn);
      break;

    case "addFilesToPlaylist":
      queryManager.addFilesToPlaylist(user, callReturn);
      break;

    default:
      break;
  }

  // ########################################################################################################################
  //                                              Handel files operation
  // ########################################################################################################################

  // console.log(user[0])
  switch (user[0]) {
    case "DecryptFile":
      console.log(user);
      userPrivQuery.DecryptFiles(user, callReturn);
      break;
    default:
      break;
  }
};

module.exports = basicManage;
