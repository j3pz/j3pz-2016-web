/* @require /components/config/config.js */
app.controller('HeaderCtrl', ['$scope','$http','toastr','$rootScope','$httpParamSerializerJQLike','$sce', function($scope,$http,toastr,$rootScope,$httpParamSerializerJQLike,$sce){
	$rootScope.isLogin = false;
	$rootScope.user = {
		mail:"",
		password:"",
		name:"",
		token:""
	};

	function getUserInfo(token){
		$http.get(config.apiBase+'auth',{
			headers:{'Authorization': 'Bearer '+token}
		})
		.success(function(response) {
			if(response.errors){
				console.log(response.errors[0].detail);
			}else{
				response = response.data;
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
					$rootScope.equipListfilter.range = response.prefer.quality;
					$rootScope.embedLevel = response.prefer.magicStoneLevel;
					$rootScope.strengthenLevel = response.prefer.strengthen;
					$rootScope.saveList.isLoad = false;
					$scope.$emit("saveCase");
				}
			}
		});
	}

	var token = localStorage.getItem('token');
	if(!!token){
		getUserInfo(token);
	}
		
	$scope.checkUpdate = function(forceOpen){
		$http.get(config.apiBase+'update')
		.success(function(response){
			if(response.errors){
				console.log(response.errors[0].detail);
			}
			if(Number(response.data.version) > Number(localStorage.edition)||!localStorage.edition||forceOpen){
				$rootScope.updateDesc = response.data.desc;
				$("#updateModal").modal();
			}
			try{localStorage.edition=response.data.version;}catch(e){console.error(e);}
		});
	};
	$scope.getUpdateDesc = function(text){
		return $sce.trustAsHtml(text);
	};
	$scope.checkUpdate();
	
	$scope.logout = function(){
		$http.get(config.apiBase+'logout.php');
		$rootScope.isLogin = false;
		$rootScope.user = {
			mail:"",
			password:"",
			name:""
		};
	};
	$scope.forgetPass = function(){
		var modalInstance = $modal.open({
			animation: true,
			templateUrl: 'templates/reset.html',
			controller: 'ModalInstanceCtrl',
		});

		modalInstance.result.then(function(email) {
			$http({
				url: config.apiBase+'sendMail.php',
				method: 'POST',
				data: $httpParamSerializerJQLike({mail:email}),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			})
			.success(function(response){ 
				if(response=="noreg"){ 
					toastr.warning('该邮箱没有注册');
				}else{ 
					toastr.success(response); 
				}
			}); 
		},function() {
			console.log('Reset Password Cancelled');
		});
	};
}]);