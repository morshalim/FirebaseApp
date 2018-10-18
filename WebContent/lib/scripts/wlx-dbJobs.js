$(function(){
	$("#run-jobs-btn").on('click',function(){
		$('#page-error-cntr').empty();
		runDBJobs();
	});
});
function runDBJobs()
{
	var data = {};
	data[req_db_job] = $('#dbJobSelect').val();	
	$.ajax({
		url: dbJobsURL,
		data: data,
		cache: false,
		success: runDBJobsSuccess,
		error: runDBJobsError		
	});
}
function runDBJobsSuccess(data, textStatus, XMLHttpRequest){
	if(data=='')
		showSuccess(langMap.js_db_job_success,'page-error-cntr');
	else
		showError(langMap.js_db_job_fail,'page-error-cntr');
}
function runDBJobsError(XMLHttpRequest, textStatus, errorThrown)
{
	showError(langMap.js_db_job_fail,'page-error-cntr');
}