/* @require /components/config/config.js */
app.controller('LoginCtrl', ['$rootScope','$scope','$httpParamSerializerJQLike','toastr','$http','$interval', function($rootScope,$scope,$httpParamSerializerJQLike,toastr,$http,$interval){
	$scope.login = function(){
		$rootScope.user.isLoading = true;
		$http({
			url: config.apiBase+'loginCertificate.php',
			method: 'POST',
			data: $httpParamSerializerJQLike({email:$rootScope.user.mail, pswd:$rootScope.user.password, cookie:$rootScope.user.remember}),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		})
		.success(function(response) {
			if(response.err||!response.isLogin){
				toastr.error("登录失败, " + response.errReason);
			}else{
				$scope.loginSuccess(response);
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
		if($rootScope.isPz){
			$("#quality-range").slider({range: true, min: 450, max: 1100, values: $rootScope.equipListfilter.range, step:5,
				slide: function (event, ui) {
					$rootScope.equipListfilter.range[0] = ui.values[0];
					$rootScope.equipListfilter.range[1] = ui.values[1];
					$rootScope.$apply();
				}
			});
			$rootScope.equipListfilter.range = response.preference.quality;
			$rootScope.embedLevel = response.preference.magicStoneLevel;
			$rootScope.strengthenLevel = response.preference.strengthen;
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