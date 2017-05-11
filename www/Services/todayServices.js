diarios.factory('todayServices',['$http','globals', function($http,globals){
    var today = {};

    today.validate = function(dataaction,URL){
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
    
    return today;
}]);