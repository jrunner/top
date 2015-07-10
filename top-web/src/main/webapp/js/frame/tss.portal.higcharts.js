	//日期格式化
	Date.prototype.format =function(format)
	{
		var o = {
		"M+" : this.getMonth()+1, //month
		"d+" : this.getDate(), //day
		"h+" : this.getHours(), //hour
		"m+" : this.getMinutes(), //minute
		"s+" : this.getSeconds(), //second
		"q+" : Math.floor((this.getMonth()+3)/3), //quarter
		"S" : this.getMilliseconds() //millisecond
		}
		if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
		(this.getFullYear()+"").substr(4- RegExp.$1.length));
		for(var k in o)if(new RegExp("("+ k +")").test(format))
		format = format.replace(RegExp.$1,
		RegExp.$1.length==1? o[k] :
		("00"+ o[k]).substr((""+ o[k]).length));
		return format;
	}
	var formatDate =  new Date().format("yyyy-MM");;
//浏览器调整
$(function(){
	if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)) {
		$('.Higcharts-height').css('height','295px');
	} else if (navigator.userAgent.indexOf('Firefox') >= 0) {
		$('.Higcharts-height').css('height','330px');
		$('#mapChartsByHighchart').css('width','330px');
	}
	//提交日期
	$('#dateButton').click(function(){
		if(!$('#dateInput').val() == ''){
			formatDate = $('#dateInput').val();
		}
		createHighcharts(formatDate);
	});
	createHighcharts(formatDate);
	$.ajax({
		type : 'post',
		url : 'application/frameView.getMapByProperties.action',
		dataType:'json',
		success : function(data) {
			alert(data);
		}
	});
});
//创建首页图表
function createHighcharts(date){
	//构建地图
	require.config({  
		paths: {  
	   'echarts':'./js/plugins/echarts/echarts',  
	    'echarts/chart/map':'./js/plugins/echarts/echarts-map' 
		}  
	}); 
	require([  'echarts','echarts/chart/map'],  
	   		function (ec) {  
	       	 		var myChart=ec.init(document.getElementById('mapChartsByHighchart'));  
	       	 		var option = {
	       	 				series : [{
					            name: '浦东新区',
					            type: 'map',
					            mapType: "上海",
					            selectedMode : 'single',
					            itemStyle:{
					            	normal:{label:{show:false}},
					                emphasis:{label:{show:true}}
					            },
					            data:[
					                {name:'浦东新区',selected:true}
					           ]
	       	 				}]
	       	 		}
		var ecConfig = require('echarts/config');
		myChart.on(ecConfig.EVENT.MAP_SELECTED, function (param){
		    var selected = param.selected;
		    var str = '请选择';
		    for (var p in selected) {
		        if (selected[p]) {
		            str = p;
		        }
		    }
		    replacePoint(str);
		    document.getElementById('tr_title').innerHTML = '<tr><td>事件类型</td><td>事件数量</td><td>事件增量</td><td>事件环比</td></tr>';
		    lineAjax();
			tableAjax();
		});
		myChart.setOption(option);
	    
	});	
	//构建柱形图，并加载数据
	$.ajax({
			type : 'post',
			url : 'application/frameView.barChartOfBusinessData.action',
			dataType: 'json',
			data:{'date':formatDate},
			success : function(data) {
				 $('#barChartsByHighchart').highcharts({
				        chart: {
				            type: 'column'
				        },
				        title: {
				            text: ''
				        },
				        credits : {
							text : '',
							href : ''
						},
				        xAxis: {
				            categories: data.arr
				        },
				        yAxis: {
				            min: 0,
				            title: {
				                text: '事件（项）'
				            }
				        },
				        tooltip: {
				            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
				            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
				                '<td style="padding:0"><b>{point.y} 项</b></td></tr>',
				            footerFormat: '</table>',
				            shared: true,
				            useHTML: true
				        },
				        plotOptions: {
				            column: {
				                pointPadding: 0.2,
				                borderWidth: 0,
				                point : {
				                	events: {
				                		click: function(e){
				                			replacePoint(e.point.category);
				                			document.getElementById('tr_title').innerHTML = '<tr><td>事件类型</td><td>事件数量</td><td>事件增量</td><td>事件环比</td></tr>';
				                			lineAjax();
				                			tableAjax();
				                		}
				                	}
				                }
				            }
				        },
				        series: [{
				            name: '事件',
				            data: data.arr2
				        }]
				    });
			}
	});
	//构建饼图，并加载数据
	$.ajax({
		type : 'post',
		url : 'application/frameView.pieChartOfBusinessData.action',
		dataType: 'json',
		data:{'date':formatDate},
		success : function(data) {
		   	$('#pieChartsByHighchart').highcharts({
		    	title : {
					text : ''
				},
		        chart: {
		            type: 'pie',
		            options3d: {
		                enabled: true,
		                alpha: 45,
		                beta: 0
		            }
		        },
		        credits : {
					text : '',
					href : ''
				},
		        plotOptions: {
		            pie: {
		                allowPointSelect: true,
		                cursor: 'pointer',
		                depth: 35,
		                dataLabels: {
		                    enabled: true,
		                    format: '{point.name}'
		                },
		            	events: {
		            		click: function(e){
		            			replacePoint(e.point.name);
		            			document.getElementById('tr_title').innerHTML = '<tr><td>事件类型</td><td>事件数量</td><td>事件增量</td><td>事件环比</td></tr>';
		            			lineAjax();
	                			tableAjax()
		            		}
		            	}
		            }
		        },
		        series: [{
		            type: 'pie',
		            name: '事件',
		            data:  data.pie
		        }]
		    });
		}
	});
	document.getElementById('tr_title').innerHTML = '<tr><td>事件类型</td><td>事件数量</td><td>事件增量</td><td>事件环比</td></tr>';
	lineAjax();
	tableAjax();
}
//替换提示信息
function replacePoint(str){
	 document.getElementById('table_span').innerHTML = str;
	 document.getElementById('lineChartByHigcharts_span').innerHTML = str;
}
//构建table，并加载数据
function tableAjax(){
	$.ajax({
		type : 'post',
		url : 'application/frameView.tableChartOfBusinessData.action',
		data:{'date':formatDate,'address':$('#table_span').html()},
		dataType: 'json',
		success : function(data) {
			$('#tr_title').append(data.tab);
		}
	});
}
//构建线形图，并加载数据
function lineAjax(){
	$.ajax({
		type : 'post',
		url : 'application/frameView.lineChartOfBusinessData.action',
		dataType: 'json',
		data:{'date':formatDate,'address':$('#table_span').html()},
		success : function(data) {
			$('#lineChartByHigcharts').highcharts(
					{
						title : {
							text : ''
						},
						xAxis : {
							tickInterval: 5,
							categories : data.arr
						},
						yAxis : {
							title : {
								text : '事件 '
							},
							plotLines : [ {
								value : 0,
								width : 1,
								color : '#808080'
							} ]
						},
						tooltip : {
							valueSuffix : '项'
						},
						credits : {
							text : '',
							href : ''
						},
						legend : {
							layout : 'vertical',
							align : 'right',
							verticalAlign : 'middle',
							borderWidth : 0
						},
						series : [ {
							name : '事件趋势',
							data : data.arr2
						} ]
					});
		}
	});
}
