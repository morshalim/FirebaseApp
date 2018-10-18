$(function(){
	$('[rel="pagetitle"]').html(pagetitle);
	$('[rel="subtitle"]').html(subtitle);
	$('#runReportContent').show();
	$('#loading').hide();
	
	$("#exit-report-btn").on('click',function(){window.location.href = "EV_VIEW_REPORT_PARAMETER.htm?reportId="+reportId});
	
	$("#btn_print_excel").on('click',function(){
		run('EXCEL');
	});
	$("#btn_print_pdf").on('click',function(){
		run('PDF');
	});
	$("#btn_bg_excel").on('click',function(){
		run('BG_EXCEL');
	});
	$("#btn_bg_pdf").on('click',function(){
		run('BG_PDF');
	});
	
	var table = $('#table_report');	
	var gridParams = {};
	
	if(gridPagination == '0'){
		gridParams.paging = false;
	}else{
		gridParams.paging = true;
	}
	var isiPad = navigator.userAgent.match(/iPad/i) != null;
		if(isiPad){
			 if(gridHeight=="null")
				 gridHeight = screen.height;
			 if(gridWidth =="null")
				 gridWidth = screen.width;
		}
	if(gridHeight != 'null' && gridHeight != ''){
		gridParams.scrollY = gridHeight;
		gridParams.scrollX = true
		gridParams.scrollCollapse = true
	}
	if(gridWidth != 'null' && gridWidth != ''){
		gridParams.width = gridWidth;
	}
	if(gridSort == '0'){
		gridParams.bSort = false;
	}else{
		gridParams.bSort = true;
	}	
	if(gridRowsPerPage != 'null' && gridRowsPerPage != ''){
		gridParams.DisplayLength = gridRowsPerPage;
	}
	gridParams.oLanguage = dataTableLang;
	$('#table_report table').each(function(){
		$(this).dataTable(gridParams);	
		$(window).resize();
		$(window).resize();
	});

});




function run(type)
{
	var params={};
	loadReportURL;
	params['reportId'] = reportId;
    params['fileName'] = fileName;
    params['type'] = type;
    params['id'] = id;
    $.fileDownload("EV_VIEW_REPROT_PDF.htm",{
        httpMethod: "POST",
        data: params,
        successCallback: function (url) {
             closeLoading();
        },
        failCallback: function (html, url) {
            closeLoading();
            reportMsg(html);
        }
    });
	/*params.push('reportId=' + reportId);
	params.push('fileName=' + fileName);
	params.push('type=' + type);
	params.push('id='+id);
	if(type == 'PDF')
	{
		$.fileDownload("EV_VIEW_REPROT_PDF.htm"+"?"+params.join('&'),{
			httpMethod: "POST",
			successCallback: function (url) {
		 		closeLoading();
		    },
		    failCallback: function (html, url) {
		    	closeLoading();
		    	reportMsg(html);
			}
		});
	}
	else if(type == 'EXCEL')
	{
		$.fileDownload("EV_VIEW_REPROT_PDF.htm"+"?"+params.join('&'),{
			httpMethod: "POST",
			successCallback: function (url) {
				closeLoading();
		    },
		    failCallback: function (html, url) {
		    	closeLoading();
		    	reportMsg(html);
			}
		});
	}*/
	
}
