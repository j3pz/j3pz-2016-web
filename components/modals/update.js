/* @require /components/config/config.js */
app.controller('UpdateCtrl', ['$scope', '$sce', function($scope, $sce) {
	$scope.getUpdateDesc = function(text) {
		return $sce.trustAsHtml(text);
	};
}]);
