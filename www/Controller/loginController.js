diarios.controller('loginController', ['$scope','$state','$ionicPopup',
 function($scope,$state,$ionicPopup) {
 	
 	$scope.login = function(){
 		$state.go('tab.capture');
 	}

	$scope.showPopup = function() {
	  $scope.data = {};

	  // An elaborate, custom popup
	  var myPopup = $ionicPopup.show({
	    template: '<input type="password" ng-model="data.wifi">',
	    title: 'Enter Wi-Fi Password',
	    subTitle: 'Please use normal things',
	    scope: $scope,
	    buttons: [
	      { text: 'Cancel' },
	      {
	        text: '<b>Save</b>',
	        type: 'button-positive',
	        onTap: function(e) {
	          if (!$scope.data.wifi) {
	            //don't allow the user to close unless he enters wifi password
	            e.preventDefault();
	          } else {
	            return $scope.data.wifi;
	          }
	        }
	      }
	    ]
	  });
	}

	$scope.QRcode = function(){
   		cordova.plugins.barcodeScanner.scan(
     		function (barcodeData) {
	   		var QrValidate = global.convertQR(barcodeData.text);
	   		var data = {};
	    	data["action"] = 4;
	   		data["user"] = QrValidate[0].substring(0,3) + QrValidate[1];
	   		data["password"] = QrValidate[1]; 
	    	console.log(data);
	    	$scope.validateLoginQR(data);
	      }, function(error) {
           		Modal.showModal({
					templateUrl : 'app/components/popUps/NofindQR/noFindQR.html',
					controller : 'noFindQRController'
				})	
	      },
	      {
	          preferFrontCamera : false, // iOS and Android
	          showFlipCameraButton : false, // iOS and Android
	          showTorchButton : true, // iOS and Android
	          torchOn: false, // Android, launch with the torch switched on (if available)
	          prompt : "Captura el código QR que te identifica.", // Android
	          resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
	          formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
	          orientation : "portrait" // Android only (portrait|landscape), default unset so it rotates with the device
	      });
	}

	$scope.validateLogin = function(data){
		loginService.login(data).then(function(promise){
            var result = promise.data;
            if(result.d.length > 0){
				validateLoginStorage(result);
            }else{
           		Modal.showModal({
					templateUrl : 'app/components/popUps/NofindQR/noFindQR.html',
					controller : 'noFindQRController'
				})	
            }
        });
	}
 
 }]);

