import React, { useContext, useState, useEffect } from "react";
import { menuContext, userContext } from "../../App";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash,faPlay,faLock} from '@fortawesome/free-solid-svg-icons'
import { ipcRenderer } from "electron";


// its css in mainBody.css
function Playlist() {
  const usercontext = useContext(userContext);

  const [PlaylistsView, setPlaylistsView] = useState({
    files: {},
  });
  useEffect(() => {
    ipcRenderer.send("logs:MainWindow:call", ["GetPlaylists"]);
    ipcRenderer.on("logs:MainWindow:Update", (event, data) => {
      if (data[0] === "UsePlaylists") {
        // console.log(data[1])
        setPlaylistsView({
          ...PlaylistsView,
          files: data[1],
        });
      }
    });
  }, []);

  const arrangePlaylist = (e) => {
    console.log(e.target.parentElement.className);
    var elemid = "";
    var elemClass = "";
    if (e.target.parentElement.id === "") {
      elemid = e.target.id;
      elemClass = e.target.className;
    } else {
      elemid = e.target.parentElement.id;
      elemClass = e.target.parentElement.className;
    }
    ipcRenderer.send("logs:MainWindow:call", [
      "re_arrangePlaylist",
      usercontext.userProfile,
      elemid,
      elemClass,
    ]);
  };
  // delete playlist
  const deletePlayList=(e)=>{
      console.log('working',e.target);
      var elemid = "";
      if (e.target.parentElement.id === "") {
        elemid = e.target.id;
      } else {
        elemid = e.target.parentElement.id;
      }
      ipcRenderer.send("logs:MainWindow:call", [
        "DeletePlaylist",
        elemid,
      ]);
  }

  return (
    <div className="show-playlist-area">
      <div className="playlist-tags">
        <ul className="">
          <li>Name</li>
          <li>Files</li>
          <li>Played</li>
          <li>Click</li>
          <li>Delete</li>
        </ul>
      </div>
      <div className="playlist-detail">
        {Object.entries(PlaylistsView.files).map((key, i) => {
          return (
            <ul>
              <li>{key[1].namePlaylist}</li>
              <li>{key[1].filesCount}</li>
              <li>{key[1].playTimes}</li>
              <li id={key[1].idPlaylist}
                  className={key[1].namePlaylist}
                  key={i}
                  onClick={arrangePlaylist}><FontAwesomeIcon icon={faPlay} onClick={arrangePlaylist} />
              </li>
              <li id={key[1].idPlaylist} 
                  onClick={
                    (key[1].namePlaylist!='tester' && key[1].namePlaylist!=usercontext.userProfile.uplaylist)?
                    deletePlayList:
                    ()=>{}
                  }>
                    <FontAwesomeIcon 
                      id={key[1].idPlaylist} 
                      icon={(key[1].namePlaylist!='tester' && key[1].namePlaylist!=usercontext.userProfile.uplaylist)?faTrash:faLock} 
                    />
              </li>
            </ul>
          );
        })}

        {/* <ul className="">
					<li>1</li>
					<li>tester</li>
					<li>5</li>
					<li>6</li>
				</ul> */}
      </div>
    </div>
  );
}

export default Playlist;
