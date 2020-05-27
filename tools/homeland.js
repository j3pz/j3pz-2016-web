var app = angular.module('J3Homeland', ['ui.bootstrap', 'toastr'])
.config(['toastrConfig',function(toastrConfig) {
	angular.extend(toastrConfig, {
		maxOpened: 5,
		positionClass: 'toast-bottom-right',
		timeOut: 3000
	});
}]);

app.controller('FurnitureCtrl', ['$scope', '$http', 'toastr',  function($scope, $http, toastr) {
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

    $scope.categorys = [
        [
            { key: 11000, value: '水池' },
            { key: 10900, value: '地面' },
            { key: 10100, value: '主屋' },
            { key: 10200, value: '厢房' },
            { key: 10300, value: '亭台' },
            { key: 10500, value: '院墙' },
            { key: 10800, value: '路' },
            { key: 10700, value: '桥梁' },
            { key: 10600, value: '连廊' },
            { key: 11200, value: '摆边' },
            { key: 11300, value: '底座' },
            { key: 11400, value: '积木' },
        ],
        [
            { key: 20100, value: '单人床' },
            { key: 20200, value: '双人床' },
            { key: 20300, value: '柜架' },
            { key: 20400, value: '桌子' },
            { key: 20500, value: '椅子' },
            { key: 20600, value: '屏风' },
            { key: 20700, value: '地毯' },
            { key: 20800, value: '帘幔' },
            { key: 20900, value: '抱枕' },
            { key: 21000, value: '摆灯' },
            { key: 21100, value: '灯笼' },
            { key: 21200, value: '吊顶' },
            { key: 21300, value: '洗漱' },
            { key: 21500, value: '文艺' },
            { key: 21600, value: '挂墙' },
            { key: 21700, value: '小玩意' },
            { key: 21900, value: '用具' },
            { key: 22000, value: '其他' },
        ],
        [
            { key: 31000, value: '花草刷' },
            { key: 30100, value: '花卉' },
            { key: 30200, value: '藤蔓' },
            { key: 30300, value: '灌木' },
            { key: 30400, value: '树木' },
            { key: 30500, value: '水池类' },
            { key: 30600, value: '庭灯' },
            { key: 31300, value: '盆栽' },
            { key: 31400, value: '摆件' },
            { key: 30700, value: '雕像' },
            { key: 30800, value: '造景' },
            { key: 30900, value: '特效' },
            { key: 31200, value: '假山' },
            { key: 31100, value: '其他' },
        ],
        [
            { key: 41000, value: '趣味' },
            { key: 41100, value: '种植' },
            { key: 40100, value: '背挂' },
            { key: 40200, value: '腰挂' },
            { key: 40300, value: '披风' },
            { key: 40400, value: '模特架' },
            { key: 40500, value: '宠物窝' },
            { key: 40600, value: '马厩' },
            { key: 40900, value: '知交' },
        ],
        [
            { key: 90000, value: '图纸' },
            { key: 90100, value: '全局图' },
            { key: 90200, value: '局部图' },
            { key: 90300, value: '基座' },
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

    $scope.setSource = function(source) {
        $scope.source = source;
        $scope.fetch();
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
        { key: 'beauty', order: 'asc', desc: '景观 - 升序' },
        { key: 'practicality', order: 'asc', desc: '实用 - 升序' },
        { key: 'robustness', order: 'asc', desc: '坚固 - 升序' },
        { key: 'environment', order: 'asc', desc: '风水 - 升序' },
        { key: 'fun', order: 'asc', desc: '趣味 - 升序' },
        { key: 'price', order: 'asc', desc: '价格 - 升序' },
        { key: 'beauty', order: 'desc', desc: '景观 - 降序' },
        { key: 'practicality', order: 'desc', desc: '实用 - 降序' },
        { key: 'robustness', order: 'desc', desc: '坚固 - 降序' },
        { key: 'environment', order: 'desc', desc: '风水 - 降序' },
        { key: 'fun', order: 'desc', desc: '趣味 - 降序' },
        { key: 'price', order: 'desc', desc: '价格 - 降序' },
    ];

    $scope.order = 5;
    $scope.setOrder = function(order) {
        $scope.order = order;
        $scope.fetch();
    }

    $scope.fetch();
}]);
