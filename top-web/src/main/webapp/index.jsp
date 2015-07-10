<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<link rel="icon" href="<%=request.getContextPath()%>/theme/favicon.ico">
<%
    //页面全局使用到的变量
    String path = request.getContextPath();
%>
<link rel="stylesheet" type="text/css" href="<%=path%>/js/plugins/datatable/resources/bootstrap/3/dataTables.bootstrap.css">
<link href="<%=path%>/theme/tss/css/doc.css" rel="stylesheet" />

<link rel="stylesheet" type="text/css" href="<%=path %>/js/plugins/datatable/css/jquery.dataTables.css">
<script type="text/javascript" language="javascript" src="<%=path %>/js/plugins/datatable/js/jquery.js"></script>
<script type="text/javascript" language="javascript" src="<%=path %>/js/plugins/datatable/js/jquery.dataTables.js"></script>
<script type="text/javascript" language="javascript" src="<%=path %>/js/common.js"></script>

<!--tss-hdfs-web-->
<script type="text/javascript" language="javascript" src="<%=path%>/js/tss-hdfs.js"></script>
<link rel="stylesheet" type="text/css" href="<%=path%>/theme/tss/css/tss-hdfs.css">	

<html>

	<script type="text/javascript" language="javascript">
		$(document).ready(function() {
			JSendAjax('<%=request.getContextPath()%>/res/count/ips',null,"json");
			JSendAjax('<%=request.getContextPath()%>/res/count/domains',null,"json");
			JSendAjax('<%=request.getContextPath()%>/res/count/cmds',null,"json");
		} ); 
		
		//回调函数
		function JCollBack(_data,_textStuats){
			if(_data.oper == 'cmd'){
				$("#msg").html(_data.msg);
				return;
			}
					
			if(_data.oper == 'del'||_data.oper == 'imp'){
				window.location='/tss-hdfs-web/index.jsp'; 
				return; 
			}
			
			var kind = _data.kind;
			var str = 'redis中'+kind+'数量:'
			$('#'+kind).html(str + _data.count);
		}

		function run(url){
			JSendAjax(url,null,"json");
		}
	</script>
	<body>
		<p>
			<a href="<%=request.getContextPath()%>/jsp/evt/raw/list.jsp?alarmcode=fe06f4a7-2f52-457e-8d7a-b3cb507cdf8a">安全事件反查</a>
			<a href="<%=request.getContextPath()%>/jsp/evt/raw/list.jsp?op=EVENT">原始数据</a>
			<a href="<%=request.getContextPath()%>/jsp/evt/merge/list.jsp?op=MERGE_EVENT">归并数据</a>
			<a href="<%=request.getContextPath()%>/jsp/evt/stat/list.jsp?op=STAT_EVENT">统计数据</a>
			<a href="<%=request.getContextPath()%>/jsp/evt/mrjob/list.jsp">汇入监控</a>
		</p>
		<p>
			<a href="<%=request.getContextPath()%>/jsp/res/ip/list.jsp">IP查询</a>
			<a href="<%=request.getContextPath()%>/jsp/res/domain/list.jsp">域名查询</a>
			<a href="<%=request.getContextPath()%>/jsp/res/cmd/list.jsp">条件查询</a>
		</p>
		
		<p>
			<a href="<%=request.getContextPath()%>/jsp/table/domain/list.jsp">域名库查询</a>
			<a href="<%=request.getContextPath()%>/jsp/table/ip/list.jsp">IP库查询</a>
		</p>
		<p> 新月度事件查询：(根据事件类型显示该事件类型对应的列)<br>
			<a href="<%=request.getContextPath()%>/jsp/table/monthly/list.jsp?EVENT_TYPE=每月木马僵尸&key=monthly">每月木马僵尸</a><br>
			<a href="<%=request.getContextPath()%>/jsp/table/monthly/list.jsp?EVENT_TYPE=每月网页篡改&key=monthly">每月网页篡改</a>
		</p>
		
		<p> 新归并事件查询：(根据事件类型显示该事件类型对应的列)<br>
			<a href="<%=request.getContextPath()%>/jsp/table/merge/list.jsp?EVENT_TYPE=网站后门&key=merge">归并数据-网站后门</a><br>
			<a href="<%=request.getContextPath()%>/jsp/table/merge/list.jsp?EVENT_TYPE=网页篡改&key=merge">归并数据-网页篡改</a><br>
			<a href="<%=request.getContextPath()%>/jsp/table/merge/list.jsp?EVENT_TYPE=手机病毒&key=merge">归并数据-手机病毒</a><br>
			<a href="<%=request.getContextPath()%>/jsp/table/merge/list.jsp?EVENT_TYPE=网页放马&key=merge">归并数据-网页放马</a><br>
			<a href="<%=request.getContextPath()%>/jsp/table/merge/list.jsp?EVENT_TYPE=网络蠕虫&key=merge">归并数据-网络蠕虫</a><br>
			<a href="<%=request.getContextPath()%>/jsp/table/merge/list.jsp?EVENT_TYPE=木马僵尸控制&key=merge">归并数据-木马僵尸控制</a><br>
			<a href="<%=request.getContextPath()%>/jsp/table/merge/list.jsp?EVENT_TYPE=木马僵尸受控&key=merge">归并数据-木马僵尸受控</a><br>
		</p>
		<p> 新原始事件查询：(根据事件类型显示该事件类型对应的列)<br>
			<a href="<%=request.getContextPath()%>/jsp/table/raw/list.jsp?EVENT_TYPE=网站后门&key=raw">原始数据-网站后门</a><br>
			<a href="<%=request.getContextPath()%>/jsp/table/raw/list.jsp?EVENT_TYPE=网页篡改&key=raw">原始数据-网页篡改</a><br>
			<a href="<%=request.getContextPath()%>/jsp/table/raw/list.jsp?EVENT_TYPE=手机病毒&key=raw">原始数据-手机病毒</a><br>
			<a href="<%=request.getContextPath()%>/jsp/table/raw/list.jsp?EVENT_TYPE=网页放马&key=raw">原始数据-网页放马</a><br>
			<a href="<%=request.getContextPath()%>/jsp/table/raw/list.jsp?EVENT_TYPE=网络蠕虫&key=raw">原始数据-网络蠕虫</a><br>
			<a href="<%=request.getContextPath()%>/jsp/table/raw/list.jsp?EVENT_TYPE=木马僵尸控制&key=raw">原始数据-木马僵尸控制</a><br>
			<a href="<%=request.getContextPath()%>/jsp/table/raw/list.jsp?EVENT_TYPE=木马僵尸受控&key=raw">原始数据-木马僵尸受控</a><br>
		</p>
		
		<p>
			<ul>
				实时统计Redis中的相关数据的数量
				<li id="ips"></li>
				<li id="domains"></li>
				<li id="cmds"></li>
			</ul>
		</p>

		<p>
			<ul>
				同步Redis中的相关数据
				<a href="javascript:run('<%=request.getContextPath()%>/res/imp/ips')">ips</a>
				<a href="javascript:run('<%=request.getContextPath()%>/res/imp/domains')">domains</a>
				<a href="javascript:run('<%=request.getContextPath()%>/res/imp/cmds')">cmds</a>
			</ul>
		</p>

		<p>
			<ul>
				删除Redis中的相关数据
				<a href="javascript:run('<%=request.getContextPath()%>/res/del/ips')">ips</a>
				<a href="javascript:run('<%=request.getContextPath()%>/res/del/domains')">domains</a>
				<a href="javascript:run('<%=request.getContextPath()%>/res/del/cmds')">cmds</a>
			</ul>
		</p>
		
		<p>
			<ul>
				tree
				<a href="<%=request.getContextPath()%>/jsp/evt/tree/tree.jsp">tree</a>
			</ul>
		</p>
		
		<p>
			<ul>
				<a href="<%=request.getContextPath()%>/jsp/stat/view.jsp?key=statraw&type=2&title=statraw_title">图1</a>

				<a href="<%=request.getContextPath()%>/jsp/stat/view.jsp?key=month_event&type=2&title=title">图2</a>
			</ul>
		</p>

		<p>
			rest接口 http://127.0.0.1:8080/tss-hdfs-web/rest/event/queryMergeById/fe06f4a7-2f52-457e-8d7a-b3cb507cdf8a
		</p>

		<p>
			<a href="<%=request.getContextPath()%>/jsp/hive/tbl/list.jsp">hive表</a>
		</p>
		
		<p>
			<a href="<%=request.getContextPath()%>/tools.jsp">tools</a>
		</p>
		
		<p>
			<a href="<%=request.getContextPath()%>/table/cmd">执行</a>
		</p>

		<p>
			<a href="<%=request.getContextPath()%>/jsp/tools/upload.jsp">事件映射测试</a>
		</p>
	</body> 
</html>
