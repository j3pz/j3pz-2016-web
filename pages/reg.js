/* @require /components/config/config.js */
var app = angular.module('J3Reg', ['ngMessages']);

app.controller('RegFormCtrl', ['$scope','$http','$httpParamSerializerJQLike','$window', function($scope,$http,$httpParamSerializerJQLike,$window){
	$scope.user = {
		username:'',
		email:'',
		password:'',
		confirmPassword:'',
		terms:false,
		noSamePw:false
	};
	function randomNumber(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
	$scope.random = [randomNumber(1, 20), randomNumber(1, 50)];
	$scope.clear = function(){
		$scope.user = {
			username:'',
			email:'',
			password:'',
			confirmPassword:'',
			captcha:'',
			terms:false,
			noSamePw:false
		};
		$scope.random = [randomNumber(1, 20), randomNumber(1, 50)];
	};
	$scope.validateMail = function(){
		var validateData = {email:$scope.user.email};
		$http.post(config.apiBase+'user/hasUser', validateData)
		.success(function(response){
			var registed = response.valid;
			$scope.regForm.email.$setValidity("registed", registed);
		});
		$scope.validatePassword();
	};
	$scope.validatePassword = function(){
		var usernamecheck = $scope.user.password!==$scope.user.username;
		$scope.regForm.password.$setValidity("usernamecheck", usernamecheck);
		var emailcheck = $scope.user.password!==$scope.user.email;
		$scope.regForm.password.$setValidity("emailcheck", emailcheck);
		$scope.confirmPassword();
	};
	$scope.confirmPassword = function() {
		var repeatnotmatch = $scope.user.password===$scope.user.confirmPassword;
		$scope.regForm.confirmPassword.$setValidity("repeatnotmatch", repeatnotmatch);
	};
	$scope.validateCaptcha = function(){
		var sum = parseInt($scope.random[0]) + parseInt($scope.random[1]);
		var captchaErr = $scope.user.captcha == sum;
		$scope.regForm.captcha.$setValidity("captchaErr", captchaErr);
	};
	$scope.reg = function(event){
		if($scope.regForm.$valid){
			var regData = {
				email:$scope.user.email,
				password:$scope.user.password,
				username:$scope.user.username
			};
			$http({
				url: 'api/reg.php',
				method: 'POST',
				data: $httpParamSerializerJQLike(regData),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}).success(function(response){
				if(response.err){
					toastr.error(response.errReason);
				}else{
					$window.location.href = 'index.html';
				}
			}).error(function(){
				toastr.error("注册失败，网络连接异常");
			});
		}
	};
	$scope.count = function(o){
		var t = typeof o;
		if(t == 'string'){
			return o.length;
		}else if(t == 'object'){
			var n = 0;
			for(var i in o){
				n++;
			}
			return n;
		}
		return false;
	};
}]);