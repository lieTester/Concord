import React, { useContext, useState, useEffect, useRef } from "react";

function home(props) {
   
    
	const NodeID3 = require('node-id3')
    var path = require('path');
    var playFilePath = props.filecontext.fileToPlay.currentPlay;
    var checkPlaylist = props.usercontext.userProfile.uplaylist == 'tester';
    var exact_path = checkPlaylist ? path.resolve('./dist/',playFilePath) : playFilePath;
    // console.log(exact_path,props.filecontext.fileToPlay.currentPlay,"hasjhdak");
    NodeID3.read(exact_path, function (err, tags) {
        var image = tags.image;
        // console.log(tags,exact_path)
        if (image) {
            var base64String = "";
            for (var i = 0; i < image.imageBuffer.length; i++) {
                base64String += String.fromCharCode(image.imageBuffer[i]);
            }
            var base64 = "data:" + image.format + ";base64," +
                    window.btoa(base64String);
            document.getElementById('freq').setAttribute('src',base64);
        } else {
            document.getElementById('freq').setAttribute('src',"img/logo.png");
        }
    })

    return (
        <div className="freq-display">
            <img id="freq" ></img>
        </div>
    )
}

export default home; 