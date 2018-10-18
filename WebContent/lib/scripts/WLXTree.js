    var myTree = null;
	
	var WLXTreeController = function(config) {
		this.myTree;
		this.defaultConfig = {
			nodeCtr: 0,
			nodeLabelsMaxLength: 20,
			treeObj: "myTree",
			treeCntr: "myTreeContainer",
			loadingCntr: "floater",
			rootNodeId: "",
			rootNodeOType: "",
			iNavigateUp: true,
			iDirectReportView: false,
			iDirectReportViewSiblingPerRow: 4,
			iRootOrientation: WLXTree.RO_TOP,
			iNodeJustification: WLXTree.NJ_TOP,
			topYAdjustment: 10500,//pushes according to div
			topXAdjustment: 10500, //pushes according to div
			defaultNodeWidth: 180 ,
			defaultNodeHeight: 150,
			linkColor: "#000000",
			nodeColor: "#99BBFF",
			nodeBorderColor: "#505050",
			rp: "widgets/orgTree/",
			expandedImage: 'images/minus16.gif',
			collapsedImage: 'images/plus16.gif',
			makeRootImage: 'images/up16.gif',
			transImage: 'images/trans.gif',
			uploadImage: 'images/upload.gif',
			emailImage: 'images/email.png',
			updateCallBack: null,

			ajaxCallType: 'XML',
			createTreeAjaxCall: function(nodeId, oType) { 
				return 'http://rocky.thinxsoftware.com:50100/irj/servlet/prt/portal/prteventname/loadTreeNodes/prtroot/com.thinxsoftware.liveorg.sp.LiveOrgSPDriver?viewid=V1&itemviewid=IV11&modelid=&id=' + nodeId;
			},
			addNodeAjaxCall: function(nodeId, node) { 
				return 'http://rocky.thinxsoftware.com:50100/irj/servlet/prt/portal/prteventname/expandTreeNode/prtroot/com.thinxsoftware.liveorg.sp.LiveOrgSPDriver?viewid=V1&itemviewid=IV11&modelid=&id=' + nodeId;
			},
			getParentTreeAjaxCall: function(nodeId, node) { 
				return 'http://rocky.thinxsoftware.com:50100/irj/servlet/prt/portal/prteventname/getRealParentTreeNode/prtroot/com.thinxsoftware.liveorg.sp.LiveOrgSPDriver?viewid=V1&itemviewid=IV11&modelid=&id=' + nodeId;
			},
			setClickedNodeAjaxCall: function(nodeId, node) { 
				return 'http://rocky.thinxsoftware.com:50100/irj/servlet/prt/portal/prteventname/setClickedNode/prtroot/com.thinxsoftware.liveorg.sp.LiveOrgSPDriver?viewid=V1&itemviewid=IV11&modelid=&id=' + nodeId;
			}
		};
	
		this.init = function() {

			var self = this;
			
			$.extend(true, this.defaultConfig, config);
			this.config = this.defaultConfig;
			
			myTree = new WLXTree(this.config.treeObj, this.config.treeCntr, this.config.floater);

			myTree.config.iNavigateUp = this.config.iNavigateUp;
			myTree.config.iRootOrientation = this.config.iRootOrientation;
			myTree.config.iNodeJustification = this.config.iNodeJustification;
			myTree.config.topYAdjustment = this.config.topYAdjustment;
			myTree.config.topXAdjustment = this.config.topXAdjustment;
			myTree.config.defaultNodeWidth = this.config.defaultNodeWidth ;
			myTree.config.defaultNodeHeight = this.config.defaultNodeHeight;
			myTree.config.linkColor = this.config.linkColor;
			myTree.config.nodeColor = this.config.nodeColor;
			myTree.config.nodeBorderColor = this.config.nodeBorderColor;
			myTree.config.nodeFill = WLXTree.NF_FLAT;
			myTree.config.expandedImage = this.config.rp + this.config.expandedImage;
			myTree.config.collapsedImage = this.config.rp + this.config.collapsedImage;
			myTree.config.makeRootImage = this.config.rp + this.config.makeRootImage;
			myTree.config.transImage = this.config.rp + this.config.transImage;
			myTree.config.uploadImage = this.config.rp + this.config.uploadImage;
			myTree.config.emailImage = this.config.rp + this.config.emailImage;
			
			myTree.config.updateCallBack = this.config.updateCallBack;

			myTree.ajaxConfig.ajaxCallType = this.config.ajaxCallType;
			myTree.ajaxConfig.createTreeAjaxCall = this.config.createTreeAjaxCall;
			myTree.ajaxConfig.addNodeAjaxCall = this.config.addNodeAjaxCall;
			myTree.ajaxConfig.getParentTreeAjaxCall = this.config.getParentTreeAjaxCall;
			myTree.ajaxConfig.setClickedNodeAjaxCall = this.config.setClickedNodeAjaxCall;
			
			//default the view to n per row
			if(this.config.iDirectReportView) {
			
				myTree.config.iDirectReportView = this.config.iDirectReportView;
				myTree.config.iDirectReportViewSiblingPerRow = this.config.iDirectReportViewSiblingPerRow;
			}
			
			myTree.parseNodes = this.config.parseNodes || function(inXML) {
			
				var myXML;
				var myNodes;
				var myAttributes;
				var myMetaData;
				myXML = inXML.documentElement;

				myNodes = myXML.getElementsByTagName("node");

				var str = [];

				if (myNodes.length == 0)
					alert("No nodes found.");

				for (var nodeCounter = 0; nodeCounter < myNodes.length; nodeCounter++) {
					var node = myNodes.item(nodeCounter);
					//build script tag
					str.push("		    var hash = [];\n");
					myAttributes = node.getElementsByTagName("attribute");
					var descCtr = 0;
					for (var attCounter = 0; attCounter < myAttributes.length; attCounter++) {
						var myAttribute = myAttributes.item(attCounter);
						str.push("		    var myObj" + descCtr + " = new WLXObj('" + myAttribute.getAttribute("data").replace(/'/g, "\\'") + "',");

						if (myAttribute.getAttribute("target") == "")
							str.push("null");
						else
							str.push("'" + myAttribute.getAttribute("target") + "'");

						str.push(",");

						if (myAttribute.getAttribute("isSearchable") == "0")
							str.push("false");
						else
							str.push("true");


						str.push(");\n");

						str.push("		    hash['" + myAttribute.getAttribute("hash") + "'] = myObj" + descCtr + ";\n");

						descCtr++;
					}


					str.push("		    var hash_meta = [];\n");

					myMetaDatas = node.getElementsByTagName("metadata");
					var metaCtr = 0;
					for (var metaCounter = 0; metaCounter < myMetaDatas.length; metaCounter++) {
						var myMetaData = myMetaDatas.item(metaCounter);
						str.push("		    var myObj" + metaCtr + "_meta = new WLXObj('" + myMetaData.getAttribute("data").replace(/'/g, "\\'") + "',");

						if (myMetaData.getAttribute("target") == "")
							str.push("null");
						else
							str.push("'" + myMetaData.getAttribute("target") + "'");

						str.push(",");

						if (myMetaData.getAttribute("isSearchable") == "0")
							str.push("false");
						else
							str.push("true");

						str.push(");\n");

						str.push("		    hash_meta['" + myMetaData.getAttribute("hash") + "'] = myObj" + metaCtr + "_meta;\n");

						metaCtr++;
					}		

					var nodeColor = '';
					if(node.getAttribute("id") == "40000000")
						nodeColor = '#e3c775';
					else if($(myMetaDatas).filter('[hash="ENAME"]').attr('data') == '')	
						nodeColor = '#fbe6d4';
					
					str.push("		    myTree.add('" + node.getAttribute("id") + "_" + this.config.nodeCtr+++"','" + node.getAttribute("parentID") + "','" + node.getAttribute("realParentID") + "',hash,null,null,'" + nodeColor + "','" + nodeColor + "',null,null,hash_meta,null,null," + node.getAttribute("hasChildren") + "," + node.getAttribute("note") + ");\n");
				}

				//str.push("myTree.closeDiv();");
				str.push("myTree.UpdateTree();");
				//console.log(str.join(''));
				eval(str.join(''));
			}
			
			myTree.generateNodeBody = this.config.generateNodeBody || function (node) {
			
				var s = [];
				var name = node.meta['ENAME'].data;
				var pos = node.meta['POSTX'].data;
				var org = node.meta['ORGTX'].data;
				
				if(name == "")
					name = "Unoccupied";
				
				if(name.length > self.config.nodeLabelsMaxLength)
					name = name.substr(0, self.config.nodeLabelsMaxLength) + '...';
				if(pos.length > self.config.nodeLabelsMaxLength)
					pos = pos.substr(0, self.config.nodeLabelsMaxLength) + '...';
				if(org.length > self.config.nodeLabelsMaxLength)
					org = org.substr(0, self.config.nodeLabelsMaxLength) + '...';
					
				s.push('<br /><b>' + name + '</b>');
				s.push('<br />' + pos);
				s.push('<br />' + org);
			}
			this.myTree = myTree;
			return this;
		};
	
		this.render = function() {

			//call out to get tree
			//this.myTree.popDiv();
			this.myTree.ajaxCall({
				url: this.myTree.ajaxConfig.createTreeAjaxCall(this.config.rootNodeId, this.config.rootNodeOType),
				dataType: this.myTree.ajaxConfig.ajaxCallType,
				context: {self:this},
				success: function(data) {
					this.self.myTree.parseNodes(data);
				}
			});

			return this;
		};
		
		this.changeOrg = function (nodeId, oType) {

			//call out to get the new tree
			this.myTree.resetTree();
			//this.myTree.popDiv();
			this.myTree.ajaxCall({
				url: this.myTree.ajaxConfig.createTreeAjaxCall(nodeId, oType),
				dataType: this.myTree.ajaxConfig.ajaxCallType,
				context: {self:this},
				success: function(data) {
					this.self.myTree.parseNodes(data);
				}
			});
			this.myTree.UpdateTree();
			WhoClickedLast("root");
			CenterTreeToScreen();
		};
	
		this.changeLayout = function(layout) {
		
			if (this.myTree.config.iRootOrientation != layout) {
			
				this.myTree.config.iRootOrientation = layout;
				this.myTree.UpdateTree();
			}
		}

		this.changeLinkType = function(linkType) {
		
			if (this.myTree.config.linkType != linkType) {
			
				this.myTree.config.linkType = linkType;
				this.myTree.UpdateTree();
			}
		}

		this.changeNodeRender = function(nodeRender) {
		
			if (this.myTree.config.nodeRender != nodeRender) {
			
				this.myTree.config.nodeRender = nodeRender;
				this.myTree.UpdateTree();
			}
		}

		this.changeToDirectReportingView = function(drvspr) {
		
			if(this.myTree.config.iDirectReportView == false) {
			
				this.myTree.config.iDirectReportView = true;
				this.myTree.config.iDirectReportViewSiblingPerRow = drvspr;
				//this.myTree.popDiv();
				lastClickedNode = 'root';

				//clear the tree and fetch current views top 2 levels
				this.myTree.resetTree();
				this.myTree.ajaxCall({
					url: this.myTree.ajaxConfig.createTreeAjaxCall(this.config.rootNodeId, this.config.rootNodeOType),
					dataType: this.myTree.ajaxConfig.ajaxCallType,
					context: {self:this},
					success: function(data) {
						this.self.myTree.parseNodes(data);
					}
				});
			}
			else {
			
				this.myTree.config.iDirectReportViewSiblingPerRow = drvspr;
				this.myTree.UpdateTree();
			}
		}

		this.changeToExpandableView = function() {
		
			if(this.myTree.config.iDirectReportView == true) {
			
				this.myTree.config.iDirectReportView = false;
				//this.myTree.popDiv();
				lastClickedNode = 'root';

				//clear the tree and fetch current views top 2 levels
				this.myTree.resetTree();
				this.myTree.ajaxCall({
					url: this.myTree.ajaxConfig.createTreeAjaxCall(this.config.rootNodeId, this.config.rootNodeOType),
					dataType: this.myTree.ajaxConfig.ajaxCallType,
					context: {self:this},
					success: function(data) {
						this.self.myTree.parseNodes(data);
					}
				});
			}
		}

		this.colorNodes = function(color) {
		
			if(this.myTree.getSelectedNodes().length > 0) {
			
				var nodelist = this.myTree.getSelectedNodes();
			
				for(var i = 0; i < nodelist.length; i++) {
				
					var node = nodelist[i];					
					var newColor = color; //update the color
					
					if(color == "RESET")
						newColor = node.backC;

					this.myTree.setNodeColors(node.id, newColor, null, false);
					//unselect it
					this.myTree.selectNode(node.id, true);
				}
			}
		}
	}