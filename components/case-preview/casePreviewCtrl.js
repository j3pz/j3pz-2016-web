app.controller('CasePreviewController',['$rootScope','$scope','$http','toastr',function($rootScope,$scope,$http,toastr){
	$scope.loadImg = function(){
		$scope.toSave = $rootScope.toSave;
		$scope.imgUrl = "";
		$scope.loaded = false;
		// $http.post(config.apiBase+'getImage.php',$scope.toSave)
		// .success(function(response){
		// 	if(response.err){
		// 		toastr.error(response.errReason);
		// 	}else{
		// 		$scope.imgUrl = response.url;
		// 		$scope.loaded = true;
		// 	}
		// })
		// .error(function(){
		// 	toastr.error("载入图片失败");
		// });
	};
	$("#casePreviewModal").on('shown.bs.modal',function(e){
		$scope.loadImg();
	});
}]);