/* @require /components/config/config.js */
app.controller('EnhanceController', ['$scope', '$rootScope', 'toastr', '$http', function($scope, $rootScope, toastr, $http) {
	$scope.ctrl = {};
	$scope.ctrl.enhanceId = 0;
	$scope.init = function() {
		$scope.ctrl.v = $rootScope.equips[$rootScope.focus].jinglian.strengthen;
		$scope.ctrl.maxV = $rootScope.equips[$rootScope.focus].data.strengthen;
	};
	$scope.ok = function() {
		$scope.ctrl.enhanceId = $rootScope.enhanceLists[$rootScope.focus].setAs.id;
		$scope.$emit('setEnhance', $scope.ctrl.enhanceId);
	};
	$scope.setStrengthen = function(x, isClick) {
		if (isClick) $scope.ctrl.v = x;
		$rootScope.equips[$rootScope.focus].setStrengthen(x);
	};
	$scope.resetStrengthen = function() {
		$scope.setStrengthen($scope.ctrl.v, true);
	};
	$scope.applyAllStrengthen = function() {
		var strengthenLevel = $scope.ctrl.v;
		for (var i = 0; i < equipId_focusId_map.length; i++) {
			var focusId = equipId_focusId_map[i];
			if ($rootScope.equips[focusId]) {
				$rootScope.equips[focusId].setStrengthen(strengthenLevel);
			}
		}
	};
	$scope.getEnhanceList = function() {
		if (!$rootScope.enhanceLists[$rootScope.focus].isCached) {
			var menpai = $rootScope.menpai.name;
			var focus = $rootScope.focus.split('_')[0];
			var focusId = $rootScope.focus;
			$http.get(config.apiBase + 'enhance?position=' + focus + '&school=' + menpai)
			.success(function(response) {
				response = response.data;
				$rootScope.enhanceLists[focusId].list = [];
				angular.forEach(response, function(value, key) {
					$rootScope.enhanceLists[focusId].list.push(value);
				});
				$rootScope.enhanceLists[focusId].isCached = true;
			})
			.error(function(response) {
				toastr.error('载入附魔列表失败，' + response.errors[0].detail);
			});
		}
	};
	$scope.$on('openEnhance', function(e) {
		$scope.getEnhanceList();
		$scope.init();
	});
}]);

app.directive('convertToNumber', function() {
	return {
		require: 'ngModel',
		link: function(scope, element, attrs, ngModel) {
			ngModel.$parsers.push(function(val) {
				return parseInt(val, 10);
			});
			ngModel.$formatters.push(function(val) {
				return '' + val;
			});
		}
	};
});
