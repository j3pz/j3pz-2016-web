/* @require /components/config/config.js */
var Buff = {
	createNew: function(buffData) {
		var buff = {};
		var buffTypeList = ['Qixue', 'OrdinaryBuff', 'InfightBuff', 'Food', 'Formation'];
		/* 数据 */
		buff.id = buffData.id;
		buff.dataPercent = buffData.dataP;
		buff.dataBase = buffData.dataB;
		buff.icon = buffData.iconId;
		buff.name = buffData.name;
		buff.desc = buffData.desc;
		buff.type = buffTypeList[buffData.type];
		buff.isPercent = buffData.isPercent;
		buff.isFinal = buffData.isFinal;
		buff.conflict = buffData.conflict;
		buff.getData = function(prefix) {
			// 获取数据
			if (prefix in buff.data) return buff.data[prefix];
			return 0;
		};
		buff.setData = function(prefix, value) {
			// 设置数据
			buff.data[prefix] = value;
		};
		return buff;
	}
};
