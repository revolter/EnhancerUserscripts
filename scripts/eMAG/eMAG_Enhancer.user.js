// ==UserScript==
// @name        eMAG Enhancer
// @description Adds the products to every order.
// @namespace   http://iulianonofrei.com
// @version     1.0.0
// @author      Iulian Onofrei
// @updateURL   https://github.com/revolter/EnhancerUserscripts/raw/master/scripts/eMag/eMag_Enhancer.user.js
// @match       https://www.emag.ro/history/shopping*
// @require     https://raw.githubusercontent.com/revolter/min/master/min.min.js
// @grant       GM_xmlhttpRequest
// ==/UserScript==

/**
 * - Adds the products to every order.
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

        min.dom.iframe(link.href, (iframe) => {
            const
                iframeWindow = iframe.contentWindow,
                iframeDocument = iframe.contentDocument,
                products = min.dom.getByQuery(".product-list > li", min.dom.ALL, iframeDocument.body, iframeWindow);

            products.forEach((product) => {
                const image = min.dom.getByTagName("img", min.dom.FIRST, product, iframeWindow);

                image.style.marginRight = "10px";

                order.appendChild(product);
            });
        });
    });
})();
