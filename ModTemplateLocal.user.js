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
let modName = {};

// Initialize settings or variables your mod might need
modName.windowConfigs = {
    windowName: "Mod Name",
    windowId: "modNameWindow",
    modVersion: "1.0.0",
    bonkLIBVersion: "1.1.0",
    bonkVersion: "49",
    windowContent: null,
    //settingsContent: null,
    //noWindow: false,
};

// Create the mod window using BonkHUD
modName.createWindow = function () {
    // Create the window using BonkHUD
    const modIndex = bonkHUD.createMod(
                            this.windowConfigs.windowName,
                            this.windowConfigs );

    //! Possible: Customize inner window styles if needed
    // let modWindow = bonkHUD.getElementByIndex(modIndex);
    /* If you want to change padding
    modWindow.style.padding = "5px"; // Example: set padding
    modWindow.style.width = "calc(100% - 10px)"; // Example: set width to match padding
    modWindow.style.height = "calc(100% - 42px)"; // Example: set height to match padding and header
    */
    // modWindow.style.display = "flex"; // Example: set display

    // Implement functionality for settings
    // this.setSettingFunctionality(modIndex);
};

modName.setWindowContent = function () {
    // Create your window HTML
    // Possibly create your default settings HTMLL
    let windowHTML = document.createElement("div");

    let modText = document.createElement("span");
    modText.textContent = "A mod with text!";

    windowHTML.appendChild(modText);

    // Add to windowContent
    this.windowConfigs.windowContent = windowHTML;
    // this.windowConfigs.settingsContent = ...;
}

modName.setSettingFunctionality = function (modIndex) {
    // Access elements from settings with id and then add events/input
    // Put settings you want to save into an object
    // Use bonkHUD.saveModSetting(modIndex, settings) to save
    // Use let mySettings = bonkHUD.getModSetting(modIndex) to retreive settings object
    // Use bonkHUD.resetModSetting(modIndex) to DELETE your current saved settings
    //! How the settings object is used depends on the mod maker
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
