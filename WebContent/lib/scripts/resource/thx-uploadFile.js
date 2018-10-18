var uploadFileMessage="";
$(document).ready(function() {
	uploadFileMessage = $('#uploadFileDialog').html();
	$('#uploadFileDialog').remove();
	
	//buildFilesTable(filesList);
	
	$('#uploadFile').on('click',function(){
		fileUploadPopup();
	});
	
	$(document).on('click','a[rel="deleteFile"]',function(){
		deleteFile(this);
	});
	
	$(document).on('click','a[rel="downloadFile"]',function(){
		fileDownload(this);
	});
	
	$(document).on('click','#cancel',function(){
		bootbox.hideAll();
	});
	
	$(document).on('click','#uploadCancel',function(){
		window.location = 'EV_VIEW_LEADS_DOCUMENTS.htm';
	});
	populatePath(folderPath);
	
	$('#title').keypress(function(event) {
	    if (event.keyCode == 13) {
	        event.preventDefault();
	    }
	});
});

function populatePath(data){
	var folders=data.split('~');
	var data = [];
	for (var i = 0; i < folders.length; i++) {
		if(i==0)
			continue;
		var folder = folders[i].split(',');
		var row = {};
		row.folderName = folder[0];
		row.folderId = folder[1];
		data.push(row);
	}
	var path = [];
	path.push('<div class="col-xs-12">');
	path.push('	<ul class="breadcrumb bigger-110">');
	path.push('		<li>');
	path.push('			<i class="ace-icon fa fa-folder blue"></i>&nbsp;&nbsp;');
	path.push('		<a href="#" folderId = "0" onclick="goInsideFolder(this)"> Folders</a>');
	path.push('	</li>');
	$.each(data,function(index,item){
		path.push('	<li>');
		if(data.length -1 == index)
			path.push(item.folderName);
		else
			path.push('	<a href="#" folderId = '+item.folderId+'>'+item.folderName+'</a>');
		path.push('	</li>');
	});
	//path.push('	<li class="active">Documents</li>');
	path.push('</ul>');
	path.push('</div>');

	$('#filePath').html(path.join(''));
}


function fileUploadPopup(){
	bootbox.dialog({
		message: uploadFileMessage,
		title: "Upload File"
	});
	
	initUploadFile();
}

function initUploadFile(){
	$('#id-input-file-1').ace_file_input({
		no_file:'No File ...',
		btn_choose:'Choose',
		btn_change:'Change',
		droppable:false,
		onchange:null,
		thumbnail:false/*,
		before_change: function(files, dropped) {
		    var valid_files = []

		    for(var i = 0; i < files.length; i++) {
		      var file = files[i];

		      if (file){
		    	  valid_files.push(file);
		    	  if( file.size > fileSize*1024*1024 ) {
						showError("File Size Exceeds Max File Size",lang.js_message_upload);
						return false;
					}
		      }
		    }
		    $('#id-input-file-1').ace_file_input('reset_input');
		    $('#id-input-file-1').ace_file_input('reset_input_ui');
		    return valid_files;
		 }*/
	});
	

	'use strict';
	$('#id-input-file-1').fileupload({
        url: uploadFileURL,
        autoUpload: false,
        disableImageResize: /Android(?!.*Chrome)|Opera/
            .test(window.navigator.userAgent),
        previewMaxWidth: 100,
        previewMaxHeight: 100,
        previewCrop: true

    }).on('fileuploadadd', function (e, data) {
    	$('#' + lang.message_id).empty();
		if(data.files[0].size > fileSize*1024)
		{
			showErrorMsg(workSheetLang.js_upload_file_file_size_exceeds_max_size_error_msg,lang.js_message_upload);
			return false;
		}
		if(fileType.indexOf('*') == -1){
			var ext=fileType.split(',');
			var regExp='';
			for (var int = 0; int < ext.length; int++) {
				if(regExp=='')
					regExp += '.'+ext[int];
				else
					regExp+='|'+'.'+ext[int];
			}
		}
		var regex = new RegExp("([a-zA-Z0-9\s_\\.\-:])+(" + regExp + ")$");
		if (fileType.indexOf('*') == -1 && !(regex).test(data.files[0].name)) {

			showErrorMsg(workSheetLang.js_upload_file_upload_valid_file_error_msg, lang.js_message_upload);
			data.files.pop();
		}
		else if(data.files.length>1)
		{
			showErrorMsg(workSheetLang.js_upload_file_upload_only_one_file_error_msg, lang.js_message_upload);
			data.files.pop();
		}
		else
		{
			$('#'+lang.js_message_upload).empty();
			data.context = $('#upload');
			$('#upload').click(function () {
				if(data.files.length==1)
					data.submit();
			});
		}
    }).on('fileuploaddone', function (e, data) {
		if(data.result.status == "success")
		{
			$('#messageId').empty();
			$('#page-error-cntr').empty();
			data.files.pop();
			bootbox.hideAll();
			showSuccess(workSheetLang.js_upload_file_uploaded_success_msg, "messageId");
			//buildFilesTable(data.result.data);
		}
		else{
			if(data.result.Msg)
				showErrorMsg(data.result.Msg);
			else
				showErrorMsg(lang.js_contact_admin, lang.js_message_upload);
		}
    }).on('fileuploadfail', function (e, data) {
    	showErrorMsg(lang.js_file_not_upload, lang.js_message_upload);
    });
	
	
}

function deleteFile(element){
	var  fileName = $(element).attr('name');	
	var data={};
	if(fileName!=null && fileName!='')
	{
		data[req_file_name] = fileName;
	}
	$.ajax({
		url : deleteFileURL,
		cache : false,
		data : data, 
		type : 'post',
		success : function(resp) {
			var html = [];
			$('#messageId').empty();
			$('#page-error-cntr').empty();
			if(resp.status=='success'){
				buildFilesTable(resp.data);
				showSuccess(workSheetLang.js_upload_file_deleted_success_msg, "messageId");
			}
			else
				showErrorMsg(workSheetLang.js_upload_file_deleted_failed_error_msg, "page-error-cntr");
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			if (!isSessionExpired(XMLHttpRequest.responseText)) {
				$('#messageId').empty();
				if (textStatus == "error")
					showErrorMsg(lang.error_sys_admin, "messageId");
			}
		}
	});
}

function buildFilesTable(data){
	var html=[];
	$.each(data,function(index,item){
		var fileName = item.name.substring(item.name.lastIndexOf("/")+1);
		if(fileName.indexOf(".") >= 0){
			html.push('<tr>');
			html.push('	<td><a href="#" rel="downloadFile" fileName="'+fileName+'" name = "'+item.name+'">'+fileName+'</a></td>');
			html.push('	<td>'+getDateFormatForDisplay(item.createdOn)+'</td>');
			html.push('	<td>'+renderOptions(item,fileName)+'</td>');
			html.push('</tr>');
		}
	});
	
	var table = $('#uploadFilesTab');

	if(isDataTable(table[0]))
	{
		table.dataTable().fnClearTable(false);
		table.dataTable().fnDestroy();
	}
	$('#uploadFilesTab tbody').html(html.join(''));
	table.dataTable({
		"iDisplayLength": 20,
		"aLengthMenu": [[10, 20, 25, 50, -1], [10, 20, 25, 50, 100]],
		"aaSorting": [[ 0, "asc" ]]
	});
}

function isDataTable(nTable)
{
    var settings = $.fn.dataTableSettings;
    for (var i=0, iLen=settings.length; i<iLen; i++)
    {
        if ( settings[i].nTable == nTable )
        {
            return true;
        }
    }
    return false;
}


function renderOptions(item,fileName){
	var html=[];
	html.push('<div>');
	//html.push('	<a href="#" rel="userEdit" userId = "'+item.userId+'" userType = "'+item.enterprise+'" firstName = "'+item.firstName+'" lastName = "'+item.lastName+'"  password = "'+item.password+'" email = "'+item.email+'" accountLocked = "'+item.locked+'" admin = "'+item.admin+'" hotelName = "'+item.hotelName+'" class="fa fa-edit">&nbsp;Edit&nbsp;&nbsp;&nbsp;</a>');
	html.push('	<a href="#" rel="deleteFile" fileId = '+item.fileId+' name = "'+item.name+'" class="fa fa-trash-o">&nbsp;Delete&nbsp;&nbsp;&nbsp;</a>');
	//html.push('	<a href="#" rel="userReset" userId = "'+item.userId+'" class="fa fa-clone"><i class="fa fa-files-o">&nbsp;Reset</i></a>');
	html.push('</div>');
		
	return html.join('');
}

function fileDownload(element){
	var  fileName = $(element).attr('name');	
	var data={};
	if(fileName!=null && fileName!='')
	{
		data[req_file_name] = fileName;
	}
	$.fileDownload(
			downloadFileURL,{
			httpMethod: "POST",
	        data : data,
			successCallback: function (url) {
		 		closeLoading();
		    },
		    failCallback: function (html, url) {
		    	closeLoading();
			}
	});
}