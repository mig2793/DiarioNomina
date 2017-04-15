diarios.controller('captureController', ['$scope','$state',
 function($scope,$state) {
	var video = document.getElementById('video');
	var canvas = document.getElementsByTagName('canvas')[0];
  context = canvas.getContext('2d');
	var video = document.getElementById('video');
	var heigthVideo = 0;
	var widthVideo = 0;

	// Get access to the camera!
	if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
	    // Not adding `{ audio: true }` since we only want video now
	    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
	        video.src = window.URL.createObjectURL(stream);
	        video.play();
	    });
	}

	document.getElementById("take-photo").addEventListener("click", function() {
    heigthVideo = document.getElementsByTagName("video")[0].offsetHeight;
    widthVideo = document.getElementsByTagName("video")[0].offsetWidth;
    canvas.width = widthVideo;
    canvas.height = heigthVideo;
		context.drawImage(video, 0, 0, widthVideo,heigthVideo);
    var image = new Image();
  	image.id = "image"
  	image.src = canvas.toDataURL();
	});

  var drawRequest;
        
        function animateClean() {
          ctrack.start(document.getElementById('image'));
          drawLoop();
        }

        function animate(box) {
          ctrack.start(document.getElementById('image'), box);
          drawLoop();
        }
        
        function drawLoop() {
          drawRequest = requestAnimFrame(drawLoop);
          overlayCC.clearRect(0, 0, 720, 576);
          var positions = ctrack.getCurrentPosition();
          if (ctrack.getCurrentPosition()) {
            ctrack.draw(overlay);
          }
                if (positions) {
                  for (var p = 0;p < 10;p++) {
                    console.log("["+positions[p][0].toFixed(2)+","+positions[p][1].toFixed(2)+"]");
                  }
                }
        }
        
// detect if tracker fails to find a face
        document.addEventListener("clmtrackrNotFound", function(event) {
          ctrack.stop();
          alert("The tracking had problems with finding a face in this image. Try selecting the face in the image manually.")
        }, false);
        
        // detect if tracker loses tracking of face
        document.addEventListener("clmtrackrLost", function(event) {
          ctrack.stop();
          alert("The tracking had problems converging on a face in this image. Try selecting the face in the image manually.")
        }, false);
        

}]);