/* @require /components/config/config.js */
app.controller('EmbedController',['$scope','$rootScope','Utils',function($scope,$rootScope,Utils){
	$scope.ctrl = {}
	$scope.ctrl.stoneLevelDesc = ["","一","二","三","四","五","六","七","八"];

	$scope.init = function(){
		$scope.ctrl.holeType = [];
		$scope.holeType = [];
		$scope.originalHoleType = [];
		$scope.holeChangeableTypes = [];
		for (var i = 0; i < $rootScope.equips[$rootScope.focus].holes.number; i++) {
			var typeId = $rootScope.equips[$rootScope.focus].holes.holeInfo[i].typeId;
			var originalTypeList = stoneTypeMap[typeId];
			var unavailType = stoneTypeChange[typeId];
			$scope.originalHoleType[i] = {index:typeId,desc:stoneTypeList[originalTypeList[0]] + "/" + stoneTypeList[originalTypeList[1]]+"【原】"};

			typeId = $rootScope.equips[$rootScope.focus].newHoles.holeInfo[i].typeId;
			originalTypeList = stoneTypeMap[typeId];
			$scope.holeType[i] = {index:typeId,desc:stoneTypeList[originalTypeList[0]] + "/" + stoneTypeList[originalTypeList[1]]};
			$scope.holeChangeableTypes[i] = [$scope.originalHoleType[i]];
			for (var j = 1; j <= unavailType.length; j++) {
				var optionType = stoneTypeMap[unavailType[j-1]]
				$scope.holeChangeableTypes[i][j] = {
					index:unavailType[j-1],
					desc:stoneTypeList[optionType[0]] + "/" + stoneTypeList[optionType[1]]
				};
			};
			$scope.ctrl.holeType[i] = typeId;
		};
		$scope.ctrl.holeAttr = [];
		$scope.holeAttr = [];
		$scope.originalHoleAttr = [];
		$scope.holeChangeableAttrs = [];
		for (var i = 0; i < $rootScope.equips[$rootScope.focus].holes.number; i++) {
			var attrId = $rootScope.equips[$rootScope.focus].holes.holeInfo[i].attrId;
			var holeChangeableAttrsId = attrTransTable[attrId];
			$scope.originalHoleAttr[i] = {index:attrId,desc:stoneAttrMap[Number(attrId)].desc+"【原】"};
			attrId = $rootScope.equips[$rootScope.focus].newHoles.holeInfo[i].attrId;
			$scope.holeAttr[i] = {index:attrId,desc:stoneAttrMap[Number(attrId)].desc};
			$scope.holeChangeableAttrs[i] = [$scope.originalHoleAttr[i]];
			for (var j = 1; j <= holeChangeableAttrsId.length; j++) {
				var optionAttr = {
					index: holeChangeableAttrsId[j-1],
					desc: stoneAttrMap[Number(holeChangeableAttrsId[j-1])].desc
				};
				$scope.holeChangeableAttrs[i][j] = optionAttr;
			}
			$scope.ctrl.holeAttr[i] = attrId;
		};
	}
	$scope.$on('openEmbed', function(e){
		$scope.init();
	});
	$scope.stones = stones;
	$scope.empty = function(event,n){
		var emptyStone = {img:"-1-6",level:6,type:-1};
		Utils.onDrop(emptyStone,n);
	}
	$scope.embedAStone = function(event,stone){
		if($scope.preventClickEvt){
			$scope.releasePrevent();
			return;
		} 
		for (var i = 0; i < $rootScope.equips[$rootScope.focus].holes.number; i++) {
			var typeId = $rootScope.equips[$rootScope.focus].embed.stone[i].typeId;
			if(typeId=="-1"||typeId==-1){
				Utils.onDrop(stone,i);
				break;
			}
		}
	}
	$scope.preventClick = function(){
		$scope.preventClickEvt = true;
	}
	$scope.$on('draggable:start',$scope.preventClick);
	$scope.releasePrevent = function(){
		$scope.preventClickEvt = false;
	}
	$scope.onDrop = function(ev,stone,n){
		Utils.onDrop(stone,n);
	}
	$scope.changeColor = function(ev,n){
		var value = $scope.ctrl.holeType[n];
		Utils.changeColor(n,value);
	}
	$scope.changeAttr = function(ev,n){
		var value = $scope.ctrl.holeAttr[n];;
		Utils.changeAttr(n,value);
		var length = $rootScope.equips[$rootScope.focus].holes.number;
		for (var i = 0; i < length; i++) {
			if(i!=n){
				$rootScope.equips[$rootScope.focus].newHoles.holeInfo[i].attrId = $rootScope.equips[$rootScope.focus].holes.holeInfo[i].attrId;
				$rootScope.equips[$rootScope.focus].newHoles.holeInfo[i].attrDesc = $rootScope.equips[$rootScope.focus].holes.holeInfo[i].attrDesc;
				$rootScope.equips[$rootScope.focus].newHoles.holeInfo[i].attrPrefix = $rootScope.equips[$rootScope.focus].holes.holeInfo[i].attrPrefix;
				$scope.ctrl.holeAttr[i] = $scope.originalHoleAttr[i].index;
				Utils.isChanged(i);
			}
		};
	}
}]);
