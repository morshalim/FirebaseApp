/*-------------------------------------------------------------------------------------------
|     WLXTree.js
|--------------------------------------------------------------------------------------------
| (c) 2006 Emilio Cortegoso Lobato
|
|     WLXTree is a javascript component for tree drawing. It implements the node positioning
|     algorithm of John Q. Walker II "Positioning nodes for General Trees".
|
|     Basic features include:
|       - Layout features: Different node sizes, colors, link types, alignments, separations
|                          root node positions, etc...
|       - Nodes can include a title and an hyperlink, and a hidden metadata.
|       - Subtrees can be collapsed and expanded at will.
|       - Single and Multiple selection modes.
|       - Search nodes using title and metadata as well.
|
|     This code is free source, but you will be kind if you don't distribute modified versions
|     with the same name, to avoid version collisions. Otherwise, please hack it!
|
|     References:
|
|     Walker II, J. Q., "A Node-Positioning Algorithm for General Trees"
|	     			   Software � Practice and Experience 10, 1980 553-561.
|                      (Obtained from C++ User's journal. Feb. 1991)
|
|     Last updated: October 26th, 2006
|     Version: 1.0
\------------------------------------------------------------------------------------------*/
/*alert(isCanvasSupported());

	function isCanvasSupported(){
	  var elem = document.createElement('canvas');
	  return !!(elem.getContext && elem.getContext('2d'));
	}*/
if ((typeof Range !== "undefined") && !Range.prototype.createContextualFragment) {
	Range.prototype.createContextualFragment = function (html) {
		var frag = document.createDocumentFragment(),
			div = document.createElement("div");
		frag.appendChild(div);
		div.outerHTML = html;
		return frag;
	};
}

//==============================================

WLXObj = function (data, target, isSearchable) {
	this.data = data; // your msg
	this.target = target; //if is linked
	this.isSearchable = isSearchable; //if you can search on this
}

WLXNode = function (id, pid, rpid, dsc, w, h, c, backC, bc, target, meta, ic, is, hncn, n) {
	this.id = id;
	this.pid = pid;
	this.rpid = rpid;
	this.dsc = dsc;
	this.w = w;
	this.h = h;
	this.c = c;
	this.backC = backC;
	this.bc = bc;
	this.target = target;
	this.meta = meta;
	this.siblingIndex = 0;
	this.dbIndex = 0;

	this.XPosition = 0;
	this.YPosition = 0;
	this.prelim = 0;
	this.modifier = 0;
	this.leftNeighbor = null;
	this.rightNeighbor = null;
	this.nodeParent = null;
	this.nodeChildren = [];

	this.isCollapsed = ic;
	this.canCollapse = false;

	this.isSelected = is;
	this.hasNonCachedNodes = hncn;

	this.note = n;
}

WLXNode.prototype.resetNode = function () {

	this.siblingIndex = 0;
	this.dbIndex = 0;

	this.XPosition = 0;
	this.YPosition = 0;
	this.prelim = 0;
	this.modifier = 0;
	this.leftNeighbor = null;
	this.rightNeighbor = null;
	this.nodeParent = null;
	this.nodeChildren = [];

	//this.isCollapsed = false;
	this.canCollapse = false;

	//this.isSelected = false;
}

WLXNode.prototype._getLevel = function () {
	if (this.nodeParent.id == -1) {
		return 0;
	} else return this.nodeParent._getLevel() + 1;
}

WLXNode.prototype._isAncestorCollapsed = function () {
	if (this.nodeParent.isCollapsed) {
		return true;
	} else {
		if (this.nodeParent.id == -1) {
			return false;
		} else {
			return this.nodeParent._isAncestorCollapsed();
		}
	}
}

WLXNode.prototype._setAncestorsExpanded = function () {
	if (this.nodeParent.id == -1) {
		return;
	} else {
		this.nodeParent.isCollapsed = false;
		return this.nodeParent._setAncestorsExpanded();
	}
}

WLXNode.prototype._getChildrenCount = function () {
	if (this.isCollapsed) return 0;
	if (this.nodeChildren == null)
		return 0;
	else
		return this.nodeChildren.length;
}

WLXNode.prototype._getLeftSibling = function () {
	if (this.leftNeighbor != null && this.leftNeighbor.nodeParent == this.nodeParent)
		return this.leftNeighbor;
	else
		return null;
}

WLXNode.prototype._getRightSibling = function () {
	if (this.rightNeighbor != null && this.rightNeighbor.nodeParent == this.nodeParent)
		return this.rightNeighbor;
	else
		return null;
}

WLXNode.prototype._getChildAt = function (i) {
	return this.nodeChildren[i];
}

WLXNode.prototype._getChildrenCenter = function (tree) {
	node = this._getFirstChild();
	node1 = this._getLastChild();
	return node.prelim + ((node1.prelim - node.prelim) + tree._getNodeSize(node1)) / 2;
}

WLXNode.prototype._getFirstChild = function () {
	return this._getChildAt(0);
}

WLXNode.prototype._getLastChild = function () {
	return this._getChildAt(this._getChildrenCount() - 1);
}

WLXNode.prototype._drawChildrenLinks = function (tree) {
	var s = [];
	var xa = 0,
		ya = 0,
		xb = 0,
		yb = 0,
		xc = 0,
		yc = 0,
		xd = 0,
		yd = 0;
	var node1 = null;

	switch (tree.config.iRootOrientation) {
	case WLXTree.RO_TOP:
		xa = this.XPosition + (this.w / 2);
		ya = this.YPosition + this.h;
		break;

	case WLXTree.RO_BOTTOM:
		xa = this.XPosition + (this.w / 2);
		ya = this.YPosition;
		break;

	case WLXTree.RO_RIGHT:
		xa = this.XPosition;
		ya = this.YPosition + (this.h / 2);
		break;

	case WLXTree.RO_LEFT:
		xa = this.XPosition + this.w;
		ya = this.YPosition + (this.h / 2);
		break;
	}

	for (var k = 0; k < this.nodeChildren.length; k++) {
		node1 = this.nodeChildren[k];
		/*		if(tree.config.iDirectReportView == false)
				{
				    switch(tree.config.iRootOrientation)
				    {
					    case WLXTree.RO_TOP:
						    xd = xc = node1.XPosition + (node1.w / 2);
						    yd = node1.YPosition;
						    xb = xa;
						    switch (tree.config.iNodeJustification)
						    {
							    case WLXTree.NJ_TOP:
								    yb = yc = yd - tree.config.iLevelSeparation / 2;
								    break;
							    case WLXTree.NJ_BOTTOM:
								    yb = yc = ya + tree.config.iLevelSeparation / 2;
								    break;
							    case WLXTree.NJ_CENTER:
								    yb = yc = ya + (yd - ya) / 2;
								    break;
						    }
						    break;

					    case WLXTree.RO_BOTTOM:
						    xd = xc = node1.XPosition + (node1.w / 2);
						    yd = node1.YPosition + node1.h;
						    xb = xa;
						    switch (tree.config.iNodeJustification)
						    {
							    case WLXTree.NJ_TOP:
								    yb = yc = yd + tree.config.iLevelSeparation / 2;
								    break;
							    case WLXTree.NJ_BOTTOM:
								    yb = yc = ya - tree.config.iLevelSeparation / 2;
								    break;
							    case WLXTree.NJ_CENTER:
								    yb = yc = yd + (ya - yd) / 2;
								    break;
						    }
						    break;

					    case WLXTree.RO_RIGHT:
						    xd = node1.XPosition + node1.w;
						    yd = yc = node1.YPosition + (node1.h / 2);
						    yb = ya;
						    switch (tree.config.iNodeJustification)
						    {
							    case WLXTree.NJ_TOP:
								    xb = xc = xd + tree.config.iLevelSeparation / 2;
								    break;
							    case WLXTree.NJ_BOTTOM:
								    xb = xc = xa - tree.config.iLevelSeparation / 2;
								    break;
							    case WLXTree.NJ_CENTER:
								    xb = xc = xd + (xa - xd) / 2;
								    break;
						    }
						    break;

					    case WLXTree.RO_LEFT:
						    xd = node1.XPosition;
						    yd = yc = node1.YPosition + (node1.h / 2);
						    yb = ya;
						    switch (tree.config.iNodeJustification)
						    {
							    case WLXTree.NJ_TOP:
								    xb = xc = xd - tree.config.iLevelSeparation / 2;
								    break;
							    case WLXTree.NJ_BOTTOM:
								    xb = xc = xa + tree.config.iLevelSeparation / 2;
								    break;
							    case WLXTree.NJ_CENTER:
								    xb = xc = xa + (xd - xa) / 2;
								    break;
						    }
						    break;
				    }
				}else
				{*/
		switch (tree.config.iRootOrientation) {
		case WLXTree.RO_TOP:
			xd = xc = node1.XPosition + (node1.w / 2);
			yd = node1.YPosition;
			xb = xa;
			switch (tree.config.iNodeJustification) {
			case WLXTree.NJ_TOP:
				yb = yc = yd - tree.config.iLevelSeparation / 2;
				break;
			case WLXTree.NJ_BOTTOM:
				yb = yc = ya + tree.config.iLevelSeparation / 2;
				break;
			case WLXTree.NJ_CENTER:
				yb = yc = ya + (yd - ya) / 2;
				break;
			}
			break;

		case WLXTree.RO_BOTTOM:
			xd = xc = node1.XPosition + (node1.w / 2);
			yd = node1.YPosition + node1.h;
			xb = xa;
			switch (tree.config.iNodeJustification) {
			case WLXTree.NJ_TOP:
				yb = yc = yd + tree.config.iLevelSeparation / 2;
				break;
			case WLXTree.NJ_BOTTOM:
				yb = yc = ya - tree.config.iLevelSeparation / 2;
				break;
			case WLXTree.NJ_CENTER:
				yb = yc = yd + (ya - yd) / 2;
				break;
			}
			break;

		case WLXTree.RO_RIGHT:
			xd = node1.XPosition + node1.w;
			yd = yc = node1.YPosition + (node1.h / 2);
			yb = ya;
			switch (tree.config.iNodeJustification) {
			case WLXTree.NJ_TOP:
				xb = xc = xd + tree.config.iLevelSeparation / 2;
				break;
			case WLXTree.NJ_BOTTOM:
				xb = xc = xa - tree.config.iLevelSeparation / 2;
				break;
			case WLXTree.NJ_CENTER:
				xb = xc = xd + (xa - xd) / 2;
				break;
			}
			break;

		case WLXTree.RO_LEFT:
			xd = node1.XPosition;
			yd = yc = node1.YPosition + (node1.h / 2);
			yb = ya;
			switch (tree.config.iNodeJustification) {
			case WLXTree.NJ_TOP:
				xb = xc = xd - tree.config.iLevelSeparation / 2;
				break;
			case WLXTree.NJ_BOTTOM:
				xb = xc = xa + tree.config.iLevelSeparation / 2;
				break;
			case WLXTree.NJ_CENTER:
				xb = xc = xa + (xd - xa) / 2;
				break;
			}
			break;
		}
		//}


		switch (tree.render) {
		case "HTML":
			break;

		case "CANVAS":
			tree.ctx.save();
			tree.ctx.strokeStyle = tree.config.linkColor;
			tree.ctx.beginPath();
			//console.log(xa-tree.canvasoffsetLeft,ya-tree.canvasoffsetTop)
			switch (tree.config.linkType) {
			case "M":
				tree.ctx.moveTo(xa - tree.canvasoffsetLeft, ya - tree.canvasoffsetTop);
				tree.ctx.lineTo(xb - tree.canvasoffsetLeft, yb - tree.canvasoffsetTop);
				tree.ctx.lineTo(xc - tree.canvasoffsetLeft, yc - tree.canvasoffsetTop);
				tree.ctx.lineTo(xd - tree.canvasoffsetLeft, yd - tree.canvasoffsetTop);
				break;

			case "B":
				tree.ctx.moveTo(xa - tree.canvasoffsetLeft, ya - tree.canvasoffsetTop);
				tree.ctx.bezierCurveTo(xb - tree.canvasoffsetLeft, yb - tree.canvasoffsetTop, xc - tree.canvasoffsetLeft, yc - tree.canvasoffsetTop, xd - tree.canvasoffsetLeft, yd - tree.canvasoffsetTop);
				break;
			}
			tree.ctx.stroke();
			tree.ctx.restore();
			break;

		case "VML":
			switch (tree.config.linkType) {
			case "M":
				s.push('<v:polyline points="');
				s.push(xa + ' ' + ya + ' ' + xb + ' ' + yb + ' ' + xc + ' ' + yc + ' ' + xd + ' ' + yd);
				s.push('" strokecolor="' + tree.config.linkColor + '"><v:fill on="false" /></v:polyline>');
				break;
			case "B":
				s.push('<v:curve from="');
				s.push(xa + ' ' + ya + '" control1="' + xb + ' ' + yb + '" control2="' + xc + ' ' + yc + '" to="' + xd + ' ' + yd);
				s.push('" strokecolor="' + tree.config.linkColor + '"><v:fill on="false" /></v:curve>');
				break;
			}
			break;
		case "XML":
			s.push('<line strokecolor="' + tree.config.linkColor + '">');
			s.push('<coord x="' + (xa - myTree.config.topXAdjustment) + '" y="' + (ya - myTree.config.topYAdjustment) + '"/>');
			s.push('<coord x="' + (xb - myTree.config.topXAdjustment) + '" y="' + (yb - myTree.config.topYAdjustment) + '"/>');
			s.push('<coord x="' + (xc - myTree.config.topXAdjustment) + '" y="' + (yc - myTree.config.topYAdjustment) + '"/>');
			s.push('<coord x="' + (xd - myTree.config.topXAdjustment) + '" y="' + (yd - myTree.config.topYAdjustment) + '"/>');
			s.push('</line>');
			break;

		}
	}

	return s.join('');
}

WLXTree = function (obj, elm, elm2) {
	this.config = {
		debug: false,
		iMaxDepth: 100,
		iLevelSeparation: 40,
		iSiblingSeparation: 40, //40
		iSubtreeSeparation: 80,
		iDirectReportViewSiblingPerRow: 4,
		iNavigateUp: true,
		iDirectReportView: false,
		iRootOrientation: WLXTree.RO_TOP,
		iNodeJustification: WLXTree.NJ_CENTER,
		topXAdjustment: 0,
		topYAdjustment: 0,
		render: "AUTO",
		nodeRender: "ROUNDRECT",
		linkType: "M",
		linkColor: "blue",
		nodeColor: "#CCCCFF",
		nodeFill: WLXTree.NF_GRADIENT,
		nodeBorderColor: "blue",
		nodeSelColor: "#FFFFCC",
		levelColors: ["#5555FF", "#8888FF", "#AAAAFF", "#CCCCFF"],
		levelBorderColors: ["#5555FF", "#8888FF", "#AAAAFF", "#CCCCFF"],
		colorStyle: WLXTree.CS_NODE,
		useTarget: false,
		searchMode: WLXTree.SM_DSC,
		selectMode: WLXTree.SL_MULTIPLE,
		defaultNodeWidth: 150,
		defaultNodeHeight: 125,
		isModelingEnabled: false,
		defaultTarget: 'javascript:void(0);',
		expandedImage: '../images/minus16.gif',
		collapsedImage: '../images/plus16.gif',
		makeRootImage: '../images/up16.gif',
		transImage: '../images/trans.gif',
		uploadImage: '../images/upload.gif',
		infoImage: '../images/icon_info.gif',
		noteImage: '../images/note.gif',
		updateCallBack: null
	}

	this.ajaxConfig = {
		browser: '',
		createTreeAjaxCall: '', //these need to be specified for the ajax calls to work proprely
		addNodeAjaxCall: '',
		getParentTreeAjaxCall: '',
		setClickedNodeAjaxCall: '',
		//for modeling purposes
		cutAjaxCall: '',
		pasteAjaxCall: '',
		undoRedoAjaxCall: '',
		expandCollapseAjaxCall: '',
		createNewNodeAjaxCall: '',
		changeColorAjaxCall: '',
		ajaxCallType: 'JS'
	}
	//we are using this as a hash table to very if the key should be displayed. The value is not important
	this.dscToDisplay = {
		"*": "display"
	};

	this.version = "1.0";
	this.obj = obj;
	this.elm = document.getElementById(elm);
	this.elm2 = document.getElementById(elm2);
	this.self = this;
	this.render = (this.config.render == "AUTO") ? WLXTree._getAutoRenderMode() : this.config.render;
	this.ctx = null;
	this.canvasoffsetTop = 0;
	this.canvasoffsetLeft = 0;

	this.maxLevelHeight = [];
	this.maxLevelWidth = [];
	this.previousLevelNode = [];

	this.rootYOffset = 0;
	this.rootXOffset = 0;

	this.nDatabaseNodes = [];
	this.mapIDs = {};

	this.root = new WLXNode(-1, null, null, 2, 2);
	this.iSelectedNode = -1;
	this.iLastSearch = 0;

	/*****
	 *holder for adding nodes into
	 *****/

	this.copiedNodes = [];
}

//Constant values

//Tree orientation
WLXTree.RO_TOP = 0;
WLXTree.RO_BOTTOM = 1;
WLXTree.RO_RIGHT = 2;
WLXTree.RO_LEFT = 3;

//Level node alignment
WLXTree.NJ_TOP = 0;
WLXTree.NJ_CENTER = 1;
WLXTree.NJ_BOTTOM = 2;

//Node fill type
WLXTree.NF_GRADIENT = 0;
WLXTree.NF_FLAT = 1;

//Colorizing style
WLXTree.CS_NODE = 0;
WLXTree.CS_LEVEL = 1;

//Search method: Title, metadata or both
WLXTree.SM_DSC = 0;
WLXTree.SM_META = 1;
WLXTree.SM_BOTH = 2;

//Selection mode: single, multiple, no selection
WLXTree.SL_MULTIPLE = 0;
WLXTree.SL_SINGLE = 1;
WLXTree.SL_NONE = 2;



WLXTree._getAutoRenderMode = function () {
	var r = "VML";
	var is_ie6 = /msie 6\.0/i.test(navigator.userAgent);
	var is_ie7 = /msie 7\.0/i.test(navigator.userAgent);
	var is_ie8 = /msie 8\.0/i.test(navigator.userAgent);
	var is_ie9 = /msie 9\.0/i.test(navigator.userAgent);
	var is_ie10 = /msie 10\.0/i.test(navigator.userAgent);
	//var is_ff = /Firefox/i.test(navigator.userAgent);
	if (!is_ie6 && !is_ie7 && !is_ie8 /*&& !is_ie9 && !is_ie10*/ ) r = "CANVAS";
	return r;
}

//CANVAS functions...
WLXTree._roundedRect = function (ctx, x, y, width, height, radius) {
	ctx.beginPath();
	ctx.moveTo(x, y + radius);
	ctx.lineTo(x, y + height - radius);
	ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
	ctx.lineTo(x + width - radius, y + height);
	ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
	ctx.lineTo(x + width, y + radius);
	ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
	ctx.lineTo(x + radius, y);
	ctx.quadraticCurveTo(x, y, x, y + radius);
	ctx.fill();
	ctx.stroke();
}

WLXTree._canvasNodeClickHandler = function (tree, target, nodeid) {
	if (target != nodeid) return;
	tree.selectNode(nodeid, true);
}


WLXTree.prototype.resetTree = function () {

	//this.dscToDisplay = {* : "display"};
	this.version = "1.0";
	//this.obj = obj;
	//this.elm = document.getElementById(elm);
	this.self = this;

	this.maxLevelHeight = [];
	this.maxLevelWidth = [];
	this.previousLevelNode = [];

	this.rootYOffset = 0;
	this.rootXOffset = 0;

	this.nDatabaseNodes = [];
	this.mapIDs = {};

	this.root = new WLXNode(-1, null, null, 2, 2);
	this.iSelectedNode = -1;
	this.iLastSearch = 0;

}

WLXTree._firstWalk = function (tree, node, level) {
	//alert("fw: " + node.id + "lvl: " + level);
	var leftSibling = null;

	node.XPosition = 0;
	node.YPosition = 0;
	node.prelim = 0;
	node.modifier = 0;
	node.leftNeighbor = null;
	node.rightNeighbor = null;
	tree._setLevelHeight(node, level);
	tree._setLevelWidth(node, level);
	tree._setNeighbors(node, level);
	if (node._getChildrenCount() == 0 || level == tree.config.iMaxDepth) {
		leftSibling = node._getLeftSibling();
		if (leftSibling != null)
			node.prelim = leftSibling.prelim + tree._getNodeSize(leftSibling) + tree.config.iSiblingSeparation;
		else
			node.prelim = 0;
	} else {
		var n = node._getChildrenCount();
		for (var i = 0; i < n; i++) {
			var iChild = node._getChildAt(i);
			WLXTree._firstWalk(tree, iChild, level + 1);
		}

		var midPoint = node._getChildrenCenter(tree);
		midPoint -= tree._getNodeSize(node) / 2;
		leftSibling = node._getLeftSibling();
		if (leftSibling != null) {
			node.prelim = leftSibling.prelim + tree._getNodeSize(leftSibling) + tree.config.iSiblingSeparation;
			node.modifier = node.prelim - midPoint;
			WLXTree._apportion(tree, node, level);
		} else {
			node.prelim = midPoint;
		}
	}
}

WLXTree._apportion = function (tree, node, level) {
	var firstChild = node._getFirstChild();
	var firstChildLeftNeighbor = firstChild.leftNeighbor;
	var j = 1;
	for (var k = tree.config.iMaxDepth - level; firstChild != null && firstChildLeftNeighbor != null && j <= k;) {
		var modifierSumRight = 0;
		var modifierSumLeft = 0;
		var rightAncestor = firstChild;
		var leftAncestor = firstChildLeftNeighbor;
		for (var l = 0; l < j; l++) {
			rightAncestor = rightAncestor.nodeParent;
			leftAncestor = leftAncestor.nodeParent;
			modifierSumRight += rightAncestor.modifier;
			modifierSumLeft += leftAncestor.modifier;
		}

		var totalGap = (firstChildLeftNeighbor.prelim + modifierSumLeft + tree._getNodeSize(firstChildLeftNeighbor) + tree.config.iSubtreeSeparation) - (firstChild.prelim + modifierSumRight);
		if (totalGap > 0) {
			var subtreeAux = node;
			var numSubtrees = 0;
			for (; subtreeAux != null && subtreeAux != leftAncestor; subtreeAux = subtreeAux._getLeftSibling())
				numSubtrees++;

			if (subtreeAux != null) {
				var subtreeMoveAux = node;
				var singleGap = totalGap / numSubtrees;
				for (; subtreeMoveAux != leftAncestor; subtreeMoveAux = subtreeMoveAux._getLeftSibling()) {
					subtreeMoveAux.prelim += totalGap;
					subtreeMoveAux.modifier += totalGap;
					totalGap -= singleGap;
				}

			}
		}
		j++;
		if (firstChild._getChildrenCount() == 0)
			firstChild = tree._getLeftmost(node, 0, j);
		else
			firstChild = firstChild._getFirstChild();
		if (firstChild != null)
			firstChildLeftNeighbor = firstChild.leftNeighbor;
	}
}

WLXTree._secondWalk = function (tree, node, level, X, Y) {

	if (level <= tree.config.iMaxDepth) {
		var xTmp = tree.rootXOffset + node.prelim + X;
		var yTmp = tree.rootYOffset + Y;
		var maxsizeTmp = 0;
		var nodesizeTmp = 0;
		var flag = false;

		switch (tree.config.iRootOrientation) {
		case WLXTree.RO_TOP:
		case WLXTree.RO_BOTTOM:
			maxsizeTmp = tree.maxLevelHeight[level];
			nodesizeTmp = node.h;
			break;

		case WLXTree.RO_RIGHT:
		case WLXTree.RO_LEFT:
			maxsizeTmp = tree.maxLevelWidth[level];
			flag = true;
			nodesizeTmp = node.w;
			break;
		}
		switch (tree.config.iNodeJustification) {
		case WLXTree.NJ_TOP:
			node.XPosition = xTmp;
			node.YPosition = yTmp;
			break;

		case WLXTree.NJ_CENTER:
			node.XPosition = xTmp;
			node.YPosition = yTmp + (maxsizeTmp - nodesizeTmp) / 2;
			break;

		case WLXTree.NJ_BOTTOM:
			node.XPosition = xTmp;
			node.YPosition = (yTmp + maxsizeTmp) - nodesizeTmp;
			break;
		}
		if (flag) {
			var swapTmp = node.XPosition;
			node.XPosition = node.YPosition;
			node.YPosition = swapTmp;
		}
		switch (tree.config.iRootOrientation) {
		case WLXTree.RO_BOTTOM:
			node.YPosition = -node.YPosition - nodesizeTmp;
			break;

		case WLXTree.RO_RIGHT:
			node.XPosition = -node.XPosition - nodesizeTmp;
			break;
		}
		if (node._getChildrenCount() != 0)
			WLXTree._secondWalk(tree, node._getFirstChild(), level + 1, X + node.modifier, Y + maxsizeTmp + tree.config.iLevelSeparation);
		var rightSibling = node._getRightSibling();
		if (rightSibling != null)
			WLXTree._secondWalk(tree, rightSibling, level, X, Y);
	}
}

WLXTree._secondWalkDRV = function (tree, node, level, X, Y, ctr) {

	if (level <= tree.config.iMaxDepth) {
		var xTmp = 0;
		var spr = tree.config.iDirectReportViewSiblingPerRow;
		//alert(tree.rootXOffset);
		if (ctr > 0)
			xTmp = tree.rootXOffset + (tree._getNodeSize(node) + tree.config.iSiblingSeparation) * (ctr) + X;
		else {
			if (node._getChildrenCount() > 0) {
				var seperationMultiplier = (spr / 2) - 0.5;
				/**************
				 *   tree.rootXOffset = offset;
				 *   ((spr/2) * tree._getNodeSize(node)) = half the nodes are added to the xposition
				 *   (tree._getNodeSize(node) * 0.5) = remove half of a node
				 *   (tree.config.iSiblingSeparation * seperationMultiplier) = add the seperation length to the root node.
				 ***************/
				xTmp = tree.rootXOffset + ((spr / 2) * tree._getNodeSize(node)) - (tree._getNodeSize(node) * 0.5) + (tree.config.iSiblingSeparation * seperationMultiplier) + X;
				//ie. xTmp = tree.rootXOffset +  (4 * tree._getNodeSize(node))/2 - (tree._getNodeSize(node)/2) + (tree.config.iSiblingSeparation * 1.5) + X;
				//draw root in middle of the tree
			} else
				xTmp = tree.rootXOffset + X; //when no children draw in corner
		}

		var yTmp = tree.rootYOffset + Y;

		//alert("node:" + node.id+"\n" + "X:" + xTmp+ "\n" + "Y:" + yTmp+"\n" + "ctr:" +ctr +"\n");
		var maxsizeTmp = 0;
		var nodesizeTmp = 0;
		var flag = false;

		switch (tree.config.iRootOrientation) {
		case WLXTree.RO_TOP:
		case WLXTree.RO_BOTTOM:
			maxsizeTmp = tree.maxLevelHeight[level];
			nodesizeTmp = node.h;
			break;

		case WLXTree.RO_RIGHT:
		case WLXTree.RO_LEFT:
			maxsizeTmp = tree.maxLevelWidth[level];
			flag = true;
			nodesizeTmp = node.w;
			break;
		}
		switch (tree.config.iNodeJustification) {
		case WLXTree.NJ_TOP:
			node.XPosition = xTmp;
			node.YPosition = yTmp;
			break;

		case WLXTree.NJ_CENTER:
			node.XPosition = xTmp;
			node.YPosition = yTmp + (maxsizeTmp - nodesizeTmp) / 2;
			break;

		case WLXTree.NJ_BOTTOM:
			node.XPosition = xTmp;
			node.YPosition = (yTmp + maxsizeTmp) - nodesizeTmp;
			break;
		}
		if (flag) {
			var swapTmp = node.XPosition;
			node.XPosition = node.YPosition;
			node.YPosition = swapTmp;
		}
		switch (tree.config.iRootOrientation) {
		case WLXTree.RO_BOTTOM:
			node.YPosition = -node.YPosition - nodesizeTmp;
			break;

		case WLXTree.RO_RIGHT:
			node.XPosition = -node.XPosition - nodesizeTmp;
			break;
		}
		ctr = ctr + 1;
		if (node._getChildrenCount() != 0) {
			WLXTree._secondWalkDRV(tree, node._getFirstChild(), level + 1, X + node.modifier, Y + maxsizeTmp + tree.config.iLevelSeparation, ctr++);
		}
		var rightSibling = node._getRightSibling();
		if (rightSibling != null) {


			/*****
			 *Logic that derives the remainder nodes getting drawn goes here.
			 *****/
			var totalchildren = node.nodeParent._getChildrenCount();
			var remainder = totalchildren % spr;

			//current position of node.
			for (var i in node.nodeParent.nodeChildren)
				if (node.nodeParent.nodeChildren[i].id == node.id)
					break;

			i++;

			var nodeToCauseCycle = totalchildren - (totalchildren % spr);

			if (i == nodeToCauseCycle) {
				//find size of a full line
				var fullLineSize = (spr * tree._getNodeSize(node)) + ((spr - 1) * tree.config.iSiblingSeparation);
				//find mid point of a short line
				var shortLineSize = (remainder * tree._getNodeSize(node)) + ((remainder - 1) * tree.config.iSiblingSeparation);

				X = (fullLineSize - shortLineSize) / 2;
			}



			if ((ctr) % spr != 0) // same level sibling
				WLXTree._secondWalkDRV(tree, rightSibling, level, X, Y, ctr++);
			else // new level sibling
			{
				WLXTree._secondWalkDRV(tree, rightSibling, level, X, Y + maxsizeTmp + tree.config.iLevelSeparation, 0);
			}
		}
	}


	//alert("node: " + node.id + " XPos: " + node.YPosition);
}

WLXTree.prototype._positionTree = function () {
	this.maxLevelHeight = [];
	this.maxLevelWidth = [];
	this.previousLevelNode = [];
	WLXTree._firstWalk(this.self, this.root, 0);

	switch (this.config.iRootOrientation) {
	case WLXTree.RO_TOP:
	case WLXTree.RO_LEFT:
		this.rootXOffset = this.config.topXAdjustment + this.root.XPosition;
		this.rootYOffset = this.config.topYAdjustment + this.root.YPosition;
		break;

	case WLXTree.RO_BOTTOM:
	case WLXTree.RO_RIGHT:
		this.rootXOffset = this.config.topXAdjustment + this.root.XPosition;
		this.rootYOffset = this.config.topYAdjustment + this.root.YPosition;
	}

	if (this.config.iDirectReportView == false)
		WLXTree._secondWalk(this.self, this.root, 0, 0, 0);
	else {
		//we need to make sure that our tree being rendered allows for atleast one full line to get rendered otherwise we trick
		//it into thinking that the iDirectViewReport is less than what we set it to be.

		var rootNodeChildren = this.root.nodeChildren[0]._getChildrenCount();
		var tempiDirectReportViewSiblingPerRow = this.config.iDirectReportViewSiblingPerRow;

		if (rootNodeChildren > 0 && rootNodeChildren < this.config.iDirectReportViewSiblingPerRow)
			this.config.iDirectReportViewSiblingPerRow = rootNodeChildren;

		WLXTree._secondWalkDRV(this.self, this.root, 0, 0, 0, -2); //passing -2 as a counter will ignore the 2 first nodes.

		//set the original value of the iDirectReportViewSiblingPerRow back
		this.config.iDirectReportViewSiblingPerRow = tempiDirectReportViewSiblingPerRow;
	}
}

WLXTree.prototype._setLevelHeight = function (node, level) {
	if (this.maxLevelHeight[level] == null)
		this.maxLevelHeight[level] = 0;
	if (this.maxLevelHeight[level] < node.h)
		this.maxLevelHeight[level] = node.h;
}

WLXTree.prototype._setLevelWidth = function (node, level) {
	if (this.maxLevelWidth[level] == null)
		this.maxLevelWidth[level] = 0;
	if (this.maxLevelWidth[level] < node.w)
		this.maxLevelWidth[level] = node.w;
}

WLXTree.prototype._setNeighbors = function (node, level) {
	node.leftNeighbor = this.previousLevelNode[level];
	if (node.leftNeighbor != null)
		node.leftNeighbor.rightNeighbor = node;
	this.previousLevelNode[level] = node;
}

WLXTree.prototype._getNodeSize = function (node) {
	switch (this.config.iRootOrientation) {
	case WLXTree.RO_TOP:
	case WLXTree.RO_BOTTOM:
		return node.w;

	case WLXTree.RO_RIGHT:
	case WLXTree.RO_LEFT:
		return node.h;
	}
	return 0;
}

WLXTree.prototype._getLeftmost = function (node, level, maxlevel) {
	if (level >= maxlevel) return node;
	if (node._getChildrenCount() == 0) return null;

	var n = node._getChildrenCount();
	for (var i = 0; i < n; i++) {
		var iChild = node._getChildAt(i);
		var leftmostDescendant = this._getLeftmost(iChild, level + 1, maxlevel);
		if (leftmostDescendant != null)
			return leftmostDescendant;
	}

	return null;
}

WLXTree.prototype._selectNodeInt = function (dbindex, flagToggle) {
	if (this.config.selectMode == WLXTree.SL_SINGLE) {
		if ((this.iSelectedNode != dbindex) && (this.iSelectedNode != -1)) {
			var node = this.nDatabaseNodes[this.iSelectedNode];
			node.isSelected = false;
			//deselect previous selection

			var color = "";

			switch (this.config.colorStyle) {
			case WLXTree.CS_NODE:
				color = node.c;
				break;
			case WLXTree.CS_LEVEL:
				var iColor = node._getLevel() % this.config.levelColors.length;
				color = this.config.levelColors[iColor];
				break;
			}

			switch (this.config.nodeFill) {
			case WLXTree.NF_GRADIENT:
				document.getElementById("fill" + node.id).color2 = (node.isSelected) ? this.config.nodeSelColor : color;
				break;
			case WLXTree.NF_FLAT:
				document.getElementById("fill" + node.id).color = (node.isSelected) ? this.config.nodeSelColor : color;
				break;
			}

		}
		this.iSelectedNode = (this.nDatabaseNodes[dbindex].isSelected && flagToggle) ? -1 : dbindex;
	}
	this.nDatabaseNodes[dbindex].isSelected = (flagToggle) ? !this.nDatabaseNodes[dbindex].isSelected : true;
}

WLXTree.prototype._collapseAllInt = function (flag) {
	var node = null;
	for (var n = 0; n < this.nDatabaseNodes.length; n++) {
		node = this.nDatabaseNodes[n];
		if (node.canCollapse) node.isCollapsed = flag;
	}
	this.UpdateTree();
}

WLXTree.prototype._selectAllInt = function (flag) {
	var node = null;
	for (var k = 0; k < this.nDatabaseNodes.length; k++) {
		node = this.nDatabaseNodes[k];
		node.isSelected = flag;
		this.selectNode(node.id, true);
	}
	this.iSelectedNode = -1;
	//this.UpdateTree();
}

WLXTree.prototype._verifyOnClickIE7 = function (nodeid) {
	var is_ie6 = /msie 6\.0/i.test(navigator.userAgent);
	var is_ie7 = /msie 7\.0/i.test(navigator.userAgent);
	var is_ie8 = /msie 8\.0/i.test(navigator.userAgent);
	if (is_ie6 || is_ie7 || is_ie8)
		this.selectNode(nodeid, true);
}

WLXTree.prototype._generateCanvasNode = function (node, border, color) {


	//Canvas part...
	this.ctx.save();
	this.ctx.strokeStyle = border;
	switch (this.config.nodeFill) {
		case WLXTree.NF_GRADIENT:
			var lgradient = this.ctx.createLinearGradient(0, node.YPosition - this.canvasoffsetTop, 0, node.YPosition - this.canvasoffsetTop + node.h);
			lgradient.addColorStop(0.0, ((node.isSelected) ? this.config.nodeSelColor : color));
			lgradient.addColorStop(1.0, "#F5FFF5");
			this.ctx.fillStyle = lgradient;
			break;

		case WLXTree.NF_FLAT:
			this.ctx.fillStyle = ((node.isSelected) ? this.config.nodeSelColor : color);
			break;
	}

	WLXTree._roundedRect(this.ctx, node.XPosition - this.canvasoffsetLeft, node.YPosition - this.canvasoffsetTop, node.w, node.h, 8);
	this.ctx.restore();


	var s = [];

	node.h = this.config.defaultNodeHeight;

	switch (this.config.nodeRender) {
	case "ROUNDRECT":


		s.push('<div id="' + node.id + '" class="econode" style="top:' + (node.YPosition) + 'px; left:' + (node.XPosition) + 'px; width:' + node.w + 'px; height:' + node.h + 'px;" ');
		if (this.config.selectMode != WLXTree.SL_NONE)
			s.push('onclick="javascript:WLXTree._canvasNodeClickHandler(' + this.obj + ',event.target.id,\'' + node.id + '\');" ');
		s.push('>');
		s.push('<font face="Verdana" size="1">');

		//s.push('<v:roundrect class="treeNode" id="' + node.id + '" strokecolor="'+border+'" arcsize="0.08"');
		//s.push(' style="position:absolute; top:'+node.YPosition+'; left:'+node.XPosition+'; width:'+node.w+'; height:'+node.h+'" ');
		//if (this.config.selectMode != WLXTree.SL_NONE)
		//s.push('href="javascript:'+this.obj+'.selectNode(\''+node.id+'\', true);" ');
		//    s.push('onclick="'+this.obj+'.selectNode(\''+node.id+'\', true);" style="cursor:pointer" ');
		//s.push('>');
		//s.push('<v:textbox  style="v-text-anchor:bottom; text-align: center;">');

		//make root, link added
		//if(this.config.iDirectReportView == false)
		if (this.config.iNavigateUp && node.pid != "-1") {
			s.push('<a href="javascript:' + this.obj + '._verifyOnClickIE7(\'' + node.id + '\');' + this.obj + '.makeRoot(\'' + node.id + '\');" >');
			s.push('<img border="0" src="' + this.config.makeRootImage + '" />');
			s.push('</a>');
		}

		//get parent, link added
		if (node.pid != node.rpid) {
			if (node.rpid != '00000000') {
				// check if user can go up a level
				if (this.config.iNavigateUp) {
					s.push('<a href="javascript:' + this.obj + '._verifyOnClickIE7(\'' + node.id + '\');' + this.obj + '.getRealParent(\'' + node.rpid + '\');" >');
					s.push('<img border="0" src="' + this.config.makeRootImage + '" />');
					s.push('</a>');
				}
			}
		}

		var temp = this._generateNodeBody(node);
		for (var x = 0; x < temp.length; x++)
			s.push(temp[x]);

		var brAdded = false;
		if (this.config.iDirectReportView == false || node.pid == -1) {
			if (node.canCollapse) {
				//if(node.pid == -1)
				{
					s.push('<br /><a href="javascript:' + this.obj + '._verifyOnClickIE7(\'' + node.id + '\');WhoClickedLast(\'' + node.id + '\');' + this.obj + '.collapseNode(\'' + node.id + '\', true);" >');
					s.push('<img border="0" src="' + ((node.isCollapsed) ? this.config.collapsedImage : this.config.expandedImage) + '" />');
					s.push('</a>');
					s.push('<img src="' + this.config.transImage + '" />');
					brAdded = true;
				}
			}
		} else if (this.config.iDirectReportView) {
			if (node.canCollapse) {
				s.push('<br /><a href="javascript:' + this.obj + '._verifyOnClickIE7(\'' + node.id + '\');' + this.obj + '.getRealParent(\'' + node.id + '\');" >');
				s.push('<img width="16" height="16" border="0" src="' + this.config.collapsedImage + '" />');
				s.push('</a>');
				s.push('<img src="' + this.config.transImage + '" />');
				brAdded = true;
			}
		}
		if (brAdded == false)
			s.push('<br />');

		s.push('</font>');
		s.push('</div>')
		break;
	case "RECT":
		s.push('<v:rect class="treeNode" id="' + node.id + '" strokecolor="' + border + '" ');
		s.push(' style="position:absolute; top:' + node.YPosition + '; left:' + node.XPosition + '; width:' + node.w + '; height:' + node.h + '" ');
		if (this.config.selectMode != WLXTree.SL_NONE)
		//s.push('href="javascript:'+this.obj+'.selectNode(\''+node.id+'\', true);" ');
			s.push('onclick="' + this.obj + '.selectNode(\'' + node.id + '\', true);" style="cursor:pointer"');
		s.push('>');
		s.push('<v:textbox  style="v-text-anchor:bottom; text-align: center;">');

		//make root, link added
		//if(this.config.iDirectReportView == false)
		if (node.pid != "-1") {
			s.push('<a href="javascript:' + this.obj + '._verifyOnClickIE7(\'' + node.id + '\');' + this.obj + '.makeRoot(\'' + node.id + '\');" >');
			s.push('<img border="0" src="' + this.config.makeRootImage + '" />');
			s.push('</a>');
		}

		//get parent, link added
		if (node.pid != node.rpid) {
			if (node.rpid != '00000000') {
				// check if user can go up a level
				if (true) {
					s.push('<a href="javascript:' + this.obj + '._verifyOnClickIE7(\'' + node.id + '\');' + this.obj + '.getRealParent(\'' + node.rpid + '\');" >');
					s.push('<img border="0" src="' + this.config.makeRootImage + '" />');
					s.push('</a>');
				}
			}
		}

		var temp = this._generateNodeBody(node);
		for (var x = 0; x < temp.length; x++)
			s.push(temp[x]);

		var brAdded = false;
		if (this.config.iDirectReportView == false || node.pid == -1) {
			if (node.canCollapse) {
				//if(node.pid == -1)
				{
					s.push('<br /><a href="javascript:' + this.obj + '._verifyOnClickIE7(\'' + node.id + '\');WhoClickedLast(\'' + node.id + '\');' + this.obj + '.collapseNode(\'' + node.id + '\', true);" >');
					s.push('<img border="0" src="' + ((node.isCollapsed) ? this.config.collapsedImage : this.config.expandedImage) + '" />');
					s.push('</a>');
					s.push('<img src="' + this.config.transImage + '" />');
					brAdded = true;
				}
			}
		} else if (this.config.iDirectReportView) {
			if (node.canCollapse) {
				s.push('<br /><a href="javascript:' + this.obj + '._verifyOnClickIE7(\'' + node.id + '\');' + this.obj + '.getRealParent(\'' + node.id + '\');" >');
				s.push('<img width="16" height="16" border="0" src="' + this.config.collapsedImage + '" />');
				s.push('</a>');
				s.push('<img src="' + this.config.transImage + '" />');
				brAdded = true;
			}
		}

		if (brAdded == false)
			s.push('<br />');

		s.push('</v:textbox>');
		switch (this.config.nodeFill) {
		case WLXTree.NF_GRADIENT:
			s.push('<v:fill id="fill' + node.id + '" type="gradient" color2="' + ((node.isSelected) ? this.config.nodeSelColor : color) + '" color="#F5FFF5" method="linear sigma"/>');
			break;
		case WLXTree.NF_FLAT:
			s.push('<v:fill id="fill' + node.id + '" type="solid" color="' + ((node.isSelected) ? this.config.nodeSelColor : color) + '" />');
			break;
		}
		s.push('<v:shadow type="single" on="true" opacity="0.7" />');
		s.push('</v:rect>');
		break;
	}

	return s;
}

WLXTree.prototype._generateNode = function (node, border, color) {

	var s = [];

	node.h = this.config.defaultNodeHeight;

	switch (this.config.nodeRender) {
	case "ROUNDRECT":
		s.push('<v:roundrect class="treeNode" id="' + node.id + '" strokecolor="' + border + '" arcsize="0.08"');
		s.push(' style="position:absolute; top:' + node.YPosition + 'px; left:' + node.XPosition + 'px; width:' + node.w + 'px; height:' + node.h + 'px" ');
		if (this.config.selectMode != WLXTree.SL_NONE)
		//s.push('href="javascript:'+this.obj+'.selectNode(\''+node.id+'\', true);" ');
			s.push('onclick="' + this.obj + '.selectNode(\'' + node.id + '\', true);" style="cursor:pointer" ');
		s.push('>');
		s.push('<v:textbox  style="v-text-anchor:bottom; text-align: center;">');

		//make root, link added
		//if(this.config.iDirectReportView == false)
		if (node.pid != "-1") {
			s.push('<a href="javascript:' + this.obj + '._verifyOnClickIE7(\'' + node.id + '\');' + this.obj + '.makeRoot(\'' + node.id + '\');" >');
			s.push('<img border="0" src="' + this.config.makeRootImage + '" />');
			s.push('</a>');
		}

		//get parent, link added
		if (node.pid != node.rpid) {
			if (node.rpid != '00000000') {
				// check if user can go up a level
				if (true) {
					s.push('<a href="javascript:' + this.obj + '._verifyOnClickIE7(\'' + node.id + '\');' + this.obj + '.getRealParent(\'' + node.rpid + '\');" >');
					s.push('<img border="0" src="' + this.config.makeRootImage + '" />');
					s.push('</a>');
				}
			}
		}

		var temp = this._generateNodeBody(node);
		for (var x = 0; x < temp.length; x++)
			s.push(temp[x]);

		var brAdded = false;
		if (this.config.iDirectReportView == false || node.pid == -1) {
			if (node.canCollapse) {
				//if(node.pid == -1)
				{
					s.push('<br /><a href="javascript:' + this.obj + '._verifyOnClickIE7(\'' + node.id + '\');WhoClickedLast(\'' + node.id + '\');' + this.obj + '.collapseNode(\'' + node.id + '\', true);" >');
					s.push('<img border="0" src="' + ((node.isCollapsed) ? this.config.collapsedImage : this.config.expandedImage) + '" />');
					s.push('</a>');
					s.push('<img src="' + this.config.transImage + '" />');
					brAdded = true;
				}
			}
		} else if (this.config.iDirectReportView) {
			if (node.canCollapse) {
				s.push('<br /><a href="javascript:' + this.obj + '._verifyOnClickIE7(\'' + node.id + '\');' + this.obj + '.getRealParent(\'' + node.id + '\');" >');
				s.push('<img width="16" height="16" border="0" src="' + this.config.collapsedImage + '" />');
				s.push('</a>');
				s.push('<img src="' + this.config.transImage + '" />');
				brAdded = true;
			}
		}
		if (brAdded == false)
			s.push('<br />');

		s.push('</v:textbox>');
		switch (this.config.nodeFill) {
		case WLXTree.NF_GRADIENT:
			s.push('<v:fill id="fill' + node.id + '" type="gradient" color2="' + ((node.isSelected) ? this.config.nodeSelColor : color) + '" color="#F5FFF5" method="linear sigma"/>');
			break;
		case WLXTree.NF_FLAT:
			s.push('<v:fill id="fill' + node.id + '" type="solid" color="' + ((node.isSelected) ? this.config.nodeSelColor : color) + '" />');
			break;
		}
		s.push('<v:shadow type="single" on="true" opacity="0.7" />');
		s.push('</v:roundrect>');
		break;
	case "RECT":
		s.push('<v:rect class="treeNode" id="' + node.id + '" strokecolor="' + border + '" ');
		s.push(' style="position:absolute; top:' + node.YPosition + '; left:' + node.XPosition + '; width:' + node.w + '; height:' + node.h + '" ');
		if (this.config.selectMode != WLXTree.SL_NONE)
		//s.push('href="javascript:'+this.obj+'.selectNode(\''+node.id+'\', true);" ');
			s.push('onclick="' + this.obj + '.selectNode(\'' + node.id + '\', true);" style="cursor:pointer"');
		s.push('>');
		s.push('<v:textbox  style="v-text-anchor:bottom; text-align: center;">');

		//make root, link added
		//if(this.config.iDirectReportView == false)
		if (node.pid != "-1") {
			s.push('<a href="javascript:' + this.obj + '._verifyOnClickIE7(\'' + node.id + '\');' + this.obj + '.makeRoot(\'' + node.id + '\');" >');
			s.push('<img border="0" src="' + this.config.makeRootImage + '" />');
			s.push('</a>');
		}

		//get parent, link added
		if (node.pid != node.rpid) {
			if (node.rpid != '00000000') {
				// check if user can go up a level
				if (true) {
					s.push('<a href="javascript:' + this.obj + '._verifyOnClickIE7(\'' + node.id + '\');' + this.obj + '.getRealParent(\'' + node.rpid + '\');" >');
					s.push('<img border="0" src="' + this.config.makeRootImage + '" />');
					s.push('</a>');
				}
			}
		}

		var temp = this._generateNodeBody(node);
		for (var x = 0; x < temp.length; x++)
			s.push(temp[x]);

		var brAdded = false;
		if (this.config.iDirectReportView == false || node.pid == -1) {
			if (node.canCollapse) {
				//if(node.pid == -1)
				{
					s.push('<br /><a href="javascript:' + this.obj + '._verifyOnClickIE7(\'' + node.id + '\');WhoClickedLast(\'' + node.id + '\');' + this.obj + '.collapseNode(\'' + node.id + '\', true);" >');
					s.push('<img border="0" src="' + ((node.isCollapsed) ? this.config.collapsedImage : this.config.expandedImage) + '" />');
					s.push('</a>');
					s.push('<img src="' + this.config.transImage + '" />');
					brAdded = true;
				}
			}
		} else if (this.config.iDirectReportView) {
			if (node.canCollapse) {
				s.push('<br /><a href="javascript:' + this.obj + '._verifyOnClickIE7(\'' + node.id + '\');' + this.obj + '.getRealParent(\'' + node.id + '\');" >');
				s.push('<img width="16" height="16" border="0" src="' + this.config.collapsedImage + '" />');
				s.push('</a>');
				s.push('<img src="' + this.config.transImage + '" />');
				brAdded = true;
			}
		}

		if (brAdded == false)
			s.push('<br />');

		s.push('</v:textbox>');
		switch (this.config.nodeFill) {
		case WLXTree.NF_GRADIENT:
			s.push('<v:fill id="fill' + node.id + '" type="gradient" color2="' + ((node.isSelected) ? this.config.nodeSelColor : color) + '" color="#F5FFF5" method="linear sigma"/>');
			break;
		case WLXTree.NF_FLAT:
			s.push('<v:fill id="fill' + node.id + '" type="solid" color="' + ((node.isSelected) ? this.config.nodeSelColor : color) + '" />');
			break;
		}
		s.push('<v:shadow type="single" on="true" opacity="0.7" />');
		s.push('</v:rect>');
		break;
	}

	return s;
}

WLXTree.prototype._generateNodeBody = function (node) {
	var s = [];
	s.push(this.generateNodeBody(node));
	if (this.config.DebugMode)
		s.push('<br/>(' + node.XPosition + ',' + node.YPosition + ')');
	return s;
}

WLXTree.prototype.generateNodeBody = function (node) {
	return '';
}

WLXTree.prototype._drawTree = function () {
	var s = [];
	var node = null;
	var color = "";
	var border = "";
	var pageCtr = 1;
	for (var n = 0; n < this.nDatabaseNodes.length; n++) {
		node = this.nDatabaseNodes[n];

		switch (this.config.colorStyle) {
		case WLXTree.CS_NODE:
			color = node.c;
			border = node.bc;
			break;
		case WLXTree.CS_LEVEL:
			var iColor = node._getLevel() % this.config.levelColors.length;
			color = this.config.levelColors[iColor];
			iColor = node._getLevel() % this.config.levelBorderColors.length;
			border = this.config.levelBorderColors[iColor];
			break;
		}

		if (!node._isAncestorCollapsed()) {
			switch (this.render) {
			case "HTML":
				s.push('<div class="econode" style="{top:' + node.YPosition + '; left:' + node.XPosition + '; width:' + node.w + '; height:' + node.h + ';}">');
				s.push(this._generateNode(node, border, color).join(''));
				s.push('</div>');
				break;
			case "CANVAS":
				s.push(this._generateCanvasNode(node, border, color).join(''));
				break;
			case "VML":
				s.push(this._generateNode(node, border, color).join(''));
				break;
			case "XML":

				/*if(n > 0)
					    s.push('</page>');*/


				//s.push('<page number="' + (n+1) + '">');

				//var temp = this.buildXMLDataForPrinting(node, node, border);
				//s.push(temp.join(''));
				var nctr = node._getChildrenCount();

				if (n == 0 && nctr == 0) {
					s.push('<page number="' + (n + pageCtr) + '">');
					pageCtr++;
					var temp = this.buildXMLDataForPrinting(node, node, border);
					s.push(temp.join(''));
				} else {
					for (var i = 0;
						(i < nctr); i++) {

						if (i % 8 == 0) {
							if (pageCtr > 1)
								s.push('</page>');

							s.push('<page number="' + (n + pageCtr) + '">');
							pageCtr++;
							var temp = this.buildXMLDataForPrinting(node, node, border);
							s.push(temp.join(''));
						}

						var iChild = node._getChildAt(i);

						var tempChild = this.buildXMLDataForPrinting(node, iChild, border);
						s.push(tempChild.join(''));
					}
				}

				break;
			}
			if (!node.isCollapsed)
				s.push(node._drawChildrenLinks(this.self));
		}
	}


	//close the page for the xml being rendered
	if (this.render == 'XML')
		s.push('</page>');
	return s.join('');

}

//***** This is the starting point for the rendering of the tree
WLXTree.prototype.toString = function () {
	var s = [];

	this._positionTree();

	switch (this.render) {
	case "HTML":
		s.push('<div class="maindiv">');
		s.push(this._drawTree());
		s.push('</div>');
		break;

	case "CANVAS":

		//Get the max height and width
		var maxHeight = 0;
		var maxWidth = 0;
		var minWidth = 0;
		var xpush = -1;
		var ypush = -1;
		for (var n = 0; n < this.nDatabaseNodes.length; n++) {
			node = this.nDatabaseNodes[n];
			if (node.XPosition > maxWidth)
				maxWidth = node.XPosition;

			if (node.XPosition < minWidth)
				minWidth = node.XPosition;

			if (node.YPosition > maxHeight)
				maxHeight = node.YPosition;

			//console.log(node.XPosition-this.canvasoffsetLeft, node.YPosition-this.canvasoffsetTop);
			if (xpush == -1 || node.XPosition < xpush)
				if (node.XPosition > 0)
					xpush = node.XPosition;
			if (n == 0)
				ypush = node.YPosition;
		}

		maxHeight += node.h;
		maxWidth += node.w + Math.abs(minWidth);

		maxHeight -= ypush;
		maxWidth -= xpush;

		//xpush += this.config.topXAdjustment;

		s.push('<canvas style="position:relative;top:' + (ypush - 5) + 'px;left:' + (xpush - 5) + 'px;" id="ECOTreecanvas" width="' + (maxWidth + 10) + 'px" height="' + (maxHeight + 10) + 'px">');
		s.push('</canvas>');
		break;

	case "VML":
		s.push('<v:group coordsize="10000, 10000" coordorigin="0, 0" style="position:absolute;width:10000px;height:10000px;" >');
		s.push(this._drawTree());
		s.push('</v:group>');
		break;
	case "XML":
		s.push('<?xml version="1.0" encoding="UTF-8"?>');

		//Get the max height and width
		var maxHeight = 0;
		var maxWidth = 0;
		var node = null
		for (var n = 0; n < this.nDatabaseNodes.length; n++) {
			node = this.nDatabaseNodes[n];
			if (node.XPosition > maxWidth)
				maxWidth = node.XPosition;

			if (node.YPosition > maxHeight)
				maxHeight = node.YPosition;
		}
		maxHeight += node.h;
		maxWidth += node.w;

		s.push('<tree width="' + (maxWidth - this.config.topXAdjustment) + '" height="' + (maxHeight - this.config.topYAdjustment) + '">');
		s.push(this._drawTree());
		s.push('</tree>');
		break;
	}

	return s.join('');
}

// WLXTree API begins here...

WLXTree.prototype.UpdateTree = function () {

	if (this.nDatabaseNodes.length > 0) {
		this.elm.innerHTML = this;
		CenterTreeToScreen();
	} else
		this.elm.innerHTML = '';

	/*for (var n = 0; n < this.nDatabaseNodes.length; n++)
	{
		node = this.nDatabaseNodes[n];
		// create draggable
	}*/

	if (this.render == "CANVAS") {
		var canvas = document.getElementById("ECOTreecanvas");
		if (canvas && canvas.getContext) {
			this.canvasoffsetLeft = canvas.offsetLeft;
			this.canvasoffsetTop = canvas.offsetTop;
			this.ctx = canvas.getContext('2d');
			var h = this._drawTree();
			//console.log(h);
			var r = this.elm.ownerDocument.createRange();
			r.setStartBefore(this.elm);
			var parsedHTML = r.createContextualFragment(h);
			//this.elm.parentNode.insertBefore(parsedHTML,this.elm)
			//this.elm.parentNode.appendChild(parsedHTML);
			this.elm.appendChild(parsedHTML);
			//this.elm.insertBefore(parsedHTML,this.elm.firstChild);
		}
	}

	if(this.config.updateCallBack)
		this.config.updateCallBack();
}

WLXTree.prototype.getSubTree = function (node, list) {

	//propogate down the list until you find no more children
	//on the way back add the node id to the list of element
	//attached to the given node passed in
	if (node.nodeChildren.length > 0)
		for (var n = 0; n < node.nodeChildren.length; n++)
			this.getSubTree(node.nodeChildren[n], list)

	//we just really care about the key not the value
	//if this hash exists do not redraw it.
	list[node.id] = "*";
	//alert('for id' + node.id + '  ' + node.dsc);

}

WLXTree.prototype.remove = function (id) {

	var list = [];

	for (var n = 0; n < this.nDatabaseNodes.length; n++) {
		if (this.nDatabaseNodes[n].id == id)
			break;
	}

	if (n < this.nDatabaseNodes.length) {
		this.getSubTree(this.nDatabaseNodes[n], list);
		//the list at this point holds all the id's of children to be deleted

		//verify that there are nodes to be deleted
		var ctr = 0;
		for (var i in list)
			ctr++;

		if (ctr > 0) {
			//backup the list and clear the list
			var tempDatabaseNodes = this.nDatabaseNodes;
			this.resetTree();
			//search them all for the "*" ones

			for (var n = 0; n < tempDatabaseNodes.length; n++) {

				if (list[tempDatabaseNodes[n].id] == undefined) // if it's undefined keep it
				{

					tempDatabaseNodes[n].resetNode();
					this.add(tempDatabaseNodes[n].id, tempDatabaseNodes[n].pid, tempDatabaseNodes[n].rpid,
						tempDatabaseNodes[n].dsc, tempDatabaseNodes[n].w,
						tempDatabaseNodes[n].h, tempDatabaseNodes[n].c, tempDatabaseNodes[n].backC,
						tempDatabaseNodes[n].bc, tempDatabaseNodes[n].target,
						tempDatabaseNodes[n].meta, tempDatabaseNodes[n].isCollapsed,
						tempDatabaseNodes[n].isSelected, tempDatabaseNodes[n].hasNonCachedNodes, tempDatabaseNodes[n].note);
				}
			}


			//this.UpdateTree();
		}
	}

}

WLXTree.prototype.add = function (id, pid, rpid, dsc, w, h, c, backC, bc, target, meta, ic, is, hncn, n) {
	var nw = w || this.config.defaultNodeWidth; //Width, height, colors, target and metadata defaults...
	var nh = h || this.config.defaultNodeHeight;
	var color = c || this.config.nodeColor;
	var border = bc || this.config.nodeBorderColor;
	//this line read the following
	//var tg = (this.config.useTarget) ? ((typeof target == "undefined") ? (this.config.defaultTarget) : target) : null;
	//we now have in our tree three level where we can adjust a target,
	//if useTarget is set at the tree level we want to use the default value in there but a node might want to override that
	//this is done here. Passing null would keep the defaultValue assuming one is specified else use the target coming in
	//these override the target at the OBJ level.
	//------NOTE: Passing '' would allow the node to render at the OBJ level.
	var tg = (this.config.useTarget) ? ((target == undefined) ? (this.config.defaultTarget) : target) : null;

	var metadata = (meta != undefined) ? meta : [];
	// was var metadata = (typeof meta != "undefined")	? meta : [];

	var description = (dsc != undefined) ? dsc : [];
	// was	var description = (typeof dsc != "undefined") ? dsc : [];
	var iscollapsed = (typeof ic != "undefined") ? ic : false;
	var isselected = (typeof is != "undefined") ? is : false;
	var hasnoncachednodes = (typeof hncn != "undefined") ? hncn : false;
	var note = (typeof n != "undefined") ? n : false;
	var pnodeArr = []; //Search for parent node in database
	if (pid == -1 /*|| this.nDatabaseNodes.length == 0*/ ) {
		pnodeArr = [this.root];
	} else {
		for (var k = 0; k < this.nDatabaseNodes.length; k++) {
			if (this.nDatabaseNodes[k].id.split("_")[0] == pid) {
				pnodeArr.push(this.nDatabaseNodes[k]);
				break;
			}
		}
	}

	if (pnodeArr.length == 0) {
		document.getElementById('wlxNotification').style.display = "";
		var elemDoc = document.getElementById('myWlxNotification');

		elemDoc.innerHTML = "";

		elemDoc.innerHTML += "<span style=\"color:#000000\">" + (new Date()).toLocaleTimeString() + "</span>&nbsp;";
		elemDoc.innerHTML += "Invalid manager assignment: " + description["Name"].data + "(" + id + ") .<br />";
		togglePaneUp('wlxNotification', 'wlxNotificationBody', 'wlxNotificationImg', 'vert', false)
		return;
	}

	for (var x = 0; x < pnodeArr.length; x++) {
		var pnode = pnodeArr[x];

		//make sure child does not already exist.
		//for (var i in pnode.nodeChildren)
		//   if (pnode.nodeChildren[i].id.split("_")[0] == id.split("_")[0])
		//            return;


		var node = new WLXNode(id, pid, rpid, description, nw, nh, color, color, border, tg, metadata, iscollapsed, isselected, hasnoncachednodes, note); //New node creation...
		node.nodeParent = pnode; //Set it's parent

		//verify to see if it can collapse due to it's nonCachedChildren
		if (hasnoncachednodes == true) {
			node.canCollapse = true;
			node.isCollapsed = true;
		}

		if(!this.config.iDirectReportView)
			pnode.canCollapse = true; //It's obvious that now the parent can collapse
		var i = this.nDatabaseNodes.length; //Save it in database
		node.dbIndex = this.mapIDs[id] = i;
		this.nDatabaseNodes[i] = node;
		var h = pnode.nodeChildren.length; //Add it as child of it's parent
		node.siblingIndex = h;
		pnode.nodeChildren[h] = node;

	}
}

WLXTree.prototype.searchNodes = function (str) {
	var node = null;
	var m = this.config.searchMode;
	var sm = (this.config.selectMode == WLXTree.SL_SINGLE);

	if (typeof str == "undefined") return;
	if (str == "") return;

	var found = false;
	var n = (sm) ? this.iLastSearch : 0;
	if (n == this.nDatabaseNodes.length) n = this.iLastSeach = 0;

	str = str.toLocaleUpperCase();

	var resultsCount = 0;
	for (; n < this.nDatabaseNodes.length; n++) {
		var localResultCount = false;
		node = this.nDatabaseNodes[n];
		node.isSelected = false;
		//this is where the changes need to happend we need to loop thru the whole obj
		for (var i in node.dsc) {
			if (node.dsc[i].isSearchable == true)
				if (node.dsc[i].data.toLocaleUpperCase().indexOf(str) != -1 && ((m == WLXTree.SM_DSC) || (m == WLXTree.SM_BOTH))) {
					node._setAncestorsExpanded();
					this._selectNodeInt(node.dbIndex, false);
					found = true;
					localResultCount = true;
				}
		}

		for (var z in node.meta) {
			if (node.meta[z].isSearchable == true)
				if (node.meta[z].data.toLocaleUpperCase().indexOf(str) != -1 && ((m == WLXTree.SM_META) || (m == WLXTree.SM_BOTH))) {
					node._setAncestorsExpanded();
					this._selectNodeInt(node.dbIndex, false);
					found = true;
					localResultCount = true;
				}
		}

		if (localResultCount)
			resultsCount++;

		if (sm && found) {
			this.iLastSearch = n + 1;
			break;
		}
	}


	this.UpdateTree();
	return resultsCount;
}

WLXTree.prototype.selectAll = function () {
	if (this.config.selectMode != WLXTree.SL_MULTIPLE) return;



	this._selectAllInt(false);
}

WLXTree.prototype.unselectAll = function () {
	this._selectAllInt(true);
}

WLXTree.prototype.collapseAll = function () {
	this._collapseAllInt(true);
}

WLXTree.prototype.expandAll = function () {
	this._collapseAllInt(false);
}

WLXTree.prototype.closeDiv = function () {return;;;
	this.elm2.style.display = 'none';

}

WLXTree.prototype.popDiv = function () {return;;;
	this.elm2.style.display = "";
	this.elm2.innerHTML = '&nbsp;<img src="' + this.config.uploadImage + '" alt="Loading..."/>&nbsp;Loading...&nbsp;';
}

WLXTree.prototype.collapseNode = function (nodeid, upd) {


	if (this.config.isModelingEnabled) {
		var dbindex = this.mapIDs[nodeid];
//TODO
		var sUrl = expandCollapseAjaxCall + "?id=" + nodeid + "&modelid=" + modelid + "&direction=" + this.nDatabaseNodes[dbindex].isCollapsed;
		var request = YAHOO.util.Connect.asyncRequest('GET', sUrl, {
			success: expandCollapseSuccessHandler,
			failure: expandCollapseFailureHandler
		});

	} else
		this.performCollapseNode(nodeid, upd);

}

//*******Newly added functions*****
function expandCollapseSuccessHandler(o) {

	if (o.responseText > 0) {
		myTree.performCollapseNode(o.responseText, true);
	} else
		expandCollapseFailureHandler(o);
}

function expandCollapseFailureHandler(o) {
	alert(langMap.js_my_team_org_tree_operation_failed_msg);
	myTree.closeDiv();
}

WLXTree.prototype.performCollapseNode = function (nodeid, upd) {
	var dbindex = this.mapIDs[nodeid];
	var node = this.nDatabaseNodes[dbindex];
	//add functionality to get non cached objects
	if (this.nDatabaseNodes[dbindex].hasNonCachedNodes == false) {
		this.nDatabaseNodes[dbindex].isCollapsed = !this.nDatabaseNodes[dbindex].isCollapsed;
		if (upd) this.UpdateTree();
	} else {
		this.nDatabaseNodes[dbindex].isCollapsed = false;
		this.nDatabaseNodes[dbindex].hasNonCachedNodes = false;
		this.popDiv();
		this.ajaxCall({
			url: this.ajaxConfig.addNodeAjaxCall(nodeid, node),
			dataType: this.ajaxConfig.ajaxCallType,
			success: function(data) {
				this.parseNodes(data);
			}
		});
		//this ajax call always updates
	}
	//if (upd) this.UpdateTree();
}

WLXTree.prototype.selectNode = function (nodeid, upd) {

	var dbindex = this.mapIDs[nodeid];
	var node = this.nDatabaseNodes[dbindex];
	var flag = node.isSelected;

	var color = "";
	//var border = "";



	switch (this.config.colorStyle) {
	case WLXTree.CS_NODE:
		color = node.c;
		//border = node.bc;
		break;
	case WLXTree.CS_LEVEL:
		var iColor = node._getLevel() % this.config.levelColors.length;
		color = this.config.levelColors[iColor];
		//iColor = node._getLevel() % this.config.levelBorderColors.length;
		//border = this.config.levelBorderColors[iColor];
		break;
	}



	this._selectNodeInt(dbindex, true);

	//verify to see if flag was changed .
	if (flag != node.isSelected)
		if (upd) {
			if (this.render == "VML") {
				switch (this.config.nodeFill) {
				case WLXTree.NF_GRADIENT:
					document.getElementById("fill" + nodeid).color2 = (node.isSelected) ? this.config.nodeSelColor : color;
					break;
				case WLXTree.NF_FLAT:
					document.getElementById("fill" + nodeid).color = (node.isSelected) ? this.config.nodeSelColor : color;
					break;
				}
			} else if (this.render == "CANVAS") {

				var color = "";
				var border = "";
				switch (this.config.colorStyle) {
				case WLXTree.CS_NODE:
					color = node.c;
					//border = node.bc;
					break;
				case WLXTree.CS_LEVEL:
					var iColor = node._getLevel() % this.config.levelColors.length;
					color = this.config.levelColors[iColor];
					//iColor = node._getLevel() % this.config.levelBorderColors.length;
					//border = this.config.levelBorderColors[iColor];
					break;
				}



				this.ctx.save();
				this.ctx.strokeStyle = border;
				switch (this.config.nodeFill) {
					case WLXTree.NF_GRADIENT:
						var lgradient = this.ctx.createLinearGradient(0, node.YPosition - this.canvasoffsetTop, 0, node.YPosition - this.canvasoffsetTop + node.h);
						//var lgradient = this.ctx.createLinearGradient(node.XPosition-this.canvasoffsetLeft,0,node.XPosition-this.canvasoffsetLeft+node.w,0);
						lgradient.addColorStop(0.0, ((node.isSelected) ? this.config.nodeSelColor : color));
						lgradient.addColorStop(1.0, "#F5FFF5");
						this.ctx.fillStyle = lgradient;
						break;

					case WLXTree.NF_FLAT:
						this.ctx.fillStyle = ((node.isSelected) ? this.config.nodeSelColor : color);
						break;
				}

				WLXTree._roundedRect(this.ctx, node.XPosition - this.canvasoffsetLeft, node.YPosition - this.canvasoffsetTop, node.w, node.h, 8);
				this.ctx.restore();




				/*switch (this.config.nodeFill) {
	                case WLXTree.NF_GRADIENT:
		                document.getElementById("fill" + nodeid).color2 = (node.isSelected)?this.config.nodeSelColor:color;
		                break;
	                case WLXTree.NF_FLAT:
		                document.getElementById("fill" + nodeid).color = (node.isSelected)?this.config.nodeSelColor:color;
		                break;
	            } */
			}
		}

		//this._selectNodeInt(this.mapIDs[nodeid];, true);
		//if (upd) this.UpdateTree();
}

/* these functions are no longer beeing used because our dsc and meta have been transformed into objects;
WLXTree.prototype.setNodeTitle = function (nodeid, title, upd) {
	var dbindex = this.mapIDs[nodeid];
	this.nDatabaseNodes[dbindex].dsc['dsc1'].data = title;
	if (upd) this.UpdateTree();
}

WLXTree.prototype.setNodeMetadata = function (nodeid, meta, upd) {
	var dbindex = this.mapIDs[nodeid];
	this.nDatabaseNodes[dbindex].meta = meta;
	if (upd) this.UpdateTree();
}
----------------------------------------------------------*/

WLXTree.prototype.setNodeTitle = function (nodeid, title, upd) {
	var dbindex = this.mapIDs[nodeid];
	this.nDatabaseNodes[dbindex].dsc = title;
	if (upd) this.UpdateTree();
}

WLXTree.prototype.setNodeMetadata = function (nodeid, meta, upd) {
	var dbindex = this.mapIDs[nodeid];
	this.nDatabaseNodes[dbindex].meta = meta;
	if (upd) this.UpdateTree();
}

WLXTree.prototype.setNodeTarget = function (nodeid, target, upd) {
	var dbindex = this.mapIDs[nodeid];
	this.nDatabaseNodes[dbindex].target = target;
	if (upd) this.UpdateTree();
}

WLXTree.prototype.setNodeColors = function (nodeid, color, border, upd) {
	var dbindex = this.mapIDs[nodeid];
	if (color) this.nDatabaseNodes[dbindex].c = color;
	if (border) this.nDatabaseNodes[dbindex].bc = border;
	if (upd) this.UpdateTree();
}

WLXTree.prototype.getSelectedNodes = function () {
	var node = null;
	var selection = [];
	var selnode = null;

	for (var n = 0; n < this.nDatabaseNodes.length; n++) {
		node = this.nDatabaseNodes[n];
		if (node.isSelected) {
			/*selnode = {
				"id" : node.id,
				"node" : node
			}*/
			selection[selection.length] = node;
		}
	}
	return selection;
}

//****** Customizations *********
WLXTree.prototype.getSource = function () {
	return this;
}

//*******Newly added functions*****
WLXTree.prototype.getNodesBySubId = function (nodeid) {
	var values = [];
	for (var x in this.mapIDs) {
		if (x.split("_")[0] == nodeid.split("_")[0]) {
			var dbindex = this.mapIDs[x];
			values.push(this.nDatabaseNodes[dbindex]);
		}

	}

	return values;
}

//*******Newly added functions*****
WLXTree.prototype.getNodeById = function (nodeid) {
		var dbindex = this.mapIDs[nodeid];
		return this.nDatabaseNodes[dbindex];
	}
	//*******Newly added functions*****
WLXTree.prototype.getRootNode = function () {
		return this.root._getFirstChild();
	}
	//*******Newly added functions*****

function cutSuccessHandler(o) {
	if (o.responseText > 0) {
		var node = myTree.getRootNode();
		myTree.getRealParentWithoutNotifyToCenter(node.id);
	} else
		cutFailureHandler(o);
}

function cutFailureHandler(o) {
	alert(langMap.js_my_team_org_tree_operation_failed_msg);
	myTree.closeDiv();
}

WLXTree.prototype.cut = function (nodeid, permanently) {

	if (this.config.isModelingEnabled) {
		var node = this.getNodeById(nodeid);

		//set the last clicked here
		//because the node is getting cut out we can center around that area by targeting the parent
		if (node.pid != '-1') {
			WhoClickedLast(node.pid);
		}

		//figure out if we prompt to move children only when children exist
		var withDependents = null;


		//setup the alert message
		var msg = "";
		if (permanently) //if true indicates a delete else a cut
			msg = langMap.js_my_team_org_tree_delete_children_msg;
		else
			msg = langMap.js_my_team_org_tree_move_children_msg;

		if (node._getChildrenCount() > 0 || node.hasNonCachedNodes)
			withDependents = window.confirm(msg);
		else
			withDependents = "false";

		this.popDiv();
		var sUrl = this.ajaxConfig.cutAjaxCall + '?id=' + nodeid + "&modelid=" + modelid + "&withDependents=" + withDependents + "&permanently=" + permanently;
		var request = YAHOO.util.Connect.asyncRequest('GET', sUrl, {
			success: cutSuccessHandler,
			failure: cutFailureHandler
		});
	} else {
		//there are 2 possibilities to this function
		//cut all selected nodes or the one that was chosen
		var selection = null;

		if (nodeid) {

			//get only one node
			var node = null;
			var tempSelection = [];
			for (var n = 0; n < this.nDatabaseNodes.length; n++) {
				node = this.nDatabaseNodes[n];
				if (node.id == nodeid) {
					tempSelection[tempSelection.length] = node;
					break;
				}
			}
			selection = this.copiedNodes = tempSelection;
		} else
			selection = this.copiedNodes = this.getSelectedNodes();

		for (var i = 0; i < selection.length; i++)
			myTree.remove(selection[i].id);
		if (selection.length > 0)
			myTree.UpdateTree();
	}
}

//*******Newly added functions*****
WLXTree.prototype._delete = function (nodeid) {
	this.remove(nodeid);
	this.UpdateTree();
}

//*******Newly added functions*****
WLXTree.prototype.copy = function (nodeid) {

	//there are 2 possibilities to this function
	//copy all selected nodes or the one that was chosen
	var selection = null;

	if (nodeid) {
		//get only one node
		var node = null;
		var tempSelection = [];
		for (var n = 0; n < this.nDatabaseNodes.length; n++) {
			node = this.nDatabaseNodes[n];
			if (node.id == nodeid) {
				tempSelection[tempSelection.length] = node;
				break;
			}
		}
		selection = tempSelection;
	} else
		selection = this.getSelectedNodes();



	var tempCopiedNodes = [];
	for (var i = 0; i < selection.length; i++) {
		var node = new WLXNode(selection[i].id + "_cp",
			selection[i].pid,
			selection[i].rpid,
			selection[i].dsc,
			selection[i].w,
			selection[i].h,
			selection[i].c,
			selection[i].backC,
			selection[i].bc,
			selection[i].target,
			selection[i].meta); //New node creation...

		tempCopiedNodes[tempCopiedNodes.length] = node
	}

	this.copiedNodes = tempCopiedNodes;
}

//*******Newly added functions*****
function undoRedoSuccessHandler(o) {

	if (o.responseText > 0) {
		//set the last clicked here
		//because we want to center to the node that you are undoing.
		WhoClickedLast(o.responseText);
		var node = myTree.getRootNode();
		myTree.getRealParentWithoutNotifyToCenter(node.id);
	} else {
		alert(langMap.js_my_team_org_tree_no_more_operations_msg);
		myTree.closeDiv();
	}
}

function undoRedoFailureHandler(o) {
	alert(langMap.js_my_team_org_operation_failed_msg);
	myTree.closeDiv();
}

//*******Newly added functions*****
WLXTree.prototype.undoRedo = function (direction) {

	if (this.config.isModelingEnabled) {
		this.popDiv();
		//set the attribute of the direction depending on if redo or undo was asked for
		var sUrl = undoRedoAjaxCall + "?modelid=" + modelid + "&direction=" + direction;
		var request = YAHOO.util.Connect.asyncRequest('GET', sUrl, {
			success: undoRedoSuccessHandler,
			failure: undoRedoFailureHandler
		});
	}
}




//*******Newly added functions*****
function pasteSuccessHandler(o) {
	if (o.responseText > 0) {
		var node = myTree.getRootNode();
		myTree.getRealParentWithoutNotifyToCenter(node.id);
	} else {
		alert(langMap.js_my_team_org_tree_no_more_operations_msg);
		myTree.closeDiv();
	}
}

function pasteFailureHandler(o) {
	alert(langMap.js_my_team_org_tree_no_more_operations_msg);
	myTree.closeDiv();
}

//*******Newly added functions*****
WLXTree.prototype.paste = function (nodeid) {

	if (this.config.isModelingEnabled) {
		var node = this.getNodeById(nodeid);

		//set the last clicked here
		//because we want to center to the node that you are pasting to.
		WhoClickedLast(node.id);

		this.popDiv();
		var sUrl = this.ajaxConfig.pasteAjaxCall + '?id=' + nodeid + "&modelid=" + modelid;
		var request = YAHOO.util.Connect.asyncRequest('GET', sUrl, {
			success: pasteSuccessHandler,
			failure: pasteFailureHandler
		});
	} else {

		//var selection = this.copiedNodes;
		//var destination = window.prompt("Enter a new destination");
		//modify the parent id and add them back to the table
		for (var i = 0; i < this.copiedNodes.length; i++) {
			var node = this.copiedNodes[i];
			node.pid = node.rpid = nodeid;
			this.add(node.id, node.pid, node.rpid, node.dsc, node.w, node.h, node.c, node.backC, node.bc, node.target, node.meta);
		}

		if (this.copiedNodes.length > 0) {
			this.copiedNodes = [];

			//expand the tree when something is pasted and it's collapsed
			//get only one node
			var node = null;
			for (var n = 0; n < this.nDatabaseNodes.length; n++) {
				node = this.nDatabaseNodes[n];
				if (node.id == nodeid)
					break;
			}

			if (node.isCollapsed) //if node not collapsed
			{
				WhoClickedLast(node.id);
				myTree.collapseNode(node.id, false); // do not update within this call
			} else {
				WhoClickedLast(node.id);
				myTree.UpdateTree();
			}

		}
	}
}

//*******Newly added functions*****
WLXTree.prototype.makeRoot = function (nodeid) {

	var node = this.getNodeById(nodeid);
	//update the clicked node within the session to make sure it refreshes correctly
	this.ajaxCall({
		url: this.ajaxConfig.setClickedNodeAjaxCall(nodeid, node),
		dataType: this.ajaxConfig.ajaxCallType
	});

	var list = [];
	node = null;
	for (var n = 0; n < this.nDatabaseNodes.length; n++) {
		if (this.nDatabaseNodes[n].id == nodeid) { //set the pid = -1 t make it the root.
			node = this.nDatabaseNodes[n];
			node.pid = "-1";
			break;
		}
	}

	if (n < this.nDatabaseNodes.length) {

		this.getSubTree(node, list);
		//the list at this point holds all the id's of children to be deleted

		//verify that there are nodes to be kept
		var ctr = 0;
		for (var i in list)
			ctr++;

		if (ctr > 0) {
			//backup the list and clear the list
			var tempDatabaseNodes = this.nDatabaseNodes;
			this.resetTree();
			//search them all for the "*" ones

			for (var n = 0; n < tempDatabaseNodes.length; n++) {

				if (list[tempDatabaseNodes[n].id] == "*") // if it's selected keep it
				{

					tempDatabaseNodes[n].resetNode();
					this.add(tempDatabaseNodes[n].id, tempDatabaseNodes[n].pid, tempDatabaseNodes[n].rpid,
						tempDatabaseNodes[n].dsc, tempDatabaseNodes[n].w,
						tempDatabaseNodes[n].h, tempDatabaseNodes[n].c, tempDatabaseNodes[n].backC,
						tempDatabaseNodes[n].bc, tempDatabaseNodes[n].target,
						tempDatabaseNodes[n].meta, tempDatabaseNodes[n].isCollapsed,
						tempDatabaseNodes[n].isSelected, tempDatabaseNodes[n].hasNonCachedNodes, tempDatabaseNodes[n].note);
				}
			}


			this.UpdateTree();
			initTree();
			WhoClickedLast(node.id);
			CenterTreeToScreen();
		}
	}

}



//*******Newly added functions*****
WLXTree.prototype.getRealParent = function (nodeid) {

	var node = this.getNodeById(nodeid);
	this.resetTree();
	this.popDiv();
	this.ajaxCall({
		url: this.ajaxConfig.getParentTreeAjaxCall(nodeid, node),
		dataType: this.ajaxConfig.ajaxCallType,
		success: function(data) {
			this.parseNodes(data);
		}
	});
	this.UpdateTree();
	initTree();
	WhoClickedLast('root');
	CenterTreeToScreen();
}

WLXTree.prototype.getRealParentWithoutNotifyToCenter = function (nodeid) {

	var node = this.getNodeById(nodeid);
	this.resetTree();
	this.popDiv();
	this.ajaxCall({
		url: this.ajaxConfig.getParentTreeAjaxCall(nodeid, node),
		dataType: this.ajaxConfig.ajaxCallType,
		success: function(data) {
			this.parseNodes(data);
		}
	});
	this.UpdateTree();
	initTree();
	CenterTreeToScreen();
}

WLXTree.prototype.writeLegend = function () {
	var html = [];

	html.push(langMap.js_my_team_org_tree_legend);

	return html.join('');
}

WLXTree.prototype.ajaxCall = function(iSettings) {
    
	var settings = {
		type: 'GET',
		dataType: 'JSON',
		contentType: 'application/json; charset=utf-8',
		cache: false,
		context: this,
		success: function(data) { console.log('success'); },
		error: function(data) { console.log('error'); }
	}
	$.extend(true, settings, iSettings);
	$.ajax(settings);
}

WLXTree.prototype.parseNodes = function(data) {

	alert(langMap.js_my_team_org_tree_node_msg);
}