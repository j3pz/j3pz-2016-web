var app = angular.module('J3Homeland', ['ui.bootstrap', 'toastr'])
.config(['toastrConfig',function(toastrConfig) {
	angular.extend(toastrConfig, {
		maxOpened: 5,
		positionClass: 'toast-bottom-right',
		timeOut: 3000
	});
}]);

app.controller('FurnitureCtrl', ['$scope', '$http', 'toastr', '$sce', function($scope, $http, toastr, $sce) {
    $scope.data = [];
    $scope.fetch = function () {
        $http.get('https://apis.j3pz.com/furniture', {
            params: {
                category: $scope.category,
                source: $scope.source === '全部' ? undefined : $scope.source,
                limit: $scope.level,
                orderBy: $scope.orders[$scope.order].key,
                order: $scope.orders[$scope.order].order === 'asc' ? '1' : '0',
            },
        }).success(function(response) {
            $scope.data = response.data;
        });
    }

    $scope.chooseCategory = function(item) {
        $scope.category = item.key;
        $scope.fetch();
    }

    $scope.getIcon = function(item) {
        var position = item.key === $scope.category ? item.icon.check : item.icon.frame;
        var row = Math.floor(position / 19);
        var col = position % 19;
        return {
            "background-position-x": -52 * col,
            "background-position-y": -52 * row,
        };
    }

    $scope.searchAll = function() {
        $scope.category = undefined;
        toastr.info('数据量原因，全部类别下将不可查看全部来源或园宅币来源的家具。');
        $scope.source = '副本';
        $scope.fetch();
    }

    $scope.categorys = [
        [
            { key: 11000, value: '水池', icon: { file: 'icon1', check: 13, frame: 14 } },
            { key: 10900, value: '地面', icon: { file: 'icon1', check: 1, frame: 2 } },
            { key: 10100, value: '主屋', icon: { file: 'icon1', check: 161, frame: 162 } },
            { key: 10200, value: '厢房', icon: { file: 'icon1', check: 5, frame: 6 }  },
            { key: 10300, value: '亭台', icon: { file: 'icon1', check: 17, frame: 18 } },
            { key: 10500, value: '院墙', icon: { file: 'icon1', check: 21, frame: 22 } },
            { key: 10800, value: '路', icon: { file: 'icon2', check: 28, frame: 29 } },
            { key: 10700, value: '桥梁', icon: { file: 'icon1', check: 97, frame: 98 } },
            { key: 10600, value: '连廊', icon: { file: 'icon2', check: 20, frame: 21 } },
            { key: 11200, value: '摆边', icon: { file: 'icon1', check: 9, frame: 10 } },
            { key: 11300, value: '底座', icon: { file: 'icon2', check: 148, frame: 149 } },
            { key: 11400, value: '积木', icon: { file: 'icon2', check: 156, frame: 157 } },
        ],
        [
            { key: 20100, value: '单人床', icon: { file: 'icon1', check: 145, frame: 146 } },
            { key: 20200, value: '双人床', icon: { file: 'icon2', check: 72, frame: 73 } },
            { key: 20300, value: '柜架', icon: { file: 'icon2', check: 5, frame: 6 } },
            { key: 20400, value: '桌子', icon: { file: 'icon1', check: 69, frame: 70 } },
            { key: 20500, value: '椅子', icon: { file: 'icon1', check: 65, frame: 66 } },
            { key: 20600, value: '屏风', icon: { file: 'icon2', check: 48, frame: 49 } },
            { key: 20700, value: '地毯', icon: { file: 'icon1', check: 153, frame: 154 } },
            { key: 20800, value: '帘幔', icon: { file: 'icon2', check: 24, frame: 25 } },
            { key: 20900, value: '抱枕', icon: { file: 'icon1', check: 133, frame: 134 } },
            { key: 21000, value: '摆灯', icon: { file: 'icon1', check: 125, frame: 126 } },
            { key: 21100, value: '灯笼', icon: { file: 'icon1', check: 149, frame: 150 } },
            { key: 21200, value: '吊顶', icon: { file: 'icon1', check: 157, frame: 158 } },
            { key: 21300, value: '洗漱', icon: { file: 'icon2', check: 96, frame: 97 } },
            { key: 21500, value: '文艺', icon: { file: 'icon2', check: 92, frame: 93 } },
            { key: 21600, value: '挂墙', icon: { file: 'icon1', check: 165, frame: 166 } },
            { key: 21700, value: '小玩意', icon: { file: 'icon2', check: 104, frame: 105 } },
            { key: 21900, value: '用具', icon: { file: 'icon2', check: 116, frame: 117 } },
            { key: 22000, value: '其他', icon: { file: 'icon2', check: 52, frame: 53 } },
        ],
        [
            { key: 31000, value: '花草刷', icon: { file: 'icon2', check: 152, frame: 153 } },
            { key: 30100, value: '花卉', icon: { file: 'icon2', check: 9, frame: 10 } },
            { key: 30200, value: '藤蔓', icon: { file: 'icon1', check: 109, frame: 110 } },
            { key: 30300, value: '灌木', icon: { file: 'icon2', check: 1, frame: 2 } },
            { key: 30400, value: '树木', icon: { file: 'icon2', check: 68, frame: 69 } },
            { key: 30500, value: '水池类', icon: { file: 'icon2', check: 76, frame: 77 } },
            { key: 30600, value: '庭灯', icon: { file: 'icon2', check: 88, frame: 89 } },
            { key: 31300, value: '盆栽', icon: { file: 'icon1', check: 93, frame: 94 } },
            { key: 31400, value: '摆件', icon: { file: 'icon1', check: 129, frame: 130 } },
            { key: 30700, value: '雕像', icon: { file: 'icon1', check: 101, frame: 102 } },
            { key: 30800, value: '造景', icon: { file: 'icon2', check: 128, frame: 129 } },
            { key: 30900, value: '特效', icon: { file: 'icon1', check: 105, frame: 106 } },
            { key: 31200, value: '假山', icon: { file: 'icon2', check: 164, frame: 165 } },
            { key: 31100, value: '其他', icon: { file: 'icon2', check: 13, frame: 14 } },
        ],
        [
            { key: 41000, value: '趣味', icon: { file: 'icon2', check: 168, frame: 169 } },
            { key: 41100, value: '种植', icon: { file: 'icon1', check: 117, frame: 118 } },
            { key: 40100, value: '背挂', icon: { file: 'icon1', check: 137, frame: 138 } },
            { key: 40200, value: '腰挂', icon: { file: 'icon2', check: 108, frame: 109 } },
            { key: 40300, value: '披风', icon: { file: 'icon2', check: 44, frame: 45 } },
            { key: 40400, value: '模特架', icon: { file: 'icon2', check: 36, frame: 37 } },
            { key: 40500, value: '宠物窝', icon: { file: 'icon1', check: 141, frame: 142 } },
            { key: 40600, value: '马厩', icon: { file: 'icon2', check: 32, frame: 33 } },
            { key: 40900, value: '知交', icon: { file: 'icon2', check: 136, frame: 137 } },
        ],
        [
            { key: 90100, value: '全局图', icon: { file: 'icon2', check: 132, frame: 133 } },
            { key: 90200, value: '局部图', icon: { file: 'icon1', check: 33, frame: 34 } },
            { key: 90300, value: '基座', icon: { file: 'icon2', check: 160, frame: 1961 } },
        ]
    ];
    $scope.category = 10100;

    $scope.sources = [
        '全部',
        '园宅币',
        '活动',
        '园宅会赛',
        '隐藏',
        '生活技能',
        '声望',
        '奇遇',
        '侠义值',
        '飞沙令',
        '名剑大会',
        '战阶',
        '师徒值',
        '管家',
        '宠物游历',
        '小区',
        '监本印文',
        '雀神点数',
        '江湖贡献值',
        '入住家园赠送',
        '商城',
        '副本',
        '未知',
    ];

    $scope.shouldDisable = function(item) {
        return $scope.category === undefined && ['全部', '园宅币'].indexOf(item) >= 0;
    }

    $scope.setSource = function(source) {
        if (!$scope.shouldDisable(source)) {
            $scope.source = source;
            $scope.fetch();
        }
    }

    $scope.source = '全部';

    $scope.levels = [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
    ];

    $scope.level = 15;

    $scope.setLevel = function(level) {
        $scope.level = level;
        $scope.fetch();
    }

    $scope.orders = [
        { key: 'beauty', order: 'desc', desc: '景观 - 降序' },
        { key: 'practicality', order: 'desc', desc: '实用 - 降序' },
        { key: 'robustness', order: 'desc', desc: '坚固 - 降序' },
        { key: 'environment', order: 'desc', desc: '风水 - 降序' },
        { key: 'fun', order: 'desc', desc: '趣味 - 降序' },
        { key: 'price', order: 'asc', desc: '价格 - 升序' },
        { key: 'beauty', order: 'asc', desc: '景观 - 升序' },
        { key: 'practicality', order: 'asc', desc: '实用 - 升序' },
        { key: 'robustness', order: 'asc', desc: '坚固 - 升序' },
        { key: 'environment', order: 'asc', desc: '风水 - 升序' },
        { key: 'fun', order: 'asc', desc: '趣味 - 升序' },
        { key: 'price', order: 'desc', desc: '价格 - 降序' },
    ];

    $scope.order = 5;
    $scope.setOrder = function(order) {
        $scope.order = order;
        $scope.fetch();
    }

    $scope.furniture = {};

    $scope.preview = function(item) {
        $scope.furniture = item;
    }

    $scope.fetch();

    $scope.html = function(text) {
		return $sce.trustAsHtml(text.replace(/\\n/g, '<br />'));
	};
}]);
