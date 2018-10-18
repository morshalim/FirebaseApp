var showing = false;
var neverHideLoader = false;
var errorCode = null;
var imageUpload = "";
var sessionTimeoutController = null;
var loadingCtr = 0;


$(document).ajaxStop(function() {
	closeLoading();
	
	  if(sessionTimeoutController != null)
		  sessionTimeoutController.reset();//reset the sessionController
	
});

$(document).ajaxStart(function() {
	showLoading();
});


$(document).ready(function() {

	if(typeof(SessionTimeoutController) != "undefined" && typeof(timeoutInSeconds) != "undefined")
		sessionTimeoutController = new SessionTimeoutController({timeout: timeoutInSeconds - 30}).init();

	errorCode = {type:0, code:"001", message:lang.error_sys_admin};

	/*$.ajaxSetup({
	  beforeSend: function() {

		  loadingCtr++;
		  showLoading();
	  },
	  complete: function(){

		  loadingCtr--;

		  if(loadingCtr == 0)
			  closeLoading();

		  if(sessionTimeoutController != null)
			  sessionTimeoutController.reset();//reset the sessionController
			  
			 
	  }
	}); */
});

function wlxEval(data)
{
	if(typeof data == "string")
		return eval("(" +  data + ")");
	return data;
}

function ajaxPreProcess(data)
{
	if(ECM_DEBUG)$.log ("START ajaxPreProcess");
//	if(ECM_DEBUG)$.log ("response: " + data);

	try{
		data = wlxEval(data);
		if(data.type == 0)
			return processError(data.code, data.message)
	} catch(e) {
		return processError("000",lang.error_bad_response)
	}
	return false;

	if(ECM_DEBUG)$.log ("END ajaxPreProcess");
}

function processError(code, msg)
{
	neverHideLoader = true;
	if(code != "")
		$("#dialog").html(code + ": " + msg);
	else
		$("#dialog").html(msg);

	return true;
}


function getBudget(scope)
{
	if(ECM_DEBUG)$.log ("START getBudget: " + plan);
	var data = {};
	data[req_scope] = scope;

	$.ajax({
	  url: getBudgetURL,
	  data: data,
	  cache: false,
	  success:getBudgetSuccess,
	  error:getBudgetError
	});

	if(ECM_DEBUG)$.log ("END getBudget");
}

function getBudgetSuccess(data, textStatus, XMLHttpRequest)
{
	if(ECM_DEBUG)$.log ("START getBudgetSuccess");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " response: " + data);

	if(ajaxPreProcess(data))
		return;

	var jdata = wlxEval(data);
	budgetSummaryIndirect = jdata;

	buildBudgetSummaryIndirect();
	wrapDiv('budgetSummaryIndirect', -50, -10, 180, 100);
	$('#submitTrigger').trigger('click');


	if(ECM_DEBUG)$.log ("END getBudgetSuccess");
}

function getBudgetError(XMLHttpRequest, textStatus, errorThrown)
{
	if(ECM_DEBUG)$.log ("START getBudgetError");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " errorThrown: " + JSON.stringify(errorThrown));
	if(ajaxPreProcess(errorCode))
		return;
	if(ECM_DEBUG)$.log ("END getBudgetError");
}



function getPlan(plan)
{
	if(ECM_DEBUG)$.log ("START getPlan: " + plan);
	var data = {};
	data[req_plan] = plan;

	$('#content_container').hide();



	$.ajax({
	  url: getPlanURL,
	  data: data,
	  context: {plan:plan},
	  cache: false,
	  success: getPlanSuccess,
	  error: getPlanError
	});

	if(ECM_DEBUG)$.log ("END getPlan");
}

function getPlanSuccess(data, textStatus, XMLHttpRequest)
{
	if(ECM_DEBUG)$.log ("START getPlanSuccess");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " response: " + data);

	if(ajaxPreProcess(data))
		return;

	var jdata = wlxEval(data);

	var plan = this.plan;

	planList[plan].cols = jdata.cols;
	planList[plan].data = jdata.data;
	planList[plan].guidelines = jdata.guidelines;
	planList[plan].associates = jdata.associates;


	loadDiv(plan);
	if(aleSynchCol) // this variable is set in wlx-datagrid.js
	{
		if(plan == "2AIP")
			if($('#4LAI_data').length == 0)
				getPlan("4LAI");

		if(plan == "4LAI")
			if($('#2AIP_data').length == 0)
				getPlan("2AIP");
	}
	$('#content_container').show();
	if(ECM_DEBUG)$.log ("END getPlanSuccess");
}

function getPlanError(XMLHttpRequest, textStatus, errorThrown)
{
	if(ECM_DEBUG)$.log ("START getPlanError");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " errorThrown: " + JSON.stringify(errorThrown));
	if(ajaxPreProcess(errorCode))
		return;
	if(ECM_DEBUG)$.log ("END getPlanError");
}

function getOrg(id, orgUnitId)
{
	if(ECM_DEBUG)$.log ("START getOrg");
	if(id == 'org') {
		popUpwin = bootbox.dialog({message : orgtree,
			buttons: {
				danger:{
					label: lang.crt_bootbox_cancel,
					className: "btn-default"
				}
			}	
		});	
	}
	
	var url = "";
	if(id == "org")
		url = getOrgURL;
	else
		url = getOrgProxyURL;

	$("#" + id).treeview({
		url: url,
		orgId: orgUnitId
	});
	
	if(ECM_DEBUG)$.log ("END getOrg");
}

function saveForm(type, exit, exitPlan, submitForm, appId, name, pernr)
{
	if(ECM_DEBUG)$.log ("START saveForm");
	var obj = null;
	var rateObj = null;
	if(type == "P")
	{
		obj = planChanges;
		rateObj = planRatingChanges;
	}
	else
	{
		obj = indPlanChanges;
		rateObj = indPlanRatingChanges;
	}

	var reqStr =[];
	var ctr = 0;
	for(var i in obj)
	{
		if(obj[i] != null)
		{
			ctr++;
			reqStr.push(obj[i]);
		}
	}

	var reqRateStr =[];
	var rateCtr = 0;
	for(var i in rateObj)
	{
		if(rateObj[i] != null)
		{
			rateCtr++;
			reqRateStr.push(rateObj[i]);
		}
	}

	if(ctr > 0 || rateCtr > 0 || submitForm)
	{
		var data = {};
		data[req_planInfo] = reqStr.join(';');
		data[req_planRateInfo] = reqRateStr.join(';');

		var url = saveFormURL;
		if(submitForm)
			url = submitFormURL

		$.ajax({
		  url: url,
		  data: data,
		  context: {exit:exit, exitPlan: exitPlan, type: type, submitForm: submitForm, appId:appId, name:name},
		  cache: false,
		  success:saveFormSuccess,
		  error:saveFormError
		});
	}
	else
	{
		processSaveForm(type, exit, exitPlan, appId, name, pernr)
	}
	if(ECM_DEBUG)$.log ("END saveForm");
}

function saveWorksheetForm(data, submitForm, approveReject)
{
	if(ECM_DEBUG)$.log ("START saveWorksheetForm");


		var url = saveFormURL;
		if(submitForm)
			url = submitFormURL;
		$.ajax({
		  url: url,
		  data: JSON.stringify(data),
		  type: "POST",
		  context: {type: 'P', data: data, submitForm: submitForm, approveReject:approveReject},
		  contentType: "application/json; charset=utf-8",
		  dataType: "json",
		  cache: false,
		  success:saveFormSuccess,
		  error:saveFormError
		});

	if(ECM_DEBUG)$.log ("END saveForm");
}

function processSaveForm(type, exit, exitPlan, appId, name, pernr)
{
	if(exit)
	{
		closeIndPlanning();
	}

	if(exitPlan)
	{
		window.close();
	}

	if(appId != "")
	{
		if(type == "P")
		{
			//not a real error, just processing
			//processError("", lang.p3App_pre_msg + "<br />" + lang.p3App_post_msg);
			//loadPerfApp(appId, name, pernr);
		}
		else
			saveForm("P", false, false, false, appId, name, pernr);

	}

}

function saveFormSuccess(data, textStatus, XMLHttpRequest)
{
	if(ECM_DEBUG)$.log ("START saveFormSuccess");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " response: " + data);

	if(ajaxPreProcess(data))
		return;

	var jdata = wlxEval(data);

	var errorPernr = "";
	var errorList = [];
	var errorMap = {};

	var errorMessages = [];

	for(var t in this.data.planData[this.data.worksheetId]) {
		//var entry = this.data.planData[this.data.worksheetId][t];
		var errorFound = false;
		for(var x = 0; x < jdata.length; x++)
		{
			var error = jdata[x];
			var pernr = error.pernr;
			
			if(pernr == t)
				errorFound = true;
		}	
		
		if(!errorFound) {
			for(var w = 0; w < planStatusKey.length; w++) {
				if(planStatusKey[w].value == this.data.status) {
					$('#' + this.data.worksheetId + '_body_td_' + t + '_ZECM_REC').html(planStatusKey[w].name);
				}
			}
			
			
		}
	}
	
	for(var x = jdata.length-1; x >= 0; x--)
	{
		var error = jdata[x];
		var plan = error.planId;
		var pernr = error.pernr;
		var msg = error.msg.message;

		//list for wuick lookup later when clearing those who saved properly
		errorMap[plan + "," + pernr] = "";

		if(typeof(errorMessages[pernr]) == "undefined")
			errorMessages[pernr] = msg;
		else
			errorMessages[pernr] = errorMessages[pernr] + ". " + msg
	}

	for(var x in errorMessages)
	{
		var error = errorMessages[x];
		errorList.push(error + ((parseInt(x) != 0)?" (" + x + ")":""));
	}

	//$('#user_error_' + this.type).html(errorList.join(''));
	if(errorList.length) {
		var html = [];
	    html.push('<div class="alert alert-danger">');
		html.push('	<button type="button" class="close" data-dismiss="alert"><i class="ace-icon fa fa-times"></i></button>');
		html.push(' '+errorList.join('<br />'));
		html.push('</div>');
		$('#error_list_P').html(html.join('')).show();
		$("body,html").scrollTop(0);
	}else{
		$('.textbox').removeAttr('changed');
		if(typeof(standardPromptForExit) != 'undefined')
			standardPromptForExit = false;
	}



	/*if(this.type == "P")
	{
		for(var x in planChanges)
		{
			if(errorMap[x] == null)
			{
				planChanges[x] = null;
				budgetSummaryDelta[x] = null;
			}
		}

		for(var x in planRatingChanges)
		{
			if(errorMap[x] == null)
			planRatingChanges[x] = null;
		}

	}
	else
	{
		//restrictDrawing = true;
		for(var x in indPlanChanges)
		{
			if(errorMap[x] == null)
			{
				//reset deltas
				budgetSummaryDelta[x] = null;
				budgetSummaryIndDelta[x] = null;

				if(indPlanChanges[x] != null)
				{
					var planElems = indPlanChanges[x].split(',');
					var tab = planElems[0];
					var pernr = planElems[1];
					var val = planElems[2];
					var reason = planElems[3];
					var showHide = planElems[4];
					var id = planElems[5];
					var toPlan = planElems[6];
					var toCol = planElems[7];
					var optionText = planElems[8];
					var icon = planElems[9];
					var className = planElems[10];
					var toStatusCol = planElems[11];

					var elem = $("#" + tab + "_body_td_input_" + pernr + "_" + id);
					if(elem.length > 0)
					{
						elem.val(val);
						elem.attr('updatedSummary', 'true');

						//synch update should not happen between 2AIP and 4LAI
						var eh = getEventHandler(tab, id);
						if(eh.map.synchToPlan) {
							if($('#' + eh.map.synchToPlan + '_data').length > 0) {
								$('#' + eh.map.synchToPlan + '_body_td_input_' + pernr + '_' + id).attr('updatedSummary', 'true');
							}
						}

						$("#" + tab + "_select_guideline_" + pernr + "_" + id).val(reason);
						elem.trigger('change');
					}
					else
					{

						$('#' + toPlan + '_body_td_' + pernr + '_' + toCol).metadata().sortValue = val;
						val = $.formatNumber(val, {format:amountFormat, locale:locale});

						$("#" + toPlan + "_body_td_copy_src_" + pernr + "_" + toCol).html(val);
						$("#" + toPlan + "_body_td_" + pernr + "_" + toCol).removeClass('err').addClass(className);
						$("#" + toPlan + "_pop_guideline_" + pernr + "_" + toCol).html(optionText);
						$('#' + toPlan + '_status_' + pernr + '_' + toStatusCol).trigger('click');

						if(showHide == "show")
						{
							$("#" + toPlan + "_img_guideline_" + pernr + "_" + toCol).show()
						}
						else
							$("#" + toPlan + "_img_guideline_" + pernr + "_" + toCol).hide()
					}

					planChanges[x] = null;
					indPlanChanges[x] = null;

					//write new budget over.
					//indBudgetSummary = jQuery.extend(true, {}, budgetSummary);
				}
			}
		}

		for(var x in indPlanRatingChanges)
		{
			if(errorMap[x] == null)
			{
				if(indPlanRatingChanges[x] != null)
				{
					var planElems = indPlanRatingChanges[x].split(',');
					var tab = planElems[0];
					var pernr = planElems[1];
					var val = planElems[2];
					var toCol = planElems[3];
					var toPlan = planElems[4];
					var toPlanCol = planElems[5];


					var elem = $("#" + tab + "_select_potential_" + pernr + "_" + toCol);
					if(elem.length > 0)
					{
						elem.val(val);
						elem.trigger('change');
					}
					else
					{
						var potSortValue = 0;
						var indName = "";
						for(var x = 0; x < potentialRatingList.length; x++)
						{
							var indGuide = potentialRatingList[x];
							if(indGuide.value == val)
							{
								potSortValue = indGuide.sortValue;
								indName = indGuide.name;
								break;
							}
						}

						//copy to rewards summary tab
						if(toPlan != null && toPlanCol != null)
						{
							var jCopyElem = $('#' + toPlan + '_body_td_' + pernr + '_' + toPlanCol);
							if(val != "")
							{
								jCopyElem.html(indName);
								jCopyElem.metadata().sortValue = potSortValue;
							}
							else
							{
								jCopyElem.html(lang.planSheet_potentialRatingSelect);
								jCopyElem.metadata().sortValue = -1;
							}
						}

					}

					planRatingChanges[x] = null;
					indPlanRatingChanges[x] = null;
				}
			}
		}

		refreshTab();
	}*/


	var errorCtr = 0;
	for(var i in errorMap)
		errorCtr++;


	if(errorCtr == 0)
	{

		for(var plan in this.data.planData) {
			var planData = this.data.planData[plan];
			for(var pernr in planData) {
				var text = lang["reco_status_" + this.data.status];
				$('#' + plan + "_status_" + pernr).html(text);
			}
		}

		if(this.submitForm)
		{
			//$('#confirmationTrigger').trigger('click');
			//update the tree on the dashboard if still open
			hasSubmitted = true;
			resetDashboard(statusOverviewURL);
		}
		else if(this.type == 'P')
		{
			$('#save_alert').show();
		}

		if(this.approveReject)
			navigateTo(getInboxURL);
		/*else
			$('#ind_save_alert').show();*/

		processSaveForm(this.type, this.exit, this.exitPlan, this.appId)
	}
	/*else
	{
		if(this.submitForm)
			$.fancybox.close();
		$('#error_list_' + this.type).show();
		if(this.type == "I")
			$('#ind_plan').trigger('click')
	}*/
	if(ECM_DEBUG)$.log ("END saveFormSuccess");
}

function saveFormError(XMLHttpRequest, textStatus, errorThrown)
{
	if(ECM_DEBUG)$.log ("START saveFormError");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " errorThrown: " + JSON.stringify(errorThrown));
	if(ajaxPreProcess(errorCode))
		return;
	if(ECM_DEBUG)$.log ("END saveFormError");
}

function getIndCompReco(pernr, loadAi, loadTotal)
{

	if(ECM_DEBUG)$.log ("START getIndCompReco");

	var data = {};
	data[req_pernr] = pernr

	$.ajax({
	  url: getIndCompRecoURL,
	  data: data,
	  cache: false,
	  context: {loadTotal:loadTotal,loadAi:loadAi,pernr:pernr},
	  success:getIndCompRecoSuccess,
	  error:getIndCompRecoError
	});

	if(ECM_DEBUG)$.log ("END getIndCompReco");
}

function getIndCompRecoSuccess(data, textStatus, XMLHttpRequest)
{
	if(ECM_DEBUG)$.log ("START getIndCompRecoSuccess");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " response: " + data);
	if(ajaxPreProcess(data))
		return;

	var jdata = wlxEval(data);
	loadCompRecoProfile(jdata);
	loadCompRecoDetails(jdata);

	if(this.loadAi)
	{
		var factor = 0;

		if($('#ind_entry_ai').css('display') != 'none')
			factor = $('#cr_ai_body_td_input_all_pct').metadata().sortValue.toString();
		else if($('#ind_entry_lai').css('display') != 'none')
			factor = $('#cr_lai_body_td_input_all_pct').metadata().sortValue.toString();

		getIndAnnualIncentive(this.pernr, factor);
		popupTracker["ai"] = "ai";
	}
	else if(this.loadTotal)
	{
		var plan1 = $('#cr_merit_body_td_all_planId').html();
		var newBasePay = $('#cr_merit_body_td_all_newBasePay').metadata().sortValue;
		var lumpSum = $('#cr_merit_body_td_all_lumpSum').metadata().sortValue;
		var plan2 = $('#cr_ai_body_td_all_planId').html();
		var aiRecomm = $('#cr_ai_body_td_all_recomm').metadata().sortValue;
		var plan3 = $('#cr_lti_body_td_all_planId').html();
		var ltiRecomm = $('#cr_lti_body_td_all_recomm').metadata().sortValue;
		var plan4 = $('#cr_lai_body_td_all_planId').html();
		var laiRecomm = $('#cr_lai_body_td_all_recomm').metadata().sortValue;
		getIndTotalCompensation(this.pernr, plan1, newBasePay + lumpSum, plan2, aiRecomm, plan3, ltiRecomm, plan4, laiRecomm);
		popupTracker["tc"] = "tc";
	}
	else
	if(ECM_DEBUG)$.log ("END getIndCompRecoSuccess");
}

function getIndCompRecoError(XMLHttpRequest, textStatus, errorThrown)
{
	if(ECM_DEBUG)$.log ("START getIndCompRecoError");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " errorThrown: " + JSON.stringify(errorThrown));
	if(ajaxPreProcess(errorCode))
		return;
	if(ECM_DEBUG)$.log ("END getIndCompRecoError");
}


function getIndAnnualIncentive(pernr, perfFactor)
{

	if(ECM_DEBUG)$.log ("START getIndAnnualIncentive");

	var data = {};
	data[req_pernr] = pernr;
	data[req_perf_factor] = perfFactor;

	$.ajax({
	  url: getIndAnnualIncentiveURL,
	  data: data,
	  cache: false,
	  success:getIndAnnualIncentiveSuccess,
	  error:getIndAnnualIncentiveError
	});

	if(ECM_DEBUG)$.log ("END getIndAnnualIncentive");
}

function getIndAnnualIncentiveSuccess(data, textStatus, XMLHttpRequest)
{
	if(ECM_DEBUG)$.log ("START getIndAnnualIncentiveSuccess");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " response: " + data);
	if(ajaxPreProcess(data))
		return;
	var jdata = wlxEval(data);
	loadAnnualIncentiveDetail(jdata);
	if(ECM_DEBUG)$.log ("END getIndAnnualIncentiveSuccess");
}

function getIndAnnualIncentiveError(XMLHttpRequest, textStatus, errorThrown)
{
	if(ECM_DEBUG)$.log ("START getIndAnnualIncentiveError");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " errorThrown: " + JSON.stringify(errorThrown));
	if(ajaxPreProcess(errorCode))
		return;
	if(ECM_DEBUG)$.log ("END getIndAnnualIncentiveError");
}

function getIndHistoricalDetail(pernr)
{

	if(ECM_DEBUG)$.log ("START getIndHistoricalDetail");

	var data = {};
	data[req_pernr] = pernr;

	$.ajax({
	  url: getIndHistoricalDetailURL,
	  data: data,
	  cache: false,
	  success:getIndHistoricalDetailSuccess,
	  error:getIndHistoricalDetailError
	});

	if(ECM_DEBUG)$.log ("END getIndHistoricalDetail");
}

function getIndHistoricalDetailSuccess(data, textStatus, XMLHttpRequest)
{
	if(ECM_DEBUG)$.log ("START getIndHistoricalDetailSuccess");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " response: " + data);

	if(ajaxPreProcess(data))
		return;

	var jdata = wlxEval(data);
	loadHistoricalDetail(jdata);
	if(ECM_DEBUG)$.log ("END getIndHistoricalDetailSuccess");
}

function getIndHistoricalDetailError(XMLHttpRequest, textStatus, errorThrown)
{
	if(ECM_DEBUG)$.log ("START getIndHistoricalDetailError");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " errorThrown: " + JSON.stringify(errorThrown));
	if(ajaxPreProcess(errorCode))
		return;
	if(ECM_DEBUG)$.log ("END getIndHistoricalDetailError");
}

function getIndTotalCompensation(pernr, plan1, newBasePay, plan2, aiRecomm, plan3, ltiRecomm, plan4, laiRecomm)
{

	if(ECM_DEBUG)$.log ("START getIndTotalCompensation");

	var data = {};
	data[req_pernr] = pernr;
	data[req_total_comp] =	plan1 + "," + newBasePay + "~" + plan2 + "," + aiRecomm + "~" + plan3 + "," + ltiRecomm + "~" + plan4 + "," + laiRecomm;
	$.ajax({
	  url: getIndTotalCompensationURL,
	  data: data,
	  cache: false,
	  success:getIndTotalCompensationSuccess,
	  error:getIndTotalCompensationError
	});

	if(ECM_DEBUG)$.log ("END getIndTotalCompensation");
}

function getIndTotalCompensationSuccess(data, textStatus, XMLHttpRequest)
{
	if(ECM_DEBUG)$.log ("START getIndTotalCompensationSuccess");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " response: " + data);

	if(ajaxPreProcess(data))
		return;

	var jdata = wlxEval(data);
	loadTotalCompensation(jdata);
	if(ECM_DEBUG)$.log ("END getIndTotalCompensationSuccess");
}

function getIndTotalCompensationError(XMLHttpRequest, textStatus, errorThrown)
{
	if(ECM_DEBUG)$.log ("START getIndTotalCompensationError");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " errorThrown: " + JSON.stringify(errorThrown));
	if(ajaxPreProcess(errorCode))
		return;
	if(ECM_DEBUG)$.log ("END getIndTotalCompensationError");
}

function getSearchProxy(searchStr, isManager)
{

	if(ECM_DEBUG)$.log ("START getSearchProxy");

	var data = {};
	data[req_search] = searchStr;
	data[req_search_manager] = ((isManager)?"X":"");
	$.ajax({
	  url: getSearchProxyURL,
	  data: data,
	  context : {isManager:isManager, searchStr:searchStr},
	  cache: false,
	  success:getSearchProxySuccess,
	  error:getSearchProxyError
	});

	if(ECM_DEBUG)$.log ("END getSearchProxy");
}

function getSearchProxySuccess(data, textStatus, XMLHttpRequest)
{
	if(ECM_DEBUG)$.log ("START getSearchProxySuccess");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " response: " + data);
	if(ajaxPreProcess(data))
		return;

	var jdata = wlxEval(data);
	loadSearchResults(jdata, this.isManager, this.searchStr);
	if(ECM_DEBUG)$.log ("END getSearchProxySuccess");
}

function getSearchProxyError(XMLHttpRequest, textStatus, errorThrown)
{
	if(ECM_DEBUG)$.log ("START getSearchProxyError");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " errorThrown: " + JSON.stringify(errorThrown));
	if(ajaxPreProcess(errorCode))
		return;
	if(ECM_DEBUG)$.log ("END getSearchProxyError");
}


function getRewardsStatement(crevi)
{

	if(ECM_DEBUG)$.log ("START getRewardsStatement");

	var data = {};
	data[req_crevi] = crevi;

	$.ajax({
	  url: getRewardsStatementURL,
	  data: data,
	  cache: false,
	  success:getRewardsStatementSuccess,
	  error:getRewardsStatementError
	});

	if(ECM_DEBUG)$.log ("END getRewardsStatement");
}

function getRewardsStatementSuccess(data, textStatus, XMLHttpRequest)
{
	if(ECM_DEBUG)$.log ("START getRewardsStatementSuccess");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " response: " + data);
	if(ajaxPreProcess(data))
		return;

	var jdata = wlxEval(data);
	buildRewards(jdata);
	if(ECM_DEBUG)$.log ("END getRewardsStatementSuccess");
}

function getRewardsStatementError(XMLHttpRequest, textStatus, errorThrown)
{
	if(ECM_DEBUG)$.log ("START getRewardsStatementError");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " errorThrown: " + JSON.stringify(errorThrown));
	if(ajaxPreProcess(errorCode))
		return;
	if(ECM_DEBUG)$.log ("END getRewardsStatementError");
}

function getReportsList()
{

	if(ECM_DEBUG)$.log ("START getReportsList");

	var data = {};

	$.ajax({
	  url: getReportsListURL,
	  data: data,
	  cache: false,
	  success:getReportsListSuccess,
	  error:getReportsListError
	});

	if(ECM_DEBUG)$.log ("END getReportsList");
}

function getReportsListSuccess(data, textStatus, XMLHttpRequest)
{
	if(ECM_DEBUG)$.log ("START getReportsListSuccess");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " response: " + data);
	if(ajaxPreProcess(data))
		return;

	var jdata = wlxEval(data);
	buildReportsList(jdata);
	if(ECM_DEBUG)$.log ("END getReportsListSuccess");
}

function getReportsListError(XMLHttpRequest, textStatus, errorThrown)
{
	if(ECM_DEBUG)$.log ("START getReportsListError");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " errorThrown: " + JSON.stringify(errorThrown));
	if(ajaxPreProcess(errorCode))
		return;
	if(ECM_DEBUG)$.log ("END getReportsListError");
}

function getCompletedReportsList()
{

	if(ECM_DEBUG)$.log ("START getCompletedReportsList");

	var data = {};

	$.ajax({
	  url: getCompletedReportsListURL,
	  data: data,
	  cache: false,
	  success:getCompletedReportsListSuccess,
	  error:getCompletedReportsListError
	});

	if(ECM_DEBUG)$.log ("END getCompletedReportsList");
}

function getCompletedReportsListSuccess(data, textStatus, XMLHttpRequest)
{
	if(ECM_DEBUG)$.log ("START getCompletedReportsListSuccess");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " response: " + data);
	if(ajaxPreProcess(data))
		return;

	var jdata = wlxEval(data);
	buildCompletedReportsList(jdata);
	if(ECM_DEBUG)$.log ("END getCompletedReportsListSuccess");
}

function getCompletedReportsListError(XMLHttpRequest, textStatus, errorThrown)
{
	if(ECM_DEBUG)$.log ("START getCompletedReportsListError");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " errorThrown: " + JSON.stringify(errorThrown));
	if(ajaxPreProcess(errorCode))
		return;
	if(ECM_DEBUG)$.log ("END getCompletedReportsListError");
}

function setReportInQueue(id, variant, name, scope)
{

	if(ECM_DEBUG)$.log ("START setReportInQueue");

	var data = {};
	data[req_report_id] = id;
	data[req_report_variant] = variant;
	data[req_scope] = scope;
	data[req_chief_name] = encodeURIComponent($('#managerName').html());
	data[req_report_program_name] = name

	$.ajax({
	  url: setReportInQueueURL,
	  data: data,
	  cache: false,
	  context: {id:id,variant:variant},
	  success:setReportInQueueSuccess,
	  error:setReportInQueueError
	});

	if(ECM_DEBUG)$.log ("END setReportInQueue");
}

function setReportInQueueSuccess(data, textStatus, XMLHttpRequest)
{
	if(ECM_DEBUG)$.log ("START setReportInQueueSuccess");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " response: " + data);

	if(ajaxPreProcess(data))
		return;

	var jdata = wlxEval(data);
	notifyReportInQueue(this.id);
	if(ECM_DEBUG)$.log ("END setReportInQueueSuccess");
}

function setReportInQueueError(XMLHttpRequest, textStatus, errorThrown)
{
	if(ECM_DEBUG)$.log ("START setReportInQueueError");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " errorThrown: " + JSON.stringify(errorThrown));
	if(ajaxPreProcess(errorCode))
		return;
	if(ECM_DEBUG)$.log ("END setReportInQueueError");
}

function getEmpBudgetMgmt(id, posId, name, budgetId,isTrue)
{
	if(ECM_DEBUG)$.log ("START getEmpBudgetMgmt");
	var data = {};
	data[req_pernr] = id;
	data[req_pos_id] = posId;
	data[req_budget_id] = budgetId;
	$.ajax({
		url: getEmpBudgetMgmtURL,
		data: data,
		cache: false,
		success: getEmpBudgetMgmtSuccess,
		error: getEmpBudgetMgmtError
	});

	if(name)
	$('.emp-name-cntr').html(name);
	if(id)
	$('#budgetSummarySpanID').attr('empId', id);
	$('#save-budget-btn').attr('mgrId', id);
	$('#save-budget-btn').attr('posId', posId);
	$('#release-budget-btn').attr('mgrId', id);
	$('#release-budget-btn').attr('posId', posId);
	if(!isTrue){
		var empIds = $('#upOneLevelBtn').attr('empId');
		var names = $('#upOneLevelBtn').attr('empName');
		var posIds = $('#upOneLevelBtn').attr('posId');
		$('#upOneLevelBtn').attr('empId',empIds+"~"+id);
		$('#upOneLevelBtn').attr('empName',names+"~"+name);
		$('#upOneLevelBtn').attr('posId',posIds+"~"+posId);
		$('#upOneLevelBtn').removeAttr('disabled');
	}
	if(ECM_DEBUG)$.log ("END getEmpBudgetMgmt");
}

function getEmpBudgetMgmtSuccess(data, textStatus, XMLHttpRequest)
{
	if(ECM_DEBUG)$.log ("START getEmpBudgetMgmtSuccess");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " response: " + data);
	if(ajaxPreProcess(data))
		return;

	var jdata = wlxEval(data);
	renderBudgetMgmt(jdata,false);
	if(ECM_DEBUG)$.log ("END getEmpBudgetMgmtSuccess");
}

function getEmpBudgetMgmtError(XMLHttpRequest, textStatus, errorThrown)
{
	if(ECM_DEBUG)$.log ("START getEmpBudgetMgmtError");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " errorThrown: " + JSON.stringify(errorThrown));
	if(ajaxPreProcess(errorCode))
		return;
	if(ECM_DEBUG)$.log ("END getEmpBudgetMgmtError");
}

function saveEmpBudgetMgmt()
{
	if(ECM_DEBUG)$.log ("START saveEmpBudgetMgmt");

	var id = $(this).attr('mgrId');
	var empIds = [];
	var empBudgets = [];
	var ownSpendTotal = 0;
	var oneTimeAward = 0;

	var tdata = $('#direct-reports-table-cntr').dataTable().fnGetData();

	for(var x = 0; x < tdata.length; x++) {
		var jObj = $(tdata[x][3]);
		//if($(this).find(':checkbox:checked'))
		//{
			//var input = jObj.find(':input[type=text]');

			empIds.push(input.attr('empId'));
			empBudgets.push($(input).attr("prevValue"));

			if(id != input.attr('empId')){
				empIds.push(input.attr('empId'));
				empBudgets.push($(input).attr("prevValue"));
			}else{
				if(input.attr('id') == "oneTimeAward")
					oneTimeAward = $(input).attr("prevValue");
				else
					ownSpendTotal = $(input).attr("prevValue");
			}
		//}
	}
	var data = {};
	data[req_pernr] = id;
	data[req_budget_id] = $('#budget-types-dd').val();
	data[req_sep_keys] = empIds.join(req_row_sep);
	data[req_sep_values] = empBudgets.join(req_row_sep);
	data[req_own_spend_total] = ownSpendTotal;
	data[req_one_time_award] = oneTimeAward;
	data[req_status] = '1';

	$.ajax({
		url: saveEmpBudgetMgmtURL,
		data: data,
		context : {id:id},
		cache: false,
		success: saveEmpBudgetMgmtSuccess,
		error: saveEmpBudgetMgmtError
	});

	$('.emp-name-cntr').html(name);

	if(ECM_DEBUG)$.log ("END saveEmpBudgetMgmt");
}

function saveEmpBudgetMgmtSuccess(data, textStatus, XMLHttpRequest)
{
	if(ECM_DEBUG)$.log ("START saveEmpBudgetMgmtSuccess");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " response: " + data);
	if(ajaxPreProcess(data))
		return;

	var jdata = wlxEval(data);
	var html = [];
	// display proper message
	if(jdata && jdata.length){

		html.push('<div class="alert alert-warn">');
		html.push('	<button type="button" class="close" data-dismiss="alert"><i class="ace-icon fa fa-times"></i></button>');
		html.push('	<strong>'+lang.js_budget_mgmt_error_text+'</strong><br />');
		for(var i=0; i<jdata.length; i++)
			html.push(jdata[i] + '.<br />');
		html.push('</div>');
	}
	else{

		html.push('<div class="alert alert-success">');
		html.push('	<button type="button" class="close" data-dismiss="alert"><i class="ace-icon fa fa-times"></i></button>');
		html.push('	<strong>'+lang.js_budget_mgmt_saved_text+'</strong>');
		html.push(''+lang.js_budget_mgmt_budget_allocation_success_msg+'<br />');
		html.push('</div>');
	}

	$('#page-error-cntr').html(html.join(''));

	if($('#save-budget-btn').attr('posId'))
		getEmpBudgetMgmt(this.id, $('#save-budget-btn').attr('posId'),null,$('#budget-types-dd').val()); 
	else
		goToBudgetMgmt($('#budget-types-dd').val());

	if(ECM_DEBUG)$.log ("END saveEmpBudgetMgmtSuccess");
}

function saveEmpBudgetMgmtError(XMLHttpRequest, textStatus, errorThrown)
{
	if(ECM_DEBUG)$.log ("START saveEmpBudgetMgmtError");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " errorThrown: " + JSON.stringify(errorThrown));
	if(ajaxPreProcess(errorCode))
		return;
	if(ECM_DEBUG)$.log ("END saveEmpBudgetMgmtError");
}

function releaseEmpBudgetMgmt()
{
	if(ECM_DEBUG)$.log ("START releaseEmpBudgetMgmt"); 

	var id = $(this).attr('mgrId');
	var empIds = [];
	var empBudgets = [];
	var name = $('.emp-name-cntr').html();
	var empId = $('#budgetSummarySpanID').attr('empId');
	var tdata = $('#direct-reports-table-cntr').dataTable().fnGetData();
	var ownSpendTotal = 0;
	var oneTimeAward = 0;
	for(var x = 0; x < tdata.length; x++) {
		var input = $(tdata[x][3]);
		//if($(this).find(':checkbox:checked'))
		//{
			//var input = jObj.find(':input[type=text]');
			if(empId != input.attr('empId')){
				empIds.push(input.attr('empId'));
				empBudgets.push($(input).attr("prevValue"));
			}
		//}
	}

	if($('#ownSpendTotal').attr("prevValue"))
		ownSpendTotal = $('#ownSpendTotal').attr("prevValue");
	if($('#oneTimeAward').attr("prevValue"))
		oneTimeAward = $('#oneTimeAward').attr("prevValue");

	var data = {};
	data[req_pernr] = id;
	data[req_budget_id] = $('#budget-types-dd').val();
	data[req_sep_keys] = empIds.join(req_row_sep);
	data[req_sep_values] = empBudgets.join(req_row_sep);
	data[req_own_spend_total] = ownSpendTotal;
	data["posId"] = $('#ownSpendTotal').attr("posId");
	data[req_one_time_award] = oneTimeAward;
	data[req_status] = '2';

	$.ajax({
		url: saveEmpBudgetMgmtURL,
		data: data,
		context : {id:id},
		cache: false,
		success: releaseEmpBudgetMgmtSuccess,
		error: releaseEmpBudgetMgmtError
	});

	$('.emp-name-cntr').html(name);
	 $('#budgetSummarySpanID').attr('empId',empId);
	 $('#terminatedIcon').hide();
	if(ECM_DEBUG)$.log ("END releaseEmpBudgetMgmt");
}

function releaseEmpBudgetMgmtSuccess(data, textStatus, XMLHttpRequest)
{
	if(ECM_DEBUG)$.log ("START releaseEmpBudgetMgmtSuccess");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " response: " + data);
	if(ajaxPreProcess(data)){
		data = wlxEval(data);
		if(data.type == 0)
			reportMsg(data.message);
		return;
	}

	var jdata = wlxEval(data);
	var html = [];

	// display proper message
	if(jdata && jdata.type && jdata.type == 0){


		html.push('<div class="alert alert-warn">');
		html.push('	<button type="button" class="close" data-dismiss="alert"><i class="ace-icon fa fa-times"></i></button>');
		html.push('	<strong>'+lang.js_budget_mgmt_error_text+'</strong>');
		html.push('	' + jdata.message + '.<br />');
		html.push('</div>');
	}
	else{

		html.push('<div class="alert alert-success">');
		html.push('	<button type="button" class="close" data-dismiss="alert"><i class="ace-icon fa fa-times"></i></button>');
		html.push('	<strong>'+lang.js_budget_mgmt_saved_text+'</strong>');
		html.push(''+lang.js_budget_mgmt_budget_allocation_success_msg+'<br />');
		html.push('</div>');
	}

	$('#page-error-cntr').html(html.join(''));

	if($('#save-budget-btn').attr('posId'))
		getEmpBudgetMgmt(this.id, $('#save-budget-btn').attr('posId'),null,$('#budget-types-dd').val());
	else
		goToBudgetMgmt($('#budget-types-dd').val());

	if(ECM_DEBUG)$.log ("END releaseEmpBudgetMgmtSuccess");
}

function releaseEmpBudgetMgmtError(XMLHttpRequest, textStatus, errorThrown)
{
	if(ECM_DEBUG)$.log ("START releaseEmpBudgetMgmtError");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " errorThrown: " + JSON.stringify(errorThrown));
	if(ajaxPreProcess(errorCode))
		return;
	if(ECM_DEBUG)$.log ("END releaseEmpBudgetMgmtError");
}

function sendActionRequest(data,url)
{
	if(ECM_DEBUG)$.log ("START sendActionRequest");
	$.ajax({
	  url: url,
	  type :"POST",
	  data: data,
	  cache: false,
	  success:actionSuccess,
	  error:actionError
	});

	if(ECM_DEBUG)$.log ("END sendActionRequest");
}

function actionSuccess(response){
	if(ECM_DEBUG)$.log ("START actionSuccess");
	response = wlxEval(response);
	if(response.success!=null){
		bootbox.hideAll();
		reloadCrud(response);
	}
	$('#batchUpdate').attr('disabled', 'disabled');
	$('#batchCheckBox').attr('checked', false);
	if(ECM_DEBUG)$.log ("END actionSuccess");
}

function actionError(request,status,error){
	if(ECM_DEBUG)$.log ("START actionError");
	var errorMsg = request.responseText;
    var html = [];
    html.push('<div class="alert alert-danger">');
	html.push('	<button type="button" class="close" data-dismiss="alert"><i class="ace-icon fa fa-times"></i></button>');
	html.push('	<strong>'+lang.js_crud_error_text+'</strong>');
	html.push(' '+errorMsg+'<br />');
	html.push('</div>');
	$('.errorMsg').html(html.join(''));
	$("body,html").scrollTop(0);
    if(ECM_DEBUG)$.log ("END actionError");
}

function configMetadata(data,addRowUrl)
{
	if(ECM_DEBUG)$.log ("START configMetadata");
	$.ajax({
	  url: addRowUrl,
	  type :"POST",
	  data: data,
	  cache: false,
	  success:configSuccess,
	  error:configError
	});
	if(ECM_DEBUG)$.log ("END configMetadata");
}
function configSuccess(response){
	if(ECM_DEBUG)$.log ("START configSuccess");
	response = wlxEval(response);
	if(response.success!=null){
		bootbox.hideAll();
		reloadCrud(response);
	}
	if(ECM_DEBUG)$.log ("END configSuccess");
}
function configError(request,status,error){
	if(ECM_DEBUG)$.log ("START configError");
	var errorMsg = request.responseText;
    var html = [];
    html.push('<div class="alert alert-danger">');
	html.push('	<button type="button" class="close" data-dismiss="alert"><i class="ace-icon fa fa-times"></i></button>');
	html.push('	<strong>'+lang.js_crud_error_text+'</strong>');
	html.push(' '+errorMsg+'<br />');
	html.push('</div>');
	$('.errorMsg').html(html.join(''));
	$("body,html").scrollTop(0);
    if(ECM_DEBUG)$.log ("END configError");
}

function deleteMetadata(data,Url)
{
	if(ECM_DEBUG)$.log ("START configMetadata");
	$.ajax({
	  url: Url,
	  type :"POST",
	  data: data,
	  cache: false,
	  success:deleteMetadataSuccess,
	  error:configError
	});
	if(ECM_DEBUG)$.log ("END configMetadata");
}
function deleteMetadataSuccess(response){
	if(ECM_DEBUG)$.log ("START deleteMetadataSuccess");
	response = wlxEval(response);
	if(response.success!=null){
		bootbox.hideAll();
		reloadCrud(response);
	}
	if(ECM_DEBUG)$.log ("END deleteMetadataSuccess");
}
function deleteMetadataError(request,status,error){
	if(ECM_DEBUG)$.log ("START deleteMetadataError");
	var errorMsg = request.responseText;
    var html = [];
    html.push('<div class="alert alert-danger">');
	html.push('	<button type="button" class="close" data-dismiss="alert"><i class="ace-icon fa fa-times"></i></button>');
	html.push('	<strong>'+lang.js_crud_error_text+'</strong>');
	html.push(' '+errorMsg+'<br />');
	html.push('</div>');
	$('.errorMsg').html(html.join(''));
	$("body,html").scrollTop(0);
    if(ECM_DEBUG)$.log ("END deleteMetadataError");
}
function deleteRow(data,deleteRowUrl)
{
	if(ECM_DEBUG)$.log ("START deleteRow");
	$.ajax({
	  url: deleteRowUrl,
	  type :"POST",
	  data: data,
	  cache: false,
	  success:deleteRowSuccess,
	  error:processCrudError
	});

	if(ECM_DEBUG)$.log ("END deleteRow");
}

function deleteRowSuccess(response){
	if(ECM_DEBUG)$.log ("START deleteRowSuccess");
	reloadCrud(response);
	if(ECM_DEBUG)$.log ("END deleteRowSuccess");
}

function checkKeyConfig(data,checkConfigUrl)
{
	if(ECM_DEBUG)$.log ("START checkKeyConfig");
	var autoKeyGen = false;
	$.ajax({
	  url: checkConfigUrl,
	  data: data,
	  cache: false,
	  async : false,
	  success:function(data, textStatus, XMLHttpRequest){
		  if(data!=null){
			  data = wlxEval(data);
			  if(data.isAutoKeyGen)
				  autoKeyGen = true;
		  }
      },
	  error:function(request,status,error){
		  autoKeyGen = false;
      }
	});
	return autoKeyGen
	if(ECM_DEBUG)$.log ("END configMetadata");
}
function configSuccess(response){
	if(ECM_DEBUG)$.log ("START configSuccess");
	response = wlxEval(response);
	if(response.success!=null){
		bootbox.hideAll();
		reloadCrud(response);
	}
	if(ECM_DEBUG)$.log ("END configSuccess");
}
function processCrudError(request,status,error){
	if(ECM_DEBUG)$.log ("START processCrudError");
	var errorMsg = request.responseText;
	var html = [];
    html.push('<div class="alert alert-danger">');
	html.push('	<button type="button" class="close" data-dismiss="alert"><i class="ace-icon fa fa-times"></i></button>');
	html.push('	<strong>'+lang.js_crud_error_text+'</strong>');
	html.push(' '+errorMsg+'<br />');
	html.push('</div>');
	$('#page-error-cntr').html(html.join(''));
	$("body,html").scrollTop(0);
    if(ECM_DEBUG)$.log ("END processCrudError");
}

/*************** loader *******************/

function closeLoading()
{
	$.unblockUI();
}

function showLoading(msg)
{
	var imgUrl = '../images/loading.gif' 
	if(window.location.pathname && window.location.pathname.split('/')[1])
		imgUrl = '/' + window.location.pathname.split('/')[1] + '/images/loading.gif';
	
	$.blockUI({
		message: '<div  style="padding:2%;'+((msg!=null &&msg!='' && msg!='undefined')?'':'padding-top:5%')+'"><img id="loader" src="'+imgUrl+'" width="70%"/><br>'+lang.js_ajax_laoder+((msg!=null &&msg!='' && msg!='undefined')?msg:'')+'</div>',
		baseZ: 2000
	});
}
function releaseEmpStatement()
{
	if(ECM_DEBUG)$.log ("START releaseEmpStatement");

	var id = $(this).attr('mgrId');
	var empIds = [];
	var empStatus = [];
	var statusNotReady = false;
	var reviewId = $('#reviewSelect :selected').val();
	$('#table_report tbody tr').each(function(){

		if($(this).find(':checkbox:checked').length>0)
		{
			var input = $(this).find(':checkbox:checked');
			var statusId = input.attr('statusId');
			var html=[];
			if(statusId!='3' && statusId!='5')
			{
				statusNotReady = true;
				html.push('<div class="alert alert-danger">');
				html.push('	<button type="button" class="close" data-dismiss="alert"><i class="ace-icon fa fa-times"></i></button>');
				html.push('	<strong>'+lang.crt_statements_release_error+'</strong>&nbsp;');
				html.push(lang.crt_statements_select_ready_status+'<br />');
				html.push('</div>');
				$('#page-error-cntr').html(html.join(''));
				$("body,html").scrollTop(0);
			}
			empIds.push(input.attr('empId'));
			empStatus.push(input.attr('statusId'));
		}
	});
	var data = {};
	data[req_pernr] = id;
	data[req_sep_keys] = empIds.join(req_row_sep);
	data[req_sep_values] = empStatus.join(req_row_sep);
	data[req_status] = '2';
	data[req_review_id] = reviewId;
	if(statusNotReady)	{
		return false;
	}else{
		$.ajax({
			url: saveEmpStatementURL,
			data: data,
			context : {id:id},
			cache: false,
			success: releaseEmpStatementSuccess,
			error: function()
			{

			}
		});
	}
	if(ECM_DEBUG)$.log ("END releaseEmpStatement");
}
function releaseEmpStatementSuccess(data, textStatus, XMLHttpRequest)
{
	if(ECM_DEBUG)$.log ("START releaseEmpStatementSuccess");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " response: " + data);
	var html = [];
	html.push('<div class="alert alert-success">');
	html.push('	<button type="button" class="close" data-dismiss="alert"><i class="ace-icon fa fa-times"></i></button>');
	html.push('	<strong>'+lang.crt_statements_saved+'</strong>&nbsp;');
	html.push(lang.crt_statements_released_success+'<br />');
	html.push('</div>');
	$('#page-error-cntr').html(html.join(''));
	$("body,html").scrollTop(0);
	buildRewards(data);
	if(ECM_DEBUG)$.log ("END releaseEmpStatementSuccess");
}

function loadPDF(data)
{
	showLoading();
	var reqUrl = data[req_pdf_url];
	delete data[req_pdf_url];
	$.fileDownload(reqUrl,{
		httpMethod: "POST",
		data : data,
		successCallback: function (url) {
		 	closeLoading();
		    },
		    failCallback: function (html, url) {
		         closeLoading();
		         reportMsg(html);
			}
});
}
function saveReleaseStatement()
{
	if(ECM_DEBUG)$.log ("START saveReleaseStatement");
	var data = {};
	data[req_status] = '3';
	$.ajax({
		url: saveReleaseStatementURL,
		data:data,
		cache: false,
		success: saveReleaseStatementSuccess,
		error: function()
		{

		}
	});

	if(ECM_DEBUG)$.log ("END releaseEmpStatement");
}
function saveReleaseStatementSuccess(data, textStatus, XMLHttpRequest)
{
	if(ECM_DEBUG)$.log ("START saveReleaseStatementSuccess");
	pushMsg(data);
	if(ECM_DEBUG)$.log ("END saveReleaseStatementSuccess");
}
function searchEmployee(searchText, isActive,isAdminStmt)
{
	var reviewId;
	if(ECM_DEBUG)$.log ("START searchEmployee");
	reviewId = $('#reviewSelect :selected').val();
	var data = {};
	data[req_review_id] = reviewId;
	data[req_emp_search_text] = searchText;
	if(isActive != undefined && isActive != null)
		data[req_is_active_record] = isActive;

	if(isAdminStmt != undefined && isAdminStmt != null){
		data[crt_req_active_stmt_true] = isAdminStmt;

	}
	//data["isTerminatedCheck"] = $('#terminatedEmployee').is(":checked");
	$.ajax({
		url: employeeSearchURL,
		data: data,
		cache: false,
		success: employeeSearchSuccess,
		error: function()
		{

		}
	});

	if(ECM_DEBUG)$.log ("END searchEmployee");
}
function employeeSearchSuccess(data, textStatus, XMLHttpRequest)
{
	if(ECM_DEBUG)$.log ("START employeeSearchSuccess");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " response: " + data);
	buildRewards(data);
	if(ECM_DEBUG)$.log ("END employeeSearchSuccess");
}

function searchTerminatedEmployee(searchText){
	if(ECM_DEBUG)$.log ("START searchTerminatedEmployee");
	var reviewId = $('#reviewSelect :selected').val();
	var data = {};
	data[req_review_id] = reviewId;
	data[req_emp_search_text] = searchText;
	$.ajax({
		url: searchTerminatedEmpStmntURL,
		data: data,
		cache: false,
		success: serachTerminatedEmpSuccess,
		error: function()
		{

		}
	});

	if(ECM_DEBUG)$.log ("END searchTerminatedEmployee");
}

function serachTerminatedEmpSuccess(data, textStatus, XMLHttpRequest)
{
	if(ECM_DEBUG)$.log ("START serachTerminatedEmpSuccess");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " response: " + data);
	buildRewards(data);
	if(ECM_DEBUG)$.log ("END serachTerminatedEmpSuccess");
}

function getGuideLines(pernr)
{
	if(ECM_DEBUG)$.log ("START getguideLines");
	var data = {};
	data[req_pernr]	= pernr;
	$.ajax({
	  url: getGuideLinesURL,
	  data: data,
	  cache: false,
	  success:getWorkSheetGuildLinesSuccess,
	  error:getWorkSheetGuildLinesError
	});

	if(ECM_DEBUG)$.log ("END getguideLines");
}

function getWorkSheetGuildLinesSuccess(data, textStatus, XMLHttpRequest)
{
	if(ECM_DEBUG)$.log ("START getguideLines Success");
	pushGuideLines(data);
	if(ECM_DEBUG)$.log ("END getguideLines Success");
}

function getWorkSheetGuildLinesError(XMLHttpRequest, textStatus, errorThrown)
{
	if(ECM_DEBUG)$.log ("START getWorkSheetGuildLinesError");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " errorThrown: " + JSON.stringify(errorThrown));
	if(ajaxPreProcess(errorCode))
		return;
	if(ECM_DEBUG)$.log ("END getWorkSheetGuildLinesError");
}

function getCompHistory(pernr)
{
	if(ECM_DEBUG)$.log ("START getguideLines");
	var data = {};
	data[req_pernr]	= pernr;
	$.ajax({
	  url: getCompHistoryURL,
	  data: data,
	  cache: false,
	  success:getWorkSheetCompHistorySuccess,
	  error:getWorkSheetCompHistoryError
	});

	if(ECM_DEBUG)$.log ("END getguideLines");
}

function getWorkSheetCompHistorySuccess(data, textStatus, XMLHttpRequest)
{
	if(ECM_DEBUG)$.log ("START Comp History Success");
	pushCompHistory(data);

	if(ECM_DEBUG)$.log ("END Comp History Success");
}

function getWorkSheetCompHistoryError(XMLHttpRequest, textStatus, errorThrown)
{
	if(ECM_DEBUG)$.log ("START getWorkSheetCompHistoryError");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " errorThrown: " + JSON.stringify(errorThrown));
	if(ajaxPreProcess(errorCode))
		return;
	if(ECM_DEBUG)$.log ("END getWorkSheetCompHistoryError");
}

function getJobHistory(pernr)
{
	if(ECM_DEBUG)$.log ("START getguideLines");
	var data = {};
	data[req_pernr]	= pernr;
	$.ajax({
	  url: getWorksheetJobHistURL,
	  data: data,
	  cache: false,
	  success:getJobHistorySuccess,
	  error:getJobHistoryError
	});

	if(ECM_DEBUG)$.log ("END getguideLines");
}

function getJobHistorySuccess(data, textStatus, XMLHttpRequest)
{
	populateWorksheetJobHist(data);
}

function getJobHistoryError(XMLHttpRequest, textStatus, errorThrown)
{
	if(ECM_DEBUG)$.log ("START getJobHistoryError");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " errorThrown: " + JSON.stringify(errorThrown));
	if(ajaxPreProcess(errorCode))
		return;
	if(ECM_DEBUG)$.log ("END getJobHistoryError");
}

function changeReviewPeriod()
{
	$('#upOneLevelBtn').attr('disabled','disabled');
	if(ECM_DEBUG)$.log ("START changeReviewPeriod");
	$('#empSearchValue').val('');
	var reviewId = $('#reviewSelect :selected').val();
	var data = {};
	data[req_selected_review_id] = reviewId;
	$.ajax({
		url: changeReviewPeriodURL,
		data: data,
		cache: false,
		success: changeReviewPeriodSuccess,
		error: function()
		{

		}
	});

	if(ECM_DEBUG)$.log ("END changeReviewPeriod");
}
function changeReviewPeriodSuccess(data, textStatus, XMLHttpRequest)
{
	if(ECM_DEBUG)$.log ("START changeReviewPeriodSuccess");
	buildRewards(data);
	if(ECM_DEBUG)$.log ("END changeReviewPeriodSuccess");
}

function changeReviewPeriodDropDown(){

	if(ECM_DEBUG)$.log ("START changeReviewPeriodDropDown");
	$('#empSearchValue').val('');
	var reviewId = $('#reviewSelect :selected').val();
	var data = {};
	data[req_selected_review_id] = reviewId;
	$.ajax({
		url: getTerminatedStmntURL,
		data: data,
		cache: false,
		success: changeReviewPeriodDropDownSuccess,
		error: function()
		{

		}
	});

	if(ECM_DEBUG)$.log ("END changeReviewPeriodDropDown");
}

function changeReviewPeriodDropDownSuccess(data, textStatus, XMLHttpRequest)
{
	if(ECM_DEBUG)$.log ("START changeReviewPeriodSuccess");
	buildRewards(data);
	if(ECM_DEBUG)$.log ("END changeReviewPeriodSuccess");
}

function getuserProfile(pernr)
{
	if(ECM_DEBUG)$.log ("START getuserProfile");
	var data = {};
	data[req_pernr]	= pernr;
	$.ajax({
	  url: getWorksheetUserProfileURL,
	  data: data,
	  cache: false,
	  success:getuserProfileSuccess,
	  error:getuserProfileError
	});

	if(ECM_DEBUG)$.log ("END getuserProfile");
}

function getuserProfileSuccess(data, textStatus, XMLHttpRequest)
{
	populateWorksheetuserProfile(data);
}

function getuserProfileError(XMLHttpRequest, textStatus, errorThrown)
{
	if(ECM_DEBUG)$.log ("START getuserProfileError");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " errorThrown: " + JSON.stringify(errorThrown));
	if(ajaxPreProcess(errorCode))
		return;
	if(ECM_DEBUG)$.log ("END getuserProfileError");
}

function getMyTeamView(pernr,planYear,viewId)
{
	if(ECM_DEBUG)$.log ("START getMyTeamView");
	var data = {};
	data[req_pernr]	= pernr;
	data['planYear']	= planYear;
	data['crt_req_type'] = viewId;
	$.ajax({
	  url: getMyTeamViewURL,
	  data: data,
	  cache: false,
	  success:getmyTeamDelegateProfileSuccess,
	  error:getmyTeamDelegateProfileError
	});

	if(ECM_DEBUG)$.log ("END getuserProfile");
}

function getmyTeamDelegateProfile(pernr,planYear,type)
{
	if(ECM_DEBUG)$.log ("START getuserProfile");
	var data = {};
	data[req_pernr]	= pernr;
	data['planYear']	= planYear;
	data['crt_req_type'] = type;
	$.ajax({
	  url: getMyTeamUserProfileURL,
	  data: data,
	  cache: false,
	  success:getmyTeamDelegateProfileSuccess,
	  error:getmyTeamDelegateProfileError
	});

	if(ECM_DEBUG)$.log ("END getuserProfile");
}

function getMyTeamPerformancePlans(pernr,planYear)
{
	if(ECM_DEBUG)$.log ("START getuserProfile");
	var data = {};
	data[req_pernr]	= pernr;
	data["planYear"] = planYear;
	$.ajax({
	  url: getMyTeamUserProfileURL,
	  data: data,
	  cache: false,
	  success:getMyTeamPerformancePlansSuccess,
	  error:getmyTeamDelegateProfileError
	});

	if(ECM_DEBUG)$.log ("END getuserProfile");
}

function getmyTeamDelegateProfileSuccess(data, textStatus, XMLHttpRequest)
{
	populateDelegateuserProfile(data);
}

function getmyTeamDelegateProfileError(XMLHttpRequest, textStatus, errorThrown)
{
	if(ECM_DEBUG)$.log ("START getmyTeamDelegateProfileError");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " errorThrown: " + JSON.stringify(errorThrown));
	if(ajaxPreProcess(errorCode))
		return;
	if(ECM_DEBUG)$.log ("END getmyTeamDelegateProfileError");
}

function employeeSearch(searchText, page)
{
	if(ECM_DEBUG)$.log ("START proxySetupEmployeeSearch");
	var data = {};
	data[req_emp_search_text] = searchText;
	$.ajax({
		url: searchAssociateURL,
		data: data,
		cache: false,
		success: function(data, textStatus, XMLHttpRequest){
			proxySetupEmployeeSearchSuccess(data, textStatus, XMLHttpRequest, page);
		},
		error: function()
		{

		}
	});

	if(ECM_DEBUG)$.log ("END proxySetupEmployeeSearch");
}

function proxySetupEmployeeSearchSuccess(data, textStatus, XMLHttpRequest,page)
{
	if(ECM_DEBUG)$.log ("START proxySetupEmployeeSearchSuccess");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " response: " + data);
	if(page == 'proxySetUp')
		buildProxySetup(data);
	if(page == 'budgetSetUp')
		buildBudgetSetup(data);
	if(page == 'myForm')
		buildCascadeEmployees(data);
	if(ECM_DEBUG)$.log ("END proxySetupEmployeeSearchSuccess");
}

function getQueryString(){
    var assocUrl ='';
    var items = window.location.search.substring(1).split('&');
    if(items!=""){
	    for(var j = 0; j < items.length; j++) {
	       var a = items[j].split('=');
	       if(a[0] != req_emp_search_text)
	       	assocUrl +=items[j];
	       if(j+1 !=items.length)
	    	   assocUrl +="&";
	    }
	    if(assocUrl!='')
	    	assocUrl = "?"+assocUrl;
    }
    return assocUrl;
}

function loadProxySetupIntoSession(data, isProxy)
{
	if(ECM_DEBUG)$.log ("START loadProxySetupIntoSession");
	var urlQuery = loadProxySetupIntoSessionURL;
	if(isProxy!=null)
		urlQuery = loadProxySetupIntoSessionURL+"?proxy="+isProxy;
	$.ajax({
		url: urlQuery,
		data: data,
		cache: false,
		success: function(data, textStatus, XMLHttpRequest){
			if(data.status){
				var url = '';
				//if(location.port !='')
				//	url = location.protocol +"//"+location.host+":"+location.port+location.pathname + getQueryString();
				//else
				var pathname = location.pathname.replace('Post','');
				url = location.protocol +"//"+location.host+pathname + getQueryString();
				location.replace(url);
			}
			else
				bootbox.alert(lang.proxy_not_allowed_to_access);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown)
		{
			if(ECM_DEBUG)$.log ("START loadProxySetupIntoSessionError");
			if(ECM_DEBUG)$.log ("text status: " + textStatus + " errorThrown: " + JSON.stringify(errorThrown));
			if(ajaxPreProcess(errorCode))
				return;
			if(ECM_DEBUG)$.log ("END loadProxySetupIntoSessionError");
		}
	});

	if(ECM_DEBUG)$.log ("END loadProxySetupIntoSession");
}

function resetProxySession()
{
	if(ECM_DEBUG)$.log ("START resetProxySession");
	$.ajax({
		url: resetProxyFromSessionURL,
		cache: false,
		success: function(data, textStatus, XMLHttpRequest){

			/*var url = '';
			var pathname = location.pathname.replace('Post','');
			url = location.protocol +"//"+location.host+ pathname + getQueryString();
			location.replace(url);*/

			window.location = homePageUrl;

		},
		error: function(XMLHttpRequest, textStatus, errorThrown)
		{
			if(ECM_DEBUG)$.log ("START resetProxySession");
			if(ECM_DEBUG)$.log ("text status: " + textStatus + " errorThrown: " + JSON.stringify(errorThrown));
			if(ajaxPreProcess(errorCode))
				return;
			if(ECM_DEBUG)$.log ("END resetProxySession");
		}
	});

	if(ECM_DEBUG)$.log ("END resetProxySession");
}
function releaseInitailBudget()
{
	var empId;
	var budgetIds = [];
	var amount = [];
	var mgrId;
	var tdata = $('#budgetTable').dataTable().fnGetData();
	var budgets = $('[id=initialBudget]');
	$.each(budgets, function(index, item){
		empId = $(this).attr('empid');
		mgrId = $(this).attr('mgrid');
		budgetIds.push($(this).attr('budgetid'));
		amount.push($(this).val());
	});
	var data = {};
	data[req_emp_id] = empId;
	data[req_mgr_id] = mgrId;
	data[req_sep_keys] = budgetIds.join(req_row_sep);
	data[req_sep_values] = amount.join(req_row_sep);
	data[req_status] = '2';

	$.ajax({
		url: saveBudgetInitialURL,
		data: data,
		cache: false,
		success: releasebudgetSuccess,
	error: function()
	{}
	});
}


function releasebudgetSuccess(data, textStatus, XMLHttpRequest)
{
	if(data.code){
		bootbox.hideAll();
		showError(data.message, lang.page_error_cntr, false);
	} else {
		bootbox.hideAll();
		if(ECM_DEBUG)$.log ("START releasebudgetSuccess");
		if(ECM_DEBUG)$.log ("text status: " + textStatus + " response: " + data);
		var html = [];
		html.push('<div class="alert alert-success">');
		html.push('	<button type="button" class="close" data-dismiss="alert"><i class="ace-icon fa fa-times"></i></button>');
		html.push('	<strong>'+lang.js_budget_mgmt_saved_text+'</strong>');
		html.push(''+lang.js_budget_mgmt_budget_release_success_msg+'<br />');
		html.push('</div>');
		$('#page-error-cntr').html(html.join(''));
		$("body,html").scrollTop(0);
		//buildBudgetSetup(budgetSetup);
		if(ECM_DEBUG)$.log ("END releasebudgetSuccess");
	}
}

function getDrillDownStatement(empId, reviewId,isTrue)
{
	if(ECM_DEBUG)$.log ("START getEmpStatementMgmt");
	if(!isTrue){
		var empIds = $('#upOneLevelBtn').attr('mgrId');
		$('#upOneLevelBtn').attr('mgrId',empIds+"~"+empId);
		$('#upOneLevelBtn').removeAttr('disabled');
	}
	var data = {};
	data[req_pernr] = empId;
	data[req_review_id_drill_down] = reviewId;
	$.ajax({
		url: getDrillDownForStatementURL,
		data: data,
		cache: false,
		success: getDrillDownStatementSuccess,
		error: getDrillDownStatementError
	});

	if(ECM_DEBUG)$.log ("END getEmpStatementMgmt");
}
function getDrillDownStatementSuccess(data, textStatus, XMLHttpRequest)
{
	if(ECM_DEBUG)$.log ("START getEmpStatementMgmtSuccess");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " response: " + data);
	buildRewards(data);
	var tdata = $('#table_report').dataTable().fnGetData();
	if(tdata.length==0)
	{
		var html = [];
	    html.push('<div class="alert alert-danger">');
		html.push('	<button type="button" class="close" data-dismiss="alert"><i class="ace-icon fa fa-times"></i></button>');
		html.push(lang.crt_statements_no_direct_reports+'<br />');
		html.push('</div>');
		$('#page-error-cntr').html(html.join(''));
		$("body,html").scrollTop(0);
	}
	if(ECM_DEBUG)$.log ("END getEmpStatementMgmtSuccess");
}

function getDrillDownStatementError(XMLHttpRequest, textStatus, errorThrown)
{
	if(ECM_DEBUG)$.log ("START getEmpStatementMgmtError");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " errorThrown: " + JSON.stringify(errorThrown));
	if(ajaxPreProcess(errorCode))
		return;
	if(ECM_DEBUG)$.log ("END getEmpStatementMgmtError");
}
function getDirectReportsForStatement(reviewId)
{
	if(ECM_DEBUG)$.log ("START getEmpStatementMgmt");
	$('#page-error-cntr').empty();
	var data = {};
	data[req_review_id_direct_reports] = reviewId;
	$.ajax({
		url: getDirectReportStatementURL,
		data: data,
		cache: false,
		success: getDirectReportSuccess,
		error: getDirectReportError
	});

	if(ECM_DEBUG)$.log ("END getEmpStatementMgmt");
}

function getDirectReportSuccess(data, textStatus, XMLHttpRequest)
{
	if(ECM_DEBUG)$.log ("START getEmpStatementMgmtSuccess");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " response: " + data);
	buildRewards(data);
	if(ECM_DEBUG)$.log ("END getEmpStatementMgmtSuccess");
}

function getDirectReportError(XMLHttpRequest, textStatus, errorThrown)
{
	if(ECM_DEBUG)$.log ("START getEmpStatementMgmtError");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " errorThrown: " + JSON.stringify(errorThrown));
	if(ajaxPreProcess(errorCode))
		return;
	if(ECM_DEBUG)$.log ("END getEmpStatementMgmtError");
}

function getScreensForRole(role,moduleId)
{
	$('#messageId').html('');
	var roleId = role || '';
	var url = getRoleScreenURL;
    var urlquery = {
    	"roleId" : roleId,
    	"moduleId" : moduleId
   	};
	$.ajax({
		dataType : "json",
		url : url,
		data : urlquery,
		type : "GET",
		cache : false,
		success : function(response) {
			populateSelectedScreen(response);
		},
		error: function(request,status,error){
			showError(lang.error_sys_admin,lang.message_id);
		}
	});
}
function getRolesForUser(userId, AvailEleId, selEleId){
	$('#messageId').html('');
	var user = userId || '';
	var url = getRolesForUserURL;
    var urlquery = {
    	"userId" : user
   	};
	$.ajax({
		dataType : "json",
		url : url,
		data : urlquery,
		type : "GET",
		cache : false,
		success : function(response) {
			pushIntoAvailableSelectedRole(response.availableRole, response.selectedRole, AvailEleId, selEleId);
		},
		error: function(request,status,error){
			showError(lang.error_sys_admin,lang.message_id);
		}
	});
}

function getPlanList(selectedReviewId){
	$('#messageId').html('');
	var data = {};
	data[req_review_id] = selectedReviewId;
	$.ajax({
        url:getPlanActivationListURL,
        data:data,
        cache: false,
        async : false,
        success: function(data, textStatus, XMLHttpRequest){
        	getPlanListSuccess(data, textStatus, XMLHttpRequest);
        },
		error: getPlanListError
	 });
}

function getPlanListSuccess(data, textStatus, XMLHttpRequest){
	if(data!=null){
		loadPlanList(data, false);
	}
}

function getPlanListError(){
	showError(lang.error_sys_admin,lang.message_id);
}

function getPlanInfo(element){
	$('#messageId').html('');
	var reviewItemId = $(element).attr('reviewItemId');
	var data = {};
	data[req_review_item_id] = reviewItemId;
	$.ajax({
        url:getPlanInfoURL,
        data:data,
        cache: false,
        async : false,
        success: function(data, textStatus, XMLHttpRequest){
        	getPlanInfoSuccess(data, textStatus, XMLHttpRequest, element);
        	toggleCss(reviewItemId);
        },
		error: getPlanInfoError
	 });

}

function getPlanInfoSuccess(data, textStatus, XMLHttpRequest, element){
	if(data!=null){
		loadPlanInfo(data, element);
	}
}

function getPlanInfoError(){
	showError(lang.error_sys_admin,lang.message_id);
}

function activateRecommendations(){
	var effectiveDate = $('#effectiveDate').val();
	var reviewItemId = $('#btn_activate').attr('revItemId');
	var setEffectiveDateStatus = $('#dateCheckBox').is(':checked') ? 1 : 0;
	if(setEffectiveDateStatus != null){
		var data={};
		data[req_plan_activation_text_effective_date] = effectiveDate;
		data[req_plan_activation_text_set_effective_date_status] = setEffectiveDateStatus;
		data[req_plan_activation_text_review_item_id] = reviewItemId;
		$.ajax({
			url: activateRecommendationsURL,
			data: data,
			cache: false,
			success: activateRecommendationsSuccess,
			error: activateRecommendationsError
		});
	}
}

function activateRecommendationsSuccess(dataMap, textStatus, XMLHttpRequest){
	bootbox.alert(lang.plan_activation_text_activated_recommendations);
	if(null!=dataMap.planInfoMap && undefined !=dataMap.planInfoMap){
		loadPlanInfo(dataMap.planInfoMap);
	}
}

function activateRecommendationsError(){
	showError(lang.error_sys_admin,lang.message_id);
}

function changeReportSpan(isRunBackground,element)
{
	var type = $("#reportSpanId option:selected").val();
	var reportId = reportList[0].id;
	var tierLevel = 0;
	if(reportId == "VARIABLE_COMP_TIER")
		tierLevel =  $("#tierLevel option:selected").val();
	var data={};
	data[type_Id]=type;
	data[crt_req_rpt_id]=reportId;
	data[req_tier_level] = tierLevel;
	data['status'] = $('#status').val();
	data['level'] = $('#level').val();
	data['manager'] = $('#manager').attr("empId");
	data['managerSpan'] = $('#managerSpan').val();
	data['goalPlanId'] = $('#goalPlans').val();
	data['periodId'] = $('#periods').val();
	data['libId'] = $("#years option:selected").attr('libId');
	var url = "";
	if(isRunBackground){
		url = runReportBackgroundUrl;
		data[req_content_type] = $(element).attr('contentType');
	}
	else
		url = getReportListURL;
	$.ajax({
		url: url,
		data: data,
		cache: false,
		context : {isRunBackground :isRunBackground,reportId:reportId},
		success: changeReportSpanSuccess,
		error: changeReportSpanError
	});

	if(ECM_DEBUG)$.log ("END changeReportSpan");
}

function changeReportSpanSuccess(data, textStatus, XMLHttpRequest)
{
	if(ECM_DEBUG)$.log ("START changeReportSpanSuccess");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " response: " + data);
	if(this.isRunBackground){
		if(data.message && data.message!="")
			showError(data.message,"page-error-cntr");
		else
			showSuccess(lang.js_run_report_background_success_msg,"page-error-cntr");
	}
	else if(this.reportId =="CMP_EXEC_SUM"){
		populateTopDownReport(data);
	}else if(this.reportId =="VARIABLE_COMP_TIER"){
		populateTierAndRatingReport(data);
	}else if(this.reportId == "RECOMM_OVERVIEW"){
		populateRecomOverviewReport(data);
	}else
		populateReport(this.reportId,data);
	if(ECM_DEBUG)$.log ("END changeReportSpanSuccess");
}

function changeReportSpanError(XMLHttpRequest, textStatus, errorThrown)
{
	if(ECM_DEBUG)$.log ("START changeReportSpanError");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " errorThrown: " + JSON.stringify(errorThrown));
	if(ajaxPreProcess(errorCode))
		return;
	if(ECM_DEBUG)$.log ("END changeReportSpanError");
}

function loadReportPDF(data, id)
{
	showLoading();

	var params = '&status=' + $('#status').val()+ '&goalPlanId='+$('#goalPlans').val()+'&periodId='+$('#periods').val()+'&level='+$('#level').val()+'&manager='+$('#manager').attr("empId")+'&managerSpan='+$('#managerSpan').val()+'&libId='+$('#years option:selected').attr('libId');

	if(id=='btn_print_pdf')
	{
		$.fileDownload(data[req_pdf_url]+"?"+type_Id+"="+data[type_Id]+"&"+req_export_report_pdf+"="+data[req_export_report_pdf]+"&"+req_report_id+"="+data[req_report_id]+"&"+req_tier_level+"="+data[req_tier_level]+params,{
				successCallback: function (url) {
				 	closeLoading();
				    },
				    failCallback: function (html, url) {
				         closeLoading();
				         reportMsg(html);
    					}
		});
	}
	else if(id=='btn_print_excel')
	{
		$.fileDownload(data[req_pdf_url]+"?"+type_Id+"="+data[type_Id]+"&"+req_export_report_excel+"="+data[req_export_report_excel]+"&"+req_report_id+"="+data[req_report_id]+"&"+req_tier_level+"="+data[req_tier_level]+params,{
				successCallback: function (url) {
				 	closeLoading();
				    },
				    failCallback: function (html, url) {
				         closeLoading();
				         reportMsg(html);
    					}
		});
	}

}

function loadReportPDF(data, id)
{
	showLoading();

	var params = '&status=' + $('#status').val()+ '&goalPlanId='+$('#goalPlans').val()+'&periodId='+$('#periods').val()+'&level='+$('#level').val()+'&manager='+$('#manager').attr("empId")+'&managerSpan='+$('#managerSpan').val()+'&libId='+$('#years option:selected').attr('libId');

	if(id=='btn_print_pdf')
	{
		$.fileDownload(data[req_pdf_url]+"?"+type_Id+"="+data[type_Id]+"&"+req_export_report_pdf+"="+data[req_export_report_pdf]+"&"+req_report_id+"="+data[req_report_id]+"&"+req_tier_level+"="+data[req_tier_level]+params,{
				successCallback: function (url) {
				 	closeLoading();
				    },
				    failCallback: function (html, url) {
				         closeLoading();
				         reportMsg(html);
    					}
		});
	}
	else if(id=='btn_print_excel')
	{
		$.fileDownload(data[req_pdf_url]+"?"+type_Id+"="+data[type_Id]+"&"+req_export_report_excel+"="+data[req_export_report_excel]+"&"+req_report_id+"="+data[req_report_id]+"&"+req_tier_level+"="+data[req_tier_level]+params,{
				successCallback: function (url) {
				 	closeLoading();
				    },
				    failCallback: function (html, url) {
				         closeLoading();
				         reportMsg(html);
    					}
		});
	}

}
function loadCompensationReportPDF(ele)
{
	showLoading();
	//var params = '&status=' + $('#status').val()+ '&goalPlanId='+$('#goalPlans').val()+'&periodId='+$('#periods').val()+'&level='+$('#level').val();
	var planYear=''
	if($('#planYears').length > 0)
		planYear = $('#planYears').val();
	else
		planYear = $(ele).attr('planYear');
	$.fileDownload(req_compensation_pdf_url+"?crt_req_planYear="+planYear,{
			successCallback: function (url) {
			 	closeLoading();
			    },
		    failCallback: function (html, url) {
		         closeLoading();
		         reportMsg(html);
				}
	});
}

function searchEmployeeForAdminWorkflow(empSearchInput)
{
	var data = {};
	data[req_pernr_fname_lname] = empSearchInput;

	$.ajax({
	  url: getEmpWorkItemsForAdminUrl,
	  data: data,
	  cache: false,
	  context : {searchKey : empSearchInput},
	  success:searchEmpSuccess,
	  error:searchEmpError
	});

	if(ECM_DEBUG)$.log ("END searchEmployeeForAdminWorkflow");
}

function searchEmpSuccess(data, textStatus, XMLHttpRequest)
{

	pushEmpWrkItmsData(data,this.searchKey);
}

function searchEmpError(XMLHttpRequest, textStatus, errorThrown)
{
	if(ajaxPreProcess(errorCode))
		return;

}
function deleteWorkitems(ids,empId){
	var data = {};
	data[req_pernr] = empId;
	data[req_sep_keys] = ids.join(req_row_sep);

		$.ajax({
			url: deleteWorkItemstURL,
			data: data,
			cache: false,
			context : {searchKey : empId},
			success: deleteWorkitemsSuccess,
			error: deleteWorkitemsError

		});
}
function deleteWorkitemsSuccess(data, textStatus, XMLHttpRequest)
{
	if(data == lang.delete_fail)
		bootbox.alert(lang.js_delete_failure);
	else{
		pushEmpWrkItmsData(data,this.searchKey);
		bootbox.alert(lang.js_delete_sucess);
	}
}

function deleteWorkitemsError(XMLHttpRequest, textStatus, errorThrown)
{
	if(ajaxPreProcess(errorCode))
		return;

}

function loadImage(){
	$.ajax({
        url:loadImageURL,
        cache: false,
        async : false,
        success: loadImageSuccess,
		error: loadImageError
	 });
}

function loadImageSuccess(data, textStatus, XMLHttpRequest){
	//$('#usrImageId').attr({src:"data:image/png;base64,"+ data.profileImage});
	loadImageByte(data.profileImage);
}

function loadImageError(XMLHttpRequest, textStatus, errorThrown){
	showError('Contact system admin', lang.message_id);
}
function removeProfileImageAjax(){
	$.ajax({
        url:removeProfileImageURL,
        cache: false,
        async : true,
        success: function(dataMap, textStatus, XMLHttpRequest){
			if(dataMap.status=='OK'){
				showSuccess(lang.js_my_profile_message_delete_img_success, "page-error-cntr");
				//$('#user-profile-3 input[type=file]').ace_file_input('reset_input');
				resetImage();
			} else {
				showError(dataMap.js_my_profile_message_delete_img_fail, "page-error-cntr");
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			showError(lang.js_my_profile_message_delete_img_fail,"page-error-cntr");
		}
	 });
}

function searchEmployeeForSltAdmin(empId)
{
	if(ECM_DEBUG)$.log ("Start searchEmployeeForAdminWorkflow");
	var data = {};
	data[req_pernr] = empId

	$.ajax({
	  url: getEmployeesForSltAdminUrl,
	  data: data,
	  cache: false,
	  success:searchEmpForSltAdminSuccess,
	  error:searchEmpForSltAdminError
	});

	if(ECM_DEBUG)$.log ("END searchEmployeeForAdminWorkflow");
}

function searchEmpForSltAdminSuccess(data, textStatus, XMLHttpRequest)
{
	$("#SLTList").hide();
	$("#results").show();
	//pushButtonContent();
	pushSearchResultsForSlfAdmin(data);
}

function searchEmpForSltAdminError(XMLHttpRequest, textStatus, errorThrown)
{
	if(ajaxPreProcess(errorCode))
		return;

}

function reloadSltEmployeeList(empId)
{
	if(ECM_DEBUG)$.log ("Start searchEmployeeForAdminWorkflow");
	$.ajax({
	  url: reloadSLTAdminURL,
	  cache: false,
	  success:reloadSltEmployeeListSuccess,
	  error:reloadSltEmployeeListError
	});

	if(ECM_DEBUG)$.log ("END searchEmployeeForAdminWorkflow");
}

function reloadSltEmployeeListSuccess(data, textStatus, XMLHttpRequest)
{
	buildEmployeeSltList(data);
	$("#results").hide();
	$("#SLTList").show();
}

function reloadSltEmployeeListError(XMLHttpRequest, textStatus, errorThrown)
{
	if(ajaxPreProcess(errorCode))
		return;

}

function editMin(ele, operation){
	$('#page-error-cntr').empty();

	var minAca ="";
	var minLtpp = "";
	var type = "";
	if(operation == 'update'){
		minAca = $('#minAca').val();
		minLtpp = $('#minLtpp').val();
		type = $('#typeEdit').val();
	}

	var data = {
		'employeeId'		:$(ele).attr('empId'),
		'clientId'			:$(ele).attr('clientId'),
		'reviewId'			:$(ele).attr('reviewId'),
		'minAca'			:minAca,
		'minLtpp'			:minLtpp,
		'searchText'		:$('#empSearchValue').val(),
		'operation'         :operation,
		'type'				:type
	};

	$.ajax({
		url: editGuaranteesURL,
		data: data,
		cache: false,
		success: function(data, textStatus, XMLHttpRequest){
			setGuaranteesSuccess(data, operation);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			setGuaranteesError(operation);
		}
	});
}

function reloadGuaranteesData(showCancelBtn) {
	$('#page-error-cntr').empty();

	var data = {};

	if(showCancelBtn)
		data[req_pernr] = $('#empSearchValue').val();

	$.ajax({
		url : searchGuaranteesEmployeeURL,
		data : data,
		async : false,
		cache : false,
		success : function(data, textStatus, XMLHttpRequest) {
			populateResultsTable(data);
			if (showCancelBtn) {
				$('#btn_cancel').removeAttr('disabled');
			} else {
				$('#btn_cancel').attr('disabled', 'disabled');
				$('#empSearchValue').val('');
			}
		},
		error : loadGuaranteesError
	});

	if(showCancelBtn)
		$('#empSearchValue').val(data[req_pernr]);
}

function exportRecommendations()
{
	var reviewId = $('#reviewSelect').val();
	var data = {};
	data[req_selected_review_id] = reviewId;
	showLoading();
	$.fileDownload(exportRecommendationsURL+"?"+req_selected_review_id+"="+reviewId,{
		successCallback: function (url) {
		 	closeLoading();
		    },
		    failCallback: function (html, url) {
		         closeLoading();
			}
	});
}

function loadEmpProxy(element, bootboxDialog)
{
	/*bootbox.confirm(lang.js_proxy_setup_confirm_msg, function(result) {
		if(result) {
			var empId = $(element).attr('empId');
			var empFname = $(element).attr('empFirstName');
			var empLname = $(element).attr('empLastName');
			var data = {};
			data[req_emp_id] = empId;
			data[req_emp_first_name] = empFname;
			data[req_emp_last_name] = empLname;
			loadProxySetupIntoSession(data);
		}
	});*/

	bootbox.dialog({message:bootboxDialog,
		buttons:{
			"success" :
			{
				"label" :  lang.crt_bootbox_ok,
				"className" : "btn btn-sm btn-primary",
				"callback": function() {
					var empId = $(element).attr('empId');
					var empFname = $(element).attr('empFirstName');
					var empLname = $(element).attr('empLastName');
					var data = {};
					data[req_emp_id] = empId;
					data[req_emp_first_name] = empFname;
					data[req_emp_last_name] = empLname;
					loadProxySetupIntoSession(data);
				}
			},
			"danger" :
			{
				"label" :  lang.crt_bootbox_cancel,
				"className" : "btn btn-sm",
				"callback": function() {
					$("#modal-proxy-setup").modal('hide');
				}
			}
		}
	});



}

function exportRecommendationsSuccess(data, textStatus, XMLHttpRequest)
{
	if(ECM_DEBUG)$.log ("START changeReportSpanSuccess");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " response: " + data);
	if(ECM_DEBUG)$.log ("END changeReportSpanSuccess");
}

function exportRecommendationsError(XMLHttpRequest, textStatus, errorThrown)
{
	if(ECM_DEBUG)$.log ("START changeReportSpanError");
	if(ECM_DEBUG)$.log ("text status: " + textStatus + " errorThrown: " + JSON.stringify(errorThrown));
	if(ajaxPreProcess(errorCode))
		return;
	if(ECM_DEBUG)$.log ("END changeReportSpanError");
}

function getAvailableScreens(role,moduleId)
{
	$('#messageId').html('');
	var roleId = role || '';
	var url = getAvailableRoleScreenURL;
    var urlquery = {
    	"roleId" : roleId,
    	"moduleId":moduleId
   	};
	$.ajax({
		dataType : "json",
		url : url,
		data : urlquery,
		type : "GET",
		cache : false,
		success : function(response) {
			populateAvailableRoleScreens(response);
		},
		error: function(request,status,error){
			showError(lang.error_sys_admin,lang.message_id);
		}
	});
}

function addAvailableScreens(screens,moduleId)
{
	$('#messageId').html('');
	var screenId = screens.join(',') || '';
	var roleId = $('#roleAccess option:selected').val();
	var url = addAvailableScreensURL;
    var urlquery = {
    	"screenId" : screenId,
    	"roleId" : roleId,
    	"moduleId":moduleId
   	};
	$.ajax({
		dataType : "json",
		url : url,
		data : urlquery,
		type : "GET",
		cache : false,
		success : function(response) {
			populateSelectedScreen(response);
			showSuccess(lang.js_role_access_label_msg_success,lang.message_id);
			bootbox.hideAll();
		},
		error: function(request,status,error){
			showError(lang.error_sys_admin,lang.message_id);
		}
	});

}

function deleteAvailableScreens(screenId,roleId,moduleId)
{
	$('#messageId').html('');
	var url = deleteAvailableScreensURL;
    var urlquery = {
    	"screenId" : screenId,
    	"roleId" : roleId,
    	"moduleId": moduleId,
    	"roleIdSelected" : $('#roleAccess').val(),
    	"moduleIdSelected": $('#moduleAccess').val()
   	};
	$.ajax({
		dataType : "json",
		url : url,
		data : urlquery,
		type : "GET",
		cache : false,
		success : function(response) {
			populateSelectedScreen(response);
			showSuccess(lang.js_role_access_label_msg_delete_ajax,lang.message_id);
		},
		error: function(request,status,error){
			showError(lang.error_sys_admin,lang.message_id);
		}
	});

}

function searchLog(logType, dateRange, empID, logLimit )
{
	dateRange = dateRange.replace("-", "~")
	var data = {};
	data[req_log_Type] = logType;
	data[req_date_range] = dateRange;
	data[req_emp_id] = empID;
	data[req_log_imit] = logLimit;
	$.ajax({
		url: searchLogURL,
		data: data,
		cache: false,
		success: searchLogSuccess,
		error: function()
		{

		}
	});

}


function searchLogSuccess(dataMap, textStatus, XMLHttpRequest){

	var data;
	if(dataMap.status==true){
		data = dataMap.logList;
		populateSearchLogs(data);
	} else {
		data = dataMap.errorMessage;
		showError(data, lang.logviewer_message_id);
	}
}



function downloadReport(element){
	showLoading();
	$.fileDownload(downloadReportUrl+"?"+req_download_report_id+"="+$(element).attr('reportOfflineId')+"&"+req_download_report_fname+"="+$(element).attr('fileName'),{
		successCallback: function (url) {
		 	closeLoading();
		    },
		    failCallback: function (html, url) {
		         closeLoading();
		         reportMsg(html);
			}
	});
}

function showReportErrorMessage(element){
	bootbox.alert($(element).attr('titleText'));
}

function searchEmployeeForSltAdmin(empId)
{
	if(ECM_DEBUG)$.log ("Start searchEmployeeForAdminWorkflow");
	var data = {};
	data[req_pernr] = empId

	$.ajax({
	  url: getEmployeesForSltAdminUrl,
	  data: data,
	  cache: false,
	  success:searchEmpForSltAdminSuccess,
	  error:searchEmpForSltAdminError
	});

	if(ECM_DEBUG)$.log ("END searchEmployeeForAdminWorkflow");
}

function initiateBatchPrint(data){
	if(ECM_DEBUG)$.log ("Start initiateBatchPrint");
	$.ajax({
	  url: initiateBatchPrintURL,
	  data: data,
	  cache: false,
	  success:initiateBatchPrintSuccess,
	  error:initiateBatchPrintError
	});

	if(ECM_DEBUG)$.log ("END initiateBatchPrint");
}

function initiateBatchPrintSuccess(dataMap, textStatus, XMLHttpRequest){

	var message;
	message = dataMap.message;
	if(dataMap.status=='1'){
		$('#page-error-cntr').html('');
		var html = [];
		html.push('<div class="alert alert-success">');
		html.push('	<button type="button" class="close" data-dismiss="alert"><i class="ace-icon fa fa-times"></i></button>');
		html.push('	<strong>'+lang.js_batch_print_saved_text+'</strong>');
		html.push(' '+message+'<br/>');
		html.push('</div>');
		//$('#page-error-cntr').html(html.join(''));
		showSuccess(html.join(''), "page-error-cntr");
		$("body,html").scrollTop(0);
	} else {
		showError(message, 'page-error-cntr');
	}
}

function initiateBatchPrintError(XMLHttpRequest, textStatus, errorThrown){
	showError(lang.js_batch_print_error_msg, 'page-error-cntr');
}

function initiateBonusBatchPrint(data){
	if(ECM_DEBUG)$.log ("Start initiateBonusBatchPrint");
	$.ajax({
	  url: initiateBonusBatchPrintURL,
	  data: data,
	  cache: false,
	  success:initiateBonusBatchPrintSuccess,
	  error:initiateBonusBatchPrintError
	});

	if(ECM_DEBUG)$.log ("END initiateBonusBatchPrint");
}

function initiateBonusBatchPrintSuccess(dataMap, textStatus, XMLHttpRequest){

	var message;
	message = dataMap.message;
	if(dataMap.status=='1'){
		$('#page-error-cntr').html('');
		/*var html = [];
		html.push('<div class="alert alert-success">');
		html.push('	<button type="button" class="close" data-dismiss="alert"><i class="ace-icon fa fa-times"></i></button>');
		html.push('	<strong>Success! </strong>');
		html.push(' '+message+'<br/>');
		html.push('</div>');*/
		showSuccess(message, "page-error-cntr");
		$("body,html").scrollTop(0);
	} else {
		showError(message, 'page-error-cntr');
	}
}

function initiateBonusBatchPrintError(XMLHttpRequest, textStatus, errorThrown){
	showError(lang.js_bonus_batch_print_error_msg, 'page-error-cntr');
}
function loadBatch(data){
	showLoading();
	$.fileDownload(data[req_batch_url]+"?"+req_file_name+"="+data[req_file_name]+"&"+crt_req_stmt_type+"="+data[crt_req_stmt_type],{
		successCallback: function (url) {
		 	closeLoading();
		    },
		    failCallback: function (html, url) {
		         closeLoading();
		         reportMsg(html);
			}
	});
}

function getBatchPrint(){
	if(ECM_DEBUG)$.log ("Start getBatchPrint");
	var data = {};
	$.ajax({
	  url: getBatchPrintURL,
	  data: data,
	  cache: false,
	  success:getBatchPrintSuccess,
	  error:getBatchPrintError,
	  beforeSend : function(){
		  showLoading(lang.batch_jsp_statement_batch_load_msg);
	  },
	  complete: function(){
    	closeLoading();
	  }
	});

	if(ECM_DEBUG)$.log ("END getBatchPrint");
}

function getBatchPrintSuccess(batchEmpList, textStatus, XMLHttpRequest){

	buildBatchPrint(batchEmpList);
}

function getBatchPrintError(XMLHttpRequest, textStatus, errorThrown){
	showError(lang.js_batch_print_error_msg, 'page-error-cntr');
}

function getEmployeeSerachResults(searchText)
{
	if(ECM_DEBUG)$.log ("START proxySetupEmployeeSearch");
	var data = {};
	data[req_emp_search_text] = searchText;
	$.ajax({
		url: searchAssociateURL,
		data: data,
		cache: false,
		success: function(data, textStatus, XMLHttpRequest){
			buildEmployeeSearchSuccess(data, textStatus, XMLHttpRequest);
		},
		error: function()
		{

		}
	});

	if(ECM_DEBUG)$.log ("END proxySetupEmployeeSearch");
}

function addMin(){
	$('#page-error-cntr').empty();

	var minAca ="";
	var minLtpp = "";
	var type = $('#type option:selected').val();
	minAca = $('#addMinAca').val();
	minLtpp = $('#addMinLtpp').val();
	var data = {
		'employeeId'		:$('#addGuaranteeName').attr('pernr'),
		'minAca'			:minAca,
		'minLtpp'			:minLtpp,
		'type'         :type
	};

	$.ajax({
		url: addGuaranteesURL,
		data: data,
		cache: false,
		success: function(data, textStatus, XMLHttpRequest){
			setGuaranteesSuccess(data, 'add');
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			setGuaranteesError('add');
		}
	});
}

function downloadGuaranteeToExcel(){

	showLoading();
	$.fileDownload(viewGuaranteeExcelURL,{
			successCallback: function (url) {
			closeLoading();
			},
			failCallback: function (html, url) {
				closeLoading();
				//showError(html, "table-error-cntr", false);
				reportMsg(html);
			}
	});
}
function addKPITypeDetails(){
	/*alert($('#kpiTypeId').val());
	alert($('#kpiTypeName').val());*/
	var libId = $('#kpiLibId').val();
	var data={"kpiTypeId":$('#kpiTypeId').val(),"kpiTypeName":$('#kpiTypeName').val(),"libId":libId};
	$.ajax({
		type: 'GET',
		url : addKPITypes,
		data:data,
		contentType: 'application/json',
		async:false,
		success:function(dataMap, textStatus, XMLHttpRequest){
			if(dataMap.status==true){
				data = dataMap.kpiTypeList;
				bootbox.hideAll();
				showSuccess(lang.kpi_type_add_success_msg, "page-error-cntr");
				buildKpiTypes(data);
			} else {
				showError(dataMap.errorMessage, 'message');
			}

		},
		error:function(xhr){
			$("#add_period_dlg").dialog("close");
		      alert("An error occured: " + xhr.status + " " + xhr.statusText);
		    }
	});
	return true;
}
function removeKPITypeDetails(){

	var data=$("input[id=kpicheckbox]:checked").map(function () {
			return this.value;
			}).get().join(",");
	var libId = $('#kpiLibId').val();
	var json={"kpiTypeId":data,"libId":libId};
		$.ajax({
			type: 'GET',
			url : removeKPITypes,
			data:json,
			contentType: 'application/json',
			async:false,
			success:function(dataMap, textStatus, XMLHttpRequest){
					if(dataMap.status==true){
						data = dataMap.kpiTypeList;
						bootbox.hideAll();
						showSuccess(lang.kpi_type_delete_success_msg, "page-error-cntr");
						buildKpiTypes(data);
					} else {
						showError(dataMap.errorMessage, 'page-error-cntr');
					}


			},
			error:function(xhr){
				$("#add_period_dlg").dialog("close");
				  alert("An error occured: " + xhr.status + " " + xhr.statusText);
				 }
		});
}
function editKPITypeDetails(){
	var kpiTypeId=$('#editKpiTypeId').val();
	var kpiTypeName=$('#editKpiTypeName').val();
	var libId = $('#kpiLibId').val();
	var json={"kpiTypeId":kpiTypeId,"kpiTypeName":kpiTypeName,"libId":libId};
		$.ajax({
			type: 'GET',
			url : editKPITypes,
			data:json,
			contentType: 'application/json',
			async:false,
			success:function(dataMap, textStatus, XMLHttpRequest){
				if(dataMap.status==true){
					data = dataMap.kpiTypeList;
					bootbox.hideAll();
					showSuccess(lang.kpi_type_edit_success_msg, "page-error-cntr");
					buildKpiTypes(data);
				} else {
					showError(dataMap.errorMessage, 'message');
				}

			},
			error:function(xhr){
					bootbox.hideAll();
				  alert("An error occured: " + xhr.status + " " + xhr.statusText);
			}
		});
}
function saveSubCategoryAjax(data){
	$.ajax({
		url: saveKpiSubCategoryURL,
		data: data,
		cache: false,
		type:'POST',
		success: function(dataMap, textStatus, XMLHttpRequest){
			if(dataMap.status==true){
				data = dataMap.kpiSubCategoryList;
				bootbox.hideAll();
				showSuccess(lang.setup_kpi_sub_category_msg_save_success, "page-error-cntr");
				buildSubCategories(data);
			} else {
				showError(dataMap.errorMessage, 'message');
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			showError(lang.setup_kpi_sub_category_msg_save_fail,"page-error-cntr");
		}
	});
}

function updateSubCategoryAjax(data){
	$.ajax({
		url: saveKpiSubCategoryURL,
		data: data,
		cache: false,
		type:'POST',
		success: function(dataMap, textStatus, XMLHttpRequest){
			if(dataMap.status==true){
				data = dataMap.kpiSubCategoryList;
				bootbox.hideAll();
				showSuccess(lang.setup_kpi_sub_category_msg_update_success, "page-error-cntr");
				buildSubCategories(data);
			} else {
				showError(dataMap.errorMessage, "page-error-cntr");
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			showError(lang.setup_kpi_sub_category_msg_update_fail,"page-error-cntr");
		}
	});
}

function savePlanTypeAjax(data){
	$.ajax({
		url: insertPlanTypeURL,
		data: data,
		cache: false,
		type:'POST',
		success: function(dataMap, textStatus, XMLHttpRequest){
			if(dataMap.status==true){
				data = dataMap[res_plan_type_list];
				bootbox.hideAll();
				showSuccess(lang.js_plan_types_add_success_msg, "page-error-cntr");
				buildPlanTypes(data);
			} else {
				showError(dataMap.errorMessage, 'message');
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			showError(lang.js_plan_types_add_failure_msg,"page-error-cntr");
		}
	});
}

function updatePlanTypeAjax(data){
	$.ajax({
		url: editPlanTypeURL,
		data: data,
		cache: false,
		type:'POST',
		success: function(dataMap, textStatus, XMLHttpRequest){
			if(dataMap.status==true){
				data = dataMap[res_plan_type_list];
				bootbox.hideAll();
				showSuccess(lang.js_plan_types_update_success_msg, "page-error-cntr");
				buildPlanTypes(data);
			} else {
				showError(dataMap.errorMessage, "page-error-cntr");
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			showError(lang.js_plan_types_update_failure_msg,"page-error-cntr");
		}
	});
}
function deletePlanType(input){
	var data = {};
	data['planTypeIdList'] = input;
	$.ajax({
		url: deletePlanTypeURL,
		data: data,
		cache: false,
		type:'POST',
		success: function(dataMap, textStatus, XMLHttpRequest){
			if(dataMap.status==true){
				data = dataMap[res_plan_type_list];
				showSuccess(lang.js_plan_types_delete_success_msg, "page-error-cntr");
				$('#delete_sub_category').attr('disabled', 'disabled');
				buildPlanTypes(data);
			} else {
				showError(dataMap.errorMessage, "page-error-cntr");
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			showError(lang.js_plan_types_delete_failure_msg,"page-error-cntr");
		}
	});
}
function saveUnitAjax(data){
	$.ajax({
		url: insertUnitURL,
		data: data,
		cache: false,
		type:'POST',
		success: function(dataMap, textStatus, XMLHttpRequest){
			if(dataMap.status==true){
				data = dataMap[res_unit_list];
				bootbox.hideAll();
				showSuccess(lang.js_uom_unit_add_success_msg, "page-error-cntr");
				buildUnits(data);
			} else {
				showError(dataMap.errorMessage, 'message');
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			showError(lang.js_uom_unit_add_failure_msg,"page-error-cntr");
		}
	});
}

function updateUnitAjax(data){
	$.ajax({
		url: editUnitURL,
		data: data,
		cache: false,
		type:'POST',
		success: function(dataMap, textStatus, XMLHttpRequest){
			if(dataMap.status==true){
				data = dataMap[res_unit_list];
				bootbox.hideAll();
				showSuccess(lang.js_uom_unit_update_success_msg, "page-error-cntr");
				buildUnits(data);
			} else {
				showError(dataMap.errorMessage, "page-error-cntr");
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			showError(lang.js_uom_unit_update_failure_msg,"page-error-cntr");
		}
	});
}
function deleteUnitAjax(input){
	var data = {};
	data[req_delete_unit_list] = input;
	data[req_kpi_lib_id]=$("kpiLibId").val();
	$.ajax({
		url: deleteUnitURL,
		data: data,
		cache: false,
		type:'POST',
		success: function(dataMap, textStatus, XMLHttpRequest){
			if(dataMap.status==true){
				data = dataMap[res_unit_list];
				showSuccess(lang.js_uom_unit_delete_success_msg, "page-error-cntr");
				$('#delete_sub_category').attr('disabled', 'disabled');
				buildUnits(data);
			} else {
				showError(dataMap.errorMessage, "page-error-cntr");
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			showError(lang.js_uom_unit_delete_failure_msg,"page-error-cntr");
		}
	});
}
function savePlanPeriodAjax(data){
	$.ajax({
		url: insertPlanPerionURL,
		data: data,
		cache: false,
		type:'POST',
		success: function(dataMap, textStatus, XMLHttpRequest){
			if(dataMap.status==true){
				data = dataMap[res_plan_period_list];
				bootbox.hideAll();
				showSuccess(lang.js_plan_periods_add_success_msg, "page-error-cntr");
				buildPlanPeriods(data);
			} else {
				showError(dataMap.errorMessage, 'message');
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			showError(lang.js_plan_periods_add_failure_msg,"message");
		}
	});
}

function getPlanPeriodAjax(data){
	$.ajax({
		url: getPlanPeriodURL,
		data: data,
		cache: false,
		type:'POST',
		success: function(dataMap, textStatus, XMLHttpRequest){
			if(dataMap.status==true){
				data = dataMap[res_plan_period_list];
				bootbox.hideAll();
				buildPlanPeriods(data);
			} else {
				showError(dataMap.errorMessage, 'message');
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			showError(lang.js_plan_periods_refresh_failure_msg);
		}
	});
}

function updatePlanPeriodAjax(data){
	$.ajax({
		url: editPlanPeriodURL,
		data: data,
		cache: false,
		type:'POST',
		success: function(dataMap, textStatus, XMLHttpRequest){
			if(dataMap.status==true){
				data = dataMap[res_plan_period_list];
				bootbox.hideAll();
				showSuccess(lang.js_plan_periods_update_success_msg, "page-error-cntr");
				buildPlanPeriods(data);
			} else {
				showError(dataMap.errorMessage, "message");
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			showError(lang.js_plan_periods_update_failure_msg,"message");
		}
	});
}
function deletePlanPeriod(input){
	var data = {};
	data[req_period_id] = input.periodId;
	data[req_period_plan_id] = input.planId;
	$.ajax({
		url: deletePlanPeriodURL,
		data: data,
		cache: false,
		type:'POST',
		success: function(dataMap, textStatus, XMLHttpRequest){
			if(dataMap.status==true){
				data = dataMap[res_plan_period_list];
				showSuccess(lang.js_plan_periods_delete_success_msg, "page-error-cntr");
				bindCheckBoxSelection();
				buildPlanPeriods(data);
			} else {
				showError(dataMap.errorMessage, "page-error-cntr");
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			showError(lang.js_plan_periods_delete_failure_msg,"page-error-cntr");
		}
	});
}

function submitKPIForm(submit, comment){
	$('#page-error-cntr').empty();

	var data = {};
	data[req_kpi_formId] = formId;

	if(submit == "submit") {

		data[req_submit_to_manager] = "S";

		isBulkUpdate = true;
		if(renderPlanWeight())
		{
			var result = getDataToSave();
			data[req_kpi_my_form_array] = result;
			data[req_save_form_array] = "Y";
		}
	}
	else if(submit == "approve")
		data[req_submit_to_manager] = "A";
	else if(submit == "reject"){
		data[req_submit_to_manager] = "R";
		data[req_comment] = comment;
	}
	$.ajax({
        url:updateMyFormURL,
        data:data,
        cache: false,
        type:"POST",
        success: function() {processCancel();},
		error: updateMyFormError
	});

}

function saveKPIForm(){
	$('#page-error-cntr').empty();
	isBulkUpdate = true;
	if(renderPlanWeight())
	{
		var data = {};
		var result = getDataToSave();
		data[req_kpi_my_form_array] = result;
		data[req_save_form_array] = "Y";
		$.ajax({
	        url:updateMyFormURL,
	        data:data,
	        cache: false,
	        type:"POST",
	        success: updateMyFormSuccess,
			error: updateMyFormError
		});
	}
}

function updateKPIForm(ele)
{
	$('#messageEdit').html('');
	isBulkUpdate = false;
	var data = {};
	var clientId = $(ele).attr('clientId');
	var formId = $(ele).attr('formId');
	var kpiId = $(ele).attr('kpiId');
	var libId = $(ele).attr('libId');
	var categoryId = $(ele).attr('categoryId');
	var weight = $('#weight').val().replace('%', '');
	if(weight==null || weight=='')
	{
		showError(lang.kpi_pls_enter_weight_msg, 'messageEdit');
		return false;
	}
	if(weight>100)
	{
		showError(lang.kpi_weight_exceed_error_msg, 'messageEdit');
		return false;
	}

	data[req_kpi_id] = kpiId;
	data[req_client_id] = clientId;
	data[req_kpi_formId] =formId;
	data[req_kpi_libId] =libId;
	data[req_kpi_weight] =weight;
	if(renderPlanWeight(kpiId,categoryId))
	{
		$.ajax({
	        url:updateMyFormURL,
	        data:data,
	        cache: false,
	        success: updateMyFormSuccess,
			error: updateMyFormError
		 });
	}
}

function updateMyFormSuccess(dataMap, textStatus, XMLHttpRequest){
	var data;
	if(dataMap.status==true){
		bootbox.hideAll();
		showSuccess(lang.kpi_update_success_msg, lang.page_error_cntr);
		populateCategoryData(dataMap.categoryList,dataMap.kpiList);
		$('input[inputValue]').blur(function() {
			if($("#manager_Comments").is(':visible') && $("#manager_Comments").next('div.popover:visible').length >0)
				$("#manager_Comments").click();
			bindTextboxEvents(this);

		});
		$('input[inputValue]').keydown(function(event){
			if(event.keyCode!=13)
				numericValidation(event);
			else{
				bindTextboxEvents(this);
				return false;
			}
		});
		bindManagerCommentsPopup();
	} else {
		data = dataMap.errorMessage;
		if(!isBulkUpdate)
			showError(data, 'messageEdit');
		else
			showError(data, lang.page_error_cntr);
	}
}

function updateMyFormError(XMLHttpRequest, textStatus, errorThrown)
{

}

function deleteKPI(ele)
{
	$('#page-error-cntr').empty();

	var kpiWeights = getDataToSave();


	bootbox.dialog({message:resultRemoveKpiForm,
			buttons:{
				"success" :
				{
					"label" :  lang.crt_bootbox_ok,
					"className" : "btn btn-sm btn-primary",
					"callback": function() {
						var data = {};
						data[req_kpi_id] = $(ele).attr('kpiId');
						data[req_kpi_formId] =$(ele).attr('formId');
						data[req_client_id] =$(ele).attr('clientId');
						data[req_kpi_libId] =$(ele).attr('libId');
						$.ajax({
					        url:deleteKpiMyFormURL,
					        data:data,
					        cache: false,
					        type:"POST",
					        success: function(dataMap, textStatus, XMLHttpRequest){
					        	deleteKpiMyFormSuccess(dataMap, textStatus, XMLHttpRequest,kpiWeights);
					        },
							error: deleteKpiMyFormError
						 });
					}
				},
				"danger" :
				{
					"label" :  lang.crt_bootbox_cancel,
					"className" : "btn btn-sm",
					"callback": function() {
						$("#modal-proxy-remove-approve").modal('hide');
					}
				}
			}
		});
}

function deleteKpiMyFormSuccess(dataMap, textStatus, XMLHttpRequest,kpiWeights){
	var data;
	if(dataMap.status==true){
		//data = dataMap.kpiCategoryList;
		bootbox.hideAll();
		showSuccess(lang.kpi_delete_success_msg, lang.page_error_cntr);
		var kpList = renderKPList(dataMap.kpiList,kpiWeights);
		populateCategoryData(dataMap.categoryList,kpList);
		$("body,html").scrollTop(0);
		populateKPICount();
		$('input[inputValue]').blur(function() {
			if($("#manager_Comments").is(':visible') && $("#manager_Comments").next('div.popover:visible').length >0)
				$("#manager_Comments").click();
			bindTextboxEvents(this);

		});
		$('input[inputValue]').keydown(function(event){
			if(event.keyCode!=13)
				numericValidation(event);
			else{
				bindTextboxEvents(this);
				return false;
			}
		});
		bindManagerCommentsPopup();
	} else {
		data = dataMap.errorMessage;
		showError(data, lang.page_error_cntr);
	}
}

function deleteKpiMyFormError(XMLHttpRequest, textStatus, errorThrown)
{

}

function openInheritKPIScreen()
{
	var data = {};
	data[req_selected_plan_year] = '2014';
	$.ajax({
        url:inheritKPIUrl,
        data:data,
        cache: false,
        success: inheritKPISuccess,
		error: function(){

		}
	 });
}

function inheritKPISuccess(data, textStatus, XMLHttpRequest)
{
	bootbox.dialog({message:resultInheritKpi});
	populateInheritData(data);
}

function deleteSubCategory(input){
	var data = {};
	data[req_delete_sub_cat_id_list] = input;
	$.ajax({
		url: deleteKpiSubCategoryURL,
		data: data,
		cache: false,
		type:'POST',
		success: function(dataMap, textStatus, XMLHttpRequest){
			if(dataMap.status==true){
				data = dataMap.kpiSubCategoryList;
				showSuccess(lang.setup_kpi_sub_category_msg_delete_success, "page-error-cntr");
				$('#delete_sub_category').attr('disabled', 'disabled');
				buildSubCategories(data);
			} else {
				showError(dataMap.errorMessage, "page-error-cntr");
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			showError(lang.setup_kpi_sub_category_msg_delete_fail,"page-error-cntr");
		}
	});
}

function saveKPIsToCascadeEmployees(employees, kpis){
	var data = {};
		data["employees"] = employees;
		data["kpis"] = kpis;
		$.ajax({
			url: cascadeGoalsToEmployeesURL,
			data: data,
			cache: false,
			type:'POST',
			success: function(dataMap, textStatus, XMLHttpRequest){

				showSuccess(lang.js_my_form_cascade_employees_success_msg, "page-error-cntr");
				bootbox.hideAll();

				if(dataMap.hasErrors){
					showError(dataMap.errorMessages, "page-error-cntr");
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown){
				//showError(lang.setup_kpi_sub_category_msg_delete_fail,"page-error-cntr");
			}
	});
}

function saveTemplateAjax(isEdit){
		var url="";
		var language = $('#newTemplateLocale').val();
		var functionName = $('#functionDropDown').val();
		var action = $('#actionDropDown').val();
		var templateId = $('#actionDropDown option:selected').attr('templateId');
		var email = $('#emailAddress').val();
		var subject = $('#subject').val();
		var startDate = $('#startDate').val();
		var endDate = $('#endDate').val();
		var message = encodeURIComponent($('#editor1').html());
		var status = $('#statusDropDown').val();
		var data = {};
		data["language"] = language;
		data["functionName"] = functionName;
		data["action"] = action;
		data["email"] = email;
		data["subject"] = subject;
		data["startDate"] = startDate;
		data["endDate"] = endDate;
		data["message"] = message;
		data["status"] = status;
		data["templateId"] = templateId;
		data["req_kpicategory_edit"] = isEdit;

		if(subject==null || subject==""){
			bootbox.alert(lang.js_email_template_subject_empty_msg);
			return false;
		}else if(startDate==null || startDate == ""){
			bootbox.alert(lang.js_email_template_start_date_empty_msg);
			return false;
		}else if(endDate==null || endDate ==""){
			bootbox.alert(lang.js_email_template_end_date_empty_msg);
			return false;
		}else if(message==null || message==""){
			bootbox.alert(lang.js_email_template_message_empty_msg);
			return false;
		}else if($.datepicker.parseDate("mm/dd/yy", startDate)>$.datepicker.parseDate("mm/dd/yy", endDate)){

			bootbox.alert(lang.js_email_template_end_date_gt_start_date_msg);
			return false;
		}

		if(isEdit)
			url = editEmailTemplateURL;
		else
			url = addEmailTemplateURL;

	$.ajax({
		url: url,
		data: data,
		cache: false,
		type:'POST',
		success: function(dataMap, textStatus, XMLHttpRequest){
			if(dataMap.status==true){
				data = dataMap.templates;

				if(isEdit)
					showSuccess(lang.js_email_template_update_success_msg, "page-error-cntr");
				else
					showSuccess(lang.js_email_template_save_success_msg, "page-error-cntr");

				populateTemplates(data);
				$('#localeDropDown').val(language);
				closeTemplate();
			} else {
				showError(dataMap.errorMessage, "page-error-cntr");
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			showError("error in adding template","page-error-cntr");
		}
	});


}

function translateLocale(data){
		var url="";
		url = translateEmailTemplateURL;

	$.ajax({
		url: url,
		data: data,
		cache: false,
		type:'POST',
		success: function(dataMap, textStatus, XMLHttpRequest){
			if(dataMap.status==true){
				data = dataMap.templates;

				showSuccess(lang.js_email_template_copy_success_msg, "page-error-cntr");
				getTemplatesForLocaleForAjax();

				//$('#localeDropDown').val(language);
				//closeTemplate();
			} else {
				showError(lang.js_email_template_copy_failure_msg, "page-error-cntr");
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			showError(lang.js_email_template_copy_failure_msg,"page-error-cntr");
		}
	});


}

function getTemplatesForLocaleForAjax(){
		var url="";
		var data={};
		data["locale"] = $('#localeDropDown').val();
		url = getTemplatesForLocaleForAjaxURL;

	$.ajax({
		url: url,
		data: data,
		cache: false,
		type:'POST',
		success: function(dataMap, textStatus, XMLHttpRequest){

				data = dataMap.templates;
				populateTemplates(data);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			showError("","page-error-cntr");
		}
	});


}

function deActivateEmailTemplate(data){

	var url="";

			url = deActivateTemplateUrl;

		$.ajax({
			url: url,
			data: data,
			cache: false,
			type:'POST',
			success: function(dataMap, textStatus, XMLHttpRequest){
					if(dataMap.status==true){
						data = dataMap.templates;
						populateTemplates(data);
						showSuccess("Email Template deActivated Successfully", "page-error-cntr");
					}else{
						showError("Failed to deActivate the template", "page-error-cntr");
					}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown){
				showError("","page-error-cntr");
			}
	});
}

function saveMetricTypesAjax(data){
	$.ajax({
		url: insertMetricTypesURL,
		data: data,
		cache: false,
		type:'POST',
		success: function(dataMap, textStatus, XMLHttpRequest){
			if(dataMap.status==true){
				data = dataMap[res_metric_list];
				bootbox.hideAll();
				showSuccess(lang.js_metric_types_add_success_msg, "page-error-cntr");
				buildMetricTypes(data);
			} else {
				showError(dataMap.errorMessage, 'message');
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			showError(lang.js_metric_types_add_failure_msg,"page-error-cntr");
		}
	});
}
function updateMetricTypesAjax(data){
	$.ajax({
		url: updateMetricTypesURL,
		data: data,
		cache: false,
		type:'POST',
		success: function(dataMap, textStatus, XMLHttpRequest){
			if(dataMap.status==true){
				data = dataMap[res_metric_list];
				bootbox.hideAll();
				showSuccess(lang.js_metric_types_update_success_msg, "page-error-cntr");
				buildMetricTypes(data);
			} else {
				showError(dataMap.errorMessage, "page-error-cntr");
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			showError(lang.js_metric_types_update_failure_msg,"page-error-cntr");
		}
	});
}
function deleteMetricTypesAjax(input){
	var data = {};
	data[res_metric_list] = input;
	data[req_kpi_lib_id]=$("kpiLibId").val();
	$.ajax({
		url: deleteMetricTypesURL,
		data: data,
		cache: false,
		type:'POST',
		success: function(dataMap, textStatus, XMLHttpRequest){
			if(dataMap.status==true){
				data = dataMap[res_metric_list];
				showSuccess(lang.js_metric_types_remove_success_msg, "page-error-cntr");
				$('#delete_sub_category').attr('disabled', 'disabled');
				buildMetricTypes(data);
			} else {
				showError(dataMap.errorMessage, "page-error-cntr");
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			showError(lang.js_metric_types_remove_failure_msg,"page-error-cntr");
		}
	});
}

function refreshSystemMonitorAjax(){
	var data = {};
	data["clientId"] = $('#form-field-select-1').val();
	data["period"]=$("#period").val();
	data["loginEvent"]=$("#loginEvent").val();
	data["date"]=$("#id-date-range-picker-1").val();

	$.ajax({
		url: getSystemMonitoringDataURL,
		data: data,
		cache: false,
		type:'POST',
		success: function(dataMap, textStatus, XMLHttpRequest){
			$('#rates').show();
			if(dataMap!=null && dataMap.monitorGraph!=null)
				populateSystemMonitorGraph(dataMap.monitorGraph);
			if(dataMap!=null)
				populateSuccessRate(dataMap.successRate);
			if(dataMap!=null)
				populateTopUsers(dataMap.topUsers);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			showError(lang.js_metric_types_remove_failure_msg,"page-error-cntr");
		}
	});
}