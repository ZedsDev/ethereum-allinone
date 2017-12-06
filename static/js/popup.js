var Popup,
    rate = 1;
Popup = {

    /**
     * Get wallets informations
     */
    getWalletsInfos: function() {
        var wallets = JSON.parse(Config.user.wallets),
            walletsSize = Object.keys(wallets).length,
            walletsListContainer = $('.js--wallets-container'),
            id = 1;

        // Reset list
        walletsListContainer.html('');

        // Append templates
        var tpl, res;
        for (var i = 1; i <= walletsSize; i++) {
            id = i;

            tpl = $('.js--wallet-tpl').html().replace(new RegExp("{{id}}", 'g'), id).replace('{{col}}', '6');
            walletsListContainer.append(tpl);

            // Call API asynchronously
            res = App.getAddressInfo(wallets[i].address);
            var json = JSON.parse(res);

            $('.js--wallet-' + i + '-name').html(wallets[i].name);

            if (json['error'] !== undefined) {
                walletValue = 'ERROR';
                walletCurrency = 'ERROR';
            } else {
                walletValue = json['ETH']['balance'];
                walletCurrency = walletValue * rate;
            }
            $('.js--wallet-' + i + '-value').html(walletValue);
            $('.js--wallet-' + i + '-currency').html(App.priceFormatter(walletCurrency + ""));
        }

        // if 0 wallet
        if (walletsSize === 0) {
            $('.no-wallet-info').removeClass('d-none');
        }
    },

    /**
     * Get ETH prices
     */
    getTickerPrices: function () {
        var _this = this;

        App.getTicker(function (response) {
            if (response.readyState === XMLHttpRequest.DONE) {
                if (response.status === 200) {
                    var res = JSON.parse(response.responseText)['result']['XETHZ' + Config.user.currency],
                        price = rate = res['c'][0],
                        opening = res['o'],
                        high = res['h'][1],
                        low = res['l'][1];

                    $('.js--ticker-price').html(App.priceFormatter(price));
                    $('.js--ticker-opening').html(App.priceFormatter(opening));
                    $('.js--ticker-high').html(App.priceFormatter(high));
                    $('.js--ticker-low').html(App.priceFormatter(low));

                    _this.getWalletsInfos();
                }
            }
        });
    },

    /**
     * Init the popup
     */
    init: function () {
        App.updateConfig();
        this.getTickerPrices();

        // Open settings
        $('.js--open-settings').on('click', function () {
            if (chrome.runtime.openOptionsPage) {
                // New way to open options pages, if supported (Chrome 42+).
                chrome.runtime.openOptionsPage();
            } else {
                // Reasonable fallback.
                window.open(chrome.runtime.getURL('options/options.html'));
            }
        });

        // Open manifest.json
        $('.js--open-manifest').on('click', function () {
            window.open(chrome.runtime.getURL('manifest.json'));
        });
    }

};

Popup.init();