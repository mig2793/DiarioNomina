diarios.directive('scrollVertical', function(){
	function scroll(scope, element, attrs){
		repeatNtimes(20, 100, function(){
			var width_display = $(window).width();
			var height_display = $(window).height();
			element[0].style.height  = height_display-120 + "px";
		});
	}
	return{
		restrict: 'A',
		link: scroll
	};
});

diarios.directive('popUp', function(){
	function pop_up(scope, element, attrs){
		repeatNtimes(12, 100, function(){
			$(element).css("height", height_display-150 + "px" );
			$(element).find(".pop-up").css("height", $(element).height() + "px");
		});
	}
	return{
		restrict: 'C',
		link: pop_up
	};
});

function repeatNtimes(n, duration, callback){
	var count = 0;
	var interval = setInterval(function(){
		if(count === n){
			clearInterval(interval);
			return;
		}
		count++;
		callback();
	}, duration);
}
