var whRecipes = {
	yangMing: [
		{name: '《点穴截脉·阳明指》经脉图残页', id: '0', effect: 'frameMinus', value: 2, desc: '运功时间减少0.125秒', active: false},
		{name: '《点穴截脉·阳明指》经脉图断篇', id: '1', effect: 'frameMinus', value: 2, desc: '运功时间减少0.125秒', active: false},
		{name: '《点穴截脉·阳明指》注解残页', id: '2', effect: 'costMinusPercent', value: 5, desc: '施展招式的消耗降低5%', active: false},
		{name: '《点穴截脉·阳明指》注解断篇', id: '3', effect: 'costMinusPercent', value: 10, desc: '施展招式的消耗降低10%', active: false},
		{name: '《点穴截脉·阳明指》参悟残页', id: '4', effect: 'damageAddPercent', value: 3, desc: '招式的伤害提高3%', active: false},
		{name: '《点穴截脉·阳明指》参悟断篇', id: '5', effect: 'damageAddPercent', value: 4, desc: '招式的伤害提高4%', active: false},
		{name: '《点穴截脉·阳明指》秘诀残页', id: '6', effect: 'critAddPercent', value: 2, desc: '招式的会心提高2%', active: false},
		{name: '《点穴截脉·阳明指》秘诀断篇', id: '7', effect: 'critAddPercent', value: 3, desc: '招式的会心提高3%', active: false}
	],
	shangYang: [
		{name: '《点穴截脉·商阳指》注解残页', id: '0', effect: 'costMinusPercent', value: 5, desc: '施展招式的消耗降低5%', active: false},
		{name: '《点穴截脉·商阳指》注解断篇', id: '1', effect: 'costMinusPercent', value: 5, desc: '施展招式的消耗降低5%', active: false},
		{name: '《点穴截脉·商阳指》注解绝章', id: '2', effect: 'costMinusPercent', value: 10, desc: '施展招式的消耗降低10%', active: false},
		{name: '《点穴截脉·商阳指》手抄残页', id: '3', effect: 'durationAdd', value: 48, desc: '招式效果持续时间增加3秒', active: false},
		{name: '《点穴截脉·商阳指》真传残页', id: '4', effect: 'distanceAdd', value: 4, desc: '招式的有效距离增加4尺', active: false},
		{name: '《点穴截脉·商阳指》人偶图残页', id: '5', effect: 'debuffAdd', value: 4, desc: '招式附加噬骨不利气劲，每层受混元性内功伤害提高2%，持续15秒，最多叠加5层', active: false},
		{name: '《点穴截脉·商阳指》人偶图断篇', id: '6', effect: 'debuffAdd', value: 4, desc: '招式附加噬骨不利气劲，每层受混元性内功伤害提高2%，持续15秒，最多叠加5层', active: false}
	],
	lanCui: [
		{name: '《百花拂穴手·兰摧玉折》穴位图残页', id: '0', effect: 'cdMinus', value: 8, desc: '调息时间减少0.5秒', active: false},
		{name: '《百花拂穴手·兰摧玉折》穴位图断篇', id: '1', effect: 'cdMinus', value: 8, desc: '调息时间减少0.5秒', active: false},
		{name: '《百花拂穴手·兰摧玉折》穴位图绝章', id: '2', effect: 'cdMinus', value: 8, desc: '调息时间减少0.5秒', active: false},
		{name: '《百花拂穴手·兰摧玉折》经脉图残页', id: '3', effect: 'frameMinus', value: 4, desc: '运功时间减少0.25秒', active: false},
		{name: '《百花拂穴手·兰摧玉折》注解残页', id: '4', effect: 'costMinusPercent', value: 5, desc: '施展招式的消耗降低5%', active: false},
		{name: '《百花拂穴手·兰摧玉折》注解断篇', id: '5', effect: 'costMinusPercent', value: 10, desc: '施展招式的消耗降低10%', active: false},
		{name: '《百花拂穴手·兰摧玉折》手抄残页', id: '6', effect: 'durationAdd', value: 48, desc: '招式效果持续时间增加3秒', active: false}
	],
	zhongLin: [
		{name: '《百花拂穴手·钟林毓秀》经脉图残页', id: '0', effect: 'frameMinus', value: 2, desc: '运功时间减少0.125秒', active: false},
		{name: '《百花拂穴手·钟林毓秀》经脉图断篇', id: '1', effect: 'frameMinus', value: 2, desc: '运功时间减少0.125秒', active: false},
		{name: '《百花拂穴手·钟林毓秀》经脉图绝章', id: '2', effect: 'frameMinus', value: 4, desc: '运功时间减少0.25秒', active: false},
		{name: '《百花拂穴手·钟林毓秀》注解残页', id: '3', effect: 'costMinusPercent', value: 5, desc: '施展招式的消耗降低5%', active: false},
		{name: '《百花拂穴手·钟林毓秀》注解断篇', id: '4', effect: 'costMinusPercent', value: 10, desc: '施展招式的消耗降低10%', active: false},
		{name: '《百花拂穴手·钟林毓秀》手抄残页', id: '5', effect: 'durationAdd', value: 48, desc: '招式效果持续时间增加3秒', active: false},
		{name: '《百花拂穴手·钟林毓秀》人偶图残页', id: '6', effect: 'debuffAdd', value: 4, desc: '招式附加噬骨不利气劲，每层受混元性内功伤害提高2%，持续15秒，最多叠加5层', active: false},
		{name: '《百花拂穴手·钟林毓秀》人偶图断篇', id: '7', effect: 'debuffAdd', value: 4, desc: '招式附加噬骨不利气劲，每层受混元性内功伤害提高2%，持续15秒，最多叠加5层', active: false}
	],
	kuaiXue: [
		{name: '《百花拂穴手·快雪时晴》参悟残页', id: '0', effect: 'damageAddPercent', value: 3, desc: '伤害提高3%', active: false},
		{name: '《百花拂穴手·快雪时晴》参悟断篇', id: '1', effect: 'damageAddPercent', value: 4, desc: '伤害提高4%', active: false},
		{name: '《百花拂穴手·快雪时晴》参悟绝章', id: '2', effect: 'damageAddPercent', value: 5, desc: '伤害提高5%', active: false},
		{name: '《百花拂穴手·快雪时晴》人偶图残页', id: '3', effect: 'debuffAdd', value: 4, desc: '招式附加噬骨不利气劲，每层受混元性内功伤害提高2%，持续15秒，最多叠加5层', active: false},
		{name: '《百花拂穴手·快雪时晴》详解残页', id: '4', effect: 'hitAddPercent', value: 1, desc: '命中提高1%', active: false},
		{name: '《百花拂穴手·快雪时晴》详解断篇', id: '5', effect: 'hitAddPercent', value: 2, desc: '命中提高2%', active: false},
		{name: '《百花拂穴手·快雪时晴》注解残页', id: '6', effect: 'costMinusPercent', value: 10, desc: '施展招式的消耗降低10%', active: false},
		{name: '《百花拂穴手·快雪时晴》注解断篇', id: '7', effect: 'costMinusPercent', value: 15, desc: '施展招式的消耗降低15%', active: false}
	]
};
