// ==UserScript==
// @name        Firebase Enhancer
// @description Makes the Firebase dashboard full-width.
// @namespace   http://iulianonofrei.com
// @version     0.2.3
// @author      Iulian Onofrei
// @updateURL   https://github.com/revolter/EnhancerUserscripts/raw/master/scripts/Firebase/Firebase_Enhancer.user.js
// @match       https://console.firebase.google.com/*
// @require     https://raw.githubusercontent.com/revolter/min/master/min.min.js
// @grant       GM_addStyle
// ==/UserScript==

/**
 * - Makes the Firebase dashboard full-width.
 *
 * [Install](https://raw.githubusercontent.com/revolter/EnhancerUserscripts/master/scripts/Firebase/Firebase_Enhancer.user.js)
 * @alias Firebase-Enhancer
 */
(() => {
    "use strict";

    min.gm.style({
        ".c5e-overview-app-list, .c5e-overview-app-list > div[md-cell='12']": {
            "width": "98%"
        }
    });
})();
