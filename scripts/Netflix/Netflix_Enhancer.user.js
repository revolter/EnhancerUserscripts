// ==UserScript==
// @name         Netflix Enhancer
// @namespace    http://iulianonofrei.com
// @version      0.1
// @author       Iulian Onofrei
// @updateURL    https://github.com/revolter/EnhancerUserscripts/raw/master/scripts/Netflix/Netflix_Enhancer.user.js
// @match        https://www.netflix.com/*
// @require      https://gist.githubusercontent.com/raw/dab432d4b4bbb672896b/min.js
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
