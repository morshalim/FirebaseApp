$(function(){
	
	for(var i = 0 ; i < categoryList.length; i++){
		var category = categoryList[i];
		var rptPerCategoryList = [];
		reportList = category.reports;
		for(var j = 0; j< reportList.length; j++){
			var rpt = reportList[j];
			rptPerCategoryList.push(rpt);
		}
		$('#reports-count-'+ category.id).html(rptPerCategoryList.length);
		$('#table-report-' + category.id).dataTable({
			aaData: rptPerCategoryList,
			aoColumns: [{
					sTitle: '',
					bSortable: false,
					mDataProp: 'status',
					mData: function(source, type, val){
						return '<i class="ace-icon fa fa-bar-chart-o"></i>';
					},
					sClass: 'center'
				},
				{
					sTitle: lang.report_text_report,
					mDataProp: 'name',
					
				},
				{
					sTitle: lang.report_text_description,
					mDataProp: 'description'
				}, 
				{
					sTitle: lang.report_text_options,
					mDataProp: 'variants',
					mData: function(source, type, val){
						return '<button class="btn btn-xs btn-yellow" onClick="getReportDetails(this)" reportId="'+source.id+'"><i class="fa fa-cogs"></i> Run</button>';
						
					},
					sClass: 'center',
					bSortable: false
				}
			],
			"iDisplayLength": 20,
			"aLengthMenu": [[10, 20, 25, 50, -1], [10, 20, 25, 50, 100]],
			"oLanguage": dataTableLang
		});
	}

});


function getReportDetails(report)
{
	var reportId = $(report).attr('reportId');
	if(reportId && reportId != ''){
		var url = "EV_VIEW_DYN_REPORT.htm?reportId="+reportId;
		window.location.href = url;
	}
}