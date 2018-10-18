/*function resetProxy()
{
	isProxy = false;
	isReset = true;
	refreshScope('D','X','','');
}*/

$(document).ready(function() {	

	if($("#selectTeamTrigger").length > 0)
	$("#selectTeamTrigger").fancybox({
		'transitionIn': 'none',
		'transitionOut': 'none',
		'enableEscapeButton': true,
		'scrolling': 'no',
		'titleShow': false,
		'overlayOpacity': .45,
		'overlayColor': '#000',
		'showNavArrows': false,
		'width': 600,
		'height': 'auto',
		'autoDimensions': false,
		'onClosed'	:
			function(selectedArray, selectedIndex, selectedOpts) {
				$('input[name="selectView"][defaultChecked]').attr('checked','checked');
			}		
	});	
	$('#emp-search-input').bind('keydown',function(event){
		//alert('nav-search-input : '+$('#nav-search-input').val());
		var key = event.keyCode;
		if(key == '13'){
			var searchKey = $('#emp-search-input').val();
			$.cookie('searchKey',$('#emp-search-input').val());
			if(searchKey==null ||searchKey==''){
				return false;
			}else{
				//window.location.href = getMyTeamDirectReports + req_emp_search_text + "=" + searchKey;			    
				//window.location.href = getMyTeamDirectReports + req_emp_search_text + "=" + searchKey;
				   /* var form = document.createElement("form");
				    document.body.appendChild(form);
				    form.method = "POST";
				    form.action = empSearchURL;
				    var element = document.createElement("INPUT");
				     element.name=req_emp_search_text
				     element.value = searchKey;
				     element.type = 'hidden'
				     form.appendChild(element);
				     form.submit();*/

				     $('#formEmployeeSearch').attr('action', empSearchURL);
					 $('#formEmployeeSearch').attr('method', 'POST');
					 $('#formEmployeeSearch').submit();
				//return false;
			}
		}
		return true;
	});
});


function popupHelp(url) {
    params = 'width=500'
    params += ', height=400'
    params += ', top=0, left=0'
    params += ', menubar=yes';
    params += ', fullscreen=no';
    params += ', resizable=yes';


    var newwin = window.open(url, '_help', params);
    if (window.focus) { newwin.focus() }
    return false;
}

function refreshPage(pernr)
{
	var url = window.location.toString();
	var pernrIndex = url.indexOf("&" + req_pernr);
	if(pernrIndex != -1)
		url =url.substring(0, pernrIndex);
	
	pernrIndex = url.indexOf("?" + req_pernr);
	if(pernrIndex != -1)
		url =url.substring(0, pernrIndex);	
	
	hashIndex = url.indexOf("#");
	if(hashIndex != -1)
		url =url.substring(0, hashIndex);	
		
	if(url.indexOf("?") == -1)	
		window.location = url + "?" + req_pernr + "=" + pernr;
	else
		window.location = url + "&" + req_pernr + "=" + pernr;
	
}

function refreshScope(sitem, resetOrg, org, pernr, nodeCollapse)
{
	showLoading();
	url = refreshScopeURL + "?" + req_scope + "=" + sitem + "&" + req_reset_org + "=" + resetOrg;
	if(org)
		url +="&" + req_org + "=" + org;
	if(pernr)
		url += "&" + req_proxy_pernr + "=" + pernr;
	if(nodeCollapse)
		url += "&" + req_node_collapse_list + "=" + nodeCollapse;
	/*if(showActionBtns)
		url += "&" + req_apprv_rej + "=X"+"&"+req_workitem_id+"="+workItemId;*/
	
	/*if(workItemId!='')
		url += "&"+req_workitem_id+"="+workItemId;*/
	if(isProxy)
		url += "&" + req_keep_proxy + "=X";
		
	if(isReset)
		url += "&" + req_reset_proxy + "=X";
		
	try
	{
		navigateTo(url, '_new');
	}catch(e)
	{
		closeLoading();
	}	
	
}

function loadPerfApp(app, name, pernr)
{
	var url = perfAppURL + "&" + req_app + "=" + app + "&" + req_chief_name + "=" + name + "&" + req_pernr + "=" + pernr;

		var winStr = 'location=0,status=1,scrollbars=1,width=1000,height=700,resizable=1';
		if(ECM_DEBUG)
			winStr = '';
		var newwin = window.open(url,'_newp', winStr);	
		if (window.focus) { newwin.focus() }	
}

function loadPerfAppInbox(url)
{

		var winStr = 'location=0,status=1,scrollbars=1,width=1000,height=700,resizable=1';
		if(ECM_DEBUG)
			winStr = '';
		var newwin = window.open(url,'_newi', winStr);	
		if (window.focus) { newwin.focus() }	
}

function refreshDashboardOrg(org)
{
	var url = refreshDashboardURL + "?" + req_change_org + "=" + org;
	window.location = url;
	
}

function refreshProxy()
{
	var url = refreshDashboardURL + "?" + req_keep_proxy + "=X";

	if(typeof(window.opener) == "undefined")
	{
		//do nothing
	}
	else
		window.opener.location = url;
	
}

function resetDashboard(url)
{
	if(!url)
		url = refreshDashboardURL;

	//if(typeof(window.opener) == "undefined")
	//{
		window.location.replace(url);
	//}
	/*else
	{
		window.opener.location = url;
		window.close();		
	}*/
	
}

function goToRewards()
{
	var url = pageContextPath+'/page/'+goToRewardsURL + "?" + req_org + "=" + proxyOrg;

	navigateTo(url, '_new');
	
}

function goToPlanActivation()
{
	var url = goToPlanActivationURL;

	navigateTo(url, '_new');
	
}


function goToBudgetMgmt(budgetId)
{
	var url = pageContextPath +'/page/'+goToBudgetMgmtURL + "?" + req_org + "=" + proxyOrg;
	
	if(budgetId)
		url += "&" + req_budget_id  + "=" + budgetId;
	
	navigateTo(url, '_new');
	
}

function getDownloadedRewards(crevi, pernrs)
{
	
	if(ECM_DEBUG)$.log ("START getDownloadedRewards");
	
	var url = getDownloadedRewardsURL + "?" + req_crevi + "=" + crevi + "&" + req_pernr + "=" + pernrs
	window.open(url);
	
	if(ECM_DEBUG)$.log ("END getDownloadedRewards");	
}

function getExcelExport(sitem)
{
	
	if(ECM_DEBUG)$.log ("START getExcelExport");
	
	var url = getExcelExportURL + "?" + req_scope + "=" + sitem;
	window.open(url);
	
	if(ECM_DEBUG)$.log ("END getExcelExport");	
}

function getReportExport(id, contentId, type)
{
	
	if(ECM_DEBUG)$.log ("START getExcelExport");

	var url = getReportExportURL + "?" + req_report_id + "=" + id + "&" + req_report_content_id + "=" + contentId + "&" + req_report_content_type + "=" + type ;
	window.open(url);
	
	if(ECM_DEBUG)$.log ("END getExcelExport");	
}

function navigateTo(url, windowId)
{
	
	/*if(typeof(window.opener) == "undefined")
	{
		var winStr = 'location=0,status=1,scrollbars=1,width=1020,height=700,resizable=0';
		if(ECM_DEBUG)
			winStr = '';
		var newwin = window.open(url,windowId, winStr);	
		if (window.focus) { newwin.focus() }
		closeLoading();
	}
	else*/
		window.location = url;	

}

function goToBudgetMgmtFromSummary(positionId, pernr, emp_name)
{
	var url = goToBudgetMgmtURL + "?" + req_org + "=" + positionId+"&"+req_pernr+"="+pernr+"&"+req_emp_name+"="+emp_name;
	window.location = url;	
}

function navigateToDirectReportsForEmp(pernr, name){
	var url = getMyTeamDirectReports + req_pernr + "=" + pernr+"&"+req_emp_name+"="+name;
	window.location = url;
}

function redirectToMyTeamOrg(ele){

	var pernr = $(ele).attr('pernr');
	window.location = gotoMyteamOrgURL+"?"+req_pernr+"="+pernr;
}

function redirectToMyTeam(ele){
	var pernr = $(ele).attr('pernr');
	var url = getMyTeamDirectReports + req_pernr + "=" + pernr;
	window.location = url;
}