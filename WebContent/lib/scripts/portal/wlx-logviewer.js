$(document).ready(function(){
	$('#id-date-range-picker-1').daterangepicker();
	
	$('#logLimit,#empID').keydown(function(event){
		numericValidation(event);
		if(event.which == 13 ){
			searchViewLogs();
			$('#logLimit,#empID').blur();
		}
	});
	
	$('#id-date-range-picker-1').keydown(function(event){
		//alert(event.keyCode);				
		if(event.keyCode== 189 || event.keyCode== 191)
		{
			return;
		}
		else
		{
			numericValidation(event);
		}
		if(event.which == 13 ){
			searchViewLogs();
			$('#id-date-range-picker-1').blur();
		}
	});
	populateLogTable();
	
	$("#btn_search").on('click', function() {
		searchViewLogs();
	});	
	
	populateLogStream(logStreamData);
});

function populateLogStream(streamList){
	var elem;
	//var selected="";
	//var selectedReviewItem = getSelectedReviewItem(defaultReviewSelect);

	for(var i=0; i<streamList.length; i++)
	{
		elem = streamList[i];
		if(elem.logType==5)	
			$('#logType').append('<option id='+elem.logType+' value='+elem.logType+' selected>'+elem.logTypeName+'</option>');
		else
			$('#logType').append('<option id='+elem.logType+' value='+elem.logType+'>'+elem.logTypeName+'</option>');
	}


}

function populateLogTable()
{
	var tbody = [];	
	buildTableHeader();
	var table = $('#logentries');	
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
}

function buildTableHeader(){
	var thead = [];
	thead.push('<tr>');
	thead.push('	<th style="width:10% !important;">'+langMap.jsp_logviewer_table_header_date_and_time+'</th>');
	thead.push('	<th style="width:10% !important;">'+langMap.jsp_logviewer_table_header_emp_id+'</th>');
	thead.push('	<th style="width:20% !important;">'+langMap.jsp_logviewer_table_header_emp_name+'</th>');
	thead.push('	<th style="width:10% !important;">'+langMap.jsp_logviewer_table_header_ref_id+'</th>');
	thead.push('	<th style="width:20% !important;">'+langMap.jsp_logviewer_table_header_ref_emp_name+'</th>');
	/*if($('#logType :selected').val()=='5')
		thead.push('	<th style="width:10% !important;">'+langMap.jsp_logviewer_table_header_review_item_id+'</th>');*/
	thead.push('	<th style="width:30% !important;">'+langMap.jsp_logviewer_table_header_description+'</th>');
	thead.push('</tr>');
	$('#logentries thead').html(thead.join(''));
}
function populateSearchLogs(logData)
{
	$('#page-error-cntr').empty();
	var tbody = [];
	var empId;
	var refempId;
	buildTableHeader();
	$.each(logData,function(index,item){
		var logTimeandDate = new Date(item.logTime);
		logDate = getDateFormatForDisplay(item.logTime);
		//var logTime = logTimeandDate.getHours() + ":" + logTimeandDate.getMinutes() + ":" + logTimeandDate.getSeconds();
		var logTime=item.logTime.split(' ');
		empId = item.empId;
		refempId = item.referenceEmpId;
		tbody.push('<tr>');
		tbody.push('	<td>'+logDate+ " " + logTime[1] + '</td>');
		//tbody.push('	<td>'+logTime+'</td>');
		if(empId==null)
			empId='';
		if(refempId==null)
			refempId='';
		tbody.push('	<td>'+empId+'</td>');
		tbody.push('	<td>'+item.firstName+'&nbsp;'+item.lastName+'</td>');
		tbody.push('	<td>'+refempId+'</td>');
		tbody.push('	<td>'+item.refFirstName+'&nbsp;'+item.refLastName+'</td>');
		/*if($('#logType :selected').val()=='5')
			tbody.push('	<td>'+(item.reviewItemId!=null?item.reviewItemId:'')+'</td>');*/
		tbody.push('	<td>'+item.logText+'</td>');
		tbody.push('</tr>');
	});
	
	var table = $('#logentries');	
	if(isDataTable(table[0]))
	{	
		table.dataTable().fnClearTable(false);
		table.dataTable().fnDestroy();
	}	
	$('#logentries tbody').html(tbody.join(''));
	table.dataTable({
		"iDisplayLength": 20,
		"aLengthMenu": [[10, 20, 25, 50, -1], [10, 20, 25, 50, 100]],
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

function searchViewLogs()
{	
	$('#page-error-cntr').empty();
	var logType = $('#logType :selected').val();
	var empID = $('#empID').val();
	var logLimit = $('#logLimit').val();
	var  dateRange = $('#id-date-range-picker-1').val();
	
	if(logType==null ||logType==''){
		var html=[];
		html.push('<div class="alert alert-danger">');
		html.push('	<button type="button" class="close" data-dismiss="alert"><i class="ace-icon fa fa-times"></i></button>');
		html.push('	<strong>'+langMap.js_wlx_statement_htm_err+'</strong>');
		html.push(langMap.logviewer_log_stream_message+'<br />');
		html.push('</div>');
		$('#page-error-cntr').html(html.join(''));
		return false;
	}else
		{
			if(logLimit==null || logLimit=='')
				logLimit = 100;
			/*alert('logType='+logType+",empID="+empID+",logLimit="+logLimit);
			alert('dateRange ='+dateRange);*/
			searchLog(logType, dateRange, empID, logLimit );
		}
	
}