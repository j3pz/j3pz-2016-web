/* @require /components/config/config.js */
app.controller('PeizhuangCtrl', ['$scope','$rootScope','$location','Utils','toastr','$http',"$window",'$sce','hotkeys', function($scope,$rootScope,$location,Utils,toastr,$http,$window,$sce,hotkeys){
	// 配装器控制
	$scope.allInfo = ["texiao","xiangqian"];
	$scope.basicInfoWithoutJL = ["basicPhysicsShield","basicMagicShield"];
	$scope.basicInfoWithJL = ["body","spirit","spunk","strength","agility"];
	$scope.plusInfo = ["physicsShield","magicShield","dodge","parryBase","parryValue","attack","heal","crit","critEffect","overcome","toughness","acce","hit","strain","huajing","threat"];
	$scope.$on('setEquip',function(e,equipId){
		$scope.getEquip(equipId);
	});
	$scope.$on('setEnhance',function(e,enhanceId){
		$scope.getEnhance(enhanceId);
	});
	$scope.$on('navSelect',function(e){
		$scope.$broadcast('openEquipSelection');
		$scope.$broadcast('openEnhance');
		$scope.$broadcast('openXilian');
		$scope.$broadcast('openEmbed');
	});
	$scope.saveNewCase = function(event){
		var isSetName = false;
		var modalInstance = $modal.open({
			animation:true,
			templateUrl: '../../templates/setNewCase.html',
			controller: 'SetCaseNameController',
			size:'sm'
		});

		modalInstance.result.then(function (newName) {
			var name = newName;
			if(name&&name!==''){
				isSetName = true;
				$scope.saveCase(0,name,event);
				$rootScope.saveList.isLoad = false;
			}else{
				$scope.saveNewCase(event);
			}
		}, function () {
			console.log('Save new case cancelled');
		});
	};
	$scope.saveCaseConfirm = function(id,name,event){
		if(id!==0){
			$scope.saveCase(id,name);
		}
	};
	$scope.getSaveObj = function(id,name,mode){
		var modeType = "P_ID";
		if(mode===0) modeType = "P_ID";
		else modeType = "name";
		var tixingMap = ["成男","成女","萝莉","正太"];
		for (var i = 0; i < 4; i++) {
			if($rootScope.role.tixing==tixingMap[i]) break;
		}
		var attributeCheckList = ["dodge","parryBase","crit","overcome","acce","hit","strain","toughness"];
		var attributeCheckListText = ["闪避","招架","会心","破防","加速","命中","无双","御劲"];
		var toSave = {
			saveid:id,
			name:name,
			equips:[],
			attributeStone:[],
			tixing:i==4?0:i,
			menpai:$rootScope.menpai.name,
			result:$rootScope.results
		};
		toSave.buff=[];
		for (i = 0; i < $rootScope.buffController.buff.length; i++) {
			var buff = $rootScope.buffController.buff[i];
			if($rootScope.buffController.activeBuff[buff.id].isCheck){
				var saveBuff;
				if(mode==1){
					saveBuff = {id:buff.id};
					saveBuff.type = buff.type;
					saveBuff.icon = buff.icon;
					saveBuff.name = buff.name;
				}else{
					saveBuff = buff.id;
				}
				toSave.buff.push(saveBuff);
			}
		}
		for (i = 0; i < positions.length; i++) {
			var equip = {
				id:$rootScope.equips[positions[i]].getData(modeType),
				strengthen:$rootScope.equips[positions[i]].getJinglian('strengthen'),
				enhance:$rootScope.equips[positions[i]].getEnhance(modeType),
				embed:[],
				holes:[],
				magicChange:{
					level:$rootScope.equips[positions[i]].xilian.level,
					origin:$rootScope.equips[positions[i]].xilian.origin?$rootScope.equips[positions[i]].xilian.origin.key:0,
					target:$rootScope.equips[positions[i]].xilian.target?$rootScope.equips[positions[i]].xilian.target.key:0,
					ratio:$rootScope.equips[positions[i]].xilian.ratio
				}
			};
			if(mode==1){
				equip.filter = "";
				if($rootScope.equips[positions[i]].getData("physicsShield")>$rootScope.equips[positions[i]].getData("magicShield")) equip.filter += "外防,";
				else if($rootScope.equips[positions[i]].getData("physicsShield")<$rootScope.equips[positions[i]].getData("magicShield")) equip.filter += "内防,";
				if($rootScope.equips[positions[i]].getData('heal')>0&&$rootScope.equips[positions[i]].getData('crit')===0&&$rootScope.equips[positions[i]].getData('acce')===0) equip.filter = "治疗,";
				for (var j = 0; j < attributeCheckList.length; j++) {
					if($rootScope.equips[positions[i]].getData(attributeCheckList[j])>0) equip.filter += attributeCheckListText[j]+",";
				}
				equip.quality = $rootScope.equips[positions[i]].getData("quality");
			}
			for (var j = 0; j < $rootScope.equips[positions[i]].holes.number; j++) {
				var embed = {
					typeId:$rootScope.equips[positions[i]].embed.stone[j].typeId,
					level:$rootScope.equips[positions[i]].embed.stone[j].level
				};
				equip.embed.push(embed);
				if(mode==1){
					var hole = $rootScope.equips[positions[i]].newHoles.holeInfo[j];
					if(hole.changed){
						var change = {
							id:j,
							oriAttr:$rootScope.equips[positions[i]].holes.holeInfo[j].attrPrefix,
							tarAttr:hole.attrPrefix,
							oriType:$rootScope.equips[positions[i]].holes.holeInfo[j].typeId,
							tarType:hole.typeId
						};
						equip.holes.push(change);
					}
				}else{
					var hole = {
						typeId:$rootScope.equips[positions[i]].newHoles.holeInfo[j].typeId,
						attrId:$rootScope.equips[positions[i]].newHoles.holeInfo[j].attrId
					};
					equip.holes.push(hole);
				}
			}
			toSave.equips.push(equip);
		}
		for (var i = 0; i < 2; i++) {
			var stoneOptions = [];
			for (var j = 0; j < 4; j++) {
				stoneOptions.push($rootScope.attributeStoneLists[i][j].isSet?$rootScope.attributeStoneLists[i][j].setAs:0);
			}
			toSave.attributeStone.push(stoneOptions);
		}
		return toSave;
	};
	$scope.saveCase = function(id,name){
		var toSave = $scope.getSaveObj(id,name,0);
		$http.post(config.apiBase+'save.php', toSave)
		.success(function(response) {
			if(response.errors){
				toastr.error(response.errors[0].detail);
			}else{
				toastr.success("保存方案成功");
				if(id===0) $scope.$broadcast('saveCase');
			}
		})
		.error(function(response) {
			toastr.error("保存方案失败，请重试");
		});
	};
	$scope.loadCase = function(id){
		var tempFocus = angular.copy($rootScope.focus);
		var token = localStorage.getItem('token');
		$http.get(config.apiBase+'user/case/'+id,{
			headers:{'Authorization': 'Bearer '+token}
		})
		.success(function(response){
			if(response.errors) {
				toastr.error(response.errors[0].detail);
			}else{
				response = response.data;
				$rootScope.attributeStone = [Utils.transDBStoneToJsObj(response.attributestone[0]),Utils.transDBStoneToJsObj(response.attributestone[1])];
				for (var i = 0; i < 2; i++) {
					for (var j = 0; j < 4; j++) {
						$rootScope.attributeStoneLists[i][j].isSet = j==3?$rootScope.attributeStoneLists[i][2].isSet:response.attributestone[i].attr[j].attribute!==null;
						$rootScope.attributeStoneLists[i][j].setAs = j==3?response.attributestone[i].name:response.attributestone[i].attr[j].attribute;
						if(i===0)$scope.$broadcast('setAttributeStone',j);
					}
				}
				var tixingOptions = [
					{name:"成男", body:33, spunk:32, spirit:33, strength:32, agility:33},
					{name:"成女", body:33, spunk:32, spirit:33, strength:32, agility:33},
					{name:"萝莉", body:33, spunk:32, spirit:33, strength:32, agility:33},
					{name:"正太", body:33, spunk:32, spirit:33, strength:32, agility:33}
				];
				$rootScope.role = tixingOptions[parseInt(response.tixing)];
				$scope.$broadcast("setTixing",$rootScope.role);
				for (var i = 0; i < positions.length; i++) {
					$rootScope.focus = positions[i];
					$rootScope.equipLists[$rootScope.focus].setAs.name = response.equips[$rootScope.focus].equip.name;
					$rootScope.enhanceLists[$rootScope.focus].setAs.id = response.equips[$rootScope.focus].enhance.P_ID;
					$scope.setEquipByObj(response.equips[$rootScope.focus].equip,$rootScope.focus);
					// $rootScope.equips[$rootScope.focus].xilian.level = response.equips[$rootScope.focus].xilian.level;
					// $rootScope.equips[$rootScope.focus].xilian.ratio = response.equips[$rootScope.focus].xilian.ratio;
					// var xilianRes = Utils.xilian(response.equips[$rootScope.focus].xilian.origin,response.equips[$rootScope.focus].xilian.target,response.equips[$rootScope.focus].xilian.level,response.equips[$rootScope.focus].xilian.ratio);
					$rootScope.equips[$rootScope.focus].setStrengthen(response.equips[$rootScope.focus].strengthen);
					$rootScope.equips[$rootScope.focus].enhance={};
					angular.forEach(response.equips[$rootScope.focus].enhance, function(value,key){
						if(value!="0"&&value!=0){
							this.setEnhance(key,value);
						}
					} ,$rootScope.equips[$rootScope.focus]);
					for (var j = 0; j < $rootScope.equips[$rootScope.focus].holes.number; j++) {
						// Utils.changeColor(j,response.equips[$rootScope.focus].cuilianColour[j]);
						// Utils.changeAttr(j,response.equips[$rootScope.focus].cuilianAttr[j]);
						var loadStone = response.equips[$rootScope.focus].holeIn[j]=="-1"?{img:"-1-6",level:6,type:-1}:stones[parseInt(response.equips[$rootScope.focus].holeLevel[j])+1][response.equips[$rootScope.focus].holeIn[j]];
						Utils.onDrop(loadStone,j);
					}
				}
				$scope.navSelect(tempFocus);
				angular.forEach($rootScope.buffController.activeBuff,function(value,key){
					value.isCheck = false;
					$rootScope.buffController.buff[value.index].isCheck = false;
				});
				for (var i = 0; i < response.buff.length; i++) {
					if(response.buff[i]==="") continue;
					$rootScope.buffController.activeBuff[response.buff[i]].isCheck = true;
					$rootScope.buffController.buff[$rootScope.buffController.activeBuff[response.buff[i]].index].isCheck = true;
				}
				$scope.$broadcast("initBuff");
			}
		})
		.error(function(){
			toastr.error("载入方案失败,请重试");
		});
	};
	$scope.setEquipByObj = function(equipObj, focusId){
		if($rootScope.equips[focusId].data.texiao&&$rootScope.equips[focusId].data.texiao.type=="Collection"){
			var setId = $rootScope.equips[focusId].data.texiao.id;
			var setIndex = $rootScope.setController.getCollectionIndex(setId);
			var activeNum = $rootScope.setController.collectionsList[setIndex].takeOff($rootScope.equips[focusId].data.type);
			$rootScope.setController.posSetMap[focusId] = -1;
			if(activeNum===0) $rootScope.setController.deleteSet(setId);
		}
		if(!('strengthen' in equipObj)||equipObj.strengthen<=0){
			$rootScope.equips[focusId] = Equip.createNew();
			for (var i = 0; i < $rootScope.positionIconList.length; i++) {
				if($rootScope.positionIconList[i].type==focusId){
					$rootScope.positionIconList[i].icon = positionIconList[focusId].icon;
					break;
				}
			}
			$rootScope.equipLists[focusId].setAs = {name:"选择装备"};
			$rootScope.enhanceLists[focusId].setAs = {id:"0",name:"选择附魔"};
			var focusHexId = "0x"+focusId.split("_")[0];
			focusHexId = focusHexId - 0;
			$rootScope.equips[focusId].type = positions[focusHexId];
			$rootScope.equips[focusId].typeParse = typeParseMap[positions[focusHexId]];
			return;
		}
		var equipXinfaType = equipObj.xinfatype;
		var preDesc = analysisPre(equipXinfaType);
		var enhanceTemp = angular.copy($rootScope.equips[focusId].enhance);
		$rootScope.equips[focusId] = Equip.createNew();
		$rootScope.equips[focusId].enhance = enhanceTemp;
		var focusHexId = "0x"+focusId.split("_")[0];
		focusHexId = focusHexId - 0;
		$rootScope.equips[focusId].type = positions[focusHexId];
		$rootScope.equips[focusId].typeParse = typeParseMap[positions[focusHexId]];
		preDescAvaList["attack"]= preDesc[0]+"攻击提高";
		preDescAvaList["heal"]= preDesc[0]+"治疗成效提高";
		preDescAvaList["crit"]= preDesc[1]+"会心等级提高";
		preDescAvaList["critEffect"]= preDesc[1]+"会心效果提高";
		preDescAvaList["overcome"]= preDesc[0]+"破防等级提高";
		preDescAvaList["hit"]= preDesc[1]+"命中等级提高";
		angular.forEach(equipObj, function(value,key){
			if(value!=="0"||key=="type"){
				this.setData(key,value);
			}
			if(key in preDescAvaList) this.setDesc(key,preDescAvaList[key]);
		} ,$rootScope.equips[focusId]);

		for (var i = 0; i < $rootScope.positionIconList.length; i++) {
			if($rootScope.positionIconList[i].type==focusId){
				$rootScope.positionIconList[i].icon = '../../icons/'+$rootScope.equips[focusId].data.iconID+'.png';
				break;
			}
		}

		$rootScope.equips[focusId].analysisHole();
		$rootScope.equips[focusId].recommendSchool = preDesc[2];
		var v = $rootScope.equips[focusId].getData('strengthen')<$rootScope.strengthenLevel?$rootScope.equips[focusId].getData('strengthen'):$rootScope.strengthenLevel;
		if($rootScope.strengthenLevel==6&&$rootScope.equips[focusId].getData('strengthen')>6) v = $rootScope.equips[focusId].getData('strengthen');
		$rootScope.equips[focusId].setStrengthen(v);
		
		for (var i = 0; i < $rootScope.equips[focusId].holes.number; i++) {
			if($rootScope.equips[focusId].embed.stone[i].typeId<0){
				var defalutStone = {img:"0-6",level:$rootScope.embedLevel,type:0};
				Utils.onDrop(defalutStone,i);
			}
		}
		if($rootScope.equips[focusId].data.texiao&&$rootScope.equips[focusId].data.texiao.type=="Collection"){
			var set = Collection.createNew($rootScope.equips[focusId].data);
			var setIndex = $rootScope.setController.registerSet(set);
			$rootScope.setController.collectionsList[setIndex].takeOn($rootScope.equips[focusId]);
			$rootScope.setController.posSetMap[focusId] = setIndex;
		}
		$scope.$broadcast('openEnhance');
		$scope.$broadcast('openXilian');
		$scope.$broadcast('openEmbed');
	};
	$scope.getEquip = function(id){
		if(id===0){
			var emptyEquip = Equip.createNew();
			$scope.setEquipByObj(emptyEquip,$rootScope.focus);
			return;
		}
		$http.get(config.apiBase+'equip/'+id)
		.success(function(response){
			if(response.errors) {
				toastr.error("载入装备失败，"+response.errors[0].detail);
			}else{
				$scope.setEquipByObj(response.data,$rootScope.focus);
			}
		})
		.error(function(){
			toastr.error("载入装备失败,请重试");
		});
	};
	$scope.getEnhance = function(id){
		if(id===0){
			$rootScope.equips[$rootScope.focus].enhance={};
			return;
		}
		$http.get(config.apiBase+'enhance/'+id)
		.success(function(response){
			if(response.errors) {
				toastr.error("载入附魔失败，"+response.errors[0].detail);
			}else{
				$rootScope.equips[$rootScope.focus].enhance={};
				angular.forEach(response.data, function(value,key){
					if(value!="0"&&value!=0){
						this.setEnhance(key,value);
					}
				} ,$rootScope.equips[$rootScope.focus]);
			}
		})
		.error(function(){
			toastr.error("载入附魔失败");
		});
	};
	$scope.getBuffList = function(){
		// 获取门派奇穴和可用Buff列表
		$http.get(config.apiBase+'buff?school='+$rootScope.menpai.name)
		.success(function(response){
			$rootScope.buffController.buff=[];
			if(response.errors){
				toastr.error(response.errors[0].detail);
			}else{
				for (var i = 0; i < response.data.length; i++) {
					$rootScope.buffController.registerBuff(response.data[i]);
				}
				$scope.$broadcast('initBuff');
			}
		});
	};
	$scope.getBuffList();
	$scope.casePreview = function(){
		$rootScope.toSave = $scope.getSaveObj(0,0,1);
		$("#casePreviewModal").modal('show');
	};
	
	$scope.getCaseList = function(){
		if(!$rootScope.saveList.isLoad){
			$rootScope.saveList.list = [];
			var token = localStorage.getItem('token');
			$http.get(config.apiBase+'user/case',{
				headers:{'Authorization': 'Bearer '+token}
			})
			.success(function(response){
				if(response.errors){
					toastr.error(response.errors[0].detail);
				}else{
					response = response.data;
					angular.forEach(response,function(value,key){
						var savedCase = {
							name:value.name,
							id:value.saveid
						};
						this.push(savedCase);
					},$rootScope.saveList.list);
					$rootScope.saveList.isLoad = true;
				}
			});
		}
	};
	$scope.$on('saveCase', function(e){
		$scope.getCaseList();
	});
	$scope.navSelect = function(id){
		$rootScope.focus = id;
		$scope.$broadcast('openEquipSelection');
		$scope.$broadcast('openEnhance');
		$scope.$broadcast('openXilian');
		$scope.$broadcast('openEmbed');
	};
	$rootScope.$watch('equips',Utils.calculate,true);
	$rootScope.$watch('role',Utils.calculate,true);
	$rootScope.$watch('setController',Utils.calculate,true);
	$rootScope.$watch('buffController',Utils.calculate,true);
	$rootScope.$watch('attributeStone',function(){
		Utils.attributeStoneActivation();
		Utils.calculate();
	},true);
	$rootScope.$watch('attributeStoneSelected',Utils.calculate);

	// 是否为分享链接
	var path = $location.absUrl();	
	var pathHash = path.split("#");
	angular.element(document).ready(function () {
		if(pathHash[1]){
			$scope.loadCase(pathHash[1].split("/")[1]);
		}
	});
	
	hotkeys.add({
		combo: 'p',
		description: '查看装备总览',
		callback: function() {
			if(!!$modalStack.getTop()) $modalStack.dismissAll();
			else $scope.casePreview();
		}
	});
	hotkeys.add({
		combo: 'shift+f',
		description: '搜索其他装备',
		callback: function() {
			if(!!$modalStack.getTop()) $modalStack.dismissAll();
			else $scope.$broadcast('searchEquip');
		}
	});
	hotkeys.add({
		combo: 'shift+c',
		description: '查看所有属性',
		callback: function() {
			if(!!$modalStack.getTop()){
				$modalStack.dismissAll();
				return;
			}
			var modalInstance = $modal.open({
				animation:true,
				templateUrl: '../../templates/allResults.html',
				controller: 'ResultsShowController',
				size:'lg',
				resolve:{
					result:function(){return $rootScope.results;}
				}
			});

			modalInstance.result.then(function () {
				console.log("Finish Share");
			}, function () {
				console.log('Share Case cancelled');
			});
		}
	});
}]);

