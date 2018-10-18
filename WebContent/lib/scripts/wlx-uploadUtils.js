$(function() {
	$('#upload-input-file').ace_file_input({
		no_file : 'No File ...',
		btn_choose : 'Choose',
		btn_change : 'Change',
		droppable : false,
		onchange : null
	});

	'use strict';
	$('#upload-input-file').fileupload(
					{
						url : uploadFileURL,
						autoUpload : false,
						maxFileSize : 5000000,
						disableImageResize : /Android(?!.*Chrome)|Opera/
								.test(window.navigator.userAgent),
						previewMaxWidth : 100,
						previewMaxHeight : 100,
						previewCrop : true
					})
			.on('fileuploadadd', function(e, data) {
						$('#' + langMap.message_id).empty();
						if (data.files.length > 1) {
							showError(langMap.upload_guarantees_msg_select_one_file, langMap.page_error_cntr);
							data.files.pop();
						} else {
							data.context = $('#uploadFiles');
							$('#uploadFiles').click(function() {
								if (data.files.length == 1){
									data.formData = {'path':$('#path').val(),'fileName':$('#fileName').val()};
									data.submit();
								}
							});
						}
					})
			.on('fileuploaddone', function(e, data) {
						if (data.result == langMap.upload_guarantees_text_ok) {							
							showSuccess(langMap.upload_guarantees_text_upload_success, langMap.page_error_cntr);
						} else if (data.dataType && data.dataType.indexOf('iframe') != -1) {
							var isOK = '';
							try
							{
								if(data.result[0].body.innerText == langMap.upload_recommendations_text_ok)
									isOK='Ok';
								else
									isOK=data.result[0].body.innerText;
							}
							catch(err){}
							if(isOK=='Ok')
							{
								showSuccess(langMap.upload_guarantees_text_upload_success, langMap.page_error_cntr);
							}
							else
							{
								showError(isOK, langMap.page_error_cntr);
							}
						
						} else if(data.result != langMap.upload_guarantees_text_ok ){
							showError(data.result, langMap.page_error_cntr);
						}else
							showError(langMap.upload_guarantees_msg_not_uploaded, langMap.page_error_cntr);

						$('.remove').click();
						data.files.pop();
					}).on('fileuploadfail', function(e, data) {
				showError(langMap.upload_guarantees_text_fail, langMap.page_error_cntr);
			});
});

function downloadFile(){
	var  fileName = $('#fileName').val();	
	var data={};
	showLoading();
	data[req_csv_url] = downloadFileURL;
	if(fileName!=null && fileName!='')
	{
		data[req_upload_file_name] = fileName;
	}
	$.fileDownload(
		data[req_csv_url]+"?"+uploaded_file_name+"="+data[req_upload_file_name],{
		successCallback: function (url) {
		 		closeLoading();
		    },
		    failCallback: function (html, url) {
		    	closeLoading();
		    	showError('File not found', langMap.page_error_cntr);
			}
	});
}

function checkFile()
{
	$('#page-error-cntr').empty();
	var data = {};						
	data[req_upload_file_name] = $('#fileName').val();	
	$.ajax({
        url:checkFileURL,
        data:data,
        cache: false,
        type:"POST",
        success: checkFileSuccess,
		error: checkFileError
	 });
					
}

function checkFileSuccess(dataMap, textStatus, XMLHttpRequest){
	var data;
	if(dataMap.status==true){	
		showSuccess(dataMap.successMessage, langMap.page_error_cntr);		
		$("body,html").scrollTop(0);		
	} else {
		data = dataMap.errorMessage;
		showError(data, langMap.page_error_cntr);
	}
}

function checkFileError(XMLHttpRequest, textStatus, errorThrown)
{
	
}