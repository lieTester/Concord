import React, { useContext, useState, useEffect } from "react";
import {
	menuContext,
	userContext,
} from "../../App";

import { ipcRenderer } from "electron";

function AddFiles() {
    

    const { userProfile } = useContext(userContext);


    const [filesToAddPlaylist, setfilesToAddPlaylist] = useState({
		files: {},
		fileAccept: 0,
	});
	
    const [nameSet, setnameSet] = useState({
		set: 0, PlaylsitName:''
    });
    
    // ####################################################################
	// useeffect
	// ####################################################################
	useEffect(() => {
		// ###############################################################
		// its for file draging and select files to dropbox to encrypt
		let dropbox = document.querySelector(".filedrag-area");
		dropbox.addEventListener("dragenter", drag, false);
		dropbox.addEventListener("dragover", drag, false);
		dropbox.addEventListener("dragleave", drop_l_e, false);
		dropbox.addEventListener("dragend", drop_l_e, false);
		dropbox.addEventListener("drop", drop, false);
	}, []);

    
	// ###################################################################
	// drag and drop add eventlistners functions
	// ###################################################################
	const drag = (e) => {
		e.preventDefault();
		e.stopPropagation();
		document.querySelector(".filedrag-area").classList.add("filedrag-area-on");
	};
	const drop_l_e = (e) => {
		e.stopPropagation();
		e.preventDefault();
		document
			.querySelector(".filedrag-area")
			.classList.remove("filedrag-area-on");
	};
	const drop = (e) => {
		e.stopPropagation();
		e.preventDefault();
		document.querySelector(".filedrag-area").classList.remove("filedrag-area-on");
		const files = e.dataTransfer.files;
		let collFiles = {};
		let filesCount = 0;
		for (const key in files) {
			++filesCount;
			collFiles[key] = { name: files[key]["name"], path: files[key]["path"] };
		}

		// #######################################################################################
		// we are removiving all these three beacause of extra input as drop of collection file.
		delete collFiles["length"];
		delete collFiles["item"];
		filesCount -= 2;
		// ########################################################################################
		var audioFormats = ["mp3","mp4","wav","wma","aac"]
		Object.entries(collFiles).map((key) => {
			if(audioFormats.indexOf(key[1]["name"].split('.').pop()) === -1){
				delete collFiles[key[0]];
			}
		})
		setfilesToAddPlaylist({
			...filesToAddPlaylist,
			files: collFiles,
			fileAccept: filesCount,
		});
	};



    const fileSelect = (e) => {
		e.preventDefault();
		let file = {};
		file[0] = { name: e.target.files[0].name, path: e.target.files[0].path };
		setfilesToAddPlaylist({
			...filesToAddPlaylist,
			files: file,
			fileAccept: 1,
		});
    };
    

    // ####################################################################
	// finally add data button
	// ####################################################################
	const AddFile = (e) => {
		console.log(e);
		document.querySelector('.error-msg').textContent=""
		ipcRenderer.send("logs:MainWindow:call", [
			"addFilesToPlaylist",
			filesToAddPlaylist.files,
			nameSet.PlaylsitName
		]);
    };
	const handeladd = (e) => {
		// console.log(Object.keys(filesToAddPlaylist.files).length);
		var files = Object.keys(filesToAddPlaylist.files).length;
		var bol = (e.target.value != "" && files ) ? 1 : 0;
		setnameSet({ ...nameSet, set: bol ,PlaylsitName:e.target.value})
    };
	const handelAddExp = (e) => { 
		document.querySelector('.error-msg').textContent="First select Files then Enter new playlist name not existing one then press ADD button"
	}



    return (
		<div className=" playlist-area">
			<div className="playlist-creation-way mn-flx">
				<ul>Drop Files to make Playlist </ul>
				<ul>Add Files to Playlist</ul>
			</div>
            <div className="encrypt-file">
				<ul className="filedrag-area">
					<li className="mn-flx">
						<label className="" >
							<input type="file" onChange={fileSelect} accept=".mp3,.mp4,.wav,.wma,.aac"/>
							Drop Files To Make Playlist
						</label>
						<span className="error-msg" ></span>
					</li>
				</ul>
				<ul className="all-files-selected">
					{filesToAddPlaylist.fileAccept == 0
						? ""
						: Object.entries(filesToAddPlaylist.files).map((key) => {
							return (
								<li key={key[0]}>
									{++key[0]} : {key[1]["name"]}
								</li>
							);
						})
					}
				</ul>
				<ul className="mn-flx encyp-btn">
					<label className="encp-inp">
						<input type="text" placeholder="Enter Plalist name" onChange={ handeladd}/>
					</label>
					<label className="buttons" id="addPlaylistbtn" onClick={nameSet.set?AddFile:handelAddExp}>
						Add
					</label>
				</ul>
			</div>
        </div>
    )
}

export default AddFiles
