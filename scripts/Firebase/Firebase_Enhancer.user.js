// ==UserScript==
// @name         Firebase Enhancer
// @namespace    http://iulianonofrei.com
// @version      0.2.1
// @author       Iulian Onofrei
// @updateURL	 https://github.com/revolter/EnhancerUserscripts/raw/master/scripts/Firebase/Firebase_Enhancer.user.js
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
