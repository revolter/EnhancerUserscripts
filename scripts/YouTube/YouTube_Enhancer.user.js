// ==UserScript==
// @name         YouTube Enhancer
// @namespace    http://iulianonofrei.com
// @version      1.12
// @author       Iulian Onofrei
// @updateURL    https://github.com/revolter/EnhancerUserscripts/raw/master/scripts/YouTube/YouTube_Enhancer.user.js
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

        Zero: 48,
        Space: 32
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

    var PlayerState = {
        Unstarted: -1,
        Ended: 0,
        Playing: 1,
        Paused: 2,
        Buffering: 3,
        VideoCued: 5
    };

    var DefaultPlaybackSeekStep = 5;
    var DefaultPlaybackRate = 1;

    var player, info, infoText, infoDelay;

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

    function notify(text) {
        clearTimeout(infoDelay);

        info.style.display = "none";

        setTimeout(function () {
            infoText.textContent = text;

            info.style.display = "block";

            infoDelay = setTimeout(function() {
                info.style.display = "none";
            }, 500);
        }, 1);
    }

    function shouldHandleEvent(event, direction, keys) {
        if (event.target instanceof HTMLInputElement) {
            return false;
        }

        if (event.target instanceof HTMLTextAreaElement) {
            return false;
        }

        var key = event.keyCode;

        switch (direction) {
            case Direction.None: {
                if (keys.indexOf(key) === -1) {
                    return false;
                }

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

    function onKeyDown(event) {
        var key = event.keyCode;

        if (shouldHandleEvent(event, Direction.Horizontal)) {
            if (event.shiftKey) {
                seekByFrame(key);
            } else {
                seekByTime(key);
            }
        } else if (shouldHandleEvent(event, Direction.Vertical)) {
            if (event.shiftKey) {
                setPlaybackRate(event);
            } else {
                setVolume(key);
            }
        } else if (shouldHandleEvent(event, Direction.None, [Key.Zero])) {
        	if (event.shiftKey) {
        		setPlaybackRate(event);
        	}
        } else if (shouldHandleEvent(event, Direction.None, [Key.Space])) {
            togglePlay();
        } else {
            // don't fall-through to the propagation stop calls

            return;
        }

        event.preventDefault();
        event.stopImmediatePropagation();
    }

    function seekByTime(key) {
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
    }

    function setVolume(key) {
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

        notify(nextVolume + "%");
    }

    function seekByFrame(key) {
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
    }

    function setPlaybackRate(event) {
        var key = event.keyCode;

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

        if (nextRateIndex < 0) {
            nextRateIndex = 0;
        }

        if (nextRateIndex >= availableRates.length) {
            nextRateIndex = availableRates.length - 1;
        }

        var nextRate = availableRates[nextRateIndex];

        player.setPlaybackRate(nextRate);

        notify(nextRate + "x");
    }

    function togglePlay() {
        var playerState = player.getPlayerState();

        switch (playerState) {
            case PlayerState.Unstarted: // fall-through
            case PlayerState.Ended: // fall-through
            case PlayerState.Paused: // fall-through
            case PlayerState.Buffering: // fall-through
            case PlayerState.VideoCued: {
                player.playVideo();

                break;
            }
            case PlayerState.Playing: {
                player.pauseVideo();

                break;
            }
        }
    }

    var isWide = min.dom.getByClassName("watch-wide");

    setWide(isWide);

    min.dom.onNodeExists(min.dom.getById, "movie_player", function(node) {
        player = node;

        document.addEventListener("keydown", onKeyDown, true);
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

    min.dom.onNodeExists(min.dom.getByClassName, "ytp-bezel", function(target) {
        info = target;

        min.dom.removeNode(info.firstChild);

        infoText = document.createElement("p");

        info.appendChild(infoText);
    });

    min.gm.style({
        ".ytp-bezel p": {
            "position": "absolute",
            "margin": "0",
            "top": "50%",
            "left": "50%",
            "transform": "translate(-50%, -50%)"
        },
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
