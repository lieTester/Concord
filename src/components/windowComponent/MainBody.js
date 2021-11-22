import React, { useContext,useState, useRef ,useEffect} from "react";
import { menuContext, userContext, fileContext } from "../App";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBackward, faForward,faPlay,faPause, faRandom, faRedo  } from '@fortawesome/free-solid-svg-icons'
import Home from "./NavigateData/home";
import Playlist from "./NavigateData/Playlist";
import AddFiles from "./NavigateData/AddFiles";
import History from "./NavigateData/History";
import { Document } from "postcss";



function MainBody() {

	const menucontext = useContext(menuContext);
	const usercontext = useContext(userContext);
	const filecontext = useContext(fileContext);
	
	const playerProgressRef = useRef();
	const m_audio = useRef();
	
	let m_play;
	let m_pause;
	let m_playtm;
	let currentPointTime
	let totalTimeDuration
	
	const [ppp, setppp] = useState({
		play:0
	});
	const [fileDuration, setfileDuration] = useState({
		totalDuration:'00:00',currentPoint:'00:00'
	});
	const [volumeValue, setvolumeValue] = useState({
		sliderValuse:100
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
		// setppp({ ...ppp, play:1 });

		if (ppp.play) m_audio.current.play();
		
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
			m_audio.current.currentTime = 0;
			setppp({ ...ppp, play: ppp.play ? 0 : 1 });
		}
	}

	const playpause = (e) => { 
		e.preventDefault();
		setppp({ ...ppp, play: ppp.play ? 0 : 1 });
		console.log(m_audio);
		//i use not operater here specially because usestate change not work inside
		// if condition instantly but in dom elements its working
		if (!ppp.play) {
			m_audio.current.play();
		} else {
			m_audio.current.pause();
		}
	}

	var cP
	var cPI
	const playForward =(e)=>{
		// console.log(filecontext.fileToPlay.files);
		cP=filecontext.fileToPlay.files;
		cPI=filecontext.fileToPlay.currentPlayIndex;
		if(cPI === cP.length-1){
			filecontext.setfileToPlay({
				...filecontext.fileToPlay,
				currentPlay:cP[0].namePlayfilePath,
				currentPlayIndex:0
			})
		}else{
			filecontext.setfileToPlay({
				...filecontext.fileToPlay,
				currentPlay:cP[cPI+1].namePlayfilePath,
				currentPlayIndex:cPI+1
			})
		}
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
		}else{
			filecontext.setfileToPlay({
				...filecontext.fileToPlay,
				currentPlay:cP[cP.length-1].namePlayfilePath,
				currentPlayIndex:cP.length-1
			})
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
							<li>
								<FontAwesomeIcon icon={faRedo} />
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
