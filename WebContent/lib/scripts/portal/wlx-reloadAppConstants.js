$(function(){
	$("#run-btn").on('click',function(){
		$('#page-error-cntr').empty();
		reloadAppConstants();
	});
	$('#serverStatusDiv').hide();
});
function reloadAppConstants()
{
	var data = {};
	if($('#reloadAppSelect').val()=='')
	{
		showErrorMsg(langMap.js_reload_app_constants_failure,'page-error-cntr');
		return false;
	}
	
	data[req_reload_app_config] = $('#reloadAppSelect').val();	
	$.ajax({
		url: reloadAppConstantsURL,
		data: data,
		cache: false,
		success: function(dataMap){
			if(dataMap.status==true){
				showSuccess(langMap.js_reload_app_constants_success, "page-error-cntr");
			} else {
				showErrorMsg(dataMap.errorMessage, "page-error-cntr");
			}
			buildServerStatus(dataMap.serverStatus);
		},
		error:function(){
			showErrorMsg(langMap.js_reload_app_constants_failure,'page-error-cntr');
		}		
	});
}
function buildServerStatus(data){
	$('#serverStatusDiv').show();
	var html = [];
	$(data).each(function(index,serverStatus) {
		html.push('	<tr>');
		html.push('		<td>'+(index+1)+'</td>');
		html.push('		<td>'+serverStatus.server+'</td>');
		if(serverStatus.status=='Success')
			html.push('	<td><span class="label label-success">'+serverStatus.status+'</span></td>');
		else
			html.push('	<td><span class="label label-important">'+serverStatus.status+'</span></td>');
		html.push('	</tr>');
	});
	
	
	var table =$('#serverStatusTable');
	if(isDataTable(table[0])) {	
		table.dataTable().fnClearTable(false);
		table.dataTable().fnDestroy();
	}
	$('#serverStatusTable tbody').html(html.join(''));
	table.dataTable({
		"paging":   false,
        "ordering": false,
        "info":     false,
		"filter": false
	});
	
}