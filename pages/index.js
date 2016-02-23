var app = angular.module('J3pz', ['toastr'])
.config(['toastrConfig',function(toastrConfig) {
	angular.extend(toastrConfig, {
		maxOpened: 5,    
		positionClass: 'toast-bottom-right',
		timeOut: 3000
	});
}]);