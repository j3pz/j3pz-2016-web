var app = angular.module('J3Haste', ['toastr'])
.config(['toastrConfig',function(toastrConfig) {
	angular.extend(toastrConfig, {
		maxOpened: 5,
		positionClass: 'toast-bottom-right',
		timeOut: 3000
	});
}]);

app.controller('HasteCtrl', ['$scope', function($scope){
	$scope.oriTime = 1.5;
	$scope.x = 1;
	$scope.acceExtraList = {
		none: { name:'无', value: 0 },
		xinjian: { name: '心剑两忘', value: 31 * 3 },
		mengge: { name: '梦歌', value: 30 * 2 },
		zhenshang: { name: '枕上', value: 10 * 5 },
		miaojing: { name: '法镜', value: 21 * 5 },
		rufeng: { name: '如风', value: 82 },
		ningjue: { name: '凝绝', value: 51 },
	};
	$scope.results = [{newtime:$scope.oriTime,hastepercentage:0,hasteLevel:0}];

	$scope.extra = "none";
	$scope.$watch('extra',function(){
		$scope.calc();
	});
	$scope.calc = function(){
		$scope.results = [];
		var oriFrame = Math.ceil($scope.oriTime / 0.0625);
		var hastePercent = 0;
		var hastePercentLimit = 0;
		var level = 0;
		var lastTime = Number($scope.oriTime)+0.1;
		var hasteCof = 188.309;
		for (var i = 0; hastePercentLimit<25; i++) {
			var baseHaste = i/hasteCof*10.24;
			var extraHaste = $scope.acceExtraList[$scope.extra].value;
			var totalHaste = Math.floor(baseHaste) + Math.floor(extraHaste);
			var a = totalHaste/1024 + 1024;
			var nowFrame = Math.floor(oriFrame * 1024 / (totalHaste + 1024));
			hastePercent = i/hasteCof;
			hastePercentLimit = i/hasteCof + $scope.acceExtraList[$scope.extra].value/10.24;
			if(nowFrame<=oriFrame-level){
				var nowTime = nowFrame * 0.0625 * Number($scope.x);
				nowTime = nowTime.toFixed(2);
				if(nowTime==lastTime) continue;
				lastTime = nowTime;
				hastePercent = hastePercent.toFixed(2);
				var result = {newtime:nowTime,hastepercentage:hastePercent,hasteLevel:i};
				$scope.results.push(result);
				level++;
			}
		}
	};
	$scope.calc();
}]);
