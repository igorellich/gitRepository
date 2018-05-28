
define(["dojo/_base/declare",
    "dijit/registry",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/Evented",
    "dijit/_FocusMixin",
    "dojo/text!js/mainWidgetTemplate.html",
    "dojo/on",
    "dojo/dom-attr",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dijit/Tooltip"
],
    function (declare, registry, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented, _FocusMixin, template, on, domAttr, domClass, domStyle, domConstruct, Tooltip) {

        var widget = declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented, _FocusMixin], {
            //шаблон виджета
            templateString: template,
            // {
            //     method: String,
            //     url: String,
            //     params: String | Object,
            //     headers: Object
            // }
            // // Headers and params are optional
            // makeRequest({
            //     method: 'GET',
            //     url: 'http://example.com'
            // })
            //     .then(function (datums) {
            //         return makeRequest({
            //             method: 'POST',
            //             url: datums.url,
            //             params: {
            //                 score: 9001
            //             },
            //             headers: {
            //                 'X-Subliminal-Message': 'Upvote-this-answer'
            //             }
            //         });
            //     })
            //     .catch(function (err) {
            //         console.error('Augh, there was an error!', err.statusText);
            //     }); 
            makeRequest: function (opts) {
                return new Promise(function (resolve, reject) {
                    var xhr = new XMLHttpRequest();
                    xhr.open(opts.method, opts.url);
                    xhr.onload = function () {
                        if (this.status == 0 || (this.status >= 200 && this.status < 300)) {
                            resolve(xhr.response);
                        } else {
                            reject({
                                status: this.status,
                                statusText: xhr.statusText
                            });
                        }
                    };
                    xhr.onerror = function (e) {
                        reject({
                            status: this.status,
                            statusText: xhr.statusText
                        });
                    };
                    if (opts.headers) {
                        Object.keys(opts.headers).forEach(function (key) {
                            xhr.setRequestHeader(key, opts.headers[key]);
                        });
                    }
                    var params = opts.params;
                    // We'll need to stringify if we've been given an object
                    // If we have a string, this is skipped.
                    if (params && typeof params === 'object') {
                        params = Object.keys(params).map(function (key) {
                            return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
                        }).join('&');
                    }
                    try {
                        xhr.send(params);
                    } catch (e) {
                        console.error(e);
                    }
                });
            },
            baseURL: "http://www.binance.com",
            ExchangeInfoTestBlock: {
                test: true,
                "timezone": "UTC",
                "serverTime": 1508631584636,
                "rateLimits": [{
                    "rateLimitType": "REQUESTS",
                    "interval": "MINUTE",
                    "limit": 1200
                },
                {
                    "rateLimitType": "ORDERS",
                    "interval": "SECOND",
                    "limit": 10
                },
                {
                    "rateLimitType": "ORDERS",
                    "interval": "DAY",
                    "limit": 100000
                }
                ],
                "exchangeFilters": [],
                "symbols": [{
                    "symbol": "ETHBTC",
                    "status": "TRADING",
                    "baseAsset": "ETH",
                    "baseAssetPrecision": 8,
                    "quoteAsset": "BTC",
                    "quotePrecision": 8,
                    "orderTypes": ["LIMIT", "MARKET"],
                    "icebergAllowed": false,
                    "filters": [{
                        "filterType": "PRICE_FILTER",
                        "minPrice": "0.00000100",
                        "maxPrice": "100000.00000000",
                        "tickSize": "0.00000100"
                    }, {
                        "filterType": "LOT_SIZE",
                        "minQty": "0.00100000",
                        "maxQty": "100000.00000000",
                        "stepSize": "0.00100000"
                    }, {
                        "filterType": "MIN_NOTIONAL",
                        "minNotional": "0.00100000"
                    }]
                }]
            },
            getExchangeInfo: async function () {
                const me = this;
                const url = me.baseURL + '/api/v1/exchangeIfo';
                let tradeInfo = null;
                try {
                    let tradeInfo = await me.makeRequest({ method: 'GET', url: url });
                } catch (e) {
                    tradeInfo = me.ExchangeInfoTestBlock;
                }
                return tradeInfo;
            },
        });

        return widget;
    });


