// ==UserScript==
// @name        eMAG Enhancer
// @description Adds the products' images to every order.
// @namespace   http://iulianonofrei.com
// @version     0.4.2
// @author      Iulian Onofrei
// @updateURL   https://github.com/revolter/EnhancerUserscripts/raw/master/scripts/eMag/eMag_Enhancer.user.js
// @match       https://www.emag.ro/history/shopping*
// @require     https://raw.githubusercontent.com/revolter/min/master/min.min.js
// @grant       GM_xmlhttpRequest
// ==/UserScript==

/**
 * - Adds the products' images to every order.
 *
 * [Install](https://raw.githubusercontent.com/revolter/EnhancerUserscripts/master/scripts/eMAG/eMAG_Enhancer.user.js)
 * @name eMAG-Enhancer
 */
(() => {
    "use strict";

    min.forEach(min.dom.getByClassName("order-hist-box", min.dom.ALL), (order) => {
        const link = min.dom.getByXPath("/div/a", min.dom.FIRST, order);

        if (!link) {
            return;
        }

        min.gm.xhr(link.href, (doc) => {
            const products = Array.from(min.dom.getByXPath("//ul[contains(@class, 'product-list')]/li", min.dom.ALL, doc));

            min.forEach(products, (product) => {
                const image = min.dom.getByTagName("img", min.dom.FIRST, product);

                image.style.marginRight = "10px";

                order.appendChild(product);
            });
        });
    });
})();
