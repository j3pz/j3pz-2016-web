/*
 * @require /components/config/config.js
 * @require /components/icheck-directive/icheck.js
 * @require /js/libs/ui-select/select.min.js
 */
app.controller('ChangeEquipController',['$scope','$rootScope','$http','$sce','toastr',function($scope,$rootScope,$http,$sce,toastr){
	$("#quality-range").slider({range: true, min: 450, max: 1100, values: $rootScope.equipListfilter.range, step:5,
		slide: function (event, ui) {
			$rootScope.equipListfilter.range[0] = ui.values[0];
			$rootScope.equipListfilter.range[1] = ui.values[1];
			$rootScope.$apply();
		}
	});

	var filterItemsDps = [
		{"text":"会心","index":0},
		{"text":"破防","index":1},
		{"text":"加速","index":2},
		{"text":"命中","index":3},
		{"text":"无双","index":4},
		{"text":"PVP","index":5}
	];
	var filterItemsHps = [
		{"text":"会心","index":0},
		{"text":"加速","index":2},
		{"text":"治疗","index":6},
		{"text":"PVP","index":5}
	];
	var filterItemsT = [
		{"text":"外防","index":7},
		{"text":"内防","index":8},
		{"text":"闪避","index":9},
		{"text":"招架","index":10},
		// {"text":"拆招","index":11},
		{"text":"御劲","index":12},
		{"text":"加速","index":2},
		{"text":"命中","index":3},
		{"text":"无双","index":4},
	];
	if($rootScope.menpai.type == "hps") $scope.filterItems = filterItemsHps;
	else if($rootScope.menpai.type == "t") $scope.filterItems = filterItemsT;
	else $scope.filterItems = filterItemsDps;
	$scope.ctrl = {};
	$scope.ctrl.isopen = false;
	$scope.sourceType = [
		{id:0,label:"5人副本"},
		{id:1,label:"10人普通副本"},
		{id:2,label:"25人英雄副本"},
		{id:3,label:"声望"},
		{id:4,label:"侠义"},
		{id:5,label:"江湖贡献"},
		{id:6,label:"活动"},
		{id:7,label:"世界BOSS"},
		{id:8,label:"挖宝"},
		{id:9,label:"生活技能"},
		{id:10,label:"名剑"},
		{id:11,label:"威望·恶人谷"},
		{id:12,label:"威望·浩气盟"},
		{id:13,label:"任务"}
	];
	$scope.itemText = ["会心","破防","加速","命中","无双","PVP","治疗","外防","内防","闪避","招架","拆招","御劲"];
	$scope.ctrl.sourceFilter = [false,false,false,false,false,false,false,false,false,false,false,false];
	$scope.filterSource = function (id,$event){
		$event.preventDefault();
		$event.stopPropagation();
		$scope.ctrl.sourceFilter[id] = !$scope.ctrl.sourceFilter[id];
		$scope.filter();
	};
	$scope.toggle = function (item, list) {
		list[item.index] = Math.abs(list[item.index]-1);
		$scope.filter();
	};
	$scope.exists = function (item, list) {
		return list[item.index]>0;
	};
	$scope.available = function (item, list) {
		if(item.index==4) return list[5]===0;
		if(item.index===0) return list[6]===0;
		if(item.index==2) return list[6]===0;
		if(item.index==7) return list[8]===0;
		if(item.index==8) return list[7]===0;
		if(item.index==5) return list[4]===0;
		return true;
	};
	$scope.setEquip = function (id) {
		$scope.$emit('setEquip',id);
	};
	$scope.filter = function(){
		var allSource = false;
		for (var i = 0; i < $scope.ctrl.sourceFilter.length; i++) {
			allSource = allSource || $scope.ctrl.sourceFilter[i];
		}
		angular.forEach($rootScope.equipLists[$rootScope.focus].list,function(value,key){
			value.isShown = false;
			var satisfied = value.quality>=$rootScope.equipListfilter.range[0]&&value.quality<=$rootScope.equipListfilter.range[1];
			if(satisfied){
				for (var i = 0; i < $rootScope.equipListfilter.attr.length; i++) {
					if(i==5) satisfied = value.filter[i] == $rootScope.equipListfilter.attr[i];
					else satisfied = value.filter[i] >= $rootScope.equipListfilter.attr[i];
					satisfied = satisfied&&($scope.ctrl.sourceFilter[value.class]||!allSource);
					if(!satisfied) break;
				}
			}
			if(satisfied) value.isShown = true;
		});
	};
	$scope.checkFilter = function(item){
		return item.isShown&&item.quality>=$rootScope.equipListfilter.range[0]&&item.quality<=$rootScope.equipListfilter.range[1];
	};
	$scope.trustAsHtml = function(value,quality) {
		var html = "<b>"+value;
		html += "</b><span class='right nostyle'>"+quality+"</span>";
		return $sce.trustAsHtml(html);
	};
	$scope.generateAttr = function(attr,classType){
		var html = "<i>";
		for (var i = 0; i < attr.length; i++) {
			if(attr[i]>0) html += $scope.itemText[i]+" ";
		}
		var sourceType = "";
		if(classType<0||classType>12) sourceType="其他";
		else sourceType = $scope.sourceType[classType].label;
		html += "</i><span class='right nostyle'>"+sourceType+"</span>";
		return $sce.trustAsHtml(html);
	};
	$scope.simpleSelect = function(value,attr){
		var html = "<b>"+value +"</b><span class='right nostyle'>";
		for (var i = 0; i < attr.length; i++) {
			if($rootScope.menpai.type=="t"&&(i<7||i==11)) continue;
			if($rootScope.equipListfilter.attr[5]>0&&i==5) continue;
			if(attr[i]>0) html += $scope.itemText[i]+" ";
		}
		if($rootScope.menpai.type=="t"){
			for (i = 2; i < 5; i++) {
				if(attr[i]>0) html += $scope.itemText[i]+" ";
			}
		}
		html += "</span>";
		return $sce.trustAsHtml(html);
	};
	$rootScope.$watch('equipListfilter.range',$scope.filter,true);
	$scope.getEquipList = function(){
		if(!$rootScope.equipLists[$rootScope.focus].isCached){
			var menpai = $rootScope.menpai.name;
			var focus = $rootScope.focus.split("_")[0];
			$http.get(config.apiBase+'equip?position='+focus+'&school='+menpai)
			.success(function(response){
				if(response.errors) {
					toastr.error(response.errors[0].detail);
				}else{
					response = response.data;
					var qcList = [];
					var commonList = [];
					angular.forEach(response, function(value,key){
						if(value.name.indexOf("无渊")===0){
							qcList.push(value);
						}else{
							commonList.push(value);
						}
					});
					$rootScope.equipLists[$rootScope.focus].list = commonList.concat(qcList);
					$rootScope.equipLists[$rootScope.focus].isCached = true;
				}
				$scope.filter();
			})
			.error(function(){
				toastr.error("载入装备列表失败,请重试");
			});
		}
	};
	$scope.$on('openEquipSelection',function(e){
		$scope.getEquipList();
	});
	$scope.$on('searchEquip',function(e){
		$scope.searchEquip();
	});
	$scope.getEquipList();
	$scope.searchEquip = function(){
		$("#searchModal").modal();
		$("#searchModal").attr("data-id","");
	};
	$("#searchModal").on('hidden.bs.modal',function(e){
		if(e.target){
			var id=e.target.dataset.id;
			if(id!=="") $scope.setEquip(id);
		}
	});
}]);

