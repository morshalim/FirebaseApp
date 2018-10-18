var SYSTEM_DATE_FORMAT = 'yymmdd';
var addReviewPlanMessage = '';
$(document).ready(function() {
	buildReviewPlans(reviewsList);
	//buildReviewInfo(reviewInfoList);

	getReviewdetails(reviewsList[0]);
	
	showStatusMessage = $("#show_status").html();
	$("#show_status").remove();

	//initializing datepicker
	$.fn.bootstrapDP = $.fn.datepicker;
	var oldie = /msie\s*(8|7|6)/.test(navigator.userAgent.toLowerCase());
	$('.easy-pie-chart.percentage').each(function() {
		$(this).easyPieChart({
			barColor : $(this).data('color'),
			trackColor : '#d6dadd',
			scaleColor : false,
			lineCap : 'butt',
			lineWidth : 4,
			animate : oldie ? false : 1000
		}).css('color', $(this).data('color'));
	});
	addReviewPlanMessage = $("#addplan_dlg").html();
	$("#addplan_dlg").remove();
	$('div[id="selection_box"] a').first().trigger('click');
	$("#selection_box").children(":first").addClass('sel_box');	
});

function addPopup(){
	$("#addplan").on('click',function() {
		bootbox.dialog({
			message : addReviewPlanMessage,
			title : langMap.js_workbench_add_review_plan_popup_title,
			buttons : {
				success : {
					label : langMap.js_workbench_add_review_plan_add_btn,
					className : "btn-success",
					"callback": function() {
						addReviewPlan();
						return false;
					}
				},
				danger : {
					label : langMap.js_workbench_add_review_plan_cancel_btn,
					className : "btn-default",
					"callback": function() {
						bootbox.hideAll();
						return false;
					}
				}

			}
		});
		$('#startDate').bootstrapDP({});
		$('#endDate').bootstrapDP({});
		$('#selectionDate').bootstrapDP({});
		bindDecimalValidationEvent("adjustmentFactor");
	});
	
	$('a[id="reviewPlan"]').on('click',function() {
		getReviewPlanData();
	});
	
}
function showEditPopup(element){
	var reviewId=$(element).attr('reviewId');
	var reviewTitle=$(element).attr('reviewTitle');
	var startDate=$(element).attr('startDate');
	var endDate=$(element).attr('endDate');
	var selectionDate=$(element).attr('selectionDate');
	var adjustmentFactor=$(element).attr('adjustmentFactor');
	var worksheetRequired=$(element).attr('worksheetRequired');
	var showReviews=$(element).attr('showReviews');
	var showStatements=$(element).attr('showStatements');
	var showReports=$(element).attr('showReports');
	//$('#reviewId').val(reviewId);
	
		bootbox.dialog({
			message : addReviewPlanMessage,
			title : langMap.js_workbench_edit_review_plan_popup_title,
			buttons : {
				success : {
					label : langMap.js_workbench_edit_review_plan_save_btn,
					className : "btn-success",
					"callback": function() {
						editReviewPlan(reviewId);
						return false;
					}
				},
				danger : {
					label : langMap.js_workbench_add_review_plan_cancel_btn,
					className : "btn-default",
					"callback": function() {
						bootbox.hideAll();
						return false;
					}
				}

			}
		});
		$('#startDate').bootstrapDP({});
		$('#endDate').bootstrapDP({});
		$('#selectionDate').bootstrapDP({});
		$('#revId').val(reviewId);
		$('#revId').attr('disabled',true);
		$('#reviewName').val(reviewTitle);
		$('#reviewName').attr('disabled',true);
		$('#startDate').val(getDateFormatForDisplay(startDate));
		$('#endDate').val(getDateFormatForDisplay(endDate));
		$('#selectionDate').val(getDateFormatForDisplay(selectionDate));
		$('#reviewName').val(reviewTitle);
		$('#adjustmentFactor').val(adjustmentFactor);
		if(worksheetRequired == '1')
			$('#worksheetRequired').val("true");
		else
			$('#worksheetRequired').val("false");
		if(showReviews == 'true')
			$('#showReviews').val('true');
		else
			$('#showReviews').val("false");
		if(showStatements == 'true')
			$('#showStatements').val('true');
		else
			$('#showStatements').val("false");
		if(showReports == 'true')
			$('#showReports').val('true');
		else
			$('#showReports').val("false");
		bindDecimalValidationEvent("adjustmentFactor")
	$('a[id="reviewPlan"]').on('click',function() {
		getReviewPlanData();
	});
	
}

function bindDecimalValidationEvent(id){
	
	$("#"+id).keydown(function(event){
		var value=parseFloat($('#adjustmentFactor').val());
		
			if (event.shiftKey == true) {
				event.preventDefault();
			}
		
			if ((event.keyCode >= 48 && event.keyCode <= 57) ||
				(event.keyCode >= 96 && event.keyCode <= 105) ||
				event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 37 ||
				event.keyCode == 39 || event.keyCode == 46 || event.keyCode == 190 || event.keyCode == 110) {
				
			} else {
				event.preventDefault();
			}
		
			if($(this).val().indexOf('.') !== -1 && (event.keyCode == 190 || event.keyCode == 110))
				event.preventDefault();
			else if($(this).val().indexOf('.') == -1 && ((event.keyCode >= 48 && event.keyCode <= 57) ||
					(event.keyCode >= 96 && event.keyCode <= 105))){
				if($(this).val() && $(this).val() > 0)
					event.preventDefault();
			}
			if($(this).val().split('.').length>=2 && event.keyCode != 8){
				if($(this).val().split('.')[1].length>=4){
					event.preventDefault();
				}
			}
				
	});
}

function getReviewdetails(ele) {
	var review = $(ele).attr("reviewTitle") || ele.reviewTitle;
	var startDate=$(ele).attr("startDate") || ele.startDate;
	var endDate=$(ele).attr("endDate") || ele.endDate;
	var selectionDate=$(ele).attr("selectionDate") || ele.selectionDate;
	var reviewId=$(ele).attr("reviewId") || ele.reviewId;
	var adjustmentFactor=$(ele).attr("adjustmentFactor") || ele.adjustmentFactor;
	var worksheetRequired=$(ele).attr("worksheetRequired") || ele.worksheetRequired;
	if(ele.reviewAttributes){
		$.each(ele.reviewAttributes,function(attrCount,attr){
			if("CMP_ADJ_FCT" == attr.reviewAttributeId)
				adjustmentFactor = attr.value;
			else if("CMP_WS_REQUIRED" == attr.reviewAttributeId)
				worksheetRequired = attr.value;
				
		});
	}
	var showReviews=$(ele).attr("showReviews") || ele.showReviews;
	var showStatements = $(ele).attr("showStatements") || ele.inStatements;
	var showReports = $(ele).attr("showReports") || ele.inReports;
	$('#reviewId').html(review);
	$('#planStartDateId').html(getDateFormatForDisplay(startDate));
	$('#planEndDateId').html(getDateFormatForDisplay(endDate));
	$('#selectionDateId').html(getDateFormatForDisplay(selectionDate));
	if(worksheetRequired == '1')
		$('#worksheetRequiredId').html("Yes");
	else
		$('#worksheetRequiredId').html("No");
	if(showReviews == 'true')
		$('#showReviewId').html("Yes");
	else
		$('#showReviewId').html("No");
	if(showStatements == 'true')
		$('#showReviewStatements').html("Yes");
	else
		$('#showReviewStatements').html("No");
	if(showReports == 'true')
		$('#showReviewReports').html("Yes");
	else
		$('#showReviewReports').html("No");
	$('#adjustmentFactorId').html(adjustmentFactor);
	toggleCss(reviewId);
	
}

function buildReviewPlans(data){
	var html=[];
	$.each(data,function(index,item){
		var adjustmentFactor = "";
		var worksheetRequired = "";
		$.each(item.reviewAttributes,function(attrCount,attr){
			if("CMP_ADJ_FCT" == attr.reviewAttributeId)
				adjustmentFactor = attr.value;
			else if("CMP_WS_REQUIRED" == attr.reviewAttributeId)
				worksheetRequired = attr.value;
				
		});
		html.push('<div id="'+item.reviewId+'" class="well" rel="reviewPlanDiv">');
		html.push('		<h4 class="blue"><a href="#" id="reviewPlan" reviewId="'+item.reviewId+'" active="'+item.active+'" adjustmentFactor="'+adjustmentFactor+'" worksheetRequired="'+worksheetRequired+'" reviewTitle="'+item.reviewTitle+'" showReviews="'+item.inHistory+'" showStatements="'+item.inStatements+'" showReports="'+item.inReports+'" startDate='+item.startDate+'  endDate='+item.endDate+' selectionDate='+item.selectionDate+' onclick="getReviewdetails(this)">'+item.reviewTitle+'</a>');
		html.push('			<div class="btn-group">');
		html.push('				<button data-toggle="dropdown" class="btn btn-xs btn-primary dropdown-toggle">');
		html.push('					<span class="ace-icon fa fa-caret-down icon-only"></span>');
		html.push('				</button>');
		html.push('				<ul class="dropdown-menu dropdown-primary">');
		html.push('					<li><a href="#" reviewId='+item.reviewId+' reviewTitle="'+item.reviewTitle+'" adjustmentFactor="'+adjustmentFactor+'" worksheetRequired="'+worksheetRequired+'" showReviews="'+item.inHistory+'" showStatements="'+item.inStatements+'" showReports="'+item.inReports+'" startDate='+item.startDate+' endDate='+item.endDate+' selectionDate='+item.selectionDate+' onClick="showEditPopup(this)">'+langMap.js_workbench_add_review_plan_eligibility+'</a></li>');
		html.push('					<li><a href="../page/EV_MANAGE_PLANS.htm?crt_req_review_id='+item.reviewId+'">'+langMap.js_workbench_add_review_plan_guidelines+'</a></li>');
		html.push('					<li class="divider"></li>');
		html.push('					<li><a href="#" worksheetRequired="true" reviewId='+item.reviewId+' status='+item.active+'  onClick="showStatusPopup(this)">'+langMap.js_workbench_review_plan_change_review_status+'</a></li>');
		html.push('					<li class="divider"></li>');
		html.push('					<li><a href="#" reviewId='+item.reviewId+' onclick="deleteReviewPlan(this)">'+langMap.js_workbench_add_review_plan_delete+'</a></li>');
		html.push('				</ul>');
		html.push('			</div>');
		html.push('		</h4>');
		if(item.active)
			html.push('	<i class="ace-icon fa fa-circle green"></i> '+langMap.js_workbench_add_review_plan_active+getDateFormatForDisplay(item.startDate)+'');
		else
			html.push('	<i class="ace-icon fa fa-circle red"></i> '+langMap.js_workbench_add_review_plan_in_active+getDateFormatForDisplay(item.startDate)+'');
		html.push('</div>');
	});
	html.push('	<div class="well">');
	html.push('	<h3 class="blue"><a id="addplan"><i class="fa fa-plus"></i>'+langMap.js_workbench_add_review_plan_add_review_btn+'</a></h3>');
	html.push('</div>');
	$('#selection_box').html(html.join(''));
	addPopup();
}

function addReviewPlan(){
	var data = {};	
	var revId = $('#revId').val();
	if( $('#revId').val()==null || $('#revId').val()=='' || $('#reviewName').val()==null || $('#reviewName').val()=='' || $('#startDate').val()==null || $('#startDate').val()=='' || $('#endDate').val()==null || $('#endDate').val()=='' || $('#selectionDate').val()==null || $('#selectionDate').val()=='' || $('#adjustmentFactor').val()==null || $('#adjustmentFactor').val()=='')
	{
		showError(langMap.popup_kpi_all_are_required_msg, 'messageEdit');
		return false;
	}else if($('#adjustmentFactor').val() < 0 || $('#adjustmentFactor').val() > 5){
		showError("Adjustment Factor should be between 0 and 5");
		return false;
	}
	var startDate = new Date($('#startDate').val());
    var endDate = new Date($('#endDate').val());
    if (endDate < startDate) {
    	showError(langMap.js_workbench_start_date_end_date_msg);
    	return false;
     }
    var reviewInfo='';
    var adjustmentFactorValue=$('#adjustmentFactor').val();
    var adjustmentFactorAttrText=$('#adjustmentFactor').attr('attrText');
    var adjustmentFactorAttrId=$('#adjustmentFactor').attr('attrId');
    reviewInfo+=adjustmentFactorAttrId+'~'+adjustmentFactorAttrText+'~'+adjustmentFactorValue+'#';
    var worksheetValue = '0';
    if($('#worksheetRequired').val() == 'true')
     worksheetValue='1';
    var worksheetAttrText=$('#worksheetRequired').attr('attrText');
    var worksheetAttrId=$('#worksheetRequired').attr('attrId');
    reviewInfo+=worksheetAttrId+'~'+worksheetAttrText+'~'+worksheetValue;
    data[request_review_id] = $('#revId').val();	
	data[request_review_name] = $('#reviewName').val();	
	data[request_review_start_date] =$.datepicker.formatDate(SYSTEM_DATE_FORMAT, $('#startDate').bootstrapDP('getDate'));
	data[request_review_end_date] =$.datepicker.formatDate(SYSTEM_DATE_FORMAT, $('#endDate').bootstrapDP('getDate'));
	data[request_review_selection_date] =$.datepicker.formatDate(SYSTEM_DATE_FORMAT, $('#selectionDate').bootstrapDP('getDate'));
	data[request_review_info]=reviewInfo;
	data[request_review_show_reviews] = $('#showReviews').val();
	data[request_review_show_statements] = $('#showStatements').val();
	data[request_review_show_reports] = $('#showReports').val();
	$.ajax({
        url:addWorkbenchReviewPlanURL,
        data:data,
        method:'POST',
        cache: false,
        success: addReviewPlanSuccess,
		error: addReviewPlanError
	 });
}
function editReviewPlan(reviewId){
	var data = {};	
	
	if($('#reviewName').val()==null || $('#reviewName').val()=='' || $('#startDate').val()==null || $('#startDate').val()=='' || $('#endDate').val()==null || $('#endDate').val()=='' || $('#selectionDate').val()==null || $('#selectionDate').val()=='' || $('#adjustmentFactor').val()==null || $('#adjustmentFactor').val()=='')
	{
		showError(langMap.popup_kpi_all_are_required_msg, 'messageEdit');
		return false;
	}else if($('#adjustmentFactor').val() < 0 || $('#adjustmentFactor').val() > 5){
		showError("Adjustment Factor should be between 0 and 5");
		return false;
	}
	var startDate = new Date($('#startDate').val());
    var endDate = new Date($('#endDate').val());
    if (endDate < startDate) {
    	showError(langMap.js_workbench_start_date_end_date_msg);
    	return false;
     }
    var reviewInfo='';
    var adjustmentFactorValue=$('#adjustmentFactor').val();
    var adjustmentFactorAttrId=$('#adjustmentFactor').attr('attrId');
    var adjustmentFactorAttrText=$('#adjustmentFactor').attr('attrText');
    reviewInfo+=adjustmentFactorAttrId+'~'+adjustmentFactorAttrText+'~'+adjustmentFactorValue+'#';
    var worksheetValue = '0';
    if($('#worksheetRequired').val() == 'true')
     worksheetValue='1';
    var worksheetAttrId=$('#worksheetRequired').attr('attrId');
    var worksheetAttrText=$('#worksheetRequired').attr('attrText');
    reviewInfo+=worksheetAttrId+'~'+worksheetAttrText+'~'+worksheetValue;
	data[request_review_name] = $('#reviewName').val();	
	data[request_review_start_date] =$.datepicker.formatDate(SYSTEM_DATE_FORMAT, $('#startDate').bootstrapDP('getDate'));
	data[request_review_end_date] =$.datepicker.formatDate(SYSTEM_DATE_FORMAT, $('#endDate').bootstrapDP('getDate'));
	data[request_review_selection_date] =$.datepicker.formatDate(SYSTEM_DATE_FORMAT, $('#selectionDate').bootstrapDP('getDate'));
	data[request_review_info]=reviewInfo;
	data[request_review_show_reviews] = $('#showReviews').val();
	data[request_review_show_statements] = $('#showStatements').val();
	data[request_review_show_reports] = $('#showReports').val();
	data["review_id"]=reviewId;
	$.ajax({
        url:editWorkbenchReviewPlanURL,
        data:data,
        cache: false,
        success: editReviewPlanSuccess,
		error: editReviewPlanError
	 });
}

function addReviewPlanSuccess(dataMap, textStatus, XMLHttpRequest){
	var data;
	if(dataMap.status==true){
		data = dataMap[response_reviews_list];		
		bootbox.hideAll();
		showSuccess(langMap.js_workbench_add_review_plan_success, 'messageEdit');
		buildReviewPlans(data);
		$("#selection_box").children(":first").addClass('sel_box');
		$('div[id="selection_box"] a').first().trigger('click');
	} else {
		if(dataMap.errorMessage)
			data = dataMap.errorMessage;
		else
			data = langMap.js_workbench_add_review_plan_error;
		showError(data, 'messageEdit');
	}
}
function editReviewPlanSuccess(dataMap, textStatus, XMLHttpRequest){
	var data;
	if(dataMap.status==true){
		data = dataMap[response_reviews_list];		
		bootbox.hideAll();
		showSuccess(langMap.js_workbench_edit_review_plan_success, 'messageEdit');
		buildReviewPlans(data);
		$("#selection_box").children(":first").addClass('sel_box');
		$('div[id="selection_box"] a').first().trigger('click');
	} else {
		if(dataMap.errorMessage)
			data = dataMap.errorMessage;
		else
			data = langMap.js_workbench_edit_review_plan_error;
		showError(data, 'messageEdit');
	}
}
function addReviewPlanError(XMLHttpRequest, textStatus, errorThrown){
	showError(langMap.js_workbench_add_review_plan_error, 'messageEdit');
}
function editReviewPlanError(XMLHttpRequest, textStatus, errorThrown){
	showError(langMap.js_workbench_edit_review_plan_error, 'messageEdit');
}

function getReviewPlanData(){
	var data = {};
	$.ajax({
        url:getWorkbenchReviewPlanURL,
        data:data,
        cache: false,
        success: getReviewPlanSuccess,
		error: getReviewPlanError
	 });
}

function getReviewPlanSuccess(dataMap, textStatus, XMLHttpRequest){
	//populateReviewPlan(dataMap);
}

function getReviewPlanError(XMLHttpRequest, textStatus, errorThrown){
	showError(langMap.js_workbench_review_plan_error);
}

function populateReviewPlan(data){
	var bonusPlan=data.reviewStatus.bonusPlan;
	$('#bonusPlanDataPercentId').attr('data-percent',bonusPlan.dataPercent);
	$('.easy-pie-chart#bonusPlanDataPercentId').data('easyPieChart').update(bonusPlan.dataPercent);
	$('#bonusPlanPercentId').html(bonusPlan.dataPercent+"%");
	$('#bonusPlanDataNumberId').html($.formatNumber(bonusPlan.dataNumber, {format:"#,###", locale:locale}));
	$('#bonusPlanStatusId').html(bonusPlan.planStatus);
	var meritPlan=data.reviewStatus.meritPlan;
	$('#meritPlanDataPercentId').attr('data-percent',meritPlan.dataPercent);
	$('.easy-pie-chart#meritPlanDataPercentId').data('easyPieChart').update(meritPlan.dataPercent);
	$('#meritPlanPercentId').html(meritPlan.dataPercent+"%");
	$('#meritPlanDataNumberId').html($.formatNumber(meritPlan.dataNumber, {format:"#,###", locale:locale}));
	$('#meritPlanStatusId').html(meritPlan.planStatus);
	var promotionPlan=data.reviewStatus.promotionPlan;
	$('#promotionPlanDataPercentId').attr('data-percent',promotionPlan.dataPercent);
	$('.easy-pie-chart#promotionPlanDataPercentId').data('easyPieChart').update(promotionPlan.dataPercent);
	$('#promotionPlanPercentId').html(promotionPlan.dataPercent+"%");
	$('#promotionPlanDataNumberId').html($.formatNumber(promotionPlan.dataNumber, {format:"#,###", locale:locale}));
	$('#promotionPlanStatusId').html(promotionPlan.planStatus);
	
	var bonusBudget=data.budget.bonusBudget;
	$('#bonusBudgetTotal').html(bonusBudget.budgetTotal+" USD");
	$('#bonusBudgetPercent1').html(bonusBudget.budgetPercent1+"%");
	$('#bonusBudgetPercent1').css('width',bonusBudget.budgetPercent1+"%");
	$('#bonusBudgetPercent2').html(bonusBudget.budgetPercent2+"%");
	$('#bonusBudgetPercent2').css('width',bonusBudget.budgetPercent2+"%");
	var meritBudget=data.budget.meritBudget;
	$('#meritBudgetTotal').html(meritBudget.budgetTotal+" USD");
	$('#meritBudgetPercent1').html(meritBudget.budgetPercent1+"%");
	$('#meritBudgetPercent1').css('width',meritBudget.budgetPercent1+"%");
	$('#meritBudgetPercent2').html(meritBudget.budgetPercent2+"%");
	$('#meritBudgetPercent2').css('width',meritBudget.budgetPercent2+"%");
	var promotionBudget=data.budget.promotionBudget;
	$('#promotionBudgetTotal').html(promotionBudget.budgetTotal+" USD");
	$('#promotionBudgetPercent1').html(promotionBudget.budgetPercent1+"%");
	$('#promotionBudgetPercent1').css('width',promotionBudget.budgetPercent1+"%");
	$('#promotionBudgetPercent2').html(promotionBudget.budgetPercent2+"%");
	$('#promotionBudgetPercent2').css('width',promotionBudget.budgetPercent2+"%");
	
	var bonusEligibility=data.eligibility.bonusEligibility;
	$('#bonusEligibilityData').html($.formatNumber(bonusEligibility.eligibilityData, {format:"#,###", locale:locale}));
	$('#bonusEligibilityStatus').html(bonusEligibility.eligibilityStatus);
	var meritEligibility=data.eligibility.meritEligibility;
	$('#meritEligibilityData').html($.formatNumber(meritEligibility.eligibilityData, {format:"#,###", locale:locale}));
	$('#meritEligibilityStatus').html(meritEligibility.eligibilityStatus);
	var promotionEligibility=data.eligibility.promotionEligibility;
	$('#promotionEligibilityData').html($.formatNumber(promotionEligibility.eligibilityData, {format:"#,###", locale:locale}));
	$('#promotionEligibilityStatus').html(promotionEligibility.eligibilityStatus);
}

function deleteReviewPlan(ele){
	var data = {};	
	data["crt_req_review_id"]=$(ele).attr('reviewId');
	$.ajax({
        url:deleteWorkbenchReviewPlanURL,
        data:data,
        cache: false,
        success: deleteReviewPlanSuccess,
		error: deleteReviewPlanError
	 });
}

function deleteReviewPlanSuccess(dataMap, textStatus, XMLHttpRequest){
	var data;
	if(dataMap.status==true){
		var plansData = dataMap[response_reviews_list];		
		bootbox.hideAll();
		showSuccess(langMap.js_workbench_delete_review_plan_success_msg, 'messageEdit');
		buildReviewPlans(plansData);
		$("#selection_box").children(":first").addClass('sel_box');
		$('div[id="selection_box"] a').first().trigger('click');
	} else {
		if(dataMap.errorMessage)
			data = dataMap.errorMessage;
		else
			data = langMap.js_workbench_delete_review_plan_failure_msg;
		showError(data, 'messageEdit');
	}
}

function deleteReviewPlanError(XMLHttpRequest, textStatus, errorThrown){
	showError(langMap.js_workbench_delete_review_plan_failure_msg, 'messageEdit');
}
function toggleCss(id){
	$('div[rel="reviewPlanDiv"]').attr('class' , 'well');
	$('#'+id).attr('class','well sel_box');
}


function showStatusPopup(element){
	var reviewId=$(element).attr('reviewId');
	var status=$(element).attr('status');
	var worksheetRequired=$(element).attr('worksheetRequired');
	var data={};
	data['crt_req_review_id']=reviewId;
	data['worksheetRequired']=worksheetRequired;
		bootbox.dialog({
			message : showStatusMessage,
			title : langMap.js_workbench_edit_review_plan_popup_title,
			buttons : {
				success : {
					label : langMap.js_workbench_edit_review_plan_save_btn,
					className : "btn-success",
					"callback": function() {	
						isActive = false;
						if($('#statusDD').val() == 'true'){
							$('div[rel="reviewPlanDiv"] a[id="reviewPlan"]').each(function(){
								if($(this).attr('worksheetRequired') == '1' && $(this).attr('active') == 'true')
									isActive = true;
							});
						}
						if(!isActive){
							data['crt_req_review_status']=$('#statusDD').val();
							editReviewStatus(data);
						}else{
							bootbox.hideAll();
							bootbox.alert(langMap.js_workbench_review_plan_worksheet_required_message);
						}
						return false;
					}
				},
				danger : {
					label : langMap.js_workbench_add_review_plan_cancel_btn,
					className : "btn-default",
					"callback": function() {
						bootbox.hideAll();
						return false;
					}
				}

			}
		});
		$('#statusDD').val(status);
}

function editReviewStatus(data){
	$.ajax({
        url:changeStatusReviewPlanURL,
        data:data,
        context:{'status':data['crt_req_review_status'],'worksheetRequired':data['worksheetRequired']},
        cache: false,
        success: changeReviewStatusSuccess,
		error: changeStatusError
	 });
}

function changeReviewStatusSuccess(dataMap, textStatus, XMLHttpRequest){
	var data;
	if(dataMap.status==true){
		data = dataMap[response_reviews_list];		
		bootbox.hideAll();
		showSuccess(langMap.js_workbench_review_plan_status_success, 'messageEdit');
		buildReviewPlans(data);
		$("#selection_box").children(":first").addClass('sel_box');
		$('div[id="selection_box"] a').first().trigger('click');
		closeLoading();
	} else {
		if(dataMap.errorMessage)
			data = dataMap.errorMessage;
		else
			data = langMap.js_workbench_add_review_plan_error;
		closeLoading();
		showError(data, 'messageEdit');
	}
}

function changeStatusError(XMLHttpRequest, textStatus, errorThrown){
	closeLoading();
	showError(langMap.js_workbench_add_review_plan_error, 'messageEdit');
}


