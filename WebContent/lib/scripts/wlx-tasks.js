var form = '';
$(function() {
	loadTasks(taskList);
	form = $('#task-form-div').html();
	 $('#task-form-div').remove();
});

function loadTasks(taskList){
	if(taskList)
	{
		var html = [];
		var elem;
		for(var i=0; i<taskList.length; i++)
		{
			elem = taskList[i];
			html.push('<tr>');
			html.push('	<td>'+elem.id+'</td>');
			html.push('	<td><a onClick="popEdit(this)">'+elem.name+'</a></td>');
			tml.push('	<td><a onClick="deleteTask(this)">delete</a></td>');
			
			
			html.push('</tr>');
		}
		$('#taskList-table-cntr tbody').html(html.join(''));
		
		$('#taskList-count').html(taskList.length);

		var table = $('#taskList-table-cntr');

		if(isDataTable(table[0]))
		{
			table.dataTable().fnClearTable(false);
			table.dataTable().fnDestroy();
		}

		table.dataTable({
			"iDisplayLength": 20,
    		"aLengthMenu": [[10, 20, 25, 50, -1], [10, 20, 25, 50, 100]],
    		"oLanguage": dataTableLang	
				});
	}
}

function isDataTable(nTable)
{
    var settings = $.fn.dataTableSettings;
    for (var i=0, iLen=settings.length; i<iLen; i++)
    {
        if ( settings[i].nTable == nTable )
        {
            return true;
        }
    }
    return false;
}

//type: 0>create , 1> edit
function popup(type, elem)
{
	if(type == 0){
		bootbox.dialog(form, []);
		clearForm();
	}else if(type == 1){
		$('#page-error-cntr').empty();	
		$.ajax({
			url: config.url.getTask,
			data:{taskId: $(elem).attr('ref')},
			cache: false,
			success: function(data,textStatus, XMLHttpRequest){				
				bootbox.dialog(resultBudget, []);
				empdetails["emp_id"] = $(event).attr('empId');
				empdetails["mgr_id"] = $(event).attr('mgrID');
				loadInitialBudgetSetup(data,empdetails);
				closeLoading();
			},
			error: function()
			{
				
			}
		});		
	}
}

//task: task attributes
//actionType: 0>create , 1>edit, 2>delete
function action(task,actionType)
{

}

function clearForm(){
	$('#task-form input[name="taskId"]').val('');
	$('#task-form input[name="name"]').val('');
	$('#task-form input[name="desc"]').val('');
	$('#task-form input[name="script"]').val('');	
}

function populateForm(task,type){
	
	$('#task-form input[name="taskId"]').val(task.taskId);
	$('#task-form input[name="name"]').val(task.name);
	$('#task-form input[name="desc"]').val(task.desc);
	$('#task-form input[name="script"]').val(task.script);
	
	if(type == 1)
		$('#task-form input[name="taskId"]').attr('readonly',true);
	else
		$('#task-form input[name="taskId"]').attr('readonly',false);	
}

function getTask(task){

}


