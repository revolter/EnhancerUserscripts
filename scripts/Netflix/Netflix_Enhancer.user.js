// ==UserScript==
// @name         Netflix Enhancer
// @namespace    http://iulianonofrei.com
// @version      0.2
// @author       Iulian Onofrei
// @updateURL    https://github.com/revolter/EnhancerUserscripts/raw/master/scripts/Netflix/Netflix_Enhancer.user.js
// @match        https://www.netflix.com/*
// @require      https://raw.githubusercontent.com/revolter/min/master/min.min.js
// ==/UserScript==

(function() {
    'use strict';

    min.dom.onNodeExists(min.dom.getByClassName, "postplay", function (player) {
        player.click();

        var clickEvent = new Event("mouseout", {
            "view": window,
            "bubbles": true,
            "cancelable": false
        });

        player.dispatchEvent(clickEvent);
    }, false);
})();
