// JScript File
			//set it to the root as last known clicked attribute
			var lastClickedNode = "root";
			
			function WhoClickedLast(nodeId)
			{
			    lastClickedNode = nodeId;
			}
			
			function CenterTreeToScreen(nodeId)
			{			            
			    //the passed in variable is an override of the "lastClickedNode" attribute
			    //lastClickedNode is global and can be seen without passing
			    if(myTree != null && myTree.nDatabaseNodes != null && myTree.nDatabaseNodes.length > 0)
			    {

			        //find root
			        var node = null;
                    for (var i in myTree.nDatabaseNodes)
                    {   node = myTree.nDatabaseNodes[i];
                        //center to root
                        if(nodeId == null)
                        {
                            if(lastClickedNode == "root")
                            {
                                if (node.pid == '-1')
                                    break;
                            }
                            else
                            {
                                if (node.id == lastClickedNode)
                                    break;                            
                            }
                        }
                        else
                        {
                            if(nodeId == "root")
                            {
                                if (node.pid == '-1')
                                    break;
                            }
                            else
                            {
                                if (node.id == nodeId)
                                    break;                            
                            }                                                  
                        }    
                            
                    }
                    
                    if(myTree.config.iRootOrientation == WLXTree.RO_TOP)
                    {
                        $("#myTreeContainer").css('left', (parseInt(myTree.config.topXAdjustment) * -1));
                        $("#myTreeContainer").css('top', (parseInt(myTree.config.topYAdjustment) * -1));

                        var screenMidPoint = $("#mainPane").width() / 2 - $("#map").offset().left;
                        var pointToDraw = (screenMidPoint - myTree._getNodeSize(node)/2);
                        var distance = Math.abs(node.XPosition - myTree.config.topXAdjustment ) - pointToDraw;
                        
                        if(distance)
                            $("#myTreeContainer").css('left', $("#myTreeContainer").offset().left - distance);
                         
                        //we need to verify that any children that might be drawn are visible  
                        if(node._getChildrenCount() > 0)
                        {   
                            var node = node.nodeChildren[0];
                            //whatIsVisible lets you know what is visible of the children of the row expanded. If less than node size adjust height.
                            var whatIsVisible = Math.abs($("#myTreeContainer").offset().top) + $("#mainPane").height() - $("#orgPane").height() - parseInt(node.YPosition);                            
                            
                            if(whatIsVisible < node.h)
                            {
                              
                                var displacement = 0;
                                    
                                if(whatIsVisible < 0)
                                    displacement = Math.abs(whatIsVisible) + node.h; // add what is missing + nde height
                                else
                                    displacement = node.h - whatIsVisible; //add just what is missing
                                    
                                $('#myTreeContainer').offset().top = $('#myTreeContainer').offset().top - displacement - 25;
                            }
                        }   
                    }
                    else
                    {
                        $("#myTreeContainer").offset().top = parseInt(myTree.config.topYAdjustment) * -1;
                        var screenMidPoint = parseInt(document.getElementById("mainPane").style.height.split("px")[0]) / 2;
                        //alert(screenMidPoint);
                        //the pointToDraw = the screen width - half a node
                        var pointToDraw = (screenMidPoint - myTree._getNodeSize(node)/2);
                        
                        var distance = Math.abs(node.YPosition - myTree.config.topYAdjustment ) - pointToDraw;
                        
                        if(distance)//the reason this function exists here is because on the first loadup it causes the following to fail in ie5 alert NaN
                            $("#myTreeContainer").offset().top = $("#myTreeContainer").offset().top - distance
                            
                            
                        //we need to verify that any children that might be drawn are visible  
                        if(node._getChildrenCount() > 0)
                        {   
                            var node = node.nodeChildren[0];
                            //whatIsVisible lets you know what is visible of the children of the row expanded. If less than node size adjust height.
                            var whatIsVisible = Math.abs($("#myTreeContainer").offset().left) + $("#mainPane").width() - parseInt(node.XPosition);                            
                            //alert(whatIsVisible);
                            
                            if(whatIsVisible < node.w)
                            {
                              
                                var displacement = 0;
                                    
                                if(whatIsVisible < 0)
                                    displacement = Math.abs(whatIsVisible) + node.w; // add what is missing + node height
                                else
                                    displacement = node.w - whatIsVisible; //add just what is missing
                                $("#myTreeContainer").offset().left = $("#myTreeContainer").offset().left - displacement - 25;
                            }
                        }                          
                            
                    }  
                    
                    //once the tree is initialized we set the positions for the node menu's
                    SetCurrentXYPositions();                    
                }
			}				
			

			    

			
             /******
             *We first need to setup 2 global variables which will hold the pos of the viewing pane
             *the reason we do this is because we do not want to collapse the menu on a drag and drop.
             *******/
             var xpos = 0;
             var ypos = 0;
             
             function SetCurrentXYPositions()
             {  
                xpos = Math.abs(document.getElementById("myTreeContainer").style.left.split("px")[0]);
                ypos = Math.abs(document.getElementById("myTreeContainer").style.top.split("px")[0]);                
             }
             
             function VerifyNodeMenu()
             {
                //alert(xpos);alert(ypos);
                if(xpos == Math.abs(document.getElementById("myTreeContainer").style.left.split("px")[0])
                    && ypos == Math.abs(document.getElementById("myTreeContainer").style.top.split("px")[0]))
                    {
                        myTree.verifyNodeMenuExistence();
                    }
                
                    //readjust points
                    SetCurrentXYPositions();
                
             }
             
			function togglePane(element, image, direction, refresh) {
				var pane = document.getElementById(element)
				var collapse = rp+"images/pcollapse_up.gif";
				var expand = rp+"images/pexpand_dn.gif";
				
				if (direction == 'horiz') {
					collapse = rp+"images/pcollapse.gif";
					expand = rp+"images/pexpand.gif";
				}
					
				if (pane.style.display == "none") {
					pane.style.display = "";
					document.getElementById(image).src = collapse;
				} else {
					pane.style.display = "none";
					document.getElementById(image).src = expand;
				}
				
				if(refresh)
				    winOnResize();
			}
			

			function togglePaneUp(mainelem, element, image, direction, refresh) {
				try
				{
				var mainpane = document.getElementById(mainelem)
				var pane = document.getElementById(element)
				var collapse = rp+"images/pexpand_dn.gif";
				var expand = rp+"images/pcollapse_up.gif";
				
				if (direction == 'horiz') {
					collapse = rp+"images/pcollapse.gif";
					expand = rp+"images/pexpand.gif";
				}

				if (pane.style.display == "none") {
				    //push div to top 
				    pane.style.display = "";
				    mainpane.style.top =  parseInt(mainpane.style.top.split("px")[0]) - pane.offsetHeight  ;
					
					document.getElementById(image).src = collapse;
				} else {
				    //push div to bottom
				    mainpane.style.top =  parseInt(mainpane.style.top.split("px")[0]) + pane.offsetHeight;
					pane.style.display = "none";
					document.getElementById(image).src = expand;
				}
				
							if(refresh)
					    winOnResize();
				}
				catch (e)
				{
				}
			}
			
			function sliderInit() {
				slider = YAHOO.widget.Slider.getVertSlider("wlxZoomSlider","wlxZoomThumb",0,125,5);
				slider.setValue(100,true);
				slider.subscribe("change",zoomContentArea);
			}
			function zoomContentArea(offsetFromStart) {
				//document.getElementById("offset").innerHTML = offsetFromStart;
				document.getElementById("outerDiv").style.zoom = offsetFromStart + "%";
				//alert(document.getElementById("myTreeContainer").style.zoom);// = parseInt(document.getElementById("myTreeContainer").style.height) - 20;
			}
			
            function toggleDiv(divHandle, imgHandle, visibility) {
                if(visibility == undefined)
                {        
                    if(document.getElementById(divHandle).style.display == 'none')
                    {
                        document.getElementById(divHandle).style.display = '';
                        if(imgHandle != "none")
                            document.getElementById(imgHandle).src = rp+'images/minus.gif';
                    }
                    else
                    {
                        document.getElementById(divHandle).style.display = 'none';
                        if(imgHandle != "none")
                            document.getElementById(imgHandle).src = rp+'images/plus.gif';
                    }
                }
                else
                {
                    if(visibility == '')
                    {
                        document.getElementById(divHandle).style.display = visibility;
                        if(imgHandle != "none")
                            document.getElementById(imgHandle).src = rp+'images/minus.gif';            
                    } 
                    else
                    {
                        document.getElementById(divHandle).style.display = visibility;
                        if(imgHandle != "none")
                            document.getElementById(imgHandle).src = rp+'images/plus.gif';            
                    }           
                }
            }	
            
             /************************************
             *Moving the tree   	
             *************************************/
             
             function initTree() {
                //document.getElementById("myTreeContainer").style.left = -30;
                //document.getElementById("myTreeContainer").style.top = -30;     
                //JK - ADDED PX for CHROME SUPPORT
                //document.getElementById("myTreeContainer").style.left = -10500 + "px";
                //JK - ADDED PX for CHROME SUPPORT
                //document.getElementById("myTreeContainer").style.top = -10500 + "px";
             }
             
             function moveTreeLeft() {
				//JK - ADDED PX for CHROME SUPPORT
                document.getElementById("myTreeContainer").style.left = parseInt(document.getElementById("myTreeContainer").style.left) - 100 + "px";
             }
             
             function moveTreeRight() {
				//JK - ADDED PX for CHROME SUPPORT
                document.getElementById("myTreeContainer").style.left = parseInt(document.getElementById("myTreeContainer").style.left) + 100 + "px";
             }
             
             function moveTreeTop() {
	             //JK - ADDED PX for CHROME SUPPORT
                document.getElementById("myTreeContainer").style.top = parseInt(document.getElementById("myTreeContainer").style.top) - 100 + "px";
             }
             
             function moveTreeBottom() {
				//JK - ADDED PX for CHROME SUPPORT         
                document.getElementById("myTreeContainer").style.top = parseInt(document.getElementById("myTreeContainer").style.top) + 100 + "px";
             }    
             
		/*************
	    *Annotation Code
	    *************/
			
		function AddNote(oLI)
		{
			newNote();
		}
 
		var dd1, note;
		//dd1 = new YAHOO.util.DDProxy("note");
		//dd1.setHandleElId("noteh");
		
		var attributes = {
			width: { to: 210 }, 
		    height: { to: 200 }
		};
		
		/*function document.onreadystatechange() {  
		    ta.document.designMode = "On";  
		 } 
		*/
		
		function newNote() {
			
		    
			var newEl = document.createElement("div");
			newEl.innerHTML = "<div id=\"note1\" class=\"anote\"><div id=\"noteh1\" class=\"notehandle\">Note</div></div>";
			document.getElementById("myTreeContainer").appendChild(newEl);
			
			note = new YAHOO.util.DDProxy("note1");
			note.setHandleElId("noteh1");
			var anim = new YAHOO.util.Anim('note1', attributes, 1, YAHOO.util.Easing.backOut);
			anim.animate();
			
			
		}                      		             

