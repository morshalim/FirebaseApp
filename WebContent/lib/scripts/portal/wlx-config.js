	$(function(){
		
		$(document).on("click", "a", function(e) {
			/*if($(this).attr('href')=='#')
			return false;*/
			
			var leng = $(this).parents('div[class=tree-folder]').length
			var temp;
			var text;
			var label = $(this).text();
			var url= $(this).attr('href'); 
			if($(this).attr('name')!='CONFIGURATION'){
				$(this).attr('href','#');
				for(var i=0;i<leng;i++){
					temp =  $(this).parents('div[class=tree-folder]').children('div[class=tree-folder-header]').find('div[class=tree-folder-name]')[i];
					
					if(i==0)
						text = $(temp).text();
					else
						text = text + '~'+$(temp).text();
					
				}
				text = text+'~'+label;
				if(url.indexOf('?')==-1)
					url = url+"?"+req_param+"="+text;
				else
					url = url+"&"+req_param+"="+text;
			}
			//navigateTo(url);
			$(this).attr('href',url);
			//return false;
		
		});
	});					
	var DataSourceTree = function(options) {
		this._data 	= options.data;
		this._delay = options.delay;
	}
	
	DataSourceTree.prototype.data = function(options, callback) {
		var self = this;
		var $data = null;
	
		if(!("name" in options) && !("type" in options)){
			$data = this._data;//the root tree
			callback({ data: $data });
			return;
		}
		else if("type" in options && options.type == "folder") {
			if("additionalParameters" in options && "children" in options.additionalParameters)
				$data = options.additionalParameters.children;
			else $data = {}//no data
		}
		
		if($data != null)//this setTimeout is only for mimicking some random delay
			setTimeout(function(){callback({ data: $data });} , parseInt(Math.random() * 500) + 200);
	
		//you can retrieve your data from a server using ajax call
	};
	
	
	function initilizeTree(tree_data){
		var treeDataSource = new DataSourceTree({data: tree_data});
		$('#tree').ace_tree({
			dataSource: treeDataSource ,
			multiSelect:true,
			loadingHTML:'<div class="tree-loading"><i class="ace-icon fa fa-refresh fa-spin blue"></i></div>',
			'open-icon' : 'ace-icon tree-minus',
			'close-icon' : 'ace-icon tree-plus',
			'selectable' : true,
			'selected-icon' : 'ace-icon fa fa-check',
			'unselected-icon' : 'ace-icon fa fa-times'
		});
		
		
		$('#tree')
		.on('updated', function(e, result) {
			//result.info  >> an array containing selected items
			//result.item
			//result.eventType >> (selected or unselected)
		})
		.on('selected', function(e) {
		})
		.on('unselected', function(e) {
		})
		.on('opened', function(e) {
		})
		.on('closed', function(e) {
		});
	};
	
	function expandTree(params){
		if(params!=null && params!=''){
			var item;
			var list = [];
			list=params.split('~');
			item =eval('('+buildTree(list,0)+')');
			preSelectItem($("#tree"), item);
		}
		
	}
	
	function preSelectFolder($treeEl, folder, $parentEl) {
        var $elParent = $parentEl || $treeEl;
        if (folder.type == "folder") {
            var $folderEl = $elParent.find("div.tree-folder-name").filter(function (_, treeFolder) {
                return $(treeFolder).text() == folder.name;
            }).parent();
            $treeEl.one("loaded", function () {
				if(folder.children !=null && folder.children != ''){
					$.each(folder.children, function (i, item) {
						preSelectFolder($treeEl, item, $folderEl.parent());
					});
				}
            });
            $treeEl.tree("selectFolder", $folderEl);
        }
        else {
            preSelectItem($treeEl, folder, $elParent);
        }
    }

    function preSelectItem($treeEl, item, $parentEl) {
        var $elParent = $parentEl || $treeEl;
        if (item.type == "item") {
            var $itemEl = $elParent.find("div.tree-item-name").filter(function (_, treeItem) {
                return $(treeItem).text() == item.name && !$(treeItem).parent().is(".tree-selected");
            }).parent();
            var itemName = $($itemEl).data() != null ? $($itemEl).data().name : "";
            if (itemName == item.name)
                $treeEl.tree("selectItem", $itemEl);
        }
        else if (item.type == "folder") {
            preSelectFolder($treeEl, item, $elParent);
        }
    }
		
	function buildTree(list,index){
		var max =  list.length;
		for(var i=index;i<max;i++){
				if(i!=max-1){
					return '{"name":"'+list[i]+'","type":"folder","children":['+buildTree(list,i+1)+']}';
				}else{
					return '{"name":"'+list[i]+'","type":"folder"}';
				}
		}
	}
	
	