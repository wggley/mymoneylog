/**
 * init.js - initialize and start myMoneyLog
 * @author Ricardo Nishimura - 2008
 */
var client, dbxAuth;
var CLIENT_ID = '3pboozvdveqjvwq';
var TOKEN_ID = 'mymoneylog-dropbox-auth';
var REDIRECT_URI = window.location.origin + window.location.pathname;

var init = {
    getAccessTokenFromUrl: function () {
        return utils.parseQueryString(window.location.hash).access_token;
    },
    isAuthenticated: function () {
        return !!init.getAccessTokenFromUrl();
    },
    getCodeFromUrl: function() {
        return utils.parseQueryString(window.location.search).code;
    },
     hasRedirectedFromAuth: function() {
        return !!init.getCodeFromUrl();
    },
    loadData: function () {
        dbxAuth = new Dropbox.DropboxAuth({
            clientId: CLIENT_ID
        });
        mlog.translator.translateDocument();
        notification.events.init();        
        // client = new Dropbox({
        //     clientId: CLIENT_ID,
        //     accessToken: users.getAccessToken(),
        // });

        if (init.hasRedirectedFromAuth()) {
            dbxAuth.setCodeVerifier(window.sessionStorage.getItem('codeVerifier'));
            dbxAuth.getAccessTokenFromCode(REDIRECT_URI, init.getCodeFromUrl())
            .then((response) => {
                dbxAuth.setAccessToken(response.result.access_token);
                dbxAuth.setRefreshToken(response.result.refresh_token);
                client = new Dropbox.Dropbox({
                    auth: dbxAuth
                });
                users.init();
            }).catch((error) => {
                window.location.href = REDIRECT_URI;
            })
            
        } else {
            dbxAuth.getAuthenticationUrl(REDIRECT_URI, undefined, 'code', 'offline', undefined, undefined, true)
                .then(authUrl => {
                    window.sessionStorage.clear();
                    window.sessionStorage.setItem("codeVerifier", dbxAuth.codeVerifier);
                    window.location.href = authUrl;
                })
        }
    },
    init: function() {
        /* initialize and show entries */
        mlog.entriesControl.show();
        $('#report').show();
        $('#sidebar').show();
        /* initialize menus */
        $('#menu_entries').click(mlog.entriesControl.show);
        $('#menu_categories_overview').click(mlog.categoriesControl.show);
        $('#menu_accounts_overview').click(mlog.accountsControl.show);
        $('#menu_editor').click(mlog.editorControl.show);
        $('#menu_help').click(mlog.helpControl.show);
        $('#logo').click(mlog.entriesControl.show);
        $('#slogan').click(function() {
            open('http://code.google.com/p/mymoneylog/');
        });
        /* initialize datepickers */

        $('.input_date').each(function() {
            $(this).jscalendar();
        });
        /* disable: browser autocomplete and submit action */
        $('#sidebar form').submit(function() {
            return false;
        }).attr('autocomplete', 'off');
        /* key press */
        $('.jump_on_enter_key').each(function() {
            $(this).jumpOnEnterKey();
        });

        $('#input_date').focus();
    }
};

$(document).ready(init.loadData);
