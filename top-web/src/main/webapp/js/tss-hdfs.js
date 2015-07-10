//弹出页面-窗口可大可
function JOpenAutoPage(openUrl, winTitle, winHeight, winWidth) {
	wSize = "left=" + (screen.width - winWidth) / 2 + ",top=" + (screen.height - winHeight) / 2 + ",width=" + winWidth + ",height=" + winHeight;
	window.open(openUrl, winTitle, "scrollbars=yes,resizable=yes," + wSize);
}
//弹出页面-窗口不可变
function JOpenPage(openUrl, winTitle, winHeight, winWidth) {
	wSize = "left=" + (screen.width - winWidth) / 2 + ",top=" + (screen.height - winHeight) / 2 + ",width=" + winWidth + ",height=" + winHeight;
	window.open(openUrl, winTitle, "scrollbars=yes,resizable=no," + wSize);
}

//发送ajax请求,默认xml方式提交
function JSendAjax(url,value,dataType){
	if(url==null || url==''){
		alert('请求不能为空');
		return;
	}
	
	if(value==null || value=='')
		value='';
	if(dataType==null || dataType=='')
		dataType = 'xml';
	$.ajax({type: "POST",url: url, cache: false, data: value, dataType: dataType,success: JCollBack });
} 

//将容器内的表单元素构建为 json串
function getJsonByContainer(id){
	var form = $('#'+id)[0];
	var param={};
	 //文本框
	 $("input[type=text]",form).each(function(){
		 param[this.name] = this.value;
		 if($(this).attr("op") != null){
		 	param[this.name+ $(this).attr("op")] = this.value;
		 }else{
			param[this.name+ '_QUERYKEY_LIKE'] = this.value;
		 }
	 });
	 $("input[type=hidden]",form).each(function(){
	  	 //alert(this.name+","+this.value);
		 param[this.name] = this.value;
		 param[this.name+ '_QUERYKEY'] = this.value;
	 });
	 //checkbox
	 $("input[type=checkbox]:checked",form).each(function(){
		 param[this.name] = this.value;
		 param[this.name+ '_QUERYKEY'] = this.value;
	 });
	 //下拉框
	 $("select",form).each(function(){
		 param[this.name] = this.value;
		 param[this.name+ '_QUERYKEY'] = this.value;
	 });
	 return param;
}

function getQueryParam(id){
	var param = getJsonByContainer(id);
	return param;
}

function formatGrid(id){
	var t = $('#'+id).DataTable();
	$('a.toggle-vis').on('click', function(e) {
		e.preventDefault();
		// Get the column API object
		var column = t.column($(this).attr('data-column'));
		// Toggle the visibility
		column.visible(!column.visible());
	});
	//追加行号
	t.on('order.dt search.dt draw.dt', function() {
		t.column(0, {
			search : 'applied',
			order : 'applied',
			draw : 'applied'
		}).nodes().each(function(cell, i) {
			cell.innerHTML = i + 1;
		});
	}).draw();
}

var PROCESSING_CONTENT = "<div class='dataTables_processing'><div class='progress progress-striped active'><div class='progress-bar' role='progressbar' aria-valuenow='45'  aria-valuemin='0' aria-valuemax='100' style='width: 100%'>正在加载中</div></div></div>";
var language = {
		"processing": PROCESSING_CONTENT,
		"lengthMenu": "每页显示 _MENU_ 条记录   (备注：查询限制返回200条) ",
		"zeroRecords": "无数据.",
		"info": "当前 _PAGE_ 页/共 _PAGES_ 页   总计  _TOTAL_ 条记录",
		"infoEmpty": "总计  0  条记录",
		"infoFiltered": "共  _MAX_ 条记录",
		"infoPostFix": "",
		"search": "表内查找",
		"url": "",
		"emptyTable": "无数据.",
		"paginate": {
			"first":    "首页",
			"previous": "上一页",
			"next":     "下一页",
			"last":     "尾页"
		}
}; 

function initTssGrid(id,url,param,columns){
	//$('#' + id).DataTable().destroy(false);
	//调整表格的高度 所有元素高度总各为193
	var tableYheight = getWindowHeight()-130;
	// 创建数据表
	$("#tssDataTableDiv")[0].innerHTML = "<table id=\"" + id + "\" class=\"table table-striped\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\"></table>";
	$('#'+id).dataTable( {
		"ajax": {"url": url,"type":"post","data": param},
		"lengthMenu" : [ [ 20, 50, 100], [ 20, 50, 100] ],
		"dom" : '<<t><r><ilp>>',
		"scrollY": tableYheight+"px",
		"scrollX": true,
		"processing" : true,
		"searching" : true,
		"order" : [],
		"columns": columns,"language" : language
		});	
}
/**
 * 取得页面高度
 * @returns {Number}
 */
function getWindowHeight() {
	if(true){
		return $(document).height();
	}
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
function formatTssGrid(id,columns,resourceTableDiv){
	createColumnsShowDiv(columns);//创建列显示\隐藏按钮
	formatGrid(id);//格式化处理datagrid
	$('#'+resourceTableDiv)[0].className = "col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main";
	
	//$('#tableSearchModalDiv').modal("hide");
}

function selectSubPageViewDialog(ppName, disPpName, selectOperation, url) {
	try {
		var subParemeter = new Array();
		subParemeter[0] = window;
		subParemeter[1] = document;
		subParemeter[2] = document.getElementById(ppName);
		subParemeter[3] = document.getElementById(disPpName);
		subParemeter[4] = selectOperation;
		var winSetStr = "status:no;dialogWidth:410px;dialogHeight:600px,resizable:yes,scroll:yes,help:no,unadorned:yes";
		
		showModalDialog(url, subParemeter, winSetStr);
	} catch (e) {
		alert(e);
	}
}

function formatDetailView(arr){
	var html = '<table id="datagrid" style="table-layout:fixed; width: 100%;" border="0" cellpadding="0" cellspacing="0">';
	for(var i=0; i<arr.length; i++){
		html += '<tr><td width="20%" class="cellStyle">'+arr[i][0]+'</td><td><font>'+arr[i][1]+'</font></td></tr>'
	}
	html += '</table>';
	$('#content').html(html);
}

function formartText( data, type, full, meta) {
	var width = 800; // 弹出窗口的宽度;
	var heigth = 600; // 弹出窗口的高度;
	var top = (window.screen.availHeight-30-heigth)/2; // 获得窗口的垂直位置;
	var left = (window.screen.availWidth-10-width)/2; // 获得窗口的水平位置;
	var windowParam = "height="+heigth+", width="+width+", top="+top+",left="+left+", toolbar=no, menubar=no, scrollbars=yes, resizable=no,location=no, status=no";
	if(data == null){return ''};
	var v = data;
	//当长度在10-30之间，则冒泡，大于30则弹窗口
	if(data.length > 20 && data.length <= 40 ){
		v = formatMsg("<span onmouseover=\"$(this).popover('show');\" onmouseout=\"$(this).popover('hide');\" data-container=\"body\" data-toggle=\"popover\" data-placement=\"top\" data-content=\"{0}\">{1}</span>",[data,get(data,20,"...")]);
	}else if(data.length > 40 ){
		v = formatMsg("<a href=\"javascript:view('{0}')\" >{1}</a>",[full.ROW_ID,get(data,20,"...")]);
	}
	return v;
}

//详情
function formatView(id,columns,result){
	var grid = $('#'+id)[0];
	
	var rowNum = 0;//行号
	for(var i=0; i<columns.length; i++){
		 var json = columns[i];
		 if(json.title == "操作" || json.title == "序号"){continue;}
		 
		 var row = grid.insertRow(rowNum);//创建一行 
	     var cell = row.insertCell(0);//创建一个单元 
	     cell.width = "20%";//更改cell的各种属性 
	     cell.className="cellStyle";
	     cell.innerHTML=json.title + "："; 
	     cell = row.insertCell(1);//创建一个单元 
	     cell.width = "80%";//更改cell的各种属性 
	     cell.innerHTML=result[json.data]; 
	     rowNum++;
	}
}

function reloadDataGrid(){
	resetSearchForm();
	searchResource();
}

function onback(){
	window.history.back();
}

$(window).resize(function(){
});

$(document).ready(function() {
	if(isFunction('searchResource')){
		//searchResource();
	}
	
	if($('#resetSearchForm').length > 0){
		$('#resetSearchForm').click(function(){
			resetSearchForm();
		});
	}
	if($('#searchResource').length > 0){
		$('#searchResource').click(function(){
			searchResource();
		});
	}
	
	//判断是否存在，如果存在则，添加如下方法
	if($('#global_filter').length > 0){
		$('#global_filter').attr('placeholder','实时检索 (CTRL+L 清空)');
		//$('#global_filter').attr('title','快捷键：CTRL+L 清空');//(CTRL+L 清空)
		
		$('#global_filter').on('keyup click', function () {
			 $('#datagrid').DataTable().search($('#global_filter').val(),true,true).draw();
		});
	}
	
	document.onkeydown = function(event) {
		var e = event || window.event || arguments.callee.caller.arguments[0];
		//alert(e.keyCode);
		//执行：ctrl+回车
		if (e && e.keyCode == 13 && e.ctrlKey) {
			//execute();
		}
		//清空: ctrl+退格
		if (e && e.keyCode == 8 && e.ctrlKey) {
			//clearForm();
		}
		//清空: ctrl+l
		if (e && e.keyCode == 76 && e.ctrlKey) {
			if($('#global_filter').length > 0){
				//清空文本框的内容
				$('#global_filter').val('');
				//恢复原始内容
				$('#global_filter').click();
			}
		}
	};
}); 

//重置
function resetSearchForm(){
	if($('#confirmForm')[0]){
		$('#confirmForm')[0].reset();
	}
}

//是否存在指定函数 
function isFunction(funcName) {
    try {
        if (typeof(eval(funcName)) == "function") {
            return true;
        }
    } catch(e) {}
    return false;
}
//是否存在指定变量 
function isVariable(variableName) {
    try {
        if (typeof(variableName) == "undefined") {
            //alert("value is undefined"); 
            return false;
        } else {
            //alert("value is true"); 
            return true;
        }
    } catch(e) {}
    return false;
}

//加入内置函数
var GlobalFunction = function(obj){
	obj = obj || {};
    return {
    	/**
    	 * 表单提交
    	 * url:跳转的地址
    	 * json:json格式的数据
    	 * targe:打开方式,例如:_blank
    	 */
    	formSubmit:function (url,json,target) {
    		//表单提交方法
		    var turnForm = document.createElement("form");   
		    //一定要加入到body中！！   
		    document.body.appendChild(turnForm);
		    turnForm.method = 'post';
			turnForm.action =  url;
			if(target){
				turnForm.target = target;
			}
			//创建隐藏表单
			$.each(json,function(key,value){ 
				var newElement = document.createElement("input");
				newElement.setAttribute("name",key);
				newElement.setAttribute("type","hidden");
				newElement.setAttribute("value",value);
				turnForm.appendChild(newElement);
		    });
			turnForm.submit();
		},
		/**
		 * 初始化表格
		 * json:json格式的数据
		 */
		initForm:function(json){
			$.each(json,function(key,value){
				//判断是id为key的对象存在，存在则赋值
				if($('#'+key)[0]!=null){
					$('#'+key).val(value);
				}
		    });
		}
    }
}

//创建默认js对象
var _TSS = new GlobalFunction();


function JFormartCheckBox(data) {
	return "<input name='dataTables.row.ckbox.id' type='checkbox' value="+data+">";
}
/**
 * 选择表格中所有的行
 */
function JCheckAll() {
	var chk = document.getElementById("dataTables.row.checkAll");
	chk.checked = !chk.checked;
	var inputObj = $("input[name='dataTables.row.ckbox.id']");
	for (var i = 0; i < inputObj.length; i++) {
		var temp = inputObj[i];
		if (temp.type == "checkbox") {
			temp.checked = chk.checked;
		}
	}
}

function JGetSelected(){
	var inputObj = $("input[name='dataTables.row.ckbox.id']");
	if($("input[name='dataTables.row.ckbox.id']").is(':checked') == false){
		$.messager.alert('提示信息', '请选择需要删除的记录!', 'warning');
		return;
	}
	
	var selectedRowData = ""; 
	var selectData = '';
	for (var i = 0; i < inputObj.length; i++) {
		var temp = inputObj[i];
		if (temp.type == "checkbox" && temp.checked == true) {
			selectData += "将要删除的资源 :"+temp.value+ "<br>";
			selectedRowData+=temp.value+",";
		}
	}
	
	
	return {"ids":selectedRowData,"tips":selectData};
}

/**
 *	删除触发事件
 */
function JDeleteRow(table,url){
	var json = JGetSelected();
	if(json.ids == null || json.ids == ''){
		return;
	}
	
	$.messager.confirm('提示信息', json.tips, function() {
		var param = {ids: json.ids , oper:'del'};		
		param['table'] = table;
	   	JSendAjax(url, param, "json");
	});
}


function getOpenerValue(id){
	if(opener != null && opener.document.getElementById(id) != null){
		return opener.document.getElementById(id).value;
	}else if(getArgs()[id] !=null){
		return getArgs()[id]; 
	}
	return null;
}

function getArgs(){
	var args = new Object();
	var query = decodeURI(location.search.substring(1));	//Get query string
	var pairs = query.split("&");
	for(var i=0; i<pairs.length;i++){
		var pos = pairs[i].indexOf('=');	//Look for "name=value"
		if(pos == -1) continue;				//If not found,skip
		var argname = pairs[i].substring(0,pos);//Extract the name
		var value = pairs[i].substring(pos +1); //Extract the value
		args[argname] = value;
	}
	return args;
}

function formatMsg(input,args) {
	for(var i=0;i<args.length; i++){
		input = input.replace("{" + i + "}", args[i]);
	}
	return input;
}
function getLast(value,maxLength,prefix) {
	var s = value;
	if (value != null && value.length > maxLength) {
		s = prefix + s.substring(s.length - maxLength);
	}
	return s;
}
function get(value, maxLength, fix) {
	var s = value;
	if (value != null && value.length > maxLength) {
		s = s.substring(0, maxLength) + fix;
	}
	return s;
}