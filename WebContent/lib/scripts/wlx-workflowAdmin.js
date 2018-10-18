var empDetails;
var workItemDelete = "";
$(function() {

	
	
	$("#emplSearch").bind('keypress',{}, function(event){
		if(event.which == 13 ){
			$('#page-error-cntr').empty();
			if($('#emplSearch').val()!='')
			{
				searchEmployeeForAdminWorkflow($('#emplSearch').val());
			}
			else
			{
				return false;
			}
			event.preventDefault();
		}
	});
	
	workItemDelete = $('#modal-work-item-delete').html();
	$('#modal-work-item-delete').remove();
});
function bindCheckBox(ele){
	
	if($('input:checkbox:checked').length>0)
		$('#btn_delete').removeAttr('disabled');
	else
		$('#btn_delete').attr('disabled', 'disabled');
		
	
}
function get_data() {
	var empSearchInput = $('#emplSearch').val();
	if(empSearchInput == '')
		return false;
	searchEmployeeForAdminWorkflow(empSearchInput);
		
}

function pushEmpWrkItmsData(data,searchKey){
	var html=[];
	$("#messageId").empty();
	$('#results').empty();
	var dateTime;
	var hours;
	var minutes;
	var time;
	if(data != null && data != ''){
		var empProfile = data[0];
		empDetails = empProfile;
		var workItems = data[1];
		var errorMsg = data[2];
		if(errorMsg!=null && errorMsg!='')
		{
			showError(errorMsg, 'page-error-cntr');
		}else{
			var searchKeyText = '';
			if(empProfile!=null && empProfile!='' && !(empProfile.length >1))
				searchKeyText = empProfile[0].firstName+' '+empProfile[0].lastName;
			else
				searchKeyText = searchKey;
			html.push('<h2>'+langMap.js_workitems_for+' '+searchKeyText+'</h2>');
		}
		html.push('<p>');
		html.push('<button onclick="deleteWorkItm();" class="btn btn-sm btn-primary" disabled id="btn_delete">');
		html.push('<i class="ace-icon fa fa-times"></i>&nbsp;'+langMap.delete_selected);
		html.push('</button>');
		html.push('</p>');
		html.push('<table id="table_report"');
		html.push('class="table table-striped table-bordered table-hover">');
		html.push('<thead>');
		html.push('<tr>');
		html.push('<th class="center" ><label><input class="ace" type="checkbox" disabled/>');
		html.push('<span class="lbl"></span></label></th>');
		html.push('<th>'+langMap.js_workitem_type+'</th>');
		html.push('<th>'+langMap.js_triggered_on+'</th>');
		html.push('<th>'+langMap.js_triggered_by+'</th>');
		html.push('<th>'+langMap.js_inbox_table_header_status+'</th>');
		html.push('</tr>');
		html.push('</thead>');
		html.push('<tbody>');
		if(workItems!=null && workItems!=''){
			for(var index= 0;index<workItems.length;index++){
				var entry = workItems[index];
				html.push('<tr>');
				html.push('<td class="center"><label><input id="'+entry.workItemId+'" type="checkbox" class="ace" onclick="bindCheckBox(this);"/>');
				html.push('<span class="lbl"></span></label></td>');
				if(entry.type=='3')
					html.push('	<td><a wiId='+entry.workItemId+' sendEmpId='+entry.sendEmpId+' recievedEmpId='+entry.recievedEmpId+' clientId='+entry.clientId+' href="#" onClick="goToMyStatements(this)">'+entry.workItemTitle+'</a></td>');
				else if(entry.type=='4'){
					var title = entry.workItemTitle.split('~');
					html.push('	<td><a wiId='+entry.workItemId+' href="#" recievedEmpId='+entry.recievedEmpId+' clientId='+entry.clientId+' reportOfflineId="'+title[0]+'" fileName="'+title[1]+'"onClick="downloadReport(this)">'+title[1]+'</a></td>');
				}
				else if(entry.type=='5'){
					html.push('	<td><a wiId='+entry.workItemId+' sendEmpId='+entry.sendEmpId+' recievedEmpId='+entry.recievedEmpId+' clientId='+entry.clientId+' href="#" onClick="showReportErrorMessage(this)" titleText = '+entry.workItemBody+'>'+entry.workItemTitle+'</a></td>');
				}
				else
					html.push('<td><a href="#" wiId='+entry.workItemId+' recievedEmpId='+entry.recievedEmpId+' clientId='+entry.clientId+' onClick="getWorkItemDetails(this)">'+entry.workItemTitle+'</a></td>');
				
				var date = getDateFormatForDisplay(entry.recievedDate);
				dateTime = new Date(entry.recievedDate);
				hours = dateTime.getHours();
				minutes = dateTime.getMinutes();
				if(hours.toString().length == 1)
					hours = '0'+dateTime.getHours();
				if(minutes.toString().length == 1)
					minutes = '0'+dateTime.getMinutes();
				time = 	hours+':'+minutes;
				html.push('<td>'+date+' '+time+'</td>');
				html.push('<td>'+entry.sentFirstName+' '+entry.sentLastName+'</td>');
				if(entry.type=='3')
					html.push('	<td><span class="label label-success">'+langMap.js_workflow_admin_status_released_text+'</span></td>');
				else if(entry.type=='4'){
					html.push('	<td><span class="label label-success">'+langMap.js_workflow_admin_status_ready_to_download_text+'</span></td>');
				}
				else if(entry.type=='5')
					html.push('	<td><span class="label label-important">'+langMap.js_workflow_admin_status_error_text+'</span></td>');
				else	
					html.push('	<td>'+applyStatusRenderer(entry.workSheetStatus)+'</td>');
				
				html.push('</tr>');
			}
		}
		html.push('</tbody>');
		html.push('</table>');
		
		$('#results').html(html.join(''));
		$('#results').attr('style','width:95%');
		var table = $('#table_report');

		if(isDataTable(table[0]))
		{
			table.dataTable().fnClearTable(false);
			table.dataTable().fnDestroy();
		}

		table.dataTable({
			"iDisplayLength": 20,
    		"aLengthMenu": [[10, 20, 25, 50, -1], [10, 20, 25, 50, 100]],
    		"oLanguage": dataTableLang	
				});
		$("#results").show();
	}else{
		showError(langMap.js_workflow_admin_delete_workitem , 'messageId');
		$("#messageId").show();
	}

}

function deleteWorkItm(){
	var id;
	var ids = [];
	var empId = $('#emplSearch').val();
	/*bootbox.confirm(langMap.js_workflow_admin_delete_workitem, function(result) {
	if(result) {
		if($('input:checkbox:checked').length>0)
		{
			for(var index = 0;index< $('input:checkbox:checked').length;index++){
				var input = $('input:checkbox:checked')[index];	
				id = $(input).attr('id');
				ids.push(id);
			}
		}
		deleteWorkitems(ids,empId);
		
	}
	});*/
	
	bootbox.dialog({message:workItemDelete, 
			buttons:{
				"success" :
				{
					"label" :  langMap.crt_bootbox_ok,
					"className" : "btn btn-sm btn-primary",
					"callback": function() {
						 if($('input:checkbox:checked').length>0)
						{
							for(var index = 0;index< $('input:checkbox:checked').length;index++){
								var input = $('input:checkbox:checked')[index];	
								id = $(input).attr('id');
								ids.push(id);
							}
						}
						deleteWorkitems(ids,empId);
					}
				}, 
				"danger" :
				{
					"label" :  langMap.crt_bootbox_cancel,
					"className" : "btn btn-sm",
					"callback": function() {
						$("#modal-work-item-delete").modal('hide');
					}
				}
			}
	});

}

function applyStatusRenderer(status)
{
	var statusRendererMap = { "0":"label-important", "1": "label-warning", "2": "label-success", "3": "label-success", "4": "label-important", "5": "label-success" };
	var className = statusRendererMap[status] || '';
		
	return '<span class="label '+className+'">'+langMap['workitem_status_'+status]+'</span>';
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

function goToMyStatements(workitem)
{
	var workItemId = $(workitem).attr('wiId');
	var url = myStatementURL;
	location.href = url;
}