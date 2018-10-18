var EmpSearchWidget = function(config){


	this.render = function(){
				//custom autocomplete (category selection)
		if($.widget)
			$.widget( "custom.empSearchWidget", $.ui.autocomplete, {});
		
	
		$('input[render="empSearch"]').each(function(index, element) {
		$(this).bind( "keyup", function( event ) {
				var empId = $(this).attr('empId');
				
				if(empId && empId != null && empId != '') {
					$('[empReset]').val('');
				}
				
				//if(!isNaN($(this).val())){
					$(this).attr('empId','');
				//}
      		}).bind( "focusout", function( event ) {
				var self = this;
				if( $(self).attr('empId') != null &&  $(self).attr('empId') != '')
				$.ajax({
				  url: "../json/EV_CONTACT_MY_LEAD.htm",
				  data: {
					searchTerm: $(self).attr('empId'),
					searchType:$(self).attr("searchType")
				  },
				  beforeSend: function() {
				  },
				  complete: function(){
				  },
				  success: function( data ) {
					if(data == null){
						$(self).attr('empId','');
						$(self).val('');
					}else{
						
						populateLeadContactInfo([data]);
						populateLeadContactCommunicationInfo(data.communications);
						
					}
						
				  }
				});
				
				
      		}).empSearchWidget({
				delay: 0,
				open: function () { 
					$(this).empSearchWidget('widget').css('z-index', 99999);				  
				},
				source: function( request, response ) {
					if( request.term != null &&  request.term != '')
					$.ajax({
					  url: "../json/EV_WIDGET_EMP_SEARCH.htm",
					  data: {
						searchTerm: request.term,
						searchType:$($(this)[0].element).attr("searchType")
					  },
					  beforeSend: function() {
					  },
					  complete: function(){
					  },
					  success: function( data ) {
						var items = [];  
						$.each( data, function( index, obj ) {
							var row = obj.FIRST_NAME  + ' ' + obj.LAST_NAME + ', ' + obj.ACCT_ID;
							var item = {}
							item.label = row;
							item.value = row;
							item.empid = obj.CONTACT_ID;
							items.push(item);
						});					  
					
						response( items );
					  }
					});
				  },
				  select: function( event, ui ) {
					  $(this).siblings('input[empSearchIndex="'+$(this).attr('empSearchIndex')+'"]').val(ui.item.empid);
					  $(this).val(ui.item.label);
					  $(this).attr('empId',ui.item.empid);
					return false;
				  },
				  search: function( event, ui ) {
					if(isNaN($(this).val())){
						return true
					}
					else
						return false;
				  },
				  messages: {
					noResults: '',
					results: function() {}
				  },
				minLength:3
			});
			
			
			
		});							
	}

}