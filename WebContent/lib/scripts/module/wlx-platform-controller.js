/*var PLATCTRL = null;

$(document).ready(function() {
	
	PLATCTRL = new PlatformController({}).init().render();
	PLATCTRL.applyModuleContentHandlers();
});
*/
var PlatformController = function(config) {
	this.promises = [];
	this.loadedScripts = [];
	this.isReady = true;
	this.readyFunc = [];
	this.moduleMetadata = null;

	this.latestModuleContentURL = [];
	
	this.config = {
		debug: false,
		urls: {},
		lang: {}
	};
	
	this.init = function() {

		$.extend(true, this.config, config);
		
		this.moduleMetadata = new ModuleMetadataController({ platform: this }).init().render();
		
		return this;
	};
	
	this.render = function() {
		
		this.moduleMetadata.render();
		
		return this;
	};



	/*
	 * HELPERS
	 */
	
	this.alert = function(message) {
		if(bootbox)
			bootbox.dialog({
				message: '<h3 class="red"><i class="fa fa-exclamation-triangle"></i> ' + message + '</h3>',
				buttons:			
				{
					success: {
						label: "Ok",
						className: "btn-default",
						callback: function() {
	
						}
					}											
				}
			});
		else
			alert(message);
	}
	
	this.errorContent = function() {
		
		this.alert('Oops! We are currently experiencing an issue getting that functionality. Please try again later. Please contact your system administrator, if this issue continues to persist. (200)');
	};

	this.loadPageContent = function(content) {
		
		$('#page-content-area').html(content);
	};

	this.loadModuleContent = function(moduleCd, ajaxUrl, authRequired, skipHistory) {
				
		// 1. get module metadata
		var metadata = this.moduleMetadata.metaData[moduleCd];
			
		// 2. ensure metadata is present
		if (!metadata || metadata == null) {
			
			alert('meta data empty');
			return $.Deferred().reject();
		}
		
		// 3. check to see if you have a token for the module
		/*if(authRequired && (!this.moduleMetadata.tokens || !this.moduleMetadata.tokens[metadata.moduleCode] || this.moduleMetadata.tokens[metadata.moduleCode] == null)) {
			
			var callbackParams = [moduleCd, ajaxUrl, authRequired];
			
			this.moduleMetadata.authorize(metadata.moduleCode, this.loadModuleContent, callbackParams);
			
			return;
		}*/
		
		// 4. Build an absolute URL
		var url = metadata.domainNameURL + ajaxUrl;
		
		if(!skipHistory)
			this.latestModuleContentURL.push({url:url, moduleCd:moduleCd, ajaxUrl:ajaxUrl, authRequired:authRequired});
		// 5. Build an AJAX request to the given url
		var request = new ModuleRequestController({ action: url }).init();
		
		//moduleCd, params, onSuccess, onError, authRequired
		var ovrdParams = {};
		ovrdParams.dataType = 'text';
		ovrdParams.contentType = "application/json";
		return request.post(moduleCd, ovrdParams, this.loadPageContent, this.errorContent, authRequired) // be sure to pass success/error handler
	};

	this.getLatestModuleContentURL = function() {
		return this.latestModuleContentURL[this.latestModuleContentURL.length-1].url;
	}

	this.goBack = function(index) {
		
		var backupModuleContent = $.extend(true, [], this.latestModuleContentURL);
		
		if(index != null && index < this.latestModuleContentURL.length) {
			
			while(index < this.latestModuleContentURL.length-1) {

				this.latestModuleContentURL.pop();
			}
		}
		else
			this.latestModuleContentURL.pop();
		
		var req = this.latestModuleContentURL[this.latestModuleContentURL.length - 1];
		var url = req.ajaxUrl;
		
		var p = this.loadModuleContent(req.moduleCd, req.ajaxUrl, req.authRequired, true);
		var self = this;
		$.when(p).fail(function() {
			self.latestModuleContentURL = backupModuleContent;
		})
		
	}
	
	this.loadFormContent = function(formElem, moduleCd, authRequired, removeAfter) {

		// iterate over the <inputs> - build a JSON array
		var inputs = formElem.find('input');
		var data = {};
		inputs.each(function(index) {
			
			if($(this).attr('name'))
				data[$(this).attr('name')] = $(this).val();
		});

		// action/href = formName.action
		var url = formElem.attr('action');
		
		//get module metadata
		/*var metadata = this.moduleMetadata.metaData[moduleCd];
		
		// token logic - make sure token present
		if(authRequired && (!this.moduleMetadata.tokens || !this.moduleMetadata.tokens[metadata.moduleCode] || this.moduleMetadata.tokens[metadata.moduleCode] == null)) {
			
			var callbackParams = [moduleCd, ajaxUrl, authRequired];
			
			this.moduleMetadata.authorize(metadata.moduleCode, this.loadFormContent, callbackParams);
			
			return;
		}*/

		var request = new ModuleRequestController({ action: url }).init();
		
		//moduleCd, params, onSuccess, onError, authRequired
		var ovrdParams = {};
		ovrdParams.dataType = 'text'; //other json
		ovrdParams.contentType = "application/x-www-form-urlencoded; charset=UTF-8";
		ovrdParams.data = data;
		
		request.post(moduleCd, ovrdParams, this.loadPageContent, this.errorContent, authRequired) // be sure to pass success/error handler
		
		//remove dyna form if wanted
		if(removeAfter)
			formElem.remove();
	};

	this.loadAndDelegate = function(moduleCd, ajaxUrl, authRequired, successHandler, failureHandler, data, contentType) {
	    
	    // 1. get module metadata
	    var metadata = this.moduleMetadata.metaData[moduleCd];
	        
	    // 2. ensure metadata is present
	    if (!metadata || metadata == null) {
	        alert('meta data empty');
	        return $.Deferred().reject();
	    }
	    
	    // 3. check to see if you have a token for the module
	    /*if(authRequired && (!this.moduleMetadata.tokens || !this.moduleMetadata.tokens[metadata.moduleCode] || this.moduleMetadata.tokens[metadata.moduleCode] == null)) {
	    	
	        var callbackParams = [moduleCd, ajaxUrl, authRequired];
	        
	        this.moduleMetadata.authorize(metadata.moduleCode, this.loadModuleContent, callbackParams);
	        
	        return;
	    }*/
	    
	    // 4. Build an absolute URL
	    var url = metadata.domainNameURL + ajaxUrl;

	    // 5. Build an AJAX request to the given url
	    var request = new ModuleRequestController({ action: url }).init();
	    
	    //moduleCd, params, onSuccess, onError, authRequired
	    var ovrdParams = {};
	    ovrdParams.dataType = 'json';
	    if(contentType != null)
	    	ovrdParams.contentType = contentType;
	    else
	    	ovrdParams.contentType = "application/json";
	    ovrdParams.accept = "application/json";
	    ovrdParams.data = data;
	    
	    return request.post(moduleCd, ovrdParams, successHandler, failureHandler, authRequired) // be sure to pass success/error handler
	};

	this.applyModuleContentHandlers = function() {
				
		$(document).on('click', '#page-content-area a:not([standard])', { self: this }, function(event) {
			
			var elem = $(this);
		    var href = elem.attr('href');
		    var moduleCd = null; 
		    
		    if(!moduleCd) {
		    	
		    	var metaDatObj = event.data.self.moduleMetadata.find(null, href);
		    	
		    	if(metaDatObj)
		    		moduleCd = metaDatObj.moduleCode;
		    }
	    	
		    //if moduleCd found, load module
		    if(moduleCd) {
		    	
		    	event.preventDefault();
		    	event.data.self.loadModuleContent(moduleCd, href, true);
		    }
		    
		    //if(!elem.attr('href') || elem.attr('href').indexOf('javascript') >= 0 || elem.attr('onClick'))
		    //	return;
		  });
		
		$(document).on('submit', '#page-content-area form:not([standard])', { self: this }, function(event) {
			
			event.preventDefault();
			
			var formElem = $(this);
		    var href = formElem.attr('action');
		    
		    var moduleCd = null;
		   
		    if(!moduleCd) {
		    	
		    	var metaDatObj = event.data.self.moduleMetadata.find(null, href);
		    	
		    	if(metaDatObj)
		    		moduleCd = metaDatObj.moduleCode;
		    }
		    
	    	//relative URL
		    if(moduleCd)
		    	event.data.self.loadFormContent(formElem, moduleCd, true);
		});
		
		
		//downloading files with token attached
		//need "dlfwtoken" and "tkey" attrs on a tag

		$(document).off("click", "a[dlfwtoken]").on("click", "a[dlfwtoken]", {self: this }, function(e) {
			e.preventDefault();
		    var url = $(this).attr('href');
		    var tokenKey = $(this).attr('tkey');
		    //var w = window.open(url);
		    e.data.self.forceGetLatestToken(function(){
		    	$('body').append('<a standard download target="_blank "id="tempDynaLink" href="'+url + ((url.indexOf("?") != -1) ? '&' : '?') + 'access_token=' + PLATCTRL.moduleMetadata.tokens[tokenKey]+'">&nbsp;</a>');
		    	$('#tempDynaLink')[0].click();
		    	$('#tempDynaLink').remove()
		       // w.location = url + ((url.indexOf("?") != -1) ? '&' : '?') + 'access_token=' + PLATCTRL.moduleMetadata.tokens[tokenKey];    
		    }, tokenKey);
		});
		
		//downloading files with token attached via window.open
		//need "openfwtoken" and "tkey" attrs on a tag

		$(document).off("click", "a[openfwtoken]").on("click", "a[openfwtoken]", {self: this }, function(e) {
			e.preventDefault();
		    var url = $(this).attr('href');
		    var tokenKey = $(this).attr('tkey');
		    //var w = window.open(url);
		    e.data.self.forceGetLatestToken(function(){
		    	window.open(url + ((url.indexOf("?") != -1) ? '&' : '?') + 'access_token=' + PLATCTRL.moduleMetadata.tokens[tokenKey]);   
		    }, tokenKey);
		});
	};
	
	
	

	this.resetPromises = function() {
		this.promises = null;
		this.promises = [];
	};
	
	this.callReadyFuncs = function(reset) {
		$.each(this.readyFunc, function(index, item) {
			item();
		})
		
		if(reset)
			this.readyFunc = [];
			
	}
	
	this.whenPromises = function() {
		var self = this;
		$.when.apply($, this.promises ).done(function (  ) {
			//$.holdReady(false);
			self.isReady = true;
			if(self.readyFunc != null) 
				self.callReadyFuncs(true);
		});
	};
	
	this.ready = function(func) {
		if(this.isReady) {
			func();
		} else
			this.readyFunc.push(func);
	}
	//forceload = true -> localJS
	//forceload = false -> lazyjs
	this.loadScript = function(url, type, charset, forceLoad) {
		console.log("Requesting script: " + url)
	    
	    if (url) {
	    	
	        var script = $.grep(this.loadedScripts, function(item, index) {
	        	return item === url;
	        });//document.querySelector("script[src*='"+url+"']");
	        
	        if (!script.length || forceLoad) {
	        
	        	this.isReady = false;
	        	var self = this;
	        	var p = $.getScript(url).done(function(script, textstatus){
	        		console.log("Loaded: " + url)
	        		self.loadedScripts.push(url);
	        	}).fail(function(){
	        		console.error("Error while trying to load: " + url + ". Verify source")
	        	});
	        	
	        	this.promises.push(p)

	        } else {
	        	console.log("Did not load url (cached): " + url)
	        }
	        
	        return null;
	    }
	};
	
	this.forceGetLatestToken = function(callback, tokenKey){
		//assume PLATCTRL is always the name
	    var p = PLATCTRL.moduleMetadata.authorize(tokenKey);
	    $.when(p).done(function (){
	        callback();
	    });
	};
}