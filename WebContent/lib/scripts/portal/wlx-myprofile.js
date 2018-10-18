var ProfilePageController = function (config) {
	this.primaryPropertyId = 0;
	this.primaryPropertyRole = 0;
	this.latestReasonsList = null;
	this.latestReasonsListObj = {};
	this.config = {
		debug: false,
		dateFormat: "mm/dd/yyyy",
		dateFormatDB: "yyyyMMdd",
		empUserName: "",
		profileModulesList: [ { code:'LEADS', label: 'MI Leads' } ],
		urls: {
			getModules: '/rest/reference/get/modules',
			getUserPropertyHistory: '/rest/property/user/history',
			getPrimaryPropRole: '/rest/property/user/role/primary/prop',
			getReasonList: "/service/enrollment/admin/filter/reasoncode",
			getUserProperties: '/service/users/userpropertieslist/',
			propertySearchHost: '',
			propertySearch: '/properties/search/v2?viewName=basic&page=0&size={size}&access_token={accessToken}'
		},
		lang: {
			primaryProperty: 'Primary Property',
			options: 'Options',
			removeProperty: 'Remove Property',
			setAsPrimaryProperty: 'Set as Primary Property'
		}
	};
	
	this.init = function() {
		
		$.extend(true, this.config, config);
		
		$("#changePassword").on('click', { self: this }, function(e) {

			var empId = $("<input>").attr("type", "text").attr("name", "crt_req_emp_id").val(e.data.self.config.empUserName);
			var form = $(document.createElement('form'));
			
			$(form).attr("action", "showChangePassword.htm");
			$(form).attr("method", "POST");
			$(form).css("display", "none");
			
			$(form).append($(empId));
			form.appendTo(document.body);
			
			$(form).submit();
		});
		
		$(document).on('shown.bs.tab', '#user-profile a[data-toggle="tab"]', { self: this }, function (e) {
			
			if($(e.target).attr("href") == '#tab-' + PLATCTRL.moduleMetadata.metaData.LEADS.moduleCode)
				e.data.self.getLeadsTab();
		});
		
		return this;
	};
	
	this.render = function() {

		var self = this;
		
		$('.page-header h1').html(this.config.empName + ' ' + $('.page-header h1').html());
		
		this.populateProfileTabs();
		this.populateProfileInfo();
		this.getReasons();
		
		return this;
	};
	
	this.populateProfileInfo = function() {
		
		if(groupdeskList.length > 0) {
			
			var groupDeskArray = [];
			
			for(var i=0; i<groupdeskList.length; i++) {
				
				groupDeskArray.push(groupdeskList[i].name);		
			}
			
			$('#groupDesk').html(groupDeskArray.join("/"));
		}
		
		if(userRolesList.length > 0) {
			
			var userRolesArray = [];
			
			for(var i=0; i<userRolesList.length; i++) {
				
				userRolesArray.push(userRolesList[i].name);		
			}
			
			$('#userRole').html(userRolesArray.join("</br>"));
		}
	};
	
	this.populateProfileTabs = function() {

		MODULE_UTILS.makeAjaxCall(this.config.urls.getModules, null, this, 'GET', function(data) {
			
			this.renderProfileTabs(data);
			
		}, function(data) {}, false, false, false, 'UMA');
	};
	
	this.renderProfileTabs = function(data) {
		
		var map = this.buildProfileTabs(data);
		
		$('#user-profile .nav-tabs').append(map.tabs);
		$('#user-profile .tab-content').append(map.contents);
	};
	
	this.buildProfileTabs = function(data) {
		
		var map = { tabs: '', contents: '' };
		
		if(data) {

			var tabs = [];
			var contents = [];
			
			for(var i=0; i<data.length; i++) {
				
				var module = data[i];
				var profileModule = $.grep(this.config.profileModulesList, function(e){ return e.code == module.code; });
				
				if(profileModule.length) {
					
					tabs.push('<li>');
					tabs.push('	<a data-toggle="tab" href="#tab-' + module.code + '">' + ((profileModule[0].label) ? profileModule[0].label : module.name) + '</a>');
					tabs.push('</li>');
	
					contents.push('<div id="tab-' + module.code + '" class="tab-pane"></div>');
				}
			}
			
			map.tabs = tabs.join('');
			map.contents = contents.join('');
		}
		
		return map;
	};
	
	this.getLeadsTab = function() {
		
		if($('#tab-' + PLATCTRL.moduleMetadata.metaData.LEADS.moduleCode).html() == ''){
			this.getUserProperties(this.config.empUserName);			
		}
			
	};
	
	this.getUserProperties = function(userName) {
		
		MODULE_UTILS.makeAjaxCall(this.config.urls.getUserProperties + userName, null, this, 'GET', function(data) {
			
			var self = this;
			var latestUserProperties = data;
			var latestUserPropertiesMap = {};
			var userProperties = [];
			
			for(var i=0; i<data.length; i++) {
				
				latestUserPropertiesMap[data[i].propId] = data[i];
				userProperties.push({id: data[i].propId});
			}
			
			PLATCTRL.forceGetLatestToken(function() {
				
				var p1 = self.getMorePropertyInfoUserProperties(userProperties);

		    	$.when(p1).done(function (d1) {
					
					var latestMorePropertyInfoUserPropertiesMap = {};
					
					if(d1 && d1.content && d1.content.length) {
						
						var latestMorePropertyInfoUserProperties = d1.content;
						
						for(var i=0; i<latestMorePropertyInfoUserProperties.length; i++) {
						
							latestMorePropertyInfoUserPropertiesMap[latestMorePropertyInfoUserProperties[i].id] = latestMorePropertyInfoUserProperties[i];
						}
					}
					
					for(var i=0; i<latestUserProperties.length; i++) {
						
						if(latestMorePropertyInfoUserPropertiesMap[latestUserProperties[i].propId]) {
							
							latestUserProperties[i].marshaCode = latestMorePropertyInfoUserPropertiesMap[latestUserProperties[i].propId].marshaCode;
							latestUserProperties[i].unitNo = latestMorePropertyInfoUserPropertiesMap[latestUserProperties[i].propId].unitNo;
						}	
					}	
					
					self.renderUserProperties(latestUserProperties);
					
					if(self.getPrimaryProdId(latestUserProperties)>0){
						var q = self.getUserPrimaryPropRole(self.getPrimaryProdId(latestUserProperties),self.config.empUserName);
						$.when(q).then(function () {
							self.getUserPropertyHistory(self.config.empUserName);
						});
					}else{
						self.getUserPropertyHistory(self.config.empUserName);
					}
					
				});
			}, PLATCTRL.moduleMetadata.metaData.LEADS.moduleCode);
		}, null, false, false, false, PLATCTRL.moduleMetadata.metaData.LEADS.moduleCode);
	};
	
    this.getPrimaryProdId = function(data){
    	var self = this;
    	if(data!=null && data.length>0){
			for(var i=0; i<data.length; i++) {
				var property = data[i];
				if(property.primaryProp){
					self.primaryPropertyId = property.propId;
					return primaryPropId = property.propId;
				}
			}
		}
    	return 0;
    }
    
    this.getUserPrimaryPropRole = function(data,userName){
    	return MODULE_UTILS.makeAjaxCall(this.config.urls.getPrimaryPropRole + "/"+userName+"/"+data, null, this, 'GET', function(data) {
    		console.log(data);
    		this.primaryPropertyRole = data;
    	}, null, false, false, false, PLATCTRL.moduleMetadata.metaData.LEADS.moduleCode);
    }
    
	this.getReasons = function(){
		return MODULE_UTILS.makeAjaxCall(this.config.urls.getReasonList, null, this, 'GET', function(data) {
			this.latestReasonsList = data;
			for(var i = 0; i < this.latestReasonsList.length; i++)
			{
				this.latestReasonsListObj[this.latestReasonsList[i].statusId] = this.latestReasonsList[i];
			}
		}, null, false, false, false, PLATCTRL.moduleMetadata.metaData.TEAMHOT.moduleCode);
	}
	
	this.getMorePropertyInfoUserProperties = function(propertyList) {
		
		var propertyListLength = 1;
		var selectedProperties = [];
		var value = '';
		
		if(propertyList && propertyList.length && propertyList.length !== 1) {
			
			for(var i = 0; i < propertyList.length; i++) {
			
				selectedProperties.push(propertyList[i].id);
			}
			
			value = selectedProperties.join(",");
			propertyListLength = propertyList.length;
		}	
		else if(propertyList && propertyList.length)
			value = propertyList[0].id;

		var url = this.config.urls.propertySearchHost + this.config.urls.propertySearch.replace('{size}', propertyListLength).replace('{accessToken}', PLATCTRL.moduleMetadata.tokens.LEADS);
		var data = { "andParams": [ { "key": "_id", "value": value, "operator": "IN" } ], "orParams": [] };
		
		return MODULE_UTILS.makeAjaxCall(url, data, this, 'POST', function() {}, function() {}, false, false, true, PLATCTRL.moduleMetadata.metaData.LEADS.moduleCode);
	};
	
	this.getUserPropertyHistory = function(userName) {
		MODULE_UTILS.makeAjaxCall(this.config.urls.getUserPropertyHistory + "/"+userName, null, this, 'GET', function(data) {
			//console.log(data)
			
			var historyMap = {};
			
			for(var i = 0; i < data.length; i++)
			{
				var d = data[i];
				if(!historyMap[d.propId])
					historyMap[d.propId] = [];
				historyMap[d.propId].push(d);
			}	
			
			var propArray = [];
			
			for(var key in historyMap)
			{
				//sort by historyEventDate
				historyMap[key] = historyMap[key].sort(function(a,b) {return (a.historyEventDate < b.historyEventDate) ? 1 : ((b.historyEventDate < a.historyEventDate) ? -1 : 0);} );
				propArray.push(key);
			}	

			//console.log(historyMap)
			
			var primaryPropRole = '';
			for(var j=0; j<userRolesList.length; j++){
				var d = userRolesList[j];
				if(d.id==this.primaryPropertyRole)
					primaryPropRole = d.name;
			}
			
			var str = [];
			
			for(var key in historyMap)
			{
				var prop = historyMap[key];
				
				var propName = '';
				if(prop && prop.length)
					propName = prop[0].propName;
				
				str.push('<div class="timeline-container timeline-style2">');
	    		str.push('<h5 class="top5">');
	    		//'<span historyPropName propId="'+key+'">'+(prop && prop[0] && prop[0].propName ? prop[0].propName : '')+' / '+ (prop && prop[0] && prop[0].unitNo ? prop[0].unitNo : '')+ '</span>'+' ('+key+')');
	    		
	    		str.push('<span historyPropName propId="'+key+'" class="hidden">'+(prop && prop[0] && prop[0].propName ? prop[0].propName : '')+' / '+ (prop && prop[0] && prop[0].unitNo ? prop[0].unitNo : '') + '('+key+')'+'</span>');
	    		
	    		str.push('</h5>');
	    		str.push('<div class="space-10"></div>');
	    		str.push('<div class="timeline-items">');
	    		str.push('	<div class="timeline-items">');
	    		
				for(var ii = 0; ii < prop.length; ii++)
				{
					var item = prop[ii];
					str.push('		<div class="timeline-item clearfix">');
					
					var date = '';
					if(item.historyEventDate)
						date = MODULE_UTILS.getDateFormatForDisplay(item.historyEventDate)
					
					var time = '';
					if(item.historyEventDate)
						time = MODULE_UTILS.formatDateToAMPM(new Date(item.historyEventDate));
					
		    		str.push('			<div class="timeline-info">	<span class="timeline-date">'+date+'<br>'+time+'<i class="timeline-indicator btn btn-info no-hover"></i></span></div>');
		    		str.push('			<div class="widget-box transparent">');
		    		str.push('				<div class="widget-body">');
		    		
		    		var title = '';
		    		if(item.description)
		    			title = item.description;
		    		
		    		//historyId - 1 - ?
		    		//historyId - 2 - Property Deleted
		    		//historyId - 3 - Status Change
		    		//historyId - 4 - ?
		    		//historyId - 5 - Property Indicator Change
		    		//historyId - 6+ - ?
		    		
		    		var extra = '';
		    		var moreInfo = '';
		    		
		    		if(item.historyId == 1){
		    			extra = 'Active Property';
		    		}else if(item.historyId == 2){
		    			
		    		}else if(item.historyId == 3){
		    			//need reasonId and reasonDate
		    			extra = 'To ' + (item.statusId && this.latestStatusListObj && this.latestStatusListObj[item.statusId] ? this.latestStatusListObj[item.statusId].bizName : (item.statusId ? item.statusId : ''))
		    			if(item.statusId == 3)
		    			{
		    				if(item.reason)
		    					extra += ' - Reason: ' + this.latestReasonsListObj[item.reason].bizName;
		    				if(item.reasonDate)
		    					extra += ' - Reason Date: ' + MODULE_UTILS.getDateFormatForDisplay(item.reasonDate);
		    			}	
		    			
		    		}else if(item.historyId == 4){
		    			
		    		}else if(item.historyId == 5){
		    			//if Y, Set To Home Property
		    			//if N, Unset To Home Property
		    			if(item.propInd == 'Y')
		    				extra = 'Set To Primary Property';
		    			else if(item.propInd == 'N')
		    				extra = 'Unset Primary Property';
		    			
		    			//extra = (item.propInd ? item.propInd : '');
		    		}else if(item.historyId == 6){
		    			
		    		}
		    		
		    		if(extra)
		    			moreInfo = ' - ('+extra+')';
		    		
		    		str.push('					<div class="widget-main no-padding"><strong>'+title+'</strong> '+moreInfo+'</div>');
		    		str.push('				</div>');
		    		str.push('			</div>');
		    		str.push('		</div>');
				}	
				
				str.push('	</div>');
	    		str.push('</div>');
	    		str.push('</div>');
				
			}	
			
			var propHistory = str.join('');
			
			if(!propHistory)
				propHistory = '<small>Currently No History.</small>';
    		
			this.renderUserPropertyHistory(propHistory);
  		
    		//when had no names
    		//**
    		if(propHistory)
    		{
    			var propertyListLength = propArray.length;
    			var data = {"andParams":[{"key":"_id","value":propArray.join(","),"operator":"IN"}],"orParams":[]};
    			var url = this.config.urls.propertySearchHost + this.config.urls.propertySearch.replace('{size}', propertyListLength).replace('{accessToken}', PLATCTRL.moduleMetadata.tokens.LEADS);
    			    			
    			MODULE_UTILS.makeAjaxCall(url, data, this, 'POST', function(data) {
    				if(data && data.content && data.content.length) {
    					for(var j = 0; j < data.content.length; j++)
    					{
    						var text = '';
    						
    						var name = data.content[j].propertySummary && data.content[j].propertySummary.name ? data.content[j].propertySummary.name : '';
    						
    						var marshaCode = data.content[j].marshaCode ? data.content[j].marshaCode : '';
    						
    						var unitNo = data.content[j].unitNo ? data.content[j].unitNo : '';
    						
    						var text = name + ' / ' + unitNo + ' (' + marshaCode + ')';
    						
    						if(data.content[j].id==self.primaryPropertyId+'' && primaryPropRole!=null && primaryPropRole!='')
    							$('[historyPropName][propId="'+data.content[j].id+'"]').html(text+' - '+primaryPropRole);
    						else
    							$('[historyPropName][propId="'+data.content[j].id+'"]').html(text);
    					}	
    				}
    				$('span[historyPropName]').removeClass('hidden');
    			},  false, false, true, PLATCTRL.moduleMetadata.metaData.LEADS.moduleCode);
    			
    		}	
    					
		}, null, false, false, false, PLATCTRL.moduleMetadata.metaData.LEADS.moduleCode);
	};

	this.renderUserProperties = function(data) {
		
		$('#tab-' + PLATCTRL.moduleMetadata.metaData.LEADS.moduleCode).append(this.buildUserProperties(data));
	};
	
	this.buildUserProperties = function(data) {
		
		var html = [];
		
		html.push('<h4>Current Properties</h4>');
		html.push('<table class="table table-striped table-bordered table-hover" id="userPropertiesTbl">');
		html.push('	<thead>');
		html.push('		<tr>');
		html.push('			<th>MARSHA Code</th>');
		html.push('			<th>Property Name</th>');
		html.push('			<th>Unit #</th>');
		html.push('		</tr>');
		html.push('	</thead>');
		html.push('	<tbody>');
		
		if(data) {
			
			for(var i=0; i<data.length; i++) {

				var property = data[i];
				
				html.push('<tr>');
				html.push('	<td>' + (property.marshaCode ? property.marshaCode : '') + '</td>');				
				if(property.primaryProp)
					html.push('	<td>' + property.propName +' <small class="blue">( <i class="ace-icon fa fa-home"></i> ' + this.config.lang.primaryProperty + ' )</small></td>');
				else
					html.push('	<td>' + property.propName + '</td>');
				html.push('	<td>' + (property.unitNo ? property.unitNo : '') + '</td>');
				html.push('</tr>');
			}
		}
		
		html.push('	</tbody>');
		html.push('</table>');
		
		return html.join('');
	};
  
	this.renderUserPropertyHistory = function(data) {
		
		$('#tab-' + PLATCTRL.moduleMetadata.metaData.LEADS.moduleCode).append(this.buildPropertyHistory(data));
	};

	this.buildPropertyHistory = function(data) {
	   var html = [];
	   		//html.push('<div class="space-12"></div>');
	   		html.push('<h4>Property Change History</h4>');
	   		html.push('<div class="row">');										
	   		html.push('		<div id="propHistory" class="col-sm-12">');
	   		html.push(			data);
	   		html.push('		</div>');
	   		html.push('</div>')
	   		
	   return html.join('');
	   
   }
};