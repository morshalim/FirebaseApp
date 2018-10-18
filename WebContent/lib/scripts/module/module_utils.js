var ModuleUtils = function (config) {

	this.unique_message_id;

	this.config = {
		debug: true,
		moduleCode: "XYZ",
		msgTypeSuccess: "S",
		msgTypeError: "E",
		utcDateTimeFormat: "MM/DD/YYYY HH:mm:ss",
		defaultNumberFormat: "#,###.00",
		defaultLocale: "en",
		defaultCurrency: "$",
		formats: {
			numeric: [
				{
					locales: ["en", "en_US", "en_CA"],
					format: "#,###.00",
					formatNoDecimal: "#,###"/*,
					formatInputMask: "9,999.99"*/
				},
				{
					locales: ["fr", "fr_FR", "fr_CA"],
					format: "# ###,00",
					formatNoDecimal: "# ###"/*,
					formatInputMask: "9 999,99"*/
				}
			]
		}
	};
	
	this.getNumberFormat = function(locale, avoidDefault) {
		
		var format = (avoidDefault) ? {} : { format: this.config.defaultNumberFormat };
		
		// determine which locale to use
		if(locale == null) {
			
			if(this.config.locale != null)
				locale = this.config.locale;
			else
				locale = this.config.defaultLocale
		}
		
		// determine format for the determined locale
		var tempFormat = $.grep(this.config.formats.numeric, function(e) {

			return $.grep(e.locales, function(ei){ return ei.toLowerCase() == locale.toLowerCase(); })[0];
			//return found; 
		})[0];
		
		if(tempFormat)
			format = tempFormat;
		
		return format;
	};

	this.init = function () {
		
		$.extend(true, this.config, config);
		
		return this;
	};
	
	this.resizeContainer = function(id, offset) {
	
		/*var delta = $('.page-header').height() + $('#'+id).height() + $('.outer_search').height() + offset;
		
		$('#'+id).height($("body").innerHeight() - delta);*/
		
		var height = $(window).height() - $('#'+id).offset().top - offset;
		
		if(height < 100)
			height = 100;
		
		$('#'+id).height(height);
	};

	this.showMessage = function (msg) {

		if(msg && msg.type == this.config.msgTypeSuccess) {
			
			this.showSuccess(msg.message, 4000);
			return true;
		}
		else if(msg && msg.type == this.config.msgTypeError) {
			
			this.showError(msg.message);
			return false;
		}
		else {
			
			if(this.config.debug) console.log("Not a valid message: ", msg);
			return null;
		}
	};


	this.showError = function (errorMsg, time, noReplace) {

		if(errorMsg == null)
			errorMsg = "";
		
		if (this.unique_message_id != null && !noReplace)
			$.gritter.remove(this.unique_message_id, {
				fade: true, // optional
				speed: 'fast' // optional
			});

		var title = "";
		if (typeof (lang) != 'undefined' && lang.js_lable_error_msg)
			title = lang.js_lable_error_msg;

		this.unique_message_id = $.gritter.add({
			title: title,
			text: errorMsg,
			class_name: 'gritter-error',
			sticky: (time != null) ? false : true,
			time: time
		});
	};

	this.showSuccess = function (successMsg, time, noReplace) {

		
		if (this.unique_message_id != null && !noReplace)
			$.gritter.remove(this.unique_message_id, {
				fade: true, // optional
				speed: 'fast' // optional
			});
		

		this.unique_message_id = $.gritter.add({
			title: lang.js_lable_success_msg,
			text: successMsg,
			class_name: 'gritter-success',
			sticky: (time != null) ? false : true,
			time: time
		});
	};

	this.isDataTable = function (nTable) {
		
		var settings = $.fn.dataTableSettings;
		
		for (var i = 0, iLen = settings.length; i < iLen; i++) {
			
			if (settings[i].nTable == nTable)
				return true;
		}
		
		return false;
	};

	this.buildList = function (data, selected, mapKeys, elem, defaultValue) {
		
		var options = [];

		if (defaultValue)
			options.push('<option value="' + defaultValue.value + '">' + defaultValue.detail + '</option>');

		$.each(data, function (index, item) {
			
			var value = item;
			var detail = item;
			
			if (mapKeys) {
				
				value = item[mapKeys.value];
				
				if ($.isArray(mapKeys.detail)) {
					
					var values = [];
					
					$.each(mapKeys.detail, function (dindex, ditem) {
						values.push(item[ditem])
					});
					
					detail = values.join(' ');
				}
				else
					detail = item[mapKeys.detail];
			}
			
			options.push('<option ' + ((selected && selected == value) ? 'selected' : '') + ' value="' + value + '">' + detail + '</option>');
		});

		elem.html(options.join(''));
	};

	this.buildDependentList = function (data, selected, mapKeys, parentNamePair, elem, defaultValue, callback, childSelected, childMapKeys, childNamePair, childElem, childDefaultValue) {

		buildDependentListItems(data, selected, mapKeys, parentNamePair, elem, defaultValue);

		buildDependentListItems(data[elem.val()], childSelected, childMapKeys, childNamePair, childElem, childDefaultValue);

		elem.off("change").on("change", function (e) {

			buildDependentListItems(data[elem.val()], childSelected, childMapKeys, childNamePair, childElem, childDefaultValue);
			
			if (callback)
				callback();
		});
	};

	this.buildDependentListItems = function (data, selected, mapKeys, namePair, elem, defaultValue) {
		
		var options = [];

		if (defaultValue)
			options.push('<option value="' + defaultValue.value + '">' + defaultValue.detail + '</option>');

		if (data != null) {
			
			$.each(data, function (index, item) {
				
				var value = "";
				var detail = "";

				if (typeof index == "string") {
					value = index;
					detail = index;
				}
				else {
					value = item;
					detail = item;
				}
				
				if (mapKeys) {
					value = item[mapKeys.value];
					detail = item[mapKeys.detail];
				}

				if (typeof index === "string" && namePair) {
					value = index;
					detail = namePair[index];
				}
				else if (namePair) {
					value = item;
					detail = namePair[item];
				}

				options.push('<option value="' + value + '">' + detail + '</option>');
			});
		}
		
		elem.html(options.join(''));
	};

	this.getServicePath = function () {
		
		// 1. get module metadata
		var metadata = PLATCTRL.moduleMetadata.metaData[this.config.moduleCode];

		// 2. ensure metadata is present
		if (!metadata || metadata == null) {
			alert('meta data empty');
			return '';
		}

		return metadata.domainNameURL + '/' + metadata.contextRoot;
	};

	this.makeAjaxCall = function (ajaxUrl, data, scope, type, success, error, lastChance, noLoading, external, moduleCode) {

		var self = this;
		
		// 1. get module metadata
		if(moduleCode == null) // if module code is not passed in, use the configured one
			moduleCode = this.config.moduleCode;
		var metadata = PLATCTRL.moduleMetadata.metaData[moduleCode];
		var ptoken;

		if(external)
			ptoken = $.Deferred().resolve();
		else {
			
			// 2. ensure metadata is present
			if (!metadata || metadata == null) {
				
				alert('meta data empty');
				return $.Deferred().reject();
			}
	
			// 3. check to see if you have a token for the module
			if (metadata.oauthEnabled && (!PLATCTRL.moduleMetadata.tokens || !PLATCTRL.moduleMetadata.tokens[moduleCode] || PLATCTRL.moduleMetadata.tokens[moduleCode] == null))
				ptoken = PLATCTRL.moduleMetadata.authorize(moduleCode);
			else
				ptoken = $.Deferred().resolve();
		}
		
		return $.when(ptoken).then(function () {
			
			var url = '';
			
			if(external)
				url = ajaxUrl;
			else if(ajaxUrl.indexOf(metadata.domainNameURL + '/' + metadata.contextRoot) != -1) //do extra check if url is doubling
				url = ajaxUrl;
			else
				url = metadata.domainNameURL + '/' + metadata.contextRoot + ajaxUrl;
			
			return $.ajax({
				url: url,
				type: type,
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				data: (type == "GET") ? data : (data) ? JSON.stringify(data) : null,
				dataType: "json",
				cache: false,
				scope: scope,
				global: noLoading ? false : true,
				success: function (data) {

					if (data && data.error)
						PLATCTRL.alert(data.message + "(" + data.code + ")");
					else {
						
						if (this.scope)
							success.apply(this.scope, [data, this]);
						else
							success(data);
					}
				},
				error: function (xhr, ajaxOptions, thrownError) {

					var res = null;
					
					try {
						res = eval("(" + xhr.responseText + ")");
					}
					catch (e) {
						//do nothing;
					}

					if (xhr.status === 401 && metadata.oauthEnabled && !lastChance) {
						
						PLATCTRL.moduleMetadata.tokens[moduleCode] = null;
						self.makeAjaxCall(ajaxUrl, data, scope, type, success, error, true, noLoading, external);
					}
					else {

						if (res != null) {
							
							self.showError(res.message);

							if (this.scope)
								error.apply(this.scope, this);
							else
								error();
						}
						else
							PLATCTRL.alert('Oops! We are currently experiencing an issue getting that functionality. Please try again later. Please contact your system administrator, if this issue continues to persist. (300)');
					}
				},
				beforeSend: function (xhr, settings) {
					if (PLATCTRL.moduleMetadata.tokens[moduleCode] && PLATCTRL.moduleMetadata.tokens[moduleCode] !== "NA")
						xhr.setRequestHeader('Authorization', 'Bearer ' + PLATCTRL.moduleMetadata.tokens[moduleCode]);
				}
			});
		});
	};

	this.makeAjaxFormCall = function (url, data, scope, type, success, error, lastChance) {
		
		// 1. get module metadata
		var moduleCode = this.config.moduleCode;
		var metadata = PLATCTRL.moduleMetadata.metaData[moduleCode];
		var ptoken;

		// 2. ensure metadata is present
		if (!metadata || metadata == null) {
			
			alert('meta data empty');
			return $.Deferred().reject();
		}

		// 4. Build an absolute URL
		var url = metadata.domainNameURL + ajaxUrl;

		// 3. check to see if you have a token for the module
		if (metadata.oauthEnabled && (!PLATCTRL.moduleMetadata.tokens || !PLATCTRL.moduleMetadata.tokens[moduleCode] || PLATCTRL.moduleMetadata.tokens[moduleCode] == null))
			ptoken = PLATCTRL.moduleMetadata.authorize(moduleCode);
		else
			ptoken = $.Deferred().resolve();

		return $.when(ptoken).then(function () {
			
			return $.ajax({
				url: url,
				type: type,
				processData: false,
				contentType: false,
				data: data,
				dataType: "json",
				cache: false,
				scope: scope,
				success: function (data) {

					if (data && data.error)
						PLATCTRL.alert(data.message + "(" + data.code + ")");
					else {
						
						if (this.scope)
							success.apply(this.scope, [data, this]);
						else
							success(data);
					}
				},
				error: function (xhr, ajaxOptions, thrownError) {

					if (xhr.status === 401 && !lastChance) {
						
						PLATCTRL.moduleMetadata.tokens[moduleCode] = null;
						makeAjaxFormCall(url, data, scope, type, success, error, true);

					}
					else {
						
						PLATCTRL.alert('Oops! We are currently experiencing an issue getting that functionality. Please try again later. Please contact your system administrator, if this issue continues to persist. (400)');
						
						if (this.scope)
							error.apply(this.scope, this);
						else
							error();
					}
				},
				beforeSend: function (xhr, settings) {
					
					if (PLATCTRL.moduleMetadata.tokens[moduleCode] && PLATCTRL.moduleMetadata.tokens[moduleCode] !== "NA")
						xhr.setRequestHeader('Authorization', 'Bearer ' + PLATCTRL.moduleMetadata.tokens[moduleCode]);
				}
			});
		});
	};

	this.makeAjaxAuthorizationCall = function (url, data, scope, type, header, success, error) {

		// 1. get module metadata
		var metadata = PLATCTRL.moduleMetadata.metaData[this.config.moduleCode];

		// 2. ensure metadata is present
		if (!metadata || metadata == null) {
			
			alert('meta data empty');
			return $.Deferred().reject();
		}

		// 4. Build an absolute URL
		var url = metadata.domainNameURL + ajaxUrl;

		return $.ajax({
			url: url,
			type: type,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			data: (type == "GET") ? data : (data) ? JSON.stringify(data) : null,
			dataType: "json",
			cache: false,
			scope: scope,
			success: function (data) {

				if (data && data.error)
					PLATCTRL.alert(data.message + "(" + data.code + ")");
				else {
					
					if (this.scope)
						success.apply(this.scope, [data, this]);
					else
						success(data);
				}
			},
			error: function (xhr, ajaxOptions, thrownError) {

				PLATCTRL.alert('Oops! We are currently experiencing an issue getting that functionality. Please try again later. Please contact your system administrator, if this issue continues to persist. (500)');

				if (this.scope)
					error.apply(this.scope, this);
				else
					error();
			},
			beforeSend: function (xhr, settings) {
				
				$.each(header, function (index, item) {
					xhr.setRequestHeader(index, item);
				});
			}
		});
	};

	this.formatDateToAMPM = function (date) {
		
		var d = new Date(date);
		var hh = d.getHours();
		var m = d.getMinutes();
		var s = d.getSeconds();
		var tz = d.toString().match(/\(([A-Za-z\s].*)\)/)[1]
		var dd = "AM";
		var h = hh;
		
		if (h >= 12) {
			
			h = hh - 12;
			dd = "PM";
		}
		
		if (h == 0)
			h = 12;

		m = m < 10 ? "0" + m : m;

		s = s < 10 ? "0" + s : s;

		/* if you want 2 digit hours: */
		h = h < 10 ? "0" + h : h;

		var pattern = new RegExp("0?" + hh + ":" + m + ":" + s);
		return h + ":" + m + " " + dd + ' (' + tz + ')';
	};

	this.formatTimeToDate = function (time) {
		
		var startTime = new Date();
		var parts = time.match(/(\d+):(\d+) (AM|PM)/);
		
		if (parts) {
			
			var hours = parseInt(parts[1]),
				minutes = parseInt(parts[2]),
				tt = parts[3];
			
			if (tt === 'PM' && hours < 12) hours += 12;
			
			startTime.setHours(hours, minutes, 0, 0);
		}
		
		return startTime;
	};

	this.urlParam = function (name, url) {

		if (!url)
			url = window.location.href;

		var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(url);
		
		if (results == null)
			return null;
		else
			return results[1] || 0;
	};

	this.navigate = function (url, skipHistory) {
		
		//TODO: refactor once it's fixed in platform.
		var moduleMetadata = PLATCTRL.moduleMetadata.metaData[this.config.moduleCode];
		
		url = "/" + moduleMetadata.contextRoot + url
		PLATCTRL.loadModuleContent(this.config.moduleCode, url, moduleMetadata.oauthEnabled, skipHistory);
		
		$("html, body").scrollTop(0);
	};

	this.getDateFormatForDisplay = function (date) {

		if (isNaN(date))
			date = new Date(date);
		else
			date = Date.newDate(date);

		var fullLocale = fullLocale || '';

		if ($.datepicker.regional[fullLocale])
			date = $.datepicker.formatDate($.datepicker.regional[fullLocale].dateFormat, date);
		else if ($.datepicker.regional[shortLocale])
			date = $.datepicker.formatDate($.datepicker.regional[shortLocale].dateFormat, date);
		else
			date = $.datepicker.formatDate($.datepicker.regional['en'].dateFormat, date);
		
		return date;
	};

	this.cropText = function (text, capsWeight, blank, length, suffix) {

		var len = length || this.config.orgTree.nodeLabelsMaxLength;
		var suff = suffix || '...';

		if (text.length > len)
			text = text.substr(0, len) + suff;

		if (text == "" && blank == false)
			return " ";

		// trim some more if there are caps, based on capsWeight - bold should be more than regular
		var match = text.match(/[A-Z]/g);
		var matchLength = (match != null) ? match.length : 0;
		var difference = matchLength * (capsWeight - 1);
		len = Math.floor(len - difference);

		if (text.length > len)
			text = text.substr(0, len) + suff;
		return text;
	};

	this.cleanUpText = function(value, alternateValue, emptyValue) {
		
		if(value == null) {
		
			if(alternateValue != null)
				return alternateValue;
			else
				return '';
		}
		else if(value == '')
			return emptyValue;
		
		return value;
	};
	
	this.formatDateToAMPMWithoutTimeZone = function (date) {
		
	    var d = new Date(date);
	    var hh = d.getHours();
	    var m = d.getMinutes();
	    var s = d.getSeconds();
	    var tz = d.toString().match(/\(([A-Za-z\s].*)\)/)[1]
	    var dd = "AM";
	    var h = hh;
	    
	    if (h >= 12) {
	        h = hh-12;
	        dd = "PM";
	    }
	    if (h == 0) {
	        h = 12;
	    }
	    m = m<10?"0"+m:m;
	    
	    s = s<10?"0"+s:s;

	    /* if you want 2 digit hours: */
	    h = h<10?"0"+h:h;

	    var pattern = new RegExp("0?"+hh+":"+m+":"+s);
	    
	    return h+":"+m+" "+dd;
	};
	
	this.getDateTimeForDisplay = function (date){
		
	    return this.getDateFormatForDisplay(date)+" "+this.formatDateToAMPMWithoutTimeZone(date);
	}
	
	this.getLocalTimeFromUTCTime = function (date){
		
		var localTime  = moment(moment.utc(date, this.config.utcDateTimeFormat)).local().format(this.config.utcDateTimeFormat)
		
	    return this.getDateTimeForDisplay(localTime);
	};
	
	this.getFormattedNumber = function (value,format,locale){
		
		if(value==null || value==undefined)
			value = '';
		
	    return $.formatNumber(value, {format:(format ? format : this.config.defaultNumberFormat), locale:(locale ? locale : this.config.defaultLocale)});
	};
	
	this.getFormattedCurrency = function (value,format,locale,currencySymbol){
		
		if(value==null || value==undefined)
			value = '';
		
	    return (currencySymbol ? currencySymbol : this.config.defaultCurrency) + $.formatNumber(value, {format:(format ? format : this.config.defaultNumberFormat), locale:(locale ? locale : this.config.defaultLocale)});
	};
	
	this.formatSizeUnits = function(bytes) {
		
		if (bytes >= 1073741824)
			bytes = (bytes / 1073741824).toFixed(2) + ' GB';
		else if (bytes >= 1048576)
			bytes = (bytes / 1048576).toFixed(2) + ' MB';
		else if (bytes >= 1024)
			bytes = (bytes / 1024).toFixed(2) + ' KB';
		else if (bytes > 1)
			bytes = bytes + ' bytes';
		else if (bytes == 1)
			bytes = bytes + ' byte';
		else
			bytes = '0 byte';

		return bytes;
	};
};


//jquery serialize form method
$.fn.serializeObject = function () {
	
	var o = {};
	var a = this.serializeArray();
	
	$.each(a, function () {
		
		if (o[this.name]) {
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		}
		else {
			o[this.name] = this.value || '';
		}

		var jelem = $('[name="' + this.name + '"]');
		if (jelem.hasClass('date-picker')) {
			o[this.name] = jelem.datepicker('getDate');
			if (o[this.name] != null)
				o[this.name].toISOString();
		}
		else if (jelem.hasClass('date-timepicker')) {
			o[this.name] = jelem.data('DateTimePicker').getDate();
			if (o[this.name] != null)
				o[this.name].toISOString();
		}
		else if (jelem.hasClass('time-picker')) {
			var str = formatTimeToDate(jelem.data('timepicker').getTime()).toISOString();
			o[this.name] = str;
		}
	});
	
	this.handleAllCheckBoxDT = function(table, allCB) {
		
		// Handle click on "Select all" control
		allCB.on("click", { self: this }, function(e) {
		
			// Check/uncheck all checkboxes in the table
			var rows = getAllRowsDT(table);
			
			$('input[type="checkbox"]', rows).prop('checked', this.checked);
		});

	   // Handle click on checkbox to set state of "Select all" control
		table.find('tbody').on("change", "input[type='checkbox']", function() {
		   
		   var rows = table.api().rows({ 'search': 'applied' }).nodes();
		   
		   // If checkbox is not checked
		   if(!this.checked) {
		 
			   allCB.prop('checked', false);
		   }
		   else if(rows.length == $('input[type="checkbox"]:checked', rows).length)
			   allCB.prop('checked', true);
	   });
	};
	
	this.getAllRowsDT = function(table) {
		
		return table.dataTable().api().rows({ 'search': 'applied' }).nodes();
	};
	
	this.getSelectedCheckBoxesDT = function(rows) {
		
		return $('input[type="checkbox"]:checked', rows);
	};
	
	return o;
};

$.fn.deserializeObjectIntoDom = function (data) {
	
	var jparent = this;
	
	$.each(data, function (key, value) {
		
		var jelem = jparent.find('#' + key);
		
		if (!jelem.length)
			jelem = jparent.find('[name="' + key + '"]');
		
		if (jelem.length) {
			
			if (jelem.hasClass('date-picker')) {
				
				if (value != null && value != '') {
					
					var date = new Date(value);
					jelem.datepicker('setDate', date);
				}
			}
			else if (jelem.hasClass('date-timepicker')) {
				
				if (value != null && value != '') {
					
					var date = new Date(value);
					jelem.data('DateTimePicker').setDate(date);
				}
			}
			else if (jelem.hasClass('time-picker')) {
				
				if (value != null && value != '') {
					
					var date = new Date(value);
					jelem.timepicker('setTime', formatDateToAMPM(date));
				}
			}
			else
				jelem.val("" + value);
		}
	});
};