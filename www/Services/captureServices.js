diarios.factory('CaptureService',['$http','globals', function($http,globals){
    var capture = {};

    capture.validate = function(data,URL){
        showLoad();
        var promise = $http.post(window.urlService + URL,data)
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
    
    return capture;
}]);