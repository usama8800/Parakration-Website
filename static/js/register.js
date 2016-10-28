$(document).ready(function() {
	var img = new Image();
	img.src = "/static/img/loading.gif";
	$('input[type = "file"]').each(function() {
		var val = $(this).val();
		if(val != '') fileChooser.call(($(this)));
	});
	refreshFileInputs();
    setTimeout(function(){
        $("body").attr("style", "overflow-x:hidden;");
    }, 200);
});

$('select.form-control').on("change", function(){
    $(this).addClass("selected");
});

var maxDelegatesAllowed = 6;
$('#add-delegate').click(function() {
	if(!$(this).hasClass('disabled')) {
		var number = $(this).attr('number');
		$.ajax("/delegate.php", {
			data: { num: number },
			beforeSend: function() {
				$('#loading-icon').fadeIn().css('display', 'block');
				$('#remove-delegate').addClass('disabled');
			},
			success: function(data) {
				$('#loading-icon').fadeOut(function() {
					$('#form-buttons').before(data);
					var num = parseInt(number);
					var id = "#delegate-" + num;
					var height = $(id).height();
					$(id).css('height', '0').animate({ height: height }, '2000', function() {
						$(id).removeAttr('style');
					});
					$('#add-delegate').attr('number', num + 1);
					$('#remove-delegate').removeClass('disabled');
					if(num == maxDelegatesAllowed) $('#add-delegate').addClass('disabled');
					refreshFileInputs();
                    console.log("Success");
				});
			},
			error: function() {
                console.log("Failure");
				$('#loading-icon').fadeOut();
                $("#add-delegate").attr("number", number);
                if(number!=2) $('#remove-delegate').removeClass('disabled');
				refreshFileInputs();
			}
		});
	}
});

$('#remove-delegate').click(function() {
	if(!$(this).hasClass('disabled')) {
		var num = parseInt($('#add-delegate').attr('number')) - 1;
		$('#delegate-' + num).css('position', 'relative').animate({ height: 0 }, 'slow', function() {
			$(this).remove();
		});
		$('#add-delegate').attr('number', num).removeClass('disabled');
		if(num == 2) $(this).addClass('disabled');
	}
});

var submit = true;
$('#registration-form').submit(function() {
	if(!submit) {
		setTimeout(function() {
			console.log('djn');
			var valid = true;
			$('input[type = "file"]').each(function() {
				if(!validateFileChooser($(this)) && valid) {
					var scrollTo = $('.has-error')[0].offsetTop - 60;
					$('html, body').animate({
						scrollTop: scrollTo
					}, 1000)
					valid = false;
				}
			});
			if(valid) {
				$('#registration-form').append('<input type="hidden" name="id" value="' + new Date().getTime().toString().hashCode() + '"/>');
				submit = true;
				$('#registration-form').submit();
			}
		}, 50);
	}
	return submit;
});

$('#registration-form').click(function() {
	submit = false;
});

function refreshFileInputs() {
	console.log('refreshFileInputs');
	$('input[type = "file"]').on('change', fileChooser);
	$.validate({
		lang: 'en',
		form: '#registration-form',
		scrollToTopOnError: false
	});
};

function fileChooser() {
	console.log('fileChooser');
	var val = $(this).val();
	var id = $(this).attr('id') + "-span";
	if(validateFileChooser($(this))) {
		$(this).parent().parent().removeClass('has-error');
		$(this).parent().removeClass('error');
		$('#' + id + '-error').remove();
	} else val = 'Choose photo...';
	$('#' + id).html(val.substring(val.lastIndexOf('\\') + 1));
}

function validateFileChooser(chooser) {
	console.log('validateFileChooser');
	var val = chooser.val();
	var id = chooser.attr('id') + '-span';
	if(val == '') {
		if($('#' + id + '-error').length == 0) {
			chooser.parent().parent().addClass('has-error');
			chooser.parent().addClass('error');
			chooser.parent().after('<span id="' + id + '-error" class="help-block form-error">This is a required field</span>');
		}
        chooser.next().removeClass("selected");
		return false;
	}
    chooser.next().addClass("selected");
	return true;
}

String.prototype.hashCode = function() {
	var hash = 0,
		i, chr, len;
	if(this.length === 0) return hash;
	for(i = 0, len = this.length; i < len; i++) {
		chr = this.charCodeAt(i);
		hash = ((hash << 5) - hash) + chr;
		hash |= 0;
	}
	return hash;
};