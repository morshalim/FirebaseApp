var barArray=[];
var printItems = [{
    textKey: 'printChart',
    onclick: function () {
        this.print();
    }
}, {
    textKey: 'downloadPNG',
    onclick: function () {
        this.exportChart();
    }
}, {
    textKey: 'downloadJPEG',
    onclick: function () {
        this.exportChart({
            type: 'image/jpeg'
        });
    }
}, {
    textKey: 'downloadPDF',
    onclick: function () {
        this.exportChart({
            type: 'application/pdf'
        });
    }
}, {
    textKey: 'downloadSVG',
    onclick: function () {
        this.exportChart({
            type: 'image/svg+xml'
        });
    }
}
];
$(document).ready(function () {
	Highcharts.setOptions({
		colors: ['#dcdcdc','#51a351'],
		lang: {
			decimalPoint: '.',
            thousandsSep: ','
		}
	});

	showLoading();
	
	buildBudgetSummary();
	buildCompensationSummary();
	buildPerformanceRatingsSummary();

	$('#budgetSummaryOver').bind('mouseover', function (){

		if( $('table.bubbletip #budgetSummaryOver_bubble').length == 0)
		{
			$('#budgetSummaryOver').bubbletip($('#budgetSummaryOver_bubble')
														,{	delayShow: delayShowOnMouseOver,
															delayHide: 0,
															calculateOnShow: true,
															deltaDirection: 'down'
														});
			$('#budgetSummaryOver').trigger('mouseover');
		}
	});

	if(isLowLevelManager)
	{
		$('#compensationSummaryDiv').hide();
		$('#budgetSummaryDiv').removeClass('budget').addClass('budget_nochief last');
	}

	closeLoading();
	$('IMG').css('max-width','none');
});

function continueWorksheet()
{
	var val = $("input[name='selectView']:checked").val();
	if(val == "0")
		refreshScope('D','X','','');
	else if(val == "1")
		refreshScope('I','X','','');

	$.fancybox.close();
	closeLoading();
}





function buildBudgetSummary () {

	if(ECM_DEBUG)$.log ("START buildBudgetSummary");
	var thead = [];
	var tbody = [];

	var defaultPlan = "";
	for(var x in budgetSummary)
	{
		var bud = budgetSummary[x];
		if(defaultPlan == "")
			defaultPlan = bud.planId;

		tbody.push('<div class="col-sm-4">');
		tbody.push('	<div class="widget-box transparent">');
		tbody.push('		<div class="widget-header widget-header-flat">');
		tbody.push('			<h4 class="lighter">');
		tbody.push('				<i class="icon-bar-chart blue"></i>');
		tbody.push('				'+bud.planName);
		tbody.push('			</h4>');
		tbody.push('			</div>');
		tbody.push('		</div>');

		tbody.push('		<div class="widget-body">');
		tbody.push('			<div class="widget-main padding-4"> ');
				
		tbody.push('				<div class="space-6"></div>	');
		tbody.push('				<div  id="' + 'budgetSummary' + bud.planId + '" ></div><!-- Graph Placeholder -->');	
		tbody.push(getPlanSummaryDetails(bud,'budgetSummary'));		
		tbody.push('					<p class="disclaimer">\n');
	    tbody.push(langMap.budgetSummary_disclaimer);
	    tbody.push('					</p>\n');
		tbody.push('			</div><!-- /widget-main -->');
		tbody.push('		</div><!-- /widget-body -->');
		tbody.push('	</div><!-- /widget-box -->');
		tbody.push('</div><!-- End Column -->');
		
		
	}

	thead.push(tbody.join(''));


	$('#budgetSummaryDiv').html(thead.join(''));

	for(var x in budgetSummary)
	{
		var bud = budgetSummary[x];
		getBudgetSummaryChart(bud, 'budgetSummary' + bud.planId);
	}

	verifyBudgetSummaryExceeded();

	if(ECM_DEBUG)$.log ("END buildBudgetSummary");
}

function showBudgetPlan(id)
{
	$("div[budgetPlan]").hide();
	$("div[budgetPlan=" + id + "]").show();
}


function verifyBudgetSummaryExceeded() {
	$('#budgetSummaryOver').hide();
	for(var x in budgetSummary)
	{
		var bud = budgetSummary[x];
		if(bud.spent > bud.total)
		{
			$('#budgetSummaryOver').show();
			break;
		}
	}
}

function getPlanSummaryDetails(bud,divId)
{
	var tbody = [];

	//tbody.push('	                <p id= "' + divId+ bud.planId +'" class="align_c">\n');
	//tbody.push('	                	<img budgetSummaryDash="' + bud.planId + '" src="' + getBudgetSummaryChart(bud, 'budgetPlan' + bud.planId) + '" /> \n');
	//tbody.push('	                </p>\n');

	tbody.push('					<table width="70%">\n');
	tbody.push('                        <tr>\n');
//	tbody.push('                            <th>&nbsp;</th>\n');
	tbody.push('                            <th>&nbsp;</th>\n');
	tbody.push('							<th style="text-align:right;"  >' + langMap.budgetSummary_amount_title + '</th>\n');
	tbody.push('							<th style="text-align:right;" >' + langMap.budgetSummary_associates_title + '</th>\n');
	tbody.push('                        </tr>\n');

	tbody.push('                        <tr style="border-bottom: 1px solid #dcdcdc;">\n');
//	tbody.push('                             <td>&nbsp;</td>\n');
	tbody.push('							<td>' + langMap.budgetSummary_budget_title + '</td>\n');
	tbody.push('							<td align="right" >' + $.formatNumber(bud.total, {format:budgetFormat,locale:locale, nanForceZero: false}) + '</td>\n');
	tbody.push('							<td align="right" >' + bud.status.totalAssociates + '</td>\n');
	tbody.push('                        </tr>\n');

	tbody.push('                        <tr style="border-bottom: 1px solid #dcdcdc;">\n');
//	tbody.push('                            <td><div class="budget_spent"></div></td>\n');
	tbody.push('							<td>' + langMap.budgetSummary_spent_title + '</td>\n');
	tbody.push('							<td align="right" >' + $.formatNumber(bud.spent, {format:budgetFormat,locale:locale, nanForceZero: false}) + '</td>\n');
	tbody.push('							<td align="right" >' + bud.status.numPlanned + '</td>\n');
	tbody.push('                        </tr>\n');

	tbody.push('                        <tr style="border-bottom: 1px solid #dcdcdc;">\n');
//	tbody.push('                            <td><div class="budget_avl"></div></td>\n');
	tbody.push('							<td>' + langMap.budgetSummary_available_title + '</td>\n');
	tbody.push('							<td align="right" >' + $.formatNumber(bud.available, {format:budgetFormat,locale:locale, nanForceZero: false}) + '</td>\n');
	tbody.push('							<td align="right" >' + bud.status.numNotPlanned + '</td>\n');
	tbody.push('                        </tr>\n');
	tbody.push('                    </table>\n');

	return tbody.join('');
}

function getBudgetSummaryChart(bud, idToRender)
{
	if(ECM_DEBUG)$.log ("getBudgetSummaryChart bud: " + JSON.stringify(bud));
	var total = bud.total;
	var spent = bud.spent;
	var available = bud.available;

	var pctSpent = (spent/total) * 100;

	pctSpent =	$.formatNumber(pctSpent, {format:currencyFormat, locale:locale});
	pctSpent =	$.parseNumber(pctSpent, {format:currencyFormat, locale:locale});

	if(ECM_DEBUG)$.log ("pctSpent: " + pctSpent);

	var pctAvailable = (available/total) * 100;

	pctAvailable =	$.formatNumber(pctAvailable, {format:currencyFormat, locale:locale});
	pctAvailable =	$.parseNumber(pctAvailable, {format:currencyFormat, locale:locale});

	if(ECM_DEBUG)$.log ("pctAvailable: " + pctAvailable);

	var chreq = "";
	if(pctSpent <= 100)
	{
		/*var data = [];
		var dataTitle = [];
		var dataColor = [];
		if(pctSpent != 0)
		{
			data.push(pctSpent);
			dataTitle.push(pctSpent + "%25");
			dataColor.push("5b7393");
		}

		if(pctAvailable != 0)
		{
			data.push(pctAvailable);
			dataTitle.push(pctAvailable + "%25");
			dataColor.push("b4dc84");
		}
		chreq = chartServer + "?cht=pf&chd=" + data.join(',') + "&chl=" + dataTitle.join(',') + "&chs=300x300&chco=FFFFFF&sl=false&lxa=c&lya=b&dco=" + dataColor.join(",");*/

		new Highcharts.Chart({
			lang:{
				contextButtonTitle: langMap.js_dashboard_print_or_export
			},
		    chart: {
		        renderTo: idToRender,
				height: 250,
				width: 300,
		        defaultSeriesType: 'pie'
		    },
		    title: {
		        text: ''
		    },
		    tooltip: {
					useHTML : true,
				    formatter: function() {
							return '<div><b>'+ this.point.name +'</b>: '+ $.formatNumber(this.percentage, {format:currencyFormat,locale:locale})+' %</div>';
					    },
				    positioner: function () {
				    	return { x: 0, y: 0 };
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
					      [langMap.budgetSummary_spent_title,pctSpent],
						  [langMap.budgetSummary_available_title,pctAvailable]
					  ]
		    }],
		    exporting: {
		    	 enabled: false
				/*buttons: {
					contextButton: {
						symbol: 'url(../images/print.png)',
						menuItems: printItems
					}
				}*/
		    }
		});

	}
	else
	{
		//chreq =  chartServer + "?cht=pf&chd=" + pctSpent + "&chl=" + pctSpent + "%25&chs=300x300&chco=FFFFFF&sl=false&lxa=c&lya=b&dco=e41e2a";
		new Highcharts.Chart({
			lang:{
				contextButtonTitle: langMap.js_dashboard_print_or_export
			},
		    chart: {
		        renderTo: idToRender,
				height: 250,
				width: 300,
		        defaultSeriesType: 'pie'
		    },
		    title: {
		        text: ''
		    },
		    tooltip: {
				useHTML : true,
			    formatter: function() {
						return '<div><b>'+ this.point.name +'</b>: '+ pctSpent/*$.formatNumber(this.percentage, {format:currencyFormat,locale:locale})*/+' %</div>';
				    },
				    positioner: function () {
					return { x: 0, y: 0 };
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
					      [langMap.budgetSummary_spent_title,pctSpent]
					  ]
		    }],
		    exporting: {
		    	 enabled: false
				/* buttons: {
					contextButton: {
						symbol: 'url(../images/print.png)',
						menuItems: printItems
					}
				}*/
		    }
		});
	}

	if(ECM_DEBUG)$.log ("END getBudgetSummaryChart");
	return chreq;
}


function buildCompensationSummary () {

	if(ECM_DEBUG)$.log ("START buildCompensationSummary");
	var thead = [];

	//thead.push('<h3>' + langMap.compSummary_compSummary_title + '</h3>\n');
	//thead.push('<h4>' + langMap.compSummary_manager_title1 + ' ' + managerName + ' ' + langMap.compSummary_manager_title2 + '</h4>\n');
	var tbody = [];
	tbody.push('<div class="col-sm-4">');
	tbody.push('	<div class="widget-box transparent">');
	tbody.push('		<div class="widget-header widget-header-flat">');
	tbody.push('			<h4 class="lighter">');
	tbody.push('				<i class="icon-bar-chart blue"></i>');
	tbody.push('				'+langMap.compSummary_compSummary_title );
	tbody.push('			</h4>');

/*		tbody.push('			<div class="widget-toolbar">');
	tbody.push('				<a href="#" data-action="collapse">');
	tbody.push('					<i class="icon-chevron-up"></i>');
	tbody.push('				</a>');*/
	tbody.push('			</div>');
	tbody.push('		</div>');

	tbody.push('		<div class="widget-body">');
	tbody.push('			<div class="widget-main padding-4"> ');
			
	tbody.push('				<div class="space-6"></div>	');
	tbody.push('				<div  id="compSummaryDetail" ></div><!-- Graph Placeholder -->');	
	tbody.push(getCompSummaryDetails(compSummary));		
	tbody.push('					<p class="disclaimer">\n');
    tbody.push(langMap.compSummary_disclaimer);
    tbody.push('					</p>\n');
	tbody.push('			</div><!-- /widget-main -->');
	tbody.push('		</div><!-- /widget-body -->');
	tbody.push('	</div><!-- /widget-box -->');
	tbody.push('</div><!-- End Column -->');
	thead.push(tbody.join(''));
	
	
	
	
	/*
	thead.push('<div class="dash_content">\n');
	thead.push('<div class="dash_space"></div>\n');
	var tbody = [];
	tbody.push('<div class="col-xs-3">\n');
	tbody.push('	<div class="widget-box transparent">\n');
	tbody.push('				<div class="widget-header">\n');
	tbody.push('					<h4 class="widget-title darker">' + langMap.compSummary_compSummary_title + '</h4>\n');
	//tbody.push('					<div class="widget-toolbar no-border">\n');
	//tbody.push('						<a href="#" data-action="settings"><i class="icon-cog"></i></a> \n');
	//tbody.push('						<a href="#" data-action="reload"><i class="icon-refresh"></i></a>\n');
	//tbody.push('						<a href="#" data-action="collapse"><i class="icon-chevron-up"></i></a>\n');
	//tbody.push('					</div>\n');
	tbody.push('				</div>\n');
	tbody.push('				<div class="widget-body">\n');
	tbody.push('					<div class="widget-main padding-5 no-padding-left no-padding-right">\n');
	tbody.push(							getCompSummaryDetails(compSummary));
	tbody.push('					</div>\n');
	tbody.push('				</div>\n');
	tbody.push('			</div>\n');

	tbody.push('	<p class="disclaimer">\n');
	tbody.push(langMap.compSummary_disclaimer);
	tbody.push('	</p>\n');

	tbody.push('		</div>\n');

	thead.push(tbody.join(''));

    thead.push('</div>\n');*/

	$('#summaryDiv').append(thead.join(''));
	var bud = compSummary;
	var total = bud.totalMgr;
	var submitted = bud.totalSubmitted;
	var notSubmitted = bud.totalNotSubmitted;
	//var notSubmitted = bud.totalMgr - bud.totalSubmitted;
	//var pctSpent = (submitted/total) * 100;
	var pctSpent = bud.pctSubmitted;

	pctSpent =	$.formatNumber(pctSpent, {format:currencyFormat, locale:locale});
	pctSpent =	$.parseNumber(pctSpent, {format:currencyFormat, locale:locale});

	if(ECM_DEBUG)$.log ("pctSpent: " + pctSpent);

	//var pctAvailable = (notSubmitted/total) * 100;
	var pctAvailable = bud.pctNotSubmitted;

	pctAvailable =	$.formatNumber(pctAvailable, {format:currencyFormat, locale:locale});
	pctAvailable =	$.parseNumber(pctAvailable, {format:currencyFormat, locale:locale});

	if(ECM_DEBUG)$.log ("pctAvailable: " + pctAvailable);


	getCompSummaryChart(pctAvailable, pctSpent, 'compSummaryDetail');

	if(ECM_DEBUG)$.log ("END buildCompensationSummary");



}

function getCompSummaryChart(pctSpent, pctAvailable, idToRender)
{
	if(ECM_DEBUG)$.log ("getCompSummaryChart");

	var chreq = "";
	if(pctSpent <= 100)
	{
		/*var data = [];
		var dataTitle = [];
		var dataColor = [];
		if(pctSpent != 0)
		{
			data.push(pctSpent);
			dataTitle.push(pctSpent + "%25");
			dataColor.push("848485");
		}

		if(pctAvailable != 0)
		{
			data.push(pctAvailable);
			dataTitle.push(pctAvailable + "%25");
			dataColor.push("b4dc84");
		}
		chreq = chartServer + "?cht=pf&chd=" + data.join(',') + "&chl=" + dataTitle.join(',') + "&chs=300x300&chco=FFFFFF&sl=false&lxa=c&lya=b&dco=" + dataColor.join(',');*/

		new Highcharts.Chart({
			lang:{
				contextButtonTitle: langMap.js_dashboard_print_or_export
			},
		    chart: {
		        renderTo: idToRender,
				height: 250,
				width: 300,
		        defaultSeriesType: 'pie'
		    },
		    colors: ['#6db2f0','#dcdcdc'],
		    title: {
		        text: ''
		    },
		    tooltip: {
		   		useHTML : true,
			    formatter: function() {
						return '<div><b>'+ this.point.name +'</b>: '+ $.formatNumber(this.percentage, {format:currencyFormat,locale:locale})+' %</div>';
				    },
			    positioner: function () {
			    	return { x: 0, y: 0 };
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
						  [langMap.compSummary_planned_title,pctAvailable],
						  [langMap.compSummary_unplanned_title,pctSpent]
					  ]
		    }],
		    exporting: {	
		    	 enabled: false
				/* buttons: {
					contextButton: {
						symbol: 'url(../images/print.png)',
						menuItems: printItems
					}
				}*/
		    }
		});
	}
	else {

		//chreq = chartServer + "?cht=pf&chd=" + pctSpent + "&chl=" + pctSpent + "%25&chs=300x300&chco=FFFFFF&sl=false&lxa=c&lya=b&dco=e41e2a";		new Highcharts.Chart({
		new Highcharts.Chart({
			lang:{
				contextButtonTitle: langMap.js_dashboard_print_or_export
			},
		    chart: {
		        renderTo: idToRender,
				height: 250,
				width: 300,
		        defaultSeriesType: 'pie'
		    },
		    title: {
		        text: ''
		    },
		   tooltip: {
		   		useHTML : true,
			    formatter: function() {
						return '<div><b>'+ this.point.name +'</b>: '+ $.formatNumber(this.percentage, {format:currencyFormat,locale:locale})+' %</div>';
				    },
			    positioner: function () {
			    	return { x: 0, y: 0 };
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
					      [langMap.budgetSummary_spent_title,pctSpent]
					  ]
		    }],
		    exporting: {
		    	 enabled: false
				 /*buttons: {
					contextButton: {
						symbol: 'url(../images/print.png)',
						menuItems: printItems
					}
				}*/
		    }
		});
	}

	if(ECM_DEBUG)$.log ("END getCompSummaryChart");
	return chreq;
}

function getCompSummaryDetails(bud)
{
	var tbody = [];

	var total = bud.totalMgr;
	var submitted = bud.totalSubmitted;
	//var notSubmitted = bud.totalMgr - bud.totalSubmitted;
	var notSubmitted = bud.totalNotSubmitted;
	//var pctSpent = (submitted/total) * 100;
	var pctSpent = bud.pctSubmitted;

	pctSpent =	$.formatNumber(pctSpent, {format:currencyFormat, locale:locale});
	pctSpent =	$.parseNumber(pctSpent, {format:currencyFormat, locale:locale});

	if(ECM_DEBUG)$.log ("pctSpent: " + pctSpent);

	//var pctAvailable = (notSubmitted/total) * 100;
	var pctAvailable = bud.pctNotSubmitted;

	pctAvailable =	$.formatNumber(pctAvailable, {format:currencyFormat, locale:locale});
	pctAvailable =	$.parseNumber(pctAvailable, {format:currencyFormat, locale:locale});

	if(ECM_DEBUG)$.log ("pctAvailable: " + pctAvailable);


	tbody.push('					<table cellspacing="0" class="dash_data">\n');
	tbody.push('                        <tr >\n');
//	tbody.push('                            <th>&nbsp;</th>\n');
	tbody.push('                            <th>&nbsp;</th>\n');
	tbody.push('							<th  style="text-align:right;width:100px;" >' + langMap.compSummary_amount_title + '</th>\n');
	tbody.push('							<th  style="text-align:right;width:150px;" >' + langMap.compSummary_managers_title + '</th>\n');
	tbody.push('                        </tr>\n');
	
	tbody.push('                        <tr style="border-bottom: 1px solid #dcdcdc;">\n');
//	tbody.push('                            <td class="align_c"><div class="budget_planned"></div></td>\n');
	tbody.push('							<td>' + langMap.compSummary_planned_title + '</td>\n');
	tbody.push('							<td align="right">' + $.formatNumber(pctSpent, {format:pctFormat,locale:locale, nanForceZero: false}) + '</td>\n');
	tbody.push('							<td align="right">' + submitted + '</td>\n');
	tbody.push('                        </tr>\n');

	tbody.push('                        <tr style="border-bottom: 1px solid #dcdcdc;">\n');
//	tbody.push('                            <td class="align_c"><div class="budget_unplanned"></div></td>\n');
	tbody.push('							<td>' + langMap.compSummary_unplanned_title + '</td>\n');
	tbody.push('							<td align="right">' + $.formatNumber(pctAvailable, {format:pctFormat,locale:locale, nanForceZero: false}) + '</td>\n');
	tbody.push('							<td align="right">' + notSubmitted + '</td>\n');
	tbody.push('                        </tr>\n');

	tbody.push('                        <tr>\n');
	tbody.push('                            <th>&nbsp;</th>\n');
	tbody.push('							<th>&nbsp;</th>\n');
	tbody.push('							<th>&nbsp;</th>\n');
	tbody.push('                        </tr>\n');
	
	
	tbody.push('                    </table>\n');

	return tbody.join('');
}




function buildPerformanceRatingsSummary() {

	if(ECM_DEBUG)$.log ("START buildPerformanceRatingsSummary");	
	
	
	var config = loadRatingsData(perfRatingSummary);

	var thead = [];

	var tbody = [];
	tbody.push('<div class="col-sm-4">');
	tbody.push('	<div class="widget-box transparent">');
	tbody.push('		<div class="widget-header widget-header-flat">');
	tbody.push('			<h4 class="lighter">');
	tbody.push('				<i class="icon-bar-chart blue"></i>');
	tbody.push('				'+langMap.js_distribution_rating_message );
	tbody.push('			</h4>');
	tbody.push('		</div>');
	tbody.push('	</div>');

	tbody.push('	<div class="widget-body">');
	tbody.push('		<div class="widget-main padding-4"> ');
			
	tbody.push('			<div class="space-6"></div>	');
	tbody.push('			<div  id="dash_graph_container_1" ></div><!-- Graph Placeholder -->');	
	//tbody.push(buildPerformanceRatingsGrid(config));
	tbody.push('				<p class="disclaimer">\n');
    tbody.push(langMap.js_chart_performance_rating_footnote);
    tbody.push('				</p>\n');
	tbody.push('		</div><!-- /widget-main -->');
	tbody.push('	</div><!-- /widget-body -->');
	tbody.push('</div><!-- /widget-box -->');
	tbody.push('</div><!-- End Column -->');
	thead.push(tbody.join(''));
	
	
    
	
	$('#summaryDiv').append(thead.join(''));
	
	
	config.chartId = 'dash_graph_container_1';
	getPerformanceRatingsChart(config);

	if(ECM_DEBUG)$.log ("END buildPerformanceRatingsSummary");

}
function buildPerformanceRatingsGrid(config)
{
	var tbody = [];



	tbody.push('					<table cellspacing="0" class="dash_data" width="100%" >\n');
	tbody.push('                        <tr style="border-bottom: 1px solid #dcdcdc;">');
	tbody.push('							<th width="50px" >&nbsp;</th>');
	for(var i = 0 ; i < config.categories.length; i++){
		tbody.push('						<th  style="text-align:center;" >' + config.categories[i] + '</th>');
	}
	tbody.push('                        </tr>');


	tbody.push('                        <tr style="border-bottom: 1px solid #dcdcdc;">');
	tbody.push('							<td>Count</td>');
	for(var i = 0 ; i < config.categories.length; i++){
		tbody.push('						<td align="center" >' + (config.gridData[i] != '' ? config.gridData[i] : '0')  + '</td>');
	}
	tbody.push('                        </tr>');
	
/*	tbody.push('                        <tr style="border-bottom: 1px solid #dcdcdc;">');
	tbody.push('							<th>Percent</th>');
	for(var i = 0 ; i < config.categories.length; i++){
		tbody.push('						<td>' + config.data[i] + '</td>');
	}
	tbody.push('                        </tr>');*/


	tbody.push('                        <tr>');
	tbody.push('							<th>&nbsp;</th>');
	for(var i = 0 ; i < config.categories.length; i++){
		tbody.push('						<th>&nbsp;</th>');
	}
	tbody.push('                        </tr>');
tbody.push('                    </table>\n');

	return tbody.join('');
}
function getPerformanceRatingsChart(config)
{	
	
	new Highcharts.Chart({
		lang:{
			contextButtonTitle: langMap.js_dashboard_print_or_export
		},
        chart: {
            type: 'column',
            renderTo: config.chartId,
			height: 300,
			width: 450,
			marginTop: 20
        },
        title: {
            text: '',
            style:{
				fontSize: '13px'
            }
        },

        xAxis: {
            categories: config.categories
        },
        yAxis: {
            min: 0,
            max:100,
            tickInterval: 25,
            title: {
                text: '%'
            }
        },
        tooltip: {
        	formatter: function() {
            	var content = [];
            	content.push('<b  >'+this.point.category+'</b><div style="border-bottom: solid 1px #CCC;" ></div>');
            	content.push('<table>');
            	content.push('	<tr>');
            	content.push('		<td style="color:{series.color};padding:0">'+this.series.name+': </td>');
            	content.push('		<td style="padding:0"><b>'+Highcharts.numberFormat(this.point.y)+' %</b></td>');
            	content.push('	</tr>');
            	content.push('	<tr>');
            	content.push('		<td style="color:{series.color};padding:0">Count: </td>');
            	content.push('		<td style="padding:0"><b>'+this.point.count+'</b></td>');            	
            	content.push('	</tr>');
            	content.push('</table>');
            	return content.join('');
				//return '<div><b>'+ this.point.count +'</b>: '+ $.formatNumber(this.percentage, {format:currencyFormat,locale:locale})+' %</div>';
		    },
/*            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: function(){
            	var content = [];
            	content.push('<table>');
            	content.push('	<tr>');
            	content.push('		<td style="color:{series.color};padding:0">{series.name}: </td>');
            	content.push('		<td style="padding:0"><b>{point.y:.2f} %</b></td>');
            	content.push('	</tr>');
            	content.push('	<tr>');
            	content.push('		<td style="color:{series.color};padding:0">Count: </td>');
            	content.push('		<td style="padding:0"><b>{point.count}</b></td>');            	
            	content.push('	</tr>');
            	content.push('</table>');
            	return content.join('');
            },
            footerFormat: '',*/
            //shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
	         } ,
	        series: {
	            dataLabels:{
	                enabled:true,
	                formatter:function() {
	                    return Highcharts.numberFormat(this.y) + '%<br> ('+this.point.count+')';
	                }
	            }
	        }
   
        },

        series: [{
            name: langMap.jsp_dashboard_distribution,           
            data:config.data

        }],
        exporting: {
        	 enabled: false
			 /*buttons: {
				contextButton: {
					symbol: 'url(../images/print.png)',
					y:10,
					menuItems: printItems
				}
			}*/
	    }
    });

}

function loadRatingsData(perfRatingSummary){
	var config = {
			totalCount: calculateTotalCount(perfRatingSummary),
			data:[[],[],[],[],[],[],[],[]],
			gridData:[[],[],[],[],[],[],[],[]],
			categories:[langMap['js_rating_dashboard_Group1'],langMap['js_rating_dashboard_Group2'],langMap['js_rating_dashboard_Group3'],langMap['js_rating_dashboard_Group4'],langMap['js_rating_dashboard_Group5'],langMap['js_rating_dashboard_Group6'],langMap['js_rating_dashboard_Group7'],langMap['js_rating_dashboard_Group8']]
	}
	 var posMapping = {
			'Group1':0,
			'Group2':1,
			'Group3':2,
			'Group4':3,
			'Group5':4,
			'Group6':5,
			'Group7':6,
			'Group8':7
	}
	for ( var i = 0; i < perfRatingSummary.length; i++) {
			config.data[posMapping[perfRatingSummary[i].rating]] = {y:((perfRatingSummary[i].count)*100)/config.totalCount,count:perfRatingSummary[i].count};
			config.gridData[posMapping[perfRatingSummary[i].rating]] = (perfRatingSummary[i].count);
			//config.categories[posMapping[perfRatingSummary[i].rating]] = (langMap['js_rating_dashboard_'+perfRatingSummary[i].rating]); 			
		

	}

    return config;
}

function calculateTotalCount(summaryList){
	var dataList = summaryList || "";
	var totalCount = 0 ;
	if(dataList!=null && dataList!=""){
		
		for(var index=0; index < dataList.length; index++){
			totalCount += perfRatingSummary[index].count;
		}
	}
	
	return totalCount;
}
