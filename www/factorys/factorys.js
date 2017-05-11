diarios.factory('globals',['$ionicPopup',
	function($ionicPopup){

	global = {};

	global.localStorageGet = function(dataStorage){
		var data = localStorage.getItem(dataStorage);
		data = JSON.parse(data);
		return data;
	}

	global.ListDates = function(data){
		var lengthList = data.length;
		var JsoReturn = {};
		JsoReturn["Register"]=[];
		JsoReturn["incomplete"]=[];
		JsoReturn["NoRegister"]=[];
		for(var i=0;i<lengthList;i++){
			data[i]["fechaTexto"] = global.convertDateText(data[i]._fecha);
			if(data[i]._horaSalida.length>0 && data[i]._horaEntrada.length>0)
				JsoReturn.Register.push(data[i]);
			else if(data[i]._horaSalida.length<=0 && data[i]._horaEntrada.length>0)
				JsoReturn.incomplete.push(data[i]);
			else if(data[i]._horaSalida.length<=0 && data[i]._horaEntrada.length<=0)
				JsoReturn.NoRegister.push(data[i]);
		}

		JsoReturn.Register = global.structureJsonList(JsoReturn.Register);
		JsoReturn.NoRegister = global.structureJsonList(JsoReturn.NoRegister);
		JsoReturn.incomplete =global.structureJsonList(JsoReturn.incomplete);

		console.log(JsoReturn);
		return JsoReturn;
	}	

	global.structureJsonList = function(json){
		var jsonstructureL = [];
		var json = json;
		for(var i=0;i<json.length;i++){
			if(i>0){
				if(json[i]._nombreEmpleado == json[i-1]._nombreEmpleado && 
					json[i]._fecha.split(" ")[0] == json[i-1]._fecha.split(" ")[0]){
					var data = {
						"NumActividad" : json[i]._numeroActividad,
						"actividad" : json[i]._actividad,
						"fecha" : json[i]._fecha,
						"HoraEntrada" : json[i]._horaEntrada,
						"HoraSalida" : json[i]._horaSalida,
						"id" : json[i]._id
					}
					//jsonstructureL.push(data);
					json.splice(i,1);
					json[i-1].actividades.push(data);
					jsonstructureL = [];
					i--;
				}else{
					var data = {
						"NumActividad" : json[i]._numeroActividad,
						"actividad" : json[i]._actividad,
						"fecha" : json[i]._fecha,
						"HoraEntrada" : json[i]._horaEntrada,
						"HoraSalida" : json[i]._horaSalida,
						"id" : json[i]._id
					}
					jsonstructureL.push(data);
					json[i]["actividades"] = jsonstructureL;
					jsonstructureL = [];	
				}
			}else{
					var data = {
						"NumActividad" : json[i]._numeroActividad,
						"actividad" : json[i]._actividad,
						"fecha" : json[i]._fecha,
						"HoraEntrada" : json[i]._horaEntrada,
						"HoraSalida" : json[i]._horaSalida,
						"id" : json[i]._id
					}
					jsonstructureL.push(data);
					json[i]["actividades"] = jsonstructureL;
					jsonstructureL = [];				
			}	
		}
		return json;
	}

	global.convertQR = function(QR){
		var QRConvert = QR.split(",");
		var sendQR = new Array();
		for(i=0; i<QRConvert.length;i++){
			sendQR.push(QRConvert[i])
		}
		return sendQR
	}

	global.convertDateText = function(getdate){
		var date = new Date();
		var day = date.getDate();
		var month = date.getMonth()+1;
		var year = date.getFullYear();
		var textdate = "";
		var datesplit = getdate.split(" ")[0];
		datesplit = datesplit.split("/");
		var dateCurrent = `${day}/${month}/${year}`;
		var dateCurentS = dateCurrent.split("/");
		var Nameday = new Array("Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sábado");
		var Namemonth = new Array("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");

		var difDays = Number(dateCurrent[0]) - Number(dateCurentS[0])
		var datet = new Date(datesplit[2],datesplit[1]-1,datesplit[0]);
		var dayNumber = datet.getDay();

		if(getdate.split(" ")[0] == dateCurrent)
			textdate = "hoy";
		else if(datesplit[2] == dateCurentS[2] && datesplit[1] == dateCurentS[1] && difDays == 1 )
			textdate = "ayer"
		else{
			textdate = `${Nameday[dayNumber]} ${datesplit[0]} de ${Namemonth[Number(datesplit[1]-1)]}`; 
		}
		return textdate;
	}

	global.validateDate = function(dateValidate){
		var validate;
		var date = global.timeCurrent();
		date = date.split(" ")[0];
		var dateLogin = dateValidate;
		dateLogin = dateLogin.split(" ")[0];
		if(date === dateLogin)
			validate = true;
		else
			validate = false;	

		return validate
	}

	global.timeCurrent = function(){
		var time;
		var h,m,s;
		var d,y,mo;
		var date = new Date();
		d = date.getDate();
		mo = date.getMonth()+1;
		y = date.getFullYear();
		h = date.getHours();
		m = date.getMinutes();
		s = date.getSeconds();

		mo = (mo.toString().length > 1) ? mo : "0" + mo;
		d = (d.toString().length > 1) ? d : "0" + d ;

		time = y + "-" + mo + "-" + d + " " + h + ":" + m + ":" + s

		return time;
	}

	global.DateCurrent = function(){
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();

		if(dd<10) {
		    dd='0'+dd
		} 

		if(mm<10) {
		    mm='0'+mm
		} 

		today =  yyyy+'-'+ mm +'-'+ dd;
		return today;
	}

	global.validateStorageObject = function(data){
		if(data){
    		return data[0];
    	}else{
    		console.log("No hay nada!");
    	}
	}
	global.validateStorageObjectRepeat = function(data){
		if(data){
    		return data;
    	}else{
    		console.log("No hay nada!");
    	}
	}

	global.messagepopup = function(text) {
     var alertPopup = $ionicPopup.alert({
       title: 'Error',
       template: text
     });
   };

	return global;
}]);