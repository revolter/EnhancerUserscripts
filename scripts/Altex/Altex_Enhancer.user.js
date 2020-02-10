// ==UserScript==
// @name        Altex Enhancer
// @description Adds the products to every order. Adds the page link to every product.
// @namespace   http://iulianonofrei.com
// @version     1.0.0
// @author      Iulian Onofrei
// @updateURL   https://github.com/revolter/EnhancerUserscripts/raw/master/scripts/Altex/Altex_Enhancer.user.js
// @match       https://altex.ro/cont/comenzi/*
// @require     https://raw.githubusercontent.com/revolter/min/master/min.js
// @grant       GM_xmlhttpRequest
// ==/UserScript==

/**
 * - Adds the products to every order.
 * - Adds the page link to every product.
 *
 * [Install](https://raw.githubusercontent.com/revolter/EnhancerUserscripts/master/scripts/Altex/Altex_Enhancer.user.js)
 * @alias Altex-Enhancer
 */
(() => {
    "use strict";

    const
        confirmedOrderBackgroundColor = "rgba(0, 128, 0, 0.2)",
        getCookie = (cookieName) => {
            const
                value = `; ${document.cookie}`,
                parts = value.split(`; ${cookieName}=`);

            // eslint-disable-next-line no-magic-numbers
            if (parts.length !== 2) {
                return null;
            }

            return parts.pop().split(";").shift();
        };

    min.dom.onNodeExists(min.dom.getById, "my-orders-table", (ordersWrapper) => {
        const orders = min.dom.getByQuery("tbody > tr", min.dom.ALL, ordersWrapper);

        orders.forEach((order) => {
            const link = min.dom.getByXPath("/td/div/a", min.dom.FIRST, order);

            if (!link) {
                return;
            }

            const
                orderId = link.href.match(/(?<id>\d+)\/?$/u).groups.id,
                linkWrapper = order.lastElementChild,
                orderStatus = linkWrapper.previousElementSibling.firstElementChild,
                isOrderConfirmed = orderStatus.textContent === "Confirmata integral";

            if (isOrderConfirmed) {
                // eslint-disable-next-line no-param-reassign
                order.style.backgroundColor = confirmedOrderBackgroundColor;
            }

            min.gm.xhr(`https://fenrir.altex.ro/oms/orders/${orderId}`, (response) => {
                const
                    responseJSON = JSON.parse(response),
                    {suborders} = responseJSON.order;

                let products = [];

                suborders.forEach((suborder) => {
                    products = products.concat(suborder.items);
                });

                // eslint-disable-next-line no-magic-numbers
                linkWrapper.rowSpan = products.length + 1;

                products.forEach((product) => {
                    const
                        productTitleText = product.product_name,

                        productSlug = productTitleText.replace(/\W+/gu, "-").toLowerCase(),
                        productLink = `https://altex.ro/${productSlug}/cpd/${product.product_sku}`,

                        productLine = min.dom.create("tr", {
                            "style": {
                                "background-color": isOrderConfirmed ? confirmedOrderBackgroundColor : "#ddd"
                            }
                        }),
                        productLineWrapper = min.dom.create("td", {
                            "colSpan": "5",
                            "align": "left"
                        }),
                        productLineLink = min.dom.create("a", {"href": productLink});

                    productLineWrapper.appendChild(productLineLink);
                    productLine.appendChild(productLineWrapper);

                    productLineLink.textContent = productTitleText;

                    min.dom.insertAfter(productLine, order);
                });
            }, null, "GET", {
                "X-Customer-Token": getCookie("token").replace(/^%22|%22$/gu, "")
            }, true);
        });
    });
})();
