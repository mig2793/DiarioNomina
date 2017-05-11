diarios.controller('tabsController', ['$scope','$state','$ionicPopup','globals',
 function($scope,$state,$ionicPopup,globals) {

 	$scope.capture = true;
 	var user = global.localStorageGet("User");
 	console.log(user);
 	if(user.usuarios[0].Nivel == "2")
 		$scope.capture = false;
 	else
 		$scope.capture = true;
 	
 	$scope.logoff = function(){
 		localStorage.clear();
 		$state.go("login");
 	}
 }]);