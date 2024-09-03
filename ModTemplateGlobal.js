// ==UserScript==
// @name         BonkHUD Mod Template
// @version      1.0.0
// @description  A template for creating mods using BonkHUD
// @author       Your Name
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-end
// @grant        none
// ==/UserScript==

"use strict";

// Define a namespace for your mod to avoid conflicts
window.modName = {};

// Initialize settings or variables your mod might need
modName.windowConfigs = {
    windowName: "Mod Name",
    windowId: "modNameWindow",
    modVersion: "1.0.0",
    bonkLIBVersion: "1.1.0",
    bonkVersion: "49",
    windowContent: null,
};

// Create the mod window using BonkHUD
modName.createWindow = function () {
    // Create the window using BonkHUD
    const modWindow = bonkHUD.createWindow(
                            this.windowConfigs.windowName,
                            this.windowConfigs.windowContent, 
                            this.windowConfigs );

    //! Possible: Customize inner window style if needed
    /* If you want to change padding
    modWindow.style.padding = "5px"; // Example: set padding
    modWindow.style.width = "calc(100% - 10px)"; // Example: set width to match padding
    modWindow.style.height = "calc(100% - 42px)"; // Example: set height to match padding and header
    */
    // modWindow.style.display = "flex"; // Example: set display
};

modName.setWindowContent = function () {
    // Create your window HTML
    let windowHTML = document.createElement("div");

    let modText = document.createElement("span");
    modText.textContent = "A mod with text!";

    windowHTML.appendChild(modText);

    // Add to windowContent
    this.windowConfigs.windowContent = windowHTML;
}

// Initialize the mod (run when document is ready)
modName.initMod = function () {
    // Ensure BonkHUD is available
    if (!window.bonkHUD) {
        console.error("BonkHUD is not loaded. Please make sure BonkHUD is installed.");
        return;
    }

    this.setWindowContent();
    this.createWindow();

    // Load UI settings if available
    bonkHUD.loadUISetting(this.windowConfigs.windowId);

    //! Possible: Add event listeners if needed
    // bonkAPI.addEventListeners("event", (e) => {});

    console.log(this.windowConfigs.windowName + " initialized");
};

// Function to handle document readiness and initialize the mod
modName.onDocumentReady = function () {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        this.initMod();
    } else {
        document.addEventListener("DOMContentLoaded", () => {
            this.initMod();
        });
    }
};

// Call the function to check document readiness and initialize the mod
modName.onDocumentReady();
