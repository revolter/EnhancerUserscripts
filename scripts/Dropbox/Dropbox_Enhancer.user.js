// ==UserScript==
// @name        Dropbox Enhancer
// @description Adds download links to the files from a shared link.
// @namespace   http://iulianonofrei.com
// @version     0.3.2
// @author      Iulian Onofrei
// @updateURL   https://github.com/revolter/EnhancerUserscripts/raw/master/scripts/Dropbox/Dropbox_Enhancer.user.js
// @match       https://www.dropbox.com/sh/*
// @require     https://raw.githubusercontent.com/revolter/min/master/min.min.js
// @grant       none
// ==/UserScript==

/**
 * - Adds download links to the files from a shared link.
 *
 * [Install](https://raw.githubusercontent.com/revolter/EnhancerUserscripts/master/scripts/Dropbox/Dropbox_Enhancer.user.js)
 * @alias Dropbox-Enhancer
 */
(() => {
    "use strict";

    const links = min.dom.getByQuery(".file-link:first-child", min.dom.ALL);

    min.forEach(links, (link) => {
        const linkClone = link.cloneNode();

        linkClone.textContent = "(download)";
        linkClone.href = linkClone.href.replace("dl=0", "dl=1");
        linkClone.style.marginLeft = "6px";

        link.parentNode.insertBefore(linkClone, link.nextSibling);
    });
})();
