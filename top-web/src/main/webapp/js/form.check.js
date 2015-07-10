var myFormValidateErrorInputArray=[];
var myFormValidateErrorShowArray=[];
/**
 * 检查目标表单的输入控件值是否符合验证规则
 * 
 * @param targetForm
 * @returns {Boolean}
 */
function validateWholeForm(targetForm) {
	// 请理上一次的错误提供LABEL
	clearErrorLabel();
	// 清理上一次验证结果
	myFormValidateErrorInputArray=[];
	myFormValidateErrorShowArray=[];
	// 验证input
	validateByGroup(targetForm.getElementsByTagName("input"));
	// 验证select
	validateByGroup(targetForm.getElementsByTagName("select"));
	// 验证textArea
	validateByGroup(targetForm.getElementsByTagName("textarea"));
	// 判断是否通过验证
	if(myFormValidateErrorInputArray == null||myFormValidateErrorInputArray.length==0) {
		myFormValidateErrorInputArray=[];
		myFormValidateErrorShowArray=[];
		return true;
	} else {
		showValidateError();
		return false;
	}
}

/**
 * 清理样式与错误提供
 */
function clearErrorLabel(){
	for(var i = 0; i < myFormValidateErrorInputArray.length; i++) {
		var elementId=myFormValidateErrorInputArray[i].getAttribute("id");
		var inputShowErrLable=document.getElementById(elementId+"_lab");
		if(inputShowErrLable==null){
			//message+myFormValidateErrorShowArray[i]+"\n";
			continue;
		}
		var thisParentClass = myFormValidateErrorInputArray[i].parentNode.getAttribute("class");
		var cssClass = thisParentClass.split(" ");
		if(cssClass[cssClass.length - 1] == "has-error") {
			cssClass[cssClass.length - 1] = "has-success";
		}else {
			cssClass[cssClass.length] = "has-success";
		}
		var initClass = "";
		for(var j=0; j<cssClass.length; j++) {
			initClass += cssClass[j] + " ";
		}
		if(initClass != "") {
			initClass = initClass.substring(0, initClass.length-1);
		}
		myFormValidateErrorInputArray[i].parentNode.className=initClass;
		//$("#"+elementId+"_lab").parent().attr("class",initClass);
		
		inputShowErrLable.innerHTML = "";
		inputShowErrLable.bgColor="red";
		// document.getElementById('qutSelDiv').style
	}
}
/**
 * 验证一组控件的值是否符合验证规则
 * 
 * @param inputObj
 * @returns
 */
function validateByGroup(inputObj){
	if(inputObj==null||inputObj.length==0){
		return;
	}
	// <input id="identificationId" name="identificationId" type="text"
	// data-hint="证件号" size="20" maxlength="40" value="" data-validation=""/>
	// 验证input
	for( var i = 0; i < inputObj.length; i++) {
		// 如果检验字段中没有定义，不做验证
		if(!inputObj[i].getAttribute("data-validation") || inputObj[i].getAttribute("data-validation") == "") {
			continue;
		}
		var dataValidations = inputObj[i].getAttribute("data-validation");
		var dataValidationsArray = inputObj[i].getAttribute("data-validation").split(",");
		var flag = false;
		for(var vIndex = 0; vIndex < dataValidationsArray.length; vIndex++) {
			if(flag) {
				continue;
			}
			var validationType = dataValidationsArray[vIndex];
			// required,digital,integer,long,portNumber,float,double,ipV4,unZero,ipV4MaskBit,date,email,macAddress,domainName
			var validationResult=validationByType(validationType, inputObj[i]);
			if(validationResult!=null){
				flag = true;
				myFormValidateErrorInputArray.push(inputObj[i]);
				myFormValidateErrorShowArray.push(validationResult);
			}
		}

	}
}
/**
 * 验证结果提示.
 */
function showValidateError(){
	var message="";
	for(var i = 0; i < myFormValidateErrorInputArray.length; i++) {
		var elementId=myFormValidateErrorInputArray[i].getAttribute("id");
		var inputShowErrLable=document.getElementById(elementId+"_lab");
		
		if(inputShowErrLable==null){
			message+myFormValidateErrorShowArray[i]+"\n";
			continue;
		}
		// 鐖惰妭鐐规牱寮忓彉鍖�鏈�悗涓�釜
		var parentClass = myFormValidateErrorInputArray[i].parentNode.getAttribute("class");
		//alert($("#"+elementId).parent('div').attr("class"));
		var cssClass = parentClass.split(" ");
		if(cssClass[cssClass.length - 1] != "has-error") {
			cssClass[cssClass.length] = "has-error";
		}
		var errClass = "";
		for(var j=0; j<cssClass.length; j++) {
			errClass += cssClass[j] + " ";
		}
		if(errClass != "") {
			errClass = errClass.substring(0, errClass.length-1);
		}
		myFormValidateErrorInputArray[i].parentNode.className=errClass;
		//$("#"+elementId+"_lab").parent().attr("class",errClass);
		inputShowErrLable.innerHTML = myFormValidateErrorShowArray[i];
		// document.getElementById('qutSelDiv').style
		inputShowErrLable.bgColor="red";
	}
	if(message!=""){
		alert(message);
	}
	//
	myFormValidateErrorInputArray[0].focus();
}	

/**
 * 根据验证类型进行验证
 * 
 * @param validationType
 * @param inputElement
 * @returns
 */
function validationByType(validationType, inputElement) {
	var strHint="";
	if(!inputElement.getAttribute("data-hint") || inputElement.getAttribute("data-hint") == "") {
		strHint = inputElement.name;
	} else {
		strHint = inputElement.getAttribute("data-hint");
	}
	// 是否为空
	if("required" == validationType) {
		if(inputElement.type == "file") {
			if(document.getElementById("id")) {
				return null;
			}
		}
		if(validateRequired(inputElement.value)==false) {
			return strHint + " 不能为空。";
		}
		
	}
	// 验证输入是否为数字型
	if("digital" == validationType) {
		if(validateDigital(inputElement.value) == false) {
			return strHint + " 需要是一个数字型。";
		}
	}
	// 验证输入是否是整型
	if("integer" == validationType) {
		if(validateInteger(inputElement.value) == false) {
			return strHint + " 需要是一个整型。";
			
		}
	}
	if("long" == validationType) {
		if(validateLong(inputElement.value) == false) {
			return strHint + " 需要是一个长整型。";
		}
	}
	// 验证输入是否为端口型
	if("portNumber" == validationType) {
		if(validatePortNumber(inputElement.value) == false) {
			return strHint + " 需要是一个合法端口[1-65535]。";
		}
	}
	// 验证输入项是否是FLOAT型
	if("float" == validationType) {
		if(validateFloat(inputElement.value) == false) {
			return strHint + " 需要一个浮点数值。";
		}
	}
	// 验证输入项是否是double型
	if("double" == validationType) {
		if(validateFloat(inputElement.value) == false) {
			return strHint + " 需要一个Double值。";
		}
	}
	// 验证输入项是否为V4IP型
	if("ipV4" == validationType) {
		if(validateIpV4(inputElement.value) == false) {
			return strHint + " 需要一个正确的IPv4型 IP地址。";
			
		}
	}
	if("ipV4s" == validationType) {
		var ipv4s = inputElement.value.split(",");
		for(var i=0; i<ipv4s.length; i++) {
			if(validateIpV4(ipv4s[i]) == false) {
				return strHint + " 需要正确的IPv4型 IP地址。";
			}
		}
	}
	// 验证输入项是否是0
	if("unZero" == validationType) {
		if(inputElement.value == 0) {
			return strHint + " 需要一个非0的值。";
		}
	}
	// 是否为IP v4掩码
	if("ipV4MaskBit" == validationType) {
		if(validateIPv4MaskBit(inputElement.value) == false) {
			return strHint + " 需要一个正确的IPv4型IP地址掩码[1-32]。";
		}
	}
	// 验证输入法是否为日期型
	if("date" == validationType) {
		if(validateDate(inputElement.value) == false) {
			return strHint + " 需要一个正确的日期型值[yyyy-MM-dd]。";
		}
	}
	// 判断是否为MAIL型
	if("email" == validationType) {
		if(validateEMail(inputElement.value) == false) {
			return strHint + " 需要一个正确的E-mail地址。";
		}
	}
	// 判断是否为全法的MAC地址
	if("macAddress" == validationType) {
		if(validateMacAddress(inputElement.value) == false) {
			return strHint + inputElement.value + " 需要一个正确的MAC地址值。" ;
		}
	}
	// 判断是否为域名型
	if("domainName" == validationType) {
		if(validateDomainName(inputElement.value) == false) {
			return strHint + inputElement.value + " 需要一个正确的域名值。";
		}
	}
	if("password" == validationType) {
		if(validatePassword(inputElement.value) == false) {
			return strHint + inputElement.value + " 密码需要6-25位,只包含(字母|数字|中划线|下划线)这几种。";
		}
	}
	if("isCronExpress" == validationType) {
		if(validateIsCronExpress(inputElement.value) == false) {
			return strHint + "任务调度表达式存在错误!";
		}
	
	}
	/*if("sameAs:password" == validationType) {
		if(validateTheSame(inputElement.value, "password") == false) {
			return strHint  + " 两次密码输入不一致。";
		}
	}
	*/
	// 判断两个字段的值是否相同
	if(validationType.indexOf("sameAs") >= 0 ) {
		var params = new Array();
		params = validationType.split(":");
		if(params[1] == "") {
			return strHint + " [sameAs:]需要一个字段名称。";
		}
		if(validateTheSame(inputElement.value, params[1]) == false) {
			return strHint + "和" + $("#"+params[1]).attr("data-hint") + " 两次输入结果不一致";
		}
	}
	// ip规划远程验证ip地址范围
	 if(validationType.indexOf("ipPlanningScopeRemote") >= 0 ) {
		 
		var params = new Array();
		params = validationType.split(":");
		if(params[1] == "") {
			return strHint + " [ipRemote:]需要起止ip地址";
		}
		if(validateIpPlanningScopeRemote(inputElement.value, params[1]) == false) {
			return " 此网段与系统中网段冲突，新网段不可与系统中已存在的网段重叠。";
		}
	} 
	 // ip管理 远程验证ip地址范围
	 if(validationType.indexOf("ipSegmentScopeRemote") >= 0 ) {
		 
			var params = new Array();
			params = validationType.split(":");
			if(params[1] == "") {
				return strHint + " [ipRemote:]需要起止ip地址";
			}
			if(validateIpSegmentScopeRemote(inputElement.value, params[1]) == false) {
				return  " 此网段与系统中网段冲突，新网段不可与系统中已存在的网段重叠。";
			}
		} 
	 if("length" == validationType) {
	 	var maxLength = 40;
	    if(inputElement.getAttribute("maxlength") && inputElement.getAttribute("maxlength") != "") {
	    	maxLength = inputElement.getAttribute("maxlength");
		} 
		if(validateLength(inputElement.value, maxLength) == false) {
			return strHint + inputElement.value + " 长度超过最大值"+maxLength+"。";
		}
	 }
	 if("zipCode" == validationType) {
		 if(validateZipCode(inputElement.value) == false) {
				return strHint + inputElement.value + " 邮编格式不对。";
		}
	 }
	 if("positiveInt" == validationType) {
		 if(validatePositiveInteger(inputElement.value) == false) {
				return "需要一个正整数";
		}
	 }
	
	return null;
}



// //////////////////////////////////////////////////////////////////功能检查
function validateIsCronExpress(inputValue) {
	var temp;
	dwr.engine.setAsync(false);
	RemoteValidateAjax.validateIsCronExpress(inputValue,function(data){
		temp = data;
	}); 
	dwr.engine.setAsync(true);
	return temp;
}
//验证密码
function validatePassword(inputValue) {
	if(inputValue != "") {
		var regs = /^[a-zA-Z0-9_-]{6,25}$/;
		if(regs.test(inputValue)) {
			return true;
		} else {
			return false;
		}
	}
	return true;
}

//正整数
function validatePositiveInteger(inputValue){
	var reg1 =  /^\d+$/;
	return reg1.test(inputValue);
}

function validateZipCode(inputValue) {
	if(inputValue != "") {
		// /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-]+)+$/
		if(/^[1-9][0-9]{5}$/.test(inputValue)) {
			return true;
		} else {
			return false;
		}
	}
	return true;
}

// 长度验证
String.prototype.len = function() { 
    return this.replace(/[^\x00-\xff]/g, 'xx').length; 
};
function validateLength(inputValue,maxLength) {
	var length = inputValue.len();
	
	if(length > maxLength) {
		return false;
	}
	return true;
}

//IP用户管理Ajax 同步远程验证取值范围
function validateIpSegmentScopeRemote(inputValue, elementId) {
	var id = "";
	if(document.getElementById("id")) {
		id = document.getElementById("id").value;
	}
	var temp;
	dwr.engine.setAsync(false);
	RemoteValidateAjax.ipSegmentScopeValidate($("#"+elementId).val(),inputValue,id,function(data){
		temp = data;
	}); 
	dwr.engine.setAsync(true);
	return temp;
}

//IP规划管理 Ajax 同步远程验证取值范围
function validateIpPlanningScopeRemote(inputValue, elementId) {
	var id = "";
	if(document.getElementById("id")) {
		id = document.getElementById("id").value;
	}
	var temp;
	dwr.engine.setAsync(false);
	RemoteValidateAjax.ipPlanningScopeValidate($("#"+elementId).val(),inputValue,id,function(data){
		temp = data;
	}); 
	dwr.engine.setAsync(true);
	return temp;
}

// 验证两个字段是否相等
function validateTheSame(inputValue, elementId) {
	if(inputValue != "") {
		if(inputValue != $("#"+elementId).val()) {
			return false;
		}
		return true;
	}
	return true;
}

// 检查是否为数值型数据
function validateDigital(inputValue) {
	if(inputValue != "") {
		if(isNaN(inputValue)) {
			return false;
		}
	}
	return true;
}

// 检查是否是Int型
function validateInteger(inputValue) {
	if(inputValue != "") {
		if(isNaN(inputValue)) {
			return false;
		}
		if(inputValue.indexOf(".") >= 0) {
			return false;
		}
	}
	return true;
}

// 检查是否是Long型
function validateLong(inputValue) {
	if(inputValue != "") {
		if(isNaN(inputValue)) {
			return false;
		}
		if(inputValue.indexOf(".") >= 0) {
			return false;
		}
	}
	return true;
}

// 检查是否为端口
function validatePortNumber(inputValue) {
	if(inputValue != "") {
		if(isNaN(inputValue)) {
			return false;
		}
		if(inputValue.indexOf(".") >= 0) {
			return false;
		}
		if(inputValue < 0 || inputValue > 65535) {
			return false;
		}
		if(inputValue.indexOf("0") == 0) {
			return false;
		}
	}
	return true;
}

// 检查isFloat
function validateFloat(inputValue) {
	if(inputValue != "") {
		if(isNaN(inputValue)) {
			return false;
		}
		// 不判断是否代点
		// if (inputval.indexOf(".") < 0) {
		// return false;
		// }
	}
	return true;
}

// 检查isMaskBit
function validateIPv4MaskBit(inputValue) {
	if(inputValue != "") {
		if(isNaN(inputValue)) {
			return false;
		}
		if(inputValue.indexOf(".") >= 0) {
			return false;
		}
		if(inputValue < 1 || inputValue > 32) {
			return false;
		}
	}
	return true;
}

// 检查日期
function validateDate(inputValue) {
	if(inputValue != "") {
		var reg = /^(\d+)-(\d{1,2})-(\d{1,2})\s(\d{1,2}):(\d{1,2}):(\d{1,2})$/;
		var r = inputValue.match(reg);
		if(r == null) {
			return false;
		}
		r[2] = r[2] - 1;
		var d = new Date(r[1], r[2], r[3], r[4], r[5], r[6]);
		if(d.getFullYear() != r[1]) {
			return false;
		}
		if(d.getMonth() != r[2]) {
			return false;
		}
		if(d.getDate() != r[3]) {
			return false;
		}
		if(d.getHours() != r[4]) {
			return false;
		}
		if(d.getMinutes() != r[5]) {
			return false;
		}
		if(d.getSeconds() != r[6]) {
			return false;
		}
	}
	return true;
}

// 检查isIp
function validateIpV4(inputValue) {
	if(inputValue != "") {
		var pattern = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;
		flag_ip = pattern.test(inputValue);
		if(flag_ip) {
			return true;
		} else {
			return false;
		}
	}
	return true;
}

// 检查MAIL
function validateEMail(inputValue) {
	if(inputValue != "") {
		// /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-]+)+$/
		if(/^[\w_-]+(\.?[\w_-]+)+@[\w_-]+(\.[\w_-]+)+$/.test(inputValue)) {
			return true;
		} else {
			return false;
		}
	}
	return true;
}

// 检查文档长度
function counttextlen(ttarea) {
	if(ttarea.value.length > 100) {
		alert("长度需要在100之内。");
		ttarea.value = ttarea.value.substring(0, 100);
	}
	return true;
}

// 检查是否是MAC地址
function validateMacAddress(inputValue) {
	if(inputValue != "") {
		var pattern = /^([0-9a-fA-F]{2})(([\s-][0-9a-fA-F]{2}){5})$/;
		if(pattern.test(inputValue)) {
			return true;
		} else {
			return false;
		}
	}
	return true;
}

// 检查是否是域名
function validateDomainName(inputValue) {
	if(inputValue != "") {
		var regs = /^[a-z0-9]([a-z0-9-]+\.){2,}[a-z]{2,4}$/;
		if(regs.test(inputValue)) {
			return true;
		} else {
			return false;
		}
	}
	return true;
}

// 检查是否为空
function validateRequired(inputValue) {
	// 如果值为空，验证不通过 为false,通过为true
	if(inputValue == null || inputValue == "") {
		return false;
	}
	var regs = /^\s+$/;
	return !(regs.test(inputValue));
}

// 检查是否为公网IP
function checkispublicip(val) {
	var ipstr = val.value;
	if(ipstr == null || ipstr == "") {
		return false;
	} else {
		if(check_isIp(ipstr) == false) {
			alert(ipstr + " 需要一个合法的公网IP地址值。");
			val.value = "";
			val.focus();
			return false;
		}
		if(ipstr.indexOf("172.") == 0) {
			var iparr = ipstr.split(".");
			if((iparr[1] - 1 + 1) >= 16 && (iparr[1] - 1 + 1) <= 32) {
				alert(ipstr + " 需要一个合法的公网IP地址值。");
				val.value = "";
				val.focus();
				return false;
			}
		}
		if(ipstr.indexOf("10.") == 0 || ipstr.indexOf("010.") == 0 || ipstr.indexOf("127.") == 0 || ipstr.indexOf("192.168.") == 0 || ipstr.indexOf("169.254.") == 0) {
			alert(ipstr + " 需要一个合法的公网IP地址值。");
			val.value = "";
			val.focus();
			return false;
		}
	}
	return true;
}

// 检查是否为私网IP
function checkisprivateip(val) {
	var ipstr = val.value;
	if(ipstr == null || ipstr == "") {
		return false;
	} else {
		if(check_isIp(ipstr) == false) {
			alert(ipstr + " 需要一个合法的私网IP地址值。");
			val.value = "";
			val.focus();
			return false;
		}
		if(ipstr.indexOf("172.") == 0) {
			var iparr = ipstr.split(".");
			if((iparr[1] - 1 + 1) >= 16 && (iparr[1] - 1 + 1) <= 32) {
				return true;
			} else {
				alert(ipstr + " 需要一个合法的私网IP地址值。");
				val.value = "";
				val.focus();
				return false;
			}
		}
		if(ipstr.indexOf("10.") == 0 || ipstr.indexOf("010.") == 0 || ipstr.indexOf("127.") == 0 || ipstr.indexOf("192.168.") == 0 || ipstr.indexOf("169.254.") == 0) {
			return true;
		} else {
			alert(ipstr + " 需要一个合法的私网IP地址值。");
			val.value = "";
			val.focus();
			return false;
		}
	}
	return true;
}

// 判断日期先后
function check_adate_bdate(stra, strb) {
	var reg = /^(\d+)-(\d{1,2})-(\d{1,2})\s(\d{1,2}):(\d{1,2}):(\d{1,2})$/;
	var ra = stra.match(reg);
	var rb = strb.match(reg);
	if(ra == null) {
		return 4;
	}
	if(rb == null) {
		return 5;
	}
	var adtate = new Date(ra[1], ra[2], ra[3], ra[4], ra[5], ra[6]);
	var bdtate = new Date(rb[1], rb[2], rb[3], rb[4], rb[5], rb[6]);
	if(Date.parse(adtate) - Date.parse(bdtate) == 0) {
		return 2;
	}
	if(Date.parse(adtate) - Date.parse(bdtate) < 0) {
		return 1;
	}
	if(Date.parse(adtate) - Date.parse(bdtate) > 0) {
		return 3;
	}
}

// //////////////////////////////////////////////////////////////////////////
// 给所有SELECT ORDER
function sortAllSelect(objfrm) {
	objfrm.reset();
	var selectObj = objfrm.getElementsByTagName("select");
	for(var i = 0; i < selectObj.length; i++) {
		sortSelect(selectObj[i]);
	}
}

// INPUT取得焦点
function inputOnFocusEve(inputA) {
	if(inputA.getAttribute("className") != "alert") {
		inputA.setAttribute("className", "focus");
	}
}

// INPUT焦点离开
function inputOnBlurEve(inputA) {
	if(inputA.getAttribute("className") != "alert") {
		inputA.setAttribute("className", "blur");
	}
}

// SELECT 排序
function sortSelect(oSel) {
	var ln = oSel.options.length;
	var arr = new Array();
	// 排序容器
	if(ln < 2) {
		// alert("sortSelect "+ln);
		return;
	}
	var selectno = oSel.selectedIndex;
	var selectvalue = oSel.options[oSel.selectedIndex].value;
	var selecttext = oSel.options[oSel.selectedIndex].text;
	// var inforstr=oSel.options[0].text;
	// 将select中的所有option的value值将保存在Array中
	var realint = 0;
	for(var i = 0; i < ln; i++) {

		// 如果需要对option中的文本排序，可以改为arr[i] = oSel.options[i].;
		if(selectno != i) {
			arr[realint] = oSel.options[i].text + "#@#" + oSel.options[i].value;
			realint++;
		}
	}
	arr.sort();
	// 开始排序
	// 清空Select中全部Option
	while(ln--) {
		oSel.options[ln] = null;
	}

	// 将排序后的数组重新添加到Select中
	// oSel.add(new Option(inforstr,""));
	// var afterselectno;
	oSel.add(new Option(selecttext, selectvalue));
	oSel.selectedIndex = 0;
	for(var i = 0; i < arr.length; i++) {
		var infor_str = arr[i].split("#@#");
		// if(selectvalue==infor_str[1]){
		// afterselectno=i;
		// }
		oSel.add(new Option(infor_str[0], infor_str[1]));
	}
	// oSel.selectedIndex=afterselectno;
}

// ///////////////////////////
function check_uploadfile(upfile, att) {
	// 检查上传文件
	if(upfile == null || att == null) {
		return true;
	}
	var attVal = att.value;
	var ext = "*.zip,*.ZIP";
	if(attVal == null || attVal == "" || 1 == 1) {
		return true;
	}
	if(attVal.indexOf(".") == -1) {
		alert("只允许上传与zip文件!");
		upfile.value = "";
		att.value = "";
		return false;
	}
	attVal = attVal.substr(attVal.lastIndexOf("."));
	if(ext.indexOf("*" + attVal) == -1) {
		alert("只允许上传与zip文件!");
		upfile.value = "";
		att.value = "";
		return false;
	}
}

// //////////////////////
// 约束检查
function constraint_checktype2(inputObj, minVal, maxVal) {
	// 检查值范围约束
	if(inputObj.value != "") {
		var inputVal = inputObj.value;
		var strHint = inputObj.getAttribute("data-hint");
		if(check_isDigital(inputObj.value)) {
			if(minVal > inputVal || maxVal < inputVal) {
				alert(strHint + " 需要在" + minVal + "至" + maxVal + "之间的值");
				inputObj.value = "";
				inputObj.focus();
			}
		} else {
			alert(strHint + " 需要是一个数值。");
			inputObj.value = "";
			inputObj.focus();
		}
	}
}

function constraint_checktype3(inputObj, regStr) {
	// 检查格式
	if(inputObj.value != "") {
		var regs = regStr;
		if(regs.test(inputObj.value)) {

		} else {
			var strHint = inputObj.getAttribute("data-hint");
			alert(strHint + "格式不正确!");
			inputObj.value = "";
			inputObj.focus();
		}
	}
}

