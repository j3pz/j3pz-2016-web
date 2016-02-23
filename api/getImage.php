<?php
header("Content-Type: application/json; charset=UTF-8");
require_once '../libs/oss/sdk.class.php';
require_once '../libs/oss/util/oss_util.class.php';
$bucket = "j3pz";
$oss = new ALIOSS(OSS_ACCESS_ID, OSS_ACCESS_KEY, OSS_ENDPOINT);

$postdata = file_get_contents("php://input");
$request = json_decode($postdata,true);

$bg = "../images/fabg.jpg";
$im = imagecreatefromjpeg($bg);
$equips = $request['equips'];
$attributeStone = $request['attributeStone'];
$results = $request['result'];
$menpai = $request['menpai'];
$buff = $request['buff'];
$tixing = $request['tixing'];

$darkgreen = ImageColorAllocate ($im, 7, 25, 11);
$gray = ImageColorAllocate ($im, 150, 150, 150);
putenv('GDFONTPATH=' . realpath('.'));
$fnt = "../css/fonts/msyh.ttc";
$fntbd = "../css/fonts/msyhbd.ttc";

$magicChangeLevel = array("","一","二","三","四","五","六","七","八","九");
$attributeList = array("body"=> "体质","spirit"=> "根骨","spunk"=> "元气","strength"=> "力道","agility"=> "身法","physicsShield"=> "外防", "magicShield"=> "内防","dodge"=> "闪避","parryBase"=> "招架","parryValue"=> "拆招","toughness"=> "御劲","attack"=> "攻击","heal"=> "治疗","crit"=> "会心","critEffect"=> "会效","overcome"=> "破防","hit"=> "命中","acce"=> "加速","strain"=>"无双","huajing"=>"化劲","threat"=>"威胁","life"=>"气血","magic"=>"内力","lifeRecovery"=>"回血","magicRecovery"=>"回内");

$sx = 50;
$sy = 105;
for ($i=0; $i < 13; $i++) { 
	if($menpai!="cangjian"&&$i==12) continue;
	// 输出装备名和装备的精炼等级
	$equipName = $equips[$i]["id"]=="0"?"未选取":$equips[$i]["id"];
	$equipName = explode("(", $equipName)[0];
	$equipLevel = $equips[$i]["id"]=="0"?"":"(".$equips[$i]["strengthen"].")";
	imagettftext($im, 10, 0, $sx - 20, $sy + 37 * $i, $darkgreen, $fntbd, $equipName.$equipLevel);
	if($equips[$i]["id"]!="0"){
		$quality = $equips[$i]['quality'];
		$attrList = explode(",", $equips[$i]['filter']);
		if(count($attrList)>3) array_splice($attrList, 2);
		imagettftext($im, 10, 0, $sx - 20, $sy + 17 + 37 * $i, $darkgreen, $fnt, $quality);
		imagettftext($im, 10, 0, $sx + 10, $sy + 17 + 37 * $i, $darkgreen, $fnt, implode(" ",$attrList));
	}
	// 输出装备洗炼的属性和品级比例
	if($equips[$i]["magicChange"]["level"]>0){
		$level = "[".$magicChangeLevel[$equips[$i]["magicChange"]["level"]]."品]";
		$ratio = $equips[$i]["magicChange"]["ratio"]."%";
		$origin = $attributeList[$equips[$i]["magicChange"]["origin"]];
		$target = $attributeList[$equips[$i]["magicChange"]["target"]];
		imagefttext($im, 10, 0, $sx + 110, $sy + 37 * $i, $darkgreen, $fnt, $origin."->".$target);
		imagefttext($im, 10, 0, $sx + 110, $sy + 17 + 37 * $i, $darkgreen, $fntbd, $level);
		imagefttext($im, 10, 0, $sx + 150, $sy + 17 + 37 * $i, $darkgreen, $fnt, $ratio);
	}
	// 输出装备镶嵌孔信息
	$holeNumber = array(2,2,2,2,2,2,1,1,0,0,1,3,3);
	for ($j=0; $j < $holeNumber[$i]; $j++) {
		$typeId = isset($equips[$i]["embed"][$j]["typeId"])?$equips[$i]["embed"][$j]["typeId"]:"-1";
		$level = isset($equips[$i]["embed"][$j]["level"])?$equips[$i]["embed"][$j]["level"]:"6";
		$imgSrc = imagecreatefromjpeg("../images/".$typeId."-".$level.".jpg");
		imagecopyresized($im, $imgSrc, $sx + 200 + 26 * $j, $sy - 9 + 37 * $i, 0, 0, 24, 24, 48, 48);
	}
	$cuilian = count($equips[$i]["holes"]);
	if($cuilian>0){
		for ($j=0; $j < $cuilian; $j++) { 
			$cuilianInfo = $equips[$i]["holes"][$j];
			if($cuilianInfo["oriAttr"]!=$cuilianInfo["tarAttr"]){
				$cuilianOri = $attributeList[$cuilianInfo["oriAttr"]];
				$cuilianTar = $attributeList[$cuilianInfo["tarAttr"]];
				$id = $cuilianInfo["id"] + 1;
				imagefttext($im, 10, 0, $sx + 290, $sy + 17 + 37 * $i, $darkgreen, $fnt, $id."号孔淬炼:".$cuilianOri."->".$cuilianTar);
			}
		}
	}
	if($equips[$i]["enhance"]!="0"){
		imagefttext($im, 10, 0, $sx + 290, $sy + 37 * $i, $darkgreen, $fnt, $equips[$i]["enhance"]);
	}
	imageline($im, $sx - 20, $sy + 22 + 37 * $i, $sx + 440, $sy + 22 + 37 * $i, $gray);
}
$dps = array("huajian","tianluo","fenying","yijin","zixia","bingxin","dujing","mowen","taixu","cangjian","jingyu","aoxue","xiaochen","fenshan");
$hps = array("lijing","yunchang","butian","xiangzhi");
$t = array("tielao","tiegu","mingzun","xisui");
if(in_array($menpai, $dps)){
	$magicList = array("life","spunk","basicAttack","attack","crit","critEffect","hit","acce","strain","overcome","physicsShield","magicShield","toughness","huajing","score");
	$magicDesc = array("气血","元气","基础攻击","面板攻击","会心率","会心效果","命中","加速","无双","破防","外防","内防","御劲","化劲","装备评分");
	if(in_array($menpai, array("huajian","tianluo","fenying","yijin"))){
		$magicList[1] = "spunk";
		$magicDesc[1] = "元气";
	}
	if(in_array($menpai, array("zixia","bingxin","dujing","mowen"))){
		$magicList[1] = "spirit";
		$magicDesc[1] = "根骨";
	}
	if(in_array($menpai, array("taixu","cangjian","fenshan"))){
		$magicList[1] = "agility";
		$magicDesc[1] = "身法";
	}
	if(in_array($menpai, array("jingyu","aoxue","xiaochen"))){
		$magicList[1] = "strength";
		$magicDesc[1] = "力道";
	}
	$attrY = $sy + 60;
	for ($i=0; $i < count($magicList); $i++) { 
		$colour = $darkgreen;
		if($i==7) $acceLevel = "(".$results['acceLevel'].")";
		else $acceLevel = "";
		if($i==8&&$results["huajing"]>25.14) $colour = $gray;
		if($i==9) $acceLevel = "(".round($results['overcome']/36.16925)."%)";
		if($i>=10&&$i<=13&&$results["huajing"]<=25.14) $colour = $gray; 
		imagefttext($im, 10, 0, $sx + 460 + $i%2 * 140, $attrY, $colour, $fntbd, $magicDesc[$i]);
		imagefttext($im, 10, 0, $sx + 530 + $i%2 * 140, $attrY, $colour, $fnt, $results[$magicList[$i]].$acceLevel);
		if($i%2) $attrY = $attrY + 30;
	}
}else if(in_array($menpai, $hps)){
	$attrY = $sy + 60;
	$magicList = array("life","spirit","basicHeal","heal","crit","critEffect","acce","hit","physicsShield","magicShield","toughness","huajing","score");
	$magicDesc = array("气血","根骨","基础治疗","面板治疗","会心率","会心效果","加速","命中","外防","内防","御劲","化劲","装备评分");
	for ($i=0; $i < count($magicList); $i++) { 
		$colour = $darkgreen;
		if($i==6) $acceLevel = "(".$results['acceLevel'].")";
		else $acceLevel = "";
		if($i>=7&&$i<=11&&$results["huajing"]<=25.14) $colour = $gray; 
		imagefttext($im, 10, 0, $sx + 460 + $i%2 * 150, $attrY, $colour, $fntbd, $magicDesc[$i]);
		imagefttext($im, 10, 0, $sx + 530 + $i%2 * 150, $attrY, $colour, $fnt, $results[$magicList[$i]].$acceLevel);
		if($i%2) $attrY = $attrY + 30;
	}
}else if(in_array($menpai, $t)){
	$attrY = $sy + 60;
	$magicList = array("life","body","physicsShield","magicShield","toughness","dodge","parryBase","parryValue","acce","hit","strain","score");
	$magicDesc = array("气血","体质","外功防御","内功防御","御劲","闪避","招架","拆招","加速","命中","无双","装备评分");
	for ($i=0; $i < count($magicList); $i++) { 
		$colour = $darkgreen;
		if($i==8) $acceLevel = "(".$results['acceLevel'].")";
		else $acceLevel = "";
		imagefttext($im, 10, 0, $sx + 460 + $i%2 * 150, $attrY, $colour, $fntbd, $magicDesc[$i]);
		imagefttext($im, 10, 0, $sx + 530 + $i%2 * 150, $attrY, $colour, $fnt, $results[$magicList[$i]].$acceLevel);
		if($i%2) $attrY = $attrY + 30;
	}
}
// 输出方案基本信息
$tixingList = array("成男","成女","萝莉","正太");
imagefttext($im, 10, 0, $sx + 460, $sy, $darkgreen, $fntbd, "体型");
imagefttext($im, 10, 0, $sx + 530, $sy, $darkgreen, $fnt, $tixingList[$tixing]);
imagefttext($im, 10, 0, $sx + 460, $sy + 20, $darkgreen, $fntbd, "五彩石");
imagefttext($im, 10, 0, $sx + 530, $sy + 20, $darkgreen, $fnt, $attributeStone[0][3]);
if($menpai=="cangjian") imagefttext($im, 10, 0, $sx + 530, $sy + 40, $darkgreen, $fnt, $attributeStone[1][3]=="0"?"未选取重剑五彩石":$attributeStone[1][3]);
imagefttext($im, 10, 0, $sx + 460, $sy+300, $darkgreen, $fntbd, "奇穴");
imagefttext($im, 10, 0, $sx + 460, $sy+325, $darkgreen, $fntbd, "气劲");
$countQixue = 0;
$countBuff = 0;
for ($i=0; $i < count($buff); $i++) { 
	$buffCur = $buff[$i];
	if($buffCur["type"]=="Qixue"){
		$imgSrc = imagecreatefrompng("../icons/".$buffCur["icon"].".png");
		imagecopyresized($im, $imgSrc, $sx + 495 + 90 * $countQixue, $sy + 285 , 0, 0, 24, 24, 45, 45);
		imagefttext($im, 10, 0, $sx + 525 + 90 * $countQixue, $sy + 302, $darkgreen, $fnt, $buffCur["name"]);
		$countQixue++;
	}
	else{
		$imgSrc = imagecreatefrompng("../icons/".$buffCur["icon"].".png");
		imagecopyresized($im, $imgSrc, $sx + 495 + 110 * ($countBuff%3), $sy + 310 + 30 * (int)($countBuff/3), 0, 0, 24, 24, 45, 45);
		imagefttext($im, 10, 0, $sx + 525 + 110 * ($countBuff%3), $sy + 325 + 30 * (int)($countBuff/3), $darkgreen, $fnt, $buffCur["name"]);
		$countBuff++;
	}
}

$fileId = getSeqID();
$filename = "../temp/".$fileId.".jpg";
if(imagejpeg($im,$filename,50)){
	$object = "preview/".$fileId.".jpg";
	$file_path = $filename;
	$options = array();
	// $res = $oss->upload_file_by_file($bucket, $object, $file_path, $options);
	// unlink($file_path);
	// $imgUrl = array('err'=> false,'url'=> "https://j3pz.oss-cn-hangzhou.aliyuncs.com/".$object);
	$imgUrl = array('err'=> false,'url'=> "../".$filename);
	// $filename_ori = "../temp/".$fileId."_o.jpg";
	// imagejpeg($im,$filename_ori,99);
	// $object = "original/".$fileId.".jpg";
	// $file_path = $filename_ori;
	// $options = array();
	// $res = $oss->upload_file_by_file($bucket, $object, $file_path, $options);
	// unlink($file_path);
}else{
	$imgUrl = array('err'=> true,'errReason'=> "图片生成失败，请稍候再试");
}
$jsonText = json_encode($imgUrl);
$result = urldecode($jsonText);
echo $result;

function getSeqID(){
	list($usec, $sec) = explode(" ", microtime()); 	
	$strsec	= sprintf("%s", $sec);
	for ($i=0; $i<4; $i++){
		$strsec = $strsec.rand(0, 9);
	}
	return $strsec;
}
ImageDestroy($im);
?>