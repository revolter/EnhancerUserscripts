// ==UserScript==
// @name         V LIVE Enhancer
// @namespace    http://iulianonofrei.com
// @version      0.6.2
// @author       Iulian Onofrei
// @updateURL    https://github.com/revolter/EnhancerUserscripts/raw/master/scripts/V_LIVE/V_LIVE_Enhancer.user.js
// @match        http://www.vlive.tv/video/*
// @require      https://raw.githubusercontent.com/revolter/min/master/min.min.js
// ==/UserScript==

(() => {
    "use strict";

    const
        CUSTOM_SUBTITLE_ID = "io-custom-subtitle",
        SUBTITLE_PARTS_REGEX = /(\[[^\]]*\])|([^[\n]+)/g;

    min.dom.onNodeExists(min.dom.getByXPath, "//div[@data-subtitle-container]", (container) => {
        min.dom.addObserver(() => {
            const subtitle = min.dom.getByXPath("//div[@data-subtitle-display]");

            if (!subtitle) {
                return;
            }

            if (!subtitle.firstChild) {
                return;
            }

            if (subtitle.firstChild.id === CUSTOM_SUBTITLE_ID) {
                return;
            }

            const
                subtitleText = subtitle.innerHTML.replace(/<br\s*[/]?>/gi, "\n"),
                subtitlePartsText = subtitleText.match(SUBTITLE_PARTS_REGEX);

            if (!subtitlePartsText || subtitlePartsText.length === min.EMPTY) {
                return;
            }

            while (subtitle.firstChild) {
                subtitle.firstChild.remove();
            }

            const customSubtitle = document.createElement("span");

            customSubtitle.id = CUSTOM_SUBTITLE_ID;

            subtitle.appendChild(customSubtitle);

            min.forEach(subtitlePartsText, (item) => {
                const subtitlePartText = item.trim();

                if (subtitlePartText.length === min.EMPTY) {
                    return;
                }

                const newSubtitlePart = document.createElement("span");

                newSubtitlePart.innerHTML = subtitlePartText;

                if (subtitlePartText.startsWith("[")) {
                    newSubtitlePart.style.color = "#767676";
                }

                customSubtitle.appendChild(newSubtitlePart);

                const lineBreak = document.createElement("br");

                customSubtitle.appendChild(lineBreak);
            });
        }, container);
    });
})();
