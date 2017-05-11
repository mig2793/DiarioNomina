diarios.controller('captureController', ['$scope','$state','$cordovaBarcodeScanner','$ionicPopup','CaptureService','globals',
 function($scope,$state,$cordovaBarcodeScanner,$ionicPopup,CaptureService,globals) {


    var video = document.getElementById('video');
    var canvas = document.getElementsByTagName('canvas')[0];
    context = canvas.getContext('2d');
    var video = document.getElementById('video');
    var drawRequest;
    var heigthVideo = 0;
    var widthVideo = 0;
    //14 Face,18eyebrown rigth,22 eyebrownleft,27 eye left,32 eye rigth,43 nose,61 mouth,62 point center nose,66 points eye left,70 points eye rigth
    var arrayPoints = new Array(14,18,22,27,32,43,61,62,66,70);
    var arrayNamePoints = new Array("face","eyebrownrigth","eyebrownleft","eyeleft","eyerigth","nose","mouth","nose","eyeleft","eyerigth");
    var jsonPoint = {};
    var positions;
    var url = "";
    var text = "";
    var xmlString;
    var iteration = 0;
    var proyectoArbol = "";
    var countProyecto = 0;
    var countactividad = 0;
    var numActividad =  "";

    var overlay = document.getElementById('overlay');
    var overlayCC = overlay.getContext('2d');

    var ctrack = new clm.tracker({stopOnConvergence : true});
    var datahourend = {};
    var treeProjectsA = {
      tree:[]
    };

    $scope.projectsActivities;
    $scope.activitieVisible = false;

    ctrack.init(pModel);

    $("#title").text("Coloca tu rostro frente a la camara");

    $scope.getuser = globals.localStorageGet("User") != undefined ? globals.localStorageGet("User") : $state.go("login");

    function initCamera(){
      // Get access to the camera!
      if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          // Not adding `{ audio: true }` since we only want video now
        navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
          video.src = window.URL.createObjectURL(stream);
          video.play();
        });
      }    
    }


    $scope.CapturQR = function(){
        cordova.plugins.barcodeScanner.scan(
            function (barcodeData) {
              url = "Validatetoken";
              data = {token:barcodeData.text}
              validateToken(data,url);
          }, function(error) {
            text = "Código QR incorrecto. Intentelo nuevamente por favor";
            $scope.error(text);
          },
          {
              preferFrontCamera : false, // iOS and Android
              showFlipCameraButton : false, // iOS and Android
              showTorchButton : true, // iOS and Android
              torchOn: false, // Android, launch with the torch switched on (if available)
              prompt : "Captura el código QR para inicio o fin del turno.", // Android
              resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
              formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
              orientation : "portrait" // Android only (portrait|landscape), default unset so it rotates with the device
          });
    }

    $scope.validateTemp = function(){
      data = {token:"uCXvyJNfwLQQAPL7Q4LIDm_MrQk5TgGHDYdMCiqTdTEbn7MT3L"}
      validateToken(data,"Validatetoken");
    }

    function validateToken(token,url){
      CaptureService.validate(token,url).then(function(promise){
            var result = promise.data;
            if(Number(result.d[0]._token.trim()) > 0){
             initCamera();
            }else{
              text = "Código QR incorrecto. Intentelo nuevamente por favor";
              $scope.error(text);
            }        
      })
    }
    function InsertPointsServices(data,url,pointfaces){
      CaptureService.validate(data,url).then(function(promise){
            var result = promise.data.d;
            result = result.replace(/(?:\r\n|\r|\n)/g, '');
            var dataValidate = JSON.parse(result);
            $scope.error(dataValidate.message);  
            if(dataValidate.state > 0){
              var dataStorage = global.localStorageGet("User");
              dataStorage.usuarios[0]["puntosFaciales"] = pointfaces;
              var datalocalS = JSON.stringify(dataStorage);
              localStorage.setItem("User",datalocalS);
            }
      })
    }

	   document.getElementById("take-photo").addEventListener("click", function() {
        iteration = 0;
        showLoad();
        console.log("click");
        heigthVideo = document.getElementsByTagName("video")[0].offsetHeight;
        widthVideo = document.getElementsByTagName("video")[0].offsetWidth;
        canvas.width = widthVideo;
        canvas.height = heigthVideo;
        overlay.height = heigthVideo;
        overlay.width = widthVideo;
    	  context.drawImage(video, 0, 0, widthVideo,heigthVideo);
        var image = new Image();
      	image.id = "image"
      	image.src = canvas.toDataURL();
        animateClean();
        $("#canvas,#overlay").show();
	  });

        
  function animateClean() {
    ctrack.start(document.getElementById('canvas'));
    drawLoop();
  }

  function animate(box) {
    ctrack.start(document.getElementById('canvas'), box);
    drawLoop();
  }
  
  function drawLoop() {
    drawRequest = requestAnimFrame(drawLoop);
    overlayCC.clearRect(0, 0, 720, 576);
    positions = ctrack.getCurrentPosition();
    if (ctrack.getCurrentPosition()) {
      ctrack.draw(overlay);
    }
  }

  function jsonPoints(numberinit,numberIteration,numbernamePo,positions){
    numberinit++;
    var pushfacial=[];
    for(var j=numberinit;j<=numberIteration;j++){
      pushfacial.push(positions[j][0].toFixed(2)+","+positions[j][1].toFixed(2));
      /*pushfacial.push(positions[j][0].toFixed(2));
      pushfacial.push(positions[j][1].toFixed(2));*/
    }
    if(jsonPoint.hasOwnProperty(numbernamePo))
      jsonPoint[numbernamePo].push(pushfacial);
    else
      jsonPoint[numbernamePo] = pushfacial
  }

  function validatepositions(){
    if (positions) {
      /*for (var p = 0; p < positions.length; p++) {
        console.log(p + ":" + "["+positions[p][0].toFixed(2)+","+positions[p][1].toFixed(2)+"]");
      }*/
      for(var i = 0; i <= arrayPoints.length; i++){
        var numberinit = arrayPoints[i] == arrayPoints[0] ? -1 : arrayPoints[i-1];
        jsonPoints(numberinit,arrayPoints[i],arrayNamePoints[i],positions);
      }
      validatePointFaces(jsonPoint);
      //validatePoints(jsonPoint);
    }
  }

  function validatePointFaces(pointfaces){
    var user = global.localStorageGet("User");
    // Valido si hay puntos faciales
    if(user.usuarios[0].puntosFaciales.hasOwnProperty("face")){
        //valido los puntos faciales
      var validate = validatePoints(pointfaces);
      if(validate){

        var data = {
          documento : $scope.getuser.usuarios[0].Documento
        }
        url = "validateTurn"; 
        //Valido si el útlimo registro de hora de la base de datos está completo
        CaptureService.validate(data,url).then(function(promise){
          var result = promise.data; 

          if(result.d.length<=0)
            insertData();         
          //Si el último registro está completo inserto un nuevo registro
          else if(result.d[0]._horaSalida.trim() != "" && result.d[0]._horaEntrada.trim() != "")
             insertData();
            //si no es el último registro, valido la información
          else{
            var data = {
              documento : $scope.getuser.usuarios[0].Documento
            }
            url = "Actividadfinish";        
            CaptureService.validate(data,url).then(function(promise){
                var result = promise.data;
                if(result.hasOwnProperty("projects")){
                   if(result.projects.length>0){
                    countactividad++;
                    $scope.projectsActivities = result;    
                    treeProjectsA.tree.push($scope.projectsActivities);    
                  }else{
                    if(countactividad>0){
                      $scope.activitieVisible = false;
                      datahourend["num_actividad"] = data.actividad;
                      for(var i=0;i<$scope.projectsActivities.projects.length;i++){
                        if(data.actividad == $scope.projectsActivities.projects[i].actividad){
                          datahourend["actividad"] = $scope.projectsActivities.projects[i].Nombre;
                          break;
                        }        
                      }          
                      countactividad = 0;
                      updateHoursEnd();
                    }else{
                      text = "No hay actividades en este Frente";
                      $scope.error(text); 
                    }
                  }           
                }else{
                    $scope.error(result.message);    
                }       
            })
          }     
        }) 
      }else{
        text = "¡Error al intentar identificarte. Intentalo nuevamente por favor!"
        $scope.error(text);
      }
    }else
      $scope.showConfirmImage(pointfaces);
  }

  function insertData(){
    var InsertData = {
      documento: $scope.getuser.usuarios[0].Documento,
      contrato : $scope.getuser.usuarios[0].contrato, 
      trabajador : $scope.getuser.usuarios[0].Nombre, 
      id_proyecto : $scope.getuser.usuarios[0].idProyecto, 
      proyectoP : $scope.getuser.usuarios[0].NombreProyecto,
      proyectoArbol : $scope.getuser.usuarios[0].NombreProyecto,
      position : Number($scope.getuser.usuarios[0].MiCargoPosicion),
      positionsuper: Number($scope.getuser.usuarios[0].MIsuperrPosicion),
      inserthora : 1
   }
    url = "InsertHours";
    CaptureService.validate(InsertData,url).then(function(promise){
        var result = promise.data;
        if(result.d > 0){
          text = "Has ingresado tu hora de inicio correctamente";
          $scope.error(text);
        }else{
            text = "Error al ingresar la información del usuario";
            $scope.errorQR(text);
        }   
    });   
  }

  function validatePoints(pointValidate){
    var pointsDB = $scope.getuser.usuarios[0].puntosFaciales;
    var pointsCurrent = pointValidate;
    var keysnameDB = Object.keys(pointsDB);
    var keysnameCurrent = Object.keys(pointsCurrent);
    var a,b,c;
    var angleA,angleB,angleC;
    console.log(pointsDB);
    console.log(pointsCurrent);
    /*for(var i = 1; i < keysnameDB.length-1,i ++){
        for(var j = 0; j <  pointsDB[keysnameDB[i].length; j++]){
            pointsDB[keysnameDB[0]][]
        }
        
    }*/
    /*for(var i = 0; i < pointsDB.face.length;i++){
      var pointscompared = pointsDB.face[i].split(",");
      var pointscomparedlad2 = pointsDB.face[i+1].split(",");
      var pointx1 = Number(pointscompared[0]);
      var pointy1 = Number(pointscompared[1]);
      var pointx2 = Number(pointscomparedlad2[0]);
      var pointy2 = Number(pointscomparedlad2[1]);

      for(var j = 0; j < pointsDB.mouth.length;j++){
        var pointsforCompare = pointsDB.mouth[j].split(",");
        var pointx3 = Number(pointsforCompare[0]);
        var pointy3 = Number(pointsforCompare[1]);
        a = Math.sqrt(Math.pow((pointx3-pointx1),2) + Math.pow((pointy3-pointy1),2));
        b = Math.sqrt(Math.pow((pointx3-pointx2),2) + Math.pow((pointy3-pointy2),2));
        c = Math.sqrt(Math.pow((pointx2-pointx1),2) + Math.pow((pointy2-pointy1),2));
        angleA = Math.cos((((Math.pow(b,2)) + (Math.pow(c,2)) - (Math.pow(a,2))/(2*b*c))))*(180/Math.PI);
        angleB = Math.cos((((Math.pow(a,2)) + (Math.pow(c,2)) - (Math.pow(b,2))/(2*a*c))))*(180/Math.PI);;
        angleC = 180-a-b;
        console.log(angleA);
        console.log(angleB);
        console.log(angleC);
      }

    } */
    return true;
  /*for(var i = 0; i < pointsCurrent.face.length;i++){
      var pointscompared = pointsCurrent.face[i].split(",");
      var pointscomparedlad2 = pointsCurrent.face[i+1].split(",");
      var pointx1 = Number(pointscompared[0]);
      var pointy1 = Number(pointscompared[1]);
      var pointx2 = Number(pointscomparedlad2[0]);
      var pointy2 = Number(pointscomparedlad2[1]);

      for(var j = 0; j < pointsCurrent.mouth.length;j++){
        var pointsforCompare = pointsCurrent.mouth[j].split(",");
        var pointx3 = Number(pointsforCompare[0]);
        var pointy3 = Number(pointsforCompare[1]);
        a = Math.sqrt(Math.pow((pointx3-pointx1),2) + Math.pow((pointy3-pointy1),2));
        b = Math.sqrt(Math.pow((pointx3-pointx2),2) + Math.pow((pointy3-pointy2),2));
        c = Math.sqrt(Math.pow((pointx2-pointx1),2) + Math.pow((pointy2-pointy1),2));
        angleA = Math.cos((((Math.pow(b,2)) + (Math.pow(c,2)) - (Math.pow(a,2))/(2*b*c))));
        angleB = Math.cos((((Math.pow(a,2)) + (Math.pow(c,2)) - (Math.pow(b,2))/(2*a*c))));
        //angleC = 180-a-b;
        console.log(angleA);
        console.log(angleB);
        //console.log(angleC);
      }

    } */
  }

  function insertHourinit(data){
      url = "updatehorasentrada";
      CaptureService.validate(data,url).then(function(promise){
        var result = promise.data; 
        if(result.d>0){
          text = "Has ingresado tu hora de inicio correctamente";
          $scope.error(text);
        }else{
          text = "Error al ingresar la información";
          $scope.error(text);                  
        }     
      }) 
  }

  function getProjects(data,codAct){
    url = "getTreePrjectsActivities";
    proyectoArbol = data.project;
    CaptureService.validate(data,url).then(function(promise){
      var result = promise.data; 
      result = JSON.parse(result.d); 
      if(result.projects.length>0){
        $scope.activitieVisible = true;
        $scope.projectsActivities = result;
        treeProjectsA.tree.push($scope.projectsActivities);
        countProyecto++;        
      }else{
        if(countProyecto>0){
          datahourend["proyectoArbol"] = proyectoArbol;
          countProyecto = 0;
        }
        var data = {
          actividad : codAct
        }
        getactiviti(data);
      }    
    })
  }

  $scope.DataInsertActiv = function(proyectoid,codAct){
    var data = {
      project : proyectoid
    }
    getProjects(data,codAct);
  }

  $scope.return = function(proyectoid,codAct){
    var length = treeProjectsA.tree.length-1;
    $scope.projectsActivities = treeProjectsA.tree[length-1];
    if(treeProjectsA.tree.length>1){
      treeProjectsA.tree.splice(length,1);
      if(countactividad>0)
        countactividad--;
    }
  }

  function getactiviti(data){
    url = "getactivities";
    CaptureService.validate(data,url).then(function(promise){
      var result = promise.data; 
      result = JSON.parse(result.d); 
      if(result.hasOwnProperty("projects")){
         if(result.projects.length>0){
          countactividad++;
          $scope.projectsActivities = result;    
          treeProjectsA.tree.push($scope.projectsActivities);    
        }else{
          if(countactividad>0){
            $scope.activitieVisible = false;
            datahourend["num_actividad"] = data.actividad;
            for(var i=0;i<$scope.projectsActivities.projects.length;i++){
              if(data.actividad == $scope.projectsActivities.projects[i].actividad){
                datahourend["actividad"] = $scope.projectsActivities.projects[i].Nombre;
                break;
              }        
            }          
            countactividad = 0;
            updateHoursEnd();
          }else{
            text = "No hay actividades en este Frente";
            $scope.error(text); 
          }
        }           
      }else{
          $scope.error(result.message);    
      }
    })
  }

  function updateHoursEnd(){
    var data = datahourend;
    url = "updatehoraSalida";
    CaptureService.validate(data,url).then(function(promise){
      var result = promise.data;
      if(result.d>0){
        text = "Has ingresado tu hora final y la actividad correctamente";
        $scope.error(text);
        datahourend = {};
      }else{
        text = "Error al ingresar la información";
        $scope.error(text);                  
      }
    })
  }
  
// detect if tracker fails to find a face
  document.addEventListener("clmtrackrNotFound", function(event) {
    iteration++;
    ctrack.stop();
    hideLoad();
    if(iteration>1)
        console.log("Te has pasado!!");
    else{
        text = "Ha ocurrido un problema al encontrar un rostro en la imagen. Intenta nuevamente";
        $scope.error(text);  
    }
    $("#canvas,#overlay").hide();
  }, false);
  
  // detect if tracker loses tracking of face
  document.addEventListener("clmtrackrLost", function(event) {
    iteration++;
    ctrack.stop();
    hideLoad();
    if(iteration>1)
        console.log("Te has pasado!!");
    else{
        text = "Ha ocurrido un problema en el recocimiento facial. Intenta nuevamente";
        $scope.error(text);
    }
    $("#canvas,#overlay").hide();
  }, false);

  // detect if tracker has converged
  document.addEventListener("clmtrackrConverged", function(event) {  
    iteration++;
    cancelRequestAnimFrame(drawRequest);
    if(iteration>1)
        console.log("Te has pasado!!");
    else
        validatepositions();
    hideLoad();
    $("#canvas,#overlay").hide();
  }, false);

  //$scope.CapturQR();

  //pop-ups
   $scope.showConfirmImage = function(pointfaces) {
     var confirmPopup = $ionicPopup.confirm({
       title: 'Alerta',
       template: '<span>¿Quieres dejar esta foto como principal?<span>'
     });
     confirmPopup.then(function(res) {
       if(res) {
          $("#canvas,#overlay").hide();
          var user = global.localStorageGet("User");
            //creating the xml string
            xmlString = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                          "<XMLScript Version=\"2.0\">" +
                            "<pointsFace>" +
                              "  <documento>" + user.usuarios[0].Documento.trim() + "</documento>" +
                              "  <pointsFaces>" + JSON.stringify(pointfaces).trim() + "</pointsFaces>" +
                            "</pointsFace>"+
                          "</XMLScript>";
            data = {data:xmlString}
            url="updatePointsFacial";
            InsertPointsServices(data,url,pointfaces);
       }else {
          $("#canvas,#overlay").hide();
          window.location.reload(true);
       }
     });
   };

    $scope.error = function(text) {
      var alertPopup = $ionicPopup.alert({
        title: '!Alerta¡',
        template: text
      });
    };

}]);