// ==UserScript==
// @name         V LIVE Enhancer
// @namespace    http://iulianonofrei.com
// @version      0.6
// @author       Iulian Onofrei
// @updateURL    https://gist.github.com/raw/e798d141e0b0367a8e68c7c68372aa89/V_LIVE_Enhancer.user.js
// @match        http://www.vlive.tv/video/*
// @require      https://gist.githubusercontent.com/raw/dab432d4b4bbb672896b/min.js
// ==/UserScript==

(function() {
    'use strict';

    var
        CUSTOM_SUBTITLE_ID = "io-custom-subtitle",
        SUBTITLE_PARTS_REGEX = /(\[[^\]]*\])|([^\[\n]+)/g;

    min.dom.onNodeExists(min.dom.getByXPath, "//div[@data-subtitle-container]", function (container) {
        min.dom.addObserver(function () {
            var subtitle = min.dom.getByXPath.apply(min.dom, ["//div[@data-subtitle-display]"]);

            if(!subtitle) {
                return;
            }

            if (!subtitle.firstChild) {
                return;
            }

            if (subtitle.firstChild.id === CUSTOM_SUBTITLE_ID) {
                return;
            }

            var
                subtitleText = subtitle.innerHTML.replace(/<br\s*[\/]?>/gi, "\n"),
                subtitlePartsText = subtitleText.match(SUBTITLE_PARTS_REGEX);

            if (!subtitlePartsText || subtitlePartsText.length === 0) {
                return;
            }

            while (subtitle.firstChild) {
                subtitle.firstChild.remove();
            }

            var customSubtitle = document.createElement("span");

            customSubtitle.id = CUSTOM_SUBTITLE_ID;

            subtitle.appendChild(customSubtitle);

            min.forEach(subtitlePartsText, function (subtitlePartText) {
                subtitlePartText = subtitlePartText.trim();

                if (subtitlePartText.length == 0) {
                    return;
                }

                var newSubtitlePart = document.createElement("span");

                newSubtitlePart.innerHTML = subtitlePartText;

                if (subtitlePartText.startsWith("[")) {
                    newSubtitlePart.style.color = "#767676";
                }

                customSubtitle.appendChild(newSubtitlePart);

                var lineBreak = document.createElement("br");

                customSubtitle.appendChild(lineBreak);
            });
        }, container);
    });
})();
