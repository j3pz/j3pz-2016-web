<?php
	header("Content-Type: application/json; charset=UTF-8");
	require '../config.php';
	$saveList = array();
	$isLogin = false;
	if(isset($_COOKIE["user"])&&isset($_COOKIE["uid"])){
		$uid = stripslashes(trim($_COOKIE["uid"]));
		$token = stripslashes(trim($_COOKIE["token"]));
		$dbh = new PDO('mysql:host='.DB_HOST.';port='.DB_PORT.';dbname='.DB_NAME, DB_USER, DB_PASSWORD);
		$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$dbh->exec("set names 'utf8'");

		$sth = $dbh->prepare("SELECT `name`,`token` FROM `user` WHERE `uid`=?");
		$sth->execute(array($uid));
		$row = $sth->fetch();
		$usrName = $row['name'];
		if($row['token']==$token) $isLogin = true;
		else $saveList = array('err'=> true,'errReason'=> "您还没有登录");
	}else{
		$saveList = array('err'=> true,'errReason'=> "您还没有登录");
	}

	if($isLogin){
		try{
			$dbh = new PDO('mysql:host='.DB_HOST.';port='.DB_PORT.';dbname='.DB_NAME, DB_USER, DB_PASSWORD);
			$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$dbh->exec("set names 'utf8'");

			unset($sth);
			$sth = $dbh->prepare("SELECT `equipNum` FROM `user` WHERE `uid` = ?");
			$sth->execute(array($uid));
			$row = $sth->fetch();
			$equipMaxNumber = $row['equipNum'];
			unset($sth);
			$sth = $dbh->prepare("SELECT * FROM `case` WHERE `uid` = ?");
			$sth->execute(array($uid));
			$res = $sth->fetchAll();
			$i=0;
			$sth = $dbh->prepare("SELECT `menpai` FROM `save` WHERE `id` = ?");
			$assignUrl = $dbh->prepare("UPDATE `case` SET `link` =? WHERE `saveid`=?");
			foreach ($res as $row){
				$link = $row['link'];
				if($link==""){
					$saveid = $row['saveid'];
					$link = tinyurl($saveid);
					$assignUrl->execute(array($link,$saveid));
				}
				if($i < $equipMaxNumber){
					$sth->execute(array($row['saveid']));
					$saveRow = $sth->fetch();
					$dps = array("huajian","tianluo","fenying","yijin","zixia","bingxin","dujing","taixu","cangjian","jingyu","aoxue","xiaochen","fenshan");
					$hps = array("lijing","yunchang","butian");
					$t = array("tielao","tiegu","mingzun","xisui");
					$menpai = $saveRow['menpai'];
					if(in_array($menpai, $dps)) $xinfaType="dps";
					else if(in_array($menpai, $hps)) $xinfaType="hps";
					else if(in_array($menpai, $t)) $xinfaType="t";
					$savedCase = array('csid' => $row['csid'], 'saveid' => $row['saveid'], 'name' => $row['name'], 'link' => $link, 'isPublic'=> $row['isPublic']>0,'menpai'=>$saveRow['menpai'],'xinfaType'=>$xinfaType);
					$saveList[] = $savedCase;
				}
				$i++;
			}
		} catch (PDOException $e) {
			$saveList = array('err'=> true,'errReason'=>"数据库连接异常，请稍候再试");
		}
	}
	$jsonText = json_encode($saveList);
	$result = urldecode($jsonText);
	echo $result;

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
			if(!($sth->fetchColumn() > 0)) break;
			unset($sth);
		}
		return $outChar;
	}
?>