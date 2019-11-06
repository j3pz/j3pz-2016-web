/* @require /components/config/config.js */
app.controller('SchoolListCtrl', ['$scope', function($scope) {
	$scope.schools = [
		{name: '万花', icon: 'jx3icon-wh', xinfa: 2, type2: 'hps',	xinfa1: 'huajian',	xinfa2: 'lijing',	xinfaName1: '花间游',	xinfaName2: '离经易道',	color: '#2B2527', size: 64, hover: false},
		{name: '少林', icon: 'jx3icon-sl', xinfa: 2, type2: 't',	xinfa1: 'yijin',	xinfa2: 'xisui',	xinfaName1: '易筋经',	xinfaName2: '洗髓经',	color: '#7C382B', size: 64, hover: false},
		{name: '明教', icon: 'jx3icon-mj', xinfa: 2, type2: 't',	xinfa1: 'fenying',	xinfa2: 'mingzun',	xinfaName1: '焚影圣诀',	xinfaName2: '明尊琉璃体', color: '#C50C26', size: 64, hover: false},
		{name: '唐门', icon: 'jx3icon-tm', xinfa: 2, type2: 'dps',	xinfa1: 'tianluo',	xinfa2: 'jingyu',	xinfaName1: '天罗诡道',	xinfaName2: '惊羽诀',	color: '#2B4C81', size: 64, hover: false},
		{name: '七秀', icon: 'jx3icon-qx', xinfa: 2, type2: 'hps',	xinfa1: 'bingxin',	xinfa2: 'yunchang',	xinfaName1: '冰心诀',	xinfaName2: '云裳心经',	color: '#E64666', size: 64, hover: false},
		{name: '五毒', icon: 'jx3icon-wd', xinfa: 2, type2: 'hps',	xinfa1: 'dujing',	xinfa2: 'butian',	xinfaName1: '毒经',		xinfaName2: '补天诀',	color: '#4B3751', size: 64, hover: false},
		{name: '纯阳', icon: 'jx3icon-cy', xinfa: 2, type2: 'dps',	xinfa1: 'zixia',	xinfa2: 'taixu',	xinfaName1: '紫霞功',	xinfaName2: '太虚剑意',	color: '#0E84C2', size: 64, hover: false},
		{name: '天策', icon: 'jx3icon-tc', xinfa: 2, type2: 't',	xinfa1: 'aoxue',	xinfa2: 'tielao',	xinfaName1: '傲血战意',	xinfaName2: '铁牢律',	color: '#502E27', size: 64, hover: false},
		{name: '丐帮', icon: 'jx3icon-gb', xinfa: 1, type2: 'dps',	xinfa1: 'xiaochen',	xinfa2: '',			xinfaName1: '笑尘诀',	xinfaName2: '',			color: '#783A18', size: 64, hover: false},
		{name: '藏剑', icon: 'jx3icon-cj', xinfa: 2, type2: 'dps',	xinfa1: 'cangjian',	xinfa2: 'cangjian',	xinfaName1: '问水决',	xinfaName2: '山居剑意',	color: '#E4B906', size: 64, hover: false},
		{name: '苍云', icon: 'jx3icon-sd', xinfa: 2, type2: 't',	xinfa1: 'fenshan',	xinfa2: 'tiegu',	xinfaName1: '分山劲',	xinfaName2: '铁骨衣',	color: '#565656', size: 64, hover: false},
		{name: '长歌', icon: 'jx3icon-cg', xinfa: 2, type2: 'hps',	xinfa1: 'mowen',	xinfa2: 'xiangzhi',	xinfaName1: '莫问',		xinfaName2: '相知',		color: '#44919F', size: 64, hover: false},
		{name: '霸刀', icon: 'jx3icon-bd', xinfa: 1, type2: 'dps',	xinfa1: 'beiao',	xinfa2: '',			xinfaName1: '北傲诀',	xinfaName2: '',			color: '#5064E8', size: 64, hover: false},
		{name: '蓬莱', icon: 'jx3icon-pl', xinfa: 1, type2: 'dps',	xinfa1: 'linghai',	xinfa2: '',			xinfaName1: '凌海诀',	xinfaName2: '',			color: '#162641', size: 64, hover: false},
		{name: '凌雪', icon: 'jx3icon-lx', xinfa: 1, type2: 'dps',	xinfa1: 'yinlong',	xinfa2: '',			xinfaName1: '隐龙诀',	xinfaName2: '',			color: '#F02820', size: 64, hover: false}
	];
}]);
