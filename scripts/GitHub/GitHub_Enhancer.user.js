// ==UserScript==
// @name		GitHub Enhancer
// @namespace	http://iulianonofrei.com
// @version		0.6
// @author		Iulian Onofrei
// @updateURL	https://gist.github.com/raw/187bc89d5e48990dfc38c02bcd5460c2/GitHub_Enhancer.user.js
// @match		https://gist.github.com/*/*
// @match		https://github.com/*
// @match		https://github.com/notifications
// @require		https://gist.githubusercontent.com/raw/dab432d4b4bbb672896b/min.js
// @grant		GM_addStyle
// ==/UserScript==

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
} else if (min.isOnWebsite("gist.github")) {
	var
		rawButton = min.dom.getByClassName("file-actions"),
		rawScriptButton = rawButton.cloneNode(true),
		rawScriptButtonLink = min.dom.getByTagName("a", 0, rawScriptButton);

	rawScriptButtonLink.textContent = "Raw Script";
	rawScriptButtonLink.href = rawScriptButtonLink.href.replace(/revolter(\/[^\/]+)\/raw\/[^\/]+/, "raw$1");

	min.dom.style(rawScriptButtonLink, {
		"margin-right": "10px"
	});

	min.gm.style({
		".container": {
			"width": "90%"
		}
	});

	min.dom.insertAfter(rawScriptButton, rawButton);
} else {
	min.gm.style([{
		".container": {
			"width": "90%"
		}
	}, {
		"#js-repo-pjax-container": {
			"width": "100%"
		}
	}, {
		".container.new-discussion-timeline": {
			"width": "calc(100% - 150px)"
		}
	}, {
		".discussion-timeline": {
			"width": "calc(100% - 240px)"
		}
	}, {
		".js-comment-container": {
			"max-width": "100%"
		}
	}]);
}
