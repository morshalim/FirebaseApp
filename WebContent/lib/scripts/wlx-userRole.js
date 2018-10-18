$(document).ready(function(){	
	$("#userSelectedList option").attr("selected",false);
	$('#selectedAvailableList option').attr('selected',false);
	$('#userId').click(function() {
		$('#myResults').attr('class', '');
		$("#myResults").empty();
	});
	
	$('#selectedAvailableList').dblclick(function() {
		$('#myResults').attr('class', '');
		$("#myResults").empty();
	   	var targetList=$('#selectedAvailableList option:selected');
		targetList.appendTo('#userSelectedList');         
	   });
	$('#userSelectedList').dblclick(function() {
		$('#myResults').attr('class', '');
		$("#myResults").empty();
	   	var targetList=$('#userSelectedList option:selected');
		targetList.appendTo('#selectedAvailableList');
	});
	 $('#moveToRight').click(function(){
		$('#myResults').attr('class', '');
		$("#myResults").empty();
		 var targetList=$('#selectedAvailableList option:selected');
	     targetList.appendTo('#userSelectedList');
	});
	 $('#moveToLeft').click(function(){
	 	$('#myResults').attr('class', '');
		$("#myResults").empty();
		 var targetList=$('#userSelectedList option:selected');
	     targetList.appendTo('#selectedAvailableList');
	});
	 $('#moveAllToRight').click(function(){
	 	$('#myResults').attr('class', '');
		$("#myResults").empty();
		 var targetList=$('#selectedAvailableList option').attr('selected','selected');
	     targetList.appendTo('#userSelectedList');
	});
	 $('#moveAllToLeft').click(function(){
 		$('#myResults').attr('class', '');
		$("#myResults").empty();
		 var targetList=$('#userSelectedList option').attr('selected','selected');
	     targetList.appendTo('#selectedAvailableList');
	});
	 $('#userRoleVO').submit(function(){
	 	$('#myResults').attr('class', '');
		$("#myResults").empty();
     	$("#userSelectedList option").attr("selected","selected");
     	$('#selectedAvailableList option').attr('selected','selected');
      });

	 $('#userId').change(function() {
		$('#myResults').attr('class', '');
		$("#myResults").empty();
		 var user = $('#userId option:selected').val();
		 getRolesForUser(user, 'selectedAvailableList', 'userSelectedList');
	 });

});

function pushIntoAvailableSelectedRole(availableGroup, selectedGroup, AvailEleId, selEleId) {
	var availGroup = availableGroup || '';
	var selGroup = selectedGroup || '';
	var availElement = AvailEleId || '';
	var selElement = selEleId || '';

	if(availGroup != '' && availGroup != null) {
		$("#"+availElement).html('');
		$.each(availGroup, function(index) {
			$("#"+availElement).append('<option value="'+availGroup[index].itemId+'">'+availGroup[index].itemValue+'</option>');
		});
	} else {
		$("#"+availElement).html('');
	}

	if(selGroup != '' && selGroup != null) {
		$("#"+selElement).html('');
		$.each(selGroup, function(index) {
			$("#"+selElement).append('<option value="'+selGroup[index].itemId+'">'+selGroup[index].itemValue+'</option>');
		});
	} else {
		$("#"+selElement).html('');
	}
}


