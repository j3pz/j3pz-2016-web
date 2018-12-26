/* @require /components/config/config.js */
var Equip = {
	createNew: function() {
		var equip = {};
		/* 数据 */
		equip.data = {};					// 装备基础数据
		equip.type = '';					// 装备类型ID
		equip.typeParse = '';				// 装备类型 in ["帽子","上衣",...]
		equip.descList = {};				// 装备数据描述
		equip.jinglian = {};				// 装备精炼数据
		equip.enhance = {};					// 装备附魔数据
		equip.holes = {						// 装备原始镶嵌孔数据
			number: 0,						// 装备镶嵌孔数量
			holeInfo: []						// 镶嵌孔数据
			/*
			 * 示例数据
			 * {
			 *	typeId:"A",					// 镶嵌孔孔色ID
			 *  attrId:"00",				// 镶嵌孔属性ID
			 *  attrPrefix:"spirit",		// 镶嵌孔属性索引
			 *  avaStone:[0,2],				// 镶嵌孔孔色可行域
			 *  typeDesc:"金/水镶嵌孔",		// 镶嵌孔孔色描述
			 *  attrDesc:"根骨+",			// 镶嵌孔属性描述
			 *  changed:false				// 是否经过淬炼
			 * }
			 */
		};
		equip.newHoles = {					// 装备实际镶嵌孔数据
			holeInfo: []
		};
		equip.embed = {						// 装备实际镶嵌数据
			score: [],						// 五行石分数数据
			totalScore: 0,					// 五行石总分
			stone: []						// 镶嵌五行石数据
			/*
			 * 示例数据
			 * {
			 *	typeId:"0",					// 五行石颜色ID
			 *  level:"6",					// 五行石等级
			 *  attrPrefix:"spirit",		// 镶嵌孔属性索引
			 *  attr:"10",					// 属性提升数值
			 *  active:false				// 是否激活
			 * }
			 */
		};
		equip.xilian = {
			level: 0,
			ratio: 40,
			num: {}
		};									// 洗炼数据
		equip.recommendSchool = [];			// 推荐门派
		// equip.prefix = ["P_ID","iconID","name","xinfatype","type","quality","score","body","spirit","strength","agility","spunk","basicPhysicsShield","basicMagicShield","physicsShield","magicShield","dodge","parryBase","parryValue","toughness","attack","heal","crit","critEffect","overcome","acce","hit","strain","huajing","threat","texiao","xiangqian","strengthen","dropSource"];
		// 数据名称
		/* 方法 */
		equip.getData = function(prefix) {
			// 获取数据
			if (prefix in equip.data) return equip.data[prefix];
			return 0;
		};
		equip.setData = function(prefix, value) {
			// 设置数据
			equip.data[prefix] = value;
		};
		equip.getDesc = function(prefix) {
			// 获取前缀描述
			if (prefix in equip.descList) return equip.descList[prefix];
			return 0;
		};
		equip.setDesc = function(prefix, value) {
			// 设置前缀描述
			equip.descList[prefix] = value;
		};
		equip.getEnhance = function(prefix) {
			// 获取附魔数据
			if (prefix in equip.enhance) return equip.enhance[prefix];
			return 0;
		};
		equip.setEnhance = function(prefix, value) {
			// 设置附魔数据
			equip.enhance[prefix] = value;
		};
		equip.getHoleNum = function(id) {
			// 获取镶嵌数据
			if (id < equip.holes.number) return {prefix: equip.embed.stone[id].attrPrefix, attr: equip.embed.stone[id].attr};
			return {prefix: 'none', attr: 0};
		};
		equip.getXilian = function(prefix) {
			// 获取洗炼数据
			if (prefix in equip.xilian.num) return equip.xilian.num[prefix];
			return 0;
		};
		equip.setStrengthen = function(v) {
			// 精炼装备
			equip.jinglian = {};
			var jinglianList = ['quality', 'score', 'body', 'spirit', 'strength', 'agility', 'spunk', 'physicsShield', 'magicShield', 'dodge', 'parryBase', 'parryValue', 'toughness', 'attack', 'heal', 'crit', 'critEffect', 'overcome', 'acce', 'hit', 'strain', 'huajing', 'threat'];
			var cof = [0, 0.005, 0.013, 0.024, 0.038, 0.055, 0.075, 0.098, 0.124];
			equip.jinglian.strengthen = Math.min(v, equip.data.strengthen);
			angular.forEach(equip.data, function(value, key) {
				if ($.inArray(key, jinglianList) >= 0) {
					var originalData = value;
					if (key in equip.xilian.num) originalData -= equip.xilian.num[key] * -1;
					var finalData = originalData * cof[v];
					if (key === 'threat') finalData = finalData.toFixed(1);
					else finalData = finalData.toFixed(0);
					equip.jinglian[key] = finalData;
				}
			});
			angular.forEach(equip.xilian.num, function(value, key) {
				if (value > 0) {
					var originalData = value;
					var finalData = originalData * cof[v];
					finalData = finalData.toFixed(0);
					equip.jinglian[key] = finalData;
				}
			});
		};
		equip.getJinglian = function(prefix) {
			if (prefix in equip.jinglian) return equip.jinglian[prefix];
			return 0;
		};
		equip.getRecommend = function() {
			// 获取推荐门派字符串
			var r = '';
			for (var i = 0; i < equip.recommendSchool.length - 1; i++) {
				r += equip.recommendSchool[i] + '、';
			}
			r +=  equip.recommendSchool[i];
			return r;
		};
		equip.getDropSource = function() {
			return equip.data.dropSource.replace(/\//g, '\n');
		};
		equip.getWeaponDamageRange = function() {
			return equip.data.damageBase + '-' + (equip.data.damageBase + equip.data.damageRange);
		};
		equip.getWeaponSpeed = function() {
			return (equip.data.attackSpeed / 16).toFixed(1);
		};
		equip.getWeaponDamage = function() {
			var damage = (equip.data.damageBase + equip.data.damageRange / 2) / (equip.data.attackSpeed / 16);
			return Math.round(damage * 2) / 2;
		};
		equip.analysisHole = function() {
			// 初始化镶嵌孔数据
			equip.data.xiangqian = equip.data.xiangqian ? equip.data.xiangqian : '0';
			var str = equip.data.xiangqian;
			var x = str.substring(0, 1);
			equip.holes.number = x;

			for (var i = 0; i < x; i++) {
				var tempInfo = str.substring(i * 3 + 1, i * 3 + 4);
				var singleHoleInfo = {};
				singleHoleInfo.typeId = tempInfo.substring(0, 1);
				singleHoleInfo.attrId = tempInfo.substring(1, 3);
				singleHoleInfo.avaStone = stoneTypeMap[singleHoleInfo.typeId];
				// singleHoleInfo.typeDesc = stoneTypeList[singleHoleInfo.avaStone[0]]+"/"+stoneTypeList[singleHoleInfo.avaStone[1]]+"镶嵌孔";
				singleHoleInfo.attrDesc = stoneAttrMap[Number(singleHoleInfo.attrId)].desc;
				singleHoleInfo.attrPrefix = stoneAttrMap[Number(singleHoleInfo.attrId)].prefix;
				equip.newHoles.holeInfo.push(singleHoleInfo);
				var originalHoleInfo = angular.copy(singleHoleInfo);
				originalHoleInfo.changed = false;
				equip.holes.holeInfo.push(originalHoleInfo);
				var tempStone = {
					typeId: '-1',
					level: '6',
					attrPrefix: originalHoleInfo.attrPrefix,
					attr: 0,
					score: 0,
					active: false
				};
				equip.embed.stone.push(tempStone);
				equip.embed.score[i] = 0;
			}
		};
		return equip;
	}
};
