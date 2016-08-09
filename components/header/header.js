/* @require /components/config/config.js */
app.controller('HeaderCtrl', ['$scope', '$http', 'toastr', '$rootScope', '$httpParamSerializerJQLike', '$sce', function($scope, $http, toastr, $rootScope, $httpParamSerializerJQLike, $sce) {
	$rootScope.isLogin = false;
	$rootScope.user = {
		mail: '',
		password: '',
		name: '',
		maxSave: 0
	};

	function getUserInfo(token) {
		$http.get(config.apiBase + 'user', {
			headers: {'Authorization': 'Bearer ' + token}
		})
		.success(function(response) {
			if (response.errors) {
				console.log(response.errors[0].detail);
			} else {
				response = response.data;
				$rootScope.isLogin = true;
				$rootScope.user.name = response.name;
				$rootScope.user.maxSave = response.maxSave;
				$rootScope.user.saved = response.cases.length;
				if ($rootScope.isPz) {
					$rootScope.equipListfilter.range = [Number(response.prefer.quality[0]), Number(response.prefer.quality[1])];
					$rootScope.embedLevel = response.prefer.magicStoneLevel;
					$rootScope.strengthenLevel = response.prefer.strengthen;
					$rootScope.saveList.isLoad = false;
					$rootScope.saveList.list = [];
					angular.forEach(response.cases, function(value, key) {
						var savedCase = {
							name: value.name,
							id: value.id,
							school: value.school
						};
						this.push(savedCase);
					}, $rootScope.saveList.list);
					$rootScope.saveList.isLoad = true;
				}
			}
		});
	}

	var token = localStorage.getItem('token');
	if (!!token) {
		getUserInfo(token);
	}

	$scope.checkUpdate = function(forceOpen) {
		$http.get(config.apiBase + 'update')
		.success(function(response) {
			if (response.errors) {
				console.log(response.errors[0].detail);
			}
			if (Number(response.data.version) > Number(localStorage.edition) || !localStorage.edition || forceOpen) {
				$rootScope.updateDesc = response.data.desc;
				$('#updateModal').modal();
			}
			try {localStorage.edition = response.data.version;} catch (e) {console.error(e);}
		});
	};
	$scope.getUpdateDesc = function(text) {
		return $sce.trustAsHtml(text);
	};
	$scope.checkUpdate();

	$scope.logout = function() {
		// $http.get(config.apiBase+'logout.php');
		$rootScope.isLogin = false;
		localStorage.removeItem('token');
		$rootScope.user = {
			mail: '',
			password: '',
			name: ''
		};
	};
	$scope.forgetPass = function() {
		var modalInstance = $modal.open({
			animation: true,
			templateUrl: 'templates/reset.html',
			controller: 'ModalInstanceCtrl'
		});

		modalInstance.result.then(function(email) {
			$http({
				url: config.apiBase + 'sendMail.php',
				method: 'POST',
				data: $httpParamSerializerJQLike({mail: email}),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			})
			.success(function(response) {
				if (response == 'noreg') {
					toastr.warning('该邮箱没有注册');
				} else {
					toastr.success(response);
				}
			});
		}, function() {
			console.log('Reset Password Cancelled');
		});
	};
}]);
