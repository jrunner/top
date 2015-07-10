/**
 * 弹出子页面，进行选择资源
 * @param ppName
 * @param disPpName
 * @param clazz
 * @param selectOperation more多选，其它单选
 */
function selectSubPageViewDialog(ppName, disPpName, clazz, selectOperation, url) {
	try {
		var subParemeter = new Array();
		subParemeter[0] = window;
		subParemeter[1] = document;
		subParemeter[2] = document.getElementById(ppName);
		subParemeter[3] = document.getElementById(disPpName);
		subParemeter[4] = selectOperation;
		var winSetStr = "status:no;dialogWidth:810px;dialogHeight:600px,resizable:no,scroll:no,help:no,unadorned:yes";
		//
		var pageurl;
		if (url != "") {
			if (url.indexOf('?') != -1) {
				pageurl = basePath + url + "&className=" + clazz;
			} else {
				pageurl = basePath + url + "?className=" + clazz;
			}

		} else {
			pageurl = basePath + "resource/resourceView.subPageListView.action?className=" + clazz;
		}
		showModalDialog(pageurl, subParemeter, winSetStr);
	} catch (e) {
		alert(e);
	}
}

function subPageInputArea(ppName, ppDescr, isReadOnly, isAllowNull, reqpath) {
	// 用来处理字符串属性太长提供用户弹出窗口输入
	var subParemeter = new Array();
	subParemeter[0] = window;
	subParemeter[1] = document;
	subParemeter[2] = document.getElementById(ppName);
	subParemeter[3] = isReadOnly;
	subParemeter[4] = isAllowNull;
	var winSetStr = "status:no;dialogWidth:400px;dialogHeight:300px,resizable:yes,scroll:yes,help:no,unadorned:yes";
	// var pageurl = reqpath + "jsp/content/subpage/inputarea.jsp?ppDescr=" +
	// ppDescr;alert(ppDescr);//修改乱码标题
	var pageurl = reqpath + "jsp/content/subpage/inputarea.jsp?ppDescr=" + encodeURIComponent(ppDescr);
	showModalDialog(pageurl, subParemeter, winSetStr);
}