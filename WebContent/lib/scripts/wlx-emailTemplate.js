var med='';
var preview='';
$(document).ready(function(){
	populateTemplates(templates);

	if(locales!=null)
		populateLocales(locales);

	$('#newTemplate').hide();
	populateLocales(locales,null,true);
	med = $("#translate_dlg").html();
	$("#translate_dlg").remove();
	preview = $('#preview_dlg').html();
	$("#preview_dlg").remove();
	$('.date-picker').datepicker({
		autoclose: true,
		todayHighlight: true
	})
	//show datepicker when clicking on the icon
	.next().on(ace.click_event, function(){
		$(this).prev().focus();
	});

	$('#editor1').ace_wysiwyg({
		toolbar:
		[
			null,
			'fontSize',
			null,
			{name:'bold', className:'btn-info'},
			{name:'italic', className:'btn-info'},
			{name:'strikethrough', className:'btn-info'},
			{name:'underline', className:'btn-info'},
			null,
			{name:'insertunorderedlist', className:'btn-success'},
			{name:'insertorderedlist', className:'btn-success'},
			{name:'outdent', className:'btn-purple'},
			{name:'indent', className:'btn-purple'},
			null,
			{name:'justifyleft', className:'btn-primary'},
			{name:'justifycenter', className:'btn-primary'},
			{name:'justifyright', className:'btn-primary'},
			{name:'justifyfull', className:'btn-inverse'},
			null,
			{name:'createLink', className:'btn-pink'},
			{name:'unlink', className:'btn-pink'},
			null,
			{name:'insertImage', className:'btn-success'},
			null,
			'foreColor',
			null,
			{name:'undo', className:'btn-grey'},
			{name:'redo', className:'btn-grey'}
		],
		'wysiwyg': {
			fileUploadError: showErrorAlert
		}
	}).prev().addClass('wysiwyg-style1');





});

function showErrorAlert(){

}

function populateLocales(locales, isForAdd, isForDropDown){
	var html = [];
	for(index=0;index<locales.length;index++){
		html.push('<option value="'+locales[index].locale_id+'">'+locales[index].localeName+'</option>');
	}
	if(isForDropDown)
		$('#localechange').html(html.join(''));
	else if(isForAdd)
		$('#newTemplateLocale').html(html.join(''));
	else
		$('#localeDropDown').html(html.join(''));

}

function populateEmailAddress(emailList){
	var html = [];
	for(index=0;index<emailList.length;index++){
		html.push('<option value="'+emailList[index].id+'">'+emailList[index].emailId+'</option>');
	}
	$('#emailAddress').html(html.join(''));

}

function populateFunction(functionList){
	var html = [];
		for(index=0;index<functionList.length;index++){
			html.push('<option value="'+functionList[index]+'">'+functionList[index]+'</option>');
		}
	$('#functionDropDown').html(html.join(''));
	functionChanged();
}

function functionChanged(){
	var html = [];
	var functionSelected = $('#functionDropDown').val();
	if(actionList!=null){
		$.each(actionList,function(key,value){
			if(functionSelected == key){
				for(var index=0;index<value.length;index++){
					html.push('<option templateId="'+value[index].templateId+'" value="'+value[index].action+'">'+value[index].action+'</option>');
				}
			}
		});
	}
	$('#actionDropDown').html(html.join(''));
}

function populateTemplates(templates){
	var html = [];
	if(templates!=null && templates.length>0){
		for(var index=0;index<templates.length;index++){
			var functionName = getFunctionAndActionName(templates[index].templateId,true);
			var actionName = getFunctionAndActionName(templates[index].templateId,false);
			html.push('<tr>');
			html.push('	<td class="center"><label class="position-relative"><input type="checkbox" class="ace" /><span class="lbl"></span></label></td>');
			html.push('	<td>'+actionName+'</td>');
			html.push('							<td>'+functionName+'</td>');
			html.push('							<td>'+templates[index].stDate+'</td>');
			html.push('							<td>'+templates[index].enDate+'</td>');
			html.push('							<td>'+templates[index].locale+'</td>');
			html.push('							<td>'+getStatus(templates[index].status)+'</td>');
			html.push('							<td>');
			html.push('								<div class="btn-group">');
			html.push('									<button data-toggle="dropdown" class="btn btn-sm btn-white dropdown-toggle">');
			html.push('										Options');
			html.push('										<i class="ace-icon fa fa-angle-down icon-on-right"></i>');
			html.push('									</button>');

			html.push('									<ul class="dropdown-menu dropdown-white pull-right">');
			html.push('										<li>');
			html.push("											<a href='#' onclick='editTemplate(this)' templateId='"+templates[index].templateId+"' functionName='"+functionName+"' action = '"+actionName+"' locale='"+templates[index].locale+"' stDate='"+templates[index].stDate+"' enDate='"+templates[index].enDate+"' email='"+templates[index].emailId+"' subject='"+templates[index].subject+"' message='"+templates[index].body+"' status ='"+templates[index].status+"'>Edit</a>");
			html.push('										</li>');
			html.push('										<li>');
			html.push("											<a href='#' class='translate' templateId='"+templates[index].templateId+"' functionName='"+functionName+"' action ='"+actionName+"' locale='"+templates[index].locale+"' stDate='"+templates[index].stDate+"' enDate='"+templates[index].enDate+"' email='"+templates[index].emailId+"' subject='"+templates[index].subject+"' message='"+templates[index].body+"' status ='"+templates[index].status+"'>Translate</a>");
			html.push('										</li>');
			if(templates[index].status!='3'){
				html.push('										<li>');
				html.push('											<a href="#" class="deactivate" locale="'+templates[index].locale+'" templateId="'+templates[index].templateId+'">Deactivate</a>');
				html.push('										</li>						');
			}
			html.push('										<li class="divider"></li>');
			html.push('										<li>');
			html.push("										<a href='#' class='preview' subject='"+templates[index].subject+"' message='"+templates[index].body+"'>Preview</a>");
			html.push('										</li>');
			html.push('									</ul>');
			html.push('								</div>');
			html.push('							</td>')
			html.push('						</tr>');
			}

		}
	var table = $('#pending_tab');

	if(isDataTable(table[0]))
	{
		table.dataTable().fnClearTable(false);
		table.dataTable().fnDestroy();
	}
	$('#pending_tab tbody').html(html.join(''));
	table.dataTable({
		"iDisplayLength": 20,
		"aLengthMenu": [[10, 20, 25, 50, -1], [10, 20, 25, 50, 100]],
		"aoColumns": [
			{ "bSortable": false,"sWidth": '5%'},
			null, null , null, null,null,null,{ "bSortable": false }
		],
		"aaSorting": [[ 1, "asc" ]],
		"oLanguage": dataTableLang
	});

	$(".translate").on(ace.click_event, function() {


				//$('#localechange').html(html.join(''));
				var data={};
				var locale = $(this).attr('locale');
				data["functionName"] = $(this).attr('functionName');
				data["action"] = $(this).attr('action');
				data["email"] = $(this).attr('email');
				data["subject"] = $(this).attr('subject');
				data["startDate"] = $(this).attr('stDate');
				data["endDate"] = $(this).attr('enDate');
				data["message"] = encodeURIComponent($(this).attr('message'));
				data["status"] = $(this).attr('status');
				data["templateId"] = $(this).attr('templateId');



				bootbox.dialog({
					message: med,
					title: "Translate Template",
					buttons:
					{
						success: {
							label: "Save",
							className: "btn-success",
							"callback": function() {
								var language = $('#localechange').val();
								if(locale == language)
									return false;
								data["language"] = language;
								translateLocale(data);
							}
						},
						danger: {
							label: "Cancel",
							className: "btn-default"
						}

					}
				});

		});

		$(".preview").on(ace.click_event, function() {

					//$('#localechange').html(html.join(''));

				var subject = $(this).attr('subject');
				var message = $(this).attr('message');

				bootbox.dialog({
					message: preview,
					title: langMap.js_email_template_preview_template,
					buttons:
					{

						danger: {
							label: langMap.jsp_email_template_btn_cancel,
							className: "btn-default"
						}

					}
				});
				$('#previewSubject').val(subject);
				$('#editor2').html(message);
	});

	$(".deactivate").on(ace.click_event, function() {

						//$('#localechange').html(html.join(''));

		var templateId = $(this).attr('templateId');
		var locale = $(this).attr('locale');
		data={};
		data["templateId"]=templateId;
		data["locale"]=locale;
		deActivateEmailTemplate(data);


	});


}

function getFunctionAndActionName(templateId, isFunction){
	if(templateTypes!=null){

		for(var index=0;index<templateTypes.length;index++){
			if(templateId == templateTypes[index].templateId){
				if(isFunction)
					return templateTypes[index].functionName;
				else
					return templateTypes[index].action;

			}
		}
	}
	return "";
}

function getStatus(statusId){

	if(statusId == '1')
		return '<span class="label label-success">Active</span>';
	else if(statusId == '3')
		return '<span class="label label-warning">In-Active</span>';
	else{
		return '<span class="label label-warning">In-Active</span>';
	}
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

function closeTemplate(){
	$('#newTemplate').hide();
	$('#viewTemplate').show();

}

function addNewTemplate(){
	if(locales!=null)
		populateLocales(locales, true);

	populateFunction(functionList);
	populateEmailAddress(emailList);
	$('#newTemplateLocale').removeAttr('disabled');
	$('#functionDropDown').removeAttr('disabled');
	$('#actionDropDown').removeAttr('disabled');
	$('#emailAddress').removeAttr('disabled');

	var subject = $('#subject').val('');
	var startDate = $('#startDate').val('');
	var endDate = $('#endDate').val('');
	var message = $('#editor1').html('');
	var status = $('#statusDropDown').val('1');
	$('#saveTemplate').attr('edit','false');
	$('#newTemplate').show();
	$('#viewTemplate').hide();

}

function editTemplate(ele){
	if(locales!=null)
			populateLocales(locales, true);

		populateFunction(functionList);
		populateEmailAddress(emailList);

		$('#newTemplateLocale').attr('disabled','disabled');
		$('#functionDropDown').attr('disabled','disabled');
		$('#actionDropDown').attr('disabled','disabled');
		$('#emailAddress').attr('disabled','disabled');

		var locale = $(ele).attr('locale');
		locale = locale.replace(locale.substr(0,2),(locale.substr(0,2)).toLowerCase())
		$('#newTemplateLocale').val(locale);

		$('#functionDropDown').val($(ele).attr('functionName'));
		
		functionChanged();
		$('#actionDropDown').val($(ele).attr('action'));
		$('#emailAddress').val($(ele).attr('email'));
		$('#actionDropDown option:selected').attr('templateId',$(ele).attr('templateId'));
		$('#subject').val($(ele).attr('subject'));
		$('#startDate').val($(ele).attr('stDate'));
		$('#endDate').val($(ele).attr('enDate'));
		$('#editor1').html($(ele).attr('message'));
		$('#statusDropDown').val($(ele).attr('status'));

		$('#newTemplate').show();
		$('#viewTemplate').hide();
		$('#saveTemplate').attr('edit','true');

}

function saveTemplate(isEdit){

	if($('#saveTemplate').attr('edit')=='true')
		isEdit = true;
	saveTemplateAjax(isEdit);


}

function getTemplatesForLocale(){

	getTemplatesForLocaleForAjax();
}

function closeScreen(){

	var anchorRef  = $('#breadCrumbActiveClass').prev().find('a');
		var href = $(anchorRef).attr('href');
	window.location = href;
}