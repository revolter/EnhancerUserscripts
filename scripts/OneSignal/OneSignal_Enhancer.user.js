// ==UserScript==
// @name        OneSignal Enhancer
// @namespace   http://iulianonofrei.com
// @version     0.2.2
// @author      Iulian Onofrei
// @updateURL	https://github.com/revolter/EnhancerUserscripts/raw/master/scripts/OneSignal/REPLACE_Enhancer.user.js
// @match       https://onesignal.com/*
// @require     https://raw.githubusercontent.com/revolter/min/master/min.min.js
// @grant       GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

	min.gm.style({
		".app-card": {
			"margin": "0.4em"
		}
	});
})();
