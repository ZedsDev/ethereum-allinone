var rate = 1;

/**
 * Update config
 */
function updateConfig() {
    for (var k in defaultConfig) {
        config[k] = localStorage[k] || defaultConfig[k];
    }
}

/**
 * Format price
 * @param price
 * @returns string
 */
function priceFormatter(price) {
    price = price.substring(0, Math.max(price.indexOf('.'), 0) + 3);
    return currencyConfig[config.currency].prefix ? currencyConfig[config.currency].symbol + price : price + currencyConfig[config.currency].symbol;
}

/**
 * Call Kraken API
 */
function getExchangeRates() {
    $.get("https://api.kraken.com/0/public/Ticker?pair=ETH" + config.currency, function (data) {
        if (data['error'].length === 0) {
            var res = data['result']['XETHZ' + config.currency];
            var price = rate = res['c'][0],
                opening = res['o'],
                high = res['h'][1],
                low = res['l'][1];

            $('.js--ticker-price').html(priceFormatter(price));
            $('.js--ticker-opening').html(priceFormatter(opening));
            $('.js--ticker-high').html(priceFormatter(high));
            $('.js--ticker-low').html(priceFormatter(low));

            // Once it's done, call wallets API
            getWalletsInfo();
        }
    });
}

/**
 * Call Ethplorer API
 */
function getWalletsInfo() {
    var wallets = JSON.parse(config.wallets),
        walletsSize = Object.keys(wallets).length,
        walletsListContainer = $('.js--wallets-container'),
        id = 1;

    // Reset list
    walletsListContainer.html('');

    // Append templates
    var tpl;
    for (var i = 1; i <= walletsSize; i++) {
        id = i;

        tpl = $('.js--wallet-tpl').html().replace(new RegExp("{{id}}", 'g'), id).replace('{{col}}', '6');
        walletsListContainer.append(tpl);
    }

    // Call APIs
    if(wallets[1]) {
        apiCallEthplorer(wallets, 1);
    }

    // if 0 wallet
    if(walletsSize === 0) {
        $('.no-wallet-info').removeClass('d-none');
    }
}

// Call Ethplorer API recursively
function apiCallEthplorer(wallets, walletId) {
    var walletValue, walletCurrency;

    // API call
    $.get('https://api.ethplorer.io/getAddressInfo/' + wallets[walletId].address + '?apiKey=freekey', function (data) {
        var json = JSON.parse(data);

        console.log(wallets[walletId]);
        $('.js--wallet-' + walletId + '-name').html(wallets[walletId].name);

        if (json['error'] !== undefined) {
            walletValue = 'ERROR';
            walletCurrency = 'ERROR';
        } else {
            walletValue = json['ETH']['balance'];
            walletCurrency = walletValue * rate;
        }
        $('.js--wallet-' + walletId + '-value').html(walletValue);
        $('.js--wallet-' + walletId + '-currency').html(priceFormatter(walletCurrency + ""));

        if(wallets[walletId + 1]) {
            apiCallEthplorer(wallets, walletId + 1);
        }
    });
}

$(function () {
    // onBegin
    updateConfig();
    getExchangeRates();

    // Open settings
    $('.js--open-settings').on('click', function() {
        if (chrome.runtime.openOptionsPage) {
            // New way to open options pages, if supported (Chrome 42+).
            chrome.runtime.openOptionsPage();
        } else {
            // Reasonable fallback.
            window.open(chrome.runtime.getURL('options/options.html'));
        }
    });

    // Open manifest.json
    $('.js--open-manifest').on('click', function() {
        window.open(chrome.runtime.getURL('manifest.json'));
    });
});