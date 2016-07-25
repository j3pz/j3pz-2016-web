app.controller('PriceCtrl', ['$scope', function($scope){
	$scope.itemList = [
		{id:1,price:"8.00",name:"1 格配装位",desc:"适用于所有用户，购买后配装位置加一",rate:3,each:"8",image:"shop1.png",condition:"<60"},
		{id:2,price:"15.00",name:"2 格配装位",desc:"适用于所有用户，购买后配装位置加二",rate:4,each:"7.5",image:"shop2.png",condition:"<59"},
		{id:4,price:"30.00",name:"4 格配装位",desc:"适用于所有用户，购买后配装位置加四",rate:5,each:"7.5",image:"shop4.png",condition:"<57"},
		{id:10,price:"49.00",name:"高端玩家套餐",desc:"适用于未购买过配装位置的用户，购买后可用配装位置增加到10个",rate:3,each:"7",image:"shop10.png",condition:"==3"},
	];

	$scope.buy = function(){
		
	};
}]);
