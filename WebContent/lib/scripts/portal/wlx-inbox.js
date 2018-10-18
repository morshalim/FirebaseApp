var columnIndex = '';
var sortOrder = '';
$(function() {
	getInboxTableData(workItemsList);
	//getToDoListData();
	
	populateNotification(notifications);
	setNotifications(workItemCountList);
	if(activeTab && activeTab != '' && activeTab == 'toDoItems')
		$('a[rel="toDoItems"]').click();
	else if(activeTab && activeTab != '' && activeTab == 'notif')
		$('a[rel="notif"]').click();
	else
		$('a[rel="workItems"]').click();
	
	$('#removeWorkItem').on('click',function(){
		if($('input[name="workItems"]:checkbox:checked').length > 0)
			showDeleteNotification(false,null,"false");
		else
			showError(langMap.js_inbox_select_inbox_work_item);
	});
	
	$('input[name="workItems"]').on('change',function(){
		if($('input[name="workItems"]:checkbox:checked').length > 0)
			$('#removeWorkItem').removeAttr('disabled');
		else
			$('#removeWorkItem').attr('disabled',true);
	})
	
	$('#removeWorkItemBtn').on('click',function(){
		if($('input[name="inboxWorkItems"]:checkbox:checked').length > 0)
			showDeleteNotification(false,null,"true");
		else
			showError(langMap.js_inbox_select_inbox_work_item);
	});
	$("#workitems-table-cntr thead tr:eq(0)").on("click", "th", function(event){
	    fGetSortInfo();
	});
	$("#notif_tab thead tr:eq(0)").on("click", "th", function(event){
	    fGetSortInfo();
	});
});

function fGetSortInfo() {
    var sortInfo = $("#workitems-table-cntr,#notif_tab").dataTable().fnSettings().aaSorting;
    columnIndex = sortInfo[0][0];
    sortOrder = sortInfo[0][1]
}

function getInboxTableData(workItems){
	var unReadCount  = 0;
	if(workItems)
	{
		var html = [];
		var elem;
		for(var i=0; i<workItems.length; i++)
		{
			elem = workItems[i];
			html.push('<tr>');
			html.push('	<td class="center"><label class="position-relative"><input type="checkbox" name="inboxWorkItems" class="ace" workItemId="'+elem.workItemId+'"><span class="lbl"></span></label></td>');
			if(elem.type=='3')
				html.push('	<td><a id="workItem'+elem.workItemId+'" rel="workItem" workItemId='+elem.workItemId+' status="'+elem.status+'" wiId='+elem.workItemId+' sendEmpId='+elem.sendEmpId+' recievedEmpId='+elem.recievedEmpId+' clientId='+elem.clientId+' href="#" onClick="goToMyStatements(this)">'+elem.workItemTitle+'</a></td>');
			else if(elem.type =='1' || elem.type=='2')				
				html.push('	<td><a id="workItem'+elem.workItemId+'" rel="workItem" workItemId='+elem.workItemId+' status="'+elem.status+'" wiId='+elem.workItemId+' href="#" onClick="getWorkItemDetails(this)">'+elem.workItemTitle+'</a></td>');
			else if(elem.type=='4'){
				var title = elem.workItemTitle.split('~');
				html.push('	<td><a id="workItem'+elem.workItemId+'" rel="workItem" workItemId='+elem.workItemId+' status="'+elem.status+'" wiId='+elem.workItemId+' href="#" reportOfflineId="'+title[0]+'" fileName="'+title[1]+'"onClick="downloadReport(this)">'+title[1]+'</a></td>');
			}
			else if(elem.type=='5'){
				html.push('	<td><a id="workItem'+elem.workItemId+'" rel="workItem" workItemId='+elem.workItemId+' status="'+elem.status+'" wiId='+elem.workItemId+' sendEmpId='+elem.sendEmpId+' recievedEmpId='+elem.recievedEmpId+' clientId='+elem.clientId+' href="#" onClick="showReportErrorMessage(this)" titleText = '+elem.workItemBody+'>'+elem.workItemTitle+'</a></td>');
			}
			html.push('	<td>'+elem.sentFirstName+' '+elem.sentLastName+'</td>');
			html.push('	<td>'+getDateTimeFormatForDisplay(elem.recievedDate)+'</td>');
			/*if(elem.type=='3')
				html.push('	<td><span class="label label-success">'+langMap.inbox_table_data_text1+'</span></td>');
			else if(elem.type=='4'){
				html.push('	<td><span class="label label-success">'+langMap.inbox_table_data_text2+'</span></td>');
			}
			else if(elem.type=='5')
				html.push('	<td><span class="label label-important">'+langMap.inbox_table_data_error+'</span></td>');
			else				
				html.push('	<td>'+applyStatusRenderer(elem.workSheetStatus)+'</td>');*/
			html.push('	<td> <span class="label label-'+elem.statusLabel+'">'+elem.bizName+'</span></td>');
			html.push('	<td>'+renderOptions(elem,"true")+'</td>');
			html.push('</tr>');
			if(elem.status == 1)
				unReadCount++;
		}
		
		
		$('#workitems-count').html(unReadCount);

		var table = $('#workitems-table-cntr');

		if(isDataTable(table[0]))
		{
			table.dataTable().fnClearTable(false);
			table.dataTable().fnDestroy();
		}
		$('#workitems-table-cntr tbody').html(html.join(''));
		table.dataTable({
			"iDisplayLength": 20,
    		"aLengthMenu": [[10, 20, 25, 50, -1], [10, 20, 25, 50, 100]],
    		"autoWidth": false,
    		"order": [[ 3, "desc" ]],
    		"columns": [{ "width": "5%" },{ "width": "52%" },{ "width": "13%" },{ "width": "12%" },{ "width": "8%" },{ "width": "10%" }],
    		"oLanguage": dataTableLang	
				});
		if(columnIndex!='' && sortOrder!='')
			table.fnSort( [ [ columnIndex, sortOrder ]] );
	}
	bindWorkItemEvents();
}

function getToDoListData(){
	var notificationTotalCount = 0;
	if(toDoItemList)
	{
		var html = [];
		var elem;
		for(var i=0; i<toDoItemList.length; i++)
		{
			elem = toDoItemList[i];
			var render = false;
			if(elem.id == approve_goal_plans_id || elem.id == approve_plan_reviews_id){
				if(isManager)
					render = true;
			}else
				render = true;
			if(render){
				html.push('<tr>');
				html.push('	<td><img src="../images/icon_info.png"></td>');
				html.push('	<td><a href="'+elem.link+'"  >'+elem.name+'</a></td>');
				
				html.push('	<td>'+elem.count+'</td>');
				html.push('</tr>');
				notificationTotalCount = notificationTotalCount + parseInt(elem.count);
			}
		}
		
		var table = $('#toDoItems-table-cntr');

		if(isDataTable(table[0]))
		{
			table.dataTable().fnClearTable(false);
			table.dataTable().fnDestroy();
		}
		$('#toDoItems-table-cntr tbody').html(html.join(''));
		table.dataTable({
			"iDisplayLength": 20,
    		"aLengthMenu": [[10, 20, 25, 50, -1], [10, 20, 25, 50, 100]],
    		"oLanguage": dataTableLang	
				});
	}
	$('#toDoItems-count').html(notificationTotalCount);
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

function applyStatusRenderer(status)
{
	var statusRendererMap = { "0":"label-important", "1": "label-warning", "2": "label-success", "3": "label-success", "4": "label-important", "5": "label-success" };
	var className = statusRendererMap[status] || '';
		
	return '<span class="label '+className+'">'+langMap['workitem_status_'+status]+'</span>';
}



function goToMyStatements(workitem)
{
	var workItemId = $(workitem).attr('wiId');
	var url = myStatementURL+'?workItemIdForStatement='+workItemId;
	location.href = url;
}

function populateNotification(data){
	if(data)
	{
		var html = [];
		var elem;
		for(var i=0; i<data.length; i++)
		{
			elem = data[i];
			html.push('<tr>');
			html.push('	<td class="center"><label class="position-relative"><input type="checkbox" name="workItems" class="ace" workItemId="'+elem.workItemId+'"><span class="lbl"></span></label></td>');
			html.push('	<td> <a rel="notification" workItemId="'+elem.workItemId+'" status="'+elem.status+'">'+elem.workItemTitle+'</a></td>');
			html.push('	<td>Report</td>');
			html.push('	<td>'+getDateTimeFormatForDisplay(elem.recievedDateTime)+'</td>');
			html.push('	<td> <span class="label label-'+elem.statusLabel+'">'+elem.bizName+'</span></td>');
			html.push('	<td>'+renderOptions(elem,"false")+'</td>');
			html.push('</tr>');
		}
		
		var notifications=[];
		var count=0;
		for(var i=0; i<data.length; i++)
		{
			var elem = data[i];
			if(elem.status == '1'){
				notifications[count]=data[i];
				count++;
			}
		}
		$('#notifications-count').html(notifications.length);

		var table = $('#notif_tab');

		if(isDataTable(table[0]))
		{
			table.dataTable().fnClearTable(false);
			table.dataTable().fnDestroy();
		}
		$('#notif_tab tbody').html(html.join(''));
		table.dataTable({
			"iDisplayLength": 20,
    		"aLengthMenu": [[10, 20, 25, 50, -1], [10, 20, 25, 50, 100]],
    		"autoWidth": false,
    		"order": [[ 3, "desc" ]],
    		"columns": [{ "width": "5%" },{ "width": "58%" },{ "width": "7%" },{ "width": "12%" },{ "width": "8%" },{ "width": "10%" }],
    		"oLanguage": dataTableLang	
				});
		if(columnIndex!='' && sortOrder!='')
			table.fnSort( [ [ columnIndex, sortOrder ]] );
	}
	bindNotificationEvent();
}

function bindNotificationEvent(){
	$('a[rel="notification"]').on('click',function(){
		var status=$(this).attr('status');
		if(status=='1')
			changeNotificationStatus(this);
			var workItemId=$(this).attr('workItemId');
			window.location=inboxNotificationURL+'?workItemId='+workItemId;
	});
}
function bindWorkItemEvents(){
	$('a[rel="workItem"]').unbind('click').bind('click', function(){
		var status=$(this).attr('status');
		if(status=='1')
			changeNotificationStatus(this);
	});
	
	$('a[rel="viewWorkItem"]').on('click',function(){
		var workItemId=$(this).attr('workItemId');
		$('#workItem'+workItemId).trigger('click');
	});
	$(document).on('click','input[name="inboxWorkItems"]',function(){
		if($('input[name="inboxWorkItems"]:checkbox:checked').length > 0)
			$('#removeWorkItemBtn').removeAttr('disabled');
		else
			$('#removeWorkItemBtn').attr('disabled',true);
	})
}
function renderOptions(elem,isWorkItem){
	var rel='rel="notification"';
	if(isWorkItem == 'true')
		rel='rel="viewWorkItem"';
	var html=[];
	html.push('<div class="btn-group">');
	html.push('<button data-toggle="dropdown" class="btn btn-sm btn-white dropdown-toggle">'+langMap.js_inbox_notification_tab_options+'<i class="ace-icon fa fa-angle-down icon-on-right"></i></button>');
	html.push('<ul class="dropdown-menu dropdown-white pull-right">');
	html.push('	<li><a '+rel+' workItemId="'+elem.workItemId+'" status="'+elem.status+'" isWorkItem='+isWorkItem+'>'+langMap.js_inbox_notification_tab_view_btn+'</a></li>');
	if(elem.status=='1')
		html.push('	<li><a onclick="changeNotificationStatus(this)" workItemId="'+elem.workItemId+'" status="'+elem.status+'" isWorkItem='+isWorkItem+'>'+langMap.js_inbox_notification_tab_view_option+'</a></li>');
	else if(elem.status=='2')
		html.push('	<li><a onclick="changeNotificationStatus(this)" workItemId="'+elem.workItemId+'" status="'+elem.status+'" isWorkItem='+isWorkItem+'>'+langMap.js_inbox_notification_tab_new_option+'</a></li>');
	html.push('	<li class="divider"></li>');
	html.push('<li><a onclick="showDeleteNotification(true,this,\''+isWorkItem+'\')" workItemId="'+elem.workItemId+'" isWorkItem='+isWorkItem+'>'+langMap.js_inbox_notification_tab_remove_btn+'</a></li>');
	html.push('</ul>');
	html.push('</div>');
	
	return html.join('');
}

function showDeleteNotification(type,ele,isWorkItem){
	
	var message = langMap.js_inbox_notification_tab_delete_notification_msg
	if(isWorkItem == 'true')
		message = langMap.js_inbox_delete_workitem_msg;
	bootbox.dialog({
			message:message,
			buttons:{
				"success" :
				{
					"label" :  langMap.js_inbox_notification_tab_remove_btn,
					"className" : "btn btn-sm btn-primary",
					"callback": function() {
						var result ='';
						if(type==true){
							result=$(ele).attr('workItemId');
							isWorkItem = $(ele).attr('isWorkItem')
						}else
							result = getWorkItemIds(isWorkItem);
						deleteNotifications(result,isWorkItem);
					}
				},
				"danger" :
				{
					"label" :  langMap.js_inbox_notification_tab_cancel_btn,
					"className" : "btn btn-sm",
					"callback": function() {
						$("#modal-proxy-remove-approve").modal('hide');
					}
				}
			}
		});
}

function deleteNotifications(ids,isWorkItem){
	var data = {};
	data['workItemIds'] = ids;
	data['isWorkItem'] = isWorkItem;
	$.ajax({
		url: deleteInboxNotificationURL,
		data: data,
		cache: false,
		success: function(dataMap, textStatus, XMLHttpRequest){
			if(dataMap.status==true){
				if(isWorkItem == 'true'){
					getInboxTableData(dataMap.data);
					$('#removeWorkItemBtn').attr('disabled',true);
					showSuccess(langMap.js_inbox_delete_work_item_success_msg);
				}else{
					populateNotification(dataMap.data);
					$('#removeWorkItem').attr('disabled',true);
					showSuccess(langMap.js_inbox_notification_tab_delete_notification_success_msg);
				}
			} else {
				showError(dataMap.errorMessage);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			if(isWorkItem == 'true')
				showError(langMap.js_inbox_delete_work_item_failed_msg);
			else
				showError(langMap.js_inbox_notification_tab_delete_notification_failed_msg);
		}
	});
}
function getWorkItemIds(isWorkItem)
{
	var dataarray = [];
	if(isWorkItem == 'false'){
		$('input[name="workItems"]:checkbox:checked').each(function(){
				var metricTypeId = $(this).attr('workItemId');
				dataarray.push(metricTypeId);
		});
	}else{
		$('input[name="inboxWorkItems"]:checkbox:checked').each(function(){
			var metricTypeId = $(this).attr('workItemId');
			dataarray.push(metricTypeId);
	});
	}
	return dataarray.join('~');;
}

function changeNotificationStatus(ele){
	var data = {};
	var status = $(ele).attr('status');
	if(status == '1')
		data['status'] = '2';
	else if(status == '2')
		data['status'] = '1';
	var isWorkItem = $(ele).attr('isWorkItem');
	data['workItemId'] = $(ele).attr('workItemId');
	data['isWorkItem'] = isWorkItem;
	$.ajax({
		url: changeInboxNotificationStatusURL,
		data: data,
		cache: false,
		success: function(dataMap, textStatus, XMLHttpRequest){
			console.log("Status Changed Successfully");
			if(dataMap.status){
				if(isWorkItem == 'false'){
					populateNotification(dataMap.notifications);
					setNotifications(dataMap.workItemsCountList);
				}else{
					getInboxTableData(dataMap.workItems);
				}
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			console.log("Status Change Failed");
		}
	});
}