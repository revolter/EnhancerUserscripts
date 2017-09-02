// ==UserScript==
// @name         YouTube Enhancer
// @namespace    http://iulianonofrei.com
// @version      0.6
// @author       Iulian Onofrei
// @updateURL    https://gist.github.com/raw/c6ca9ed14d388e6e7e8278cebc3dfb29/YouTube_Enhancer.user.js
// @match        https://youtube.com/*
// @match        https://www.youtube.com/*
// @require      https://gist.githubusercontent.com/raw/dab432d4b4bbb672896b/min.js
// @grant        GM_addStyle
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

    function checkWide(element) {
        if (!element.title) {
            return;
        }

        var isWide = element.title == "Default view";

        setWide(isWide);
    }

    var isWide = min.dom.getByClassName("watch-wide");

    setWide(isWide);

    min.dom.onNodeExists(min.dom.getByClassName, "ytp-size-button", function(target) {
        checkWide(target);

        min.dom.addObserver(function (mutations) {
            var element = mutations[0].target;

            checkWide(node);
        }, target, {attributes: true, childNodes: true});
    });

    min.dom.onNodeExists(min.dom.getById, "masthead-container", function(target) {
        min.gm.style({
            ".io-wide #top > #container": {
                "margin-top": min.dom.getById("masthead-container").offsetHeight + "px"
            }
        });
    });

    min.gm.style({
        ".io-wide #masthead-container": {
            "position": "absolute",
            "top": window.innerHeight + "px"
        },
        ".io-wide #page-manager": {
            "margin-top": "0"
        },
        ".io-wide #player": {
            "max-height": window.innerHeight + "px"
        },
        ".io-wide .html5-video-container, .io-wide video": {
            "width": "100%",
            "height": "100%"
        },
        ".io-wide video": {
            "top": "0",
            "left": "0"
        }
    });
})();
