// ==UserScript==
// @name         Slashdot Enhancer
// @namespace    http://iulianonofrei.com
// @version      0.3.1
// @author       Iulian Onofrei
// @updateURL    https://github.com/revolter/EnhancerUserscripts/raw/master/scripts/Slashdot/Slashdot_Enhancer.user.js
// @match        https://*.slashdot.org/*
// @require      https://gist.githubusercontent.com/raw/dab432d4b4bbb672896b/min.js
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    min.gm.style({
        ".nav-secondary-wrap, #firehose-message-tray, aside.view_mode": {
            "display": "none"
        },
        "article > div.body > div.p": {
            "font-size": "1.5em"
        }
    });
})();