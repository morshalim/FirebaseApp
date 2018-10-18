var oTable;
$(document).ready(function(){
	
	buildCountry(statmentInfoMap.crt_resp_countries_list);
	buildFromstatus(statmentInfoMap.req_status_list);
	buildTostatus(statmentInfoMap.req_status_list);
	buildReviewPeriod(statmentInfoMap.reviewPeriodList);

	$('[rel="criteriaForm"]').on('click',function(){
		/*$('#fromStatus').val('');
		$('#toStatus').val('');*/
	});
	
	/*$('#btn_print').attr('disabled', 'disabled');
	$("#release-statement-btn").on('click',function(){		
		saveReleaseStatement();		
	});
	pushMsg(value);
	$("#btn_print").on('click',function(){goToPrintSelected();});
	
	$("#emp-search-btn").on('click', function() {
		$('#page-error-cntr').empty();
		var searchText = $('#empSearchValue').val();
		if(searchText==null ||searchText==''){
			return false;
		}else
			{
				searchEmployee(searchText,true);
			}
	});
	$("#empSearchValue").bind('keypress',{}, function(event){
		if(event.which == 13 ){
			if($('#empSearchValue').val()!='')
			{
				$('#page-error-cntr').empty();
				searchEmployee($('#empSearchValue').val(),true);
			}
			else
			{
				return false;
			}
			event.preventDefault();
		}
	});
	
	$("#empSearchValue").on('keyup',{}, function(event){
		if($('#empSearchValue').val()==''){
			oTable.fnClearTable();
			$('#btn_print').attr('disabled', 'disabled');
		}
	});*/
});
function buildCountry(data){
	var html=[];
	$.each(data,function(index,item){
		html.push('<option value="'+item.COUNTRY_ID+'">'+item.DESCRIPTION+'</option>');
	});
	$('#planCountry').html(html.join(''));
	
}
function buildFromstatus(data){
	
	var html=[];
	html.push('<option value="">'+langMap.jsp_plan_activation_status_choose+'</option>');
	$.each(data,function(key,value){
		html.push('<option value="'+value.value+'">'+value.name+'</option>');
	});
	$('#fromStatus').html(html.join(''));
}
function buildTostatus(data){
	var html=[];
	html.push('<option value="">'+langMap.jsp_plan_activation_status_choose+'</option>');
	$.each(data,function(key,value){
		html.push('<option value="'+value.value+'">'+value.name+'</option>');
	});
	$('#toStatus').html(html.join(''));
}
function buildReviewPeriod(data){
	var html=[];
	$.each(data,function(key,value){
		html.push('<option value="'+value.planReviewId+'">'+value.planReviewTitle+'</option>');
	});
	$('#reviewPeriod').html(html.join(''));
}
function validPlanAction(){
	
	if(($('#fromStatus').val()=="" || $('#fromStatus').val()==null) || 
			($('#toStatus').val()=="" ||$('#toStatus').val()==null)){		
		showError(langMap.js_fields_marked_are_required);
		return false;
	}
	return true;
}
function validSameStatus(){
	if($('#fromStatus').val()==$('#toStatus').val()){
		showError(langMap.js_from_status_and_to_status_cannot_be_same);
		return false;
	}
	return true;
}

function pushMsg(value)
{
	$("#releaseStatusMsg").html('');
	var releaseStatusMsgHTML = [];
	releaseStatusMsgHTML.push('<p>');
	releaseStatusMsgHTML.push('<i class="fa fa-circle red"></i>&nbsp;&nbsp;'+ value + ' '+langMap.release_statements_text_pending_statements);
	releaseStatusMsgHTML.push('</p>');
	$("#releaseStatusMsg").html(releaseStatusMsgHTML.join(''));	
	if(value == 0)
	{
		$('#release-statement-btn').hide();
		$('#emp_search_ctr').hide();
	}
}

function bindCheckBoxSelection(element){
	$('#page-error-cntr').empty();
	$('#table_report tbody tr').each(function(){
		if($('input:checkbox:checked').length>0){
			$('#btn_print').removeAttr('disabled');
		}
		else
		{
			$('#btn_print').attr('disabled', 'disabled');
		}
	});
}

function buildRewards (data) {

	var tbody = [];
	if(data != undefined && data != null)
		$('#btn_print').show();
	$('#table_report').show();
	for(var x in data)
	{
		var entry = data[x];
		var disabled = '';
		tbody.push('<tr>\n');
		tbody.push('<td class="center">');
		if(entry.status != 3 && entry.status !=5 && entry.status !=2)
			disabled = "disabled";
		tbody.push('<label><input type="checkbox" '+disabled+' name="rewardsBox" empName="'+entry.name+'" empId="'+entry.pernr+'" empPosTitle="'+entry.posTitle+'" statusId="'+entry.status+'" value="' + x + '" class="ace" ><span class="lbl"></span></label></td>\n');
		if(entry.count > 0)
			tbody.push('			<td><!--' +entry.name+ '--><a href="#" onclick="getDrillDownStatement(\''+entry.pernr+'\', $(\'#reviewSelect\').val())">' + entry.name + '</a></td>\n');
		else
			tbody.push('			<td><!--' +entry.name+ '-->' + entry.name + '</td>\n');
		tbody.push('			<td class="">' + entry.posTitle + '</td>\n');
		entry.status = '0';
		tbody.push('			<td>' + ((entry.status == '0'|| entry.status =='1' || entry.status =='4') ? '<span class="label label-important">'+langMap.js_wlx_statement_htm_not_ready+'</span>' : ((entry.status == '3' || entry.status =='5')?'<span class="label label-success">'+langMap.js_wlx_statement_htm_active+'</span>':'<span class="label label-success">'+langMap.js_wlx_statement_htm_released+'</span>')) + '</td>\n');
		tbody.push('		</tr>\n');
	}
	
	var table = $('#table_report');

	if(isDataTable(table[0]))
	{
		table.dataTable().fnClearTable(false);
		table.dataTable().fnDestroy();
	}
	$('#table_report tbody').html(tbody.join(''));

	oTable = table.dataTable({
		"iDisplayLength": 20,
		"aLengthMenu": [[10, 20, 25, 50, -1], [10, 20, 25, 50, 100]],
		"aoColumns": [
			{ "bSortable": false },
			null, null, { "bSortable": false }
		],
		"aaSorting": [[ 1, "asc" ]],
		"oLanguage": dataTableLang,
		"fnDrawCallback":function (oSettings) {$('input:checkbox').on('click',function(){bindCheckBoxSelection(this);});}
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

function goToPrintSelected() {
	var statusNotReady = false;
	$('#table_report tbody tr').each(function(){

		if($(this).find(':checkbox:checked').length>0)
		{
			var input = $(this).find(':checkbox:checked');
			var statusId = input.attr('statusId');
			var html=[];
			if(statusId!='3' && statusId!='5' && statusId!=2)
			{
				statusNotReady = true;
				html.push('<div class="alert alert-danger">');
				html.push('	<button type="button" class="close" data-dismiss="alert"><i class="ace-icon fa fa-times"></i></button>');
				html.push('	<strong>'+langMap.js_wlx_statement_htm_err+'</strong>');
				html.push(langMap.js_wlx_statement_htm_text+'<br />');
				html.push('</div>');
				$('#page-error-cntr').html(html.join(''));
			}
			if(!statusNotReady){
				var data = {};
				data[req_pdf_url]	= goToPrintStatementURL;
				data[req_emp_id] = input.attr('empId');
				data[req_emp_name] = input.attr('empName');
				data[req_emp_pos_title] = input.attr('empPosTitle');
				data[req_emp_status] = input.attr('statusId');
				loadPDF(data);
			}
		}
	});

}
