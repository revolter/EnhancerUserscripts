// ==UserScript==
// @name         Bandcamp Enhancer
// @namespace    http://iulianonofrei.com
// @version      0.3
// @author       Iulian Onofrei
// @updateURL    https://gist.github.com/raw/e4f1b561646cfa0b85a795da24e52a42/Bandcamp_Enhancer.user.js
// @match        https://*.bandcamp.com/album/*
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
