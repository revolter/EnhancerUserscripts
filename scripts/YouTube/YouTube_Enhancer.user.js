// ==UserScript==
// @name         YouTube Enhancer
// @namespace    http://iulianonofrei.com
// @version      1.2
// @author       Iulian Onofrei
// @updateURL    https://gist.github.com/raw/c6ca9ed14d388e6e7e8278cebc3dfb29/YouTube_Enhancer.user.js
// @match        https://youtube.com/*
// @match        https://www.youtube.com/*
// @require      https://gist.githubusercontent.com/raw/dab432d4b4bbb672896b/min.js
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    var player;

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

    function seekByFrame(event) {
        if (!event.shiftKey) {
            return;
        }

        if (event.keyCode != 37 && event.keyCode != 39) {
            return;
        }

        var fps;

        if (window.ytplayer && window.ytplayer.config && window.ytplayer.config.args && window.ytplayer.config.args.adaptive_fmts) {
            var pi = player.getVideoStats().fmt;
            var temp = window.ytplayer.config.args.adaptive_fmts.split(",");
            var i = temp.length;

            while (i--) {
                if (temp[i].indexOf("itag=" + pi) > 0) {
                    fps = parseInt(temp[i].match(/fps=([\d]+)/)[1]);

                    break;
                }
            }
        }

        if (!fps || fps === 1) {
            fps = 30;
        }

        fps = ((event.keyCode < 39 && -1) || 1) * ((fps < 2 && 30) || fps);

        if (fps && player) {
            if (!player.paused) {
                player.pauseVideo();
            }

            player.seekBy(1 / fps);
        }

        event.preventDefault();
        event.stopImmediatePropagation();
    }

    var isWide = min.dom.getByClassName("watch-wide");

    setWide(isWide);

    min.dom.onNodeExists(min.dom.getById, "movie_player", function(node) {
        player = node;

        document.addEventListener("keydown", seekByFrame, true);
    });

    min.dom.onNodeExists(min.dom.getByClassName, "ytp-size-button", function(target) {
        checkWide(target);

        min.dom.addObserver(function (mutations) {
            var element = mutations[0].target;

            checkWide(element);
        }, target, {attributes: true});
    }, false);

    min.dom.onNodeExists(min.dom.getById, "masthead-container", function(target) {
        min.gm.style({
            ".io-wide #top > #container": {
                "margin-top": min.dom.getById("masthead-container").offsetHeight + "px"
            }
        });
    });

    min.dom.onNodeExists(min.dom.getByTagName, "video", function(target) {
        min.dom.addObserver(function (mutations) {
            var element = mutations[0].target;

            if (element.src === "") {
                setWide(false);
            }
        }, target, {attributes: true});
    });

    min.gm.style({
        ".io-wide ytd-app:not([guide-persistent-and-visible]) #masthead-container": {
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
