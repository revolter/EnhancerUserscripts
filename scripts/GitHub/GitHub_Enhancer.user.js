// ==UserScript==
// @name		GitHub Enhancer
// @namespace	http://iulianonofrei.com
// @version		1.2
// @author		Iulian Onofrei
// @updateURL	https://gist.github.com/raw/187bc89d5e48990dfc38c02bcd5460c2/GitHub_Enhancer.user.js
// @match		https://gist.github.com/*/*
// @match		https://github.com/*
// @require		https://gist.githubusercontent.com/raw/dab432d4b4bbb672896b/min.js
// @grant		GM_addStyle
// ==/UserScript==

min.gm.style({
	".container": {
		"width": "90%"
	},
	"#js-repo-pjax-container": {
		"width": "100%"
	},
	".container.new-discussion-timeline": {
		"width": "calc(100% - 150px)"
	},
	".discussion-timeline": {
		"width": "calc(100% - 240px)"
	},
	".js-comment-container, .timeline-comment-wrapper": {
		"max-width": "100%"
	}
});

if (min.isOnPath("notifications")) {
	var notifications = min.dom.getByClassName("js-notification-target", min.dom.ALL);

	min.forEach(notifications, function(notification) {
		var prefix;

		if (notification.href.indexOf("commit") === -1) {
			prefix = "#" + notification.href.match(/\d+(?=$|#)/)[0];
		} else {
			prefix = "@" + notification.href.match(/\w+(?=$|#)/)[0].substr(0, 7);
		}

		notification.textContent = "(" + prefix + ") " + notification.textContent;
	});

	min.gm.style({
		".page-content.container": {
			"width": "90%"
		},
		".list-group-item-name.css-truncate": {
			"max-width": "calc(100% - 300px)"
		},
		".list-group-item-link": {
			"max-width": "100%"
		}
	});
} else if (min.isOnPath("/issues/")) {
	var
		header = min.dom.getById("partial-discussion-header"),
		headerAbsoluteFrame = header.getBoundingClientRect(),
		headerAbsoluteTop = headerAbsoluteFrame.top + window.scrollY,
		headerAbsoluteLeft = headerAbsoluteFrame.left + window.scrollX,
		headerWidth = header.offsetWidth,
		headerHeight = header.offsetHeight,
		dummyHeader = document.createElement("div");

	if (window.scrollY > 0) {
		window.scrollBy(0, - (headerHeight + 15));
	}

	dummyHeader.className = "io-dummy-header";

	min.dom.insertBefore(dummyHeader, header);

	min.gm.style({
		".io-floating #partial-discussion-header": {
			"position": "fixed",
			"top": "0",
			"left": headerAbsoluteLeft + "px",
			"width": headerWidth + "px",
			"z-index": "1",
			"background-color": "white"
		},
		".io-dummy-header": {
			"display": "none",
			"width": headerWidth + "px",
			"height": headerHeight + "px",
			"margin-bottom": "15px"
		},
		".io-floating .io-dummy-header": {
			"display": "block"
		}
	});

	window.addEventListener("scroll", onScroll, false);

	onScroll();
} else if (min.isOnPath(/[^\/]+\/blob\/.+/)) {
	var
		actionsBar = min.dom.getByClassName("file-actions"),
		permalinkShortcutLink = min.dom.getByClassName("js-permalink-shortcut"),
		permalinkButton = document.createElement("a");

	permalinkButton.text = "Permalink";
	permalinkButton.className = "btn btn-sm";
	permalinkButton.href = permalinkShortcutLink.href;

	min.dom.insertBefore(permalinkButton, actionsBar.firstElementChild);
} else if (min.isOnWebsite("gist.github")) {
	var
		actionsBar = min.dom.getByClassName("file-actions"),
		rawButton = min.dom.getByXPath("//a[contains(@class, 'btn btn-sm') and text() = 'Raw']"),
		rawScriptButton = document.createElement("a");

	rawScriptButton.text = "Raw Script";
	rawScriptButton.className = "btn btn-sm";
	rawScriptButton.style.cssText = "margin-left: 5px";
	rawScriptButton.href = rawButton.href.replace(/revolter(\/[^\/]+)\/raw\/[^\/]+/, "raw$1");

	min.dom.insertAfter(rawScriptButton, actionsBar.lastElementChild);
}

function onScroll() {
	if (window.scrollY > headerAbsoluteTop) {
		header.parentNode.classList.add("io-floating");
	} else {
		header.parentNode.classList.remove("io-floating");
	}
}
