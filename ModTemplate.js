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
    bonkLIBVersion: "1.0.8",
    bonkVersion: "49",
    windowContent: "<div>A mod with a HUD!</div>", // HTML content for your window
};

// Create the mod window using BonkHUD
modName.createWindow = function () {
    // Define the window HTML content
    const windowHTML = document.createElement("div");
    windowHTML.innerHTML = this.windowConfigs.windowContent;

    // Create the window using BonkHUD
    const modWindow = bonkHUD.createWindow(this.windowConfigs.windowName, windowHTML, {
        modVersion: this.windowConfigs.modVersion,
        bonkLIBVersion: this.windowConfigs.bonkLIBVersion,
        bonkVersion: this.windowConfigs.bonkVersion,
    });

    // TODO: Customize window styles if needed
    modWindow.style.width = "200px"; // Example: set width
    modWindow.style.height = "150px"; // Example: set height
};

// Initialize the mod (run when document is ready)
modName.initMod = function () {
    // Ensure BonkHUD is available
    if (!window.bonkHUD) {
        console.error("BonkHUD is not loaded. Please make sure BonkHUD is installed.");
        return;
    }

    // this.setWindowContent(); // TODO: Set window content if needed
    this.createWindow();

    // Load UI settings if available
    bonkHUD.loadUISetting(this.windowConfigs.windowId);

    // this.addEventListeners(); // TODO: Add event listeners if needed

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
