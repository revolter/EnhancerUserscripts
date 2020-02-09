// ==UserScript==
// @name         GitHub Enhancer
// @namespace    http://iulianonofrei.com
// @version      1.8.2
// @author       Iulian Onofrei
// @updateURL    https://github.com/revolter/EnhancerUserscripts/raw/master/scripts/GitHub/GitHub_Enhancer.user.js
// @match        https://gist.github.com/*/*
// @match        https://github.com/*
// @require      https://raw.githubusercontent.com/revolter/min/master/min.min.js
// @grant        GM_addStyle
// ==/UserScript==

(() => {
    "use strict";

    const SHORT_COMMIT_HASH_LENGTH = 7;

    min.gm.style({
        ".container": {
            "width": "90%"
        },
        "#js-repo-pjax-container": {
            "width": "100%"
        },
        ".container.new-discussion-timeline": {
            "width": "calc(100% - 150px)"
        },
        ".js-comment-container, .timeline-comment-wrapper": {
            "max-width": "100%"
        },
        ".css-truncate-target": {
            "max-width": "100%"
        }
    });

    if (min.isOnPath("notifications")) {
        const notifications = min.dom.getByClassName("js-notification-target", min.dom.ALL);

        min.forEach(notifications, (notification) => {
            let prefix, reference;

            if (notification.href.indexOf("commit") === min.NOT_FOUND) {
                prefix = "#";
                reference = notification.href.match(/\d+(?=$|#|\/)/u)[min.FIRST];
            } else {
                prefix = "@";
                reference = notification.href.match(/\w+(?=$|#|\/)/u)[min.FIRST].substr(min.FIRST, SHORT_COMMIT_HASH_LENGTH);
            }

            // eslint-disable-next-line no-param-reassign
            notification.textContent = `(${prefix}${reference}) ${notification.textContent}`;
        });

        min.gm.style({
            ".page-content.container": {
                "width": "90%"
            },
            ".list-group-item-name.css-truncate": {
                "max-width": "calc(100% - 300px)"
            },
            ".list-group-item-link": {
                "max-width": "100%"
            },
            ".notifications .read .list-group-item-name": {
                "opacity": "0.4"
            }
        });
    } else if (min.isOnPath("/issues/") || min.isOnPath("/pull/")) {
        const
            SCROLL_TOP = 0,
            HEADER_BOTTOM_MARGIN = 15,

            header = min.dom.getById("partial-discussion-header"),
            headerAbsoluteFrame = header.getBoundingClientRect(),
            headerAbsoluteTop = headerAbsoluteFrame.top + window.scrollY,
            headerAbsoluteLeft = headerAbsoluteFrame.left + window.scrollX,
            headerWidth = header.offsetWidth,
            headerHeight = header.offsetHeight,
            dummyHeader = document.createElement("div"),
            onScroll = function () {
                if (window.scrollY > headerAbsoluteTop) {
                    header.parentNode.classList.add("io-floating");
                } else {
                    header.parentNode.classList.remove("io-floating");
                }
            };

        dummyHeader.className = "io-dummy-header";

        min.dom.insertBefore(dummyHeader, header);

        min.gm.style({
            ".discussion-timeline": {
                "width": "calc(100% - 240px)"
            },
            ".io-floating #partial-discussion-header": {
                "position": "fixed",
                "top": "0",
                "left": `${headerAbsoluteLeft}px`,
                "width": `${headerWidth}px`,
                "z-index": "999",
                "background-color": "white"
            },
            ".io-dummy-header": {
                "display": "none",
                "width": `${headerWidth}px`,
                "height": `${headerHeight}px`,
                "margin-bottom": `${HEADER_BOTTOM_MARGIN}px`
            },
            ".io-floating .io-dummy-header": {
                "display": "block"
            }
        });

        window.addEventListener("scroll", onScroll, false);

        onScroll();

        if (window.scrollY > SCROLL_TOP) {
            // eslint-disable-next-line space-unary-ops
            window.scrollBy(SCROLL_TOP, - (headerHeight + HEADER_BOTTOM_MARGIN));
        }
    } else {
        const actionsBar = min.dom.getByClassName("file-actions");

        if (min.isOnPath(/[^/]+\/blob\/.+/u)) {
            const
                permalinkShortcutLink = min.dom.getByClassName("js-permalink-shortcut"),
                permalinkButton = document.createElement("a");

            permalinkButton.text = "Permalink";
            permalinkButton.className = "btn btn-sm";
            permalinkButton.href = permalinkShortcutLink.href;

            min.dom.insertBefore(permalinkButton, actionsBar.firstElementChild);
        } else if (min.isOnWebsite("gist.github")) {
            const
                rawButton = min.dom.getByXPath("//a[contains(@class, 'btn btn-sm') and text() = 'Raw']"),
                rawScriptButton = document.createElement("a");

            rawScriptButton.text = "Raw Script";
            rawScriptButton.className = "btn btn-sm";
            rawScriptButton.style.cssText = "margin-left: 5px";
            rawScriptButton.href = rawButton.href.replace(/revolter(?<id>\/[^/]+)\/raw\/[^/]+/u, "raw$<id>");

            min.dom.insertAfter(rawScriptButton, actionsBar.lastElementChild);
        }
    }
})();
