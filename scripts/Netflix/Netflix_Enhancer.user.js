// ==UserScript==
// @name        Netflix Enhancer
// @description Disables the Post-Play feature.
// @namespace   http://iulianonofrei.com
// @version     0.2
// @author      Iulian Onofrei
// @updateURL   https://github.com/revolter/EnhancerUserscripts/raw/master/scripts/Netflix/Netflix_Enhancer.user.js
// @match       https://www.netflix.com/*
// @require     https://raw.githubusercontent.com/revolter/min/master/min.min.js
// ==/UserScript==

/**
 * - Disables the Post-Play feature.
 *
 * [Install](https://raw.githubusercontent.com/revolter/EnhancerUserscripts/master/scripts/Netflix/Netflix_Enhancer.user.js)
 * @alias Netflix-Enhancer
 */
(() => {
    "use strict";

    min.dom.onNodeExists(min.dom.getByClassName, "postplay", (player) => {
        player.click();

        const clickEvent = new Event("mouseout", {
            "view": window,
            "bubbles": true,
            "cancelable": false
        });

        player.dispatchEvent(clickEvent);
    }, false);
})();
