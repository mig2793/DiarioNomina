diarios.controller('todayController', ['$scope','$state','todayServices','globals','$ionicPopup','setGet',
 function($scope,$state,todayServices,globals,$ionicPopup,setGet) {


 	var data = {}
 	var url;
 	var text = "";
 	$scope.searchVisible = true;
 	$scope.searchDateVisible = true;
	$scope.today = global.DateCurrent(); 

	$scope.getuser = globals.localStorageGet("User") != undefined ? globals.localStorageGet("User") : console.log("No hay información");
	var cargo = $scope.getuser.usuarios[0].Trabajo;
	
	$("#title").text("Control de horas");

 	function init(){
 		accordion();
 		validateUser();
 	}

	function validateUser(){
	 	if($scope.getuser.usuarios[0].Nivel == "2"){
	 		$scope.searchVisible = true;
	 		$scope.searchDateVisible = false;
	 		$scope.Gethourssuper();
	 	}else{
	 		$scope.searchVisible = false;
	 		$scope.searchDateVisible = true;
	 		$scope.GethoursUser();		
	 	}		
	}

 	$scope.GethoursUser = function(){
 		url = "Gethorastoday";
 		data = {
 			documento : $scope.getuser.usuarios[0].Documento
 		}
 		todayServices.validate(data,url).then(function(promise){
 			var result = promise.data.d;
 			$scope.list =  global.ListDates(result);
 		});
 	}

  	$scope.GetHorasUsuarioapp = function(date){
  		var finicial = $("#finicial").val();
  		var ffinal = $("#ffinal").val();

  		if(finicial == "" || ffinal == ""){
  			text = "Por favor completa toda la información"; 
  			$scope.messagepopup(text)
  		}else if(ffinal<finicial){
  			text = "La fecha final no puede ser mayor a la incial";
  			$scope.messagepopup(text);
  		}
  		else{
	 		url = "GetHorasUsuarioapp";
	 		data = {
	 			documento 	: $scope.getuser.usuarios[0].Documento,
	 			fechainical : finicial,
	 			fechafinal 	: ffinal
	 		}
	 		todayServices.validate(data,url).then(function(promise){
	 			var result = promise.data.d;
	 			if(result.length>0)
	 				$scope.list =  global.ListDates(result);
	 			else{
 					text = "No hay registros en ese rango de fechas";
 					$scope.messagepopup(text);	 				
	 			}
	 			
	 		});  			
  		}
 	}

 	$scope.Gethourssuper = function(){	
 		url = "GethorasSupervisor";
 		data = {
 			estado 		: 1, 
 			position 	: $scope.getuser.usuarios[0].MiCargoPosicion
 		}
 		todayServices.validate(data,url).then(function(promise){
 			var result = promise.data.d;
 			if(result.length>0){
 				$scope.list =  global.ListDates(result);
 			}else{
 				text = "No hay información en la base de datos";
 				$scope.messagepopup(text);
 			}
 		});
 	}

 	$scope.Employment = function(data){
 		if($scope.getuser.usuarios[0].Nivel == "2"){
 			setGet.set(data);
 			$state.go("tab.edithours");
 		}
 	}

 	$scope.approve = function($event,data){
 		var data;
 		var ids = []; 
 		var element = $event.currentTarget.parentElement;
 		for(var i = 0;i<data.actividades.length;i++){
 			ids.push(data.actividades[i].id);
 		}

 		data = {
 			id : ids,
 			estado : 2 
 		}
 		url="Approvehours";

 		todayServices.validate(data,url).then(function(promise){
 			var result = promise.data;
 			if(result.d > 0){
 				text = "Guardado satisfactoriamente";
 				$scope.messagepopup(text);
 				element.remove();
 			}else{
  				text = "Error al guardar la información";
 				$scope.messagepopup(text);				
 			}
 		});
 	}


 	function accordion(){
		var acc = document.getElementsByClassName("accordion");
		var i;
		for (i = 0; i < acc.length; i++) {
		  acc[i].onclick = function() {
		    this.classList.toggle("active");
		    var panel = this.nextElementSibling;
		    if (panel.style.maxHeight){
		      panel.style.maxHeight = null;
		    } else {
		      panel.style.maxHeight = panel.scrollHeight + "px";
		    } 
		  }
		} 		
 	}
 	//popups

   $scope.messagepopup = function(text) {
     var alertPopup = $ionicPopup.alert({
       title: 'Error',
       template: text
     });
   };

	init();

 }]);