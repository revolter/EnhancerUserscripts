// ==UserScript==
// @name         YouTube Enhancer
// @namespace    http://iulianonofrei.com
// @version      1.5
// @author       Iulian Onofrei
// @updateURL    https://gist.github.com/raw/c6ca9ed14d388e6e7e8278cebc3dfb29/YouTube_Enhancer.user.js
// @match        https://youtube.com/*
// @match        https://www.youtube.com/*
// @require      https://gist.githubusercontent.com/raw/dab432d4b4bbb672896b/min.js
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    var Key = {
        LeftArrow: 37,
        UpArrow: 38,
        RightArrow: 39,
        DownArrow: 40,

        Zero: 48
    };

    var Direction = {
        None: 0,
        Horizontal: 1,
        Vertical: 2
    };

    var Volume = {
        Min: 0,
        Max: 100,
        Step: 5
    };

    var DefaultPlaybackSeekStep = 5;
    var DefaultPlaybackRate = 1;

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

    function shouldHandleEvent(event, direction) {
        if (event.target instanceof HTMLInputElement) {
            return false;
        }

        if (event.target instanceof HTMLTextAreaElement) {
            return false;
        }

        var key = event.keyCode;

        console.log("KEY:", key);

        switch (direction) {
            case Direction.None: {
                break;
            }
            case Direction.Horizontal: {
                if (key != Key.LeftArrow && key != Key.RightArrow) {
                    return false;
                }

                break;
            }
            case Direction.Vertical: {
                if (key != Key.UpArrow && key != Key.DownArrow) {
                    return false;
                }

                break;
            }
        }

        return true;
    }

    function seekByTime(event) {
        if (!shouldHandleEvent(event, Direction.Horizontal)) {
            return;
        }

        if (event.shiftKey) {
            return;
        }

        var key = event.keyCode;

        var nextSeek;

        switch (key) {
            case Key.LeftArrow: {
                nextSeek = - DefaultPlaybackSeekStep;

                break;
            }
            case Key.RightArrow: {
                nextSeek = DefaultPlaybackSeekStep;

                break;
            }
        }

        player.seekBy(nextSeek);

        event.preventDefault();
        event.stopImmediatePropagation();
    }

    function setVolume(event) {
        if (!shouldHandleEvent(event, Direction.Vertical)) {
            return;
        }

        if (event.shiftKey) {
            return;
        }

        var key = event.keyCode;

        var currentVolume = player.getVolume();

        var nextVolume;

        switch (key) {
            case Key.UpArrow: {
                nextVolume = currentVolume + Volume.Step;

                break;
            }
            case Key.DownArrow: {
                nextVolume = currentVolume - Volume.Step;

                break;
            }
        }

        if (nextVolume < Volume.Min) {
            nextVolume = Volume.Min;
        }

        if (nextVolume > Volume.Max) {
            nextVolume = Volume.Max;
        }

        if (player.isMuted()) {
            player.unMute();
        }

        player.setVolume(nextVolume);

        event.preventDefault();
        event.stopImmediatePropagation();
    }

    function seekByFrame(event) {
        if (!shouldHandleEvent(event, Direction.Horizontal)) {
            return;
        }

        if (!event.shiftKey) {
            return;
        }

        var key = event.keyCode;

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

        fps = ((key < Key.RightArrow && -1) || 1) * ((fps < 2 && 30) || fps);

        if (fps && player) {
            if (!player.paused) {
                player.pauseVideo();
            }

            player.seekBy(1 / fps);
        }

        event.preventDefault();
        event.stopImmediatePropagation();
    }

    function setPlaybackRate(event) {
        if (!shouldHandleEvent(event, Direction.Vertical)) {
            return;
        }

        if (!event.shiftKey) {
            return;
        }

        var key = event.keyCode;

        if (key != Key.Zero) {
            return;
        }

        var
            availableRates = player.getAvailablePlaybackRates(),
            currentRate = player.getPlaybackRate(),
            currentRateIndex = availableRates.indexOf(currentRate);

        if (currentRateIndex == -1) {
            return;
        }

        var nextRateIndex;

        switch (key) {
            case Key.Zero: {
                nextRateIndex = availableRates.indexOf(DefaultPlaybackRate);

                break;
            }
            case Key.UpArrow: {
                nextRateIndex = currentRateIndex + 1;

                break;
            }
            case Key.DownArrow: {
                nextRateIndex = currentRateIndex - 1;

                break;
            }
        }

        // prevent the volume listener to be called when holding down the shift key
        event.preventDefault();
        event.stopImmediatePropagation();

        if (nextRateIndex < 0 || nextRateIndex >= availableRates.length) {
            return;
        }

        var nextRate = availableRates[nextRateIndex];

        player.setPlaybackRate(nextRate);
    }

    var isWide = min.dom.getByClassName("watch-wide");

    setWide(isWide);

    min.dom.onNodeExists(min.dom.getById, "movie_player", function(node) {
        player = node;

        document.addEventListener("keydown", seekByTime, true);
        document.addEventListener("keydown", setVolume, true);

        document.addEventListener("keydown", seekByFrame, true);
        document.addEventListener("keydown", setPlaybackRate, true);
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
