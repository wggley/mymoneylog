/*
 * @author wallace
 */
var users = {
    callback: undefined,
    init: function() {
        $(document).on(
            'click',
            '#logout',
            users.logOut
        );

        mlog.base.showLoading();
        client.usersGetCurrentAccount()
            .then(function(UsersFullAccount) {
                mlog.base.hideLoading();
                $('#userName span').html(UsersFullAccount.result.name.display_name);
                mlog.entries.read(init.init);
            })
            .catch(mlog.base.catchError);
        
    },    
    // If the user was just redirected from authenticating, the urls hash will
    // contain the access token.
    logOut: function() {
        mlog.base.showLoading();
        $('#userName span').html("");
        client.authTokenRevoke().then(function() {
            mlog.base.hideLoading();
            window.location.href = 'https://www.dropbox.com/logout';
        }).catch(mlog.base.catchError);
    },
};
