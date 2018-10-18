var pageLoaded = false;
$(document)
		.ready(
				function() {
					
					$.tablesorter
							.addParser({
								id : "metadataText",
								is : function(s) {
									return false;
								},
								format : function(s, table, cell) {
									var c = table.config, p = (!c.parserMetadataName) ? 'sortValue'
											: c.parserMetadataName;
									return $(cell).metadata()[p];
								},
								type : "text"
							});

					if (ECM_DEBUG)
						$.log("START on DOM ready");
					createLIandDivs();

					showTab(true, planToLoad, "tab");

					var tabs = $("li[tab]");
					if (ECM_DEBUG)
						$.log("Tabs: " + tabs.length);
					for ( var i = 0; i < tabs.length; i++) {
						var elem = tabs[i];
						$(elem).bind('click', function() {
							if (ECM_DEBUG)
								$.log("START tab click");

							showTab(true, $(this).attr("tab"), "tab");

							if (ECM_DEBUG)
								$.log("END tab click");

						});

					}

					var itabs = $("li[itab]");
					if (ECM_DEBUG)
						$.log("ITabs: " + itabs.length);
					for ( var i = 0; i < itabs.length; i++) {
						var elem = itabs[i];
						$(elem).bind('click', function() {
							if (ECM_DEBUG)
								$.log("START itab click");

							showTab(true, $(this).attr("itab"), "itab");

							if (ECM_DEBUG)
								$.log("END itab click");

						});

					}

					if (ECM_DEBUG)
						$.log("END on DOM ready");
					
					pageLoaded = true;
				});

function createLIandDivs() {
	/*
	 * sample: <li tab="rs1"><a href="#"><span>Rewards Summary</span></a></li>
	 * <div tab="rs1"></div
	 */

	if (ECM_DEBUG)
		$.log("START createLIandDivs");

	var lis = [];
	var divs = [];
	for ( var id in planList) {
		var planItem = planList[id];

		lis.push('<li tab="' + planItem.id + '"><a href="#"><span>'
				+ planItem.name + '</span></a></li>\n');
		divs.push('<div tab="' + planItem.id + '" class="tab-content">');
		divs.push('</div>\n');
	}

	divs.join("");
	if (ECM_DEBUG)
		$.log("LI's ready:\n" + lis.join(""));
	$("#planTabs ul").append(lis.join(""));
	if (ECM_DEBUG)
		$.log("DIV's ready:\n" + divs.join(""));
	$("#content_container_divs").append(divs.join(""));

	// content_container

	if (ECM_DEBUG)
		$.log("END createLIandDivs");
}

var currentSlectedTab = null;
var currentISlectedTab = null;
function refreshTab() {
	showTab(true, currentSlectedTab, "tab");
}

function showTab(hideAll, tab, ref) {
	if (ECM_DEBUG)
		$.log("START showTab");

	$('#error_list_P').hide();
	$('#error_list_I').hide();
	$('#ind_save_alert').hide();
	$('#save_alert').hide();

	if (hideAll) {
		var tabsDiv = $("div[" + ref + "]");
		// alert(ref + " " + $("li[" + ref + "]").length);
		$("li[" + ref + "]").removeClass("current");
		if (ECM_DEBUG)
			$.log("Hide all tabs (" + tabsDiv.length + ")");
		tabsDiv.hide();

		if (ref != "itab") {
			currentSlectedTab = tab;
			$("table[budgetSummary]").customFadeTo("fast", 0.33);
			$("img[budgetSummary]").customFadeTo("fast", 0.33);
		} else
			currentSlectedITab = tab;
	}

	if (tab != "") {
		if (ref != "itab") {
			if (tab != rsPlanCode) {
				$("table[budgetSummary=" + tab + "]").customFadeTo("fast", 1);
				$("img[budgetSummary=" + tab + "]").customFadeTo("fast", 1);
			} else {
				$("table[budgetSummary]").customFadeTo("fast", 1);
				$("img[budgetSummary]").customFadeTo("fast", 1);
			}
		}

		$("li[" + ref + "=" + tab + "]").addClass("current");
		if (ECM_DEBUG)
			$.log("Enable tab " + tab);
		var curTab = $("div[" + ref + "='" + tab + "']");
		if (curTab != null) {
			curTab.show();
			// tab= is the plan tabs which are dynamic the itabs are just to be
			// loaded
			if (ref == "tab") {
				if (curTab.html() == "" && !initLoad) {
					getPlan(tab);
				} else if (initLoad) {
					initLoad = false;
					showLoading();
					//$('#content_container').hide();
					loadDiv(tab);
					//$('#content_container').show();
					closeLoading();
				} else {
					// update all tables due to metadata changes made. Trigger
					// the update on all tables
					if (tab == "0RSM")
						$('#' + tab + "_data").trigger("update");

					// update the pernr lookup for the indPlanning
					updateQuickLookupTable($('#' + tab + "_data"));
				}
			} else { // ind comp tabs

				var pernr = $('#ipPernr').html();

				if (tab == "cr" && popupTracker["cr"] == null) {
					getIndCompReco(pernr, false, false);
					popupTracker["cr"] = "cr";
				} else if (tab == "ai") {
					if (popupTracker["cr"] == null) {
						getIndCompReco(pernr, true, false);
						popupTracker["cr"] = "cr";
					} else {

						var factor = 0;

						if ($('#ind_entry_ai').css('display') != 'none')
							factor = $('#cr_ai_body_td_input_all_pct')
									.metadata().sortValue.toString();
						else if ($('#ind_entry_lai').css('display') != 'none')
							factor = $('#cr_lai_body_td_input_all_pct')
									.metadata().sortValue.toString();

						getIndAnnualIncentive(pernr, factor);
						popupTracker["ai"] = "ai";
					}

				} else if (tab == "hd" && popupTracker["hd"] == null) {
					getIndHistoricalDetail(pernr);
					popupTracker["hd"] = "hd";
				} else if (tab == "tc") {
					if (popupTracker["cr"] == null) {
						getIndCompReco(pernr, false, true);
						popupTracker["cr"] = "cr";
					} else {
						var plan1 = $('#cr_merit_body_td_all_planId').html();
						var newBasePay = $('#cr_merit_body_td_all_newBasePay')
								.metadata().sortValue;
						var lumpSum = $('#cr_merit_body_td_all_lumpSum')
								.metadata().sortValue;
						var plan2 = $('#cr_ai_body_td_all_planId').html();
						var aiRecomm = $('#cr_ai_body_td_all_recomm')
								.metadata().sortValue;
						var plan3 = $('#cr_lti_body_td_all_planId').html();
						var ltiRecomm = $('#cr_lti_body_td_all_recomm')
								.metadata().sortValue;
						var plan4 = $('#cr_lai_body_td_all_planId').html();
						var laiRecomm = $('#cr_lai_body_td_all_recomm')
								.metadata().sortValue;
						getIndTotalCompensation(pernr, plan1, newBasePay
								+ lumpSum, plan2, aiRecomm, plan3, ltiRecomm,
								plan4, laiRecomm);
						popupTracker["tc"] = "tc";
					}
				}
				$.fancybox.resize();
			}
		} else {
			if (ECM_DEBUG)
				$.log("Div not found and could not enable");
		}

	}
	if (ECM_DEBUG)
		$.log("END showTab");
}