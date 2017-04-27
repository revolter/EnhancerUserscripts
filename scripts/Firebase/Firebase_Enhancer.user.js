// ==UserScript==
// @name         Firebase Enhancer
// @namespace    http://iulianonofrei.com
// @version      0.1
// @author       Iulian Onofrei
// @match        https://console.firebase.google.com/*
// @require      https://gist.githubusercontent.com/raw/dab432d4b4bbb672896b/min.js
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

	min.gm.style({
		".c5e-overview-app-list, .c5e-overview-app-list > div[md-cell='12']": {
			"width": "98%"
		}
	});
})();
