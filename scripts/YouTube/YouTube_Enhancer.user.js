// ==UserScript==
// @name		YouTube Enhancer
// @namespace	http://iulianonofrei.com
// @version		0.1
// @author		Iulian Onofrei
// @match		https://youtube.com/watch?v=*
// @match		https://www.youtube.com/watch?v=*
// @require		https://gist.githubusercontent.com/raw/dab432d4b4bbb672896b/min.js
// @grant		GM_addStyle
// ==/UserScript==

(function() {
	'use strict';

	function setWide(isWide) {
		if (isWide) {
			document.body.classList.add("io-wide");
		} else {
			document.body.classList.remove("io-wide");
		}
	}

	var isWide = min.dom.getByClassName("watch-wide");

	setWide(isWide);

	min.dom.addObserver(function (mutations) {
		var
			node = mutations[0].target,
			isWide = node.className.indexOf("watch-wide") !== -1;

		setWide(isWide);
	}, min.dom.getById("page"), {attributes: true});

	min.gm.style({
		".io-wide #masthead-positioner, .io-wide #masthead-positioner-height-offset": {
			"display": "none"
		},
		".io-wide #player": {
			"height": window.innerHeight + "px"
		},
		".io-wide .player-height": {
			"width": "100%",
			"height": "100%",
			"left": "-50%"
		},
		".io-wide .html5-video-container": {
			"height": "100%"
		},
		".io-wide .html5-main-video": {
			"width": "100%",
			"height": "100%",
			"top": "0",
			"left": "0"
		},
		".io-wide .ytp-chrome-bottom": {
			"width": "100%",
			"left": "0"
		}
	});
})();
