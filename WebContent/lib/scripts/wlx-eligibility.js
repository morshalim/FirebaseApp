var Eligibility = function(config){
	self = this;
	this.dt = {};
	this.config = {
		SYSTEM_DATE_FORMAT: 'yymmdd',
		VISIBLE_DATE_FORMAT: 'mm/dd/yy',
		SYSTEM_DATE_TIME_FORMAT: 'yymmdd',
		VISIBLE_DATE_TIME_FORMAT: 'mm/dd/yy',
		lbl:{
			removeConfirm:langMap.ind_review_remove_confirm,
			removeSuccess:langMap.ind_review_remove_success,
			emptyLibs:langMap.ind_review_emptyLibs,
			error:langMap.ind_review_error,
			saveSuccess:langMap.ind_review_save_success,
			btn:{
				save:langMap.ind_review_button_save,
				copy: langMap.ind_review_button_copy,
				cancel:langMap.ind_review_button_cancel,
				change:langMap.ind_review_button_change
			}
		},
		urls:{
			run:'../eligibility/EV_RUN_ELIGIBILITY.htm',
			manage:'../eligibility/EV_MANAGE_ELIGIBILITY.htm',
			load:'../page/EV_VIEW_ELIGIBILITY.htm',
			cancel:''
		}
	};
	
	
	
	this.init = function(){
		
		jQuery.extend(true, this.config, config );
		
		console.log(this.config.data);
		this.addruleDlg = $('#addrule_dlg').html();
		$('#addrule_dlg').remove();
		this.addconditionDlg = $('#addcondition_dlg').html();
		$('#addcondition_dlg').remove();
		this.runeligDlg = $('#runelig_dlg').html();
		$('#runelig_dlg').remove();	
		this.conditionDlg = $('#condition_dlg').html();
		$('#condition_dlg').remove();			
		
		//buttons
		$(document).on('click','.event-rule-add',{self:this},this.events.rule.add);
		$(document).on('click','.event-rule-copy',{self:this},this.events.rule.copy);
		$(document).on('click','.event-rule-edit',{self:this},this.events.rule.edit);
		$(document).on('click','.event-rule-delete',{self:this},this.events.rule.remove);
		$(document).on('click','#runElig',{self:this},this.events.runElig);
		
		$(document).on('click','#macro .event-rule-conditions-get',{self:this,ruleTypeId:'CMP_MACRO_ELIG'},this.events.ruleCondition.get);
		$(document).on('click','#macro .event-rule-conditions-add',{self:this,ruleTypeId:'CMP_MACRO_ELIG'},this.events.ruleCondition.add);
		$(document).on('click','#macro .event-rule-conditions-edit',{self:this,ruleTypeId:'CMP_MACRO_ELIG'},this.events.ruleCondition.edit);
		
		$(document).on('click','#micro .event-rule-conditions-get',{self:this,ruleTypeId:'CMP_MICRO_ELIG'},this.events.ruleCondition.get);
		$(document).on('click','#micro .event-rule-conditions-add',{self:this,ruleTypeId:'CMP_MICRO_ELIG'},this.events.ruleCondition.add);
		$(document).on('click','#micro .event-rule-conditions-edit',{self:this,ruleTypeId:'CMP_MICRO_ELIG'},this.events.ruleCondition.edit);
		
		$(document).on('click','.event-rule-conditions-reset',{self:this},this.events.ruleCondition.reset);
		$(document).on('click','.event-rule-conditions-delete',{self:this},this.events.ruleCondition.remove);
		
		$(document).on('click','.event-custom-cond-edit',{self:this,type:'UPDATE'},this.events.customCondition.popupEdit);
		$(document).on('click','.event-custom-cond-add',{self:this,type:'ADD'},this.events.customCondition.popupAdd);
		$(document).on('click','.event-custom-cond-remove',{self:this},this.events.customCondition.remove);
		
		$(document).on('click','#conditionCtnr select[name="formulaType"]',{self:this},function(e){
			var self = e.data.self;
			var params = e.data;
			if($(this).val() == 'SQL')
				self.editor.getSession().setMode("ace/mode/sql");
			else
				self.editor.getSession().setMode("ace/mode/javascript");
		});
		
		
		
		$(document).on('keyup','.numbersOnly',{self:this},function () { 
		    this.value = this.value.replace(/[^0-9\.]/g,'');
		});
		
		/*$(document).on('click','input[name="conditions"]',{self:this},function(e){
			
		});*/
		$(document).on('click','.wiz-cond-delete',{self:this},function(e){
			var self = e.data.self;
			var params = e.data;	
			$(this).parents('tr').remove();
			//$('#manageRuleCondTable tbody tr:last').find('select[name="operation"]').hide();
		});
		
		$(document).on('click','#addRuleConditionOperation',{self:this},function(e){
			var self = e.data.self;
			var params = e.data;	
			var condElem = $('input[name="conditions"]:checked');
			self.addFormConditionRuleTR(null,$(this).attr('condType'),condElem.attr('ruleId'),condElem.val())
		});
		
		//steps wizard
		this.renderConditionsPopup();
		$('#addcondition_modal .modal-header').ace_wizard({
			step: 1
		}).on('change' ,{self:this}, function(e, info){
			var self = e.data.self;
			var params = e.data;
			if(info.step == 2 && info.direction == 'previous') {
            	console.log(1);
            	var condElem = $('input[name="conditions"]:checked')
				if(self.saveCondRules()){
					$('#addcondition_modal').modal('hide')	;	
            	}else{
            		e.preventDefault();
            	}
            }
			if(info.step == 1 && info.direction == 'next' || info.step == 3 && info.direction == 'previous') {
            	console.log(2);
            	var condElem = $('input[name="conditions"]:checked');
            	if(condElem.length > 0){
            		var condId = condElem.val();
            		var condition = $.grep(self.config.data.conditions, function(element) {
					    return element.condId == condId;
					});
            		$('#step1Title').html(condition[0].condName);
            		//if(!self.savedCondRules)
            		self.generateWizardRuleCondition(self.savedCondRules,condition[0].condType,condElem.attr('ruleId'),condition[0].condId);
            	}else{
            		e.preventDefault();
            	}
            }
		}).on('finished',{self:this}, function(e){
			var self = e.data.self;
			var params = e.data;
			if(self.saveCondRules()){
				var condElem = $('input[name="conditions"]:checked');
				e.data.ruleId = condElem.attr('ruleId');
				e.data.ruleTypeId = condElem.attr('ruleTypeId');
				e.data.ruleConditions = self.savedCondRules;
				self.events.ruleCondition.save(e);
        	}else{
        		e.preventDefault();
        	}
        });
		$('#addcondition_modal .wizard-actions .btn[data-dismiss=modal]').removeAttr('disabled');
		
		
		
		
		
		
		
		


		
		
	};

	
	this.render = function(data,type){
		if(data && type == null){
			this.config.data = data;
		}else if(type && type == 'RULES'){
			this.config.data.macroRules = data.macroRules;
			this.config.data.microRules = data.microRules;
			this.config.data.history = data.history;
			this.config.data.stats = data.stats;
		}else{
			$('span[rel="subtitle"]').html(this.config.data.reviewItemMap['DESCRIPTION']);
		}
		$('.rule-condition-ctnr').hide();
		this.renderMicroTable(this.config.data.microRules);
		this.renderMacroTable(this.config.data.macroRules);
		this.renderHistoryTable(this.config.data.history);
		this.renderStats(this.config.data.stats);
	};


	this.events = {
			runElig: function(e){
				var self = e.data.self;
				var params = e.data;
				
				bootbox.dialog({
					message: self.runeligDlg,
					title: "Run Eligibility",
					buttons:			
					{
						success: {
							label: "Run",
							className: "btn-success",
							callback: function(e){ 
								self.ajax({
									 url:self.config.urls.run,
									 method: 'POST',
									 dataType: 'json',
									 params:{
											type:'GET',
											reviewItemId: self.config.data.reviewItemId,
											applyRules:true
									 },
									 showErrors: null,
									 success: function(data){
										 
									 }
								});	
							
							}
						},
						test: {
							label: "Test Run",
							className: "btn-success",
							callback: function(e){ 
								self.ajax({
									 url:self.config.urls.run,
									 method: 'POST',
									 dataType: 'json',
									 params:{
											type:'GET',
											reviewItemId: self.config.data.reviewItemId,
											applyRules:false
									 },
									 showErrors: null,
									 success: function(data){
										 
									 }
								});	
							}
						},
						danger: {
							label: "Cancel",
							className: "btn-default"
						}
													
					}
				});
			},
			manage: function(e){
				var self = e.data.self;
				var params = e.data;
				self.ajax({
					 url:self.config.urls.manage,
					 method: 'POST',
					 dataType: 'json',
					 params:params.requestParams,
					 showErrors: null,
					 success: params.success
				});				
			},
			customCondition:{
				
				popupAdd: function(e){
					var self = e.data.self;
					var params = e.data;
					var condId = $(this).attr('condId');
					

					bootbox.dialog({
						message: self.conditionDlg,
						title: "Custom Condition",
						buttons:			
						{
							success: {
								label: "Save",
								className: "btn-success",
								callback: function(e){ 
									self.events.customCondition.save({data:{self:self,type:'ADD'}});
								
								}
							},
							danger: {
								label: "Cancel",
								className: "btn-default"
							}
														
						}
					});
					
					$('#conditionCtnr').parents('.modal-dialog').attr('style','width:100%;');
					ace.require("ace/ext/language_tools");
				    self.editor = ace.edit("editor");
				    self.editor.setTheme("ace/theme/eclipse");
				    self.editor.getSession().setMode("ace/mode/javascript");
				    self.editor.setOptions({
				        enableBasicAutocompletion: true,
				        enableSnippets: true,
				        enableLiveAutocompletion: false
				    });
		
					
				},popupEdit: function(e){
					var self = e.data.self;
					var params = e.data;
					var condId = $(this).attr('condId');
					
					self.events.manage({
						data:{
							'self':self,
							requestParams:{
								type:'GET',
								reviewItemId: self.config.data.reviewItemId,
								conditions: [{
									clientId: null,
									condDescription: null,
									condId: condId,
									condName: null,
									condType: null,
									createdBy: null,
									createdOn: null,
									custom: "1",
									formula: null,
									formulaType: null,
									locale: null,
									updatedBy: null,
									updatedOn: null
								}]
								
							},
							success: function(data){
								bootbox.dialog({
									message: self.conditionDlg,
									title: "Custom Condition",
									buttons:			
									{
										success: {
											label: "Save",
											className: "btn-success",
											callback: function(e){ 
												self.events.customCondition.save({data:{self:self,type:'UPDATE'}});
											
											}
										},
										danger: {
											label: "Cancel",
											className: "btn-default"
										}
																	
									}
								});
								$('#conditionCtnr input[name="condId"]').val(data.conditions[0].condId);
								$('#conditionCtnr textarea[name="condDescription"]').val(data.conditions[0].condDescription);
								$('#conditionCtnr input[name="condName"]').val(data.conditions[0].condName);
								$('#conditionCtnr select[name="condType"]').val(data.conditions[0].condType);
								$('#conditionCtnr select[name="formulaType"]').val(data.conditions[0].formulaType);
								
								
								$('#conditionCtnr').parents('.modal-dialog').attr('style','width:100%;');
								ace.require("ace/ext/language_tools");
							    self.editor = ace.edit("editor");
							    self.editor.setTheme("ace/theme/eclipse");
							    self.editor.getSession().setMode("ace/mode/javascript");
							    self.editor.setOptions({
							        enableBasicAutocompletion: true,
							        enableSnippets: true,
							        enableLiveAutocompletion: false
							    });
							    
							    self.editor.setValue(data.conditions[0].formula);
							
							}
						}
					}); 
					
				},
				save: function(e){
					var self = e.data.self;
					var params = e.data;
					self.events.manage({
						data:{
							'self':self,
							requestParams:{
								type:params.type,
								reviewItemId: self.config.data.reviewItemId,
								conditions: [{
									clientId: null,
									condDescription: $('#conditionCtnr textarea[name="condDescription"]').val(),
									condId: $('#conditionCtnr input[name="condId"]').val(),
									condName: $('#conditionCtnr input[name="condName"]').val(),
									condType: $('#conditionCtnr select[name="condType"]').val(),
									createdBy: null,
									createdOn: null,
									custom: "1",
									formula: self.editor.getValue(),
									formulaType: $('#conditionCtnr select[name="formulaType"]').val(),
									locale: null,
									updatedBy: null,
									updatedOn: null
								}]
								
							},
							success: function(data){
								self.config.data.conditions = data.conditions;
								self.renderConditionsPopup();
							}
						}
					}); 
					
				},
				remove: function(e){
					var self = e.data.self;
					var params = e.data;
					var condId = $(this).attr('condId');
					bootbox.dialog({
						message: 'Are you sure you want to delete this custom condition ?',
						title: "Custom Condition",
						buttons:			
						{
							success: {
								label: "Delete",
								className: "btn-success",
								callback: function(e){ 
									self.events.manage({
										data:{
											'self':self,
											requestParams:{
												type:'DELETE',
												reviewItemId: self.config.data.reviewItemId,
												conditions: [{
													clientId: null,
													condDescription: null,
													condId: condId,
													condName: null,
													condType: null,
													createdBy: null,
													createdOn: null,
													custom: "1",
													formula: null,
													formulaType: null,
													locale: null,
													updatedBy: null,
													updatedOn: null
												}]
												
											},
											success: function(data){
												self.config.data.conditions = data.conditions;
												self.renderConditionsPopup();
											}
										}
									});									
								
								}
							},
							danger: {
								label: "Cancel",
								className: "btn-default"
							}
														
						}
					});
				}
			},
			ruleCondition:{
				get: function(e){
					var self = e.data.self;
					var params = e.data;
					var ruleId = $(this).attr('ruleId');
					var ruleTypeId = params.ruleTypeId;
					
					$('input[ruleId="'+ruleId+'"][ruleTypeId="'+ruleTypeId+'"]').attr('checked',true);

					
					self.events.manage({
						data:{
							'self':self,
							requestParams:{
								type:'GET',
								reviewItemId: self.config.data.reviewItemId,
								ruleConditions: [{
									clientId:null,
								    condId:null,
								    ruleId:ruleId,
								    signId:null,
								    val:null,
								    operation:null,
								    createdBy:null,
								    createdOn:null,
								    updatedBy:null,
								    updatedOn:null
								}]
								
							},
							success: function(data){
								
								var rulesArray = null;
								if(ruleTypeId == 'CMP_MACRO_ELIG'){
									rulesArray = self.config.data.macroRules;
									$('#macro .rule-condition-ctnr').show();
								}else{
									rulesArray = self.config.data.microRules;
									$('#micro .rule-condition-ctnr').show();
								}
								
								var rules = $.grep(rulesArray, function(element) {
								    return element.ruleId == ruleId ;
								});
								
								if(ruleTypeId == 'CMP_MACRO_ELIG'){
									rules && rules.length > 0 ? $('#macro .rule-name').html(rules[0].ruleName) : null;
									$('#macro .event-rule-conditions-add').attr('ruleId',ruleId);
									$('#macro .event-rule-conditions-add').attr('ruleTypeId',ruleTypeId);
									$('#macro .event-rule-conditions-reset').attr('ruleId',ruleId);
									$('#macro .event-rule-conditions-reset').attr('ruleTypeId',ruleTypeId);
									$('#macro .rule-condition-ctnr').show();
									self.macroRuleConditions = data.ruleConditions;
								}else{
									rules && rules.length > 0 ? $('#micro .rule-name').html(rules[0].ruleName) : null;
									$('#micro .event-rule-conditions-add').attr('ruleId',ruleId);
									$('#micro .event-rule-conditions-add').attr('ruleTypeId',ruleTypeId);
									$('#micro .event-rule-conditions-reset').attr('ruleId',ruleId);
									$('#micro .event-rule-conditions-reset').attr('ruleTypeId',ruleTypeId);
									$('#micro .rule-condition-ctnr').show();
									self.microRuleConditions = data.ruleConditions;
								}
								self.renderRuleConditions(data.ruleConditions,ruleTypeId);
							}
						}
					}); 
				},
				save: function(e){
					var self = e.data.self;
					var params = e.data;
					var ruleId = params.ruleId;
					var ruleTypeId = params.ruleTypeId;

					self.events.manage({
						data:{
							'self':self,
							requestParams:{
								type:'ADD',
								reviewItemId: self.config.data.reviewItemId,
								ruleConditions: params.ruleConditions 
								
							},
							success: function(data){
								
								var rulesArray = null;
								if(ruleTypeId == 'CMP_MACRO_ELIG'){
									rulesArray = self.config.data.macroRules;
									$('#macro .rule-condition-ctnr').show();
								}else{
									rulesArray = self.config.data.microRules;
									$('#micro .rule-condition-ctnr').show();
								}
								
								var rules = $.grep(rulesArray, function(element) {
								    return element.ruleId == ruleId ;
								});
								
								if(ruleTypeId == 'CMP_MACRO_ELIG'){
									rules && rules.length > 0 ? $('#macro .rule-name').html(rules[0].ruleName) : null;
									$('#macro .event-rule-conditions-add').attr('ruleId',ruleId);
									$('#macro .event-rule-conditions-add').attr('ruleTypeId',ruleTypeId);
									$('#macro .event-rule-conditions-reset').attr('ruleId',ruleId);
									$('#macro .event-rule-conditions-reset').attr('ruleTypeId',ruleTypeId);
									$('#macro .rule-condition-ctnr').show();
									self.macroRuleConditions = data.ruleConditions;
								}else{
									rules && rules.length > 0 ? $('#micro .rule-name').html(rules[0].ruleName) : null; 
									$('#micro .event-rule-conditions-add').attr('ruleId',ruleId);
									$('#micro .event-rule-conditions-add').attr('ruleTypeId',ruleTypeId);
									$('#micro .event-rule-conditions-reset').attr('ruleId',ruleId);
									$('#micro .event-rule-conditions-reset').attr('ruleTypeId',ruleTypeId);
									$('#micro .rule-condition-ctnr').show();
									self.microRuleConditions = data.ruleConditions;
								}
								self.renderRuleConditions(data.ruleConditions,ruleTypeId);
								$('#addcondition_modal').modal('hide');
							}
						}
					}); 
				},add: function(e){
					var self = e.data.self;
					var params = e.data;
					var ruleId = $(this).attr('ruleId');
					var ruleTypeId = $(this).attr('ruleTypeId');
					$('input[name="conditions"]').attr('disabled',false);
					$('input[name="conditions"]:checked').prop("checked", false);
					$('input[name="conditions"]').attr('ruleId',ruleId);
					$('input[name="conditions"]').attr('ruleTypeId',ruleTypeId);
					self.savedCondRules = [];
					$('#addcondition_modal .modal-header').wizard('selectedItem', 1).currentStep = 1;
					$('#addcondition_modal .modal-header').wizard('selectedItem', 1).setState();
					$('#step1Title').html('Select Condition');
					var ruleConditions = ruleTypeId == 'CMP_MACRO_ELIG' ? self.macroRuleConditions : self.microRuleConditions;
					var groupCond = [];
					for(var i = 0 ; i < ruleConditions.length; i++){
						var ruleCond = ruleConditions[i];
						$('input[name="conditions"][value="'+ruleCond.condId +'"]').attr('disabled','disabled');
					}
				},
				edit: function(e){
					var self = e.data.self;
					var params = e.data;
					var ruleId = $(this).attr('ruleId');
					var ruleTypeId = $(this).attr('ruleTypeId');
					var condId = $(this).attr('condId');
					var condType = $(this).attr('condType');
					$('input[name="conditions"]').attr('ruleId',ruleId);
					$('input[name="conditions"]').attr('ruleTypeId',ruleTypeId);
					$('input[name="conditions"]').attr('disabled',false);
					$('input[name="conditions"]:checked').attr('selected',false);
					$('input[name="conditions"][value="'+condId +'"]').prop("checked", true);
					$('input[name="conditions"]').attr('disabled','disabled');
					$('#addcondition_modal .modal-header').wizard('selectedItem', 2).currentStep = 2;
					$('#addcondition_modal .modal-header').wizard('selectedItem', 2).setState();
					var ruleConditions = ruleTypeId == 'CMP_MACRO_ELIG' ? self.macroRuleConditions : self.microRuleConditions;
					var groupCond = [];
					for(var i = 0 ; i < ruleConditions.length; i++){
						var ruleCond = ruleConditions[i];
						if(ruleCond.condId == condId){
							$('#step1Title').html(ruleCond.condName);
							groupCond.push(ruleCond);
						}
					}
					self.savedCondRules = groupCond;
					self.generateWizardRuleCondition(self.savedCondRules,condType,ruleId,condId);
				},
				remove: function(e){
					var self = e.data.self;
					var params = e.data;
					var ruleId = $(this).attr('ruleId');
					var ruleTypeId = $(this).attr('ruleTypeId');
					var condId = $(this).attr('condId');
					var condType = $(this).attr('condType');
					bootbox.dialog({
						message: 'Are you sure you want to delete this condition ? ',
						title: "Delete Condition",
						buttons:			
						{
							success: {
								label: "Delete",
								className: "btn-success",
								callback: function(e){  
						
									self.events.manage({
										data:{
											'self':self,
											requestParams:{
												type:'DELETE',
												reviewItemId: self.config.data.reviewItemId,
												ruleConditions: [{
													clientId:null,
												    condId:condId,
												    ruleId:ruleId,
												    signId:null,
												    val:null,
												    operation:null,
												    createdBy:null,
												    createdOn:null,
												    updatedBy:null,
												    updatedOn:null
												}]
												
											},
											success: function(data){
												var rulesArray = null;
												if(ruleTypeId == 'CMP_MACRO_ELIG'){
													rulesArray = self.config.data.macroRules;
													$('#macro .rule-condition-ctnr').show();
												}else{
													rulesArray = self.config.data.microRules;
													$('#micro .rule-condition-ctnr').show();
												}
												
												var rules = $.grep(rulesArray, function(element) {
												    return $.inArray(element.ruleId, ruleId) !== -1;
												});
												
												if(ruleTypeId == 'CMP_MACRO_ELIG'){
													rules && rules.length > 0 ?  $('#macro .rule-name').html(rules[0].ruleName) : null;
													$('#macro .event-rule-conditions-add').attr('ruleId',ruleId);
													$('#macro .event-rule-conditions-add').attr('ruleTypeId',ruleTypeId);
													$('#macro .event-rule-conditions-reset').attr('ruleId',ruleId);
													$('#macro .event-rule-conditions-reset').attr('ruleTypeId',ruleTypeId);
													$('#macro .rule-condition-ctnr').show();
													self.macroRuleConditions = data.ruleConditions;
												}else{
													rules && rules.length > 0 ?  $('#micro .rule-name').html(rules[0].ruleName) : null;
													$('#micro .event-rule-conditions-add').attr('ruleId',ruleId);
													$('#micro .event-rule-conditions-add').attr('ruleTypeId',ruleTypeId);
													$('#micro .event-rule-conditions-reset').attr('ruleId',ruleId);
													$('#micro .event-rule-conditions-reset').attr('ruleTypeId',ruleTypeId);
													$('#micro .rule-condition-ctnr').show();
													self.microRuleConditions = data.ruleConditions;
												}
												self.renderRuleConditions(data.ruleConditions,ruleTypeId);
											}
										}
									}); 
					
								}
							},
							danger: {
								label: "Cancel",
								className: "btn-default"
							}
														
						}
					});
				},
				reset: function(e){
					var self = e.data.self;
					var params = e.data;
					var ruleId = $(this).attr('ruleId');
					var ruleTypeId = $(this).attr('ruleTypeId');
					bootbox.dialog({
						message: 'Are you sure you want to reset the conditions ? ',
						title: "Reset Conditions",
						buttons:			
						{
							success: {
								label: "Delete",
								className: "btn-success",
								callback: function(e){  
									self.events.manage({
										data:{
											'self':self,
											requestParams:{
												type:'DELETE',
												reviewItemId: self.config.data.reviewItemId,
												ruleConditions: [{
													clientId:null,
												    condId:null,
												    ruleId:ruleId,
												    signId:null,
												    val:null,
												    operation:null,
												    createdBy:null,
												    createdOn:null,
												    updatedBy:null,
												    updatedOn:null
												}]
												
											},
											success: function(data){
												var rulesArray = null;
												if(ruleTypeId == 'CMP_MACRO_ELIG'){
													rulesArray = self.config.data.macroRules;
													$('#macro .rule-condition-ctnr').show();
												}else{
													rulesArray = self.config.data.microRules;
													$('#micro .rule-condition-ctnr').show();
												}
												
												var rules = $.grep(rulesArray, function(element) {
												    return $.inArray(element.ruleId, ruleId) !== -1;
												});
												
												if(ruleTypeId == 'CMP_MACRO_ELIG'){
													$('#macro .rule-name').html(rules[0].ruleName);
													$('#macro .event-rule-conditions-add').attr('ruleId',ruleId);
													$('#macro .event-rule-conditions-add').attr('ruleTypeId',ruleTypeId);
													$('#macro .event-rule-conditions-reset').attr('ruleId',ruleId);
													$('#macro .event-rule-conditions-reset').attr('ruleTypeId',ruleTypeId);
													$('#macro .rule-condition-ctnr').show();
													self.macroRuleConditions = data.ruleConditions;
												}else{
													$('#micro .rule-name').html(rules[0].ruleName);
													$('#micro .event-rule-conditions-add').attr('ruleId',ruleId);
													$('#micro .event-rule-conditions-add').attr('ruleTypeId',ruleTypeId);
													$('#micro .event-rule-conditions-reset').attr('ruleId',ruleId);
													$('#micro .event-rule-conditions-reset').attr('ruleTypeId',ruleTypeId);
													$('#micro .rule-condition-ctnr').show();
													self.microRuleConditions = data.ruleConditions;
												}
												self.renderRuleConditions(data.ruleConditions,ruleTypeId);
											}
										}
									}); 
								}
							},
							danger: {
								label: "Cancel",
								className: "btn-default"
							}
														
						}
					});
				}
			},
			rule:{
				add: function(e){
					var self = e.data.self;
					var params = e.data;
					var ruleId = $(this).attr('ruleId');
					var ruleTypeId = $(this).attr('ruleTypeId');
					bootbox.dialog({
						message: self.addruleDlg,
						title: "Create New Rule",
						buttons:			
						{
							success: {
								label: "Save",
								className: "btn-success",
								callback: function(e){ 
									
									self.events.manage({
										data:{
											'self':self,
											requestParams:{
												type:'ADD',
												reviewItemId: self.config.data.reviewItemId,
												rules: [{
												    clientId:null,
												    ruleId:null,
													ruleName:$('#ruleName').val(),
													ruleDescription:$('#ruleDesc').val(),
													ruleTypeId:ruleTypeId,
													createdBy:null,
													createdOn:null,
													updatedBy:null,
													updatedOn:null,
													locale:null,
													reviewItemId:self.config.data.reviewItemId,	
												}]
												
											},
											success: function(data){
												self.render(data,'RULES');
											}
										}
									}); 
								
								}
							},
							danger: {
								label: "Cancel",
								className: "btn-default"
							}
														
						}
					});
					
				},
				copy: function(e){
					var self = e.data.self;
					var params = e.data;
					var ruleId = $(this).attr('ruleId');
					var ruleTypeId = $(this).attr('ruleTypeId');
					bootbox.dialog({
						message: self.addruleDlg,
						title: "Copy New Rule",
						buttons:			
						{
							success: {
								label: "Save",
								className: "btn-success",
								callback: function(e){ 
									
									self.events.manage({
										data:{
											'self':self,
											requestParams:{
												type:'COPY',
												reviewItemId: self.config.data.reviewItemId,
												rules: [{
												    clientId:null,
												    ruleId:null,
													ruleName:$('#ruleName').val(),
													ruleDescription:$('#ruleDesc').val(),
													ruleTypeId:$('#ruleTypeId').val(),
													createdBy:null,
													createdOn:null,
													updatedBy:null,
													updatedOn:null,
													locale:null,
													reviewItemId:self.config.data.reviewItemId,	
												}]
												
											},
											success: function(data){
												self.render(data,'RULES');
											}
										}
									}); 
								
								}
							},
							danger: {
								label: "Cancel",
								className: "btn-default"
							}
														
						}
					});
					
					var rulesArray = null;
					if(ruleTypeId == 'CMP_MACRO_ELIG'){
						rulesArray = self.config.data.macroRules;
						
					}else{
						rulesArray = self.config.data.microRules;
					}
					
					var rules = $.grep(rulesArray, function(element) {
					    return $.inArray(element.ruleId, ruleId) !== -1;
					});
					//$('#ruleId').val(rules[0].ruleName);
					$('#ruleTypeId').val(rules[0].ruleTypeId);
					$('#ruleName').val(rules[0].ruleName);
					$('#ruleDesc').val(rules[0].ruleDescription);
				},
				edit: function(e){
					var self = e.data.self;
					var params = e.data;
					var ruleId = $(this).attr('ruleId');
					var ruleTypeId = $(this).attr('ruleTypeId');					
					bootbox.dialog({
						message: self.addruleDlg,
						title: "Edit Rule",
						buttons:			
						{
							success: {
								label: "Save",
								className: "btn-success",
								callback: function(e){ 
									
									self.events.manage({
										data:{
											'self':self,
											requestParams:{
												type:'UPDATE',
												reviewItemId: self.config.data.reviewItemId,
												rules: [{
												    clientId:null,
												    ruleId:$('#ruleId').val(),
													ruleName:$('#ruleName').val(),
													ruleDescription:$('#ruleDesc').val(),
													ruleTypeId:$('#ruleTypeId').val(),
													createdBy:null,
													createdOn:null,
													updatedBy:null,
													updatedOn:null,
													locale:null,
													reviewItemId:self.config.data.reviewItemId,	
												}]
												
											},
											success: function(data){
												self.render(data,'RULES');
											}
										}
									}); 
								
								}
							},
							danger: {
								label: "Cancel",
								className: "btn-default"
							}
														
						}
					});
					var rulesArray = null;
					if(ruleTypeId == 'CMP_MACRO_ELIG'){
						rulesArray = self.config.data.macroRules;
						
					}else{
						rulesArray = self.config.data.microRules;
					}
					
					var rules = $.grep(rulesArray, function(element) {
					    return $.inArray(element.ruleId, ruleId) !== -1;
					});
					$('#ruleId').val(rules[0].ruleId);
					$('#ruleTypeId').val(rules[0].ruleTypeId);
					$('#ruleName').val(rules[0].ruleName);
					$('#ruleDesc').val(rules[0].ruleDescription);
				},
				remove: function(e){
					var self = e.data.self;
					var params = e.data;
					var ruleId = $(this).attr('ruleId');
					var ruleTypeId = $(this).attr('ruleTypeId');
					bootbox.dialog({
						message: 'Are you sure you want to delete this rule ? ',
						title: "Edit Rule",
						buttons:			
						{
							success: {
								label: "Delete",
								className: "btn-success",
								callback: function(e){ 
									
									self.events.manage({
										data:{
											'self':self,
											requestParams:{
												type:'DELETE',
												reviewItemId: self.config.data.reviewItemId,
												rules: [{
												    clientId:null,
												    ruleId:ruleId,
													ruleName:null,
													ruleDescription:null,
													ruleTypeId:ruleTypeId,
													createdBy:null,
													createdOn:null,
													updatedBy:null,
													updatedOn:null,
													locale:null,
													reviewItemId:self.config.data.reviewItemId,	
												}]
												
											},
											success: function(data){
												self.render(data,'RULES');
											}
										}
									}); 
								
								}
							},
							danger: {
								label: "Cancel",
								className: "btn-default"
							}
														
						}
					});
				}
			},
		run : function(e){
			var self = e.data.self;
			var params = e.data;
			
			self.ajax({
				 url:self.config.urls.run,
				 method: 'POST',
				 dataType: 'json',
				 params:{
				 },
				 showErrors: null,
				 success: function(data){
					
					
				 }
			});
		}
	};
	
	this.renderRuleConditions = function(data,ruleTypeId){
		var groupCond = {};
		for(var i = 0 ; i < data.length; i++){
			if(groupCond[data[i].condId]){
				groupCond[data[i].condId].vals.push(data[i].operation + ' ' + data[i].signSymbol  + ' ' + this.conditionFormat[data[i].condType](data[i].val));
			}else{
				groupCond[data[i].condId] = {
						name:data[i].condName,
						symbol: data[i].signSymbol,
						vals: [data[i].signSymbol  + ' ' + this.conditionFormat[data[i].condType](data[i].val)],
						ruleId:data[i].ruleId,
						condType:data[i].condType
				}
			}
		}
		var content = [];
		for(var cond in groupCond){
			content.push('			<tr>');
			content.push('				<td><a href="#addcondition_modal" data-toggle="modal"  data-backdrop="static" class="event-rule-conditions-edit" condType="'+groupCond[cond].condType+'" ruleId="'+groupCond[cond].ruleId+'" ruleTypeId="'+ruleTypeId+'" condId="'+cond+'" >'+groupCond[cond].name+'</a></td>');	
			content.push('				<td>'+  groupCond[cond].vals.join(' ')+'</td>');
			content.push('				<td>');
			content.push('					<a href="#addcondition_modal" data-toggle="modal"  data-backdrop="static" class="event-rule-conditions-edit" condType="'+groupCond[cond].condType+'"  ruleId="'+groupCond[cond].ruleId+'" ruleTypeId="'+ruleTypeId+'" condId="'+cond+'" ><i class="fa fa-pencil bigger-110 red"></i></a>');
			content.push('					<a href="#" class="event-rule-conditions-delete" condType="'+groupCond[cond].condType+'" ruleId="'+groupCond[cond].ruleId+'" ruleTypeId="'+ruleTypeId+'" condId="'+cond+'" ><i class="fa fa-trash-o bigger-110 red"></i></a>');
			content.push('				</td>');
			content.push('			</tr>');
		}

		if(ruleTypeId == 'CMP_MACRO_ELIG'){
			if(this.dt.macroRuleConditionsTable){
				this.dt.macroRuleConditionsTable.fnDestroy();
			}
			$('#macroRuleConditionsTable tbody').html(content.join(''));
			this.dt.macroRuleConditionsTable = $('#macroRuleConditionsTable').dataTable({"aoColumns": [null,null,null],"oLanguage": dataTableLang});
		}else{
			if(this.dt.microRuleConditionsTable){
				this.dt.microRuleConditionsTable.fnDestroy();
			}
			$('#microRuleConditionsTable tbody').html(content.join(''));
			this.dt.microRuleConditionsTable = $('#microRuleConditionsTable').dataTable({"aoColumns": [null,null,null],"oLanguage": dataTableLang});			
		}

	};
	this.renderMacroTable = function(data){
		var content = [];
		for(var i = 0 ; i < data.length; i++){
			content.push('			<tr>');
			content.push('<td>			<div>');
			content.push('				<label>');
			content.push('					<input name="rule" type="radio" class="ace event-rule-conditions-get"  ruleId="'+data[i].ruleId+'" ruleTypeId="'+data[i].ruleTypeId+'" >');
			content.push('					<span class="lbl" > </span>');
			content.push('				</label></td>');
			content.push('				<td><a href="#" class="event-rule-conditions-get" ruleId="'+data[i].ruleId+'" >'+data[i].ruleName+'</a></td>	');
			content.push('				<td>'+data[i].ruleDescription+'</td>');
			content.push('				<td>');
			content.push('					<a href="#"><i ruleId="'+data[i].ruleId+'" ruleTypeId="'+data[i].ruleTypeId+'" class="event-rule-copy fa fa-copy bigger-110 red"></i></a>');
			content.push('					<a href="#"><i ruleId="'+data[i].ruleId+'" ruleTypeId="'+data[i].ruleTypeId+'" class="event-rule-edit fa fa-pencil bigger-110 red"></i></a>');
			content.push('					<a href="#"><i ruleId="'+data[i].ruleId+'" ruleTypeId="'+data[i].ruleTypeId+'" class="event-rule-delete fa fa-trash-o bigger-110 red"></i></a>');
			content.push('				</td>');
			content.push('			</tr>');
		}


		if(this.dt.macroRulesTable){
			this.dt.macroRulesTable.fnDestroy();
		}
		$('#macroRulesTable tbody').html(content.join(''));
		this.dt.macroRulesTable = $('#macroRulesTable').dataTable({"aoColumns": [null,null,null,null],"oLanguage": dataTableLang});
	};
	this.renderMicroTable = function(data){
		var content = [];
		for(var i = 0 ; i < data.length; i++){
			content.push('			<tr>');
			content.push('<td>			<div>');
			content.push('				<label>');
			content.push('					<input name="rule" type="radio" class="ace event-rule-conditions-get"  ruleId="'+data[i].ruleId+'" ruleTypeId="'+data[i].ruleTypeId+'" >');
			content.push('					<span class="lbl" > </span>');
			content.push('				</label></td>');
			content.push('			</div>');
			content.push('				<td><a href="#" class="event-rule-conditions-get"  ruleId="'+data[i].ruleId+'" ruleTypeId="'+data[i].ruleTypeId+'" >'+data[i].ruleName+'</a></td>	');
			content.push('				<td>'+data[i].ruleDescription+'</td>');
			content.push('				<td>');
			content.push('					<a href="#"><i ruleId="'+data[i].ruleId+'" ruleTypeId="'+data[i].ruleTypeId+'" class="event-rule-copy fa fa-copy bigger-110 red"></i></a>');
			content.push('					<a href="#"><i ruleId="'+data[i].ruleId+'" ruleTypeId="'+data[i].ruleTypeId+'" class="event-rule-edit fa fa-pencil bigger-110 red"></i></a>');
			content.push('					<a href="#"><i ruleId="'+data[i].ruleId+'" ruleTypeId="'+data[i].ruleTypeId+'" class="event-rule-delete fa fa-trash-o bigger-110 red"></i></a>');
			content.push('				</td>');
			content.push('			</tr>');
		}


		if(this.dt.microRulesTable){
			this.dt.microRulesTable.fnDestroy();
		}
		$('#microRulesTable tbody').html(content.join(''));
		this.dt.microRulesTable = $('#microRulesTable').dataTable({"aoColumns": [null,null,null,null],"oLanguage": dataTableLang});
	};
	this.renderHistoryTable = function(data){
		var secondsToTime = function(secs){
		    var hours = Math.floor(secs / (60 * 60));
		    var divisor_for_minutes = secs % (60 * 60);
		    var minutes = Math.floor(divisor_for_minutes / 60);
		    var divisor_for_seconds = divisor_for_minutes % 60;
		    var seconds = Math.ceil(divisor_for_seconds);
		    return (hours && hours != '' ? hours + ' hours ' : '' ) + (minutes && minutes != '' ? minutes + ' minutes ' : '' ) + (seconds!=0 && seconds != '' ? seconds + ' seconds ' : '' ); 
		}
		 
		var content = [];
		for(var i = 0 ; i < data.length; i++){
			content.push('			<tr>');
			content.push('			<td>'+data[i]['CMP_MACRO_ELIG_RUN_DATE'].validDate+'</td>');
			content.push('			<td>'+secondsToTime(parseInt(data[i]['CMP_MACRO_ELIG_PROCESS_TIME'].value,10) + (data[i]['CMP_MICRO_ELIG_PROCESS_TIME'] ? parseInt(data[i]['CMP_MICRO_ELIG_PROCESS_TIME'].value,10) : 0))+'</td>	');
			content.push('			<td>'+data[i]['CMP_MICRO_ELIG_FILTERED_EMP'].value+'</td>');
			content.push('			<td>'+data[i]['CMP_MICRO_ELIG_USERID'].value+'</td>');
			content.push('			<td>'+(data[i]['CMP_MICRO_ELIG_APPLY'] ? data[i]['CMP_MICRO_ELIG_APPLY'].value: '')+'</td>');
			content.push('			</tr>');

		}
		if(this.dt.history_tab){
			this.dt.history_tab.fnDestroy();
		}
		$('#history_tab tbody').html(content.join(''));
		this.dt.history_tab = $('#history_tab').dataTable({"aoColumns": [null,null,null,null,null],"oLanguage": dataTableLang});
	};
	this.renderStats = function(data){
		var content = [];
		if(data)
		for(var i = 0 ; i < data.length; i++){
			$('.stat[key="'+data[i].key+'"][ref="'+data[i].ruleTypeId+'"]').html(data[i].value);

		}
		$('.stat[key="COUNT"]').html(this.config.data.history.length);

	};	
	this.renderConditionsPopup = function(data){
		
		var standardCondition = $.grep(self.config.data.conditions, function(element) {
		    return element.custom == '0';
		});
		var customCondition = $.grep(self.config.data.conditions, function(element) {
		    return element.custom == '1';
		});		
		
		var content = [];
		for(var i = 0 ; i < standardCondition.length; i++){
			var cond = standardCondition[i];
			content.push('			<div class="radio">');
			content.push('				<label>');
			content.push('					<input name="conditions" value="'+cond.condId+'" type="radio" class="ace">');
			content.push('					<span class="lbl" > '+cond.condName +'</span>');
			content.push('				</label>');
			content.push('			</div>');
		}
		$('#standardConditionsCtnr').html(content.join(''));

		content = [];
		for(var i = 0 ; i < customCondition.length; i++){
			var cond = customCondition[i];
			content.push('			<div class="radio">');
			content.push('				<label>');
			content.push('					<input name="conditions" value="'+cond.condId+'" type="radio" class="ace">');
			content.push('					<span class="lbl" ><a class="event-custom-cond-edit" condId="'+cond.condId+'"  href="#"  > '+cond.condName +'</a> <i condId="'+cond.condId+'" class="event-custom-cond-remove fa fa-trash-o bigger-110 red"></i></span>');
			content.push('				</label>');
			content.push('			</div>');
		}
		content.push('			<div class="radio">');
		content.push('				<label>');
		content.push('					<a class="lbl event-custom-cond-add" >Create Custom Condition</a>');
		content.push('				</label>');
		content.push('			</div>');
		$('#customConditionsCtnr').html(content.join(''));		
		
	}
	this.generateWizardRuleCondition = function(data,condType,ruleId,condId){
		$('#addRuleConditionOperation').attr('condType',condType)
		$('#manageRuleCondTable tbody').html('');
		if(!data || data.length == 0) 
			this.addFormConditionRuleTR(null,condType,ruleId,condId);
		else
			for(var i = 0 ; i < data.length; i++){
				var condTR = this.addFormConditionRuleTR(data[i],condType,data[i].ruleId,data[i].condId);
			}
		
	}
	this.addFormConditionRuleTR = function(data,condType,ruleId,condId){
		var content = [];
		$('select[name="operation"]').show();
		content.push('		<tr condType="'+condType+'" ruleId="'+ruleId+'" condId="'+condId+'" >');
		content.push('			<td>');
		content.push('				<select class="form-control" name="signId"  >');
		for (var i = 0; i < self.config.data.conditionSigns.length; i++) {
			var conditionSign = self.config.data.conditionSigns[i];
			if(conditionSign.condType == condType){
				
				content.push('					<option value="'+conditionSign.signId+'" '+(data && data.signId == conditionSign.signId ? 'selected="selected"' : '' )+' >'+conditionSign.signSymbol+'</option>');
			}
		}
		content.push('				</select>');
		content.push('			</td>');
		content.push('			<td>');
		content.push(this.getFormConditionRuleTR[condType](data));
		content.push('			</td>');
		content.push('			<td>');
		content.push('				<select class="form-control" name="operation"   >');
		content.push('					<option value="OR" '+(data && data.operation == 'OR' ? 'selected="selected"' : '' )+' >Or</option>');
		content.push('					<option value="AND" '+(data && data.operation == 'AND' ? 'selected="selected"' : '' )+' >And</option>');
		content.push('				</select>	');
		content.push('			</td>');
		content.push('			<td>');
		content.push('				<a href="#" class="wiz-cond-delete" ><i class="fa fa-trash-o bigger-110 red"></i></a>');
		content.push('			</td>');
		content.push('		</tr>	');
		
		$('#manageRuleCondTable tbody').append(content.join(''));
		
		$('.date-picker').datetimepicker().next().on(ace.click_event, function(){
			$(this).prev().focus();
		});
		
	}
	
	this.getFormConditionRuleTR = {
			STRING: function(data){
				var content = [];
				content.push('				<input type="text" name="val" value="'+(data ? data.val : '') +'"   class="form-control" />');
				return content.join('');
			},
			NUMBER: function(data){
				var content = [];
				content.push('				<input type="text"  name="val" value="'+(data != null ? data.val : '') +'"   class="form-control numbersOnly" />');
				return content.join('');
			},
			BOOLEAN: function(data){
				var content = [];
				content.push('<select class="form-control" name="val" value="'+(data != null ? data.val : '') +'" ><option value="1" '+(data != null && data.val == '1' ? 'selected="selected"' : '')+' >True</option><option value="0" '+(data != null && data.val == '0' ? 'selected="selected"' : '')+' >False</option></select>');
				return content.join('');
			},
			DATE: function(data){
				var content = [];
				content.push('				<div class="input-group">');
				content.push('					<input class="form-control date-picker" name="val" value="'+(data ? data.val : '') +'" type="text" data-date-format="dd-mm-yyyy" />');
				content.push('					<span class="input-group-addon">');
				content.push('						<i class="fa fa-calendar bigger-110"></i>');
				content.push('					</span>');
				content.push('				</div>');
			
				return content.join('');
			},
			DATETIME: function(data){
				var content = [];
				content.push('				<div class="input-group">');
				content.push('					<input name="val" value="'+(data ? data.val : '') +'" type="text" class="form-control" />');
				content.push('					<span class="input-group-addon">');
				content.push('						<i class="fa fa-clock-o bigger-110"></i>');
				content.push('					</span>');
				content.push('				</div>');
				return content.join('');		
			}
			
	}
	this.conditionFormat = {
			STRING: function(data){
				return data;
			},
			NUMBER: function(data){
				return data;
			},
			BOOLEAN: function(data){
				return data == '1' ? 'True' : 'False' ;
			},
			DATE: function(data){
				var date = $.datepicker.parseDate(self.config.SYSTEM_DATE_FORMAT, data);
				return $.datepicker.formatDate(self.config.VISIBLE_DATE_FORMAT, date);
			},
			DATETIME: function(data){
				var date = $.datepicker.parseDate(self.config.SYSTEM_DATE_FORMAT, data);
				return $.datepicker.formatDate(self.config.VISIBLE_DATE_FORMAT, date);			
			}
			
	}
	this.saveCondRules = function(){
		this.savedCondRules = [];
		var self = this;
		$('#manageRuleCondTable tbody tr').each(function(){
			var condType = $(this).attr('condType');
			var val = null;
			if(condType == 'BOOLEAN')
				val = $(this).find('select[name="val"]').val();
			else if(condType == 'DATE' || condType == 'DATTIME')
				val = $(this).find('input[name="val"]').val();
			else
				val = $(this).find('input[name="val"]').val();	
			
			condRule = {
					clientId: null,
					condId: $(this).attr('condId'),
					createdBy: null,
					createdOn: null,
					operation: $(this).find('select[name="operation"]').val(),
					ruleId: $(this).attr('ruleId'),
					signId: $(this).find('select[name="signId"]').val(),
					updatedBy: null,
					updatedOn: null,
					val: val
			};
			self.savedCondRules.push(condRule);
		});
		console.log(this.savedCondRules);
		return true;
		
	}
	this.ajax = function(conf){
			var self = this;
			
			for( var key in conf.params){
				if(conf.params[key] instanceof Date ){
					conf.params[key] = $.datepicker.formatDate(this.config.SYSTEM_DATE_FORMAT, conf.params[key]);
				}
			}
			

			var ajaxParams = {
					url: conf.url,
					data:conf.params,
					type: conf.method,
					ctxData: conf.ctxData,
					cache: false,
					success: function(resp,textStatus, XMLHttpRequest){				
						console.log('RESPONSE: ' ,conf.params, resp);
						if(conf.showError && resp.hasErrors)
							showError(resp.errorMessage);
						else if(conf.error && resp.hasErrors ) 
							conf.error(resp.data,textStatus, XMLHttpRequest);
						else if(conf.success) 
							conf.success(resp,textStatus, XMLHttpRequest,this.ctxData);
							
					},
					error: function(resp,textStatus, XMLHttpRequest)
					{
						//self.renderTable(self.config.data.reviews);
						//var resp = eval("(" + resp.responseText + ")");
						//conf.success(resp.data,textStatus, XMLHttpRequest);
						showError(self.config.lbl.error);
					}
				};
				if(conf.dataType == 'json'){
					ajaxParams.data = JSON.stringify(conf.params);
					ajaxParams.dataType = conf.dataType;
					ajaxParams.processData = false ;
					ajaxParams.contentType = "application/json; charset=utf-8";
				}
				$.ajax(ajaxParams);	
	};
	this.init();	
	
};