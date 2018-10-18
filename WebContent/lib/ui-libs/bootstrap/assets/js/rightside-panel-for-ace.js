//# sourceURL=rightside-panel-for-ace.js
var RightSidePanelForAceController = function(config) {
	this.lastElemClicked = null;
	this.cacheByUrl = {};
	this.config = {
			sidePanelRightCloseBtnId: 'sidePanelRightClose',
			panelParent: '#main-container div.main-content'
		};
	this.init = function() {
		$.extend(true, this.config, config);
		$(document).off(ace.click_event, '#'+this.config.sidePanelRightCloseBtnId).on(ace.click_event, '#'+this.config.sidePanelRightCloseBtnId, {self: this}, this.sidePanelRightCloseBtnClick);
		this.initSidePanelRight(true);
		return this;
	};
			
	this.render = function() {
		return this;
	};
	
	this.initSidePanelRight = function(init){
		if(init && $(this.config.panelParent + ' #sidePanelRight').length)
			$(this.config.panelParent + ' #sidePanelRight').remove();
		
		//check if panel object exists
		if(!$(this.config.panelParent + ' #sidePanelRight').length)
		{
			var html = [];
			html.push('<div id="sidePanelRight">');
			html.push('<div id="sidePanelRightCtnr">');
			html.push('<div><button type="button" id="sidePanelRightClose" class="close"><i class="ace-icon fa fa-times"></i></button></div>');	
			html.push('<div id="sidePanelRightLoading"></div>');
			html.push('<div id="sidePanelRightContent">');
			html.push('</div></div></div>');
			html = html.join('');
			$(this.config.panelParent).prepend(html);
		}	
	};
	
	this.isSidePanelRightOpen = function(){
		var on = true;
		if(!$("#sidePanelRight").hasClass("toggled"))
			on = false;
		return on;
	};
	
	this.togglePanel = function()
	{
		if(this.isSidePanelRightOpen())
			this.closeSidePanelRight();
		else
			this.openSidePanelRight();
	};
	
	this.toggleNavBarStyle = function(elem){
		$('ul.ace-nav a.sidePanelRightToggled').removeClass('sidePanelRightToggled');
		if(elem.is('ul.ace-nav a'))
		{
			//navbar color
			if(this.isSidePanelRightOpen())
				elem.addClass('sidePanelRightToggled');
			else
				elem.removeClass('sidePanelRightToggled');
		}
	};
	
	this.openSidePanelRight = function(){
		if(!$("#sidePanelRight").hasClass("toggled"))
			$("#sidePanelRight").addClass("toggled");
	};
	
	this.closeSidePanelRight = function(){
		if($("#sidePanelRight").hasClass("toggled"))
			$("#sidePanelRight").removeClass("toggled");
		
		//clear
		$('#sidePanelRightContent').html('');
		
		$('ul.ace-nav a.sidePanelRightToggled').removeClass('sidePanelRightToggled');
		
		$("#sidePanelRight").removeAttr('style');
		$("#sidePanelRight #sidePanelRightCtnr").removeAttr('style');
		
		this.lastElemClicked = null;
	};
	
	this.renderSidePanelRight = function(config){
		this.initSidePanelRight();
		$('#sidePanelRightLoading').show();
		if(config && !config.dontCloseOnReClick && config.elem && this.lastElemClicked && this.lastElemClicked.is(config.elem) && this.isSidePanelRightOpen())
		{
			this.closeSidePanelRight();
			return;
		}
		
		if(config.urls && config.urls.getData && !this.cacheByUrl[config.urls.getData])
		{
			this.loadData(config);
		}
		else if(this.cacheByUrl[config.urls.getData])
		{
			if(config.transformData)
				this.fillSidePanelRight(config.transformData(this, this.cacheByUrl[config.urls.getData]));
			else
				this.fillSidePanelRight(this.cacheByUrl[config.urls.getData]);
			if(config.callback)
				config.callback();
		}	
		else if(config.content)
		{	
			var content = [{title: config.title ? config.title : null, body: config.content ? config.content : null}];
			this.fillSidePanelRight(content);
			if(config.callback)
				config.callback();
		}
		
		$("#sidePanelRight").removeAttr('style');
		$("#sidePanelRight #sidePanelRightCtnr").removeAttr('style');
		if(config.width)
		{
			$('#sidePanelRight').width(config.width);
			$("#sidePanelRight #sidePanelRightCtnr").css('width', config.width);
		}	
		
		this.openSidePanelRight();
		
		if(config && config.elem)
		{
			this.toggleNavBarStyle(config.elem)
			this.lastElemClicked = config.elem;
		}
	};
	
	this.fillSidePanelRight = function(data){
		var content = [];
		for(var i = 0; i < data.length; i++)
		{
			if(data[i].title)
				content.push('<h3>'+data[i].title+'</h3>');
			if(data[i].body)
				content.push('<span>'+data[i].body+'</span>');
		}	
		content.join('');
		//setTimeout(function(){ 
			$('#sidePanelRightContent').html(content); 
			$('#sidePanelRightLoading').hide();
		//}, 3000);
	};
	
	/** EVENTS **/
	
	// Events
	this.loadData = function(config) {
		var sUrl = '';
		if(config.urls.getData != null && typeof config.urls.getData == 'function')
			sUrl = config.urls.getData(config, this);
		else
			sUrl = config.urls.getData;
		if(config.debug) console.log(sUrl);
		
			if(config.ajaxCall)
			{
				config.ajaxCall(sUrl, null, this, "GET", function(data){
					this.cacheByUrl[sUrl] = data;
					if(config.transformData)
						this.fillSidePanelRight(config.transformData(this, data));
					else
						this.fillSidePanelRight(data);
					if(config.callback)
						config.callback();
				}, function() {});
			}	
			else
			{
				$.ajax({
					url: sUrl,
					urlCache: sUrl,
					self: this,
					method: 'GET',
					dataType: 'json',
					cache: false,
					global: false,
					success: function(data){
						this.self.cacheByUrl[this.urlCache] = data;
						if(config.transformData)
							this.self.fillSidePanelRight(config.transformData(this.self, data));
						else
							this.self.fillSidePanelRight(data);
						if(config.callback)
							config.callback();
					},
					error: function() {}
				});
			}
	};
	
	this.sidePanelRightCloseBtnClick = function(event){
		var self = event.data.self;
		self.closeSidePanelRight();
	};
};