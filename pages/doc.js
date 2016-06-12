var app = angular.module('J3pzDoc', ['toastr']);

app.controller('DocCtrl', ['$scope', function($scope){
	$scope.pageShow = {
		intro:false,
		equipList:true,
		equipInfo:false,
		search:false
	};
	$scope.pageSwitch = function(page){
		$scope.pageShow = {
			intro:false,
			equipList:false,
			equipInfo:false,
			search:false
		}
		$scope.pageShow[page]=true;
	};

	$scope.queryParams = {
		equipList:[
			{name:"position",type:"string",require:true,example:"1",desc:"装备部位"},
			{name:"school",type:"string",require:true,example:"huajian",desc:"心法拼音"},
		],
		search:[
			{name:"keyword",type:"string",require:true,example:"紫萝怨",desc:"搜索关键词"},
			{name:"position",type:"string",require:true,example:"1",desc:"装备部位"},
		]
	};

	var editorEquipList = ace.edit("equip-list-json");
	var equipListResponse = {data:[{"id":"11713","quality":"820","name":"星映","class":"0","filter":[0,0,1,1,0,0,0,0,0,0,0,0,0]},
		{"id":"12282","quality":"820","name":"通滞笔","class":"3","filter":[0,1,0,0,0,1,0,0,0,0,0,0,0]},
		{"id":"12289","quality":"850","name":"参云笔","class":"13","filter":[0,1,0,0,1,0,0,0,0,0,0,0,0]},
		{"id":"11131","quality":"900","name":"夜阳","class":"1","filter":[0,0,1,1,0,0,0,0,0,0,0,0,0]},
		{"id":"11108","quality":"900","name":"世外","class":"1","filter":[0,1,0,0,1,0,0,0,0,0,0,0,0]}]};
	editorEquipList.setValue(JSON.stringify(equipListResponse,null,4));
	editorEquipList.setTheme("ace/theme/monokai");
	editorEquipList.getSession().setMode("ace/mode/json");
	editorEquipList.setReadOnly(true);
	editorEquipList.setShowPrintMargin(false);
}])