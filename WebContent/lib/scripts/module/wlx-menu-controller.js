//var MENUCTRL = null;
var MenuController = function(config) {

	this.config = {
	};
	
	this.init = function() {

		$.extend(true, this.config, config);
		
		return this;
	};
	
	this.render = function() {
		
		this.renderBreadcrumbs(this.config.breadcrumbs, false);
		
		return this;
	};
	
	this.updateSelectedMenuItem = function(menuId) {
		if(menuId)
			this.setActiveMenuItem($('#' + menuId));
	}
	
	this.setActiveMenuItem = function(elem){
		//set active class to whatever is clicked
	    $('ul.nav-list li').removeClass('active');
	    elem.closest('li').addClass('active');
	    if(elem.closest('ul').hasClass('submenu'))
	    	elem.closest('ul').parent().addClass('active');
	};
}