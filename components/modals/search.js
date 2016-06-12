app.controller('SearchCtrl',['$scope','$http','$rootScope','toastr',function($scope,$http,$rootScope,toastr){
	$scope.searchEquip = [];
	$scope.allInfo = ["texiao","xiangqian"];
	$scope.basicInfoWithoutJL = ["basicPhysicsShield","basicMagicShield"];
	$scope.basicInfoWithJL = ["body","spirit","spunk","strength","agility"];
	$scope.plusInfo = ["physicsShield","magicShield","dodge","parryBase","parryValue","attack","heal","crit","critEffect","overcome","toughness","acce","hit","strain","huajing","threat"];
	$scope.search = function(str) {
		$scope.searchEquip = [];
		var position = $rootScope.focus.split("_")[0];
		var url = config.apiBase+'equips?position='+position+'&search=1'+'&keyword='+str;
		url = encodeURI(url);
		$http.get(url)
		.success(function(response){
			if(response.errors) {
				toastr.error(response.errors[0].detail);
			}else{
				response = response.data;
				var n = response.length > 6?5:response.length-1;
				var multipleItems = response.length > 6;
				while(n>=0){
					var listItem = {
						id: response[n].id,
						name: response[n].name,
						icon: response[n].icon
					};
					$scope.searchEquip.push(listItem);
					n--;
				}
				if(multipleItems)
					toastr.warning("结果过多，请尝试更准确的关键字");
			}
		})
		.error(function(){
			toastr.error("搜索失败,请重试");
		});
	};
	$scope.setEquip = function(id) {
		$("#searchModal").attr("data-id",id);
		$("#searchModal").modal("hide");
	};
	$scope.searchPreview = function(id){
		$rootScope.searchEquipPreview = Equip.createNew();
		$http.get(config.apiBase+'equip/'+id)
		.success(function(response){
			if(response.err) {
				toastr.error("载入装备失败，"+response.errReason);
			}else{
				var equipXinfaType = response.xinfatype;
				var preDesc = analysisPre(equipXinfaType);
				var focusHexId = "0x"+$rootScope.focus.split("_")[0];
				focusHexId = focusHexId - 0;
				$rootScope.searchEquipPreview.type = positions[focusHexId];
				$rootScope.searchEquipPreview.typeParse = typeParseMap[positions[focusHexId]];
				preDescAvaList.attack = preDesc[0]+"攻击提高";
				preDescAvaList.heal = preDesc[0]+"治疗成效提高";
				preDescAvaList.crit = preDesc[1]+"会心等级提高";
				preDescAvaList.critEffect = preDesc[1]+"会心效果提高";
				preDescAvaList.overcome = preDesc[0]+"破防等级提高";
				preDescAvaList.hit = preDesc[1]+"命中等级提高";
				angular.forEach(response, function(value,key){
					if(value!=="0"||key=="type"){
						this.setData(key,value);
					}
					if(key in preDescAvaList) this.setDesc(key,preDescAvaList[key]);
				} ,$rootScope.searchEquipPreview);
				$rootScope.searchEquipPreview.setStrengthen(0);
				$rootScope.searchEquipPreview.analysisHole();
				$rootScope.searchEquipPreview.recommendSchool = preDesc[2];
			}
		})
		.error(function(){
			toastr.error("载入装备失败,请重试");
		});
	};
}]);