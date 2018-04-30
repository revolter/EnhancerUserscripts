// ==UserScript==
// @name         V LIVE Enhancer
// @namespace    http://iulianonofrei.com
// @version      0.1
// @author       Iulian Onofrei
// @match        http://www.vlive.tv/video/*
// @require      https://gist.githubusercontent.com/raw/dab432d4b4bbb672896b/min.js
// ==/UserScript==

(function() {
    'use strict';

    min.dom.onNodeExists(min.dom.getByXPath, "//div[@data-subtitle-display]", function (subtitle) {
        var comments = min.dom.getByXPath("/text()[starts-with(., '[') or contains(., ']')]", min.dom.ALL, subtitle);

        min.forEach(comments, function (comment) {
            var newComment = document.createElement("span");

            newComment.textContent = comment.textContent;
            newComment.style.color = "#767676";

            min.dom.insertBefore(newComment, comment);
            min.dom.removeNode(comment);
        });
    }, false);
})();
