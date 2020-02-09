// ==UserScript==
// @name        OneSignal Enhancer
// @description Makes the OneSignal dashboard full-width.
// @namespace   http://iulianonofrei.com
// @version     0.2.3
// @author      Iulian Onofrei
// @updateURL   https://github.com/revolter/EnhancerUserscripts/raw/master/scripts/OneSignal/REPLACE_Enhancer.user.js
// @match       https://onesignal.com/*
// @require     https://raw.githubusercontent.com/revolter/min/master/min.min.js
// @grant       GM_addStyle
// ==/UserScript==

/**
 * - Makes the OneSignal dashboard full-width.
 *
 * [Install](https://raw.githubusercontent.com/revolter/EnhancerUserscripts/master/scripts/OneSignal/OneSignal_Enhancer.user.js)
 * @alias OneSignal-Enhancer
 */
(() => {
    "use strict";

    min.gm.style({
        ".app-card": {
            "margin": "0.4em"
        }
    });
})();
