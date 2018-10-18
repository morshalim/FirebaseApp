var defaultLvl = 2;
var defaultRoot = "REPORTS";
$(function(){
	var categoryId = defaultRoot;
	if(categoryIdForReport && categoryIdForReport != '')
		categoryId = categoryIdForReport;
	buildCategoryList(categoryId, true);	
	buildReportlist(categoryId);
	if((responseMap.runningReports && responseMap.runningReports > 0) && (responseMap.scheduledReports && responseMap.scheduledReports > 0)){
		$('#schedReports').show();
		$('#scenario1 span[ref="scheduledReports"]').html(responseMap.scheduledReports);
		$('#scenario1 span[ref="runningReports"]').html(responseMap.runningReports);
		$('#scenario1').show();
	}else if((responseMap.runningReports && responseMap.runningReports > 0)){
		$('#schedReports').show();
		$('#scenario3 span[ref="runningReports"]').html(responseMap.runningReports);
		$('#scenario3').show();
	}else if((responseMap.scheduledReports && responseMap.scheduledReports > 0)){
		$('#schedReports').show();
		$('#scenario2 span[ref="scheduledReports"]').html(responseMap.scheduledReports);
		$('#scenario2').show();
	}
	
	
	
	
});

function buildCategoryList(relCategoryId,onload){
	var html = [];
		if(categoryList!=null  && categoryList.length>0){
			for(var i = 0 ; i < categoryList.length; i++){
				if (categoryList[i].reportCount > 0) {
					if (categoryList[i].relCategoryId == relCategoryId) {
						html.push('<div class="rep_element" id="' + categoryList[i].categoryName + '" categoryId="' + categoryList[i].categoryId + '" lvl="' + categoryList[i].lvl + '" relCategoryId="' + categoryList[i].relCategoryId + '" onclick="expandFolder(this)">');
						html.push('<table nowrap>');
						html.push('<tr>');
						html.push('<td class="tabpad">');
						html.push('<i class="fa fa-folder blue fa-3x"></i>');
						html.push('</td>');
						html.push('<td class="tabpad">');
						html.push('<strong>' + categoryList[i].categoryName + '</strong><br>');
						html.push('<p>' + categoryList[i].description + '</p>');
						html.push('</td>');
						html.push('</tr>');
						html.push('</table>');
						html.push('</div>');
					}
				}
			}
			$('#categoryFolderCtr').html(html.join(''));	
			if(relCategoryId != defaultRoot)
				buildHeaderCategoryName(relCategoryId);
	}
}
function buildHeaderCategoryName(catergoryId){
	var html = [];
	$('#categoryName').show();
	if(catergoryId==undefined)
		 catergoryId = categoryIdForReport;
	var relCategoryId= "";
	var level = 0;
	if(catergoryId!=undefined && catergoryId!=''){
		if(categoryList!=null && categoryList.length>0){
			for(var i = 0 ; i < categoryList.length; i++){
				if(catergoryId==categoryList[i].categoryId){
					var categoryName=categoryList[i].categoryName;
					relCategoryId = categoryList[i].relCategoryId;
					level = categoryList[i].lvl;
				}
			}
		}	
		html.push('<div class="bigger-120"><a id="oneLvlUpId" href="#" lvl="'+level+'" categoryId="'+relCategoryId+'" onclick="moveOneLevelUp(this)"><i class="fa fa-chevron-up"></i> '+langMap.jsp_reports_up_one_level+'</a></div>');
		html.push('<div class="space-4"></div>');
		html.push('<div class="bigger-140"><i class="fa fa-folder-open blue"></i> '+categoryName+'</div>');
		html.push('<div class="space-4"></div>');	
		$('#categoryName').html(html.join(''));
	}
}
function moveOneLevelUp(ele){
	var lvl = parseInt($(ele).attr('lvl'));
	if(lvl == defaultLvl){
		$('#categoryName').hide();
		$('#replist').hide();
		$("#repmsg").show();
	}
	expandFolder(ele,true);
}
function buildReportlist(catergoryId){
	var html = [];
	var reportList = null;
	var relCategoryId = null;
	var lvl = null;
	if(catergoryId!=undefined && catergoryId!=''){
		if(categoryList!=null && categoryList.length>0){
			for(var i = 0 ; i < categoryList.length; i++){
				if(catergoryId==categoryList[i].categoryId){
					var category = categoryList[i];
					reportList = category.reports;
					relCategoryId = category.relCategoryId;
					lvl = category.lvl;
				}
			}
		}
	}
	if(reportList!=null && reportList.length>0){
		for(var i = 0 ; i < reportList.length; i++){
			html.push('<div class="rep_element" id="type1" reportId="'+reportList[i].id+'" categoryIdforReport="'+catergoryId+'" relCategoryId="'+relCategoryId+'" lvl="'+lvl+'" onclick="getReportDetails(this)">');
			html.push('<table nowrap>');
			html.push('<tr>');
			html.push('<td class="tabpad">');
			html.push('<i class="fa fa-file-o blue fa-3x"></i>');
			html.push('</td>');
			html.push('<td class="tabpad">');
			html.push('<strong>'+reportList[i].name+'</strong><br>');
			html.push('<p>'+reportList[i].description+'</p>');
			html.push('</td>');
			html.push('</tr>');
			html.push('</table>');
			html.push('</div>');
		}		
	}
	if(!catergoryId ||catergoryId == '' || catergoryId == defaultRoot){
		$('#replist').hide();
		$("#repmsg").show();
	}else{
		$('#replist').show();
		$("#repmsg").hide();
	}
	$('#replist').html(html.join(''));	
}

function expandFolder(ele, upOneLvl){
	buildCategoryList($(ele).attr('categoryId'));
	buildReportlist($(ele).attr('categoryId'));
}
function isLvlExist(level,relCategoryId){
	var lvlExist = false;
	if(categoryList!=null  && categoryList.length>0){
		for(var i = 0 ; i < categoryList.length; i++){
			if(categoryList[i].lvl == level && categoryList[i].relCategoryId == relCategoryId)
				lvlExist = true;
		}
	
	}
	return lvlExist;
}
function getReportDetails(report)
{
	var reportId = $(report).attr('reportId') || '';
	var catergoryId = $(report).attr('categoryIdforReport') || '';
	var url = "EV_VIEW_REPORT_PARAMETER.htm?reportId="+reportId+'&'+req_catergoryid+"="+catergoryId;
	window.location.href = url;
}
