// ==UserScript==
// @name        Slashdot Enhancer
// @description Removes the subheader. Increases the font size.
// @namespace   http://iulianonofrei.com
// @version     0.3.2
// @author      Iulian Onofrei
// @updateURL   https://github.com/revolter/EnhancerUserscripts/raw/master/scripts/Slashdot/Slashdot_Enhancer.user.js
// @match       https://*.slashdot.org/*
// @require     https://raw.githubusercontent.com/revolter/min/master/min.min.js
// @grant       GM_addStyle
// ==/UserScript==

/**
 * - Removes the subheader.
 * - Increases the font size.
 *
 * [Install](https://raw.githubusercontent.com/revolter/EnhancerUserscripts/master/scripts/Slashdot/Slashdot_Enhancer.user.js)
 * @alias Slashdot-Enhancer
 */
(() => {
    "use strict";

    min.gm.style({
        ".nav-secondary-wrap, #firehose-message-tray, aside.view_mode": {
            "display": "none"
        },
        "article > div.body > div.p": {
            "font-size": "1.5em"
        }
    });
})();
