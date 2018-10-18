var SessionTimeoutController = function(config) {

	//this.isActive;

	this.localStorageId;
	this.sessionTimedOut = false;

	this.localStorage;
	this.defaultConfig = {
			timeout : 900,
			countdown : 60,                      
			localStorageTestVariable : 'cloud.storageTestVariable',
			localStorageIsCounting : 'cloud.sessionTimeoutIsCounting',
			localStorageId : 'cloud.sessionTimeoutId',
			localStorageCounter : 'cloud.sessionTimeoutCounter',
			title : 'Your session is about to expire!',
			message : 'You will be logged out in {0} seconds.',
			question : 'Do you want to stay signed in?',
			keep_alive_button_text : 'Yes, keep me signed in.',
			sign_out_button_text : 'No, sign me out.',
			keep_alive_url : '../json/SESSION_RESET_TIMEOUT.htm',
			logout_url : '../logout.htm',
			restart_on_yes : true,
			dialog_width : 350
	};

	this.config;
	this.init = function(){
		$.extend(true, this.defaultConfig, config);
		this.config = this.defaultConfig;
		$(window).on("unload", {self: this}, this.unloadWindowEvent);
		
		
		this.localStorage = this.findLocalStorageObject();	
		
		this.setLocalStorageId(this.guid());
		this.setlocalStorageIsCounting(true);
		this.setLocalStorageCounter(0);
		this.setupDialogTimer();
		
		return this;
	};

	this.findLocalStorageObject = function() {
	    var localStorage = null;

	    // Does this browser support localStorage?
	    try {
	        localStorage = window.localStorage;
	        if(localStorage)
	        	localStorage.setItem(this.config.localStorageTestVariable,"TEST");
	    } catch (e) {
	    	localStorage = null;
	    }

	    // Does this browser support sessionStorage?
	    try {
	        if (!localStorage)
	        	localStorage = window.sessionStorage;
	        if(localStorage)
	        	localStorage.setItem(this.config.localStorageTestVariable,"TEST");
	    } catch (e) {
	    	localStorage = null;
	    }

	    if (!localStorage) {
	        // Local Storage Facade
	        localStorage = {
	            getItem : function(prop){
	                prop = prop +'=';
	                var m = document.cookie.split(";");
	                for(var i=0;i<m.length;i++){
	                    var _m = m[i].replace(/(^\s+|\s+$)/,'');
	                    if(_m && _m.indexOf(prop)===0){
	                        return _m.substr(prop.length);
	                    }
	                }
	                return null;
	            },
	            setItem : function(prop, value){
	                document.cookie = prop + '=' + value;
	            }
	        };
	    }
	    
	    return localStorage;
	}
	
    this.guid = function(){ 
        function S4() { 
        	return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
        } 
                        
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4()); 
    };

	this.isSessionTimedOut = function(){
		return this.sessionTimedOut;
	};

	this.setlocalStorageIsCounting = function(bool){
		this.localStorage.setItem(this.config.localStorageIsCounting, bool);
	};             

	this.setLocalStorageId = function(id){
		this.localStorageId = id;
		this.localStorage.setItem(this.config.localStorageId, id);
	};             

	this.setLocalStorageCounter = function(ctr){
		this.localStorage.setItem(this.config.localStorageCounter, ctr);
	};             

	this.format = function(str, args) {
		var s = str;

		for(i = 0; i < args.length; i++) {
			s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), args[i]);
		}
		return s;
	};             

	this.setupDialogTimer = function() {
		var self = this;
		this.destroyDialog();

		//if(!localStorage.getItem(this.config.localStorageCounter))
		//            this.setLocalStorageCounter(0);

		this.tId = window.setInterval(function() {

			var guid = self.localStorage.getItem(self.config.localStorageId);
			var isCounting = self.localStorage.getItem(self.config.localStorageIsCounting);
			var ctr = parseInt(self.localStorage.getItem(self.config.localStorageCounter));

			if(isCounting != "true") {//this implies someone is counting
				self.setLocalStorageId(self.localStorageId);
				self.setlocalStorageIsCounting(true);
			}

			if(guid == self.localStorageId){
				ctr++;
				//console.log(ctr);
				if(ctr > self.config.timeout+61 ){ // logout tried for 60 times, reset counter to zero to prevent infinite logout tries 
					ctr = 0;
				} 
				self.setLocalStorageCounter(ctr);
			}

			if(ctr > self.config.timeout) // if this is not an active page and the time has expired redirect to the logout page.
				self.redirectLogout();                                     
			else if(ctr > (self.config.timeout - self.config.countdown))
				self.setupDialog();
			else
				self.destroyDialog();

		}, 1000);
	};

	this.setupDialog = function() {
		if(!$("#timeout-dialog").length) {

			var self = this;

			var guid = this.localStorage.getItem(this.config.localStorageId);
			//added support for only one instance of the webkit popup
			//only active counter will show this, if even minimized.
			if(guid == this.localStorageId){                                   
				var options = {
						iconUrl: '../images/bmark.png',
						title: 'Cloud Web Session Alert',
						body: 'Please extend your web session to continue working!',
						autoclose: true,
						options:3000
				};

				$.notification(options);
			}

			var dialogConfig = {
					modal : true,
					width : this.config.dialog_width,
					minHeight : 'auto',
					zIndex : 10000,
					closeOnEscape : false,
					draggable : false,
					resizable : false,
					dialogClass : 'timeout-dialog no-close',
					title : this.config.title,
					buttons : {
						'keep-alive-button' : {
							label : this.config.keep_alive_button_text,
							id : "timeout-keep-signin-btn",
							callback : function() {
								self.keepAlive();
							}
						},
						'sign-out-button' : {
							label : this.config.sign_out_button_text,
							id : "timeout-sign-out-button",
							callback : function() {
								self.signOut();
							}
						}
					}
			};


			dialogConfig.message = '<div id="timeout-dialog">'
				+ '<p id="timeout-message">'
				+ this.format(this.config.message,
						['<span id="timeout-countdown" style="color:red; font-weight:bold;">' + this.timetoCountdown() + '</span>'])
						+ '</p>' + '</br> </br>'
						+ '<p id="timeout-question">' + this.config.question
						+ '</p>' + '</div>';

			bootbox.dialog(dialogConfig);
			this.startCountdown();
		}
	};

	this.destroyDialog = function(){
		if ($("#timeout-dialog").length) {
			window.clearInterval(this.countdown);
			bootbox.hideAll();
			$('#timeout-dialog').remove();
		}
	};

	this.startCountdown = function() {
		var self = this;

		this.countdown = window.setInterval(function() {
			var counter = self.timetoCountdown();
			$("#timeout-countdown").html(counter);
			if (counter <= 0) {
				//window.clearInterval(self.countdown);
				self.signOut();
			}
		}, 1000);
	};

	this.timetoCountdown = function() {
		var ctr = parseInt(this.localStorage.getItem(this.config.localStorageCounter));
		var counter = this.config.timeout - ctr;
		return counter
	};

	this.keepAlive = function() {		
		$.ajax({
			url: this.config.keep_alive_url,
			context :{self:this},
			cache: false,
			success: function(resp,textStatus, XMLHttpRequest){				
				if (this.self.config.restart_on_yes) {
					this.self.destroyDialog();
				}
			},
			error: function()
			{
				this.self.signOut();
			}
		});		
	};

	this.reset = function() {
		this.setLocalStorageCounter(0);
	};

	this.signOut = function() {
		this.setLocalStorageCounter(this.config.timeout+1);//timeout any other pages that might exist
		this.sessionTimedOut = true;
		
		//true logout then get rid of potential unloads
		$(window).off('beforeunload');
		$(window).off('unload');
		
		this.destroyDialog();
		this.redirectLogout();
	};

	this.redirectLogout = function() {
		window.location = this.config.logout_url;
	};

	this.unloadWindowEvent = function(event){
		//event.data.self.setIsActive(false);
		event.data.self.setlocalStorageIsCounting(false);
	};    


};
