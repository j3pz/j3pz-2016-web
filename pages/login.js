var app = angular.module('J3Login', ['toastr']);

/* @require /components/config/config.js */
app.controller('LoginCtrl', ['$scope', 'toastr', '$http', '$interval', '$location', function($scope, toastr, $http, $interval, $location) {
	$scope.login = function() {
		toastr.info('体服版不支持登录');
		return;
		$http({
			url: config.apiBase + 'user/auth',
			method: 'POST',
			data: {user: $scope.user.mail, pass: $scope.user.password},
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.success(function(response) {
			toastr.info('登录成功，正在跳转');
			$scope.loginSuccess(response.data);
		})
		.error(function(response) {
			toastr.error('登录失败' + response.errors[0].detail);
		});
	};

	$scope.loginSuccess = function(response) {
		localStorage.setItem('token', response.token);
		var a = $location.search();
		if(a.redirect) {
			setTimeout(function(){
				window.location.href = decodeURI(a.redirect);
			}, 3000);
		} else {
			setTimeout(function(){
				window.location.href = '/';
			}, 3000);
		}
	};
	$scope.weiboLogin = function() {
		WB2.login(function() {
			$scope.weiboOauthData = angular.copy(WB2.oauthData);
			$interval.cancel($scope.weiboStatusReadyCheck);
			if (WB2.checkLogin()) {
				$http.get(config.apiBase + 'weiboBind.php?type=login')
				.success(function(response) {
					if (response.isLogin) {
						$scope.loginSuccess(response);
					} else if (response.needBind) {
						// 打开绑定页面
					}
				})
				.error(function(response) {
					toastr.error('授权失败或错误');
				});
			}
		});
	};
	$scope.weiboOauthData = {};

	$scope.notReset = true;

	$scope.resetPass = function() {
		$http({
			url: config.apiBase + 'user/reset',
			method: 'POST',
			data: {email: $scope.user.mail},
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.success(function(response) {
			toastr.info('邮件发送成功');
		})
		.error(function(response) {
			toastr.error(response.errors[0].detail);
		});
	};
}]);
