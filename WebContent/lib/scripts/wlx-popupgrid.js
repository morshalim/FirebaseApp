var resetIndPlanning = true;
$(document).ready(function() {
	$("#ind_plan").fancybox({
        'transitionIn': 'elastic',
        'transitionOut': 'elastic',							
		'showNavArrows': false,
		'enableEscapeButton': false,
		'hideOnOverlayClick': true,
		'titleShow': false,
		'overlayOpacity': .45,
		'overlayColor':'#000',
		'autoDimensions': false,
		'width': 870,
        'height': 600,
		'scrolling': 'no',
		'margin': 10,
		'onStart'	:	
			function(selectedArray, selectedIndex, selectedOpts) {
				if(resetIndPlanning)
				{
					budgetSummaryIndDelta = {};
					resetIndPlanning = true;
				}
				restrictDrawing = true;
			},		
		'onClosed'	:
			function(selectedArray, selectedIndex, selectedOpts) {
				
				var ctr = 0;
				for(var x in indPlanChanges)
				{
					if(indPlanChanges[x] != null)
						ctr ++;
				}
				for(var x in indPlanRatingChanges)
				{
					if(indPlanRatingChanges[x] != null)
						ctr ++;
				}
				if(ctr == 0)
				{
					restrictDrawing = false;

					for(var tab in budgetSummary)
					{
						var bud = budgetSummary[tab];
						$('#budgetPlan_' + tab).html(getPlanSummaryDetails(bud, 'budgetSummary'));
					}				
					wrapDiv('budgetSummary', -50, -10, 180, 100);				
					
					if($('#saveRecoBttn').hasClass('bttn_disabled'))
					{
						$('#warningOutP3').show();
						$('#okP3').removeClass('bttn_priority').addClass('bttn_disabled');
					}
					else
					{
						$('#warningOutP3').hide();
						$('#okP3').removeClass('bttn_disabled').addClass('bttn_priority');				
					}
									
				}
				else
				{
					setTimeout(function(){ $('#exitToWorksheetTrigger').trigger('click'); }, 250);
					
				}

			},
		'onComplete':
			function() {
				
				setTimeout(function(){ $.fancybox.resize(); }, 250);
			}	
	});	
	
	/*$("#submitTrigger").fancybox({
		'transitionIn': 'elastic',
		'transitionOut': 'elastic',
		'enableEscapeButton': true,
		'scrolling': 'auto',
		'titleShow': false,
		'overlayOpacity': .45,
		'overlayColor': '#000',
		'showNavArrows': false,
		'width': 780,
		'height': 600,
		'autoDimensions': false
	});*/

	$("#confirmationTrigger").fancybox({
		'transitionIn': 'elastic',
		'transitionOut': 'elastic',
		'modal': true,
		'scrolling': 'auto',
		'titleShow': false,
		'overlayOpacity': .45,
		'overlayColor': '#000',
		'showNavArrows': false,
		'width': 630,
		'height': 300,
		'autoDimensions': false
	});

	$("#exitTrigger").fancybox({
		'transitionIn': 'elastic',
		'transitionOut': 'elastic',
		'enableEscapeButton': true,
		'scrolling': 'auto',
		'titleShow': false,
		'overlayOpacity': .45,
		'overlayColor': '#000',
		'showNavArrows': false,
		'width': 600,
		'height': 130,
		'autoDimensions': false
	});	
	
		$("#exitForP3Trigger").fancybox({
		'transitionIn': 'elastic',
		'transitionOut': 'elastic',
		'enableEscapeButton': true,
		'scrolling': 'auto',
		'titleShow': false,
		'overlayOpacity': .45,
		'overlayColor': '#000',
		'showNavArrows': false,
		'width': 675,
		'height': 130,
		'autoDimensions': false
	});
		
		$("#exitToWorksheetTrigger").fancybox({
		'transitionIn': 'elastic',
		'transitionOut': 'elastic',
		'enableEscapeButton': true,
		'scrolling': 'auto',
		'titleShow': false,
		'overlayOpacity': .45,
		'overlayColor': '#000',
		'showNavArrows': false,
		'width': 675,
		'height': 150,
		'autoDimensions': false
	});			
		
	
	$('#ind_merit_img').bubbletip($('#ind_merit_bubble')
													,{	delayShow: delayShowOnMouseOver,
														delayHide: 0,
														calculateOnShow: true,
														deltaDirection: 'down'
													});
	$('#ind_ai_img').bubbletip($('#ind_ai_bubble')
													,{	delayShow: delayShowOnMouseOver,
														delayHide: 0,
														calculateOnShow: true
													});
	$('#ind_lti_img').bubbletip($('#ind_lti_bubble')
													,{	delayShow: delayShowOnMouseOver,
														delayHide: 0,
														calculateOnShow: true
													});
	$('#ind_lai_img').bubbletip($('#ind_lai_bubble')
													,{	delayShow: delayShowOnMouseOver,
														delayHide: 0,
														calculateOnShow: true,
														deltaDirection:'up'
													});													
	$('#ind_performance_img').bubbletip($('#ind_performance_bubble')
													,{	delayShow: delayShowOnMouseOver,
														delayHide: 0,
														calculateOnShow: true
													});
	$('#ind_potential_img').bubbletip($('#ind_potential_bubble')
													,{	delayShow: delayShowOnMouseOver,
														delayHide: 0,
														calculateOnShow: true
													});	
	$('#ind_perf_rating_img').bubbletip($('#indP3_bubble')
													,{	delayShow: delayShowOnMouseOver,
														delayHide: 0,
														calculateOnShow: true
													});	
});


function printIndPopup()
{

	/*var html = 	[];
	html.push('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">');
	html.push('<html>\n');
	html.push('	<head>\n');
	html.push('		<link rel="stylesheet" media="all" type="text/css" href="' + rp + 'css/base.css"/>\n');
	html.push('	</he' + 'ad>\n');
	html.push('	<body class="reset">\n');
	var jelem = $('#IndividualPopup');

	jelem.find('.bttn').hide();	
	jelem.find('.print').hide();		
	html.push(jelem.parent().html());	
	jelem.find('.bttn').show();
	jelem.find('.print').show();		

	html.push('	</bo' + 'dy>\n');
	html.push('	</ht' + 'ml>');

	var w=window.open(getBlankPage); 
	w.document.write(html.join(''));
	w.print();*/
	window.print();
	//w.close();
}

var p3AppId = null;
var p3SaveScope = null;
var p3Name = null;
function verifyP3App(appId, scope, name, pernr)
{
	p3AppId = appId;
	p3SaveScope = scope;
	p3Name = name;
	p3Pernr = pernr;
	var ctr = 0;
	for(var x in planChanges)
	{
		if(planChanges[x] != null)
			ctr ++;
	}
	
	for(var x in planRatingChanges)
	{
		if(planRatingChanges[x] != null)
			ctr ++;
	}
	
	for(var x in indPlanChanges)
	{
		if(indPlanChanges[x] != null)
			ctr ++;
	}
	
	for(var x in indPlanRatingChanges)
	{
		if(indPlanRatingChanges[x] != null)
			ctr ++;
	}	
	
	if(ctr == 0)
	{
		saveFormForP3();
	}
	else
		$('#exitForP3Trigger').trigger('click');
}

function saveFormForP3()
{
	if($('#okP3').hasClass('bttn_disabled'))
		return;		
	
	if(p3SaveScope == "P")
		$.fancybox.close();
	saveForm(p3SaveScope, ((p3SaveScope == "I")?true:false), false, false, p3AppId, p3Name, p3Pernr);
}

function returnToIndPlanning()
{
	resetIndPlanning = false;
	$('#ind_plan').trigger('click');
}

function returnToWorksheet()
{

	restrictDrawing = false;
	//revert all the changes back if nothing has been saved.
	for(var x in budgetSummaryIndDelta)
	{
		//alert(x.split(",")[0]);
		var bud = budgetSummary[x.split(",")[0]];
		var budd = budgetSummaryIndDelta[x];

		bud.status.numNotPlanned -= budd.numNotPlanned;
		bud.status.numPlanned -= budd.numPlanned;
		bud.spent -= budd.spent;
		bud.available -= budd.available;		

		//alert(JSON.stringify(bud));
	
	}	
	
	budgetSummaryIndDelta = {};
	$.fancybox.close();
}

function cancelFormForP3()
{
	if(p3SaveScope == "I")
	{
		resetIndPlanning = false;
		$('#ind_plan').trigger('click');
	}
	else
		$.fancybox.close();	
}

function closeIndPlanning()
{
	$.fancybox.close();	
}

function loadIndPanning(pernr, focusTab, params, resetIndChanges, trigger)
{
	
	if(trigger)
		$('#ind_plan').trigger('click');
	
	//remove bubble tips
	$('#cr_merit_img_guideline_all_pct').removeBubbletip();
	$('#cr_ai_img_guideline_all_pct').removeBubbletip();
	$('#cr_lti_img_guideline_all_pct').removeBubbletip();
	$('#cr_lai_img_guideline_all_pct').removeBubbletip();		
	$('#cr_lti_potential_rating_trigger_all_pct').removeBubbletip();
	$('#cr_lti_performance_rating_all_pct').removeBubbletip();
	
	if(resetIndChanges)
	{
		indPlanChanges = [];
		indPlanRatingChanges = [];
		if(accessMode != 1)
		{
			$('#saveExitIndBttn').removeClass('bttn_disabled').addClass('bttn');
			$('#saveIndBttn').removeClass('bttn_disabled').addClass('bttn');
			$('#okP3').removeClass('bttn_disabled').addClass('bttn_priority');			
		}
		$('#indWarningOut').hide();
		$('#warningOutP3').hide();		
	}
	popupTracker = [];
	
	var pos = quickLookUp[pernr];
	var obj = indPlan[pos];
	$('#ipTitle').html(langMap.id_title + " <span id='ipName'>" + obj.name + "</span>");
	$('#ipPernr').html(pernr);	
	$('#ipNav').html((pos+1) + langMap.pager_of + " " + indPlan.length + langMap.pager_associates + " ");
	
	if(pos != 0) {
		$('#ipPrevious').unbind('click.move');		
		$('#ipPrevious').bind('click.move',{pernr:indPlan[pos - 1].pernr, resetIndChanges:false}, 
				function(event) {
					loadIndPanning(event.data.pernr, currentSlectedITab, {}, false, false);
					return false;
				}
		);
	}
	if(pos != indPlan.length -1) {
		$('#ipNext').unbind('click.move');
		$('#ipNext').bind('click.move',{pernr:indPlan[pos + 1].pernr, resetIndChanges:false}, 
				function(event) {
					loadIndPanning(event.data.pernr, currentSlectedITab, {}, false, false);
					return false;
				}
		);
	}
		
		//trigger was here.
		
	if(focusTab)
		showTab(true, focusTab, "itab");
	else
		showTab(true, "cr", "itab");	
		
}
function loadCompRecoProfile(data)
{

	data = data.profile;
	
	var imgPreloader = new Image();

	imgPreloader.onerror = function() {
		$('#ind_profile_pic').attr('src',imageBuilder(rp, 'ind_picture_placeholder', postImg, 'gif'));
	};

	imgPreloader.onload = function() {
		imgPreloader.onerror = null;
		imgPreloader.onload = null;
		$('#ind_profile_pic').attr('src',this.src);		
	};

	imgPreloader.src = data.pictureURL;
	
	
	$('#cr_name').html(data.name);
	$('#cr_pos').html(data.posTitle);
	$('#cr_location').html(data.location);
	$('#cr_title').html(data.jobTitle);
	$('#cr_grade').html(data.grade);
	$('#cr_function').html(data.func);
	$('#cr_manager').html(data.mgrName);
	$('#cr_hire').html(data.hireDate);
	$('#cr_group').html(data.group);
	$('#cr_bu').html(data.businessUnit);	

}

function loadCompRecoDetails(data)
{
	var pernr = $('#ipPernr').html();
	var mrtReason = "";
	var mrtPct = "";
	var aiReason = "";
	var aiPct = "";
	var ltiReason = "";
	var ltiPct = "";
	$('#annualIncentiveDetailContainer').show();
	$('#annualIncentiveLegendContainer').show();	
	$('#annualIncentiveDetailContainerNotEligible').hide();
	$('#annualIncentiveDetailContainerExec').hide();
	$('#ind_profile_rating').show();
	var newMrtValues = null;
	var mrtKey = data.summary.mrtPlanId + "," + pernr;
	if(indPlanChanges[mrtKey])
		newMrtValues = indPlanChanges[mrtKey].split(',');
	else if(planChanges[mrtKey])
		newMrtValues = planChanges[mrtKey].split(',');
		
	if(newMrtValues != null)
	{
		data.summary.mrtInitial = false;
		mrtPct = newMrtValues[2];
		mrtReason = newMrtValues[3];
		if(mrtReason != "-1")
		data.summary.mrtOutOfGuideline.out = true;		
		
		data.summary.mrtPercent = mrtPct;
		data.summary.mrtOutOfGuideline.reason = mrtReason;
		
	}
	
	var newAiValues = null;
	var aiKey = data.summary.aiPlanId + "," + pernr;
	if(indPlanChanges[aiKey])
		newAiValues = indPlanChanges[aiKey].split(',');
	else if(planChanges[aiKey])	
		newAiValues = planChanges[aiKey].split(',');
		
	if(newAiValues != null)
	{
		data.summary.aiInitial = false;
		aiPct = newAiValues[2];
		aiReason = newAiValues[3];
		if(aiReason != "-1")
			data.summary.aiOutOfGuideline.out = true;
		
		data.summary.aiPercent = aiPct;
		data.summary.aiOutOfGuideline.reason = aiReason;
	}
	
	
	var newLtiValues = null;
	var ltiKey = data.summary.ltiPlanId + "," + pernr;
	if(indPlanChanges[ltiKey])
		newLtiValues = indPlanChanges[ltiKey].split(',');
	else if(planChanges[ltiKey])	
		newLtiValues = planChanges[ltiKey].split(',');
		
	if(newLtiValues != null)
	{
		data.summary.ltiInitial = false;
		ltiPct = newLtiValues[2];
		ltiReason = newLtiValues[3];
		if(ltiReason != "-1")
			data.summary.ltiOutOfGuideline.out = true;

		data.summary.ltiPercent = ltiPct;
		data.summary.ltiOutOfGuideline.reason = ltiReason;		
	}
	
	var newLaiValues = null;
	var laiKey = data.summary.laiPlanId + "," + pernr;
	if(indPlanChanges[laiKey])
		newLaiValues = indPlanChanges[laiKey].split(',');
	else if(planChanges[laiKey])	
		newLaiValues = planChanges[laiKey].split(',');
		
	if(newLaiValues != null)
	{
		data.summary.laiInitial = false;
		laiPct = newLaiValues[2];
		laiReason = newLaiValues[3];
		if(laiReason != "-1")
			data.summary.laiOutOfGuideline.out = true;
		
		data.summary.laiPercent = laiPct;
		data.summary.laiOutOfGuideline.reason = laiReason;
	}	
	
	var newPotentialLtiValues = null;
	if(indPlanRatingChanges[ltiKey])
		newPotentialLtiValues = indPlanRatingChanges[ltiKey].split(',');
	else if(planRatingChanges[ltiKey])	
		newPotentialLtiValues = planRatingChanges[ltiKey].split(',');
	
	if(newPotentialLtiValues != null)
	{
		ltiPotential = newPotentialLtiValues[2];
		data.profile.potentialRating = ltiPotential;
		
		if(data.profile.performanceRating != "")
		{
			var newGuidelines = ((data.profile.potentialRating == "")?"0,0":potentialRatingMap[data.profile.potentialRating][data.profile.performanceRating]);		
			data.summary.ltiGuidelines = newGuidelines;
		}
	}	
	
	
	var cr_lti_perf = $('#cr_lti_performance_rating_all_pct');
	var cr_lti_perf_span = $('#cr_lti_span_perf_rating_all_pct');	
	var cr_performance = $('#cr_performance');
	var cr_performance_no_link = $('#cr_performance_no_link');
	
	cr_performance.unbind('click.p3');
	
	var cr_lti_perf_img = $('#ind_perf_rating_img');	
	if(data.profile.performanceRating == "")
	{
		cr_lti_perf.html(langMap.planSheet_planNeedRating);
		cr_lti_perf_img.show();
	}else
	{
		cr_lti_perf.html(data.profile.performanceRating);
		cr_lti_perf_img.hide();		
	}
	
	cr_performance.show();
	cr_performance_no_link.hide();		
	
	if(data.profile.appraisalId == "-1")
	{
		cr_performance.hide();
		cr_performance_no_link.show();
		
		cr_performance_no_link.html(cr_lti_perf.html());
		
	}
	else if(data.profile.appraisalId != "")
	{
	
		cr_performance.bind('click.p3',{appraisalId:data.profile.appraisalId, pernr:pernr}, 
				function(event) {
					var nameData = $('#ipName').html();
					var nameArr = nameData.split(',');
					verifyP3App(event.data.appraisalId, "I", encodeURIComponent(nameArr[1] + " " + nameArr[0]), event.data.pernr);
				}
		);		
	}
	else
	{
		
			var eh = getEventHandler('cr_potential', 'pot')
			var template = eh.map.templateNoApp.replace(new RegExp("{NAME}", "g") , $('#ipName').html());
			if($('#cr_lti_pop_no_app_rating_all_pct').length == 0)
			{
				$('#btholder').append('<div id="cr_lti_pop_no_app_rating_all_pct" style="display:none;"><pre class="tip">' + 
							   template + 
							   '</pre></div>\n');		
			}
			else
			{
				$('#cr_lti_pop_no_app_rating_all_pct').html('<pre class="tip">' + 
			   template + 
			   '</pre>\n');
			}
			
			

			cr_lti_perf.unbind('mouseover.event');
			cr_lti_perf.bind('mouseover.event', {}, function(event){
						var params = event.data;	
		
						//verify existence of tooltip
						if( $('table.bubbletip #cr_lti_pop_no_app_rating_all_pct').length == 0)
						{
							//instantiate the bubbletip and pop the hover
							cr_lti_perf
								.bubbletip(
											$('#cr_lti_pop_no_app_rating_all_pct')
											,{	delayShow: 0,
												delayHide: 0,
												calculateOnShow: true,
												bindShow: 'click',					
												bindHide: 'mouseout'
											});
							//pop the info after if has been created	
							cr_lti_perf.trigger('mouseover');
						}
						
				}
			)
						
			
			
	}
	
	cr_lti_perf_span.html(data.profile.performanceRating);
	
	
	var ratingText = langMap.planSheet_potentialRatingSelect;
	
	for(var x = 0; x < potentialRatingList.length; x++)
	{
		var indGuide = potentialRatingList[x];
		if(indGuide.value == data.profile.potentialRating)
		{
			ratingText = indGuide.name;
			break;
		}
	}	
	
	$('#cr_lti_potential_rating_all_pct').html(ratingText);	
	processInfoBubbleIndPotentialRating('cr_lti', data);
	
	var profile = data.profile;
	data = data.summary;
	
	var cr_merit_conv = currency[data.mrtCurrency].decFactor;
	var cr_merit_pct = $('#cr_merit_body_td_input_all_pct');
	var cr_merit_select = $('#cr_merit_select_guideline_all_pct');	
	var cr_ai_conv = currency[data.aiCurrency].decFactor;
	var cr_ai_pct = $('#cr_ai_body_td_input_all_pct');
	var cr_ai_select = $('#cr_ai_select_guideline_all_pct');	
	var cr_lti_conv = currency[data.ltiCurrency].decFactor;	
	var cr_lti_pct = $('#cr_lti_body_td_input_all_pct');
	var cr_lti_select = $('#cr_lti_select_guideline_all_pct');	
	var cr_lai_conv = currency[data.laiCurrency].decFactor;
	var cr_lai_pct = $('#cr_lai_body_td_input_all_pct');
	var cr_lai_select = $('#cr_lai_select_guideline_all_pct');

	
	cr_merit_pct.removeClass('err dis').removeAttr('disabled');
	cr_merit_select.removeAttr('disabled');
	cr_ai_pct.removeClass('err dis').removeAttr('disabled');
	cr_ai_select.removeAttr('disabled');	
	cr_lti_pct.removeClass('err dis').removeAttr('disabled');
	cr_lti_select.removeAttr('disabled');
	cr_lai_pct.removeClass('err dis').removeAttr('disabled');
	cr_lai_select.removeAttr('disabled');
	
	$('#ind_entry_merit').show();
	$('#ind_entry_ai').show();
	$('#ind_entry_lti').show();	
	$('#ind_entry_lai').show();
	
	var inputValue = $.formatNumber(data.mrtPercent, {format:pctFormat, locale:locale});
	if(!data.mrtEligible)
	{
		$('#ind_entry_merit').hide();
		inputValue = "";
		cr_merit_pct.attr('disabled','disabled');
	}
	else if(!data.mrtActive)
	{
		cr_merit_pct.attr('disabled','disabled');
		cr_merit_select.attr('disabled','disabled');		
	}
	
	var cr_merit_guidelines = $('#cr_merit_body_td_all_guidelines');
	var mrtGuidelines = data.mrtGuidelines.split(',');
	cr_merit_guidelines.html("<span style='display:none' id='cr_merit_guideline_all_guidelines'>" + data.mrtGuidelines + "</span>" + $.formatNumber(mrtGuidelines[0], {format:pctFormat, locale:locale}) + "% - " + $.formatNumber(mrtGuidelines[1], {format:pctFormat, locale:locale}) + "%");
	
	var cr_merit_pct_body = $('#cr_merit_body_td_all_pct')
	cr_merit_pct_body.metadata().sortValue = data.mrtPercent;
	
	cr_merit_pct.val(inputValue);
	cr_merit_pct.attr('prevValue', ((!data.mrtInitial)?data.mrtPercent:""));
//	cr_merit_pct.metadata().sortValue = data.mrtPercent;
	
	var cr_merit_currency = $('#cr_merit_body_td_all_currency');
	cr_merit_currency.html(data.mrtCurrency);
	
	var cr_merit_planId = $('#cr_merit_body_td_all_planId');
	cr_merit_planId.html(data.mrtPlanId);	
	
	var cr_merit_basePay = $('#cr_merit_body_td_all_basePay')

	var mrtBasePay = "";
	if(data.currBasePay != "")
		mrtBasePay = cr_merit_conv * data.currBasePay;
		
	cr_merit_basePay.html($.formatNumber(mrtBasePay, {format:getAmountFormat(data.mrtCurrency), locale:locale}) + " " + data.mrtCurrency);
	cr_merit_basePay.metadata().sortValue = mrtBasePay;
	
	var cr_merit_compaRatio = $('#cr_merit_body_td_all_compaRatio')
	cr_merit_compaRatio.html($.formatNumber(data.compRatio, {format:compaRatioFormat, locale:locale}));
	cr_merit_compaRatio.metadata().sortValue = data.compRatio;	
	
	var cr_merit_minSalary = $('#cr_merit_body_td_all_minSalary')
	
	var mrtMin = "";
	if(data.salaryMin != "")
		mrtMin = cr_merit_conv * data.salaryMin;
	
	cr_merit_minSalary.html($.formatNumber(mrtMin, {format:getAmountFormat(data.mrtCurrency), locale:locale}));
	cr_merit_minSalary.metadata().sortValue = mrtMin;
	
	var cr_merit_midSalary = $('#cr_merit_body_td_all_midSalary')

	var mrtMid = "";
	if(data.salaryMid != "")
		mrtMid = cr_merit_conv * data.salaryMid;	

	cr_merit_midSalary.html($.formatNumber(mrtMid, {format:getAmountFormat(data.mrtCurrency), locale:locale}));
	cr_merit_midSalary.metadata().sortValue = mrtMid;
	
	var cr_merit_maxSalary = $('#cr_merit_body_td_all_maxSalary')
	
	var mrtMax = "";
	if(data.salaryMax != "")
		mrtMax = cr_merit_conv * data.salaryMax;	

	cr_merit_maxSalary.html($.formatNumber(mrtMax, {format:getAmountFormat(data.mrtCurrency), locale:locale}));
	cr_merit_maxSalary.metadata().sortValue = mrtMax;
	
	var cr_merit_newBasePay = $('#cr_merit_body_td_all_newBasePay')
	
	var mrtNewBasePay = "";
	if(data.newBasePay != "")
		mrtNewBasePay = cr_merit_conv * data.newBasePay;
		
	cr_merit_newBasePay.html($.formatNumber(mrtNewBasePay, {format:getAmountFormat(data.mrtCurrency), locale:locale}) + " " + data.mrtCurrency);
	cr_merit_newBasePay.metadata().sortValue = mrtNewBasePay;
	
	var cr_merit_newCompaRatio = $('#cr_merit_body_td_all_newCompaRatio')
	cr_merit_newCompaRatio.html($.formatNumber(data.newCompRatio, {format:compaRatioFormat, locale:locale}));
	cr_merit_newCompaRatio.metadata().sortValue = data.newCompRatio;;
	
	var cr_merit_meritIncrease = $('#cr_merit_body_td_all_meritIncrease')
	
	var mrtAmount = "";
	if(data.mrtAmt != "")
		mrtAmount = cr_merit_conv * data.mrtAmt;	

	cr_merit_meritIncrease.html($.formatNumber(mrtAmount, {format:getAmountFormat(data.mrtCurrency), locale:locale}) + " " + data.mrtCurrency);
	cr_merit_meritIncrease.metadata().sortValue = mrtAmount;
	
	var cr_merit_lumpSum = $('#cr_merit_body_td_all_lumpSum')
	
	var mrtLumpSum = "";
	if(data.mrtLumpSum != "")
		mrtLumpSum = cr_merit_conv * data.mrtLumpSum;	
	
		
	cr_merit_lumpSum.html($.formatNumber(mrtLumpSum, {format:getAmountFormat(data.mrtCurrency), locale:locale}) + " " + data.mrtCurrency);
	cr_merit_lumpSum.metadata().sortValue = mrtLumpSum;
	cr_merit_lumpSum.attr('override',((data.mrtLumpOvr)?'X':''));

	if(data.mrtInitial)
	{
		inputValue = langMap.planSheet_planDataInitial;
		cr_merit_pct.addClass("dis");
		cr_merit_pct.val(inputValue);
		$('#cr_merit_body_td_all_newBasePay').html('');
		$('#cr_merit_body_td_all_newCompaRatio').html('');
		$('#cr_merit_body_td_all_meritIncrease').html('');
		$('#cr_merit_body_td_all_lumpSum').html('');
	}

	processInfoBubbleInd('cr_merit', data.mrtReasons, data.mrtOutOfGuideline);


	inputValue = $.formatNumber(data.aiPercent, {format:pctFormat, locale:locale});
	
	if(!data.aiEligible)
	{
		$('#ind_entry_ai').hide();
		inputValue = "";
		cr_ai_pct.attr('disabled','disabled');
	}
	else if(!data.aiActive)
	{
		cr_ai_pct.attr('disabled','disabled');
		cr_ai_select.attr('disabled','disabled');		
	}


	var cr_ai_guidelines = $('#cr_ai_body_td_all_guidelines')
	if(!data.aiExec)
	{
		var aiGuidelines = data.aiGuidelines.split(',');
		cr_ai_guidelines.html("<span style='display:none' id='cr_ai_guideline_all_guidelines'>" + data.aiGuidelines + "</span>" + $.formatNumber(aiGuidelines[0], {format:pctFormat, locale:locale}) + "% - " + $.formatNumber(aiGuidelines[1], {format:pctFormat, locale:locale}) + "%");	
	}
	else
	{
		cr_ai_guidelines.html(langMap.planSheet_planStatusGuideExec);
	}
	
	var cr_ai_pct_body = $('#cr_ai_body_td_all_pct')
	cr_ai_pct_body.metadata().sortValue = data.aiPercent;	
	
	
	cr_ai_pct.val(inputValue);
	cr_ai_pct.attr('prevValue', ((!data.aiInitial)?data.aiPercent:""));
	cr_ai_pct.metadata().sortValue = data.aiPercent;
	
	var cr_ai_recomm = $('#cr_ai_body_td_all_recomm')
	
	var aiAmt = "";
	if(data.aiAmt != "")
		aiAmt = cr_ai_conv * data.aiAmt;	
	
	cr_ai_recomm.html($.formatNumber(aiAmt, {format:getAmountFormat(data.aiCurrency), locale:locale}) + " " + data.aiCurrency);	
	cr_ai_recomm.metadata().sortValue = aiAmt;
	
	var cr_ai_target = $('#cr_ai_body_td_all_target')
	
	var aiTargetAmt = "";
	if(data.aiTargetAmt != "")
		aiTargetAmt = cr_ai_conv * data.aiTargetAmt;		
	
	cr_ai_target.html($.formatNumber(aiTargetAmt, {format:getAmountFormat(data.aiCurrency), locale:locale}) );	
	cr_ai_target.metadata().sortValue = aiTargetAmt;	
	
	var cr_ai_currency = $('#cr_ai_body_td_all_currency');
	cr_ai_currency.html(data.aiCurrency);
	
	var cr_ai_planId = $('#cr_ai_body_td_all_planId');
	cr_ai_planId.html(data.aiPlanId);	
	
	if(data.aiInitial)
	{
		inputValue = langMap.planSheet_planDataInitial;
		cr_ai_pct.addClass("dis");
		cr_ai_pct.val(inputValue);
		$('#cr_ai_body_td_all_recomm').html('');
	}

	processInfoBubbleInd('cr_ai', data.aiReasons, data.aiOutOfGuideline);
	
	
	inputValue = $.formatNumber(data.ltiPercent, {format:pctFormat, locale:locale});
	if(!data.ltiEligible)
	{
		$('#ind_profile_rating').hide();
		$('#ind_entry_lti').hide();			
		inputValue = "";
		cr_lti_pct.attr('disabled','disabled')
	} else if(!data.ltiActive)
	{
		cr_lti_pct.attr('disabled','disabled')
		cr_lti_select.attr('disabled','disabled')		
	}
	
	var cr_lti_guidelines = $('#cr_lti_body_td_all_guidelines')
	var ltiGuidelines = data.ltiGuidelines.split(',');
	cr_lti_guidelines.html("<span style='display:none' id='cr_lti_guideline_all_guidelines'>" + data.ltiGuidelines + "</span>" + $.formatNumber(ltiGuidelines[0], {format:pctFormat, locale:locale}) + "% - " + $.formatNumber(ltiGuidelines[1], {format:pctFormat, locale:locale}) + "%");	
	
	var cr_lti_pct_body = $('#cr_lti_body_td_all_pct')
	cr_lti_pct_body.metadata().sortValue = data.ltiPercent;
	
	
	cr_lti_pct.val(inputValue);
	cr_lti_pct.attr('prevValue', ((!data.ltiInitial)?data.ltiPercent:""));	
	//cr_lti_pct.metadata().sortValue = data.ltiPercent;
	
	var cr_lti_basePay = $('#cr_lti_body_td_all_basePay')
	
	var yearEndBasePay = "";
	if(data.yearEndBasePay != "")
		yearEndBasePay = cr_lti_conv * data.yearEndBasePay;			
	
	cr_lti_basePay.html($.formatNumber(yearEndBasePay, {format:getAmountFormat(data.ltiCurrency), locale:locale}) + " " + data.ltiCurrency);
	cr_lti_basePay.metadata().sortValue = yearEndBasePay;
	
	var cr_lti_target_pct = $('#cr_lti_body_td_all_target_pct');
	var cr_lti_target_pct_label = $('#cr_lti_body_td_all_target_pct_label');
	cr_lti_target_pct.html($.formatNumber(data.ltiTargetPer, {format:pctFormat, locale:locale}));
	cr_lti_target_pct.metadata().sortValue = data.ltiTargetPer;
	
	try
	{
		if(parseInt(profile.grade) > 17)
		{
			cr_lti_target_pct.hide();
			cr_lti_target_pct_label.hide();
		}
		else
		{
			cr_lti_target_pct.show();
			cr_lti_target_pct_label.show();			
		}
	
	}
	catch(e)
	{
		cr_lti_target_pct.show();
		cr_lti_target_pct_label.show();			
	}
	var cr_lti_target_amount = $('#cr_lti_body_td_all_target')
	
	var ltiTargetAmt = "";
	if(data.ltiTargetAmt != "")
		ltiTargetAmt = cr_lti_conv * data.ltiTargetAmt;			
			
	cr_lti_target_amount.html($.formatNumber(ltiTargetAmt, {format:getAmountFormat(data.ltiCurrency), locale:locale}));
	cr_lti_target_amount.metadata().sortValue = ltiTargetAmt;
	
	var cr_lti_recomm = $('#cr_lti_body_td_all_recomm')
	
	var ltiAmt = "";
	if(data.ltiAmt != "")
		ltiAmt = cr_lti_conv * data.ltiAmt;		
	
	cr_lti_recomm.html($.formatNumber(ltiAmt, {format:getAmountFormat(data.ltiCurrency), locale:locale}) + " " + data.ltiCurrency);
	cr_lti_recomm.metadata().sortValue = ltiAmt;	
	
	var cr_lti_currency = $('#cr_lti_body_td_all_currency');
	cr_lti_currency.html(data.ltiCurrency);	
	
	var cr_lti_planId = $('#cr_lti_body_td_all_planId');
	cr_lti_planId.html(data.ltiPlanId);	

	if(data.ltiInitial)
	{
		inputValue = langMap.planSheet_planDataInitial;
		cr_lti_pct.addClass("dis");
		cr_lti_pct.val(inputValue);
		$('#cr_lti_body_td_all_recomm').html('');
	}	

	processInfoBubbleInd('cr_lti', data.ltiReasons, data.ltiOutOfGuideline);
	
	var inputElem = $("#cr_lti_body_td_input_all_pct");
	var selectElem = $("#cr_lti_select_guideline_all_pct");	
	if(profile.potentialRating != "")
	{
		if(data.ltiActive)
		{
			selectElem.removeAttr('disabled');	
			inputElem.removeAttr('disabled');
		}
	}
	else
	{
		inputElem.attr('disabled','disabled');
		selectElem.attr('disabled','disabled');	
	}	
	
	
	
	
	
	inputValue = $.formatNumber(data.laiPercent, {format:pctFormat, locale:locale});
	if(!data.laiEligible)
	{
		$('#ind_entry_lai').hide();
		inputValue = "";
		cr_lai_pct.attr('disabled','disabled');
	}
	else if(!data.laiActive)
	{
		cr_lai_pct.attr('disabled','disabled');
		cr_lai_select.attr('disabled','disabled');		
	}


	var cr_lai_guidelines = $('#cr_lai_body_td_all_guidelines')
	if(!data.aiExec)
	{
		var laiGuidelines = data.laiGuidelines.split(',');
		cr_lai_guidelines.html("<span style='display:none' id='cr_lai_guideline_all_guidelines'>" + data.laiGuidelines + "</span>" + $.formatNumber(laiGuidelines[0], {format:pctFormat, locale:locale}) + "% - " + $.formatNumber(laiGuidelines[1], {format:pctFormat, locale:locale}) + "%");	
	}
	else
	{
		cr_lai_guidelines.html(langMap.planSheet_planStatusGuideExec);
	}
	
	var cr_lai_pct_body = $('#cr_lai_body_td_all_pct')
	cr_lai_pct_body.metadata().sortValue = data.laiPercent;	
	
	
	cr_lai_pct.val(inputValue);
	cr_lai_pct.attr('prevValue', ((!data.laiInitial)?data.laiPercent:""));
	cr_lai_pct.metadata().sortValue = data.laiPercent;
	
	var cr_lai_recomm = $('#cr_lai_body_td_all_recomm')
	
	var laiAmt = "";
	if(data.laiAmt != "")
		laiAmt = cr_lai_conv * data.laiAmt;	
	
	cr_lai_recomm.html($.formatNumber(laiAmt, {format:getAmountFormat(data.laiCurrency), locale:locale}) + " " + data.laiCurrency);	
	cr_lai_recomm.metadata().sortValue = laiAmt;
	
	var cr_lai_target = $('#cr_lai_body_td_all_target')
	
	var laiTargetAmt = "";
	if(data.laiTargetAmt != "")
		laiTargetAmt = cr_lai_conv * data.laiTargetAmt;		
	
	cr_lai_target.html($.formatNumber(laiTargetAmt, {format:getAmountFormat(data.laiCurrency), locale:locale}) );	
	cr_lai_target.metadata().sortValue = laiTargetAmt;	
	
	var cr_lai_currency = $('#cr_lai_body_td_all_currency');
	cr_lai_currency.html(data.laiCurrency);
	
	var cr_lai_planId = $('#cr_lai_body_td_all_planId');
	cr_lai_planId.html(data.laiPlanId);	
	
	if(data.laiInitial)
	{
		inputValue = langMap.planSheet_planDataInitial;
		cr_lai_pct.addClass("dis");
		cr_lai_pct.val(inputValue);
		$('#cr_lai_body_td_all_recomm').html('');
	}

	processInfoBubbleInd('cr_lai', data.laiReasons, data.laiOutOfGuideline);	
	
	if(!data.aiEligible && !data.laiEligible)
	{
		$('#annualIncentiveLegendContainer').hide();	
		$('#annualIncentiveDetailContainer').hide();
		$('#annualIncentiveDetailContainerNotEligible').show();
	}	
		
	
	if(newMrtValues != null)
	{
		cr_merit_pct.attr('updatedSummary', 'true');
		cr_merit_pct.trigger('change');
	}
	if(newAiValues != null)
	{
		var eh = getEventHandler('cr_lai' , 'pct');
	
		if(eh.map.synchToPlan) {
			$('#' + eh.map.synchToPlan + '_body_td_input_' + 'all' + '_' + 'pct').attr('updatedSummary', 'true');
		}		
		
		cr_ai_pct.attr('updatedSummary', 'true');
		cr_lai_pct.attr('updatedSummary', 'true');
		cr_ai_pct.trigger('change');
	}
	if(newLtiValues != null)	
	{
		cr_lti_pct.attr('updatedSummary', 'true');
		cr_lti_pct.trigger('change');
	}
	if(newLaiValues != null)
	{
		var eh = getEventHandler('cr_ai' , 'pct');	
	
		if(eh.map.synchToPlan) {
			$('#' + eh.map.synchToPlan + '_body_td_input_' + 'all' + '_' + 'pct').attr('updatedSummary', 'true');
		}	
	
		cr_ai_pct.attr('updatedSummary', 'true');
		cr_lai_pct.attr('updatedSummary', 'true');
		cr_lai_pct.trigger('change');
	}
	if(newPotentialLtiValues != null)
		$("#crt_lti_select_potential_all_pct").trigger('change');
		
	$.fancybox.resize();		
}

function loadAnnualIncentiveDetail(data)
{
	
	$('#ai_detail_info').removeBubbletip();	
	$('#ai_detail_total').removeBubbletip();	
	
	var tableBody = [];
	var periods = data.periods;	
	
	for(var x = 0; x < periods.length; x++)
	{
		if(periods[x].execPlan)
		{
			$('#annualIncentiveLegendContainer').hide();	
			$('#annualIncentiveDetailContainer').hide();
			$('#annualIncentiveDetailContainerNotEligible').hide();
			$('#annualIncentiveDetailContainerExec').show();
			return;		
		}
	}
	
	var cr_ai_currency = $('#cr_ai_body_td_all_currency').html();
	var cr_lai_currency = $('#cr_ai_body_td_all_currency').html();
	var cr_ai_conv = currency[cr_ai_currency].decFactor;	
	var cr_lai_conv = currency[cr_lai_currency].decFactor;	
			
	
	tableBody.push('	<div class="ai_totals_wrapper">\n');
	tableBody.push('		<div class="ai_total_multiply"></div>\n');
	tableBody.push('		<div class="ai_total_equals"></div>\n');

	tableBody.push('		 <div class="callout_box align_c">\n');        
	tableBody.push('			<p class="callout_box_hdr">' + langMap.indPlan_aidTotalFactor + '</p>\n');
	tableBody.push('			<p>' + $.formatNumber(data.performFactor, {format:pctFormat, locale:locale}) + '%</p>\n');
	tableBody.push('		</div>\n');

	tableBody.push('		<div class="callout_box align_c">\n');        
	tableBody.push('			<p class="callout_box_hdr">' + langMap.indPlan_aidTotalTargetAmount + '</p>\n');
	
	var totalAdjustedTarget = cr_ai_conv * data.totalAdjustedTarget;				
	
	tableBody.push('			<p>' + $.formatNumber(totalAdjustedTarget, {format:getAmountFormat(cr_ai_currency), locale:locale}) + ' ' + data.currency +'<span class="err">*</span></p>\n');
	tableBody.push('		</div>\n');

	tableBody.push('		 <div class="callout_box align_c">\n');        
	tableBody.push('			<p class="callout_box_hdr">' + langMap.indPlan_aidTotalRecomm + '</p>\n');
	
	var annualReco = "";
	if(data.annualReco != "")
		annualReco = cr_ai_conv * data.annualReco;	
	
	//update the values
	var laiAmt = "";
	if(data.annualLAIReco != "")
		laiAmt = cr_lai_conv * data.annualLAIReco;
		
	var gaiAmt = "";
	if(data.annualAIReco != "")
		gaiAmt = cr_ai_conv * data.annualAIReco;		
	
	$('#ai_detail_total_bubble_global').html($.formatNumber(gaiAmt, {format:getAmountFormat(cr_ai_currency), decimalToRound:0, locale:locale}) + " " + cr_ai_currency);
	$('#ai_detail_total_bubble_local').html($.formatNumber(laiAmt, {format:getAmountFormat(cr_lai_currency), decimalToRound:0, locale:locale}) + " " + cr_lai_currency);	
	
	tableBody.push('			<p>' + $.formatNumber(annualReco, {format:getAmountFormat(cr_ai_currency), decimalToRound:0, locale:locale}) + ' ' + data.currency + '<a id="ai_detail_total" href="#"><img class="ai_detail_total_img" src="' + imageBuilder(rp, 'icon_info', postImg, 'png') + '" align="bottom"></a></p>\n');
	tableBody.push('		</div>\n');
		
	tableBody.push('		<div class="ai_details_arrow"></div>\n');		
		
		
	tableBody.push('	</div>\n');

	tableBody.push('	 <table cellspacing="0" class="tablesorter ai_tablesorter">\n');
	tableBody.push('		<thead>\n');
	tableBody.push('			<tr>\n');
	tableBody.push('				<th class="ai"><span class="ai_info"><a id="ai_detail_info" href="#"><img src="' + imageBuilder(rp, 'icon_info', postImg, 'png') + '" /></a></span>' + langMap.indPlan_aidPeriod + '</th>\n');
	for(var x = 0; x < periods.length; x++)
	{
		tableBody.push('				<th class="ai last-child">' + periods[x].startDate + " " + langMap.indPlan_dateSeperator + " " + periods[x].endDate + '</th>\n');
	}
	tableBody.push('			</tr>\n');
	tableBody.push('		</thead>\n');	

	tableBody.push('		<tbody>\n');

	//if($('#ind_entry_ai').css('display') != 'none' && $('#ind_entry_lai').css('display') != 'none')
	//{
		tableBody.push('				<tr>\n');
		tableBody.push('					<td class="col_hdr first-child"><a href=# class="tooltip">' + langMap.indPlan_aidPlan + '<span>' + langMap.indPlan_aidPlanTip + '</span></a></td>\n');
		for(var x = 0; x < periods.length; x++)
		{
			tableBody.push('				<td class="col_hdr"><strong>' + periods[x].text + '</strong></td>\n');
		}				   
		tableBody.push('			</tr>\n');			   
	//}
	
	if(periods.length > 1)
	{
		tableBody.push('				<tr>\n');
		tableBody.push('					<td class="col_hdr first-child"><a href=# class="tooltip">' + langMap.indPlan_aidReason + '<span>' + langMap.indPlan_aidReasonTip + '</span></a></td>\n');
		for(var x = 0; x < periods.length; x++)
		{
			tableBody.push('				<td class="col_hdr"><strong>' + periods[x].reasonTxt + '</strong></td>\n');
		}				   
		tableBody.push('			</tr>\n');			   
	}

	tableBody.push('			<tr>\n');			   
	tableBody.push('				<td class="col_hdr first-child"><a href=# class="tooltip">' + langMap.indPlan_aidPeriodDetails + '<span>' + langMap.indPlan_aidPeriodDetailsTip + '</span></a></td>\n');				
	for(var x = 0; x < periods.length; x++)
	{
		tableBody.push('			<td class="col_hdr">' + langMap.indPlan_aidGrade + ': ' + periods[x].grade + ' &nbsp;&nbsp;' + langMap.indPlan_aidDaysText + ': ' + periods[x].proNumDays + '<br />' + langMap.indPlan_aidFundingUnit + ': ' + periods[x].businessUnit + '</td>\n');
	}	   
	tableBody.push('			</tr>\n');			   	
	
	tableBody.push('			<tr>\n');
    tableBody.push('				<td class="line-r first-child">' + langMap.indPlan_aidProrationCtr + ' <a href=# class="tooltip">' + langMap.indPlan_aidProration + '<span>' + langMap.indPlan_aidProrationTip + '</span></a></td>\n');
	for(var x = 0; x < periods.length; x++)
	{
		tableBody.push('				<td>' + $.formatNumber(periods[x].proPercent, {format:pctFormat, locale:locale}) + '%</td>\n'); 
	}
	tableBody.push('			</tr>\n');
	
	tableBody.push('			<tr>\n');
    tableBody.push('				<td class="line-r first-child">' + langMap.indPlan_aidTargetCtr + ' <a href=# class="tooltip">' + langMap.indPlan_aidTarget + '<span>' + langMap.indPlan_aidTargetTip + '</span></a></td>\n');
	var cellSizes = [];
	var temp = [];
	for(var x = 0; x < periods.length; x++)
	{
		var formatted = $.formatNumber(periods[x].targetPercent, {format:pctFormat, locale:locale});
		temp[x] = formatted.length;
		tableBody.push('				<td class="multiply">' + formatted + '%</td>\n'); 
	}
	cellSizes[0] = temp;
	temp = [];
	tableBody.push('			</tr>\n');	
	
	tableBody.push('			<tr>\n');
    tableBody.push('				<td class="line-r first-child">' + langMap.indPlan_aidSalaryCtr + ' <a href=# class="tooltip">' + langMap.indPlan_aidSalary + '<span>' + langMap.indPlan_aidSalaryTip + '</span></a></td>\n');
	for(var x = 0; x < periods.length; x++)
	{
		
		var yearEndSalary = "";
		if(periods[x].yearEndSalary != "")
			yearEndSalary = cr_ai_conv * periods[x].yearEndSalary;	
		
		var formatted = $.formatNumber(yearEndSalary, {format:getAmountFormat(cr_ai_currency), locale:locale});
		temp[x] = formatted.length;
		tableBody.push('				<td class="multiply">' + formatted + '</td>\n'); 
	}
	cellSizes[1] = temp;
	temp = [];
	tableBody.push('			</tr>\n');	

	tableBody.push('			<tr>\n');
    tableBody.push('				<td class="line-r first-child">' + langMap.indPlan_aidEmploymentCtr + ' <a href=# class="tooltip">' + langMap.indPlan_aidEmployment + '<span>' + langMap.indPlan_aidEmploymentTip + '</span></a></td>\n');
	for(var x = 0; x < periods.length; x++)
	{
		var formatted = $.formatNumber(periods[x].empPercent, {format:pctFormat, locale:locale});
		temp[x] = formatted.length;
		tableBody.push('				<td class="multiply">' +formatted + '%</td>\n'); 
	}
	cellSizes[2] = temp;
	temp = [];
	tableBody.push('			</tr>\n');
	
	tableBody.push('			<tr>\n');
    tableBody.push('				<td class="line-r first-child">' + langMap.indPlan_aidMultiplierCtr + ' <a href=# class="tooltip">' + langMap.indPlan_aidMultiplier + '<span>' + langMap.indPlan_aidMultiplierTip + '</span></a></td>\n');
	for(var x = 0; x < periods.length; x++)
	{
		if(parseInt(periods[x].otherMultiplier) != 0) {
			var formatted = $.formatNumber(periods[x].otherMultiplier, {format:pctFormat, locale:locale});
			temp[x] = formatted.length;
			tableBody.push('				<td class="multiply">' + formatted + '%</td>\n'); 
		}
		else {
			temp[x] = langMap.indPlan_aidOtherNA.toString().length;
			tableBody.push('				<td class="multiply">' + langMap.indPlan_aidOtherNA + '</td>\n'); 
	}
	}
	cellSizes[3] = temp;
	temp = [];
	tableBody.push('			</tr>\n');	
	
	tableBody.push('			<tr>\n');
    tableBody.push('				<td class="line-r first-child">' + langMap.indPlan_aidFundingCtr + ' <a href=# class="tooltip">' + langMap.indPlan_aidFunding + '<span>' + langMap.indPlan_aidFundingTip + '</span></a></td>\n');
	for(var x = 0; x < periods.length; x++)
	{
		var formatted = $.formatNumber(periods[x].businessFunding, {format:pctFormat, locale:locale});
		temp[x] = formatted.length;
		tableBody.push('				<td class="multiply err">' + formatted + '%*</td>\n'); 
	}
	cellSizes[4] = temp;
	tableBody.push('			</tr>\n');		


	tableBody.push('			<tr>\n');	
	tableBody.push('				<td class="ai_detail_total  first-child">\n');	
	
	var totalAdjustedTarget = "";
	if(data.totalAdjustedTarget != "")
		totalAdjustedTarget = cr_ai_conv * data.totalAdjustedTarget;		
	
	tableBody.push('			     <span class="float_right">' + $.formatNumber(totalAdjustedTarget, {format:getAmountFormat(cr_ai_currency), locale:locale}) + ' ' + data.currency + ' = </span>\n');	
	tableBody.push('			      <a href=# class="tooltip">' + langMap.indPlan_aidTargetAmount + '<span>' + langMap.indPlan_aidTargetAmountTip + '</span></a>\n');	
	tableBody.push('				</td>\n');	
	for(var x = 0; x < periods.length; x++)
	{
		
		var adjTarget = "";
		if(data.adjTarget != "")
			adjTarget = cr_ai_conv * periods[x].adjTarget;		
		tableBody.push('			    <td class="ai_detail_total">' + $.formatNumber(adjTarget, {format:getAmountFormat(cr_ai_currency), locale:locale}) + ' ' + periods[x].currency +'</td> \n');
	}

	tableBody.push('			</tr>\n');	
	tableBody.push('		</tbody>\n');	
	tableBody.push('	</table>\n');		
	 

	$('#annualIncentiveDetailContainer').html(tableBody.join(''));

	$('#ai_detail_info').bubbletip($('#ai_detail_info_bubble')
	, { delayShow: delayShowOnMouseOver,
		delayHide: 0,
		calculateOnShow: true,
		deltaDirection: 'up'
	});	

	if($('#ind_entry_ai').css('display') != 'none' && $('#ind_entry_lai').css('display') != 'none')
	{	
		$('#ai_detail_total').show();
		$('#ai_detail_total').bubbletip($('#ai_detail_total_bubble')
		, { delayShow: delayShowOnMouseOver,
			delayHide: 0,
			calculateOnShow: true,
			deltaDirection: 'up'
		});
	}
	else
	{
		$('#ai_detail_total').hide();	
	}		
     
	var columnMaxs = [];
	for(var i=0; i < cellSizes[0].length; i++){
		var temp1 = [];
		for(var j=0; j<cellSizes.length; j++){
			var elem = cellSizes[j][i];	
			temp1[j] = elem;
		}
		var rowMax = Math.max.apply(null, temp1);
		columnMaxs[i] = rowMax;
	}
     
    var table = $("#fancybox-inner table.tablesorter").first();
    var trs = table.find('tr');
    var targets = trs.slice(trs.length - 6,-1);
    var res = $.map(targets, function(val){ var tds = $(val).find('td').slice(1); return tds});
    var tds = [];
   	for(var i=0; i<res[0].length; i++){
   		var columnTds = [];
   		for(var j=0; j<res.length; j++){
   			var td = res[j][i];
   			columnTds[j] = td;
   		}
   		tds[i] = columnTds;
   	}

   	var initialMargin = 60;
   	var imageUrl = imageBuilder(rp,'icon_multiply', postImg, 'gif')
   	var cellWidth = tds
   	$.map(tds, function(value, index){ 
   		var symbols = columnMaxs[index];
   		var $value = $(value);
   		var width  = $value.width();

   		var margin = (100 - symbols*5/(width/100))/1.75;
   		
   		var s ='url(' + imageUrl + ')';
   		$value.css({
   			background : s,
   			backgroundColor : '',
   			backgroundRepeat : 'no-repeat',
   			backgroundPosition : margin + "%"
   		});
   	});		
	$.fancybox.resize();
}

function getHistoricalDetailChart(plan, ctr)
{
	var xaxis = [];
	var yaxis = [];

	for(var i in plan.data)
	{
		var data = plan.data[i];
		if(data[plan.graph.xaxis].displayData != null && data[plan.graph.xaxis].displayData != "" && data[plan.graph.yaxis].displayData != null && data[plan.graph.yaxis].displayData != "")
		{
			xaxis.push(data[plan.graph.xaxis].displayData);
			yaxis.push($.trim(data[plan.graph.yaxis].displayData));
		}
	}

	if(ECM_DEBUG)$.log ("getHistoricalDetailChart bud: " + JSON.stringify(plan));
	
	var colorImg = "";
	if(ctr == 0)
		colorImg = "79868a";
	else if(ctr == 1)
		colorImg = "6087b1";
	else if(ctr == 2)
		colorImg = "1f477d";
	else if(ctr == 3)
		colorImg = "0a2952";		
		
	var chreq = "";
	
	if(xaxis.length > 1 && yaxis.length > 1 && (xaxis.length == yaxis.length))
		chreq = chartServer + "?cht=b&chd=" + xaxis.join(',') + ":" + yaxis.join(',') + "&chs=120x120&chco=ffffff&ly=%25&dco=" + colorImg;
		
	if(ECM_DEBUG)$.log ("END getHistoricalDetailChart: " + chreq);			
	return chreq;
}

function loadHistoricalDetail(data)
{
	var tableBody = [];

	tableBody.push('	<div class="history_graphs_wrapper">\n');
	ctr = 0;
	for(var i in data)
	{
		var plan = data[i];						 

		tableBody.push('		<div class="history_graph">\n');

		var dctr = 0;
		for(var x in plan.data)
		{
			dctr++;
			break;
		}
		
		var showGraph = false;
		
		if(dctr > 0)
		{
			showGraph = true;
		}
		
		var chreq = getHistoricalDetailChart(plan, ctr);
		tableBody.push('			<img historicalDetail="img" ' + ((showGraph && chreq != "")?'src="' + chreq:'style="visibility:hidden"') + '" />\n');
		
		if(showGraph && chreq != "")
		{
			tableBody.push('				<p>\n');
			tableBody.push('				' + plan.planName + '\n');
			tableBody.push('				</p>\n');
		}
		tableBody.push('		</div>\n');
		ctr++;
	}
	tableBody.push('   </div>\n');
	
		
	tableBody.push('   <div class="history_wrapper">\n');
	ctr = 0;
	for(var i in data)
	{
		var plan = data[i];		
		if(ctr == 0)
			tableBody.push('      <div class="ind_entry merit">\n');
		else if(ctr == 1)
			tableBody.push('      <div class="ind_entry ai">\n');
		else
			tableBody.push('      <div class="ind_entry lti">\n');
		tableBody.push('	' + plan.planName + '\n');
		tableBody.push('      </div>\n');
	
		tableBody.push('      <table cellspacing="1" class="tablesorter">\n');
		tableBody.push('   			<thead>\n');
		tableBody.push('   				<tr>\n');
		
		var colCtr = 0;
		for(var c in plan.columns)
		{		
			colCtr++;
			var col = plan.columns[c];
			tableBody.push('   					<th>' + col.name + '</th>\n');
		}
		
		tableBody.push('   				</tr>\n');
		tableBody.push('   			</thead>\n');
		tableBody.push('   			<tbody>\n');
		
		var dctr = 0;
		for(var c in plan.data)
		{
			dctr++;
			tableBody.push('   				<tr>\n');
			var rowData = plan.data[c];
			
			for(var d in rowData)
			{		
				var colData = rowData[d];
				if(colData.displayData != "")
					tableBody.push('   					<td>' + colData.displayData + '</td>\n');
				else
					tableBody.push('   					<td class="err">' + langMap.indPlan_histDetail_noDataFromSAP + '</td>\n');
			}			
			tableBody.push('   				</tr>\n');			
		}		
		
		if(dctr == 0)
		{
			tableBody.push('   				<tr>\n');
			tableBody.push('   					<td colspan="' + colCtr + '" class="err">' + langMap.indPlan_histDetail_noData + '</td>\n');
			tableBody.push('   				</tr>\n');						
		}
		
		tableBody.push('   			</tbody>\n');
		tableBody.push('   		 </table>\n');
		tableBody.push('   		 <br />\n');
		ctr++;
	}
	
	tableBody.push('   </div>\n');

	$('#historicalDetailContainer').html(tableBody.join(''));

	wrapDiv('historicalDetail', 0, -5, 130, 100)	
	$.fancybox.resize();
}

function getTotalCompensationChart(xaxis, yaxis)
{	
	if(ECM_DEBUG)$.log ("getTotalCompensationChart");
	
	var chreq = chartServer + "?cht=bs&chd=" + xaxis.join(',') + ":" + yaxis.join("_") + "&chl=LTI,AI,Salary,xyz&chs=500x200&chco=ffffff&ly=USD&dco=79868a,6087b1,1f477d,0a2952";
		
	if(ECM_DEBUG)$.log ("END getTotalCompensationChart : " + chreq);			
	return chreq;
}

function loadTotalCompensation(data)
{
	var tableBody = [];
	var xaxis = [];
	var yaxis = [];
	var yaxisentry = [];
	
	for(var q in data.yearMap)
	{	
		xaxis.push(q);
	}
	tableBody.push('   <div class="ind_entry merit">\n');
	tableBody.push('   	<table>\n');
	tableBody.push('   		<tr>\n');
	tableBody.push('   			<td>\n');
	tableBody.push('   	' + langMap.indPlan_tcTotal + '\n');
	tableBody.push('   			</td>\n');	
	tableBody.push('   			<td>\n');
	tableBody.push('   		<span class="usd">\n');
	tableBody.push('   	' + langMap.indPlan_tcUSDAmount + '\n');
	tableBody.push('   		</span>\n');	
	tableBody.push('   			</td>\n');	
	tableBody.push('   		</tr>\n');	
	tableBody.push('   	</table>\n');	
	tableBody.push('   </div>\n');
                           
	tableBody.push('   <table cellspacing="1" class="tablesorter">\n');
	tableBody.push('   	<thead>\n');
	tableBody.push('   		<tr>\n');
	tableBody.push('   			<th>' + langMap.indPlan_tcYear + '</th>\n');
	tableBody.push('   			<th>' + langMap.indPlan_tcPerfRating + '</th>\n');	
	var ctr = 0;
	for(var i in data.planMap)
	{
		var col = data.planMap[i];
		tableBody.push('   			<th>' + col.name + '</th>\n');	
		yaxisentry[ctr] = [];
		ctr++;
	}
	
	tableBody.push('   			<th>' + langMap.indPlan_tcTotalComp + '</th>\n');	
	tableBody.push('   		</tr>\n');
	tableBody.push('   	</thead>\n');
	tableBody.push('   	<tbody>\n');
	


	for(var i in data.totalMap)
	{

		tableBody.push('   		<tr>\n');
		var entry = data.totalMap[i];

		tableBody.push('   			<th>' + entry.year + ((!entry.activated)?"<p>" + langMap.indPlan_tcRecommended + "</p>":"") + '</th>\n');			
		tableBody.push('   			<th>' + entry.performRating + '</th>\n');			
		
		var ictr = 0;
		for(var t in data.planMap)
		{
			var col = data.planMap[t].id;
			var value = "";
			var dvalue = "";
			try
			{
				var conv = currency[data.yearMap[entry.year][col].currency].decFactor;	
				var amount = conv * data.yearMap[entry.year][col].amount;					
				
				dvalue = $.formatNumber(amount, {format:getAmountFormat(data.yearMap[entry.year][col].currency), locale:locale});
				value = $.parseNumber(dvalue, {format:getAmountFormat(data.yearMap[entry.year][col].currency), locale:locale});
			}catch(e)
			{}

			if(value == "")
				value = 0;
			yaxisentry[ictr].push(value);
			
			tableBody.push('   			<th>' + dvalue + '</th>\n');			
			ictr++;
		}		
		//alert(data.totalMap[entry.year].currency)
		var conv = currency[/*data.yearMap[entry.year][col].currency*/data.totalMap[entry.year].currency].decFactor;
		var total = conv * entry.total;			

		tableBody.push('   			<th>' + $.formatNumber(total, {format:getAmountFormat(/*data.yearMap[entry.year][col].currency*/data.totalMap[entry.year].currency), locale:locale}) + '</th>\n');			
		tableBody.push('   		</tr>\n');
	}
	
	
	tableBody.push('   	</tbody>\n');
	tableBody.push('   </table>\n');


	tableBody.push('   <table class="tot_tablesorter align_c">\n');
	tableBody.push('   	<tr>\n');
	tableBody.push('   	<td>\n');
	
	tableBody.push('   <table class="tot_tablesorter align_c">\n');
	var xctr = 0;
	var legend = [];
	for(var i in data.planMap)
	{
		var col = data.planMap[i];
		if(xctr == 0)
			legend.push('      <tr><td><div class="totalcomp_merit"></td><td align="left">' + col.name + '</td></tr>');
		else if(xctr == 1)
			legend.push('      <tr><td><div class="totalcomp_ai"></td><td align="left">' + col.name + '</td></tr>\n');
		else if(xctr == 2)
			legend.push('      <tr><td><div class="totalcomp_lti"></td><td align="left">' + col.name + '</td></tr>\n');
		else
			legend.push('      <tr><td><div class="totalcomp_lai"></td><td align="left">' + col.name + '</td></tr>\n');
		xctr++;
	}
	
	for(var lctr = legend.length - 1; lctr >= 0; lctr--)
	{
		tableBody.push(legend[lctr]);	
	}
	
	tableBody.push('   </table>\n');	
	
	
	//tableBody.push('   		<img src="' + imageBuilder(rp, 'img_totals_legend', postImg, 'gif') + '" />\n');
	tableBody.push('   	</td>\n');
	tableBody.push('   	<td>\n');
	
	
	for(var x = 0; x < yaxisentry.length; x++)
	{
		yaxis.push(yaxisentry[x].join(","));
	}
	tableBody.push('   		<img totalComp="img" src="' + getTotalCompensationChart(xaxis, yaxis) + '" />\n');
	tableBody.push('   	</td>\n');
	tableBody.push('   	</tr>\n');
	tableBody.push('   </table>\n');

	

	$('#totalCompensationContainer').html(tableBody.join(''));
	
	wrapDiv('totalComp', 0, -25, 525, 175)
	$.fancybox.resize();
}

function processInfoBubbleIndPotentialRating(tab, data)
{

	if(ECM_DEBUG)$.log ("START processInfoBubbleIndPotentialRating: tab: " + tab);

	var guideSelect = $("#" + tab + "_select_potential_all_pct");
	guideSelect.attr('style','');
	guideSelect.empty();
	guideSelect.append('<option value="">' + langMap.planSheet_potentialRatingSelect + '</option>');
	for(var x = 0; x < potentialRatingList.length; x++)
	{
		var indGuide = potentialRatingList[x];
		guideSelect.append('<option value="' + indGuide.value + '" ' + ((indGuide.value == data.profile.potentialRating)?'selected':'') + '>' + indGuide.name + '</option>');
	}


	/*var potentialImg = $('#' + tab + '_img_potential_all_pct');

	if(data.profile.potentialRating == "")
		potentialImg.attr('src',imageBuilder(rp, 'icon_warning_on', postImg, 'gif'));
	else
		potentialImg.attr('src',imageBuilder(rp, 'icon_warning_off', postImg, 'gif'));			
		
	potentialImg.show();*/

	$('#' + tab + "_select_potential_all_pct").removeAttr("disabled");	
	if(!data.summary.ltiEligible || !data.summary.ltiOpeCheck)
	{
		$('#' + tab + "_select_potential_all_pct").attr("disabled","disabled");
	}
		
		
	var params = {tab:tab, pernr:'all', id:'pct', ltiActive:data.summary.ltiActive};	
	
	$('#' + tab + "_select_potential_all_pct").unbind('change.event');
	$('#' + tab + "_select_potential_all_pct").bind('change.event',params,
			function(event){
				var params = event.data;
				var potentialRating = $('#' + params.tab + "_select_potential_" + params.pernr + "_" + params.id).val();
				
				/*var imgG = $('#' + params.tab + "_img_potential_" + params.pernr + "_" + params.id);
				if(potentialRating == "")
					imgG.attr('src',imageBuilder(rp, 'icon_warning_on', postImg, 'gif'));
				else
					imgG.attr('src',imageBuilder(rp, 'icon_warning_off', postImg, 'gif'));
				*/
				$('#' + params.tab + "_potential_rating_" + params.pernr + "_" + params.id).html($('#' + params.tab + "_select_potential_" + params.pernr + "_" + params.id + " option:selected").text());
				var pernr = $('#ipPernr').html();				
				var tab = $('#cr_lti_body_td_all_planId').html();;
									
				if(params.ltiActive)
				{
					var performanceRating = $("#" + params.tab + "_span_perf_rating_" + params.pernr + '_' + params.id).html();
					var newGuidelines = ((potentialRating == "" || performanceRating == "")?"0,0":potentialRatingMap[potentialRating][performanceRating]);
					if(ECM_DEBUG)$.log ("potentialRating: " + potentialRating + " performanceRating: " + performanceRating + " potentialRatingMap[potentialRating][performanceRating]: " + newGuidelines);
	
					var guidelines = newGuidelines.split(',');
					
					var content = "<span style='display:none' id='" + params.tab + "_guideline_" + params.pernr + "_guidelines'>" + newGuidelines + "</span>" + $.formatNumber(guidelines[0], {format:pctFormat, locale:locale}) + "% - " + $.formatNumber(guidelines[1], {format:pctFormat, locale:locale}) + "%";
					$('#' + params.tab + '_body_td_' + params.pernr + '_guidelines').html(content);
	
					var inputElem = $("#" + params.tab + "_body_td_input_" + params.pernr + "_pct");
					var selectElem = $("#" + params.tab + "_select_guideline_" + params.pernr + "_pct");	
					if(performanceRating != "")
					{						
						if(potentialRating != "")
						{
							selectElem.removeAttr('disabled');	
							inputElem.removeAttr('disabled');
							inputElem.trigger('change');
						}
						else
						{
							inputElem.val("0");
							inputElem.trigger("change")
							inputElem.attr('disabled','disabled');
							selectElem.attr('disabled','disabled');	
						}
					
						//$("#" + params.tab + "_close_potential_" + params.pernr + "_" + params.id).trigger('click');
					}
					/*if(params.tab == "cr_merit")
						tab = $('#cr_merit_body_td_all_planId').html();
					else if(params.tab == "cr_ai")
						tab = $('#cr_ai_body_td_all_planId').html();
					else if(params.tab == "cr_lti")
						tab = $('#cr_lti_body_td_all_planId').html();*/	
				}
				//a rule exists which will allow us to read the event handler data
				var eh = getEventHandler('cr_lti', 'pot')
				
				
				/*if(potentialRating == "")
				{
					if(indPlanRatingChanges[tab + "," + pernr] != null)
						indPlanRatingChanges[tab + "," + pernr] = null;
				}
				else*/
					indPlanRatingChanges[tab + "," + pernr] = tab + "," + pernr + "," + potentialRating + "," + eh.map.colId + ((eh.map.copyColToSummary)?"," + eh.map.copyTab + "," + eh.map.copyCol:"");
					
				//$.fancybox.resize();					
			});		
		
	$('#' + tab + '_potential_rating_trigger_all_pct').unbind('click.event');
	$('#' + tab + '_potential_rating_trigger_all_pct').bind('click.event', params, processPopRatingBubble);
}

function processInfoBubbleInd(tab, reasons, outGuide)
{
	//set the guideline reasons
	var guidelineReasons = reasons;
	var guideSelect = $("#" + tab + "_select_guideline_all_pct");
	guideSelect.attr('style','');
	guideSelect.empty();
	guideSelect.append('<option value="">' + langMap.indPlan_guideLineSelect + '</option>');
	for(var x = 0; x < guidelineReasons.length; x++)
	{
		var indGuide = guidelineReasons[x];
		guideSelect.append('<option value="' + indGuide.value + '" ' + ((indGuide.value == outGuide.reason)?'selected':'') + '>' + indGuide.name + '</option>');
	}
	
	var meritImg = $('#' + tab + '_img_guideline_all_pct');
	if(outGuide.out)
		meritImg.show();
	else
		meritImg.hide();
		
	meritImg.attr('src', imageBuilder(rp, ((outGuide.out && outGuide.reason == "")?'icon_warning_on':'icon_warning_off'), postImg, 'gif'));		

	var params = {id:'pct', tab:tab, pernr:'all'};

	$('#' + tab + '_select_guideline_all_pct').unbind('change.event');
	$('#' + tab + '_select_guideline_all_pct').bind('change.event',params,
			function(event){
				var params = event.data;
				var eh = getEventHandler(params.tab , 'pct');								
				
				var pct = $("#" + params.tab + "_body_td_all_pct").metadata().sortValue;
				validateGuidelines(params.tab, 'all', 'pct', pct, eh);
				//call synch is a variable used to put a lock on calling over and over the synch call.
				if(eh.map.synchToPlan && synchInProgress[eh.map.synchToPlan + '_' + lconst.SYNCH_OUT_REASON_LOCK] == null)
				{
					if(!$('#' + eh.map.synchToPlan + '_body_td_input_' + params.pernr + '_' + params.id).attr('disabled'))
					{
						if(ECM_DEBUG)$.log ("Synching tab " + id + " to plan " + eh.map.synchToPlan + " to id: " + eh.map.synchToPlan + "_select_guideline_" + params.pernr + "_" + params.id);
						synchInProgress[tab + '_' + lconst.SYNCH_OUT_REASON_LOCK] = "";
						$('#' + eh.map.synchToPlan + '_select_guideline_' + params.pernr + '_' + params.id).val(this.value).trigger('change');
					}

				}	
				else
					synchInProgress[eh.map.synchToPlan + '_' + lconst.SYNCH_OUT_REASON_LOCK] = null;				
				//$("#" + params.tab + "_close_guideline_all_pct").trigger('click');
				//$.fancybox.resize();
			});
	
	var inputBox = 	$('#' + tab + '_body_td_input_all_pct');

	if(inputBox && outGuide.out && outGuide.reason != "")
		inputBox.addClass('err');

	$('#' + tab + '_img_guideline_all_pct').unbind('click.event');
	$('#' + tab + '_img_guideline_all_pct').bind('click.event', params, processPopBubble);
	$('#' + tab + '_body_td_input_all_pct').unbind('focus.event');	
	$('#' + tab + '_body_td_input_all_pct').bind('focus.event', params, processPopBubble);	
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

function savePlanSheet(submitForm)
{
	if(submitForm)
	{
		if($('#submitRecoBttn').hasClass('bttn_disabled'))
			return;	
	}
	else
	{
		if($('#saveRecoBttn').hasClass('bttn_disabled'))
			return;	
	}
	
	$('#error_list_P').hide();
	/*
	if(!validateEntries(planChanges))
	{
		alert("please select a reason")
		return;
	}	*/
	
	if(submitForm)
	{
		saveSubForm();
	}
	else
		saveForm('P', false, false, false, '','');
}

function saveIndComp(exit)
{
	if($('#saveIndBttn').hasClass('bttn_disabled'))
		return;
	
	saveForm('I', exit, false, false, '','');
	
}

function exitAndSave()
{
	
	if($('#yesExit').hasClass('bttn_disabled'))
		return;			
	
	$.fancybox.close();
	saveForm('P', true, true, false,'','');	
}

function exitForm()
{
	
	var ctr = 0;
	for(var i in planChanges)
	{
		if(planChanges[i] != null)
		{
			ctr++;
		}
	}
	
	var rateCtr = 0;
	for(var i in planRatingChanges)
	{
		if(planRatingChanges[i] != null)
		{
			rateCtr++;
		}
	}	
	
	if(ctr > 0 || rateCtr > 0)
		$('#exitTrigger').trigger('click');
	else
	{
		standardPromptForExit = false;
		window.close();
	}
}

function saveSubForm()
{
	getBudget("I");
}

function submitForm()
{
	saveForm('P', false, false, true, '', '');
}