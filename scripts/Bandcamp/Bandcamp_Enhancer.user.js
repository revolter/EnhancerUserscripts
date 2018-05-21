// ==UserScript==
// @name         Bandcamp Enhancer
// @namespace    http://iulianonofrei.com
// @version      0.4.2
// @author       Iulian Onofrei
// @updateURL    https://github.com/revolter/EnhancerUserscripts/raw/master/scripts/Bandcamp/Bandcamp_Enhancer.user.js
// @match        https://*.bandcamp.com/album/*
// @match        https://*.bandcamp.com/releases
// @require      https://raw.githubusercontent.com/revolter/min/master/min.min.js
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

	min.gm.style({
		".current_track .title-col .title a": {
			"color": "red"
		}
	});
})();
