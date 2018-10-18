$(document).ready(function () {
	$("#proxySearch").fancybox({
		'transitionIn': 'elastic',
		'transitionOut': 'elastic',
		'enableEscapeButton': true,
		'scrolling': 'no',
		'titleShow': false,
		'overlayOpacity': .45,
		'overlayColor': '#000',
		'showNavArrows': false,
		'width': 600,
		'height': 'auto',
		'autoDimensions': false,
		'onStart'	:	
			function(selectedArray, selectedIndex, selectedOpts) {
				$('.search').val(langMap.search_proxy_initial)
				$('.search').addClass('dis');
				switch_tabs($('#proxyTabs li').first());
				var elem = null;
					elem = $('#proxyManagerSearchResults');
					elem.html("");
					elem.hide();
					elem = $('#proxyAssociatesSearchResults');
					elem.html("");					
					elem.hide();					
			}	
	});
	
	$('#proxyTabs li').click(function () {
		switch_tabs($(this));
		$.fancybox.resize();
	});

	
	if(isProxyEnabled)
	{
		$('#proxySearch2').show();
		if(isProxy)
		{
			if($('#header').length > 0)
				$('#header').addClass("proxy_note_spacer");
			if($('#dash_header').length > 0)
			{
				$('#dash_header').show();
				$('#dash_header').addClass("proxy_note_spacer");
			}
			$('#proxy_note').show();
			$(window).scroll(function () {
				$('#proxy_note').animate({ top: $(window).scrollTop() + "px" }, { queue: false, duration: 350 });
			});		
		}		
	}
	
	
	//highlights textboxes on focus
	$('.search').blur(function () {
		 if($(this).val() == "")
		 {
		 	$(this).val(langMap.search_proxy_initial);
			$(this).addClass("dis")
		 }		
	})
	 .focus(function () {
		 if($(this).val() == langMap.search_proxy_initial)
		 {
		 	$(this).val("");
			$(this).removeClass("dis")
		 }
		
	 });
	 
	 

	
	
});

function switch_tabs(obj) {
	$('.tab_content').hide();
	$('#proxyTabs li').removeClass("current");
	var id = obj.attr("rel");

	if(id == "browse_org")
	{
		if($("#orgProxy").html() == "")
			getOrg("orgProxy", defaultOrg);		
	}

	$('#' + id).show();
	obj.addClass("current");
	
}

function getManagerSearchResults()
{
	var searchStr = $('#managerSearch').val();
	getSearchProxy(searchStr, true);
}

function getAssociateSearchResults()
{
	var searchStr = $('#associateSearch').val();
	getSearchProxy(searchStr, false);	
}

function loadSearchResults(data, isManager, searchStr)
{

	var tbody = [];
	
    tbody.push('<table class="tablesorter" cellspacing=0>');
    tbody.push('	<thead>\n');
    tbody.push('		<tr>\n');
    
	if(isManager)
	{
		tbody.push('			<th></th>\n');
		tbody.push('			<th>' + langMap.search_managerName + '</th>\n');
	}
	else
		tbody.push('			<th>' + langMap.search_associateName + '</th>\n');
	
    tbody.push('			<th>' + langMap.search_pernr + '</th>\n');
    tbody.push('			<th>' + langMap.search_title + '</th>\n');

	if(!isManager)
		tbody.push('			<th>' + langMap.search_associateManagerName + '</th>\n');
		
    tbody.push('			<th class="align_c">' + langMap.search_proxyAs + '</th>\n');
    tbody.push('		</tr>\n');
    tbody.push('	</thead>\n');
    tbody.push('	<tbody>\n');

	for(var x = 0; x < data.length; x++)
	{
		
		var entry = data[x];
		
		var chiefName = encodeURIComponent(((isManager)?entry.firstName + " " + entry.lastName:entry.mgrFirstName + " " + entry.mgrLastName));
		//var callEvent = "refreshScope('D','X','','" + chiefName + "','" + ((isManager)?entry.pernr:entry.mgrPernr) + "')";	
		var callEvent = "refreshScope('D','X','" + entry.repOrgId + "','"+entry.pernr+"')";			
		
		tbody.push('		<tr>\n');
		
		if(isManager)	
		{
			tbody.push('			<td>');
			if(entry.planningComplete)
			{
				tbody.push('<img id="' + entry.pernr + entry.repOrgId + '_search_sub_img" src="' + imageBuilder(rp, 'icon_submitted', postImg, 'gif') + '" />');
				
				$('#btholder').append('<div id="' + entry.pernr + entry.repOrgId + '_search_sub_pop" style="display:none;"><pre class="tip">' + 
						langMap.search_submitted + 
						   '</pre></div>\n');					

			}
				
			tbody.push('</td>	\n');
		}

		if(isManager)
			tbody.push('			<td><a href="#" onClick="' + callEvent + '">' + entry.firstName + " " + entry.lastName  + '</a><br />' + entry.repOrgName + '</td>\n');			
		else
			tbody.push('			<td><a href="#" onClick="' + callEvent + '">' + entry.firstName + " " + entry.lastName + '</a></td>\n');			
			
		tbody.push('			<td><span>' + entry.pernr + '</span></td>\n');
		tbody.push('			<td class="">' + entry.posTitle + '</td>\n');
		
		if(!isManager)
			tbody.push('			<td>' + entry.mgrFirstName + " " + entry.mgrLastName + '</td>\n');		
		
		var popId = "manager";
		if(!isManager)
			popId = "associate"
			

		tbody.push('			<td class="align_c"> <a class="bttn_white" href="#" onClick="' + callEvent + '"><span><img id="' + entry.pernr + entry.repOrgId + '_search_' + popId + '_proxy_img" src="' + imageBuilder(rp, 'icon_edit_as_proxy', postImg, 'gif') + '" /></span></a></td>\n');

		$('#btholder').append('<div id="' + entry.pernr + entry.repOrgId + '_search_' + popId + '_proxy_pop" style="display:none;"><pre class="tip">' + 
				langMap.search_proxy_as + ((isManager)?entry.firstName + " " + entry.lastName:entry.mgrFirstName + " " + entry.mgrLastName) +
				   '</pre></div>\n');		
		
		tbody.push('		</tr>\n');
	}
	
	
	
	if(data.length == 0)
	{
		tbody.push('		<tr>\n');
		tbody.push('			<td colspan="6">');				
		tbody.push(langMap.search_noResults1 + " <b>" + removeBad(searchStr) + "</b> " + langMap.search_noResults2);				
		tbody.push('			</td>	\n');		
		tbody.push('		</tr>\n');
	}

    tbody.push('	</tbody>\n');
    tbody.push('</table>\n');
	var elem = null;
	if(isManager)
		elem = $('#proxyManagerSearchResults');
	else
		elem = $('#proxyAssociatesSearchResults');

	elem.html(tbody.join(''));
	elem.show();
	
	if(isManager)
		$('#proxyManagerSearchResults > table').tablesorter();
	else
		$('#proxyAssociatesSearchResults > table').tablesorter();


	for(var x = 0; x < data.length; x++)
	{
		var entry = data[x];		
		
		var popId = "manager";
		if(!isManager)
			popId = "associate"		
		
		if(isManager)
		{
			if(entry.planningComplete)
			$('#' + entry.pernr + entry.repOrgId + "_search_sub_img")
				.bubbletip(
							$('#' + entry.pernr + entry.repOrgId +"_search_sub_pop")
							,{	delayShow: 0,
								delayHide: 0,
								calculateOnShow: true
							});
		}

		$('#' + entry.pernr + entry.repOrgId + "_search_" + popId + "_proxy_img")
			.bubbletip(
						$('#' + entry.pernr + entry.repOrgId + "_search_" + popId + "_proxy_pop")
						,{	delayShow: 0,
							delayHide: 0,
							calculateOnShow: true
						});	
		
	}
	
	$.fancybox.resize();
}

