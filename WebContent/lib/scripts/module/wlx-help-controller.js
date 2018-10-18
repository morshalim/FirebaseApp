var HelpController = function(config) {
	
	this.config = {
		debug: true,
		dateFormat: "mm/dd/yyyy",
		dateFormatDB: "yyyyMMdd",
		triggerId: "portalHeaderHelpBtn",
		urls: {
			getData: function() { return ''; }
		},
		lang: {}
	};
	
	this.init = function() {
		
		$.extend(true, this.config, config);
		
		// attach listeners
		$(document).off("click", "#"+this.config.triggerId).on("click", "#"+this.config.triggerId, { self: this }, function(e) {
			
			e.data.self.showHelp($(this));
		});
		
		return this;
	};
	
	this.render = function() {
		
		return this;
	};
	
	this.showHelp = function(elem) {
		
		if(typeof SIDEPANELRIGHT != "undefined") {

			var panelConfig = {
				elem: elem,
				urls: {
					getData: ((typeof this.config.urls.getData  == "function") ? this.config.urls.getData() : this.config.urls.getData)
				}
			};
			
			SIDEPANELRIGHT.renderSidePanelRight(panelConfig);
		}
	};

	// utils

	this.buildError = function(data) {

		if(this.config.debug) console.log(data);
		
		showError('Error fetching help.');
	};
}