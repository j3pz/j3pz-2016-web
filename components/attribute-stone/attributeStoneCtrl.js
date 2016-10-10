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
		needType: [0, 0, 0, 0, 0, 0],
		needNum: [0, 0, 0, 0, 0, 0],
		needLevel: [0, 0, 0, 0, 0, 0]
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
			needType: [0, 0, 0, 0, 0, 0],
			needNum: [0, 0, 0, 0, 0, 0],
			needLevel: [0, 0, 0, 0, 0, 0]
		};
		if ($rootScope.attributeStone[$rootScope.attributeStoneSelected].level > 0) {
			var attributes = $rootScope.attributeStone[$rootScope.attributeStoneSelected].attributes;
			for (var i = 0; i < 3; i++) {
				$scope.activationStats.needType[i] = attributes[i].needMagicStoneType;
				$scope.activationStatsShow.needType[attributes[i].needMagicStoneType] = 1;
				$scope.activationStats.needNum[i] = attributes[i].needMagicStoneNumber;
				$scope.activationStatsShow.needNum[attributes[i].needMagicStoneType] = attributes[i].needMagicStoneNumber;
				$scope.activationStats.needLevel[i] = attributes[i].needMagicStoneLevel;
				$scope.activationStatsShow.needLevel[attributes[i].needMagicStoneType] = attributes[i].needMagicStoneLevel;
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
		function activeTest() {  // 测试是否激活五彩石
			var isActive = true;
			for (var i = 0; i < 3; i++) {
				isActive = isActive && $rootScope.attributeStone[$rootScope.attributeStoneSelected].attributes[i].isActive;
			}
			return isActive;
		}
		function blankHoleTest() {
			for (var i = 0; i < positions.length; i++) {
				for (var j = 0; j < $rootScope.equips[positions[i]].holes.number; j++) {
					if ($rootScope.equips[positions[i]].embed.stone[j].typeId < 0) {
						return true; // 存在未镶嵌的孔
					}
				}
			}
			return false;
		}
		function junkHoleTest(attrId) {
			if ($rootScope.menpai.type == 't') {
				return attrId == '47';
			} else {
				return attrId == '05' || attrId == '39';
			}
		}
		if ($rootScope.attributeStone[$rootScope.attributeStoneSelected].level < 4) {
			toastr.error('请先选择五彩石！');
			return;
		} else {
			// 开始循环
			var tempFocus = $rootScope.focus;
			var limit = 5; // 最大循环次数，避免激活失败后多次重复尝试
			var runtime = 0;
			var maxLevel = $rootScope.embedLevel;
			var needType = $scope.activationStats.needType;
			var needNum = $scope.activationStats.needNum;
			var needLevel = $scope.activationStats.needLevel;
			if (maxLevel < 4) maxLevel = 4;
			while ((!activeTest() || blankHoleTest()) && limit--) {
				// 若首次自动镶嵌失败，尝试清空所有五行石进行镶嵌
				if (runtime == 2) {
					for (var i = 0; i < positions.length; i++) {
						$rootScope.focus = positions[i];
						for (var j = 0; j < $rootScope.equips[positions[i]].holes.number; j++) {
							var stone = {type: -1, level: 6};
							Utils.onDrop(stone, j);
						}
					}
				}
				for (var i = 0; i < positions.length; i++) {
					$rootScope.focus = positions[i];
					for (var j = 0; j < $rootScope.equips[positions[i]].holes.number; j++) {
						var holeInfo = $rootScope.equips[positions[i]].newHoles.holeInfo[j];
						var embed = $rootScope.equips[positions[i]].embed.stone[j];
						// 获取当前孔属性
						var avaType = holeInfo.avaStone;
						// 首次循环对所有输出孔进行镶嵌
						if (runtime == 0 || runtime == 2) {
							var isJunkHole = true;
							if (!junkHoleTest(holeInfo.attrId)) {
								isJunkHole = false;
								// 如果等级不够进行升级
								if (embed.level < maxLevel) {
									var stone = {type: 0, level: maxLevel};
									Utils.onDrop(stone, j);
								}
								// 如果未镶嵌但有等级进行重置
								if (embed.typeId == -1 && embed.level > 0) {
									var stone = {type: embed.typeId, level: maxLevel};
									Utils.onDrop(stone, j);
								}
							}
							// 如果属性不合适进行调整
							if (!embed.active) {
								// 属性是否五彩石激活相关
								var stone = {type: 0, level: isJunkHole && maxLevel > 6 ? 6 : maxLevel};
								Utils.onDrop(stone, j);
							}
						}
						if (runtime == 1 || runtime == 3) {
							// 对废孔进行调整
							if (junkHoleTest(holeInfo.attrId)) {
								var stone = stone = {type: 0, level: maxLevel > 6 ? 6 : maxLevel};
								Utils.onDrop(stone, j);
							}
						}

						if (activeTest() && !blankHoleTest()) {
							break;
						}
					}
				}
				runtime++;
				if (runtime >= 4) {
					toastr.error('自动镶嵌失败，请重新尝试，若仍未能激活成功，请手动调整');
					break;
				}
			}
			$rootScope.focus = tempFocus;
			runtime = 0;
		}
	};
}]);
