$(document).ready(function(){
	
});

function validate(){
	
	var currentPassword = $('#goal_current_password').val();
	var newPassword = $('#goal_new_password').val();
	var retypePassword = $('#goal_retype_password').val();
	$('div .alert-danger').remove();
	$('div .alert-success').remove();
	if(currentPassword == '' || newPassword == '' || retypePassword == ''){
		showErrorMsg(changePassword.js_all_fields_req_msg, 'msg', true);
		return false;
	}
	if(newPassword.length < 8 || newPassword < 16){
		showErrorMsg(changePassword.js_password_length_msg, 'msg', true);
		return false;
	}
	if(newPassword != retypePassword){
		showErrorMsg(changePassword.js_pass_not_match_msg, 'msg', true);
		return false;
	}
	
	if(currentPassword == newPassword){
		showErrorMsg(changePassword.js_pass_should_not_match_current, 'msg', true);
		return false;
	}
	return true;
}