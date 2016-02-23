var app = angular.module('J3pz', ['toastr','ui.select','ngDraggable','angular-loading-bar','cfp.hotkeys']);
app.config(['toastrConfig',function(toastrConfig) {
	angular.extend(toastrConfig, {
		maxOpened: 5,
		positionClass: 'toast-bottom-right',
		timeOut: 3000
	});
}]);
app.config(['uiSelectConfig',function(uiSelectConfig) {
	uiSelectConfig.theme = 'bootstrap';
}]);