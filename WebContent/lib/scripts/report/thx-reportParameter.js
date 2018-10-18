$(function($) {
	//datepicker plugin
		//link
	
	if((responseMap.runningReports && responseMap.runningReports > 0) || (responseMap.scheduledReports && responseMap.scheduledReports > 0)){
		$('#schedReports').show();

	}
	
	$('[rel="pagetitle"]').html(pagetitle);
	$('[rel="subtitle"]').html(subtitle);
	$('.date-picker').datepicker({
		autoclose: true,
		todayHighlight: true
	}).next().on(ace.click_event, function(){
		$(this).prev().focus();
	});
	
	$('.hasDatePicker').daterangepicker({
	}, function() {
		$('#FROM_DATE').val($('[name=daterangepicker_start]').val())
		$('#TO_DATE').val($('[name=daterangepicker_end]').val())
	});
	
	
	
	$('.hasDatePicker').keydown(function(event){
		//alert(event.keyCode);				
		if(event.keyCode== 189 || event.keyCode== 191)
		{
			return;
		}
		else
		{
			numericValidation(event);
		}
		if(event.which == 13 ){
			$('.hasDatePicker').blur();
		}
	});
	
	$('#filter-form input').each(function(){
		
	});
	
	$('#param-form select').each(function(){
		$(this).on('change',function(){
			var name = $(this).attr('name');
			var val = $(this).val();
			$('#param-form ['+name+']').each(function(i){
				var attrVal = $(this).attr(name);
				if(attrVal != val){
					$(this).hide();
					$(this).attr('selected',false);
				}else if(attrVal == val){
					$(this).show();
					$(this).parent().val($(this).val());
				}
			});
		});
		$(this).change();
	});

	$("#exit-report-btn").on('click',function(){
		window.location.href = "EV_VIEW_REPORTS.htm";
	});
	$('#RUN_REPORT').on('click',function(e){
		e.preventDefault();
		preSubmit();
		$( "#param-form" ).submit();
	});
	$('#RUN_BG_REPORT').on('click',function(e){
		e.preventDefault();
		preSubmit();
		$.ajax({
	           type: "POST",
	           url: "../json/EV_RUN_BACKGROUND_REPORT.htm",
	           data: $( "#param-form" ).serialize(), // serializes the form's elements.
	           success: function(data)
	           {
	        	   bootbox.dialog({
						message: langMap.run_report_background_popup_message,
						title: langMap.run_report_background_popup_title,
						buttons:			
						{
							success: {
								label: "OK",
								className: "btn-success",
								callback: function(e){ 
									window.location.href = "EV_VIEW_REPORTS.htm";
								}
							}
														
						}
					});
	           }
	         });
	});
	
	$('.monthyear').datepicker({
	    autoclose: true,
	    minViewMode: 1,
	    format: 'mm/yyyy'
	}); 
	
	//buildSessionReportParam(sessionReportParam);
});
function preSubmit() {
	showLoading();
	$('input[name="PARAM_MANAGER_ID"]').val($('#manager').attr('empId'));
	$('#param-form select[multiple]').each(function(){
		if($(this).val() == null){
			$(this).html('<option selected="selected" value="" ></option>');
		}
			
	});
	if($('textarea[name="PARAM_EMP_ID_LIST"]').length){
		$('textarea[name="PARAM_EMP_ID_LIST"]').val($('textarea[name="PARAM_EMP_ID_LIST"]').val().split(',').join('\n'));
		var empList = $('textarea[name="PARAM_EMP_ID_LIST"]').val().split('\n');
		var empUnique = [];
		$.each(empList, function(i, el){
			var el = el.split(',').join('').split(' ').join('');
		    if($.inArray(el, empUnique) === -1 && !isNaN(el) && el != '') empUnique.push(el);
		});
		$('input[name="PARAM_EMP_IDS"]').val(empUnique.join(','));
	}
}
function buildSessionReportParam(sessionReportParam) {
	$.each(sessionReportParam,function(key,value){
		if(null != value && value != undefined){
			if($('[name="PARAM_GRADE"]').is('select') && value.indexOf(',') > -1)
				value = value.split(',');
			$('[name="'+key+'"]').val(value);
		}
	});
}