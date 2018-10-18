var myTeamMakeProxy = "";
var currEmpId;
var currName = "";
var orgtree;
var viewId;
var userDetails;
$(document).ready(function() {
	orgtree = $('#organizationtree').html();
	$('#organizationtree').remove();
	//pushPlanYearDropDown(planYearList);
	getDirectReports(directReports);
	if(empName!=null)
		$('.page-header h1').append(' - '+empName);

	myTeamMakeProxy = $('#modal-my-team-make-proxy').html();
	$('#modal-my-team-make-proxy').remove();
	$('#OrgTab').on('click',{self:this},function(){
		getProfile(currEmpId, currName, true);
	});
	
	buildViewsList(views);
	

	var current_poll_interval = setInterval(currentPoll, 100);

	function currentPoll() {
		if(typeof($('#empSearchInput').attr('empId')) != 'undefined' && $('#empSearchInput').attr('empId') != '')
			$('#searchProfileButton').removeClass('disabled')
		else
			$('#searchProfileButton').addClass('disabled')
	    // ... whatever you want in here ...
	    //'stopCurrentPolling()
	}
	
	
	$('#viewsDD li a[viewId]').on('click', {self:this}, function(e) {
	
		viewId = $(e.target).attr('viewId');
		$('#viewsCntr div[viewCntr]').hide();
		getView(currEmpId, viewId);
	});
});

function buildViewsList(views){
	var li = [];
	var topLevel = ""
	for(var x = 0; x < views.length; x++) {
		var view = views[x];
		if(topLevel != view.categoryId) {
			
			if(topLevel != "") {
				li.push('	</ul>');
				li.push('</li>');
			}
			
			topLevel = view.categoryId;
			
			li.push('<li class="dropdown-hover">');
			li.push('	<a href="#" tabindex="-1" class="clearfix">');
			li.push('		<span class="pull-left">' + view.category + '</span>');
			li.push('		<i class="ace-icon fa fa-caret-right pull-right"></i>');
			li.push('	</a>');
			li.push('	<ul class="dropdown-menu dropdown-primary">');
		}
		
		li.push('	<li><a href="#" tabindex="-1" viewId="' + view.code + '">' + view.dataView + '</a></li>');	
		
	}
	
	if(topLevel != "") {
		li.push('	</ul>');
		li.push('</li>');
	}
	
	$('#viewsDD').html(li.join(''));

}

function getEmpProfileFromSearch(){
	if($('#empSearchInput').val() != '') {
		var empId = $('#empSearchInput').attr('empId');
		var name = $('#empSearchInput').val().split(',')[0]
		getProfile(empId, name, true);
	}
}

function getDirectReports(directReports)
{
	if(directReports!=null && directReports!=''){
		buildDirectReports(directReports);
		var element = directReports[0];
		var empId = element.pernr;
		$('#planYearId').attr('empId',empId);
		var empname = element.firstName+' '+element.lastName;
		viewId = 'REPORTING_STRUCTURE';
		getProfile(empId, empname, true);
	}else{

		var html = [];
		$('#loading').empty();
		$('#employeeProfile').empty();
		showError(langMap.jsp_myteam_No_Records_Found_msg,'rowContent',false);
	}
}

function pushPlanYearDropDown(planYearList){
	var planId="2015";
	var html=[];
	if(planYearList!=null && planYearList!="" && planYearList.length>0){
		for(var index=0;index<planYearList.length;index++){
			var ele = planYearList[index];
			if(ele.planYear==planId)
				html.push('<option value='+ele.planYear+' selected>'+ele.planYear+'</option>');
			else
				html.push('<option value='+ele.planYear+'>'+ele.planYear+'</option>');

		}
	}
	$('#planYearId').html(html.join(''));
}

function buildDirectReports(directReports){

	var html=[];
	var elem;
	for(var i=0; i<directReports.length; i++){
		elem = directReports[i];
		var empName = elem.firstName+' '+elem.lastName;
		html.push('<div id="'+elem.pernr+'" rel="toggleCss" class="well">');
		html.push('<h4>');
		html.push('<a empId="'+elem.pernr+'" empName="'+empName+'"onclick="getEmpProfile(this);" class="darker">'+elem.firstName+' '+elem.lastName+'</a>&nbsp;');
		if(elem.email!=null && elem.email!="")
			html.push('<a href="mailto:'+elem.email+'"><i class="fa fa-envelope blue" data-rel="popover" data-trigger="hover" data-placement="left" title='+langMap.js_my_team_email_employee_title+'></i></a>&nbsp;');
		if(elem.mgrStr=="1")
			html.push('<i class="fa fa-arrow-down blue" data-rel="popover" data-trigger="hover" data-placement="left" title='+langMap.js_my_team_email_employee_reports_title+' empId="'+elem.pernr+'" empName="'+elem.firstName+' '+elem.lastName+'" onclick="getDirectReportsForEmp(this)"></i>');
		if(isProxyAccess)
			html.push('&nbsp;<i class="fa fa-bookmark" rel="proxyLink" empId="'+elem.pernr+'" empFirstName="'+elem.firstName+'" empLastName="'+elem.lastName+'"></i>');
		if(elem.terminated==true)
			html.push('&nbsp;<img style="padding-bottom:4px;" src="../images/terminated.png">');
		html.push('</h4>');
		if(elem.posTitle !=null && $.trim(elem.posTitle)!='')
			html.push(elem.posTitle+'</br>');
		if(elem.departmentName !=null && $.trim(elem.departmentName) !='')
			html.push(elem.departmentName+'</br>');
		html.push('</div>');

	}
	$('#directReports').html(html.join(''));

	$('i[rel=proxyLink]').on('click', function(){
		loadEmpProxy(this, myTeamMakeProxy);
	});
}

function getEmpProfile(ele){

	var empId = $(ele).attr('empId');
	$('#planYearId').attr('empId',empId);
	//$('#planYearId').val("2014")
	var name = $(ele).attr('empName');
	getProfile(empId, name, true);
}
function getProfile(empId, name,getOrg){
	currEmpId = empId;
	currName = name;
	var id = $(".tab-content div.active").attr("id");
	getmyTeamDelegateProfile(empId,$('#planYearId').val(), (id == 'Org' || getOrg ? 'reporting': null));
	toggleCss(empId);
	$('#delegateName').html('<i class="fa fa-user"></i> '+name);
	$("body,html").scrollTop(0);

}

function getView(empId, viewId){
	currEmpId = empId;
	var id = $(".tab-content div.active").attr("id");
	getMyTeamView(empId,'2015', viewId);
	//toggleCss(empId);
	//$('#delegateName').html('<i class="fa fa-user"></i> '+name);
	$("body,html").scrollTop(0);

}

function getPerformancePlans(){
	var empId = $('#planYearId').attr('empId');
	var planYear = $('#planYearId').val();
	getMyTeamPerformancePlans(empId,planYear);
}

function getMyTeamPerformancePlansSuccess(data){
	if(data !=null && data.performance!=null)
		pushPerformancePlanGoals(data.performance.goalPlans);
	if(data !=null && data.performance!=null)
		pushPerformancePlanReviews(data.performance.performanvceReview);

}

function populateDelegateuserProfile(data) {
	
	$('#viewsCntr div[viewCntr][rel="'+viewId+'"]').show();
	
	/*if(data !=null && data.profile!=null)
		pushProfile(data.profile.user, data.profile.workHistory);
	
	if(viewId == 'REPORTING_STRUCTURE') {
		$('#viewsCntr .widget-title').html(langMap.JSP_MY_TEAM_REPORTING_STRUCTURE_HEADER);
		pushReportingStructure(data.viewData);
	}
	else if(viewId == 'WORK_HISTORY') {
		$('#viewsCntr .widget-title').html(langMap.JSP_MY_TEAM_WORK_HISTORY_HEADER);
		pushJobHistory(data.viewData);
	}*/
	
	
	if(data !=null && data.profile!=null)
		pushProfile(data.profile.user, data.profile.workHistory);
	var viewId = 'REPORTING_STRUCTURE';
	if(viewId == 'REPORTING_STRUCTURE') {
		$('#viewsCntr .widget-title').html(langMap.JSP_MY_TEAM_REPORTING_STRUCTURE_HEADER);
		pushReportingStructure(data.organization);
	}
	else if(viewId == 'WORK_HISTORY') {
		$('#viewsCntr .widget-title').html(langMap.JSP_MY_TEAM_WORK_HISTORY_HEADER);
		pushJobHistory(data.profile.workHistory);
	}
	
	/*if(data !=null && data.profile!=null)
		pushProfile(data.profile.user, data.profile.workHistory);
	if(data !=null && data.profile!=null)
		pushJobHistory(data.profile.workHistory);
	pushCompHistory(data.compHistory);
	pushReportingStructure(data.organization);
	if(data !=null && data.performance!=null)
		pushPerformanceGoalPlanHistory(data.performance.history);
	if(data !=null && data.performance!=null)
		pushPerformancePlanGoals(data.performance.goalPlans);
	if(data !=null && data.performance!=null)
		pushPerformancePlanReviews(data.performance.performanvceReview);*/
}

function populateOrgTab(data){
	if(data !=null && data.organization!=null)
		pushReportingStructure(data.organization);
}

function pushProfile(usrDetails, jobHistory){

	var html=[];
	userDetails = usrDetails;
	var currency = defaultCurrency;
	if(userDetails!=null){
		var currentPostion = $.grep(jobHistory, function(e){ return e.positionId == userDetails.positionId; })[0];
		
		if(userDetails.customerCode != null && userDetails.customerCode != 'bms') {
			html.push('<tr>');
			html.push('<td class="tablePadding">'+langMap.js_my_team_table_col_name+'</td>');
			html.push('<td class="tablePadding">'+userDetails.effectiveFirstName+' '+userDetails.effectiveLastName+'</td>');
			html.push('<td width="75px;"></td>');
			html.push('<td class="tablePadding">'+langMap.js_my_team_table_col_personnel_number+'</td>');
			html.push('<td class="tablePadding">'+userDetails.pernr+'</td>');
			html.push('</tr>');
			html.push('<tr>');
			html.push('<td class="tablePadding">'+langMap.js_my_team_table_col_bkid+'</td>');
			html.push('<td class="tablePadding">'+userDetails.userId+'</td>');
			html.push('<td width="75px;"></td>');
			html.push('<td class="tablePadding">'+langMap.js_my_team_table_col_position_title+'</td>');
			html.push('<td nowrap="nowrap" class="tablePadding">'+userDetails.posTitle+'</td>');
			html.push('</tr>');
			html.push('<tr>');
			html.push('<td class="tablePadding">'+langMap.js_my_team_table_col_function+'</td>');
			html.push('<td nowrap="nowrap" class="tablePadding">'+userDetails.functionName+'</td>');
			html.push('<td width="75px;"></td>');
			html.push('<td class="tablePadding">'+langMap.js_my_team_table_col_time_in_position+'</td>');
			html.push('<td class="tablePadding" width="75">'+((currentPostion != null) ? getTimeinPosition(currentPostion.startDate, null) : '')+'</td>');
			html.push('</tr>');
			html.push('<tr>');
			html.push('<td class="tablePadding">'+langMap.js_my_team_table_col_time_in_company+'</td>');
			if(userDetails.hireDate != null){
				//var hireDate;
				//hireDate = getDateFormatForDisplay(userDetails.hireDate);
				html.push('<td nowrap="nowrap" class="tablePadding">'+getTimeinPosition(userDetails.hireDate, null)+'</td>');
			}
			else
				html.push('<td class="tablePadding" width="75"></td>');		
			html.push('<td width="75px;"></td>');		
			html.push('<td class="tablePadding">'+langMap.js_my_team_table_col_supervisor+'</td>');
			if(userDetails.managerFirstName!=null)
				html.push('<td nowrap="nowrap" class="tablePadding">'+userDetails.managerFirstName);
			else
				html.push('<td class="tablePadding">');
			if(userDetails.managerLastName!=null)
				html.push(' '+userDetails.managerLastName);
			if((userDetails.managerFirstName!=null || userDetails.managerLastName!=null) && isProxyAccess)
				html.push('&nbsp;<i class="fa fa-bookmark" rel="proxyMgrLink" empId="'+userDetails.managerPernr+'" empFirstName="'+userDetails.managerFirstName+'" empLastName="'+userDetails.managerLastName+'"></i></td>');
			else
				html.push('</td>');
			html.push('<tr>');
			html.push('</tr>');
			html.push('<td class="tablePadding">'+langMap.js_my_team_table_col_level+'</td>');
			html.push('<td class="tablePadding">'+userDetails.level+'</td>');	
			html.push('</tr>');
		}
		else {
			html.push('<tr>');
			html.push('<td class="tablePadding">'+langMap.js_my_team_table_col_name+'</td>');
			html.push('<td class="tablePadding">'+userDetails.effectiveFirstName+' '+userDetails.effectiveLastName+'</td>');
			html.push('<td width="75px;"></td>');
			html.push('<td class="tablePadding">'+langMap.js_my_team_table_col_bkid+'</td>');
			html.push('<td class="tablePadding">'+userDetails.userId+'</td>');
			html.push('</tr>');
			html.push('<tr>');
			html.push('<td class="tablePadding">'+langMap.js_my_team_table_col_position_title+'</td>');
			html.push('<td nowrap="nowrap" class="tablePadding">'+userDetails.posTitle+'</td>');
			html.push('<td width="75px;"></td>');
			html.push('<td class="tablePadding">'+/*langMap.js_my_team_table_col_time_in_company+*/'</td>');
			if(userDetails.hireDate != null){
				//var hireDate;
				//hireDate = getDateFormatForDisplay(userDetails.hireDate);
				html.push('<td nowrap="nowrap" class="tablePadding">'+/*getTimeinPosition(userDetails.hireDate, null)+*/'</td>');
			}
			else
				html.push('<td class="tablePadding" width="75"></td>');
			html.push('</tr>');
			html.push('<tr>');
			html.push('<td class="tablePadding">'+langMap.js_my_team_table_col_supervisor+'</td>');
			if(userDetails.managerFirstName!=null)
				html.push('<td nowrap="nowrap" class="tablePadding">'+userDetails.managerFirstName);
			else
				html.push('<td class="tablePadding">');
			if(userDetails.managerLastName!=null)
				html.push(' '+userDetails.managerLastName);
			if((userDetails.managerFirstName!=null || userDetails.managerLastName!=null) && isProxyAccess)
				html.push('&nbsp;<i class="fa fa-bookmark" rel="proxyMgrLink" empId="'+userDetails.managerPernr+'" empFirstName="'+userDetails.managerFirstName+'" empLastName="'+userDetails.managerLastName+'"></i></td>');
			else
				html.push('</td>');
			html.push('<td width="75px;"></td>');
			html.push('<td class="tablePadding">'+langMap.js_my_team_table_col_level+'</td>');
			html.push('<td class="tablePadding">'+userDetails.level+'</td>');	
			html.push('</tr>');
		}
	}
	$('#profile_table').html(html.join(''));

	$('i[rel=proxyMgrLink]').on('click', function(){
		loadEmpProxy(this, myTeamMakeProxy);
	});
}

function pushCompHistory(data){
	var tbody = [];
	var vc=0;
	var totalComp=0;

	//tbody.push(langMap.wrk_wrksheet_list_comp_history);
	tbody.push('<br><table class="table table-striped table-bordered table-hover">');
	tbody.push('<thead>');
	tbody.push('<tr>');
	tbody.push('<th>'+langMap.js_my_team_table_header_start_date+'</th>');
	tbody.push('<th>'+langMap.js_my_team_table_header_end_date+'</th>');
	tbody.push('<th>'+langMap.wrk_wrksheet_table_header_base_salary+'</th>');
	tbody.push('<th>'+langMap.js_my_team_table_header_grade+'</th>');
	tbody.push('</tr>');
	tbody.push('</thead>');
	tbody.push('<tbody>');

	if(data!=null && data!=''){
		var html = [];
		for(var x in data)
		{

			var entry = data[x];
			var basicSalaryCurrency = entry.basicSalaryCurrency || defaultCurrency;
			
			html.push('<tr style="border-bottom: 1px solid #dcdcdc;">');
			html.push('<td>'+getDateFormatForDisplay(entry.startDate)+'</td>');
			html.push('<td>'+getDateFormatForDisplay(entry.endDate)+'</td>');
			if(entry.basicSalary == 0)
				html.push('<td >'+langMap.planSheet_planDataNotFound+'</td>');
			else
				html.push('<td >'+$.formatNumber(entry.basicSalary, {format:getAmountFormat(basicSalaryCurrency), locale:locale})+' ' + basicSalaryCurrency + '</td>');
			
			html.push('<td >'+ entry.grade + '</td>');
			html.push('</tr>');

		}
		tbody.push(html.join(''));
		if(html.length==0)
		{
			tbody.push('<tr style="border-bottom: 1px solid #dcdcdc;">');
			tbody.push('<td colspan="7">'+langMap.js_budget_html_html_strong+'</td>');
			tbody.push('</tr>');
		}
	}
	else
	{
		tbody.push('<tr style="border-bottom: 1px solid #dcdcdc;">');
		tbody.push('<td align="center" colspan="7">'+langMap.js_emp_profile_no_record_found+'</td>');

		tbody.push('</tr>');
	}

	tbody.push('</tbody>');
	tbody.push('</table>');
	$('#table_comp_history').html(tbody.join(''));

}
function toggleCss(empId){
	$('div[rel=toggleCss]').attr('class' , 'well');
	$('#'+empId).attr('class','well selind');
}

function pushJobHistory(data){

	var tbody = [];

	tbody.push('<thead>');
	tbody.push('	<tr>');
	tbody.push('		<th>'+langMap.js_my_team_table_header_position+'</th>');
	tbody.push('		<th>'+langMap.js_my_team_table_header_position_title+'</th>');
	tbody.push('		<th>'+langMap.js_my_team_table_header_organization+'</th>');
	tbody.push('		<th>'+langMap.js_my_team_table_header_begin_date+'</th>');
	tbody.push('	</tr>');
	tbody.push('</thead>');
	tbody.push('<tbody>');
	
	if(data != null && data.length){

		for(var x in data){
			
			var entry = data[x];
			
			tbody.push('<tr style="border-bottom: 1px solid #dcdcdc;">');
			tbody.push('	<td >'+entry.positionId+'</td>');
			tbody.push('	<td >'+entry.position+'</td>');
			tbody.push('	<td >'+entry.org+'</td>');
			tbody.push('	<td >'+getDateFormatForDisplay(entry.startDate)+'</td>');
			tbody.push('</tr>');
		}
	}
	else {
		
		tbody.push('<tr style="border-bottom: 1px solid #dcdcdc;">');
		tbody.push('	<td align="center" colspan="4">'+langMap.js_emp_profile_no_record_found+'</td>');
		tbody.push('</tr>');
	}
	tbody.push('</tbody>');

	var table = $('#table_job_history_table');

	if(isDataTable(table[0]))
	{
		table.dataTable().fnClearTable(false);
		table.dataTable().fnDestroy();
	}
	$('#table_job_history_table').html(tbody.join(''));
	if(data!=null && data!=''){
		table.dataTable({
			"iDisplayLength": 20,
    		"aLengthMenu": [[10, 20, 25, 50, -1], [10, 20, 25, 50, 100]],
			"aoColumns": [
				null, null, null,null
			],
			"oLanguage": dataTableLang
		});
	}
}

function pushReportingStructure(data){
	var tbody=[];

	if(data!=null){
		for(var index=0;index<data.length;index++){
			tbody.push('<tr>');
			tbody.push('<td>'+data[index].firstName+' '+(data[index].lastName?data[index].lastName:"")+'</td>');
			tbody.push('<td>'+(data[index].posTitle?data[index].posTitle:"")+'</td>');
			tbody.push('<td>'+(data[index].departmentName?data[index].departmentName:"")+'</td>');
			//tbody.push('<td>'+(data[index].level?data[index].level:"")+'</td>');
			if(data[index].email!=null && data[index].email!="")
				tbody.push('<td><a href="mailto:'+data[index].email+'"><i class="ace-icon fa fa-envelope blue" data-rel="popover" data-trigger="hover" data-placement="left" title="Email Employee"></i></a></td>');
			else
				tbody.push('<td></td>');
				tbody.push('</tr>');
		}

	}
	$('#reportingStructure tbody').html(tbody.join(''));

}

function pushPerformanceGoalPlanHistory(data){
	var tbody=[];

	if(data!=null && data.length){
		for(var index=0;index<data.length;index++){
			tbody.push('<tr>');
			tbody.push('<td>'+data[index].planName+'</td>');
			tbody.push('<td>'+data[index].planDescription+'</td>');
			tbody.push('<td>'+$.formatNumber((data[index].achievement*100), {format:currencyFormat, locale:locale})+' %</td>');

			tbody.push('</tr>');
		}

	} else {
		tbody.push('<tr>');
		tbody.push('<td colspan="3">'+langMap.js_my_team_historical_achievements+'</td>');
		tbody.push('</tr>');		
	}
		
	$('#goalplanHistory tbody').html(tbody.join(''));

}

function pushPerformancePlanGoals(data){
	var tbody=[];

	if( data && data!=null && data.length > 0){
		for(var index=0;index<data.length;index++){
			tbody.push('<tr>');
			tbody.push('<td>'+data[index].planDescription+'</td>');
			tbody.push('<td>'+data[index].planType+'</td>');
			if(data[index].startDate != null)
				tbody.push('<td>'+getDateFormatForDisplay(data[index].startDate)+' </td>');
			else
				tbody.push('<td></td>');
			if(data[index].endDate != null)
				tbody.push('<td>'+getDateFormatForDisplay(data[index].endDate)+' </td>');
			else
				tbody.push('<td></td>');
			tbody.push('<td>'+data[index].type+' </td>');

			tbody.push('</tr>');
		}

	}else{
		tbody.push('<tr>');
		tbody.push('<td colspan="5">'+langMap.js_my_team_selected_year+'</td>');
		tbody.push('</tr>');
	}
	$('#goalplan tbody').html(tbody.join(''));

}

function pushPerformancePlanReviews(data){
	var tbody=[];

	if( data && data!=null && data.length > 0){
		for(var index=0;index<data.length;index++){
			tbody.push('<tr>');
			tbody.push('<td><a href="#">'+data[index].period+'</a></td>');
			tbody.push('<td>'+data[index].position+'</td>');
			if(data[index].startDate != null)
				tbody.push('<td>'+getDateFormatForDisplay(data[index].startDate)+' </td>');
			else
				tbody.push('<td></td>');
			if(data[index].endDate != null)
				tbody.push('<td>'+getDateFormatForDisplay(data[index].endDate)+' </td>');
			else
				tbody.push('<td></td>');
			tbody.push('<td>' + ((data[index].status == '0'|| data[index].status =='1' || data[index].status =='4') ? '<span class="label label-important">'+langMap.my_statements_text_not_ready+'</span>' : ((data[index].status == '3' || data[index].status =='5')?'<span class="label label-success">'+langMap.my_statements_text_ready+'</span>':'<span class="label label-success">'+langMap.my_statements_text_released+'</span>')) + '</td>\n');


			tbody.push('</tr>');
		}

	}else{
		tbody.push('<tr>');
		tbody.push('<td colspan="5">'+langMap.js_my_team_selected_year+'</td>');
		tbody.push('</tr>');
	}
	$('#reviews tbody').html(tbody.join(''));

}

function getDirectReportsForEmp(ele)
{
	var pernr = $(ele).attr('empId');
	var name = $(ele).attr('empName');
	navigateToDirectReportsForEmp(pernr,name);
}

function goBack()
{
	history.back();
	return false;
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

function getTimeinPosition(fromDate,toDate){

	var hireDate = Date.parse(fromDate);
	var toDayDate = "";
	if(toDate!=null && toDate!="")
		toDayDate = Date.parse(toDate);
	else
		toDayDate = new Date();
	var tillYear =  toDayDate.getFullYear() - hireDate.getFullYear();
	var tillMonth = toDayDate.getMonth() - hireDate.getMonth();
	var year="";
	var month="";
	//$('#tillDate').text(tillYear +' Year  ' + (tillMonth+1) + ' Month');
	if(tillMonth.toString().indexOf('-')==-1){
		year = tillYear;
		month = tillMonth;
	}else{
		year = tillYear-1;
		month = tillMonth+12;
	}
		if(year==0 && month==0)
			return 'Less than a month';
		return year +' Year(s)  ' + (month) + ' Month(s)';

}
