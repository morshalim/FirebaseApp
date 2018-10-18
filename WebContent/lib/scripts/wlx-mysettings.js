var resultProxyEdit = "";
var removeProxyConfirm = "";
$(function() {
	getInboxTableData(proxyDelegateList);
	resultProxyEdit = $('#proxyEditform').html();
	$('#proxyEditform').remove();

	document.onkeydown = function(evt) {
	    evt = evt || window.event;
	    if (evt.keyCode == 27) {
			var isFancyBox = $('.modal-body').is(':visible');
			if(isFancyBox){
				var isCloseButtonAvailable = $('button[rel=close]').is(":visible");
				if(isCloseButtonAvailable){
					var elemId = $('button[rel=close]').attr('id');
					$('#'+elemId).click();
				}
			}
	    }
	};
	
	removeProxyConfirm = $('#modal-proxy-remove-approve').html();
	$('#modal-proxy-remove-approve').remove();
	
});

function showSection(section, tab) {
	
	
	//Hide Everything
	$("#delegate_tab").removeClass('active');
	$("#roles_tab").removeClass('active');
	
	$(tab).addClass('active')
	
	$("#delegate_view").addClass('hidden');
	$("#roles_view").addClass('hidden');
	
	//Toggle Section On
	$(section).toggleClass('hidden');

	if(section == "#roles_view" && $('#rolesTableTbody').html() == "")
		getRoles();
	
}

function updateDate(){
	$('#messageId').html('');
	updateProxyRecord();
}

function getInboxTableData(settingsList)
{
	if(settingsList)
	{
		var html = [];
		var elem;
		var empId;
		var proxyId;
		for(var i=0; i<settingsList.length; i++)
		{
			elem = settingsList[i];
			empId = elem.empId;
			proxyId = elem.proxyId;
			html.push('<tr>');
			//if(!isProxyDelegate)
				html.push('	<td>'+elem.firstName+' '+elem.lastName+'</td>');
			//else
			//	html.push('	<td><a href="#" onclick="ProxyNotification(this)" proxyId='+elem.proxyId+' empId='+elem.empId+' empFirstName='+elem.firstName+' empLastName='+elem.lastName+'>'+elem.firstName+' '+elem.lastName+'</td></a>');
			html.push('	<td>'+elem.positionTitle+'</td>');
			html.push('	<td>'+elem.stDate+'</td>');
			html.push('	<td>'+elem.enDate+'</td>');
			html.push('	<td><a id="editProxy" onclick="showEditProxy(this)" ftName="'+elem.firstName+'" ltName="'+elem.lastName+'" stDate="'+elem.stDate+'" enDate="'+elem.enDate+'" empId="'+empId+'" proxyId="'+proxyId+'" href="#"><i class="fa fa-edit"> '+langMap.proxy_delegate_link_text_edit+'</i>&nbsp;</a>&nbsp;&nbsp;<a href="#" id="removeProxy" onclick="removeProxyRecord(this)" empId="'+empId+'" proxyId="'+proxyId+'"><i class="fa fa-trash"> '+langMap.proxy_delegate_link_text_remove+'</i></a></td>');
			html.push('</tr>');
		}

		

		var table = $('#direct-reports-table-cntr');

		if(isDataTable(table[0]))
		{
			table.dataTable().fnClearTable(false);
			table.dataTable().fnDestroy();
		}
		$('#direct-reports-table-cntr tbody').html(html.join(''));
		table.dataTable({
			"iDisplayLength": 20,
    		"aLengthMenu": [[10, 20, 25, 50, -1], [10, 20, 25, 50, 100]],
			"aoColumns": [
				null, null, null, null,
				{ "bSortable": false,
					"bVisible": true}
			],"oLanguage": dataTableLang
			
		});
	}
}

function showErrorInProxyDelegate(settingsList, msgId){
	var msg = "";
	for(var i=0; i<settingsList.length; i++)
	{
		msg = settingsList[i] + '<br/>';
	}

	var mesId = msgId || langMap.proxy_delegate_message_id;
	showError(msg, mesId);
}

function searchProxyForEmployee(){
	$('#messageId').html('');
	var searchValue = $('#form-field-1').val();
	if(searchValue!=null && searchValue!="") {
		var data = {};
		data[req_emp_search_text] = searchValue;
		 $.ajax({
		        url:getSearchProxy,
		        data: data,
		        cache: false,
		        async : false,
		        success: buildProxy,
				error: searchProxyError
		 });
	} else {
		$('#searchProxyTableBody').html('<tr><td colspan="3">'+langMap.proxy_delegate_table_content_no_items+'</td></tr>');
		return false;
	}
}

function buildProxy(data, textStatus, XMLHttpRequest)
{
	$('#messageId').html('');
	if(data)
	{
		var html = [];
		var elem;
		var firstName = "";
		var lastName = "";
		var isRenderName = false;
		for(var i=0; i<data.length; i++)
		{
			elem = data[i];
			firstName = elem.firstName || '';
			lastName = elem.lastName || '';
			if("null"!=delegateEmpId && ""!= delegateEmpId){
				if(delegateEmpId == elem.empId){
					isRenderName = true;
				}
			}
			if(!isRenderName)
			{
				html.push('<tr>');
				html.push('	<td><a href="#" onclick="setEmpStartDate(this)" empFirstName='+firstName+' empLastName='+lastName+' proxyId='+elem.empId+' clientId='+elem.clientId+'>'+firstName+' '+lastName+'</a></td>');
				html.push('	<td>'+elem.positionTitle || ""+'</td>');
				html.push('	<td>'+elem.managerName || ""+'</td>');
				html.push('</tr>');
			}
			isRenderName = false;
		}
		

		var table = $('#srchresEmployee');

		if(isDataTable(table[0]))
		{
			table.dataTable().fnClearTable(false);
			table.dataTable().fnDestroy();
		}
		$('#searchProxyTableBody').html(html.join(''));
		table.dataTable({
			"iDisplayLength": 20,
    		"aLengthMenu": [[10, 20, 25, 50, -1], [10, 20, 25, 50, 100]],
			"aoColumns": [
				null, null, null
			],
			"oLanguage": dataTableLang
		});
	} else {
		var html = [];
		html.push('<tr>');
		html.push('<td colspan="3">'+langMap.proxy_delegate_table_content_no_items+'</td>');
		html.push('</tr>');
		$('#searchProxyTableBody').html(html.join(''));
	}
}

function setEmpStartDate(element){
	$('#messageId').html('');
	$("#searchField").remove();
	$('#srchresEmployee_wrapper').remove();
	$("#dateselEmployee").show();
	$("#dateselEmployee").after('<br><br><br>');
	$("#save").show();
	
	var proxyId = "";$(element).attr('proxyId');
	var firstName = "";$(element).attr('empFirstName') || '';
	var lastName = "";$(element).attr('empLastName') || '';
	var startTodayDate = new Date();
	var endOneWeekDate = new Date();
	startTodayDate = (startTodayDate.getMonth()+1) +langMap.text_date_separator+ startTodayDate.getDate() +langMap.text_date_separator+ startTodayDate.getFullYear();
	endOneWeekDate.addWeeks(2);
	endOneWeekDate = (endOneWeekDate.getMonth()+1) +langMap.text_date_separator+ endOneWeekDate.getDate() +langMap.text_date_separator+ endOneWeekDate.getFullYear();
	$('#empName').html(firstName+' '+lastName);
	$('#authorizeStartDate').val(startTodayDate);
	$('#authorizeEndDate').val(endOneWeekDate);
	$("#save").attr('proxyId', proxyId);
	$('#save').attr('empSaveName',firstName+' '+lastName);
	$('#authorizeStartDateCal,#authorizeStartDate').click(function(){
	
		$('#authorizeStartDate').datepicker('show');
		$('div.datepicker.datepicker-dropdown.dropdown-menu').css('z-index','2000');
		$('#authorizeStartDate').datepicker("setDate", $('#authorizeStartDate').val());
	});
	$('#authorizeEndDateCal,#authorizeEndDate').click(function(){
		$('#authorizeEndDate').datepicker('show');
		$('div.datepicker.datepicker-dropdown.dropdown-menu').css('z-index','2000');
		$('#authorizeEndDate').datepicker("setDate", $('#authorizeEndDate').val());
	});
}

function saveProxy(element){
	$('#messageId').html('');
	var data = {};
	//if("null"!=delegateEmpId && ""!= delegateEmpId)
	//	data[req_delegate_emp_id] = delegateEmpId;
	data[req_proxy_id] = $('#delegateEmpSearch').attr('empId');
	data[req_emp_start_date] = $('#authorizeStartDate').val();
	data[req_emp_end_date] = $('#authorizeEndDate').val();
	$.ajax({
        url:saveProxyURL,
        data:data,
        cache: false,
        async : false,
        success: function(data, textStatus, XMLHttpRequest){
        	saveProxySuccess(data, textStatus, XMLHttpRequest, element);
        },
		error: saveProxyError
	 });
}

function saveProxySuccess(dataMap, textStatus, XMLHttpRequest, elem){
	var startDate = $('#authorizeStartDate').val() || '';
	var endDate = $('#authorizeEndDate').val() || '';
	var msg = "";
	var empName = $('#delegateEmpSearch').val().split(',')[0];

	var data;
	if(dataMap.status==true){
		data = dataMap.settingsList;
		getInboxTableData(data);
		$("#closeSaveProxy").click();
		var proxyFrom='';
		/*if("null"!=delegateEmpId && ""!= delegateEmpId)
			proxyFrom = langMap.delegate_management_from;
		/*else*/
			proxyFrom = langMap.proxy_delegate_proxy_from;
			
		var	proxyDelegateFullName = "";
		msg = langMap.proxy_delegate_you_have_authorized+' '+empName+' '+langMap.proxy_delegate_to_be_your_proxy_from +' '+(proxyDelegateFullName !="" ? proxyDelegateFullName+langMap.proxy_apostrophe_s : " your") +' '+proxyFrom+' '+startDate+' '+langMap.proxy_delegate_to+' '+endDate+'.';
		/*bootbox.dialog(msg, [{
		    "label" : "OK",
		    "callback": function() {
		    	getInboxTableData(data);
		    	if("null"!=delegateEmpId && ""!= delegateEmpId)
		    		showSuccess(langMap.proxy_delegate_delegate_save_success, langMap.proxy_delegate_message_id);
		    	else
		    		showSuccess(langMap.proxy_delegate_save_success, langMap.proxy_delegate_message_id);
		    }
		}]);*/
		
		bootbox.dialog({message:msg, 
			buttons:{
				"success" :
				{
					"label" :  langMap.crt_bootbox_ok,
					"className" : "btn btn-sm btn-primary",
					"callback": function() {
						getInboxTableData(data);
						//if("null"!=delegateEmpId && ""!= delegateEmpId)
							showSuccess(langMap.proxy_delegate_delegate_save_success, langMap.proxy_delegate_message_id);
						//else
						//	showSuccess(langMap.proxy_delegate_save_success, langMap.proxy_delegate_message_id);
					}
				}
			}
		});
	} else {
		data = dataMap.errorMessage;
		showError(data, langMap.proxy_delegate_message_save);
	}

}

function saveProxyError(XMLHttpRequest, textStatus, errorThrown)
{
	if(ECM_DEBUG)$.log ("START saveEmpBudgetMgmtError");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " errorThrown: " + JSON.stringify(errorThrown));
	if(ajaxPreProcess(errorCode))
		return;
	if(ECM_DEBUG)$.log ("END saveEmpBudgetMgmtError");
	showError(JSON.stringify(errorThrown), langMap.proxy_delegate_message_save);
}

function searchProxyError(XMLHttpRequest, textStatus, errorThrown)
{
	showError(langMap.error_sys_admin,langMap.proxy_delegate_message_save);
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

function removeProxyRecord(element){
	$('#messageId').html('');
	/*bootbox.confirm(langMap.proxy_delegate_remove_proxy_confirm, function(result) {
		if(result) {
			var data = {};
			data[req_emp_id] = $(element).attr('empId');
			data[req_proxy_id] = $(element).attr('proxyId');
			$.ajax({
		        url:removeProxyURL,
		        data:data,
		        cache: false,
		        async : false,
		        success: removeProxySuccess,
				error: removeProxyError
			 });
		}

	});*/
	
	/*bootbox.dialog(removeProxyConfirm, [{
	    "label" :  langMap.crt_bootbox_ok,
	    "class" : "btn-primary",
	    "callback": function() {
	    	var data = {};
	    	if("null"!=delegateEmpId && ""!= delegateEmpId)
	    		data[req_delegate_emp_id] = delegateEmpId;
			data[req_emp_id] = $(element).attr('empId');
			data[req_proxy_id] = $(element).attr('proxyId');
			$.ajax({
		        url:removeProxyURL,
		        data:data,
		        cache: false,
		        async : false,
		        success: removeProxySuccess,
				error: removeProxyError
			 });
	    }
	}, {
		"label" :  langMap.crt_bootbox_cancel,
	    "class" : "btn",
	    "callback": function() {
	    	$("#modal-proxy-remove-approve").modal('hide');
	    }
	}]);*/
	
	bootbox.dialog({message:removeProxyConfirm, 
			buttons:{
				"success" :
				{
					"label" :  langMap.crt_bootbox_ok,
					"className" : "btn btn-sm btn-primary",
					"callback": function() {
						var data = {};
						//if("null"!=delegateEmpId && ""!= delegateEmpId)
						//	data[req_delegate_emp_id] = delegateEmpId;
						data[req_emp_id] = $(element).attr('empId');
						data[req_proxy_id] = $(element).attr('proxyId');
						$.ajax({
							url:removeProxyURL,
							data:data,
							cache: false,
							async : false,
							success: removeProxySuccess,
							error: removeProxyError
						 });
					}
				}, 
				"danger" :
				{
					"label" :  langMap.crt_bootbox_cancel,
					"className" : "btn btn-sm",
					"callback": function() {
						$("#modal-proxy-remove-approve").modal('hide');
					}
				}
			}
		});
}

function removeProxySuccess(dataMap, textStatus, XMLHttpRequest)
{
	var data;
	if(dataMap.status==true){
		data = dataMap.settingsList;
		getInboxTableData(data);
		//if("null"!=delegateEmpId && ""!= delegateEmpId)
    	//	showSuccess(langMap.proxy_delegate_delegate_remove_success, langMap.proxy_delegate_message_id);
		//else
			showSuccess(langMap.proxy_delegate_remove_success,langMap.proxy_delegate_message_id);
	} else {
		data = dataMap.errorMessage;
		showError(data, langMap.proxy_delegate_message_id);
	}
}

function removeProxyError(XMLHttpRequest, textStatus, errorThrown)
{
	showError(langMap.error_sys_admin, langMap.message_id);
}

function showEditProxy(element){
	$('#messageId').html('');
	var empId = $(element).attr('empId');
	var proxyId = $(element).attr('proxyId');
	var startDate = $(element).attr('stDate') || '';
	var endDate = $(element).attr('enDate') || '';
	var firstName = $(element).attr('ftName') || '';
	var lastName = $(element).attr('ltName') || '';
	bootbox.dialog({message:resultProxyEdit,
		title: langMap.proxy_edit_dialog_title,
		buttons:			
		{
			success: {
				label: langMap.proxy_dialog_authorize,
				className: "btn-success",
				callback: updateDate
			},
			danger: {
				label: langMap.proxy_dialog_close,
				className: "btn-default"
			}
										
		}
		});
	
	$('#startDate').datepicker({
		autoclose: true,
		todayHighlight: true
	});
	$('#endDate').datepicker({
		autoclose: true,
		todayHighlight: true
	});
	
	$('#delegateName').html(firstName+' '+lastName);
	$('#startDate').val(getDateFormatForDisplay(startDate));
	$('#endDate').val(getDateFormatForDisplay(endDate));
	$('#updateDateButton').attr('employeeId', empId);
	$('#updateDateButton').attr('employeeProxyId', proxyId);
	$('#updateDateButton').attr('curStartDate', startDate);
	$('#updateDateButton').attr('curEndDate', endDate);
	$('#modifyStartDateCal,#startDate').click(function(){
		$('#startDate').datepicker('show');
		$('div.datepicker.datepicker-dropdown.dropdown-menu').css('z-index','2000');
		$('#startDate').datepicker("setDate", $('#startDate').val());
	});
	$('#modifyEndDateCal,#endDate').click(function(){
		$('#endDate').datepicker('show');
		$('div.datepicker.datepicker-dropdown.dropdown-menu').css('z-index','2000');
		$('#endDate').datepicker("setDate", $('#endDate').val());
	});
}

function updateProxyRecord(){
	$('#messageId').html('');
	var data = {};
	data[req_emp_id] = $('#updateDateButton').attr('employeeId');
	data[req_proxy_id] = $('#updateDateButton').attr('employeeProxyId');
	data[req_emp_start_date] = $('#startDate').val();
	data[req_emp_end_date] = $('#endDate').val();
	data[req_emp_cur_start_date] = $('#updateDateButton').attr('curStartDate');
	data[req_emp_cur_end_date] = $('#updateDateButton').attr('curEndDate');
	
	$.ajax({
        url:editProxyURL,
        data:data,
        cache: false,
        async : false,
        success: editProxySuccess,
		error: editProxyError
	 });
}

function editProxySuccess(dataMap, textStatus, XMLHttpRequest)
{
	var data;
	if(dataMap.status==true){
		data = dataMap.settingsList;
		$("#closeEditProxy").click();
		getInboxTableData(data);
		showSuccess(langMap.proxy_delegate_update_success,langMap.proxy_delegate_message_id);
	} else {
		data = dataMap.errorMessage;
		showError(data, langMap.proxy_delegate_message_edit);
	}
}

function editProxyError(XMLHttpRequest, textStatus, errorThrown)
{
	showError(langMap.error_sys_admin,langMap.proxy_delegate_message_edit);
}


function getRoles(){
	$('#messageId').html('');
	var data = {};
	
	$.ajax({
        url:getMyRolesURL,
        data:data,
        cache: false,
        async : false,
        success: getMyRolesSuccess,
		error: getMyRolesError
	 });
}

function getMyRolesSuccess(dataMap, textStatus, XMLHttpRequest)
{
	setupMyRoles(dataMap);
}

function getMyRolesError(XMLHttpRequest, textStatus, errorThrown)
{
	showError(langMap.error_sys_admin,langMap.error_occ_fetching_list_of_roles);
}

function setupMyRoles(data) 
{
	if(data)
	{
		var html = [];
		for(var i=0; i<data.length; i++)
		{
			var elem = data[i];
			html.push('<tr>');
			html.push('	<td id="' + elem.roleId + '">'+elem.roleName+'</td>');
			//html.push('	<td>'+((elem.createdDate != null)?getDateFormatForDisplay(elem.createdDate):"")+'</td>');
			html.push('</tr>');
		}

		

		var table = $('#rolesTable');

		if(isDataTable(table[0]))
		{
			table.dataTable().fnClearTable(false);
			table.dataTable().fnDestroy();
		}
		$('#rolesTable tbody').html(html.join(''));
		table.dataTable({
			"iDisplayLength": 20,
    		"aLengthMenu": [[10, 20, 25, 50, -1], [10, 20, 25, 50, 100]],
			"aoColumns": [
				null
			],"oLanguage": dataTableLang
			
		});
	}
}