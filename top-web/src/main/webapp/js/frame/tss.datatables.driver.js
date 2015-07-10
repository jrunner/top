/**
 * 表格中数据内容
 */
var targetDataTableObject = {};
var currentTableReferent = null;
/**
 * 构建数据表参考对象
 * @param tableDiv
 * @param tableId
 * @param columns
 * @param isOrdering
 * @param requestUrl
 * @param requestMethod
 * @param requestParameters
 * @param isShowRowNumber
 * @param isSelectable
 * @param selectModule
 * @returns {___anonymous897_898}
 */
function buildDataTableReferent(tableDiv, tableId, columns, isOrdering, requestUrl, requestMethod, requestParameters, isShowRowNumber, isSelectable,selectModule) {
	var myTableReferent = {};
	myTableReferent.tableId = tableId;
	myTableReferent.tableDiv = tableDiv;
	myTableReferent.columns = buildDataTableColumnsByString(columns);
	myTableReferent.ajaxUrl = requestUrl;
	myTableReferent.ajaxHttpMethod = requestMethod;
	myTableReferent.ajaxParameters = requestParameters;
	myTableReferent.isOrdering = isOrdering;
	myTableReferent.isShowRowNumber = isShowRowNumber;
	//
	if(selectModule==null||selectModule==""){
		myTableReferent.selectModule="more";
	}else{
		myTableReferent.selectModule=selectModule;
	}
	//
	if (isSelectable != false) {
		var rowNumberDefine = {};
		if(myTableReferent.selectModule=="single"){
			rowNumberDefine.title = "选择";
		}else{
			rowNumberDefine.title = "<input type='checkbox' name='dataTables.row.checkAll' id='dataTables.row.checkAll' onclick='checkAll()'/>";
			
		}
		rowNumberDefine.data = "id";
		rowNumberDefine.width = "1px";
		rowNumberDefine.render = selectFormatter;
		rowNumberDefine.orderable = false;
		myTableReferent.columns.splice(0, 0, rowNumberDefine);
	}

	if (isShowRowNumber == true) {
		var rowNumberDefine = {};
		rowNumberDefine.title = "序号";
		rowNumberDefine.data = "id";
		rowNumberDefine.width = "1px";
		rowNumberDefine.orderable = false;
		myTableReferent.columns.splice(0, 0, rowNumberDefine);
	}
	return myTableReferent;
}

function getCurrentTableReferent() {
	return currentTableReferent;
}
/**
 * 根据JSON字符串生成对应的数据表格列头定义
 * @param columnsJsonString
 * @returns
 */
function buildDataTableColumnsByString(columnsJsonString) {
	try {
		var dataTableColumnsDefine = json_parse(columnsJsonString, function(key, value) {
			if (key == "render") {
				if (value == "detailFormatter") {
					return detailFormatter;
				} else if (value == "downResourceFormatter") {
					return downResourceFormatter;
				} else if (value == "selectFormatter") {
					return selectFormatter;
				} else if (value == "columnContextRender") {
					return columnContextRender;
				} else if(value == "formTypeFormatter") {
					return formTypeFormatter;
				} else if(value == "eventDetailFormatter") {
					return eventDetailFormatter;
				} else if(value == "resCorporationDetailFormatter"){
					return resCorporationDetailFormatter;
				} else if(value == "resCorporationGroupDetailFormatter"){
					return resCorporationGroupDetailFormatter;
				} else if(value == "resContactGroupDetailFormatter"){
					return resContactGroupDetailFormatter;
				} else if(value == "jobStatusFormatter"){
					return jobStatusFormatter;
				} else if(value == "lookRunDetailFormatter"){
					return lookRunDetailFormatter;
				} else if(value == "jobDetailStatusFormatter"){
					return jobDetailStatusFormatter;
				} else if(value == "sseTopicStatusFormatter"){
					return sseTopicStatusFormatter;
				}else {
					return function(value, type, row, index) {
						return value;
					};
				}
			}
			return value;
		});
		return dataTableColumnsDefine;
	} catch (e) {
		alert(e);
	}
	return [];

}
function createColumnsShowDiv(columns) {
	if(document.getElementById("dataTabColumnShowNode")) {
		var dataTabColumnShowNode = $("#dataTabColumnShowNode")[0];
		dataTabColumnShowNode.innerHTML = "";
		var columnsContent = "";
		//
		for ( var i = 0; i < columns.length; i++) {
			if (columns[i].render == selectFormatter) {
				columnsContent = columnsContent + "<li id='tabColSwitch_"+i+"' role=\"presentation\" class='col-li-selector-callout col-li-selector-selected'><a href='javascript:void(0);' onclick='changeTableColumnsShowSwitch("+i+");' class=\"toggle-vis\" data-column=\"" + i + "\"><input type='checkbox' disabled></a><li>";
			} else {
				columnsContent = columnsContent + "<li id='tabColSwitch_"+i+"' role=\"presentation\" class='col-li-selector-callout col-li-selector-selected'><a href='javascript:void(0);' onclick='changeTableColumnsShowSwitch("+i+");' class=\"toggle-vis\" data-column=\"" + i + "\">" + columns[i].title + "</a><li>";
			}
		}
		dataTabColumnShowNode.innerHTML = columnsContent;
		return;
	}
}
/**
 * 控制TABLE列的显示与隐藏
 * @param i
 */
function changeTableColumnsShowSwitch(targetA){
	if($("#tabColSwitch_"+targetA).hasClass("col-li-selector-callout col-li-selector-cancel")){
		$("#tabColSwitch_"+targetA).removeClass("col-li-selector-callout col-li-selector-cancel");
		$("#tabColSwitch_"+targetA).addClass("col-li-selector-callout col-li-selector-selected");
	}else{
		$("#tabColSwitch_"+targetA).removeClass("col-li-selector-callout col-li-selector-selected");
		$("#tabColSwitch_"+targetA).addClass("col-li-selector-callout col-li-selector-cancel");
	}		
}
/**
 * 创建表格
 * @param data
 */
function createDataTable(tableReferent, otherHeight) {
	currentTableReferent = null;
	targetDataTableObject = {};
	if (tableReferent == null) {
		return;
	}
	currentTableReferent = tableReferent;
	try {
		// 创建显示列控制
		createColumnsShowDiv(tableReferent.columns);
		// 销毁并删除数据表
		$('#' + tableReferent.tableId).DataTable().destroy(false);
		// 创建数据表
		$("#" + tableReferent.tableDiv)[0].innerHTML = "<table id=\"" + tableReferent.tableId
				+ "\" class=\"table table-striped\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\"></table>";
		// 调整表格的高度 所有元素高度总各为193
		var tableYheight=getWindowHeight()-130;
		if(otherHeight != null && otherHeight != "") {
			tableYheight=getWindowHeight()-otherHeight;
		}
		// 初始化数据表 加载数据
		$('#' + tableReferent.tableId).dataTable({
			"autoWidth" : false,
			"scrollX": true,
			"scrollY": tableYheight+"px",
			"columns" : tableReferent.columns,
			"retrieve" : true,
			"language" : {
				"url" : jsPath + "plugins/datatable/resources/zh.txt"
			},
			"lengthMenu" : [ [ 20, 50, 100], [ 20, 50, 100] ],
			"serverSide" : true,
			"ajax" : {
				"url" : tableReferent.ajaxUrl,
				"type" : tableReferent.ajaxHttpMethod,
				"data" : tableReferent.ajaxParameters
			},
			"processing" : true,
			"searching" : false,
			"ordering" : tableReferent.isOrdering,
			"dom" : '<<t><ilp>>',
			"columnDefs" : [ {
				"searchable" : false,
				"orderable" : false,
				"targets" : 0
			} ],
			"order" : [],
			"destroy" : true,
			"drawCallback" : function(settings) {
				// 绘表完成
				if(document.getElementById("dataTables.row.checkAll")) {
					document.getElementById("dataTables.row.checkAll").checked = false;
				}
			},
			"initComplete" : function() {
				// 初始化完成
			}
		});
		var t = $('#' + tableReferent.tableId).DataTable();
		$('a.toggle-vis').on('click', function(e) {
			e.preventDefault();

			// Get the column API object
			var column = t.column($(this).attr('data-column'));

			// Toggle the visibility
			column.visible(!column.visible());
		});
		t.on('order.dt search.dt draw.dt', function() {
			t.column(0, {
				search : 'applied',
				order : 'applied',
				draw : 'applied'
			}).nodes().each(function(cell, i) {
				cell.innerHTML = i + 1;
			});
		}).draw();
	} catch (e) {
		alert("createDataTable:" + e);
	}
}
/**
 * 取得页面高度
 * @returns {Number}
 */
function getWindowHeight() {
	var windowHeight = 0;
	if (typeof (window.innerHeight) == 'number') {
		windowHeight = window.innerHeight;

	} else {
		if (document.documentElement && document.documentElement.clientHeight) {
			windowHeight = document.documentElement.clientHeight;
		} else {
			if (document.body && document.body.clientHeight) {
				windowHeight = document.body.clientHeight;
			}
		}
	}
	return windowHeight;
}

/**
 * 取得当前表格的头定义
 * @returns
 */
function getCurrentTableColumns() {
	return currentTableReferent.columns;
}
/**
 * 选择表格中所有的行
 */
function checkAll() {
	var chk = document.getElementById("dataTables.row.checkAll");
	var inputObj = $("input[name='dataTables.row.ckbox.id']");
	for (var i = 0; i < inputObj.length; i++) {
		var temp = inputObj[i];
		if (temp.type == "checkbox" && temp.disabled == false) {
			temp.checked = chk.checked;
		}
	}
}
/**
 * 取得表格中所有选中的行
 * @returns {Array}
 */
function getSelectedRowData() {
	/*
	var selectedRowData = [];
	var inputObj = $("input[name='dataTables.row.ckbox.id']");
	for (var i = 0; i < inputObj.length; i++) {
		var temp = inputObj[i];
		if (temp.type == "checkbox" && temp.disabled == false && temp.checked == true) {
			selectedRowData.push(jQuery.parseJSON(temp.value));
		}
	}
	return selectedRowData;
	*/
	var selectedRowData = [];
	var inputObj = $("input[name='dataTables.row.ckbox.id']");
	// 根据selectModule 选取值
	if(currentTableReferent!=null&&currentTableReferent.selectModule!=null&&currentTableReferent.selectModule=="single"){
		// single
		var singleSelectValue=inputObj.filter(':checked');
		if(singleSelectValue.val()!=null&&singleSelectValue.val()!=""){
			selectedRowData.push(targetDataTableObject[singleSelectValue.val()]);
		}
	}else{
		// more
		for (var i = 0; i < inputObj.length; i++) {
			var temp = inputObj[i];
			if (temp.type == "checkbox" && temp.disabled == false && temp.checked == true) {
				selectedRowData.push(targetDataTableObject[temp.value]);
			}
		}		
	}
	return selectedRowData;
}

/**
 * 资源下载资源
 * @param value
 * @param type
 * @param row
 * @param meta
 * @returns {String}
 */
function downResourceFormatter(value, type, row, meta) {
	var files = new Array();
	files = value.split(",");
	var content = "";
	for ( var i = 0; i < files.length; i++) {
		var targetUrl = basePath + "/application/download.downResource.action?className=" + className + "&resourcePath=" + encodeURIComponent(files[i]);
		content += "<a href=\"" + targetUrl + "\">" + files[i] + "</a>&nbsp;&nbsp;";
	}
	return content;
}

/**
 * 查看job运行情况.
 * @param value
 * @param type
 * @param row
 * @param meta
 */
function lookRunDetailFormatter(value, type, row, meta) {
	
	var width = 800; // 弹出窗口的宽度;
	var heigth = 600; // 弹出窗口的高度;
	var top = (window.screen.availHeight-30-heigth)/2; // 获得窗口的垂直位置;
	var left = (window.screen.availWidth-10-width)/2; // 获得窗口的水平位置;
	var windowParam = "height="+heigth+", width="+width+", top="+top+",left="+left+", toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no";
	
	var url = basePath + "resource/resourceView.listView.action?className=com.topsec.tss.core.web.resource.module.AppJobRunningDetail&jobId="+row.id;
	return "<a href='javascript:void(0);' onclick=\"javascript:window.open('"+url+"', 'null', '"+windowParam+"');\">"+value+"</a>";
}
/**
 * job运行状态.
 * @param value
 * @param type
 * @param row
 * @param meta
 */
function jobDetailStatusFormatter(value, type, row, meta) {
	if(value == "是") {
		return "成功";
	}else {
		return "失败";
	}
}
/**
 * 专项状态.
 * @param value
 * @param type
 * @param row
 * @param meta
 */
function sseTopicStatusFormatter(value, type, row, meta) {
	if(value == 0) {
		return "已启动";
	}else if(value == 1) {
		return "已停止";
	}else {
		return "无状态";
	}
}

/**
 * 表格RENDER方法 打开详细页面
 * @param value
 * @param type
 * @param row
 * @param index
 * @returns {String}
 */
function detailFormatter(value, type, row, index) {
	if(value==null||value==""){
		return "";
	}
	// 排除后台已经增加过动作的情况
	if(value.indexOf("<")==0){
		return value;
	}
	var len=value.replace(/[^\x00-\xff]/g, 'xx').length;

	var width = 800; // 弹出窗口的宽度;
	var heigth = 600; // 弹出窗口的高度;
	var top = (window.screen.availHeight-30-heigth)/2; // 获得窗口的垂直位置;
	var left = (window.screen.availWidth-10-width)/2; // 获得窗口的水平位置;
	var windowParam = "height="+heigth+", width="+width+", top="+top+",left="+left+", toolbar=no, menubar=no, scrollbars=yes, resizable=no,location=no, status=no";
	var url = basePath + "/resource/resourceView.detailView.action?className=" + row.className + "&id=" + row.id;
	if(len > 50) {
		return "<span onmouseover=\"$(this).popover('show');\" onmouseout=\"$(this).popover('hide');\" data-container=\"body\" data-toggle=\"popover\" data-placement=\"top\" data-content=\""+value+"\"><a onclick=\"window.open('" + url + "','详细页', '"+windowParam+"')\">" + value.substr(0,16) + "...." + "</a></span>";
	}else {
		return "<a href='javascript:void(0);' onclick=\"window.open('" + url + "','详细页', '"+windowParam+"')\">" + value + "</a>";
		
	}
	
}
/**
 * 事件类型格式化--日常专项
 * @param value
 * @param type
 * @param row
 * @param index
 * @returns
 */
function formTypeFormatter(value, type, row, index) {
	if(value == 0) {
		return "日常";
	}else if(value == 1) {
		return "专项";
	}else {
		return value;
	}
}
/**
 * 事件详细页格式化.
 * @param value
 * @param type
 * @param row
 * @param index
 */
function eventDetailFormatter(value, type, row, index) {
	
	var width = 800; // 弹出窗口的宽度;
	var heigth = 600; // 弹出窗口的高度;
	var top = (window.screen.availHeight-30-heigth)/2; // 获得窗口的垂直位置;
	var left = (window.screen.availWidth-10-width)/2; // 获得窗口的水平位置;
	var windowParam = "height="+heigth+", width="+width+", top="+top+",left="+left+", toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no";
	
	var url = basePath + "event/dealEventView.detailView.action?id="+row.id;
	return "<a href='javascript:void(0);' onclick=\"javascript:window.open('"+url+"', 'null', '"+windowParam+"');\">"+value+"</a>";
}
/**
 * 单位详细页查看
 * @param value
 * @param type
 * @param row
 * @param index
 */
function resCorporationDetailFormatter(value, type, row, index) {
	var width = 800; // 弹出窗口的宽度;
	var heigth = 600; // 弹出窗口的高度;
	var top = (window.screen.availHeight-30-heigth)/2; // 获得窗口的垂直位置;
	var left = (window.screen.availWidth-10-width)/2; // 获得窗口的水平位置;
	var windowParam = "height="+heigth+", width="+width+", top="+top+",left="+left+", toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no";
	
	var url = basePath + "/resource/resourceView.detailView.action?className="+ className +"&id="+row.id;
	
	return "<a href='javascript:void(0);' onclick=\"javascript:window.open('"+url+"', 'null', '"+windowParam+"');\">"+value+"</a>";
}

/**
 * 单位组查看单位
 * @param value
 * @param type
 * @param row
 * @param index
 */
function resCorporationGroupDetailFormatter(value, type, row, index) {
	var width = 800; // 弹出窗口的宽度;
	var heigth = 600; // 弹出窗口的高度;
	var top = (window.screen.availHeight-30-heigth)/2; // 获得窗口的垂直位置;
	var left = (window.screen.availWidth-10-width)/2; // 获得窗口的水平位置;
	var windowParam = "height="+heigth+", width="+width+", top="+top+",left="+left+", toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no";
	
	
	var url = basePath + "/resource/resourceView.listView.action?showToobar=false&className=com.topsec.tss.core.web.resource.module.ResCorporation&corporationGroupId="+row.id;
	return "<a href='javascript:void(0);' onclick=\"javascript:window.open('"+url+"', 'null', '"+windowParam+"');\">"+value+"</a>";
}

/**
 * 联系组查看联系人
 * @param value
 * @param type
 * @param row
 * @param index
 */
function resContactGroupDetailFormatter(value, type, row, index) {
	var width = 800; // 弹出窗口的宽度;
	var heigth = 600; // 弹出窗口的高度;
	var top = (window.screen.availHeight-30-heigth)/2; // 获得窗口的垂直位置;
	var left = (window.screen.availWidth-10-width)/2; // 获得窗口的水平位置;
	var windowParam = "height="+heigth+", width="+width+", top="+top+",left="+left+", toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no";
	
	
	var url = basePath + "/resource/resourceView.listView.action?className=com.topsec.tss.core.web.resource.module.ResContact&groupId="+row.id;
	return "<a href='javascript:void(0);' onclick=\"javascript" +
			":window.open('"+url+"', 'null', '"+windowParam+"');\">"+value+"</a>";
}
/**
 * JOB运行状态格式化.
 * @param value
 * @param type
 * @param row
 * @param index
 */
function jobStatusFormatter(value, type, row, index) {
	if(value == 0) {
		return "未运行";
	}else if(value == 1){
		return "<font color=\"red\">运行中</font>";
	}else if(value == 2){
		return "暂停中";
	}else if(value == 3){
		return "已停止";
	} 
}

/**
 * 表格RENDER方法 生成CHECKBOX控件
 * @param value
 * @param type
 * @param row
 * @param meta
 * @returns {String}
 */
function selectFormatter(value, type, row, meta) {
	targetDataTableObject[value] = row;
	if(currentTableReferent!=null&&currentTableReferent.selectModule!=null&&currentTableReferent.selectModule=="single"){
		return "<input type=\"radio\" name=\"dataTables.row.ckbox.id\" value=\"" + value + "\"/>";
	}else{
		return "<input type=\"checkbox\" name=\"dataTables.row.ckbox.id\" id=\"dataTables.row.ckbox.id\" value=\"" + value + "\"/>";
	}
}

function showMoreMes(name, value) {
	var subParemeter = new Array();
	subParemeter[0] = window;
	subParemeter[1] = document;
	subParemeter[2] = value;
	subParemeter[3] = name;
	var winSetStr = "status:no;dialogWidth:810px;dialogHeight:600px,resizable:yes,scroll:yes,help:no,unadorned:yes";
	//
	pageurl = basePath + "/plugins/common/showMoreMes.jsp";
	showModalDialog(pageurl, subParemeter, winSetStr);
}

function columnContextRender(value, type, row, meta) {
	if(value==null||value==""){
		return "";
	}
	if(!isNaN(value)) {
		return value;
	}
	if(value.indexOf("<")==0){
		return value;
	}
	var len=value.replace(/[^\x00-\xff]/g, 'xx').length;
	if(len > 100){
		return "<a href='javascript:void(0);' onclick=\"javascript:showMoreMes('"+meta.settings.aoColumns[meta.col].title+"','"+escape(value)+"')\">" + value.substr(0,16)+"....</a>";
	}else if(len > 20) {
		return "<span onmouseover=\"$(this).popover('show');\" onmouseout=\"$(this).popover('hide');\" data-container=\"body\" data-toggle=\"popover\" data-placement=\"top\" data-content=\""+value+"\">"+value.substr(0,16)+"....</span>";
	}
	return value;
}
