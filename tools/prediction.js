/* @require /components/config/config.js
   @require /components/config/global.js
   @require /components/equip/equip.js
*/

var app = angular.module('J3Prediction', ['ui.bootstrap','toastr'])
.config(['toastrConfig',function(toastrConfig) {
	angular.extend(toastrConfig, {
		maxOpened: 5,
		positionClass: 'toast-bottom-right',
		timeOut: 3000
	});
}]);

app.controller('GuishiCtrl', ['$scope','$http','toastr', function($scope,$http,toastr){
	$scope.data = {};
	$scope.currentInstance = {};
	$scope.currentBoss = {};
	$scope.getPredictionData = function(){
		$http.get("/data/prediction.json")
		.success(function(response){
			$scope.data = response;
			$scope.chooseInstance(0);
		});
	}

	$scope.getPredictionData();

	$scope.chooseInstance = function(id){
		$scope.currentInstance = $scope.data[id];
		$scope.chooseBoss(0);
	}

	$scope.updateStone = function(){
		$scope.stoneList = [];
		for (var i = 0; i < $scope.currentInstance.prediction.length; i++) {
			if($scope.currentInstance.prediction[i].boss==$scope.currentBoss){
				$scope.stoneList.push($scope.currentInstance.prediction[i]);
			}
		}
	}

	$scope.chooseBoss = function(id){
		$scope.currentBoss = $scope.currentInstance.boss[id];
		$scope.updateStone()
	}

	$scope.allInfo = ["texiao","xiangqian"];
	$scope.basicInfoWithoutJL = ["basicPhysicsShield","basicMagicShield"];
	$scope.basicInfoWithJL = ["body","spirit","spunk","strength","agility"];
	$scope.plusInfo = ["physicsShield","magicShield","dodge","parryBase","parryValue","attack","heal","crit","critEffect","overcome","toughness","acce","hit","strain","huajing","threat"];
	var positions = ["项链","腰坠","戒指","戒指","暗器","鞋子","护腕","下装","上衣","帽子","腰带","武器"];

	$scope.searchPreview = function(name){
		$scope.searchEquipPreview = Equip.createNew();
		nameArr = name.split("[");
		nameArr = nameArr[1].split("]");
		name = nameArr[0];
		if(name.indexOf("儒风")>=0) return;
		var url = config.apiBase+'equip/'+name;
		url = encodeURI(url);
		$http.get(url)
		.success(function(response){
			if(response.errors) {
				toastr.error("载入装备失败，"+response.errors[0]);
			}else{
				response = response.data;
				var equipXinfaType = response.xinfatype;
				var preDesc = analysisPre(equipXinfaType);
				$scope.searchEquipPreview.type = response.type;
				$scope.searchEquipPreview.typeParse = positions[response.type];
				preDescAvaList["attack"]= preDesc[0]+"攻击提高";
				preDescAvaList["heal"]= preDesc[0]+"治疗成效提高";
				preDescAvaList["crit"]= preDesc[1]+"会心等级提高";
				preDescAvaList["critEffect"]= preDesc[1]+"会心效果提高";
				preDescAvaList["overcome"]= preDesc[0]+"破防等级提高";
				preDescAvaList["hit"]= preDesc[1]+"命中等级提高";
				angular.forEach(response, function(value,key){
					if(value!=="0"||key=="type"){
						this.setData(key,value);
					}
					if(key in preDescAvaList) this.setDesc(key,preDescAvaList[key]);
				} ,$scope.searchEquipPreview);
				$scope.searchEquipPreview.setStrengthen(0);
				$scope.searchEquipPreview.analysisHole();
				$scope.searchEquipPreview.recommendSchool = preDesc[2];
			}
		})
		.error(function(){
			toastr.error("载入装备失败,请重试");
		});
	}
}]);
