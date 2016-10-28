$(window).load(function(){
    resetForm();
});

$(window).on('load resize', function(){
	var videoWidth = $("#teaser-wrapper").width();
	$("#teaser-wrapper").height(videoWidth*9/16);
	$("#teaser-wrapper video").width(videoWidth);

	if(isScrolledIntoView("#teaser") && !$("#teaser")[0].ended){
		$("#teaser")[0].play();
		$(window).off("scroll");
	}
});

$(window).on("scroll", function(){
	if(isScrolledIntoView("#teaser") && !$("#teaser")[0].ended){
		$("#teaser")[0].play();
		$(window).off("scroll");
	}
//    $("#preloader").attr("style","");
//    $("#status").attr("style","");
});

$("#submit-feedback").click(function(){
    if($('#contactMsg').val().trim() == '') return;
    $.ajax("/feedback.php", {
        data: { name: $('#contactName').val(),
                email: $('#contactEmail').val(),
                msg: $('#contactMsg').val() },
        beforeSend: function() {
        },
        success: function(data) {
            $('#feedback-response').css('display','flex').css('color', data.endsWith("again")?"red":"green").html(data);
            resetForm();
        },
        error: function() {
            $('#feedback-response').css('display','flex').html('There was a problem! Please try again.');
            resetForm();
        }
    });
});

function resetForm(){
    $('#contactName').val("");
    $('#contactEmail').val("");
    $('#contactMsg').val("");
}


var endTime = new Date(2016, 10, 18, 8, 0).getTime() / 1000;
var countdownInterval = setInterval(function() {
	var nowTime = new Date().getTime() / 1000;
	var diff = endTime - nowTime;
	if(diff <= 0) {
		$('#days').text(0);
		$('#hours').text(0);
		$('#minutes').text(0);
		$('#seconds').text(0);
		window.clearInterval(countdownInterval);
		return;
	}
	var temp = diff / (60 * 60 * 24);
	if(temp.toString().indexOf('e') != -1) temp = 0;
	var days = parseInt(Math.abs(Number(temp)));
	diff = temp - days;
	var hours = parseInt(Math.abs(Number(diff * 24)));
	diff *= 24 * 60;
	diff -= hours * 60;
	var mins = parseInt(Math.abs(Number(diff)));
	diff -= mins;
	var secs = parseInt(Math.abs(Number(diff * 60)));
	$('#days').text(days);
	$('#hours').text(hours);
	$('#minutes').text(mins);
	$('#seconds').text(secs);
}, 1000);
window.setInterval(countdownInterval);

function isBreakpoint( alias ) {
    return $('.device-' + alias).is(':visible');
}

function isScrolledIntoView(elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}