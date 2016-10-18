/* @require /components/config/config.js */
app.controller('AttributeStoneController', ['$scope', '$rootScope', '$http', 'Utils', 'toastr', function($scope, $rootScope, $http, Utils, toastr) {
	$scope.ctrl = {};
	$scope.ctrl.attribute = [];
	$scope.placeHolder = ['选择第一属性', '选择第二属性', '选择第三属性', '选择等级'];
	$scope.activationStats = {
		needType: [-1, -1, -1],
		needNum: [-1, -1, -1],
		needLevel: [-1, -1, -1],
		desc: ['金', '木', '水', '火', '土', '总']
	};
	$scope.activationStatsShow = {
		needNum: [0, 0, 0],
		needLevel: [0, 0, 0]
	};
	$scope.init = function() {
		if (!$rootScope.attributeStoneLists[$rootScope.attributeStoneSelected][0].isLoad) {
			$http.get(config.apiBase + 'stone?school=' + $rootScope.menpai.name)
			.success(function(response) {
				response = response.data;
				angular.forEach(response, function(value, key) {
					this.push(value);
				}, $rootScope.attributeStoneLists[0][0].attr);
				$rootScope.attributeStoneLists[0][0].isLoad = true;
				angular.forEach(response, function(value, key) {
					this.push(value);
				}, $rootScope.attributeStoneLists[1][0].attr);
				$rootScope.attributeStoneLists[1][0].isLoad = true;
			})
			.error(function(response) {
				toastr.error('载入五彩石列表失败，' + response.errors[0].detail + '，请点击重选五彩石');
			});
		}
		$scope.activationStatsShow = {
			needNum: [0, 0, 0],
			needLevel: [0, 0, 0]
		};
		if ($rootScope.attributeStone[$rootScope.attributeStoneSelected].level > 0) {
			var attributes = $rootScope.attributeStone[$rootScope.attributeStoneSelected].attributes;
			for (var i = 0; i < 3; i++) {
				$scope.activationStats.needNum[i] = attributes[i].needMagicStoneNumber;
				$scope.activationStatsShow.needNum[i] = attributes[i].needMagicStoneNumber;
				$scope.activationStats.needLevel[i] = attributes[i].needMagicStoneLevel;
				$scope.activationStatsShow.needLevel[i] = attributes[i].needMagicStoneLevel;
			}
		}
		$scope.update();
	};
	$scope.update = function() {
		for (var i = 0; i < 4; i++) {
			if ($rootScope.attributeStoneLists[$rootScope.attributeStoneSelected][i].isSet) {
				$scope.ctrl.attribute[i] = $rootScope.attributeStoneLists[$rootScope.attributeStoneSelected][i].setAs;
			} else {
				$scope.ctrl.attribute[i] = $scope.placeHolder[i];
			}
		}
	};
	$rootScope.$watch('attributeStoneSelected', $scope.init);
	$scope.setAttributeStone = function(id) {
		if (id != -1) {
			var request = $rootScope.attributeStoneLists[$rootScope.attributeStoneSelected][id].setAs;
			$rootScope.attributeStoneLists[$rootScope.attributeStoneSelected][id].isSet = true;
		}
		for (var i = 0; i < 4; i++) {
			if (i > id) {
				$rootScope.attributeStoneLists[$rootScope.attributeStoneSelected][i].isLoad = false;
				$rootScope.attributeStoneLists[$rootScope.attributeStoneSelected][i].setAs = $scope.placeHolder[i];
				$rootScope.attributeStoneLists[$rootScope.attributeStoneSelected][i].isSet = false;
				if (i != 0) $rootScope.attributeStoneLists[$rootScope.attributeStoneSelected][i].attr = [];
			}
		}
		id++;
		$scope.update();
		if (id == 0) {
			var attrStone = {
				name: '',
				score: 0,
				level: 0,
				attributes: [
					{
						type: 'jing',
						isFirstChild: true,
						desc: '',
						prefix: 'none',
						number: 0,
						isActive: false,
						needMagicStoneType: '-1',
						needMagicStoneNumber: 0
					},
					{
						desc: '',
						isFirstChild: false,
						prefix: 'none',
						number: 0,
						isActive: false,
						needMagicStoneType: '-1',
						needMagicStoneNumber: 0
					},
					{
						desc: '',
						isFirstChild: false,
						prefix: 'none',
						number: 0,
						isActive: false,
						needMagicStoneType: '-1',
						needMagicStoneNumber: 0
					}
				]
			};
			$rootScope.attributeStone[$rootScope.attributeStoneSelected] = angular.copy(attrStone);
			return;
		}
		var url = '';
		if (id < 4) {
			url = config.apiBase + 'stone?school=' + $rootScope.menpai.name + '&q=';
			for (var i = 1; i <= id; i++) {
				if (i != id) url += $rootScope.attributeStoneLists[$rootScope.attributeStoneSelected][i - 1].setAs + ';';
				else url += request;
			}
		} else {
			url = config.apiBase + 'stone/' + request.id;
		}
		url = encodeURI(url);
		$http.get(url)
		.success(function(response) {
			if (response.errors) {
				toastr.error(response.errors[0].detail);
			} else {
				response = response.data;
				if (id < 4) {
					$rootScope.attributeStoneLists[$rootScope.attributeStoneSelected][id].attr = [];
					for (var i = 0; i < response.length; i++) {
						$rootScope.attributeStoneLists[$rootScope.attributeStoneSelected][id].attr.push(response[i]);
					}
					$rootScope.attributeStoneLists[$rootScope.attributeStoneSelected][id].isLoad = true;
				} else if (id == 4) {
					attrStone = Utils.transDBStoneToJsObj(response);
					$rootScope.attributeStone[$rootScope.attributeStoneSelected] = attrStone;
					var exteaStoneScore = attrStone.level * 77;
					var affectedWeapon = $rootScope.attributeStoneSelected == 0 ? 'b_primaryWeapon' : 'c_primaryWeapon';
					$rootScope.equips[affectedWeapon].embed.totalScore = Math.round(eval($rootScope.equips[affectedWeapon].embed.score.join('+')) + exteaStoneScore);
					$scope.init();
				}
			}
		})
		.error(function(response) {
			toastr.error('载入五彩石列表失败，' + response.errors[0].detail + '，请点击重选五彩石');
		});
	};
	$scope.$on('setAttributeStone', function(e, id) {
		$scope.setAttributeStone(id);
	});

	$scope.autoEmbed = function() {
		var tempFocus = $rootScope.focus;
		var maxLevel = $rootScope.embedLevel;
		// 若首次自动镶嵌失败，尝试清空所有五行石进行镶嵌
		for (var i = 0; i < positions.length; i++) {
			$rootScope.focus = positions[i];
			for (var j = 0; j < $rootScope.equips[positions[i]].holes.number; j++) {
				var stone = {type: 0, level: maxLevel};
				Utils.onDrop(stone, j);
			}
		}
		$rootScope.focus = tempFocus;
	};

	$scope.$on('getAttributeStoneList', function(e, id) {
		$scope.getAttributeStoneList(id);
	});

	$scope.getAttributeStoneList = function(id) {
		var url = '';
		var request = $rootScope.attributeStoneLists[$rootScope.attributeStoneSelected][id].setAs;
		if (id < 3) {
			url = config.apiBase + 'stone?school=' + $rootScope.menpai.name + '&q=';
			for (var i = 0; i <= id; i++) {
				if (i != id) url += $rootScope.attributeStoneLists[$rootScope.attributeStoneSelected][i].setAs + ';';
				else url += request;
			}
		} else {
			return;
		}
		url = encodeURI(url);
		$http.get(url)
		.success(function(response) {
			if (response.errors) {
				toastr.error(response.errors[0].detail);
			} else {
				response = response.data;
				$rootScope.attributeStoneLists[$rootScope.attributeStoneSelected][id + 1].attr = [];
				for (var i = 0; i < response.length; i++) {
					$rootScope.attributeStoneLists[$rootScope.attributeStoneSelected][id + 1].attr.push(response[i]);
				}
				$rootScope.attributeStoneLists[$rootScope.attributeStoneSelected][id + 1].isLoad = true;
				if (id == 2) {
					var list = $rootScope.attributeStoneLists[$rootScope.attributeStoneSelected][id + 1].attr;
					for (var j = 0; j < list.length; j++) {
						if (list[j].name == $rootScope.attributeStoneLists[$rootScope.attributeStoneSelected][id + 1].setAs.name) {
							$rootScope.attributeStoneLists[$rootScope.attributeStoneSelected][id + 1].setAs.id = list[j].id;
						}
					}
				}
			}
		})
		.error(function(response) {
			toastr.error('载入五彩石列表失败，' + response.errors[0].detail + '，请点击重选五彩石');
		});
	};
}]);
