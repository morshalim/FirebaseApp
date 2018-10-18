function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function IsNumeric(sText) {
	
   var ValidChars = "0123456789.,";
   var IsNumber=true;
   var Char;

 	if(sText == "")
		return false;
   for (i = 0; i < sText.length && IsNumber == true; i++) 
      { 
      Char = sText.charAt(i); 
      if (ValidChars.indexOf(Char) == -1) 
         {
         IsNumber = false;
		 break;
         }
      }
   return IsNumber;
   
}

function imageBuilder(preImg, imgSrc, postImg, ext) {
	
   return preImg + "/images/" + imgSrc + postImg + "." + ext;
}

function checkForEnter(btn) {
	
	var event = event || window.event;
	if (event.keyCode == 13) {
			$('#' + btn).trigger('click');
		return false;
	}
	return true;
}

function removeBad(strTemp) {
	
    strTemp = strTemp.replace(/\<|\>|\"|\'|\%|\;|\(|\)|\&|\+|\-/g,""); 
    return strTemp;
}

function getRoundingRules(cur, rounding, reviewItemId) {
	var rule = null;
	var inc = null;
	if(rounding && cur != "pct" && cur != "" && currency[cur] != undefined)
	{
		for(var x = 0; x < currency[cur].roundingRules.length; x++) {
			var curRule = currency[cur].roundingRules[x];
			if(curRule.name == "ROUNDINGINC")
				inc = curRule.value;
			else if(curRule.name == "ROUNDINGRULE")
				rule = curRule.value;
		}
	}
	
	return {roundRule: rule, roundInc: inc};
}

function getAmountFormat(cur, decimals, trailZero)
{
	var amountFormat = "#,###.00";
	var amountFormat1 = "#,###.00";
	var amountFormat10 = "#,###.0";
	var amountFormat100 = "#,###";
	
	var pctFormat = "#,###.00";
	
	var format = amountFormat;
	var conv = 1;
	var trail = 1;
	if(cur != "pct" && cur != "" && currency[cur] != undefined)
	{
		format = pctFormat;//incase this changes
		conv = currency[cur].decFactor;
		trail = currency[cur].trailZero;
	}
		
	if(decimals != null && parseInt(decimals,10) > conv)
		conv = decimals;
	
	if(conv == 0.1)
		format = amountFormat01;
	else if(conv == 1)
		format = amountFormat1;			
	else if(conv == 10)
		format = amountFormat10;
	else if(conv == 100)
		format = amountFormat100;

	if(trailZero != null)
		trail = parseInt(trailZero,10);
		
	if(trail == 0) {
		format = format.replace(/0/g, "#");
	}
	
	return format;
}

function getDateFormat(isDatepickerDate){
	var newDateFormat = '';
	
	if($.fn.datepicker.dates[fullLocale] && $.fn.datepicker.dates[fullLocale].format )
		newDateFormat = $.fn.datepicker.dates[fullLocale].format;
	else if($.fn.datepicker.dates[localeLang] && $.fn.datepicker.dates[localeLang].format)
		newDateFormat = $.fn.datepicker.dates[localeLang].format;
	else if($.fn.datepicker.dates['en'] && $.fn.datepicker.dates['en'].format)
		newDateFormat = $.fn.datepicker.dates['en'].format;
	else
		newDateFormat = defaultDateFormat1;
	if(isDatepickerDate){
		var DateFormat = newDateFormat.toLowerCase();
		if(DateFormat.indexOf("mm") >= 0)
			newDateFormat = DateFormat.replace("mm","MM");
	}
	return newDateFormat;
	
}

function getDateFormatForMoment(){
	var newDateFormat = '';
	
	if($.fn.datepicker.dates[fullLocale] && $.fn.datepicker.dates[fullLocale].format )
		newDateFormat = $.fn.datepicker.dates[fullLocale].format;
	else if($.fn.datepicker.dates[localeLang] && $.fn.datepicker.dates[localeLang].format)
		newDateFormat = $.fn.datepicker.dates[localeLang].format;
	else if($.fn.datepicker.dates['en'] && $.fn.datepicker.dates['en'].format)
		newDateFormat = $.fn.datepicker.dates['en'].format;
	else
		newDateFormat = defaultDateFormat1;
	
	var DateFormat = newDateFormat.toLowerCase();
	if(DateFormat.indexOf("mm") >= 0 && DateFormat.indexOf("dd") >= 0 && DateFormat.indexOf("yyyy") >= 0){
		newDateFormat = DateFormat.replace("mm","MM").replace("dd","DD").replace("yyyy","YYYY");
	}
	
	return newDateFormat;
}


/*function getDateFormatForDisplay(date){

	if(isNaN(date))
		date = Date.parse(date);
	else
        date = Date.newDate(date);
	
	if($.datepicker.regional[fullLocale])
		date = $.datepicker.formatDate($.datepicker.regional[fullLocale].dateFormat, date);	
	else if($.datepicker.regional[lang])
		date = $.datepicker.formatDate($.datepicker.regional[lang].dateFormat, date);
	else
		date = $.datepicker.formatDate($.datepicker.regional['en'].dateFormat, date);
	return date;
}*/


function getDateTimeFormatForDisplay(date){

	if(isNaN(date))
		date = Date.parse(date);
	else
        date = new Date(date);
	
	if($.datepicker.regional[fullLocale])
		date = $.datepicker.formatDate($.datepicker.regional[fullLocale].dateFormat + ' ' +date.toString('HH:mm'), new Date(date));	
	else if($.datepicker.regional[lang])
		date = $.datepicker.formatDate($.datepicker.regional[lang].dateFormat + ' ' +date.toString('HH:mm'), new Date(date));
	else
		date = $.datepicker.formatDate($.datepicker.regional['en'].dateFormat + ' ' +date.toString('HH:mm'), new Date(date));
	return date;
}

function getDateFormatForDisplay(date){
	var newDate = '';
	if(isNaN(date))
		date = Date.parse(date);
	else
        date = Date.newDate(date);

	if($.fn.datepicker.dates[fullLocale] && $.fn.datepicker.dates[fullLocale].format )
		newDate = moment(date).format($.fn.datepicker.dates[fullLocale].format.toUpperCase());
	else if($.fn.datepicker.dates[localeLang] && $.fn.datepicker.dates[localeLang].format)
		newDate = moment(date).format($.fn.datepicker.dates[localeLang].format.toUpperCase());
	else if($.fn.datepicker.dates['en'] && $.fn.datepicker.dates['en'].format)
		newDate = moment(date).format($.fn.datepicker.dates['en'].format.toUpperCase());
	else
		newDate = moment(date).format(defaultDateFormat);
	
	
	return newDate;
}

function getDateFormatForDisplayWithYY(date){
	
	var toFormat = getDateFormat();
	if(toFormat.indexOf("yyyy") >= 0)
		toFormat = toFormat.replace("yyyy","yy");
	return getDateFormatted(date, toFormat);
	
}

function getDateFormatForDisplayWithMMDD(date){

	var toFormat = getDateFormat();
	toFormat = toFormat.toLowerCase();
	var seperator = '';
	if(toFormat.indexOf("yyyy") >= 0)
	{
		var firstPart = toFormat.substring(0,2);
		var seperator = '';
		if(firstPart=='dd' || firstPart=='mm')
		{
			seperator = toFormat.substring(2,3);
		}
		else
		{
			seperator = toFormat.substring(4,5);
		}
		if(toFormat.indexOf(seperator+"yyyy") >= 0)
		{
			toFormat = toFormat.replace(seperator+"yyyy","");
		}
		else if(toFormat.indexOf("yyyy"+seperator) >= 0)
		{
			toFormat = toFormat.replace("yyyy"+seperator,"");
		}
	}

	return getDateFormatted(date, toFormat);

}

function getDateFormatted(date, toFormat){
	var newDate = '';
	if(toFormat==undefined)
	{
		toFormat=getDateFormat();
	}
	if(isNaN(date))
		date = Date.parse(date);
	else
        date = Date.newDate(date);

	newDate = moment(date).format(toFormat.toUpperCase());
	return newDate;
}

var unique_message_id;

function showErrorMsg(errorMsg, elementId, isError){
	//$('#'+elementId).html('');
	//var html = [];
	if(unique_message_id!=null)
			$.gritter.remove(unique_message_id, {
				fade: true, // optional
				speed: 'fast' // optional
		});
	
	var title = "";
	if(typeof(lang) != 'undefined' && lang.js_lable_error_msg)
		title = lang.js_lable_error_msg;
	
	unique_message_id = $.gritter.add({
		title: title,
		text: errorMsg,
		class_name: 'gritter-error',
		sticky: true
	});


	/*
	html.push('<div class="alert alert-danger">');
	html.push('	<button type="button" class="close" data-dismiss="alert"><i class="ace-icon fa fa-times"></i></button>');
	if(isError==null)
		html.push('	<strong>'+lang.text_save_error+'</strong>');
	html.push(' '+errorMsg+'<br />');
	html.push('</div>');
	$('#'+elementId).html(html.join(''));
	$("body,html").scrollTop(0);*/
}

function showSuccess(successMsg, elementId){
	//$('#'+elementId).html('');
	//var html = [];
	if(unique_message_id!=null)
				$.gritter.remove(unique_message_id, {
					fade: true, // optional
					speed: 'fast' // optional
			});

	unique_message_id = $.gritter.add({
		title: lang.js_lable_success_msg,
		text: successMsg,
		class_name: 'gritter-success',
		sticky: false,
		time: 4000
	});

	/*html.push('<div class="alert alert-success">');
	html.push('	<button type="button" class="close" data-dismiss="alert"><i class="ace-icon fa fa-times"></i></button>');
	html.push('	<strong>'+lang.text_save_success+'</strong>');
	html.push(' '+successMsg+'<br/>');
	html.push('</div>');
	$('#'+elementId).html(html.join(''));
	$("body,html").scrollTop(0);*/
}

function showCSVTemplate(element){
	var  fileName = $(element).attr('fileName');	
	var data={};
	showLoading();
	data[req_csv_url] = loadCSVTemplateURL;
	if(fileName!=null && fileName!='')
	{
		data[req_upload_file_name] = fileName;
	}
	$.fileDownload(
		data[req_csv_url]+"?"+uploaded_file_name+"="+data[req_upload_file_name],{
		successCallback: function (url) {
		 		closeLoading();
		    },
		    failCallback: function (html, url) {
		    	closeLoading();
		    	 reportMsg(html);
			}
	});
}

function numericValidation(event)
{
    if ( event.keyCode == 190 || event.keyCode == 110 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
        (event.keyCode == 65 && event.ctrlKey === true) ||
        (event.keyCode >= 35 && event.keyCode <= 39) && (event.keyCode != 46 || event.keyCode != 8)) {
             return;
    } else {
        if (event.keyCode == 46 || event.keyCode == 8) {
		            return true;
        }
        if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
            event.preventDefault();
        }
    }
}

function getWorkItemDetails(workitem)
{
	var itemIdWorkItemId = $(workitem).attr(lang.work_item_id);
	var itemRecievedEmployeeId = $(workitem).attr(lang.recieved_employee_id);
	var itemRecievedClientId = $(workitem).attr(lang.client_id);
	var itemWorkItemStatus = $(workitem).attr(lang.work_item_status);
	var workItemId = itemIdWorkItemId || '';
	var receivedEmployeeId = itemRecievedEmployeeId || '';
	var recievedClientId = itemRecievedClientId || '';
	var status = itemWorkItemStatus || '';
	var url = getWorkItemByIdURL+workItemId+lang.status_parameter+status+lang.received_employee_id_parameter+receivedEmployeeId+lang.received_client_id_parameter+recievedClientId+"&"+req_param+"="+breadCrumbHeader;
	window.location.href = url;
}

function isDataTable(nTable)
{
    var settings = $.fn.dataTableSettings;
    for (var i=0, iLen=settings.length; i<iLen; i++)
    {
        if ( settings[i].nTable == nTable )
        {
            return true;
        }
    }
    return false;
}

function deParam(url, param) {
    return decodeURI(
		(RegExp(param + '=' + '(.+?)(&|$)').exec(url)||[,null])[1]
	);
}

function showEmptyMessage(emptyMsg, elementId){
	$('#'+elementId).html('');
	var html = [];
	html.push('<p class="alert alert-info">');
	html.push('	<i class="icon-info-sign"></i> '+emptyMsg);
	html.push('</p>');
	$('#'+elementId).html(html.join(''));
}

function trim(originalStr){
	try {
		return originalStr.replace(/^\s+|\s+$/g, "");
	} catch (k) {
		return originalStr;
	}
}

(function($) {
	
	$.fn.serializeFormJSON = function() {

	   var o = {};
	   var f = this;
	   var a = f.serializeArray();
	   $.each(a, function() {
	       if (o[this.name]) {	
	           if (!o[this.name].push) {
	               o[this.name] = [o[this.name]];
	           }
	           o[this.name].push(this.value || '');
	       } else {
	    	    var e = f.find('[name='+this.name+']');
	       		if(e.is(':checkbox'))
	       			o[this.name] = e.is(':checked') ? '1' : '0';
	       		else
	       			o[this.name] = this.value || '';
	       }
	   });
	   return o;
	};
})(jQuery);

function crossSiteScriptValidation(){
    var isValid = true;
    var regExpArray = [
            new RegExp("<script>(.*?)<\/script>","i"),
            new RegExp("src[\r\n]*=[\r\n]*\\\'(.*?)\\\'","i"),
            new RegExp('src[\r\n]*=[\r\n]*\\\"(.*?)\\\"',"i"),
            new RegExp("</script(.*?)","i"),
            new RegExp("<script(.*?)","i"),
            new RegExp("<iframe>(.*?)<\/iframe>","i"),
            new RegExp("</iframe(.*?)","i"),
            new RegExp("<iframe(.*?)","i"),
            new RegExp("eval\\((.*?)\\)","i"),
            new RegExp("expression\\((.*?)\\)","i"),
            new RegExp("javascript:","i"),
            new RegExp("vbscript:","i"),
            new RegExp("onload(.*?)=","i"),
            new RegExp("<img(.*?)","i"),
            new RegExp("</img(.*?)","i"),
            new RegExp("<(.*?)>","i"),
            new RegExp("</","i"),
            new RegExp("<","i"),
            new RegExp("/>","i"),
            new RegExp(">","i"),
            new RegExp("&lt(.*?)&gt","i"),
            new RegExp("&lt/","i"),
            new RegExp("&lt","i"),
            new RegExp("/&gt","i"),
            new RegExp("&gt","i")
        ]
    $('input[type=text],textarea').each(function(){
        var isValidElement = true;
        var inputText = $(this).val();
        if(inputText && inputText.length > 0){
        for(index=0;index <regExpArray.length;index++){
            var pattern = regExpArray[index];
            var res = pattern.test(inputText);    
            if(res){
                isValidElement = false;
                break;
            }
        }
            if(!isValidElement){
                isValid = false;
                processError($(this).attr('id'));
                
            }
        }
    });
    if(!isValid){
    	showErrorMsg(lang.thx_leads_js_new_lead_invalid_input_fields);
    	$('#gritter-notice-wrapper').show();
    }
    	
    return isValid;
}

function processError(id) {
	$('#' + id).closest('.form-group').addClass('has-error');
}