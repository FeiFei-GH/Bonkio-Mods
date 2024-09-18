// ==UserScript==
// @name         Opacity
// @version      2.0.0
// @description  A mod to toggle visibility settings in Bonk.io using BonkHUD
// @author       FeiFei + Blu
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-end
// @grant        none
// ==/UserScript==

"use strict";

window.opacity = {};

opacity.windowConfigs = {
    windowName: "Opacity",
    windowId: "opacity_window",
    modVersion: "2.0.0",
    bonkLIBVersion: "1.1.3",
    bonkVersion: "49",
    windowContent: null,
};

// Initialize settings
opacity.settings = {
    players: {
        skins: true,
        visible: true,
        alpha: 1,
        usernames: {
            visible: true,
            alpha: 1,
        },
    },
    chat: {
        visible: true,
        alpha: 1,
    },
};

// Create the mod window using BonkHUD
opacity.createWindow = function () {
    // Create the window using BonkHUD
    const modIndex = bonkHUD.createMod(this.windowConfigs.windowName, this.windowConfigs);

    // Load UI settings if available
    bonkHUD.loadUISetting(modIndex);
};

opacity.setWindowContent = function () {
    // Get current settings values
    const playersSkinsChecked = this.settings.players.skins ? "checked" : "";
    const playersVisibleChecked = this.settings.players.visible ? "checked" : "";
    const playersAlphaValue = this.settings.players.alpha * 100;
    const usernamesVisibleChecked = this.settings.players.usernames.visible ? "checked" : "";
    const usernamesAlphaValue = this.settings.players.usernames.alpha * 100;
    const chatVisibleChecked = this.settings.chat.visible ? "checked" : "";
    const chatAlphaValue = this.settings.chat.alpha * 100;

    // Create the HTML content using a template literal
    const windowHTML = `
    <div>
        <table class="bonkhud-background-color bonkhud-border-color">
            <caption class="bonkhud-header-color">
                <span class="bonkhud-title-color">Players</span>
            </caption>
            <tr>
                <td class="bonkhud-text-color">Skins</td>
                <td>
                    <input
                        type="checkbox"
                        ${playersSkinsChecked}
                        onchange="window.opacity.settings.players.skins = this.checked"
                    />
                </td>
            </tr>
            <tr>
                <td class="bonkhud-text-color">Visible</td>
                <td>
                    <input
                        type="checkbox"
                        ${playersVisibleChecked}
                        onchange="window.opacity.settings.players.visible = this.checked"
                    />
                </td>
            </tr>
            <tr>
                <td class="bonkhud-text-color">Opacity</td>
                <td>
                    <input
                        type="range"
                        style="width: 5vw"
                        min="0"
                        max="100"
                        value="${playersAlphaValue}"
                        oninput="window.opacity.settings.players.alpha = this.value/100"
                    />
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <!-- Usernames Subsection -->
                    <table class="bonkhud-background-color bonkhud-border-color" style="margin-top: 10px">
                        <caption class="bonkhud-header-color">
                            <span class="bonkhud-title-color">Usernames</span>
                        </caption>
                        <tr>
                            <td class="bonkhud-text-color">Visible</td>
                            <td>
                                <input
                                    type="checkbox"
                                    ${usernamesVisibleChecked}
                                    onchange="window.opacity.settings.players.usernames.visible = this.checked"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td class="bonkhud-text-color">Opacity</td>
                            <td>
                                <input
                                    type="range"
                                    style="width: 5vw"
                                    min="0"
                                    max="100"
                                    value="${usernamesAlphaValue}"
                                    oninput="window.opacity.settings.players.usernames.alpha = this.value/100"
                                />
                            </td>
                        </tr>
                    </table>
                    <!-- End of Usernames Subsection -->
                </td>
            </tr>
        </table>
        <!-- Chat Section -->
        <table class="bonkhud-background-color bonkhud-border-color" style="margin-top: 20px">
            <caption class="bonkhud-header-color">
                <span class="bonkhud-title-color">Chat</span>
            </caption>
            <tr>
                <td class="bonkhud-text-color">Visible</td>
                <td>
                    <input
                        type="checkbox"
                        ${chatVisibleChecked}
                        onchange="window.opacity.settings.chat.visible = this.checked; if (window.opacity.chatWindow) { window.opacity.chatWindow.style.opacity = window.opacity.settings.chat.visible ? 1 : 0; }"
                    />
                </td>
            </tr>
            <tr>
                <td class="bonkhud-text-color">Opacity</td>
                <td>
                    <input
                        type="range"
                        style="width: 5vw"
                        min="0"
                        max="100"
                        value="${chatAlphaValue}"
                        oninput="window.opacity.settings.chat.alpha = this.value/100; if (window.opacity.chatWindow) { window.opacity.chatWindow.style.opacity = window.opacity.settings.chat.alpha; }"
                    />
                </td>
            </tr>
        </table>
    </div>
    `;

    // Create a container element and set its innerHTML
    let container = document.createElement("div");
    container.innerHTML = windowHTML;

    // Set the windowContent to the container
    this.windowConfigs.windowContent = container;
};

// Injector function to inject code into the game code
opacity.injector = function (src) {
    let newSrc = src;

    // Control player and username visibility
    let discID = newSrc.match(/this\.discGraphics\[([\w$]{2,4})\]=null;\}/)[1];
    newSrc = newSrc.replace(
        `this.discGraphics[${discID}]=null;}`,
        `this.discGraphics[${discID}]=null;
        } else {
            if(this.discGraphics[${discID}]){
                if(this.discGraphics[${discID}].sfwSkin){
                    // control skin visibility
                    this.discGraphics[${discID}].playerGraphic.alpha = window.opacity.settings.players.skins ? 1 : 0;
                    this.discGraphics[${discID}].sfwSkin.visible = !window.opacity.settings.players.skins;
                // gotta wait for avatar to be created
                } else if(this.discGraphics[${discID}].avatar?.bc != undefined){
                    // create sfwSkin
                    this.discGraphics[${discID}].sfwSkin = new PIXI.Graphics;
                    this.discGraphics[${discID}].sfwSkin.beginFill(this.discGraphics[${discID}].teamify(this.discGraphics[${discID}].avatar.bc, this.discGraphics[${discID}].team));
                    this.discGraphics[${discID}].sfwSkin.drawCircle(0,0,this.discGraphics[${discID}].radius);
                    this.discGraphics[${discID}].sfwSkin.endFill();
                    this.discGraphics[${discID}].container.addChildAt(this.discGraphics[${discID}].sfwSkin, 3);
                }

                // everything else
                this.discGraphics[${discID}].nameText.alpha = window.opacity.settings.players.usernames.visible ? window.opacity.settings.players.usernames.alpha : 0;
                if(this.discGraphics[${discID}].playerID != this.localPlayerID){
                    this.discGraphics[${discID}].container.visible = window.opacity.settings.players.visible;
                    this.discGraphics[${discID}].container.alpha = window.opacity.settings.players.alpha;
                }
            }
        }`
    );

    // Get chat window when building renderer
    let buildRendererFunction = newSrc.match(
        /(build\([\w$]{2,4},[\w$]{2,4}\)) \{.{30,150}=new [\w$]{2,4}\[[0-9]+\]\(/
    )[1];

    newSrc = newSrc.replace(
        `${buildRendererFunction} {`,
        `${buildRendererFunction} {
        window.opacity.chatWindow = document.querySelector('#ingamechatbox');`
    );

    if (src === newSrc) throw "Injection failed!";
    return newSrc;
};

// Initialize the mod (run when document is ready)
opacity.initMod = function () {
    // Ensure BonkHUD is available
    if (!window.bonkHUD) {
        console.error("BonkHUD is not loaded. Please make sure BonkHUD is installed.");
        return;
    }

    this.setWindowContent();
    this.createWindow();

    console.log(this.windowConfigs.windowName + " initialized");
};

// Function to handle document readiness and initialize the mod
opacity.onDocumentReady = function () {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        this.initMod();
    } else {
        document.addEventListener("DOMContentLoaded", () => {
            this.initMod();
        });
    }
};

// Compatibility with Excigma's code injector userscript
if (!window.bonkCodeInjectors) window.bonkCodeInjectors = [];
window.bonkCodeInjectors.push((bonkCode) => {
    try {
        return opacity.injector(bonkCode);
    } catch (error) {
        throw error;
    }
});

console.log("Opacity injector loaded");

// Call the function to check document readiness and initialize the mod
opacity.onDocumentReady();
