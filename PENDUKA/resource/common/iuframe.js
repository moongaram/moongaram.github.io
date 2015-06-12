function isElementInViewport (el) {

    //special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }

    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
}

function isElementIntersectViewport (el) {
    //special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }

    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
		(rect.top <= (window.innerHeight || document.documentElement.clientHeight) || /*or $(window).height() */
		rect.left <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */)
    );
}


function makefullSizeSection(){
    var respc = $('[enableFullSize="1"]').toArray();
	var windowHeight =  $(window).height();
	$.each(respc, function(){
		$(this).css('height', windowHeight+'px');
	});
}

function resizePageContentHeight(){
	$('.IUPageContent').each(function(){
		var minHeight = 0;
		$(this).children().each(function(){
			var position = $(this).css('position');
			if(position == 'relative'){
				var iulocation = $(this).position().top + $(this).height();
				if(iulocation > minHeight){
					minHeight = iulocation;
				}
			}
		})
		$(this).css('min-height', minHeight);
	});
}

function resizeCollection(){
	$('.IUCollection').each(function(){
		//find current count
		var responsive = $(this).attr('responsive');
		responsiveArray = eval(responsive);
		count = $(this).attr('defaultItemCount');
		viewportWidth = $(window).width();
		var minWidth = 9999;
		for (var index in responsiveArray){
			dict = responsiveArray[index];
			width = dict.width;
			if (viewportWidth<width && minWidth > width){
				count = dict.count;
				minWidth = width;
			}
		}		
		var width = $(this).width()/count;
		$(this).children().css('width', width.toFixed(0)+'px');
	});
}

function relocateScrollAnimation(){
	//move : current viewport pc type
	if(typeof isMobile != "undefined" && isMobile()==false){
		$('[xPosMove]').each(function(){
			var xPosMove = $(this).attr('xPosMove');
            var start;
            
			if ($(this).css('float') == 'left'){
                start = parseFloat($(this).css('margin-left')) - xPosMove;
                $(this).css('margin-left', start + 'px');
            }
            else if($(this).css('float') == 'right'){
               start = parseFloat($(this).css('margin-right')) - xPosMove;
               $(this).css('margin-right', start + 'px');
            }
            else{
				start = parseFloat($(this).css('left')) - xPosMove;
				$(this).css('left', start + 'px');
			};
            $(this).attr('start', start);

		});
	}
}

function resizeSideBar(){
	var windowHeight =  $(window).height();
	var documentHeight = $( document ).height();
	var height;
	if(windowHeight > documentHeight){
		height = windowHeight;
	}
	else{
		height = documentHeight;
	}
	
	var headerHeight = $('.IUHeader').height();
	var footerHeight = $('.IUFooter').height();
	
	$('.IUSidebar').each(function(){
		var type = $(this).attr('sidebarType');
		var sideBarHeight;
		if(type==0){
			sideBarHeight = height;
		}
		else{
			sideBarHeight = height-headerHeight-footerHeight;
		}
		$(this).css('height', sideBarHeight+'px');
		console.log('sidebar height:'+sideBarHeight);
	});
}


function reframeCenterIU(iu){
    
    console.timeStart("reframeCenterIU");

    
	var ius = [];
	if($(iu).attr('horizontalCenter')=='1'){
		ius.push($(iu));
	}
	ius = $.merge(ius, $(iu).find('[horizontalCenter="1"]').toArray());
	arrangeHCenter(ius);
	
	//vertical center
	ius = [];
	if($(iu).attr('verticalCenter')=='1'){
		ius.push($(iu));
	}
	ius = $.merge(ius, $(iu).find('[verticalCenter="1"]').toArray());
	
	arrangeVCenter(ius);
    
    console.timeEnd("reframeCenterIU");
}

function findDisplayNoneParent(iu){
	var parent = $(iu).parent();
	if(parent!=undefined){
		if (parent[0].tagName=="BODY"){
			return iu;
		}
		var display = parent.css('display');
		if (display == "none") {
			return parent;
		}
		else {
			return findDisplayNoneParent(parent);
		}
	}
	else{
		return iu;
	}
}

function getOuterWidthPixel(iu){
	var width = $(iu).css('width');
	var widthExcludeUnit = $(iu).width();

	var percentIndex = width.search(/%/i);
	if (percentIndex > -1) {
		percentage = parseFloat(width.split("%"));
		return (percentage/100)*getOuterWidthPixel($(iu).parent());
	}
	else {
		var outerWidth = $(iu).outerWidth();
		if (widthExcludeUnit == 0) {
			if (typeof isEditor != 'undefined' && isEditor == true){
				return outerWidth;
			}
			var displayNoneParent = findDisplayNoneParent(iu);
			$(displayNoneParent).css('display', 'block');
			$(displayNoneParent).css('visibility', 'hidden');
			outerWidth = $(iu).outerWidth();
			$(displayNoneParent).css('display', '');
			$(displayNoneParent).css('visibility', '');
		}
		return outerWidth;
	}
}

function getOuterHeightPixel(iu){
    var height = $(iu).css('height');
    var heightExcludeUnit = $(iu).height();
    var percentIndex = height.search(/%/i);
    if (percentIndex > -1) {
	    percentage = parseFloat(height.split("%"));
        return (percentage/100)*getOuterHeightPixel($(iu).parent());
    }
    else {
	    var outerHeight = $(iu).outerHeight();
	    if (heightExcludeUnit == 0) {
		    if (typeof isEditor != 'undefined' && isEditor == true){
				return outerHeight;
			}
		    var displayNoneParent = findDisplayNoneParent(iu);
			$(displayNoneParent).css({visibility: "hidden", display: "block" });
			outerHeight = $(iu).outerHeight();
			$(displayNoneParent).css('display', '');
			$(displayNoneParent).css('visibility', '');
	    }
	    return outerHeight;
    }
}

function getBorderPixel(iu){
	var border = $(iu).css('border');
	if (border != undefined && border.length > 0) {
		var borderPixel = border.split("px")[0];
		return borderPixel;	
	}
	else {
		return 0;
	}
}

function arrangeHCenterEachIU(iu){
	var pos = $(iu).css('position');
	var myW=0;
    if (pos == 'absolute'){
        var parentW;
        var parent = $(iu).parent();
        if(parent.prop('tagName') == 'A'){
            parentW = getOuterWidthPixel(parent.parent());
        }
        else{
            parentW = getOuterWidthPixel(parent);
        }
            
        myW = getOuterWidthPixel($(iu));
        var parentBorderPixel = getBorderPixel(parent);
        $(iu).css('left', ((parentW-myW)/2 - parentBorderPixel) + 'px');
    }
    else if(pos == 'fixed'){
		var windowWidth = $(window).outerWidth();
        myW = getOuterWidthPixel($(iu));
        var parentBorderPixel = getBorderPixel(parent);
        $(iu).css('left', ((windowWidth-myW)/2 - parentBorderPixel)+ 'px');
	}
    else {
        $(iu).css('margin-left', 'auto');
        $(iu).css('margin-right', 'auto');
        $(iu).css('left','');
    }

}

function arrangeHCenter(ius){
    
    console.timeStart("arrangeHCenter");

    //if flow layout, margin auto
    //if absolute layout, set left
	$.each(ius, function(){
        arrangeHCenterEachIU(this);
    });
    console.timeEnd("arrangeHCenter");
}

function arrangeVCenterEachIU(iu){
	var pos = $(iu).css('position');
	var myH=0;
    if (pos == 'absolute'){
        var parentH;
        var parent = $(iu).parent();
        if(parent.prop('tagName') == 'A'){
            parentH = getOuterHeightPixel(parent.parent());
        }
        else{
            parentH = getOuterHeightPixel(parent);
        }
            
        myH = getOuterHeightPixel($(iu));
        var parentBorderPixel = getBorderPixel(parent);
        $(iu).css('top', ((parentH-myH)/2 - parentBorderPixel) + 'px');
    }
    else if(pos == 'fixed'){
		var windowHeight = $(window).outerHeight();
        myH = getOuterHeightPixel($(iu));
        var parentBorderPixel = getBorderPixel(parent);
        $(iu).css('top', ((windowHeight-myH)/2 - parentBorderPixel)+ 'px');
	}
    else {
        $(iu).css('margin-left', 'auto');
        $(iu).css('margin-right', 'auto');
        $(iu).css('top','');
    }
    
}


function arrangeVCenter(ius){
    
    console.timeStart("arrangeVCenter");

    
	$.each(ius, function(){
		arrangeVCenterEachIU(this);
    });
    
    console.timeEnd("arrangeVCenter");

}

function reframeCenter(){
    console.timeStart("reframeCenter");

	arrangeHCenter($('[horizontalCenter="1"]').toArray());
	arrangeVCenter($('[verticalCenter="1"]').toArray());
    
    console.timeEnd("reframeCenter");

}
/*
function resizePageLinkSet(){
	$('.PGPageLinkSet div').each(function(){
		len = $(this).children().children().length;
		m = parseFloat($(this).children().children().children().css('margin-left'));
		w = $(this).children().children().children().width();
		width = (2*m+w)*len;
		$(this).width(width+'px');
        console.log('setting width'+$(this).id+' width : '+width);
	});
}
*/
function getCurrentData(mqDict){
	var viewportWidth = $(window).width();
	var minWidth = 10000;
	var currentData;
	for (var key in mqDict){
		var width = parseInt(key);
	
		if (viewportWidth <= width && minWidth > width){
			currentData = mqDict[key];
			minWidth = width;
		}
	}
	return currentData;
}

