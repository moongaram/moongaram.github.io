//this file only used in output file from IUEditor

//for console defined

var alertFallback = false;
if (typeof console === "undefined"
	|| typeof console.log === "undefined"
	|| typeof console.timeStart === "undefined"
	|| typeof console.timeEnd === "undefined"
) {
	if (typeof console === "undefined"){
		console = {};	
	}
	if (typeof console.log === "undefined"){
		console.log = function() {};
	}
		
	if (alertFallback) {
		console.log = function(msg) {
			alert(msg);
		};
		console.timeStart = function(msg) {
			alert(msg);
		};
		console.timeEnd = function(msg) {
			alert(msg);
		};
	} else {
		console.timeStart = function() {};
		console.timeEnd = function() {};
	}
}

if (!Object.keys) Object.keys = function(o) {
	if (o !== Object(o))
	throw new TypeError('Object.keys called on a non-object');
	var k=[],p;
	for (p in o) if (Object.prototype.hasOwnProperty.call(o,p)) k.push(p);
	return k;
}

function isMobile(){
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		return true;
	}
	else{
		return false;
	}
}

var postCenterY = {};

function initScrollAnimator(){
	if (isMobile() == false) {
		// Initialize position with pre and save y position (if there is post y position, save it. else save the first y position)
			$('.IUScrollAnimator').each(function(){
				var viewport = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
				var jsonStr = $(this).attr('scrollAnimator').replace(/\'/g,'\"');
				var jsonData = JSON.parse(jsonStr);
				var mediaQueryArray = Object.keys(jsonData);
				var animatorKey = null;
				var mediaQueryArray = Object.keys(jsonData).reverse();
				var animatorKey = null;
				for (var i = 0; i < mediaQueryArray.length; i++) {
					if (parseInt(mediaQueryArray[i]) <= viewport) {
						animatorKey = mediaQueryArray[i];
						break;
					}
				}
				if (animatorKey == null || animatorKey == undefined) {
					animatorKey = mediaQueryArray[mediaQueryArray.length-1];
				}
				var scrollAnimatorData = jsonData[animatorKey];
				var propertyKeys = Object.keys(scrollAnimatorData); //scrollAnimatorX, scrollAnimatorY, scrollOpacity
				if ("scrollAnimatorY" in propertyKeys){
					postCenterY[$(this).attr('id')] = post + $(this).outerHeight()/2;
				}
				else {
					postCenterY[$(this).attr('id')] = $(this).offset().top + $(this).outerHeight()/2;
				}
				
				for(var i=0; i<propertyKeys.length; i++){	
					var propertyKey = propertyKeys[i];
					var pre = parseInt(scrollAnimatorData[propertyKey]['pre']);
					var post = parseInt(scrollAnimatorData[propertyKey]['post']);
					if(propertyKey == "scrollAnimatorX"){
						$(this).css('left', pre+"px");
					}else if(propertyKey == "scrollAnimatorY"){
						$(this).css('top', pre+"px");
					}else if(propertyKey == "scrollOpacity"){
						$(this).css('opacity', pre);
					}
				}
			});
		}
}


function calcScrollAnimatorValue(aPropertyKey, moveDistanceOfView, animationBound, pre, post){
	
	var cssValue = pre + ( moveDistanceOfView * (post - pre) ) / animationBound;
	if(aPropertyKey == 'scrollOpacity'){
		cssValue = Math.round(cssValue*100) / 100;
	}else{
		cssValue = Math.round(cssValue); 
	}
	if(post > pre){
		if(pre <= cssValue && cssValue <= post){
			return cssValue;
		}else{
			return post;
		}
	}else{
		if(post <= cssValue && cssValue <= pre){
			return cssValue;
		}else{
			return post;
		}
	}
}



function selectScrollAnimatorValue(widget, aPropertyKey, pre, post, animationEndY){
	
	
	var viewHeight = $(window).height();
	var animationBound = viewHeight/2;
	var viewAndWidgetDistance = postCenterY[$(widget).attr('id')] - animationEndY;
	var moveDistanceOfView;
	var animationValue = null;
	
	if (0 < viewAndWidgetDistance && viewAndWidgetDistance < animationBound){
		moveDistanceOfView = viewHeight/2 - viewAndWidgetDistance;
		animationValue = calcScrollAnimatorValue(aPropertyKey, moveDistanceOfView, viewHeight/2, pre, post);
	}
	else if (viewAndWidgetDistance >= animationBound){
		animationValue = pre;
	}
	else if (viewAndWidgetDistance <= 0){
		animationValue = post;
	}
	return animationValue;
}

function runScrollAnimator(){
	/* make scroll animator data */
	if (isMobile() == false) {
		$('.IUScrollAnimator').each(function(){
			var currScrollTop = $(window).scrollTop();
			var viewport = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
			var viewHeight = $(window).height();
			var viewCenterY = viewHeight/2 + currScrollTop;
			var viewBottomY = viewHeight + currScrollTop;
			var documentHeight = $(document).height();
			var bottomAnimationBound = documentHeight - viewHeight/2;
			var postWidgetCenterY = postCenterY[$(this).attr('id')];
			var jsonStr = $(this).attr('scrollAnimator').replace(/\'/g,'\"');
			var jsonData = JSON.parse(jsonStr);
			var mediaQueryArray = Object.keys(jsonData).reverse();
			var animatorKey = null;
			for (var i = 0; i < mediaQueryArray.length; i++) {
				if (parseInt(mediaQueryArray[i]) <= viewport) {
					animatorKey = mediaQueryArray[i];
					break;
				}
			}
			if (animatorKey == null || animatorKey == undefined) {
					animatorKey = mediaQueryArray[mediaQueryArray.length-1];
			}
			var scrollAnimatorData = jsonData[animatorKey];
			var propertyKeys = Object.keys(scrollAnimatorData); //scrollAnimatorX, scrollAnimatorY, scrollOpacity
				
			for(var i=0; i<propertyKeys.length; i++){
				var animationValue = null;	
				var aPropertyKey = propertyKeys[i];
				var pre = parseFloat(scrollAnimatorData[aPropertyKey]['pre']);
				var post = parseFloat(scrollAnimatorData[aPropertyKey]['post']);
				if (bottomAnimationBound <= postWidgetCenterY){
					animationValue = selectScrollAnimatorValue(this, aPropertyKey, pre, post, viewBottomY);
				}
				else {
					animationValue = selectScrollAnimatorValue(this, aPropertyKey, pre, post, viewCenterY);
				}
					
			    if(animationValue!=null){
				    if(aPropertyKey == "scrollAnimatorX"){ 
						$(this).css('left', animationValue+"px");
					}else if(aPropertyKey == "scrollAnimatorY"){
						$(this).css('top', animationValue+"px");
					}else if(aPropertyKey == "scrollOpacity"){
						$(this).css('opacity', animationValue);
					}  
			    }
			}
	    });
    }
}

function initEventMachine(){
	//trigger event show
	$('.IUJQueryShowEventReceiver').each(function(){
		$(this).hide();
    });
	
	//scroll event show
	$('.IUJQueryScrollShowEventReceiver').each(function(){
		$(this).hide();
    });
}


function runEventMachine(){
	$('.IUJQueryShowEventReceiver').each(function(){
		var evalValue;
		try {
			evalValue = eval($(this).attr('JQueryShowCondition'));
		}
		catch (e){
			return true;
		}
		toggleShowIU(this, evalValue);
	});
}

function toggleShowIU(iu, toggle, animation, duration){
	if (animation == undefined){
		animation = $(iu).attr('JQueryShowAnimation');
	}
	if (duration == undefined){
		duration = parseFloat($(iu).attr('JQueryShowDuration'))*1000;
	}
	
	if (toggle) {
		if(duration > 0){
			$('.IUGoogleMap').each(function(){
				resizeIUGoogleMap(this);
			});
			$(iu).show(animation, duration, function(){reframeCenterIU('.'+iu.id)} );
		}
		else{
			$(iu).css('display', 'inherit');
			reframeCenterIU('.'+iu.id);
		}
	}
	else {
		if(duration > 0){
			//call back function organize : center
			$(iu).hide(animation, duration);
		}
		else{
			$(iu).css({"display":"none"});
		}
	}
}



function runScrollEventMachine(){
	$('.IUJQueryScrollShowEventReceiver').each(function(){
		var currScrollTop = $(window).scrollTop();
		var from = $(this).attr('JQueryScrollShowFrom');
		var to = $(this).attr('JQueryScrollShowTo');
		if (to == undefined){
			to = $(document).height();
		}
		if (currScrollTop > from && currScrollTop < to){
			toggleShowIU(this, true);
		}
		else{
			toggleShowIU(this, false);
		}
    });
}

function increaseEventTrigger(iu){
		var variable = $(iu).attr('VariableTriggerVariable');
		var value = eval(variable);
		var maximumValue = variableStorage[variable].maximum;
		if (value == maximumValue){
			eval( variable+'=0;');
		}
		else {
			eval( variable+'++');
		}
	runEventMachine();
}

function decreaseEventTrigger(iu){
		var variable = $(iu).attr('VariableTriggerVariable');
		var value = eval(variable);
		var maximumValue = variableStorage[variable].maximum;
		if (value == 0){
			eval( variable+'='+ maximumValue +';');
		}
		else {
			eval( variable+'--');
		}
	runEventMachine();
}

function transitionAnimationOn(eventObject){
	var transition = eventObject.currentTarget;
	var secondObj = $(transition).find('.IUTransitionItem')[1];
	var animation = $(transition).attr('JQueryShowAnimation');
	var duration = parseFloat($(transition).attr('JQueryShowDuration'))*1000;
	
	toggleShowIU(secondObj, true, animation, duration);

	$(transition).data('isSelected', 'false');
}

function transitionAnimationOff(eventObject){
	var transition = eventObject.currentTarget;
	var secondObj = $(transition).find('.IUTransitionItem')[1];
	var animation = $(transition).attr('JQueryShowAnimation');
	var duration = parseFloat($(transition).attr('JQueryShowDuration'))*1000;
	
	toggleShowIU(secondObj, false, animation, duration);
	
	$(transition).data('isSelected', 'true');
}

function transitionAnimation(eventObject){
	
	var transition = eventObject.currentTarget;
	var effect = $(transition).attr('transitionanimation');
	var isSelected= $(transition).data('isSelected');


	if (isSelected=='true'){
		transitionAnimationOn(eventObject);
	}
	else {
		transitionAnimationOff(eventObject);
	}
}

/*
 function showCollectionView(iu, index){
 $('#'+iu).children().each(function(i){
 if(i != index){
 $(this).css('display', 'none');
 }
 else{
 $(this).css('display', 'block');
}
});
}
*/
function activateLink(iu, location){
	if (iu ==  undefined) {
		return;
	}
	var url = window.location.pathname;
	var links =  iu.href.split('#');
	var urlRegExp = new RegExp(url == '/' ? window.location.origin + '/?$' : url.replace(/\/$/,''));
	if(urlRegExp.test(links[0]) && links.length==1 ){
		if(location=='parent'){
			$(iu).parent().addClass('active');
		}
		else if(location=='child'){
			$(iu).children().first().addClass('active');
		}	
	}
	else{
		if(location=='parent'){
			if ($(iu).parent().hasClass('active')) {
				$(iu).parent().removeClass('active');
			}
		}		
		else if(location=='child'){
			if ($(iu).children().first().hasClass('active')) {
				$(iu).children().first().removeClass('active');
			}
		}		
	}
}
/*
function activateDivLink(){
	if($('[iudivlink]').length <=0) return;

	var dict={};
	$('[iudivlink]').each(function(){
		var pos = $(this).position().top;
		var caller = $(this).attr('linkcaller');
		dict[caller] = pos;
	});

	var sortable = [];
	for(var caller in dict){
		sortable.push([caller, dict[caller]]);
	}
	sortable.sort(function(a, b){return a[1] - b[1]});

	var scrollY = $(document).scrollTop();
	var currentCaller;
	for(var caller in dict){
		var position = dict[caller];
		if(position < scrollY){
			currentCaller = caller;
		}

		if ($('#'+caller).hasClass('active')) {
			$('#'+caller).removeClass('active');
		}
	}

	$('#'+currentCaller).addClass('active');
}
*/


function onWebMovieAutoPlay(){
	//autoplay when appear
	var scrollY = $(document).scrollTop();
	var screenH = $(window).height();
	var maxY = scrollY + screenH;
	$('[eventAutoplay]').each(function(){
		var type = $(this).attr('videotype');
		var display = $(this).css('display');
		if(isElementInViewport(this) && display != 'none'){
			//play
			if(type=='vimeo'){
				var vimeo = $f($(this).children()[0]);
				vimeo.api('play');

			}
			else if(type=='youtube'){
				var id = $(this).attr('id')+'_youtube';
				var youtube = document.getElementById(id);
				youtube.playVideo();
			}
		}
		else{
			//stop
			if(type=='vimeo'){
				var vimeo = $f($(this).children()[0]);
				vimeo.api('pause');
			}
			else if(type=='youtube'){
				var id = $(this).attr('id')+'_youtube';
				var youtube = document.getElementById(id);
				youtube.pauseVideo();
			}


		}
	});
}
 
/*

 function makeBottomLocation(){
 if($('.IUFooter').length > 0){
 var windowHeight =  $(window).height();
 var footerHeight = $('.IUFooter').height();
 var footerTop =  $('.IUFooter').position().top;
 var footerBottom = footerTop + footerHeight;
 if(footerBottom < windowHeight){
 $('.IUFooter').css('bottom','0px');
 $('.IUFooter').css('position','fixed');
 }
 else{
 $('.IUFooter').css('bottom','');
 $('.IUFooter').css('position','');
 }
 }
 }

 */

function reloadTextMediaQuery() {
	var viewport = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	$('p').filter('.IUViewPortChangeableText').each(function(index){

		if ($(this).attr('maxviewport') < viewport || $(this).attr('minviewport') > viewport ){
			$(this).css('display', 'none');
		}
		else {
			$(this).css('display', 'inherit');
		}
	});
}


$(window).resize(function() {
	//iu.js
	//makeBottomLocation();

	//iuframe.js
	//resizeCollection();
	reframeCenter();
	//resizePageLinkSet();
	//resizeSideBar();
	makefullSizeSection();
	//resizePageContentHeight();
	//iuinit.js
	reloadTextMediaQuery();
	initScrollAnimator();
	runScrollAnimator();
});

$(document).ready(function(){
    makefullSizeSection();
    reloadTextMediaQuery();
	
	//init carousel
	$('.IUCarousel').each(function(){
		initCarousel(this.id);
	});
	
	//init transition
	$('.IUTransition').each(function(){
        var eventType = $(this).attr('transitionevent');
                            
        if (eventType=='mouseOn'){
            $(this).mouseenter(transitionAnimationOn);
            $(this).mouseleave(transitionAnimationOff);
        }
        else {	
            $(this).bind(eventType, transitionAnimation);
			$(this).css('cursor', 'pointer');
        }
		
		//make initial transition state to first item
        var children = $(this).find('*').filter('.IUTransitionItem')
        var firstObj = children[0];
        $(firstObj).css("display", "block");
        var secondObj = children[1];
		$(secondObj).css("display", "none");
	    $(this).data('isSelected', 'true');
	});
	
	//check link activate
	$("[iulink='1']").each(function(){
		var link = $(this).children().get(0);
		activateLink(link, 'parent');
	});
	
    $("[divlink='1']").click(function(event){
		var childLink = $(this).children().get(0);
		var childLinkTarget = $(childLink).attr('target');
		if (childLinkTarget == undefined || childLinkTarget == "_self") {
		// split to link & div htmlID 
			var link =  childLink.href.split('#')[0];
			var div = childLink.href.split('#')[1];
			var url = window.location.pathname;
			var urlRegExp = new RegExp(url == '/' ? window.location.origin + '/?$' : url.replace(/\/$/,''));
			if(urlRegExp.test(link)){
			    event.preventDefault();
				var linkIU = $('#'+div);
				$('html,body').scrollTo(linkIU.offset().left, linkIU.offset().top); 
		    }			
		}
    });
                  
    $('select').each(function(){
        if ( $(this).attr('selectedvalue') ){
            $(this).val($(this).attr('selectedvalue'));
        }
    });
	
	//init precentation mode
	if ($("[presentation='1']").length > 0){
		initPresentationMode();
	}
	
	//init scroll event
	if ( $('.IUScrollAnimator').length > 0){
		initScrollAnimator();
	}
    
	
	//init google map
	$('.IUGoogleMap').each(function(){
		initIUGoogleMap(this);
	});

    //init event 
	$('.IUEventHoverTrigger').mouseenter(function(){increaseEventTrigger(this);});
	$('.IUEventHoverTrigger').mouseleave(function(){decreaseEventTrigger(this);});
	$('.IUEventClickTrigger').click(function(){increaseEventTrigger(this);});
	
	reframeCenter();
    
});

$(window).load(function(){
	//init event variable
    if(typeof variableStorage != "undefined"){
	    $.each( variableStorage, function( key, value ) {
		    eval(key + " = " + value.initial);
	    });
		initEventMachine();
	}
});


$(window).scroll(function(){
    
    onWebMovieAutoPlay();
    runScrollAnimator();
	runScrollEventMachine();
    //activateDivLink();
});
