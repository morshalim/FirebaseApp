var resultProfile;
var submitTrigger;
var modalApprove;
var modalReject;
var orgtree;
var popUpwin;
var closeWindow;
var submitAllTrigger;
var worksheetId;
var bootboxPopup;
$(document).ready(function() {

	resultProfile = $('#profile').html();
	submitTrigger = $('#review_submit').html();
	submitAllTrigger = $('#review_submit_all').html();
	modalApprove = $('#modal-approve').html();
	modalReject = $('#modal-reject').html();
	orgtree = $('#orgtree').html();
	closeWindow = $('#exit-worksheet').html();
	bootboxPopup = $('#managerSearchForm').html();
	
	$('#profile').remove();
	$('#review_submit').remove();
	$('#modal-approve').remove();
	$('#modal-reject').remove();
	$('#orgtree').remove();
	$('#exit-worksheet').remove();
	$('#review_submit_all').remove();
	$('#managerSearchForm').remove();
	Highcharts.setOptions({
		colors: ['#dcdcdc','#51a351']
	});

	buildBudgetSummary();
	buildBudgetSummaryEntire();
	buildBudgetSummaryUserEntire();

	if(accessMode == 1)
	{
		$('#saveIndBttn').removeClass('bttn').addClass('bttn_disabled');
		$('#saveExitIndBttn').removeClass('bttn').addClass('bttn_disabled');
		$('#saveRecoBttn').removeClass('bttn').addClass('bttn_disabled');
		$('#submitRecoBttn').removeClass('bttn').addClass('bttn_disabled');
	}
	
	/*if(isSubmitted)
	{
		$('#sub_planning_buttons').hide();
		$('#ind_sub_planning_buttons').hide();
	}*/

	/*if(!isSavable)
	{
		$('#save_planning_buttons').hide();
		$('#ind_save_planning_buttons').hide();
	}*/

	/*if(!isAbleApproveReject)
		$('#approve_reject_container').hide();
	else
		$('#sub_planning_buttons').hide();
*/
	//instantiate the bubbletip and pop the hover
	//this is no longer active in phase 2
	/*$('#export_img')
		.bubbletip(
					$('#export_pop')
					,{	delayShow: 0,
						delayHide: 0,
						bindShow: 'click',
						bindHide: 'mouseout',
						calculateOnShow: true
					});*/
	//bindTextboxEvents('IndividualPopup');

	$(document).keyup(function(e) {
		  var KEYCODE_ESC = 27;
		  if (e.keyCode == KEYCODE_ESC) {
			  //bootbox.hideAll();
			  if(popUpwin != undefined)
				popUpwin.modal('hide');
		  }
	});
	
	$('#exitBtn').attr('parentPage');
	
	$('#pernrSearch').keyup(function(e){
		if(e.keyCode == '13'){
			searchPernrs();
		}
	});
	
});


function bindTextboxEvents(tab)
{
	//highlights textboxes on focus
	$(document).on('blur','#' + tab + ' .textbox',{}, function () {
		if(this.defaultValue != this.value)
			standardPromptForExit = true;
		/*if(IsNumeric($(this).val()))
		{
			if($(this).val() == "")
				$(this).val($(this).attr('prevValue'));
			else {

				var currency = 'pct';
				
				var ch = getColumnHandler($(this).attr('tab'), $(this).attr('col'));
				if(ch.type == "PCT") {
				} else if(ch.type == "AMT" || ch.type == "DLT") {
					currency = defaultCurrency;
					if($(this).attr('currency'))
						currency = $(this).attr('currency');
				}	
				
				var rule = getRoundingRules(currency, ch.rounding, ch.reviewItemId);


				if($.parseNumber($(this).val(), {format:getAmountFormat(currency, ch.decimals, ch.trailZero), roundRule:rule, locale:locale}).toString() != $.parseNumber($(this).attr('prevValue'), {format:getAmountFormat(currency, ch.decimals, ch.trailZero), roundRule:rule, locale:locale}).toString())
					$(this).attr('changed', 'true');
				else
					$(this).attr('changed', 'false');
			}
		}
		else
		{
			$(this).val($(this).attr("prevValue"));
		}
		 */
		if($(this).val() == "")
		{
			$(this).val(langMap.planSheet_planDataInitial);
			//$(this).addClass("dis");
		}

		$(this).removeClass("highlight");
	});

	$(document).on('focus','#' + tab + ' .textbox',{},function () {
		 $(this).addClass("highlight");
		 if(/*$(this).val() == langMap.planSheet_planDataInitial || */$(this).parent().metadata().sortValue == -1)
		 {
		 	$(this).val("");
			$(this).removeClass("dis");
		 }
		$(this).select();
	 });

	$(document).on('keydown','#' + tab + ' .textbox',{},function (e) {
		var key = e.which;
		if (key == 13) {
			e.preventDefault();
			e.stopPropagation();
			$(this).trigger('change');
		}
	});
}

function buildBudgetSummaryIndirect () {

	if(ECM_DEBUG)$.log ("START buildBudgetSummaryIndirect");
	$('#budgetSummarySubmitContainer').html("");
	var thead = [];

	thead.push('<h3>' + langMap.budgetSummary_budgetSummary_title + '</h3>\n');

	thead.push('<h4>' + langMap.budgetSummary_indirect_title + '</h4>\n');
	thead.push('<br />\n');
	thead.push('<span class="budget_summary_usd">' + langMap.budgetSummary_usd_msg + '</span>\n');

	thead.push('<ul class="legend">\n');
	thead.push('	<li class="available" style="visibility: hidden">' + langMap.budgetSummary_available_title + '</li>\n');
	thead.push('	<li class="spent" style="visibility: hidden">' + langMap.budgetSummary_spent_title + '</li>\n');
	thead.push('</ul>\n');
	thead.push('<br />\n');
	thead.push('<div class="clearfix"></div>\n');

	$('#budgetSummarySubmitContainer').append(thead.join(''));

	var tbody = [];

	for(var x in budgetSummaryIndirect)
	{
		var bud = budgetSummaryIndirect[x];

		for(var z in budgetSummaryDelta)
		{
			var key = z.split(",")[0];
			if(key == x)
			{
				if(budgetSummaryDelta[z] && budgetSummaryDelta[z] != null)
				{
					var budd = budgetSummaryDelta[z];
					bud.status.numNotPlanned += budd.numNotPlanned;
					bud.status.numPlanned += budd.numPlanned;
					bud.spent += budd.spent;
					bud.available += budd.available;
				}
			}
		}
		tbody.push('<div class="budget_graph_wrap">\n');
		tbody.push(getPlanSummaryDetails(bud, 'budgetSummaryIndirect'));
		tbody.push('</div>\n');
	}

	tbody.push('<div class="budget_summary_info">\n');
	tbody.push(langMap.budgetSummary_info_msg);
	tbody.push('<br />\n');
	tbody.push('<table><tr id="budgetSummaryIndirectOver"><td><img src="' + imageBuilder(rp, 'budget_icon_warning', postImg, 'gif') + '" /></td><td><span class="budget_summary_warning">' + langMap.budgetSummary_warning_msg + '</span></td></tr></table>\n');
	tbody.push('</div>\n');


	$('#budgetSummarySubmitContainer').append(tbody.join(''));

/*	$('#budgetSummaryOver').bubbletip($('#budgetSummaryOver_bubble')
												,{	delayShow: delayShowOnMouseOver,
													delayHide: 0,
													calculateOnShow: true
												});
	*/
	verifyBudgetSummaryIndirectExceeded();
	if(ECM_DEBUG)$.log ("START buildBudgetSummaryIndirect");


}




function buildBudgetSummary () {

	if(ECM_DEBUG)$.log ("START buildBudgetSummary");
	$('#budgetSummary').html("");
	var thead = [];

	thead.push('<br />\n');
	thead.push('<div class="page-header position-relative">');
	thead.push('	<h3>' + langMap.budgetSummary_budgetSummary_title + '\n');
	//if(orgScope == "D")
		thead.push('	' + langMap.budgetSummary_direct_title + ' ' + managerName  + '\n');
	//else
	//	thead.push('	<small><i class="icon-double-angle-right"></i>' + langMap.budgetSummary_indirect_title + '</small>\n');
	
	
	/*thead.push('	<select id="budgetSummarySelect" onchange="updateBudgetView(this.value)">\n');

		thead.push('	<option value="D" selected="selected">' + langMap.budgetSummary_direct_title + '</option>\n');

		thead.push('	<option value="I">' + langMap.budgetSummary_indirect_title + '</option>\n');
	thead.push('	</select>\n');*/
	thead.push('	</h3>\n');
	thead.push('</div>\n');

	/////////////////////thead.push('<span class="budget_summary_usd">' + langMap.budgetSummary_usd_msg + '</span>\n');

//	thead.push('<ul class="legend">\n');
//	thead.push('	<li class="available" style="visibility: hidden">' + langMap.budgetSummary_available_title + '</li>\n');
//	thead.push('	<li class="spent" style="visibility: hidden">' + langMap.budgetSummary_spent_title + '</li>\n');
//	thead.push('</ul>\n');
//	thead.push('<br />\n');
//	thead.push('<div class="clearfix"></div>\n');

	$('#budgetSummary').append(thead.join(''));

	var tbody = [];

	tbody.push('<div class="row">\n');
	var i = 0;
	for(var x in budgetSummary)
	{
		var bud = budgetSummary[x];

		tbody.push('<div id="budgetPlan_' + bud.planId + '" budgetPlan="' + bud.planId + '" class="budget_graph_wrap col-md-4'+((i==0)?' clearLeft':'')+'">\n');
		tbody.push(getPlanSummaryDetails(bud, 'budgetSummary'));
		tbody.push('</div>\n');
		i++;
	}

	tbody.push('	<div class="info_msg_ital budget_summary_info hideInPrint">\n');
	tbody.push(		langMap.budgetSummary_info_msg);
	tbody.push('	<br />\n');
	tbody.push('		<table><tr id="budgetSummaryOver"><td><img src="' + imageBuilder(rp, 'budget_icon_warning', postImg, 'gif') + '" /></td><td><span class="budget_summary_warning">' + langMap.budgetSummary_warning_msg + '</span></td></tr></table>\n');
	tbody.push('	</div>\n');
	tbody.push('</div>\n');


	$('#budgetSummary').append(tbody.join(''));
	for(var x in budgetSummary)
	{
		var bud = budgetSummary[x];
		getBudgetSummaryChart(bud, 'budgetSummary' + bud.planId);
	}



	$('#budgetSummaryOver').bubbletip($('#budgetSummaryOver_bubble')
												,{	delayShow: delayShowOnMouseOver,
													delayHide: 0,
													calculateOnShow: true
												});

	verifyBudgetSummaryExceeded();
	if(ECM_DEBUG)$.log ("START buildBudgetSummary");


}
function updateBudgetView(value) {
	$('#budgetSummaryHolder').hide();
	$('#budgetSummaryEntireHolder').hide();
	
	$('#budgetSummarySelect').val(value);
	$('#budgetSummaryEntireSelect').val(value);
	
	if(value == "D") {
		$('#budgetSummaryHolder').show();
	} else {
		$('#budgetSummaryEntireHolder').show();
	}
		
}

function buildBudgetSummaryEntire () {

	if(ECM_DEBUG)$.log ("START buildBudgetSummaryEntire");
	$('#budgetSummaryEntire').html("");
	var thead = [];

	thead.push('<br />\n');
	thead.push('<div class="page-header position-relative">');
	thead.push('	<h3>' + managerName  + " " + langMap.budgetSummary_budgetSummary_title + '\n');
	//if(orgScope == "D")
	//	thead.push('	<small><i class="icon-double-angle-right"></i>' + langMap.budgetSummary_direct_title + '</small>\n');
	//else
	//	thead.push('	<small><i class="icon-double-angle-right"></i>' + langMap.budgetSummary_indirect_title + '</small>\n');
	thead.push('	<select id="budgetSummaryEntireSelect" onchange="updateBudgetView(this.value)">\n');

		thead.push('	<option value="D">' + langMap.budgetSummary_direct_title + '</option>\n');

		thead.push('	<option value="I" selected="selected">' + langMap.budgetSummary_indirect_title + '</option>\n');
	thead.push('	</select>\n');	
	thead.push('	</h3>\n');
	thead.push('</div>\n');

	/////////////////////thead.push('<span class="budget_summary_usd">' + langMap.budgetSummary_usd_msg + '</span>\n');

//	thead.push('<ul class="legend">\n');
//	thead.push('	<li class="available" style="visibility: hidden">' + langMap.budgetSummary_available_title + '</li>\n');
//	thead.push('	<li class="spent" style="visibility: hidden">' + langMap.budgetSummary_spent_title + '</li>\n');
//	thead.push('</ul>\n');
//	thead.push('<br />\n');
//	thead.push('<div class="clearfix"></div>\n');

	$('#budgetSummaryEntire').append(thead.join(''));

	var tbody = [];

	tbody.push('<div class="row">\n');
	var i = 0;
	for(var x in budgetSummary)
	{
		var bud = budgetSummary[x];

		tbody.push('<div id="budgetPlanEntire_' + bud.planId + '" budgetPlan="' + bud.planId + '" class="budget_graph_wrap col-md-4'+((i==0)?' clearLeft':'')+'">\n');
		tbody.push(getPlanSummaryDetails(bud, 'budgetSummaryEntire', true));
		tbody.push('</div>\n');
		i++;
	}

	tbody.push('	<div class="info_msg_ital budget_summary_info hideInPrint">\n');
	tbody.push(		langMap.budgetSummary_info_msg);
	tbody.push('	<br />\n');
	tbody.push('		<table><tr id="budgetSummaryEntireOver"><td><img src="' + imageBuilder(rp, 'budget_icon_warning', postImg, 'gif') + '" /></td><td><span class="budget_summary_warning">' + langMap.budgetSummary_warning_msg + '</span></td></tr></table>\n');
	tbody.push('	</div>\n');
	tbody.push('</div>\n');


	$('#budgetSummaryEntire').append(tbody.join(''));
	for(var x in budgetSummary)
	{
		var bud = budgetSummary[x];
		getBudgetSummaryChart(bud, 'budgetSummaryEntire' + bud.planId, true);
	}



	$('#budgetSummaryEntireOver').bubbletip($('#budgetSummaryEntireOver_bubble')
												,{	delayShow: delayShowOnMouseOver,
													delayHide: 0,
													calculateOnShow: true
												});

	verifyBudgetSummaryExceeded();
	$('#budgetSummaryEntireHolder').hide();
	if(ECM_DEBUG)$.log ("START buildBudgetSummary");


}

function buildBudgetSummaryUserEntire () {

	if(ECM_DEBUG)$.log ("START buildBudgetSummaryUserEntire");
	$('#budgetSummaryUserEntire').html("");
	var thead = [];

	thead.push('<br />\n');
	thead.push('<div class="page-header position-relative">');
	thead.push('	<h3>' + langMap.budgetSummary_budgetSummary_title + '\n');
	//if(orgScope == "D")
	//	thead.push('	<small><i class="icon-double-angle-right"></i>' + langMap.budgetSummary_direct_title + '</small>\n');
	//else
	thead.push('	' + langMap.budgetSummary_indirect_title + ' ' + effectiveManagerName + '\n');
	/*thead.push('	<select id="budgetSummaryEntireSelect" onchange="updateBudgetView(this.value)">\n');

		thead.push('	<option value="D">' + langMap.budgetSummary_direct_title + '</option>\n');

		thead.push('	<option value="I" selected="selected">' + langMap.budgetSummary_indirect_title + '</option>\n');
	thead.push('	</select>\n');	*/
	thead.push('	</h3>\n');
	thead.push('</div>\n');

	/////////////////////thead.push('<span class="budget_summary_usd">' + langMap.budgetSummary_usd_msg + '</span>\n');

//	thead.push('<ul class="legend">\n');
//	thead.push('	<li class="available" style="visibility: hidden">' + langMap.budgetSummary_available_title + '</li>\n');
//	thead.push('	<li class="spent" style="visibility: hidden">' + langMap.budgetSummary_spent_title + '</li>\n');
//	thead.push('</ul>\n');
//	thead.push('<br />\n');
//	thead.push('<div class="clearfix"></div>\n');

	$('#budgetSummaryUserEntire').append(thead.join(''));

	var tbody = [];

	tbody.push('<div class="row">\n');
	var i = 0;
	for(var x in budgetSummaryUser)
	{
		var bud = budgetSummaryUser[x];

		tbody.push('<div id="budgetPlanUserEntire_' + bud.planId + '" budgetPlan="' + bud.planId + '" class="budget_graph_wrap col-md-4'+((i==0)?' clearLeft':'')+'">\n');
		tbody.push(getPlanSummaryDetails(bud, 'budgetSummaryUserEntire', true));
		tbody.push('</div>\n');
		i++;
	}

	tbody.push('	<div class="info_msg_ital budget_summary_info hideInPrint">\n');
	tbody.push(		langMap.budgetSummary_info_msg);
	tbody.push('	<br />\n');
	tbody.push('		<table><tr id="budgetSummaryUserEntireOver"><td><img src="' + imageBuilder(rp, 'budget_icon_warning', postImg, 'gif') + '" /></td><td><span class="budget_summary_warning">' + langMap.budgetSummary_warning_msg + '</span></td></tr></table>\n');
	tbody.push('	</div>\n');
	tbody.push('</div>\n');


	$('#budgetSummaryUserEntire').append(tbody.join(''));
	for(var x in budgetSummaryUser)
	{
		var bud = budgetSummaryUser[x];
		getBudgetSummaryChart(bud, 'budgetSummaryUserEntire' + bud.planId, true);
	}



	$('#budgetSummaryUserEntireOver').bubbletip($('#budgetSummaryUserEntireOver_bubble')
												,{	delayShow: delayShowOnMouseOver,
													delayHide: 0,
													calculateOnShow: true
												});

	verifyBudgetSummaryExceeded();
	//$('#budgetSummaryUserEntireHolder').hide();
	if(ECM_DEBUG)$.log ("START buildBudgetSummaryUserEntire");


}

function verifyBudgetSummaryExceeded() {
	$('#budgetSummaryOver').hide();
	$('#budgetSummaryEntireOver').hide();
	$('#budgetSummaryUserEntireOver').hide();
	for(var x in budgetSummary)
	{
		var bud = budgetSummary[x];
		if(bud.spent > bud.total)
		{
			$('#budgetSummaryOver').show();
			break;
		}

		if(bud.entireSpent > bud.entireTotal)
		{
			$('#budgetSummaryEntireOver').show();
			break;
		}
	}
	
	for(var x in budgetSummaryUser)
	{
		var bud = budgetSummaryUser[x];
		/*if(bud.spent > bud.total)
		{
			$('#budgetSummaryOver').show();
			break;
		}*/

		if(bud.entireSpent > bud.entireTotal)
		{
			$('#budgetSummaryUserEntireOver').show();
			break;
		}
	}
}

function verifyBudgetSummaryIndirectExceeded() {
	$('#budgetSummaryIndirectOver').hide();
	for(var x in budgetSummaryIndirect)
	{
		var bud = budgetSummaryIndirect[x];
		if(bud.spent > bud.total)
		{
			$('#budgetSummaryIndirectOver').show();
			break;
		}
	}
}

function getPlanSummaryDetails(bud, divId, entire)
{
	
	
	var total = bud.total;
	var spent = bud.spent;
	var available = bud.available;
	
	var totalAssociates = bud.status.totalAssociates
	var numPlanned = bud.status.numPlanned
	var numNotPlanned = bud.status.numNotPlanned
	if(entire) {
		total = bud.entireTotal;
		spent = bud.entireSpent;
		available = bud.entireAvailable;
		
		totalAssociates = bud.status.entireTotalAssociates;
		numPlanned = bud.status.entireNumPlanned;
		numNotPlanned = bud.status.entireNumNotPlanned;
		
	}
	
	var tbody = [];
	//if(planList[bud.planId])
	//{
		tbody.push('		<table ' + budgetSummary + '="' + bud.planId + '" cellspacing="0" width="100%">\n');
		tbody.push('			<tr>\n');
		tbody.push('				<td colspan="3">\n');
		tbody.push('					<div class="widget-box transparent">\n');
		tbody.push('						<div class="widget-header">\n');
		tbody.push('							<h4 class="darker">' + bud.planName + '</h4>\n');
		tbody.push('						</div>\n');
		tbody.push('					</div>\n');
		tbody.push('				</td>\n');
		tbody.push('			</tr>\n');
		tbody.push('			<tr>\n');
		tbody.push('				<td id="' + divId + bud.planId + '" colspan="3">\n');
		//tbody.push('				<img ' + divId + '="' + bud.planId + '" src="' + getBudgetSummaryChart(bud, divId + bud.planId) + '" />\n');
		tbody.push('				</td>\n');
		tbody.push('			</tr>\n');
		tbody.push('			<tr>\n');
		tbody.push('				<th class="align_l"></td>\n');
		tbody.push('				<th class="align_r">' + langMap.budgetSummary_amount_title + '</th>\n');
		tbody.push('				<th class="align_r">' + langMap.budgetSummary_associates_title + '</th>\n');
		tbody.push('			</tr>\n');
		tbody.push('			<tr style="border-bottom: 1px solid #dcdcdc;">\n');
		tbody.push('				<td class="align_l">' + langMap.budgetSummary_budget_title + '</td>\n');
		tbody.push('				<td class="align_r">' + $.formatNumber(total, {format:budgetFormat,locale:locale, nanForceZero: false}) + '</td>\n');
		tbody.push('				<td class="align_r">' + totalAssociates + '</td>\n');
		tbody.push('			</tr style="border-bottom: 1px solid #dcdcdc;">\n');
		tbody.push('				<tr>\n');
		tbody.push('				<td class="align_l">' + langMap.budgetSummary_spent_title + '</td>\n');
		tbody.push('				<td class="align_r">' + $.formatNumber(spent, {format:budgetFormat,locale:locale, nanForceZero: false}) + '</td>\n');
		tbody.push('				<td class="align_r">' + numPlanned + '</td>\n');
		tbody.push('			</tr>\n');
		tbody.push('			<tr style="border-bottom: 1px solid #dcdcdc;">\n');
		tbody.push('				<td class="align_l">' + langMap.budgetSummary_available_title + '</td>\n');
		tbody.push('				<td class="align_r">' + $.formatNumber(available, {format:budgetFormat,locale:locale, nanForceZero: false}) + '</td>\n');
		tbody.push('				<td class="align_r">' + numNotPlanned + '</td>\n');
		tbody.push('			</tr>\n');
		tbody.push('		</table>\n');

	//}
	return tbody.join('');
}

function getBudgetSummaryChart(bud, idToRender, entire)
{
	if(ECM_DEBUG)$.log ("getBudgetSummaryChart bud: " + JSON.stringify(bud));
	var total = bud.total;
	var spent = bud.spent;
	var available = bud.available;

	if(entire) {
		total = bud.entireTotal;
		spent = bud.entireSpent;
		available = bud.entireAvailable;
	}
		
	var pctSpent = (spent/total) * 100;
	//alert(pctSpent)
	var pctSpentDisplay =	$.formatNumber(pctSpent, {format:currencyFormat, locale:locale});
	pctSpentDisplay =	$.parseNumber(pctSpentDisplay, {format:currencyFormat, locale:locale});

	if(ECM_DEBUG)$.log ("pctSpent: " + pctSpentDisplay);

	var pctAvailable = (available/total) * 100;

	var pctAvailableDisplay =	$.formatNumber(pctAvailable, {format:currencyFormat, locale:locale});
	pctAvailableDisplay =	$.parseNumber(pctAvailableDisplay, {format:currencyFormat, locale:locale});

	if(ECM_DEBUG)$.log ("pctAvailable: " + pctAvailable + " pctAvailableDisplay: " + pctAvailableDisplay);

	var chreq = "";

	if(pctSpent <= 100)
	{
		/*var data = [];
		var dataTitle = [];
		var dataColor = [];
		if(pctSpentDisplay != 0)
		{
			data.push(pctSpentDisplay);
			dataTitle.push(pctSpentDisplay + "%25");
			dataColor.push("b4dc84");
		}

		if(pctAvailableDisplay != 0)
		{
			data.push(pctAvailableDisplay);
			dataTitle.push(pctAvailableDisplay + "%25");
			dataColor.push("5b7393");
		}
		chreq = chartServer + "?cht=pf&chd=" + data.join(',') + "&chl=" + dataTitle.join(',') + "&chs=200x200&chco=FFFFFF&sl=false&lxa=c&lya=b&dco=" + dataColor.join(",");*/


		new Highcharts.Chart({
		    chart: {
		        renderTo: idToRender,
				height: 200,
				width: 200,
		        defaultSeriesType: 'pie'
		    },
		    title: {
		        text: ''
		    },
	        tooltip: {
	        	formatter: function() {
	            	return '<b>'+ this.point.name +'</b>: '+ $.formatNumber(this.percentage, {format:currencyFormat,locale:locale})+' %';

	            }
	        },
			plotOptions: {
				pie: {
					dataLabels: {
	                        enabled: false
	                    },
					showInLegend: true
				}
			},
			credits: {
					enabled: false
				},
		    series: [{

		        data: [
					      [langMap.budgetSummary_spent_title,pctSpentDisplay],
						  [langMap.budgetSummary_available_title,pctAvailableDisplay]
					  ]
		    }]
		});


	}
	else
	{
		//chreq = chartServer + "?cht=pf&chd=" + pctSpentDisplay + "&chl=" + pctSpentDisplay + "%25&chs=200x200&chco=FFFFFF&sl=false&lxa=c&lya=b&dco=e41e2a";

		new Highcharts.Chart({
		    chart: {
		        renderTo: idToRender,
				height: 200,
				width: 200,
		        defaultSeriesType: 'pie'
		    },
		    title: {
		        text: ''
		    },
		    tooltip: {
	        	formatter: function() {
	            	return '<b>'+ this.point.name +'</b>: '+ pctSpentDisplay/*$.formatNumber(this.percentage, {format:currencyFormat,locale:locale})*/+' %';
	            }
		    },
			plotOptions: {
				pie: {
					dataLabels: {
	                        enabled: false
	                    },
					showInLegend: true
				}
			},
			credits: {
					enabled: false
				},
		    series: [{

		        data: [
					      [langMap.budgetSummary_spent_title,pctSpentDisplay]
					  ]
		    }]
		});

	}

	if(ECM_DEBUG)$.log ("END getBudgetSummaryChart");
	return chreq;
}

var tabindex = 4;

function loadDiv(tab) {
	if(ECM_DEBUG)$.log ("START loadDiv: " + tab);
	worksheetId = tab;
	showLoading();
	//$('#content_container').hide();

	var plan = planList[tab];
	var postLoad = [];
	if(plan != null)
	{

		//process row renderer
		/*var tableResult = processRenderer(tab, null, 'ZECM_TABLE', null, null, null);
		if(tableResult != null)
		{
			if(tableResult.postLoad && tableResult.params )
				postLoad.push(tableResult);
		}*/


		if(ECM_DEBUG)$.log ("plan located proceeding");
		//var postLoad = [];
		//var synchPostLoad = [];

		var table = [];
		var tableHead = [];
		var tableBody = [];
		var sortList = [];
		var i = 0;

		if(ECM_DEBUG)$.log ("building headers");
		for(var id in plan.cols) {
			var col = plan.cols[id]
			if(ECM_DEBUG)$.log ("inspecting header: " + id);
			if(col.visible)
			{
				if(ECM_DEBUG)$.log ("column is visible proceeding");

				if(col.sort == "2")
					sortList.push([i,0]);
				
				var className = "class=\"";

				if(col.css)
					className += (" " + col.css);
				
				className += "\"";				
				
				
				tableHead.push('					<th btipinit="' + tab + "_head_th_pop_" + id + '" col="' + id + '" ' + className + ' rawData={sorter:false} id="' + tab + "_head_th_" + id + '">\n');
				if(col.help != "")
				{
					/*$('#btholder').append('<div id="' + tab + "_head_th_pop_" + id + '" style="width:250px;display:none;">' +
								   col.help +
								   '</div>\n');*/


					postLoad.push(
						{
							params: {help:col.help,popDirection:col.helpAlignment ,tab:tab, id:id},
							postLoad:
								function(params)
									{
								
								
								
								/*
								$('#' + params.tab + "_img_" + params.pernr + "_" + params.id ).unbind('mouseover.event');
								$('#' + params.tab + "_img_" + params.pernr + "_" + params.id ).bind('mouseover.event', params, function(event){
											var params = event.data;
	
											//verify existence of tooltip
											if( $('table.bubbletip #' + params.tab + "_pop_" + params.pernr + "_" + params.id).length == 0)
											{
												//instantiate the bubbletip and pop the hover
												$('#' + params.tab + "_img_" + params.pernr + "_" + params.id)
													.bubbletip(
																$('#' + params.tab + "_pop_" + params.pernr + "_" + params.id)
																,{	delayShow: delayShowOnMouseOver,
																	delayHide: 0,
																	calculateOnShow: true,
																	deltaDirection: params.popDirection
																});
												//pop the info after if has been created
												$('#' + params.tab + "_img_" + params.pernr + "_" + params.id ).trigger('mouseover');
											}
	
									}
								)
							 */								
								
									$(document).off('mouseover.event', '#' + params.tab + "_head_th_" + params.id);
									$(document).on('mouseover.event', '#' + params.tab + "_head_th_" + params.id, params, function(event){								
								
										var params = event.data;
										
										//verify existence of tooltip
										if( $('table.bubbletip #' + params.tab + "_head_th_pop_" + params.id).length == 0)
										{		
											if($('#' + params.tab + "_head_th_pop_" + params.id).length == 0)
											$('#btholder').append('<div id="' + params.tab + "_head_th_pop_" + params.id + '" style="width:250px;display:none;">' +
													   params.help +
													   '</div>\n');											
											
											var direction = "down";
											if(params.popDirection != null)
												if(params.popDirection == "L")
													direction = "left";
												else if(params.popDirection == "R")
													direction = "right";
												else if(params.popDirection == "U")
													direction = "up";
	
											$('#' + params.tab + "_head_th_" + params.id)
												.bubbletip(
															$('#' + params.tab + "_head_th_pop_" + params.id)
															,{	delayShow: delayShowOnMouseOver,
																delayHide: 0,
																calculateOnShow: true,
																deltaDirection: direction
															});
											//pop the info after if has been created
											$('#' + params.tab + "_head_th_" + params.id).trigger('mouseover');											
										}
								});
							}									
						}      
					); 

//					tableHead.push('						<a class="tooltip" href="#">' + col.name + '<span>' + col.help + '</span></a>\n');
					tableHead.push(col.name + '\n');
				}
				else
					tableHead.push('						' + col.name + '\n');
				tableHead.push('					</th>\n');
				i++;
			}
			else
			{
				if(ECM_DEBUG)$.log ("column is NOT visible ignoring");
			}

		}
		if(ECM_DEBUG)$.log ("finish building headers: " + tableHead.join(""));


		table.push('		<div id="' + plan.id + '_pager" class="pager">\n');
		//table.push('			<form>\n');
		table.push('				<img src="' + imageBuilder(rp, 'pager/first', postImg, 'gif') + '" class="first"/>\n');
		table.push('				<img src="' + imageBuilder(rp, 'pager/prev', postImg, 'gif') + '" class="prev"/>\n');
		table.push('				<span class="pagedisplay"></span>\n');
		table.push('				<img src="' + imageBuilder(rp, 'pager/next', postImg, 'gif') + '" class="next"/>\n');
		table.push('				<img src="' + imageBuilder(rp, 'pager/last', postImg, 'gif') + '" class="last"/>\n');
		table.push('				' + langMap.pager_employees_per_page);
		table.push('				<select pager="' + tab + '"class="pagesize">\n');
		table.push('					<option value="5">5</option>\n');
		table.push('					<option value="10">10</option>\n');
		table.push('					<option selected="selected" value="20">20</option>\n');
		table.push('					<option value="30">30</option>\n');
		table.push('					<option value="40">40</option>\n');
		table.push('				</select>\n');
		//table.push('			</form>\n');
		table.push('		</div>\n');

		table.push('	<div class="tableSorterContainer" style="width:'+($(window).width()-100)+'px">\n');
		table.push('		<table class="tablesorter" id="' + plan.id + '_data" >\n');
		table.push('			<thead>\n');
		table.push('				<tr>\n');
		table.push('				' + tableHead.join("") + '\n');
		table.push('				</tr>\n');
		table.push('			</thead>\n');
		table.push('			<tbody>\n');
		table.push('			</tbody>\n');
		table.push('		</table>\n');
		table.push('	</div>\n')

		if(ECM_DEBUG)$.log ("plan table headers built:\n" + table.join(""));
		var curTab = $("div[tab='" + tab + "']");
		curTab.html(table.join(""));
		var pernrCount = 0;
		if(ECM_DEBUG)$.log ("building body");
		for(var pernr in plan.data)
		{
			if(ECM_DEBUG)$.log ("inspecting data for: " + pernr);
			var data = plan.data[pernr];
			pernrCount++;
			var associate = plan.associates[pernr];

			//process row renderer
			/*var rowResult = processRenderer(tab, pernr, 'ZECM_ROW', data, null, associate);
			if(rowResult != null)
			{
				if(rowResult.postLoad && rowResult.params )
					postLoad.push(rowResult);
			}*/

			
			//show buttons for planning if an associate is eligible
			if(associate.eligible)
				$('#planning_buttons').removeClass('hide');
			
			//for all plans but the summary we are notified within the object of plan eligibility
			var className = "";
			//if(associate.eligible || true) {
			//	className = 'dis';
				
				if(associate.newHire)
					className = 'newHire';
				
			tableBody.push('					<tr class="' + className + '" id="' + tab + "_body_tr_" + pernr + '">\n');

			for(var id in plan.cols)
				{
					var colData = data[id];
					var col = plan.cols[id];
					if(colData)
					{
						if(col.visible)
						{
							if(ECM_DEBUG)$.log ("column is visible proceeding id: " + id);
							//var eh = getEventHandler(tab, id);
	
							/*if(colData.rawData != "")
							{*/
	
								var ch = col;
							
								var className = "class=\"";
								if(col.alignment && col.alignment == "L")
									className += "align_l"	;
								else if(col.alignment && col.alignment == "C")
									className += "align_c"	;
								else if(col.alignment && col.alignment == "R")
									className += "align_r";
								else 
									className += "align_r"	;
	
								if(ch.css)
									className += (" " + ch.css);
								
								className += "\"";
								
								if(ch.applyInit && colData.initial)
									colData.rawData = -1;
								
								if(!isNaN(colData.rawData))
								{
									//only for the bssal do we read the currency
									/*var cur = colData.currency;
									var rawData = parseFloat(colData.rawData);
									if(cur != "")
									{
										var conv = currency[cur].decFactor;
										rawData = conv * colData.rawData;
									}
	*/
									//append the metada class for sorting
									if(col.sort != 0)
										$("#" + tab + "_head_th_" + id).attr("rawData","{sorter:'metadata'}");
										
									tableBody.push('<td initial="' + (ch.applyInit && colData.initial) + '" planId="' + ch.planId + '"  saveable="' + col.saveable + '" tab="' + tab + '" pernr="' + pernr + '" col="' + id + '" ' + className + ' id="' + tab + "_body_td_" + pernr + "_" + id + '" rawData="{sortValue: ' + colData.rawData + '}" ')
								}
								else
								{
									//append the metada class for sorting
									if(col.sort != 0)
										$("#" + tab + "_head_th_" + id).attr("rawData","{sorter:'metadataText'}");
									tableBody.push('						<td initial="' + (ch.applyInit && colData.initial) + '" planId="' + ch.planId + '"  saveable="' + col.saveable + '" tab="' + tab + '" pernr="' + pernr + '" col="' + id + '" ' + className + ' id="' + tab + "_body_td_" + pernr + "_" + id + '" rawData="{sortValue: \'' + colData.rawData.replace(new RegExp("'", "g"), "\\'") + '\'}" ')
								}
	
	
	
							/*}
							else
								tableBody.push('						<td ' + className + ' id="' + tab + "_body_td_" + pernr + "_" + id + '" ');*/
	
	
							tableBody.push('>\n');
							
							var currency = defaultCurrency;
							var val = colData.displayData;
							if(ch.applyInit && colData.initial)
								val = "";
							
							if(val != "-" && val != "") {
								if(ch.type == "PCT") {
									var rule = getRoundingRules('pct', ch.rounding, ch.reviewItemId);
									val = $.formatNumber(colData.rawData, {format:getAmountFormat('pct', ch.decimals, ch.trailZero), roundRule:rule, locale:locale});
								} else if(ch.type == "AMT" || ch.type == "DLT") {
									if(associate.currency != null && associate.currency != "")
										currency = associate.currency;
									if(colData.currency != null && colData.currency != "")
										currency = colData.currency;
									var rule = getRoundingRules(currency, ch.rounding, ch.reviewItemId);
									val = $.formatNumber(colData.rawData, {format:getAmountFormat(currency, ch.decimals, ch.trailZero), roundRule:rule, locale:locale});
								}
							}
							//colData.eligible = true;
							if(colData.editable)
							{
								if(ECM_DEBUG)$.log ("column is editable seeking out rule");
	
									
									var inputValue = val;//colData.displayData;
	
									if(!colData.eligible)
										inputValue = "";
									else /*if(ch && ch.formatNumberForDisplay)*/{
	
										if(colData.initial) {
										//if(colData.rawData == -1)
											val = "";
										}
	
										inputValue = val;
									}
	
									var disClass = "";
									if(colData.initial || !colData.eligible)
									{
										
										if(!colData.eligible) {
											inputValue = langMap.planSheet_planDataNotEligible;
											disClass = "dis";
										} else 
											inputValue = langMap.planSheet_planDataInitial;
									
										
										/*if(colData.initial)
											inputValue = langMap.planSheet_planDataInitial;
										else {
											inputValue = langMap.planSheet_planDataNotEligible;
											disClass = "dis";
										}*/
										
										//colData.displayData = "";
									}
	
									if(!isSubmitted || isSavable || isAbleApproveReject) {
										//var r = columnRenderer[tab][id];
									
										tableBody.push('<input style="width:75px;" planId="' + ch.planId + '" initial="' + colData.initial + '" currency="' + currency + '" class="textbox ' + disClass + '" ' + ((!canEditSheet || !colData.eligible || !colData.editable)?"disabled=disabled":"" ) + ' prevValue="' + val + '" id="' + tab + "_body_td_input_" + pernr + "_" + id + '" value="' + inputValue + '" tab="'+tab+'" pernr="'+pernr+'" col="'+id+'" ');
		
										if(ch.type != "DATE" )
										{
											tableBody.push('onchange="updateCol(\'' + tab + '\',\'' + pernr + '\',\'' + id + '\',this)" ');
										} else {
											//set the date and it's object

											postLoad.push({
											params: {tab:tab, pernr:pernr, id:id, colData:colData, ch:ch},
											postLoad:
												function(params)
													{

														$('#' + params.tab + "_body_td_input_" + params.pernr + "_" + params.id ).datepicker({
															autoclose: true,
															todayHighlight: true,
															format: getDateFormat()/*,
															startDate: '-'+maxDaysToShowHeatMap+'d',
															endDate:'+60d'*/
															
														}).on('changeDate', function(ev){
															$('#' + params.tab + "_body_td_" + params.pernr + "_" + params.id ).metadata().sortValue = ev.date.toString('yyyyMMdd');
															$('#' + params.tab + "_body_td_" + params.pernr + "_" + params.id ).attr('initial', 'false');
														});
														
														var dateToSet = new Date(parseInt(params.colData.rawData.substring(0,4),10), parseInt(params.colData.rawData.substring(4,6),10)-1, parseInt(params.colData.rawData.substring(6),10));
														
														$('#' + params.tab + "_body_td_input_" + params.pernr + "_" + params.id ).datepicker("setDate", dateToSet);
													}
											});
									
										}
										tableBody.push('/>\n');
									} else {
										tableBody.push(inputValue);							
									}
									
							} 
							
	
							//moved to process before a renderer
							if(ch.oogType == "1")
							{
								if(ECM_DEBUG)$.log ("column is editable setting up outOfGuideline");
								var result = setGuidelinesPopup(tab, pernr, id, data, colData, plan, associate);
	
								if(result.postLoad && result.params )
									postLoad.push(result);
	
								tableBody.push(result.content);
							}
	
	
							var renderer = false;
							
							//verify if this column has any data loaded on init, otherwise process the formula to get a result now
							if(!ch.dataLoaded) {
								var result = processFormula(tab, pernr, id, data, colData, associate, true);
								if(result != null)
								{
									renderer = true;
									/*if(result.postLoad && result.params )
										postLoad.push(result);
									tableBody.push(result.content);*/
									tableBody.push(result);
								}
							} else if(ch.formula && ch.formula != "") {
								var entries = getWordsBetweenCurlies(ch.formula)
								if(entries.length) {
									var result = {
											params: {
												entries: entries,
												tab: tab, 
												pernr: pernr, 
												id: id, 
												data: data, 
												colData: colData, 
												associate: associate
											},
											postLoad: function(params) {
												if(params.entries && params.entries)
													for(var x = 0; x < params.entries.length; x++)
														$('#' + params.tab + "_body_td_" + params.pernr + "_" + params.id).on('update.' + params.entries[x], params, 
																function(event, revertInit) {
																	var params = event.data;
																	processFormula(params.tab, params.pernr, params.id, params.data, params.colData, params.associate, false, revertInit);
																});
											}
									};
									
									postLoad.push(result);
								}
									
							}
							
							if(ch.showDetails == "1") {
								var result = openDetails(tab, pernr, id, data, colData, associate);
								if(result != null)
								{
									renderer = true;
									if(result.postLoad && result.params )
										postLoad.push(result);
									tableBody.push(result.content);
								}
							}
							
							if(!colData.editable && !renderer)
								tableBody.push('						' + ((val == "")?langMap.planSheet_planDataBlank:val));
	
							/*if(colData.outOfGuideline)
							{
								if(ECM_DEBUG)$.log ("column is editable setting up outOfGuideline");
								var result = setGuidelinesPopup(tab, pernr, id, data, colData, plan, associate)
	
								if(result.postLoad && result.params )
									postLoad.push(result);
	
								tableBody.push(result.content);
							}*/
	
							//if synch exists in this column we need to verify that the information is not already updated from another column.
							/*if(eh != null && eh.map.synchToPlan && planChanges[eh.map.synchToPlan + "," + pernr])
							{
								var result =  {
									params: {eh:eh, tab:tab, pernr:pernr, id:id, colData:colData},
									postLoad:
										function(params)
										{
											//alert(params.eh.map.synchToPlan + "   " + params.pernr + "   " + params.id)
											$('#' + params.eh.map.synchToPlan + '_body_td_input_' + params.pernr + '_' + params.id).trigger('change');
											$('#' + params.eh.map.synchToPlan + '_select_guideline_' + params.pernr + '_' + params.id).trigger('change');
										}
									}
	
								if(result.postLoad && result.params )
									synchPostLoad.push(result);
							}*/
	
							tableBody.push('</td>\n');
	
						}
						else
						{
							if(ECM_DEBUG)$.log ("column is NOT visible ignoring id: " + id);
						}
					}
					else
					{
						if(col.visible)
						{
							tableBody.push('						<td id="' + tab + "_body_td_" + pernr + "_" + id + '">');
								var renderer = false;
							/*	var result = processRenderer(tab, pernr, id, data, null, associate);
								if(result != null)
								{
									renderer = true;
									if(result.postLoad && result.params )
										postLoad.push(result);
									tableBody.push(result.content);
								}*/
	
							if(ECM_DEBUG)$.log ("column data not found ignoring id: " + id);
	
							if(!renderer)
								tableBody.push(langMap.planSheet_planDataNotFound);
							tableBody.push('</td>\n')
						}
					}
	
				}
				tableBody.push('					</tr>\n');
			//}

		}
		$("#" + tab + "_data tbody").html(tableBody.join(""));

		//create the table sorter
		$("#" + tab + "_data").tablesorter({
			theme:'blue', 
			showProcessing: true,
			sortList: sortList,
			widgets: [/*'columns',*/ 'filter', 'zebra', 'pager', 'scroller'],
	        widgetOptions: {
	            scroller_height: 650,
	            scroller_fixedColumns: ((pernrCount > 15)?0:6),            
	            scroller_rowHighlight: 'hover',
	            pager_output:"{startRow}  -  {endRow} " + langMap.pager_of + " {totalRows} " + langMap.pager_employee
	        }
		});

		var colCtr = 0;
		for(var id in plan.cols) {
			var col = plan.cols[id];
			if(col.visible) {
				if(col.css != null && col.css != "") {
					$('.tablesorter-filter-row>[data-column=' + colCtr + ']').addClass('ruler');
				}
				colCtr++;
			}
		}
		
		//$($('.tablesorter-scroller-header')[1]).width($($('.tablesorter-scroller-header')[1]).width()+18)
		//bind the event that will redo the sortOrder for the indPlanning list of pernrs
		$("#" + tab + "_data").on("sortEnd",function() {
			//updateQuickLookupTable($(this));


			$(this).find("input:text").each(function() {
					var $input = $(this);
					if ($input.is(':visible'))
					{
						$input.attr("tabindex", tabindex);
						tabindex++;
					}
				});


		 });
		
		$("#" + tab + "_data").on("sortEnd",function() {
			$('[btipinit]').each(function() { //delete the header bubble tips and recreated them when hovering
				var $this = $(this);
				$this.removeBubbletip($('#' + $this.attr('btipinit')));
				$('table.bubbletip #'+ $this.attr('btipinit')).parents("table:first").remove();
			});
		});
		
		$("#" + tab + "_data").on('pagerComplete pagerInitialized', function(){
		    // refresh the fixed columns in the scroller
		    //$( this ).trigger( 'setFixedColumnSize' );
		    //$('.tablesorter-filter').removeAttr('disabled')
		});		
			
//
//		//if(postLoad)
//		for(var x = 0; x < postLoad.length; x++ )
//			postLoad[x].postLoad(postLoad[x].params);

		//after processing the events that might have been returned turn on pager
		/*try
		{
			var size = 5;
			var initElem = $("select[pager='" + rsPlanCode + "']");
			if(initElem.length > 0)
			{
				$("select[pager='" + tab + "']").val(initElem.val());
				size = initElem.val();
			}

			$("#" + tab + "_data")
			.tablesorterPager(
				{
					size: size,
					container: $("#" + tab + "_pager"),
					preSeperator: " - ",
					seperator: langMap.pager_of,
					postSeperator: langMap.pager_employee,
					positionFixed: false
				}
			);
		}
		catch(e)
		{
			if(ECM_DEBUG)$.log ("Tablesorter generated an error.");
		}*/

		//adds mousever to table row
		/*$("#" + tab + "_data tr").mouseover(function(){
			$(this).addClass("over");
		});
		//removes mouseover from table row
		$("#" + tab + "_data tr").mouseout(function(){
			$(this).removeClass("over");
		});*/

	}
	else
	{
		if(ECM_DEBUG)$.log ("plan is null aborting");
	}

	bindTextboxEvents(tab + '_data');

	closeLoading();
	//$('#content_container').show();
	if(plan != null)
	{

		//if(postLoad)
		for(var x = 0; x < postLoad.length; x++ )
			postLoad[x].postLoad(postLoad[x].params);
	}
	$("#" + tab + "_data input").each(function() {
		var $input = $(this);
		if ($input.is(':visible'))
		{
			$input.attr("tabindex", tabindex);
			tabindex++;
		}
	});

	//for synchronizing tabs //REMOVE ONCE CONFIRMED WORKING
	/*	for(var x = 0; x < synchPostLoad.length; x++ )
			synchPostLoad[x].postLoad(synchPostLoad[x].params);
	*/

	$('.updateAllCntr').click();

	if(ECM_DEBUG)$.log ("END loadDiv");
}

function getWordsBetweenCurlies(str) {
	  var results = [], re = /<v>(.*?)<\/v>/g, text;
	
	  while(text = re.exec(str)) {
	    results.push(text[1]);
	  }
	  //console.log(results);
	  return results;
}

function updateQuickLookupTable(obj)
{
	indPlan = [];
	quickLookUp = {};

	obj.find("span[tabPernr]").each(function()
		{

			var pernr = $(this).attr("pernr");
			var name = 	$(this).attr("name");
			//alert(pernr + "   " + name);
			indPlan.push({pernr:pernr,name:name});
			quickLookUp[pernr] = indPlan.length-1;
		}
	);

	//once done updating load the ind planner if one was to be opened with refresh
	if(loadIndPernr != "")
	{
		$('a[pernrClick=' + loadIndPernr + ']').trigger('click');
		loadIndPernr == "";//reset
	}
}

function showGenericError(message) {
	showError(message, 'page-error-cntr');
}

function processFormula(tab, pernr, id, data, colData, associate, init, revertInit)
{
	if(ECM_DEBUG)$.log ("START processFormula tab: " + tab + " pernr: " + pernr + " id: " + id );

	var ch = getColumnHandler(tab, id);

	if(ch != null && ch.formula && ch.formula != "") 
	{
		var result;
		var val;
		
		var currency = defaultCurrency; 
		if(ch.type == "AMT" || ch.type == "DLT") {
			if(associate.currency != null && associate.currency != "")
				currency = associate.currency;
			if(colData.currency != null && colData.currency != "")
				currency = colData.currency;
		}		
		
		
		if(!revertInit) {
			var formula = ch.formula;
			if(ECM_DEBUG)$.log ("column has formula");
			
			var entries = getWordsBetweenCurlies(ch.formula)
			if(entries.length) {
				for(var x = 0; x < entries.length; x++) {
					var colId = entries[x];
					var rawData;
					if(init || $('#' + tab + '_body_td_' + pernr + '_' + colId).length == 0)
						rawData = data[colId].rawData;
					else {
						if($('#' + tab + '_body_td_' + pernr + '_' + colId).attr('initial') != 'true' &&  $('#' + tab + '_body_td_' + pernr + '_' + colId).metadata() && $('#' + tab + '_body_td_' + pernr + '_' + colId).metadata().sortValue)
							rawData = $('#' + tab + '_body_td_' + pernr + '_' + colId).metadata().sortValue;
						else
							rawData = 0;
					}
					formula = formula.replace(new RegExp("<v>" + colId + "</v>", "g"), rawData);	
				}			
			}
	
			
			
			result = eval(formula);
			if(ch.type == "PCT") {
				var rule = getRoundingRules('pct', ch.rounding, ch.reviewItemId);
				val = $.formatNumber(result, {format:getAmountFormat('pct', ch.decimals, ch.trailZero), roundRule:rule, locale:locale});
				result = $.parseNumber(val, {format:getAmountFormat('pct', ch.decimals, ch.trailZero), roundRule:rule, locale:locale});
			} else if(ch.type == "AMT" || ch.type == "DLT") {
				var rule = getRoundingRules(currency, ch.rounding, ch.reviewItemId);
				val = $.formatNumber(result, {format:getAmountFormat(currency, ch.decimals, ch.trailZero), roundRule:rule, locale:locale});
				result = $.parseNumber(val, {format:getAmountFormat(currency, ch.decimals, ch.trailZero), roundRule:rule, locale:locale});
			}		
		} else {
			result = -1
			val = ""
		}
		
		if(!init) {
			var oldValue = $('#' + tab + '_body_td_' + pernr + '_' + id).metadata().sortValue;
			$('#' + tab + '_body_td_' + pernr + '_' + id).metadata().sortValue = result;
			$('#' + tab + '_body_td_' + pernr + '_' + id).html(val);
			$('#' + tab + "_data").trigger("updateCache");

			var isInitial = $('#' + tab + '_body_td_' + pernr + '_' + id).attr('initial') == "true";
			if(isInitial)
				oldValue = 0;
			if(!revertInit)
				$('#' + tab + '_body_td_' + pernr + '_' + id).attr('initial', "false");
			else
				$('#' + tab + '_body_td_' + pernr + '_' + id).attr('initial', "true")
				
			if(ch.useForBudget) {
				var summaryTab = tab;
				if(ch.planId && ch.planId != "")
					summaryTab = ch.planId;
				updateSummary(summaryTab, pernr, id, currency, oldValue, ((revertInit)?0:result), isInitial, false, revertInit);
				verifyBudgetSummaryExceeded();
			}
			
			
			advertiseColumnUpdate(tab, pernr, id, revertInit);
		}
		if(ECM_DEBUG)$.log ("END processFormula with results" + JSON.stringify(result));
		return result;
	}


	if(ECM_DEBUG)$.log ("END processFormula");
	return null;
}

function processRenderer(tab, pernr, id, data, colData, associate)
{
	if(ECM_DEBUG)$.log ("START processRenderer tab: " + tab + " pernr: " + pernr + " id: " + id );

	var r = null;
	if(columnRenderer[tab] && columnRenderer[tab][id])
	{
		r = columnRenderer[tab][id];
		if(ECM_DEBUG)$.log ("column is rendered seeking out renderer");

		if(r != null)
		{
			var result = eval(r.funcName + '(tab, pernr, id, r, data, colData, associate)');
			if(ECM_DEBUG)$.log ("END processRenderer with results" + JSON.stringify(result));
			return result;
		}
	}

	if(ECM_DEBUG)$.log ("END processRenderer");
	return null;
}

/************ table renderera handlers ********************/
function drawRuler(tab, pernr, id, r, data, colData, associate)
{
	if(ECM_DEBUG)$.log ("START drawRuler: tab: " + tab + " pernr: " + pernr + " id: " + id );

	if(ECM_DEBUG)$.log ("END drawRuler");

		return {
			params: {cols:r.map.cols, id:id},
			postLoad:
				function(params)
					{
						if(params.cols && params.cols.length)
							for(var x = 0; x < params.cols.length; x++)
								$('[col="' + params.cols[x] + '"]').addClass('ruler');
					}
		};
}

/************ row renderers handlers ********************/
function validateEligibilityRow(tab, pernr, id, r, data, colData, associate)
{
	if(ECM_DEBUG)$.log ("START validateEligibilityRow: tab: " + tab + " pernr: " + pernr + " id: " + id );
	var valueData = data[r.map.eligCol];
	var notEligible = false;
	if(valueData.displayData == "N")
	{
		notEligible = true;
		planList[tab]["associates"][pernr].eligible = false;
	}

	if(ECM_DEBUG)$.log ("END validateEligibilityRow");

		return {
			params: {notEligible:notEligible, tab:tab, pernr:pernr, id:id},
			postLoad:
				function(params)
					{
						if(params.notEligible)
						$('#' + params.tab + "_body_tr_" + params.pernr ).addClass('dis');
					}
		};
}

/************ cell renderers handlers ********************/
/*
function formatDateForDisplay(tab, pernr, id, r, data, colData, associate)
{
	if(ECM_DEBUG)$.log ("START setPernrColumn: tab: " + tab + " pernr: " + pernr + " id: " + id );
	var val = colData.displayData;
	if(colData.displayData !=null && colData.displayData != undefined && colData.displayData!="")
		val = getDateFormatForDisplay(colData.displayData);
	else 
		val = "";

	return {
		content: val
	};
}*/
/*
function formatNumberForDisplay(tab, pernr, id, r, data, colData, associate)
{
	if(ECM_DEBUG)$.log ("START setPernrColumn: tab: " + tab + " pernr: " + pernr + " id: " + id );

	var val;

	if(r.map.isPct)
		val = $.formatNumber(colData.rawData, {format:pctFormat, locale:locale});
	else {

		var currency = defaultCurrency;
		if(data[r.map.currency] != null)
			currency = data[r.map.currency].rawData;

		val = $.formatNumber(colData.rawData, {format:getAmountFormat(currency), locale:locale});
	}

	if(r.map.initValue) {
		if(colData.rawData == r.map.initValue) {
			if(r.map.initDisplayValue && r.map.initDisplayValue == "na")
				val = langMap.planSheet_planDataNotFound;
			else
				val = langMap.planSheet_planStatusInitial;
		}
	}

	return {
		content: val
	};
}*/
/*
function formatValueIfNull(tab, pernr, id, r, data, colData, associate)
{
	if(ECM_DEBUG)$.log ("START setPernrColumn: tab: " + tab + " pernr: " + pernr + " id: " + id );

	var val = colData.rawData;

	if(r.map.initValue) {
		if(colData.rawData == r.map.initValue) {
			if(r.map.initDisplayValue && r.map.initDisplayValue == "nr")
				val = langMap.planSheet_planNoRating;
			else
				val = langMap.planSheet_planStatusInitial;
		}
	}

	return {
		content: val
	};
}*/
/*
function setPernrColumn(tab, pernr, id, r, data, colData, associate)
{
	if(ECM_DEBUG)$.log ("START setPernrColumn: tab: " + tab + " pernr: " + pernr + " id: " + id );

	var content = [];

	var name = "";
	if(r.map.nameCol)
	{
		var valueData = data[r.map.nameCol];
		name = valueData.displayData;
	}

	content.push("<span tabPernr='" + tab + "' pernr='" + pernr + "' name='" + name.replace(new RegExp("'", "g"), "&#39;") + "'>");
	content.push(colData.displayData);
	content.push("</span>");
	if(ECM_DEBUG)$.log ("END setPernrColumn");

		return {
			content: content.join('')
		};
}*/
/*
function validateEligibility(tab, pernr, id, r, data, colData, associate)
{
	if(ECM_DEBUG)$.log ("START validateEligibility: tab: " + tab + " pernr: " + pernr + " id: " + id );
	var valueData = data[r.map.eligCol];

	var content = [];
	content.push('<span id="' + tab + "_body_td_copy_src_" + pernr + "_" + id + '" >');
	//if(colData.displayData == "")
	//{
		if(parseFloat(colData.rawData) == -2)
			content.push(langMap.planSheet_planStatusNotEligible);
		else if(parseFloat(colData.rawData) == -1)
			content.push(langMap.planSheet_planStatusInitial);
		else
			content.push(colData.displayData);
	//}


	content.push('</span>');
	if(ECM_DEBUG)$.log ("END validateEligibility");

		return {
			content: content.join('')
		};
}
*/
function openDetails(tab, pernr, id, data, colData, associate)
{
	if(ECM_DEBUG)$.log ("START openDetails: tab: " + tab + " pernr: " + pernr + " id: " + id );

	var tableBody = [];
	tableBody.push('<a class="linkpointer" pernrClick="' + pernr + '_' + tab + '" empId="'+pernr+'" tab="'+tab+'" onclick="getEmpProfile(this);">' + associate.lastName + ", " + associate.firstName + '</a><br />' + associate.posTitle + '\n');

	if(ECM_DEBUG)$.log ("END openDetails");
	return {
		content:tableBody.join('')
	};

}
/*
function setOverrideLumpSum(tab, pernr, id, r, data, colData, associate)
{

	if(ECM_DEBUG)$.log ("START setOverrideLumpSum: tab: " + tab + " pernr: " + pernr + " id: " + id );
	var tableBody = [];

	tableBody.push(colData.displayData);
	var lumpSumColData = data[r.map.lumpSumOverride];

	if(ECM_DEBUG)$.log ("END setOverrideLumpSum");
	return {
		content:tableBody.join(''),
		params: {tab:tab, pernr:pernr, id:id, colData:lumpSumColData, rule:r, eligible:associate.eligible},
		postLoad:
			function(params)
				{
					$('#' + params.tab + "_body_td_" + params.pernr + "_" + params.id ).attr('override',params.colData.displayData);
				}
		};

}

function viewPotentialRating(tab, pernr, id, r, data, colData, associate)
{

	if(ECM_DEBUG)$.log ("START viewPotentialRating: tab: " + tab + " pernr: " + pernr + " id: " + id );
	var tableBody = [];

	if(associate.eligible)
	{

		var ltiElig = data[r.map.ltiElig];
		if(parseFloat(ltiElig.rawData) != -2)
		{
			var ratingText = langMap.planSheet_potentialRatingSelect;

			for(var x = 0; x < potentialRatingList.length; x++)
			{
				var indGuide = potentialRatingList[x];
				if(indGuide.value == colData.displayData)
				{
					ratingText = indGuide.name;
					break;
				}
			}

			tableBody.push(ratingText + '\n');
		}
		else
			tableBody.push(langMap.planSheet_planDataBlank);
	}
	else
		tableBody.push(langMap.planSheet_planDataBlank);

	if(ECM_DEBUG)$.log ("END viewPotentialRating");
	return {
		content:tableBody.join('')
		};

}

function openPotentialRating(tab, pernr, id, r, data, colData, associate)
{

	if(ECM_DEBUG)$.log ("START openPotentialRating: tab: " + tab + " pernr: " + pernr + " id: " + id );
	var tableBody = [];

	var tpop = [];
	if(associate.eligible)
	{

		var ratingText = langMap.planSheet_potentialRatingSelect;

		for(var x = 0; x < potentialRatingList.length; x++)
		{
			var indGuide = potentialRatingList[x];
			if(indGuide.value == colData.displayData)
			{
				ratingText = indGuide.name;
				break;
			}
		}

		tableBody.push('<a id="' + tab + '_potential_rating_trigger_' + pernr + '_' + id  + '" href="#" onclick="return false;"><span id="' + tab + '_potential_rating_' + pernr + '_' + id  + '">' + ratingText + '</span></a>\n');

		tpop.push('<div id="' + tab + "_pop_potential_" + pernr + "_" + id  + '" style="display:none;">' +
				  '<div class="float_right">');
		tpop.push('<a class="bttn_small" id="' + tab + "_close_potential_" + pernr + "_" + id  + '" href="#"><span>' + langMap.popup_close + '</span></a>');

		tpop.push('</div>');


		tpop.push('<p class="label">' + langMap.planSheet_potentialRatingTitle + '</p>');
		tpop.push('	  <p class="shade_ccc">' + langMap.planSheet_potentialRatingDesc + '</p>');
		tpop.push('		<p> ');
		tpop.push('			<select ' + ((!associate.eligible)?"disabled":"" ) + ' id="' + tab + "_select_potential_" + pernr + "_" + id  + '">');

										tpop.push('<option value="">' + langMap.planSheet_potentialRatingSelect + '</option>');
										for(var x = 0; x < potentialRatingList.length; x++)
										{
											var indGuide = potentialRatingList[x];
											tpop.push('<option value="' + indGuide.value + '" ' + ((indGuide.value == colData.displayData)?'selected':'') + '>' + indGuide.name + '</option>');
										}

		tpop.push('			</select>');
		tpop.push('		</p></div>\n');

		if(ECM_DEBUG)$.log ("Table built: " + tpop.join('') );

		$('#btholder').append(tpop.join(''));
	}
	else
		tableBody.push(langMap.planSheet_planDataBlank);

	if(ECM_DEBUG)$.log ("END openPotentialRating");
	return {
		content:tableBody.join(''),
		params: {tab:tab, pernr:pernr, id:id, colData:colData, rule:r, eligible:associate.eligible},
		postLoad:
			function(params)
				{
					if(params.eligible)
					{
						//var pctData = data[params.rule.map.percentColumn];
						var potentialIndicator = data[params.rule.map.potentialIndicatorColumn];
						if(potentialIndicator.displayData == "")
						{
							$('#' + tab + "_select_potential_" + pernr + "_" + id).attr('disabled','disabled');
						}

						if(params.colData.rawData == "-1")
						{
							var inputElem = $("#" + params.tab + "_body_td_input_" + params.pernr + "_" + params.rule.map.percentColumn);
							inputElem.attr('disabled','disabled');

							var selectElem = $("#" + params.tab + "_select_guideline_" + params.pernr + "_" + params.rule.map.percentColumn);
							selectElem.attr('disabled','disabled');

						}

						$('#' + tab + "_select_potential_" + pernr + "_" + id ).unbind('change.event');
						$('#' + tab + "_select_potential_" + pernr + "_" + id ).bind('change.event',params,
								function(event){
									var params = event.data;

									var potentialRating = $('#' + params.tab + "_select_potential_" + params.pernr + "_" + params.id).val();


									//remove img

									$('#' + params.tab + "_potential_rating_" + params.pernr + "_" + params.id).html($('#' + params.tab + "_select_potential_" + params.pernr + "_" + params.id + " option:selected").text());

									var potSortValue = 0;
									var indName = "";
									for(var x = 0; x < potentialRatingList.length; x++)
									{
										var indGuide = potentialRatingList[x];
										if(indGuide.value == potentialRating)
										{
											potSortValue = indGuide.sortValue;
											indName = indGuide.name;
											break;
										}
									}

									//copy to rewards summary tab
									if(params.rule.map.copyColToSummary)
									{
										var jCopyElem = $('#' + params.rule.map.copyTab + '_body_td_' + params.pernr + '_' + params.rule.map.copyCol);
										if(potentialRating != "")
										{
											jCopyElem.html(indName);
											jCopyElem.metadata().sortValue = potSortValue;
										}
										else
										{
											jCopyElem.html(langMap.planSheet_potentialRatingSelect);
											jCopyElem.metadata().sortValue = -1;
										}
									}


									var inputElem = $("#" + params.tab + "_body_td_input_" + params.pernr + "_" + params.rule.map.percentColumn);
									if(inputElem.length > 0)
									{
										var performanceRating = $("#" + params.tab + "_span_perf_rating_" + params.pernr + '_' + params.rule.map.perfColumn).html();
										var newGuidelines = ((potentialRating == "" || performanceRating == "")?"0,0":potentialRatingMap[potentialRating][performanceRating]);
										if(ECM_DEBUG)$.log ("potentialRating: " + potentialRating + " performanceRating: " + performanceRating + " potentialRatingMap[potentialRating][performanceRating]: " + newGuidelines);

										var guidelines = newGuidelines.split(',');
										var content = "<span style='display:none' id='" + params.tab + "_guideline_" + params.pernr + "_" + params.rule.map.guidelineColumn  + "'>" + newGuidelines + "</span>" + $.formatNumber(guidelines[0], {format:pctFormat, locale:locale}) + "% - " + $.formatNumber(guidelines[1], {format:pctFormat, locale:locale}) + "%";
										$('#' + params.tab + '_body_td_' + params.pernr + '_' + params.rule.map.guidelineColumn).html(content);


										var selectElem = $("#" + params.tab + "_select_guideline_" + params.pernr + "_" + params.rule.map.percentColumn);
										var imgElem = $("#" + params.tab + "_img_guideline_" + params.pernr + "_" + params.rule.map.percentColumn);

										if(performanceRating != "")
										{
											if(potentialRating != "")
											{

												$('#' + params.tab + '_body_td_' + params.pernr + '_' + params.id).metadata().sortValue = potSortValue;
												$('#' + params.tab + "_data").trigger("update");


												selectElem.removeAttr('disabled');
												inputElem.removeAttr('disabled');
												imgElem.trigger('mouseover');//init the select dropdown
												inputElem.trigger('change');

											}
											else
											{
												$('#' + params.tab + '_body_td_' + params.pernr + '_' + params.id).metadata().sortValue = -1;
												$('#' + params.tab + "_data").trigger("update");

												inputElem.val("0");
												inputElem.trigger("change");
												inputElem.attr('disabled','disabled');
												selectElem.attr('disabled','disabled');
											}
										}

										//$("#" + params.tab + "_close_potential_" + params.pernr + "_" + params.id).trigger('click');
									}
	
										planRatingChanges[params.tab + "," + params.pernr] = params.tab + "," + params.pernr + "," + potentialRating;
								});

						$('#' + tab + "_potential_rating_trigger_" + pernr + "_" + id ).unbind('click.event');
						$('#' + tab + "_potential_rating_trigger_" + pernr + "_" + id ).bind('click.event', params, processPopRatingBubble);
					}
				}
		};

}

function getPerfApp(tab, pernr, id, r, data, colData, associate)
{
	if(ECM_DEBUG)$.log ("START getPerfApp: tab: " + tab + " pernr: " + pernr + " id: " + id );

	if(colData)
	{
		var tableBody = [];
		var popOpen = true;
		var valueData = data[r.map.appIdCol];
		var nameData = data[r.map.nameCol];
		tableBody.push('<span style="display:none" id="' + tab + '_span_perf_rating_' + pernr + "_" + id + '">' + colData.displayData + '</span>');
		if(valueData.displayData != "-1")
		{
			if(valueData.displayData != "")
			{

				nameData = nameData.displayData;
				var nameArr = nameData.split(',');
				tableBody.push('<a href="#" pernrClick="' + valueData.displayData + '" onclick="verifyP3App(\'' + valueData.displayData + '\',\'P\',\'' + encodeURIComponent(nameArr[1] + " " + nameArr[0]).replace(new RegExp("'", "g"), "\\'") + '\',\'\',\'' + '\');"><span>');

				if(colData.displayData != "")
					tableBody.push(colData.displayData);
				else
					tableBody.push(langMap.planSheet_planNeedRating);

				tableBody.push('</span></a>\n');
			}
			else
			{

				tableBody.push('<span id="' + tab + "_span_no_rating_" + pernr + "_" + id  + '"><a href="#">');
				if(colData.displayData != "")
					tableBody.push(colData.displayData + '\n');
				else
					tableBody.push(langMap.planSheet_planNeedRating + '\n');
				tableBody.push('</a></span>');

				$('#btholder').append('<div id="' + tab + "_pop_no_app_rating_" + pernr + "_" + id  + '" style="display:none;"><pre class="tip">' +
							   replaceElems(tab, pernr, id, r.map.replaceElems, r.map.templateNoApp, data) +
							   '</pre></div>\n');
			}

			if(colData.displayData == "")
			{
				tableBody.push('<img border="0" id="' + tab + "_img_no_rating_" + pernr + "_" + id  + '" src="' + imageBuilder(rp, 'icon_warning_on', postImg, 'gif') + '" />\n');

				$('#btholder').append('<div id="' + tab + "_pop_no_rating_" + pernr + "_" + id  + '" style="display:none;"><pre class="tip">' +
							   replaceElems(tab, pernr, id, r.map.replaceElems, r.map.template, data) +
							   '</pre></div>\n');
			}
		}
		else
		{
			if(colData.displayData != "")
				tableBody.push(colData.displayData);
			else
				tableBody.push(langMap.planSheet_planNeedRating);
			popOpen = false;
		}

		if(ECM_DEBUG)$.log ("END getPerfApp");
		return {
			content:tableBody.join(''),
			params: {popDirection: r.map.popDirection, popup:(r.map.popup && popOpen), tab:tab, pernr:pernr, id:id},
			postLoad:
				function(params)
					{

						if(params.popup)
						{
							if($('#' + params.tab + "_img_no_rating_" + params.pernr + "_" + params.id ).length > 0)
							{
								$('#' + params.tab + "_img_no_rating_" + params.pernr + "_" + params.id ).unbind('mouseover.event');
								$('#' + params.tab + "_img_no_rating_" + params.pernr + "_" + params.id ).bind('mouseover.event', params, function(event){
											var params = event.data;

											//verify existence of tooltip
											if( $('table.bubbletip #' + params.tab + "_pop_no_rating_" + params.pernr + "_" + params.id).length == 0)
											{
												//instantiate the bubbletip and pop the hover
												$('#' + params.tab + "_img_no_rating_" + params.pernr + "_" + params.id)
													.bubbletip(
																$('#' + params.tab + "_pop_no_rating_" + params.pernr + "_" + params.id)
																,{	delayShow: delayShowOnMouseOver,
																	delayHide: 0,
																	calculateOnShow: true,
																	deltaDirection: params.popDirection
																});
												//pop the info after if has been created
												$('#' + params.tab + "_img_no_rating_" + params.pernr + "_" + params.id ).trigger('mouseover');
											}

									}
								)
							}

							if($('#' + params.tab + "_span_no_rating_" + params.pernr + "_" + params.id ).length > 0)
							{
								$('#' + params.tab + "_span_no_rating_" + params.pernr + "_" + params.id ).unbind('mouseover.event');
								$('#' + params.tab + "_span_no_rating_" + params.pernr + "_" + params.id ).bind('mouseover.event', params, function(event){
											var params = event.data;

											//verify existence of tooltip
											if( $('table.bubbletip #' + params.tab + "_pop_no_app_rating_" + params.pernr + "_" + params.id).length == 0)
											{
												//instantiate the bubbletip and pop the hover
												$('#' + params.tab + "_span_no_rating_" + params.pernr + "_" + params.id)
													.bubbletip(
																$('#' + params.tab + "_pop_no_app_rating_" + params.pernr + "_" + params.id)
																,{	delayShow: 0,
																	delayHide: 0,
																	calculateOnShow: true,
																	bindShow: 'click',
																	bindHide: 'mouseout',
																	deltaDirection: params.popDirection
																});
												//pop the info after if has been created
												$('#' + params.tab + "_span_no_rating_" + params.pernr + "_" + params.id ).trigger('mouseover');
											}

									}
								)
							}

						}
					}
		};
	}
	else
		return null;
}

function getInfo(tab, pernr, id, r, data, colData, associate)
{
	if(ECM_DEBUG)$.log ("START getInfo: tab: " + tab + " pernr: " + pernr + " id: " + id );

	if(colData)
	{
		var tableBody = [];
		if(associate.eligible)
			tableBody.push('<a pernrClick="' + pernr + '" href="#" empId="'+pernr+'" empName="'+colData.displayData+'" onclick="getEmpProfile(this);"><span>' + colData.displayData + '</span></a>');
		else
			tableBody.push(colData.displayData);
		
/
		tableBody.push('\n');
		if(ECM_DEBUG)$.log ("JSON stringify map: " + JSON.stringify(r) );

		for(var x = 0; x < r.map.append.length; x++ )
		{
			if(data[r.map.append[x]])
			{
				var valueData = data[r.map.append[x]];
				tableBody.push('<br />' + valueData.displayData + '\n');
			}
		}

		if(ECM_DEBUG)$.log ("END getInfo");
		return {
			content:tableBody.join(''),
			params: {eligible:associate.eligible, tab:tab, pernr:pernr, name:colData.displayData},
			postLoad:
				function(params)
					{
						//only add from the reward summary tab pahes 2: updated the column pernr to follow indPlanning depending on sort

					}
		};
	}
	else
		return null;
}

function selectAsc(tab, pernr, id, r, data, colData, associate)
{
	if(ECM_DEBUG)$.log ("START selectAsc: tab: " + tab + " pernr: " + pernr + " id: " + id );

	if(colData)
	{
		var tableBody = [];
		if(associate.eligible)
			tableBody.push('<input type="checkbox" id="' + tab + "_cb_" + pernr + "_" + id  + '" name="' + tab + "_cb_asc" +'" tab="' + tab + '" pernr="' + pernr + '" col="' + id + '" />\n');
		else
			tableBody.push('<input type="checkbox" id="' + tab + "_cb_" + pernr + "_" + id  + '" name="' + tab + "_cb_asc" +'" tab="' + tab + '" pernr="' + pernr + '" col="' + id + '" disabled="disabled" />\n');

		if(ECM_DEBUG)$.log ("JSON stringify map: " + JSON.stringify(r) );

		if(ECM_DEBUG)$.log ("END selectAsc");
		return {
			content:tableBody.join(''),
			params: {eligible:associate.eligible, tab:tab, pernr:pernr, id:id, name:colData.displayData},
			postLoad: function(params) {

				var th = $('#' + params.tab + '_head_th_' + params.id);

				if(!th.has(":checkbox").length)
				{
					th.addClass('headerNoSort').html('<input type="checkbox" id="' + params.tab + "_cb_all_" + params.id  + '" col="' + params.id + '" />\n');
					th.find(":checkbox").click(function()
					{
						$(":checkbox[name=" + params.tab + "_cb_asc]").not(":disabled").prop('checked', $(this).is(":checked"));
					});
				}
				//only add from the reward summary tab pahes 2: updated the column pernr to follow indPlanning depending on sort

			}
		};
	}
	else
		return null;
}

function showUpdateAll(tab, pernr, id, r, data, colData, associate)
{
	if(ECM_DEBUG)$.log ("START showUpdateAll: tab: " + tab + " pernr: " + pernr + " id: " + id );
	var disabled="";
		
	if(isSavable || !isSubmitted || isAbleApproveReject) {
		if(colData)
		{
			return {
				content:'',
				params: {eligible:associate.eligible, tab:tab, pernr:pernr, id:id, name:colData.displayData},
				postLoad: function(params) {
	
					var th = $('#' + params.tab + '_head_th_' + params.id);
	
					if(th.attr('updateAllRendered') != "true")
					{
						var html = [];
	
						html.push('<div class="updateAllContentCntr" id="'+tab+'_'+id+'_apply_content_cntr" tab="'+tab+'" col="'+id+'">');
						html.push('	<div>');
						html.push('		<table cellspacing="0" cellpadding="3">');
						html.push('			<tr>');
						html.push('				<td><input type="text" id="'+tab+'_'+id+'_apply_inp" tab="'+tab+'" col="'+id+'" class="textboxHeader highlight" /></td>');
						html.push('				<td><button tab="'+tab+'" id="'+tab+'_'+id+'_apply_btn" class="btn btn-minier btn-primary" col="'+id+'">'+langMap.worksheet_btn_apply+'</button></td>');
						html.push('			</tr>');
						html.push('		</table>');
						html.push('	</div>');
						html.push('</div>');
	
						$('#content_container_divs').append(html.join(''));
	
						th.append('<div class="updateAllCntr" id="'+tab+'_'+id+'_apply_cntr" tab="'+tab+'" col="'+id+'"></div>');
	
						$('#'+tab+'_'+id+'_apply_cntr').click(function(e)
						{
							e.preventDefault();
							e.stopPropagation();
	
							var tab = $(this).attr('tab');
							var col = $(this).attr('col');
							var applyContentCntr = $('#' + tab + '_' + col + '_apply_content_cntr');
							var pos = $('#' + tab + '_head_th_' + col).offset();
							var paddingTop = parseInt(applyContentCntr.find('td').css("padding-top"));
							var paddingLeft = parseInt(applyContentCntr.find('td').css("padding-left"));
	
							applyContentCntr.toggle();
	
							applyContentCntr.css({
						        top: (pos.top - (paddingTop*2)) + "px",
						        left: (pos.left - ((applyContentCntr.outerWidth() - th.outerWidth())/2)- (paddingLeft*6)) + "px"
						    });
							
							if(isProxy)
								$('.updateAllContentCntr').css('margin-top','-85px');
							else 
								$('.updateAllContentCntr').css('margin-top','-47px');							
							
							return false;
						});
						
						$('#'+tab+'_'+id+'_apply_inp').keydown(function(e) {
					    	numericValidation(e);
							if($(this).val().length >2){
								if (e.keyCode == 46 || e.keyCode == 8) {
									return true;
	        					}else
									return false;
					    	}
					    });
	
						$('#'+tab+'_'+id+'_apply_btn').click(function(e)
						{
							var tab = $(this).attr('tab');
							var cbs = $('input:checkbox[name='+tab+'_cb_asc]:checked');
	
							if(cbs.length > 0)
							{
								var col = $(this).attr('col');
								var applyContentCntr = $('#' + tab + '_' + col + '_apply_content_cntr');
								var applyInput = $('#' + tab + '_' + col + '_apply_inp');
	
								if(!IsNumeric(applyInput.val()) || applyInput.val() == "")
									return;
	
								var pct = $.parseNumber(applyInput.val(), {format:getAmountFormat(defaultCurrency), locale:locale}) / 100;
	
								$(cbs).each(function()
								{
									var pernr = $(this).attr('pernr');
									var input = $('#' + tab + '_body_td_input_' + pernr + '_' + col);
									var referenceColumn = $('#' + tab + '_body_td_' + pernr + '_' + r.map.referenceColumn).metadata().sortValue;
	
									if(referenceColumn != -1) {
										referenceColumn = referenceColumn * (1 + pct);
										referenceColumn = Math.round(referenceColumn/100)*100; //round to the nearest 100
										input.val($.parseNumber(""+referenceColumn, {format:'#,#00', locale:locale})).trigger('change').trigger('blur').removeClass('dis');
									}
								});
								$('#' + tab + '_' + col + '_apply_inp').val('');
								//applyContentCntr.hide();
							}
							else
								alert('Please select eligble employee(s).');
						});
	
						th.attr('updateAllRendered', true);
					}
				}
			};
		}
	}
	else
		return null;
}


//synching the ale column cause the 2ai and 4lai tab to load at the same time
var aleSynchCol = false;
function showPopup(tab, pernr, id, r, data, colData, associate)
{
	if(ECM_DEBUG)$.log ("START showPopup: tab: " + tab + " pernr: " + pernr + " id: " + id );
	if(colData && associate.eligible)
	{
		var tableBody = [];

		if(ECM_DEBUG)$.log ("JSON stringify map: " + JSON.stringify(r) );

		if(!colData.editable)
			tableBody.push('<span id="' + tab + "_span_" + pernr + "_" + id  + '">' + colData.displayData + '</span>&nbsp;');


		var drawPopup = true;
		if(r.map.validateCol && r.map.validateCol != "")
		{
			var elemData = data[r.map.validateCol];
			if(elemData.displayData != "X")
				drawPopup = false;
			else
			{
				//if column is synched for 2AI and 4LAI set to true
				if(r.map.aleSynchCol && r.map.aleSynchCol != "")
					aleSynchCol = true;
			}
		}

		if(drawPopup)
		{
			tableBody.push('<img style="height:11px;" border="0" id="' + tab + "_img_" + pernr + "_" + id  + '" src="' + imageBuilder(rp, 'icon_g', postImg, 'png') + '" />\n');
			$('#btholder').append('<div id="' + tab + "_pop_" + pernr + "_" + id  + '" style="display:none;"><pre class="tip">' +
					   replaceElems(tab, pernr, id, r.map.replaceElems, r.map.template, data) +
					   '</pre></div>\n');
		}

		if(ECM_DEBUG)$.log ("END showPopup");
		return {
			content:tableBody.join(''),
			params: {popDirection: r.map.popDirection, drawPopup: drawPopup, tab:tab, pernr:pernr, id:id},
			postLoad:
				function(params)
					{
						if(params.drawPopup)
						{
							$('#' + params.tab + "_img_" + params.pernr + "_" + params.id ).unbind('mouseover.event');
							$('#' + params.tab + "_img_" + params.pernr + "_" + params.id ).bind('mouseover.event', params, function(event){
										var params = event.data;
										//verify existence of tooltip
										if( $('table.bubbletip #' + params.tab + "_pop_" + params.pernr + "_" + params.id).length == 0)
										{
											//instantiate the bubbletip and pop the hover
											$('#' + params.tab + "_img_" + params.pernr + "_" + params.id)
												.bubbletip(
															$('#' + params.tab + "_pop_" + params.pernr + "_" + params.id)
															,{	delayShow: delayShowOnMouseOver,
																delayHide: 0,
																calculateOnShow: true,
																deltaDirection: params.popDirection
															});
											//pop the info after if has been created
											$('#' + params.tab + "_img_" + params.pernr + "_" + params.id ).trigger('mouseover');
										}

								}
							)
						}
					}
			};
	}
	else
		return null;
}


function showGuaranteedPopup(tab, pernr, id, r, data, colData, associate)
{
	if(ECM_DEBUG)$.log ("START showGuaranteedPopup: tab: " + tab + " pernr: " + pernr + " id: " + id );
	if(colData)
	{
		var tableBody = [];

		if(ECM_DEBUG)$.log ("JSON stringify map: " + JSON.stringify(r) );


		var val = colData.displayData;

		if(r.map.isNumerical) {
			if(r.map.isPct)
				val = $.formatNumber(colData.rawData, {format:pctFormat, locale:locale});
			else {

				var currency = defaultCurrency;
				if(data[r.map.currency] != null)
					currency = data[r.map.currency].rawData;

				val = $.formatNumber(colData.rawData, {format:getAmountFormat(currency), locale:locale});
			}

			if(r.map.initValue) {
				if(colData.rawData == r.map.initValue) {
					if(r.map.initDisplayValue && r.map.initDisplayValue == "na")
						val = langMap.planSheet_planDataNotFound;
					else
						val = langMap.planSheet_planStatusInitial;
				}

			}


		}

		if(!colData.editable)
			tableBody.push('<span id="' + tab + "_span_" + pernr + "_" + id  + '">' + val + '</span>&nbsp;');


		var drawPopup = false;
		var guaranteed = false;
		var terminated = false;
		var template = '';
		var imageType='';
		var guaranteeTemplate='';
		var warningImage="";
		if((r.map.guaranteedCol && r.map.guaranteedCol != "") || (r.map.targettedCol && r.map.targettedCol != ""))
		{
			var elemDataG = data[r.map.guaranteedCol];
			var elemDataT = data[r.map.targettedCol];
			if(elemDataG.rawData != "0") {
				drawPopup = true;
				guaranteed = true;
				data[r.map.guaranteedCol].displayData =  $.formatNumber(elemDataG.rawData, {format:getAmountFormat(currency), locale:locale}).toString();
				template = r.map.templateG;
				imageType = 'icon_g';
				guaranteeTemplate = r.map.guaranteeTemplateG
				warningImage = 'icon_warning_on';
			}
			else if(elemDataT.rawData != "0") {
				drawPopup = true;
				terminated = true;
				data[r.map.targettedCol].displayData =  $.formatNumber(elemDataT.rawData, {format:getAmountFormat(currency), locale:locale}).toString();
				template = r.map.templateT;
				imageType = 'icon_t';
				guaranteeTemplate = r.map.guaranteeTemplateT;
				warningImage = 'icon_warning_off';
			}
		}

		if(drawPopup)
		{
			
			data[id].displayData = val;
			tableBody.push('<img style="height:11px;" border="0" id="' + tab + "_img_" + pernr + "_" + id  + '" src="' + imageBuilder(rp, imageType, postImg, 'png') + '" />\n');
			$('#btholder').append('<div id="' + tab + "_pop_" + pernr + "_" + id  + '" style="display:none;"><pre class="tip">' +
					   replaceElems(tab, pernr, id, r.map.replaceElems, template, data) +
					   '</pre></div>\n');
		}

		if(ECM_DEBUG)$.log ("END showPopup");
		return {
			content:tableBody.join(''),
			params: {popDirection: r.map.popDirection, guaranteeWarning:r.map.guaranteeWarning, guaranteeTemplate: guaranteeTemplate, drawPopup: drawPopup, tab:tab, pernr:pernr, id:id, data:data},
			postLoad:
				function(params)
					{
				
						if(params.drawPopup)
						{

							if(params.guaranteeWarning) {
								if($('#' + params.tab + "_img_guar_" +params.pernr + "_" + params.guaranteeWarning).length == 0) {
									var guaranteedTable = [];
									//draw the popup for guaranteed values
									guaranteedTable.push('<img style="display:none;" style="height:11px;" border="0" id="' + params.tab + "_img_guar_" +params.pernr + "_" + params.guaranteeWarning  + '" src="' + imageBuilder(rp, warningImage, postImg, 'png') + '" />\n');
									$('#btholder').append('<div id="' + params.tab + "_pop_guar_" + params.pernr + "_" + params.guaranteeWarning  + '" style="display:none;"><pre class="tip">' +
											   replaceElems(params.tab, params.pernr, params.id, [], params.guaranteeTemplate, params.data) +
											   '</pre></div>\n');
									
									$('#' + params.tab + "_body_td_" + params.pernr + "_" + params.guaranteeWarning ).append(guaranteedTable.join(''));
									
									
									//$('#' + params.tab + "_img_" + params.pernr + "_" + params.id ).unbind('mouseover.event');
									$(document).on('mouseover.event', '#' + params.tab + "_img_guar_" + params.pernr + "_" + params.guaranteeWarning , params, function(event){
												var params = event.data;
												//verify existence of tooltip
												if( $('table.bubbletip #' + params.tab + "_pop_guar_" + params.pernr + "_" + params.guaranteeWarning).length == 0)
												{
													//instantiate the bubbletip and pop the hover
													$('#' + params.tab + "_img_guar_" + params.pernr + "_" + params.guaranteeWarning)
														.bubbletip(
																	$('#' + params.tab + "_pop_guar_" + params.pernr + "_" + params.guaranteeWarning)
																	,{	delayShow: delayShowOnMouseOver,
																		delayHide: 0,
																		calculateOnShow: true,
																		deltaDirection: params.popDirection
																	});
													//pop the info after if has been created
													$('#' + params.tab + "_img_guar_" + params.pernr + "_" + params.guaranteeWarning ).trigger('mouseover');
												}

										}
									)								
		
								}
							}							
							
							
							
							//$('#' + params.tab + "_img_" + params.pernr + "_" + params.id ).unbind('mouseover.event');
							$(document).on('mouseover.event', '#' + params.tab + "_img_" + params.pernr + "_" + params.id , params, function(event){
										var params = event.data;
										//verify existence of tooltip
										if( $('table.bubbletip #' + params.tab + "_pop_" + params.pernr + "_" + params.id).length == 0)
										{
											//instantiate the bubbletip and pop the hover
											$('#' + params.tab + "_img_" + params.pernr + "_" + params.id)
												.bubbletip(
															$('#' + params.tab + "_pop_" + params.pernr + "_" + params.id)
															,{	delayShow: delayShowOnMouseOver,
																delayHide: 0,
																calculateOnShow: true,
																deltaDirection: params.popDirection
															});
											//pop the info after if has been created
											$('#' + params.tab + "_img_" + params.pernr + "_" + params.id ).trigger('mouseover');
										}

								}
							)
						}
					}
			};
	}
	else
		return null;
}

function updateColCheck(cols,tab,pernr,id ,obj)
{
	cols = cols.split(',');
	for(var x = 0; x < cols.length; x++)
	{
		var col = cols[x];
		var val = $('#' + tab + "_body_td_" + pernr + "_" + col).metadata().sortValue;
		if(val < 0 && val != -2)
			return;
	}

	$("#" + tab + "_body_td_" + pernr + "_" + id).removeClass("incomplete").addClass("complete");
	$(obj).html(langMap.planSheet_planStatusComplete);
}

function setStatus(tab, pernr, id, r, data, colData, associate)
{
	if(ECM_DEBUG)$.log ("START setStatus: tab: " + tab + " pernr: " + pernr + " id: " + id );
	if(colData)
		{
		var text = "";
		if(colData.displayData == "C")
			text = langMap.planSheet_planStatusComplete;
		else if(colData.displayData == "I")
			text = langMap.planSheet_planStatusInComplete;
		else if(colData.displayData == "N")
			text = langMap.planSheet_planStatusNotEligible;

		if(ECM_DEBUG)$.log ("END setStatus");
		return {
			content: '<span id="' + tab + "_status_" + pernr + "_" + id + '" onclick="updateColCheck(\'' + r.map.updateColCheck.join(',') + '\',\'' + tab + '\',\'' + pernr + '\',\'' + id + '\' ,this)">' + text + '</span>',
			params: {tab:tab, pernr:pernr, id:id, displayData: colData.displayData},
			postLoad:
				function(params)
					{
						var cssStyle = "";
						if(params.displayData == "C")
							cssStyle = "complete";
						else if(params.displayData == "I")
							cssStyle = "incomplete";
						else if(params.displayData == "N")
							cssStyle = "ineligible";

						$('#' + params.tab + "_body_td_" + params.pernr + "_" + params.id).addClass('status').addClass(cssStyle);

					}


		};
	}
	else
		return null;

}

function setPlannedStatus(tab, pernr, id, r, data, colData, associate)
{
	if(ECM_DEBUG)$.log ("START setStatus: tab: " + tab + " pernr: " + pernr + " id: " + id );
	if(colData)
		{
		var text = langMap["reco_status_" + colData.displayData];

		if(ECM_DEBUG)$.log ("END setStatus");
		return {
			content: '<span id="' + tab + "_status_" + pernr +  '">' + text + '</span>',
			params: {tab:tab, pernr:pernr, id:id, displayData: colData.displayData},
			postLoad:
				function(params)
					{
						var cssStyle = "";

							cssStyle = "ineligible";

						$('#' + params.tab + "_body_td_" + params.pernr + "_" + params.id).addClass('status').addClass(cssStyle);

					}


		};
	}
	else
		return null;

}

function drawGuidelines(tab, pernr, id, r, data, colData, associate)
{
	if(ECM_DEBUG)$.log ("START drawGuidelines: tab: " + tab + " pernr: " + pernr + " id: " + id );
	if(colData)
	{
		var content = "";

		if(associate.eligible)
		{
			var process = true;
			if(r.map.disableExecColumn)
			{
				var execCol = data[r.map.disableExecColumn];
				if(execCol.displayData == "X")
				{
					content = langMap.planSheet_planStatusGuideExec;
					process = false;
				}
			}

			if(process)
			{
				var guidelines = colData.displayData.split(',');
				content = "<span style='display:none' id='" + tab + "_guideline_" + pernr + "_" + id  + "'>" + colData.displayData + "</span>" + $.formatNumber(guidelines[0], {format:pctFormat, locale:locale}) + "% - " + $.formatNumber(guidelines[1], {format:pctFormat, locale:locale}) + "%";
			}

		}
		else
			content = langMap.planSheet_planStatusGuideNotEligible;



		if(ECM_DEBUG)$.log ("END drawGuidelines");
		return {
			content: 	content
		};
	}
	else
		return null;

}
*/

function replaceElems(tab, pernr, id, replaceElems, template, data)
{
	template = template.replace(new RegExp("{PERNR}", "g") , pernr);
	template = template.replace(new RegExp("{TAB}", "g"), tab);
	if(replaceElems) {
		for(var x = 0; x < replaceElems.length; x++ )
		{
			var colId = replaceElems[x];
			var elemData = data[colId];
			var dvalue = ""
			if(elemData != null)
				dvalue =  elemData.displayData;

			template = template.replace(new RegExp("{" + colId + "}", "g"), dvalue);
		}

		for(var x = 0; x < replaceElems.length; x++ )
		{
			var colId = replaceElems[x];
			var elemData = data[colId];
			var rvalue = "-1"
			if(elemData != null)
				rvalue =  elemData.rawData;

			template = template.replace(new RegExp("{" + colId + "_RAW}", "g"), rvalue)
	}
	}

	return template;
}

function getEventHandler(tab, id)
{
	var eh = null;
	try
	{
		eh = planRules[tab][id];
	}
	catch (e)
	{
		if(ECM_DEBUG)$.log ("no rule found aborting");
	}
	return eh;

}

function getAssociate(tab, pernr)
{
	var a = null;
	try
	{
		a = planList[tab].associates[pernr];
	}
	catch (e)
	{
		if(ECM_DEBUG)$.log ("no associate found aborting");
	}
	return a;

}

function getColData(tab, pernr, id)
{
	var a = null;
	try
	{
		a = planList[tab].data[pernr][id];
	}
	catch (e)
	{
		if(ECM_DEBUG)$.log ("no associate found aborting");
	}
	return a;

}

function getColumns(tab)
{
	var c = null;
	try
	{
		c = planList[tab];
	}
	catch (e)
	{
		if(ECM_DEBUG)$.log ("no column found aborting");
	}
	return c;

}

function getColumnHandler(tab, id)
{
	var ch = null;
	try
	{
		ch = planList[tab].cols[id];
	}
	catch (e)
	{
		if(ECM_DEBUG)$.log ("no column found aborting");
	}
	return ch;

}

/************ event handlers ********************/
/*function copyCol(tab, pernr, id, obj)
{
	if(ECM_DEBUG)$.log ("START copyCol: tab: " + tab + " pernr: " + pernr + " id: " + id );
	var eh = getEventHandler(tab, id);
	$('#' + eh.map.toPlan + "_body_td_copy_src_" + pernr + "_" + eh.map.toCol).html(obj.innerHTML);
	if(ECM_DEBUG)$.log ("END copyCol");
}


var synchInProgress = [];
var lconst = {
	SYNCH_PERF_FACT_LOCK : "INPUT_PF",
	SYNCH_OUT_REASON_LOCK : "INPUT_R"
};*/
/*
function updatePct(tab, pernr, id, obj)
{
	if(ECM_DEBUG)$.log ("START updatePct: tab: " + tab + " pernr: " + pernr + " id: " + id );

	var eh = getEventHandler(tab, id);

	if(!IsNumeric(obj.value) || obj.value == "")
	{
		//obj.value = obj.prevValue;
		return;
	}

	$(obj).parseNumber({format:pctFormat, locale:locale});
	$(obj).formatNumber({format:pctFormat, locale:locale});

	//call one more time to get proper format
	var number = $(obj).parseNumber({format:pctFormat, locale:locale}, false);

	if(number > 9999)
	{
		obj.value = obj.prevValue;
		return;
	}

	//backup in prevValue
	var isInitial = false;
	if(obj.prevValue == "")
		isInitial = true;

	obj.prevValue = obj.value;

	$('#' + tab + '_body_td_' + pernr + '_' + id).metadata().sortValue = number;

	if(pernr != "all" && eh != null && eh.map.copyColToSummary)
	{
		$('#' + eh.map.copyTab + '_body_td_copy_src_' + pernr + '_' + eh.map.copyCol).html(obj.value);
		$('#' + eh.map.copyTab + '_body_td_' + pernr + '_' + eh.map.copyCol).metadata().sortValue = obj.value;
		$('#' + eh.map.copyTab + '_status_' + pernr + '_' + eh.map.statusCol).trigger('click');

	}

	var basePay = $('#' + tab + '_body_td_' + pernr + '_' + eh.map.basePay).metadata().sortValue;

	var currency = defaultCurrency;
	if($('#' + tab + '_body_td_' + pernr + '_' + eh.map.currency).length != 0)
		currency = $('#' + tab + '_body_td_' + pernr + '_' + eh.map.currency).html();

	var oldAmount = $('#' + tab + '_body_td_' + pernr + '_' + eh.map.amount).metadata().sortValue;

	var newAmount = $.formatNumber((basePay * (number/100)), {format:getAmountFormat(currency), decimalToRound:0, locale:locale});

	if(ECM_DEBUG)$.log ("basePay: " + basePay + " currency: " + currency + " oldAmount: " + oldAmount + " newAmount: " + newAmount);

	newAmount = $.parseNumber(newAmount, {format:getAmountFormat(currency), locale:locale});

	if(eh.map.updateSummary && $(obj).attr('updatedSummary') != 'true')
	{
		var oldLumpSum = 0;
		if(eh.map.updateLumpSumSalary)
			oldLumpSum = $("#" + tab + "_body_td_" + pernr + '_' + eh.map.lumpSum).metadata().sortValue;

		var summaryTab = tab;
		var updateSummaryFromInd = false;
		var summaryPernr  = pernr;
		if(eh.map.updateSummaryTab != null)
		{
			summaryTab = eh.map.updateSummaryTab;
			updateSummaryFromInd = true;
			summaryPernr = $('#ipPernr').html();
		}
		updateSummary(summaryTab, summaryPernr, id, obj, basePay, currency, oldAmount + oldLumpSum, newAmount, isInitial, updateSummaryFromInd);
		verifyBudgetSummaryExceeded();
	}
	//else
	//	$(obj).removeAttr('updatedSummary')

	if(eh.map.updateLumpSumSalary)
	{
		var lumpSum = $("#" + tab + "_body_td_" + pernr + '_' + eh.map.lumpSum);

		var newBasePayVal = parseFloat(basePay) + parseFloat(newAmount);

		if(lumpSum.attr('override') != 'X')
		{
			var salaryRangeMax = $('#' + tab + '_body_td_' + pernr + '_' + eh.map.salaryRangeMax).metadata().sortValue;

			if(salaryRangeMax < basePay)
				salaryRangeMax = basePay;

			var delta = 0;
			if(newBasePayVal > salaryRangeMax)
			{
				delta = newBasePayVal - salaryRangeMax;
				newBasePayVal = salaryRangeMax;
				newAmount = newBasePayVal - parseFloat(basePay);
			}

			delta = $.formatNumber(delta, {format:getAmountFormat(currency), locale:locale});
			lumpSum.html(delta.toString() + ((eh.map.appendCurrency)? " " + currency:""));
			delta = $.parseNumber(delta, {format:getAmountFormat(currency), locale:locale});
			lumpSum.metadata().sortValue = delta;
		}

		var newBasePay = $("#" + tab + "_body_td_" + pernr + '_' + eh.map.newBasePay);
		newBasePayVal = $.formatNumber(newBasePayVal, {format:getAmountFormat(currency), locale:locale});
		newBasePay.html(newBasePayVal.toString() + ((eh.map.appendCurrency)? " " + currency:""));
		newBasePayVal = $.parseNumber(newBasePayVal, {format:getAmountFormat(currency), locale:locale});
		newBasePay.metadata().sortValue = newBasePayVal;

		if(eh.map.updateCompaRatio)
		{
			var salaryRangeMid = $('#' + tab + '_body_td_' + pernr + '_' + eh.map.salaryRangeMid).metadata().sortValue;
			var newCompaRatioVal = (newBasePayVal / parseFloat(salaryRangeMid));

			var newCompaRatio = $("#" + tab + "_body_td_" + pernr + '_' + eh.map.newCompaRatio);
			newCompaRatioVal = $.formatNumber(newCompaRatioVal, {format:compaRatioFormat, locale:locale});
			newCompaRatio.html(newCompaRatioVal.toString());
			newCompaRatioVal = $.parseNumber(newCompaRatioVal, {format:compaRatioFormat, locale:locale});
			newCompaRatio.metadata().sortValue = newCompaRatioVal;
		}

	}

	newAmount = $.formatNumber(newAmount, {format:getAmountFormat(currency), decimalToRound:0, locale:locale});
	var amountElem = $("#" + tab + "_body_td_" + pernr + '_' + eh.map.amount);
	var amountElemSpan = $("#" + tab + "_span_" + pernr + '_' + eh.map.amount);
	if(amountElemSpan.length == 0)
		amountElem.html(newAmount.toString() + ((eh.map.appendCurrency)? " " + currency:""));
	else
		amountElemSpan.html(newAmount.toString() + ((eh.map.appendCurrency)? " " + currency:""));
	newAmount = $.parseNumber(newAmount, {format:getAmountFormat(currency), locale:locale});
	$("#" + tab + "_body_td_" + pernr + '_' + eh.map.amount).metadata().sortValue = newAmount;

	$("#" + tab + "_body_td_" + pernr + '_' + id).metadata().sortValue = number;

	if(eh.map.validateGuidelines)
		validateGuidelines(tab, pernr, id, number, eh);

	$(obj).removeAttr('updatedSummary')

	$('#' + tab + "_data").trigger("update");

	//call synch is a variable used to put a lock on calling over and over the synch call.
	if(eh.map.synchToPlan && synchInProgress[eh.map.synchToPlan + '_' + lconst.SYNCH_PERF_FACT_LOCK] == null)
	{
		if($('#' + eh.map.synchToPlan + '_data').length > 0 || pernr == "all")
		{
			if(!$('#' + eh.map.synchToPlan + '_body_td_input_' + pernr + '_' + id).attr('disabled'))
			{
				//alert("Synching tab pernr: " + pernr + "    id: " + id + " to plan " + eh.map.synchToPlan + "      " + $('#' + eh.map.synchToPlan + '_body_td_input_' + pernr + '_' + id).attr('disabled'))
				if(ECM_DEBUG)$.log ("Synching tab " + id + " to plan " + eh.map.synchToPlan);
				synchInProgress[tab + '_' + lconst.SYNCH_PERF_FACT_LOCK] = "";
				$('#' + eh.map.synchToPlan + '_body_td_input_' + pernr + '_' + id).trigger('focus').val(obj.value).trigger('blur').trigger('change');
			}
		}
	}
	else
		synchInProgress[eh.map.synchToPlan + '_' + lconst.SYNCH_PERF_FACT_LOCK] = null;

	//if(pernr == 'all')
	//	$.fancybox.resize();

	if(ECM_DEBUG)$.log ("END updatePct");
}

function processNewBaseSalary(tab, pernr, id, obj) {
	if(ECM_DEBUG)$.log ("START processNewBaseSalary: tab: " + tab + " pernr: " + pernr + " id: " + id );

	var empData = planList[tab].data[pernr];
	var eh = getEventHandler(tab, id);

	if(!IsNumeric(obj.value) || obj.value == "")
	{
		//obj.value = obj.prevValue;
		return;
	}

	$(obj).attr('changed', 'true')
	var currency = defaultCurrency;
	if(empData[eh.map.currency] != null)
		currency = empData[eh.map.currency].rawData;

	$(obj).parseNumber({format:getAmountFormat(currency), locale:locale});
	$(obj).formatNumber({format:getAmountFormat(currency), locale:locale});

	//call one more time to get proper format
	var newBasePay = $(obj).parseNumber({format:getAmountFormat(currency), locale:locale}, false);
	var basePay = parseFloat(empData[eh.map.basePay].rawData);
	var deltaBasePay = newBasePay - basePay;
	var oldBasePay = $('#' + tab + '_body_td_' + pernr + '_' + id).metadata().sortValue;

	var pct = (deltaBasePay / basePay) * 100;

	var isInitial = false;
	if($(obj).parent().attr('initial') == "true") {
		isInitial = true;
		oldBasePay = 0;
	}

	$(obj).parent().attr('initial', 'false');
	//backup in prevValue
	$(obj).attr('prevValue', $(obj).val());

	$('#' + tab + '_body_td_' + pernr + '_' + id).metadata().sortValue = newBasePay;
	$('#' + tab + '_body_td_' + pernr + '_' + id).attr('rawData','{sortValue:' + newBasePay + '}');

	var newBasePayPct = $('#' + tab + '_body_td_' + pernr + '_' + eh.map.newBasePayPct);

	newBasePayPct.metadata().sortValue = $.parseNumber($.formatNumber(pct, {format:pctFormat, locale:locale}), {format:pctFormat, locale:locale});
	newBasePayPct.attr('rawData','{sortValue:' + $.parseNumber($.formatNumber(pct, {format:pctFormat, locale:locale}), {format:pctFormat, locale:locale}) + '}');

	newBasePayPct.attr('initial', 'false');
	pct = $.formatNumber(pct, {format:pctFormat, locale:locale});
	newBasePayPct.html(pct.toString());




	var newBasePayDelta = $('#' + tab + '_body_td_' + pernr + '_' + eh.map.newBasePayDelta);

	newBasePayDelta.metadata().sortValue = $.parseNumber($.formatNumber(deltaBasePay, {format:getAmountFormat(currency), locale:locale}), {format:getAmountFormat(currency), locale:locale});
	newBasePayDelta.attr('rawData','{sortValue:' + $.parseNumber($.formatNumber(deltaBasePay, {format:getAmountFormat(currency), locale:locale}), {format:getAmountFormat(currency), locale:locale}) + '}');

	newBasePayDelta.attr('initial', 'false');
	deltaBasePay = $.formatNumber(deltaBasePay, {format:getAmountFormat(currency), locale:locale});
	newBasePayDelta.html(deltaBasePay.toString());


	if(eh.map.updateSummary)
	{
		var summaryTab = tab;
		var summaryPernr  = pernr;
		if(eh.map.updateSummaryTab != null)
		{
			summaryTab = eh.map.updateSummaryTab;
			//summaryPernr = $('#ipPernr').html();
		}
		updateSummary(summaryTab, summaryPernr, id, obj, basePay, currency, ((isInitial)?oldBasePay:oldBasePay - basePay), newBasePay - basePay, isInitial, false);
		verifyBudgetSummaryExceeded();
	}



	if(ECM_DEBUG)$.log ("END processNewBaseSalary");

	$('#' + tab + "_data").trigger("update");
}

function processTotalComp(tab, pernr, id, obj)
{
	if(ECM_DEBUG)$.log ("START processTotalComp: tab: " + tab + " pernr: " + pernr + " id: " + id );

	$('#' + tab + '_img_guar_' +pernr + "_" + id).hide();
	var empData = planList[tab].data[pernr];
	var eh = getEventHandler(tab, id);

	if(!IsNumeric(obj.value) || obj.value == "")
	{
		return;
	}

	$(obj).attr('changed', 'true')
	var currency = defaultCurrency;
	if(empData[eh.map.currency] != null)
		currency = empData[eh.map.currency].rawData;

	$(obj).parseNumber({format:getAmountFormat(currency), locale:locale});
	$(obj).formatNumber({format:getAmountFormat(currency), locale:locale});

	//call one more time to get proper format
	var number = $(obj).parseNumber({format:getAmountFormat(currency), locale:locale}, false);
	var oldNumber = $('#' + tab + '_body_td_' + pernr + '_' + id).metadata().sortValue;

	var basePay = parseFloat(empData[eh.map.basePay].rawData);
	//number += basePay;

	var cash = $('#' + tab + '_span_' + pernr + '_' + eh.map.cash);
	var lti = $('#' + tab + '_span_' + pernr + '_' + eh.map.lti);


	var cashTd = $('#' + tab + '_body_td_' + pernr + '_' + eh.map.cash);
	var ltiTd = $('#' + tab + '_body_td_' + pernr + '_' + eh.map.lti);

	var slt = empData[eh.map.slt].rawData;
	var cashG = parseFloat(empData[eh.map.cashG].rawData);
	var ltiG = parseFloat(empData[eh.map.ltiG].rawData);
	var cashT = parseFloat(empData[eh.map.cashT].rawData);
	var ltiT = parseFloat(empData[eh.map.ltiT].rawData);
	if(cashG != 0 || ltiG != 0)
		if(number < (cashG + ltiG)) {

			if($(obj).attr('prevValue') == "")
				$(obj).val(langMap.planSheet_planDataInitial);
			else
				$(obj).val($.formatNumber($(obj).attr('prevValue'), {format:getAmountFormat(currency), locale:locale}));
			$('#' + tab + '_img_guar_' +pernr + "_" + id).show();
			return;
		}
	
	if(cashT != 0 || ltiT != 0)
		if(number < (cashT + ltiT)) {

			$('#' + tab + '_img_guar_' +pernr + "_" + id).show();
			//return;
		}

	//backup in prevValue
	var isInitial = false;
	if($(obj).parent().attr('initial') == "true")
		isInitial = true;

	$(obj).parent().attr('initial', 'false');
	//backup in prevValue
	$(obj).attr('prevValue', $(obj).parseNumber({format:getAmountFormat(currency), locale:locale}, false));

	$('#' + tab + '_body_td_' + pernr + '_' + id).metadata().sortValue = number;
	$('#' + tab + '_body_td_' + pernr + '_' + id).attr('rawData','{sortValue:' + number + '}');


	var cashAmount = 0;
	var ltiAmount = 0;
	if(slt == '1')
	{
		cashAmount = (number) / 2;
		ltiAmount = (number) / 2;

	}
	else
	{
		ltiAmount = computeNonSltLtiAmount(number + basePay);
		if(ltiAmount > number)
			ltiAmount = number;

		cashAmount = number - ltiAmount;
		if(cashAmount < 0)
			cashAmount = 0;

		// if lti is less than 10k, move it to cash
		if(ltiAmount <= 10000)
		{
			cashAmount += ltiAmount;
			ltiAmount = 0;
		}else if(ltiAmount > 10000){
			if(ltiAmount > (number) / 2){
				ltiAmount = (number) / 2;
				cashAmount = number - ltiAmount;
			}
		}
	}

	if(cashAmount < cashG)
	{
		var diff = cashG - cashAmount;
		cashAmount = cashG;
		ltiAmount -= diff;
	}

	if(ltiAmount < ltiG)
	{
		var diff = ltiG - ltiAmount;
		ltiAmount = ltiG;
		cashAmount -= diff;
	}
	
	if(cashAmount < cashT)
	{
		var diff = cashT - cashAmount;
		cashAmount = cashT;
		ltiAmount -= diff;
	}

	if(ltiAmount < ltiT)
	{
		var diff = ltiT - ltiAmount;
		ltiAmount = ltiT;
		cashAmount -= diff;
	}


	//update the pct column

	var thisYearTotalComp = $('#' + tab + '_body_td_' + pernr + '_' + eh.map.thisYearTotalComp);
	thisYearTotalComp.metadata().sortValue = $.parseNumber($.formatNumber(number + basePay, {format:getAmountFormat(currency), locale:locale}), {format:pctFormat, locale:locale});
	thisYearTotalComp.attr('rawData','{sortValue:' + $.parseNumber($.formatNumber(number + basePay, {format:getAmountFormat(currency), locale:locale}), {format:pctFormat, locale:locale}) + '}');

	thisYearTotalComp.attr('initial', 'false');
	thisYearTotalComp.html($.formatNumber(number + basePay, {format:getAmountFormat(currency), locale:locale}).toString());

	var totalCompPct = $('#' + tab + '_body_td_' + pernr + '_' + eh.map.totalCompPct);
	var prevYearTotalComp = parseFloat(empData[eh.map.prevYearTotalComp].rawData,10);

	if(prevYearTotalComp != -1) {
		var pct = 100;
		if(prevYearTotalComp != 0)
			pct = ((number - prevYearTotalComp) / prevYearTotalComp) * 100;
	
		totalCompPct.metadata().sortValue = $.parseNumber($.formatNumber(pct, {format:pctFormat, locale:locale}), {format:pctFormat, locale:locale});
		totalCompPct.attr('rawData','{sortValue:' + $.parseNumber($.formatNumber(pct, {format:pctFormat, locale:locale}), {format:pctFormat, locale:locale}) + '}');
	
		totalCompPct.attr('initial', 'false');
		pct = $.formatNumber(pct, {format:pctFormat, locale:locale});
		totalCompPct.html(pct.toString());
	}
	else
	{
		totalCompPct.attr('initial', 'false');
	}

	cashTd.metadata().sortValue = cashAmount;
	cashTd.attr('rawData','{sortValue:' + cashAmount + '}');

	cashTd.attr('initial', 'false');
	cashAmount = $.formatNumber(cashAmount, {format:getAmountFormat(currency), locale:locale});
	cash.html(cashAmount.toString() + ((eh.map.appendCurrency)? " " + currency:""));

	ltiTd.metadata().sortValue = ltiAmount;
	ltiTd.attr('rawData','{sortValue:' + ltiAmount + '}');

	ltiTd.attr('initial', 'false');
	ltiAmount = $.formatNumber(ltiAmount, {format:getAmountFormat(currency), locale:locale});
	lti.html(ltiAmount.toString() + ((eh.map.appendCurrency)? " " + currency:""));


	if(eh.map.updateSummary)
	{
		var summaryTab = tab;
		var summaryPernr  = pernr;
		if(eh.map.updateSummaryTab != null)
		{
			summaryTab = eh.map.updateSummaryTab;
			//summaryPernr = $('#ipPernr').html();
		}
		if(oldNumber == -1)
			oldNumber = 0;
		updateSummary(summaryTab, summaryPernr, id, obj, basePay, currency, oldNumber, number, isInitial, false);
		verifyBudgetSummaryExceeded();
	}

	if(ECM_DEBUG)$.log ("END processTotalComp");

	$('#' + tab + "_data").trigger("update");
}

function computeNonSltLtiAmount(totalComp)
{
	var ltiAmountTable = [
   		{ start: 0, end: 150000, pct: 0 },
   		{ start: 150000, end: 250000, pct: 0.20 },
   		{ start: 250000, end: 500000, pct: 0.30 },
   		{ start: 500000, end: 750000, pct: 0.32 },
   		{ start: 750000, end: 1000000, pct: 0.35 },
   		{ start: 1000000, end: 2000000, pct: 0.42 },
   		{ start: 2000000, end: 99999999999999, pct: 0.50 }
   	];
	var amount = 0;

	for(var i=0; i<ltiAmountTable.length; i++)
	{
		var ltiStep = ltiAmountTable[i];
		var range = ltiStep.end - ltiStep.start;
		var delta = range;

		if(totalComp < delta)
			delta = totalComp;

		amount += delta * ltiStep.pct;

		if(delta < 0)
			break;
		totalComp -= delta;
	}

	return amount;
}
*/
function updateCol(tab, pernr, id, obj)
{
	if(ECM_DEBUG)$.log ("START updateCol: tab: " + tab + " pernr: " + pernr + " id: " + id );

	var ch = getColumnHandler(tab, id);
	var associate = getAssociate(tab, pernr);
	var colData = getColData(tab, pernr, id)
	var revertInit = false
	if(!IsNumeric(obj.value) || obj.value == "")
	{
		var prevVal = $(obj).attr("prevValue");
		$(obj).val(prevVal);
		if(prevVal == "")
			revertInit = true;
		//return;
	}

	var number;
	if(!revertInit) {
		
		if(ch.type == "PCT") {
			var rule = getRoundingRules('pct', ch.rounding, ch.reviewItemId);
			
			$(obj).parseNumber({format:getAmountFormat('pct', ch.decimals, ch.trailZero), roundRule:rule, locale:locale});
			$(obj).formatNumber({format:getAmountFormat('pct', ch.decimals, ch.trailZero), roundRule:rule, locale:locale});
		
			//call one more time to get proper format
			number = $(obj).parseNumber({format:getAmountFormat('pct', ch.decimals, ch.trailZero), roundRule:rule, locale:locale}, false);
		
			if(number > 999)
			{
				var prevVal = $(obj).attr("prevValue");
				$(obj).val(prevVal);
				return;
			}
		} else if(ch.type == "AMT" || ch.type == "DLT") {
			
			var currency = defaultCurrency;
			if(associate.currency != null && associate.currency != "")
				currency = associate.currency;
			if(colData.currency != null && colData.currency != "")
				currency = colData.currency;		
			var rule = getRoundingRules(currency, ch.rounding, ch.reviewItemId);
			$(obj).parseNumber({format:getAmountFormat(currency, ch.decimals, ch.trailZero), roundRule:rule, locale:locale});
			$(obj).formatNumber({format:getAmountFormat(currency, ch.decimals, ch.trailZero), roundRule:rule, locale:locale});
		
			//call one more time to get proper format
			number = $(obj).parseNumber({format:getAmountFormat(currency, ch.decimals, ch.trailZero), roundRule:rule, locale:locale}, false);
		}
		
		//backup in prevValue
		/*var isInitial = false;
		if(obj.prevValue == "")
			isInitial = true;*/
	
		//obj.prevValue = obj.value;
	} else {
		number = -1;
	}
	
	$('#' + tab + '_body_td_' + pernr + '_' + id).metadata().sortValue = number;
	$('#' + tab + '_body_td_' + pernr + '_' + id).attr('initial', 'false');
	if(revertInit) 
		$('#' + tab + '_body_td_' + pernr + '_' + id).attr('initial', 'true');	
	
	if(ch.oogType == "1")
		validateGuidelines(tab, pernr, id, number, ch, revertInit);
	
	$('#' + tab + "_data").trigger("updateCache");

	//$('#' + tab + '_body_td_input_' + pernr + '_' + id).trigger('blur')
	advertiseColumnUpdate(tab, pernr, id, revertInit);
	
	/*var jFocus = $(":focusable"); 
	var jInputElem = $('#' + tab + '_body_td_input_' + pernr + '_' + id);
	var jFocusIndex = jFocus.index(jInputElem);
	if( jFocus != undefined && jFocusIndex != -1) {
		var jFocusNext = jFocus.eq(jFocusIndex+1);
		if (jFocusNext != undefined)
			jFocusNext.focus();
	}*/
	if(ECM_DEBUG)$.log ("END updateCol");
}

function advertiseColumnUpdate(tab, pernr, id, revertInit) {
	var c = getColumns(tab);
	if(c)
		for(var col in c.cols) {
			$('#' + tab + "_body_td_" + pernr + "_" + col).trigger('update.' + id, [revertInit]);
		}
}

function updateSummary(tab, pernr, id, cur, oldAmount, amount, isInitial, updateSummaryFromInd, revertInit)
{
	if(ECM_DEBUG)$.log ("START updateSummary: tab: " + tab + " pernr: " + pernr + " id: " + id + " currency: " + cur + " oldAmount: " + oldAmount + " amount: " + amount);

	var bud = budgetSummary[tab];
	var budUser = budgetSummaryUser[tab];
	
	//if not found return.
	if(bud == null || budUser == null)
		return;

	if(cur != defaultCurrency)
	{
		
		//var rule = getRoundingRules(bud.currency, null, bud.reviewItemId);

		var rule = getRoundingRules(bud.currency, null, bud.reviewItemId);
		
		var conv = currency[cur].exchangeRatetoUSD;
		if(ECM_DEBUG)$.log ("currency not usd converting using rate: " + cur + " " + conv);

		oldAmount = oldAmount * conv;
		if(ECM_DEBUG)$.log ("oldAmount: " + oldAmount);
		oldAmount =	$.formatNumber(oldAmount, {format:budgetFormat,locale:locale, nanForceZero: false});
		oldAmount =	$.parseNumber(oldAmount, {format:budgetFormat,locale:locale, nanForceZero: false});
		if(ECM_DEBUG)$.log ("oldAmount: " + oldAmount);

		amount = amount * conv;
		if(ECM_DEBUG)$.log ("amount: " + amount);
		amount = $.formatNumber(amount, {format:budgetFormat,locale:locale, nanForceZero: false});
		amount = $.parseNumber(amount, {format:budgetFormat,locale:locale, nanForceZero: false});
		if(ECM_DEBUG)$.log ("amount: " + amount);
	}

	if(ECM_DEBUG)$.log ("oldAmount: " + oldAmount);
	if(ECM_DEBUG)$.log ("amount: " + amount);
	if(ECM_DEBUG)$.log ("bud.spent: " + bud.spent);
	var delta = parseFloat(amount) - parseFloat(oldAmount);

	if(revertInit)
		delta = parseFloat(oldAmount) * -1;
	
	//create delta summary calc
	if($("#" + tab + "_body_td_input_" + pernr + '_' + id).attr('updatedSummary') != 'true')
	if(!updateSummaryFromInd)
	{
		if(!budgetSummaryDelta[tab + "," + pernr] )
		{
			budgetSummaryDelta[tab + "," + pernr] = {};
			budgetSummaryDelta[tab + "," + pernr].spent = 0;
			budgetSummaryDelta[tab + "," + pernr].available = 0;
			budgetSummaryDelta[tab + "," + pernr].numNotPlanned = 0;
			budgetSummaryDelta[tab + "," + pernr].numPlanned = 0;
		}
	}
	else
	{
		if(!budgetSummaryIndDelta[tab + "," + pernr])
		{
			budgetSummaryIndDelta[tab + "," + pernr] = {};
			budgetSummaryIndDelta[tab + "," + pernr].spent = 0;
			budgetSummaryIndDelta[tab + "," + pernr].available = 0;
			budgetSummaryIndDelta[tab + "," + pernr].numNotPlanned = 0;
			budgetSummaryIndDelta[tab + "," + pernr].numPlanned = 0;
		}
	}
	var budd = null;

	if(!updateSummaryFromInd)
		budd = budgetSummaryDelta[tab + "," + pernr];
	else
		budd = budgetSummaryIndDelta[tab + "," + pernr];


	if(revertInit) {
		bud.status.numNotPlanned += 1;
		bud.status.entireNumNotPlanned += 1;
		
		budUser.status.numNotPlanned += 1;
		budUser.status.entireNumNotPlanned += 1;
		
		budd.numNotPlanned += 1;

		bud.status.numPlanned -= 1;
		bud.status.entireNumPlanned -= 1;
		
		budUser.status.numPlanned -= 1;
		budUser.status.entireNumPlanned -= 1;
		
		budd.numPlanned -= 1;	
	} else if(isInitial || isInitial == "true")
	{
		bud.status.numNotPlanned -= 1;
		bud.status.entireNumNotPlanned -= 1;
		
		budUser.status.numNotPlanned -= 1;
		budUser.status.entireNumNotPlanned -= 1;
		
		budd.numNotPlanned -= 1;

		bud.status.numPlanned += 1;
		bud.status.entireNumPlanned += 1;
		
		budUser.status.numPlanned += 1;
		budUser.status.entireNumPlanned += 1;
		
		budd.numPlanned += 1;
	}


	bud.spent += delta;
	bud.entireSpent += delta;
	
	budUser.spent += delta;
	budUser.entireSpent += delta;	
	
	budd.spent += delta;
	if(ECM_DEBUG)$.log ("new bud.spent: " + bud.spent);

	bud.available -= delta;
	bud.entireAvailable -= delta;
	
	budUser.available -= delta;
	budUser.entireAvailable -= delta;	
	
	budd.available -= delta;
	if(ECM_DEBUG)$.log ("new bud.available: " + bud.available);
	if(ECM_DEBUG)$.log ("new bud.available: " + budUser.available);
	
	
	if(!restrictDrawing)
	{
		$('#budgetPlan_' + tab).html(getPlanSummaryDetails(bud, 'budgetSummary'));
		getBudgetSummaryChart(bud, 'budgetSummary' + bud.planId);
		
		$('#budgetPlanEntire_' + tab).html(getPlanSummaryDetails(bud, 'budgetSummaryEntire', true));
		getBudgetSummaryChart(bud, 'budgetSummaryEntire' + bud.planId, true);
		
		$('#budgetPlanUserEntire_' + tab).html(getPlanSummaryDetails(budUser, 'budgetSummaryUserEntire', true));
		getBudgetSummaryChart(budUser, 'budgetSummaryUserEntire' + budUser.planId, true);
		
		//wrapDiv('budgetSummary=' + tab, -50, -10, 180, 100);
	}
	if(ECM_DEBUG)$.log ("END updateSummary");
}

function validateGuidelines(tab, pernr, id, pct, ch, revertInit)
{
	if(ECM_DEBUG)$.log ("START validateGuidelines: tab: " + tab + " pernr: " + pernr + " id: " + id + " pct: " + pct);
	//var guidelinesStr = $('#' + tab + '_guideline_' + pernr + '_' + eh.map.guidelineColumn).html();
	//var guidelines = guidelinesStr.split(',');
	var colData = getColData(tab, pernr, id);
	var guidelines = [colData.outOfGuideline.min, colData.outOfGuideline.max];

	//if(ECM_DEBUG)$.log ('guideline: ' + '#' + tab + '_guideline_' + pernr + '_' + eh.map.guidelineColumn + '       val: ' + guidelinesStr);

	var selectG = $('#' + tab + "_select_guideline_" + pernr + "_" + id);
	var inputG = $('#' + tab + "_body_td_input_" + pernr + "_" + id);
	var imgG = $('#' + tab + "_img_guideline_" + pernr + "_" + id);
	//copies on the reward summary
	/*var copy = null;
	var copyImg = null;
	var copyPopup = null;*/
	var icon = "";
	var optionText = "";
	var className = "";
	var showHide = "";

	/*if(pernr != "all" && eh != null && eh.map.copyColToSummary)
	{
		copy = $('#' + eh.map.copyTab + '_body_td_' + pernr + '_' + eh.map.copyCol);
		copyImg = $('#' + eh.map.copyTab + "_img_guideline_" + pernr + "_" + eh.map.copyCol);
		copyPopup = $('#' + eh.map.copyTab + "_pop_guideline_" + pernr + "_" + eh.map.copyCol);
	}*/

	if((pct < parseFloat(guidelines[0]) || pct > parseFloat(guidelines[1])) && !revertInit)
	{

		if(selectG.val() == "")
		{
			icon = "icon_warning_on";
			imgG.attr('src',imageBuilder(rp, 'icon_warning_on', postImg, 'gif'));
			/*if(copyImg != null)
				copyImg.attr('src',imageBuilder(rp, 'icon_warning_on', postImg, 'gif'));*/
			inputG.removeClass('err');
			/*if(copy != null)
				copy.removeClass('err');*/
			imgG.show();
			imgG.attr('active','true');
			/*if(copyImg != null)
				copyImg.show();*/

			showHide = 'show';
			//don't want to open only when selection is needed.
			//$('#' + tab + "_img_guideline_" + pernr + "_" + id).trigger('click');
		}
		else
		{
			icon = "icon_warning_off";
			imgG.attr('src',imageBuilder(rp, 'icon_warning_off', postImg, 'gif'));
			/*if(copyImg != null)
				copyImg.attr('src',imageBuilder(rp, 'icon_warning_off', postImg, 'gif'));*/
			inputG.addClass('err');
			/*if(copy != null)
				copy.addClass('err');*/
			imgG.show();
			imgG.attr('active','true');
			/*if(copyImg != null)
				copyImg.show();*/
			showHide = 'show';
			className = "err";
		}

		/*if(inputG.attr('updatedSummary') != 'true')
		{
		//always open the selection box
			if(synchInProgress[eh.map.synchToPlan + '_' + lconst.SYNCH_PERF_FACT_LOCK] != ""  && synchInProgress[eh.map.synchToPlan + '_' + lconst.SYNCH_OUT_REASON_LOCK] != "") //unless it's because of a synch
			*/	$('#' + tab + "_img_guideline_" + pernr + "_" + id).trigger('click');
		//}
	}
	else
	{
		selectG.val("");
		imgG.hide();
		imgG.attr('active','false');
		/*if(copyImg != null)
			copyImg.hide();*/
		inputG.removeClass('err');
		/*if(copy != null)
			copy.removeClass('err');*/
		showHide = 'hide';
		$('#' + tab + "_close_guideline_" + pernr + "_" + id).trigger('click');
	}

	/*if(copyPopup != null)
	{
		copyPopup.html($('#' + tab + "_select_guideline_" + pernr + "_" + id + " option:selected").text());
	}
	else*/
		optionText = $('#' + tab + "_select_guideline_" + pernr + "_" + id + " option:selected").text();

	var selectVal = selectG.val();
	if(selectVal == "")
		selectVal = blankOutOfReason;

	//ind planning screens pass generic pernr get it from the holder
	/*if(pernr == "all")
	{
		pernr = $('#ipPernr').html();

		if(tab == "cr_merit")
			tab = $('#cr_merit_body_td_all_planId').html();
		else if(tab == "cr_ai")
			tab = $('#cr_ai_body_td_all_planId').html();
		else if(tab == "cr_lti")
			tab = $('#cr_lti_body_td_all_planId').html();
		else if(tab == "cr_lai")
			tab = $('#cr_lai_body_td_all_planId').html();

		indPlanChanges[tab + "," + pernr] = tab + "," + pernr + "," + pct + "," + selectVal + "," + showHide + "," + eh.map.colId + ((eh.map.copyColToSummary)?"," + eh.map.copyTab + "," + eh.map.copyCol + "," + optionText + "," + icon + "," + className + "," + eh.map.statusCol:"");

		if(!validateEntries(indPlanChanges))
		{
			$('#indWarningOut').show();
			$('#warningOutP3').show();
			$('#saveExitIndBttn').removeClass('bttn').addClass('bttn_disabled');
			$('#saveIndBttn').removeClass('bttn').addClass('bttn_disabled');
			$('#okP3').removeClass('bttn_priority').addClass('bttn_disabled');

		}
		else
		{
			$('#indWarningOut').hide();
			$('#warningOutP3').hide();
			$('#saveExitIndBttn').removeClass('bttn_disabled').addClass('bttn');
			$('#saveIndBttn').removeClass('bttn_disabled').addClass('bttn');
			$('#okP3').removeClass('bttn_disabled').addClass('bttn_priority');
		}


		if(ECM_DEBUG)$.log ("Added " + indPlanChanges[tab + "," + pernr] + " to indPlanChanges for saving");
	}
	else
	{*/
		//if it has been saved already from the ind planner do not add back to the planning sheet as data to be saved only display
		if($("#" + tab + "_body_td_input_" + pernr + '_' + id).attr('updatedSummary') != 'true') {
			var oog = "";
			var out = false;
			var imgElem = $("#" + tab + "_img_guideline_" + pernr + "_" + id);
			if(imgElem.length) {
				if(imgElem.attr("active") == "true") {
					out = true;
					oog = $("#" + tab + "_select_guideline_" + pernr + "_" + id).val();
					if(oog == "")
						oog = "-1";
				}
			}			
			planChanges[tab + "," + pernr] = tab + "," + pernr + "," + pct + "," + oog + "," + ((out)?"show":"hide");
		}
		else
			planChanges[tab + "," + pernr] = null;

		if(!validateEntries(planChanges))
		{
			$('#submitRecoBttn').removeClass('bttn_priority').addClass('bttn_disabled');
			$('#saveRecoBttn').removeClass('bttn').addClass('bttn_disabled');
			$('#okP3').removeClass('bttn_priority').addClass('bttn_disabled');
			$('#yesExit').removeClass('bttn_priority').addClass('bttn_disabled');

			$('#warningOut').show();
			$('#warningOutExit').show();
			$('#warningOutP3').show();
		}
		else
		{
			$('#submitRecoBttn').removeClass('bttn_disabled').addClass('bttn_priority');
			$('#saveRecoBttn').removeClass('bttn_disabled').addClass('bttn');
			$('#okP3').removeClass('bttn_disabled').addClass('bttn_priority');
			$('#yesExit').removeClass('bttn_disabled').addClass('bttn_priority');

			$('#warningOut').hide();
			$('#warningOutExit').hide();
			$('#warningOutP3').hide();
		}
		if(ECM_DEBUG)$.log ("Added " + planChanges[tab + "," + pernr] + " to planChanges for saving");
	/*}*/



	if(ECM_DEBUG)$.log ("END validateGuidelines");
}


function validateEntries(obj)
{
	for(var i in obj)
	{
		if(obj[i] != null)
		{
			var planElems = obj[i].split(',');	
			var tab = planElems[0];
			var pernr = planElems[1];
			var val = planElems[2];
			var reason = planElems[3];
			var showHide = planElems[4];	
			
			if(showHide == "show" && reason == "-1")
				return false;
		}
	}
	
	return true;
}

/************ out of guideline handlers ********************/


function setGuidelinesPopup(tab, pernr, id, data, colData, plan, associate)
{
	if(ECM_DEBUG)$.log ("START setGuidelinesPopup: tab: " + tab + " pernr: " + pernr + " id: " + id );
	var tableBody = [];
	var ch = getColumnHandler(tab, id);
	var tpop = [];

	tableBody.push('<img ' + ((colData.outOfGuideline.out)?'active="true"':'active="false"') + ' style="display:' + ((colData.outOfGuideline.out)?'':'none') + '" border="0" id="' + tab + "_img_guideline_" + pernr + "_" + id  + '" src="' + imageBuilder(rp, ((colData.outOfGuideline.out && colData.outOfGuideline.reason == "")?'icon_warning_on':'icon_warning_off'), postImg, 'gif') + '" />\n');

	tpop.push('<div id="' + tab + "_pop_guideline_" + pernr + "_" + id  + '" style="display:none;">' +
			  '<div class="float_right">');

	//if(tab != "0RSM")
		tpop.push('<a class="bttn_small" id="' + tab + "_close_guideline_" + pernr + "_" + id  + '" href="#"><span>' + langMap.popup_close + '</span></a>');

	tpop.push('</div>');

	//if(tab != "0RSM")
	//{
	tpop.push('<p class="label">' + langMap.planSheet_outOfGuidelineTitle + '</p>');
	tpop.push('	  <p class="shade_ccc">' + langMap.planSheet_outOfGuidelineDesc + '</p>');
	tpop.push('		<p> ');

	tpop.push('			<select ' + ((!canEditSheet || !colData.eligible || !colData.editable)?"disabled":"" ) + ' id="' + tab + "_select_guideline_" + pernr + "_" + id  + '">');

									tpop.push('<option value="">' + langMap.indPlan_guideLineSelect + '</option>');
									var guidelineReasons = plan.guidelines;
									for(var x = 0; x < guidelineReasons.length; x++)
									{
										var indGuide = guidelineReasons[x];
										if(ch.reviewItemId == indGuide.reviewItemId)
											tpop.push('<option value="' + indGuide.value + '" ' + ((indGuide.value == colData.outOfGuideline.reason)?'selected':'') + '>' + indGuide.name + '</option>');
									}

	tpop.push('			</select>');
	//}
	//else
	//	tpop.push(colData.outOfGuideline.text);

	tpop.push('		</p></div>\n');

	if(ECM_DEBUG)$.log ("Table built: " + tpop.join('') );

	$('#btholder').append(tpop.join(''));

	if(ECM_DEBUG)$.log ("END setGuidelinesPopup");
	return {
		content:tableBody.join(''),
		params: {tab:tab, pernr:pernr, id:id, colData:colData, ch:ch},
		postLoad:
			function(params)
				{

					$('#' + tab + "_select_guideline_" + pernr + "_" + id ).unbind('change.event');
					$('#' + tab + "_select_guideline_" + pernr + "_" + id ).bind('change.event',params,
							function(event){
								var params = event.data;
								var pct = $("#" + params.tab + "_body_td_" + params.pernr + '_' + params.id).metadata().sortValue;
								validateGuidelines(params.tab, params.pernr, params.id, pct, params.ch, false);
								//call synch is a variable used to put a lock on calling over and over the synch call.

								//$("#" + params.tab + "_close_guideline_" + params.pernr + "_" + params.id).trigger('click');
							});


					var inputBox = 	$('#' + params.tab + "_body_td_input_" + params.pernr + "_" + params.id);
					var textBox = 	$('#' + params.tab + "_body_td_" + params.pernr + "_" + params.id);

					if(inputBox.length > 0 && params.colData.outOfGuideline.out && params.colData.outOfGuideline.reason != "")
						inputBox.addClass('err');

					if(textBox.length > 0 && params.colData.outOfGuideline.out && params.colData.outOfGuideline.reason != "")
						textBox.addClass('err');

					$('#' + tab + "_img_guideline_" + pernr + "_" + id ).unbind('mouseover.event');
					$('#' + tab + "_img_guideline_" + pernr + "_" + id ).bind('mouseover.event', params, processPopBubble);
					$('#' + tab + "_body_td_input_" + pernr + "_" + id ).unbind('focus.event');
					$('#' + tab + "_body_td_input_" + pernr + "_" + id ).bind('focus.event', params, processPopBubble);
				}
		};

}


function processPopBubble(event){
	var params = event.data;
	//verify existence of tooltip
	if( $('table.bubbletip #' + params.tab + "_pop_guideline_" + params.pernr + "_" + params.id).length == 0)
	{

		var direction = "top";
		/*if(params.eh != null)
			if(params.eh.map != null)
				if(params.eh.map.popDirection != null)
					direction = params.eh.map.popDirection;*/

		$('#' + params.tab + "_img_guideline_" + params.pernr + "_" + params.id)
			.bubbletip(
						$('#' + params.tab + "_pop_guideline_" + params.pernr + "_" + params.id)
						,{	delayShow: delayShowOnMouseOver,
							delayHide: 0,
							calculateOnShow: true,
							bindShow: 'click',
							bindHide: 'click',
							hideElements: ['#fancybox-close','a[pernrClick]','li[itab]','li[tab]','#' + params.tab + "_close_guideline_" + params.pernr + "_" + params.id],
							deltaDirection: direction
						}
		)
		//ie 11 overlap 
		$('#' + params.tab + "_pop_guideline_" + params.pernr + "_" + params.id).parent().parent().parent().parent().attr('style','width:26%');

		if(event.type == 'click')
			$('#' + params.tab + "_img_guideline_" + params.pernr + "_" + params.id ).trigger('click');
	}
}
/*
function processPopRatingBubble(event){
	var params = event.data;
	//verify existence of tooltip
	if( $('table.bubbletip #' + params.tab + "_pop_potential_" + params.pernr + "_" + params.id).length == 0)
	{
		$('#' + params.tab + "_potential_rating_trigger_" + params.pernr + "_" + params.id)
			.bubbletip(
						$('#' + params.tab + "_pop_potential_" + params.pernr + "_" + params.id)
						,{	delayShow: ((params.tab != "0RSM")?0:delayShowOnMouseOver),
							delayHide: 0,
							calculateOnShow: true,
							bindShow: ((params.tab != "0RSM")?'click':'mouseover'),
							bindHide: ((params.tab != "0RSM")?'click':'mouseout'),
							hideElements: ['#fancybox-close','a[pernrClick]','li[itab]','li[tab]','#' + params.tab + "_close_potential_" + params.pernr + "_" + params.id]
						}
		)

		if(event.type == ((params.tab != "0RSM")?'click':'mouseover'))
			$('#' + params.tab + "_potential_rating_trigger_" + params.pernr + "_" + params.id ).trigger(((params.tab != "0RSM")?'click':'mouseover'));
	}
}
*/
function verifyWorksheetSubmit() {

	if(!pageLoaded) {
		showError(langMap.page_not_loaded, 'page-error-cntr');
		return false;
	}
	
	$('#warningOut').hide();
	$('#warningOutInit').hide();
	
	$('#warningOut').hide();
	$('#warningOutInit').hide();
	$('#save_alert').hide();
	$('#error_list_P').hide();

	var proceed = true;
	
	$.each( $('td[saveable="true"]'), function(){
		var obj = $(this);
		var pernr = obj.attr('pernr');
		var planId = obj.attr('planId');
		var isInitial = false;
		var eligible = false;

		if(obj.attr('initial') == "true")
			isInitial = true;
		
		if($('input:not([disabled])[planId="' + planId + '"][pernr="' + pernr + '"]').length)
			eligible = true;
		

		if(!isInitial && eligible) {
			var value = obj.metadata().sortValue;
			var pernr = obj.attr("pernr");
			var tab = obj.attr("tab");
			var col = obj.attr("col");

			var oog = "";
			var imgElem = $("#" + tab + "_img_guideline_" + pernr + "_" + col);
			if(imgElem.length) {
				if(imgElem.attr("active") == "true") {
					oog = $("#" + tab + "_select_guideline_" + pernr + "_" + col).val();
					if(oog == "") {
						$('#warningOut').show();
						proceed = false;
						return;
					}
				}
			}

		} else if(isInitial && eligible) {
			$('#warningOutInit').show();
			proceed = false;
			return;
		}

	 });
	
	/*if($('tr:not(.dis) td[saveable="true"][initial="true"]').length)
		$('#warningOutInit').show();
	else {
		$('#warningOutInit').hide();*/
	if(proceed) {
		if(pendingCount!='0')
			submitAllRecomendations();
		else
			submitRecomendations();
	}
	//}
}

function submitRecomendations(){
	
	bootbox.dialog({
		message: submitTrigger, 
		title: lang.js_submitReco_message,
		buttons: {
			success: {
			    "label" :  langMap.worksheet_submit,
			    "class" : "btn-success",
			    "callback": function() {
			    	saveWorksheet(true, 2);
		    	}
			},
			danger: {
				"label" :  langMap.worksheet_cancel,
			    "class" : " btn",
			    "callback": function() {
			    	$("#review_submit").modal('hide');
			    }	
			}
		}
	});
}

function submitAllRecomendations(){
	
	bootbox.dialog({
		message: submitAllTrigger, 
		title: lang.js_submitReco_message,
		buttons: {
			danger: {
				"label" :  langMap.worksheet_cancel,
			    "class" : " btn",
			    "callback": function() {
			    	$("#review_submit").modal('hide');
			    }	
			}
		}
	});	
}

function saveWorksheet(submitForm, status) {

	if(!pageLoaded) {
		showError(langMap.page_not_loaded, 'page-error-cntr');
		return false;
	}
	
	var planData = new Object();
	$('#warningOut').hide();
	$('#warningOutInit').hide();
	$('#save_alert').hide();
	$('#error_list_P').hide();

	$.each( $('td[saveable="true"]'), function(){
		var obj = $(this);
		var pernr = obj.attr('pernr');
		var planId = obj.attr('planId');
		//if(!obj.parent().hasClass('dis')) { //if record is not disabled process all the saveable columns
			var isInitial = false;
			var eligible = false;
			/*if(obj.find(':input').length) {
				if($(obj.find(':input')[0]).attr("prevValue") == "")
					isInitial = true;
			}
			else
			{*/
				if(obj.attr('initial') == "true")
					isInitial = true;
				
				if($('input:not([disabled])[planId="' + planId + '"][pernr="' + pernr + '"]').length)
					eligible = true;
			/*}*/

			if(!isInitial && eligible) {
				var value = obj.metadata().sortValue;
				var pernr = obj.attr("pernr");
				var tab = obj.attr("tab");
				var col = obj.attr("col");
				
				var oog = "";
				var out = false;
				var imgElem = $("#" + tab + "_img_guideline_" + pernr + "_" + col);
				if(imgElem.length) {
					if(imgElem.attr("active") == "true") {
						out = true;
						oog = $("#" + tab + "_select_guideline_" + pernr + "_" + col).val();
						if(oog == "") {
							oog = "-1";
						}
					}
				}
				
				if(!planData[tab])
					planData[tab] = new Object();

				if(!planData[tab][pernr])
					planData[tab][pernr] = new Object();

				//this might overight what was already populated
				planData[tab][pernr][col] = {rawData:value, outOfGuideline: {reason:oog, out: out}};
			}
		//}

	 });

	var approveReject = false;
	if(status == 3 || status == 4)
		approveReject = true;
	var workItemId;
	var modifiedBy;
	var modifiedDate;
	if(workItems!=null && workItems!='')
	{
		 workItemId = workItems.workItemId;
		 modifiedBy = workItems.modifiedBy;
		 modifiedDate = workItems.modifiedDate;
	}
	saveWorksheetForm({"planData":planData, "positionId":orgUnit,"status":status,"workItemId":workItemId,"modifiedBy":modifiedBy,"modifiedDate":modifiedDate,"planningMgrId":planningMgrId,"worksheetId":worksheetId}, submitForm, approveReject);
}

function worksheetApproveReject(status)
{	
	if(status == 3)
		bootbox.dialog({
			message : modalApprove, 
			buttons : {
				success : {
				    "label" :   langMap.worksheet_ok,
				    "class" : "btn-primary",
				    "callback": function() {
		    	 		saveWorksheet(false, status);
		    		 }
				}, 
				danger : {
					"label" :  langMap.worksheet_cancel,
				    "class" : "btn",
				    "callback": function() {
				    	$("#modal-approve").modal('hide');
				    }
				}
			}
		});
	
	/*
		bootbox.dialog(modalApprove, [{
		    "label" :  langMap.worksheet_ok,
		    "class" : "btn-primary",
		    "callback": function() {
		    	 saveWorksheet(false, status);
		    }
		}, {
			"label" :  langMap.worksheet_cancel,
		    "class" : "btn",
		    "callback": function() {
		    	$("#modal-approve").modal('hide');
		    }
		}]);*/
	else
		bootbox.dialog({
			message : modalReject, 
			buttons : {
				success : {
				    "label" :   langMap.worksheet_ok,
				    "class" : "btn-primary",
				    "callback": function() {
		    	 		saveWorksheet(false, status);
		    		 }
				}, 
				danger : {
					"label" :  langMap.worksheet_cancel,
				    "class" : "btn",
				    "callback": function() {
				    	$("#modal-reject").modal('hide');
				    }
				}
			}
		});
		/*bootbox.dialog(modalReject, [{
		    "label" :  langMap.worksheet_ok,
		    "class" : "btn-primary",
		    "callback": function() {
		    	 saveWorksheet(false, status);
		    }
		}, {
		    "label" :  langMap.worksheet_cancel,
		    "class" : "btn",
		    "callback": function() {
		    	$("#modal-reject").modal('hide');
		    }
		}]);*/
}

function getEmpProfile(ele){
	
	var associate = getAssociate($(ele).attr('tab'), $(ele).attr('empId'));
	showProfile(associate);
}

function showProfile(associate){

	popUpwin = bootbox.dialog(
			{
				message:resultProfile, 
				title: associate.firstName + " " + associate.lastName + " -  " + associate.posTitle,
				buttons: {
					danger:{
						label: lang.crt_bootbox_cancel,
						className: "btn-default"
					}
				}
			}).find("div.modal-dialog").addClass("modal-lg");
	
	var pernr = associate.pernr;
	
	//$("#profile_pic").attr("src", imageBuilder(rp, 'profile_circle_hd', postImg, 'png'));
	
	getuserProfile(pernr);
	/*getGuideLines(pernr);*/
	$("a[data-toggle=tab]").bind("click",function(){
			//alert('active tab '+$(this).attr('rel'));
			var activeTab = $(this).attr('rel');
			if(activeTab == 'guidelines')
				getGuideLines(pernr);
			if(activeTab == 'comphist')
				getCompHistory(pernr);
			/*if(activeTab == 'jobhist')
				getJobHistory(pernr);
*/
	});
}

function pushGuideLines(data){
	var tbody = [];
	var tbody = [];
	for(var t = 0; t < data.rating.length; t++)
	{

		var entry = data.rating[t];
		
		$('#guidelineRating').html(entry.rating)

		tbody.push('<div class="panel panel-default">');
		tbody.push('<div class="panel-heading">');
		tbody.push('<h4 class="panel-title">');
		tbody.push('<a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="#collapse' + t + '">');
		tbody.push('<i class="ace-icon fa fa-angle-down bigger-110" data-icon-hide="ace-icon fa fa-angle-down" data-icon-show="ace-icon fa fa-angle-right"></i>');
		tbody.push('&nbsp;' + entry.name);
		tbody.push('</a>');
		tbody.push('</h4>');
		tbody.push('</div>');

		tbody.push('<div class="panel-collapse collapse ' + ((t==0)?'in':'') + '" id="collapse' + t + '">');
		tbody.push('<div class="panel-body">');
	
	
	
		tbody.push('<table id="salaryguide_tab" class="table table-striped-removed table-bordered table-hover">');
		tbody.push('<thead>');
		tbody.push('<tr>');
			
		tbody.push('<th>'+langMap.js_worksheet_rating+'</th>');
		tbody.push('<th>'+langMap.js_worksheet_guideline+'</th>');					
		tbody.push('</tr>');
		tbody.push('</thead>');
		tbody.push('<tbody>');
		for(var x = 0; x < data.guidelines.length; x++)
		{
			var guideline = data.guidelines[x];
			if(guideline.reviewItemId == entry.reviewItemId) {
				tbody.push('<tr class="' + ((guideline.rating != null)?"bg-warning":"") + '">');	
				var text = guideline.lowOp + ' ' + guideline.lowValue;
				if(guideline.lowOp != guideline.upperOp && guideline.lowValue != guideline.upperValue)
					text += ' to ' + guideline.upperOp + ' ' + guideline.upperValue;
				tbody.push('	<td>' + text + '</td>');
				tbody.push('	<td>' + guideline.min + '% - ' + guideline.max + '%</td>');																						
				tbody.push('</tr>');
			}
		}
																						
		tbody.push('</tbody>');
		tbody.push('</table>');
		tbody.push('</div>');
		tbody.push('</div>');
		tbody.push('</div>');
	}
	
	$('#guidelineAccordion').html(tbody.join(''));
	/*var tpercentile = [];
	var percentileGraphWidth=0;
	var percentile;
	for(var x in data)
	{

		var currency = defaultCurrency;

		var entry = data[x];
		if(entry.currency != null)
			currency = entry.currency;
		tbody.push('<tr style="border-bottom: 1px solid #dcdcdc;">');
		tbody.push('<td>Base</td>');
		tbody.push('<td align="center">'+$.formatNumber(entry.baseMarket25, {format:getAmountFormat(currency), locale:locale})+' ' + currency + '</td>');
		//tbody.push('<td align="center">'+entry.baseMarket25+' USD</td>');
		tbody.push('<td align="center">'+$.formatNumber(entry.baseMarket50, {format:getAmountFormat(currency), locale:locale})+' ' + currency + '</td>');
		tbody.push('<td align="center">'+$.formatNumber(entry.baseMarket75, {format:getAmountFormat(currency), locale:locale})+' ' + currency + '</td>');
		tbody.push('</tr>');
		tbody.push('<tr style="border-bottom: 1px solid #dcdcdc;">');
		tbody.push('<td>Total Comp</td>');
		tbody.push('<td align="center">'+$.formatNumber(entry.totalMarket25, {format:getAmountFormat(currency), locale:locale})+' ' + currency + '</td>');
		tbody.push('<td align="center">'+$.formatNumber(entry.totalMarket50, {format:getAmountFormat(currency), locale:locale})+' ' + currency + '</td>');
		tbody.push('<td align="center">'+$.formatNumber(entry.totalMarket75, {format:getAmountFormat(currency), locale:locale})+' ' + currency + '</td>');
		tbody.push('</tr>');

	}*/
	//Comment the GRID On the Guidelines tab
	/*for(var x in data)
	{
		var entry = data[x];
		if(entry.percentile<25){
			percentileGraphWidth = 0;
			percentile = 'Less than 25';
		}
		else if(entry.percentile>75){
			percentileGraphWidth = 100;
			percentile = 'Greater than 75';
		}
		else{
			percentileGraphWidth = entry.percentile;
			percentile = entry.percentile;
		}

		tpercentile.push('<tr>');
		tpercentile.push('<td colspan="4" align="center">Total Compensation Percentile: '+percentile+'</td>');
		tpercentile.push('</tr>');
		tpercentile.push('<tr>');
		tpercentile.push('<td align="left" width="33%">0</td>');
		tpercentile.push('<td colspan="2" align="center" width="33%">50</td>');
		tpercentile.push('<td align="right" width="33%">100</td>');
		tpercentile.push('</tr>');
		tpercentile.push('<tr>');
		tpercentile.push('<td colspan="4">');
		tpercentile.push('<div class="progress">');
		tpercentile.push('<div class="bar" style="width: '+percentileGraphWidth+'%;" data-percent="'+percentileGraphWidth+'%"></div>');
		tpercentile.push('</div>');
		tpercentile.push('</td>');
		tpercentile.push('</tr>');
		tpercentile.push('');

	}*/
	//$('#table_guideLines tbody').html(tbody.join(''));
	//$('#percentileGraph tbody').html(tpercentile.join(''));

}

var oTable1
function pushCompHistory(data){

	var tbody=[];
	for(var x = 0; x < data.length; x++)
	{

		var entry = data[x];

		tbody.push('<tr role="row" class="' + ((x%2 == 0)?'even':'odd') + '">');
		tbody.push('<td>'+entry.title+'</td>');
		tbody.push('<td  style="text-align: center;">'+entry.rating+'</td>');
		tbody.push('<td align="center">'+ entry.basicSalary + '</td>');
		tbody.push('<td align="center">'+ entry.aca + '</td>');
		tbody.push('<td align="center">'+ entry.ltpp + '</td>');
		tbody.push('</tr>');
	}
	
	if(tbody.length==0)
	{
		tbody.push('<tr style="border-bottom: 1px solid #dcdcdc;">');
		tbody.push('<td colspan="7">'+langMap.js_budget_html_html_strong+'</td>');
		tbody.push('</tr>');
	}
	$('#table_compHistory tbody').html('');
	if(oTable1)
		oTable1.destroy();
	
	$('#table_compHistory tbody').html(tbody.join(''));
	

	oTable1 = $('#table_compHistory').DataTable({"language": dataTableLang10 });

}
function populateWorksheetJobHist(data)
{
	var tbody = [];
	for( x in data){
		var currency = defaultCurrency;
		var entry = data[x];
		if(entry.currencyCode !=null)
			currency = entry.currencyCode;
		tbody.push('<tr style="border-bottom: 1px solid #dcdcdc;">');
		var historyDate;
		/*if($.datepicker.regional[fullLocale])
			historyDate = $.datepicker.formatDate($.datepicker.regional[fullLocale].dateFormat, new Date(entry.dt));
		else if($.datepicker.regional[lang])
			historyDate = $.datepicker.formatDate($.datepicker.regional[lang].dateFormat, new Date(entry.dt));
		else
			historyDate = $.datepicker.formatDate($.datepicker.regional['en'].dateFormat, new Date(entry.dt));*/

		historyDate = getDateFormatForDisplay(entry.dt);

		//var formatDate = historyDate.getDate() + '/' + (historyDate.getMonth()+1) +'/'+historyDate.getFullYear();
		tbody.push('	<td align="center">'+historyDate+'</td>');
		tbody.push('	<td align="center">'+entry.jobTitle+'</td>');
		/*tbody.push('	<td align="center">'+$.formatNumber(entry.baseSalary, {format:getAmountFormat(currency), locale:locale})+' ' + currency + '</td>');*/
		if(entry.departmentName!=null)
			tbody.push('	<td align="center">'+entry.departmentName+'</td>');
		else
			tbody.push('	<td align="center"></td>');
		//tbody.push('	<td align="center">'+entry.supName+'</td>');
	}
	$("#table_jobHistory tbody").html(tbody.join(''));
}

function populateWorksheetuserProfile(data){

	var html=[];
	$('[userProfileData]').html('');
	if(data !=null){
		if(data.user != null) {
			$('#userProfileId').html(data.user.pernr);
			$('#userProfilePosTitle').html(data.user.posTitle);
			$('#userProfileOrg').html(data.user.departmentName);
			$('#userProfileManager').html(data.user.managerName);
			$('#userProfileHRBP').html(data.user.hrName);
		}
		if(data.salary != null) {

			var rule = getRoundingRules(data.salary.currency, null, null);
			
			$('#salaryInfoHireDate').html(getDateFormatForDisplay(data.salary.validDate));
			$('#salaryInfoTotalBasePay').html($.formatNumber(data.salary.salaryAnnual, {format:getAmountFormat(data.salary.currency, null, null), roundRule:rule, locale:locale}) + " " + data.salary.currency);
			$('#salaryInfoFteBasePay').html($.formatNumber(data.salary.salary, {format:getAmountFormat(data.salary.currency, null, null), roundRule:rule, locale:locale}) + " " + data.salary.currency);
			$('#salaryInfoHomeCountry').html(data.salary.countryName);
			$('#salaryInfoGrade').html(data.salary.grade);
			$('#salaryInfoFtePct').html(data.salary.percent + "%");
			$('#salaryInfoReference').html($.formatNumber(data.salary.reference, {format:getAmountFormat(data.salary.marketCurrency, null, null), roundRule:rule, locale:locale}) + " " + data.salary.marketCurrency);
			$('#salaryInfoReference').parent().hide();
			

			if(data.salary.min == null && data.salary.max == null) {
				$('#marketDataContainer').hide();
			} else {
				$('#salaryInfoMinimum').html($.formatNumber(data.salary.min, {format:getAmountFormat(data.salary.marketCurrency, null, null), roundRule:rule, locale:locale}) + " " + data.salary.marketCurrency);
				$('#salaryInfoMaximum').html($.formatNumber(data.salary.max, {format:getAmountFormat(data.salary.marketCurrency, null, null), roundRule:rule, locale:locale}) + " " + data.salary.marketCurrency);
				
			}
			
			var min = 1;
			var max = 1;
			var reference = 1;
			var salary = 0;
			if(data.salary.salary)
				salary = parseInt(data.salary.salary);
			if(data.salary.min)
				min = parseInt(data.salary.min,10);
			if(data.salary.max)
				max = parseInt(data.salary.max,10);
			if(data.salary.reference)
				reference = parseInt(data.salary.reference,10);
			
			var refWidth = (reference - min)/(max-min)*100;
			
			var totalWidth = 0;
			if(salary > min)
				totalWidth = (salary - min)/(max-min)*100;
			if(salary > max)
				totalWidth = 100;
			$('#salaryInfoReferenceWidth').width(refWidth + "%");
			$('#salaryInfoTotalBasePayWidth').width(totalWidth + "%");
			$('#salaryInfoTotalBasePayWidthLeft').width((100-totalWidth) + "%");

		}	
	}
}

function exitWorksheet()
{
	/*if($('.textbox[changed=true]').length) {
		
		bootbox.dialog({
			message : closeWindow, 
			buttons : {
				success : {
				    "label" :   langMap.worksheet_ok,
				    "class" : "btn-primary",
				    "callback": function() {
				    	window.location = document.referrer;//dashboardurl;
		    		 }
				}, 
				danger : {
					"label" :  langMap.worksheet_cancel,
				    "class" : "btn",
				    "callback": function() {
				    	$("#exit-worksheet").modal('hide');
				    }
				}
			}
		});*/
		
		/*bootbox.dialog(closeWindow, [{
		    "label" :  langMap.worksheet_ok,
		    "class" : "btn-primary",
		    "callback": function() {
		    	window.location = dashboardURL;
		    }
		}, {
			"label" :  langMap.worksheet_cancel,
		    "class" : "btn",
		    "callback": function() {
		    	$("#exit-worksheet").modal('hide');
		    }
		}]);*/
		/*bootbox.confirm("Are you sure you would like to exit the planning? All recommendations not already saved will be lost.", function(result) {
			if(result) {
				//resetDashboard();
				history.back();
				return false;
			}

		});*/
		
	/*}
	else
	{*/
		window.location = statusOverviewURL;//dashboardURL;
		return false;
		//resetDashboard();
	//}
}

function isValidChar(char){
	if(IsNumeric(char.value))
	{
		if(char.value.length>3)
			return false;
	}
	else
		return false;
}


function searchPernrs(){
	var searchValue = $('#pernrSearch').val();
 	if(searchValue!=null && searchValue!="") {
 		var data = {};
 		data[req_emp_search_text] = searchValue;
 		 $.ajax({
 		        url: searchAssociateURL,
 		        type: "POST",
 		        data: data,
 		        cache: false,
 		        success: buildManagerSearch,
 				error: function(error){
 					$('#dashboardErrorMsg').html(ILanguageHelper.dashboard_no_results_found);
 					$('#errorDivId').show();
 					//$('i[rel=dashboardErrorMsg]').show();
 				}
 		 });
 	} else {
 		
 		$('#dashboardErrorMsg').html(ILanguageHelper.dashboard_no_results_found);
 		//$('i[rel=dashboardErrorMsg]').show();
 		$('#errorDivId').show();
 		return false;
 	}

}

function buildManagerSearch(data){
 	$('#errorDivId').hide();
	bootbox.dialog({message:bootboxPopup});
	//$('#managerSearchDiv').parents('.modal-body').css({'width':'500px','max-height':'500px'});
	//var managerSearchJSON = $.parseJSON(data);
	//var managerInfo = managerSearchJSON[0];
	//var managerSearch = managerInfo.MANAGER_INFO;
	if(data) {
	var html = [];
	var elem;
	var empId = "";
	var empName = "";
	for(var index=0; index<data.length; index++)
	{
		elem = data[index];
		empId = elem.pernr || '';
		empName = elem.firstName + " " + elem.lastName || '';
			html.push('<tr>');
			html.push('<td><label><input type="radio" name="mgr_radio" rel="searchResults" value="mgrsearch" empname="'+empName+'" empid="'+empId+'" orgUnit="'+elem.positionId+'"></label></td>');
			//html.push('<td>'+elem.empId+'</td>');
			html.push('	<td><a href="#" id="mgr_details" onClick="launchEditPool(this)" empid="'+empId+'" empName="'+empName+'" orgUnit="'+elem.positionId+'">'+empName+((elem.terminated)?'&nbsp;<img style="padding-bottom:3px;" src="../images/terminated.png"></img>':'')+'</a></td>');
			html.push('</tr>');
		}
	}
	$('#srchresManager tbody').html(html.join(''));
	var oTable1 = $('#srchresManager').dataTable( {
		"aoColumns": [
	      { "bSortable": false }, null
		  
		], "oLanguage": dataTableLang} );
	$('#srchresManager').parents('.modal-body').css('overflow-y','inherit');
	$('#srchresManager_wrapper').attr('style','overflow-y:auto;max-height:320px;');
}

function launchEditPool(ele){
	var empId = $(ele).attr("empid");
	var empName = encodeURIComponent($(ele).attr("empName")).replace(new RegExp("'", "g"), "\\'");
	var orgUnit = $(ele).attr("orgUnit");
	refreshScope('D','X',orgUnit,empId);
}

function openEditPool(){
	if($('input:radio[rel=searchResults]:checked').length > 0){
		var radioChecked = $('input:radio[rel=searchResults]:checked').val();
		var empId = $('input:radio[rel=searchResults]:checked').attr("empid");
		var empName = $('input:radio[rel=searchResults]:checked').attr("empname");
		var orgUnit = $('input:radio[rel=searchResults]:checked').attr("orgUnit");
		refreshScope('D','X',orgUnit,empId);
		
   }else 
   		bootbox.alert(ILanguageHelper.inb_select_one_option);

}

function gotoHome(){
	window.location = homePageUrl;
	return false;
}