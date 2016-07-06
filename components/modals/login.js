/* @require /components/config/config.js */
app.controller('LoginCtrl', ['$rootScope','$scope','toastr','$http','$interval', function($rootScope,$scope,toastr,$http,$interval){
	$scope.login = function(){
		$rootScope.user.isLoading = true;
		$http({
			url: config.apiBase+'user/auth',
			method: 'POST',
			data: {user:$rootScope.user.mail, pass:$rootScope.user.password},
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.success(function(response) {
			if(response.errors){
				toastr.error("登录失败, " + response.errors[0].detail);
			}else{
				$scope.loginSuccess(response.data);
			}
		})
		.error(function(response) {
			toastr.error("连接失败");
		})
		.finally(function(){
			$("#loginModal").modal('hide');
		});
	};

	$scope.loginSuccess = function(response){
		$rootScope.isLogin = true;
		$rootScope.user.name = response.name;
		localStorage.setItem("token",response.token);
		if($rootScope.isPz){
			$rootScope.equipListfilter.range = response.prefer.quality;
			$rootScope.embedLevel = response.prefer.magicStoneLevel;
			$rootScope.strengthenLevel = response.prefer.strengthen;
			$rootScope.saveList.isLoad = false;
			$scope.$emit("saveCase");
		}
	}
	$scope.weiboLogin = function(){
		WB2.login(function() {
			$('#loginModal').modal('hide');
			$scope.weiboOauthData = angular.copy(WB2.oauthData);
			$interval.cancel($scope.weiboStatusReadyCheck);
			if(WB2.checkLogin()){
				$http.get(config.apiBase+'weiboBind.php?type=login')
				.success(function(response){
					if(response.isLogin){
						$scope.loginSuccess(response);
					}else if(response.needBind){
						// 打开绑定页面
					}
				})
				.error(function(response) {
					toastr.error("授权失败或错误");
				});
			}
		});
	};
	$scope.weiboOauthData = {};
}]);