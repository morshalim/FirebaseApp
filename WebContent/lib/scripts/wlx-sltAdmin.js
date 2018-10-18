var removeSLTEmployee = "";
$(document).ready(function() {
	$('#btn_remove_override').attr('disabled', 'disabled');
	$('#btn_set_select_override').attr('disabled', 'disabled');
	$('#btn_remove_id').attr('disabled', 'disabled');
	$('#btn_set_select').attr('disabled', 'disabled');
	buildEmployeeSltList(slfAdminEmployeeList);
	$("#emp-search-btn").on('click', function() {
		$('#page-error-cntr').empty();
		var searchText = $('#empSearchValue').val();
		if(searchText==null ||searchText==''){
			return false;
		}
		else
		{
			searchEmployeeForSltAdmin(searchText);
			$('#btn_remove_id').attr('disabled', 'disabled');
			$('#btn_set_select').attr('disabled', 'disabled');
		}
	});

	$("#empSearchValue").bind('keypress',{}, function(event){
		if(event.which == 13 ){
			if($('#empSearchValue').val()!='')
			{
				$('#page-error-cntr').empty();
				searchEmployeeForSltAdmin($('#empSearchValue').val());
			}
			else
			{
				return false;
			}
			
			event.preventDefault();
		}
	});

	removeSLTEmployee = $('#modal-slt-employee-remove').html();
	$('#modal-slt-employee-remove').remove();

});

function setSelected()
{
	$('#page-error-cntr').empty();
	var html=[];
	var status=[];
	$('#table_report tbody tr').each(function(){
		if($(this).find(':checkbox:checked').length>0)
		{
			var input = $(this).find(':checkbox:checked');
			var flag = input.attr('empSltFlag');
			status.push(flag);
		}
	});

	var result = $.inArray('t', status);
	if(result>=0)
	{
		showError(langMap.js_slt_flag_set_reset_error, 'page-error-cntr', false);
		return false;
	}
	else
	{
		showSuccess(langMap.js_slt_flag_set_success, 'page-error-cntr');
		$("body,html").scrollTop(0);

	}
}

function setOverrideSelected(tableName){
	$('#page-error-cntr').empty();
	var isSetStatus = true;
	var html = [];
	var chooseName = "";
	if(tableName == "SLT_List")
		chooseName = 'input[name=slfBox]:checked';
	else if(tableName == "table_report")
		chooseName = 'input[name=slfSearchBox]:checked';
	var statusFlag = [];
		$(chooseName).each(function(index, item){
			var overrideFlagStatus = $(this).attr('status');
			statusFlag.push(overrideFlagStatus);
		});

		var result = $.inArray('1', statusFlag);

		if(result>=0)
			isSetStatus = false;

		if(isSetStatus){
			var employeeId = "";
			var overrideFlag = "";
			$(chooseName).each(function(index, item){
				if(index>0){
					employeeId = employeeId + '~';
					overrideFlag = overrideFlag + '~';
				};
				employeeId = employeeId + $(this).attr('empId');
				overrideFlag = overrideFlag + $(this).attr('status');
			});
			
			var data = {
				'employeeList'		:employeeId,
				'overRideFlagList'	:overrideFlag,
				'searchText'		:$('#empSearchValue').val()
			};

			$.ajax({
				url: setSLTFlagURL+'update',
				data: data,
				cache: false,
				success: function(data, textStatus, XMLHttpRequest){
					setSLTFlagSuccess(data, tableName);
				},
				error: setSLTFlagError
			});

		} else {
			showError(langMap.js_slt_flag_set_reset_error, 'page-error-cntr', false);
			return false;
		}
}

function setSLTFlagSuccess(data, tableName){
	$('#page-error-cntr').empty();
	if(data){
		if(data.isUpdated){
			if(tableName == "SLT_List"){
				buildEmployeeSltList (data.slfAdminEmployeeList);
				$('#btn_remove_override').attr('disabled', 'disabled');
				$('#btn_set_select_override').attr('disabled', 'disabled');
			} else if(tableName == "table_report") {
				pushSearchResultsForSlfAdmin (data.slfAdminEmployeeList);
				$('#btn_remove_id').attr('disabled', 'disabled');
				$('#btn_set_select').attr('disabled', 'disabled');
			}
				
			
		}
	}
}

function setSLTFlagError(){
	showError(langMap.js_slt_flag_set_unset_error, 'page-error-cntr', false);
	return false;
}

function bindCheckBoxSelection(element)
{
	var name = element.name;
	var tableId = '';
	if(name=='slfBox')
	{
	 tableId = 'SLT_List';
	}
	else if(name=='slfSearchBox')
	{
		tableId ='table_report';
	}
	$('#page-error-cntr').empty();
	$('#'+tableId+' tbody tr').each(function(){
		if($('input:checkbox:checked').length>0){
			if( tableId == 'SLT_List') {
				$('#btn_set_select_override').removeAttr('disabled');
				$('#btn_remove_override').removeAttr('disabled');
			} else if( tableId == 'table_report') {
				$('#btn_remove_id').removeAttr('disabled');
				$('#btn_set_select').removeAttr('disabled');
			}
		}
		else
		{
			if( tableId == 'SLT_List') {
				$('#btn_set_select_override').attr('disabled', 'disabled');
				$('#btn_remove_override').attr('disabled', 'disabled');
			} else if( tableId == 'table_report') {
				$('#btn_remove_id').attr('disabled', 'disabled');
				$('#btn_set_select').attr('disabled', 'disabled');
			}
		}
	});
}

function buildEmployeeSltList (data) {
	var tbody = [];
	var entry = "";
	if(data && data.length > 0){
		for(var i=0; i<data.length; i++)
		{
			entry = data[i];
			tbody.push('<tr>\n');
			tbody.push('<td class="center">');
			tbody.push('<label><input type="checkbox" name="slfBox" empFirstName="'+entry.empFirstName+'" empId="'+entry.empId+'" empPosTitle="'+entry.posTitle+'" status="'+entry.sltIFlag+'" class="ace"><span class="lbl"></span></label></td>\n');
			tbody.push('			<td><a href="#" onclick="">' + entry.empFirstName +' '+entry.empLastName+ '</a></td>\n');
			tbody.push('			<td>' + entry.posTitle + '</td>\n');
			tbody.push('			<td>' + entry.mgrFirstName+'&nbsp;'+entry.mgrLastName + '</td>\n');
			if(entry.sltFlag=='1')
				tbody.push('			<td><span class="label label-warning">'+langMap.js_wlx_slt_admin_slt_flag_text+'</span></td>\n');
			else
				tbody.push('			<td></td>');
			if(entry.sltIFlag=='0'){
				tbody.push('			<td></td>');
			} else if(entry.sltIFlag=='1'){
				tbody.push('			<td><span class="label label-warning">'+langMap.js_wlx_slt_admin_slt_flag_text+'</span></td>\n');
			} else if(entry.sltIFlag=='2'){
				tbody.push('<td></td>');
			}
			tbody.push('		</tr>\n');
		}
	} else {
		tbody.push('<tr>');
		tbody.push('<td colspan="6">');
		tbody.push('&nbsp;'+langMap.slt_admin_table+'');
		tbody.push('</td>');
		tbody.push('<tr>');
	}
	
	

	var table = $('#SLT_List');
	if(isDataTable(table[0]))
		{
			table.dataTable().fnClearTable(false);
			table.dataTable().fnDestroy();
	}
	$('#SLT_List tbody').html(tbody.join(''));
	if(data && data.length > 0){
		table.dataTable({
			"iDisplayLength": 20,
    		"aLengthMenu": [[10, 20, 25, 50, -1], [10, 20, 25, 50, 100]],
			"aoColumns": [
				{ "bSortable": false },
				null, null,null,null,null
			],
			"oLanguage": dataTableLang,
			"fnDrawCallback":function (oSettings) {$('input:checkbox').on('click',function(){bindCheckBoxSelection(this);});}
		});
	}
}

function showConfirmation(tableName, isLink, ele)
{
	if(isLink){
		bootbox.dialog({message:removeSLTEmployee, 
			buttons:{
				"success" :
				{
					"label" :  langMap.crt_bootbox_ok,
					"className" : "btn btn-sm btn-primary",
					"callback": function() {
						var employeeId = $(ele).attr('empId');
						var overrideFlag = $(ele).attr('status');
						var data = {
							'employeeList'		:employeeId,
							'overRideFlagList'	:overrideFlag,
							'searchText'		:$('#empSearchValue').val()	
						};

						$.ajax({
							url: setSLTFlagURL+'delete',
							data: data,
							cache: false,
							success: function(data, textStatus, XMLHttpRequest){
								setSLTFlagSuccess(data, tableName);
							},
							error: setSLTFlagError
						});
					}
				}, 
				"danger" :
				{
					"label" :  langMap.crt_bootbox_cancel,
					"className" : "btn btn-sm",
					"callback": function() {
						$("#modal-slt-employee-remove").modal('hide');
					}
				}
			}
		});
	} else {
		var isRemoveFlag = true;
			var chooseName = "";
			if(tableName == "SLT_List")
				chooseName = 'input[name=slfBox]:checked';
			else if(tableName == "table_report")
				chooseName = 'input[name=slfSearchBox]:checked';

			$(chooseName).each(function(index, item){
				var statusFlag = [];
				$(chooseName).each(function(index, item){
					var overrideFlagStatus = $(this).attr('status');
					statusFlag.push(overrideFlagStatus);
				});

				var result = $.inArray('0', statusFlag);
				var result1 = $.inArray('2', statusFlag);
				if(result>=0 || result1>=0)
					isRemoveFlag = false;
			});

			if(isRemoveFlag){
					
						bootbox.dialog({message:removeSLTEmployee, 
							buttons:{
								"success" :
								{
									"label" :  langMap.crt_bootbox_ok,
									"className" : "btn btn-sm btn-primary",
									"callback": function() {
										var employeeId = "";
										var overrideFlag = "";
										$(chooseName).each(function(index, item){
											if(index>0){
												employeeId = employeeId + '~';
												overrideFlag = overrideFlag + '~';
											};
											employeeId = employeeId + $(this).attr('empId');
											overrideFlag = overrideFlag + $(this).attr('status');
										});
										
										var data = {
											'employeeList'		:employeeId,
											'overRideFlagList'	:overrideFlag,
											'searchText'		:$('#empSearchValue').val()
										};

										$.ajax({
											url: setSLTFlagURL+'delete',
											data: data,
											cache: false,
											success: function(data, textStatus, XMLHttpRequest){
												setSLTFlagSuccess(data, tableName);
											},
											error: setSLTFlagError
										});
									}
								}, 
								"danger" :
								{
									"label" :  langMap.crt_bootbox_cancel,
									"className" : "btn btn-sm",
									"callback": function() {
										$("#modal-slt-employee-remove").modal('hide');
									}
								}
							}
						});
				
			} else {
				showError(langMap.js_slt_flag_unset_error, 'page-error-cntr', true);
				return false;
		}
	}

}

function pushSearchResultsForSlfAdmin (data) {

	var tbody = [];
	var entry = "";
	if(data && data.length>0) {
		for(var i=0; i<data.length; i++)
		{
			entry = data[i];
			tbody.push('<tr>\n');
			tbody.push('<td class="center">');
			tbody.push('<label><input class="ace" type="checkbox" name="slfSearchBox" empFirstName="'+entry.empFirstName+'" empId="'+entry.empId+'" empPosTitle="'+entry.posTitle+'" status="'+entry.sltIFlag+'" empSltFlag="'+entry.sltIFlag+'"><span class="lbl"></span></label></td>\n');
			tbody.push('			<td><a href="#" onclick="">' + entry.empFirstName +' '+entry.empLastName+ '</a></td>\n');
			tbody.push('			<td>' + entry.posTitle + '</td>\n');
			tbody.push('			<td>' + entry.mgrFirstName+'&nbsp;'+entry.mgrLastName + '</td>\n');
			if(entry.sltFlag=='1')
				tbody.push('			<td><span class="label label-warning">'+langMap.js_wlx_slt_admin_slt_flag_text+'</span></td>\n');
			else
				tbody.push('			<td></td>');
			if(entry.sltIFlag=='0'){
				tbody.push('			<td></td>');
				tbody.push('			<td></td>');
			} else if(entry.sltIFlag=='1'){
				tbody.push('			<td><span class="label label-warning">'+langMap.js_wlx_slt_admin_slt_flag_text+'</span></td>\n');
				tbody.push('<td><a href="#" onclick="showConfirmation(\'table_report\',true,this);" empId="'+entry.empId+'" status="'+entry.sltIFlag+'"><i class="fa fa-remove">&nbsp;'+langMap.js_wlx_slt_admin_remove_slt_flag_text+'</i></a></td>');
			} else if(entry.sltIFlag=='2'){
				tbody.push('<td></td>');
				tbody.push('<td></td>');
			}
			tbody.push('		</tr>\n');
		}
	} else {
		tbody.push('<tr>');
		tbody.push('<td colspan="5">');
		tbody.push('&nbsp;"'+langMap.slt_admin_table+'"');
			tbody.push('</td>');
			tbody.push('<tr>');
	}
	

	var table = $('#table_report');
	if(isDataTable(table[0]))
		{
			table.dataTable().fnClearTable(false);
			table.dataTable().fnDestroy();
	}
	$('#table_report tbody').html(tbody.join(''));
	if(data && data.length>0) {
		table.dataTable({
			"iDisplayLength": 20,
    		"aLengthMenu": [[10, 20, 25, 50, -1], [10, 20, 25, 50, 100]],
			"aoColumns": [
			    	      { "bSortable": false },
			    	      null, null, null, null,null,
			    		   { "bSortable": false }
			    		],
			"oLanguage": dataTableLang,
			"fnDrawCallback":function (oSettings) {$('input:checkbox').on('click',function(){bindCheckBoxSelection(this);});}
		});
	}
}

function showList() {
	$('#page-error-cntr').empty();
	$('#empSearchValue').val('');
	reloadSltEmployeeList();
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
