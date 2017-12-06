var Options;
Options = {

    /**
     * Init the general form
     */
    initFormGeneral: function () {
        // General
        var currency = localStorage['currency'] || Config.default.currency;
        $('#currency').find('option[value="' + currency + '"]').prop('selected', true);

        // Forms event
        $('.js--general-form').on('submit', function (e) {
            localStorage.setItem('currency', $("#currency").find("option:selected").val());
            return false;
        });
    },

    /**
     * Init the wallets form
     */
    initFormWallets: function () {
        // Wallets
        var wallets = localStorage['wallets'] || '{}',
            tplHtml = $('.js--wallet-tpl').html(),
            walletFormContainer = $('.js--wallets-form-container');
        wallets = JSON.parse(wallets);

        var tpl;
        for (var i = 1; i <= options['available-wallets']; i++) {
            tpl = tplHtml.replace(new RegExp("{{id}}", 'g'), i);
            walletFormContainer.append(tpl);

            if (wallets[i]) {
                $('#wallet-' + i + '-name').val(wallets[i].name);
                $('#wallet-' + i + '-address').val(wallets[i].address);
            }
        }

        // Form event
        $('.js--wallets-form').on('submit', function (e) {
            var wallets = {},
                name, address;

            for (var i = 1; i <= options['available-wallets']; i++) {
                name = $('#wallet-' + i + '-name').val();
                address = $('#wallet-' + i + '-address').val();

                if (address !== '') {
                    wallets[i] = {
                        name: name,
                        address: address
                    };
                }
            }
            localStorage.setItem('wallets', JSON.stringify(wallets));
            return false;
        });
    },

    /**
     * Init
     */
    init: function () {
        this.initFormGeneral();
        this.initFormWallets();
    }

};

Options.init();