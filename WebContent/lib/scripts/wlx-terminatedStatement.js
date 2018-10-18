$(document).ready(function() {
	$('#btn_print').attr('disabled', 'disabled');
	
	populateReviewPeriod(reviewItems, selectedReviewItem,count);
	buildRewards(rewardsStatements);

	$('[data-rel=tooltip]').tooltip();

	$("#btn_print").on('click',function(){goToPrintSelected();});
	//$('input:checkbox').on('click',function(){bindCheckBoxSelection(this);});

	$("#emp-search-btn").on('click', function() {
		$('#page-error-cntr').empty();
		var searchText = $('#empSearchValue').val();
		if(searchText==null ||searchText==''){
			return false;
		}else
			{
				searchTerminatedEmployee(searchText);
			}
	});

	$("#empSearchValue").bind('keypress',{}, function(event){
		if(event.which == 13 ){
			if($('#empSearchValue').val()!='')
			{
				$('#page-error-cntr').empty();
				searchTerminatedEmployee($('#empSearchValue').val());
			}
			else
			{
				return false;
			}
			event.preventDefault();
		}
	});
	
	$("#empSearchValue").on('keyup',{}, function(event){
		if($('#empSearchValue').val()=='')
			changeReviewPeriodDropDown();
	});
});

function populateReviewPeriod(reviewList, selectedReviewItem,count){
	var elem;
	var selected="";
	//var selectedReviewItem = getSelectedReviewItem(defaultReviewSelect);
	//var count = getCountPopulateReviewPerioed(defaultReviewSelect);
	for(var i=0; i<count; i++)
	{
		if(i<reviewList.length){
			elem = reviewList[i];
			if(selectedReviewItem==elem.reviewId)
				selected="selected";
			else
				selected="";
			$('#reviewSelect').append('<option id='+elem.reviewId+' value='+elem.reviewId+' '+selected+'>'+elem.reviewTitle+'</option>');
		}
		else
			return false;
	}

}

function getSelectedReviewItem(selectedItem){

	var entry = '';
	var selectedValue = '';
	for(var x in selectedItem)
	{
		entry = selectedItem[x];
		if(x == "STMNT_DFLT_REV")
			selectedValue = entry;
	}

	return selectedValue;
}

function getCountPopulateReviewPerioed(selectedItem){

	var entry = '';
	var count = '';
	for(var x in selectedItem)
	{
		entry = selectedItem[x];
		if(x == "STMNT_YRS_REV")
			count = entry;
	}

	return count;
}

function bindCheckBoxSelection(element)
{

	$('#page-error-cntr').empty();
	var status=[];
	$('#table_report tbody tr').each(function(){
		var statusId =  $(this).find($('input:checkbox:checked')).attr('statusId') || '';
		if($('input:checkbox:checked').length>0){
			status.push(statusId);
			$('#btn_print').removeAttr('disabled');
			var result = $.inArray('2', status);
			if(result >= 0)
			{
				$('#btn_release').attr('disabled', 'disabled');
			}
			else
			{
				$('#btn_release').removeAttr('disabled');
			}
		}
		else
		{
			$('#btn_print').attr('disabled', 'disabled');
			$('#btn_release').attr('disabled', 'disabled');
		}
	});
}

function buildRewards (data) {

	var tbody = [];

	for(var x in data)
	{
		var entry = data[x];
		tbody.push('<tr>\n');
		tbody.push('<td class="center">');
		tbody.push('<label><input type="checkbox" name="rewardsBox"  empId="'+entry.empId+'"  statusId="0" value="' + x + '"  ><span class="lbl"></span></label></td>\n');
		tbody.push('			<td><!--' +entry.lastName + ', '+ entry.firstName+ '-->' + entry.lastName + ', '+ entry.firstName+'</td>\n');
		tbody.push('</tr>\n');
	}
	$('#table_report tbody').html(tbody.join(''));

	var table = $('#table_report');

	if(isDataTable(table[0]))
	{
		table.dataTable().fnClearTable(false);
		table.dataTable().fnDestroy();
	}

	table.dataTable({
		"iDisplayLength": 20,
		"aLengthMenu": [[10, 20, 25, 50, -1], [10, 20, 25, 50, 100]],
		"aoColumns": [
			{ "bSortable": false,"sWidth": '5%' },
			null
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
			/*if(statusId!='3' && statusId!='5' && statusId!=2)
			{
				statusNotReady = true;
				html.push('<div class="alert alert-error">');
				html.push('	<button type="button" class="close" data-dismiss="alert"><i class="icon-remove"></i></button>');
				html.push('	<strong>'+langMap.js_wlx_statement_htm_err+'</strong>');
				html.push(langMap.js_wlx_statement_htm_text+'<br />');
				html.push('</div>');
				$('#page-error-cntr').html(html.join(''));
			}*/
			//if(!statusNotReady){
				var data = {};
				data[req_pdf_url]	= goToPrintStatementURL;
				data[req_emp_id] = input.attr('empId');
				/*data[req_emp_name] = input.attr('empName');
				data[req_emp_pos_title] = input.attr('empPosTitle');*/
				data[req_emp_status] = input.attr('statusId');
				data[req_is_admin] = "true";
				loadPDF(data);
			//}
		}
	});

}