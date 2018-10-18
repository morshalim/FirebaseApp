var isProxySearch = false;

;(function($) {

function load(settings, root, child, container, children) {
	var data = {};

	data[req_org] = root;
	data[req_org_children] = children;

	isProxySearch = false;
	if(settings.url == getOrgProxyURL)
		isProxySearch = true;

	$.ajax({
	  url: settings.url,
	  data: data,
	  cache: false,
	  success:function(data, textStatus, XMLHttpRequest){
			if($(container).attr('id') == 'organization')
				getMyTeamOrgSuccess(data, textStatus, XMLHttpRequest);
			else if($(container).attr('id') == 'reviewOrganization')
				getReviewOrgSuccess(data, textStatus, XMLHttpRequest);
			else
				getOrgSuccess(data, textStatus, XMLHttpRequest);
	  },
	  error:getOrgError
	});

	function getOrgSuccess(data, textStatus, XMLHttpRequest) {

		if(ECM_DEBUG)$.log ("START getOrgSuccess");
		if(ECM_DEBUG)$.log ("text status: " + textStatus + " response: " + data);

		var jdata = wlxEval(data);

		function createNode(parent) {
			var chiefName = encodeURIComponent(((this.chief.name == "")?this.orgName:this.chief.name)).replace(new RegExp("'", "g"), "\\'");

			var callEvent = "lastTreeClick = '" + this.id + "'; refreshScope('D','X','" + ((!isProxySearch)?this.id:"") + "','" + ((isProxySearch)?this.id:this.chief.pernr) + "')";
			var current = $("<li/>").attr("id", this.id || "").html("<div class='" + ((this.plannable)?"plannable":"not_plannable") + "' " + ((this.plannable)?"style='display:inline;cursor:pointer;text-decoration:underline;' onclick=\"" + callEvent + "\">": "style='display:inline;' >") + ((this.chief.name == "")?"":this.chief.name + " - ") + this.orgName + "</div><div id='tree" + this.id + "' style='display:inline;padding-left:16px;'>&nbsp;</div>").appendTo(parent);

			if (!this.plannable) {
				current.children("div:last").addClass("i_black");
			}
			else if (this.submitted) {
				current.children("div:last").addClass("i_submitted");
			}

			if (this.terminated)
				current.children("div:last").before('&nbsp;<div style="display:inline;"><img style="padding-bottom:3px;" src="../images/terminated.png"/></div>');
			/*if (this.expanded) {
				//current.addClass("open");
			}*/
			if (this.hasChildren || this.children && this.children.length) {
				var branch = $("<ul/>").appendTo(current);
				if (this.hasChildren) {
					current.addClass("hasChildren");
					createNode.call({
						orgName:"placeholder",
						id:"placeholder",
						chief: {name:"placeholder",pernr:"placeholder"},
						plannable:"placeholder",
						children:[]
					}, branch);
				}
				if (this.children && this.children.length) {
					$.each(this.children, createNode, [branch]);
				}
			}
		}

		if(ajaxPreProcess(data))
			return;

		$.each(jdata, createNode, [child]);
        $(container).treeview({add: child});

		if(ECM_DEBUG)$.log ("END getOrgSuccess");
    }

	function getMyTeamOrgSuccess(data, textStatus, XMLHttpRequest) {

		if(ECM_DEBUG)$.log ("START getOrgSuccess");
		if(ECM_DEBUG)$.log ("text status: " + textStatus + " response: " + data);

		var jdata = wlxEval(data);

		function createNode(parent) {
			var chiefName = encodeURIComponent(((this.chief.name == "")?this.orgName:this.chief.name)).replace(new RegExp("'", "g"), "\\'");

			//var callEvent = "lastTreeClick = '" + this.id + "'; refreshScope('D','X','" + ((!isProxySearch)?this.id:"") + "','" + ((isProxySearch)?this.id:this.chief.pernr) + "')";
			var callEvent = "redirectToMyTeam(this)";
			var current = $("<li/>").attr("id", this.id || "").html("<div pernr='"+this.chief.pernr+"' onclick='"+callEvent+"' class='" + ((this.plannable)?"plannable":"not_plannable") + "' " + ((this.plannable)?"style='display:inline;cursor:pointer;text-decoration:underline;'>": "style='display:inline;' >") + ((this.chief.name == "")?"":this.chief.name + " - ") + this.orgName + "</div><div id='tree" + this.id + "' style='display:inline;padding-left:16px;'>&nbsp;</div>").appendTo(parent);


			if (this.terminated)
				current.children("div:last").before('&nbsp;<div style="display:inline;"><img style="padding-bottom:3px;" src="../images/terminated.png"/></div>');
			/*if (this.expanded) {
				//current.addClass("open");
			}*/
			if (this.hasChildren || this.children && this.children.length) {
				var branch = $("<ul/>").appendTo(current);
				if (this.hasChildren) {
					current.addClass("hasChildren");
					createNode.call({
						orgName:"placeholder",
						id:"placeholder",
						chief: {name:"placeholder",pernr:"placeholder"},
						plannable:"placeholder",
						children:[]
					}, branch);
				}
				if (this.children && this.children.length) {
					$.each(this.children, createNode, [branch]);
				}
			}
		}

		if(ajaxPreProcess(data))
			return;

		$.each(jdata, createNode, [child]);
        $(container).treeview({add: child});

		if(ECM_DEBUG)$.log ("END getOrgSuccess");
    }

	function getReviewOrgSuccess(data, textStatus, XMLHttpRequest) {

			if(ECM_DEBUG)$.log ("START getOrgSuccess");
			if(ECM_DEBUG)$.log ("text status: " + textStatus + " response: " + data);

			var jdata = wlxEval(data);

			function createNode(parent) {
				var chiefName = encodeURIComponent(((this.chief.name == "")?this.orgName:this.chief.name)).replace(new RegExp("'", "g"), "\\'");

				//var callEvent = "lastTreeClick = '" + this.id + "'; refreshScope('D','X','" + ((!isProxySearch)?this.id:"") + "','" + ((isProxySearch)?this.id:this.chief.pernr) + "')";
				var callEvent = "searchOrg(this)";
				var current = $("<li/>").attr("id", this.id || "").html("<div pernr='"+this.chief.pernr+"' onclick='"+callEvent+"' class='" + ((this.plannable)?"plannable":"not_plannable") + "' " + ((this.plannable)?"style='display:inline;cursor:pointer;text-decoration:underline;'>": "style='display:inline;' >") + ((this.chief.name == "")?"":this.chief.name + " - ") + this.orgName + "</div><div id='tree" + this.id + "' style='display:inline;padding-left:16px;'>&nbsp;</div>").appendTo(parent);


				if (this.terminated)
					current.children("div:last").before('&nbsp;<div style="display:inline;"><img style="padding-bottom:3px;" src="../images/terminated.png"/></div>');
				/*if (this.expanded) {
					//current.addClass("open");
				}*/
				if (this.hasChildren || this.children && this.children.length) {
					var branch = $("<ul/>").appendTo(current);
					if (this.hasChildren) {
						current.addClass("hasChildren");
						createNode.call({
							orgName:"placeholder",
							id:"placeholder",
							chief: {name:"placeholder",pernr:"placeholder"},
							plannable:"placeholder",
							children:[]
						}, branch);
					}
					if (this.children && this.children.length) {
						$.each(this.children, createNode, [branch]);
					}
				}
			}

			if(ajaxPreProcess(data))
				return;

			$.each(jdata, createNode, [child]);
	        $(container).treeview({add: child});

			if(ECM_DEBUG)$.log ("END getOrgSuccess");
	}


	function getOrgError(XMLHttpRequest, textStatus, errorThrown) {
		if(ECM_DEBUG)$.log ("START getOrgError");
		if(ECM_DEBUG)$.log ("text status: " + textStatus + " errorThrown: " + JSON.stringify(errorThrown));

		if(ajaxPreProcess(errorCode))
			return;

		if(ECM_DEBUG)$.log ("END getOrgError");
    }
}

var proxied = $.fn.treeview;
$.fn.treeview = function(settings) {
	if (!settings.url) {
		return proxied.apply(this, arguments);
	}
	var container = this;
	load(settings, settings.orgId, this, container, "");
	var userToggle = settings.toggle;
	return proxied.call(this, $.extend({}, settings, {
		collapsed: true,
		toggle: function() {
			var $this = $(this);
			if ($this.hasClass("hasChildren")) {
				var childList = $this.removeClass("hasChildren").find("ul");
				childList.empty();
				load(settings, this.id, childList, container, "X");
			}
			if (userToggle) {
				userToggle.apply(this, arguments);
			}
		}
	}));
};

})(jQuery);