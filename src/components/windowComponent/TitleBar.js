import React, { useContext, useEffect, useState } from "react";
import { remote } from "electron";
import appicon from "../assets/logo.png";
import { menuContext } from "../App";

function titleBar() {
	const menucontext = useContext(menuContext);
	const [menuWidth, setmenuWidth] = useState({
		parentWidth:0,
		width:0
	})
	let menuX;
	useEffect(() => {

		// store all menus widths
		// const allMenus = document.querySelectorAll('.win-option > ul >li');
		// let val = 0;
		// console.log(allMenus)
		
		// this line to change highliter position with width idex and - current index value because above we store widths on index + previous widths
		const position= menucontext.menuState.MenuItems.indexOf(menucontext.menuState.mainbody);
		const cal = menucontext.menuState.MenuhghLtr[position]+ "px";
		const calWidth = menucontext.menuState.MenuWidths[position] + "px";
		// this is for current element index to highlite current menu
		const currentMenu = menucontext.menuState.MenuItems.indexOf(menucontext.menuState.mainbody);
		// console.log(menucontext.menuState.mainbody,menuWidth.width,menucontext.menuState.MenuhghLtr[position],cal);
		// this is to select all menu items
		const menuAll = document.querySelectorAll(".win-option ul li");
		// this is to select current item
		const menuX = document.querySelector(`.win-option ul li:nth-child(${currentMenu + 1})`);

		// this to change all value we calculated from above
		
		document.documentElement.style.setProperty(
			"--win-menu-highliter-left",
			cal
		);
		document.documentElement.style.setProperty(
			"--win-menu-highliter-width",
			calWidth
		);
		menuAll.forEach((item) => {
			item.style = " ";
		});
		menuX.style = "font-weight: 900;color : var(--win-primary3)";

		// why we are providing menucontext.menuState.mainbody in [] list
		// so that every time menucontext.menuState.mainbody update useeffect call.
	}, [menucontext.menuState.mainbody]);

	let win;
	let checkFrameEvent = (e) => {
		e.preventDefault();
		switch (e.target.id) {
			case "min":
				win = remote.getCurrentWindow();
				win.minimize();
				break;
			case "max":
				win = remote.getCurrentWindow();
				win.isMaximized() ? win.unmaximize() : win.maximize();
				break;
			case "close":
				win = remote.getCurrentWindow();
				win.close();
				break;
			default:
				break;
		}
	};

	let menu_click_hghltr = (e) => {
		e.preventDefault();
		let text = e.currentTarget.textContent;
		menucontext.menuDispatch({ type: text, onwhat: "mainbody" });
		// document.documentElement.style.setProperty("--win-menu-highliter-width",`${e.target.clientWidth-15}px`);
	};

	let menu_dbclick_hghltr = (e) => {
		e.preventDefault();
		let text = e.currentTarget.textContent;
		menucontext.menuDispatch({ type: text, onwhat: "sidebar" });
		// document.documentElement.style.setProperty("--win-menu-highliter-width",`${e.target.clientWidth-15}px`);
	};


	return (
		<div className="title-bar">
			<div className="threeWinBtn">
				<ul id="min" onClick={checkFrameEvent}>
					<li id="min" className="ttl-hr" />
				</ul>
				<ul id="max" onClick={checkFrameEvent}>
					<li id="max" className="ttl-hr max-top" />
					<li id="max" className="ttl-hr max-rgt" />
					<li id="max" className="ttl-hr max-btm" />
					<li id="max" className="ttl-hr max-lft" />
				</ul>
				<ul id="close" onClick={checkFrameEvent}>
					<li id="close" className="ttl-hr" />
					<li id="close" className="ttl-hr" />
				</ul>
			</div>

			<div className="win-icon">
				<img src={appicon} alt="" />
			</div>

			<div className="win-option">
				<ul>
					<li onDoubleClick={menu_dbclick_hghltr} onClick={menu_click_hghltr}>
						Home
					</li>
					<li onDoubleClick={menu_dbclick_hghltr} onClick={menu_click_hghltr}>
						AddFiles
					</li>
					<li onDoubleClick={menu_dbclick_hghltr} onClick={menu_click_hghltr}>
						Playlists
					</li>
					<li onDoubleClick={menu_dbclick_hghltr} onClick={menu_click_hghltr}>
						History
					</li>
					<li className="menu-hghltr"></li>
				</ul>
			</div>

			<div className="win-name"></div>
		</div>
	);
}

export default titleBar;
