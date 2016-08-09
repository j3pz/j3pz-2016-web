/* @require /components/config/config.js */
app.factory('CollectionController', function() {
	var controller = {};
	controller.setsList = [];
	controller.collectionsList = [];
	controller.posSetMap = {
		'0_hat': -1,
		'1_jacket': -1,
		'2_belt': -1,
		'3_wrist': -1,
		'4_bottoms': -1,
		'5_shoes': -1,
		'6_necklace': -1,
		'7_pendant': -1,
		'8_ring_1': -1,
		'9_ring_2': -1,
		'a_secondaryWeapon': -1,
		'b_primaryWeapon': -1
	};
	controller.registerSet = function(collection) {
		for (var i = 0; i < controller.setsList.length; i++) {
			if (controller.setsList[i] == collection.setId) {
				return i;
			}
		}
		controller.setsList.push(collection.setId);
		var length = controller.collectionsList.push(collection);
		return length - 1;
	};
	controller.deleteSet = function(setId) {
		var index = -1;
		for (var i = 0; i < controller.setsList.length; i++) {
			if (controller.setsList[i] == setId) {
				controller.setsList.splice(i, 1);
				controller.collectionsList.splice(i, 1);
				index = i;
			}
		}
		for (var j = 0; j < 12; j++) {
			if (controller.posSetMap[positions[j]] == index) {
				controller.posSetMap[positions[j]] = -1;
			}
		}
	};
	controller.getCollection = function(index) {
		return controller.collectionsList[index];
	};
	controller.getCollectionIndex = function(setId) {
		for (var i = 0; i < controller.setsList.length; i++) {
			if (controller.setsList[i] == setId){
				return i;
			}
		}
		return -1;
	};
	return controller;
});
