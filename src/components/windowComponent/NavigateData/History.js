import React, { useContext, useState, useEffect } from "react";

import { ipcRenderer } from "electron";

function History() {
  const [HistoryView, setHistoryView] = useState({
    files: {},
  });
  useEffect(() => {
    ipcRenderer.send("logs:MainWindow:call", ["GetHistory"]);
    ipcRenderer.on("logs:MainWindow:Update", (event, data) => {
      if (data[0] === "UseHistoryList") {
        // console.log(data[1])
        setHistoryView({
          ...HistoryView,
          files: data[1],
        });
      }
    });
  }, []);

  return (
    <div className="show-history-area">
      <div className="history-tags">
        <ul className="">
          <li>No.</li>
          <li>Name</li>
          <li>Playlist or File</li>
          <li>Last Played</li>
        </ul>
      </div>
      <div className="history-detail">
        {Object.entries(HistoryView.files).map((key, i) => {
          return (
            <ul id={key[1].idHist} className={key[1].nameHistfile} key={i}>
              <li>{i + 1}</li>
              <li>{key[1].nameHistfile}</li>
              <li>{key[1].Type}</li>
              <li>{key[1].lastPlayed}</li>
            </ul>
          );
        })}
      </div>
      {/* <div className="history-detail">
            <ul className="">
              <li>1</li>
              <li>001-1868423-Absolution Free-Death machine.mp3</li>
              <li>file</li>
              <li>NA</li>
            </ul>
            <ul className="">
              <li>2</li>
              <li>Metal</li>
              <li>playlist</li>
              <li>NA</li>
            </ul>
            <ul className="">
              <li>3</li>
              <li>001-1868423-Absolution Free-Death machine.mp3</li>
              <li>file</li>
              <li>2</li>
            </ul>
            <ul className="">
              <li>4</li>
              <li>032-1696981-Ianwill-Fighting The Odds.mp3</li>
              <li>file</li>
              <li>Na</li>
            </ul>
            <ul className="">
              <li>5</li>
              <li>025-1813076-Avenger Kills-Metal Child.mp3</li>
              <li>file</li>
              <li>Na</li>
            </ul>
            <ul className="">
              <li>6</li>
              <li>025-1813076-Avenger Kills-Metal Child.mp3</li>
              <li>file</li>
              <li>Na</li>
            </ul>
            <ul className="">
              <li>7</li>
              <li>tester</li>
              <li>playlist</li>
              <li>Na</li>
            </ul>
          </div> */}
    </div>
  );
}

export default History;
