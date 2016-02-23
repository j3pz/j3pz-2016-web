<?php
	header("Content-Type: application/json; charset=UTF-8");
	include('../config.php');
	function tinyurl ($id){
		global $dbh;
		$key = "ziofat";
		$legalChar = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		$hex = md5($key.$id);
		$outChar = "";
		for ($i=0; $i < 4; $i++) { 
			$hexClip = intval(substr($hex,$i*8,4),16);
			$hexClip = $hexClip&0x3FFFFFFF;
			$outChar = "";
			for ($j=0; $j < 6; $j++) { 
				$index = $hexClip&0x0000003D;
				$outChar = $outChar.substr($legalChar,$index,1);
				$hexClip = $hexClip >> 1;  
			}
			$sth = $dbh->prepare("SELECT COUNT(`link`) FROM `case` WHERE `link`=?");
			$sth->execute(array($outChar));
			if(!$sth->fetchColumn() > 0) break;
		}
		return $outChar;
	}
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata,true);
	$result = false;
	$isLogin = false;
	if(isset($_COOKIE["user"])&&isset($_COOKIE["uid"])){
		$uid = stripslashes(trim($_COOKIE["uid"]));
		$token = stripslashes(trim($_COOKIE["token"]));
		$dbh = new PDO('mysql:host='.DB_HOST.';port='.DB_PORT.';dbname='.DB_NAME, DB_USER, DB_PASSWORD);
		$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$dbh->exec("set names 'utf8'");

		unset($sth);
		$sth = $dbh->prepare("SELECT `name`,`token` FROM `user` WHERE `uid`=?");
		$sth->execute(array($uid));
		$row = $sth->fetch();
		$usrName = $row['name'];
		if($row['token']==$token) $isLogin = true;
		else $result = array('err'=> true,'errReason'=> "您还没有登录");
	}else{
		$result = array('err'=> true,'errReason'=> "您还没有登录");
	}
	$saveid = $request['saveid'];
	$equips = $request['equips'];
	$attributeStone = $request['attributeStone'];
	$tixing = $request['tixing'];
	$name = $request['name'];
	$menpai = $request['menpai'];
	$attr =  $request['result'];
	$buff =  $request['buff'];
	if($name == "") $name="方案".$saveid;
	if($saveid===""||$saveid<0) $result = array('err'=> true,'errReason'=> "保存失败，选择的方案不存在");
	else{
		try{
			$dbh = new PDO('mysql:host='.DB_HOST.';port='.DB_PORT.';dbname='.DB_NAME, DB_USER, DB_PASSWORD);
			$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$dbh->exec("set names 'utf8'");
			// 保存方案处理
			$attrMap = array("0" => 0,"dodge" => 16,"parryBase" => 17,"parryValue" => 18,"toughness" => 19,"attack" => 20,"heal" => 21,"crit" => 22,"critEffect" => 23,"overcome" => 24,"acce" => 25,"hit" => 26,"strain" => 27);
			$saveStr = "";
			for ($i=0; $i < 13; $i++) { 
				if(!isset($equips[$i])) {
					$saveStr = $saveStr."0;0;0;-1,-1,-1,;5,5,5,;0,0,0,;-1,-1,-1,;0,0,0,0|";
					continue;
				}
				$saveStr = $saveStr.$equips[$i]['id'].";";
				$saveStr = $saveStr.$equips[$i]['strengthen'].";";
				$saveStr = $saveStr.$equips[$i]['enhance'].";";
				$typeList = "";
				$levelList = "";
				$holeTypeList = "";
				$holeAttrList = "";
				for ($j=0; $j < 3; $j++) { 
					if($j<count($equips[$i]['embed'])){
						$typeList = $typeList.$equips[$i]['embed'][$j]['typeId'].",";
						$levelList = $levelList.($equips[$i]['embed'][$j]['level']-1).",";
					}else{
						$typeList = $typeList."-1,";
						$levelList = $levelList."5,";
					}
					if($j<count($equips[$i]['holes'])){
						$holeTypeList = $holeTypeList.$equips[$i]['holes'][$j]['typeId'].",";
						$holeAttrList = $holeAttrList.$equips[$i]['holes'][$j]['attrId'].",";
					}else{
						$holeTypeList = $holeTypeList."0,";
						$holeAttrList = $holeAttrList."-1,";
					}
				}
				$saveStr = $saveStr.$typeList.";".$levelList.";";
				$saveStr = $saveStr.$holeTypeList.";".$holeAttrList.";";
				$saveStr = $saveStr.$equips[$i]['magicChange']['level'].",";
				$saveStr = $saveStr.$attrMap[$equips[$i]['magicChange']['origin']].",";
				$saveStr = $saveStr.$attrMap[$equips[$i]['magicChange']['target']].",";
				$saveStr = $saveStr.$equips[$i]['magicChange']['ratio']."|";
			}
			
			$saveStr = $saveStr.implode(",",$attributeStone[0])."|";
			$saveStr = $saveStr.implode(",",$attributeStone[1])."|";
			$saveStr = $saveStr.$tixing;
			// 属性记录处理
			$attrStr = $attr['score'];
			$attrArr = array("score","body","spirit","strength","agility","spunk","physicsShield","magicShield","dodge","parryBase","parryValue","toughness","basicAttack","attack","heal","crit","critEffect","overcome","acce","hit","strain","huajing","threat","life","acceLevel");
			for ($i=1; $i < 25; $i++) { 
				$attrStr = $attrStr.",".$attr[$attrArr[$i]];
			}
			// Buff处理
			$buffList = implode(",", $buff);
			$result = array('err'=> false);
			if($saveid==0){
				unset($sth);
				$sth = $dbh->prepare("SELECT `equipNum` FROM `user` WHERE `uid`=?");
				$sth->execute(array($uid));
				$row = $sth->fetch();
				$equipNum = $row['equipNum'];
				unset($sth);
				$sth = $dbh->prepare("SELECT COUNT(saveid) FROM `case` WHERE `uid`=?");
				$sth->execute(array($uid));
				$row = $sth->fetch();
				$hasSaved = $row['COUNT(saveid)'];
				if($hasSaved>=$equipNum) $result = array('err'=> true,'errReason' => "可保存方案数已达上限");
				else{
					unset($sth);
					$transcationFlag = true;
					$dbh->beginTransaction();
					$sth = $dbh->prepare("INSERT INTO `save` (`save`,`menpai`,`attr`,`buff`) values (?,?,?,?)");
					$sth->execute(array($saveStr,$menpai,$attrStr,$buffList));
					$savedid = $dbh->lastInsertId();
					$csid = $hasSaved + 1;
					$link = tinyurl($saveid);
					$sthe = $dbh->prepare("INSERT INTO `case` (`uid`,`csid`,`saveid`,`name`,`link`) values (?,?,?,?,?)");
					$sthe->execute(array($uid,$csid,$savedid,$name,$link));
					$dbh->commit();
				}
			}else{
				unset($sth);
				$sth = $dbh->prepare("SELECT COUNT(saveid) FROM `case` WHERE `uid`=? AND `saveid`=?");
				$sth->execute(array($uid,$saveid));
				$row = $sth->fetch();
				if($row['COUNT(saveid)']>0){
					unset($sth);
					$sth = $dbh->prepare("UPDATE `save` SET `save` =? , `menpai`=? , `attr`=?, `buff`=? WHERE `id`=?");
					$sth->execute(array($saveStr,$menpai,$attrStr,$buffList,$saveid));
				}else{
					$result = array('err'=> true,'errReason' => "方案不存在");
				}
			}
		}catch (PDOException $e){
			if(isset($transcationFlag)) $dbh->rollBack();
			$result = array('err'=> true,'errReason'=> "数据库连接异常，请稍候再试");
			logResult("Error!: " . $e->getMessage() . "<br/>");
		}
	}
	$jsonText = json_encode($result);
	$result = urldecode($jsonText);
	echo $result;
?>