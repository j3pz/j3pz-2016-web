app.controller('ResultsShowController', ['$scope', '$rootScope', 'toastr', function($scope, $rootScope, toastr) {
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
		overcome: '破防',
		overcomeRate: '破防',
		hit: '命中',
		acce: '加速',
		acceLevel: '加速',
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

	$scope.copyResult = function(format) {
		var keys = $scope.list_1.concat($scope.list_2).concat($scope.list_3).map(function(key) {
			if (key == 'acce') return 'acceLevel';
			if (key == 'overcomeRate') return 'overcome';
			return key;
		});
		var values = keys.map(function(key) {
			return $scope.result[key] || 0;
		});
		var result = '';
		if (format == 'csv') {
			result += keys.map(function(key) {
				return $scope.descList[key];
			}).join(',');
			result += '\n';
			result += values.join(',');
		} else if (format == 'json') {
			var resultObj = keys.map(function(key) {
				return [key, $scope.descList[key]];
			}).reduce(function(acc, cur) {
				var key = cur[0];
				var desc = cur[1];
				acc[desc] = '' + ($scope.result[key] || 0);
				return acc;
			}, {});
			result = JSON.stringify(resultObj);
		} else {
			toastr.error('不支持的格式');
		}
		var copyzone = document.getElementById('copyzone');
		copyzone.innerText = result;
		var range = document.createRange();
		range.selectNodeContents(copyzone);
		var selection = window.getSelection();
		selection.removeAllRanges();
		selection.addRange(range);
		try {
			document.execCommand('copy', false, null);
			toastr.info('复制成功');
		} catch (e) {
			toastr.info('复制失败');
		}
	}
}]);
