/* Wrapstrip
	A toy with which to view and explore horizontal drawings in a flat 
	wrapping space. Look for fun juxtapositions! Amaze your ocular organs!
	Art etc by Ed Stastny, 2017.
*/

/* Global defaults 
	Better to override these in the init object rather than change the variables here.
*/
var offsetX = 0,
	isFlowing = false,
	flowIntervalId = null,
	displayRows = [200,100,300,150,50],
	displayRowsHeightRatio = [],
	displayRowsOffset = [],
	sourceHeight = 200,
	offsetAmount = 1,
	fps = 100,
	rowWidth = 800,
	srcUrl = "img/strip_compiled_sm_bw.jpg";


/* Set up the display using an object with parameters
	.offsetX       starting offset (number)
	.displayRows   array of numbers, each representing rows' heights in pixels, sorted top to bottom
	.rowWidth      the width of the display, in pixels
	.sourceHeight  height of the image being used
	.offsetAmount  how much to offset per frame when animating
	.fps           ideal frames per second when animating
*/
var initDisplay = function(initObj) {
	// read from init object
	offsetX = initObj.offsetX || offsetX;
	displayRows = initObj.displayRows || displayRows;
	rowWidth = initObj.rowWidth || rowWidth;
	sourceHeight = initObj.sourceHeight || sourceHeight;
	offsetAmount = initObj.offsetAmount || offsetAmount;
	fps = initObj.fps || fps;
	srcUrl = initObj.srcUrl || srcUrl;

	// reset row calculation arrays
	displayRowsHeightRatio = [];
	displayRowsOffset = [];

	// set up the display
	$("#displayHolder").empty().css("width",rowWidth+"px");

	var len = displayRows.length,
		maxOffset = 0;
	for(var i=0; i<len; i++) {
		var newRow = $("<div class='strip_row row_" + i + "'/>").css("height",displayRows[i]+"px");
		$("#displayHolder").append(newRow);
		displayRowsHeightRatio[i] = displayRows[i] / sourceHeight;
		if (i===0) {
			displayRowsOffset[i] = 0;
		} else {
			displayRowsOffset[i] = maxOffset + (rowWidth / displayRowsHeightRatio[i-1]);
		}
		maxOffset = displayRowsOffset[i];
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
	var len = displayRows.length;
	for(var i=0; i<len; i++) {
		var off = (offsetX-displayRowsOffset[i]) * displayRowsHeightRatio[i];
		$("#displayHolder .row_"+i).css("background-position", off + "px 0px").css("background-size","auto " + displayRows[i]+"px");
	}
};

var initUi = function() {
	$(".strip_row").on("click", function(e) {
		toggleFlow();
	});
	$(window).on("keydown", function(e) {
		if (e.which === 39) {
			toggleFlow(true);
		} else if (e.which === 37) {
			toggleFlow();
		}
	});
};
