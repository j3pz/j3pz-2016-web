app.controller('CasePreviewController', ['$rootScope', '$scope', '$http', 'toastr', function($rootScope, $scope, $http, toastr) {
	$scope.loadImg = function() {
		$scope.toSave = $rootScope.toSave;
		$scope.imgUrl = '';
		$scope.loaded = false;
		var token = localStorage.getItem('token');
		$http({
			url: config.apiBase + 'share',
			data: $scope.toSave,
			method: 'POST',
			headers: { 'Authorization': 'Bearer ' + token }
		})
		.success(function(response) {
			$scope.imgUrl = response.data;
			$scope.loaded = true;
		})
		.error(function(response) {
			toastr.error('载入图片失败，' + response.errors[0].detail);
		});
	};

	$scope.getOriginal = function() {
		// $scope.imgUrl = $scope.imgUrl.replace('preview', 'original');
	};

	$('#casePreviewModal').on('shown.bs.modal', function(e) {
		$scope.loadImg();
	});
}]);
