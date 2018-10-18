var crudConfirmDialog = "";
var batchArray = [];
var rowIndexArray = [];

$(document).ready(function() {
	$('#tableList').change(function() {
		$('#page-error-cntr').empty();
		var tableName = $('#tableList').val();
		location.href = VIEWTABLEINFOURL+tableName;
	});
	crudConfirmDialog = $('#modal-crud-confirm').html();
	$('#modal-crud-confirm').remove();

	/*
	 * $('#crud-table-cntr').dataTable( { "sDom": "<'row'<'span6'l><'span6'f>r>t<'row'<'span6'i><'span6'p>>"
	 * });
	 */	
	$('#batchUpdate').attr('disabled', 'disabled');
	$("#batchCheckBox").on('click', function() {
		if($("#batchCheckBox").is(':checked')){
			$('#batchUpdate').removeAttr('disabled');
		}
		else
			$('#batchUpdate').attr('disabled', 'disabled');
	});
});



function loadMenuList(menuOptions, selectedOption) {
	var selectOptions = [];
	$.each(menuOptions, function(index, item) {
		if (selectedOption == item.itemId)
			selectOptions.push("<option value='" + item.itemId
					+ "' selected='selected'>" + item.itemValue + "</option>");
		else
			selectOptions.push("<option value='" + item.itemId + "'>"
					+ item.itemValue + "</option>");
	});
	$('#tableList').append(selectOptions.join(''));
}

function showAction(action) {
	if ((action == 'ADD' && $('#tableName').val() == 'CORE_METADATA')
			|| action == 'DELETE') {
		var url = GETAVAILABLETABLESURL;
		var data = {
			'action' : action
		};
		getAvailableTables(data, url);
	} else {
		$('#page-error-cntr').empty();
		buildAction(action);
		if(action == 'ADD')
			populateRowData(action, columnDef, null);
	}
}

function buildAction(action, rowData) {
	$('#popup').html(getAddContentHtml(columnDef, action, rowData));
	bootbox.dialog({message:$('#popup').html()});
	$('#popup').empty();
	
	//$('.date-picker').datepicker();
	
	/*$('.fa-calendar').click(function(){
		if(($(this).attr('class')).indexOf('fa-calendar')!=-1){
			var id = $(this).parent().parent().find('input').attr('id');
			$('#'+id).datepicker('show');
			$('div.datepicker.datepicker-dropdown.dropdown-menu').css('z-index','2000');
		}
		
	});*/
	
	$('.date-picker').datepicker({
		autoclose: true,
		todayHighlight: true
	})
	//show datepicker when clicking on the icon
	.next().on(ace.click_event, function(){
		$(this).prev().focus();
		//$('div.datepicker.datepicker-dropdown.dropdown-menu').css('z-index','2000');
	});
	
	/*$('.date-picker').click(function(){
		$('div.datepicker.datepicker-dropdown.dropdown-menu').css('z-index','2000');
		
	});*/

	
	$("#save").bind('click', function() {
		$('#page-error-cntr').empty();
		$('.errorMsg').empty();
		saveDetails($('#action').val(), $('#rowData').val());
	});
}

function saveDetails(action, rowData) {
	var url = "";
	if (action == 'EDIT') {
		if (!validateEdit(rowData))
			return;
		url = UPDATEROWURL;
	} else {
		if (!validation(false))
			return;
		url = ADDROWURL;

	}
	var tableName = $('#tableName').val();
	var dataTable = [];
	var element = '';
	var rowdataArray = getRowDataArray(rowData);
	$.each(columnDef, function(index, item) {
		if ((!item.inputField || item.readOnly) && item.visible && action == 'EDIT') {
			if(item.readOnly)
			  element = $('#' + item.columnName).html() || '';
			else
			 element = $('#' + item.columnName).val() || '';
			dataTable.push([ item.columnName, element ]);
		} else if (item.inputField) {
			element = $('#' + item.columnName).val() || '';
			if(action == 'EDIT' && item.primaryKey && rowdataArray && rowdataArray[item.columnName] != null && rowdataArray[item.columnName] != ''){
				if(element != rowdataArray[item.columnName])
					dataTable.push([ "OLD_VAL_"+item.columnName, rowdataArray[item.columnName] ]);
			}			
			dataTable.push([ item.columnName, element ]);
		}
	});
	var rowData = getSerializedQuery(dataTable);
	var urlquery = {
		"table-name" : tableName,
		"isRow" : true,
		"rowData" : rowData
	}
	sendActionRequest(urlquery, url);
}

function getDataTableRowValues(row) {
	var oTable = $('#crud-table-cntr').dataTable();
	var oSettings = oTable.fnSettings();
	var dataTable = [];
	var columnIndex = 0;
	$.each(columnDef, function(index, item) {
				
			if(item.joinSql != null && item.joinSql != '' && item.joinColumn != null && item.joinColumn != '' && item.joinColumnLabel != null && item.joinColumnLabel != ''){
				dataTable.push([ item.joinColumnAlias,oSettings.aoData[row]._aData[columnIndex] ]);
				columnIndex++;
			}
			if (item.columnType == 'Date' || item.columnType == 'Timestamp') {
				var value = oSettings.aoData[row]._aData[columnIndex];
				if(item.columnType == 'Date' )
					dataTable.push([ item.columnName,getDateFormatForDisplay(value?new Date(value):"")]);
				else 
					dataTable.push([ item.columnName,getDateTimeWithSecFormatForDisplay(value?new Date(value):"")]);
			}else
				dataTable.push([ item.columnName,oSettings.aoData[row]._aData[columnIndex] ]);
			columnIndex++;
	});
	return getSerializedQuery(dataTable);
}

function getSerializedQuery(rowObjectValues) {
	//var colon = ':';
	//var semiColon = ';';
	var serializedValue = [];
	for ( var i = 0; i < rowObjectValues.length; i++) {
		var columnValue = rowObjectValues[i];
		if (typeof columnValue[1] == "string" && columnValue[1].indexOf("<select") != -1 && columnValue[1].indexOf("<option") != -1) {
			var selectObj = columnValue[1].toElement();
			for ( var j = 0; j < selectObj.options.length; j++) {
				if (selectObj.options[j].selected)
					serializedValue.push(columnValue[0] + KEY_VALUE_SEPERATION
							+ selectObj.options[j].value);
			}
		} else
			serializedValue.push(rowObjectValues[i].join(KEY_VALUE_SEPERATION));
	}
	return serializedValue.join(COLUMN_SEPERATION);
}

String.prototype.toElement = function() {
	var t = document.createElement("div");
	t.innerHTML = this;
	return t.getElementsByTagName("*")[0];
}
function getTableData(tableName) {
	$('#page-error-cntr').empty();
	$('#tableName').val(tableName);
	var tabName = columnDef[0].menuName;
	$('#pageSubTitle').html('<i class="icon-double-angle-right"></i> ' + tabName);
	$('#breadCrumbActiveClass').html(tabName);

	var tabTableNameHTML = [];
	tabTableNameHTML.push('<ul class="nav nav-tabs" id="myTab1">');
	tabTableNameHTML.push('<li class="active"><a data-toggle="tab" href="#uwl"></i>');
	tabTableNameHTML.push(tabName + '&nbsp;&nbsp;');
	tabTableNameHTML.push('</a></li>');
	tabTableNameHTML.push('</ul>');
	$("#tab-table-Name").html(tabTableNameHTML.join(''));
	var metaData = columnDef;
	var keyIndPos = getIsPrimaryKeyColPos(metaData);
	var tableNameIndPos = getTableNameColPos(metaData);
	var response = [];
	var url = GETTABLEDATAURL;
	var oTable = $('#crud-table-cntr')
			.dataTable(
					{
						"bAutoWidth":false,
						"sScrollY":"500px",
						"sScrollX":"100%",
						"bDestroy" : true,
						"bProcessing" : false,
						"bServerSide" : true,
						"oLanguage": dataTableLang,
						"iDisplayLength": 20,
			    		"aLengthMenu": [[10, 20, 25, 50, -1], [10, 20, 25, 50, "All"]],
						"sAjaxSource" : url,
						"fnServerData" : function(sSource, aoData, fnCallback) {
							aoData.push({
								"name" : "table-name",
								"value" : tableName
							});
							$.ajax({
								"dataType" : 'json',
								"type" : "POST",
								"url" : url,
								"data" : aoData,
								cache : false,
								async : false,
								"success" : function(resp) {
									fnCallback(wlxEval(resp));
								}
							});
						},
						"aoColumns" : getColumn(metaData),
						"aoColumnDefs" : getRender(metaData, keyIndPos, tableNameIndPos),
						"fnRowCallback" : function(nRow, aData, iDisplayIndex,iDisplayIndexFull) {
						},
						"fnDrawCallback" : function() {
							  $('.dataTables_scrollBody table thead tr').children().removeAttr('class');
							  rowIndexArray = [];
							  batchArray = [];
							  $('#batchUpdate').attr('disabled', 'disabled');
							  $('#batchCheckBox').attr('checked', false);
							  $('#messageId').empty();
							$(".fa-trash-o")
									.bind(
											'click',
											function() {
												var element = this;
												$('#page-error-cntr').empty();
												/*
												 * bootbox.confirm(langMap.js_crud_confirm_dialog,
												 * function(result) { if(result) {
												 * deleteCall(element); }
												 * 
												 * });
												 */

																														
												bootbox.dialog({message:crudConfirmDialog, 
													buttons:{
														"success" :
														{
															"label" :  langMap.crt_bootbox_ok,
															"className" : "btn btn-sm btn-primary",
															"callback": function() {
																deleteCall(element);
															}
														}, 
														"danger" :
														{
															"label" :  langMap.crt_bootbox_cancel,
															"className" : "btn btn-sm",
															"callback": function() {
																$("#modal-proxy-delegete-approve").modal('hide');
															}
														}
													}
												});
												/*
												 * var r=confirm("Are you sure
												 * that you want to Delete this
												 * record?"); if(r==true)
												 * deleteCall(this);
												 */
											});

							$(".fa-edit").bind('click', function() {
								$('#page-error-cntr').empty();
								showEdit(this);
							});
							$(".fa-clone").bind('click', function() {
								$('#page-error-cntr').empty();
								showClone(this);
							});
						}
					});
	if (oTable.length > 0) {
        oTable.fnAdjustColumnSizing();
	}
	$('.dataTables_scrollBody table thead tr').children().removeAttr('class');
	$('#batchUpdate').attr('disabled', 'disabled');
	$('#batchCheckBox').attr('checked', false);
	oTable.dataTable().fnSetFilteringDelay();
}

function getEditedColumn(visiblePostion, metaData) {
	var columnPostion = -1;
	var editedColumnName = "";
	$.each(metaData, function(index, item) {
		if (item.visible) {
			columnPostion = columnPostion + 1;
			if (visiblePostion == columnPostion) {
				editedColumnName = item.columnName;
				return false;
			}
		}
	});
	return editedColumnName;
}
function getRender(resp, keyIndPos, tableNameIndPos) {
	var render = [];
	if (resp != undefined) {
		var visibleCount = -1;
		var isDeleteRow = false;
		var isEditable = false;
		var isPrimaryKeyColumn = false;
		var count = 0;
		$.each(resp, function(index, item) {
			if (item['delete'])
				isDeleteRow = true;
			if (!item.readOnly)
				isEditable = true;
			visibleCount += 1;
			var showRootColumn = true;
			if(item.joinSql != null && item.joinSql != '' && item.joinColumn != null && item.joinColumn != '' && item.joinColumnLabel != null && item.joinColumnLabel != ''){
				visibleCount += 1;
				if(item.joinColumnShow)
					showRootColumn = true;
				else
					showRootColumn = false;
			}
			if (showRootColumn && (item.fieldType == 'INPUT_SELECT' || item.columnType == 'Boolean')) {
				if (item.helpValues != undefined && item.helpValues != "") {
					render.push({
						"aTargets" : [ visibleCount ],
						render : function( data, type, row, meta ){
							var o = {"iDataRow":meta.row,"aData":row};
							var selectedColumnPos = meta.col;
							if(tableName !='CORE_METADATA'){
								isPrimaryKeyColumn = item.primarykey;
							}else{
								if(count > meta.col){
									count = 0
									isPrimaryKeyColumn = false;
								}
								if(count == 0){
									if(o.aData[keyIndPos] == '1'){
										isPrimaryKeyColumn = true;
										count++;
									}
								}else{
									count = meta.col;
								}
							}
							return buildDropdown(item, selectedColumnPos, isPrimaryKeyColumn, tableNameIndPos, o);
						},
						bSortable : false
					});
				}
			} else if (showRootColumn && (item.columnType == 'Date' || item.columnType == 'Timestamp')) {

				render.push({
					"aTargets" : [ visibleCount ],
					render : function( data, type, row, meta ){
						var selectedColumnPos = meta.col;
						//return formatDate(row[selectedColumnPos]);
						if(item.columnType == 'Date' )
							return getDateFormatForDisplay(row[selectedColumnPos]?new Date(row[selectedColumnPos]):"");
						else 
							return getDateTimeWithSecFormatForDisplay(row[selectedColumnPos]?new Date(row[selectedColumnPos]):"");
					},
					bSortable : true
				});
			}

		});
		if (isDeleteRow || isEditable) {
			render.push({
				"aTargets" : [ visibleCount + 1 ],
				render : function( data, type, row, meta ){
					var o = {"iDataRow":meta.row,"aData":row};
					var isDelete = isDeleteRow;
					var isEdit = isEditable;
					var tableName = $('#tableName').val();
					var actionData = [];
					actionData.push('<div>');
					if (isEdit)
						actionData.push('<a href="#" rel="' + tableName
								+ '" rowIndex="' + o.iDataRow + '" id="'
								+ o.aData[0] + '" class="fa fa-edit">&nbsp;'
								+ langMap.js_crud_btn_edit
								+ '&nbsp;&nbsp;&nbsp;</a>');
					if (isDelete)
						actionData.push('<a href="#" rel="' + tableName
								+ '" rowIndex="' + o.iDataRow + '" id="'
								+ o.aData[0] + '" class="fa fa-trash-o">&nbsp;'
								+ langMap.js_crud_btn_remove + '&nbsp;&nbsp;&nbsp;</a>');
						actionData.push('<a href="#" rel="' + tableName
							+ '" rowIndex="' + o.iDataRow + '" id="'
							+ o.aData[0] + '" class="fa fa-clone"><i class="fa fa-files-o">&nbsp;'+langMap.js_crud_btn_clone+'</i></a>');
					
					actionData.push('</div>');
					return actionData.join('');
				},
				bSortable : false
			});
		}
		var tblName = $('#tableName').val();

	}

	return render;

}
function getDateTimeWithSecFormatForDisplay(date){

	if(isNaN(date))
		date = Date.parse(date);
	else
        date = new Date(date);
	
	if($.datepicker.regional[fullLocale])
		date = $.datepicker.formatDate($.datepicker.regional[fullLocale].dateFormat + ' ' +date.toString('HH:mm:ss'), new Date(date));	
	else if($.datepicker.regional[lang])
		date = $.datepicker.formatDate($.datepicker.regional[lang].dateFormat + ' ' +date.toString('HH:mm:ss'), new Date(date));
	else
		date = $.datepicker.formatDate($.datepicker.regional['en'].dateFormat + ' ' +date.toString('HH:mm:ss'), new Date(date));
	return getTimeDisplay(date);
}
function getTimeDisplay(date){
	var dateTime= '';
	var dateSplit =date.split(' ');
	var splitTile =dateSplit[1].split(':');
		if(splitTile[0]>12){
			splitTile[0] = splitTile[0]-12;
			dateTime = dateSplit[0]+" "+splitTile[0]+":"+splitTile[1]+":"+splitTile[2];
		}
		else if(splitTile[0]<=12){
			if(splitTile[0] ==0){
				splitTile[0] = 12;
			}
			dateTime = dateSplit[0]+" "+splitTile[0]+":"+splitTile[1]+":"+splitTile[2];
		}
	return dateTime;
}
function getIsPrimaryKeyColPos(resp){
	var pKeyInd = 0;
	$.each(resp, function(index, item) {
		if(item.columnName == 'IS_PRIMARYKEY'){
			pKeyInd = index;
			return false; 
		}
	});
	return pKeyInd;
}
function getTableNameColPos(resp){
	var ind = -1;
	$.each(resp, function(index, item) {
		if(item.columnName == 'TABLE_NAME'){
			ind = index;
			return false; 
		}
	});
	return ind;
}
function getEditedColumn(visiblePostion, metaData) {
	var columnPostion = -1;
	var editedColumnName = "";
	$.each(metaData, function(index, item) {
		if (item.visible) {
			columnPostion = columnPostion + 1;
			if (visiblePostion == columnPostion) {
				editedColumnName = item.columnName;
				return false;
			}
		}
	});
	return editedColumnName;
}
function isPrimaryKey(metaData, columnName) {
	var primaryKey = false;
	$.each(metaData, function(index, item) {
		if (item.columnName == columnName) {
			primaryKey = item.primaryKey;
			return false;
		}
	});
	return primaryKey;
}
function getColumn(resp) {
	var column = [];
	var isDeleteRow = false;
	var isEditable = false;
	if (resp != undefined) {
		$.each(resp, function(index, item) {
			//var colWidth= (item.Title.length + 15)*10 +'px';
			var showRootColumn = true;
			if(item.joinSql != null && item.joinSql != '' && item.joinColumn != null && item.joinColumn != '' && item.joinColumnLabel != null && item.joinColumnLabel != ''){
				var visible = true;
				if(item.joinColumnShow)
					showRootColumn = true;
				else
					showRootColumn = false;
				column.push({
					"sTitle" : item.joinColumnLabel,
					"bVisible" : visible
					//"sWidth":colWidth
				});
			}
			if(!showRootColumn)
				item.visible = showRootColumn;
			
			column.push({
				"sTitle" : item.label,
				"bVisible" : item.visible
				//"sWidth":colWidth
			});
			if (item['delete'])
				isDeleteRow = true;
			if (!item.readOnly)
				isReadOnly = true;
		});
	}
	if (isDeleteRow || isReadOnly) {
		column.push({
			"sTitle" : 'Action',
			"bVisible" : true
		});
	}
	return column;
}
function deleteCall(element) {
	var row = $(element).attr('rowIndex');
	var rowData = getDataTableRowValues(row);
	var tableName = $('#tableName').val();
	var deleteRowUrl = DELETEROWURL;
	var urlquery = {
		"table-name" : tableName,
		"rowData" : rowData
	};

	deleteRow(urlquery, deleteRowUrl);
}

$.fn.dataTableExt.oApi.fnStandingRedraw = function(oSettings) {
	if (oSettings.oFeatures.bServerSide === false) {
		var before = oSettings._iDisplayStart;
		oSettings.oApi._fnReDraw(oSettings);
		// iDisplayStart has been reset to zero - so lets change it back
		oSettings._iDisplayStart = before;
		oSettings.oApi._fnCalculateEnd(oSettings);
	}
	// draw the 'current' page
	oSettings.oApi._fnDraw(oSettings);
	$('.dataTables_scrollBody table thead tr').children().removeAttr('class');
};

function getAddContentHtml(columnDef, action, rowData) {
	var tableName = $('#tableName').val();
	var tabName = columnDef[0].menuName;
	var html = [];
	//html.push('<a href="#" class="close">&times;</a>');
	html.push('	<h3 class="blue">' + action + ' ' + tabName+ '</h3><hr />');
	html.push('	<div class="errorMsg" id="errorMsg"></div>');
	html.push(' <div style="color: #000000">');
	html.push('	<input type="hidden" id="action" value="' + action + '">');
	rowData = rowData || '';
	html.push('	<input type="hidden" id="rowData" value="' + rowData + '">');
	html.push('<table>');
		$.each(columnDef,function(index, item) {
			if ((!item.inputField || item.readOnly) && item.visible && action == 'EDIT') {
				html.push('	<tr>');
				html.push('	<td class="tablePadding"><label class="control-label">'+ item.label + '</label> </td>');
				if(item.readOnly){
					if (item.fieldType == 'INPUT_SELECT'|| item.columnType == 'Boolean')
						html.push(renderDropdown(item,action));
					else
						html.push(' <td class="tablePadding"><div class="controls"><div id="'+ item.columnName+ '"></div></div></td>');
				}else
					html.push(' <td class="tablePadding"><div class="controls"><input type="text" id="'+ item.columnName+ '"></input></div></td>');
				html.push('	</tr>');
			} else if (item.inputField || item.required) {
				html.push('	<tr >');
				if (item.required)
					html.push('	<td class="tablePadding"><label class="control-label">'+ item.label+ '<span class="required" >*</span> </label></td>');
				else
					html.push('<td class="tablePadding"><label class="control-label">'+ item.label + '</label></td>');
				if (item.fieldType == 'INPUT_SELECT'|| item.columnType == 'Boolean') {
					html.push(renderDropdown(item,action));
				} else if (item.columnType == 'Date') {
					html.push('<td class="tablePadding" nowrap="nowrap"><div class="input-group"><input type="text" id="'+ item.columnName+ '" class="form-control date-picker" /><span class="input-group-addon"><i class="fa fa-calendar bigger-110"></i></span></div></td>');
				} else if (item.columnType == 'Password') {
					html.push('<td class="tablePadding"><div class="controls"><input type="password" id="'+ item.columnName+ '"/></div></td>');
					html.push('</tr>');
					html.push('	<tr >');
					html.push('	<td class="tablePadding"><label class="control-label">Retype '+ item.label+ '<span class="required" >*</span> </label></td>');
					html.push('<td class="tablePadding"><div class="controls"><input type="password" id="retype'+ item.columnName+ '"/></div></td>');
				} else {
					html.push('<td class="tablePadding"><div class="controls"><input type="text" id="'+ item.columnName+ '"/></div></td>');
				}
				html.push('</tr>');
			}
		});
	html.push('	</table>');
	html.push('	</div>');
	html.push('	<hr />');
	html.push('	<div class="row-fluid wizard-actions"><button type="submit" id="save" class="btn btn-sm btn-primary" >'+ langMap.js_crud_btn_save + '</button>&nbsp;');
	html.push('	<button class="btn btn-sm btn-primary" data-dismiss="modal" aria-hidden="true">'+ langMap.js_crud_btn_close + '</button></div>');

	return html.join('');
}

function fndropDownChange(element,isEvent) {
	var tableName = $('#tableName').val();
	$('#page-error-cntr').empty();	
	var rowData = '';
	var editedColumnName = "";
	var isPrimaryKeyColumn;
	var value = '';
	var row = '';
	var autoKeyGen;
	if( $(element) != undefined &&  $(element) != null){
		value = $(element).val();
		row = $(element).attr('rowIndex');
		editedColumnName = $(element).attr('columnName');
		isPrimaryKeyColumn = wlxEval($(element).attr('isPrimaryKeyColumn'));
	}
	if(editedColumnName == 'IS_INPUT_FIELD' && isPrimaryKeyColumn){
		var currentTable = $(element).attr('tableName');
		var url = CHECKAUTOKEYGENURL;
		var data = {
			'table-name' : currentTable
		};
		autoKeyGen = checkKeyConfig(data,url);
		if(autoKeyGen && value == '1'){
			bootbox.confirm(langMap.js_crud_auto_gen_key_msg1, function(result) { 
				if(!result) {
					$(element).val('0');
					return;
				}
				else
					processUpdated(element,isEvent,tableName,rowData,row,editedColumnName,value);
			});
		}else if(autoKeyGen && value == '0'){
			bootbox.alert(langMap.js_crud_make_sure_auto_gen_key_config_msg, function(result) { 
				processUpdated(element,isEvent,tableName,rowData,row,editedColumnName,value);
			});
		}else if(!autoKeyGen && value == '1'){
			bootbox.alert(langMap.js_crud_auto_gen_key_msg2, function(result) { 
				processUpdated(element,isEvent,tableName,rowData,row,editedColumnName,value);
			});
		}else if(!autoKeyGen && value == '0'){
			bootbox.alert(langMap.js_crud_auto_gen_not_config_msg);
			$(element).val('1');
			return;
		}
	}else{
		processUpdated(element,isEvent,tableName,rowData,row,editedColumnName,value);
	}
}
function processUpdated(element,isEvent,tableName,rowData,row,editedColumnName,value){
	var updateUrl = "updateRow.json";
	var isRow = false;
	if(isEvent){
		for(var index=0; index<rowIndexArray.length;index++){
			if(index > 0)
				rowData += ROW_SEPERATION;
			rowData += batchArray[rowIndexArray[index]];
		}
		isRow = true;
	}else{
		rowData = getDataTableBatchRowValues(row,editedColumnName,value);
		if($("#batchCheckBox").is(':checked')){
			var isRowIndex = false;
			if( $(element) != undefined &&  $(element) != null){
				for(var i=0;i<rowIndexArray.length;i++){
					if(rowIndexArray[i] == row){
						isRowIndex = true;
						break;
					}
				}
				if(!isRowIndex)
					rowIndexArray.push(row);
				if(batchArray[row] != undefined && batchArray[row] != null)
					rowData = updateBatchRow(batchArray[row],editedColumnName,value);
					batchArray[row] = rowData;
			}
		}else{
			isEvent = true;
		}
	}	
	if(isEvent){
		if(rowData!=''){
			  rowIndexArray = [];
			  batchArray = [];
			  var urlquery = { "table-name" :tableName, "isRow" :isRow,"editedOldValue" : "", "editedNewValue" : value, "editedColumnName" :editedColumnName, "rowData" : rowData };
			  sendActionRequest(urlquery,updateUrl);
		}
		else{
		showErrorMsg(langMap.js_curd_batch_update_err_msg,langMap.message_id);
		}
	}
}

function getDataTableBatchRowValues(row,columnName,val) {
	var oTable = $('#crud-table-cntr').dataTable();
	var oSettings = oTable.fnSettings();
	var dataTable = [];
	var columnIndex = 0;
	$.each(columnDef, function(index, item) {
		   if(columnName == item.columnName){
			   	dataTable.push([item.columnName,val]);
			   	if(item.primaryKey && item.inputField && val != item.columnName,oSettings.aoData[row]._aData[columnIndex])
			   		dataTable.push(["OLD_VAL_"+item.columnName,oSettings.aoData[row]._aData[columnIndex] ]);
		   }else {
				if(item.joinSql != null && item.joinSql != '' && item.joinColumn != null && item.joinColumn != '' && item.joinColumnLabel != null && item.joinColumnLabel != ''){
					dataTable.push([ item.joinColumnAlias,oSettings.aoData[row]._aData[columnIndex] ]);
					columnIndex++;
				}
				dataTable.push([item.columnName,oSettings.aoData[row]._aData[columnIndex] ]);
			}
			columnIndex++;
	});
	return getSerializedQuery(dataTable);
}

function updateBatchRow(rowData,columnName,val){
	var rowarray = rowData.split(COLUMN_SEPERATION);
	var tempRowData = '';
	for (var i = 0; i < rowarray.length; i++) {
		var colData = rowarray[i];
		if(colData.indexOf(columnName) == -1){
			if(i > 0)
				tempRowData += COLUMN_SEPERATION;
			tempRowData += colData;
		}else{
			tempRowData += COLUMN_SEPERATION+columnName+KEY_VALUE_SEPERATION+val;
		}
	}
	return tempRowData;
}

function renderDropdown(item,action){
	var html = [];
	if (item.helpValues != undefined && item.helpValues != "") {
		var helpValues = jQuery.parseJSON(item.helpValues);
		var dropDown = [];
		dropDown.push('<select id="'+ item.columnName + '" '+(item.readOnly && action == 'EDIT'?'disabled':'')+' >');
		dropDown.push('<option value="">Select.....</option>');
		$.each(helpValues,function(index, help) {
					dropDown.push('<option value="'+ help.itemId + '">'+ help.itemValue+ '</option>');
		});
		dropDown.push('</select>');
		html.push('<td class="tablePadding">' + dropDown.join('')+ '</td>');
	} else {
		html.push('<td class="tablePadding"><div class="controls"><input type="text" id="'+ item.columnName+ '"  '+(item.readOnly && action == 'EDIT'?'disabled':'')+'></input></div></td>');
	}
	return html.join('');
}
function validateEdit(rowData) {
	var rowdataArray = getRowDataArray(rowData);
	var isValid = true;
	var isChange = false;
	// Nochange check
	$.each(columnDef, function(index, item) {
		if (!item.readOnly && item.inputField) {
			var fieldOldValue = rowdataArray[item.columnName];
			var fieldNewValue = $('#' + item.columnName).val();
			if (fieldOldValue != fieldNewValue) {
				isChange = true;
			}
		}
		if (isChange)
			return false;
	});
	if (!isChange) {
		var html = [];
		html.push('<div class="alert alert-danger">');
		html
				.push('	<button type="button" class="close" data-dismiss="alert"><i class="ace-icon fa fa-times"></i></button>');
		html.push('	<strong>'+langMap.js_comp_eror_msg+'</strong>');
		html.push(" "+langMap.js_crud_update_not_req_msg+'<br />');
		html.push('</div>');
		$('.errorMsg').html(html.join(''));
		$("body,html").scrollTop(0);
		return false;
	}
	// required validation
	isValid = requiredValidation();
	if (!isValid) {
		return isValid;
	}
	// input type validation
	$.each(columnDef,
			function(index, item) {
				if (!item.readOnly && item.visible) {
					var fieldOldValue = rowdataArray[item.columnName];
					var fieldNewValue = $('#' + item.columnName).val();
					isValid = validation(true, item.label, fieldOldValue,
							fieldNewValue)
					if (!isValid)
						return false;
				}
			});
	return isValid;
}

function validation(isField, fieldName) {
	var errorMsg = '';
	var isValid = true;
	var fieldValue = '';
	if (isField) {
		if (columnDef != undefined) {
			$
					.each(
							columnDef,
							function(index, item) {
								if (item.label == fieldName) {
									fieldValue = $('#' + item.columnName).val();
									if (item.columnType == 'Numeric') {
										if (isNaN(fieldValue)) {
											isValid = false;
											errorMsg = fieldName
													+ langMap.js_crud_should_numeric_msg;
										}
									} else if (item.columnType == 'Date') {
										var isValidDate = true;
										try {
											// $.datepicker.parseDate('dd-M-yy',
											// fieldValue);
											$('#' + item.columnName)
													.datepicker('getDate');
										} catch (err) {
											isValidDate = false;
										}
										if (!isValidDate) {
											isValid = false;
											errorMsg = langMap.js_crud_date_format_msg1;
										}
									}
									return;
								}
							});

		}
	} else {
		isValid = requiredValidation();
		if (!isValid) {
			return isValid;
		}
		var fixes = '<ul>';
		if (columnDef != undefined) {
			$
					.each(
							columnDef,
							function(index, item) {
								if (!item.readOnly && item.visible) {
									fieldValue = $('#' + item.columnName).val();
									fieldName = item.label;
									if (item.columnType == 'Numeric') {
										if (isNaN(fieldValue)) {
											isValid = false;
											fixes += '<li>'
													+ fieldName
													+ langMap.js_crud_should_numeric_msg+'</li>';
										}
									} else if (item.columnType == 'Date') {
										var isValidDate = true;
										try {
											// $.datepicker.parseDate('dd-M-y',
											// fieldValue);
											$('#' + item.columnName)
													.datepicker('getDate');
										} catch (err) {
											isValidDate = false;
										}
										if (!isValidDate) {
											isValid = false;
											fixes += '<li>'
													+ fieldName
													+ langMap.js_crud_date_format_msg2+'</li>';
										}
									}
									return;
								}
							});
			if (!isValid) {
				fixes += '</ul>'
				errorMsg = langMap.js_crud_fix_below_issues_msg+'<br> '
						+ fixes;
			}
		}
	}

	if (!isValid) {
		var html = [];
		html.push('<div class="alert alert-danger">');
		html
				.push('	<button type="button" class="close" data-dismiss="alert"><i class="iace-icon fa fa-times"></i></button>');
		html.push('	<strong>'+langMap.js_comp_eror_msg+'</strong>');
		html.push(' ' + errorMsg + '<br />');
		html.push('</div>');
		$('.errorMsg').html(html.join(''));
		$("body,html").scrollTop(0);
		return isValid;
	}
	return isValid;

}

function requiredValidation() {
	var fields = [];
	var fieldLabels = [];
	var isPasswordMatched = true;
	$.each(columnDef, function(index, item) {
		//item.inputField &&  !item.readOnly && item.required
		if (item.inputField && item.required) {
			if ($('#' + item.columnName).attr('type') && $('#' + item.columnName).val() == '') {
				fields.push(item.columnName);
				fieldLabels.push(item.label+' '+langMap.js_crud_required_text);
			}
			if(item.columnType=='Password')
			{
				if ($('#retype' + item.columnName).val() == '') {
					fields.push('retype' +item.columnName);
					fieldLabels.push('Retype '+item.label+' '+langMap.js_crud_required_text);
				}
				if ($(item.columnName).val() == '') {
					fields.push(item.columnName);
					fieldLabels.push(item.label+' '+langMap.js_crud_required_text);
				}
				if($('#retype' + item.columnName).val() != $('#' + item.columnName).val())
				{
					isPasswordMatched = false;
					fields.push('retype' + item.columnName);
					fields.push(item.columnName);
					fieldLabels.push(langMap.js_crud_password_retype_password_match_warning_text);
				}
				
			}
		}
	});
	if (fields.length>0) {
		// $('.errorMsg').empty();
		// $(".errorMsg").html("<div class='error'>Please provide values in
		// required fields</div>");
		/*var html = [];
		html.push('<div class="alert alert-danger">');
		html.push('	<button type="button" class="close" data-dismiss="alert"><i class="ace-icon fa fa-times"></i></button>');
		html.push(langMap.js_crud_req_field_msg+'<br />');
		if(!isPasswordMatched)
			html.push('Password and Retype Passwords are not matching<br />');
		html.push('</div>');*/
		showError(fieldLabels.join('<br/>'));
		$('.has-error').removeClass('has-error');
		$.each(fields, function(index, item) {
			//$('#'+item).closest('tr');
			processError(item);
		});
		
		
		//$('.errorMsg').html(html.join(''));
		$("body,html").scrollTop(0);
		return false;
	}
	return true;
}

function processError(id) {
	$('#' + id).closest('tr').addClass('form-group has-error');
}

function getShortMonth(index) {
	var month = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
			'Sep', 'Oct', 'Nov', 'Dec' ];
	return month[index];
}

function formatDate(dateText) {
	if (dateText == null || dateText == '') {
		return '';
	} else {
		var dateString = dateText.split("-").join("/");
		var dateObj = new Date(dateString);
		var date = dateObj.getDate() + "";
		var year = dateObj.getFullYear() + "";
		// var month = getShortMonth(dateObj.getMonth());
		var month = (dateObj.getMonth() + 1) + "";
		date = date.length > 1 ? date : '0' + date;
		month = month.length > 1 ? month : '0' + month;
		// var shortYear = year.substr(2,3);
		var currentFormat = month + "/" + date + "/" + year;
		return currentFormat;
	}
}

function buildDropdown(item, selectedColumnPos, isPrimaryKeyColumn, tableNameIndPos, oData) {
	var helpValues = jQuery.parseJSON(item.helpValues);
	var columnName = item.columnName;
	var tableName = oData.aData[tableNameIndPos];
	var dropDown = [];
	dropDown.push('<select id="' + columnName + '_Select"  columnName ="'+ columnName 
			+ '" isPrimaryKeyColumn='+isPrimaryKeyColumn+' tableName = "'+tableName+'"rowIndex="' + oData.iDataRow
			+ '" onChange="fndropDownChange(this,false)" style="width:80px">');
	dropDown.push('<option value="">Select.....</option>');
	$.each(helpValues, function(index, help) {
		if (help.itemId == oData.aData[selectedColumnPos])
			dropDown.push('<option value="' + help.itemId + '"selected="true">'
					+ help.itemValue + '</option>');
		else
			dropDown.push('<option value="' + help.itemId + '">'
					+ help.itemValue + '</option>');
	});
	dropDown.push('</select>');
	return dropDown.join('');
}

function showEdit(element) {
	$('#page-error-cntr').empty();
	var row = $(element).attr('rowIndex');
	var rowData = getDataTableRowValues(row);
	var rowdataArray = getRowDataArray(rowData);
	buildAction('EDIT', rowData);
	populateRowData('EDIT',columnDef, rowdataArray);
}

function showClone(element) {
	$('#page-error-cntr').empty();
	var row = $(element).attr('rowIndex');
	var rowData = getDataTableRowValues(row);
	var rowdataArray = getRowDataArray(rowData);
	buildAction('CLONE', rowData);
	populateRowData('CLONE',columnDef, rowdataArray);
}


function getRowDataArray(rowData) {
	var rowdataArray = [];
	var rowarray = rowData.split(COLUMN_SEPERATION);
	for (i = 0; i < rowarray.length; i++) {
		var colData = rowarray[i];
		var colArray = colData.split(KEY_VALUE_SEPERATION);
		rowdataArray[colArray[0]] = colArray[1];
	}
	return rowdataArray;
}

function populateRowData(action,columnDef, rowdataArray) {
	var noOfChar = 25;
	var textbox;
	var textArea;
	$.each(columnDef, function(index, item) {
		if (item.inputField && rowdataArray != undefined && rowdataArray[item.columnName].length > noOfChar
				&& item.columnType != 'Password') {
			textbox = $('#' + item.columnName);
			textArea = $("<textarea rows='4' cols='50' id='" + item.columnName
					+ "'></textarea>");
			textbox = textbox.replaceWith(textArea);
		}
		var value  = '';
		if(item.defaultValue != null && item.defaultValue != undefined)
			value  = item.defaultValue;
		if(rowdataArray != undefined && rowdataArray[item.columnName] != null && rowdataArray[item.columnName] != undefined && rowdataArray[item.columnName] != '')
			value  = rowdataArray[item.columnName];
		if ((!item.inputField || item.readOnly) && item.visible) {
			/*if(action == 'EDIT' || (action == 'CLONE' && !item.primaryKey))
			$('#' + item.columnName).val(rowdataArray[item.columnName]);
			if(action != 'CLONE')
			$('#' + item.columnName).attr("disabled", "disabled");*/
			if(action == 'EDIT'){
				if(item.readOnly && item.fieldType != 'INPUT_SELECT' && item.columnType != 'Boolean'){
					if(item.columnType == 'Date')
						$('#' + item.columnName).html(getDateFormatForDisplay(new Date(value)));
					else if(item.columnType == 'Timestamp')
						$('#' + item.columnName).html(getDateTimeWithSecFormatForDisplay(value?new Date(value):""));
					else
						$('#' + item.columnName).html(value);
				}else{
					$('#' + item.columnName).val(value);
				}
			}
		} else if (item.inputField) {
			if(action == 'ADD' || action == 'EDIT' || (action == 'CLONE' && !item.primaryKey)){
				if(item.columnType == 'Date'){
					if(value != '')
						$('#'+item.columnName).datepicker("setDate", getDateFormatForDisplay(new Date(value)));
				}else
					if(item.columnType != 'Password')
						$('#' + item.columnName).val(value);
					else{
						$('#' + item.columnName).val(value);
						$('#retype' + item.columnName).val(value);
					}
			}
		}
	});

}

function reloadCrud(response){
	response = wlxEval(response);
	if(response.success!=null){
		var oTable = $('#crud-table-cntr').dataTable();
 		oTable.fnStandingRedraw();
        var html = [];
    	html.push('<div class="alert alert-success">');
    	html.push('	<button type="button" class="close" data-dismiss="alert"><i class="ace-icon fa fa-times"></i></button>');
    	html.push('	<strong>'+lang.js_crud_saved_text+'</strong>');
    	html.push(' '+response.success+'.<br />');
    	html.push('</div>');
    	$('#page-error-cntr').html(html.join(''));
    	$("body,html").scrollTop(0);
	}
	$('#batchUpdate').attr('disabled', 'disabled');
	$('#batchCheckBox').attr('checked', false);
}

function getAvailableTables(data, url) {
	$.ajax({
		dataType : "json",
		data : data,
		url : url,
		type : "GET",
		cache : false,
		success : function(response, textStatus, XMLHttpRequest) {
			getTablesSuccess(response, data.action);
		},
		error : function(request, status, error) {
			showErrorMsg(langMap.error_sys_admin, langMap.message_id);
		}
	});
}

function getTablesSuccess(response, action) {
	if (ECM_DEBUG)
		$.log("START getTablesSuccess");
	response = wlxEval(response);
	showAvailableTables(response, action);
	if (ECM_DEBUG)
		$.log("END getTablesSuccess");
}
function showAvailableTables(response, action) {
	var htmlArray = [];
	var tablesAvailable = response || "";
	htmlArray.push('<a href="#" class="close">&times;</a>');
	if (action == 'ADD')
		htmlArray.push('				<h3 class="blue">'+langMap.js_crud_add_table_metadat+'</h3><hr />');
	if (action == 'DELETE')
		htmlArray.push('				<h3 class="blue">'+langMap.js_crud_delete_table_metadat+'</h3><hr />');
	htmlArray.push('		<div class="errorMsg" id="errorMsg"></div>');
	htmlArray
			.push("	<table align='center' id='table-list' class='table table-striped table-bordered table-hover'><thead>");
	htmlArray.push("	<tr>");
	htmlArray.push("		<th>"+langMap.js_crud_table+"</th>");
	htmlArray.push("		<th>"+langMap.js_crud_select+"</th>");
	htmlArray.push("	</tr></thead>");
	htmlArray.push("<tbody>");
	if (tablesAvailable != "") {
		$
				.each(
						tablesAvailable,
						function(index, item) {
							htmlArray.push("	<tr>");
							htmlArray.push("		<td>");
							htmlArray.push("			" + item.TABLE_NAME);
							htmlArray.push("		</td>");
							htmlArray.push("		<td>");
							htmlArray
									.push("			<label><input class='ace' type='checkbox' name='config' value='"
											+ item.TABLE_NAME
											+ "'><span class='lbl'></span></label>");
							htmlArray.push("		</td>");
							htmlArray.push("	</tr>");

						});
	} else {
		htmlArray.push("	<tr>");
		htmlArray.push("		<td colspan='2'>");
		htmlArray.push("			<h1>"+langMap.js_curd_table_data+"</h1>");
		htmlArray.push("		</td>");
		htmlArray.push("	</tr>");
	}
	htmlArray.push("</tbody></table>");
	htmlArray.push('	<hr />');
	if (action == 'ADD')
		htmlArray
				.push('<div class="row wizard-actions"><input type="button" id="submitTableToMetaTable" value="Save" class="btn btn-sm btn-primary">&nbsp;');
	if (action == 'DELETE')
		htmlArray
				.push('<div class="row wizard-actions"><input type="button" id="deleteTableMetaTable" value="Delete" class="btn btn-sm btn-primary">&nbsp;');
	htmlArray
			.push('	<button class="btn btn-sm btn-primary" data-dismiss="modal" aria-hidden="true">'
					+ langMap.js_crud_btn_close + '</button></div>');
	$('#popup').html(htmlArray.join(''));
	bootbox.dialog({message:$('#popup').html()});
	$('#popup').empty();
	var table = $('#table-list');
	if (isDataTable(table[0])) {
		table.dataTable().fnClearTable(false);
		table.dataTable().fnDestroy();
	}
	table.dataTable({
		"iDisplayLength": 20,
		"aLengthMenu": [[10, 20, 25, 50, -1], [10, 20, 25, 50, 100]],
		"aoColumns" : [ null, {
			"bSortable" : false
		} ],
		"oLanguage": dataTableLang,
		"fnDrawCallback" : function(oSettings) {
		}
	});
	bindButtonEvents();
}

function bindButtonEvents() {
	$('.errorMsg').empty();
	$('#submitTableToMetaTable')
			.bind(
					"click",
					function() {
						var selectedTables = '';
						var i = 0;
						if ($('input[name="config"]:checked').length > 0) {
							$('input[name="config"]:checked').each(function() {
								if (i > 0)
									selectedTables += ROW_SEPERATION;
								selectedTables += this.value;
								i++;
							});
							var configUrl = ADDMETADATAURL;
							var data = {
								"selectedTables" : selectedTables
							};
							configMetadata(data, configUrl);

						} else {
							// alert('please select A table');
							var html = [];
							html.push('<div class="alert alert-danger">');
							html
									.push('	<button type="button" class="close" data-dismiss="alert"><i class="ace-icon fa fa-times"></i></button>');
							html.push('<strong>' + langMap.js_crud_error
									+ '</strong>');
							html.push(langMap.js_crud_select_atleast_a_table_msg);
							html.push('</div>');
							$('.errorMsg').html(html.join(''));
							$("body,html").scrollTop(0);
							return false;
						}
					});
	$('#deleteTableMetaTable')
			.bind(
					"click",
					function() {
						var selectedTables = '';
						var i = 0;
						if ($('input[name="config"]:checked').length > 0) {
							$('input[name="config"]:checked').each(function() {
								if (i > 0)
									selectedTables += ROW_SEPERATION;
								selectedTables += this.value;
								i++;
							});
							var configUrl = DELETEMETADATARURL;
							var data = {
								"selectedTables" : selectedTables
							};
							deleteMetadata(data, configUrl);

						} else {
							// alert('please select A table');
							var html = [];
							html.push('<div class="alert alert-danger">');
							html
									.push('	<button type="button" class="close" data-dismiss="alert"><i class="ace-icon fa fa-times"></i></button>');
							html.push('<strong>' + langMap.js_crud_error
									+ '</strong>');
							html.push(langMap.js_crud_select_atleast_a_table_msg);
							html.push('</div>');
							$('.errorMsg').html(html.join(''));
							$("body,html").scrollTop(0);
							return false;
						}
					});
}
function isDataTable(nTable) {
	var settings = $.fn.dataTableSettings;
	for ( var i = 0, iLen = settings.length; i < iLen; i++) {
		if (settings[i].nTable == nTable) {
			return true;
		}
	}
	return false;
}

jQuery.fn.dataTableExt.oApi.fnSetFilteringDelay = function(oSettings, iDelay) {
	var _that = this;
	if (iDelay === undefined) {
		iDelay = 500;
	}
	this.each(function(i) {
		$.fn.dataTableExt.iApiIndex = i;
		var $this = this;
		var oTimerId = null;
		var sPreviousSearch = null;
		anControl = $('input', _that.fnSettings().aanFeatures.f);
		anControl.unbind('keyup').bind(
				'keyup',
				function() {
					var $$this = $this;
					if (sPreviousSearch === null
							|| sPreviousSearch != anControl.val()) {
						window.clearTimeout(oTimerId);
						sPreviousSearch = anControl.val();
						oTimerId = window.setTimeout(function() {
							$.fn.dataTableExt.iApiIndex = i;
							_that.fnFilter(anControl.val());
						}, iDelay);
					}
				});

		return this;
	});
	return this;
}

$
		.extend(
				$.fn.dataTableExt.oPagination,
				{
					"userDefined" : {
						"fnInit" : function(oSettings, nPaging, fnDraw) {
							var oLang = oSettings.oLanguage.oPaginate;
							var fnClickHandler = function(e) {
								e.preventDefault();
								if (oSettings.oApi._fnPageChange(oSettings,
										e.data.action)) {
									fnDraw(oSettings);
								}
							};

							$(nPaging)
									.addClass('pagination')
									.append(
											'<ul>'
													+ '<li class="prev disabled"><a href="#"><i class="icon-double-angle-left"></i></a></li>'
													+ '<li class="next disabled"><a href="#"><i class="icon-double-angle-right"></i></a></li>'
													+

													/*
													 * '<li class="prev disabled"><a
													 * href="#">Previous</i></a></li>'+ '<li class="next disabled"><a
													 * href="#">Next</i></a></li>'+ '<li class="last disabled"><a
													 * href="#">First</i></a></li>'+ '<li class="last disabled"><a
													 * href="#">Last</i></a></li>'+
													 */
													'</ul>');
							/*
							 * var els = $('a', nPaging); var nFirst = els[0],
							 * nPrev = els[1], nNext = els[2], nLast = els[3];
							 */

							var els = $('a', nPaging);
							$(els[0]).bind('click.DT', {
								action : "previous"
							}, fnClickHandler);
							$(els[1]).bind('click.DT', {
								action : "next"
							}, fnClickHandler);

							/*
							 * $(els[2]).bind( 'click.DT', { action: "first" },
							 * fnClickHandler); $(els[3]).bind( 'click.DT', {
							 * action: "last" }, fnClickHandler);
							 */

							/*
							 * oSettings.oApi._fnBindAction( nFirst, {action:
							 * "first"}, fnClickHandler );
							 * oSettings.oApi._fnBindAction( nPrev, {action:
							 * "previous"}, fnClickHandler );
							 * oSettings.oApi._fnBindAction( nNext, {action:
							 * "next"}, fnClickHandler );
							 * oSettings.oApi._fnBindAction( nLast, {action:
							 * "last"}, fnClickHandler );
							 */
						},

						"fnUpdate" : function(oSettings, fnDraw) {
							var iListLength = 5;
							var oPaging = oSettings.oInstance.fnPagingInfo();
							var an = oSettings.aanFeatures.p;
							var i, j, sClass, iStart, iEnd, iHalf = Math
									.floor(iListLength / 2);

							if (oPaging.iTotalPages < iListLength) {
								iStart = 1;
								iEnd = oPaging.iTotalPages;
							} else if (oPaging.iPage <= iHalf) {
								iStart = 1;
								iEnd = iListLength;
							} else if (oPaging.iPage >= (oPaging.iTotalPages - iHalf)) {
								iStart = oPaging.iTotalPages - iListLength + 1;
								iEnd = oPaging.iTotalPages;
							} else {
								iStart = oPaging.iPage - iHalf + 1;
								iEnd = iStart + iListLength - 1;
							}

							for (i = 0, iLen = an.length; i < iLen; i++) {
								// Remove the middle elements
								$('li:gt(0)', an[i]).filter(':not(:last)')
										.remove();

								// Add the new list items and their event
								// handlers
								for (j = iStart; j <= iEnd; j++) {
									sClass = (j == oPaging.iPage + 1) ? 'class="active"'
											: '';
									$(
											'<li ' + sClass + '><a href="#">'
													+ j + '</a></li>')
											.insertBefore(
													$('li:last', an[i])[0])
											.bind(
													'click',
													function(e) {
														e.preventDefault();
														oSettings._iDisplayStart = (parseInt(
																$('a', this)
																		.text(),
																10) - 1)
																* oPaging.iLength;
														fnDraw(oSettings);
													});
								}

								// Add / remove disabled classes from the static
								// elements
								if (oPaging.iPage === 0) {
									$('li:first', an[i]).addClass('disabled');
								} else {
									$('li:first', an[i])
											.removeClass('disabled');
								}

								if (oPaging.iPage === oPaging.iTotalPages - 1
										|| oPaging.iTotalPages === 0) {
									$('li:last', an[i]).addClass('disabled');
								} else {
									$('li:last', an[i]).removeClass('disabled');
								}
							}
						}
					}
				});
