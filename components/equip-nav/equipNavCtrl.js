/* @require /components/config/config.js */
app.controller('EquipNavCtrl', ['$rootScope','$scope','hotkeys', function($rootScope,$scope,hotkeys){
	// 页面元素
	$rootScope.positionIconList = [
		{type:"0_hat",icon:"../../images/pl_9.png"},
		{type:"1_jacket",icon:"../../images/pl_8.png"},
		{type:"2_belt",icon:"../../images/pl_10.png"},
		{type:"3_wrist",icon:"../../images/pl_6.png"},
		{type:"b_primaryWeapon",icon:"../../images/pl_11.png"},
		{type:"a_secondaryWeapon",icon:"../../images/pl_4.png"},
		{type:"4_bottoms",icon:"../../images/pl_7.png"},
		{type:"5_shoes",icon:"../../images/pl_5.png"},
		{type:"6_necklace",icon:"../../images/pl_0.png"},
		{type:"7_pendant",icon:"../../images/pl_1.png"},
		{type:"8_ring_1",icon:"../../images/pl_2.png"},
		{type:"9_ring_2",icon:"../../images/pl_2.png"}
	];

	$scope.navSelect = function(id){
		$rootScope.focus = id;
		$scope.$emit('navSelect');
	};

	$scope.equipPreview = function(type){
		$rootScope.hoverType = type;
		$rootScope.hoverEquip = $rootScope.equips[type];
	};

	// 快捷键绑定
	hotkeys.add({
		combo: 'q',
		description: '切换到帽子',
		callback: function() {
			$scope.navSelect('0_hat');
		}
	});
	hotkeys.add({
		combo: 'w',
		description: '切换到上衣',
		callback: function() {
			$scope.navSelect('1_jacket');
		}
	});
	hotkeys.add({
		combo: 'e',
		description: '切换到腰带',
		callback: function() {
			$scope.navSelect('2_belt');
		}
	});
	hotkeys.add({
		combo: 'r',
		description: '切换到护腕',
		callback: function() {
			$scope.navSelect('3_wrist');
		}
	});
	hotkeys.add({
		combo: 'a',
		description: '切换到下装',
		callback: function() {
			$scope.navSelect('4_bottoms');
		}
	});
	hotkeys.add({
		combo: 's',
		description: '切换到鞋子',
		callback: function() {
			$scope.navSelect('5_shoes');
		}
	});
	hotkeys.add({
		combo: 'd',
		description: '切换到项链',
		callback: function() {
			$scope.navSelect('6_necklace');
		}
	});
	hotkeys.add({
		combo: 'f',
		description: '切换到腰坠',
		callback: function() {
			$scope.navSelect('7_pendant');
		}
	});
	hotkeys.add({
		combo: 'g',
		description: '切换到戒指 1',
		callback: function() {
			$scope.navSelect('8_ring_1');
		}
	});
	hotkeys.add({
		combo: 'h',
		description: '切换到戒指 2',
		callback: function() {
			$scope.navSelect('9_ring_2');
		}
	});
	hotkeys.add({
		combo: 'y',
		description: '切换到暗器',
		callback: function() {
			$scope.navSelect('a_secondaryWeapon');
		}
	});
	hotkeys.add({
		combo: 't',
		description: '切换到武器',
		callback: function() {
			if($rootScope.zhongjian) $scope.navSelect('c_primaryWeapon');
			else $scope.navSelect('b_primaryWeapon');
		}
	});
}]);