app.controller('PurchaseCtrl', ['$scope', '$rootScope', '$http', 'toastr',
	function($scope, $rootScope, $http, toastr) {
		$scope.itemList = {
			'1': {id: 1, price: '8.00', name: '1 格配装位', desc: '适用于所有用户，购买后配装位置加一', rate: 3, each: '8', image: 'shop1.png', condition: '<60'},
			'2': {id: 2, price: '15.00', name: '2 格配装位', desc: '适用于所有用户，购买后配装位置加二', rate: 4, each: '7.50', image: 'shop2.png', condition: '<59'},
			'4': {id: 4, price: '30.00', name: '4 格配装位', desc: '适用于所有用户，购买后配装位置加四', rate: 5, each: '7.50', image: 'shop4.png', condition: '<57'},
			'10': {id: 10, price: '49.00', name: '高端玩家套餐', desc: '适用于未购买过配装位置的用户，购买后可用配装位置增加到10个', rate: 3, each: '7', image: 'shop10.png', condition: '==3'}
		};
		$scope.hasQrCode = false;
		$scope.price = 0;
		$('#purchaseModal').on('show.bs.modal', function(event) {
			var button = $(event.relatedTarget);
			$scope.item = $scope.itemList[button.data('item')];
			$scope.canBuy = false;
			$scope.hasQrCode = false;
			$scope.price = 0;
			if (($rootScope.user.maxSave + $scope.item.id <= 60) && !($rootScope.user.maxSave > 3 && $scope.item.id == 10)) {
				$scope.canBuy = true;
			}
			$scope.$apply();
		});
		$scope.buy = function(itemId, type) {
			var token = localStorage.getItem('token');
			$http.post(config.apiBase + 'user/order', {
				item: itemId,
				type: type,
			}, {
				headers: {'Authorization': 'Bearer ' + token}
			})
			.success(function(response) {
				var res = response.data.qrCode;
				$scope.qrCode = 'https://pan.baidu.com/share/qrcode?w=280&h=280&url=' + res.data.qrcode;
				$scope.price = res.data.realprice;
				toastr.info(res.msg);
				$scope.hasQrCode = true;
			})
			.error(function(response) {
				toastr.error(response.errors[0].details);
			});
		};
	}]);
