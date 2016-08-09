app.controller('CasePreviewController', ['$rootScope', '$scope', '$http', 'toastr', function($rootScope, $scope, $http, toastr) {
	$scope.loadImg = function() {
		$scope.toSave = $rootScope.toSave;
		$scope.imgUrl = '';
		$scope.loaded = false;
		$http.post(config.apiBase + 'share', $scope.toSave)
		.success(function(response) {
			if (response.errors) {
				toastr.error(response.errors[0].detail);
			} else {
				$scope.imgUrl = response.data;
				$scope.loaded = true;
			}
		})
		.error(function() {
			toastr.error('载入图片失败');
		});
	};
	$('#casePreviewModal').on('shown.bs.modal', function(e) {
		$scope.loadImg();
	});
}]);
