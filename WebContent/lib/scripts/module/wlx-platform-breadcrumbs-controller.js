var BreadcrumbsController = function(config) {
	
	this.config = {
		debug: false,
		container: 'page-header',
		breadcrumbs: []
	};
	
	this.init = function() {

		$.extend(true, this.config, config);
		
		return this;
	};
	
	this.render = function() {
		
		this.renderBreadcrumbs(this.config.breadcrumbs, false);
		
		return this;
	};



	/*
	 * HTML RENDERERS
	 */
	
	this.renderBreadcrumbs = function(breadcrumbs, updatePageTitle, appendBack) {
		
		$('#'+this.config.container).html(this.buildBreadcrumbs(breadcrumbs, appendBack));
		
		if(updatePageTitle)
			$(document).attr('title', $('#'+this.config.container).find('[breadcrumb]:last').text());
		
		return this;
	};
	
	this.renderBreadcrumb = function(breadcrumb, append, updatePageTitle, appendBack) {

		var breadcrumbs = $('#'+this.config.container).find('[breadcrumb]');
		var index = 0;
		
		if(append)
			index = breadcrumbs.length;
		
		this.renderBreadcrumbAt(breadcrumb, index, updatePageTitle, appendBack);
	};
	
	this.renderBreadcrumbAt = function(breadcrumb, index, updatePageTitle, appendBack) {
		
		var breadcrumbs = $('#'+this.config.container).find('[breadcrumb]');
		var breadcrumbLabel = '';
		var breadcrumbUrl = '';

		if(breadcrumb.label != null)
			breadcrumbLabel = breadcrumb.label;
		else if(typeof $(breadcrumb).text == 'function')
			breadcrumbLabel = $(breadcrumb).text();
		
		if(breadcrumb.role != null)
			breadcrumbUrl = breadcrumb.role;
		else if(typeof $(breadcrumb).attr == 'function')
			breadcrumbUrl = $(breadcrumb).attr('href');
		else
			breadcrumbUrl = '#';
		
		for(var i=index; i<breadcrumbs.length; i++) {
			
			breadcrumbs[i].remove();
		}
		
		if(breadcrumbLabel != '') {
			
			var preUrl = "";
			if(appendBack)
				preUrl = '<i class="fa fa-arrow-circle-o-left bigger-120" onclick="PLATCTRL.goBack();"></i>&nbsp;';
			
			if(index == 0) {
				if(breadcrumbUrl)
					$('#'+this.config.container).html('<h1>' + preUrl + '<a href="' + breadcrumbUrl + '" rel="pagetitle" breadcrumb="' + index + '">' + breadcrumbLabel + '</a></h1>');
				else
					$('#'+this.config.container).html('<h1>' + preUrl + breadcrumbLabel + '</h1>');
			} else
				$('#'+this.config.container).find('h1').append('<small breadcrumb="' + index + '"><i class="ace-icon fa fa-angle-double-right"></i> <a href="' + breadcrumbUrl + '" rel="subtitle">' + breadcrumbLabel + '</a></small>');
			
			if(updatePageTitle)
				$(document).attr('title', breadcrumbLabel);
		}
		
		return this;
	};



	/*
	 * HTML BUILDERS
	 */
	
	this.buildBreadcrumbs = function(breadcrumbs, appendBack) {
		
		var html = [];
		
		if(breadcrumbs != null) {
			
			html.push('<h1>');
			
			for(var i=0; i<breadcrumbs.length; i++) {
				
				var breadcrumb = breadcrumbs[i];
				var breadcrumbLabel = '';
				var breadcrumbUrl = '';

				if(breadcrumb.label != null)
					breadcrumbLabel = breadcrumb.label;
				else if(typeof $(breadcrumb).text == 'function')
					breadcrumbLabel = $(breadcrumb).text();
				
				if(breadcrumb.role != null)
					breadcrumbUrl = breadcrumb.role;
				else if(typeof $(breadcrumb).attr == 'function')
					breadcrumbUrl = $(breadcrumb).attr('href');
				else
					breadcrumbUrl = '#';
				
				if(breadcrumbLabel != '') {
					
					var preUrl = "";
					if(appendBack)
						preUrl = '<i class="fa fa-arrow-circle-o-left bigger-120" onclick="PLATCTRL.goBack();"></i>&nbsp;';
					
					if(i == 0) {
						if(breadcrumbUrl)
							html.push(preUrl + '<a href="' + breadcrumbUrl + '" rel="pagetitle" breadcrumb="' + i + '">' + breadcrumbLabel + '</a>');
						else
							html.push(preUrl + breadcrumbLabel + '</a>');
					} else
						html.push('<small breadcrumb="' + i + '"><i class="ace-icon fa fa-angle-double-right"></i> <a href="' + breadcrumbUrl + '" rel="subtitle">' + breadcrumbLabel + '</a></small>');
				}
			}
			
			html.push('</h1>');
		}
		
		return html.join('');
	};
};