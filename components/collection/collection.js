/* @require /components/config/config.js */
var Collection = {
	createNew: function(equipData, focusId) {
		var collection = {};
		collection.setId = equipData.texiao.id; // 套装id
		collection.components = equipData.texiao.components; // 套装组件列表
		for (var i = 0; i < collection.components.length; i++) {
			if (equipData.type == 2) {
				equipData.type = focusId == '8_ring_1' ? 2 : 3;
			}
			collection.components[i].active = collection.components[i].positionId == equipData.type;
		}
		collection.name = equipData.texiao.name; // 套装名称
		collection.effects = equipData.texiao.effects; // 套装特效列表
		collection.activeNum = 0;	// 激活的套装件数
		collection.allNum = i;
		collection.takeOn = function(equip) {
			// 穿上某件装备
			if (equip.data.texiao.id == collection.setId) {
				var posId = equip.data.type;
				if (posId == '2') posId = equip.type == '8_ring_1' ? '2' : '3';
				for (var i = 0; i < collection.components.length; i++) {
					if (collection.components[i].positionId == posId) {
						collection.activeNum++;
						collection.components[i].active = true;
					}
				}
			}
		};
		collection.takeOff = function(id) {
			// 脱下某位置装备
			for (var i = 0; i < collection.components.length; i++) {
				if (collection.components[i].positionId == id) {
					collection.activeNum--;
					collection.components[i].active = false;
				}
			}
			return collection.activeNum;
		};
		return collection;
	}
};
