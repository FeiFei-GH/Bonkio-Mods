// ==UserScript==
// @name        No Snow
// @namespace   http://tampermonkey.net/
// @match       https://bonk.io/gameframe-release.html
// @run-at      document-start
// @grant       none
// @version     1.1.0
// @author      FeiFei
// @license     none
// @description No snow
// ==/UserScript==

// ! Compitable with Bonk Version 49

const injectorName = `No Snow`;
const errorMsg = `Whoops! ${injectorName} was unable to load.
This may be due to an update to Bonk.io. If so, please report this error!
This could also be because you have an extension that is incompatible with \
${injectorName}`;

function injector(src) {
    let newSrc = src;

    let orgCode = `return y7y[4] >= 335 || y7y[4] <= 3;`;
    let newCode = `return false;`;

    newSrc = newSrc.replace(orgCode, newCode);

    if (src === newSrc) throw "Injection failed!";
    console.log(injectorName + " injector run");

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