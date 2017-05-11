diarios.factory('LoginService',['$http','globals', function($http,globals){
    var login = {};

    login.validate = function(dataaction,URL){
        showLoad();
        var promise = $http.post(window.urlService + URL,dataaction)
            .success(function(data){
                hideLoad();
                console.log(data);
                return data;
            })
            .error(function(err){
                hideLoad();
                globals.messagepopup(err.Message);
            });
        return promise;
    };
    
    return login;
}]);