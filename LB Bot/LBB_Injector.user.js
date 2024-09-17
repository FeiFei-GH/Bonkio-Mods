// ==UserScript==
// @name         LBB_Injector
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Injector
// @author       FeiFei
// @license      none
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-start
// @grant        none
// ==/UserScript==

// ! Matching Bonk Version 49

const injectorName = `LBB_Injector`;
const errorMsg = `Whoops! ${injectorName} was unable to load.
This may be due to an update to Bonk.io. If so, please report this error!
This could also be because you have an extension that is incompatible with \
${injectorName}`;

// *Inject code into src
function injector(src) {
    let newSrc = src;
    
    //! Inject capZoneEvent fire
    let orgCode = `K$h[9]=K$h[0][0][K$h[2][138]]()[K$h[2][115]];`;
    let newCode = `
        K$h[9]=K$h[0][0][K$h[2][138]]()[K$h[2][115]];
        
        capZoneEventTry: try {
            // Initialize
            let inputState = z0M[0][0];
            let currentFrame = inputState.rl;
            let playerID = K$h[0][0].m_userData.arrayID;
            let capID = K$h[1];
            
            // Check if in main menu
            if (typeof inputState.playerData == "undefined") {
                break capZoneEventTry; // Likely in main menu
            }
            
            // If player didn't cap yet, cap it!
            if (!inputState.playerData[playerID].capZones[capID].isCapped) {
                inputState.playerData[playerID].capZones[capID].isCapped = true;
                inputState.playerData[playerID].capZones[capID].cappedFrame = currentFrame;
            }
        } catch(err) {
            console.log("!!!capZoneEvent ERROR!!!");
            console.log(err);
        }
        `;

    newSrc = newSrc.replace(orgCode, newCode);
    
    //! Inject stepEvent fire
    orgCode = `return z0M[720];`;
    newCode = `
        
        try {
            // Deep clone from input State
            let inputStateClone = JSON.parse(JSON.stringify(z0M[0][0]));
            let currentFrame = inputStateClone.rl;
            
            if (currentFrame == 0) {
                // Initialize playerData
                z0M[720].playerData = [];
                
                // Initialize finishEventQueue
                z0M[720].finishEventQueue = [];
                
                // For each player
                z0M[720].players.forEach((player, playerID) => {
                    z0M[720].playerData[playerID] = {};
                    
                    let unfreezeFrame = z0M[720].ftu + z0M[720].rl;
                    z0M[720].playerData[playerID].lastSpawnFrame = unfreezeFrame;
                    
                    z0M[720].playerData[playerID].finished = false;
                    
                    z0M[720].playerData[playerID].capZones = [];
                    z0M[720].capZones.forEach((mapCapZone, capID) => {
                        let fixturesID = mapCapZone.i;
                        let mapCapName = z0M[720].physics.fixtures[fixturesID].n;
                        
                        z0M[720].playerData[playerID].capZones[capID] = {};
                        z0M[720].playerData[playerID].capZones[capID].isCapped = false;
                        z0M[720].playerData[playerID].capZones[capID].cappedFrame = -1;
                        z0M[720].playerData[playerID].capZones[capID].capName = mapCapName;
                    });
                });
                
                // Check if LBB_Main is loaded
                if (window.LBB_Main.gameStartListener) {
                    window.LBB_Main.gameStartListener(z0M[720].playerData);
                }
                
                console.log("Successful Initialized");
                console.log(z0M[720]);
            } else {
                // Deep cloned from previous State
                z0M[720].playerData = inputStateClone.playerData;
                z0M[720].finishEventQueue = inputStateClone.finishEventQueue;
                
                if (typeof z0M[720].playerData == "undefined") {
                    return z0M[720]; // Likely in main menu
                }
                
                // For each player, check if they finished last frame
                z0M[720].playerData.forEach((player, playerID) => {
                    if (player != null) {
                        let captruedZone = false;
                        let finishedAllCP = true;
                        let lastFrame = z0M[720].rl - 1;
                        
                        // Check if captured capzone and also finished all cps
                        player.capZones.forEach((capZone) => {
                            if (capZone != null) {
                                if (capZone.capName.startsWith("cp") && !capZone.isCapped) {
                                    finishedAllCP = false;
                                }
                                
                                if (capZone.cappedFrame == lastFrame && lastFrame >= 0) {
                                    captruedZone = true;
                                }
                            }
                        });
                        
                        // Yay the player finishes
                        if (!player.finished && captruedZone && finishedAllCP) {
                            player.finished = true;
                            
                            let finishEvent = {};
                            finishEvent.playerID = playerID;
                            finishEvent.spawnFrame = player.lastSpawnFrame;
                            finishEvent.finishFrame = lastFrame;
                            
                            z0M[720].finishEventQueue.push(finishEvent);
                        }
                    }
                });
                
                // For each event, check if they need to be processed this frame
                while (z0M[720].finishEventQueue.length != 0) {
                    let frameAgo = z0M[720].rl - 31; // How many frames to wait until process event
                    
                    if (z0M[720].finishEventQueue[0].finishFrame == frameAgo) {
                        let finishEvent = z0M[720].finishEventQueue.shift();
                        
                        let playerID = finishEvent.playerID;
                        let finalFrame = finishEvent.finishFrame - finishEvent.spawnFrame;
                        let processID = finishEvent.finishFrame; // Use finishFrame as unique ID
                        
                        window.LBB_Main.playerFinishListener(playerID, finalFrame, processID);
                    } else {
                        break;
                    }
                }
                
                // For each death, check if who dead this frame
                z0M[720].discDeaths.forEach((death) => {
                    if (death.f == 0) { // Dead this frame
                        z0M[720].playerData[death.i].lastSpawnFrame = currentFrame;
                        z0M[720].playerData[death.i].finished = false;
                        
                        z0M[720].playerData[death.i].capZones.forEach((capZone) => {
                            capZone.isCapped = false; // Set capped to false
                        });
                    }
                });
                
            }
            
            // Check if LBB_Main is loaded
            if (window.LBB_Main.stepEvent) {
                //window.LBB_Main.stepEvent(z0M[720]);
            }
            
        } catch(err) {
            console.log("!!!stepEvent ERROR!!!");
            console.log(err);
        }
        
        return z0M[720];`;

    newSrc = newSrc.replace(orgCode, newCode);
    
    // //! Inject frameIncEvent fire
    // orgCode = `Y3z[8]++;`;
    // newCode = `
    //     Y3z[8]++;
        
    //     // Check if LBB_Main is loaded
    //     if (window.LBB_Main.frameIncEvent) {
    //         window.LBB_Main.frameIncEvent(Y3z[8], o3x[7]);
    //     }`;

    // newSrc = newSrc.replace(orgCode, newCode);
    
    return newSrc;
}

// Compatibility with Excigma's code injector userscript
if (!window.bonkCodeInjectors) window.bonkCodeInjectors = [];
window.bonkCodeInjectors.push((bonkCode) => {
    try {
        return injector(bonkCode);
    } catch (error) {
        alert(errorMsg);
        throw error;
    }
});

console.log(injectorName + " injector loaded");