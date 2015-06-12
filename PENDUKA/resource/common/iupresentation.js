function initPresentationMode(){
	document.addEventListener('keydown', function(event){
		if (event.keyCode == 34 || event.keyCode == 39) {
			window.location.replace(nextPageURL);
		}	
		else if (event.keyCode == 33 || event.keyCode == 37) {
			window.location.replace(prevPageURL);
		}});
		$(document).click(function(e) {
			var center = $(window).width()/4;
			if(e.pageX <center){
				window.location.replace(prevPageURL);
			}
			else{
				window.location.replace(nextPageURL);
			}
		});
}
