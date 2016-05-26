/**
 * @require /css/theme/libs/icheck/square/_all.css
 * @require /js/libs/icheck/icheck.min.js
 */

app.directive('icheck', ['$timeout', '$parse', function($timeout, $parse) {
	return {
		require: 'ngModel',
		link: function($scope, element, $attrs, ngModel) {
			$scope.safeApply = function(fn){
				var phase = this.$root.$$phase;
				if(phase == '$apply' || phase == '$digest') {
					if(fn && (typeof(fn) === 'function')) {
						fn();
					}
				} else {
					this.$apply(fn);
				}
			};
			return $timeout(function() {
				var value;
				value = $attrs['value'];
				$scope.$watch($attrs['ngModel'], function(newValue){
					$(element).icheck('updated');
				})
				$scope.$watch($attrs['ngDisabled'], function(newValue){
					if(newValue==true) $(element).icheck('disabled');
					else if(newValue==false) $(element).icheck('enabled');
				})

				return $(element).icheck({
					checkboxClass: 'icheckbox_square-blue',
					radioClass: 'iradio_square-blue'

				}).on('ifChanged', function(event) {
					if ($(element).attr('type') === 'checkbox' && $attrs['ngModel']) {
						$scope.safeApply(function() {
							return ngModel.$setViewValue(event.target.checked);
						});
					}
					if ($(element).attr('type') === 'radio' && $attrs['ngModel']) {
						return $scope.safeApply(function() {
							return ngModel.$setViewValue(value);
						});
					}
				});
			});
		}
	};
}]);