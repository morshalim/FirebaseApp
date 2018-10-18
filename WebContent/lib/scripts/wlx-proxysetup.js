var makeProxy = "";
$(function() {
	if(searchTextString!=null && searchTextString !="")
		$("#empSearchValue").val(searchTextString);
	buildProxySetup(proxyList);
	$("#emp-search-btn").on('click', function() {
		var searchText = $('#empSearchValue').val();
		if(searchText==null ||searchText==''){
			return false;
		}else
			{
				employeeSearch(searchText, 'proxySetUp');
			}
	});
	
	$("#empSearchValue").bind('keypress',{}, function(event){	
		
		if(event.which == 13 ){
			if($('#empSearchValue').val()!='')
			{					
				employeeSearch($('#empSearchValue').val(), 'proxySetUp');
			}
			else
			{				
				return false;
			}
			event.preventDefault();
		}
		
	});
	
	$("#empSearchValue").on('keyup',{}, function(event){
		if($('#empSearchValue').val()=='')
			buildProxySetup();
	});
	
	makeProxy = $('#modal-proxy-setup').html();
	$('#modal-proxy-setup').remove();
});

/*function loadMgrProxy(element)
{
	bootbox.confirm(langMap.js_proxy_setup_confirm_msg, function(result) {
		if(result) {				
			var mgrId = $(element).attr('mgrId');
			var mgrFname = $(element).attr('mgrFirstName');
			var mgrLname = $(element).attr('mgrLastName');
			var data = {};
			data[req_mgr_id] = mgrId;
			data[req_emp_first_name] = mgrFname;
			data[req_emp_last_name] = mgrLname;
			loadProxySetupIntoSession(data);
		}
	});

}*/
function buildProxySetup(proxyList)
{
	var tbody = [];
	var disabled="";
	if(proxyList != undefined){
		$.each(proxyList,function(index,item){
			tbody.push('<tr>');
			tbody.push('	<td>'+item.firstName+' '+item.lastName+'</a></td>');
			/*if(!item.mgr)
				disabled="disabled='disabled'";
			tbody.push('	<td><button id="btn_proxy_emp" onclick="loadEmpProxy(this);" class="btn btn-mini btn-primary" empId="'+item.pernr+'" empFirstName="'+item.firstName+'" empLastName="'+item.lastName+'" mgrId="'+item.mgrId+'" positionId="'+item.positionId+'" deptId="'+item.departmentId+'"  '+disabled+'>'+langMap.js_proxy_setup_btn_proxy+'</button></td>');*/
			tbody.push('	<td>'+item.posTitle+'</td>');
			if(item.departmentName==null)
				item.departmentName = '';
			tbody.push('	<td>'+item.departmentName+'</td>');
			tbody.push('	<td>'+item.mgrFirstName+' '+item.mgrLastName+'</td>');
			tbody.push('	<td><button id="btn_proxy_emp" onclick="loadProxyOnClick(this);" class="btn btn-xs btn-primary" empId="'+item.pernr+'" empFirstName="'+item.firstName+'" empLastName="'+item.lastName+'" mgrFirstName="'+item.mgrFirstName+'" mgrLastName="'+item.mgrLastName+'" mgrId="'+item.mgrId+'" positionId="'+item.positionId+'" deptId="'+item.departmentId+'">'+langMap.js_proxy_setup_btn_proxy+'</button>&nbsp;');
			if(isDelegateManagementPage)
				tbody.push('	    <button id="btn_auth_emp" onclick="navigateToDelegate(this);" class="btn btn-xs btn-primary" empId="'+item.pernr+'" empFirstName="'+item.firstName+'" empLastName="'+item.lastName+'" mgrFirstName="'+item.mgrFirstName+'" mgrLastName="'+item.mgrLastName+'" mgrId="'+item.mgrId+'" positionId="'+item.positionId+'" deptId="'+item.departmentId+'">'+langMap.proxy_setup_btn_auth+'</button>');
			tbody.push('	</td>');
			tbody.push('</tr>');
		});	
	}
	//$('#table_report tbody').html(tbody.join(''));
	var table = $('#table_report');	
	if(isDataTable(table[0]))
	{	
		table.dataTable().fnClearTable(false);
		table.dataTable().fnDestroy();
	}	
	$('#table_report tbody').html(tbody.join(''));
	//table = $('#table_report');	
	table.dataTable({
		"iDisplayLength": 20,
		"aLengthMenu": [[10, 20, 25, 50, -1], [10, 20, 25, 50, 100]],
		"aoColumns": [null, null, null, null, {"bSortable": false}],
		"autoWidth": false,
		"columns": [{ "width": "15%" },{ "width": "30%" },{ "width": "15%" },{ "width": "15%" },{ "width": "25%" }],
		"oLanguage": dataTableLang
	});	
		
	/*$('#btn_proxy_emp').on('click', function(){
		loadEmpProxy(this,makeProxy);
	});*/
	/*if(isDelegateManagementPage){
		$('#btn_auth_emp').on('click', function(){
			var url= viewProxyDelegateURL+"?"+req_emp_id+"="+$(this).attr('empId') + "&" +req_param+"="+ encodeURIComponent(breadCrumbsString) + "&" + req_emp_name + "=" + encodeURIComponent($(this).attr('empFirstName') + $(this).attr('empLastName')) + "&" + req_emp_search_text + "="+$('#empSearchValue').val();
		    navigateTo(url,'');
		});
	}*/
}

function loadProxyOnClick(ele){
	loadEmpProxy(ele,makeProxy);
}

function navigateToDelegate(element){
	var url= viewProxyDelegateURL+"?"+req_emp_id+"="+$(element).attr('empId') + "&" +req_param+"="+ encodeURIComponent(breadCrumbsString) + "&" + req_emp_name + "=" + encodeURIComponent($(element).attr('empFirstName') +" "+$(element).attr('empLastName')) + "&" + req_emp_search_text + "="+$('#empSearchValue').val();
    navigateTo(url,'');
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
