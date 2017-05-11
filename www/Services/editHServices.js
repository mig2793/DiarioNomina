diarios.factory('editHoursServices',['$http','globals', function($http,globals){
    var editHorus = {};

    editHorus.edit = function(data,URL){
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
    
    return editHorus;
}]);