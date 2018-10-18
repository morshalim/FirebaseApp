var removeFilterConfirm = "";
var resultFilterAdd = "";
var resultFilterEdit = "";
$(document).ready(function(){
	buildSecurityDetails(securityFilterList);
	resultFilterAdd = $('#addFilterform').html();
	$('#addFilterform').remove();
	resultFilterEdit = $('#editFilterform').html();
	$('#editFilterform').remove();
	removeFilterConfirm = $('#modal-proxy-remove-approve').html();
	$('#modal-proxy-remove-approve').remove();
	
	$('#btn_add_filter').click(function(){
		addSecurityFilter();
	});
});

function buildSecurityDetails(filterList)
{
	var entry;
	var tbody = [];
	for(var index =0; index< filterList.length; index++){
		entry = filterList[index];
		tbody.push('<tr>');
		if(entry.filterType == "BUS"){
			tbody.push('<td>'+langMap.jsp_security_filter_table_business_areas+'</td>\n');
		}else if(entry.filterType == "JOB"){
			tbody.push('<td>'+langMap.jsp_security_filter_table_position+'</td>\n');
		}else if(entry.filterType == "EMP"){
			tbody.push('<td>'+langMap.jsp_security_filter_table_employee+'</td>\n');
		}else if(entry.filterType == "LVL"){
			tbody.push('<td>'+langMap.jsp_security_filter_table_level+'</td>\n');
		}else if(entry.filterType == "LOC"){
			tbody.push('<td>'+langMap.jsp_security_filter_table_locations+'</td>\n');
		}else if(entry.filterType == "ROLE"){
			tbody.push('<td>'+langMap.jsp_security_filter_table_role+'</td>\n');
		}
		tbody.push('<td>' + entry.filter + '</td>\n');
		tbody.push('<td>' + entry.span + '</td>\n');
		tbody.push('<td>' + entry.exclude + '</td>\n');
		tbody.push('<td>' + entry.stDate + '</td>\n');
		tbody.push('<td>' + entry.enDate + '</td>\n');
		tbody.push('	<td><a id="editFilter" onclick="showEditFilter(this);"  accessId="' + entry.accessId + '" filterExclude="' + entry.exclude + '" filterType="' + entry.filterType + '" filterInput="' + entry.filter + '" filterSpan="'+entry.span+'" editStartDate="'+entry.stDate+'" editEndDate="'+entry.enDate+'" href="#"><i class="icon-edit"> '+langMap.proxy_delegate_link_text_edit+'</i>&nbsp;</a>&nbsp;&nbsp;<a href="#" id="removeFilter" accessId="' + entry.accessId + '" filterType="' + entry.filterType + '" onclick="removeSecurityFilter(this);" ><i class="icon-trash"> '+langMap.proxy_delegate_link_text_remove+'</i></a></td>');
		tbody.push('</tr>');
	}
	

	var table = $('#table_report');

	if(isDataTable(table[0]))
	{
		table.dataTable().fnClearTable(false);
		table.dataTable().fnDestroy();
	}
	$('#table_report tbody').html(tbody.join(''));
	table.dataTable({
		"iDisplayLength": 20,
		"aLengthMenu": [[10, 20, 25, 50, -1], [10, 20, 25, 50, 100]],
		"aoColumns": [
			null,
			null, 
			null,
			null,
			null,
			null, 
			{ "bSortable": false }
		],		
		"oLanguage": dataTableLang		
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

function removeSecurityFilter(element){
	$('#page-error-cntr').empty();
		
	bootbox.dialog({message:removeFilterConfirm, 
			buttons:{
				"success" :
				{
					"label" :  langMap.crt_bootbox_ok,
					"className" : "btn btn-sm btn-primary",
					"callback": function() {
						deleteSecurityFilter(element);
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

function deleteSecurityFilter(ele)
{
	$('#page-error-cntr').empty();
	var data = {};
	data[req_filter_type] = $(ele).attr('filterType');
	data[req_access_id] = $(ele).attr('accessId');
	
	$.ajax({
        url:deleteSecurityFilterURL,
        data:data,
        cache: false,
        success: deleteSecurityFilterSuccess,
		error: deleteSecurityFilterError
	 });
}

function deleteSecurityFilterSuccess(dataMap, textStatus, XMLHttpRequest){
	var data;
	if(dataMap.status==true){
		data = dataMap.securityFilterList;		
		showSuccess(langMap.security_filter_remove_success, 'page-error-cntr');
		$("body,html").scrollTop(0);
		buildSecurityDetails(data);		
	} else {
		data = dataMap.errorMessage;
		showError(data, 'page-error-cntr');
	}
}

function deleteSecurityFilterError(XMLHttpRequest, textStatus, errorThrown)
{
	
}

function changeFilterType()
{
	$('#page-error-cntr').empty();
	var data = {};
	data[req_filter_type_select] = $('#filterSelect').val();
	$.ajax({
        url:changeFilterURL,
        data:data,
        cache: false,
        success: changeFilterSuccess,
		error: changeFilterError
	 });
}

function changeFilterSuccess(dataMap, textStatus, XMLHttpRequest){
	buildSecurityDetails(dataMap);
}

function changeFilterError(XMLHttpRequest, textStatus, errorThrown)
{
	
}

function addSecurityFilter(){
	$('#page-error-cntr').empty();	
	bootbox.dialog({message:resultFilterAdd});
	$('.date-picker').datepicker();	
	$('#modifyStartDateCal,#startDate').click(function(){
		$('#messageAdd').html('');$('#startDate').datepicker('show');
		$('div.datepicker.datepicker-dropdown.dropdown-menu').css('z-index','2000');
	});
	$('#modifyEndDateCal,#endDate').click(function(){
		$('#messageAdd').html('');$('#endDate').datepicker('show');
		$('div.datepicker.datepicker-dropdown.dropdown-menu').css('z-index','2000');
	});
	validateDate();
	showFilterTypeDropdown('BUS');
}

function changeAddFilter()
{
	$('#messageAdd').html('');
	$('#messageEdit').html('');
	var filterTypeSel = $('#addFilterSelect').val();
	if(filterTypeSel=='JOB' || filterTypeSel=='LVL' || filterTypeSel=='EMP'){
		$('#addCheckBox').prop('disabled', false);
		$('#addCheckBox').prop('checked', true); 
	}
	if(filterTypeSel == "BUS" || filterTypeSel == "LOC"){
		$('#addCheckBox').prop('disabled', false);
		$('#addCheckBox').prop('checked', false); 
	}
	if(filterTypeSel=='ROLE')
		$('#addCheckBox').prop('disabled', true);
	
	showFilterTypeDropdown(filterTypeSel);
}

function showFilterTypeDropdown(filterType,filterTypeSel){
	if(filterType=='BUS' || filterType=='LOC' ||filterType=='ROLE'){
		var data = {};
		$('#filterInput').val('');
		$('#filterInput').hide();
		$('#filterTypeSelect').show();
		data[req_filter_type] = $('#addFilterSelect').val();
		$.ajax({
	        url:loadFilterTypeURL,
	        data:data,
	        cache: false,
	        context : {filterTypeSel : filterTypeSel},
	        success: populateFilterTypeList,
			error: saveFilterError
		 });
	}
	else{
		$('#filterInput').show();
		$('#filterTypeSelect').hide();
	}
	if(filterType=='BUS' || filterType=='LOC'){
		$('#addCheckBox').prop('disabled', true);
	}
}
function populateFilterTypeList(data, textStatus, XMLHttpRequest){
	if(data!=null && data!=""){
		$('#filterTypeSelect').empty();
		var selected = '';
		for(var index=0; index<data.length; index++)
		{
			if(this.filterTypeSel!=undefined && this.filterTypeSel!="" && this.filterTypeSel== data[index].name)
				selected = 'selected="selected"';
			else
				selected = '';
			$('#filterTypeSelect').append('<option '+selected+'value='+data[index].name+'>'+data[index].value+'</option>');
			
		}
	}
	else{
		$('#filterInput').show();
		$('#filterTypeSelect').hide();
	}
}

function saveFilter(element){
	$('#messageAdd').html('');
	var data = {};
	var filterInput = '';
	if($("#filterTypeSelect").is(":visible"))
		filterInput = $("#filterTypeSelect").val();
	else
		filterInput = $('#filterInput').val();
	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();
	if(filterInput==null || filterInput=='' || startDate==null || startDate=='' || endDate==null || endDate=='')
	{
		showError('All are required fields', 'messageAdd');
		return false;
	}
	//alert($('#addCheckBox').is(':checked'));
	data[req_filter_type] = $('#addFilterSelect').val();
	data[req_filter_input] = filterInput;
	data[req_filter_span] = $('#addCheckBox').is(':checked');
	data[req_filter_start_date] = $('#startDate').val();
	data[req_filter_end_date] = $('#endDate').val();
	data[req_filter_exclude] = $('#excludeCheckbox').is(':checked');
	$.ajax({
        url:saveFilterURL,
        data:data,
        cache: false,
        success: saveFilterSuccess,
		error: saveFilterError
	 });
}

function saveFilterSuccess(dataMap, textStatus, XMLHttpRequest){
	var data;
	if(dataMap.status==true){
		data = dataMap.filterList;		
		bootbox.hideAll();
		showSuccess(langMap.security_filter_save_success, langMap.security_filter_message_id);
		buildSecurityDetails(data);
	} else {
		data = dataMap.errorMessage;
		showError(data, 'messageAdd');
	}
}

function saveFilterError(XMLHttpRequest, textStatus, errorThrown)
{
	
}

function showEditFilter(ele)
{
	$('#page-error-cntr').empty();
	var filterType = $(ele).attr('filterType') || '';
	var filterInput = $(ele).attr('filterInput') || '';
	var span = $(ele).attr('filterSpan') || '';
	var editStartDate = $(ele).attr('editStartDate') || '';
	var editEndDate = $(ele).attr('editEndDate') || '';
	var accessId = $(ele).attr('accessId')||'';
	var filterExclude =  $(ele).attr('filterExclude')||'';
	bootbox.dialog({message:resultFilterEdit});
	$('.date-picker').datepicker();
	$('#updateDateButton').attr('accessId', accessId);
	$('#addFilterSelect').val(getFilterType(filterType));
	$('#filterInput').val(filterInput);
	showFilterTypeDropdown(filterType,filterInput);
	$('#filterInput').val(filterInput);
	if(filterType=='EMP' || filterType=='LVL' || filterType=='JOB'){
		if(span == 1)
			$('#addCheckBox').prop('checked', true);
			$('#addCheckBox').prop('disabled', false);
		if(filterExclude == 1)
			$('#excludeCheckbox').prop('checked', true);
	}
	if(filterType=='BUS' || filterType=='LOC'){
		if(span == 1)
			$('#addCheckBox').prop('checked', true);
			$('#addCheckBox').prop('disabled', false);
		if(filterExclude == 1)
			$('#excludeCheckbox').prop('checked', true);
	}
	if(filterType=='ROLE'){
		if(filterExclude == 1){
			$('#addCheckBox').prop('disabled', true);
			$('#excludeCheckbox').prop('checked', true);
		}
	}
	$('#startDate').val(getDateFormatForDisplay(editStartDate));
	$('#endDate').val(getDateFormatForDisplay(editEndDate));
	$('#modifyStartDateCal,#startDate').click(function(){
		$('#messageEdit').html('');$('#startDate').datepicker('show');
		$('div.datepicker.datepicker-dropdown.dropdown-menu').css('z-index','2000');
	});
	$('#modifyEndDateCal,#endDate').click(function(){
		$('#messageEdit').html('');$('#endDate').datepicker('show');
		$('div.datepicker.datepicker-dropdown.dropdown-menu').css('z-index','2000');
	});
	validateDate();
}

function getFilterType(filterType)
{
	
	 /*if(filterType=='All')
	filterType='ALL';*/
	if(filterType=='Position')
	filterType='JOB';
	else if(filterType=='Employee')
	filterType='EMP';
	else if(filterType=='Level')
	filterType='LVL';
	else if(filterType=='Business areas')
	filterType='BUS';
	else if(filterType=='Locations')
	filterType='LOC';
	else if(filterType=='Role')
		filterType='ROLE';
	return filterType;
}

function updateFilter(ele)
{
	$('#messageEdit').html('');
	var data = {};
	var filterInput = '';
	if($("#filterTypeSelect").is(":visible"))
		filterInput = $("#filterTypeSelect").val();
	else
		filterInput = $('#filterInput').val();
	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();
	if(filterInput==null || filterInput=='' || startDate==null || startDate=='' || endDate==null || endDate=='')
	{
		showError(langMap.jsp_security_filter_error_field, 'messageEdit');
		return false;
	}
	//alert($('#addCheckBox').is(':checked'));
	data[req_filter_edit] = true;
	data[req_filter_type] = $('#addFilterSelect').val();
	data[req_filter_input] = filterInput;
	data[req_filter_span] = $('#addCheckBox').is(':checked');
	data[req_filter_start_date] = $('#startDate').val();
	data[req_filter_end_date] = $('#endDate').val();
	data[req_access_id] = $(ele).attr('accessId');
	data[req_filter_exclude] = $('#excludeCheckbox').is(':checked');
	$.ajax({
        url:saveFilterURL,
        data:data,
        cache: false,
        success: updateFilterSuccess,
		error: updateFilterError
	 });
}

function updateFilterSuccess(dataMap, textStatus, XMLHttpRequest){
	var data;
	if(dataMap.status==true){
		data = dataMap.filterList;		
		bootbox.hideAll();
		showSuccess(langMap.security_filter_update_success, langMap.security_filter_message_id);
		buildSecurityDetails(data);
	} else {
		data = dataMap.errorMessage;
		showError(data, 'messageEdit');
	}
}

function updateFilterError(XMLHttpRequest, textStatus, errorThrown)
{
	
}

function validateDate()
{
	$('#startDate,#endDate').keydown(function(event){
			//alert(event.keyCode);				
			if(event.keyCode== 189 || event.keyCode== 191)
			{
				return;
			}
			else
			{
				numericValidation(event);
			}		
	});
}