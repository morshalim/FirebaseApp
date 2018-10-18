var currentFolderNavigationArray = [];
var currentFolderData = {};
var createFolderPopUp ="";
var removeSelected = "";
var currentCopyFolderData = {};
var currentCopyFolderNavigationArray = [];
var currentCopyFolderId = 0;
var foldersList='';

$(document).ready(function(){
	createFolderPopUp = $('#createNewFolderDialog').html();
	$('#createNewFolderDialog').remove();
	removeSelected = $('#removeSelectedPopUp').html();
	$('#removeSelectedPopUp').remove();
	$('#newFolder').on('click',function(){
		$('#page-error-cntr').empty();
		createFolder();
	});
	$('#removeSelected').on('click',function(){
		$('#page-error-cntr').empty();
		removeFolderPopup();
	});
	$('#uploadPage').on('click',function(){
		var foldersArray = [];
		foldersArray.push(documentLang.jsp_mydocuments_foldername_folders+',0');
		$.each(currentFolderNavigationArray,function(index,item){
				foldersArray.push(item.folderName+','+item.folderId);
		});
		window.location = "EV_VIEW_UPLOAD_FILE.htm?"+req_folder_id+"="+currentFolderId+"&"+req_folder_path+'='+foldersArray.join('~');
	});
	if(folderPath && folderPath !=''){
		populateCurrentFolderNavigationPath(folderPath);
	}
	if(currentFolderId && currentFolderId !=''){
		var obj = {};
		obj.folderId = currentFolderId;
		goInsideFolder(null,obj);
	}else{
		populateFoldersList(documentsMap.folders);
		populateFilesList(documentsMap.files);
		populateNoDataMsg(documentsMap.folders,documentsMap.files);
		populatePath(currentFolderNavigationArray);
	}
	
	$('#selectALL').on('click',function(){
		if($(this).is(':checked'))
			selectAll();
		else
			unSelectAll();
	});
	
	$('#copySelected').on('click',function(){
		copySelected();
	});
	foldersList=documentsMap.folders;
});

function populateFoldersList(folders){
	var folderPath = getFolderPath(currentFolderNavigationArray);
	var folderFullPath = '';
			
	var tbody = [];
	$.each(folders,function(index,item){
		tbody.push('<tr >');
			tbody.push('		<td class="center">');
			tbody.push('			<label class="position-relative">');
			
			if(folderPath=='' || folderPath == undefined)
				folderFullPath = item.folderName;
			else
				folderFullPath = folderPath+'/'+item.folderName;
					
			tbody.push('				<input type="checkbox" name="foldersBox" onclick="bindCheckBoxSelection()" folderId = '+item.folderId+' parentId = '+item.parentId+' folderName = "'+item.folderName+'" folderPath = "'+folderFullPath+'" class="ace">');
			tbody.push('				<span class="lbl"></span>');
			tbody.push('			</label>');
			tbody.push('		</td>');
			tbody.push('		<td></td>');
			tbody.push('<td><i class="fa fa-folder bigger-200 blue" onclick="goInsideFolder(this)" folderId = '+item.folderId+' folderName = "'+item.folderName+'" parentId = '+item.parentId+' folderPath = "'+folderFullPath+'"></i></td>');
			tbody.push('<td><a onclick="goInsideFolder(this)" folderId = '+item.folderId+' folderName = "'+item.folderName+'" parentId = '+item.parentId+' folderPath = "'+folderFullPath+'" href="javascript:;">'+item.folderName+'</a></td>');
			if(item.folderDescription != null)
				tbody.push('<td>'+item.folderDescription+'</td>');
			else
				tbody.push('<td> <span style="font-weight:bold">-</span></td>');
			if(item.modifiedDate != null)
				tbody.push('<td>'+getDateFormatForDisplay(item.modifiedDate)+'</td>');
			else
				tbody.push('<td> <span style="font-weight:bold">-</span></td>');
			if(item.modifiedBy != null)
				tbody.push('<td>'+item.modifiedBy+'</td>');
			else
				tbody.push('<td> <span style="font-weight:bold">-</span></td>');
		tbody.push('</tr>');
	});
	$('#uploadedFolders tbody').html(tbody.join(''));
}

function populateFilesList(files){
	var folderPath = getFolderPath(currentFolderNavigationArray);
	var tbody = [];
	$.each(files,function(index,item){
		var fileFullPath = '';
		if(folderPath=='' || folderPath == undefined)
			fileFullPath = item.uniqueName;
		else
			fileFullPath = folderPath+'/'+item.uniqueName;
		tbody.push('<tr >');
			tbody.push('	<td class="center">');
			tbody.push('	<label class="position-relative">');
			tbody.push('	<input type="checkbox" name="foldersBox" onclick="bindCheckBoxSelection()" fileName = "'+item.name+'" osFileName = "'+item.uniqueName+'" folderId = '+item.folderId+' filePath = "'+fileFullPath+'" fileId = '+item.fileId+' folderId = '+item.folderId+' parentId = '+item.folderId+' folderName = "'+item.folderName+'" class="ace">');
			tbody.push('	<span class="lbl"></span>');
			tbody.push('	</label>');
			tbody.push('	</td>');
			tbody.push('<td><i class="fa fa-star bigger-110 grey"></i></td>');
			var fileTypeImage = '';
			
			var fileType = item.uniqueName.substring(item.uniqueName.indexOf(".") + 1);
			if(item.name== null)
				item.name = item.uniqueName.substring(0, item.uniqueName.indexOf("."));
			if(fileType == 'txt')
				fileTypeImage = 'fa fa-file-text-o bigger-200 blue';
			else if(fileType == 'pdf')
				fileTypeImage = 'fa fa-file-pdf-o bigger-200 blue';
			else if(fileType == 'doc' || fileType == 'docx')
				fileTypeImage = 'fa fa-file-word-o bigger-200 blue';
			else if(fileType == 'xls' || fileType == 'xlsx')
				fileTypeImage = 'fa fa-file-excel-o bigger-200 blue';
			else if(fileType == 'ppt' || fileType == 'pptx')
				fileTypeImage = 'fa-file-powerpoint-o bigger-200 blue';
			else
				fileTypeImage = 'fa fa-file-o bigger-200 blue';
			tbody.push('<td><i class="'+fileTypeImage+'" onclick="fileDownload(this)"  fileId = '+item.fileId+' osFileName = "'+item.name+'" folderId = '+item.folderId+' parentId = '+item.folderId+'></i></td>');
			tbody.push('<td><a onclick="fileDownload(this)"  fileId = '+item.fileId+' osFileName = "'+item.uniqueName+'" folderId = '+item.folderId+' parentId = '+item.parentId+' href="javascript:;">'+item.name+'</a></td>');
			if(item.fileDescription != null)
				tbody.push('<td>'+item.fileDescription+'</td>');
			else
				tbody.push('<td> <span style="font-weight:bold">-</span> </td>');
			if(item.modifiedDate != null)
				tbody.push('<td>'+getDateFormatForDisplay(item.modifiedDate)+'</td>');
			else
				tbody.push('<td> <span style="font-weight:bold">-</span> </td>');
			if(item.modifiedBy != null)
				tbody.push('<td>'+item.modifiedBy+'</td>');
			else
				tbody.push('<td> <span style="font-weight:bold">-</span></td>');
		tbody.push('</tr>');
	});
	$('#uploadedFolders tbody').append(tbody.join(''));
}

function goInsideFolder(ele,obj){
	$('#page-error-cntr').empty();
	currentFolderData = {};
	currentFolderData['folderId'] = $(ele).attr('folderId') || obj.folderId;
	currentFolderData['folderName'] = $(ele).attr('folderName');
	var data = {};	
	data[req_folder_id] = $(ele).attr('folderId') || obj.folderId;
	
	$.ajax({
		url:"EV_GET_FILES_AND_FOLDERS.json",
        data:data,
        method:'POST',
        cache: false,
        success:function(data) {
	        	if (data.status) {
	        		documentsMap = data;
	        		if(currentFolderData.folderId)
	        			currentFolderId = currentFolderData.folderId;
	        		updateCurrentFolder();
	        		populateFoldersList(data.folders);
	        		populateFilesList(data.files);
	        		populateNoDataMsg(data.folders,data.files);
	        		populatePath(currentFolderNavigationArray);
	        		bindCheckBoxSelection();
	        	}else
	        		showErrorMsg(data.status,'page-error-cntr');
			},
		error: function(textStatus, XMLHttpRequest) {
			showErrorMsg(documentLang.jsp_mydocuments_files_folders_error_msg,'page-error-cntr');
		}
	 });
	
	//remove selectall checkbox
	$('#selectALL').removeAttr('checked');
}

function updateCurrentFolder(){
	var avail = false;
	var availIndex = -1;
	if(currentFolderData.folderId != 0){
		$.each(currentFolderNavigationArray, function(index,item){
			if(item.folderId == currentFolderData.folderId){
				avail = true;
				availIndex = index;
				return false;
			}
				
		})
		if(avail){
			if(currentFolderNavigationArray.length > availIndex+1)
				currentFolderNavigationArray = currentFolderNavigationArray.slice(0,availIndex+1);
		}else{
			currentFolderNavigationArray.push(currentFolderData);
		}
	}else
		currentFolderNavigationArray = [];
}

function populatePath(data){
	var path = [];
	path.push('<div class="col-xs-12">');
	path.push('	<ul class="breadcrumb bigger-110">');
	path.push('		<li>');
	path.push('			<i class="ace-icon fa fa-folder blue"></i>&nbsp;&nbsp;');
	path.push('		<a href="javascript:;" folderId = "0" onclick="goInsideFolder(this)"> Folders</a>');
	path.push('	</li>');
	$.each(data,function(index,item){
		path.push('	<li>');
		if(data.length -1 == index)
			path.push(item.folderName);
		else	
			path.push('	<a href="javascript:;" folderId = '+item.folderId+' onclick="goInsideFolder(this)">'+item.folderName+'</a>');
		path.push('	</li>');
	});
	path.push('</ul>');
	path.push('</div>');

	$('#filePath').html(path.join(''));
}

function fileDownload(element){
	$('#page-error-cntr').empty();
	var  fileName = getFileKeyPath()+$(element).attr('osFileName');	
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
function getFileKeyPath(){
	var path = '';
	$.each(currentFolderNavigationArray,function(index,item){
		if(index > 0)
			path = path+"/";
			path = path+item.folderName;
	});
	path = path != ''?path+'/':path;
	return path;
}
function createFolder(){
	bootbox.dialog({
		message: createFolderPopUp,
		title: documentLang.jsp_mydocuments_create_new_folder,
		buttons:			
		{
			success: {
				label: documentLang.jsp_mydocuments_add_btn,
				className: "btn-success",
				callback: function() {
				if(validation())
					saveFolder();
				else
					return false;
			}
			},
			danger: {
				label: documentLang.jsp_mydocuments_cancel_btn,
				className: "btn-default"
			}
										
		}
	});
}
function validation(){
	var valid = true;
	if($('#folderName').val()==null || $('#folderName').val()==""){
		showErrorMsg(documentLang.jsp_mydocuments_folder_name_is_requried,"messageCreate");
		valid = false;
	}
	if(valid){
		if(isFolderExist($('#folderName').val())){
			showErrorMsg(documentLang.js_folder_name_exist,"messageCreate");
			valid = false;
		}
	}
	return valid;
}
function saveFolder(){
	var data = {};
	var folderName = $('#folderName').val();
	var describeFolder = $('#describeFolderContent').val();
	data[req_folder_name] =folderName;
	data[req_folder_describe] =describeFolder
	data[req_parent_id] = currentFolderId;
	data[req_source_folder_path] = getFileKeyPath();
	
	$.ajax({
		url:"EV_SAVE_FOLDER.json",
		data: data,
		success: function(data){
			if(data.success = "success"){
				documentsMap = data;
				populateFoldersList(data.folders);
				if(currentFolderId == 0)
					foldersList = data.folders;
        		populateFilesList(data.files);
        		populateNoDataMsg(data.folders,data.files);
				showSuccess(documentLang.jsp_mydocuments_folder_added_successfully,"page-error-cntr");
				bootbox.hideAll();
			}
		},
		error:function(request,status,error){
			showErrorMsg("ERROR",'page-error-cntr');
		}
	});
}

function removeFolderPopup(){
	
	bootbox.dialog({
		message:removeSelected, 
			buttons:{
				"success" :
				{
					"label" : documentLang.jsp_mydocuments_ok_btn,
					"className" : "btn btn-sm btn-primary",
					"callback": function() {
						removeSelectedItem();
					}
				}, 
				"danger" :
				{
					"label" :  documentLang.jsp_mydocuments_cancel_btn,
					"className" : "btn btn-sm",
					"callback": function() {
						$("#modal-proxy-remove-approve").modal('hide');
					}
				}
			}
		});
}

function removeSelectedItem(){
	var data = {};
	var result = deletefolder();
	data[req_selected_to_delete] = result;
	$.ajax({
        url:"EV_REMOVE_FILE.json",
        data:data,
        type:"POST",
        success: function(data){
        	if(data.status == "success"){
        		documentsMap = data;
        		populateFoldersList(data.folders);
        		if(currentFolderId == 0)
        			foldersList = data.folders;
        		populateFilesList(data.files);
        		populateNoDataMsg(data.folders,data.files);
        		if(data.msg)
        			showErrorMsg(data.msg);
        		else
        			showSuccess(documentLang.js_folder_removed_successfully);
        		bootbox.hideAll();
        		bindCheckBoxSelection();
        	}else{
        		var msg = data.msg;
        		if(!msg)
        			msg = documentLang.thx_resource_js_error_deleting_file_or_folder
        		showErrorMsg(msg);
        	}
		},
		error:function(request,status,error){
			showErrorMsg(documentLang.thx_resource_js_error_deleting_file_or_folder);
		}
	 });
}

function deletefolder()
{
	var dataarray = [];
	$('input[type=checkbox][name=foldersBox]:checked').each(function(){		
		
			var recArray = []; 
			var input = $(this);
			var folderId = input.attr('folderId');
			var fileId = input.attr('fileId');
			var parentId = input.attr('parentId');
			var folderName = getFileKeyPath();
			if(fileId == undefined || fileId == '')
				folderName = getFileKeyPath()+input.attr('folderName')+"/";
			var fileName = input.attr('osFileName');
			recArray.push(folderId);
			recArray.push(fileId);
			recArray.push(parentId);
			recArray.push(folderName);
			recArray.push(fileName);
			if(fileId && fileId != '')
				recArray.push(true);
			else
				recArray.push(false);
			dataarray.push(recArray.join('~'));
		
	});
	return dataarray.join(';');
}

function bindCheckBoxSelection()
{    
    if($('input[name=foldersBox]:checkbox:checked').length > 0){
        $('#removeSelected').removeAttr('disabled');
        $('#copySelected').removeAttr('disabled');
    }
    else{
        $('#removeSelected').attr('disabled', 'disabled');
        $('#copySelected').attr('disabled', 'disabled');
    }
}
function populateCurrentFolderNavigationPath(folderPath){
	currentFolderNavigationArray = [];
	var foldersArray = folderPath.split('~');
	$.each(foldersArray,function(index,item){
		var itemData = item.split(',');
		if(itemData[1] != '0'){
			
			var data = {};
			data.folderId = itemData[1];
			data.folderName = itemData[0];
			currentFolderNavigationArray.push(data);
		}
	});
}
function populateNoDataMsg(folder,files){
	if(folder.length==0 && files.length==0){
		$('#uploadedFolders').hide();
		$('#noDataFound').html('<p class="alert alert-info">'+documentLang.js_folder_files_folder_not_present+'</p>');
	}else{
		$('#uploadedFolders').show();
		$('#noDataFound').html('');
	}
}

function isFolderExist(folderName){
	var folders  = documentsMap.folders;
	var exist = false;
	if(folders){
		$.each(folders,function(index,item){
			if(folderName == item.folderName){
				exist = true;
				return false;
			}
		});
	}
	return exist;
}
function selectAll(){
	$('input[name=foldersBox]:not(":disabled")').each(function(){
		$(this).prop('checked',true);
	});
	bindCheckBoxSelection();
}

function unSelectAll(){
	$('input[name=foldersBox]').each(function(){
		$(this).removeAttr('checked');
	});
	bindCheckBoxSelection();
}

function copySelected(){
	currentCopyFolderNavigationArray = [];
	var htmlMsg = buildcopySelectedPopup();
	bootbox.dialog({
		message: htmlMsg,
		title: documentLang.js_popup_copy_folder_title,
		buttons:			
		{
			success: {
				label: "Save",
				className: "btn-success save-btn",
				callback: function() {
					if(validateCopyFolders()){
						var sourceFolderPath = [];
						var sourceParentId =-1;
						$('input[name=foldersBox]:checked').each(function(){
							var isFile = false;
							var fileId = $(this).attr('fileId');
							var path = '';
							if( fileId != null && fileId !='')
								isFile = true
							var sourceData = []; 
							if(isFile){
								sourceData.push($(this).attr('filePath'));
								sourceData.push(fileId);
							}else{
								sourceData.push($(this).attr('folderPath'));
								sourceData.push($(this).attr('folderId'));
							}
							sourceParentId = $(this).attr('parentid');
							sourceData.push(isFile);
							sourceFolderPath.push(sourceData.join(','));
						});
						var sourceFolderPath = sourceFolderPath.join('~');
						var destinationFolderPath = $('input[name=foldersRadio]:checked').attr('folderPath');
						var destinationFolderId = $('input[name=foldersRadio]:checked').attr('folderId');
						var data = {};
						data[req_source_folder_path] = sourceFolderPath;
						data[req_destination_folder_path] = destinationFolderPath;
						data[req_src_parent_id] = sourceParentId;
						data[req_dest_folder_id] = destinationFolderId;
						checkFilesOrFoldersExist(data);
					}else
						return false;
					
				}
			},
			danger: {
				label: "Cancel",
				className: "btn-default"
			}
										
		}
	});
	copySelectedMsg(foldersList);
	enableDisableSaveBtn();
	bindRadioBtn();
	populateCopyFolderPath(currentCopyFolderNavigationArray);
}

function copyFilesAndFolders(data){
	$.ajax({
		url:"EV_COPY_FILES_AND_FOLDERS.json",
        data:data,
        method:'POST',
        cache: false,
        success:function(data) {
        	continueLoading = false;
	        	if (data.status) {
	        		console.log('data : '+data);
	        		$('input[name=foldersBox]:checked').removeAttr('checked');
	        		showSuccess(documentLang.js_folder_copied_successfully,'page-error-cntr');
	        	}else
	        		showErrorMsg(documentLang.js_folder_copied_failed,'page-error-cntr');
			},
		error: function(textStatus, XMLHttpRequest) {
			showErrorMsg(documentLang.js_folder_copied_failed,'page-error-cntr');
		}
	 });
}

function checkFilesOrFoldersExist(param){
	$.ajax({
		url:"EV_CHECK_FILE_OR_FOLDER_EXIST.json",
        data:param,
        method:'POST',
        cache: false,
        success:function(data) {
	        	if (data.exist) {
	        		console.log('data : '+data);
	        		buildExistList(data.existList,param);
	        	}else{
	        		continueLoading = true;
	        		copyFilesAndFolders(param);
	        	}
			},
		error: function(textStatus, XMLHttpRequest) {
			showErrorMsg(documentLang.js_folder_copied_failed,'page-error-cntr');
		}
	 });
}

function buildExistList(existList,param){

	var html = [];
	html.push('<div id ="copySelectedPopUp"">');
	html.push('		<p>'+documentLang.js_file_folders_exist_message+'</p>');
	html.push('		<div class ="row-fluid">');
	html.push('		<table class="table table-striped  table-hover" width="100%">');
	html.push('			<tbody>');
	$.each(existList,function(index,item){
		html.push('<tr >');
			html.push('<td>'+item.path+'</td>');
		html.push('</tr>');
	});
	html.push('</tbody>');
	html.push('</table>');
	html.push('	</div>');
	html.push('	</div>');
	bootbox.dialog({
		message: html.join(''),
		title: documentLang.js_file_folders_exist_popup_title,
		buttons:			
		{
			success: {
				label: documentLang.jsp_mydocuments_ok_btn,
				className: "btn-success save-btn",
				callback: function() {
					param['existList'] = JSON.stringify(existList);
					copyFilesAndFolders(param);
				}
			},
			danger: {
				label: documentLang.jsp_mydocuments_cancel_btn,
				className: "btn-default"
			}
										
		}
	});
	
}
function buildcopySelectedPopup(){
	var html=[];
	html.push('<div id ="copySelectedPopUp"">');
	html.push('	<div id="errorMessage"></div>');
	html.push('	<div class="row" id = "copyFilePath"></div>');
	html.push('	<div class="space-6"></div>');
	html.push('	<div class ="row-fluid">');
	html.push('		<table id="copyFolders" class="table table-striped  table-hover" width="100%">');
	html.push('			<thead>');
	html.push('				<tr>');
	html.push('					<th style="width:20px" class="center"></th>');
	html.push('					<th style="width:20px"></th>');
	html.push('					<th style="width:20px"></th>');
	html.push('					<th>'+documentLang.jsp_mydocuments_name_table_header+'</th>');
	html.push('					<th>'+documentLang.jsp_mydocuments_description_header+'</th>');
	html.push('				</tr>');
	html.push('			</thead>');
	html.push('			<tbody></tbody>');
	html.push('		</table>');
	html.push('		<div id="copyFoldersNoDataFound"></div>');
	html.push('	</div>');
	html.push('</div>');

	return html.join('');
}

function bindRadioBtn(){
	$('input[name=foldersRadio]').on('change',function(){
		enableDisableSaveBtn();
	});
}

function enableDisableSaveBtn(){
	if($('input[name=foldersRadio]:checked').length > 0)
		$('.save-btn').removeAttr('disabled');
	else
		$('.save-btn').attr('disabled',true);
}

function validateCopyFolders(){
	if($('input[name=foldersBox]:checked').length == 0){
		showErrorMsg(documentLang.js_please_select_folder_to_copy,'errorMessage');
		return false;
	}/*else if($('input[name=foldersBox]:checked').length > 1){
		showErrorMsg('Please Select only one Checkbox','errorMessage');
		return false;
	}*/else if($('input[name=foldersRadio]:checked').length == 0){
		showErrorMsg(documentLang.js_please_select_dest_folder,'errorMessage');
		return false;
	}else
		return true;
}

function copySelectedMsg(folders){
	populateCopyFoldersList(folders);
}

function goInsideCopyFolder(ele,obj){
	currentCopyFolderData = {};
	currentCopyFolderData['folderId'] = $(ele).attr('folderId') || obj.folderId;
	currentCopyFolderData['folderName'] = $(ele).attr('folderName');
	var data = {};	
	data[req_folder_id] = $(ele).attr('folderId') || obj.folderId;
	
	$.ajax({
		url:"EV_GET_FILES_AND_FOLDERS.json",
        data:data,
        method:'POST',
        cache: false,
        success:function(data) {
	        	if (data.status) {
	        		if(currentCopyFolderData.folderId)
	        			currentCopyFolderId = currentCopyFolderData.folderId;
	        		updateCopyFoldersCurrentFolder();
	        		populateCopyFoldersList(data.folders);
	        		populatecopyFoldersNoDataMsg(data.folders);
	        		populateCopyFolderPath(currentCopyFolderNavigationArray);
	        		enableDisableSaveBtn();
	        		bindRadioBtn();
	        	}else
	        		showErrorMsg(data.status,'page-error-cntr');
			},
		error: function(textStatus, XMLHttpRequest) {
			showErrorMsg(documentLang.jsp_mydocuments_files_folders_error_msg,'page-error-cntr');
		}
	 });
	
	//remove selectall radio button
	$('#foldersRadio').removeAttr('checked');
}

function populateCopyFolderPath(data){
	var path = [];
	path.push('<div class="col-xs-12">');
	path.push('	<ul class="breadcrumb bigger-110">');
	path.push('		<li>');
	path.push('			<i class="ace-icon fa fa-folder blue"></i>&nbsp;&nbsp;');
	path.push('		<a href="javascript:;" folderId = "0" onclick="goInsideCopyFolder(this)"> Folders</a>');
	path.push('	</li>');
	$.each(data,function(index,item){
		path.push('	<li>');
		if(data.length -1 == index)
			path.push(item.folderName);
		else	
			path.push('	<a href="javascript:;" folderId = '+item.folderId+' onclick="goInsideCopyFolder(this)">'+item.folderName+'</a>');
		path.push('	</li>');
	});
	path.push('</ul>');
	path.push('</div>');

	$('#copyFilePath').html(path.join(''));
}

function getFolderPath(data){
	var path = [];
	$.each(data,function(index,item){
		path.push(item.folderName);
	});
	
	return path.join('/');
}

function populateCopyFoldersList(folders){
	var folderPath = getFolderPath(currentCopyFolderNavigationArray);
	var folderFullPath = '';
	var tbody = [];
	$.each(folders,function(index,item){
		tbody.push('<tr >');
			tbody.push('		<td class="center">');
			tbody.push('			<label class="position-relative">');
			
			if(folderPath=='' || folderPath == undefined)
				folderFullPath = item.folderName;
			else
				folderFullPath = folderPath+'/'+item.folderName;
				
			tbody.push('				<input type="radio" name="foldersRadio" folderId = '+item.folderId+' parentId = '+item.parentId+' folderName = "'+item.folderName+'" folderPath = "'+folderFullPath+'" class="ace">');
			tbody.push('				<span class="lbl"></span>');
			tbody.push('			</label>');
			tbody.push('		</td>');
			tbody.push('		<td></td>');
			tbody.push('<td><i class="fa fa-folder bigger-200 blue" onclick="goInsideCopyFolder(this)" folderId = '+item.folderId+' folderName = "'+item.folderName+'" parentId = '+item.parentId+' folderPath = "'+folderFullPath+'"></i></td>');
			tbody.push('<td><a onclick="goInsideCopyFolder(this)" folderId = '+item.folderId+' folderName = "'+item.folderName+'" parentId = '+item.parentId+' folderPath = "'+folderFullPath+'" href="javascript:;">'+item.folderName+'</a></td>');
			if(item.folderDescription != null)
				tbody.push('<td>'+item.folderDescription+'</td>');
			else
				tbody.push('<td> <span style="font-weight:bold">-</span></td>');
		tbody.push('</tr>');
	});
	$('#copyFolders tbody').html(tbody.join(''));
}

function populatecopyFoldersNoDataMsg(folder){
	if(folder.length==0){
		$('#copyFolders').hide();
		$('#copyFoldersNoDataFound').html('<p class="alert alert-info">Folders are not present</p>');
	}else{
		$('#copyFolders').show();
		$('#copyFoldersNoDataFound').html('');
	}
}

function updateCopyFoldersCurrentFolder(){
	var avail = false;
	var availIndex = -1;
	if(currentCopyFolderData.folderId != 0){
		$.each(currentCopyFolderNavigationArray, function(index,item){
			if(item.folderId == currentCopyFolderData.folderId){
				avail = true;
				availIndex = index;
				return false;
			}
				
		})
		if(avail){
			if(currentCopyFolderNavigationArray.length > availIndex+1)
				currentCopyFolderNavigationArray = currentCopyFolderNavigationArray.slice(0,availIndex+1);
		}else{
			currentCopyFolderNavigationArray.push(currentCopyFolderData);
		}
	}else
		currentCopyFolderNavigationArray = [];
}