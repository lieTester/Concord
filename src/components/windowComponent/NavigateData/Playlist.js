import React, { useContext, useState, useEffect } from "react";
import {
	menuContext,
	userContext,
} from "../../App";

import { ipcRenderer } from "electron";


function Playlist() {
	const usercontext = useContext(userContext);

	const [PlaylistsView, setPlaylistsView] = useState({
		files:{}
	})
	useEffect(() => {
		ipcRenderer.send("logs:MainWindow:call", ["GetPlaylists"]);
		ipcRenderer.on("logs:MainWindow:Update", (event, data) => {
			if(data[0]==="UsePlaylists"){
				// console.log(data[1])
				setPlaylistsView({
					...PlaylistsView,
					files:data[1]
				})
			}
		})
	}, [])


	const arrangePlaylist =(e)=>{
		// console.log(e.target.parentElement.className);
		var elemid='';
		var elemClass='';
		if(e.target.parentElement.id === ""){
			elemid=e.target.id;
			elemClass=e.target.className;
		}
		else{
			elemid = e.target.parentElement.id;
			elemClass=e.target.parentElement.className;
		} 
		ipcRenderer.send("logs:MainWindow:call", ["re_arrangePlaylist",usercontext.userProfile,elemid,elemClass]);
	}

	return (
		<div className="show-playlist-area">
			<div className="playlist-tags">
				<ul className="">
					<li>No.</li>
					<li>Name</li>
					<li>Files</li>
					<li>Played</li>
				</ul>
			</div>
			<div className="playlist-detail">

			{
					Object.entries(PlaylistsView.files).map((key, i) => {
						return (
							<ul id={key[1].idPlaylist} className={key[1].namePlaylist} key={i} onClick={arrangePlaylist}>
								<li>{i+1}</li>
								<li>{key[1].namePlaylist}</li>
								<li>{key[1].filesCount}</li>
								<li>{key[1].playTimes}</li>
							</ul>
						)
					})
				}

				{/* <ul className="">
					<li>1</li>
					<li>tester</li>
					<li>5</li>
					<li>6</li>
				</ul> */}
			
			</div>
		</div>
	)
}

export default Playlist
