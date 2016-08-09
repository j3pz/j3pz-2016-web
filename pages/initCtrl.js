/*
 * @require /components/config/global.js
 * @require /components/equip/equip.js
 * @require /components/collection/collection.js
 * @require /components/collection/collectionController.js
 * @require /components/buff/buff.js
 * @require /components/utils/utils.js
 */
app.controller('InitCtrl', ['$scope', '$rootScope', '$location', 'CollectionController', function($scope, $rootScope, $location, CollectionController) {
	// 初始化
	$rootScope.isPz = true;
	$rootScope.equips = {};	// 初始化装备
	$rootScope.equipLists = {};	// 初始化装备列表
	$rootScope.enhanceLists = {};	// 初始化附魔列表
	$rootScope.isModalOpen = false;
	$rootScope.equipListfilter = {};
	$rootScope.equipListfilter.attr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	$rootScope.equipListfilter.range = config.defaultValues.qualityRange;
	$rootScope.embedLevel = 6;
	$rootScope.strengthenLevel = 6;
	$rootScope.menpai = {
		name: 'none',
		type: 'none',
		baseAttack: 0,
		baseHeal: 0,
		baseHit: 0,
		baseCrit: 0,
		baseOvercome: 0,
		baseAttackPlus: 0,
		baseHealPlus: 0,
		baseCritPlus: 0,
		baseCritEffPlus: 0,
		baseOvercomePlus: 0,
		baseHPlus: 0,
		baseBodyPlus: 0,
		basePhysicsShield: 0,
		baseMagicShield: 0,
		basePhysicsShieldPlus: 0,
		baseMagicShieldPlus: 0,
		baseDodge: 0,
		baseDodgePlus: 0,
		baseParryBasePlus: 0,
		baseParryValuePlus: 0,
		baseParryBase: 0,
		baseParryValue: 0,
		tixingOption: [0, 0, 0, 0]
	};
	var path = $location.absUrl();
	var pathHash = path.split('#');
	var pathArr = pathHash[0].split('/');
	// 获取门派信息
	angular.forEach(menpaiList[pathArr[pathArr.length - 2]], function(value, key) {
		$rootScope.menpai[key] = value;
	});
	for (var i = 0; i < 4; i++) {
		if ($rootScope.menpai.tixingOption[i] == 1) break;
	}
	$rootScope.role = {
		tixing: tixingOptions[i].name,
		body: tixingOptions[i].body,
		spunk: tixingOptions[i].spunk,
		spirit: tixingOptions[i].spirit,
		strength: tixingOptions[i].strength,
		agility: tixingOptions[i].agility
	};
	if ($rootScope.menpai.name == 'cangjian') positions.push('c_primaryWeapon');
	if ($rootScope.menpai.type == 'agility' || $rootScope.menpai.type == 'strength') attributeMap.attack = 'physicsAttack';
	$scope.typeParseMap = typeParseMap;
	for (var i = 0; i < positions.length; i++) {
		$rootScope.equips[positions[i]] = Equip.createNew();
		$rootScope.equips[positions[i]].type = positions[i];
		$rootScope.equips[positions[i]].typeParse = typeParseMap[positions[i]];

		$rootScope.equipLists[positions[i]] = {};
		$rootScope.equipLists[positions[i]].type = positions[i];
		$rootScope.equipLists[positions[i]].typeParse = typeParseMap[positions[i]];
		$rootScope.equipLists[positions[i]].isCached = false;
		$rootScope.equipLists[positions[i]].setAs = {name: '选择装备'};

		$rootScope.enhanceLists[positions[i]] = {};
		$rootScope.enhanceLists[positions[i]].type = positions[i];
		$rootScope.enhanceLists[positions[i]].typeParse = typeParseMap[positions[i]];
		$rootScope.enhanceLists[positions[i]].isCached = false;
		$rootScope.enhanceLists[positions[i]].setAs = {id: '0', name: '选择附魔'};
	}

	$rootScope.xilianColorList = ['', '#99D198', '#97D195', '#7DE5CD', '#80E7D0', '#77A7EC', '#6890C8', '#C970D7', '#C570D4', '#BF8650'];
	$rootScope.xilianLevelDesc = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
	$rootScope.focus = '0_hat';
	$rootScope.setController = CollectionController;
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
	$rootScope.attributeStone = [angular.copy(attrStone), angular.copy(attrStone)];
	$rootScope.attributeStoneSelected = 0;
	$rootScope.zhongjian = false;
	var stoneList = [
		{isLoad: false, attr: [], setAs: '选择第一属性', isSet: false},
		{isLoad: false, attr: [], setAs: '选择第二属性', isSet: false},
		{isLoad: false, attr: [], setAs: '选择第三属性', isSet: false},
		{isLoad: false, attr: [], setAs: '选择等级', isSet: false}
	];
	$rootScope.attributeStoneLists = [angular.copy(stoneList), angular.copy(stoneList)];
	$rootScope.saveList = {
		isLoad: false,
		list: []
	};
	$rootScope.buffController = {};
	$rootScope.buffController.buff = [];
	$rootScope.buffController.activeBuff = {};
	$rootScope.buffController.attributeStone = {
		percentPlus: {},
		baseMinus: {}
	};
	$rootScope.buffController.checkActive = function(buffId) {
		return $rootScope.buffController.activeBuff[buffId].isCheck;
	};
	$rootScope.buffController.registerBuff = function(buffObj) {
		var newBuff = Buff.createNew(buffObj);
		var indexNumber = $rootScope.buffController.buff.push(newBuff) - 1;
		$rootScope.buffController.activeBuff[newBuff.id] = {isCheck: false, index: indexNumber};
	};
	$rootScope.results = {
		'score': 0,
		'body': 0,
		'spirit': 0,
		'strength': 0,
		'agility': 0,
		'spunk': 0,
		'physicsShield': 0,
		'magicShield': 0,
		'dodge': 0,
		'parryBase': 0,
		'parryValue': 0,
		'toughness': 0,
		'basicAttack': 0,
		'attack': 0,
		'heal': 0,
		'crit': 0,
		'critEffect': 0,
		'overcome': 0,
		'acce': 0,
		'hit': 0,
		'strain': 0,
		'huajing': 0,
		'threat': 0,
		'life': 0,
		'acceLevel': 0
	};
}]);
