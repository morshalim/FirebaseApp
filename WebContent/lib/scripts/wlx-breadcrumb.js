$(document).ready(function() {


});

function buildBreadCrumbHeader(breadcrumbId,breadcrumbTitle){


		var title = breadcrumbTitle.split('~');
		var html = [];
		var max = title.length;
		var params;

		if(breadcrumbId == 'CONFIGURATION' || ((breadcrumbId == 'MANAGE_KPILIBS' || breadcrumbId == 'MANAGE_KPIS' || breadcrumbId == 'VIEW_PROXY_SETUP')&& breadcrumbTitle!=null && breadcrumbTitle!="" && breadcrumbTitle.indexOf('undefined')==-1)){
			html.push('<li><i class="fa fa-wrench"></i> <a href="#">'+lang.js_portal_menu_menu_administration+'</a><span class="divider"><i class="icon-angle-right"></i></span></li>');

			if(breadcrumbTitle!=null && breadcrumbTitle!=''){
				if(title.length>1)
					html.push('<li class="active"><a href="EV_VIEW_SHOW_CONFIGURATION.htm">'+lang.js_portal_menu_menu_config+'</a><span class="divider"><i class="icon-angle-right"></i></span></li>')
				for(var i=0;i<title.length;i++){
					if(i== max-1){
						if(breadcrumbId != 'MANAGE_KPIS' || breadcrumbId == 'VIEW_PROXY_SETUP')
							html.push('<li id="breadCrumbActiveClass" class="active"> '+title[i]+' </li>');
						else{
							html.push('<li class="active"><a href="EV_VIEW_KPI_LIBS.htm?crt_req_param='+breadCrumbHeader+'">'+title[i]+'</a><span class="divider"><i class="icon-angle-right"></i></span></li>');
							html.push('<li class="active">'+lang.js_breadcrumb_maintain_kpi_library_text+'</li>');
						}
						if((title[i]!=''&& title[i]!=null)&&($('#pageSubTitle').text()!=''&& $('#pageSubTitle').text()!=null))
						$('#pageSubTitle').html($('#pageSubTitle').html().replace($('#pageSubTitle').text(), " "+title[i]));
					}
					else{
						if(i==0)
							params = title[i];
						else
							params = params + '~'+title[i];
						html.push('<li class="active"><a href="EV_VIEW_SHOW_CONFIGURATION.htm?'+req_breadcrumb_parameter+'='+params+'"> '+title[i]+' </a><span class="divider"><i class="icon-angle-right"></i></span></li>');
					}
				}
			}else if(breadcrumbTitle==null ||breadcrumbTitle=='')
				html.push('<li id="breadCrumbActiveClass" class="active"> '+lang.js_portal_menu_menu_config+' </li>');
			$('.breadcrumb').html(html.join(''));
		}else if(breadcrumbId == 'MANAGE_KPILIBS' || breadcrumbId == 'MANAGE_KPIS' || breadcrumbId == 'VIEW_PROXY_SETUP'){
			html.push('<li><i class="fa fa-wrench"></i> <a href="#">'+lang.js_portal_menu_menu_administration+'</a><span class="divider"><i class="icon-angle-right"></i></span></li>');
			html.push('<li class="active"><a href="#">'+lang.js_breadcrumb_performance_text+'</a><span class="divider"><i class="icon-angle-right"></i></span></li>');
			if(breadcrumbId == 'MANAGE_KPILIBS'){
				html.push('<li class="active">'+lang.js_breadcrumb_manage_kpi_libraries_text+'</li>');
			}else if(breadcrumbId == 'VIEW_PROXY_SETUP'){
					html.push('<li class="active">'+lang.js_breadcrumb_proxy_setup_text+'</li>');
			}else{
				html.push('<li class="active"><a href="EV_VIEW_KPI_LIBS.htm">Manage KPI Libraries</a><span class="divider"><i class="icon-angle-right"></i></span></li>');
				html.push('<li class="active">'+lang.js_breadcrumb_maintain_kpi_library_text+'</li>');
			}
			$('.breadcrumb').html(html.join(''));
		}



}