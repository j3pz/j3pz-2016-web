app.controller('PriceCtrl', ['$scope', '$http', 'toastr', function($scope, $http, toastr) {
	$scope.itemList = [
		{id: 1, price: '6.00', name: '1 格配装位', desc: '适用于所有用户，购买后配装位置加一', rate: 3, each: '6', image: 'shop1.png', condition: '<60'},
		{id: 2, price: '11.50', name: '2 格配装位', desc: '适用于所有用户，购买后配装位置加二', rate: 4, each: '5.75', image: 'shop2.png', condition: '<59'},
		{id: 4, price: '22.50', name: '4 格配装位', desc: '适用于所有用户，购买后配装位置加四', rate: 5, each: '5.63', image: 'shop4.png', condition: '<57'},
		{id: 10, price: '36.50', name: '高端玩家套餐', desc: '适用于未购买过配装位置的用户，购买后可用配装位置增加到10个', rate: 3, each: '5.21', image: 'shop10.png', condition: '==3'}
	];
}]);
