// ==UserScript==
// @name         BonkHUD Mod Template
// @version      1.0.0
// @description  A template for creating mods using BonkHUD
// @author       Your Name
// @match        https://bonk.io/gameframe-release.html
// @match        https://bonkisback.io/gameframe-release.html
// @match        https://multiplayer.gg/physics/gameframe-release.html
// @run-at       document-end
// @grant        none
// ==/UserScript==

"use strict";

// Define a namespace for your mod to avoid conflicts
window.modName = {};

// Initialize settings or variables your mod might need
modName.windowConfigs = {
    windowName: "Mod Name", // The title of the window
    windowId: "modName_window",
    modVersion: "1.0.0",
    bonkLIBVersion: "1.1.3",
    bonkVersion: "49",
    windowContent: null,
    //settingsContent: null,
    //noWindow: false,
};

// !UI:
// Create the mod window using BonkHUD
modName.createWindow = function () {
    // Create the window using BonkHUD
    const modIndex = bonkHUD.createMod(this.windowConfigs.windowName, this.windowConfigs);
    
    // Load UI settings if available
    bonkHUD.loadUISetting(modIndex);
    
    //! Possible: Customize inner window style if needed
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
    // Possibly create your default settings HTML
    let windowHTML = document.createElement("div");

    let modText = document.createElement("span");
    modText.textContent = "A mod with text!";

    windowHTML.appendChild(modText);

    // Add to windowContent
    this.windowConfigs.windowContent = windowHTML;
    // this.windowConfigs.settingsContent = ...;
};

modName.setSettingFunctionality = function (modIndex) {
    // Access elements from settings with id and then add events/input
    // Put settings you want to save into an object
    // Use bonkHUD.saveModSetting(modIndex, settings) to save
    // Use let mySettings = bonkHUD.getModSetting(modIndex) to retreive settings object
    // Use bonkHUD.resetModSetting(modIndex) to DELETE your current saved settings
    //! How the settings object is used depends on the mod maker
};

// Initialize the mod (run when document is ready)
modName.initMod = function () {
    this.setWindowContent();
    this.createWindow();

    //! Possible: Add event listeners if needed
    // bonkAPI.addEventListeners("event", (e) => {});

    console.log(this.windowConfigs.windowName + " initialized");
};

// !Loaders:
// Function to ensure bonkAPI is loaded or timeout after a set duration
const ensureBonkAPI = async (timeout = 5000, retryInterval = 100) => {
    const maxRetries = Math.ceil(timeout / retryInterval);
    let retries = 0;

    while (!window.bonkAPI && retries < maxRetries) {
        console.warn(`bonkAPI not found. Retrying (${retries + 1}/${maxRetries})...`);
        await new Promise((resolve) => setTimeout(resolve, retryInterval));
        retries++;
    }

    if (!window.bonkAPI) {
        alert("BonkAPI is not loaded or installed. Please ensure BonkAPI is installed and try again.");
        console.error("Failed to load bonkAPI after multiple retries.");
        return false;
    }

    return true;
};

// Function to handle document readiness and initialize the mod
modName.onDocumentReady = async () => {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        if (await ensureBonkAPI()) {
            modName.initMod();
        }
    } else {
        document.addEventListener("DOMContentLoaded", async () => {
            if (await ensureBonkAPI()) {
                modName.initMod();
            }
        });
    }
};

// Call the function to check document readiness and initialize the mod
modName.onDocumentReady();
