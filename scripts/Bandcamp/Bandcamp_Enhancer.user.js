// ==UserScript==
// @name         Bandcamp Enhancer
// @namespace    http://iulianonofrei.com
// @version      0.1
// @author       Iulian Onofrei
// @match        https://nord.bandcamp.com/album/era-marf
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
