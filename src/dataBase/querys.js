const db = require("./server.js");
const path = require("path");
const { uuid } = require("uuidv4");
const fs = require("fs-extra");
// const {encrypt,decrypt} = require('./chiper.js')

var queryManager = {};

queryManager.CreateIfNotExist = async function (callback) {
  try {
      db.run('CREATE TABLE IF NOT EXISTS userPlaylists ("idPlaylist"	INTEGER NOT NULL,"namePlaylist"	TEXT UNIQUE,"filesCount" INTEGER NOT NULL ,"playTimes" INTEZER ,"dateCreated"	TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,"lastUsed"	TEXT UNIQUE, PRIMARY KEY("idPlaylist" AUTOINCREMENT) )',
      (err) => {
        if (err) {
          console.log(err);
        } else {
          db.run("INSERT OR REPLACE INTO userPlaylists (idPlaylist,namePlaylist,filesCount,playTimes) VALUES(1,'tester',3,0) ",
            (err) => {
              if (err) console.log(err, "first");
            }
          );
        }
      }
    );

    db.run('CREATE TABLE IF NOT EXISTS userPlayfiles ("idPlayfile"	INTEGER NOT NULL,"namePlayfile"	TEXT UNIQUE,"namePlayfilePath"	TEXT UNIQUE,"dateadded"	TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, PRIMARY KEY("idPlayfile" AUTOINCREMENT))',
      (err) => {
        if (err) {
          console.log(err);
        } else {
          var songs=[];
          if (process.env.NODE_ENV === "development") {
            songs[0] = path.resolve("./dist/", "music/Valence - Infinite [NCS Release].mp3");
            songs[1] = path.resolve("./dist/","music/Despacito_320(PaglaSongs).mp3");
            songs[2] = path.resolve("./dist/", "music/Lovely(PagalWorld).mp3");
          } else {
            songs[0] = path.resolve("./resources/app/dist/","music/Valence - Infinite [NCS Release].mp3");
            songs[1] = path.resolve("./resources/app/dist/", "music/Despacito_320(PaglaSongs).mp3");
            songs[2] = path.resolve("./resources/app/dist/","music/Lovely(PagalWorld).mp3");
          }
          console.log();
          db.run(`INSERT OR REPLACE INTO userPlayfiles (idPlayfile,namePlayfile,namePlayfilePath) VALUES(1,'Valence - Infinite [NCS Release].mp3','${songs[0]}'),(2,'Despacito_320(PaglaSongs).mp3','${songs[1]}') , (3,'Lovely(PagalWorld).mp3','${songs[2]}') `,
            (err) => {
              if (err) console.log(err);
            }
          );
        }
      }
    );

    db.run('CREATE TABLE IF NOT EXISTS playerFileLists( "idPlaylist" INTEGER NOT NULL references userPlaylists(idPlaylist), "idPlayfile" INTEGER NOT NULL references userPlayfiles(idPlayfile), PRIMARY KEY(idPlaylist, idPlayfile))',
      (err) => {
        if (err) {
          console.log(err);
        } else {
          db.run("INSERT OR REPLACE INTO playerFileLists (idPlaylist,idPlayfile) VALUES(1,1) , (1,2),(1,3) ",
            (err) => {
              if (err) console.log(err);
            }
          );
        }
      }
    );

    db.run('CREATE TABLE IF NOT EXISTS History ("idHist"	INTEGER NOT NULL, "nameHistfile"	TEXT, "Type"	TEXT ,"lastPlayed"	TEXT UNIQUE,PRIMARY KEY("idHist" AUTOINCREMENT))',
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );

    db.run('CREATE TABLE IF NOT EXISTS userLog ("uid"	INTEGER,"uname"	TEXT,"uprofile"	TEXT,"lastplaylist" TEXT,PRIMARY KEY("uid" AUTOINCREMENT))',
      (err) => {
        if (err) {
          throw err;
        } else {
          var stmt = db.prepare("SELECT * FROM userLog");
          stmt.all(async (err, row) => {
            if (err) {
              throw err;
            } else {
              if (row.length) {
                var currentPlaylist = row[0].lastplaylist;
                // console.log(currentPlaylist, "sfsdfsf");
                db.get(`select idPlaylist from userPlaylists where namePlaylist = '${currentPlaylist}'`,
                  (err, id) => {
                    if (err) {
                      console.log(err);
                    } else {
                      db.all(`select pf.namePlayfile, pf.namePlayfilePath from userPlayfiles as pf left join playerFileLists as pfl on pf.idPlayfile=pfl.idPlayfile where pfl.idPlaylist=${id.idPlaylist}`,
                        (err, data) => {
                          if (err) console.log(err);
                          else {
                            callback(["reArrangedPlaylist", row[0], data]);
                            console.log(data[0], "only single finle name of plalist return");
                          }
                        }
                      );
                    }
                  }
                );
              } else {
                var stmt2 = db.prepare("INSERT INTO userLog (uname,uprofile,lastplaylist) VALUES('lietester.00','logo.png','tester')");
                stmt2.run((err) => {
                  if (err) {
                    console.log(err);
                  } else {
                    var stmt = db.prepare("SELECT * FROM userLog");
                    stmt.all(async (err, row) => {
                      if (err) {
                        throw err;
                      } else {
                        var currentPlaylist = row[0].lastplaylist;
                        db.get(`select idPlaylist from userPlaylists where namePlaylist = '${currentPlaylist}'`,
                          (err, id) => {
                            if (err) {
                              console.log(err);
                            } else {
                              db.all(`select pf.namePlayfile, pf.namePlayfilePath from userPlayfiles as pf left join playerFileLists as pfl on pf.idPlayfile=pfl.idPlayfile where pfl.idPlaylist=${id.idPlaylist}`,
                                (err, data) => {
                                  if (err) console.log(err);
                                  else {
                                    callback(["reArrangedPlaylist",row[0],data,]);
                                    console.log(data[0], "only single finle name of plalist return");
                                  }
                                }
                              );
                            }
                          }
                        );
                      }
                    });
                  }
                });
                stmt2.finalize();
              }
            }
          });
        }
      }
    );
  } catch (error) {
    callback(error);
  }
};

queryManager.updateName = function (user, callback) {
  var stmt = db.prepare("SELECT uid FROM userLog where uname=?");
  stmt.get(user.id, (err, profile) => {
    if (err) {
      console.log(err);
    } else {
      var stmt2 = db.prepare("UPDATE userLog SET uname=? WHERE uid=?");
      stmt2.run(user.uname, user.uid, (err) => {
        if (err) {
          console.log(err);
        } else {
          let stmt3 = db.prepare("SELECT * FROM userLog where uid=?");
          stmt3.get(user.uid, (err, row) => {
            if (err) {
              console.log(err);
            } else {
              callback(["profile", row]);
            }
          });
          stmt3.finalize();
        }
      });
      stmt2.finalize();
    }
  });
  stmt.finalize();
};

queryManager.updateProfile = function (user, callback) {
  var stmt = db.prepare("SELECT uprofile FROM userLog where uname=?");
  stmt.get(user.uname, (err, profile) => {
    if (err) {
      console.log(err);
    } else {
      // console.log(profile);
      const lastDot = user.fileName.lastIndexOf(".");
      user.fileName = uuid() + "." + user.fileName.substring(lastDot + 1);

      var stmt2 = db.prepare("UPDATE userLog SET uprofile = ? WHERE uname=?");
      stmt2.run(user.fileName, user.uname, (err) => {
        if (err) {
          console.log(err);
        } else {
          var output = path.join(__dirname, "../../dist/img/", user.fileName);

          fs.copyFile(user.filePath, output)
            .then(() => {
              // console.log('success!');
              var stmt3 = db.prepare("SELECT * FROM userLog where uname=?");
              stmt3.get(user.uname, async (err, row) => {
                if (err) {
                  throw err;
                } else {
                  // we use StringToPass for receiver function to understand which state to update
                  callback(["profile", row]);
                  if (profile.uprofile !== null) {
                    var deletPrevious = path.join(__dirname,"../../dist/img/",profile.uprofile);
                    fs.unlink(deletPrevious, (err) => {
                      if (err) {
                        return err;
                      }
                    });
                  }
                }
              });
            })
            .catch((err) => console.error(err, user.filePath));
          console.log("Insert Successful");
        }
      });
      stmt2.finalize();
    }
  });
  stmt.finalize();
};

// ########################################################################################################################
// ########################################################################################################################

queryManager.GetPlaylists = function (callback) {
  var stmt = db.prepare("SELECT * FROM userPlaylists");
  stmt.all((err, row) => {
    callback(["UsePlaylists", row]);
  });
  stmt.finalize();
};
queryManager.GetHistory = function (callback) {
  var stmt = db.prepare("SELECT * FROM History");
  stmt.all((err, row) => {
    callback(["UseHistoryList", row]);
  });
  stmt.finalize();
};

queryManager.re_arrangePlaylist = function (user, callback) {
  var stmt = db.prepare("UPDATE userLog SET lastplaylist=? WHERE uid=?");
  stmt.run(user[3], user[1].uid, (err) => {
    if (err) {
      console.log(err);
    } else {
        db.all(`select pf.namePlayfile, pf.namePlayfilePath from userPlayfiles as pf left join playerFileLists as pfl on pf.idPlayfile=pfl.idPlayfile where pfl.idPlaylist=${user[2]}`,
            (err, data) => {
            if (err) console.log(err);
            else {
            var stmt2 = db.prepare("SELECT * FROM userLog");
            stmt2.all((err, row) => {
              var stmt3 = db.prepare(`UPDATE userPlaylists SET playTimes = playTimes + ${1} where namePlaylist = ?`);
              stmt3.run(user[3], (err) => {
                if (err) {
                  console.log(err);
                } else {
                  db.run(`Update userPlaylists SET lastUsed = (current_timestamp) where namePlaylist = "${user[3]}"`);
                  db.get(`select idHist from History where nameHistfile='${user[3]}' `,(err,row)=>{
                    if(err || row ==null){
                      console.log(err);
                      db.run(`Insert INTO History (nameHistfile, Type, lastPlayed) VALUES("${user[3]}","playlist",current_timestamp)`);
                    }else{
                      db.run(`Update History SET lastPlayed = (current_timestamp) where nameHistfile = "${user[3]}"`);
                    }  
                  })
                }
              });
              callback(["reArrangedPlaylist", row[0], data]);
            });
            stmt2.finalize();
          }
        }
      );
    }
  });
  stmt.finalize();
};

queryManager.addFilesToPlaylist = function (user, callback) {
  var stmt = db.prepare("SELECT * FROM userPlaylists where namePlaylist=?");
  stmt.get(user[2], (err, row) => {
    if (err) {
      console.log(err , "addfiles stmt");
    } else {
        // condition for if playlist exist
        if (row != undefined) {
            db.run(`UPDATE userPlaylists SET filesCount = filesCount + ${Object.keys(user[1]).length} where namePlaylist = "${user[2]}"`);

            Object.entries(user[1]).map((key) => {
                var stmt2 = db.prepare("SELECT * FROM userPlayfiles where namePlayfile=?");
                stmt2.get(key[1]["name"], (err, fileId) => {
                if (err) {
                    console.log(err, "addfiles stmt2");
                } else {
                // if playfile exist
                if (fileId != undefined) {
                    var stmt3 = db.prepare("INSERT INTO playerFileLists (idPlaylist,idPlayfile) VALUES(?,?)");
                    stmt3.run(row["idPlaylist"], fileId["idPlayfile"], (err) => {
                        if (err) {
                            console.log(err ,"addfiles stmt3 following row != undefined && fileId != undefined");
                        }
                    });
                    stmt3.finalize();
                } else {
                    //if playfile not exist
                    var stmt3 = db.prepare("INSERT INTO userPlayfiles (namePlayfile,namePlayfilePath) VALUES(?,?)");
                    stmt3.run(key[1]["name"], key[1]["path"], (err) => {
                        if (err) {
                            console.log(err,"addfiles stmt3 if file not exist already");
                        }
                    });
                    stmt3.finalize();
                    var stmt4 = db.prepare("SELECT  idPlayfile FROM userPlayfiles where idPlayfile=(select max(idPlayfile) from userPlayfiles)");
                    stmt4.get((err, idPlayfile) => {
                        if (err) {
                            console.log(err, "addfiles stmt 4");
                        } else {
                            console.log(row["idPlaylist"], idPlayfile);
                        }
                        var stmt5 = db.prepare("INSERT INTO playerFileLists (idPlaylist,idPlayfile) VALUES(?,?)");
                        stmt5.run(row["idPlaylist"], idPlayfile["idPlayfile"],
                            (err) => {
                                if (err) {
                                console.log(err, "addfiles stmt5");
                                }
                            }
                        );
                        stmt5.finalize();
                    });
                    stmt4.finalize();
                }
                }
            });
            stmt2.finalize();
        });
      } else {
        // if plalist not exist and we have to create new one
        var stmt2 = db.prepare("INSERT INTO userPlaylists (namePlaylist,filesCount,playTimes) VALUES(?,?,0)");
        stmt2.run(user[2], Object.keys(user[1]).length, (err) => {
            if (err) {
                console.log(err, Object.keys(user[1]).length , "addfiles stmt2 playlist not Exist");
            } else {
            // here we are taking last entered playlist because the new one we create is obviously of max
            var stmt3 = db.prepare("SELECT idPlaylist FROM userPlaylists where idPlaylist=(select max(idPlaylist) from userPlaylists)");
            stmt3.get((err, idPlaylist) => {
                if (err) {
                    console.log(err, "addfiles stmt3 playlist not Exist");
                } else {
                    Object.entries(user[1]).map((key) => {
                    var stmt4 = db.prepare("SELECT * FROM userPlayfiles where namePlayfile=?");
                    stmt4.get(key[1]["name"], (err, row) => {
                        if (err) {
                        console.log(err, "addfiles stmt4 playlist not Exist");
                        } else {
                        if (row != undefined) {
                            // if plafile exist then direct
                            var stmt5 = db.prepare("INSERT INTO playerFileLists (idPlaylist,idPlayfile) VALUES(?,?)");
                            stmt5.run(idPlaylist["idPlaylist"], row["idPlayfile"],
                                (err) => {
                                    if (err) {
                                    console.log(err ,"addfiles stmt5 playlist not Exist");
                                    }
                                }
                            );
                            stmt5.finalize();
                        } else {
                            //else playfile not exist in that case make new one and than change into manytomany
                            var stmt4 = db.prepare("INSERT INTO userPlayfiles (namePlayfile,namePlayfilePath) VALUES(?,?)");
                            stmt4.run(key[1]["name"], key[1]["path"], (err) => {
                                if (err) {
                                    console.log(err ,"addfiles stmt4 playlist and playfile both not Exist");
                                }
                            });
                            stmt4.finalize();
                            var stmt5 = db.prepare("SELECT idPlayfile FROM userPlayfiles where idPlayfile=(select max(idPlayfile) from userPlayfiles)");
                            stmt5.get((err, idPlayfile) => {
                                if (err) {
                                    console.log(err, "addfiles stmt5 playlist and playfile both not Exist");
                                } else {
                                    // console.log(idPlaylist, idPlayfile);
                                }
                                // many to many table insertion
                                var stmt6 = db.prepare("INSERT INTO playerFileLists (idPlaylist,idPlayfile) VALUES(?,?)");
                                stmt6.run(idPlaylist["idPlaylist"],idPlayfile["idPlayfile"],
                                    (err) => {
                                        if (err) {
                                            console.log(err , "addfiles stmt6 many to many ");
                                        }
                                    }
                                );
                                stmt6.finalize();
                            });
                            stmt5.finalize();
                        }
                        }
                    });
                    stmt4.finalize();
                    });
                }
            });
          }
        });
        stmt2.finalize();
      }
    }
  });
  stmt.finalize();
};



queryManager.DeletePlaylist=function (user, callback) {
  db.run(`delete from userPlaylists WHERE idPlaylist=${user[1]}`,
      (err) => {
      if (err) console.log(err);
      else callback(["PlaylistDeleted"]);
  });
};

queryManager.DeleteHistory=function(user,callback){
  db.run(`delete from History WHERE idHist=${user[1]}`,
      (err) => {
      if (err) console.log(err);
      else callback(["HistoryDeleted"]);
  });
};

module.exports = queryManager;
