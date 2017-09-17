/* Wrapstrip
	A toy with which to view and explore horizontal drawings in a flat 
	wrapping space. Look for fun juxtapositions! Amaze your ocular organs!
	Art etc by Ed Stastny, 2017.
*/

/* Global defaults 
	Better to override these in the init object rather than change the variables here.
*/
var Wrapstrip = (function($){
	var offsetX = 0,
		isFlowing = false,
		flowIntervalId = null,
		rowHeights = [200,100,300,150,50],
		rowRatios = [],
		rowOffsets = [],
		offsetAmount = 1,
		fps = 100,
		rowWidth = 800,
		srcUrl = "img/strip_compiled_sm.jpg",
		imageHeight = 200;


	/* Set up the display using an object with parameters
		.offsetX       starting offset (number)
		.rowHeights   array of numbers, each representing rows' heights in pixels, sorted top to bottom
		.rowWidth      the width of the display, in pixels
		.imageHeight  height of the image being used
		.offsetAmount  how much to offset per frame when animating
		.fps           ideal frames per second when animating
	*/
	var initDisplay = function(initObj) {
		// read from init object
		offsetX = initObj.offsetX || offsetX;
		rowHeights = initObj.rowHeights || rowHeights;
		rowWidth = initObj.rowWidth || rowWidth;
		imageHeight = initObj.imageHeight || imageHeight;
		offsetAmount = initObj.offsetAmount || offsetAmount;
		fps = initObj.fps || fps;
		srcUrl = initObj.srcUrl || srcUrl;

		// reset row calculation arrays
		rowRatios = [];
		rowOffsets = [];

		// set up the display
		$("#displayHolder").empty().css("width",rowWidth+"px");

		var len = rowHeights.length,
			maxOffset = 0;
		for(var i=0; i<len; i++) {
			var newRow = $("<div class='strip_row row_" + i + "'/>").css("height",rowHeights[i]+"px");
			$("#displayHolder").append(newRow);
			rowRatios[i] = rowHeights[i] / imageHeight;
			if (i===0) {
				rowOffsets[i] = 0;
			} else {
				rowOffsets[i] = maxOffset + (rowWidth / rowRatios[i-1]);
			}
			maxOffset = rowOffsets[i];
		}

		$(".strip_row").css("width",rowWidth + "px").css("background-image","url('" + srcUrl + "')");

		updatePositions();
	};

	var toggleFlow = function(isReverse) {
		isFlowing = !isFlowing;
		if (isFlowing) {
			window.clearInterval(flowIntervalId);
			flowIntervalId = window.setInterval(function(){
				addToOffset(isReverse ? offsetAmount : -offsetAmount);
			},1000/fps);
		} else {
			window.clearInterval(flowIntervalId);
		}
	};

	var addToOffset = function(offset_amt) {
		offsetX += offset_amt;
		updatePositions();
	};

	var updatePositions = function() {
		var len = rowHeights.length;
		for(var i=0; i<len; i++) {
			var off = ( offsetX - rowOffsets[i] ) * rowRatios[i];
			$("#displayHolder .row_"+i).css("background-position", off + "px 0px").css("background-size","auto " + rowHeights[i]+"px");
		}
	};

	var initUi = function() {
		$(".strip_row").off("click").on("click", function(e) {
			toggleFlow(true);
		});
		$(window).off("keydown").on("keydown", function(e) {
			if (e.which === 39) {
				toggleFlow(true);
			} else if (e.which === 37) {
				toggleFlow();
			}
		});
	
		// image chooser
		$(".img_item").off("click").on("click", function(){
			initDisplay({"srcUrl":"img/" + $(this).data("filename"), "imageHeight": $(this).data("imgheight")});
			$(".img_item").removeClass("current");
			initUi();
		});
		$(".img_item").each(function(ii){
			$(this).text($(this).data("imgtitle"));
			if(srcUrl === "img/" +$(this).data("filename")) {
				$(this).addClass("current");
			}
		});
	};

	return {
		initUi: initUi,
		initDisplay: initDisplay
	}
})(jQuery);
