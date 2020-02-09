// ==UserScript==
// @name        Altex Enhancer
// @description Adds the products' images to every order.
// @namespace   http://iulianonofrei.com
// @version     0.7.3
// @author      Iulian Onofrei
// @updateURL   https://github.com/revolter/EnhancerUserscripts/raw/master/scripts/Altex/Altex_Enhancer.user.js
// @match       https://altex.ro/sales/order/history/*
// @require     https://raw.githubusercontent.com/revolter/min/master/min.min.js
// @grant       GM_xmlhttpRequest
// ==/UserScript==

/**
 * - Adds the products' images to every order.
 *
 * [Install](https://raw.githubusercontent.com/revolter/EnhancerUserscripts/master/scripts/Altex/Altex_Enhancer.user.js)
 * @alias Altex-Enhancer
 */
(() => {
    "use strict";

    const confirmedOrderBackgroundColor = "rgba(0, 128, 0, 0.2)";

    min.forEach(min.dom.getByXPath("//div[@class = 'my-account']/div[@class = 'u-container-reset']/table/tbody/tr", min.dom.ALL), (order) => {
        const
            link = min.dom.getByXPath("/td/div/a", min.dom.FIRST, order),
            linkWrapper = order.lastElementChild,
            orderStatus = linkWrapper.previousElementSibling.firstElementChild,
            isOrderConfirmed = orderStatus.textContent === "Confirmat integral";

        if (!link) {
            return;
        }

        if (isOrderConfirmed) {
            // eslint-disable-next-line no-param-reassign
            order.style.backgroundColor = confirmedOrderBackgroundColor;
        }

        min.gm.xhr(link.href, (doc) => {
            const products = Array.from(min.dom.getByXPath("//table[@id = 'my-orders-table']/tbody/tr", min.dom.ALL, doc));

            // eslint-disable-next-line no-magic-numbers
            linkWrapper.rowSpan = products.length + 1;

            min.forEach(products, (product) => {
                const
                    productTitle = min.dom.getByXPath("/td[1]/div", min.dom.FIRST, product),
                    productTitleText = productTitle.textContent,
                    productSlug = productTitleText.replace(/\W+/gu, "-").toLowerCase();

                productTitle.innerHTML = `<a href='https://altex.ro/${productSlug}'>${productTitleText}</a>`;

                // eslint-disable-next-line no-param-reassign
                product.style.backgroundColor = isOrderConfirmed ? confirmedOrderBackgroundColor : "#EEE";

                min.dom.insertAfter(product, order);
            });
        });
    });
})();
