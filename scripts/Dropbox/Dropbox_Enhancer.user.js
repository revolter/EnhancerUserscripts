// ==UserScript==
// @name         Dropbox Enhancer
// @namespace    http://iulianonofrei.com
// @version      0.2
// @author       Iulian Onofrei
// @updateURL	 https://gist.github.com/raw/9079a4300b546da8e5761306ce46a56b/Dropbox_Enhancer.user.js
// @match        https://www.dropbox.com/sh/*
// @require      https://gist.githubusercontent.com/raw/dab432d4b4bbb672896b/min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
console.debug("da");
	var links = min.dom.getByQuery(".file-link:first-child", min.dom.ALL);

	min.forEach(links, function(link) {
		var linkClone = link.cloneNode();

		linkClone.textContent = "(download)";
		linkClone.href = linkClone.href.replace("dl=0", "dl=1");
		linkClone.style.marginLeft = "6px";

		link.parentNode.insertBefore(linkClone, link.nextSibling);
	});
})();
