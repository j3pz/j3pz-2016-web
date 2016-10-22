/* @require /components/config/config.js */
app.controller('LoginCtrl', ['$rootScope', '$scope', 'toastr', '$http', '$interval', function($rootScope, $scope, toastr, $http, $interval) {
	$scope.login = function() {
		$rootScope.user.isLoading = true;
		$http({
			url: config.apiBase + 'user/auth',
			method: 'POST',
			data: {user: $rootScope.user.mail, pass: $rootScope.user.password},
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.success(function(response) {
			$scope.loginSuccess(response.data);
		})
		.error(function(response) {
			toastr.error('登录失败, ' + response.errors[0].detail);
		})
		.finally(function() {
			$('#loginModal').modal('hide');
		});
	};

	$scope.getJwtInfo = function() {
		var jwt = localStorage.getItem('token');
		if (jwt) {
			var payload = atob(jwt.split('.')[1]);
			$rootScope.jwt = JSON.parse(payload);
			if (!$rootScope.jwt.act) {
				toastr.warning('该账户尚未验证邮箱，请尽快到右上角个人中心激活账户以使用全部功能');
			}
		}
	};

	$scope.loginSuccess = function(response) {
		$rootScope.isLogin = true;
		$rootScope.user.name = response.name;
		$rootScope.user.maxSave = response.maxSave;
		$rootScope.user.saved = response.cases.length;
		$rootScope.user.picture = response.picture;
		localStorage.setItem('token', response.token);
		if ($rootScope.isPz) {
			$rootScope.equipListfilter.range = [Number(response.prefer.quality[0]), Number(response.prefer.quality[1])];
			$rootScope.embedLevel = response.prefer.magicStoneLevel;
			$rootScope.strengthenLevel = response.prefer.strengthen;
			$rootScope.saveList.isLoad = false;
			$rootScope.saveList.list = [];
			angular.forEach(response.cases, function(value, key) {
				var savedCase = {
					name: value.name,
					id: value.id
				};
				this.push(savedCase);
			}, $rootScope.saveList.list);
			$rootScope.saveList.isLoad = true;
		}
		$scope.getJwtInfo();
	};
	$scope.weiboLogin = function() {
		WB2.login(function() {
			$('#loginModal').modal('hide');
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
			data: {email: $rootScope.user.mail},
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
