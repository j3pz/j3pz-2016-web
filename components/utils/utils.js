/* @require /components/config/config.js */
app.service('Utils', ['$rootScope', function($rootScope) {
	this.transDBStoneToJsObj = function(data) {
		var count = 0;
		$rootScope.buffController.attributeStone.percentPlus = {
			buff: {},
			isCheck: false
		};
		$rootScope.buffController.attributeStone.baseMinus = {
			buff: {},
			isCheck: false
		};
		if (!data || !data.level) {
			return {
				name: '',
				score: 0,
				level: 0,
				attributes: [
					{
						type: 'jing',
						isFirstChild: true,
						desc: '',
						prefix: 'none',
						number: 0,
						isActive: false,
						isPercent: false,
						needMagicStoneType: '-1',
						needMagicStoneNumber: 0
					},
					{
						desc: '',
						isFirstChild: false,
						prefix: 'none',
						number: 0,
						isActive: false,
						isPercent: false,
						needMagicStoneType: '-1',
						needMagicStoneNumber: 0
					},
					{
						desc: '',
						isFirstChild: false,
						prefix: 'none',
						number: 0,
						isActive: false,
						isPercent: false,
						needMagicStoneType: '-1',
						needMagicStoneNumber: 0
					}
				]
			};
		}
		var imgType = 'nei';
		if (data.attr[0].attribute.indexOf('精简') >= 0) {
			imgType = 'jing';
			var testList = ['元气', '根骨', '力道', '身法', '体质'];
			var number = data.attr[1].number;
			var descList = ['元气提高' + number, '根骨提高' + number, '力道提高' + number, '身法提高' + number, '体质提高' + number];
			var prefixList = ['spunk', 'spirit', 'strength', 'agility', 'body'];
			for (var i = 0; i < testList.length; i++) {
				if (data.attr[1].attribute.indexOf(testList[i]) >= 0) {
					data.attr[1].desc = descList[i];
					data.attr[1].prefix = prefixList[i];
				}
			}
			testList = ['体质', '元气', '根骨', '力道', '身法', '抽蓝', '吸血', '移动速度'];
			number = data.attr[2].number / 10.24;
			var numberToShow = number.toFixed(0);
			descList = ['体质提高' + numberToShow + '%', '元气提高' + numberToShow + '%', '根骨提高' + numberToShow + '%', '力道提高' + numberToShow + '%', '身法提高' + numberToShow + '%', '命中后抽取目标内力' + numberToShow + '%', '命中后抽取目标气血' + numberToShow + '%', '移动速度提高' + numberToShow + '%'];
			prefixList = ['body', 'spunk', 'spirit', 'strength', 'agility', '', '', ''];

			for (var i = 0; i < testList.length; i++) {
				if (data.attr[2].attribute.indexOf(testList[i]) >= 0) {
					data.attr[2].desc = descList[i];
					data.attr[2].prefix = prefixList[i];
					// 新建一个百分比增益buff
					var buffObj = {
						id: 'attrPercentPlus_' + count,
						dataP: {},
						iconId: 0,
						name: '',
						type: 0,
						isPercent: true,
						isFinal: false,
						conflict: []
					};
					buffObj.type = 'AttributeStone';
					buffObj.dataP[prefixList[i]] = number;
					var newBuff = Buff.createNew(buffObj);
					$rootScope.buffController.attributeStone.percentPlus = {
						buff: newBuff,
						isCheck: false
					};
					// 新建一个数值减益Buff
					buffObj = {
						id: 'attrBaseMinus_' + count,
						dataB: {},
						iconId: 0,
						name: '',
						type: 0,
						isPercent: false,
						isFinal: false,
						conflict: []
					};
					buffObj.type = 'AttributeStone';
					buffObj.dataB[prefixList[i]] = data.attr[2].number * -1;
					var newBuff = Buff.createNew(buffObj);
					$rootScope.buffController.attributeStone.baseMinus = {
						buff: newBuff,
						isCheck: false
					};
					count++;
				}
			}
			for (var i = 1; i < 3; i++) {
				var desc = '';
				var percentNumber = data.attr[i].number / 10.24;
				percentNumber = percentNumber.toFixed(0);
				if (data.attr[i].attribute.indexOf('会心') >= 0) {
					data.attr[i].desc = '全会心等级提高' + data.attr[i].number;
					data.attr[i].prefix = 'crit';
				} else if (data.attr[i].attribute.indexOf('会效') >= 0) {
					data.attr[i].desc = '全会心效果等级提高' + data.attr[i].number;
					data.attr[i].prefix = 'critEffect';
				} else if (data.attr[i].attribute.indexOf('全属性') >= 0) {
					data.attr[i].desc = '全属性提高' + data.attr[i].number;
					data.attr[i].prefix = 'body/spunk/spirit/strength/agility';
				} else if (data.attr[i].attribute.indexOf('治疗') >= 0) {
					data.attr[i].desc = '治疗效果提高' +  percentNumber + '%';
				} else if (data.attr[i].attribute.indexOf('蓝耗') >= 0) {
					data.attr[i].desc = '招式内力消耗降低' +  percentNumber + '%';
				} else if (data.attr[i].attribute.indexOf('被疗成效') >= 0) {
					data.attr[i].desc = '被治疗成效提高' + percentNumber + '%';
				} else if (data.attr[i].attribute.indexOf('免伤') >= 0) {
					data.attr[i].desc = '伤害减免' + percentNumber + '%';
				} else if (data.attr[i].attribute.indexOf('仇恨') >= 0) {
					data.attr[i].desc = '招式产生的威胁提高' + percentNumber + '%';
				}
			}
		} else {
			if (['spirit', 'spunk', 'hps'].indexOf($rootScope.menpai.type) >= 0) imgType = 'nei';
			if (['agility', 'strength'].indexOf($rootScope.menpai.type) >= 0) imgType = 'wai';
			var testList = ['攻击', '治疗', '会心', '会效', '命中', '破防', '急速', '无双', '元气', '根骨', '力道', '身法', '化劲', '御劲', '回蓝', '外防', '内防', '闪避', '招架', '拆招', '威胁', '血上限', '回血速度', '体质', '武器伤害'];
			var descList = ['攻击提高', '治疗成效提高', '会心等级提高', '会心效果等级提高', '命中等级提高', '破防提高', '急速等级提高', '无双等级提高', '元气+', '根骨+', '力道+', '身法+', '化劲等级提高', '御劲等级提高', '回蓝速度提高', '外功防御等级提高', '内功防御等级提高', '闪避等级提高', '招架等级提高', '拆招值提高', '招式产生的威胁变化', '额外提高气血上限', '每秒气血恢复提升', '体质+', '武器伤害提高'];
			var prefixList = ['attack', 'heal', 'crit', 'critEffect', 'hit', 'overcome', 'acce', 'strain', 'spunk', 'spirit', 'strength', 'agility', 'huajing', 'toughness', '', 'physicsShield', 'magicShield', 'dodge', 'parryBase', 'parryValue', 'threat', 'life', '', 'body', ''];
			var exList = ['阳性', '阴性', '混元', '毒性', '内功', '外功'];
			var exDescList = ['阳性内功', '阴性内功', '混元内功', '毒性内功', '内功', '外功'];
			for (var i = 0; i < 3; i++) {
				for (var j = 0; j < testList.length; j++) {
					var ex = '';
					for (var k = 0; k < exList.length; k++) {
						if (data.attr[i].attribute.indexOf(exList[k]) >= 0) {
							ex = exDescList[k];
							break;
						}
					}
					if (data.attr[i].attribute.indexOf(testList[j]) >= 0) {
						data.attr[i].desc = ex + descList[j] + data.attr[i].number;
						data.attr[i].prefix = prefixList[j];
					}
				}
			}
		}
		var attrStone = {
			name: data.name,
			score: 77 * data.level,
			level: data.level,
			attributes: [
				{
					type: imgType,
					isFirstChild: imgType == 'jing' ? false : true,
					desc: data.attr[0].desc,
					prefix: data.attr[0].prefix,
					number: data.attr[0].number,
					isActive: false,
					isPercent: false,
					needMagicStoneType: stoneTypeListReverse[data.attr[0].neededAttribute],
					needMagicStoneNumber: data.attr[0].neededStone,
					needMagicStoneLevel: data.attr[0].neededLevel
				},
				{
					type: imgType,
					isFirstChild: imgType == 'jing' ? true : false,
					desc: data.attr[1].desc,
					prefix: data.attr[1].prefix,
					number: data.attr[1].number,
					isActive: false,
					isPercent: false,
					needMagicStoneType: stoneTypeListReverse[data.attr[1].neededAttribute],
					needMagicStoneNumber: data.attr[1].neededStone,
					needMagicStoneLevel: data.attr[1].neededLevel
				},
				{
					isFirstChild: false,
					desc: data.attr[2].desc,
					prefix: data.attr[2].prefix,
					number: data.attr[2].number,
					isActive: false,
					isPercent: count > 0,
					needMagicStoneType: stoneTypeListReverse[data.attr[2].neededAttribute],
					needMagicStoneNumber: data.attr[2].neededStone,
					needMagicStoneLevel: data.attr[2].neededLevel
				}
			]
		};
		return attrStone;
	};
	this.changeColor = function(n, value) {
		$rootScope.equips[$rootScope.focus].newHoles.holeInfo[n].typeId = value;
		var avaStoneList = stoneTypeMap[value];
		$rootScope.equips[$rootScope.focus].newHoles.holeInfo[n].avaStone = avaStoneList;
		$rootScope.equips[$rootScope.focus].newHoles.holeInfo[n].typeDesc = stoneTypeList[avaStoneList[0]] + '/' + stoneTypeList[avaStoneList[1]] + '镶嵌孔';
		this.isChanged(n);
	};
	this.changeAttr = function(n, value) {
		$rootScope.equips[$rootScope.focus].newHoles.holeInfo[n].attrId = value;
		$rootScope.equips[$rootScope.focus].newHoles.holeInfo[n].attrDesc = stoneAttrMap[Number(value)].desc;
		$rootScope.equips[$rootScope.focus].newHoles.holeInfo[n].attrPrefix = stoneAttrMap[Number(value)].prefix;

		this.isChanged(n);
	};
	this.isChanged = function(n) {
		var actualType = $rootScope.equips[$rootScope.focus].newHoles.holeInfo[n].typeId;
		var originalType = $rootScope.equips[$rootScope.focus].holes.holeInfo[n].typeId;
		var actualAttr = $rootScope.equips[$rootScope.focus].newHoles.holeInfo[n].attrId;
		var originalAttr = $rootScope.equips[$rootScope.focus].holes.holeInfo[n].attrId;
		if (actualType == originalType && actualAttr == originalAttr) {
			$rootScope.equips[$rootScope.focus].newHoles.holeInfo[n].changed = false;
			$rootScope.equips[$rootScope.focus].holes.holeInfo[n].changed = false;
		} else {
			$rootScope.equips[$rootScope.focus].newHoles.holeInfo[n].changed = true;
			$rootScope.equips[$rootScope.focus].holes.holeInfo[n].changed = true;
		}
		var existStone = {
			type: $rootScope.equips[$rootScope.focus].embed.stone[n].typeId,
			level: $rootScope.equips[$rootScope.focus].embed.stone[n].level,
			img: $rootScope.equips[$rootScope.focus].embed.stone[n].typeId + '-' + $rootScope.equips[$rootScope.focus].embed.stone[n].level
		};
		this.onDrop(existStone, n);
	};
	this.onDrop = function(stone, index) {
		var holeInfo = $rootScope.equips[$rootScope.focus].newHoles.holeInfo[index];
		var isActive = stone.type >= 0;
		var attrPlus = 0;
		if (isActive) attrPlus = attributePlusValueMap[attributeMap[holeInfo.attrPrefix]][stone.level - 1];
		var embeddedStone = {
			typeId: stone.type,
			level: stone.level,
			attrPrefix: holeInfo.attrPrefix,
			attr: attrPlus,
			score: stoneScore[stone.level] * (stone.type < 0 ? 0 : 1),
			active: isActive
		};
		$rootScope.equips[$rootScope.focus].embed.stone[index] = embeddedStone;
		$rootScope.equips[$rootScope.focus].embed.score[index] = embeddedStone.score;
		var exteaStoneScore = 0;
		if ($rootScope.equips[$rootScope.focus].type == 'b_primaryWeapon')
			exteaStoneScore = $rootScope.attributeStone[0].level * 77 * 2;
		if ($rootScope.equips[$rootScope.focus].type == 'c_primaryWeapon')
			exteaStoneScore = $rootScope.attributeStone[1].level * 77 * 2;
		$rootScope.equips[$rootScope.focus].embed.totalScore = Math.round(eval($rootScope.equips[$rootScope.focus].embed.score.join('+')) + exteaStoneScore);
		this.attributeStoneActivation();
	};
	this.attributeStoneActivation = function() {
		$rootScope.stoneStats = {
			'0': {level: 0, number: 0},	// 金
			'1': {level: 0, number: 0},	// 木
			'2': {level: 0, number: 0},	// 水
			'3': {level: 0, number: 0},	// 火
			'4': {level: 0, number: 0},	// 土
			'5': {level: 0, number: 0}	// 全
		};
		for (var i = 0; i < positions.length; i++) {
			var equip = $rootScope.equips[positions[i]];
			if (positions[i] == 'b_primaryWeapon' && $rootScope.attributeStoneSelected == 1) continue;
			if (positions[i] == 'c_primaryWeapon' && $rootScope.attributeStoneSelected == 0) continue;
			for (var j = 0; j < equip.holes.number; j++) {
				if (equip.embed.stone[j].typeId != '-1') {
					$rootScope.stoneStats[equip.embed.stone[j].typeId].level -= -1 * equip.embed.stone[j].level;
					$rootScope.stoneStats[equip.embed.stone[j].typeId].number++;
					$rootScope.stoneStats['5'].level -= -1 * equip.embed.stone[j].level;
					$rootScope.stoneStats['5'].number++;
				}
			}
		}
		var attributes = $rootScope.attributeStone[$rootScope.attributeStoneSelected].attributes;
		for (var i = 0; i < 3; i++) {
			var needType = Number(attributes[i].needMagicStoneType);
			var needNumber = Number(attributes[i].needMagicStoneNumber);
			var needLevel = Number(attributes[i].needMagicStoneLevel);
			$rootScope.attributeStone[$rootScope.attributeStoneSelected].attributes[i].isActive = $rootScope.stoneStats[needType] && $rootScope.stoneStats[needType].level >= needLevel && $rootScope.stoneStats[needType].number >= needNumber;
			if ($rootScope.attributeStone[$rootScope.attributeStoneSelected].attributes[i].isPercent) {
				$rootScope.buffController.attributeStone.percentPlus.isCheck = $rootScope.attributeStone[$rootScope.attributeStoneSelected].attributes[i].isActive;
				$rootScope.buffController.attributeStone.baseMinus.isCheck = $rootScope.attributeStone[$rootScope.attributeStoneSelected].attributes[i].isActive;
			}
		}
	};
	this.xilian = function(origin, target, level, ratio) {
		var constant = 1;
		var quality = $rootScope.equips[$rootScope.focus].data.quality;
		if (origin == 'attack') {
			constant = $rootScope.equips[$rootScope.focus].descList['attack'].indexOf('外功') >= 0 ? 0.294 : 0.244;
		} else if (origin == 'heal') {
			constant = 0.124;
		} else if (origin == 'parryValue') {
			constant = 0.0808;
		}
		var levelRatio = (level * 0.05 + 0.55) * (level > 0 ? 1 : 0);

		var originData = $rootScope.equips[$rootScope.focus].data[origin];
		var originValue = -0.01 * originData * ratio * (level > 0 ? 1 : 0);
		originValue = originValue.toFixed(2);
		var targetValue = Math.floor(-1 * originValue * levelRatio * constant);
		originValue = Math.floor(originValue);
		var originFinal = Number(originData) + Number(originValue);
		$rootScope.equips[$rootScope.focus].xilian.level = level;
		$rootScope.equips[$rootScope.focus].xilian.ratio = ratio;
		$rootScope.equips[$rootScope.focus].xilian.origin = {key: origin, value: originValue};
		$rootScope.equips[$rootScope.focus].xilian.target = {key: target, value: targetValue};
		$rootScope.equips[$rootScope.focus].xilian.num = {};
		$rootScope.equips[$rootScope.focus].xilian.num[origin] = originValue;
		$rootScope.equips[$rootScope.focus].xilian.num[target] = targetValue;
		var v = $rootScope.equips[$rootScope.focus].jinglian.strengthen;
		$rootScope.equips[$rootScope.focus].setStrengthen(v);
	};
	this.calculate = function() {
		var menpai = $rootScope.menpai;
		var results = {
			'score': 0, 'body': 0, 'spirit': 0, 'strength': 0, 'agility': 0, 'spunk': 0, 'basicPhysicsShield': 0, 'basicMagicShield': 0, 'physicsShield': 0, 'magicShield': 0, 'dodge': 0, 'parryBase': 0, 'parryValue': 0, 'toughness': 0, 'basicAttack': 0, 'attack': 0, 'heal': 0, 'crit': 0, 'critEffect': 0, 'overcome': 0, 'acce': 0, 'hit': 0, 'strain': 0, 'huajing': 0, 'threat': 0, 'life': 0, 'acceLevel': 0
		};
		var resultsList = ['score', 'body', 'spirit', 'strength', 'agility', 'spunk', 'basicPhysicsShield', 'basicMagicShield', 'physicsShield', 'magicShield', 'dodge', 'parryBase', 'parryValue', 'toughness', 'attack', 'heal', 'crit', 'critEffect', 'overcome', 'acce', 'hit', 'strain', 'huajing', 'threat', 'life', 'basicAttack', 'basicLife', 'basicHeal'];
		// 装备属性统计
		for (var i = 0; i < positions.length; i++) {
			var equipInstance = $rootScope.equips[positions[i]];
			if ($rootScope.menpai.name == 'cangjian' && (positions[i] == 'b_primaryWeapon' || positions[i] == 'c_primaryWeapon')) {
				results.score += 0.5 * equipInstance.embed.totalScore;
				if (equipInstance.getData('score') > 0) results['score'] += 0.5 * equipInstance.getData('score');
				if (equipInstance.getJinglian('score') > 0) results['score'] += 0.5 * equipInstance.getJinglian('score');
				if (equipInstance.getEnhance('score') > 0) results['score'] += 0.5 * equipInstance.getEnhance('score');
				if (positions[i] == 'b_primaryWeapon' && $rootScope.zhongjian) continue;
				if (positions[i] == 'c_primaryWeapon' && !$rootScope.zhongjian) continue;
			}
			else {
				results.score += 1 * equipInstance.embed.totalScore;
				if (equipInstance.getData('score') > 0) results['score'] += 1 * equipInstance.getData('score');
				if (equipInstance.getJinglian('score') > 0) results['score'] += 1 * equipInstance.getJinglian('score');
				if (equipInstance.getEnhance('score') > 0) results['score'] += 1 * equipInstance.getEnhance('score');
			}
			for (var j = 1; j < resultsList.length; j++) {
				if (equipInstance.getData(resultsList[j]) > 0) results[resultsList[j]] += 1 * equipInstance.getData(resultsList[j]);
				if (equipInstance.getJinglian(resultsList[j]) > 0) results[resultsList[j]] += 1 * equipInstance.getJinglian(resultsList[j]);
				if (equipInstance.getEnhance(resultsList[j]) > 0) results[resultsList[j]] += 1 * equipInstance.getEnhance(resultsList[j]);
			}
			if (equipInstance.xilian.level > 0) {
				results[equipInstance.xilian.origin.key] -= -1 * equipInstance.xilian.origin.value;
				results[equipInstance.xilian.target.key] -= -1 * equipInstance.xilian.target.value;
			}
			for (var k = 0; k < equipInstance.holes.number; k++) {
				var embedAttribute = equipInstance.getHoleNum(k);
				if (embedAttribute.attr > 0) results[embedAttribute.prefix] -= -1 * embedAttribute.attr;
			}
		}
		// 套装特效统计
		var setController = $rootScope.setController;
		for (var i = 0; i < setController.setsList.length; i++) {
			var setInstance = setController.collectionsList[i];
			for (var j = 0; j < setInstance.effects.length; j++) {
				if (setInstance.effects[j].conditionNum <= setInstance.activeNum && setInstance.effects[j].effectIndex) {
					var setEffectGroup = setInstance.effects[j].effectIndex.split('/');
					for (var k = 0; k < setEffectGroup.length; k++) {
						results[setEffectGroup[k]] -= -1 * setInstance.effects[j].effectNum;
					}
				}
			}
		}
		// 五彩石计算
		var attributeStone = $rootScope.attributeStone[$rootScope.attributeStoneSelected];
		for (var i = 0; i < 3; i++) {
			if (attributeStone.attributes[i].isActive) {
				if (!attributeStone.attributes[i].prefix) continue;
				var prefixArr = attributeStone.attributes[i].prefix.split('/');
				for (var j = 0; j < prefixArr.length; j++) {
					var attrPrefix = prefixArr[j];
					if (!angular.equals(attrPrefix, 'none')) {
						results[attrPrefix] -= -1 * attributeStone.attributes[i].number;
					}
				}
			}
		}
		// Buff 数值计算
		var buffBaseValue = {};
		var buffPercentValue = {};
		var buffFinalValue = {};
		for (var i = 0; i < resultsList.length; i++) {
			buffBaseValue[resultsList[i]] = 0;
			buffPercentValue[resultsList[i]] = 0;
			buffFinalValue[resultsList[i]] = 0;
		}
		for (var i = 0; i < $rootScope.buffController.buff.length; i++) {
			var buff = angular.copy($rootScope.buffController.buff[i]);
			if ($rootScope.buffController.activeBuff[buff.id].isCheck) {
				if (buff.isFinal >= 1) {
					angular.forEach(buff.dataBase, function(value, key) {
						this[key] += Number(value);
					}, buffFinalValue);
					if (buff.isFinal == 2) buff.isFinal = 0;
				}
				if (buff.isFinal == 0) {
					if (buff.isPercent >= 1) {
						angular.forEach(buff.dataPercent, function(value, key) {
							this[key] += Number(value);
						}, buffPercentValue);
						if (buff.isPercent == 2) buff.isPercent = 0;
					}
					if (buff.isPercent == 0) {
						angular.forEach(buff.dataBase, function(value, key) {
							this[key] += Number(value);
						}, buffBaseValue);
					}
				}
			}
		}
		if ($rootScope.buffController.attributeStone.percentPlus.isCheck) {
			var attributeStoneBuffPlus = $rootScope.buffController.attributeStone.percentPlus.buff;
			angular.forEach(attributeStoneBuffPlus.dataPercent, function(value, key) {
				this[key] += Number(value);
			}, buffPercentValue);
		}
		if ($rootScope.buffController.attributeStone.baseMinus.isCheck) {
			var attributeStoneBuffMinus = $rootScope.buffController.attributeStone.baseMinus.buff;
			angular.forEach(attributeStoneBuffMinus.dataBase, function(value, key) {
				this[key] += Number(value);
			}, buffBaseValue);
		}
		// 体质
		results.body += $rootScope.role.body + buffBaseValue.body;
		$rootScope.results.body = Math.floor(results.body * (1 + buffPercentValue.body / 100));
		results.life += ($rootScope.results.body * 10 + 9116 + buffBaseValue.basicLife) * (1 + buffPercentValue.life / 100) * (menpai.baseHPlus + buffPercentValue.basicLife / 100) + $rootScope.results.body * menpai.baseBodyPlus;
		$rootScope.results.life = Math.floor((results.life + buffBaseValue.life)) + Math.floor(buffFinalValue.life);
		$rootScope.results.spirit = Math.floor((results.spirit + $rootScope.role.spirit + buffBaseValue.spirit) * (1 + buffPercentValue.spirit / 100)) + Math.floor(buffFinalValue.spirit);
		$rootScope.results.strength = Math.floor((results.strength + $rootScope.role.strength + buffBaseValue.strength) * (1 + buffPercentValue.strength / 100)) + Math.floor(buffFinalValue.strength);
		$rootScope.results.agility = Math.floor((results.agility + $rootScope.role.agility + buffBaseValue.agility) * (1 + buffPercentValue.agility / 100)) + Math.floor(buffFinalValue.agility);
		$rootScope.results.spunk = Math.floor((results.spunk + $rootScope.role.spunk + buffBaseValue.spunk) * (1 + buffPercentValue.spunk / 100)) + Math.floor(buffFinalValue.spunk);

		if (menpai.type == 'spirit') {// 根骨门派计算
			// 基础攻击
			$rootScope.results.basicAttack = results.attack + menpai.baseAttack + .18 * $rootScope.results.spunk;
			$rootScope.results.basicAttack = Math.floor(($rootScope.results.basicAttack + buffBaseValue.basicAttack) * (1 + buffPercentValue.basicAttack / 100));
			// 面板攻击
			$rootScope.results.attack = Math.floor($rootScope.results.basicAttack * (1 + buffPercentValue.attack / 100) + menpai.baseAttackPlus * $rootScope.results.spirit + buffBaseValue.attack);
			// 会心
			$rootScope.results.crit = results.crit + menpai.baseCrit + Math.floor(menpai.baseCritPlus * $rootScope.results.spirit) + Math.floor(.64 * $rootScope.results.spirit);
			// 会效
			$rootScope.results.critEffect = results.critEffect + Math.floor(menpai.baseCritEffPlus * $rootScope.results.spirit);// + Math.floor(.15 * $rootScope.results.spirit);
			// 破防
			$rootScope.results.overcome = results.overcome + menpai.baseOvercome + menpai.baseOvercomePlus * $rootScope.results.spirit + .3 * $rootScope.results.spunk;
		} else if (menpai.type == 'strength') {// 力道门派计算
			// 基础攻击
			$rootScope.results.basicAttack = results.attack + menpai.baseAttack + .15 * ($rootScope.results.strength);
			$rootScope.results.basicAttack = Math.floor(($rootScope.results.basicAttack + buffBaseValue.basicAttack) * (1 + buffPercentValue.basicAttack / 100));
			// 面板攻击
			$rootScope.results.attack = Math.floor($rootScope.results.basicAttack * (1 + buffPercentValue.attack / 100) + menpai.baseAttackPlus * $rootScope.results.strength + buffBaseValue.attack);
			// 会心
			$rootScope.results.crit = results.crit + menpai.baseCrit + Math.floor(menpai.baseCritPlus * $rootScope.results.strength) + Math.floor(.64 * $rootScope.results.agility);
			// 会效
			$rootScope.results.critEffect = results.critEffect + Math.floor(menpai.baseCritEffPlus * $rootScope.results.strength);//$ + Math.floor(.15 * $rootScope.results.agility);
			// 破防
			$rootScope.results.overcome = results.overcome + menpai.baseOvercome + (menpai.baseOvercomePlus + .3) * $rootScope.results.strength;
		} else if (menpai.type == 'agility') {// 身法门派计算
			// 基础攻击
			$rootScope.results.basicAttack = results.attack + menpai.baseAttack + .15 * $rootScope.results.strength;
			$rootScope.results.basicAttack = Math.floor(($rootScope.results.basicAttack + buffBaseValue.basicAttack) * (1 + buffPercentValue.basicAttack / 100));
			// 面板攻击
			$rootScope.results.attack = Math.floor($rootScope.results.basicAttack * (1 + buffPercentValue.attack / 100) + menpai.baseAttackPlus * $rootScope.results.agility + buffBaseValue.attack);
			// 会心
			$rootScope.results.crit = results.crit + menpai.baseCrit + Math.floor(menpai.baseCritPlus * $rootScope.results.agility) + Math.floor(.64 * $rootScope.results.agility);
			// 会效
			$rootScope.results.critEffect = results.critEffect + Math.floor(menpai.baseCritEffPlus * $rootScope.results.agility);
			// 破防
			$rootScope.results.overcome = results.overcome + menpai.baseOvercome + (menpai.baseOvercomePlus * $rootScope.results.agility + .3 * $rootScope.results.strength);
			if (menpai.name == 'fenshan') {
				// 苍云招架
				$rootScope.results.parryBase = (results.parryBase + menpai.baseParryBase + $rootScope.results.agility * menpai.baseParryBasePlus);
				$rootScope.results.parryBase = $rootScope.results.parryBase / ($rootScope.results.parryBase + 1733.675) * 100 + 3;
				$rootScope.results.parryBase = $rootScope.results.parryBase.toFixed(2);
				// 苍云拆招
				$rootScope.results.parryValue = results.parryValue + menpai.baseParryValue + $rootScope.results.agility * menpai.baseParryValuePlus;
				$rootScope.results.parryValue = $rootScope.results.parryValue.toFixed(0);
			}
		} else if (menpai.type == 'spunk') {// 元气门派计算
			// 基础攻击
			$rootScope.results.basicAttack = results.attack + menpai.baseAttack + .18 * ($rootScope.results.spunk);
			$rootScope.results.basicAttack = Math.floor(($rootScope.results.basicAttack + buffBaseValue.basicAttack) * (1 + buffPercentValue.basicAttack / 100));
			// 面板攻击
			$rootScope.results.attack = Math.floor($rootScope.results.basicAttack * (1 + buffPercentValue.attack / 100) + menpai.baseAttackPlus * $rootScope.results.spunk + buffBaseValue.attack);
			// 会心
			$rootScope.results.crit = results.crit + menpai.baseCrit + Math.floor(menpai.baseCritPlus * $rootScope.results.spunk) + Math.floor(.64 * $rootScope.results.spirit);
			// 会效
			$rootScope.results.critEffect = results.critEffect + Math.floor(menpai.baseCritEffPlus * $rootScope.results.spunk); // + Math.floor(.15 * $rootScope.results.spirit);
			if (menpai.name == 'tianluo') {
				// 会心
				$rootScope.results.crit = results.crit + menpai.baseCrit + Math.floor(menpai.baseCritPlus * $rootScope.results.spunk) + Math.floor(.64 * (results.agility + $rootScope.role.agility));
				// 会效
				$rootScope.results.critEffect = results.critEffect + Math.floor(menpai.baseCritEffPlus * $rootScope.results.spunk);// + Math.floor(.15 * (results.agility + $rootScope.role.agility));
			}
			// 破防
			$rootScope.results.overcome = results.overcome + menpai.baseOvercome + (menpai.baseOvercomePlus + .3) * $rootScope.results.spunk;
		} else if (menpai.type == 'hps') {
			// 基础攻击
			$rootScope.results.basicAttack = results.attack + .18 * $rootScope.results.spunk;
			$rootScope.results.basicAttack = Math.floor(($rootScope.results.basicAttack + buffBaseValue.basicAttack) * (1 + buffPercentValue.basicAttack / 100));
			// 面板攻击
			$rootScope.results.attack = Math.floor($rootScope.results.basicAttack * (1 + buffPercentValue.attack / 100) + buffBaseValue.attack);
			// 基础治疗
			$rootScope.results.basicHeal = Math.floor((results.heal + menpai.baseHeal + buffBaseValue.basicHeal) * (1 + buffPercentValue.basicHeal / 100));
			// 面板治疗
			$rootScope.results.heal = Math.floor($rootScope.results.basicHeal * (1 + buffPercentValue.heal / 100) + menpai.baseHealPlus * $rootScope.results.spirit + buffBaseValue.heal);
			// 会心
			$rootScope.results.crit = results.crit + menpai.baseCrit + Math.floor(menpai.baseCritPlus * $rootScope.results.spirit) + Math.floor(.64 * $rootScope.results.spirit);
			// 会效
			$rootScope.results.critEffect = results.critEffect + Math.floor(menpai.baseCritEffPlus * $rootScope.results.spirit);// + Math.floor(.15 * $rootScope.results.spirit);
		} else if (menpai.type == 't') {
			// 闪避
			$rootScope.results.dodge = Math.floor((results.dodge + menpai.baseDodge) * (1 + buffPercentValue.dodge / 100) + $rootScope.results.body * menpai.baseDodgePlus + buffBaseValue.dodge);
			$rootScope.results.dodge = $rootScope.results.dodge / ($rootScope.results.dodge + 9025.3) * 100;
			$rootScope.results.dodge = $rootScope.results.dodge.toFixed(2) - -1 * buffFinalValue.dodge.toFixed(2);
			// 招架
			$rootScope.results.parryBase = ((results.parryBase + menpai.baseParryBase) * (1 + buffPercentValue.parryBase / 100) + $rootScope.results.body * menpai.baseParryBasePlus + buffBaseValue.parryBase);
			$rootScope.results.parryBase = $rootScope.results.parryBase / ($rootScope.results.parryBase + 6517.8) * 100 + 3;
			$rootScope.results.parryBase = $rootScope.results.parryBase.toFixed(2) - -1 * buffFinalValue.parryBase.toFixed(2);
			// 拆招
			$rootScope.results.parryValue = (results.parryValue + menpai.baseParryValue) * (1 + buffPercentValue.parryValue / 100) + $rootScope.results.body * menpai.baseParryValuePlus + buffBaseValue.parryValue;
			$rootScope.results.parryValue = Math.floor($rootScope.results.parryValue) - -1 * buffFinalValue.parryValue;
			// 非常规查看属性
			if (menpai.name == 'mingzun' || menpai.name == 'xisui') {
				// 基础攻击
				$rootScope.results.basicAttack = results.attack + .18 * $rootScope.results.spunk;
				$rootScope.results.basicAttack = Math.floor(($rootScope.results.basicAttack + buffBaseValue.basicAttack) * (1 + buffPercentValue.basicAttack / 100));
				// 面板攻击
				$rootScope.results.attack = Math.floor($rootScope.results.basicAttack * (1 + buffPercentValue.attack / 100) + buffBaseValue.attack);
				// 会心
				$rootScope.results.crit = results.crit + menpai.baseCrit + Math.floor(.3 * $rootScope.results.spirit);
				// 会效
				$rootScope.results.critEffect = results.critEffect + Math.floor(menpai.baseCritEffPlus * $rootScope.results.spirit) + Math.floor(.15 * $rootScope.results.spirit);
				// 破防
				$rootScope.results.overcome = results.overcome + menpai.baseOvercome + .25 * $rootScope.results.spunk;
			} else {
				// 基础攻击
				$rootScope.results.basicAttack = results.attack + .15 * $rootScope.results.strength;
				$rootScope.results.basicAttack = Math.floor(($rootScope.results.basicAttack + buffBaseValue.basicAttack) * (1 + buffPercentValue.basicAttack / 100));
				// 面板攻击
				$rootScope.results.attack = Math.floor($rootScope.results.basicAttack * (1 + buffPercentValue.attack / 100) + buffBaseValue.attack);
				// 会心
				$rootScope.results.crit = results.crit + menpai.baseCrit + Math.floor(.3 * $rootScope.results.agility);
				// 会效
				$rootScope.results.critEffect = results.critEffect + Math.floor(menpai.baseCritEffPlus * $rootScope.results.agility) + Math.floor(.15 * $rootScope.results.spirit);
				// 破防
				$rootScope.results.overcome = results.overcome + menpai.baseOvercome + .25 * $rootScope.results.strength;
			}
		}
		$rootScope.results.attack = Math.floor($rootScope.results.attack);
		$rootScope.results.crit = Math.floor(($rootScope.results.crit + buffBaseValue.crit) * (1 + buffPercentValue.crit / 100));
		$rootScope.results.crit = $rootScope.results.crit / 153.442;
		$rootScope.results.crit = $rootScope.results.crit - -1 * buffFinalValue.crit.toFixed(2);
		$rootScope.results.crit = $rootScope.results.crit.toFixed(2);
		$rootScope.results.critEffect = Math.floor(($rootScope.results.critEffect + buffBaseValue.critEffect) * (1 + buffPercentValue.critEffect / 100));
		$rootScope.results.critEffect = $rootScope.results.critEffect / 53.703 + 175;
		$rootScope.results.critEffect = $rootScope.results.critEffect - -1 * buffFinalValue.critEffect.toFixed(2);
		$rootScope.results.critEffect = $rootScope.results.critEffect.toFixed(2);
		$rootScope.results.overcome = Math.floor(($rootScope.results.overcome + buffBaseValue.overcome) * (1 + buffPercentValue.overcome / 100)) + buffFinalValue.overcome;
		$rootScope.results.overcomeRate = $rootScope.results.overcome / 153.442;
		$rootScope.results.overcomeRate = $rootScope.results.overcomeRate.toFixed(2);
		// 命中
		$rootScope.results.hit = Math.floor((results.hit + menpai.baseHit + buffBaseValue.hit) * (1 + buffPercentValue.hit / 100));
		$rootScope.results.hit = $rootScope.results.hit / 139.485 + 90;
		$rootScope.results.hit = $rootScope.results.hit - -1 * buffFinalValue.hit.toFixed(2);
		$rootScope.results.hit = $rootScope.results.hit.toFixed(2);
		// 无双
		$rootScope.results.strain = Math.floor((results.strain + buffBaseValue.strain) * (1 + buffPercentValue.strain / 100));
		$rootScope.results.strain = $rootScope.results.strain / 87.176;
		$rootScope.results.strain = $rootScope.results.strain.toFixed(2) - -1 * buffFinalValue.strain.toFixed(2);
		// 急速
		$rootScope.results.acceLevel = results.acce;
		$rootScope.results.acce = results.acce / 188.309;
		$rootScope.results.acce = $rootScope.results.acce.toFixed(2);
		// 内防
		$rootScope.results.magicShield = Math.floor((results.basicMagicShield + results.magicShield + menpai.baseMagicShield) * (1 + buffPercentValue.magicShield / 100) + $rootScope.results.body * menpai.baseMagicShieldPlus + buffBaseValue.magicShield);
		$rootScope.results.magicShield = $rootScope.results.magicShield / ($rootScope.results.magicShield + 6942.8) * 100;
		$rootScope.results.magicShield = $rootScope.results.magicShield.toFixed(2) - -1 * buffFinalValue.magicShield.toFixed(2);
		// 外防
		$rootScope.results.physicsShield = Math.floor((results.basicPhysicsShield + results.physicsShield + menpai.basePhysicsShield) * (1 + buffPercentValue.physicsShield / 100) + $rootScope.results.body * menpai.basePhysicsShieldPlus + buffBaseValue.physicsShield);
		$rootScope.results.physicsShield = $rootScope.results.physicsShield / ($rootScope.results.physicsShield + 6942.8) * 100;
		$rootScope.results.physicsShield = $rootScope.results.physicsShield.toFixed(2) - -1 * buffFinalValue.physicsShield.toFixed(2);
		// 御劲
		$rootScope.results.toughness = Math.floor((results.toughness + buffBaseValue.toughness) * (1 + buffPercentValue.toughness / 100));
		$rootScope.results.toughness = $rootScope.results.toughness / 15344.2 * 100;
		$rootScope.results.toughness = $rootScope.results.toughness.toFixed(2) - -1 * buffFinalValue.toughness.toFixed(2);
		// 化劲
		$rootScope.results.huajing = Math.floor((results.huajing + menpai.baseHuajing + buffBaseValue.huajing) * (1 + buffPercentValue.huajing / 100));
		$rootScope.results.huajing = $rootScope.results.huajing / ($rootScope.results.huajing + 3235.1) * 100;
		$rootScope.results.huajing = $rootScope.results.huajing.toFixed(2) - -1 * buffFinalValue.huajing.toFixed(2);
		// 装分
		$rootScope.results.score = Math.floor(results.score);
	};
}]);
