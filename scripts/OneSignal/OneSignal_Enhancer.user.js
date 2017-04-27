// ==UserScript==
// @name        OneSignal Enhancer
// @namespace   http://iulianonofrei.com
// @version     0.2
// @author      Iulian Onofrei
// @updateURL	https://gist.github.com/raw/db5d9936d7e7aa8b99f0908898674930/OneSignal_Enhancer.user.js
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
