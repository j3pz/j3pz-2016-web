// "use strict"
$(document).ready(function () {
  //JS库初始化
  $('#modal1').openModal();
  if (getCookie("ll_about") != null) {
    $('#modal1').closeModal();
  }
  $('.btnModal').click(function () {
    $('#modal1').openModal();
  });





  $('select').material_select();
  $('.dropdown-button').dropdown({
    inDuration: 300,
    outDuration: 225,
    constrain_width: false, // Does not change width of dropdown to that of the activator
    hover: true, // Activate on hover
    gutter: 0, // Spacing from edge
    belowOrigin: false // Displays dropdown below the button
  });


  $("div[data-skill='ymShanghai'] input")[0].value = "阳明伤害4%";
  $($("div[data-skill='ymShanghai'] li")[1]).addClass("active selected");
  $("div[data-skill='ymHuixin'] input")[0].value = "阳明会心3%";
  $($("div[data-skill='ymHuixin'] li")[1]).addClass("active selected");

  $("div[data-buff='yanXi'] input")[0].value = "佳·烧尾宴";
  $($("div[data-buff='yanXi'] li")[3]).addClass("active selected");
  $("div[data-food='yishuZq'] input")[0].value = "佳·白信丹（会心）";
  $($("div[data-food='yishuZq'] li")[4]).addClass("active selected");
  $("div[data-food='yishuFz'] input")[0].value = "珍·益神丹（元气）";
  $($("div[data-food='yishuFz'] li")[3]).addClass("active selected");
  $("div[data-food='pengrenZq'] input")[0].value = "珍·金乳酥（会心）";
  $($("div[data-food='pengrenZq'] li")[9]).addClass("active selected");
  $("div[data-food='pengrenFz'] input")[0].value = "珍·云梦肉（元气）";
  $($("div[data-food='pengrenFz'] li")[3]).addClass("active selected");
  $("div[data-buff='zhenFa'] input")[0].value = "天鼓雷音阵";
  $($("div[data-buff='zhenFa'] li")[1]).addClass("active selected");

  $('.radio-button').children().click(function () {
    //奇穴按钮
    $(this).removeClass("waves-teal btn-flat");
    $(this).addClass("waves-light btn chosen");
    $(this).siblings().addClass("waves-teal btn-flat");
    $(this).siblings().removeClass("waves-light btn chosen");
  });

  function trimStr(str) { return str.replace(/(^\s*)|(\s*$)/g, ""); }
  //cookie读取
  if(getCookie("ll_yuanQi")!=null){
      $("input[data-attributes='yuanQi']")[0].value = getCookie("ll_yuanQi");
      $("input[data-attributes='gongJi']")[0].value = getCookie("ll_gongJi");
      $("input[data-attributes='mingZhong']")[0].value = getCookie("ll_mingZhong");
      $("input[data-attributes='huiXin']")[0].value = getCookie("ll_huiXin");
      $("input[data-attributes='huiXiao']")[0].value = getCookie("ll_huiXiao");
      $("input[data-attributes='jiaSu']")[0].value = getCookie("ll_jiaSu");
      $("input[data-attributes='poFang']")[0].value = getCookie("ll_poFang");
      $("input[data-attributes='wuShuang']")[0].value = getCookie("ll_wuShuang");
  }








  //所有所需变量
  // 基本属性变量
  var propertyCal = {
    huiXin:4143.925,
    huiXiao:1506.6,
    mingZhong:3424.725,
    wuShuang:2568.35,
    jiaSu:4717.425,
    poFang:3616.925
  }
  //叠加常驻或平摊计算增益后的属性量
  resultAll = {
    rjiaSuPoint:0
  };
  var property = {
    yuanQi: $("input[data-attributes='yuanQi']")[0].value,
    gongJi: $("input[data-attributes='gongJi']")[0].value,
    gongJiJiChu:$("input[data-attributes='gongJi']")[0].value - $("input[data-attributes='yuanQi']")[0].value*1.95,
    mingZhong: $("input[data-attributes='mingZhong']")[0].value / 100,
    huiXin: $("input[data-attributes='huiXin']")[0].value / 100,
    huiXiao: $("input[data-attributes='huiXiao']")[0].value / 100,
    jiaSu: $("input[data-attributes='jiaSu']")[0].value / 100,
    poFang: $("input[data-attributes='poFang']")[0].value,
    wuShuang: $("input[data-attributes='wuShuang']")[0].value / 100,
    poFangJiChu: $("input[data-attributes='poFang']")[0].value - $("input[data-attributes='yuanQi']")[0].value*0.09
  }

  // 阳明秘籍
  var ymYungong = parseFloat($("div[data-skill='ymYungong'] input")[0].value.substr(4) == "秘籍" ? 0 : $("div[data-skill='ymYungong'] input")[0].value.substr(4));
  var ymShanghai = parseFloat($("div[data-skill='ymShanghai'] input")[0].value.substr(4) == "秘籍" ? 0 : $("div[data-skill='ymShanghai'] input")[0].value.substr(4))/100;
  var ymHuixin = parseFloat($("div[data-skill='ymHuixin'] input")[0].value.substr(4) == "秘籍" ? 0 : $("div[data-skill='ymHuixin'] input")[0].value.substr(4))/100;
//-------------------------------------------------------------------------------------------
  //JS更改数值时需调用
  function propertyChange() {
      property.yuanQi = $("input[data-attributes='yuanQi']")[0].value;
      property.gongJi = $("input[data-attributes='gongJi']")[0].value;
      property.gongJiJiChu = $("input[data-attributes='gongJi']")[0].value - $("input[data-attributes='yuanQi']")[0].value * 1.95;
      property.mingZhong = $("input[data-attributes='mingZhong']")[0].value / 100;
      property.huiXin = $("input[data-attributes='huiXin']")[0].value / 100;
      property.huiXiao = $("input[data-attributes='huiXiao']")[0].value / 100;
      property.jiaSu = $("input[data-attributes='jiaSu']")[0].value / 100;
      property.poFang = $("input[data-attributes='poFang']")[0].value;
      property.wuShuang = $("input[data-attributes='wuShuang']")[0].value / 100;
      property.poFangJiChu = $("input[data-attributes='poFang']")[0].value - $("input[data-attributes='yuanQi']")[0].value * 0.09;
  }
      propertyChange();
  //属性更改事件
  for (var i = 0; i < $('input[type=text]').length; i++) {
    $('input[type=text]')[i].addEventListener("input", function () {
      propertyChange();
      ymDutiao = jiasuCal(1.75 + ymYungong);
      gcd = jiasuCal(1.5);
    })
  }
//-------------------------------------------------------------------------------------------
//加速计算
  function jiasuCal(time) {
    var jiasuPercentCal = property.jiaSu;
    var jiasuPointCal = Math.round(jiasuPercentCal * propertyCal.jiaSu, 0);
    var extraJiasulv = 60;//梦歌
    var extraJiasuPoint = resultAll.rjiaSuPoint;
    var actualJiasuPoint = Math.min(1179, jiasuPointCal + extraJiasuPoint);
    var actualJiasuPercentCal = Math.min(0.25, actualJiasuPoint / propertyCal.jiaSu + extraJiasulv / 1024);
    //当前加速下的读条时间，time为初始读条
    function dutiaoCal(time) {
      return Math.floor(Math.ceil(time / 0.0625, 0) * 1024 / Math.min(1280, Math.floor(Math.floor(actualJiasuPoint / (propertyCal.jiaSu / 100) * 10.24)) + extraJiasulv + 1024)) * 0.0625
    }
    return dutiaoCal(time);
  }
    //阳明读条时间
    var ymDutiao = jiasuCal(1.75 + ymYungong);
    var gcd = jiasuCal(1.5);

//-------------------------------------------------------------------------------------------
  //增益计算表(模板）
  var result = {
    ryuanQi: [],
    rgenGu: [],
    rgongJiJiChuPoint: [],
    rgongJiPercent: [],
    rmingZhongPoint: [],
    rmingZhongPercent: [],
    rhuiXinPoint: [],
    rhuiXinPercent: [],
    rhuiXiaoPoint: [],
    rhuiXiaoPercent: [],
    rjiaSuPoint: [],
    rjiaSuPercent: [],
    rwuShuangPoint: [],
    rwuShuangPercent: [],
    rpoFangJiChuNum: [],
    rpoFangPercent: [],
    ryiShangPercent: [],
    rshangHaiJiaChengPercent: []
  }
//-------------------------------------------------------------------------------------------
  var time = 180;//战斗时间
  function coverageCal(time1, time2, time3) {
    //time1 总时间，time2 CD时间，time3 持续时间
    return (time1 % time2 > time3 ? (Math.floor(time1 / time2) + 1) * time3 : (Math.floor(time1 / time2)) * time3 + time1 % time2) / time1;
  }
  //怒叱覆盖率
  var tzChufalv = 0.1;
  var tzChufalvMarkov = 1 - (Math.pow(1 - tzChufalv, 5) * ymDutiao + tzChufalv * Math.pow(1 - tzChufalv, 4) * (ymDutiao - 6 % ymDutiao)) / ymDutiao;
  //恣游覆盖率和噬骨覆盖率
  var ziYouCover = (gcd * 4 * 0.02 + gcd * 0.04 + gcd * 0.06 + gcd * 0.08 + (time - 10 * gcd) * 0.1) / time;
  var shiGuCover = (gcd * 3 * 0.02 + gcd * 3 * 0.08 + (time - 7 * gcd) * 0.1) / time;

  //resultA  风水雷特效
  //覆盖率列表
  var coverage = {
    waterMoon: coverageCal(time, 60, 10),//水月无间
    luanSa: coverageCal(time, 90, 10),//乱洒青荷
    tzNuchi: tzChufalvMarkov,//怒叱
    qxXuantian: coverageCal(time, 120, 30),//繁音急节
    ziYou: ziYouCover,//恣游
    shiGu: shiGuCover,//噬骨
    wind: coverageCal(time, 180, 15),//特效腰坠
    hsZhen: 0.1*(time-16.5)/time,//秃驴五阵
    thunder: coverageCal(time, 90, 15),//雷特效覆盖率
    mjT: coverageCal(time, 150, 8),//朝圣言
    tcT: 30 / time,//号令三军
  }

//-------------------------------------------------------------------------------------------
  //装备特效
  var equipEffects = {
    //需定义undefined条件获取字符串(水雷风特效)
    // $("div[data-buff='water'] li.active").children()[0].innerText
    water: $("div[data-buff='water'] li.active").children()[0],
    thunder: $("div[data-buff='thunder'] li.active").children()[0],
    wind: $("div[data-buff='wind'] li.active").children()[0],
    //返回T/F（套装特效，CW特效）
    tzNuchi: $("#tzNuchi").is(':checked'), //套装怒叱
    tzZhaoshi: $("#tzZhaoshi").is(':checked'), //套装招式
    smallCw: $("#smallCw").is(':checked'), //小CW
    bigCw: $("#bigCw").is(':checked') //大CW
  }

 
  var equipEffectsListWater = [
    { name: "水·灭虚", attr: { rgongJiJiChuPoint: 70 }, active: false },
    { name: "水·激流", attr: { rgongJiJiChuPoint: 70 }, active: false },
    { name: "水·痛切", attr: { rhuiXinPoint: 40, rhuiXiaoPoint: 40 }, active: false },
    { name: "水·无双", attr: { rwuShuangPoint: 80 }, active: false },
    { name: "水·锐眼", attr: { rmingZhongPoint: 80 }, active: false },
    { name: "水·急速", attr: { rjiaSuPoint: 80 }, active: false }
  ]  
  var equipEffectsListWind = [
    { name: "风·灭气", attr: { rpoFangJiChuNum: (362 * coverage.wind) }, active: false },
    { name: "风·灭虚", attr: { rpoFangJiChuNum: (362 * coverage.wind) }, active: false }
  ]  
  var equipEffectsListThunder = [
    { name: "雷·灭气", attr: { rhuiXinPoint: (96 * coverage.thunder), rpoFangJiChuNum: (224 * coverage.thunder) }, active: false }
  ]  

  //检查并将选取的特效标记为True(每次点击事件)
  function equipEffectsCheck() {
    //$(".effects li li")  0-6水，7-8雷，9-11风
    for (var i = 0; i < 7; i++) {
      if ($($(".effects li li")[i]).hasClass("active")) {
        for (var j = 0; j < equipEffectsListWater.length; j++) {
          if (trimStr(equipEffectsListWater[j].name) == trimStr($(".effects li li")[i].innerText)) {
            equipEffectsListWater[j].active = true;
          } else {
            equipEffectsListWater[j].active = false;
          }
        }
      }
    }
    for (var i = 7; i < 9; i++) {
      if ($($(".effects li li")[i]).hasClass("active")) {
        for (var j = 0; j < equipEffectsListThunder.length; j++) {
          if (trimStr(equipEffectsListThunder[j].name) == trimStr($(".effects li li")[i].innerText)) {
            equipEffectsListThunder[j].active = true;
          } else {
            equipEffectsListThunder[j].active = false;
          }
        }
      }
    }
    for (var i = 9; i < 12; i++) {
      if ($($(".effects li li")[i]).hasClass("active")) {
        for (var j = 0; j < equipEffectsListWind.length; j++) {
          if (trimStr(equipEffectsListWind[j].name) == trimStr($(".effects li li")[i].innerText)) {
            equipEffectsListWind[j].active = true;
          } else {
            equipEffectsListWind[j].active = false;
          }
        }
      }
    }
  }
  equipEffectsCheck();
  var resultA = null;
  //将标记为True的元素的属性值加入resultA
  function equipEffectsCal() {
    // resultA = result;
    resultA = $.extend(true, {}, result)
    for (var i = 0; i < equipEffectsListWater.length; i++) {
      var buff = equipEffectsListWater[i];
      if (buff.active) {
        for (key in buff.attr) {
          resultA[key].push(buff.attr[key]);
        }
      }
    }
    for (var i = 0; i < equipEffectsListWind.length; i++) {
      var buff = equipEffectsListWind[i];
      if (buff.active) {
        for (key in buff.attr) {
          resultA[key].push(buff.attr[key]);
        }
      }
    }
    for (var i = 0; i < equipEffectsListThunder.length; i++) {
      var buff = equipEffectsListThunder[i];
      if (buff.active) {
        for (key in buff.attr) {
          resultA[key].push(buff.attr[key]);
        }
      }
    }
  }
  equipEffectsCal();


  //input添加监听事件           （注：JS改变数值事件时也应该加入）
  for (var i = 0; i < $("div[data-buff='water'] li").length; i++) {
    $("div[data-buff='water'] li")[i].addEventListener("click", function () {
      ymDutiao = jiasuCal(1.75 + ymYungong);
      gcd = jiasuCal(1.5);
      equipEffects.water = $("div[data-buff='water'] li.active");//初始化重新赋值避免undefined
      equipEffectsCheck();//查找是否含有被选中字段并标记为true
      equipEffectsCal();//加入resultA
      resultSum();
    });
  }
  for (var i = 0; i < $("div[data-buff='thunder'] li").length; i++) {
    $("div[data-buff='thunder'] li")[i].addEventListener("click", function () {
      ymDutiao = jiasuCal(1.75 + ymYungong);
      gcd = jiasuCal(1.5);
      equipEffects.thunder = $("div[data-buff='thunder'] li.active");
      equipEffectsCheck();
      equipEffectsCal();
      resultSum();
    });
  }
  for (var i = 0; i < $("div[data-buff='wind'] li").length; i++) {
    $("div[data-buff='wind'] li")[i].addEventListener("click", function () {
      ymDutiao = jiasuCal(1.75 + ymYungong);
      gcd = jiasuCal(1.5);
      equipEffects.thunder = $("div[data-buff='wind'] li.active");
      equipEffectsCheck();
      equipEffectsCal();
      resultSum();
    });
  }
    $("div[data-skill='ymShanghai'] li").click(function () {
      ymShanghai = parseFloat($("div[data-skill='ymShanghai'] input")[0].value.substr(4) == "秘籍" ? 0 : $("div[data-skill='ymShanghai'] input")[0].value.substr(4))/100;
      resultSum();
    })
    $("div[data-skill='ymHuixin'] li").click(function () {
      ymHuixin = parseFloat($("div[data-skill='ymHuixin'] input")[0].value.substr(4) == "秘籍" ? 0 : $("div[data-skill='ymHuixin'] input")[0].value.substr(4))/100;
      resultSum();
    })



//-------------------------------------------------------------------------------------------


  //自身BUFF
  var buff = {
    ziYou: $("#ziYou").is(':checked'), //恣游
    shiGu: $("#shiGu").is(':checked'), //噬骨
    waterMoon: $("#waterMoon").is(':checked') //水月
  }
  //实战团队增益
  var battleBuff = {
    //返回T/F
    xiuQi: $("#xiuQi").is(':checked'), //袖气
    poCangqiong: $("#poCangqiong").is(':checked'), // 破苍穹：
    qingJuan: $("#qingJuan").is(':checked'), // 破防·清绢：
    sheYing: $("#sheYing").is(':checked'), // 蛇影枯残：
    jinGang: $("#jinGang").is(':checked'), // 金刚怒目：
    poXiao: $("#poXiao").is(':checked'), // 易伤·破霄：
    mjT: $("#mjT").is(':checked'), // 明教T：
    tcT: $("#tcT").is(':checked'), // 天策T：
    manWu: $("#manWu").is(':checked'), // 曼舞：
    zhengYu: $("#zhengYu").is(':checked'), // 蒸鱼菜盘：
    qingYu: $("#qingYu").is(':checked'), // 红烧青鱼：
    wuCaiqiu: $("#wuCaiqiu").is(':checked'), // 五彩球·赤：
    daQi: $("#daQi").is(':checked'), // 义薄云天·战：
    qxXuantian: $("#qxXuantian").is(':checked'), // 七秀·剑舞霓裳·玄天：
    mjBiantian: $("#mjBiantian").is(':checked'), // 明教·妙火琉璃·变天：
  }
  //实战兵鉴
  var weaponEnchant = {
    bianTian: $("#bianTian").is(':checked') //万花·青岩太玄·变天
  }
//-------------------------------------------------------------------------------------------
  //阵法(返回字符串进行判断)
  var zhenFa = $("div[data-buff='zhenFa'] input")[0].value

  //小吃小药宴席磨石(返回字符串进行判断)
  var food = {
    yanXi: $("div[data-buff='yanXi'] input")[0].value,//宴席
    moShi: $("div[data-buff='moShi'] input")[0].value, //磨石  
    yishuZq: $("div[data-food='yishuZq'] input")[0].value,// 医术增强
    yishuFz: $("div[data-food='yishuFz'] input")[0].value, // 医术辅助
    pengrenZq: $("div[data-food='pengrenZq'] input")[0].value, // 烹饪增强  
    pengrenFz: $("div[data-food='pengrenFz'] input")[0].value // 烹饪辅助
  }
  var foodList = [
    { name: "烧尾宴", attr: { ryuanQi: 39 }, active: false },
    { name: "佳·烧尾宴", attr: { ryuanQi: 46 }, active: false },
    { name: "芙蓉出水宴", attr: { ryuanQi: 28 }, active: false },
    { name: "佳·剑胆·熔锭（内伤）", attr: { rgongJiJiChuPoint: 75 }, active: false },
    { name: "天鼓雷音阵", attr: { rgongJiPercent: coverage.hsZhen + 0.05, rmingZhongPercent: 0.03, rpoFangPercent: 0.1 }, active: false },
    { name: "万蛊噬心阵", attr: { rgongJiPercent: 0.0495, rhuiXinPercent: 0.03, rhuiXiaoPercent: 0.1, rpoFangPercent: 0.045 }, active: false },
    { name: "九宫八卦阵", attr: { rmingZhongPercent: 0.03, rhuiXinPercent: 0.08, rhuiXiaoPercent: 0.12 }, active: false },
    { name: "七绝逍遥阵", attr: { rgongJiPercent: 0.0495, rpoFangPercent: 0.2 }, active: false },
    { name: "苍·提神香囊（破防）", attr: { rpoFangJiChuNum: 49 }, active: false },
    { name: "苍·上品展凤丹（攻击）", attr: { rgongJiJiChuPoint: 66 }, active: false },
    { name: "尚·上品玉露丹（会效）", attr: { rhuiXiaoPoint: 63 }, active: false },
    { name: "佳·白信丹（会心）", attr: { rhuiXinPoint: 125 }, active: false },
    { name: "白信丹（会心）", attr: { rhuiXinPoint: 111 }, active: false },
    { name: "佳·妙香丹（会效）", attr: { rhuiXiaoPoint: 125 }, active: false },
    { name: "妙香丹（会效）", attr: { rhuiXiaoPoint: 111 }, active: false },
    { name: "佳·养神丹（元气）", attr: { ryuanQi: 46 }, active: false },
    { name: "养神丹（元气）", attr: { ryuanQi: 41 }, active: false },
    { name: "苍·提神汤（破防）", attr: { rpoFangJiChuNum: 49 }, active: false },
    { name: "佳·五生盘（会心）", attr: { rhuiXinPoint: 83 }, active: false },
    { name: "五生盘（会心）", attr: { rhuiXinPoint: 74 }, active: false },
    { name: "佳·贵妃红（命中）", attr: { rmingZhongPoint: 83 }, active: false },
    { name: "贵妃红（命中）", attr: { rmingZhongPoint: 74 }, active: false },
    { name: "佳·通花软牛肠（会效）", attr: { rhuiXiaoPoint: 83 }, active: false },
    { name: "佳·御黄王母饭（破防）", attr: { rpoFangJiChuNum: 83 }, active: false },
    { name: "佳·八方寒食饼（攻击）", attr: { rgongJiJiChuPoint: 75 }, active: false },
    { name: "佳·长生粥（元气）", attr: { ryuanQi: 31 }, active: false },
    { name: "长生粥（元气）", attr: { ryuanQi: 27 }, active: false },
    { name: "珍·养魂丹（会效）", attr: { rhuiXiaoPoint: 153 }, active: false },
    { name: "珍·益神丹（元气）", attr: { ryuanQi: 57 }, active: false },
    { name: "珍·金乳酥（会心）", attr: { rhuiXinPoint: 102 }, active: false },
    { name: "珍·凤凰鱼翅（会效）", attr: { rhuiXiaoPoint: 102 }, active: false },
    { name: "珍·云梦肉（元气）", attr: { ryuanQi: 38 }, active: false }
  ]
  //检查并将选取的特效标记为True(每次点击事件)
  function foodCheck() {
    for(var i = 0; i < foodList.length; i++){
      foodList[i].active = false;
    }
    for (var i = 0; i < $(".xiaochizhenfa li").length; i++) {
      if ($($(".xiaochizhenfa li")[i]).hasClass("active")) {
        for (var j = 0; j < foodList.length; j++) {
          if (trimStr(foodList[j].name) == trimStr($(".xiaochizhenfa li")[i].innerText)) {
            foodList[j].active = true;
          }else{
          }
        }
      }
    }
  }
  foodCheck();
  //将标记为True的元素的属性值加入resultB
  var resultB = null;
  function foodCal() {
    // resultB = result;
    resultB =  $.extend(true, {}, result)
    for (var i = 0; i < foodList.length; i++) {
      var buff = foodList[i];
      if (buff.active) {
        for (key in buff.attr) {
          resultB[key].push(buff.attr[key]);
        }
      }
    }
  }
  foodCal();
  //input添加  [监听事件]          （注：JS改变数值事件时也应该加入）
  for (var i = 1; i < $(".xiaochizhenfa li").length; i++) {
    $(".xiaochizhenfa li")[i].addEventListener("click", function () {
      ymDutiao = jiasuCal(1.75 + ymYungong);
      gcd = jiasuCal(1.5);
      foodCheck();
      foodCal();
      resultSum();
    });
  }

//-------------------------------------------------------------------------------------------
  //复选框初始化函数
  function checkboxInit() {
    equipEffects.tzNuchi = $("#tzNuchi").is(':checked');//套装怒叱
    equipEffects.tzZhaoshi = $("#tzZhaoshi").is(':checked'); //套装招式
    equipEffects.smallCw = $("#smallCw").is(':checked'); //小CW
    equipEffects.bigCw = $("#bigCw").is(':checked'); //大CW
    buff.ziYou = $("#ziYou").is(':checked'); //恣游
    buff.shiGu = $("#shiGu").is(':checked');//噬骨
    buff.waterMoon = $("#waterMoon").is(':checked'); //水月
    battleBuff.xiuQi = $("#xiuQi").is(':checked');//袖气
    battleBuff.poCangqiong = $("#poCangqiong").is(':checked'); // 破苍穹：
    battleBuff.qingJuan = $("#qingJuan").is(':checked'); // 破防·清绢：
    battleBuff.sheYing = $("#sheYing").is(':checked'); // 蛇影枯残：
    battleBuff.jinGang = $("#jinGang").is(':checked'); // 金刚怒目：
    battleBuff.mjT = $("#mjT").is(':checked'); // 明教T：
    battleBuff.tcT = $("#tcT").is(':checked');// 天策T：
    battleBuff.manWu = $("#manWu").is(':checked'); // 曼舞：
    battleBuff.zhengYu = $("#zhengYu").is(':checked'); // 蒸鱼菜盘：
    battleBuff.shuizhuYu = $("#shuizhuYu").is(':checked'); // 水煮鱼：
    battleBuff.daQi = $("#daQi").is(':checked');// 义薄云天·战：
    battleBuff.qxXuantian = $("#qxXuantian").is(':checked'); // 七秀·剑舞霓裳·玄天：
    battleBuff.mjBiantian = $("#mjBiantian").is(':checked');// 明教·妙火琉璃·变天：
    weaponEnchant.bianTian = $("#bianTian").is(':checked'); //万花·青岩太玄·变天
  }
  //属性赋值
  var resultC = null;
  var resultCNONE = null;
  function checkboxCal() {
    var checkboxList = [
      { attr: { rgongJiPercent: 0.1 * coverage.tzNuchi }, active: equipEffects.tzNuchi },
      { attr: { rgongJiPercent: coverage.ziYou }, active: buff.ziYou },
      { attr: { ryiShangPercent: coverage.shiGu }, active: buff.shiGu },
      { attr: { rgongJiPercent: 0.3 * coverage.waterMoon }, active: buff.waterMoon },
      { attr: { ryuanQi: 37, rgenGu: 37 }, active: battleBuff.xiuQi },
      { attr: { rhuiXinPercent: 0.05, rhuiXiaoPercent: 0.1 }, active: battleBuff.poCangqiong },
      { attr: { rpoFangPercent: 0.1 }, active: battleBuff.qingJuan },
      { attr: { ryiShangPercent: 0.06 }, active: battleBuff.sheYing },
      { attr: { rgongJiPercent: 0.1 }, active: battleBuff.jinGang },
      { attr: { rgongJiPercent: 0.2 * coverage.mjT, ryiShangPercent: 0.03 }, active: battleBuff.mjT },
      { attr: { rpoFangPercent: 0.4 * coverage.tcT + 0.2 * coverage.tcT }, active: battleBuff.tcT },
      { attr: { rwuShuangPoint: 12 }, active: battleBuff.manWu },
      { attr: { rmingZhongPercent: 0.01, rwuShuangPercent: 0.03 }, active: battleBuff.zhengYu },
      { attr: { rmingZhongPoint:35,rwuShuangPoint:25 }, active: battleBuff.shuizhuYu },
      { attr: { rshangHaiJiaChengPercent: 0.2 * 30 / time }, active: battleBuff.daQi },
      { attr: { rgongJiPercent: 0.45 * coverage.qxXuantian }, active: battleBuff.qxXuantian },
      { attr: { ryiShangPercent: 0.02 }, active: battleBuff.mjBiantian },
    ]

    resultC = $.extend(true, {}, result)
    for (var i = 0; i < checkboxList.length; i++) {
      var buff1 = checkboxList[i];
      if (buff1.active) {
        for (key in buff1.attr) {
          resultC[key].push(buff1.attr[key]);
        }
      }
    }
  }
//无增益计算
  function checkboxCalNONE() {
    var checkboxListNONE = [
      { attr: { rgongJiPercent: 0.1 * coverage.tzNuchi }, active: equipEffects.tzNuchi },
      { attr: { rgongJiPercent: coverage.ziYou }, active: buff.ziYou },
      { attr: { ryiShangPercent: coverage.shiGu }, active: buff.shiGu },
      { attr: { rgongJiPercent: 0.3 * coverage.waterMoon }, active: buff.waterMoon }
    ]

    resultCNONE = $.extend(true, {}, result)
    for (var i = 0; i < checkboxListNONE.length; i++) {
      var buff1 = checkboxListNONE[i];
      if (buff1.active) {
        for (key in buff1.attr) {
          resultCNONE[key].push(buff1.attr[key]);
        }
      }
    }
  }
  checkboxInit();
  checkboxCal();
  checkboxCalNONE();

  //复选框样式的特效、增益[监听事件]
  for (var i = 0; i < $("label").length; i++) {
      $($("input")[i]).click(function () {
        ymDutiao = jiasuCal(1.75 + ymYungong);
        gcd = jiasuCal(1.5);
        checkboxInit();
        checkboxCal();
        checkboxCalNONE();
        resultSum();
      });
  }

//-------------------------------------------------------------------------------------------

  var resultAllCal ;
  var resultAllCalNONE;
  //在所有监听事件和JS更改选项中添加的函数   直接调用resultAll的属性获取数值
  //DPS增益计算函数
  function resultSum() {
    resultAll = $.extend(true, {}, result);
    for (key in resultAll) {
      for (num in resultA[key]) {
        resultAll[key].push(resultA[key][num])
      }
      for (num in resultB[key]) {
        resultAll[key].push(resultB[key][num])
      }
      for (num in resultC[key]) {
        resultAll[key].push(resultC[key][num])
      }
    }

    for (prop in resultAll) {
      resultAllCal = 0;
      for (propnum in resultAll[prop]) {
        resultAllCal += resultAll[prop][propnum]
      }
      resultAll[prop] = resultAllCal;
    }
    propertyResult();
    //无增益计算
    resultAllNONE = $.extend(true, {}, result);
    for (key in resultAllNONE) {
      for (num in resultA[key]) {
        resultAllNONE[key].push(resultA[key][num])
      }
      for (num in resultCNONE[key]) {
        resultAllNONE[key].push(resultCNONE[key][num])
      }
    }

    for (prop in resultAllNONE) {
      resultAllCalNONE = 0;
      for (propnum in resultAllNONE[prop]) {
        resultAllCalNONE += resultAllNONE[prop][propnum]
      }
      resultAllNONE[prop] = resultAllCalNONE;
    }
    propertyResultNONE();
    
  }
  resultSum();
//-------------------------------------------------------------------------------------------
  //乱撒奇穴判断(页尾)
  var luansa = false;
  var qingliu = true;
  //
//-------------------------------------------------------------------------------------------

  var fYQ = 0;//元气
  var fMBGJ = 0;//攻击力
  var fMZ = 0;//命中
  var fHX = 0;//会心
  var fHXXG = 0;//会心效果
  var fJS = 0;//加速
  var fZZPF = 0;//最终破防
  var fWS = 0;//无双
  var fJCGJ = 0;//基础攻击
  var fJCPF = 0;//基础破防
  var fYS = 0;//易伤
  var fSHJC = 0;
  var fYMHX = 0;
  var fYMHXFumo = 0;
  var fYMHXXG = 0;
  var fYMSH = 0;
  var fYMHXhanbi = 0;
  var fYMHXXGhanbi = 0;
  var s1 = 0;
  var s2 = 0;
  var s3 = 0;
  var s4 = 0;
  var s5 = 0;
  var s6 = 0;
  var s7 = 0;
  var sLancui = 0;
  var sShangyang = 0;
  var sZhongling = 0;
//无增益计算
  var fYQNONE = 0;//元气
  var fMBGJNONE = 0;//攻击力
  var fMZNONE = 0;//命中
  var fHXNONE = 0;//会心
  var fHXXGNONE = 0;//会心效果
  var fJSNONE = 0;//加速
  var fZZPFNONE = 0;//最终破防
  var fWSNONE = 0;//无双
  var fJCGJNONE = 0;//基础攻击
  var fJCPFNONE = 0;//基础破防
  var fYSNONE = 0;//易伤
  var fSHJCNONE = 0;
  var fYMHXNONE = 0;
  var fYMHXFumoNONE = 0;
  var fYMHXXGNONE = 0;
  var fYMSHNONE = 0;
  var fYMHXhanbiNONE = 0;
  var fYMHXXGhanbiNONE = 0;
  var s1NONE = 0;
  var s2NONE = 0;
  var s3NONE = 0;
  var s4NONE = 0;
  var s5NONE = 0;
  var s6NONE = 0;
  var s7NONE = 0;
  var sLancuiNONE = 0;
  var sShangyangNONE = 0;
  var sZhonglingNONE = 0;

  function propertyResult() {
    for(propertyNum in property){
      property[propertyNum] = parseFloat(property[propertyNum]);
    }
    fYQ = property.yuanQi + resultAll.ryuanQi;
    fMZ = property.mingZhong + resultAll.rmingZhongPercent + resultAll.rmingZhongPoint / propertyCal.mingZhong;
    fHX = Math.min(1, property.huiXin + resultAll.rhuiXinPercent + resultAll.rhuiXinPoint / propertyCal.huiXin);
    fHXXG = Math.min(3, property.huiXiao + resultAll.rhuiXiaoPercent + resultAll.rhuiXiaoPoint / propertyCal.huiXiao);
    fJS = Math.min(0.25, property.jiaSu + resultAll.rjiaSuPercent + resultAll.rjiaSuPoint / propertyCal.jiaSu);
    fWS = Math.min(0.4, property.wuShuang + resultAll.rwuShuangPercent + resultAll.rwuShuangPoint / propertyCal.wuShuang);
    fJCPF = property.poFangJiChu + resultAll.rpoFangJiChuNum + resultAll.ryuanQi * 0.25;
    fZZPF = fJCPF * (1 + resultAll.rpoFangPercent + (qingliu ? 0.15 : 0)) + fYQ * 0.09;
    fJCGJ = property.gongJiJiChu + resultAll.rgongJiJiChuPoint + resultAll.ryuanQi * 0.18;
    fMBGJ = fJCGJ * (1 + resultAll.rgongJiPercent) + fYQ * 1.95;
    fYS = resultAll.ryiShangPercent;
    fSHJC = resultAll.rshangHaiJiaChengPercent;
    //阳明
    fYMHX = Math.min(1, fHX + 0.1 + 0.15 + ymHuixin + (equipEffects.smallCw ? 0.05 : 0));
    fYMHXFumo = Math.min(1, fHX + 0.1 + ymHuixin + (equipEffects.smallCw ? 0.05 : 0));
    fYMHXhanbi = Math.min(1, fHX + 0.1 + 0.1 + ymHuixin + (equipEffects.smallCw ? 0.05 : 0));
    fYMHXXG = Math.max(1, fHXXG + 0.1 + 0.15);
    fYMHXXGhanbi = Math.max(1, fHXXG + 0.1 + 0.1)
    fYMSH = fSHJC + ymShanghai + (equipEffects.bigCw ? 0.05 : 0) + (equipEffects.tzZhaoshi ? 0.1 : 0);
    
    //雪中行    
    s1 = fYMHX;
    s2 = (1 - s1) * fYMHX;
    s3 = (1 - s1 - s2) * fYMHX;
    s4 = (1 - s1 - s2 - s3) * fYMHX;
    s5 = (1 - s1 - s2 - s3 - s4) * fYMHX;
    s6 = (1 - s1 - s2 - s3 - s4 - s5) * fYMHX;
    s7 = (1 - s1 - s2 - s3 - s4 - s5 - s6) * fYMHX;
    sLancui = 11 * s1 + 10 * s2 + 10 * s3 + 9 * s4 + 9 * s5 + 8 * s6 + 8 * s7;
    sShangyang = 11 * s1 + 10 * s2 + 10 * s3 + 9 * s4 + 9 * s5 + 8 * s6 + 8 * s7;
    sZhongling = 10 * s1 + 9 * s2 + 9 * s3 + 8 * s4 + 8 * s5 + 7 * s6 + 7 * s7;

  }
  propertyResult();
//无增益计算
  function propertyResultNONE() {
    for(propertyNum in property){
      property[propertyNum] = parseFloat(property[propertyNum]);
    }
    fYQNONE = property.yuanQi + resultAllNONE.ryuanQi;
    fMZNONE = property.mingZhong + resultAllNONE.rmingZhongPercent + resultAllNONE.rmingZhongPoint / propertyCal.mingZhong;
    fHXNONE = Math.min(1, property.huiXin + resultAllNONE.rhuiXinPercent + resultAllNONE.rhuiXinPoint / propertyCal.huiXin);
    fHXXGNONE = Math.min(3, property.huiXiao + resultAllNONE.rhuiXiaoPercent + resultAllNONE.rhuiXiaoPoint / propertyCal.huiXiao);
    fJSNONE = Math.min(0.25, property.jiaSu + resultAllNONE.rjiaSuPercent + resultAllNONE.rjiaSuPoint / propertyCal.jiaSu);
    fWSNONE = Math.min(0.4, property.wuShuang + resultAllNONE.rwuShuangPercent + resultAllNONE.rwuShuangPoint / propertyCal.wuShuang);
    fJCPFNONE = property.poFangJiChu + resultAllNONE.rpoFangJiChuNum + resultAllNONE.ryuanQi * 0.25;
    fZZPFNONE = fJCPFNONE * (1 + resultAllNONE.rpoFangPercent + (qingliu ? 0.15 : 0)) + fYQNONE * 0.09;
    fJCGJNONE = property.gongJiJiChu + resultAllNONE.rgongJiJiChuPoint + resultAllNONE.ryuanQi * 0.18;
    fMBGJNONE = fJCGJNONE * (1 + resultAllNONE.rgongJiPercent) + fYQNONE * 1.95;
    fYSNONE = resultAllNONE.ryiShangPercent;
    fSHJCNONE = resultAllNONE.rshangHaiJiaChengPercent;
    //阳明
    fYMHXNONE = Math.min(1, fHXNONE + 0.1 + 0.15 + ymHuixin + (equipEffects.smallCw ? 0.05 : 0));
    fYMHXFumoNONE = Math.min(1, fHXNONE + 0.1 + ymHuixin + (equipEffects.smallCw ? 0.05 : 0));
    fYMHXhanbiNONE = Math.min(1, fHXNONE + 0.1 + 0.1 + ymHuixin + (equipEffects.smallCw ? 0.05 : 0));
    fYMHXXGNONE = Math.max(1, fHXXGNONE + 0.1 + 0.15);
    fYMHXXGhanbiNONE = Math.max(1, fHXXGNONE + 0.1 + 0.1)
    fYMSHNONE = fSHJCNONE + ymShanghai + (equipEffects.bigCw ? 0.05 : 0) + (equipEffects.tzZhaoshi ? 0.1 : 0);
    //雪中行    
    s1NONE = fYMHXNONE;
    s2NONE = (1 - s1NONE) * fYMHXNONE;
    s3NONE = (1 - s1NONE - s2NONE) * fYMHXNONE;
    s4NONE = (1 - s1NONE - s2NONE - s3NONE) * fYMHXNONE;
    s5NONE = (1 - s1NONE - s2NONE - s3NONE - s4NONE) * fYMHXNONE;
    s6NONE = (1 - s1NONE - s2NONE - s3NONE - s4NONE - s5NONE) * fYMHXNONE;
    s7NONE = (1 - s1NONE - s2NONE - s3NONE - s4NONE - s5NONE - s6NONE) * fYMHXNONE;
    sLancuiNONE = 11 * s1NONE + 10 * s2NONE + 10 * s3NONE + 9 * s4NONE + 9 * s5NONE + 8 * s6NONE + 8 * s7NONE;
    sShangyangNONE = 11 * s1NONE + 10 * s2NONE + 10 * s3NONE + 9 * s4NONE + 9 * s5NONE + 8 * s6NONE + 8 * s7NONE;
    sZhonglingNONE = 10 * s1NONE + 9 * s2NONE + 9 * s3NONE + 8 * s4NONE + 8 * s5NONE + 7 * s6NONE + 7 * s7NONE;
  }
  propertyResultNONE();

  //奇穴
  var acupoint = {
  }
  function defenseCal(num, key) {
    return (1 - 1 / (1 + key / (2.382 * (85 * num - 7300))))
  }
  var defense = {
    d96: defenseCal(96, 361),
    d97: defenseCal(97, 750),
    d98: defenseCal(98, 1321),
    d99: defenseCal(99, 1771),
    d25: defenseCal(98, 1636),
  }

  var actualSP96 = 0;
  var actualSP97 = 0;
  var actualSP98 = 0;
  var actualSP99 = 0;
  var actualSP25 = 0;
  var actualMZ96 = 0;
  var actualMZ97 = 0;
  var actualMZ98 = 0;
  var actualMZ99 = 0;
  var actualMZ25 = 0;
  //无增益计算
  var actualSP96NONE = 0;
  var actualSP97NONE = 0;
  var actualSP98NONE = 0;
  var actualSP99NONE = 0;
  var actualSP25NONE = 0;
  var actualMZ96NONE = 0;
  var actualMZ97NONE = 0;
  var actualMZ98NONE = 0;
  var actualMZ99NONE = 0;
  var actualMZ25NONE = 0;
  function muZhuangCal() {
    actualSP96 = Math.max(0, 0.15 - fWS);
    actualSP97 = Math.max(0, 0.2 - fWS);
    actualSP98 = Math.max(0, 0.3 - fWS);
    actualSP99 = Math.max(0, 0.4 - fWS);
    actualSP25 = Math.max(0, 0.45 - fWS);
    actualMZ96 = 1 - Math.max(0,(102.5 / 100) - fMZ) - Math.max(0, 0.15 - fWS);
    actualMZ97 = 1 - Math.max(0,(105 / 100) - fMZ) - Math.max(0, 0.2 - fWS);
    actualMZ98 = 1 - Math.max(0,(110 / 100) - fMZ) - Math.max(0, 0.3 - fWS);
    actualMZ99 = 1 - Math.max(0,(115 / 100) - fMZ) - Math.max(0, 0.4 - fWS);
    actualMZ25 = 1 - Math.max(0,(110 / 100) - fMZ) - Math.max(0, 0.45 - fWS);
  }
  //无增益计算
  function muZhuangCalNONE() {
    actualSP96NONE = Math.max(0, 0.15 - fWSNONE);
    actualSP97NONE = Math.max(0, 0.2 - fWSNONE);
    actualSP98NONE = Math.max(0, 0.3 - fWSNONE);
    actualSP99NONE = Math.max(0, 0.4 - fWSNONE);
    actualSP25NONE = Math.max(0, 0.45 - fWSNONE);
    actualMZ96NONE = 1 - Math.max(0,(102.5 / 100) - fMZNONE) - Math.max(0, 0.15 - fWSNONE);
    actualMZ97NONE = 1 - Math.max(0,(105 / 100) - fMZNONE) - Math.max(0, 0.2 - fWSNONE);
    actualMZ98NONE = 1 - Math.max(0,(110 / 100) - fMZNONE) - Math.max(0, 0.3 - fWSNONE);
    actualMZ99NONE = 1 - Math.max(0,(115 / 100) - fMZNONE) - Math.max(0, 0.4 - fWSNONE);
    actualMZ25NONE = 1 - Math.max(0,(110 / 100) - fMZNONE) - Math.max(0, 0.45 - fWSNONE);
  }

//-------------------------------------------------------------------------------------------
//技能伤害
  var zhongLing = {
    skillPara:0.3228,
    skillDama:38
  }
  var lanCui = {
    skillPara:0.3177,
    skillDama:30
  }
  var shangYang = {
    skillPara:0.297,
    skillDama:50
  }
  var yangMing = {
    skillPara:1.1043,
    skillDama:169
  }
  var yuShi = {
    skillPara:0.3333,
    skillDama:86
  }
  

  function skillDamaCal(para, dama, acmz, acsp, hx, hxg, def, sh, ys) {
    return (fMBGJ * para + dama) * (acmz + 0.25 * acsp + hx * (hxg - 1)) * (1 + fZZPF / propertyCal.poFang) * (1 - def) * (1 + sh) * (1 + ys)
  }
  function zhongLingDamaCal(acmz, acsp, def, hx) {
    return skillDamaCal(zhongLing.skillPara, zhongLing.skillDama, acmz, acsp, hx, fHXXG, def, fSHJC, fYS);
  }
  function lanCuiDamaDamaCal(acmz, acsp, def, hx) {
    return skillDamaCal(lanCui.skillPara, lanCui.skillDama, acmz, acsp, hx, fHXXG, def, fSHJC, fYS);
  }
  function shangYangDamaCal(acmz, acsp, def, hx) {
    return skillDamaCal(shangYang.skillPara, shangYang.skillDama, acmz, acsp, hx, fHXXG, def, fSHJC, fYS);
  }
  function yangMingDamaCal(acmz, acsp, def, sh) {
    return skillDamaCal(yangMing.skillPara, yangMing.skillDama, acmz, acsp, fYMHX, fYMHXXG, def, sh, fYS);
  }
  function yangMingFumoDamaCal(acmz, acsp, def) {
    return skillDamaCal(yangMing.skillPara, yangMing.skillDama, acmz, acsp, fYMHXFumo, fYMHXXG, def, 0, fYS);
  }
  function yangMingHBDamaCal(acmz, acsp, def, sh) {
    return skillDamaCal(yangMing.skillPara, yangMing.skillDama, acmz, acsp, fYMHXhanbi, fYMHXXGhanbi, def, sh, fYS);
  }
  function yuShiDamaCal(acmz, acsp, def) {
    return skillDamaCal(yuShi.skillPara, yuShi.skillDama, acmz, acsp, fHX, fHXXG, def, fSHJC, fYS);
  }
//无增益计算
  

  function skillDamaCalNONE(para, dama, acmz, acsp, hx, hxg, def, sh, ys) {
    return (fMBGJNONE * para + dama) * (acmz + 0.25 * acsp + hx * (hxg - 1)) * (1 + fZZPFNONE / propertyCal.poFang) * (1 - def) * (1 + sh) * (1 + ys)
  }
  function zhongLingDamaCalNONE(acmz, acsp, def, hx) {
    return skillDamaCalNONE(zhongLing.skillPara, zhongLing.skillDama, acmz, acsp, hx, fHXXGNONE, def, fSHJCNONE, fYSNONE);
  }
  function lanCuiDamaDamaCalNONE(acmz, acsp, def, hx) {
    return skillDamaCalNONE(lanCui.skillPara, lanCui.skillDama, acmz, acsp, hx, fHXXGNONE, def, fSHJCNONE, fYSNONE);
  }
  function shangYangDamaCalNONE(acmz, acsp, def, hx) {
    return skillDamaCalNONE(shangYang.skillPara, shangYang.skillDama, acmz, acsp, hx, fHXXGNONE, def, fSHJCNONE, fYSNONE);
  }
  function yangMingDamaCalNONE(acmz, acsp, def, sh) {
    return skillDamaCalNONE(yangMing.skillPara, yangMing.skillDama, acmz, acsp, fYMHXNONE, fYMHXXGNONE, def, sh, fYSNONE);
  }
  function yangMingFumoDamaCalNONE(acmz, acsp, def) {
    return skillDamaCalNONE(yangMing.skillPara, yangMing.skillDama, acmz, acsp, fYMHXFumoNONE, fYMHXXGNONE, def, 0, fYSNONE);
  }
  function yangMingHBDamaCalNONE(acmz, acsp, def, sh) {
    return skillDamaCalNONE(yangMing.skillPara, yangMing.skillDama, acmz, acsp, fYMHXhanbiNONE, fYMHXXGhanbiNONE, def, sh, fYSNONE);
  }
  function yuShiDamaCalNONE(acmz, acsp, def) {
    return skillDamaCalNONE(yuShi.skillPara, yuShi.skillDama, acmz, acsp, fHXNONE, fHXXGNONE, def, fSHJCNONE, fYSNONE);
  }
  function skillCal(){
    muZhuangCal();
    var zl96 = zhongLingDamaCal(actualMZ96,actualSP96,defense.d96,fHX);
    var zl97 = zhongLingDamaCal(actualMZ97,actualSP97,defense.d97,fHX);
    var zl98 = zhongLingDamaCal(actualMZ98,actualSP98,defense.d98,fHX);
    var zl99 = zhongLingDamaCal(actualMZ99,actualSP99,defense.d99,fHX);
    var zl25 = zhongLingDamaCal(actualMZ25,actualSP25,defense.d25,fHX);
    var zl96Max = zhongLingDamaCal(actualMZ96,actualSP96,defense.d96,1);
    var zl97Max = zhongLingDamaCal(actualMZ97,actualSP97,defense.d97,1);
    var zl98Max = zhongLingDamaCal(actualMZ98,actualSP98,defense.d98,1);
    var zl99Max = zhongLingDamaCal(actualMZ99,actualSP99,defense.d99,1);
    var zl25Max = zhongLingDamaCal(actualMZ25,actualSP25,defense.d25,1);
    var lc96 = lanCuiDamaDamaCal(actualMZ96,actualSP96,defense.d96,fHX);
    var lc97 = lanCuiDamaDamaCal(actualMZ97,actualSP97,defense.d97,fHX);
    var lc98 = lanCuiDamaDamaCal(actualMZ98,actualSP98,defense.d98,fHX);
    var lc99 = lanCuiDamaDamaCal(actualMZ99,actualSP99,defense.d99,fHX);
    var lc25 = lanCuiDamaDamaCal(actualMZ25,actualSP25,defense.d25,fHX);
    var lc96Max = lanCuiDamaDamaCal(actualMZ96,actualSP96,defense.d96,1);
    var lc97Max = lanCuiDamaDamaCal(actualMZ97,actualSP97,defense.d97,1);
    var lc98Max = lanCuiDamaDamaCal(actualMZ98,actualSP98,defense.d98,1);
    var lc99Max = lanCuiDamaDamaCal(actualMZ99,actualSP99,defense.d99,1);
    var lc25Max = lanCuiDamaDamaCal(actualMZ25,actualSP25,defense.d25,1);  
    var sy96 = shangYangDamaCal(actualMZ96,actualSP96,defense.d96,fHX);
    var sy97 = shangYangDamaCal(actualMZ97,actualSP97,defense.d97,fHX);
    var sy98 = shangYangDamaCal(actualMZ98,actualSP98,defense.d98,fHX);
    var sy99 = shangYangDamaCal(actualMZ99,actualSP99,defense.d99,fHX);
    var sy25 = shangYangDamaCal(actualMZ25,actualSP25,defense.d25,fHX);
    var sy96Max = shangYangDamaCal(actualMZ96,actualSP96,defense.d96,1);
    var sy97Max = shangYangDamaCal(actualMZ97,actualSP97,defense.d97,1);
    var sy98Max = shangYangDamaCal(actualMZ98,actualSP98,defense.d98,1);
    var sy99Max = shangYangDamaCal(actualMZ99,actualSP99,defense.d99,1);
    var sy25Max = shangYangDamaCal(actualMZ25,actualSP25,defense.d25,1);
    var ym96 = yangMingDamaCal(actualMZ96,actualSP96,defense.d96,fYMSH);
    var ym97 = yangMingDamaCal(actualMZ97,actualSP97,defense.d97,fYMSH);
    var ym98 = yangMingDamaCal(actualMZ98,actualSP98,defense.d98,fYMSH);
    var ym99 = yangMingDamaCal(actualMZ99,actualSP99,defense.d99,fYMSH);
    var ym25 = yangMingDamaCal(actualMZ25,actualSP25,defense.d25,fYMSH);
    var ymfy96 = yangMingDamaCal(actualMZ96,actualSP96,defense.d96,(fYMSH+0.2));
    var ymfy97 = yangMingDamaCal(actualMZ97,actualSP97,defense.d97,(fYMSH+0.2));
    var ymfy98 = yangMingDamaCal(actualMZ98,actualSP98,defense.d98,(fYMSH+0.2));
    var ymfy99 = yangMingDamaCal(actualMZ99,actualSP99,defense.d99,(fYMSH+0.2));
    var ymfy25 = yangMingDamaCal(actualMZ25,actualSP25,defense.d25,(fYMSH+0.2));   
    var ymhb96 = yangMingHBDamaCal(actualMZ96,actualSP96,defense.d96,fYMSH);
    var ymhb97 = yangMingHBDamaCal(actualMZ97,actualSP97,defense.d97,fYMSH);
    var ymhb98 = yangMingHBDamaCal(actualMZ98,actualSP98,defense.d98,fYMSH);
    var ymhb99 = yangMingHBDamaCal(actualMZ99,actualSP99,defense.d99,fYMSH);
    var ymhb25 = yangMingHBDamaCal(actualMZ25,actualSP25,defense.d25,fYMSH);    
    var ymhbfy96 = yangMingHBDamaCal(actualMZ96,actualSP96,defense.d96,(fYMSH+0.2));
    var ymhbfy97 = yangMingHBDamaCal(actualMZ97,actualSP97,defense.d97,(fYMSH+0.2));
    var ymhbfy98 = yangMingHBDamaCal(actualMZ98,actualSP98,defense.d98,(fYMSH+0.2));
    var ymhbfy99 = yangMingHBDamaCal(actualMZ99,actualSP99,defense.d99,(fYMSH+0.2));
    var ymhbfy25 = yangMingHBDamaCal(actualMZ25,actualSP25,defense.d25,(fYMSH+0.2));
    var ys96 = yuShiDamaCal(actualMZ96,actualSP96,defense.d96);
    var ys97 = yuShiDamaCal(actualMZ97,actualSP97,defense.d97);
    var ys98 = yuShiDamaCal(actualMZ98,actualSP98,defense.d98);
    var ys99 = yuShiDamaCal(actualMZ99,actualSP99,defense.d99);
    var ys25 = yuShiDamaCal(actualMZ25,actualSP25,defense.d25);

//-------------------------------------------------------------------------------------------

    function ymfmCal(num1,num2) {
      return 0.7803*num1+0.0805*num1*num2*(1+fYMSH+0.1)
    }
    var battleTime = {
      b: time - time / 15 * gcd - gcd + (luansa ? gcd : 0),
      am: time - time / 25 * gcd - gcd + (luansa ? gcd : 0),
      ap: time - gcd + (luansa ? gcd : 0),
      s: time + (luansa ? gcd : 0),
    }
    var loopNum = {
      b: (battleTime.b - 4 * gcd) / (10 * gcd),
      am: (battleTime.am - 4 * gcd) / (10 * gcd),
      ap: (battleTime.ap - 4 * gcd) / (10 * gcd),
      s: (battleTime.s - 4 * gcd) / (10 * gcd),
    }
    var fumoNum = {
      b: sLancui + sZhongling + sShangyang - 11,
      am: sLancui + sZhongling + sShangyang - 11,
      ap: sLancui + sZhongling + sShangyang - 11,
      s: 20
    }
    var lancuiNum = {
      b: 7 + sLancui * loopNum.b,
      am: 7 + sLancui * loopNum.am,
      ap: 7 + sLancui * loopNum.ap,
      s: 7 + (sLancui - 7) * loopNum.b,
      smax: 7 * loopNum.s
    }
    var zhonglingNum = {
      b: 7 + sZhongling * loopNum.b,
      am: 7 + sZhongling * loopNum.am,
      ap: 7 + sZhongling * loopNum.ap,
      s: 7 + (sZhongling - 7) * loopNum.b,
      smax: 7 * loopNum.s
    }
    var shangyangNum = {
      b: 7 + sShangyang * loopNum.b,
      am: 7 + sShangyang * loopNum.am,
      ap: 7 + sShangyang * loopNum.ap,
      s: 7 + (sShangyang - 7) * loopNum.b,
      smax: 7 * loopNum.s
    }
//阳明大附魔
    var fumobianTian = $("#bianTian").is(':checked') ? 1 : 0;
    var ymFM96 = yangMingFumoDamaCal(actualMZ96, actualSP96, defense.d96);
    var ymFM97 = yangMingFumoDamaCal(actualMZ97, actualSP97, defense.d97);
    var ymFM98 = yangMingFumoDamaCal(actualMZ98, actualSP98, defense.d98);
    var ymFM99 = yangMingFumoDamaCal(actualMZ99, actualSP99, defense.d99);
    var ymFM25 = yangMingFumoDamaCal(actualMZ25, actualSP25, defense.d25);
    var ymFM96Dama = ymfmCal(ymFM96, fumoNum.b) * fumobianTian;
    var ymFM97Dama = ymfmCal(ymFM97, fumoNum.b) * fumobianTian;
    var ymFM98Dama = ymfmCal(ymFM98, fumoNum.b) * fumobianTian;
    var ymFM99Dama = ymfmCal(ymFM99, fumoNum.b) * fumobianTian;
    var ymFM25Dama = ymfmCal(ymFM25, fumoNum.b) * fumobianTian;
    var ymFM96DamaS = ymfmCal(ymFM96, fumoNum.s) * fumobianTian;
    var ymFM97DamaS = ymfmCal(ymFM97, fumoNum.s) * fumobianTian;
    var ymFM98DamaS = ymfmCal(ymFM98, fumoNum.s) * fumobianTian;
    var ymFM99DamaS = ymfmCal(ymFM99, fumoNum.s) * fumobianTian;
    var ymFM25DamaS = ymfmCal(ymFM25, fumoNum.s) * fumobianTian;
//DPS
    var dps96 = {
      b: (lancuiNum.b * lc96 + zhonglingNum.b * zl96 + shangyangNum.b * sy96 + ymhb96 + ymhbfy96 * loopNum.b + ymfy96 * loopNum.b * 6 + ys96 * (1 + loopNum.b) + ymFM96Dama * loopNum.b) / time,
      am: (lancuiNum.am * lc96 + zhonglingNum.am * zl96 + shangyangNum.am * sy96 + ymhb96 + ymhbfy96 * loopNum.am + ymfy96 * loopNum.am * 6 + ys96 * (1 + loopNum.am) + ymFM96Dama * loopNum.am) / time,
      ap: (lancuiNum.ap * lc96 + zhonglingNum.ap * zl96 + shangyangNum.ap * sy96 + ymhb96 + ymhbfy96 * loopNum.ap + ymfy96 * loopNum.ap * 6 + ys96 * (1 + loopNum.ap) + ymFM96Dama * loopNum.ap) / time,
      s: (lancuiNum.s * lc96 + lancuiNum.smax * lc96Max + zhonglingNum.s * zl96 + zhonglingNum.smax*zl96Max + shangyangNum.s * sy96 + shangyangNum.smax * sy96Max + ymhb96 + ymhbfy96 * loopNum.s + ymfy96 * loopNum.s * 6 + ys96 * (1 + loopNum.s) + ymFM96DamaS * loopNum.s) / time
    }
    var dps97 = {
      b: (lancuiNum.b * lc97 + zhonglingNum.b * zl97 + shangyangNum.b * sy97 + ymhb97 + ymhbfy97 * loopNum.b + ymfy97 * loopNum.b * 6 + ys97 * (1 + loopNum.b) + ymFM97Dama * loopNum.b) / time,
      am: (lancuiNum.am * lc97 + zhonglingNum.am * zl97 + shangyangNum.am * sy97 + ymhb97 + ymhbfy97 * loopNum.am + ymfy97 * loopNum.am * 6 + ys97 * (1 + loopNum.am) + ymFM97Dama * loopNum.am) / time,
      ap: (lancuiNum.ap * lc97 + zhonglingNum.ap * zl97 + shangyangNum.ap * sy97 + ymhb97 + ymhbfy97 * loopNum.ap + ymfy97 * loopNum.ap * 6 + ys97 * (1 + loopNum.ap) + ymFM97Dama * loopNum.ap) / time,
      s: (lancuiNum.s * lc97 + lancuiNum.smax * lc97Max + zhonglingNum.s * zl97 + zhonglingNum.smax*zl97Max + shangyangNum.s * sy97 + shangyangNum.smax * sy97Max + ymhb97 + ymhbfy97 * loopNum.s + ymfy97 * loopNum.s * 6 + ys97 * (1 + loopNum.s) + ymFM97DamaS * loopNum.s) / time
    }
    var dps98 = {
      b: (lancuiNum.b * lc98 + zhonglingNum.b * zl98 + shangyangNum.b * sy98 + ymhb98 + ymhbfy98 * loopNum.b + ymfy98 * loopNum.b * 6 + ys98 * (1 + loopNum.b) + ymFM98Dama * loopNum.b) / time,
      am: (lancuiNum.am * lc98 + zhonglingNum.am * zl98 + shangyangNum.am * sy98 + ymhb98 + ymhbfy98 * loopNum.am + ymfy98 * loopNum.am * 6 + ys98 * (1 + loopNum.am) + ymFM98Dama * loopNum.am) / time,
      ap: (lancuiNum.ap * lc98 + zhonglingNum.ap * zl98 + shangyangNum.ap * sy98 + ymhb98 + ymhbfy98 * loopNum.ap + ymfy98 * loopNum.ap * 6 + ys98 * (1 + loopNum.ap) + ymFM98Dama * loopNum.ap) / time,
      s: (lancuiNum.s * lc98 + lancuiNum.smax * lc98Max + zhonglingNum.s * zl98 + zhonglingNum.smax*zl98Max + shangyangNum.s * sy98 + shangyangNum.smax * sy98Max + ymhb98 + ymhbfy98 * loopNum.s + ymfy98 * loopNum.s * 6 + ys98 * (1 + loopNum.s) + ymFM98DamaS * loopNum.s) / time
    }

    var dps25 = {
      b: (lancuiNum.b * lc25 + zhonglingNum.b * zl25 + shangyangNum.b * sy25 + ymhb25 + ymhbfy25 * loopNum.b + ymfy25 * loopNum.b * 6 + ys25 * (1 + loopNum.b) + ymFM25Dama * loopNum.b) / time,
      am: (lancuiNum.am * lc25 + zhonglingNum.am * zl25 + shangyangNum.am * sy25 + ymhb25 + ymhbfy25 * loopNum.am + ymfy25 * loopNum.am * 6 + ys25 * (1 + loopNum.am) + ymFM25Dama * loopNum.am) / time,
      ap: (lancuiNum.ap * lc25 + zhonglingNum.ap * zl25 + shangyangNum.ap * sy25 + ymhb25 + ymhbfy25 * loopNum.ap + ymfy25 * loopNum.ap * 6 + ys25 * (1 + loopNum.ap) + ymFM25Dama * loopNum.ap) / time,
      s: (lancuiNum.s * lc25 + lancuiNum.smax * lc25Max + zhonglingNum.s * zl25 + zhonglingNum.smax*zl25Max + shangyangNum.s * sy25 + shangyangNum.smax * sy25Max + ymhb25 + ymhbfy25 * loopNum.s + ymfy25 * loopNum.s * 6 + ys25 * (1 + loopNum.s) + ymFM25DamaS * loopNum.s) / time
    }
    
    var battleDPS =document.getElementById("battleDPS");
    battleDPS.rows[1].cells[1].innerHTML = Math.round(dps96.b);
    battleDPS.rows[1].cells[2].innerHTML = Math.round(dps96.am);
    battleDPS.rows[1].cells[3].innerHTML = Math.round(dps96.ap);
    battleDPS.rows[1].cells[4].innerHTML = Math.round(dps96.s);
    battleDPS.rows[2].cells[1].innerHTML = Math.round(dps97.b);
    battleDPS.rows[2].cells[2].innerHTML = Math.round(dps97.am);
    battleDPS.rows[2].cells[3].innerHTML = Math.round(dps97.ap);
    battleDPS.rows[2].cells[4].innerHTML = Math.round(dps97.s);
    battleDPS.rows[3].cells[1].innerHTML = Math.round(dps98.b);
    battleDPS.rows[3].cells[2].innerHTML = Math.round(dps98.am);
    battleDPS.rows[3].cells[3].innerHTML = Math.round(dps98.ap);
    battleDPS.rows[3].cells[4].innerHTML = Math.round(dps98.s);
    battleDPS.rows[4].cells[1].innerHTML = Math.round(dps25.b);
    battleDPS.rows[4].cells[2].innerHTML = Math.round(dps25.am);
    battleDPS.rows[4].cells[3].innerHTML = Math.round(dps25.ap);
    battleDPS.rows[4].cells[4].innerHTML = Math.round(dps25.s);

    console.info("实战元气："+fYQ);
    console.info("实战命中："+(fMZ*100).toFixed(2));
    console.info("实战会心："+(fHX*100).toFixed(2));
    console.info("实战会心效果："+(fHXXG*100).toFixed(2));
    console.info("实战加速："+(fJS*100).toFixed(2));
    console.info("实战无双："+(fWS*100).toFixed(2));
    console.info("实战基础破防："+fJCPF);
    console.info("实战最终破防："+fZZPF);
    console.info("实战基础攻击："+fJCGJ);
    console.info("实战面板攻击："+(fMBGJ).toFixed(2));


  }

    skillCal();
function skillCalNONE(){
    muZhuangCalNONE();
    //钟林；
    var zl96 = zhongLingDamaCalNONE(actualMZ96NONE,actualSP96NONE,defense.d96,fHXNONE);
    var zl97 = zhongLingDamaCalNONE(actualMZ97NONE,actualSP97NONE,defense.d97,fHXNONE);
    var zl98 = zhongLingDamaCalNONE(actualMZ98NONE,actualSP98NONE,defense.d98,fHXNONE);
    var zl99 = zhongLingDamaCalNONE(actualMZ99NONE,actualSP99NONE,defense.d99,fHXNONE);
    var zl25 = zhongLingDamaCalNONE(actualMZ25NONE,actualSP25NONE,defense.d25,fHXNONE);
    var zl96Max = zhongLingDamaCalNONE(actualMZ96NONE,actualSP96NONE,defense.d96,1);
    var zl97Max = zhongLingDamaCalNONE(actualMZ97NONE,actualSP97NONE,defense.d97,1);
    var zl98Max = zhongLingDamaCalNONE(actualMZ98NONE,actualSP98NONE,defense.d98,1);
    var zl99Max = zhongLingDamaCalNONE(actualMZ99NONE,actualSP99NONE,defense.d99,1);
    var zl25Max = zhongLingDamaCalNONE(actualMZ25NONE,actualSP25NONE,defense.d25,1);
    var lc96 = lanCuiDamaDamaCalNONE(actualMZ96NONE,actualSP96NONE,defense.d96,fHXNONE);
    var lc97 = lanCuiDamaDamaCalNONE(actualMZ97NONE,actualSP97NONE,defense.d97,fHXNONE);
    var lc98 = lanCuiDamaDamaCalNONE(actualMZ98NONE,actualSP98NONE,defense.d98,fHXNONE);
    var lc99 = lanCuiDamaDamaCalNONE(actualMZ99NONE,actualSP99NONE,defense.d99,fHXNONE);
    var lc25 = lanCuiDamaDamaCalNONE(actualMZ25NONE,actualSP25NONE,defense.d25,fHXNONE);
    var lc96Max = lanCuiDamaDamaCalNONE(actualMZ96NONE,actualSP96NONE,defense.d96,1);
    var lc97Max = lanCuiDamaDamaCalNONE(actualMZ97NONE,actualSP97NONE,defense.d97,1);
    var lc98Max = lanCuiDamaDamaCalNONE(actualMZ98NONE,actualSP98NONE,defense.d98,1);
    var lc99Max = lanCuiDamaDamaCalNONE(actualMZ99NONE,actualSP99NONE,defense.d99,1);
    var lc25Max = lanCuiDamaDamaCalNONE(actualMZ25NONE,actualSP25NONE,defense.d25,1);  
    var sy96 = shangYangDamaCalNONE(actualMZ96NONE,actualSP96NONE,defense.d96,fHXNONE);
    var sy97 = shangYangDamaCalNONE(actualMZ97NONE,actualSP97NONE,defense.d97,fHXNONE);
    var sy98 = shangYangDamaCalNONE(actualMZ98NONE,actualSP98NONE,defense.d98,fHXNONE);
    var sy99 = shangYangDamaCalNONE(actualMZ99NONE,actualSP99NONE,defense.d99,fHXNONE);
    var sy25 = shangYangDamaCalNONE(actualMZ25NONE,actualSP25NONE,defense.d25,fHXNONE);
    var sy96Max = shangYangDamaCalNONE(actualMZ96NONE,actualSP96NONE,defense.d96,1);
    var sy97Max = shangYangDamaCalNONE(actualMZ97NONE,actualSP97NONE,defense.d97,1);
    var sy98Max = shangYangDamaCalNONE(actualMZ98NONE,actualSP98NONE,defense.d98,1);
    var sy99Max = shangYangDamaCalNONE(actualMZ99NONE,actualSP99NONE,defense.d99,1);
    var sy25Max = shangYangDamaCalNONE(actualMZ25NONE,actualSP25NONE,defense.d25,1);
    var ym96 = yangMingDamaCalNONE(actualMZ96NONE,actualSP96NONE,defense.d96,fYMSHNONE);
    var ym97 = yangMingDamaCalNONE(actualMZ97NONE,actualSP97NONE,defense.d97,fYMSHNONE);
    var ym98 = yangMingDamaCalNONE(actualMZ98NONE,actualSP98NONE,defense.d98,fYMSHNONE);
    var ym99 = yangMingDamaCalNONE(actualMZ99NONE,actualSP99NONE,defense.d99,fYMSHNONE);
    var ym25 = yangMingDamaCalNONE(actualMZ25NONE,actualSP25NONE,defense.d25,fYMSHNONE);
    var ymfy96 = yangMingDamaCalNONE(actualMZ96NONE,actualSP96NONE,defense.d96,(fYMSHNONE+0.2));
    var ymfy97 = yangMingDamaCalNONE(actualMZ97NONE,actualSP97NONE,defense.d97,(fYMSHNONE+0.2));
    var ymfy98 = yangMingDamaCalNONE(actualMZ98NONE,actualSP98NONE,defense.d98,(fYMSHNONE+0.2));
    var ymfy99 = yangMingDamaCalNONE(actualMZ99NONE,actualSP99NONE,defense.d99,(fYMSHNONE+0.2));
    var ymfy25 = yangMingDamaCalNONE(actualMZ25NONE,actualSP25NONE,defense.d25,(fYMSHNONE+0.2));   
    var ymhb96 = yangMingHBDamaCalNONE(actualMZ96NONE,actualSP96NONE,defense.d96,fYMSHNONE);
    var ymhb97 = yangMingHBDamaCalNONE(actualMZ97NONE,actualSP97NONE,defense.d97,fYMSHNONE);
    var ymhb98 = yangMingHBDamaCalNONE(actualMZ98NONE,actualSP98NONE,defense.d98,fYMSHNONE);
    var ymhb99 = yangMingHBDamaCalNONE(actualMZ99NONE,actualSP99NONE,defense.d99,fYMSHNONE);
    var ymhb25 = yangMingHBDamaCalNONE(actualMZ25NONE,actualSP25NONE,defense.d25,fYMSHNONE);    
    var ymhbfy96 = yangMingHBDamaCalNONE(actualMZ96NONE,actualSP96NONE,defense.d96,(fYMSHNONE+0.2));
    var ymhbfy97 = yangMingHBDamaCalNONE(actualMZ97NONE,actualSP97NONE,defense.d97,(fYMSHNONE+0.2));
    var ymhbfy98 = yangMingHBDamaCalNONE(actualMZ98NONE,actualSP98NONE,defense.d98,(fYMSHNONE+0.2));
    var ymhbfy99 = yangMingHBDamaCalNONE(actualMZ99NONE,actualSP99NONE,defense.d99,(fYMSHNONE+0.2));
    var ymhbfy25 = yangMingHBDamaCalNONE(actualMZ25NONE,actualSP25NONE,defense.d25,(fYMSHNONE+0.2));
    var ys96 = yuShiDamaCalNONE(actualMZ96NONE,actualSP96NONE,defense.d96);
    var ys97 = yuShiDamaCalNONE(actualMZ97NONE,actualSP97NONE,defense.d97);
    var ys98 = yuShiDamaCalNONE(actualMZ98NONE,actualSP98NONE,defense.d98);
    var ys99 = yuShiDamaCalNONE(actualMZ99NONE,actualSP99NONE,defense.d99);
    var ys25 = yuShiDamaCalNONE(actualMZ25NONE,actualSP25NONE,defense.d25);

//-------------------------------------------------------------------------------------------


    function ymfmCal(num1,num2) {
      return 0.7803*num1+0.0805*num1*num2*(1+fYMSHNONE+0.1)
    }
    var battleTime = {
      b: time - time / 15 * gcd - gcd + (luansa ? gcd : 0),
      am: time - time / 25 * gcd - gcd + (luansa ? gcd : 0),
      ap: time - gcd + (luansa ? gcd : 0),
      s: time + (luansa ? gcd : 0),
    }
    var loopNum = {
      b: (battleTime.b - 4 * gcd) / (10 * gcd),
      am: (battleTime.am - 4 * gcd) / (10 * gcd),
      ap: (battleTime.ap - 4 * gcd) / (10 * gcd),
      s: (battleTime.s - 4 * gcd) / (10 * gcd),
    }
    var fumoNum = {
      b: sLancuiNONE + sZhonglingNONE + sShangyangNONE - 11,
      am: sLancuiNONE + sZhonglingNONE + sShangyangNONE - 11,
      ap: sLancuiNONE + sZhonglingNONE + sShangyangNONE - 11,
      s: 20
    }
    var lancuiNum = {
      b: 7 + sLancuiNONE * loopNum.b,
      am: 7 + sLancuiNONE * loopNum.am,
      ap: 7 + sLancuiNONE * loopNum.ap,
      s: 7 + (sLancuiNONE - 7) * loopNum.b,
      smax: 7 * loopNum.s
    }
    var zhonglingNum = {
      b: 7 + sZhonglingNONE * loopNum.b,
      am: 7 + sZhonglingNONE * loopNum.am,
      ap: 7 + sZhonglingNONE * loopNum.ap,
      s: 7 + (sZhonglingNONE - 7) * loopNum.b,
      smax: 7 * loopNum.s
    }
    var shangyangNum = {
      b: 7 + sShangyangNONE * loopNum.b,
      am: 7 + sShangyangNONE * loopNum.am,
      ap: 7 + sShangyangNONE * loopNum.ap,
      s: 7 + (sShangyangNONE - 7) * loopNum.b,
      smax: 7 * loopNum.s
    }
//阳明大附魔
    var fumobianTian = $("#bianTian").is(':checked') ? 1 : 0;
    var ymFM96 = 0;
    var ymFM97 = 0;
    var ymFM98 = 0;
    var ymFM99 = 0;
    var ymFM25 = 0;
    var ymFM96Dama = 0;
    var ymFM97Dama = 0;
    var ymFM98Dama = 0;
    var ymFM99Dama = 0;
    var ymFM25Dama = 0;
    var ymFM96DamaS = 0;
    var ymFM97DamaS = 0;
    var ymFM98DamaS = 0;
    var ymFM99DamaS = 0;
    var ymFM25DamaS = 0;
//DPS
    var dps96 = {
      b: (lancuiNum.b * lc96 + zhonglingNum.b * zl96 + shangyangNum.b * sy96 + ymhb96 + ymhbfy96 * loopNum.b + ymfy96 * loopNum.b * 6 + ys96 * (1 + loopNum.b) + ymFM96Dama * loopNum.b) / time,
      am: (lancuiNum.am * lc96 + zhonglingNum.am * zl96 + shangyangNum.am * sy96 + ymhb96 + ymhbfy96 * loopNum.am + ymfy96 * loopNum.am * 6 + ys96 * (1 + loopNum.am) + ymFM96Dama * loopNum.am) / time,
      ap: (lancuiNum.ap * lc96 + zhonglingNum.ap * zl96 + shangyangNum.ap * sy96 + ymhb96 + ymhbfy96 * loopNum.ap + ymfy96 * loopNum.ap * 6 + ys96 * (1 + loopNum.ap) + ymFM96Dama * loopNum.ap) / time,
      s: (lancuiNum.s * lc96 + lancuiNum.smax * lc96Max + zhonglingNum.s * zl96 + zhonglingNum.smax*zl96Max + shangyangNum.s * sy96 + shangyangNum.smax * sy96Max + ymhb96 + ymhbfy96 * loopNum.s + ymfy96 * loopNum.s * 6 + ys96 * (1 + loopNum.s) + ymFM96DamaS * loopNum.s) / time
    }
    var dps97 = {
      b: (lancuiNum.b * lc97 + zhonglingNum.b * zl97 + shangyangNum.b * sy97 + ymhb97 + ymhbfy97 * loopNum.b + ymfy97 * loopNum.b * 6 + ys97 * (1 + loopNum.b) + ymFM97Dama * loopNum.b) / time,
      am: (lancuiNum.am * lc97 + zhonglingNum.am * zl97 + shangyangNum.am * sy97 + ymhb97 + ymhbfy97 * loopNum.am + ymfy97 * loopNum.am * 6 + ys97 * (1 + loopNum.am) + ymFM97Dama * loopNum.am) / time,
      ap: (lancuiNum.ap * lc97 + zhonglingNum.ap * zl97 + shangyangNum.ap * sy97 + ymhb97 + ymhbfy97 * loopNum.ap + ymfy97 * loopNum.ap * 6 + ys97 * (1 + loopNum.ap) + ymFM97Dama * loopNum.ap) / time,
      s: (lancuiNum.s * lc97 + lancuiNum.smax * lc97Max + zhonglingNum.s * zl97 + zhonglingNum.smax*zl97Max + shangyangNum.s * sy97 + shangyangNum.smax * sy97Max + ymhb97 + ymhbfy97 * loopNum.s + ymfy97 * loopNum.s * 6 + ys97 * (1 + loopNum.s) + ymFM97DamaS * loopNum.s) / time
    }
    var dps98 = {
      b: (lancuiNum.b * lc98 + zhonglingNum.b * zl98 + shangyangNum.b * sy98 + ymhb98 + ymhbfy98 * loopNum.b + ymfy98 * loopNum.b * 6 + ys98 * (1 + loopNum.b) + ymFM98Dama * loopNum.b) / time,
      am: (lancuiNum.am * lc98 + zhonglingNum.am * zl98 + shangyangNum.am * sy98 + ymhb98 + ymhbfy98 * loopNum.am + ymfy98 * loopNum.am * 6 + ys98 * (1 + loopNum.am) + ymFM98Dama * loopNum.am) / time,
      ap: (lancuiNum.ap * lc98 + zhonglingNum.ap * zl98 + shangyangNum.ap * sy98 + ymhb98 + ymhbfy98 * loopNum.ap + ymfy98 * loopNum.ap * 6 + ys98 * (1 + loopNum.ap) + ymFM98Dama * loopNum.ap) / time,
      s: (lancuiNum.s * lc98 + lancuiNum.smax * lc98Max + zhonglingNum.s * zl98 + zhonglingNum.smax*zl98Max + shangyangNum.s * sy98 + shangyangNum.smax * sy98Max + ymhb98 + ymhbfy98 * loopNum.s + ymfy98 * loopNum.s * 6 + ys98 * (1 + loopNum.s) + ymFM98DamaS * loopNum.s) / time
    }

    var dps25 = {
      b: (lancuiNum.b * lc25 + zhonglingNum.b * zl25 + shangyangNum.b * sy25 + ymhb25 + ymhbfy25 * loopNum.b + ymfy25 * loopNum.b * 6 + ys25 * (1 + loopNum.b) + ymFM25Dama * loopNum.b) / time,
      am: (lancuiNum.am * lc25 + zhonglingNum.am * zl25 + shangyangNum.am * sy25 + ymhb25 + ymhbfy25 * loopNum.am + ymfy25 * loopNum.am * 6 + ys25 * (1 + loopNum.am) + ymFM25Dama * loopNum.am) / time,
      ap: (lancuiNum.ap * lc25 + zhonglingNum.ap * zl25 + shangyangNum.ap * sy25 + ymhb25 + ymhbfy25 * loopNum.ap + ymfy25 * loopNum.ap * 6 + ys25 * (1 + loopNum.ap) + ymFM25Dama * loopNum.ap) / time,
      s: (lancuiNum.s * lc25 + lancuiNum.smax * lc25Max + zhonglingNum.s * zl25 + zhonglingNum.smax*zl25Max + shangyangNum.s * sy25 + shangyangNum.smax * sy25Max + ymhb25 + ymhbfy25 * loopNum.s + ymfy25 * loopNum.s * 6 + ys25 * (1 + loopNum.s) + ymFM25DamaS * loopNum.s) / time
    }
    
    var battleDPS =document.getElementById("DPS");
    DPS.rows[1].cells[1].innerHTML = Math.round(dps96.b);
    DPS.rows[1].cells[2].innerHTML = Math.round(dps96.am);
    DPS.rows[1].cells[3].innerHTML = Math.round(dps96.ap);
    DPS.rows[1].cells[4].innerHTML = Math.round(dps96.s);
    DPS.rows[2].cells[1].innerHTML = Math.round(dps97.b);
    DPS.rows[2].cells[2].innerHTML = Math.round(dps97.am);
    DPS.rows[2].cells[3].innerHTML = Math.round(dps97.ap);
    DPS.rows[2].cells[4].innerHTML = Math.round(dps97.s);
    DPS.rows[3].cells[1].innerHTML = Math.round(dps98.b);
    DPS.rows[3].cells[2].innerHTML = Math.round(dps98.am);
    DPS.rows[3].cells[3].innerHTML = Math.round(dps98.ap);
    DPS.rows[3].cells[4].innerHTML = Math.round(dps98.s);
    DPS.rows[4].cells[1].innerHTML = Math.round(dps25.b);
    DPS.rows[4].cells[2].innerHTML = Math.round(dps25.am);
    DPS.rows[4].cells[3].innerHTML = Math.round(dps25.ap);
    DPS.rows[4].cells[4].innerHTML = Math.round(dps25.s);
  }

    skillCalNONE();

//-------------------------------------------------------------------------------------------

    //监听事件
    //属性更改事件
    for (var i = 0; i < $('input[type=text]').length; i++) {
      $('input[type=text]')[i].addEventListener("input", function () {
        resultSum();
        skillCal();//技能计算函数
        skillCalNONE();
      })
    }

    //input添加监听事件           （注：JS改变数值事件时也应该加入）
    for (var i = 0; i < $("div[data-buff='water'] li").length; i++) {
      $("div[data-buff='water'] li")[i].addEventListener("click", function () {
        skillCal();//技能计算函数
        skillCalNONE();
      });
    }
    for (var i = 0; i < $("div[data-buff='thunder'] li").length; i++) {
      $("div[data-buff='thunder'] li")[i].addEventListener("click", function () {
        skillCal();//技能计算函数
        skillCalNONE();
      });
    }
    for (var i = 0; i < $("div[data-buff='wind'] li").length; i++) {
      $("div[data-buff='wind'] li")[i].addEventListener("click", function () {
        skillCal();//技能计算函数
        skillCalNONE();
      });
    }
    $("div[data-skill='ymShanghai'] li").click(function () {
      skillCal();//技能计算函数
        skillCalNONE();
    })
    $("div[data-skill='ymHuixin'] li").click(function () {
      skillCal();//技能计算函数
        skillCalNONE();
    })

    for (var i = 1; i < $(".xiaochizhenfa li").length; i++) {
      $(".xiaochizhenfa li")[i].addEventListener("click", function () {
        skillCal();//技能计算函数
        skillCalNONE();
      });
    }
    //复选框样式的特效、增益[监听事件]
    for (var i = 0; i < $("label").length; i++) {
      $($("input")[i]).click(function () {
        skillCal();//技能计算函数
        skillCalNONE();
      });
    }
    for (var i = 0; i < document.getElementsByClassName("radio-button")[6].children.length; i++) {
      document.getElementsByClassName("radio-button")[6].children[i].addEventListener("click", function () {
        if (this.innerText == "乱洒青荷") {
          luansa = true;
        } else {
          luansa = false;
        }
        if (this.innerText == "清流") {
          qingliu = true;
        } else {
          qingliu = false;
        }
        resultSum() ;
        skillCal();
        skillCalNONE();
      })
    }

    $(".btn01").click(function () {
      $("input[data-attributes='yuanQi']")[0].value = "";
      $("input[data-attributes='gongJi']")[0].value = "";
      $("input[data-attributes='mingZhong']")[0].value = "";
      $("input[data-attributes='huiXin']")[0].value = "";
      $("input[data-attributes='huiXiao']")[0].value = "";
      $("input[data-attributes='jiaSu']")[0].value = "";
      $("input[data-attributes='poFang']")[0].value = "";
      $("input[data-attributes='wuShuang']")[0].value = "";
    });

    $(".btn02").click(function () {
      setCookie("ll_yuanQi", $("input[data-attributes='yuanQi']")[0].value)
      setCookie("ll_gongJi", $("input[data-attributes='gongJi']")[0].value)
      setCookie("ll_mingZhong", $("input[data-attributes='mingZhong']")[0].value)
      setCookie("ll_huiXin", $("input[data-attributes='huiXin']")[0].value)
      setCookie("ll_huiXiao", $("input[data-attributes='huiXiao']")[0].value)
      setCookie("ll_jiaSu", $("input[data-attributes='jiaSu']")[0].value)
      setCookie("ll_poFang", $("input[data-attributes='poFang']")[0].value)
      setCookie("ll_wuShuang", $("input[data-attributes='wuShuang']")[0].value )
      
      setCookie("ll_water",$("div[data-buff='water'] li.active").children()[0].value)
      setCookie("ll_thunder",$("div[data-buff='thunder'] li.active").children()[0].value)
      setCookie("ll_wind",$("div[data-buff='wind'] li.active").children()[0].value)
      setCookie("ll_tzNuchi",$("#tzNuchi").is(':checked'))
      setCookie("ll_tzZhaoshi",$("#tzZhaoshi").is(':checked'))
      setCookie("ll_smallCw",$("#smallCw").is(':checked'))
      setCookie("ll_bigCw",$("#bigCw").is(':checked'))
    });

    $(".btn03").click(function () {

    });

  setCookie("ll_about", "about");

    function setCookie(name, value) {
      var Days = 90;
      var exp = new Date();
      exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
      document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    }
    function getCookie(name) {
      var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
      if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
      else
        return null;
    } 
});

