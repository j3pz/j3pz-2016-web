var app = angular.module('J3pzDoc', ['toastr']);

app.controller('DocCtrl', ['$scope', function($scope){
	$scope.pageShow = {
		intro:{show:true,id:null,value:{}},
		equipList:{show:false,id:"equip-list-json",value:{data:[{"id":"11713","quality":"820","name":"星映","class":"0","filter":[0,0,1,1,0,0,0,0,0,0,0,0,0]},{"id":"12282","quality":"820","name":"通滞笔","class":"3","filter":[0,1,0,0,0,1,0,0,0,0,0,0,0]},{"id":"12289","quality":"850","name":"参云笔","class":"13","filter":[0,1,0,0,1,0,0,0,0,0,0,0,0]},{"id":"11131","quality":"900","name":"夜阳","class":"1","filter":[0,0,1,1,0,0,0,0,0,0,0,0,0]},{"id":"11108","quality":"900","name":"世外","class":"1","filter":[0,1,0,0,1,0,0,0,0,0,0,0,0]}]}},
		equipInfo:{show:false,id:"equip-info-json",value:{"data":{"P_ID":"17077","uiID":"13","iconID":"8029","name":"墨颠","menpai":"2","xinfa":"2","type":"11","quality":"900","score":"2700","body":"341","spirit":"0","strength":"0","agility":"0","spunk":"144","basicPhysicsShield":"0","basicMagicShield":"0","physicsShield":"0","magicShield":"0","dodge":"0","parryBase":"0","parryValue":"0","toughness":"0","attack":"561","heal":"0","crit":"136","critEffect":"58","overcome":"195","acce":"97","hit":"117","strain":"0","huajing":"0","threat":"0","texiao":{"id":"149","desc":["装备：“阳明指”伤害提高5%","装备：“快雪时晴”伤害提高5%","装备：施展混元招式命中后，一定几率触发6秒内“玉石俱焚”无调息时间，施展“玉石俱焚”命中目标后附带“钟林毓秀”不利效果"],"type":"Common"},"xiangqian":"3D16D01D13","strengthen":"8","dropSource":"任务·醉月玄晶","xinfatype":"2097152"}}},
		search:{show:false,id:"search-json",value:{data:[{ id: '8986', name: '紫萝怨·意(360)', icon: '6739' },{ id: '9000', name: '紫萝怨·思(360)', icon: '6739' },{ id: '9007', name: '紫萝怨·意(390)', icon: '6739' },{ id: '9021', name: '紫萝怨·思(390)', icon: '6739' },{ id: '8941', name: '紫萝怨·意(420)', icon: '6739' },{ id: '8955', name: '紫萝怨·思(420)', icon: '6739' },{ id: '10669', name: '紫萝怨·思(450)', icon: '6739' },{ id: '10683', name: '紫萝怨·意(450)', icon: '6739' }]}},
		sign:{show:false,id:null,value:{}}
	};
	$scope.pageSwitch = function(page){
		var list = ["intro","equipList","equipInfo","search","sign"];
		for (var i = 0; i < list.length; i++) {
			$scope.pageShow[list[i]].show = false;
		}
		$scope.pageShow[page].show=true;
		if(page == "sign"){
			var editorId = "example-string-to-sign";
			var editorValue = 'var stringToSign = \n'+
				'    HTTPMethod + "\\n" + \n' +
				'    Accept + "\\n" + \n' +
				'    Content-MD5 + "\\n" \n' +
				'    Content-Type + "\\n" + \n' +
				'    DateTime + "\\n" + \n' +
				'    Headers + \n' +
				'    Url;';
			setEditorJS(editorId,editorValue);
			editorId = "example-headers";
			editorValue = 'headers = \n'+
				'HeaderKey1 + ":" + HeaderValue1 + "\\n"+ \n'+
				'HeaderKey2 + ":" + HeaderValue2 + "\\n"+ \n'+
				'//... \n'+
				'HeaderKeyN + ":" + HeaderValueN + "\\n"';
			setEditorJS(editorId,editorValue);
			editorId = "example-url";
			editorValue = 'url =\n'+
				'Path +\n'+
				'"?" +\n'+
				'Key1 + "=" + Value1 +\n'+
				'"&" + Key2 + "=" + Value2 +\n'+
				'//...\n'+
				'"&" + KeyN + "=" + ValueN\n';
			setEditorJS(editorId,editorValue);
			return 0;
		}
		if(page=="equipInfo"){
			var editorId = "texiao-json";
			var editorValue = {"id":681,"name":"文王·梨绢","type":"Collection","components":[{"positionId":5,"equipName":"文王·梨绢丝履"},{"positionId":6,"equipName":"文王·梨绢丝袖"},{"positionId":8,"equipName":"文王·梨绢裳"},{"positionId":9,"equipName":"文王·梨绢钗"},{"positionId":10,"equipName":"文王·梨绢绣带"}],"effects":[{"conditionNum":2,"desc":"施展阴性内功伤害招式，一定几率提高自身阴性内功基础攻击力10%，持续6秒"},{"conditionNum":4,"desc":"“玳弦急曲”伤害提高10%"}]};
			setEditor(editorId,editorValue);
		}
		setEditor($scope.pageShow[page].id,$scope.pageShow[page].value);
	};

	function setEditor(id,value){
		var editor = ace.edit(id);
		editor.setValue(JSON.stringify(value,null,4), 1);
		editor.setTheme("ace/theme/monokai");
		editor.getSession().setMode("ace/mode/json");
		editor.setReadOnly(true);
		editor.getSession().setUseWrapMode(true);
		editor.setShowPrintMargin(false);
	}

	function setEditorJS(id,value){
		var editor = ace.edit(id);
		editor.setValue(value, 1);
		editor.setTheme("ace/theme/monokai");
		editor.getSession().setMode("ace/mode/javascript");
		editor.setReadOnly(true);
		editor.getSession().setUseWrapMode(true);
		editor.setShowPrintMargin(false);
	}

	$scope.queryParams = {
		equipList:[
			{name:"position",type:"string",require:true,example:"1",desc:"装备部位"},
			{name:"school",type:"string",require:true,example:"huajian",desc:"心法拼音"},
		],
		search:[
			{name:"keyword",type:"string",require:true,example:"紫萝怨",desc:"搜索关键词"},
			{name:"position",type:"string",require:true,example:"1",desc:"装备部位"},
		],
		sign:[
			{name:"X-Ca-Key",require:true,example:"23385461",desc:"AppKey"},
			{name:"X-Ca-Version",require:false,example:"1",desc:"API 版本号"},
			{name:"X-Ca-Signature",require:true,example:"",desc:"签名字符串"},
			{name:"X-Ca-Signature-Headers",require:true,example:"X-Ca-Version,X-Ca-Key,X-Ca-Timestamp",desc:"参与签名的 Headers"},
			{name:"X-Ca-Timestamp",require:false,example:"1465810658626",desc:"API 调用者传递时间戳，可选，15 分钟内有效"},
			{name:"X-Ca-Nonce",require:false,example:"",desc:"API 调用者生成 UUID，结合时间戳进行防重放，可选"},
			{name:"Content-MD5",require:false,example:"",desc:"计算 Body 的 MD5 值传递给网关进行 Body MD5 校验，可选"}
		]
	};
}])