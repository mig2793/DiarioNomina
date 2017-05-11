diarios.controller('loginController', ['$scope','$state','$ionicPopup','$cordovaBarcodeScanner','LoginService','globals',
 function($scope,$state,$ionicPopup,$cordovaBarcodeScanner,LoginService,globals) {	

 	var url;
 	var text = "";

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
	   		var QrValidate = barcodeData.text;
	   		var documento = QrValidate.split(",")[1];
	   		data = {
	   			"documento" : documento
	   		}
	   		url = "getuserDynamics";
	    	$scope.validateLogin(data,url);
	      }, function(error) {
	      	$scope.errorQR(); 
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

	$scope.validateTemp = function(){
		data = {
   			"documento" : "71254499"
   		}
   		url = "getuserDynamics";
		$scope.validateLogin(data,url);
	}

	$scope.validateLogin = function(data,url){
		LoginService.validate(data,url).then(function(promise){
            var result = promise.data;
            var dataValidate = JSON.parse(result.d);
            if(Number(dataValidate.state) > 0 && dataValidate.usuarios.length>0){
            	localStorage.setItem("User",result.d);
            	var data = JSON.parse(result.d);
            	if(data.usuarios[0].Nivel == "1"){
            		insertUser(data);
            	}else if(data.usuarios[0].Nivel == "2"){
            		$state.go("tab.todayhours");
            	}else{
            		text = 'No tienes permisos para ingresar a la aplicación';
            		$scope.error(text);
            	}            	
            }else if(Number(dataValidate.state) > 0 && dataValidate.usuarios.length<=0){
				text = 'El usuario no existe en la base de datos';
            	$scope.error(text);
            }else if(Number(dataValidate.state) == 0){
            	text = dataValidate.message;
            	$scope.error(text);
            }
        });
	}

	function insertUser(data){
		var dataSend = data;
		url = "validateInsert";
		validateDate = {
			documento : data.usuarios[0].Documento 
		}
		LoginService.validate(validateDate,url).then(function(promise){
			var result = promise.data;
			if(result.d.length>0){
				$state.go("tab.capture");
			}else{
				var InsertData = {
					documento: dataSend.usuarios[0].Documento,
					contrato : dataSend.usuarios[0].contrato, 
					trabajador : dataSend.usuarios[0].Nombre, 
					id_proyecto : dataSend.usuarios[0].idProyecto, 
					proyectoP : dataSend.usuarios[0].NombreProyecto, 
					proyectoArbol : dataSend.usuarios[0].NombreProyecto,
					position : Number(dataSend.usuarios[0].MiCargoPosicion),
					positionsuper: Number(dataSend.usuarios[0].MIsuperrPosicion),
					inserthora : 0
				}
				url = "InsertHours";
				LoginService.validate(InsertData,url).then(function(promise){
					var result = promise.data;
					if(result.d > 0){
						console.log("insert del usaurio realizado");
						$state.go("tab.capture");
					}else{
						text = "Error al ingresar la información del usuario";
						$scope.errorQR(text);
					}	
				});				
			}
		});
	}
	//pop-ups
  	$scope.errorQR = function() {
     	var alertPopup = $ionicPopup.alert({
       	title: '!Error¡',
       	template: 'Código QR incorrecto. Intentelo nuevamente por favor'
     	});
   	};

   	$scope.error = function(text) {
     	var alertPopup = $ionicPopup.alert({
       	title: '!Error¡',
       	template: text
     	});
   	};

 }]);

