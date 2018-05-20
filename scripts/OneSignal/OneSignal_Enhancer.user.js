// ==UserScript==
// @name        OneSignal Enhancer
// @namespace   http://iulianonofrei.com
// @version     0.2.1
// @author      Iulian Onofrei
// @updateURL	https://github.com/revolter/EnhancerUserscripts/raw/master/scripts/OneSignal/REPLACE_Enhancer.user.js
// @match       https://onesignal.com/*
// @require     https://gist.githubusercontent.com/raw/dab432d4b4bbb672896b/min.js
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
