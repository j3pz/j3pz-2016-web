/*
 * @require /components/config/config.js
 */
app.controller('footerCtrl', ['$scope', '$http', function($scope, $rootScope, $http, $sce, toastr) {
    $scope.dbVersion = '未知';
    $http.get(config.apiBase + 'update/dbVersion')
        .success(function(response) {
            $scope.dbVersion = response.data;
        });
}]);

