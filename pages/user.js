/*
 * @require /components/config/config.js
 */

var app = angular.module('J3pzUser', ['toastr']);

app.controller('UserCtrl', ['$scope', '$rootScope', '$http', 'toastr', '$location', function($scope, $rootScope, $http, toastr, $location) {
	$scope.listShow = 'user';
	$scope.panelShow = '';

	$rootScope.isUser = true;

	$scope.strengthenDesc = ['不精炼', '精炼一级', '精炼二级', '精炼三级', '精炼四级', '精炼五级', '满精炼'];
	$scope.magicStoneLevelDesc = ['', '一级', '二级', '三级', '四级', '五级', '六级', '七级', '八级'];

	var schoolMap = {
		huajian: '花间游',
		yijin: '易筋经',
		tianluo: '天罗诡道',
		fenying: '焚影圣诀',
		bingxin: '冰心诀',
		dujing: '毒经',
		zixia: '紫霞功',
		mowen: '莫问',
		jingyu: '惊羽诀',
		aoxue: '傲血战意',
		xiaochen: '笑尘诀',
		taixu: '太虚剑意',
		cangjian: '藏剑',
		fenshan: '分山劲',
		lijing: '离经易道',
		yunchang: '云裳心经',
		butian: '补天诀',
		xiangzhi: '相知',
		xisui: '洗髓经',
		mingzun: '明尊琉璃体',
		tielao: '铁牢律',
		tiegu: '铁骨衣',
		beiao: '北傲诀'
	};

	$scope.sendActivateMail = function() {
		var token = localStorage.getItem('token');
		$http.get(config.apiBase + 'user/activate', {
			headers: {'Authorization': 'Bearer ' + token}
		})
		.success(function(response) {
			toastr.info('邮件发送成功');
		})
		.error(function(response) {
			toastr.error(response.errors[0].detail);
		});
	};

	$scope.getCaseList = function() {
		$scope.caseList = [];
		var token = localStorage.getItem('token');
		$http.get(config.apiBase + 'user/case', {
			headers: {'Authorization': 'Bearer ' + token}
		})
		.success(function(response) {
			response = response.data;
			angular.forEach(response, function(value, key) {
				var savedCase = {
					name: value.name,
					id: value.id,
					school: schoolMap[value.school],
					isEditing: false,
					newName: value.name
				};
				this.push(savedCase);
			}, $scope.caseList);
		})
		.error(function(response) {
			toastr.error(response.errors[0].detail);
		});
	};

	$scope.switchPanel = function(name) {
		$scope.panelShow = name;
	};

	$scope.changePass = function(change) {
		if (change.newPass == '' || change.oldPass == '') {
			toastr.error('密码不能为空');
		} else if (change.newPass == change.confirm) {
			var token = localStorage.getItem('token');
			$http.put(config.apiBase + 'user/password', change, {
				headers: {'Authorization': 'Bearer ' + token}
			}).success(function(response) {
				toastr.success('更改成功');
			})
			.error(function(response) {
				toastr.error('更改失败, ' + response.errors[0].detail);
			});
		} else {
			toastr.error('两次输入密码不一致');
		}
	};

	$scope.editCaseName = function(savedCase) {
		var newName = savedCase.newName;
		var csid = savedCase.id;
		if (newName == savedCase.name) {
			savedCase.isEditing = false;
			return;
		}
		var token = localStorage.getItem('token');
		$http.put(config.apiBase + 'user/case/' + csid + '/name', {name: newName}, {
			headers: {'Authorization': 'Bearer ' + token}
		}).success(function(response) {
			toastr.success('更改成功');
			savedCase.name = newName;
		})
		.error(function(response) {
			toastr.error('更改失败, ' + response.errors[0].detail);
		})
		.finally(function() {
			savedCase.isEditing = false;
		});
	};
	$scope.keyup = function(e, savedCase) {
		if (e.keyCode == 13) $scope.editCaseName(savedCase);
	};

	$scope.deleteCase = function(savedCase) {
		var csid = savedCase.id;
		var token = localStorage.getItem('token');
		$http.delete(config.apiBase + 'user/case/' + csid, {
			headers: {'Authorization': 'Bearer ' + token}
		}).success(function(response) {
			toastr.success('删除成功');
			$scope.getCaseList();
		})
		.error(function(response) {
			toastr.error('删除失败, ' + response.errors[0].detail);
		});
	};

	$scope.getPreference = function() {
		$scope.preference = {};
		var token = localStorage.getItem('token');
		$http.get(config.apiBase + 'user', {
			headers: {'Authorization': 'Bearer ' + token}
		})
		.success(function(response) {
			response = response.data;
			$scope.preference.range = [Number(response.prefer.quality[0]), Number(response.prefer.quality[1])];
			$scope.preference.embedLevel = response.prefer.magicStoneLevel;
			$scope.preference.strengthen = response.prefer.strengthen;
			$scope.strengthenHover = response.prefer.strengthen;
			var qualitySlider = $('input.slider-input').slider({
				range: true,
				min: 450,
				max: 1400,
				values: $scope.preference.range,
				step: 5,
				tooltip: 'hide'
			});
			qualitySlider.slider('setValue', $scope.preference.range);
			qualitySlider.on('slide', function(event) {
				$scope.preference.range[0] = event.value[0];
				$scope.preference.range[1] = event.value[1];
				$scope.$apply();
			});
			qualitySlider.on('slideStop', function(event) {
				$scope.changePreference({
					target: 'quality',
					quality: event.value
				});
			});
		});
	};

	$scope.changePreference = function(change) {
		var token = localStorage.getItem('token');
		$http.put(config.apiBase + 'user/preference', change, {
			headers: {'Authorization': 'Bearer ' + token}
		}).success(function(response) {
			toastr.success('设置成功');
		})
		.error(function(response) {
			toastr.error('设置失败, ' + response.errors[0].detail);
		});
	};

	$scope.setStrengthen = function(n, isHover) {
		$scope.strengthenHover = n;
		if (!isHover) {
			$scope.preference.strengthen = n;
			$scope.changePreference({
				target: 'strengthen',
				strengthen: n
			});
		}
	};

	$scope.setEmbedLevel = function(n) {
		$scope.preference.embedLevel = n;
		$scope.changePreference({
			target: 'magicStoneLevel',
			magicStoneLevel: n
		});
	};

	$scope.switchList = function(name) {
		$scope.listShow = name;
		if (name == 'case') {
			$scope.getCaseList();
		}
		if (name == 'preference') {
			$scope.getPreference();
		}
	};

	var panel = $location.path();
	if (panel != '') {
		var pathArr = panel.split('/');
		var tab = pathArr[pathArr.length - 1];
		$scope.switchList(tab);
	}
}]);
