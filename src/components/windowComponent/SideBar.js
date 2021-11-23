import React, { useContext, useState, useEffect } from "react";
import { menuContext, userContext,fileContext } from "../App";
import { ipcRenderer } from "electron";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay} from '@fortawesome/free-solid-svg-icons'


function SideBar() {
	const menucontext = useContext(menuContext);
	const usercontext = useContext(userContext);
	const filecontext = useContext(fileContext);

	const handleProfileChange = (e) => {
		e.preventDefault();
		// console.log(e.target.files[0]);
		try {
			usercontext.setprofileUpload({
				...usercontext.userProfile,
				filePath: e.target.files[0].path,
				fileName: e.target.files[0].name,
			});
		} catch (err) {
			console.log(err);
		}
	};
	const changeUserName = (e) => {
		e.preventDefault();
		// console.log(e.target.files[0]);
		try {
			usercontext.setprofileUpload({
				...usercontext.userProfile,
				uname:e.target.value
			});
		} catch (err) {
			console.log(err);
		}
	};
	const updateName = (e) => {
		e.preventDefault();
		ipcRenderer.send("logs:MainWindow:call", [
			"updateName",
			usercontext.userProfile,
		]);
	};
	const updateProfile = (e) => {
		e.preventDefault();
		ipcRenderer.send("logs:MainWindow:call", [
			"updateProfile",
			usercontext.userProfile,
		]);
	};

	const changeFileToplay = (e) => {
		console.log(e.target.getAttribute('file'),e.target.getAttribute('keyid'));
		e.preventDefault();
		
		if (e.target.getAttribute('file')) {
			filecontext.setfileToPlay({
				...filecontext.fileToPlay,
				// files:filecontext.fileToPlay.files,
				currentPlay: e.target.getAttribute('file'),
				currentPlayIndex: parseInt(e.target.getAttribute('keyid')),
				fileAccept:1
			});
		}
	}

	const makeUpper =(e)=>{
		return usercontext.userProfile.uplaylist.charAt(0).toUpperCase()+usercontext.userProfile.uplaylist.slice(1);
	}

	return (
		<div className="win-sdnav">
			<div className="user-prfl">
				<ul className="updateProfl">
					<li className="">
						<img
							src={
								usercontext.userProfile.uprofile === null
									? "img/logo.png"
									: `img/${usercontext.userProfile.uprofile}`
							}
							alt=""
						/>
						<label></label>
						<input
							type="file"
							id="#userProfile"
							onChange={handleProfileChange}
							onMouseOver={() => {
								document.querySelector(
									".user-prfl > ul li:nth-child(1) > label"
								).style = "display:block";
							}}
							onMouseLeave={() => {
								document.querySelector(
									".user-prfl > ul li:nth-child(1) > label"
								).style = "display:none";
							}}
						/>
					</li>

					<li className="" onClick={updateProfile}>
						<label htmlFor="">+</label>
					</li>
				</ul>
				<div className="profilesub-uname-disp">
					<input type="text" value={usercontext.userProfile.uname} onChange={ changeUserName }/>
					<label className="buttons" onClick={updateName}>
						Change
					</label>
				</div>
			</div>
			<div className="menu-heading">
				Playlist : {makeUpper(usercontext.userProfile.uplaylist)}
			</div>
			<div className="playlistFiles">
				{
					Object.entries(filecontext.fileToPlay.files).map((key, i) => {
						return (
							<ul key={i} keyid={i} onClick={changeFileToplay} file={key[1].namePlayfilePath}>
								<li> {key[1].namePlayfile} </li>
								<div onClick={changeFileToplay} key={i}  keyid={i} >
									<FontAwesomeIcon icon={faPlay}  id="playlist-play" />
								</div>
							</ul>
						)
					})
				}
				
				{/* <ul onClick={changeFileToplay} file={"E:\\My Gitub Repos\\Electron_applications\\concord Up\\dist\\music\\Despacito_320(PaglaSongs).mp3"}>
					< li>Free-Death machine</li>
					<div >
						<FontAwesomeIcon icon={faPlay}  id="playlist-play" />
					</div>
				</ul> */}
			</div>
		</div>
	);
}

export default SideBar;
