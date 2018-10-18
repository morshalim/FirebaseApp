var result = "";
var removeRoleAccess = "";
var removeRoleAccessMultiple = "";
$(document).ready(function(){
		
	populateRoleModuleList(roleModuleList);
	populateRoleAccessList(roleAccessList);
	populateSelectedScreen(selectedScreenList);
	
	$('#roleAccess,#moduleAccess').change(function() {
		 var roleId = $('#roleAccess option:selected').val();
		 var moduleId = $('#moduleAccess option:selected').val();
		 getScreensForRole(roleId, moduleId);
	 });

	 $('#btn_add_screen').on('click', function() {
		var roleId = $('#roleAccess option:selected').val();
		 var moduleId = $('#moduleAccess option:selected').val();
		getAvailableScreens(roleId,moduleId);

	});
	$('.selectAll').on('click', function() {

		if($('.selectAll').is(':checked')){
			$('.screens').prop('checked', true);
		}else
			$('.screens').prop('checked', false);
	});
	
	removeRoleAccess = $('#modal-role-access-approve').html();
	$('#modal-role-access-approve').remove();
	
	removeRoleAccessMultiple = $('#modal-role-access-approve_multiple_delete').html();
	$('#modal-role-access-approve_multiple_delete').remove();
	
	
});

function changeSortOrder() {
	$("#sortorder").toggleClass('fa-arrow-up fa-arrow-down');
}

function populateRoleModuleList(roleModuleList){
	$('#moduleAccess').append('<option value="">All</option>');
	for(var index=0; index<roleModuleList.length; index++)
	{
		$('#moduleAccess').append('<option value="'+roleModuleList[index].moduleId+'">'+roleModuleList[index].moduleName+'</option>');
	}
}

function populateRoleAccessList(roleAccessList){
	$('#roleAccess').append('<option value="">All</option>');
	for(var index=0; index<roleAccessList.length; index++)
	{
		$('#roleAccess').append('<option value='+roleAccessList[index].roleId+'>'+roleAccessList[index].roleName+'</option>');
	}
}

function populateSelectedScreen(selectedScreenList)
{
	var tbody = [];
	for(var index=0; index<selectedScreenList.length; index++)
	{
		tbody.push('<tr>');
		tbody.push('<td class="center">');
		tbody.push('<label><span class="hide">' + selectedScreenList[index].moduleId + '</span><input class="screens ace" type="checkbox" moduleId="' + selectedScreenList[index].moduleId + '" roleId="' + selectedScreenList[index].roleId + '" screenId ='+selectedScreenList[index].screenId+' ><span class="lbl"></span></label></td>\n');
		tbody.push('<td>'+selectedScreenList[index].moduleName+'</td>');
		tbody.push('<td>'+selectedScreenList[index].screenDescription+'</td>');
		tbody.push('<td>'+selectedScreenList[index].createdDate+'</td>')
		tbody.push('<td>'+selectedScreenList[index].roleName+'</td>');;
		//tbody.push('<td><a href="#" screenId ='+selectedScreenList[index].screenId+' onclick="DeleteScreen(this)"><i class="fa fa-trash">&nbsp;'+langMap.js_role_access_label_remove+'</i></a></td>');
		tbody.push('<td>');
		tbody.push('<i class="fa fa-info-circle bigger-120 blue" data-rel="popover" data-placement="top" title="" data-content="'+(selectedScreenList[index].screenInfo==null?"":selectedScreenList[index].screenInfo)+'" data-original-title="Additional Info"></i>&nbsp;&nbsp;');
		tbody.push('<i class="fa fa-trash-o bigger-120 red" moduleId="' + selectedScreenList[index].moduleId + '" roleId="' + selectedScreenList[index].roleId + '" screenId="'+selectedScreenList[index].screenId+'" onclick="DeleteScreen(this)"></i>');
		tbody.push('</td>');
		tbody.push('</tr>');
	}

	
	var table = $('#roleScreens');
	if(isDataTable(table[0]))
	{
		table.dataTable().fnClearTable(false);
		table.dataTable().fnDestroy();
	}
	$('#roleScreens tbody').html(tbody.join(''));
	table.dataTable({
		"iDisplayLength": 20,
		"aLengthMenu": [[10, 20, 25, 50, 100], [10, 20, 25, 50, 100]],
		"aoColumns": [{ "bSortable": false }, null, null, null, null, { "bSortable": false }],
		"oLanguage": dataTableLang
	});
	$('[data-rel=popover]').popover({html:true, trigger:'hover'});
}

function populateAvailableRoleScreens(aviableScreenList)
{
	$('#addScreenform').html('');
	var tbody = [];
	tbody.push('<div class="row">');
	tbody.push('<div class="col-sm-12">');
	tbody.push('<h3 class="blue">'+langMap.js_role_access_label_aval_screens+'<button style="align:\'right\';" type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="fa fa-remove"></i></button></h3>');
	tbody.push('<hr />');
	tbody.push('</div></div>');
	tbody.push('<label class="control-label" for="form-field-1">'+langMap.js_role_access_label_screens+'</label>');
	tbody.push('<table id="availableScreens" class="table table-striped table-bordered table-hover dataTable" aria-describedby="screens_info">');
	tbody.push('<thead>');
	tbody.push('<tr role="row">');
	tbody.push('<th class="center sorting_disabled" role="columnheader" rowspan="1" colspan="1" aria-label="" style="width: 195px;">');
	tbody.push('<label><input type="checkbox" class="selectAllPopup ace" ><span class="lbl"></span></label>');
	tbody.push('</th>');
	tbody.push('<th class="sorting" role="columnheader" tabindex="0" aria-controls="screens" rowspan="1" colspan="1" aria-label="Screen Name: activate to sort column ascending" style="width: 664px;">'+langMap.js_role_access_label_screen_name+'</th></tr>');
	tbody.push('</thead>		');
	tbody.push('<tbody></tbody>');
	tbody.push('</table>');
	tbody.push('<br><br>');
	tbody.push('<div class="row wizard-actions">');
	tbody.push('<button class="btn btn-sm btn-primary" onclick="AddScreens()">'+langMap.js_role_access_label_btn_add+'</button>');
	tbody.push('&nbsp;&nbsp;');
	tbody.push('<button class="btn btn-sm btn-primary" data-dismiss="modal" aria-hidden="true" rel="close">'+langMap.js_role_access_label_btn_close+'</button>');
	tbody.push('</div>');
	$('#addScreenform').html(tbody.join(''));
	tbody = [];

	for(var index=0; index<aviableScreenList.length; index++)
	{
		tbody.push('<tr>');
		tbody.push('<td class="center">');
		tbody.push('<label><input class="screensPopup ace" type="checkbox" rel="screens" screenId ='+aviableScreenList[index].screenId+' ><span class="lbl"></span></label></td>\n');
		tbody.push('<td>'+aviableScreenList[index].screenDescription+'</td>');
		tbody.push('</tr>');
	}

	

	result = $('#addScreenform').html();
	$('#addScreenform').html('');
	bootbox.dialog({message:result});
//	$('.modal-body').css('max-height','450px');
//	$('.modal-body').css('overflow-y','auto')

	var table = $('#availableScreens');
	if(isDataTable(table[0]))
	{
		table.dataTable().fnClearTable(false);
		table.dataTable().fnDestroy();
	}
	$('#availableScreens tbody').html(tbody.join(''));
	table.dataTable({
		"iDisplayLength": 20,
		"aLengthMenu": [[10, 20, 25, 50, -1], [10, 20, 25, 50, 100]],
		"aoColumns": [
			{ "bSortable": false },
			null],
			"oLanguage": dataTableLang
	});
	$('.selectAllPopup').on('click', function() {

			if($('.selectAllPopup').is(':checked')){
				$('.screensPopup').prop('checked', true);
			}else
				$('.screensPopup').prop('checked', false);
	});
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


function AddScreens() {
	var screens = [];
	$("input[type=checkbox]:checked").each(function() {
		screens.push($(this).attr("screenId"))+"~";

});
	addAvailableScreens(screens,$('#moduleAccess').val());
}

function DeleteMultipleScreens() {
	var screens = [];
	var roles = [];
	var modules = [];
	$("input[type=checkbox]:checked").each(function() {
		screens.push($(this).attr("screenId"));
		roles.push($(this).attr("roleId"));
		modules.push($(this).attr("moduleId"));
	});
	
	bootbox.dialog({message:removeRoleAccessMultiple, 
			buttons:{
				"success" :
				{
					"label" :  langMap.crt_bootbox_ok,
					"className" : "btn btn-sm btn-primary",
					"callback": function() {
						deleteAvailableScreens(screens.join(','),roles.join(','),modules.join(','));
					}
				}, 
				"danger" :
				{
					"label" :  langMap.crt_bootbox_cancel,
					"className" : "btn btn-sm",
					"callback": function() {
						$("#modal-role-access-approve_multiple_delete").modal('hide');
					}
				}
			}
		});
}

function DeleteScreen(event) {
	var screen = $(event).attr("screenId");
	var roleId = $(event).attr("roleId");
	var moduleId = $(event).attr("moduleId");
	/*bootbox.confirm(langMap.js_role_access_label_msg_delete, function(result) {
		if(result) {
			deleteAvailableScreens(screen);
		}
	});*/
	
		
	bootbox.dialog({message:removeRoleAccess, 
		buttons:{
			"success" :
			{
				"label" :  langMap.crt_bootbox_ok,
				"className" : "btn btn-sm btn-primary",
				"callback": function() {
					deleteAvailableScreens(screen,roleId,moduleId);
				}
			}, 
			"danger" :
			{
				"label" :  langMap.crt_bootbox_cancel,
				"className" : "btn btn-sm",
				"callback": function() {
					$("#modal-role-access-approve").modal('hide');
				}
			}
		}
	});
}


