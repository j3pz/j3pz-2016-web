/* @require /components/config/config.js */
app.controller('LoginCtrl', ['$rootScope','$scope','$httpParamSerializerJQLike','toastr','$http','$interval', function($rootScope,$scope,$httpParamSerializerJQLike,toastr,$htt,$interval){
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
		})
		.error(function(response) {
			toastr.error("连接失败");
		})
		.finally(function(){
			$("#loginModal").modal('hide');
		});
	};
	$scope.weiboLogin = function(){
		WB2.login(function() {
			console.log(1);
		});
	};
	$scope.weiboOauthData = {};
	angular.element(document).ready(function () {
		$scope.weiboStatusReadyCheck = $interval(function(){
			if(!!WB2.oauthData){
				$scope.weiboOauthData = angular.copy(WB2.oauthData);
				$interval.cancel($scope.weiboStatusReadyCheck);
				if(WB2.checkLogin()){
					WB2.anyWhere(function (W) {
						W.parseCMD("/users/show.json", function (oResult, bStatus) {
							if (!!bStatus) {
								console.log(oResult);
							}else{
								alert("授权失败或错误");
							}
						}, {
							uid : $scope.weiboOauthData.uid
						}, {
							method: 'GET',
							cache_time: 0
						});
					});
				}
			}
		},1000);
	});
}]);