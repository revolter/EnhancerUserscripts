// ==UserScript==
// @name         Media Redirect
// @namespace    http://iulianonofrei.com
// @version      0.6.1
// @author       Iulian Onofrei
// @updateURL    https://github.com/revolter/EnhancerUserscripts/raw/master/scripts/Media_Redirect/Media_Redirect.user.js
// @match        *://www.commitstrip.com/*
// @match        https://www.facebook.com/*
// @match        https://www.google.com/imgres*
// @match        https://www.google.ro/imgres*
// @match        https://www.instagram.com/*
// @require      https://gist.githubusercontent.com/raw/dab432d4b4bbb672896b/min.js
// ==/UserScript==

(function() {
    'use strict';

    var noRedirectQueryParam = "io-no-redirect=1";

    if (window.location.search.indexOf(noRedirectQueryParam) !== -1) {
        return;
    }

    function getRedirectURL(completion) {
        var element;

        if (min.isOnWebsite("commitstrip.com")) {
            min.dom.onNodeExists(min.dom.getByXPath, "//img[contains(@class, 'size-full')]/@src", function(element) {
                completion(element.value);
            });
        } else if (min.isOnWebsite("facebook.com")) {
            if (!min.isOnPath("/photo.php")) {
                completion(null);
            }

            min.dom.onNodeExists(min.dom.getByXPath, "//img[@class = 'spotlight']/@src", function(element) {
                completion(element.value);
            });
        } else if (min.isOnWebsite("google.")) {
            min.dom.onNodeExists(min.dom.getByXPath, "//meta[@property = 'og:image']/@content", function(element) {
                completion(element.value);
            });
        } else if (min.isOnWebsite("instagram.com")) {
            if (!min.isOnPath(/^\/p\/\w+/)) {
                completion(null);
            }

            element = min.dom.getByXPath("//head/meta[@property = 'og:video']/@content");

            if (!element) {
                completion(null);
            }

            completion(element.value);
        }
    }

    getRedirectURL(function(redirectURL) {
        if (!redirectURL) {
            return;
        }

        var
            protocol = window.location.protocol,
            host = window.location.host,
            path = window.location.pathname,
            query = window.location.search,
            noRedirectURL = protocol + "//" + host + path + query + (query ? '&' : '?') + noRedirectQueryParam;

        window.history.pushState(null, null, noRedirectURL);
        window.history.pushState(null, null, noRedirectURL); // this will be skipped because .href doesn't push in the history

        window.location.href = redirectURL;
    });
})();
