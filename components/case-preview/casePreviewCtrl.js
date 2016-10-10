app.controller('CasePreviewController', ['$rootScope', '$scope', '$http', 'toastr', function($rootScope, $scope, $http, toastr) {
	$scope.loadImg = function() {
		$scope.toSave = $rootScope.toSave;
		$scope.imgUrl = '';
		$scope.loaded = false;
		$http.post(config.apiBase + 'share', $scope.toSave)
		.success(function(response) {
			$scope.imgUrl = response.data;
			$scope.loaded = true;
		})
		.error(function(response) {
			toastr.error('载入图片失败，' + response.errors[0].detail);
		});
	};
	$('#casePreviewModal').on('shown.bs.modal', function(e) {
		$scope.loadImg();
	});
}]);
