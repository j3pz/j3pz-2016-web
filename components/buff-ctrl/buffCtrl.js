/* @require /components/config/config.js */
app.controller('BuffController', ['$rootScope', '$scope', 'Utils', function($rootScope, $scope, Utils) {
	$scope.types = [
		{id: 'OrdinaryBuff', name: '普通增益气劲'},
		{id: 'InfightBuff', name: '战时增益气劲'},
		{id: 'Food', name: '小药'}
	];
	$scope.openBuffModal = function() {
		$('#buffModal').modal();
	};
	$scope.init = function() {
		$scope.qixueList = [];
		$scope.buffList = {
			'OrdinaryBuff': [],
			'InfightBuff': [],
			'Food': []
		};
		$scope.addedBuff = [];
		for (var i = 0; i < $rootScope.buffController.buff.length; i++) {
			$rootScope.buffController.buff[i].isCheck = $rootScope.buffController.checkActive($rootScope.buffController.buff[i].id);
			if ($rootScope.buffController.buff[i].isCheck && $rootScope.buffController.buff[i].type != 'Qixue') {
				$scope.addedBuff.push($rootScope.buffController.buff[i]);
			}
			if ($rootScope.buffController.buff[i].type == 'Qixue') {
				$scope.qixueList.push($rootScope.buffController.buff[i]);
			} else {
				$scope.buffList[$rootScope.buffController.buff[i].type].push($rootScope.buffController.buff[i]);
			}
		}
		$('#add-buff').tooltip();
		$('#buff').tooltip({
			selector: '.active-buff'
		});
	};
	$scope.setZhongjian = function() {
		$rootScope.attributeStoneSelected = $rootScope.zhongjian ? 1 : 0;
		if ($rootScope.zhongjian) {
			$rootScope.positionIconList[4].type = 'c_primaryWeapon';
			$rootScope.positionIconList[4].icon = $rootScope.equips['c_primaryWeapon'].data.iconID > 0 ? 'https://www.j3pz.com/icons/' + $rootScope.equips['c_primaryWeapon'].data.iconID + '.png' : '../../images/pl_12.png';
			$scope.navSelect('c_primaryWeapon');
		} else {
			$rootScope.positionIconList[4].type = 'b_primaryWeapon';
			$rootScope.positionIconList[4].icon = $rootScope.equips['b_primaryWeapon'].data.iconID > 0 ? 'https://www.j3pz.com/icons/' + $rootScope.equips['b_primaryWeapon'].data.iconID + '.png' : '../../images/pl_11.png';
			$scope.navSelect('b_primaryWeapon');
		}
		if ($rootScope.focus == 'b_primaryWeapon' && $rootScope.zhongjian)$rootScope.focus = 'c_primaryWeapon';
		else if ($rootScope.focus == 'c_primaryWeapon' && !$rootScope.zhongjian) $rootScope.focus = 'b_primaryWeapon';
		Utils.attributeStoneActivation();
	};
	$scope.setBuff = function(id, check) {
		var buff = $rootScope.buffController.buff[$rootScope.buffController.activeBuff[id].index];
		if (check) {
			var conflict = [];
			var conflictId = [];
			for (var i = 0; i < $scope.addedBuff.length; i++) {
				if ((buff.conflict == $scope.addedBuff[i].conflict && buff.conflict != 0) || (buff.id == $scope.addedBuff[i].id)) {
					conflict.push(i);
					conflictId.push($scope.addedBuff[i].id);
				}
			}
			for (var i = conflict.length - 1; i >= 0; i--) {
				$scope.addedBuff.splice(conflict[i], 1);
				$rootScope.buffController.activeBuff[conflictId[i]].isCheck = false;
				$rootScope.buffController.buff[$rootScope.buffController.activeBuff[conflictId[i]].index].isCheck = false;
			}
			$scope.addedBuff.push(buff);
		} else {
			$('.tooltip').tooltip('destroy');
			for (var i = 0; i < $scope.addedBuff.length; i++) {
				if ($scope.addedBuff[i].id == id) {
					$scope.addedBuff.splice(i, 1);
					break;
				}
			}
		}
		$rootScope.buffController.activeBuff[id].isCheck = check;
		$rootScope.buffController.buff[$rootScope.buffController.activeBuff[id].index].isCheck = check;
	};
	$scope.$on('initBuff', $scope.init);
}]);
