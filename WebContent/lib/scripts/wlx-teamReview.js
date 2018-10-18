var reviewOrgTree;
var searchResults;
$(document).ready(function() {
	
	populatePlanYear(planYearList);
	buildMyReviews(myReviewList);
	buildMyGoals(myGoalList);
	
	updatePlanYearFromCookie();

	focusTab(myReviewList, myGoalList);
	
	reviewOrgTree = $('#reviewOrganizationtree').html();
	$('#reviewOrganizationtree').remove();
	
	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		
		var tabIndex = $("#myTab li").index($(e.target).parent());

		// search for direct reports on load
		if(tabIndex == 2 && searchResults == null)
			submitSearch();
		
		$.cookie('teamReview.tabIndex', tabIndex, { expires: 365 });
	});
	
	$("#planYearSelect").on("change", function(e) {
		
		changePlanYear();
		clearFormsList();
	});

	$('#search-btn').click(function(e) {

		submitSearch();
	});

	$(':radio[name="search-type-radio"]').click(function(e) {

		searchTypeClicked($(this));
		clearFormsList();
	});

	$('#search-name-inp').click(function(e) {

		$(':radio[name="search-type-radio"][value="l"]').attr('checked', true);
	});
});

function searchTypeClicked(rad) {
	
	if(rad.val() == 'd')
		submitSearch();
	else if(rad.val() == 'o')
		showReviewOrganizationTree();
}

function focusTab(myReviewList, myGoalList) {

	var tabIndex = 0;
	
	if(typeof(activeTab) != 'undefined' && activeTab != null && activeTab != '') { // if coming from the inbox page	
		
		if(activeTab == 'reviews')
			tabIndex = 0;
		else if(activeTab == 'plans')
			tabIndex = 1;
	}
	else {
		
		var tabIndexCookie = $.cookie('teamReview.tabIndex');
		
		if(typeof(tabIndexCookie) == 'undefined' || tabIndexCookie == null) {
		
			if(myReviewList.length)
				tabIndex = 0;
			else if(myGoalList.length)
				tabIndex = 1;
			else
				tabIndex = 2;
		}
		else
			tabIndex = tabIndexCookie;
	}

	if(tabIndex)
		$('#myTab li:eq('+tabIndex+') a').tab('show');

	// search for direct reports on load
	if(tabIndex == 2)
		submitSearch();

	if(myReviewList.length)
		$('#my-reviews-count').html(myReviewList.length);
	if(myGoalList.length)
		$('#my-goals-count').html(myGoalList.length);
}

function populatePlanYear(planYearList) {

	var elem;
	var selected = "";

	for(var index = 0; index < planYearList.length; index++) {

		elem = planYearList[index];
		$('#planYearSelect').append('<option id=' + elem.planYear + ' value=' + elem.planYear + '>'	+ elem.planYear + '</option>');
	}
}

function updatePlanYearFromCookie() {
	
	$('#planYearSelect option[value="'+$.cookie(planYearCookiePath+'.planYear')+'"]').attr('selected', true);
}

function changePlanYear() {
	
	var planYear = $('#planYearSelect :selected').val();

	$.cookie(planYearCookiePath+'.planYear', planYear, { expires: 365 });
}

function buildMyReviews(myReviewList) {
	
	if(myReviewList.length) {

		var tbody = [];
		
		$.each(myReviewList, function(index, item) {
			tbody.push('<tr>');
			tbody.push('	<td><a href="JAVASCRIPT:void(0);" formId="'	+ item.formId + '" onclick="goToMyReview(this)">' + item.firstName + ' ' + item.lastName + '</a></td>');
			tbody.push('	<td>' + item.planDescription + '</td>');
			tbody.push('	<td>' + getDateFormatForDisplay(item.endDate) + '</td>');
			tbody.push('	<td>' + item.planType + '</td>');
			tbody.push('	<td>' + applyStatusRenderer(item.statusName, item.statusClass) + '</td>');
			tbody.push('</tr>');
		});

		var table = $('#table_report');
		if (isDataTable(table[0])) {
			table.dataTable().fnClearTable(false);
			table.dataTable().fnDestroy();
		}
		$('#table_report tbody').html(tbody.join(''));
		table.dataTable({
			"iDisplayLength" : 20,
			"aLengthMenu" : [ [ 10, 20, 25, 50, -1 ], [ 10, 20, 25, 50, 100 ] ],
			"aoColumns" : [ null, null, null, null, null ],
			"oLanguage": dataTableLang
		});
	}
	else
		showEmptyMessage(langMap.js_teamReview_error_msg, 'reviews');

}

function buildMyGoals(myGoalList) {
	
	if (myGoalList.length) {

		var tbody = [];
		$.each(myGoalList, function(index, item) {
			tbody.push('<tr>');
			tbody.push('	<td><a href="JAVASCRIPT:void(0);" formId="'	+ item.formId + '" onclick="goToMyGoal(this)">'	+ item.firstName + ' ' + item.lastName + '</a></td>');
			tbody.push('	<td>' + item.planDescription + '</td>');
			tbody.push('	<td>' + getDateFormatForDisplay(item.startDate)	+ '</td>');
			tbody.push('	<td>' + getDateFormatForDisplay(item.endDate) + '</td>');
			tbody.push('	<td>' + item.planType + '</td>');
			tbody.push('	<td>' + applyStatusRenderer(item.statusName, item.statusClass) + '</td>');
			tbody.push('</tr>');
		});

		var table = $('#table_goals');
		if (isDataTable(table[0])) {
			table.dataTable().fnClearTable(false);
			table.dataTable().fnDestroy();
		}
		$('#table_goals tbody').html(tbody.join(''));
		table.dataTable({
			"iDisplayLength" : 20,
			"aLengthMenu" : [ [ 10, 20, 25, 50, -1 ],
					[ 10, 20, 25, 50, 100 ] ],
			"aoColumns" : [ null, null, null, null, null, null ],
			"oLanguage": dataTableLang
		});
	}
	else
		showEmptyMessage(langMap.jsp_teamreview_show_empty_message, 'plans');
}

function applyStatusRenderer(status, statusClass) {
	return '<span class="label label-sm label-' + statusClass + '">' + status + '</span>';
}

function goToMyReview(ele) {
	window.location.href = viewMyReviewFormURL + "?ref=myteam&formId="	+ $(ele).attr('formId');
}

function goToMyGoal(ele) {
	window.location.href = viewMyFormURL + "?ref=myteam&formId=" + $(ele).attr('formId');
}

function searchOrg(ele) {

	$(':radio[name="search-type-radio"][value="o"]').attr('pernr', $(ele).attr('pernr'));
	submitSearch();
	bootbox.hideAll();
}

function submitSearch() {

	var url = searchTeamReviewURL;
	var data = {};
	var rad = $(':radio[name="search-type-radio"]:checked');
	var type = rad.val();

	if (type == 'o')
		data['crt_req_pernr'] = rad.attr('pernr');
	else if (type == 'l')
		data['crt_req_search'] = $('#search-name-inp').val();

	$.ajax({
		url : url,
		data : data,
		context: { type: type, pernr: data['crt_req_pernr'] },
		cache : false,
		type : 'POST',
		success : function(dataMap, textStatus, XMLHttpRequest) {

			searchResults = dataMap;
			buildSearchResults(dataMap, this.type, this.pernr);
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			// showError(langMap.setup_kpi_sub_category_msg_delete_fail,"page-error-cntr");
		}
	});
}

function buildSearchResults(dataMap, type, pernr) {

	var html = [];

	for(var i = 0; i < dataMap.length; i++) {

		var item = dataMap[i];
		var add = true;
		
		if(item.pernr == effectivePerner)
			add = false;
		else if(type == 'o' && item.pernr == pernr)
			add = false;
		
		if(add) {

			html.push('<tr>');
			html.push('	<td>' + item.firstName + ' ' + item.lastName + '</td>');
			html.push('	<td>' + item.posTitle + '</td>');
			html.push('	<td>' + item.departmentName + '</td>');
			html.push('	<td>' + item.mgrFirstName + ' ' + item.mgrLastName + '</td>');
			html.push('	<td class="noWrap">');
			html.push('		<div class="btn-group">');
			html.push('			<button data-toggle="dropdown" class="btn btn-sm btn-primary dropdown-toggle" pernr="' + item.pernr + '" goalForm>');
			html.push('				Goal Plans &nbsp;<i class="fa fa-angle-down icon-only"></i>');
			html.push('			</button>');
			html.push('			<ul class="dropdown-menu dropdown-primary pull-right" pernr="' + item.pernr + '" goalForm></ul>');
			html.push('		</div>');
			html.push('	</td>');
			html.push('	<td class="noWrap">');
			html.push('		<div class="btn-group">');
			html.push('			<button data-toggle="dropdown" class="btn btn-sm btn-primary dropdown-toggle" pernr="' + item.pernr + '" reviewForm>');
			html.push('				Reviews &nbsp;<i class="fa fa-angle-down icon-only"></i>');
			html.push('			</button>');
			html.push('			<ul class="dropdown-menu dropdown-primary pull-right" pernr="' + item.pernr + '" reviewForm></ul>');
			html.push('		</div>');
			html.push('	</td>');
			html.push('</tr>');
		}
	}

	var table = $('#srchresults');
	if (isDataTable(table[0])) {
		table.dataTable().fnClearTable(false);
		table.dataTable().fnDestroy();
	}
	$('#srchresults tbody').html(html.join(''));
	table = $('#srchresults');
	table.dataTable({
		"iDisplayLength" : 20,
		"aLengthMenu" : [ [ 10, 20, 25, 50, -1 ], [ 10, 20, 25, 50, 100 ] ],
		"aoColumns" : [ null, null, null, null, null, null ],
		"oLanguage": dataTableLang
	});

	$('#srchresults button[data-toggle="dropdown"]').click(function() {

		getFormsList($(this));
	});
}

function getFormsList(dd) {

	var url = searchTeamReviewFormListURL;
	var data = {};

	data['crt_req_pernr'] = dd.attr('pernr');
	data['crt_req_planYear'] = $('#planYearSelect option:selected').val();

	$.ajax({
		url : url,
		data : data,
		context : {
			dd : dd
		},
		cache : false,
		type : 'POST',
		success : function(dataMap, textStatus, XMLHttpRequest) {

			buildFormsList(this.dd, dataMap);
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			// showError(langMap.setup_kpi_sub_category_msg_delete_fail,"page-error-cntr");
		}
	});
}

function buildFormsList(dd, dataMap) {

	var html = [];

	if(dataMap.goalList == null || dataMap.goalList.length == 0)
		html.push('<li style="padding-left: 10px;">No forms found.</li>');
	else {

		for(var i = 0; i < dataMap.goalList.length; i++) {

			var item = dataMap.goalList[i];

			html.push('<li><a href="JAVASCRIPT:void(0);" formId="' + item.formId + '" onclick="goToMyGoal(this)">' + item.planType + ' '	+ applyStatusRenderer(item.statusName, item.statusClass) + '</a></li>');
		}
	}

	$('#srchresults ul.dropdown-menu[pernr="' + dd.attr('pernr') + '"][goalForm]').html(html.join(''));

	html = [];

	if(dataMap.reviewList == null || dataMap.reviewList.length == 0)
		html.push('<li style="padding-left: 10px;">No forms found.</li>');
	else {

		for(var i = 0; i < dataMap.reviewList.length; i++) {

			var item = dataMap.reviewList[i];

			html.push('<li><a href="JAVASCRIPT:void(0);" formId="' + item.formId + '" onclick="goToMyReview(this)">' + item.planType + ' - ' + item.period + ' ' + applyStatusRenderer(item.statusName, item.statusClass) + '</a></li>');
		}
	}

	$('#srchresults ul.dropdown-menu[pernr="' + dd.attr('pernr') + '"][reviewForm]').html(html.join(''));
}

function clearFormsList() {
	
	$('#srchresults ul.dropdown-menu[goalForm]').html('');
	$('#srchresults ul.dropdown-menu[reviewForm]').html('');
}

function showReviewOrganizationTree() {

	bootbox.dialog({
		message : reviewOrgTree,
		title : 'Select an Organization',
		buttons : {
			success : {
				label : langMap.jsp_teamreview_label_select,
				className : 'btn-success'
			},
			danger : {
				label : langMap.jsp_teamreview_label_cancel,
				className : 'btn-default'
			}
		}
	});

	getOrg('reviewOrganization', orgUnit);
}