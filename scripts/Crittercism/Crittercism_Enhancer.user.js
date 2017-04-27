// ==UserScript==
// @name        Crittercism Enhancer
// @namespace   http://iulianonofrei.com
// @author      Iulian Onofrei
// @include     https://app.crittercism.com/*
// @require		https://gist.githubusercontent.com/raw/dab432d4b4bbb672896b/min.js
// @grant       GM_addStyle
// ==/UserScript==

min.dom.onNodeExists(min.dom.getById, "stacktraceTabContents", function() {
	var lines = min.dom.getByXPath("//table[@class = 'trace']/tbody/tr[td[class = 'trace' and contains(text(), 'com.atistudios') or contains(text(), 'Mondly')]]", min.dom.ALL);

	lines.forEach(function(line) {
		if (line.className) {
			if (line.className.indexOf("io-error") !== -1) {
				return;
			}

			if (line.className.indexOf("suspect-line") !== -1) {
				return;
			}
		}

		line.className = "io-error";
	});
}, false);

var symbolicateButton = $("#symbolicate-link")[0];

if (symbolicateButton) {
	symbolicateButton.click();

	window.location.reload();
} else {
	var queuedLabel = $(".break-normal.queued-info")[0];

	if (queuedLabel && queuedLabel.textContent.trim() == "Crash queued for symbolication") {
		window.location.reload();
	}
}

min.gm.style({
	".io-error": {
		"background-color": "rgba(255, 0, 0, 0.1)"
	},
	".io-error td": {
		"background-color": "transparent"
	}
});
