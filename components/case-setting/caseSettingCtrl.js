/* @require /components/config/config.js */
app.controller('CaseSettingsController',['$scope','$rootScope','toastr','$http',function($scope,$rootScope,toastr,$http){
	$scope.tixingOptions = [
		{name:"成男", body:33, spunk:32, spirit:33, strength:32, agility:33, isAvailable:true, isSelected:false},
		{name:"成女", body:33, spunk:32, spirit:33, strength:32, agility:33, isAvailable:true, isSelected:false},
		{name:"萝莉", body:33, spunk:32, spirit:33, strength:32, agility:33, isAvailable:true, isSelected:false},
		{name:"正太", body:33, spunk:32, spirit:33, strength:32, agility:33, isAvailable:true, isSelected:false}
	];
	$scope.init = function(){
		var menpai = $rootScope.menpai.name;
		for (var i = 0; i < $scope.tixingOptions.length; i++) {
			$scope.tixingOptions[i].isAvailable = $rootScope.menpai.tixingOption[i]==1;
			$scope.tixingOptions[i].isSelected = $rootScope.role.tixing == $scope.tixingOptions[i].name;
		}
	};
	$scope.setTixing = function(option){
		$rootScope.role = {
			tixing: option.name,
			body: option.body,
			spunk: option.spunk,
			spirit: option.spirit,
			strength: option.strength,
			agility: option.agility
		};
		for (var i = 0; i < $scope.tixingOptions.length; i++) {
			$scope.tixingOptions[i].isSelected = option.name==$scope.tixingOptions[i].name;
		}
	};
	$scope.init();
	$scope.$on("setTixing",function(e,role){
		$scope.setTixing(role);
	});
}]);
