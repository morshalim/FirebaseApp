$(document).ready(function() {
	if($('#logmein').text().length >35)
		$('#logmein').attr('style','width:55% !important;');
	$('#j_username_v').focus();
	
	$("#j_client").val(client);
	if(showClient) {
		$("#j_client").show();
		$("#j_client_ico").show();
	}else{
		$("#j_client").hide();
		$("#j_client_ico").hide();
	}
	var hashObj = new jsSHA(key, "ASCII");
	var publicKey = hashObj.getHash("SHA-512", "HEX");

	$.jCryption.authenticate(publicKey, "generateJCryptionKey.json?generateKeyPair=true", "generateJCryptionKey.json?handshake=true",
			function(AESKey) {
				//Authentication Success
			},
			function() {
				// Authentication failed
			}
	); 
	$("#loginForm").submit(function() {
		if(!validateLogin()){
			showErrorMsg(js_all_fields_are_required_msg,"page-error-cntr");
			return false;
		}
	else{
			var encryptedString = $.jCryption.encrypt($("#j_password_v").val(), publicKey);
			$("#j_password").val(encryptedString);
			$("#j_username").val($("#j_client").val() + '__' + $("#j_username_v").val());
			return true;
	}
	});
});
function validateLogin(){
	if($('#j_username_v').val()=='' || $("#j_password_v").val()=='' || $("#j_client").val()=='')
		return false;
	else
		return true;
}
function show_box(id) {
	$('.widget-box.visible').removeClass('visible');
	$('#' + id).addClass('visible');
}