//# sourceURL=wlx-menuController.js
var MenuController = function(config) {
	
	this.config = {
		debug: false,
		menuCntr: 'nav-list',
		selectedItemCode: "HOME",
		hideItems: [],
		contextRoot: "cloud",
		urls: {},
		lang: {}
	};
	
	this.init = function() {
		
		$.extend(true, this.config, config);

		// attach listeners
		$(document).off("click", "#"+this.config.menuCntr + " a").on("click", "#"+this.config.menuCntr + " a", { self: this }, function(e) {

			var elem = $(this);
			var actionType = elem.attr('actionType');
			var action = elem.attr('action');
			var moduleCode = elem.attr('moduleCd');
			
			e.data.self.navigateTo(actionType, action, moduleCode, e);
		});
		
		return this;
	};
	
	this.render = function() {

		if(this.config.menu.items)
			this.renderMenu(this.config.menu.items);
		
		return this;
	};
	
	this.renderMenu = function(items) {

		$('#'+this.config.menuCntr).append(this.buildMenu(items));
		var activeMenu = this.getActiveMenuItem(items,this.config.selectedItemCode);
		this.setActiveMenuItem($('#'+this.config.menuCntr).find('[menuItemCd=' + activeMenu + ']').parent());
	};
	
	this.splitTheString = function(inputStr) {
		var returnStr = "";
	    if (inputStr != null) {
	        var SplitChars = ',';
	        if (inputStr.indexOf(SplitChars) >= 0) {
	            var DtlStr = inputStr.split(SplitChars);
	            returnStr = DtlStr;	            
	        }
	    }
	    return returnStr;
	}
	
	this.getActiveMenuItem = function(menuItems,selectedMenuItems) {
		var returnSelectedMenu = "";
		var subMenus = this.splitTheString(selectedMenuItems);
				
		if(subMenus == ""){
			returnSelectedMenu = selectedMenuItems; 
		}else{
			for(var i=0;i<subMenus.length;i++) {
	        	var returnStr = subMenus[i];
	        	$(menuItems).each(function(index, item) {				
					if(item.children && item.children.length) {
						$(item.children).each(function(childIndex,childItem) {
							if(returnStr == childItem.code)
								returnSelectedMenu = returnStr; 
						});	 
					}		
				});
			}
		}
		return returnSelectedMenu;
	}
	
	this.buildMenu = function(items) {

		var html = [];
		
		for(var i=0; i<items.length; i++) {
			
			var item = items[i];
			
			if($.inArray(item.code, this.config.hideItems) < 0) {
				
				var hasChildren = item.children && item.children.length;
				
				html.push(this.buildMenuItem(item, hasChildren));
				
				if(item.children && item.children.length) {
	
					html.push('<ul class="submenu">');
					html.push(this.buildMenu(item.children));
					html.push('</ul>');
					
					if(item.children && item.children.length)
						html.push('</li>');
				}
			}
		}
		
		return html.join('');
	};
	
	this.buildMenuItem = function(item, hasChildren) {

		var html = [];
		var classes = [];
		var action = "#";
		var target = "";

		if(hasChildren) // if item has children / submenu, add hsub class
			classes.push("hsub");
		
		if(item.action) {
			
			if(item.actionType == 'PLATFORM' || item.actionType == 'MODULE')
				action = this.config.contextRoot + item.action;
			else if(item.actionType == 'JAVASCRIPT')
				action = 'JAVASCRIPT:' + item.action;
			else
				action = item.action;
			
			if(item.actionType == 'EXTERNAL')
				target = ' target="_BLANK"';
		}
		
		html.push('<li' + ((classes.length) ? ' class="' + classes.join(' ') + '"' : '') + '>');
		html.push('	<a href="' + action + '"' + target + ((hasChildren) ? ' class="dropdown-toggle"' : '') + ' actionType="' + item.actionType + '" moduleCd="' + item.moduleCd + '" menuItemId="' + item.id + '" menuItemCd="' + item.code + '">');
		html.push('		<i class="menu-icon fa ' + item.icon + '"></i>');
		//if(!hasChildren)
		//	html.push('	<i class="menu-icon fa fa-caret-right"></i>')
		html.push('		<span class="menu-text">' + item.name + '</span>');

		if(hasChildren)
			html.push('<b class="arrow fa fa-angle-down"></b></a>');
		else
			html.push('</a></li>');
		
		return html.join('');
	};
	
	this.navigateTo = function (actionType, action, moduleCode, e) {
		
		if(this.config.debug) console.log(actionType, action, moduleCode);
		
		if(actionType == 'MODULE') {
			
			e.preventDefault();
			
			if(typeof PLATCTRL != 'undefined')
				PLATCTRL.loadModuleContent(moduleCode, action, true); //relative URL
		}
	};
	
	this.updateSelectedMenuItem = function(menuId) {
		
		if(menuId)
			this.setActiveMenuItem($('#' + menuId));
	};
	
	this.setActiveMenuItem = function(elem) {
		
		//set active class to whatever is clicked
		$('ul.nav-list li').removeClass('active');
		elem.closest('li').addClass('active')//.find('a').prepend('<i class="menu-icon fa fa-caret-right"></i>');
		
		elem.parents('ul.submenu').each(function(index, item) {
			
			var $item = $(item);
			
			//$item.children("li.active").children("a").prepend('<i class="menu-icon fa fa-caret-right"></i>');
			$item.parent().addClass('active open');
		});
		
		/*if(elem.closest('ul').hasClass('submenu'))
			elem.closest('ul').parent().addClass('active open');*/
	};
};