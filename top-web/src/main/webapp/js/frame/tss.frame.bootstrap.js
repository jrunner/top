/**
 * 构建NAV导航列表
 * @param navDataArray
 */
function buildNavListNodeByAjax(navDataArray) {

	/*
	 <li role="presentation">
	 <a href="#"> <span class="badge pull-right">42</span> A </a>
	 </li>

	 navData{
	 navData.text,
	 navData.total,
	 navData.optData,
	 navData.contentUrl,
	 }

	 navData.optData{
	 tableHeaderAjaxUrl:表格头数据URL
	 tableDataAjaxUrl:表格数据URL，
	 tableToolBarAjaxUrl:表格TOOLBAR URL,
	 }
	 */
	try {
		
		// 取得NAV显示的DIV
		var navListNode = document.getElementById("sidebarNavListNode");
		if (navDataArray == null || navDataArray.length == 0) {
			var noDataNode = document.createElement("LI");
			navListNode.appendChild(noDataNode);
			noDataNode.innerHTML = "<a href='javascript:void(0)'>无数据显示!</a>";
			return;
		}
		// 构建NAV列表
		for ( var i = 0; i < navDataArray.length; i++) {
			//
			if (navDataArray[i] == null) {
				continue;
			}
			// 创建NAV对象
			var navDataNode = document.createElement("LI");
			// 将NAV对象增加DIV中
			navListNode.appendChild(navDataNode);
			// 如果数据中指明有contentUrl，将构建超链接FRAME动作
			if (navDataArray[i].hasOwnProperty("contentUrl") == true) {
				if (navDataArray[i].contentUrl == null || navDataArray[i].contentUrl == "" || navDataArray[i].contentUrl == "#") {
					if (navDataArray[i].hasOwnProperty("total") == true) {
						navDataNode.innerHTML = "<a href='javascript:void(0)'> <span class=\"badge pull-right\">"
								+ navDataArray[i].total + "</span> " + navDataArray[i].text + " </a>";
					} else {
						navDataNode.innerHTML = "<a href='javascript:void(0)'>" + navDataArray[i].text + " </a>";

					}
				} else {
					if (navDataArray[i].hasOwnProperty("total") == true) {
						navDataNode.innerHTML = "<a href='javascript:navFrameAction(\"" + navDataArray[i].contentUrl + "\");'> <span class=\"badge pull-right\">"
								+ navDataArray[i].total + "</span> " + navDataArray[i].text + " </a>";
					} else {
						navDataNode.innerHTML = "<a href='javascript:navFrameAction(\"" + navDataArray[i].contentUrl + "\");'>" + navDataArray[i].text + " </a>";

					}
				}
			} else {
				// 构建表格数据
				if (navDataArray[i].hasOwnProperty("total") == true) {
					navDataNode.innerHTML = "<a href='javascript:navTableAction(" + JSON.stringify(navDataArray[i].optData) + ");'> <span class=\"badge pull-right\">"
							+ navDataArray[i].total + "</span> " + navDataArray[i].text + " </a>";
				} else {
					navDataNode.innerHTML = "<a href='javascript:navTableAction(" + JSON.stringify(navDataArray[i].optData) + ");'>" + navDataArray[i].text + " </a>";
				}
				navDataNode.setAttribute("role", "presentation");
			}
		}
		selectNavNode("sidebarNavListNode");
	} catch (error) {
		alert("buildNavListNodeByAjax:" + error);
	}

}



/**
 * 显示 隐藏FRAME TABLE
 * @param contentFrameUrl
 */
function showFrameOrTable(targetName) {
	if(document.getElementById("resourceTableDiv") || document.getElementById("contentFrameDiv")) {
		if (targetName == "frame") {
			// 显示IFRAME,隐藏数据表
			$("#resourceTableDiv")[0].className = "col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main hide";
			$("#contentFrameDiv")[0].className = "col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main";
		} else {
			// 隐藏IFRAME,显示数据表
			$("#resourceTableDiv")[0].className = "col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main";
			$("#contentFrameDiv")[0].className = "col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main hide";
		}
	}
}

/**
 * 执行点击动作为显示FRAME URL
 * @param contentFrameUrl
 */
function navFrameAction(contentFrameUrl) {
	showFrameOrTable("frame");
	if(contentFrameUrl.indexOf("tss-hdfs-web") > 0) {
		$("#contentFrameDivFrame")[0].src = contentFrameUrl;
	}else {
		$("#contentFrameDivFrame")[0].src = basePath + contentFrameUrl;
	}
	
}

//
/**
 * NAV导航NODE动作
 * @param optData
 */
function navTableAction(optData) {
	try {
		showFrameOrTable("table");
		//
		if (optData.hasOwnProperty("className") == false || optData.className == null || optData.className == "") {
			alert("缺少className,无法创建表格");
			return;
		}
		// 给页面设置className
		className = optData.className;
		/*
		 navData.optData{
		 tableHeaderAjaxUrl:表格头数据URL
		 tableDataAjaxUrl:表格数据URL，
		 tableToolBarAjaxUrl:表格TOOLBAR URL,
		 tableDataSearchFormUrl:
		 isTableSelectable
		 isShowLineNumber
		 isTableSortable
		 */
		var otherHeight = "";
		
		if (optData.hasOwnProperty("otherHeight") == true) {
			otherHeight = optData.otherHeight;
		}
		
		var isTableSelectable = true;
		var isShowLineNumber = true;
		var isTableSortable = true;
		// 数据表格头信息
		var tableHeaderAjaxUrl = basePath + "menu/dataTables.tableHeader.action";
		// 数据表格TOOLBAR数据
		var tableToolBarAjaxUrl = basePath + "menu/toolBar.tableToolBar.action";
		// 数据表格数据
		var tableDataAjaxUrl = basePath + "resource/resource.listResourceByCondition.action";
		// 数据表查找FORM数据URL
		var tableDataSearchFormUrl = basePath + "menu/dataTables.tableSearchForm.action";
		
		var tssDataTableDiv = "tssDataTableDiv";
		var tssDataTableDivTable = "tssDataTableDivTable";
		
		if (optData.hasOwnProperty("tssDataTableDiv") == true) {
			tssDataTableDiv = optData.tssDataTableDiv;
		}
		if (optData.hasOwnProperty("tssDataTableDivTable") == true) {
			tssDataTableDivTable = optData.tssDataTableDivTable;
		}
		// 如果定义指明TOOLBAR数据URL
		if (optData.hasOwnProperty("tableToolBarAjaxUrl") == true) {
			tableToolBarAjaxUrl = basePath + optData.tableToolBarAjaxUrl;
		}
		
		// 如果定义指明表头的数据URL
		if (optData.hasOwnProperty("tableHeaderAjaxUrl") == true) {
			tableHeaderAjaxUrl = basePath + optData.tableHeaderAjaxUrl;
		}
		// 如果定义指明TOOLBAR数据URL
		if (optData.hasOwnProperty("tableToolBarAjaxUrl") == true) {
			tableToolBarAjaxUrl = basePath + optData.tableToolBarAjaxUrl;
		}
		// 如果定义指明数据表格数据URL
		if (optData.hasOwnProperty("tableDataAjaxUrl") == true) {
			tableDataAjaxUrl = basePath + optData.tableDataAjaxUrl;
		}
		// 如果定义指明数据表格查询表格URL
		if (optData.hasOwnProperty("tableDataSearchFormUrl") == true) {
			tableDataSearchFormUrl = basePath + optData.tableDataSearchFormUrl;
		}
		if (optData.hasOwnProperty("isTableSelectable") == true) {
			isTableSelectable = optData.isTableSelectable;
		}

		if (optData.hasOwnProperty("isShowLineNumber") == true) {
			isShowLineNumber = optData.isShowLineNumber;
		}

		if (optData.hasOwnProperty("isTableSortable") == true) {
			isTableSortable = optData.isTableSortable;
		}

		// 请求TOOLBAR数据
		$.ajax({
			type : "post",
			url : tableToolBarAjaxUrl,
			cache : false,
			data : optData,
			dataType : "json",
			success : function(data) {
				buildDataTableToolBarNode(data);
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				alert("ajax error:" + textStatus + " 请求TOOLBAR数据错误");
			}
		});
		// 请求表格搜索数据
		$.ajax({
			type : "post",
			url : tableDataSearchFormUrl,
			cache : false,
			data : optData,
			dataType : "text",
			success : function(data) {
				if(document.getElementById("searchForm")) {
					document.getElementById("searchForm").innerHTML = data;
					document.getElementById("searchForm").setAttribute("optData", JSON.stringify(optData));
				}
				
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				alert("ajax error:" + textStatus + " 请求表格搜索数据错误");
			}
		});
		// 请求表格头数据
		$.ajax({
			type : "post",
			url : tableHeaderAjaxUrl,
			cache : false,
			data : optData,
			// dataType : "json",
			dataType : "text",
			success : function(data) {
				var targetDataTablesReferent = buildDataTableReferent(tssDataTableDiv, tssDataTableDivTable, data, isTableSortable, tableDataAjaxUrl, "POST", optData,
						isShowLineNumber, isTableSelectable,"more");
				createDataTable(targetDataTablesReferent,otherHeight);
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				alert("ajax error:" + textStatus + " 请求表格搜索数据错误");
			}
		});
	} catch (e) {
		alert("navTableAction:" + e);
	}

}

/**
 * build the datagrid toolbar
 * @param actionDefinedArray
 */
function buildDataTableToolBarNode(actionDefinedArray) {
	// clear the toolbar
	// var dataTableToolBar =
	// document.getElementById("data.table.toolbar.node");
	if(document.getElementById("dataTableToolbarNode")|| document.getElementById("dataTableToolbarNodeMoreNode")) {
	
		var dataTableToolBar = $("#dataTableToolbarNode")[0];
		var dataTableToolBarMore = $("#dataTableToolbarNodeMoreNode")[0];
		dataTableToolBar.innerHTML = "";
		dataTableToolBarMore.innerHTML = "";
		//
		if (actionDefinedArray == null || actionDefinedArray.length == 0) {
			// alert("No Action on toolBar!");
			return;
		}
		/*
		 <button type="button" class="btn btn-default btn-primary">
		 <span class="glyphicon glyphicon-plus"></span> 增加
		 </button>
	
		 //MORE
		 <li>
		 <a href="#">动作1</a>
		 </li>
		 {
		 toolbarAction.actionName,
		 toolbarAction.actionFunction,
		 toolbarAction.actionStyle,
		 toolbarAction.actionIcon
		 }
		 NEW :
	
		 {\"text\":\"\u4E0B\u8F7D\",\"autPermission\":\"TSSF0105\",\"iconCls\":\"icon-ok\",\"handler\":\"TSSF0105_JS_exportData\"}
		 */
		try {
			// build The top Menu by DefineArray
			for ( var i = 0; i < actionDefinedArray.length; i++) {
				//
				var toolbarAction = actionDefinedArray[i];
				if (toolbarAction == null) {
					continue;
				}
				if (i > 8) {
					var actionButNode = document.createElement("LI");
					// append into bar
					dataTableToolBarMore.appendChild(actionButNode);
					actionButNode.innerHTML = '<a href="javascript:' + toolbarAction.handler + '();">' + toolbarAction.text + '</a>';
					continue;
				}
				// create top menu element
				var actionButNode = document.createElement("BUTTON");
				// append into bar
				dataTableToolBar.appendChild(actionButNode);
				actionButNode.setAttribute("type", "button");
				actionButNode.setAttribute("class", "btn btn-default btn-primary");
				actionButNode.setAttribute("onclick", toolbarAction.handler + "()");
				actionButNode.innerHTML = '<span class="' + toolbarAction.iconCls + '"></span> ' + toolbarAction.text;
			}
			if (actionDefinedArray.length <= 8) {
				$("#dataTableToolbarNodeMoreDiv")[0].className = "hide";
			} else {
				$("#dataTableToolbarNodeMoreDiv")[0].className = "btn-group";
			}
			
		} catch (error) {
			alert("buildDataTableToolBarNode:" + error);
		}
	}

}

/**
 * 选择NAV节点事件增加
 * @param navGroupId
 */
function selectNavNode(navGroupId) {
	$("#" + navGroupId).each(function() {
		$(this).children('li').each(function() {
			$(this).click(function() {
				$(this).parent().each(function() {
					$(this).children('li').each(function() {
						// alert($(this).text());
						// $(".a").removeClass("a").addClass("b");
						$(this).removeClass("bs-callout bs-callout-selected");
					});
				});
				$(this).addClass("bs-callout bs-callout-selected");
			});
		});
	});
}

/**
 * 过滤NAV列表
 * @param targetNav
 */
function filterNav(targetNav) {
	var filterValue = $("#filterNav").val();
	$("#" + targetNav).each(function() {
		$(this).children('li').find('a').each(function() {
			if (filterValue == null || filterValue == "") {
				$(this).removeClass("hide");
			} else {
				var navText = $(this).html();
				if (navText != null && navText != "" && navText.indexOf(filterValue.replace(/(^\s*)|(\s*$)/g,'')) == -1) {
					$(this).addClass("hide");
				}else{
					$(this).removeClass("hide");
				}
			}

		});
	});
}