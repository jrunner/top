$.messager.model = {
	ok : {
		text : "确认",
		classed : 'btn btn-primary'
	},
	cancel : {
		text : "取消",
		classed : 'btn btn-default'
	}
};
// 发送ajax请求,默认xml方式提交
function JSendAjax(url, value, dataType, operation) {
	try {
		if (url == null || url == '') {
			alert('请求不能为空');
			return;
		}

		if (value == null || value == '')
			value = '';
		if (dataType == null || dataType == '')
			dataType = 'xml';
		$.ajax({
			type : "POST",
			url : url,
			cache : false,
			data : value,
			dataType : dataType,
			success : function(data, textStatus) {
				if (data.flag) {
					var mes = operation + '成功!';
					if (data.mes) {
						mes = data.mes;
					}
					reloadDataGrid();
					$.messager.alert("提示信息", mes);
				} else {
					if (data.mes) {
						$.messager.alert('提示信息', data.mes);
					} else {
						$.messager.alert('提示信息', operation + '失败!');
					}
				}
			}
		});
	} catch (e) {
		alert(e);
	}
}

/**
 * 刷新表格
 */
function reloadDataGrid() {
	try {
		// 刷新页面 ，保持当前参数
		$('#tssDataTableDivTable').DataTable().ajax.reload(null, false);
	} catch (e) {
		alert(e);
	}
}

/**
 * 查询方法,查询后刷新表格
 **/
function searchResource() {

	try {
		var searchFormObj = document.getElementById("searchForm");
		var dataTableSearchConidition = jQuery.parseJSON(searchFormObj.getAttribute("optData"));
		for ( var i = 0; i < searchFormObj.length; i++) {
			dataTableSearchConidition[searchFormObj[i].name] = searchFormObj[i].value;
		}
		var myRefernt = getCurrentTableReferent();
		myRefernt.ajaxParameters = dataTableSearchConidition;
		createDataTable(myRefernt);
	} catch (e) {
		alert(e);
	}
}
function showDialog(targetUrl, operationName) {
	try {
		var targetOperationName = "操作";
		if (operationName != null && targetOperationName != "") {
			targetOperationName = operationName;
		}
		if (document.getElementById("resourceOperationModalDiv")) {
			$('#resourceOperationModalDiv').modal("show");
			document.getElementById("resourceOperationModalDivFrame").src = targetUrl;
			$("#resourceOperationModalDiv #resourceOperationLabel").html(targetOperationName);
		}
	} catch (e) {
		alert(e);
	}
}

function showAjaxResultDialog(targetUrl) {
	try {
		$('#ajaxOperationResourceModalDiv').modal("show");
		document.getElementById("ajaxOperationResourceModalDivFrame").src = targetUrl;
	} catch (e) {
		alert(e);
	}
}

/**
*	详细页跳转路径
**/
function detail(targetUrl) {
	// showDialog(basePath+targetUrl,"查看详细信息");
	// var winSetStr =
	// "status:no;dialogWidth:810px;dialogHeight:600px,resizable:yes,scroll:yes,help:no,unadorned:yes";

	var width = 800; // 弹出窗口的宽度;
	var heigth = 600; // 弹出窗口的高度;
	var top = (window.screen.availHeight - 30 - heigth) / 2; // 获得窗口的垂直位置;
	var left = (window.screen.availWidth - 10 - width) / 2; // 获得窗口的水平位置;
	var windowParam = "height=" + heigth + ", width=" + width + ", top=" + top + ",left=" + left + ", toolbar=no, menubar=no, scrollbars=yes, resizable=no,location=no, status=no";

	window.open(basePath + targetUrl, '_target', windowParam);

	//
	// showModalDialog(basePath + targetUrl, null, winSetStr);
}

// 文件下载
function downResource(uuid) {
	try {
		if (uuid == "") {
			alert("文件下载ID不能为null!");
			return;
		}
		var targetUrl = basePath + "/application/download.downloadAttachmentByUuid.action?uuid=" + encodeURIComponent(uuid);
		window.location.href = targetUrl;
	} catch (e) {
		alert(e);
	}
}

/**
 * 新建资源 新建组
 */
function TSSF0203_JS_Add() {
	try {
		var url = basePath + "/resource/resourceView.createView.action?className=" + className;
		showDialog(url, "新建组");
	} catch (e) {
		alert(e);
	}

}
/**
 * 修改资源 修改组
 */
function TSSF0204_JS_Edit() {
	try {
		var rows = getSelectedRowData();
		if (rows.length != 1) {
			$.messager.alert('提示信息', '请选择一条数据进行编辑', 'warning');
			return;
		} else {
			var url = basePath + "/resource/resourceView.updateView.action?className=" + className + "&id=" + rows[0].id;
			showDialog(url, "编辑资源");
		}
	} catch (e) {
		alert(e);
	}
}
/**
 * 删除资源 删除用户组
 */
function TSSF0205_JS_Delete() {
	try {
		var ids = [];
		var rows = getSelectedRowData();

		if (rows.length == 0) {
			$.messager.alert('提示信息', '请选择需要删除的记录!', 'warning');
			return;
		} else {
			var columns = getCurrentTableColumns();
			var selectDate = "";
			for ( var i = 0; i < rows.length; i++) {
				ids.push(rows[i].id);
				selectDate += "将要删除资源 : " + rows[i][columns[2]["data"]] + "<br>";
			}
			$.messager.confirm('提示信息', selectDate, function() {
				var data = {};
				data["className"] = className;
				data["ids"] = ids.join(',');
				JSendAjax(basePath + "resource/resource.batchDeleteResource.action", data, "json", "删除");
			});
		}
	} catch (e) {
		alert(e);
	}
}
/**
 * 修改资源 修改用户
 */
function TSSF0202_JS_Edit() {
	try {
		var rows = getSelectedRowData();
		if (rows.length != 1) {
			$.messager.alert('提示信息', '请选择需要编辑的用户!', 'warning');
			return;
		} else {
			var url = basePath + "/resource/resourceView.updateView.action?className=" + className + "&id=" + rows[0].id;
			showDialog(url, "修改用户");
		}
	} catch (e) {
		alert(e);
	}
}
/**
 * 导入资源
 */
function TSSF0104_JS_importData() {
	try {
		var url = basePath + "resource/resourceView.importResourceUploadView.action?className=" + className;
		window.open(url, '导入资源')
	} catch (e) {
		alert(e);
	}
}
/**
* 单位导入
*/
function TSSF0104_JS_corporatImportData() {
	try {
		var rows = getSelectedRowData();

		if (rows.length > 1) {
			$.messager.alert('提示信息', '请选择一条数据!');
			return;
		} else {
			if (rows.length == 1) {
				var id = rows[0].id;
				var referentClassName = "belongCorporationId";
				var url = basePath + "resource/resourceView.importResourceUploadView.action?className=" + className + "&referentId=" + id + "&referentClassName="
						+ referentClassName;
				window.open(url, '导入资源');
			} else {
				var url = basePath + "resource/resourceView.importResourceUploadView.action?className=" + className;
				window.open(url, '导入资源');
			}

		}
	} catch (e) {
		alert(e);
	}
}
/**
 * 导出对应的选择记录
 */
function TSSF0105_JS_exportData() {
	try {
		var ids = [];
		var rows = getSelectedRowData();

		if (rows.length == 0) {
			$.messager.alert('提示信息', '请选择需要导出的记录!');
			return;
		} else {
			var data = {};
			for ( var i = 0; i < rows.length; i++) {
				ids.push(rows[i].id);
			}
			// data["className"] = className;
			// data["ids"] = ids.join(',');
			window.location.href = basePath + "resource/resource.exportResource.action?className=" + className + "&ids=" + ids.join(",");
			// JSendAjax(basePath + "resource/resource.exportResource.action",
			// data, "json", "导出数据");
		}
	} catch (e) {
		alert(e);
	}
}

/**资源类 JS APPJOB运行结果**/
function TSSF0407_JS_LookRunDetail() {
	try {
		var ids = "";
		var rows = getSelectedRowData();

		if (rows.length != 1) {
			$.messager.alert('提示信息', '请选择一条数据!');
			return;
		} else {
			ids = rows[0].id;
			var url = basePath + "resource/resourceView.listView.action?className=com.topsec.tss.core.web.resource.module.AppJobRunningDetail&jobId=" + ids;
			// window.open(url, 'JOB运行状况',
			// 'top=150,left=200,status:no;dialogWidth:700px;dialogHeight:550px,resizable:yes,scroll:0,help:no')\
			showModalDialog(url, null, "'top=150,left=200,status:no;dialogWidth:800px;dialogHeight:600px,resizable:yes,scroll:0,help:no'");
		}
	} catch (e) {
		alert(e);
	}
}

/**资源类 JS APPJOB停止**/
function TSSF0406_JS_Stop() {
	try {
		var ids = [];
		var rows = getSelectedRowData();

		if (rows.length != 1) {
			$.messager.alert('提示信息', '请选择一条数据!');
			return;
		} else {
			if (rows[0].status != 1) {
				$.messager.alert('提示信息', '请选择在运行中的任务停止!');
				return;
			}
			for ( var i = 0; i < rows.length; i++) {
				ids.push(rows[i].id);
			}
			$.messager.confirm('提示信息', "是否将选择的任务进行停止?", function() {
				var data = {};
				data["id"] = ids.join(',');
				JSendAjax(basePath + "application/appJob.stopJob.action", data, "json", "停止任务");
			});
		}
	} catch (e) {
		alert(e);
	}
}

/**资源类 JS APPJOB启动**/
function TSSF0405_JS_Start() {
	try {
		var ids = [];
		var rows = getSelectedRowData();

		if (rows.length != 1) {
			$.messager.alert('提示信息', '请选择一条数据!');
			return;
		} else {
			if (rows[0].status == 1) {
				$.messager.alert('提示信息', '任务已经启动!');
				return;
			}
			for ( var i = 0; i < rows.length; i++) {
				ids.push(rows[i].id);
			}
			$.messager.confirm('提示信息', "是否将选择的任务进行启动?", function() {
				var data = {};
				data["id"] = ids.join(',');
				JSendAjax(basePath + "application/appJob.startJob.action", data, "json", "启动任务");
			});
		}
	} catch (e) {
		alert(e);
	}
}
/**资源类 JS APPJOB立即运行**/
function TSSF0404_JS_RunNow() {
	try {
		var ids = [];
		var rows = getSelectedRowData();

		if (rows.length != 1) {
			$.messager.alert('提示信息', '请选择一条数据!');
			return;
		} else {
			for ( var i = 0; i < rows.length; i++) {
				ids.push(rows[i].id);
			}
			$.messager.confirm('提示信息', "是否立即执行一次任务?", function() {
				var data = {};
				data["id"] = ids.join(',');
				JSendAjax(basePath + "application/appJob.jobRunNow.action", data, "json", "手动执行任务");
			});
		}
	} catch (e) {
		alert(e);
	}
}
/**资源类 JS APPJOB删除**/
function TSSF0403_JS_Delete() {
	try {
		var ids = [];
		var rows = getSelectedRowData();

		if (rows.length == 0) {
			$.messager.alert('提示信息', '请选择一条数据!');
			return;
		} else {
			var columns = getCurrentTableColumns();
			var selectDate = "";
			for ( var i = 0; i < rows.length; i++) {
				ids.push(rows[i].id);
				selectDate += "删除 :" + rows[i][columns[2]["data"]] + "<br>";
			}
			$.messager.confirm('提示信息', selectDate, function() {
				var data = {};
				data["className"] = className;
				data["ids"] = ids.join(',');
				JSendAjax(basePath + "application/appJob.batchDeleteJob.action", data, "json", "删除任务");
			});
		}
	} catch (e) {
		alert(e);
	}
}
/**资源类 JS通报任务编辑***/
function TSSF0402_JS_Edit() {
	try {
		var rows = getSelectedRowData();
		if (rows.length != 1) {
			$.messager.alert('提示信息', '请选择一条数据进行编辑');
			return;
		} else {
			if (rows[0].status == 1) {
				$.messager.alert('提示信息', '不能选择在运行中的任务进行修改!');
				return;
			}
			var url = basePath + "/resource/resourceView.updateView.action?className=" + className + "&id=" + rows[0].id;
			showDialog(url, "通报任务修改");
		}
	} catch (e) {
		alert(e);
	}
}
/**资源类 JS通报任务添加***/
function TSSF0401_JS_Add() {
	try {
		var url = basePath + "/resource/resourceView.createView.action?className=" + className + "&actionTarget=application/appJob.saveAppJob.action";
		showDialog(url, "通报任务添加");
	} catch (e) {
		alert(e);
	}
}
/**资源类 JS添加方法**/
function TSSF0101_JS_Add() {
	try {
		var url = basePath + "/resource/resourceView.createView.action?className=" + className;
		showDialog(url, "添加资源");
	} catch (e) {
		alert(e);
	}
}
/**资源类 JS设置关系**/
function TSSF0101_JS_Authorize() {
	try {
		var url = basePath + "/resource/resourceView.createView.action?className=" + className + "&actionTarget=resource/relation.saveRelation.action";
		showDialog(url, "设置关系");
	} catch (e) {
		alert(e);
	}

}
/**资源类 JS单位设置签约合同***/
function TSSF0702_JS_SignContract() {
	try {
		var ids = [];
		var names = [];
		var rows = getSelectedRowData();
		var columns = getCurrentTableColumns();
		if (rows.length != 1) {
			$.messager.alert('提示信息', '请选择一家单位进行设置签约合同操作');
			return;
		} else {
			// for ( var i = 0; i < rows.length; i++) {
			if (rows[0].isSign.indexOf("否") > -1) {
				$.messager.alert('提示信息', rows[0].name + '不是一家可以签约的单位,请选择一家可签约的单位进行签订合同!');
				return;
			}
			ids.push(rows[0].id);
			names.push(rows[0][columns[2]["data"]]);
			// }
		}

		var assignNames = "belongCorporationId,belongCorporationId_display";
		var assignValues = ids.join(',') + "*" + names.join(',');
		var url = basePath + "/resource/resourceView.createView.action?className=com.topsec.tss.core.web.resource.module.ResContract" + "&assignNames="
				+ encodeURIComponent(assignNames) + "&assignValues=" + encodeURIComponent(assignValues);
		showDialog(url, "单位设置签约合同");
	} catch (e) {
		alert(e);
	}
}
/**资源类 JS联系组设置联系人**/
function TSSF0501_JS_Authorize() {
	try {
		var ids = [];
		var names = [];
		var rows = getSelectedRowData();
		var columns = getCurrentTableColumns();
		if (rows.length > 0) {
			for ( var i = 0; i < rows.length; i++) {
				ids.push(rows[i].id);
				names.push(rows[i][columns[2]["data"]]);
			}
		}
		var assignNames = "groupId,groupId_display";
		var assignValues = ids.join(',') + "*" + names.join(',');
		var url = basePath + "/resource/resourceView.createView.action?className=com.topsec.tss.core.web.resource.module.RelResContactGroup"
				+ "&actionTarget=resource/relation.saveRelation.action&assignNames=" + encodeURIComponent(assignNames) + "&assignValues=" + encodeURIComponent(assignValues);
		showDialog(url, "联系组设置联系人");
	} catch (e) {
		alert(e);
	}
}
/**资源类 JS单位设置联系人**/
function TSSF0701_JS_Authorize() {
	try {
		var ids = [];
		var names = [];
		var rows = getSelectedRowData();
		var columns = getCurrentTableColumns();
		if (rows.length != 1) {
			$.messager.alert('提示信息', '请选择一条数据!');
			return;
		} else {
			for ( var i = 0; i < rows.length; i++) {
				ids.push(rows[i].id);
				names.push(rows[i][columns[2]["data"]]);
			}
		}
		var assignNames = "belongCorporationId,belongCorporationId_display";
		var assignValues = ids.join(',') + "*" + names.join(',');
		var url = basePath + "/resource/resourceView.createView.action?className=com.topsec.tss.core.web.resource.module.ResContact" + "&assignNames="
				+ encodeURIComponent(assignNames) + "&assignValues=" + encodeURIComponent(assignValues);
		showDialog(url, "单位设置联系人");
	} catch (e) {
		alert(e);
	}
}
/**资源类 JS联系组删除联系人**/
function TSSF0502_JS_Delete() {
	try {
		var ids = "";
		var rows = getSelectedRowData();

		if (rows.length != 1) {
			$.messager.alert('提示信息', '请选择一条数据!');
			return;
		} else {
			ids = rows[0].id;
			var url = basePath + "/resource/resourceView.listView.action?className=com.topsec.tss.core.web.resource.module.RelResContactGroup&showToobar=true&groupId=" + ids;
			var winSetStr = "status:no;dialogWidth:800px;dialogHeight:600px,resizable:yes,scroll:yes,help:no,unadorned:yes";
			showModalDialog(url, null, winSetStr);
			// showDetailDialog(url);
		}
	} catch (e) {
		alert(e);
	}
}

/**资源类 JS单位组删除单位**/
function TSSF0602_JS_Delete() {
	try {
		var ids = "";
		var rows = getSelectedRowData();

		if (rows.length != 1) {
			$.messager.alert('提示信息', '请选择一条数据!');
			return;
		} else {
			ids = rows[0].id;
			var url = basePath
					+ "/resource/resourceView.listView.action?className=com.topsec.tss.core.web.resource.module.RelResCorporationGroup&showToobar=true&corporationGroupId=" + ids;
			var winSetStr = "status:no;dialogWidth:800px;dialogHeight:600px,resizable:yes,scroll:yes,help:no,unadorned:yes";
			showModalDialog(url, null, winSetStr);
			// showDetailDialog(url);
		}
	} catch (e) {
		alert(e);
	}
}

/**资源类 JS单位组设置单位**/
function TSSF0601_JS_Authorize() {
	try {
		var ids = [];
		var names = [];
		var rows = getSelectedRowData();
		var columns = getCurrentTableColumns();
		if (rows.length > 0) {
			for ( var i = 0; i < rows.length; i++) {
				ids.push(rows[i].id);
				names.push(rows[i][columns[2]["data"]]);
			}
		}
		var assignNames = "corporationGroupId,corporationGroupId_display";
		var assignValues = ids.join(',') + "*" + names.join(',');
		var url = basePath + "/resource/resourceView.createView.action?className=com.topsec.tss.core.web.resource.module.RelResCorporationGroup"
				+ "&actionTarget=resource/relation.saveRelation.action&assignNames=" + encodeURIComponent(assignNames) + "&assignValues=" + encodeURIComponent(assignValues);
		showDialog(url, "单位组设置单位");
	} catch (e) {
		alert(e);
	}
}
/**资源类 JS编辑方法**/
function TSSF0102_JS_Edit() {
	try {
		var rows = getSelectedRowData();
		if (rows.length != 1) {
			$.messager.alert('提示信息', '请选择一条数据进行编辑');
			return;
		} else {
			var url = basePath + "/resource/resourceView.updateView.action?className=" + className + "&id=" + rows[0].id;
			showDialog(url, "修改资源");
		}
	} catch (e) {
		alert(e);
	}
}
/**资源类 JS逻辑删除单位组和单位的关系**/
function TSSF0103_JS_LogicDelete() {
	try {
		var ids = [];
		var rows = getSelectedRowData();

		if (rows.length == 0) {
			$.messager.alert('提示信息', '请选择一条数据!');
			return;
		} else {
			var columns = getCurrentTableColumns();
			var selectDate = "";
			for ( var i = 0; i < rows.length; i++) {
				ids.push(rows[i].id);
				selectDate += "将要删除的资源:" + rows[i][columns[2]["data"]] + "<br>";
			}
			$.messager.confirm('提示信息', selectDate, function() {
				var data = {};
				data["className"] = className;
				data["ids"] = ids.join(',');
				data["isDelete"] = 1;
				JSendAjax(basePath + "resource/relation.batchLogicDeleteRelation.action", data, "json", "逻辑删除");
			});
		}
	} catch (e) {
		alert(e);
	}

}

/**资源类 JS删除方法**/
function TSSF0103_JS_Delete() {
	try {
		var ids = [];
		var rows = getSelectedRowData();

		if (rows.length == 0) {
			$.messager.alert('提示信息', '请选择一条数据!');
			return;
		} else {
			var columns = getCurrentTableColumns();
			var selectDate = "";
			for ( var i = 0; i < rows.length; i++) {
				ids.push(rows[i].id);
				selectDate += "将要删除的资源:" + rows[i][columns[2]["data"]] + "<br>";
			}
			$.messager.confirm('提示信息', selectDate, function() {
				var data = {};
				data["className"] = className;
				data["ids"] = ids.join(',');
				JSendAjax(basePath + "resource/resource.batchDeleteResource.action", data, "json", "删除资源");
			});
		}
	} catch (e) {
		alert(e);
	}
}
/**用户 JS添加方法**/
function TSSF0201_JS_Add() {
	try {
		var url = basePath + "/resource/resourceView.createView.action?className=" + className;
		showDialog(url, "增加资源");
	} catch (e) {
		alert(e);
	}
}
/**角色 JS添加方法**/
function TSSF0206_JS_Add() {
	try {
		var url = basePath + "/resource/resourceView.createView.action?className=" + className;
		showDialog(url, "增加资源");
	} catch (e) {
		alert(e);
	}
}
/**角色 JS删除方法**/
function TSSF0207_JS_Delete() {
	try {
		var ids = [];
		var rows = getSelectedRowData();

		if (rows.length == 0) {
			$.messager.alert('提示信息', '请选择一条数据!');
			return;
		} else {
			var columns = getCurrentTableColumns();
			var selectDate = "";
			for ( var i = 0; i < rows.length; i++) {
				ids.push(rows[i].id);
				selectDate += "将要删除的角色 :" + rows[i][columns[2]["data"]] + "<br>";
			}
			$.messager.confirm('提示信息', selectDate, function() {
				var data = {};
				data["className"] = className;
				data["ids"] = ids.join(',');
				JSendAjax(basePath + "resource/resource.batchDeleteResource.action", data, "json", "删除角色");
			});
		}
	} catch (e) {
		alert(e);
	}
}
/**设置用户组关系**/
function TSSF0208_JS_Authorize() {
	try {
		var url = basePath + "/resource/resourceView.createView.action?className=" + className + "&actionTarget=resource/relation.saveRelation.action";
		showDialog(url, "设置用户组关系");
	} catch (e) {
		alert(e);
	}
}
/**取消用户组关系**/
function TSSF0209_JS_Delete() {
	try {
		var ids = [];
		var rows = getSelectedRowData();

		if (rows.length == 0) {
			$.messager.alert('提示信息', '请选择一条数据!');
			return;
		} else {
			var columns = getCurrentTableColumns();
			var selectDate = "";
			for ( var i = 0; i < rows.length; i++) {
				ids.push(rows[i].id);
				selectDate += "删除 :" + rows[i][columns[2]["data"]] + "<br>";
			}
			$.messager.confirm('提示信息', selectDate, function() {
				var data = {};
				data["className"] = className;
				data["ids"] = ids.join(',');
				JSendAjax(basePath + "resource/resource.batchDeleteResource.action", data, "json", "取消用户组关系");
			});
		}
	} catch (e) {
		alert(e);
	}
}
/**设置角色组关系**/
function TSSF0210_JS_Authorize() {
	try {
		var url = basePath + "/resource/resourceView.createView.action?className=" + className + "&actionTarget=resource/relation.saveRelation.action";
		showDialog(url, "设置角色组关系");
	} catch (e) {
		alert(e);
	}
}
/**取消角色组关系**/
function TSSF0211_JS_Delete() {
	try {
		var ids = [];
		var rows = getSelectedRowData();
		if (rows.length == 0) {
			$.messager.alert('提示信息', '请选择一条数据!');
			return;
		} else {
			var columns = getCurrentTableColumns();
			var selectDate = "";
			for ( var i = 0; i < rows.length; i++) {
				ids.push(rows[i].id);
				selectDate += "删除 :" + rows[i][columns[2]["data"]] + "<br>";
			}
			$.messager.confirm('提示信息', selectDate, function() {
				var data = {};
				data["className"] = className;
				data["ids"] = ids.join(',');
				JSendAjax(basePath + "resource/resource.batchDeleteResource.action", data, "json", "取消角色组关系");
			});
		}
	} catch (e) {
		alert(e);
	}
}
/**设置角色权限关系**/
function TSSF0212_JS_Authorize() {
	try {
		var url = basePath + "/resource/resourceView.createView.action?className=" + className + "&actionTarget=resource/relation.saveRelation.action";
		showDialog(url, "设置角色权限关系");
	} catch (e) {
		alert(e);
	}
}
/**取消角色关系关系**/
function TSSF0213_JS_Delete() {
	try {
		var ids = [];
		var rows = getSelectedRowData();

		if (rows.length == 0) {
			$.messager.alert('提示信息', '请选择一条数据!');
			return;
		} else {
			var columns = getCurrentTableColumns();
			var selectDate = "";
			for ( var i = 0; i < rows.length; i++) {
				ids.push(rows[i].id);
				selectDate += "删除 :" + rows[i][columns[2]["data"]] + "<br>";
			}
			$.messager.confirm('提示信息', selectDate, function() {
				var data = {};
				data["className"] = className;
				data["ids"] = ids.join(',');
				JSendAjax(basePath + "resource/resource.batchDeleteResource.action", data, "json", "取消角色关系关系");
			});
		}
	} catch (e) {
		alert(e);
	}
}
/**
 * 信息外发
 */
function TSSF0801_JS_Send() {
	try {
		var url = basePath
				+ "/resource/resourceView.createView.action?className=com.topsec.tss.core.web.resource.module.RelAutUserResShareInfo&actionTarget=resource/relation.saveRelation.action";
		showDialog(url, "信息外发");
	} catch (e) {
		alert(e);
	}
}

/**
* 事件确认
***/
function eventConfirm() {
	try {
		var ids = [];
		var rows = getSelectedRowData();

		// 数据没选中进行提示
		if (rows.length == 0) {
			$.messager.alert('提示信息', '请选择需要确认的安全事件!', 'warning');
			return;
		}
		for ( var i = 0; i < rows.length; i++) {
			ids.push(rows[i].id);
		}

		// var pageurl = basePath +
		// "/event/dealEventView.eventConfirmView.action?eventIds=" +
		// ids.join(',') + "&corporationId=" + $("#dealCorporationId").val() +
		// "&corporationName="
		// + encodeURI(encodeURI($("#corporationName").val()));
		var pageurl = basePath + "/event/dealEventView.eventConfirmView.action?eventIds=" + ids.join(',') + "&corporationId=" + $("#dealCorporationId").val() + "&corporationName="
				+ encodeURIComponent($("#corporationName").val());
		showDialog(pageurl);
		// showModalDialog(pageurl, subParemeter, winSetStr);
		reloadDataGrid();
	} catch (e) {
		alert(e);
	}
}
/**
 * 事件忽略
 **/
function eventIgnore() {
	try {
		var ids = [];
		var rows = getSelectedRowData();
		if (rows.length == 0) {
			$.messager.alert('提示信息', '请选择一条数据!', 'warning');
			return;
		}
		for ( var i = 0; i < rows.length; i++) {
			ids.push(rows[i].id);
		}
		$.messager.confirm('提示信息', "是否将所选的事件忽略?", function() {
			/*var subParemeter = new Array();
			var winSetStr = "top=550,left=550,status:no;dialogWidth:500px;dialogHeight:300px,resizable:yes,scroll:yes,help:no,unadorned:yes";
			var pageurl = basePath + "event/dealEvent.dealEvent.action?id="+ids.join(',')+"&dealAction="+encodeURI(encodeURI("忽略"));
			showModalDialog(pageurl, subParemeter, winSetStr);*/
			// $.messager.alert("This is message!");
			var pageurl = basePath + "event/dealEvent.dealEvent.action?id=" + ids.join(',') + "&dealAction=" + encodeURIComponent("忽略");
			// showDialog(pageurl);
			showAjaxResultDialog(pageurl);
			reloadDataGrid();
		});
	} catch (e) {
		alert(e);
	}
}

/**
 * 事件回退
 **/
function singleEventBack() {
	try {
		var ids = [];
		var rows = getSelectedRowData();
		if (rows.length == 0) {
			$.messager.alert('提示信息', '请选择一条数据!', 'warning');
			return;
		}
		for ( var i = 0; i < rows.length; i++) {
			ids.push(rows[i].id);
		}
		$.messager.confirm('提示信息', "是否要将事件进行回退?", function() {
			var pageurl = basePath + "event/dealEvent.dealEvent.action?id=" + ids + "&dealAction=" + encodeURIComponent("回退");
			showAjaxResultDialog(pageurl);
			reloadDataGrid();
		});

	} catch (e) {
		alert(e);
	}
}

/**
* 事件处置
**/
function deal() {
	try {
		var ids = [];
		var rows = getSelectedRowData();
		if (rows.length == 0) {
			$.messager.alert('提示信息', '请选择一条数据!', 'warning');
			return;
		}
		for ( var i = 0; i < rows.length; i++) {
			ids.push(rows[i].id);
		}
		// var subParemeter = new Array();
		// var winSetStr =
		// "status:no;dialogWidth:800px;dialogHeight:600px,resizable:yes,scroll:yes,help:no,unadorned:yes";
		var params1 = "&corporationId=" + $("#dealCorporationId").val() + "&corporationName=" + encodeURIComponent($("#corporationName").val());
		var pageurl = basePath + "/event/dealEventView.dealView.action?formType=" + $("#dealMonitorType").val() + "&eventIds=" + ids + params1;
		// showModalDialog(pageurl, subParemeter, winSetStr);
		showDialog(pageurl);
		reloadDataGrid();
	} catch (e) {
		alert(e);
	}
}
/**
 * 更改公函号打开页面.
 */
function changeDealDocSn() {
	try {
		var rows = getSelectedRowData();

		if (rows.length != 1) {
			$.messager.alert('提示信息', '请选择一条数据!', 'warning');
			return;
		}
		if (rows[0].formType == 1) {
			$.messager.alert('提示信息', '请选择日常工单进行更换函号!', 'warning');
			return;
		}
		$("#dealDocSnValue").val('');
		document.getElementById("dealEventSN").style.display = "block";
		$("#dealEventSN").dialog({
			title : "更改公函号",
			'class' : "mydialog" /*add custom class for this dialog*/
			,
			onClose : function() {
				$(this).dialog("close");
			},
			buttons : [ {
				text : "确定",
				'class' : "btn-primary",
				click : function() {
					dealDocSn();
				}
			}, {
				text : "取消",
				'class' : "btn-success",
				click : function() {
					/*your login handler*/

					$(this).dialog("close");
				}
			} ]
		});
	} catch (e) {
		alert(e);
	}
}

/**
 * 改变公函号
 */
function dealDocSn() {
	try {
		var dealDocSnValue = $("#dealDocSnValue").val();
		if (validateRequired(dealDocSnValue) == false) {
			$.messager.alert('提示信息', '公函号不能为空!', 'warning');
			return;
		}
		if (validateInteger(dealDocSnValue) == false) {
			$.messager.alert('提示信息', '公函号需要一个整数!', 'warning');
			return;
		}

		var dealPath = [];
		var oldDealDocSn = [];
		var dealFormId = [];
		var rows = getSelectedRowData();
		for ( var i = 0; i < rows.length; i++) {
			dealPath.push(rows[i].dealDocPath);
			oldDealDocSn.push(rows[i].dealDocSn);
			dealFormId.push(rows[i].id);
		}
		$("#dealEventSN").dialog("close");
		// var subParemeter = new Array();
		// var winSetStr =
		// "top=550,left=550,status:no;dialogWidth:500px;dialogHeight:300px,resizable:yes,scroll:yes,help:no,unadorned:yes";
		var pageurl = basePath + "event/dealEvent.changeDealDocSn.action?dealFormId=" + dealFormId.join(",") + "&dealDocSn=" + dealDocSnValue + "&dealDocPath="
				+ dealPath.join(',') + "&oldDealDocSn=" + encodeURIComponent(oldDealDocSn.join(','));
		// showModalDialog(pageurl, subParemeter, winSetStr);
		showAjaxResultDialog(pageurl);
		reloadDataGrid();
	} catch (e) {
		alert(e);
	}

}

/**
* 下载公函文档.
**/
function downloadDealDoc() {
	try {
		var dealDocPath = [];
		var rows = getSelectedRowData();

		if (rows.length != 1) {
			$.messager.alert('提示信息', '请选择一条数据!', 'warning');
			return;
		} else if (rows[0].formType == 1) {
			$.messager.alert('提示信息', '请选择日常工单公函文档下载!', 'warning');
			return;
		} else {
			for ( var i = 0; i < rows.length; i++) {
				dealDocPath.push(rows[i].dealDocPath);
			}
		}
		var url = basePath + "/application/download.downloadAttachmentByUuid.action?uuid=" + dealDocPath;
		window.location.href = url;
	} catch (e) {
		alert(e);
	}

}
/**
 * 上传公函文档
 **/
function uploadDealDoc() {
	try {
		var dealDocPath = [];
		var rows = getSelectedRowData();

		if (rows.length != 1) {
			$.messager.alert('提示信息', '请选择一条数据!', 'warning');
			return;
		} else if (rows[0].formType == 1) {
			$.messager.alert('提示信息', '请选择日常工单公函文档上传!', 'warning');
			return;
		} else {
			for ( var i = 0; i < rows.length; i++) {
				dealDocPath.push(rows[i].dealDocPath);
			}
		}
		// var winSetStr =
		// "status:no;dialogWidth:800px;dialogHeight:600px,resizable:yes,scroll:yes,help:no,unadorned:yes";
		var pageurl = basePath + "resource/resourceView.uploadResourceView.action?actionTarget=event/dealEvent.uploadDealDocResource.action?uuid=" + dealDocPath;
		// showModalDialog(pageurl, null, winSetStr);
		showDialog(pageurl);
	} catch (e) {
		alert(e);
	}

}
/**
* 处置单回退.
**/
function sendBackForm() {
	try {
		var dealformId = [];
		var rows = getSelectedRowData();

		if (rows.length == 0) {
			$.messager.alert('提示信息', '请选择一条数据!', 'warning');
			return;
		} else {
			for ( var i = 0; i < rows.length; i++) {
				dealformId.push(rows[i].id);
			}
		}
		$.messager.confirm('提示信息', "是否要将处置单进行回退?", function() {
			// var subParemeter = new Array();
			// var winSetStr =
			// "top=550,left=550,status:no;dialogWidth:500px;dialogHeight:300px,resizable:yes,scroll:yes,help:no,unadorned:yes";
			var pageurl = basePath + "event/dealEvent.dealEventForm.action?dealFormIds=" + dealformId + "&dealAction=" + encodeURIComponent("处置单回退");
			// showModalDialog(pageurl, subParemeter, winSetStr);
			showAjaxResultDialog(pageurl);
			reloadDataGrid();
		});
	} catch (e) {
		alert(e);
	}

}

/**
* 处置单发布
**/
function formPublish() {
	try {
		var dealformId = [];
		var rows = getSelectedRowData();

		if (rows.length == 0) {
			$.messager.alert('提示信息', '请选择一条数据!', 'warning');
			return;
		} else {
			for ( var i = 0; i < rows.length; i++) {
				dealformId.push(rows[i].id);
			}
		}
		$.messager.confirm('提示信息', "是否要将选中的处置单进行发布?", function() {
			// var subParemeter = new Array();
			// var winSetStr =
			// "top=550,left=550,status:no;dialogWidth:500px;dialogHeight:300px,resizable:yes,scroll:yes,help:no,unadorned:yes";
			var pageurl = basePath + "event/dealEvent.dealEventForm.action?dealFormIds=" + dealformId + "&dealAction=" + encodeURIComponent("处置单发布");
			// showModalDialog(pageurl, subParemeter, winSetStr);
			showAjaxResultDialog(pageurl);
			reloadDataGrid();
		});
	} catch (e) {
		alert(e);
	}

}
/**
 * 查看安全事件
 */
function lookupFormEvents() {
	try {
		var dealformId = [];
		var rows = getSelectedRowData();

		if (rows.length != 1) {
			$.messager.alert('提示信息', '请选择一条数据!', 'warning');
			return;
		} else {
			for ( var i = 0; i < rows.length; i++) {
				dealformId.push(rows[i].id);
			}
		}

		var width = 800; // 弹出窗口的宽度;
		var heigth = 600; // 弹出窗口的高度;
		var top = (window.screen.availHeight - 30 - heigth) / 2; // 获得窗口的垂直位置;
		var left = (window.screen.availWidth - 10 - width) / 2; // 获得窗口的水平位置;
		var windowParam = "height=" + heigth + ", width=" + width + ", top=" + top + ",left=" + left
				+ ", toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no";

		// var winSetStr =
		// "status:no;dialogWidth:800px;dialogHeight:600px,resizable:yes,scroll:yes,help:no,unadorned:yes";
		var pageurl = basePath + "event/dealEventView.lookupFormEventView.action?dealformId=" + dealformId;
		// showModalDialog(pageurl, null, winSetStr);
		window.open(pageurl, null, windowParam);
	} catch (e) {
		alert(e);
	}

}
/**
* 安全事件下载
**/
function downloadFormEvent() {
	try {
		var dealformId = [];
		var rows = getSelectedRowData();

		if (rows.length != 1) {
			$.messager.alert('提示信息', '请选择一条数据!', 'warning');
			return;
		} else {
			for ( var i = 0; i < rows.length; i++) {
				dealformId.push(rows[i].id);
			}
		}
		window.location.href = basePath + "/event/dealEvent.downEventResource.action?dealFormId=" + dealformId;
	} catch (e) {
		alert(e);
	}
}
/**
* 反馈
	**/
function feedbackForm() {
	try {
		var dealformId = [];
		var rows = getSelectedRowData();

		if (rows.length != 1) {
			$.messager.alert('提示信息', '请选择一条数据!', 'warning');
			return;
		} else {
			for ( var i = 0; i < rows.length; i++) {
				dealformId.push(rows[i].id);
			}
		}

		var winSetStr = "status:no;dialogWidth:800px;dialogHeight:600px,resizable:no,scroll:no,help:no,unadorned:yes";
		var pageurl = basePath + "event/dealEventView.reBackView.action?dealFormId=" + dealformId;
		showModalDialog(pageurl, null, winSetStr);
		// window.open(pageurl);
		reloadDataGrid();
	} catch (e) {
		alert(e);
	}
}

/**
* 上传附件.
**/
function uploadFeedBackFile() {
	try {
		var dealformId = [];
		var rows = getSelectedRowData();

		if (rows.length != 1) {
			$.messager.alert('提示信息', '请选择一条数据!', 'warning');
			return;
		} else {
			for ( var i = 0; i < rows.length; i++) {
				dealformId.push(rows[i].id);
			}
		}

		// var winSetStr =
		// "status:no;dialogWidth:800px;dialogHeight:600px,resizable:yes,scroll:yes,help:no,unadorned:yes";
		var pageurl = basePath + "resource/resourceView.uploadResourceView.action?dealFormId=" + dealformId
				+ "&actionTarget=event/dealEventView.parseUploadResource.action&isEventUpload=1";
		// showModalDialog(pageurl, null, winSetStr);
		showDialog(pageurl);
		reloadDataGrid();
	} catch (e) {
		alert(e);
	}

}

/**下载通报文档**/
function TSSF0105_JS_exportRptDoc() {
	var rows = getSelectedRowData();

	if (rows.length != 1) {
		$.messager.alert('提示信息', '请选择一条数据!', 'warning');
		return;
	} else {
		var docId = "";
		if (rows[0].docId) {
			docId = rows[0].docId;
		} else {
			docId = rows[0].id;
		}

		var url = basePath + "/report/documentCtrl.downloadDocRpt.action?id=" + docId;
		window.location.href = url;
	}
}

/**上传通报文档**/
function TSSF0105_JS_uploadRptDoc() {
	var ids = [];
	var rows = getSelectedRowData();

	if (rows.length != 1) {
		$.messager.alert('提示信息', '请选择一条数据!', 'warning');
		return;
	} else {
		var columns = getCurrentTableColumns();
		var selectDate = "";
		for ( var i = 0; i < rows.length; i++) {
			ids.push(rows[i].id);
			selectDate += rows[i][columns[2]["data"]] + "：上传通报文档?<br>";
		}
		$.messager.confirm('提示信息', selectDate, function() {
			var url = basePath + "/resource/resourceView.uploadResourceView.action?className=" + className + "&dealFormId=" + ids.join(',')
					+ "&actionTarget=report/documentCtrl.uploadDocRpt.action";
			showDialog(url);
		});
	}
}
// 审阅
function TSSF0104_JS_REVIEW() {
	var rows = getSelectedRowData();

	if (rows.length != 1) {
		$.messager.alert('提示信息', '请选择一条需要审阅的数据!', 'warning');
		return;
	} else {
		var url = basePath + "/report/documentView.reviewDocView.action?id=" + rows[0].id;
		showDialog(url);
	}
}

function TSSF0104_JS_PUBLISH() {
	var rows = getSelectedRowData();

	if (rows.length != 1) {
		$.messager.alert('提示信息', '请选择一条需要发布的数据!', 'warning');
		return;
	} else {
		var url = basePath + "/report/documentCtrl.publishAndSendSave.action?methodType=publish&id=" + rows[0].id;
		showDialog(url);
	}
}
function TSSF0104_JS_SEND() {
	var rows = getSelectedRowData();

	if (rows.length != 1) {
		$.messager.alert('提示信息', '请选择一条需要派送的数据!', 'warning');
		return;
	} else {
		var url = basePath + "/report/documentView.publishAndSendView.action?methodType=send&id=" + rows[0].id;
		showDialog(url);
	}
}
/**
 * 批量更新.
 */
function TSSF0102_JS_Batch_Edit() {

	try {
		var ids = [];
		var rows = getSelectedRowData();

		if (rows.length == 0) {
			$.messager.alert('提示信息', '请选择数据!');
			return;
		} else {
			for ( var i = 0; i < rows.length; i++) {
				ids.push(rows[i].id);
			}

			var url = basePath + "/resource/resourceView.batchUpdateFieldView.action?className=" + className + "&ids=" + ids.join(',');
			showDialog(url, "修改资源");
			/*$.messager.confirm('提示信息', selectDate, function() {
				var data = {};
				data["className"] = className;
				data["ids"] = ids.join(',');
				JSendAjax(basePath + "resource/resource.batchDeleteResource.action", data, "json", "删除资源");
			});*/
		}
	} catch (e) {
		alert(e);
	}
}

/**
 * 专项添加.
 */
function TSSF0101_JS_SseTopicAdd() {
	try {
		var url = basePath + "/resource/resourceView.sseSpecialTopicSaveView.action?type=0&className=" + className;
		showDialog(url, "添加资源");
	} catch (e) {
		alert(e);
	}
}
/**
 * 专项更新.
 */
function TSSF0102_JS_SseTopicUpdate() {
	try {
		var rows = getSelectedRowData();
		if (rows.length != 1) {
			$.messager.alert('提示信息', '请选择一条数据进行编辑');
			return;
		} else {
			var url = basePath + "/resource/resourceView.sseSpecialTopicSaveView.action?className=" + className + "&id=" + rows[0].id;
			showDialog(url, "修改资源");
		}
	} catch (e) {
		alert(e);
	}
}
/**
 * 专项启动
 */
function TSSF0901_JS_Start() {
	try {
		var topicId = [];
		var rows = getSelectedRowData();

		if (rows.length == 0) {
			$.messager.alert('提示信息', '请选择一条数据!', 'warning');
			return;
		} else {
			for ( var i = 0; i < rows.length; i++) {
				topicId.push(rows[i].id);
			}
		}
		$.messager.confirm('提示信息', "启动选中的专项?", function() {
			// var subParemeter = new Array();
			// var winSetStr =
			// "top=550,left=550,status:no;dialogWidth:500px;dialogHeight:300px,resizable:yes,scroll:yes,help:no,unadorned:yes";
			var url = basePath + "/resource/resource.saveResource.action?className=" + className + "&id=" + topicId + "&_pageSaveOperation=batchUpdate" + "&status=0";
			// showModalDialog(pageurl, subParemeter, winSetStr);
			showAjaxResultDialog(url);
			reloadDataGrid();
		});
	} catch (e) {
		alert(e);
	}
}
/**
 * 专项停止
 */
function TSSF0902_JS_Stop() {
	try {
		var topicId = [];
		var rows = getSelectedRowData();

		if (rows.length == 0) {
			$.messager.alert('提示信息', '请选择一条数据!', 'warning');
			return;
		} else {
			for ( var i = 0; i < rows.length; i++) {
				topicId.push(rows[i].id);
			}
		}
		$.messager.confirm('提示信息', "停止选中的专项?", function() {
			// var subParemeter = new Array();
			// var winSetStr =
			// "top=550,left=550,status:no;dialogWidth:500px;dialogHeight:300px,resizable:yes,scroll:yes,help:no,unadorned:yes";
			var url = basePath + "/resource/resource.saveResource.action?className=" + className + "&id=" + topicId + "&_pageSaveOperation=batchUpdate" + "&status=1";
			// showModalDialog(pageurl, subParemeter, winSetStr);
			showAjaxResultDialog(url);
			reloadDataGrid();
		});
	} catch (e) {
		alert(e);
	}
}
