// ==UserScript==
// @name         SoundBoard
// @version      1.0.0
// @description  Play sounds when specific chat messages are received
// @author       FeiFei
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-end
// @grant        none
// ==/UserScript==

"use strict";

// Define a namespace for your mod to avoid conflicts
let soundBoard = {};

// Initialize settings or variables your mod might need
soundBoard.windowConfigs = {
    windowName: "SoundBoard",
    windowId: "soundBoard_Window",
    modVersion: "1.0.0",
    bonkLIBVersion: "1.1.3",
    bonkVersion: "49",
    windowContent: null,
};

// Define the sounds and their corresponding messages and audio URLs
soundBoard.sounds = [
    {
        name: "a",
        message: "a",
        audioUrl: "https://www.myinstants.com/media/sounds/gawr-gura-a.mp3",
        enabled: true, // default enabled
    },
    // Add more sounds here if needed
];

// Create the mod window using BonkHUD
soundBoard.createWindow = function () {
    // Create the window using BonkHUD
    const modIndex = bonkHUD.createMod(this.windowConfigs.windowName, this.windowConfigs);

    // Implement functionality for settings
    this.setSettingFunctionality(modIndex);

    // Load UI settings if available
    bonkHUD.loadUISetting(modIndex);
};

soundBoard.setWindowContent = function () {
    // Create your window HTML
    let windowHTML = document.createElement("div");

    let modText = document.createElement("span");
    modText.textContent = "Select sounds to enable:";
    windowHTML.appendChild(modText);

    let form = document.createElement("form");

    // Create checkboxes for each sound
    this.sounds.forEach((sound, index) => {
        let label = document.createElement("label");
        label.style.display = "block";

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `soundCheckbox_${index}`;
        checkbox.checked = sound.enabled;

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` Sound "${sound.name}" (message: "${sound.message}")`));

        form.appendChild(label);
    });

    windowHTML.appendChild(form);

    // Add to windowContent
    this.windowConfigs.windowContent = windowHTML;
};

soundBoard.setSettingFunctionality = function (modIndex) {
    // Retrieve saved settings if any
    let savedSettings = bonkHUD.getModSetting(modIndex) || {};
    if (savedSettings.sounds) {
        // Update the sounds' enabled state based on saved settings
        this.sounds.forEach((sound, index) => {
            if (typeof savedSettings.sounds[index] !== "undefined") {
                sound.enabled = savedSettings.sounds[index].enabled;
            }
        });
    }

    // Update the checkboxes based on the current sound settings
    this.sounds.forEach((sound, index) => {
        let checkbox = document.getElementById(`soundCheckbox_${index}`);
        if (checkbox) {
            checkbox.checked = sound.enabled;

            // Add event listener to handle checkbox changes
            checkbox.addEventListener("change", (e) => {
                sound.enabled = checkbox.checked;
                // Save the settings
                this.saveSettings(modIndex);
            });
        }
    });
};

soundBoard.saveSettings = function (modIndex) {
    let settings = {
        sounds: this.sounds.map((sound) => ({ enabled: sound.enabled })),
    };
    bonkHUD.saveModSetting(modIndex, settings);
};

// Initialize the mod (run when document is ready)
soundBoard.initMod = function () {
    // Ensure BonkHUD is available
    if (!window.bonkHUD) {
        console.error("BonkHUD is not loaded. Please make sure BonkHUD is installed.");
        return;
    }

    this.setWindowContent();
    this.createWindow();

    // Add event listener for chat messages
    bonkAPI.addEventListener("chatIn", (e) => {
        this.sounds.forEach((sound) => {
            if (sound.enabled && e.message === sound.message) {
                this.playSound(sound.audioUrl);
            }
        });
    });

    console.log(this.windowConfigs.windowName + " initialized");
};

// Function to play audio
soundBoard.playSound = function (url) {
    let audio = new Audio(url);
    audio.play();
};

// Function to handle document readiness and initialize the mod
soundBoard.onDocumentReady = function () {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        this.initMod();
    } else {
        document.addEventListener("DOMContentLoaded", () => {
            this.initMod();
        });
    }
};

// Call the function to check document readiness and initialize the mod
soundBoard.onDocumentReady();
