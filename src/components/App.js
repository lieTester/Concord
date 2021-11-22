import React, { createContext, useReducer, useEffect, useState } from "react";
import { ipcRenderer, remote } from "electron";
import TitleBar from "./windowComponent/TitleBar";
import Body from "./windowComponent/Body";
import Footer from "./windowComponent/Footer";
import "./allCss/fonts/fontFace.css";
import "./allCss/Custom.css";

export const menuContext = createContext();
export const userContext = createContext();
export const fileContext = createContext();

const menuState = {
	MenuItems: ["Home", "AddFiles", "Playlists", "History"], 
	MenuWidths: [63.67,86.08,78.63,73.14], 
	MenuhghLtr: [0,63.67,149.75,228.38], 
	sidebar: "Home",
	mainbody: "Home",
};

const menuReducer = (menu, action) => {
	switch (action.onwhat) {
		case "mainbody":
			return {
				...menu,
				mainbody: action.type,
				sidebar: menu.sidebar,
			};
		case "sidebar":
			return {
				...menu,
				sidebar: action.type,
				mainbody: menu.mainbody,
			};
		default:
			break;
	}
};

const App = () => {
	const [menu, dispatch] = useReducer(menuReducer, menuState);

	// every basic information of user loaged store
	const [userProfile, setprofileUpload] = useState({
		filePath: "",
		fileName: "E:\\My Gitub Repos\\Electron_applications\\concord Up\\src\\components\\assets\\logo.png",
		uid:'',
		uname: "",
		uprofile: null,
		uplaylist:'',
	});

	// current file to play
	const [fileToPlay, setfileToPlay] = useState({
		files: [],
		currentPlay:'./music/Despacito_320(PaglaSongs).mp3',
		currentPlayIndex: 0,
		fileAccept: 0,
	});

	useEffect(() => {

		ipcRenderer.send("logs:MainWindow:call", ["TablesExistence"]);
		ipcRenderer.on("logs:MainWindow:Update", (event, data) => {
			//
			console.log(data);
			let Temp;
			switch (data[0]) {
				
				case "profile":
					setprofileUpload({
						...userProfile,
						uid: data[1].uid,
						uname: data[1].uname,
						uprofile: data[1].uprofile,
						uplaylist:data[1].lastplaylist
					});
					break;
				case "reArrangedPlaylist":
					setprofileUpload({
						...userProfile,
						uid: data[1].uid,
						uname: data[1].uname,
						uprofile: data[1].uprofile,
						uplaylist:data[1].lastplaylist
					});
					setfileToPlay({
						...fileToPlay,
						files:data[2],
						currentPlay:data[2][0].namePlayfilePath
					})
				default:
					console.log(data);
					break;
			}
		});
	}, []);

	return (
		<menuContext.Provider value={{ menuState: menu, menuDispatch: dispatch }}>
			<userContext.Provider
				value={{ userProfile: userProfile, setprofileUpload: setprofileUpload }}
			>
				<fileContext.Provider value={{fileToPlay:fileToPlay, setfileToPlay:setfileToPlay}}>
					<div className="app">
						<div className="forTopTouch"></div>
						<TitleBar />
						<Body />
						<Footer />
					</div>
				</fileContext.Provider>
						
			</userContext.Provider>
		</menuContext.Provider>
	);
};

export default App;



