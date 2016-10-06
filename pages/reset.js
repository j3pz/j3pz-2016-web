var app = angular.module('J3pzReset', ['toastr']);
app.config(['$locationProvider', function($locationProvider) {
	$locationProvider.html5Mode(true);
}]);

app.controller('ResetCtrl', ['$scope', '$http', 'toastr', '$location',
	function($scope, $http, toastr, $location) {
	$scope.reset = function() {
		var resetInfo = $location.search();
		$http.post(config.apiBase + 'user/resetPassword', {
			pass: $scope.newpass,
			token: resetInfo.t,
			user: resetInfo.u
		})
		.success(function(response){
			window.location.href = '/';
		})
		.error(function(response){
			toastr.error(response.errors[0].detail);
		});
	};
}]);
