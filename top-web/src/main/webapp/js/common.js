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

//选中
function CheckboxChange(obj) {
	var ckItems = document.getElementsByName("ckItem");
	for (var i = 0; i < ckItems.length; i++) {
		ckItems[i].checked = obj.checked;
	}
}

//获取选中的文本框的值
function getSelResCheckBox(){
	var ids='';
	var ckItems = document.getElementsByName("ckItem");
	for (var i = 0; i < ckItems.length; i++) {
		if(ckItems[i].checked){
			ids+=ckItems[i].value+",";
		}
	}
	
	ids = (ids.length > 0) ? ids.substring(0,ids.length-1):'';
	return ids;
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


//初始化操作
$(document).ready(function(){
	//判断页面是否有JCkItems控件，如有有则加上是否全选功能
	if($('#JCkItems')[0]!=null){
		$('#JCkItems').click(function(){
			CheckboxChange(this);
		});
	}
	
	//判断界面是否有JBtnGoBack，如果有则将是返回功能
	if($('#JBtnGoBack')[0]!=null){
		$('#JBtnGoBack').click(function(){
			window.history.back();
		});
	}
	
	//判断界面是否有JBtnClose，如果有则将是返回功能
	if($('#JBtnClose')[0]!=null){
		$('#JBtnClose').click(function(){
			self.close();
		});
	}
});


//获取opener窗口句柄，window对象
function getWindow(title){
	return $(window.top.document).contents().find("#"+title)[0].contentWindow;
}

$(window).resize(function(){
	 //函数是否存在
	if(onresize){onresize();}
});
 
//自适应id为string或array
function resizeEasyGrid(id){
	 if(isString(id)){
		 $('#'+id).datagrid('resize');
	 }
	 if(isArray(id)){
		 for(var i=0;i<id.length;i++){
			 $('#'+id[i]).datagrid('resize');
		 }
	 }
}
function isString(str){ 
	return (typeof str=='string')&&str.constructor==String; 
} 
function isArray(obj){ 
	return (typeof obj=='object')&&obj.constructor==Array; 
}
function fix(percent){  
	return document.body.clientWidth * percent; //这里你可以自己做调整  
	//return $("#divContainer").width() * percent ;
} 
document.onkeydown=function(event){ 
	e = event ? event :(window.event ? window.event : null); 
	if(e.keyCode==13){ 
		if(typeof(search)=="function") {
			search();
		}
	}
} 

function pageHeight(){
	if($.browser.msie){
		return document.compatMode == "CSS1Compat"? document.documentElement.clientHeight :
		document.body.clientHeight;
	}else{
		return self.innerHeight;
	}
};

//返回当前页面宽度
function pageWidth(){
	if($.browser.msie){
		return document.compatMode == "CSS1Compat"? document.documentElement.clientWidth :
		document.body.clientWidth;
	}else{
		return self.innerWidth;
	}
};
function getHeight(){
	if($('#divNav')[0]==null){
		return pageHeight();	
	}
	if($('#divCmd')[0]==null){
		return pageHeight()-$('#divNav')[0].offsetHeight;		
	}
	return pageHeight()-$('#divNav')[0].offsetHeight-$('#divCmd')[0].offsetHeight; 
}
function getWidth(){
	return pageWidth(); 
} 
$(window).resize(function(){
	if($("#tssGrid")[0]!=null) 	$("#tssGrid").datagrid('resize',{width:getWidth(),height:getHeight()});
}); 	


function onAddNode(id,code,pcode,url,text,treeid,icon){
	window.parent.onAddNode(null,id,code,pcode,url,text,treeid,icon);
}
function onRemoveNode(code,treeid){
	window.parent.onRemoveNode(null,code,treeid);
}
function onEditNode(code,text,treeid){
	window.parent.onEditNode(null,code,text,treeid);
}
function closeTab(){
	window.parent.closeTab();
}