var ModuleRequestController = function(config) {
	
	this.config = {
		debug: false,
		action: null,
		lang: {}
	};
	
	this.init = function() {

		$.extend(true, this.config, config);
		
		return this;
	};
	
	this.render = function() {
		
		return this;
	};



	/*
	 * HELPERS
	 */
	
	this.post = function(moduleCd, params, onSuccess, onError, authRequired, lastChance) {
		
		var pajax = $.Deferred();
		var ptoken;
		// 3. check to see if you have a token for the module
		if(authRequired && (!PLATCTRL.moduleMetadata.tokens || !PLATCTRL.moduleMetadata.tokens[moduleCd] || PLATCTRL.moduleMetadata.tokens[moduleCd] == null)) {
			ptoken = PLATCTRL.moduleMetadata.authorize(moduleCd);
		} else {
			ptoken = $.Deferred().resolve();
		}
		var mrq = this;
		$.when(ptoken).done(function() {
			// we need to set the type to either HTML or JSON - probably should take in a type parameter
			var dataType = params.dataType;
			var data = params.data;
			var contentType = params.contentType;
			
			// set the authroization bearer token in the header to the token for the module (if authRequired == true)
			//		xhr.setRequestHeader('Authorization','Bearer ' + PLATCTRL.moduleMetadata.token[moduleCd]);
			// how do we handle params (should be a map)?
			//		JSON - stringify it?
			//		HTML - stringify it?
			// perform the AJAX call
			
			pajax = $.ajax({
	            url: mrq.config.action,
				self: mrq,
	            dataType: dataType,
	            data: data,
	            cache: false,
	            contentType: contentType,//"application/json",
	            type: "POST",
	            success: function(result) {
	            	
	                if (onSuccess)
	                    onSuccess(result);
	            },
	            error: function(xhr, ajaxOptions, thrownError) {
	            	           	
	                if (xhr.status === 401 && !lastChance) {
	                	if ((typeof authRequired === 'undefined') || (authRequired == true)) {
	                		PLATCTRL.moduleMetadata.tokens[moduleCd] = null;
	                       	this.self.post(moduleCd, params, onSuccess, onError, authRequired, true);
	                    } else {
	                        if (onError) {
	                            onError();
	                        }
	                    }
	
	                }
	                else {
	                    console.log(xhr.status);
	                    console.log(thrownError);
	                    if (onError) {
	                        onError();
	                    }
	                }
	            },
	            beforeSend: function(xhr, settings) {
	            	if(authRequired && PLATCTRL.moduleMetadata.tokens[moduleCd] && PLATCTRL.moduleMetadata.tokens[moduleCd] !== "NA")
	            		xhr.setRequestHeader('Authorization', 'Bearer ' + PLATCTRL.moduleMetadata.tokens[moduleCd]);
	            }
	        });
		});
		
		return pajax;
	};
	
	this.get = function(moduleCd, params, onSuccess, onError, authRequired, lastChance) {
		
		var pajax = $.Deferred();
		var ptoken;
		// 3. check to see if you have a token for the module
		if(authRequired && (!PLATCTRL.moduleMetadata.tokens || !PLATCTRL.moduleMetadata.tokens[moduleCd] || PLATCTRL.moduleMetadata.tokens[moduleCd] == null)) {
			ptoken = PLATCTRL.moduleMetadata.authorize(moduleCd);
		} else {
			ptoken = $.Deferred().resolve();
		}
		var mrq = this;
		$.when(ptoken).done(function() {		
			// we need to set the type to either HTML or JSON - probably should take in a type parameter
			// set the authroization bearer token in the header to the token for the module (if authRequired == true)
			//		xhr.setRequestHeader('Authorization','Bearer ' + PLATCTRL.moduleMetadata.token[moduleCd]);
			// add params to query string?
			// perform the AJAX call
			
			// we need to set the type to either HTML or JSON - probably should take in a type parameter
			var dataType = params.dataType;
			var data = params.data;
			var contentType = params.contentType;
			
			// set the authroization bearer token in the header to the token for the module (if authRequired == true)
			//		xhr.setRequestHeader('Authorization','Bearer ' + PLATCTRL.moduleMetadata.token[moduleCd]);
			// how do we handle params (should be a map)?
			//		JSON - stringify it?
			//		HTML - stringify it?
			// perform the AJAX call

			pajax = $.ajax({
	            url: mrq.config.action,
				self: mrq,
	            dataType: dataType,
	            data: data,
	            cache: false,
	            contentType: contentType,//"application/json",
	            type: "GET",
	            success: function(result) {
	            	
	                if (onSuccess)
	                    onSuccess(result);
	            },
	            error: function(xhr, ajaxOptions, thrownError) {           	
	                if (xhr.status === 401 && !lastChance) {
	                	if ((typeof authRequired === 'undefined') || (authRequired == true)) {
	                		PLATCTRL.moduleMetadata.tokens[moduleCd] = null;
	                		this.self.get(moduleCd, params, onSuccess, onError, authRequired, true);
	                    } else {
	                        if (onError) {
	                            onError();
	                        }
	                    }
	
	                }
	                else {
	                    console.log(xhr.status);
	                    console.log(thrownError);
	                    if (onError) {
	                        onError();
	                    }
	                }
	            },
	            beforeSend: function(xhr, settings) {
	            	if(authRequired && PLATCTRL.moduleMetadata.tokens[moduleCd] && PLATCTRL.moduleMetadata.tokens[moduleCd] !== "NA")
	            		xhr.setRequestHeader('Authorization', 'Bearer ' + PLATCTRL.moduleMetadata.tokens[moduleCd]);
	            }
	        });
		
		});
		
		return pajax;
		
	};
}