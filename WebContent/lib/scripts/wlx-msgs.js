var bootBoxErrorMsg;
$(document).ready(function() {	
		bootBoxErrorMsg = $('#msgApp').html();
		$('#msgApp').remove();			
	/*$("#msgTrigger").fancybox({
		'transitionIn': 'elastic',
		'transitionOut': 'elastic',
		'enableEscapeButton': true,
		'scrolling': 'no',
		'titleShow': false,
		'overlayOpacity': .45,
		'overlayColor': '#000',
		'showNavArrows': false,
		'width': 630,
		'height': 500,
		'autoDimensions': true
	});	*/					   
						   
	if(crtErrorMsg.message != null && crtErrorMsg.message != "")
		reportMsg(crtErrorMsg.message);
});


function reportMsg(msg)
{
	bootbox.dialog(
	{
		message:bootBoxErrorMsg/*, 
		buttons: {
			danger:{
				label: lang.crt_bootbox_cancel,
				className: "btn-default"
			}
		}*/
	});	
	
	//bootbox.dialog(bootBoxErrorMsg, []);
	$('#msgContainer').html(msg);
	
}

