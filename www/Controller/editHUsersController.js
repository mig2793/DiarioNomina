diarios.controller('editUserHController', ['$scope','$state','$ionicPopup','setGet','editHoursServices','globals',
 function($scope,$state,$ionicPopup,setGet,editHoursServices,globals) {

 	$scope.getdata = setGet.get();
 	var url;
 	
 	$scope.getuser = globals.localStorageGet("User") != undefined ? globals.localStorageGet("User") : $state.go("login");

 	$scope.send = function(){
 		var observation = $("#comment").val();
 		var data;
 		var ids = []; 
 		for(var i = 0;i<$scope.getdata.actividades.length;i++){
 			ids.push($scope.getdata.actividades[i].id);
 		}

 		data = {
 			id : ids,
 			comentario: observation,
 			tipo : 1
 		}
 		url="saveObservation";

 		editHoursServices.edit(data,url).then(function(promise){
 			var result = promise.data;
 			if(result.d > 0){
 				text = "Guardado satisfactoriamente";
 				$scope.messagepopup(text);
 			}else{
  				text = "Error al guardar la información";
 				$scope.messagepopup(text);				
 			}
 		});
 	}

 	$scope.approve = function(){
 		var data;
 		var ids = []; 
 		for(var i = 0;i<$scope.getdata.actividades.length;i++){
 			ids.push($scope.getdata.actividades[i].id);
 		}

 		data = {
 			id : ids,
 			estado : 2 
 		}
 		url="Approvehours";

 		editHoursServices.edit(data,url).then(function(promise){
 			var result = promise.data;
 			if(result.d > 0){
 				text = "Guardado satisfactoriamente";
 				$scope.messagepopup(text);
 				$state.go("tab.todayhours");

 			}else{
  				text = "Error al guardar la información";
 				$scope.messagepopup(text);				
 			}
 		});
 	}

   $scope.messagepopup = function(text) {
     var alertPopup = $ionicPopup.alert({
       title: 'Error',
       template: text
     });
   };

 }]);