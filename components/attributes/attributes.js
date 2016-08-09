/* @require /components/config/config.js */
app.controller('ResultCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
	var menpai = $rootScope.menpai;
	var basicAtti = {name: '', value: ''};
	var pre = ['', ''];
	if (menpai.type == 'spirit') {// 根骨门派计算
		basicAtti = {name: '根骨', value: 'spirit'};
		pre = ['内功', '内功'];
	} else if (menpai.type == 'strength') {// 力道门派计算
		basicAtti = {name: '力道', value: 'strength'};
		pre = ['外功', '外功'];
	} else if (menpai.type == 'agility') {// 身法门派计算
		basicAtti = {name: '身法', value: 'agility'};
		pre = ['外功', '外功'];
	} else if (menpai.type == 'spunk') {// 元气门派计算
		basicAtti = {name: '元气', value: 'spunk'};
		pre = ['内功', '内功'];
		if (menpai.name == 'tianluo') {
			pre = ['内功', '外功'];
		}
	}
	$scope.attriUp = [
		{ name: '最大气血', 	value: 'life' },
		{ name: basicAtti.name, value: basicAtti.value },
		{ name: '基础攻击', 	value: 'basicAttack' },
		{ name: '面板攻击', 	value: 'attack' },
		{ name: pre[1] + '会心', 	value: 'crit' },
		{ name: pre[1] + '会效', 	value: 'critEffect' },
		{ name: pre[1] + '命中', 	value: 'hit' },
		{ name: '急速', 	value: 'acce' }
	];
	$scope.attriDown = [
		{ name: '无双', 	value: 'strain' },
		{ name: pre[0] + '破防', 	value: 'overcomeRate' },
		{ name: '内功防御', 	value: 'magicShield' },
		{ name: '外功防御', 	value: 'physicsShield' },
		{ name: '御劲', 	value: 'toughness' },
		{ name: '化劲', 	value: 'huajing' },
		{ name: '装备评分', 	value: 'score' },
		{ name: '方案总览',		value: 'preview'}
	];
	// if(menpai.name=="fenshan"){
	// 	$scope.attri.push({name: '招架', value: 'parryBase'});
	// 	$scope.attri.push({name: '拆招', value: 'parryValue'});
	// }
	if (menpai.type == 'hps') {
		$scope.attriUp = [
			{ name: '最大气血', 	value: 'life' },
			{ name: '根骨', 	value: 'spirit' },
			{ name: '基础治疗', 	value: 'basicHeal' },
			{ name: '面板治疗', 	value: 'heal' },
			{ name: '内功会心', 	value: 'crit' },
			{ name: '内功会效', 	value: 'critEffect' },
			{ name: '方案总览',		value: 'preview'}
		];
		$scope.attriDown = [
			{ name: '急速', 	value: 'acce' },
			{ name: '内功命中', 	value: 'hit' },
			{ name: '内功防御', 	value: 'magicShield' },
			{ name: '外功防御', 	value: 'physicsShield' },
			{ name: '御劲', 	value: 'toughness' },
			{ name: '化劲', 	value: 'huajing' },
			{ name: '装备评分', 	value: 'score' }
		];
	} else if (menpai.type == 't') {
		$scope.attriUp = [
			{ name: '最大气血', 	value: 'life' },
			{ name: '体质', 	value: 'body' },
			{ name: '外功防御', 	value: 'physicsShield' },
			{ name: '内功防御', 	value: 'magicShield' },
			{ name: '御劲', 	value: 'toughness' },
			{ name: '闪避', 	value: 'dodge' },
			{ name: '方案总览',		value: 'preview'}
		];
		$scope.attriDown = [
			{ name: '招架', 	value: 'parryBase' },
			{ name: '拆招', 	value: 'parryValue' },
			{ name: '急速', 	value: 'acce' },
			{ name: '命中', 	value: 'hit' },
			{ name: '无双', 	value: 'strain' },
			{ name: '装备评分', 	value: 'score' }
		];
	}
}]);
