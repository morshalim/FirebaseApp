$(function(){

	$('#filter-form input').each(function(){
		
	});
	
	$('#filter-form select').each(function(){
		$(this).on('change',function(){
			var name = $(this).attr('name');
			var val = $(this).val();
			$('#filter-form ['+name+']').each(function(){
				var attrVal = $(this).attr(name);
				if(attrVal != val){
					$(this).hide();
				}else if(attrVal == val){
					$(this).show();
				}
				$(this).parent().val('');
			});
		});
		$(this).change();
	});
	
	$("#EXPORT_BG_PDF").on('click',function(){
		var params = $('#filter-form').serializeObject();
		params.EXPORT_TYPE = 'EXPORT_BG_PDF';
		var url = '../json/EV_EXPORT_DYN_REPORT.htm';
		$.ajax({
			url: url,
			data: params,
			cache: false,
			context : {},
			success: function(data, textStatus, XMLHttpRequest) {
				showSuccess("The Report will show in your inbox when the processing is done.");
			},
			error: function(textStatus, XMLHttpRequest) {
				
			}
		});
	});
	
	$("#EXPORT_BG_XLS").on('click',function(){
		var params = $('#filter-form').serializeObject();
		params.EXPORT_TYPE = 'EXPORT_BG_XLS';
		var url = '../json/EV_EXPORT_DYN_REPORT.htm';
		$.ajax({
			url: url,
			data: params,
			cache: false,
			context : {},
			success: function(data, textStatus, XMLHttpRequest) {
				showSuccess("The Report will show in your inbox when the processing is done.");
			},
			error: function(textStatus, XMLHttpRequest) {
				
			}
		});
	});
	
	$("#EXPORT_PDF").on('click',function(){
		var params = $('#filter-form').serialize();
		params += "&EXPORT_TYPE=EXPORT_PDF";
		var url = '../download/EV_EXPORT_DYN_REPORT.htm';
		$.fileDownload(url+"?"+params,{
			successCallback: function (url) {
			 	closeLoading();
			},
			failCallback: function (html, url) {
			    closeLoading();
			}
		});
	});
	
	$("#EXPORT_XLS").on('click',function(){
		var params = $('#filter-form').serialize();
		params += "&EXPORT_TYPE=EXPORT_XLS";
		var url = '../download/EV_EXPORT_DYN_REPORT.htm';
		$.fileDownload(url+"?"+params,{
			successCallback: function (url) {
			 	closeLoading();
			},
			failCallback: function (html, url) {
			    closeLoading();
			}
		});
	});
	
	$("#RUN_REPORT").on('click',function(){
		var params = $('#filter-form').serializeObject();
		var url = '../json/EV_GET_DYN_REPORT.htm';
		$.ajax({
			url: url,
			data: params,
			cache: false,
			context : {},
			success: function(data, textStatus, XMLHttpRequest) {

				var table = $('#dynReport');	
				if(isDataTable(table[0]))
				{	
					//table.dataTable().fnClearTable(false);
					table.dataTable().fnDestroy();
					$('#uwl').empty();
				}	
				

				
				if(data && data[0] != ""){
					$('#uwl').html(data[0]);
					$('#uwl [style]').attr('style','');
					table = $('#dynReport');	
					var thead = table.find("thead");
					var thRows =  table.find("tr:has(th)");
	
					if (thead.length===0){  //if there is no thead element, add one.
						thead = jQuery("<thead></thead>").appendTo(table);    
					}
	
					var copy = thRows.clone(true).appendTo("thead");
					thRows.remove();
					$('#report-table-tab').show();				
					
					table.dataTable({
						"sScrollX": "100%",
						"sScrollXInner": "110%",
						"bScrollCollapse": true,
						"sScrollY": "400px",
						"bPaginate": false	,
						"oLanguage": dataTableLang
					});	
					
				}else{
					showError("No data found.");
					//$('#uwl').html("<div>No data found.</div>");
				}
				closeLoading();
			},
			error: function(textStatus, XMLHttpRequest) {
				showError("Configuration Error Occured.");
			}
		});
		
	});

	$("#exit-report-btn").on('click',function(){
		window.location.href = "EV_VIEW_DYN_REPORTS.htm";
	});

	
});
$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};


