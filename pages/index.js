var app = angular.module('J3pz', ['toastr'])
.config(['toastrConfig', function(toastrConfig) {
	angular.extend(toastrConfig, {
		maxOpened: 5,
		positionClass: 'toast-bottom-right',
		timeOut: 3000
	});
}]);

$(document).ready(function() {
  $('#custom-ad-0').click(function() {
    console.log(0);
    ga('send', 'event', 'Ad', 'click', 'banner', 1);
  });
  $('#custom-ad-1').click(function() {
    console.log(1);
    ga('send', 'event', 'Ad', 'click', 'link', 1);
  });
});