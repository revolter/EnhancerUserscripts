// ==UserScript==
// @name         Bandcamp Enhancer
// @namespace    http://iulianonofrei.com
// @version      0.4.1
// @author       Iulian Onofrei
// @updateURL    https://github.com/revolter/EnhancerUserscripts/raw/master/scripts/Bandcamp/Bandcamp_Enhancer.user.js
// @match        https://*.bandcamp.com/album/*
// @match        https://*.bandcamp.com/releases
// @require      https://gist.githubusercontent.com/raw/dab432d4b4bbb672896b/min.js
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
