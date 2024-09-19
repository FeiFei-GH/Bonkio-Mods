// ==UserScript==
// @name         LBB_Main
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Main
// @author       FeiFei
// @license      none
// @match        https://*.bonk.io/gameframe-release.html
// @run-at       document-end
// @grant        none
// ==/UserScript==
// ! Compitable with Bonk Version 48

// *Everything should be inside this object to prevent conflict with other prgrams.
window.LBB_Main = {};

// #region //!------------------Initialize Variables-----------------
LBB_Main.msgs = {
    welcomeMsg: "Welcome {username}!",
    welcomeMsg2: "Welcome {username}! You will be joining shortly",
    finishMsg: "{username} finished with: {time}",
    pbMsg: "Nice! {username} just got a new PB: {time}",
    wrMsg: "Congratulations! {username} just got a new WR: {time}",
    goMsg: "Go!",
};

LBB_Main.processedFinishEvents = [];
// #endregion

// #region //!------------------Helper Functions-----------------
LBB_Main.frameToMS = (frame) => {
    const frameRate = 30; // TPS
    const milliseconds = (frame / frameRate) * 1000;
    return Math.round(milliseconds); // Round to nearest integer
};

LBB_Main.msToTimeStr = (ms) => {
    var minutes = Math.floor(ms / 60000);
    var seconds = Math.floor((ms % 60000) / 1000);
    var milliSeconds = Math.round((ms % 1000) / 10);

    // Add leading zero to minute component if it is less than 10
    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    if (milliSeconds < 10) {
        milliSeconds = "0" + milliSeconds;
    }

    return "" + minutes + ":" + (seconds < 10 ? "0" : "") + seconds + "." + milliSeconds;
};

LBB_Main.isPlayerValid = (player) => {
    return player.level >= 20;
};

LBB_Main.formatMessage = (message, data) => {
    return message.replace(/{(\w+)}/g, (match, key) => data[key] || match);
};
// #endregion

// #region //!------------------Main Functions-----------------
LBB_Main.sendFinishedMsg = (playerName, timeStr) => {
    const message = LBB_Main.formatMessage(LBB_Main.msgs.finishMsg, {
        username: playerName,
        time: timeStr,
    });
    bonkAPI.chat(message);
};
// #endregion

// #region //!------------------Use bonkAPI as listener-----------------
bonkAPI.addEventListener("userJoin", (e) => {
    let playerName = e.userData.userName;

    const message = LBB_Main.formatMessage(LBB_Main.msgs.welcomeMsg, {
        username: playerName,
    });

    bonkAPI.chat(message);

    if (LBB_Main.isPlayerValid(e.userData)) {
        console.log("add player to database");
        // LBB_LDB.addPlayer(e.userData);
    }
});

bonkAPI.addEventListener("gameStart", (e) => {
    if (true) {
        bonkAPI.chat(LBB_Main.msgs.goMsg);
    }
});

bonkAPI.addEventListener("mapSwitch", (e) => {
    console.log("Map switched: ");

    console.log(bonkAPI.decodeMap(e.mapData));
});
// #endregion

// #region //!------------------Use LBB_Injector as listener-----------------
LBB_Main.gameStartListener = (playerData) => {
    playerData.forEach((player, playerID) => {
        LBB_Main.processedFinishEvents[playerID] = {};
        LBB_Main.processedFinishEvents[playerID].previousProcessFrame = -1;
    });
};

LBB_Main.playerFinishListener = (playerID, finalFrame, processFrame) => {
    console.log(
        "player: " +
            bonkAPI.getPlayerNameByID(playerID) +
            " finalFrame: " +
            finalFrame +
            " processFrame: " +
            processFrame
    );

    // Check if the spawn frame ID already printed to prevent output again
    if (LBB_Main.processedFinishEvents[playerID].previousProcessFrame != processFrame) {
        LBB_Main.processedFinishEvents[playerID].previousProcessFrame = processFrame;

        let playerName = bonkAPI.getPlayerNameByID(playerID);
        let timeStr = LBB_Main.msToTimeStr(LBB_Main.frameToMS(finalFrame));

        LBB_Main.sendFinishedMsg(playerName, timeStr);
    }
};
// #endregion
