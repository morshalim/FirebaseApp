var TasksController = function(config) {
	
	this.config = {
		systemDateFormat: 'yymmdd',
		container: 'tasksCntr',
		tasks: [],
		summary: true,
		summaryCount: 5,
		completedStatusId: 3,
		dangerDays: 2,
		warningDays: 5,
		moduleId: null,
		urls: {
			getTasks: '../json/GET_TASKS.htm',
			saveTask: '../json/SAVE_TASK.htm',
			changeStatus: '../json/CHANGE_TASK_STATUS.htm'
		},
		lang: {
			title: 'Tasks',
			btn_new: 'New Task',
			btn_mark_completed: 'Mark Completed',
			msgModuleNotConfigured: 'Module ID is not configured.',
			msgSelectTask: 'Please select atleast one task to continue.'
		}
	};
	
	this.init = function() {
		
		$.extend(true, this.config, config);
		
		if(this.config.moduleId == null)
			bootbox.alert(this.config.lang.msgModuleNotConfigured);

		$(document).off('click', '#'+this.config.container+' button[newTask]').on('click', '#'+this.config.container+' button[newTask]', { self: this }, this.newTaskEvent);
		$(document).off('click', '#'+this.config.container+' button[newTaskSave]').on('click', '#'+this.config.container+' button[newTaskSave]', { self: this }, this.newTaskSaveEvent);
		$(document).off('click', '#'+this.config.container+' a[editTask]').on('click', '#'+this.config.container+' a[editTask]', { self: this }, this.editTaskEvent);
		$(document).off('click', '#'+this.config.container+' button[editTaskSave]').on('click', '#'+this.config.container+' button[editTaskSave]', { self: this }, this.editTaskSaveEvent);
		$(document).off('click', '#'+this.config.container+' button[markCompleted]').on('click', '#'+this.config.container+' button[markCompleted]', { self: this }, this.markCompletedEvent);

		//initializing datepicker
		$.fn.bootstrapDP = $.fn.datepicker;
		
		return this;
	};
	
	this.render = function() {

		this.renderTasks(this.config.tasks);

		return this;
	};
	
	this.renderTasks = function(data) {
		this.config.tasks = data;
		if(this.config.summary) 
			this.buildSummary(data);
		else
			this.buildAll(data);

		return this;
	};
	
	this.renderErrors = function(data) {
		
		var errors = [];
		
		for(var i=0; i<data.errorMessages.length; i++) {
		
			errors.push('<li>' + data.errorMessages[i] + '</li>');
		}
		
		if(errors.length)
			$('.modal-body [rel=errorsCntr]').removeClass('hide').find('ul').html(errors.join(''));
	};
	
	this.buildSummary = function(data) {

		var html = [];
		
		html.push('<div class="widget-box transparent">');
		html.push('	<div class="widget-header widget-header-flat">');
		html.push('		<h3 class="widget-title lighter"><i class="ace-icon fa fa-tasks"></i> Tasks	</h3>');
		html.push('		<div class="widget-toolbar">');
		html.push('			<a href="#" data-action="collapse">');
		html.push('				<i class="ace-icon fa fa-chevron-up"></i>');
		html.push('			</a>');
		html.push('		</div>');
		html.push('	</div>');
		html.push('	<div class="widget-body">');
		html.push('		<div class="widget-main">');
		html.push('			<div class="row">');
		html.push('				<div class="col-xs-12">');							
		html.push('					<p>');
		html.push('						<button class="btn btn-xs btn-white" newTask><i class="fa fa-plus"></i> New Task</button>');
		html.push('						<button class="btn btn-xs btn-white" markCompleted><i class="fa fa-check"></i> Mark Completed</button>');
		html.push('					</p>');
		html.push('					<table class="table" width="100%">');
		html.push('						<thead>');
		html.push('							<tr>');
		html.push('								<th></th>');
		html.push('								<th>Task</th>');
		html.push('								<th></th>');
		html.push('								<th>Due Date</th>');
		html.push('							</tr>');
		html.push('						</thead>');
		html.push('						<tbody>');
		for(var i=0; i<data.length; i++) {
			
			var task = data[i];
			var createdDate = Date.parse(task.createdDate);
			var dueDate = Date.parse(task.dueDate);
			var today = Date.today();
			var style = '';
			var icon = '';
			
			createdDate.setHours(0);
			createdDate.setMinutes(0);
			createdDate.setSeconds(0);
			createdDate.setMilliseconds(0);
			dueDate.setHours(0);
			dueDate.setMinutes(0);
			dueDate.setSeconds(0);
			dueDate.setMilliseconds(0);
			today.setHours(0);
			today.setMinutes(0);
			today.setSeconds(0);
			today.setMilliseconds(0);	
			
			if(task.priorityId == 3)
				style = ' style="border-left: 3px solid #ff0000;"';
			else if(task.priorityId == 2)
				style = ' style="border-left: 3px solid #fac00a;"';
			
			if(today.clone().isEqualTo(createdDate))
				icon = '<span class="label label-danger">New</span> ';
			if(today.clone().addDays(1).isEqualTo(dueDate))
				icon += '<i class="ace-icon fa fa-exclamation-triangle bigger-120 orange" data-rel="tooltip" data-trigger="hover" data-placement="top" title="Task due Tomorrow"></i>';
			else if(today.clone().isAfter(dueDate))
				icon += '<i class="ace-icon fa fa-exclamation-triangle bigger-120 red" data-rel="tooltip" data-trigger="hover" data-placement="top" title="' + ((today.clone() - dueDate) / (24*60*60*1000)) + ' days past due"></i>';
			
			html.push('						<tr' + style + '>');
			html.push('							<td class="center">');
			if(task.statusId != this.config.completedStatusId) {
				html.push('							<label class="position-relative">');
				html.push('								<input type="checkbox" class="ace" index="' + i + '" />');
				html.push('								<span class="lbl"></span>');
				html.push('							</label>');
			}
			html.push('							</td>');
			if(task.statusId == this.config.completedStatusId)
				html.push('						<td><strike data-rel="tooltip" data-trigger="hover" data-placement="top" title="' + task.desc + '">' + task.title + '</strike></td>');
			else
				html.push('						<td><a href="javascript:void(0);" class="bigger-110" editTask index="' + i + '">' + task.title + '</a></td>');
			html.push('							<td nowrap="nowrap">' + icon + '</td>');
			html.push('							<td>' + getDateFormatForDisplay(task.dueDate) + '</td>');
			html.push('						</tr>');
			
			if(i == this.config.summaryCount-1)
				break;
		}
		if(data.length == 0) {

			html.push('						<tr>');
			html.push('							<td colspan="4">No Tasks Found</td>');
			html.push('						</tr>');
		}
		html.push('						</tbody>');
		html.push('					</table>');
		if(data.length > this.config.summaryCount) {
			
			html.push('				<p class="pull-right">');
			html.push('					<a href="javascript:void(0);">See All ' + data.length + ' Tasks <i class="ace-icon fa fa-angle-double-right"></i></a>');
			html.push('				</p>');
		}
		html.push('				</div>');
		html.push('			</div>');
		html.push('		</div>');
		html.push('	</div>');
		html.push('</div>');
		
		$('#'+this.config.container).html(html.join(''));
		
		$('[data-rel=tooltip]').tooltip();
	};
	
	this.buildAll = function(data) {
	
	};
	
	this.buildTaskPopup = function(task) {
		
		var html = [];
		
		var title = '';
		var desc = '';
		var dueDate = '';
		var priority = '';
		
		if(task != null) {

			title = task.title;
			desc = task.desc;
			dueDate = getDateFormatForDisplay(task.dueDate);
			priority = task.priorityId;
			
			html.push('<p>Enter task details and click OK to edit existing task.</p>');
		}
		else
			html.push('<p>Enter task details and click OK to create a new task.</p>');
		
		html.push('<div rel="errorsCntr" class="row hide">');
		html.push('	<div class="col-xs-12">');
		html.push('		<div class="alert alert-block alert-danger">');
		html.push('			<button type="button" class="close" data-dismiss="alert">');
		html.push('				<i class="icon-remove"></i>');
		html.push('			</button>');
		html.push('			<ul></ul>');
		html.push('		</div>');
		html.push('	</div>');
		html.push('</div>');		
		html.push('<form class="form-horizontal" role="form">');
		html.push('	<div class="form-group">');
		html.push('		<label class="col-sm-3 control-label no-padding-right"> Task </label>');
		html.push('		<div class="col-sm-9">');
		html.push('			<input type="text" rel="title" placeholder="Enter title for the task" class="col-xs-10 col-sm-10" value="' + title + '" />');
		html.push('		</div>');
		html.push('	</div>');
		html.push('	<div class="form-group">');
		html.push('		<label class="col-sm-3 control-label no-padding-right"> Description </label>');
		html.push('		<div class="col-sm-8">');
		html.push('			<textarea rel="desc" class="form-control" placeholder="Enter details about the task...">' + desc + '</textarea>');
		html.push('		</div>');
		html.push('	</div>');
		html.push('	<div class="form-group">');
		html.push('		<label class="col-sm-3 control-label no-padding-right"> Due Date </label>');
		html.push('		<div class="col-sm-9">');
		html.push('			<input type="text" rel="dueDate" placeholder="Enter Due Date" class="col-xs-4 col-sm-4" value="' + dueDate + '" />');
		html.push('		</div>');
		html.push('	</div>');
		html.push('	<div class="form-group">');
		html.push('		<label class="col-sm-3 control-label no-padding-right"> Priority </label>');
		html.push('		<div class="col-sm-9">');
		html.push('			<select rel="priority"><option value="">Select Priority</option><option value="1"' + ((priority == 1) ? ' selected' : '') + '>Low</option><option value="2"' + ((priority == 2) ? ' selected' : '') + '>Medium</option><option value="3"' + ((priority == 3) ? ' selected' : '') + '>High</option></select>');		
		html.push('		</div>');
		html.push('	</div>');			
		html.push('</form>');
		
		return html.join('');
	};

	this.getTasks = function() {
		
		$.ajax({
			url: this.config.urls.getTasks,
			data: data,
			context: { self: this },
			cache: false,
			type: 'POST',
			success: function(dataMap, textStatus, XMLHttpRequest) {
	
				if(dataMap != null && dataMap.hasErrors == false) {
					
					if(this.self.config.summary) 
						this.self.buildSummary(dataMap);
					else
						this.self.buildAll(dataMap);
				}
				else
					this.self.renderErrors(dataMap);
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {}
		});		
	};	
	
	this.newTask = function() {
		
		var self = this;
		
		bootbox.dialog({
			message: this.buildTaskPopup(),
			title: 'Create New Task',
			buttons: {
				success: {
					label: 'OK',
					className: 'btn-primary',
					callback: function(e) {
										
						self.newTaskSave();
						return false;
					}					
				},
				danger: {
					label: 'CANCEL',
					className: 'btn-default'
				}											
			}
		});

		$('.modal-body .btn-primary').attr('newTaskSave', '');
		$('.modal-body [rel=dueDate]').bootstrapDP({});
	};

	this.newTaskSave = function() {

		var data = {};
		var errors = [];
		var title = $('.modal-body [rel=title]').val();
		var desc = $('.modal-body [rel=desc]').val();
		var dueDate = $.datepicker.formatDate(this.config.systemDateFormat, $('.modal-body [rel=dueDate]').bootstrapDP('getDate'));
		var priority = $('.modal-body [rel=priority]').val();
		
		if(title == '')
			errors.push('<li>Please enter a Title.</li>');
		if(desc == '')
			errors.push('<li>Please enter a Description.</li>');
		if(dueDate == '')
			errors.push('<li>Please enter a Due Date.</li>');
		if(priority == '')
			errors.push('<li>Please enter a Priority.</li>');
		
		$('.modal-body [rel=errorsCntr]').addClass('hide');
		
		if(errors.length)
			$('.modal-body [rel=errorsCntr]').removeClass('hide').find('ul').html(errors.join(''));
		else {
		
			data['title'] = title;
			data['desc'] = desc;
			data['dueDate'] = dueDate;
			data['priorityId'] = priority;
			
			$.ajax({
				url: this.config.urls.saveTask,
				data: data,
				context: { self: this },
				cache: false,
				type: 'POST',
				success: function(dataMap, textStatus, XMLHttpRequest) {
		
					if(dataMap != null && dataMap.hasErrors == false) {
						
						this.self.renderTasks(dataMap.tasks);
						bootbox.hideAll();
					}
					else
						this.self.renderErrors(dataMap);
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {}
			});
		}
	};
	
	this.editTask = function(index) {

		var self = this;
		
		this.currentTask = this.config.tasks[index];
		
		bootbox.dialog({
			message: this.buildTaskPopup(this.currentTask),
			title: 'Edit Existing Task',
			buttons: {
				success: {
					label: 'OK',
					className: 'btn-primary',
					callback: function(e) {
										
						self.editTaskSave();
						return false;
					}
				},
				danger: {
					label: 'CANCEL',
					className: 'btn-default'
				}
			}
		});

		$('.modal-body .btn-primary').attr('editTaskSave', '');
		$('.modal-body [rel=dueDate]').bootstrapDP({});
	};

	this.editTaskSave = function() {

		var self = this;
		var data = {};
		var errors = [];
		var title = $('.modal-body [rel=title]').val();
		var desc = $('.modal-body [rel=desc]').val();
		var dueDate = $.datepicker.formatDate(this.config.systemDateFormat, $('.modal-body [rel=dueDate]').bootstrapDP('getDate'));
		var priority = $('.modal-body [rel=priority]').val();
		
		if(title == '')
			errors.push('<li>Please enter a Title.</li>');
		if(desc == '')
			errors.push('<li>Please enter a Description.</li>');
		if(dueDate == '')
			errors.push('<li>Please enter a Due Date.</li>');
		if(priority == '')
			errors.push('<li>Please enter a Priority.</li>');
		
		$('.modal-body [rel=errorsCntr]').addClass('hide');
		
		if(errors.length)
			$('.modal-body [rel=errorsCntr]').removeClass('hide').find('ul').html(errors.join(''));
		else {
		
			data['taskId'] = this.currentTask.taskId;
			data['title'] = title;
			data['desc'] = desc;
			data['dueDate'] = dueDate;
			data['priorityId'] = priority;
			
			$.ajax({
				url: self.config.urls.saveTask,
				data: data,
				context: { self: self },
				cache: false,
				type: 'POST',
				success: function(dataMap, textStatus, XMLHttpRequest) {
	
					if(dataMap != null && dataMap.hasErrors == false) {
						
						this.self.renderTasks(dataMap.tasks);
						bootbox.hideAll();
					}
					else
						this.self.renderErrors(dataMap);
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {}
			});
		}
	};
	
	this.changeStatus = function(statusId) {

		var data = {};		
		var cbs = $('#'+this.config.container+' :checked');
		var taskIds = [];
		
		if(cbs.length == 0) {
		
			bootbox.alert(this.config.lang.msgSelectTask);
			return false;
		}
		
		for(var i=0; i<cbs.length; i++) {
		
			var cb = $(cbs[i]);
			var task = this.config.tasks[cb.attr('index')];
			
			taskIds.push(task.taskId);
		}
		
		data['statusId'] = statusId;
		data['taskIds'] = taskIds.join(',');
		
		$.ajax({
			url: this.config.urls.changeStatus,
			data: data,
			context: { self: this },
			cache: false,
			type: 'POST',
			success: function(dataMap, textStatus, XMLHttpRequest) {

				if(dataMap != null && dataMap.hasErrors == false) {
						
					this.self.renderTasks(dataMap.tasks);
					bootbox.hideAll();
				}
				else
					this.self.renderErrors(dataMap);
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {}
		});
	};
	
	this.newTaskEvent = function(e) {

		e.data.self.newTask();
	};
	
	this.newTaskSaveEvent = function(e) {

		e.data.self.newTaskSave();
	};
	
	this.editTaskEvent = function(e) {

		e.data.self.editTask($(this).attr('index'));
	};
	
	this.editTaskSaveEvent = function(e) {

		e.data.self.editTaskSave();
	};
	
	this.markCompletedEvent = function(e) {

		var self = e.data.self;
		self.changeStatus(self.config.completedStatusId);
	};
};