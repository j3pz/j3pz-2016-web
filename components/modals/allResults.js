app.controller('ResultsShowController', ['$scope', '$rootScope', function($scope, $rootScope) {
	$scope.result = $rootScope.results;
	$scope.descList = {
		body: '体质',
		spirit: '根骨',
		spunk: '元气',
		strength: '力道',
		agility: '身法',
		physicsShield: '外防',
		magicShield: '内防',
		dodge: '闪避',
		parryBase: '招架',
		parryValue: '拆招',
		toughness: '御劲',
		attack: '攻击',
		heal: '治疗',
		crit: '会心',
		critEffect: '会效',
		overcomeRate: '破防',
		hit: '命中',
		acce: '加速',
		strain: '无双',
		huajing: '化劲',
		threat: '威胁',
		life: '气血',
		basicAttack: '基础攻击',
		basicHeal: '基础治疗',
		score: '装分'
	};
	$scope.list_1 = ['life', 'body', 'spirit', 'spunk', 'strength', 'agility', 'basicAttack', 'attack'];
	$scope.list_2 = ['crit', 'critEffect', 'hit', 'acce', 'overcomeRate', 'strain', 'basicHeal', 'heal'];
	$scope.list_3 = ['physicsShield', 'magicShield', 'dodge', 'parryBase', 'parryValue', 'toughness', 'huajing', 'score'];
}]);
