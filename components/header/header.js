/* @require /components/config/config.js 
   @require /js/libs/js-cookie/js.cookie-2.1.3.min.js
*/
app.controller('HeaderCtrl', ['$scope', '$http', 'toastr', '$rootScope', '$sce', function($scope, $http, toastr, $rootScope, $sce) {
	$rootScope.isLogin = false;
	$rootScope.user = {
		mail: '',
		password: '',
		name: '',
		maxSave: 0
	};

	$scope.getJwtInfo = function(){
		var jwt = localStorage.getItem('token');
		if(jwt){
			var payload = atob(jwt.split('.')[1]);
			$rootScope.jwt = JSON.parse(payload);
		}
	}

	function getUserInfo(token) {
		$http.get(config.apiBase + 'user', {
			headers: {'Authorization': 'Bearer ' + token}
		})
		.success(function(response) {
			response = response.data;
			$rootScope.isLogin = true;
			$rootScope.user.name = response.name;
			$rootScope.user.maxSave = response.maxSave;
			$rootScope.user.saved = response.cases.length;
			$rootScope.user.picture = response.picture;
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
			$scope.getJwtInfo();
		});
	}

	var token = localStorage.getItem('token');
	var cookie = Cookies.get('token');
	if (!token || !cookie) {
		localStorage.removeItem('token');
		Cookies.remove('token');
	} else {
		getUserInfo(token);
	}

	$scope.checkUpdate = function(forceOpen) {
		$http.get(config.apiBase + 'update')
		.success(function(response) {
			if (Number(response.data.edition) > Number(localStorage.edition) || !localStorage.edition || forceOpen) {
				$rootScope.updateDesc = response.data.desc;
				$('#updateModal').modal();
			}
			try {localStorage.edition = response.data.edition;} catch (e) {console.error(e);}
		});
	};
	$scope.getUpdateDesc = function(text) {
		return $sce.trustAsHtml(text);
	};
	$scope.checkUpdate();

	$scope.logout = function() {
		$rootScope.isLogin = false;
		localStorage.removeItem('token');
		Cookies.remove('token');
		$rootScope.user = {
			mail: '',
			password: '',
			name: ''
		};
	};
}]);
