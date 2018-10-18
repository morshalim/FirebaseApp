var releaseStatementConfirm = "";
$(document).ready(function() {
	$('#btn_release').attr('disabled', 'disabled');
	$('#btn_print').attr('disabled', 'disabled');
	if(!IS_EMP)
		buildRewards(rewardsStatements);
		populateLanguages(localesList);
   /* $("#printInLanguage").click(function() {
        if ($(this).is(":checked")) { 
           $("#languageDropdown").prop("disabled", false);
        } else {
           $("#languageDropdown").prop("disabled", true);  
        }
     });*/

	$('[data-rel=tooltip]').tooltip();
	$("#btn_release").on('click', function() {
		/*bootbox.confirm(langMap.js_wlx_statement_htm_sure, function(result) {
			if(result) {
				releaseEmpStatement();
			}

		});*/

		/*bootbox.dialog(releaseStatementConfirm, [{
		    "label" :  langMap.crt_bootbox_ok,
		    "class" : "btn-primary",
		    "callback": function() {
		    	releaseEmpStatement();
		    }
		}, {
			"label" :  langMap.crt_bootbox_cancel,
		    "class" : "btn",
		    "callback": function() {
		    	$("#modal-statement-release").modal('hide');
		    }
		}]);*/
		
		bootbox.dialog({message:releaseStatementConfirm, 
			buttons:{
				"success" :
				{
					"label" :  langMap.crt_bootbox_ok,
					"className" : "btn btn-sm btn-primary",
					"callback": function() {
						releaseEmpStatement();
					}
				}, 
				"danger" :
				{
					"label" :  langMap.crt_bootbox_cancel,
					"className" : "btn btn-sm",
					"callback": function() {
						$("#modal-statement-release").modal('hide');
					}
				}
			}
		});
		
	});

	$("#btn_print").on('click',function(){goToPrintSelected();});
	//$('input:checkbox').on('click',function(){bindCheckBoxSelection(this);});

	$("#emp-search-btn").on('click', function() {
		$('#page-error-cntr').empty();
		var searchText = $('#empSearchValue').val();
		if(searchText==null ||searchText==''){
			return false;
		}else
			{
				if(adminFlag != null && adminFlag !=''){
						searchEmployee(searchText," ",adminFlag);
				}else{
					searchEmployee(searchText);
				}

			}
	});

	$("#reviewSelect").on('change',function(){
		if(adminFlag == null  || adminFlag =='')
			changeReviewPeriod();
	});

	$("#empSearchValue").bind('keypress',{}, function(event){
		if(event.which == 13 ){
			if($('#empSearchValue').val()!='')
			{
				$('#page-error-cntr').empty();
				if(adminFlag != null && adminFlag !=''){
					searchEmployee($('#empSearchValue').val()," ",adminFlag);
				}
				else
					searchEmployee($('#empSearchValue').val());
			}
			else
			{
				return false;
			}
			event.preventDefault();
		}
	});
	$("#empSearchValue").on('keyup',{}, function(event){
		if(($('#empSearchValue').val()=='') && (adminFlag == null || adminFlag ==''))
			changeReviewPeriod();
	});
	populateReviewPeriod(reviewItems, selectedReviewItem,count);

	releaseStatementConfirm = $('#modal-statement-release').html();
	$('#modal-statement-release').remove();

	if(adminFlag!=null && adminFlag!='')
	{
		$('#reload-budget-btn').hide();
		$('#upOneLevelBtn').hide();
		$('#btn_release').hide();
	}
	else
	{
		$('#reload-budget-btn').show();
		$('#upOneLevelBtn').show();
		$('#btn_release').show();
	}
	
	$('#selectALL').on('click',function(){
		if($(this).is(':checked'))
			selectAll();
		else
			unSelectAll();
	});
});

function populateLanguages(data){
	var html=[];
	html.push('<option value="">'+langMap.js_option_employee_language+'</option>');
	$.each(data,function(index,item){

		html.push('<option value="'+item.LOCALE+'">'+item.LANGUAGE+'</option>');
	});
	$('#languageDropdown').html(html.join(''));
}

function populateReviewPeriod(reviewList, selectedReviewItem,count){
	var elem;
	var selected="";
		
	$.each(reviewList,function(index,item){
		if(selectedReviewItem==item.reviewId)
			selected="selected";
		else
			selected="";
		if(item.showStatements)
			$('#reviewSelect').append('<option id='+item.reviewId+' value='+item.reviewId+' '+selected+'>'+item.reviewTitle+'</option>');
	});

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
		var downArrow = '';
		var disabled = '';
		tbody.push('<tr>\n');
		tbody.push('<td class="center">');
		if(entry.status != 3 && entry.status !=2)
			disabled = "disabled";
		/*if(adminFlag)
			disabled = "";*/
		tbody.push('<label><input type="checkbox" '+disabled+' name="rewardsBox" reviewId="' + entry.reviewId + '" empName="'+entry.name+'" empId="'+entry.pernr+'" empPosTitle="'+entry.posTitle+'" statusId="'+entry.status+'" value="' + x + '" terminated="'+entry.terminated+'" class="ace"><span class="lbl"></span></label></td>\n');
		//if(entry.count > 0)
		if(entry.mgr)
			downArrow = '<i class="fa fa-arrow-down blue" onclick="getDrillDownStatement(\''+entry.pernr+'\', $(\'#reviewSelect\').val())"></i>';
		else
			downArrow ='';
		if((entry.status == '3' || entry.status =='5' || entry.status =='2'))
			tbody.push('			<td><!--' +entry.name+ '--><a href="#" reviewId="' + entry.reviewId + '" empName="'+entry.name+'" empId="'+entry.pernr+'" empPosTitle="'+entry.posTitle+'" statusId="'+entry.status+'" value="' + x + '" terminated="'+entry.terminated+'" onclick="goToPrintSelected(this)">' + entry.name +((entry.terminated)?'&nbsp;<img style="padding-bottom:3px;" src="../images/terminated.png"></img>':'')+ '</a>&nbsp;&nbsp;'+downArrow+'</td>\n');
		else
			tbody.push('			<td><!--' +entry.name+ '-->' + entry.name +((entry.terminated)?'&nbsp;<img style="padding-bottom:3px;" src="../images/terminated.png"></img>':''+'&nbsp;&nbsp;'+downArrow)+ '</td>\n');
		tbody.push('			<td>' + entry.pernr + '</td>\n');
		tbody.push('			<td class="">' + ((entry.posTitle == null)?'':entry.posTitle) + '</td>\n');
		/*tbody.push('			<td>' + ((entry.status == '0'|| entry.status =='1') ? '<span class="label label-important">'+langMap.js_wlx_statement_htm_not_ready+'</span>' : ((entry.status == '3')?'<span class="label label-warning">'+langMap.js_wlx_statement_htm_ready+'</span>':'<span class="label label-success">'+langMap.js_wlx_statement_htm_released+'</span>')) + '</td>\n');*/
		if(entry.status == '0')
			tbody.push('			<td>' +'<span class="label label-important">'+langMap.js_wlx_statement_htm_not_eligible+'</span>'+'</td>\n');
		else if(entry.status == '1')
			tbody.push('			<td>' +'<span class="label label-warning">'+langMap.js_wlx_statement_htm_not_ready+'</span>'+'</td>\n');
		else if(entry.status == '2')
			tbody.push('			<td>' +'<span class="label label-success">'+langMap.js_wlx_statement_htm_ready+'</span>'+'</td>\n');
		else if(entry.status == '3')
			tbody.push('			<td>' +'<span class="label label-success">'+langMap.js_wlx_statement_htm_released+'</span>'+'</td>\n');
		else
			tbody.push('			<td>'+' '+'</td>\n');
		tbody.push('		</tr>\n');
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
			{ "bSortable": false,"sWidth": '5%'},
			null, null , null, { "bSortable": false }
		],
		"autoWidth": false,
		"aaSorting": [[ 1, "asc" ]],
		"oLanguage": dataTableLang,
		"fnDrawCallback":function (oSettings) {$('input[name=rewardsBox]:checkbox').on('click',function(){bindCheckBoxSelection(this);});}
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

function goToPrintSelected(ele) {
	var statusNotReady = false;
	var isIE = false;
	 var ua = window.navigator.userAgent;
	  var msie = ua.indexOf ( "MSIE " );
	  if ( msie > 0 || navigator.userAgent.match(/Trident\/7\./))      // If Internet Explorer, return version number
			isIE = true;
		 //return parseInt (ua.substring (msie+5, ua.indexOf (".", msie )))

	$('#table_report tbody tr').each(function(){

		if($(this).find(':checkbox:checked').length>0 || ele !=undefined)
		{
			var input = $(this).find(':checkbox:checked');
			if($(ele).length>0)
				input = $(ele);
			var statusId = input.attr('statusId');
			var html=[];
			if(!adminFlag && (statusId!='3' && statusId!='5' && statusId!=2))
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
				var language = '';
			        /*if ($("#printInLanguage").is(":checked"))*/
			     language = $('#languageDropdown option:selected').val()!=undefined?$('#languageDropdown option:selected').val():"";
				var data = {};
				data[req_pdf_url]	= goToPrintStatementURL;
				data[req_emp_id] = input.attr('empId');
				data[req_emp_name] = input.attr('empName');
				data[req_emp_pos_title] = input.attr('empPosTitle');
				data[req_emp_status] = input.attr('statusId');
				data[req_is_admin] = input.attr('terminated');
				data[req_review_id] = $('#reviewSelect option:selected').val();
				data[req_language_selected] = language;
				if(isIE){
				var url =data[req_pdf_url]+"?"+req_emp_id+"="+data[req_emp_id]+
						"&"+req_emp_name+"="+data[req_emp_name]+
						"&"+req_emp_pos_title+"="+encodeURIComponent(data[req_emp_pos_title])+
						"&"+req_emp_status+"="+data[req_emp_status]+
						"&"+req_is_admin+"="+data[req_is_admin]+
						"&"+req_review_id+"="+data[req_review_id]+
						"&"+req_language_selected+"="+data[req_language_selected];
					window.open(url,"_blank");
				}
				else{
					loadPDF(data);
					delay(500);
				}
			}
		}
		if($(ele).length>0)
			return false;
	});
}


//time arg is in milliseconds
function delay(time) {
  var d1 = new Date();
  var d2 = new Date();
  while (d2.valueOf() < d1.valueOf() + time) {
    d2 = new Date();
  }
}

function goBack()
{
	var empId = $('#upOneLevelBtn').attr('mgrId');
	var mgrId;
	var list = empId.split('~');
	for(var i=list.length;i>0;i--){
		if(list[i-2]!=null && list[i-2]!=''){
			mgrId = list[i-2];
			break;
		}
		else{
			mgrId = list[i-1];
			break;
		}
	}
	var onelevelupId = empId.replace(empId.substring(empId.lastIndexOf('~')),"");
	if(onelevelupId.indexOf('~')==-1)
		$('#upOneLevelBtn').attr('disabled','disabled');
	$('#upOneLevelBtn').attr('mgrId',onelevelupId);
	getDrillDownStatement(mgrId,$('#reviewSelect').val(),true);
}

function selectAll(){
	$('input[name=rewardsBox]:not(":disabled")').each(function(){
		$(this).prop('checked',true);
	});
	bindCheckBoxSelection();
}

function unSelectAll(){
	$('input[name=rewardsBox]').each(function(){
		$(this).removeAttr('checked');
	});
	bindCheckBoxSelection();
}