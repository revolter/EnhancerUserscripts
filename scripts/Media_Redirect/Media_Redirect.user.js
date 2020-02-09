// ==UserScript==
// @name         Media Redirect
// @namespace    http://iulianonofrei.com
// @version      0.6.2
// @author       Iulian Onofrei
// @updateURL    https://github.com/revolter/EnhancerUserscripts/raw/master/scripts/Media_Redirect/Media_Redirect.user.js
// @match        *://www.commitstrip.com/*
// @match        https://www.facebook.com/*
// @match        https://www.google.com/imgres*
// @match        https://www.google.ro/imgres*
// @match        https://www.instagram.com/*
// @require      https://raw.githubusercontent.com/revolter/min/master/min.min.js
// ==/UserScript==

(() => {
    "use strict";

    const noRedirectQueryParam = "io-no-redirect=1";

    if (window.location.search.indexOf(noRedirectQueryParam) !== min.NOT_FOUND) {
        return;
    }

    const getRedirectURL = (completion) => {
        if (min.isOnWebsite("commitstrip.com")) {
            min.dom.onNodeExists(min.dom.getByXPath, "//img[contains(@class, 'size-full')]/@src", (element) => {
                completion(element.value);
            });
        } else if (min.isOnWebsite("facebook.com")) {
            if (!min.isOnPath("/photo.php")) {
                completion(null);
            }

            min.dom.onNodeExists(min.dom.getByXPath, "//img[@class = 'spotlight']/@src", (element) => {
                completion(element.value);
            });
        } else if (min.isOnWebsite("google.")) {
            min.dom.onNodeExists(min.dom.getByXPath, "//meta[@property = 'og:image']/@content", (element) => {
                completion(element.value);
            });
        } else if (min.isOnWebsite("instagram.com")) {
            if (!min.isOnPath(/^\/p\/\w+/u)) {
                completion(null);
            }

            const element = min.dom.getByXPath("//head/meta[@property = 'og:video']/@content");

            if (!element) {
                completion(null);
            }

            completion(element.value);
        }
    };

    getRedirectURL((redirectURL) => {
        if (!redirectURL) {
            return;
        }

        const {
                protocol,
                host,
                "pathname": path,
                "search": query
            } = window.location,
            noRedirectURL = `${protocol}//${host}${path}${query}${query ? "&" : "?"}${noRedirectQueryParam}`;

        window.history.pushState(null, null, noRedirectURL);

        // This will be skipped because .href doesn't push in the history
        window.history.pushState(null, null, noRedirectURL);

        window.location.href = redirectURL;
    });
})();
