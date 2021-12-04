import React, { useContext,useState, useRef ,useEffect,useReducer} from "react";
import { menuContext, userContext, fileContext } from "../App";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBackward, faForward,faPlay,faPause, faRandom, faRedo  } from '@fortawesome/free-solid-svg-icons'
import Home from "./NavigateData/home";
import Playlist from "./NavigateData/Playlist";
import AddFiles from "./NavigateData/AddFiles";
import History from "./NavigateData/History";
import { Document } from "postcss";

const ppp ={ play:0}
const setppp = (e)=>{
	ppp.play = ppp.play ? 0 : 1 
	return ppp;
}




function MainBody() {

	const menucontext = useContext(menuContext);
	const usercontext = useContext(userContext);
	const filecontext = useContext(fileContext);
	
	const playerProgressRef = useRef();
	const m_audio = useRef();
	const playLoop = useRef();
	
	let m_play;
	let m_pause;
	var cP;
	var cPI;
	let m_playtm;
	let currentPointTime
	let totalTimeDuration
	

	
	const [playPauseState, playPausedispatch] = useReducer(setppp, ppp);

	const [fileDuration, setfileDuration] = useState({
		totalDuration:'00:00',currentPoint:'00:00'
	});
	const [volumeValue, setvolumeValue] = useState({
		sliderValuse:20
	});


    // ####################################################################
	//  file selection for single file with input type for play
	// ####################################################################


    const fileSelect = (e) => {
		e.preventDefault();
		let file = { name: e.target.files[0].name, path: e.target.files[0].path };
        console.log(e.target.files[0].path);
		setfileToPlay({
			...fileToPlay,
			files: file,
			fileAccept: 1,
		});
	};

	


	const handleFileChange = (e) => {

		//below condition is only for when file src change externally by user

		if (playPauseState.play) m_audio.current.play();
		
		if (filecontext.fileToPlay.fileAccept) {
			let path = filecontext.fileToPlay.currentPlay;
			filecontext.setfileToPlay({
				...filecontext.fileToPlay,
				currentPlay: path,
				fileAccept: 0
			})
		}
	}
	const setVolume = (e) => {
		e.preventDefault()
		let Vol = e.target.value / 100;
		m_audio.current.volume = Vol;
		setvolumeValue({
			...volumeValue,
			sliderValuse:e.target.value
		});
	}
	const setTimeDurations = (e) => {
		
		let calulcation = Math.floor(e / 60);
		let min= (calulcation < 10)? "0"+calulcation :calulcation;
		let sec = (e%60 < 10)? "0"+(e%60) : (e%60);
		return `${min}:${sec}`
	}
	const updateprogress = (e) => {
		if (filecontext.fileToPlay.fileAccept) handleFileChange();

		const { duration, currentTime } = m_audio.current;
		m_playtm = ((currentTime / duration) * 100);
		document.querySelector('.progress-bar > ul >li:nth-child(2) >span').style.width = `${m_playtm}%`;
		
		currentPointTime = setTimeDurations(Math.round( currentTime));
		totalTimeDuration = setTimeDurations(Math.floor(duration));
		setfileDuration({
			...fileDuration,
			currentPoint: currentPointTime,
			totalDuration: totalTimeDuration,
		});

		if (m_playtm == 100) {
			// m_audio.current.currentTime = 0;
			// playPausedispatch();
			// console.log(playLoop.current.firstChild.getAttribute('idcheck'));
			if(playLoop.current.firstChild.getAttribute('idcheck')=== '1'){
				m_audio.current.currentTime = 0;
				m_audio.current.play();
			}else{
				setTimeout(() => {
					playForward();
				}, 500);
			}
		}
	}

	const checkPlayPauseState =(e)=>{
		console.log(playPauseState.play)
		if (playPauseState.play) {
			m_audio.current.play();
		} else {
			m_audio.current.pause();
		}
	}
	const playpause = (e) => { 
		e.preventDefault();
		console.log(m_audio,playPauseState);
		
		playPausedispatch();
		//i use not operater here specially because usestate change not work inside
		// if condition instantly but in dom elements its working
		setTimeout(() => {
			checkPlayPauseState();
		}, 500);
	}


	const makePlayLoop =(e)=>{
		// console.log(e, playLoopState);
		e.preventDefault()
		try {
			var idCheck=e.target.getAttribute('idcheck');
			console.log(e.target.getAttribute('idcheck'));
			if(idCheck === '1'){
				e.target.setAttribute('idcheck', '0')
				e.target.style="color: var(--win-primary-text) "
			}else{
				e.target.setAttribute('idcheck', '1')
				e.target.style=" color:var(--win-secondry5) "
			}
		} catch (error) {
			console.log(error);
		}
	}
	const playForward =(e)=>{
		cP=filecontext.fileToPlay.files;
		cPI=filecontext.fileToPlay.currentPlayIndex;
		// console.log(filecontext.fileToPlay.files,cPI === cP.length-1,cPI, cP.length-1);
		if(cPI === cP.length-1){
			filecontext.setfileToPlay({
				...filecontext.fileToPlay,
				currentPlay:cP[0].namePlayfilePath,
				currentPlayIndex:0
			})
			playPausedispatch();
		}else{
			filecontext.setfileToPlay({
				...filecontext.fileToPlay,
				currentPlay:cP[cPI+1].namePlayfilePath,
				currentPlayIndex:cPI+1
			})
		}
		setTimeout(() => {
			m_audio.current.currentTime = 0;
			checkPlayPauseState();
		}, 200);
	}
	
	const playBackward =(e)=>{
		cP=filecontext.fileToPlay.files;
		cPI=filecontext.fileToPlay.currentPlayIndex;
		if(cPI !== 0){
			filecontext.setfileToPlay({
				...filecontext.fileToPlay,
				currentPlay:cP[cPI-1].namePlayfilePath,
				currentPlayIndex:cPI-1
			})
			m_audio.current.currentTime = 0;
			checkPlayPauseState();
		}
		// console.log(filecontext.fileToPlay.files.length);
	}

	const setupProgrssWidth = (e) => {
		//only ref hook can give us the width of progress bar
		m_audio.current.currentTime = ((e.nativeEvent.offsetX /playerProgressRef.current.offsetWidth) * m_audio.current.duration);
		const { duration, currentTime } = m_audio.current;
		m_playtm = ((currentTime / duration) * 100);
		document.querySelector('.progress-bar > ul >li:nth-child(2) >span').style.width = `${m_playtm}%`;
	}

	const switchElements = (e) => {
		switch (e) {
			case "Home":
				return <Home filecontext={filecontext} usercontext={usercontext} />;
			case "Playlists":
				return <Playlist />;
			case "History":
				return <History />;
			case "AddFiles":
				return <AddFiles />;
			default:
				return e;
		}
	};
	return (
		<div className="main-body">
			<div className="grid-adjust">
				<div className="regular-body">
					{switchElements(menucontext.menuState.mainbody)}
				</div>
				<div htmlFor="menu-body-label" className="menu-body-Adsss ">
					{/* {menucontext.menuState.mainbody} */}

					<div className="progress-bar">
						<ul>
							<li>{fileDuration.currentPoint}</li>
							<li className="progress-line" ref={ playerProgressRef} onClick={setupProgrssWidth}>
								<span >
								<ul></ul>
								</span>
							</li>
							<li>{fileDuration.totalDuration}</li>
						</ul>
					</div>
					<div className="media-player-options">
						<ul className="m-volume">
							<li className="progress-line" >
								<input type="range" className="vol-range" onChange={setVolume} min='0' max="100" step="1" value={volumeValue.sliderValuse}  />
								<label htmlFor="" className="volume-unit-display">{ volumeValue.sliderValuse}</label>
							</li>
						</ul>
						<ul>
							<li className="m-previous-play" onClick={playBackward}>
								<FontAwesomeIcon icon={faBackward} />		
							</li> 
							<li className="m-play-pause" onClick={playpause}>
								{
									ppp.play
									? <FontAwesomeIcon icon={faPause} id="m-pause" />
									: <FontAwesomeIcon icon={faPlay} id="m-play" />
								}
							</li>
							<li className="m-next-play" onClick={playForward}>
								<FontAwesomeIcon icon={faForward} />
							</li>
						</ul>
						<ul className="m-liked-repeat mn-flx">
							<li  ref={playLoop} onClick={makePlayLoop} idcheck='0'> 
								<FontAwesomeIcon icon={faRedo}  />
							</li>
							<li>
								<FontAwesomeIcon icon={faRandom} />
							</li>
						</ul>
						
					</div>

					<audio id="play" ref={m_audio} onTimeUpdate={updateprogress} src={filecontext.fileToPlay.currentPlay}>
					</audio>
				</div>
			</div>
		</div>
	);
}

export default MainBody;
