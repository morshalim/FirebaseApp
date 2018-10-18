var ModuleMetadataController = function(config) {

	this.metaData = {}; // moduleCd -> metaDataObj
	this.tokens = {}; // moduleCd -> token
	
	this.config = {
		debug: false,
		urls: {
			menuData: '/platform/int/rest/nav/user',
			metaData: '/platform/int/rest/module/endpoint/all',
			tokenPre: '/platform/int/rest/module/token?module='
		},
		lang: {}
	};
	
	this.init = function() {

		$.extend(true, this.config, config);
		
		return this;
	};
	
	this.render = function() {
		
		//load metaData 
		this.loadAll();
		
		return this;
	};



	/*
	 * HELPERS
	 */
	
	this.loadAll = function(moduleCd, callback, callbackParams) {
		
		//get all metadata
		$.ajax( {
			url: this.config.urls.metaData,
			self: this,
			type: "GET",
			success: function (response) {
				
				//turn arr to obj
				for (var i = 0, len = response.length; i < len; i++) {
					
					var obj = response[i];
					
					this.self.metaData[obj.moduleCode] = obj;
				};
				
				if(callback && callbackParams)
					callback.apply(this.self, callbackParams);
				else if(callback)
					callback();
			},
			error: function (response) {
				
				//console.log("an error occurred loading the content " + response);
			},
			complete: function (response) {
				
				//console.log("the response is complete");
			}
		});
	};
	
	this.authorize = function (moduleCd, callback, callbackParams) {
		
		// find the metadata in metaData for the given moduleCd to obtain URL for token
		var metadata = this.metaData[moduleCd];
		var tokenUrl = this.config.urls.tokenPre + metadata.moduleCode;
		
		// make an AJAX call to obtain the token
		return $.ajax({
			url: tokenUrl,
			self: this,
			type: "GET",
			moduleCd: moduleCd,
			success: function (response) {
				
				// if token was null before and after, authRequired = false
				if(!this.self.tokens[moduleCd] && !response && callbackParams)
					callbackParams[2] = false;	
				
				// store the token in the tokens hash
				this.self.tokens[moduleCd] = response;
				
				if(response == "NA" || response == "ERROR")
					this.self.config.platform.alert("Oops! We are currently experiencing an issue getting you authorized. Please try again later. Please contact your system administrator, if this issue continues to persist. (100)");
				
				if(callback && callbackParams)
					callback.apply(this.self.config.platform, callbackParams);
				else if (callback)
					callback();
				//console.log(this.self.tokens[moduleCd])
			},
			error: function (response) {
				
				this.self.config.platform.alert("Oops! We are currently experiencing an issue getting you authorized. Please try again later. Please contact your system administrator, if this issue continues to persist. (000)");
			},
			complete: function (response) {
				
				//console.log("the response is complete");
			}
		});
		
		//return token;
	};
	
	this.find = function (moduleCd, moduleUrl, includesWord) {
		
		if (moduleCd != null) {
			
			// find the metaDataObj in metaData; return it or null if not found
			return this.metaData[moduleCd];
		}
		else {
			
			var metaDataObj = null;
			var contextRoot = null;
			
			// find the context root in url (could be absolute)
			if(moduleUrl.indexOf('/') === 0)
				contextRoot = moduleUrl.split('/')[1];
			else
				contextRoot = moduleUrl.split('/')[0];
			
			// for each metaDataObj in metaData -> check to see if metaDataObj.contextroot = context root
			for(var key in this.metaData) {
				
				//if yes - return it
				if(this.metaData[key].contextRoot == contextRoot)
					return this.metaData[key];
			}	
			
			//backup searches - relTokenURL, relDefaultURL?
			return metaDataObj;
		}
	}
}