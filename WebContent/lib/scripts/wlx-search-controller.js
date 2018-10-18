var SearchController = function(config) {
	
	this.config = {
		debug: false,
		//labelAlignment: 'top',
		container: 'searchCntr',
		criteriaTypes: {
			text: { type: 'text' },
			select: { type: 'select' }
		},
		sortingTypes: {
			ascending: 'asc',
			descending: 'desc'
		},


		params: {},
		datasource: '',
		datasourceObj: {},
		searchResults: '',
		searchResultsColumns: [],
		searchResultsObj: {},

		preProcessDS: function(ctx) { return true; },
		postProcessDS: function(ctx) { return true; },

		preProcessAction: function(ctx) { return true; },
		transformCriteria: function(ctx) { return ctx.self.defaultCriteriaTransformmer(ctx); },
		postProcessAction: function(ctx) { return true; },

		preProcessRender: function(ctx) { return true; },
		transformSearchResults: function(ctx) { return ctx.self.defaultSearchResultsTransformmer(ctx); },
		postProcessRender: function(ctx) { return true; },


		lang: {
			desc: 'Enter the name of a property to start searching.',
			btnSearch: 'Search',
			resultsCount: '{count} Search Results Found'
		}
	};
	
	this.init = function() {
		
		$.extend(true, this.config, config);

		$(document).off('click', '#'+this.config.container.container+' button[rel=processSearch]').on('click', '#'+this.config.container.container+' button[rel=processSearch]', { self: this }, this.searchEvent);
		$(document).off('change', '#'+this.config.container.countryId).on('change', '#'+this.config.container.countryId, { self: this }, this.onChangeofParent);
		
		$(document).off('click', '#addCart').on('click', '#addCart', { self: this }, this.addToCart);
		$(document).off('click', '#removeCart').on('click', '#removeCart', { self: this }, this.removeToCart);
		$(document).off('click', '#showCart').on('click', '#showCart', { self: this }, this.showCart);
		$(document).off('click', '#backToSearchButton').on('click', '#backToSearchButton', { self: this }, this.backToSearchButton);		
		$(document).off('keypress', '#propName').on('keypress', '#propName', { self: this }, this.searchProperty);
		
		
		return this;
	};
	
	this.render = function() {
		
		this.renderCriterias();

		if(this.config.datasource != null) {
		
			if(typeof(this.config.datasource) == 'string' && this.config.datasource != '')
				this.getCriteriaData();
			else if(typeof(this.config.datasource) == 'object' && this.config.datasource != null)
				this.config.datasourceObj = this.config.datasource;
		}

		this.getSelectCriteriaData();
		
		return this;
	};



	/*
	 * ACTIONS - The actions that this widget can perform.
	 */

	this.getCriteriaData = function() {
		
		var ctx = { self: this };

		if(this.config.preProcessDS(ctx)) {

			$.ajax({
				url: this.config.datasource,
				context: { self: this },
				method: 'GET',
				dataType: 'json',
				processData: false,
				//contentType: 'application/json; charset=utf-8',
				cache: false,
				success: function(data) {
					
					if(this.self.config.debug) console.log(data);

					this.data = data;
					
					if(this.config.postProcessDS(this))
						this.self.config.datasourceObj = this.data;
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {}
			});
		}
	};

	this.getSelectCriteriaData = function() {

		var criterias = this.config.params.criterias;

		for(var i=0; i<criterias.length; i++) {

			var criteria = criterias[i];
			
			if(criteria.type == this.config.criteriaTypes.select.type && criteria.datasource != null) {

				if(typeof(criteria.datasource) == 'string' && criteria.datasource != '') {

					var ctx = { self: this, criteria: criteria };

					if(criteria.preProcessDS == null || criteria.preProcessDS(ctx)) {

						$.ajax({
							url: criteria.datasource,
							context: ctx,
							method: 'GET',
							dataType: 'json',
							processData: false,
							//contentType: 'application/json; charset=utf-8',
							cache: false,
							success: function(data) {
								
								this.data = data;

								if(this.criteria.postProcessDS != null)
									this.data = this.criteria.postProcessDS(this);
								
								this.criteria.datasourceObj = this.data;

								this.self.renderSelectCriteriaData(this);

								if(this.self.config.debug) console.log(data, this.data);
							},
							error: function(XMLHttpRequest, textStatus, errorThrown) {}
						});
					}
				}
				else if(criteria.options != null && typeof(criteria.options) == 'object')
					criteria.datasourceObj = criteria.options;
			}
		}
	};
	
	this.onChangeofParent = function(e) {

		var criterias = e.data.self.config.params.criterias;

		for(var i=0; i<criterias.length; i++) {

			var criteria = criterias[i];
			var parentValue = $('#'+$(this).attr('id')).val();
			var id ="";
			if($(this).attr('id') =="country")
				id = 'state';
			if(parentValue==null || parentValue==""){
				var html = [];
				$('#state').html('');
				html.push('<option value="">Select</option>');
				$('#state').html(html.join(''));
				$('#region').val("");
			}
			if((criteria.id == id && criteria.datasource != null) && (parentValue!=null && parentValue!="")) {

				if(typeof(criteria.datasource) == 'string' && criteria.datasource != '') {

					var ctx = { self: this, criteria: criteria };

					if(criteria.preProcessDS == null || criteria.preProcessDS(ctx)) {

						$.ajax({
							url: criteria.datasource,
							context: ctx,
							method: 'GET',
							dataType: 'json',
							processData: false,
							//contentType: 'application/json; charset=utf-8',
							cache: false,
							success: function(data) {
																
								this.data = data;

								if(this.criteria.postProcessDS != null)
									this.data = this.criteria.postProcessDS(this);
								
								this.criteria.datasourceObj = this.data;								
									e.data.self.buildChildList(this);

								//if(this.self.config.debug) console.log(data, this.data);								
							},
							error: function(XMLHttpRequest, textStatus, errorThrown) {}
						});
					}
				}
				else if(criteria.options != null && typeof(criteria.options) == 'object')
					criteria.datasourceObj = criteria.options;
			}
		}
	};
	this.search = function() {
		
		var ctx = { self: this };

		if(this.config.preProcessAction(ctx)) {

			$.ajax({
				url: this.config.searchResults,
				data: JSON.stringify(this.config.transformCriteria(ctx)),
				context: ctx,
				method: 'POST',
				dataType: 'json',
				processData: false,
				contentType: 'application/json; charset=utf-8',
				cache: false,
				success: function(data) {
					
					if(this.self.config.debug) console.log(data);

					this.data = data;					

					if(this.self.config.postProcessAction(this)) {

						if(this.self.config.preProcessRender(this)) {
							$('#gritter-notice-wrapper').hide();
							this.self.renderSearchResults(this.self.config.transformSearchResults(this),'search',ctx);
							this.self.config.postProcessRender(this);
							this.self.config.searchResultsObj = this.self.config.transformSearchResults(this);
						}
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					$('#gritter-notice-wrapper').show();
					showErrorMsg(lang.thx_leads_property_search_error);
					this.self.renderSearchResults("",'search',ctx);
				}
			});
		}
	};



	/*
	 * HELPERS
	 */

	this.defaultCriteriaTransformmer = function(ctx) {

		var data = {};
		var criterias = this.config.params.criterias;

		for(var i=0; i<criterias.length; i++) {

			var criteria = criterias[i];

			data[criteria.name || criteria.id] = $('#'+criteria.id).val();
		}

		if(this.config.debug) console.log(data);

		return data;
	};

	this.defaultSearchResultsTransformmer = function(ctx) {

		this.config.searchResultsObj = ctx.data;

		return this.config.searchResultsObj;
	};

	this.getSelectedResults = function() {
		var result = [];
		//return $('#'+this.config.container.container+' div[rel=resultsCntr] input:checked');
		if($('#cartResult').is(':visible')){
			if($("#cartResult").dataTable().fnGetNodes().length> 0){
				 $.each($("#cartResult").dataTable().fnGetNodes(),function(propertyIndex,propertyItem){
					$.each($(propertyItem),function(trIndex,trItem){												
						 if($(trItem).find('input').is(":checked"))
							 result.push($(trItem).find('input'));
					});					 
				 });
			}			
		}if($('#propertySearchResults').is(':visible')){
			if($("#propertySearchResults").dataTable().fnGetNodes().length> 0){
				 $.each($("#propertySearchResults").dataTable().fnGetNodes(),function(propertyIndex,propertyItem){
					$.each($(propertyItem),function(trIndex,trItem){						
						if($(trItem).find('i').attr('class')=='ace-icon fa fa-shopping-cart bigger-160')
							 result.push($(trItem).find('i')[0]);
						 if($(trItem).find('input').is(":checked"))
							 result.push($(trItem).find('input'));
					});					 
				 });
			}			
		}
		return result;
	};



	/*
	 * HTML RENDERERS
	 */

	this.renderCriterias = function() {

		$('#'+this.config.container.container).html(this.buildCriterias(this.config.params.criterias));
	};

	this.renderSelectCriteriaData = function(ctx) {

		var criteria = ctx.criteria;

		criteria.options = ctx.data;

		if(criteria.preProcessRenderDS != null)
			criteria.preProcessRenderDS(ctx);

		$('#'+criteria.id).html(this.buildSelectOptions(criteria));

		if(criteria.postRenderDS != null)
			criteria.postRenderDS(ctx);
	};

	this.renderSearchResults = function(data,action,ctx) {
		var selfObj = "";		
		if(action ==null)
			selfObj = ctx.data.self;
		else
			selfObj = ctx.self;
		var id = selfObj.config.container.propertySearchResults;
		if(action != 'search'){
			id = selfObj.config.container.cartResult;
			action = 'cart';
		}			
		var tbody = [];
		var html=[];
		var searchText = $('#propName').val();
		if(action == "search"){
			$('#searchResultsDiv').show();	
			$('#cartResultsDiv').hide();
		}
		else{
			$('#cartResultsDiv').show();
			$('#searchResultsDiv').hide();	
		}
		if(data.length>0){
			if(action == 'search'){
				html.push('<span>'+data.length+' Search Results for "'+(searchText?searchText:'')+'"</span>');
				$('#recordResults').html(html.join(''));
			}		
			$.each(data,function(index,item){
				var cartItemFound = true;
				for(var cartIndex =0;cartIndex<selfObj.config.container.cartPreoperty.length;cartIndex++){
					if(item[0]==selfObj.config.container.cartPreoperty[cartIndex])
						cartItemFound = false;
					if(!cartItemFound)
						break;
				}
				tbody.push('<tr >');
				tbody.push('<td class="center">');
				if(action != 'search' || cartItemFound)
					tbody.push('<label class="position-relative" id="ctr_'+action+'_'+item[0]+'"><input type="checkbox" name="property" action="'+action+'" class="ace"  propertyId ="'+item[0]+'" propertyName="'+item[1]+'" ><span class="lbl"></span></label>');
				else
					tbody.push('<label class="position-relative" id="ctr_'+action+'_'+item[0]+'"><i name="propertyCart" action="'+action+'" class="ace-icon fa fa-shopping-cart bigger-160"   propertyId ="'+item[0]+'" propertyName="'+item[1]+'" title="Ptoperty Added in the cart"></i></label>');
				tbody.push('</td>');
				tbody.push('<td><a href="javascript:;"  propertyId ="'+item[0]+'">'+item[1]+'</a></td>');
				tbody.push('<td>'+(item[2]||'')+'</td>');
				tbody.push('<td>'+item[3]+'</td>');
				tbody.push('<td>'+item[4]+'</td>');
				tbody.push('<td>'+item[5]+'<i class="fa fa-info-circle bigger-110 blue" data-rel="tooltip" data-placement="bottom" title="Largest Room -  Ballroom: 900.  Over 32,000 sqft. "></i></td>');		
				tbody.push('<td>'+(item[6]||'')+'</td>');
				tbody.push('<td>'+selfObj.renderOptions(data)+'</td>');
				tbody.push('</tr>');
			});		
		}
		var table = $('#'+id);	
		if(selfObj.isDataTable(table[0]))
		{	
			table.dataTable().fnClearTable(false);
			table.dataTable().fnDestroy();
		}
		//appending in tbody		
		$('#'+id+' tbody').html(tbody.join(''));
		table.dataTable({
			bAutoWidth: false,
			"aoColumns": [
			  { "bSortable": false }, null, null, null,null, null, null,{ "bSortable": false }],
			"aaSorting": [],
			"sEmptyTable" :"No data available in table",
			"fnDrawCallback" : function() {
				//popover and toooltip
				$('[data-rel=popover]').popover({html:true});
				 
				 $('input[name="property"][action="search"]:checkbox').unbind('click').bind('click',function(){
					if($('input[name="property"][action="search"]:checkbox:checked').length > 0)
						$("#addCart").removeAttr('disabled');
					else
						$("#addCart").attr('disabled','disabled');
				 });
				 
				 $('input[name="property"][action="cart"]:checkbox').unbind('click').bind('click',function(){
					if($('input[name="property"][action="cart"]:checkbox:checked').length > 0)
							$("#removeCart").removeAttr('disabled');
					else
							$("#removeCart").attr('disabled','disabled');
				 });
			}
		});	
	};


	/*
	 * HTML BUILDERS
	 */

	this.buildCriterias = function(criterias) {
		
		var html = [];

		html.push('<div class="outer_search">');
		html.push('	<p>' + this.config.lang.desc + '</p>');
		html.push('	<div class="row">');
		
		for(var i=0; i<criterias.length; i++) {

			var criteria = criterias[i]
			
			html.push('<div class="' + criteria.classNames + '">');

			if(criteria.type == this.config.criteriaTypes.text.type)
				html.push(this.buildText(criteria));
			else if(criteria.type == this.config.criteriaTypes.select.type)
				html.push(this.buildSelect(criteria));

			html.push('</div>');
		}

		html.push('	</div>');
		html.push(' <div class="space-6"></div>');
		html.push('	<p><button class="btn btn-sm btn-primary" rel="processSearch"><i class="fa fa-search"></i> ' + this.config.lang.btnSearch + ' </button></p>');
		html.push('</div>');
		//html.push('<div rel="resultsCntr"></div>');

		return html.join('');
	};

	this.buildText = function(criteria) {
		
		var html = [];

		if(criteria.label)
			html.push('<label for="' + criteria.id +'"><i class="fa fa-filter"></i> ' + criteria.label + '</label>');
		html.push('<input type="text" class="form-control" id="' + criteria.id +'" name="' + criteria.name +'" placeHolder="' + ((criteria.placeHolder != null) ? criteria.placeHolder : '') + '" />');

		return html.join('');
	};

	this.buildSelect = function(criteria) {
		
		var html = [];

		if(criteria.label)
			html.push('<label for="' + criteria.id +'"><i class="fa fa-filter"></i> ' + criteria.label + '</label>');
		html.push('<select class="form-control" id="' + criteria.id +'" name="' + criteria.name +'">' + this.buildSelectOptions(criteria) + '</select>');

		return html.join('');
	};	
	this.buildSelectOptions = function(criteria) {
		
		var html = [];

		if(criteria.options && criteria.options.length) {

			if(criteria.sorting != null && criteria.sorting == this.config.sortingTypes.ascending)
				criteria.options.sort(function(a, b) { return (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0); });
			else if(criteria.sorting != null && criteria.sorting == this.config.sortingTypes.descending)
				criteria.options.sort(function(a, b) { return (a.label < b.label) ? 1 : ((b.label < a.label) ? -1 : 0); });

			for (var i=0; i<criteria.options.length; i++) {
				
				var option = criteria.options[i]
				if((criteria.id !='space') && i==0)
					html.push('<option value="">Select</option>');
				html.push('<option value="' + option.value + '">' + option.label + '</option>');
			};
		}

		return html.join('');
	};
	
	this.buildChildList = function(ctx) {
		
		var html = [];
		
		if(ctx.data.length>0){
			$('#'+ctx.criteria.id).html('');			
			if($('#country').val() =='US'){
				for (var i=0; i<ctx.data.length; i++) {				
					var option = ctx.data[i]
					if(i == 0)
						html.push('<option value="">Select</option>');
					html.push('<option value="' + option.value + '">' + option.label + '</option>');
					$('#region').val("NAD");
				};
			}
			else{
				html.push('<option value="All">All</option>');
				$('#region').val("");
			}
		}	
		$('#'+ctx.criteria.id).html(html.join(''));
	};

	/* 
	 * EVENTS - The events will call an associated action of this controller.
	 * Containing Object is known as self in these functions.
	 */

	this.searchEvent = function(e) {
		
		e.data.self.search();
	};
	
	this.addToCart = function(e){
		 if($("#propertySearchResults").dataTable().fnGetNodes().length> 0){
			// $('input[name="property"][action="search"]:checkbox:checked').each(function(){
			 $.each($("#propertySearchResults").dataTable().fnGetNodes(),function(index,item){
				 if($(item).find('input').is(":checked")){
					 var propertyId = parseInt($(item).find('input').attr('propertyId'));
					 $.each(e.data.self.config.searchResultsObj,function(index,result){
						    if(propertyId == result[0] && e.data.self.config.container.cartPreoperty.indexOf(propertyId) == -1){
						    	e.data.self.config.container.cartItems.push(result);
						    	e.data.self.config.container.cartPreoperty.push(propertyId);						    	
						    		if($(item).find('label').attr('id')=='ctr_search_'+propertyId)
						    			$(item).find('label').html('<i class="ace-icon fa fa-shopping-cart bigger-160" name ="propertyCart" propertyId ="'+result[0]+'" action="search" propertyName="'+result[1]+'" title="Property Added in the cart"></i>');
						    			//$('#ctr_search_'+propertyId).html('<i class="ace-icon fa fa-shopping-cart bigger-160" title="Property Added in the cart"></i>');
							    	 return false;
						    }
					  });
				 }
			 });
			 $('.itemCount').html(e.data.self.config.container.cartItems.length);
			 $("#addCart").attr('disabled','disabled');
		 }
		 return false;
	};
	this.removeToCart = function(e){
		if($("#cartResult").dataTable().fnGetNodes().length> 0){		 
			$.each($("#cartResult").dataTable().fnGetNodes(),function(index,item){
				 if($(item).find('input').is(":checked")){
				 var propertyId = $(item).find('input').attr('propertyId');
				 $.each(e.data.self.config.container.cartItems,function(cartItemsindex,result){						
					    if(propertyId == result[0]){
					    	e.data.self.config.container.cartPreoperty.splice(index,1);
					    	e.data.self.config.container.cartItems.splice(index,1);
					    	if($(item).find('label').attr('id')=='ctr_cart_'+propertyId){
					    		if($("#propertySearchResults").dataTable().fnGetNodes().length> 0){
					    			 $.each($("#propertySearchResults").dataTable().fnGetNodes(),function(propertyindex,property){
					    				 if($(property).find('label').attr('id')=='ctr_search_'+propertyId)
					    					 $(property).find('label').html('<input type="checkbox" name="property" class="ace"  propertyId ="'+result[0]+'" action="search" propertyName="'+result[1]+'" ><span class="lbl"></span>');					    					 
					    			 });					    			
					    			return false;
					    		}
					    	}
					   }
				  });
				 e.data.self.renderSearchResults(e.data.self.config.container.cartItems,null,e);
				 }
			 });
			 $('.itemCount').html(e.data.self.config.container.cartItems.length);
			 $("#removeCart").attr('disabled','disabled');
		 }
		 return false;
	};
	this.isDataTable = function(nTable){
	    var settings = $.fn.dataTableSettings;
	    for (var i=0, iLen=settings.length; i<iLen; i++)
	    {
	        if ( settings[i].nTable == nTable )
	        {
	            return true;
	        }
	    }
	    return false;
	};
	this.renderOptions = function(data){
		var html = [];
		 html.push('<div class="btn-group">');
		 html.push('<button data-toggle="dropdown" name="propertyOptions" class="btn btn-xs btn-primary dropdown-toggle">');
		 html.push('Options');
		 html.push('<i class="ace-icon fa fa-angle-down icon-on-right"></i>');
		 html.push('</button>');
		 html.push('<ul class="dropdown-menu dropdown-primary dropdown-menu-right">');
		 html.push('<li>');
		 html.push('<a href="#">View</a>');
		 html.push('</li>');
		 html.push('<li>');
		 html.push('<a href="#">Floor Plans &amp; Capacity Charts</a>');
		 html.push('</li>');
		 html.push('<li>');
		 html.push('<a href="#">Comments</a>');
		 html.push('</li>');
		 html.push('<li>');
		 html.push('<a href="#">Favorite</a>');
		 html.push('</li>');
		 html.push('<li>');
		 html.push('<a href="#">History</a>');
		 html.push('</li>');
		 html.push('</ul>');
		 html.push('</div>');
		return html.join('');
	};
	this.showCart = function(e){
		 $("#searchResultsDiv").hide(); 
		 $("#cartResultsDiv").show(); 
		 e.data.self.renderSearchResults(e.data.self.config.container.cartItems,null,e);
		 return false;
	};
	this.backToSearchButton = function(e){
		 $("#searchResultsDiv").show(); 
		 $("#cartResultsDiv").hide(); 
		 return false;
	};
	this.searchProperty = function(e){
		if(e.which == 13) {
			e.data.self.search();
	    }
	}
};
