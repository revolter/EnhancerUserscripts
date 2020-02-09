// ==UserScript==
// @name         YouTube Enhancer
// @namespace    http://iulianonofrei.com
// @version      1.12.1
// @author       Iulian Onofrei
// @updateURL    https://github.com/revolter/EnhancerUserscripts/raw/master/scripts/YouTube/YouTube_Enhancer.user.js
// @match        https://youtube.com/*
// @match        https://www.youtube.com/*
// @require      https://raw.githubusercontent.com/revolter/min/master/min.min.js
// @grant        GM_addStyle
// ==/UserScript==

(() => {
    "use strict";

    const
        FIRST_INDEX = 0,

        ONE_SECOND = 1,

        DEFAULT_FPS = 30,
        DEFAULT_PLAYBACK_SEEK_STEP = 5,
        DEFAULT_PLAYBACK_RATE = 1,

        KEY = {
            "LeftArrow": 37,
            "UpArrow": 38,
            "RightArrow": 39,
            "DownArrow": 40,

            "Zero": 48,
            "Space": 32
        },

        DIRECTION = {
            "None": 0,
            "Horizontal": 1,
            "Vertical": 2
        },

        VOLUME = {
            "Min": 0,
            "Max": 100,
            "Step": 5
        },

        PLAYER_STATE = {
            "Unstarted": -1,
            "Ended": 0,
            "Playing": 1,
            "Paused": 2,
            "Buffering": 3,
            "VideoCued": 5
        };

    let player, info, infoText, infoDelay;

    const
        setWide = function (wide) {
            if (wide) {
                document.body.classList.add("io-wide");
            } else {
                document.body.classList.remove("io-wide");
            }
        },

        checkWide = function (element) {
            if (!element.title) {
                return;
            }

            setWide(element.title === "Default view");
        },

        notify = function (text) {
            clearTimeout(infoDelay);

            info.style.display = "none";

            setTimeout(() => {
                infoText.textContent = text;

                info.style.display = "block";

                infoDelay = setTimeout(() => {
                    info.style.display = "none";
                // eslint-disable-next-line no-magic-numbers
                }, 500);
            // eslint-disable-next-line no-magic-numbers
            }, 1);
        },

        togglePlay = function () {
            const playerState = player.getPlayerState();

            switch (playerState) {
                case PLAYER_STATE.Unstarted: // fall-through
                case PLAYER_STATE.Ended: // fall-through
                case PLAYER_STATE.Paused: // fall-through
                case PLAYER_STATE.Buffering: // fall-through
                case PLAYER_STATE.VideoCued: {
                    player.playVideo();

                    break;
                }
                case PLAYER_STATE.Playing: {
                    player.pauseVideo();

                    break;
                }
                default: {
                    // Do nothing
                }
            }
        },

        // eslint-disable-next-line no-shadow
        shouldHandleEvent = function (event, direction, keys) {
            if (event.target instanceof HTMLInputElement) {
                return false;
            }

            if (event.target instanceof HTMLTextAreaElement) {
                return false;
            }

            const key = event.keyCode;

            switch (direction) {
                case DIRECTION.None: {
                    if (keys.indexOf(key) === min.NOT_FOUND) {
                        return false;
                    }

                    break;
                }
                case DIRECTION.Horizontal: {
                    if (key !== KEY.LeftArrow && key !== KEY.RightArrow) {
                        return false;
                    }

                    break;
                }
                case DIRECTION.Vertical: {
                    if (key !== KEY.UpArrow && key !== KEY.DownArrow) {
                        return false;
                    }

                    break;
                }
                default: {
                    return false;
                }
            }

            return true;
        },

        setVolume = function (key) {
            const currentVolume = player.getVolume();

            let nextVolume;

            switch (key) {
                case KEY.UpArrow: {
                    nextVolume = currentVolume + VOLUME.Step;

                    break;
                }
                case KEY.DownArrow: {
                    // eslint-disable-next-line space-unary-ops
                    nextVolume = currentVolume - VOLUME.Step;

                    break;
                }
                default: {
                    return;
                }
            }

            if (nextVolume < VOLUME.Min) {
                nextVolume = VOLUME.Min;
            }

            if (nextVolume > VOLUME.Max) {
                nextVolume = VOLUME.Max;
            }

            if (player.isMuted()) {
                player.unMute();
            }

            player.setVolume(nextVolume);

            notify(`${nextVolume}%`);
        },

        // eslint-disable-next-line no-shadow
        setPlaybackRate = function (event) {
            const
                key = event.keyCode,

                availableRates = player.getAvailablePlaybackRates(),
                currentRate = player.getPlaybackRate(),
                currentRateIndex = availableRates.indexOf(currentRate);

            if (currentRateIndex === min.NOT_FOUND) {
                return;
            }

            let nextRateIndex;

            switch (key) {
                case KEY.Zero: {
                    nextRateIndex = availableRates.indexOf(DEFAULT_PLAYBACK_RATE);

                    break;
                }
                case KEY.UpArrow: {
                    // eslint-disable-next-line no-magic-numbers
                    nextRateIndex = currentRateIndex + 1;

                    break;
                }
                case KEY.DownArrow: {
                    // eslint-disable-next-line no-magic-numbers
                    nextRateIndex = currentRateIndex - 1;

                    break;
                }
                default: {
                    return;
                }
            }

            if (nextRateIndex < FIRST_INDEX) {
                nextRateIndex = FIRST_INDEX;
            }

            if (nextRateIndex >= availableRates.length) {
                // eslint-disable-next-line no-magic-numbers
                nextRateIndex = availableRates.length - 1;
            }

            const nextRate = availableRates[nextRateIndex];

            player.setPlaybackRate(nextRate);

            notify(`${nextRate}x`);
        },

        seekByTime = function (key) {
            let nextSeek;

            switch (key) {
                case KEY.LeftArrow: {
                    // eslint-disable-next-line space-unary-ops
                    nextSeek = - DEFAULT_PLAYBACK_SEEK_STEP;

                    break;
                }
                case KEY.RightArrow: {
                    nextSeek = DEFAULT_PLAYBACK_SEEK_STEP;

                    break;
                }
                default: {
                    return;
                }
            }

            player.seekBy(nextSeek);
        },

        seekByFrame = function (key) {
            // Taken from https://github.com/ParticleCore/Particle/blob/d9964d548634889529a9949ada30e4d1260ea9fb/src/Userscript/YouTubePlus.user.js#L1001-L1039

            let fps;

            if (window.ytplayer && window.ytplayer.config && window.ytplayer.config.args && window.ytplayer.config.args.adaptive_fmts) {
                const
                    pi = player.getVideoStats().fmt,
                    temp = window.ytplayer.config.args.adaptive_fmts.split(",");

                let index = temp.length;

                // eslint-disable-next-line no-plusplus
                while (index--) {
                    if (temp[index].indexOf(`itag=${pi}`) > FIRST_INDEX) {
                        fps = parseInt(temp[index].match(/fps=([\d]+)/)[1], 10);

                        break;
                    }
                }
            }

            // eslint-disable-next-line no-magic-numbers
            if (!fps || fps === 1) {
                fps = DEFAULT_FPS;
            }

            // eslint-disable-next-line no-extra-parens, no-magic-numbers
            fps = ((key < KEY.RightArrow && -1) || 1) * ((fps < 2 && DEFAULT_FPS) || fps);

            if (fps && player) {
                if (!player.paused) {
                    player.pauseVideo();
                }

                player.seekBy(ONE_SECOND / fps);
            }
        },

        // eslint-disable-next-line no-shadow
        onKeyDown = function (event) {
            const key = event.keyCode;

            if (shouldHandleEvent(event, DIRECTION.Horizontal)) {
                if (event.shiftKey) {
                    seekByFrame(key);
                } else {
                    seekByTime(key);
                }
            } else if (shouldHandleEvent(event, DIRECTION.Vertical)) {
                if (event.shiftKey) {
                    setPlaybackRate(event);
                } else {
                    setVolume(key);
                }
            } else if (shouldHandleEvent(event, DIRECTION.None, [KEY.Zero])) {
                if (event.shiftKey) {
                    setPlaybackRate(event);
                }
            } else if (shouldHandleEvent(event, DIRECTION.None, [KEY.Space])) {
                togglePlay();
            } else {
                // Don't fall-through to the propagation stop calls

                return;
            }

            event.preventDefault();
            event.stopImmediatePropagation();
        };

    setWide(min.dom.getByClassName("watch-wide"));

    min.dom.onNodeExists(min.dom.getById, "movie_player", (node) => {
        player = node;

        document.addEventListener("keydown", onKeyDown, true);
    });

    min.dom.onNodeExists(min.dom.getByClassName, "ytp-size-button", (target) => {
        checkWide(target);

        min.dom.addObserver((mutations) => {
            const element = mutations[0].target;

            checkWide(element);
        }, target, {"attributes": true});
    }, false);

    min.dom.onNodeExists(min.dom.getById, "masthead-container", () => {
        min.gm.style({
            ".io-wide #top > #container": {
                "margin-top": `${min.dom.getById("masthead-container").offsetHeight}px`
            }
        });
    });

    min.dom.onNodeExists(min.dom.getByTagName, "video", (target) => {
        min.dom.addObserver((mutations) => {
            const element = mutations[0].target;

            if (element.src === "") {
                setWide(false);
            }
        }, target, {"attributes": true});
    });

    min.dom.onNodeExists(min.dom.getByClassName, "ytp-bezel", (target) => {
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
            "top": `${window.innerHeight}px`
        },
        ".io-wide #page-manager": {
            "margin-top": "0"
        },
        ".io-wide #player": {
            "max-height": `${window.innerHeight}px`
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
