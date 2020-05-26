var app = angular.module('J3Homeland', ['ui.bootstrap', 'toastr'])
.config(['toastrConfig',function(toastrConfig) {
	angular.extend(toastrConfig, {
		maxOpened: 5,
		positionClass: 'toast-bottom-right',
		timeOut: 3000
	});
}]);

app.controller('FurnitureCtrl', ['$scope', '$http', 'toastr',  function($scope, $http, toastr) {
    $scope.data = [];
    $scope.fetch = function () {
        $http.get('https://api.j3pz.com/furniture')
            .success(function(response) {
                console.log(response);
                $scope.data = response;
            });
    }

    $scope.categorys = [
        { key: 10000, value: '建筑' },
    ];
    $scope.category = 10000;
}]);
