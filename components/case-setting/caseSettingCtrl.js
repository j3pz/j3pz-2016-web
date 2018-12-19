/* @require /components/config/config.js */
app.controller('CaseSettingsController', ['$scope', '$rootScope', 'toastr', '$http', function($scope, $rootScope, toastr, $http) {
	$scope.init = function() {
		var menpai = $rootScope.menpai.name;
		for (var i = 0; i < tixingOptions.length; i++) {
			tixingOptions[i].isAvailable = $rootScope.menpai.tixingOption[i] == 1;
			tixingOptions[i].isSelected = $rootScope.role.tixing == tixingOptions[i].name;
		}
	};
	$scope.setTixing = function(option) {
		$rootScope.role = {
			tixing: option.name,
			body: option.body,
			spunk: option.spunk,
			spirit: option.spirit,
			strength: option.strength,
			agility: option.agility
		};
		for (var i = 0; i < tixingOptions.length; i++) {
			tixingOptions[i].isSelected = option.name == tixingOptions[i].name;
		}
	};
	$scope.init();
	$scope.$on('setTixing', function(e, role) {
		$scope.setTixing(role);
	});
}]);
