var AttachmentsController = function(config) {
	
	this.config = {
		inbox: false,
		advanced: false,
		container: document,

		editable: true,
		uploadCheck: function(elem) { return true; },
		deleteCheck: function(file) { return true; },
		attachmnents: [],
		attachmnentTypes: [],
		autoDiscover: false,
		dropZoneContainer: 'dropzoneForm',
		selector: '[rel="wlxAttachment"]',
		selectorPathGenerator: function(elem) { return ''; },
		selectorUploadPathGenerator: function(elem) { return ''; },
		paramName: "file", // The name that will be used to transfer the file
		maxFilesize: '2.0', // MB
		addRemoveLinks: true,
		fileTypesIconPath: "../images/filetypes/jpg/",
		pathSeperator: ';',
						
		listen: false,
		pathPrefix: '',
		path: '',
		pathSuffix: '',
		uploadFileParamKey: 'uploadFile',
		pathParamKey: 'ctr_req_attachments_path',
		fileParamKey: 'crt_req_file_id',
		beforeViewAttachments: null,
		urls: {
			getCount: '../jsonObject/EV_GET_ATTACHMENTS_COUNT.htm',
			getAttachmentsList: '../jsonObject/EV_GET_ATTACHMENTS_LIST.htm',
			viewAttachments: '../page/EV_VIEW_ATTACHMENTS.htm',
			uploadAttachments: '../json/EV_UPLOAD_ATTACHMENTS.htm',
			uploadAttachmentsTextResponse: '../jsonText/EV_UPLOAD_ATTACHMENTS.htm',
			deleteAttachment: '../json/EV_DELETE_ATTACHMENT.htm'
		},
		lang: {
			uploadBtn:  workSheetLang.jsp_attachments_btn_upload,
			chooseBtn:  workSheetLang.jsp_attachments_btn_choose,
			changeBtn:  workSheetLang.jsp_attachments_btn_change,
			noFileSelected:  workSheetLang.jsp_attachments_nofile,
			dictDefaultMessage1:  workSheetLang.jsp_attachments_drag_drop,
			dictDefaultMessage2:  workSheetLang.jsp_attachments_to_upload,
			dictDefaultMessage3:  workSheetLang.jsp_attachments_browse_folders,
			dictResponseError:  workSheetLang.jsp_attachments_upload_error,
			selectOneFileOnly:  workSheetLang.jsp_attachments_select_file,
			fileUploadSuccess:  workSheetLang.jsp_attachments_upload_success,
			fileDeleteSuccess:  workSheetLang.jsp_attachments_delete_success,
			fileUploadFailure:  workSheetLang.jsp_attachments_upload_fail,
			invalidFileError: workSheetLang.jsp_attachments_invalid_file_error,
			fileRemoveConfirm:  workSheetLang.jsp_attachments_remove_alert,
			fileType: '',
			fileName:  workSheetLang.jsp_attachments_file_name,
			fileCreatedBy:  workSheetLang.jsp_attachments_uploaded_by,
			fileCreatedOn:  workSheetLang.jsp_attachments_uploaded_on,
			fileOptions:  workSheetLang.jsp_attachments_options
		}
	};
	
	this.init = function() {
		
		$.extend(true, this.config, config);

		if(this.config.inbox)
			$(document).on('click', this.config.selector, { self: this }, this.viewAttachmentsEvent);
		else if(this.config.advanced) {

			Dropzone.autoDiscover = this.config.autoDiscover;

			$("#cancel").on('click', { self: this }, this.goBackEvent);
		}
		else {
			
			$(document).off('click', this.config.selector+' a[downloadPath]').on('click', this.config.selector+' a[downloadPath]', { self: this }, this.downloadAttachmentEvent);
			$(document).off('click', this.config.selector+' button[downloadPath]').on('click', this.config.selector+' button[downloadPath]', { self: this }, this.downloadAttachmentEvent);
			$(document).off('click', this.config.selector+' button[removeAttachment]').on('click', this.config.selector+' button[removeAttachment]', { self: this }, this.removeAttachmentEvent);
		}
		
		return this;
	};
	
	this.render = function() {

		if(this.config.inbox) 
			this.renderInbox();
		else if(this.config.advanced)
			this.renderAdvanced();
		else
			this.renderCombined();

		return this;
	};
	
	this.renderInbox = function() {
		
		var list = $(this.config.container).find(this.config.selector);
		
		this.getCount(list);
		
		if(this.config.listen)
			this.listen();		
	};
	
	this.renderAdvanced = function() {

		var self = this;
		
		try {
			
			$("#"+this.config.dropZoneContainer).dropzone({
				paramName: this.config.paramName,
				init: function() {
					this.on("maxfilesexceeded", function(file){
							bootbox.alert(workSheetLang.js_upload_file_max_files_alert_msg);
					   });
					this.on("addedfile", function(file){
						$('#ctr_req_title').val($('#title').val());
						$('#ctr_req_description').val($('#description').val());
				    });
				},
				maxFilesize: this.config.maxFilesize, 
				maxFiles: maxFiles,
				//autoProcessQueue: false,
				acceptedFiles:fileType,
				addRemoveLinks: this.config.addRemoveLinks,
				dictDefaultMessage: '<span><span class="bigger-120 bolder"> '+workSheetLang.js_upload_file_default_msg1+'</span> '+workSheetLang.js_upload_file_default_msg2+' <br><span class="smaller-80 grey">'+workSheetLang.js_upload_file_default_msg3+'</span> <br><i class="upload-icon ace-icon fa fa-cloud-upload blue fa-3x"></i></span>',
				dictResponseError: this.config.lang.dictResponseError,
				removedfile: function(file) {
					
					self.removeAttachment(file);				
				},
				/*addedfile: function(file) {
					
					console.log(file);
				},*/
				complete: function(file) {
					
					console.log(file);
				},
				success: function(file, data) {
					if(data.status == 'error'){
						if(data.result){
							showErrorMsg(self.config.lang.fileUploadFailure, messageId);
							$('.dz-progress').hide();
						}else
							showErrorMsg(self.config.lang.invalidFileError, messageId);
					}else if(data.result != null && data.result.length && data.result[0].downloadPath != null && data.result[0].downloadPath != "") {

						var ext = data.result[0].name.split('.')[1];
						var previewSrc = $(file.previewTemplate).find('[data-dz-thumbnail]').attr('src');
						$(file.previewTemplate).remove();

						self.addAttachment(data.result[0]);
						showSuccess(self.config.lang.fileUploadSuccess, messageId);
						if(ext == 'jpg' || ext == 'jpeg' || ext == 'gif' || ext == 'png')
							$(data.result[0].previewTemplate).find('[data-dz-thumbnail]').attr('src', previewSrc);
					}
				}
		
				//change the previewTemplate to use Bootstrap progress bars
				//previewTemplate: "<div class=\"dz-preview dz-file-preview\">\n  <div class=\"dz-details\">\n    <div class=\"dz-filename\"><span data-dz-name></span></div>\n    <div class=\"dz-size\" data-dz-size></div>\n    <img data-dz-thumbnail />\n  </div>\n  <div class=\"progress progress-small progress-striped active\"><div class=\"progress-bar progress-bar-success\" data-dz-uploadprogress></div></div>\n  <div class=\"dz-success-mark\"><span></span></div>\n  <div class=\"dz-error-mark\"><span></span></div>\n  <div class=\"dz-error-message\"><span data-dz-errormessage></span></div>\n</div>"
			});
			
			for(var i=0; i<this.config.attachmnents.length; i++) {
				
				this.addAttachment(this.config.attachmnents[i]);
			} 
		}
		catch (e) {
			alert('Dropzone.js does not support older browsers!');
		}

		return this;
	};
	
	this.renderCombined = function() {
		
		var self = this;
		var list = $(this.config.container).find(this.config.selector);
		
		list.each(function(){
			
			self.showCombined($(this));
		});
	};
	
	this.showCombined = function(elem) {

		var self = this;
		var html = [];
		var id = elem.attr('id');
		var messageId = id + '-message';
		//var formId = id + '-form';
		var inputFileId = id + '-input-file';
		var inputUploadId = id + '-input-upload';
		var filesCntrId = id + '-files-cntr';
		var path = this.config.selectorPathGenerator(elem);
		var uploadPath = this.config.selectorUploadPathGenerator(elem);
		
		if(uploadPath != null && uploadPath == '') { // selectorUploadPathGenerator not overwritten, check to see if we can use selectorPathGenerator
			
			if(!$.isArray(path) || ($.isArray(path) && path.length==1)) // use path if it's a single path
				uploadPath = path;
		}
		
		if($.isArray(path))
			path = path.join(this.config.pathSeperator);
		
		elem.attr("path", path);

		html.push('<p><div id="'+messageId+'"></div></p>');
		//html.push('<form action="'+this.config.urls.uploadAttachments+'" id="'+formId+'">');
		//html.push('	<div><input name="'+this.config.pathParamKey+'" type="hidden" value="'+path+'" /></div>');
		if(this.config.editable && this.config.uploadCheck(elem)) {
			
			html.push('<p><input type="file" id="'+inputFileId+'" /></p>');
			html.push('<p><button class="btn btn-sm btn-primary" id="'+inputUploadId+'">'+this.config.lang.uploadBtn+'</button></p>');
		}
		//html.push('</form>');
		html.push('<p><div id="'+filesCntrId+'"></div></p>');
		
		elem.html(html.join(''));
		
		this.getAttachmentsList(elem);
		
		$('#'+inputFileId).ace_file_input({
			no_file: this.config.lang.noFileSelected,
			btn_choose: this.config.lang.chooseBtn,
			btn_change: this.config.lang.changeBtn,
			droppable: false,
			thumbnail: false/*, //| true | large
			onchange: function(e, p) {
				
				console.log(e, p);
			},
			before_change: function(files, dropped) {
				
			}*/
		});
		
		'use strict';
		$('#'+inputFileId).fileupload({			
	        url: ($.browser.msie  && parseInt($.browser.version, 10) < 10) ? this.config.urls.uploadAttachmentsTextResponse : this.config.urls.uploadAttachments,
	        autoUpload: false,
	        maxFileSize: this.config.maxFilesize,
	        disableImageResize: /Android(?!.*Chrome)|Opera/.test(window.navigator.userAgent),
	        previewMaxWidth: 100,
	        previewMaxHeight: 100,
	        previewCrop: true
		}).on('fileuploadadd', function (e, data) {
			
			// fix for ace_file_input bug not updating selected file on the UI only
			var fileName = data.files[0].name;
			var fileType = (fileType = /\.(jpe?g|png|gif|svg|bmp|tiff?)$/i.test(fileName) ? "image" : /\.(mpe?g|flv|mov|avi|swf|mp4|mkv|webm|wmv|3gp)$/i.test(fileName) ? "video" : /\.(mp3|ogg|wav|wma|amr|aac)$/i.test(fileName) ? "audio" : "file");
			var classNames = { file: " ace-icon fa fa-file", image: " ace-icon fa fa-picture-o file-image", video: " ace-icon fa fa-film file-video", audio: " ace-icon fa fa-music file-audio" };
			
			$('.ace-file-name').attr('data-title', fileName);
			$('.ace-file-name').find('i').removeClass().addClass(classNames[fileType]);
			$('.ace-file-container').addClass('selected').attr('data-title', self.config.lang.changeBtn);
			$('.remove').show();
			// end fix
			
	    	$('#'+messageId).empty();
	    	
			if(data.files.length > 1) {
				
				showError(self.config.lang.selectOneFileOnly, messageId);
				data.files.pop();
			}
			else {
				
				$('#'+inputUploadId).unbind('click').click(function () {
					
					data.context = $('#'+inputUploadId);
					
					if(data.files.length == 1 && data.files[0].name == $('.ace-file-name').attr('data-title')) { // second condition is redundant because i added the unbind above
						
						var formData = {};
						
						//formData[self.config.uploadFileParamKey] = uploadFile;
						formData[self.config.pathParamKey] = uploadPath;
						
						data.formData = formData;
						
						data.submit();
					}
				});
			}
	    }).on('fileuploadalways', function (e, data) {
	    	
	    	console.log(e, data);
	    	
	    }).on('fileuploaddone', function (e, data) {
	    	
	    	var valid = true;
	    	
	    	if(typeof data == 'string')
	    		data = $.parseJSON(data);
	    	
	    	if(data && data.result.length) {
	    		
	    		if(data.result[0].code && data.result[0].message && data.result[0].type && data.result[0].type == 0)
		    		valid = false;
	    	}
	    	else
	    		valid = false;
	    	
			if(valid) {
				
				$('.remove').click();
				data.files.pop();
				showSuccess(self.config.lang.fileUploadSuccess, messageId);
				self.getAttachmentsList($('#'+data.fileInput.attr('id')).parents(self.config.selector+':first'));
			}
			else
				showError(self.config.lang.fileUploadFailure, messageId);
	    }).on('fileuploadfail', function (e, data) {
	    	
			showSuccess(self.config.lang.fileUploadFailure, messageId);
	    });
	};
	
	this.addAttachment = function(file) {
		
		var self = this;
		var dropzoneForm = Dropzone.forElement("form#"+this.config.dropZoneContainer);
		var ext = this.getFileExtension(file.name);
		
		dropzoneForm.options.addedfile.call(dropzoneForm, file);
		/*if((ext == 'jpg' || ext == 'jpeg' || ext == 'gif' || ext == 'png') && file.downloadPath != null && file.downloadPath != "")
			dropzoneForm.options.thumbnail.call(dropzoneForm, file, file.downloadPath);
		else
			dropzoneForm.options.thumbnail.call(dropzoneForm, file, this.getFileIconPath(file.name));*/
		file.status = Dropzone.ADDED;
		dropzoneForm.files.push(file);
		
		$(file.previewTemplate).find('.dz-details').click({file: file}, function(e) {
			
			self.downloadAttachment(e.data.file);
		});
		
		//dropzoneForm.emit("addedfile", file);
		//dropzoneForm.emit("thumbnail", file, "http://www.startutorial.com/img/dropzonejs+php+showfile.png");
	};
	
	this.getFileExtension = function(fileName) {
		
		if(fileName && fileName.split('.').length)
			return fileName.split('.')[1];
		return '';
	};
	
	this.getFileIconPath = function(fileName) {
		
		var ext = this.getFileExtension(fileName);			
		var fileType = $.grep(this.config.attachmnentTypes, function(e){ return e.type == ext; });
		
		if(fileType.length == 0) // default icon, if none found
			fileType = $.grep(this.config.attachmnentTypes, function(e){ return e.type == 'file'; });
		
		return this.config.fileTypesIconPath+fileType[0].typeIcon;
	};

	this.downloadAttachment = function(file) {
		
		window.open(file.downloadPath);
	};

	this.removeAttachment = function(file) {

		var self = this;
		
		if(file.status == 'error')
			$(file.previewTemplate).remove();
		else if(file.status == 'canceled')
			$(file.previewTemplate).remove();
		else {
			
			bootbox.confirm(this.config.lang.fileRemoveConfirm, function(result) {

				if(result) {
					
					var  fileName = file.name;	
					var data = {};
					var row = folderId+'~'+file.fileId+'~'+''+'~'+(bucketPath!=''?(bucketPath+'/'):'')+'~'+fileName+'~'+'true';
					
					data[req_selected_to_delete] = row;
				
					$.ajax({
						url : self.config.urls.deleteAttachment,
						data : data,
						context : {
							self: self,
							file : file
						},
						cache : false,
						type : 'POST',
						success : function(dataMap, textStatus, XMLHttpRequest) {
				
							if(dataMap != null && dataMap.status != null && dataMap.status == 'success') {
								
								if(this.file.previewTemplate)
									$(this.file.previewTemplate).remove();
								else if(this.file.attachmentElem)
									this.self.getAttachmentsList(this.file.attachmentElem);
								
								//label hide issue fixed
								if($('.dz-preview').html()=='' || $('.dz-preview').html()==undefined)
									$("#dropzoneForm").removeClass('dz-started');
								showSuccess(this.self.config.lang.fileDeleteSuccess, messageId);
							}
						},
						error : function(XMLHttpRequest, textStatus, errorThrown) {
							
						}
					});
				}
			});
		}
	},

	this.goBack = function() {
		
		window.location = document.referrer;
	};
	
	this.listen = function() {
		
		var self = this;
		
		$(this.config.container).arrive(this.config.selector, function() {
			
			var list = [$(this)];

			self.getCount(list);
		});
		
		return this;
	};

	this.getAttachmentsList = function(elem) {
		
		var list = elem.attr('path').split(this.config.pathSeperator);
		
		var params = [];
		
		$(list).each(function(){
			
			params.push(this.toString());
		});
		
		$.ajax({
			url: this.config.urls.getAttachmentsList,
			data: JSON.stringify(params),
			context: { self: this, list: list },
			method: 'POST',
			dataType: 'json',
			processData: false,
			contentType: "application/json; charset=utf-8",
			cache: false,
			success : function(dataMap, textStatus, XMLHttpRequest) {
	
				if(dataMap.files)
					this.self.config.attachmnents = dataMap.files;
				if(dataMap.fileTypes)
					this.self.config.attachmnentTypes = dataMap.fileTypes;
				
				this.self.buildAttachmentsList(elem, dataMap);
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				
			}
		});
	};
	
	this.buildAttachmentsList = function(elem, dataMap) {

		var html = [];
		var id = elem.attr('id');
		var filesCntrId = id + '-files-cntr';
		var filesTableCntrId = id + '-files-table-cntr';
	
		html.push('<table id="'+filesTableCntrId+'" class="table table-striped table-bordered table-hover">');
		html.push('	<thead>');
		html.push('		<tr>');
		html.push('			<th>'+this.config.lang.fileType+'</th>');
		html.push('			<th>'+this.config.lang.fileName+'</th>');
		html.push('			<th>'+this.config.lang.fileCreatedBy+'</th>');
		html.push('			<th>'+this.config.lang.fileCreatedOn+'</th>');
		html.push('			<th>'+this.config.lang.fileOptions+'</th>');
		html.push('		</tr>');
		html.push('	</thead>');
		html.push('	<tbody>');		
		if(dataMap && dataMap.files) {
			
			for(var i=0; i<dataMap.files.length; i++) {

				var file = dataMap.files[i];
				
				html.push('		<tr>');
				html.push('			<td><img src="'+this.getFileIconPath(file.name)+'" width="23px" /></td>');
				html.push('			<td><a href="JAVASCRIPT:void(0)" downloadPath="'+file.downloadPath+'">'+file.name+'</a></td>');
				html.push('			<td>'+file.createdByFirstName+' '+file.createdByLastName+'</td>');
				html.push('			<td>'+getDateFormatForDisplay(file.createdOn)+'</td>');				
				html.push('			<td nowrap>');
				html.push('				<button class="btn btn-primary btn-xs" downloadPath="'+file.downloadPath+'"><i class=" ace-icon fa fa-download"></i></button>');
				if(this.config.editable && this.config.deleteCheck(file))
					html.push(' 		<button class="btn btn-danger btn-xs" removeAttachment fileId="'+file.fileId+'"><i class=" ace-icon fa fa-trash-o"></i></button>');
				html.push('			</td>');
				html.push('		</tr>');
			}
		}
		html.push('	</tbody>');
		html.push('</table>');
		
		$('#'+filesCntrId).html(html.join(''));
		
		var table = $('#'+filesTableCntrId);
		if(isDataTable(table[0])) {	
			table.dataTable().fnClearTable(false);
			table.dataTable().fnDestroy();
		}
		table.dataTable({
			"iDisplayLength": 10,
			"aLengthMenu": [[10, 20, 25, 50, -1], [10, 20, 25, 50, 100]],
			"aoColumns": [
				null, null, null, null, null
			],		
			"oLanguage": dataTableLang
		});
	};
	
	this.getCount = function(list) {

		var self = this;
		var params = [];
				
		list.each(function(){
						
			params.push($(this).attr("path"));
		});
		
		$.ajax({
			url: this.config.urls.getCount,
			data: JSON.stringify(params),
			context: { self: self, list: list },
			method: 'POST',
			dataType: 'json',
			processData: false,
			contentType: "application/json; charset=utf-8",
			cache: false,
			success: function(data) {

				var self = this.self;
				
				this.list.each(function(i){
					
					$(this).after('<br /><span class="badge '+self.getCountClass(data[i])+'">'+data[i]+'</span>');
				});
			},
			error: function() {}
		});
	};
	
	this.getCountClass = function(count) {
		
		if(count == 0)
			return 'badge-warning';
		else
			return 'badge-primary';
	};
	
	this.viewAttachments = function(url) {
		
		window.location.href = url; 
	};
	
	this.checkViewAttachments = function(elem) {
		
		var url = this.config.urls.viewAttachments + "?" + this.config.pathParamKey + "=" + elem.attr("path");
		
		if(this.config.beforeViewAttachments)
			this.config.beforeViewAttachments(this, url);
		else
			this.viewAttachments(url); 
	};
	
	this.viewAttachmentsEvent = function(e) {

		e.data.self.checkViewAttachments($(this));
	};

	this.downloadAttachmentEvent = function(e) {

		var file = { downloadPath: $(this).attr('downloadPath') };
		
		e.data.self.downloadAttachment(file);
	};

	this.removeAttachmentEvent = function(e) {
		
		var file = { fileId: $(this).attr('fileId'), attachmentElem: $(this).parents(e.data.self.config.selector+':first') };
		
		e.data.self.removeAttachment(file);
	};
	
	this.goBackEvent = function(e) {

		e.data.self.goBack();
	};
};