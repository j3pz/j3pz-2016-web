<?php
	header("Content-Type: application/json; charset=UTF-8");
	include('../config.php');
	require '../libs/mail/PHPMailerAutoload.php';

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
		else $result = array('err'=> true,'errReason'=> "您还没有登录");
	}else{
		$result = array('err'=> true,'errReason'=> "您还没有登录");
	}
	$type = stripslashes(trim($_POST['type']));
	$content = stripslashes(trim($_POST['content']));
	$issue = stripslashes(trim($_POST['issue']));
	$author = stripslashes(trim($_POST['author']));
	if($type!="comment"&&$uid!=1&&$uid!=89628){
		$result = array('err'=> true,'errReason'=> "您没有权限做出该操作");
		$isLogin = false;
	}
	if($isLogin){
		try{
			$dbh = new PDO('mysql:host='.DB_HOST.';port='.DB_PORT.';dbname='.DB_NAME, DB_USER, DB_PASSWORD);
			$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$dbh->exec("set names 'utf8'");

			unset($sth);
			$sth = $dbh->prepare("SELECT `type`,`uid` FROM `issues` WHERE `id`=?;");
			$sth->execute(array($issue));
			$row = $sth->fetch();
			if($row['type']=="privacy"&&$uid!=$row['uid']&&$uid!=1) $result = array('err'=> true,'errReason'=> "您没有权限做出该操作");
			else{
				$dbh->beginTransaction();

				unset($sth);
				$sth = $dbh->prepare("INSERT INTO `comments` (`uid`,`name`,`content`,`issue`,`time`,`sysmsg`) VALUES (?,?,?,?,CURRENT_TIMESTAMP,?);");
				$sth->execute(array($uid,$author,$content,$issue,$type));
				$commentId = $dbh->lastInsertId();
				$sthe = $dbh->prepare("SELECT `time` FROM `comments` WHERE `id`=?");
				$sthe->execute(array($commentId));
				$row = $sthe->fetch();
				$result = array(
					'uid' => $uid, 
					'author' => $author,
					'content' => $content,  
					'timestamp' => $row['time'],
					'sysmsg' => $type
				);
				if($type=="comment"&&($uid==1||$uid==89628)){
					$needMailNotify = true;
					$needSystemNotify = true;
				}
				if($type=="close"&&($uid==1||$uid==89628)){
					$close = $dbh->prepare("UPDATE `issues` SET `state`=0 WHERE `id`=?;");
					$close->execute(array($issue));

					$needMailNotify = true;
					$needSystemNotify = true;
				}
				if($type=="reopen"&&($uid==1||$uid==89628)){
					$open = $dbh->prepare("UPDATE `issues` SET `state`=1 WHERE `id`=?;");
					$open->execute(array($issue));

					$needMailNotify = true;
					$needSystemNotify = true;
				}
				if($type=="duplicate"&&($uid==1||$uid==89628)){
					$direct = stripslashes(trim($_POST["direct"]));
					$duplicate = $dbh->prepare("UPDATE `issues` SET `direct`=? WHERE `id`=?;");
					$duplicate->execute(array($direct,$issue));

					$needMailNotify = false;
					$needSystemNotify = true;
				}
				if($type=="label"&&($uid==1||$uid==89628)){
					$labelList = stripslashes(trim($_POST["label"]));
					$label = $dbh->prepare("UPDATE `issues` SET `label`=? WHERE `id`=?;");
					$label->execute(array($labelList,$issue));
					$result["newLabel"] = explode("|",$labelList);

					$needMailNotify = false;
					$needSystemNotify = true;
				}
				if($type=="type"&&($uid==1||$uid==89628)){
					$newType = stripslashes(trim($_POST["newType"]));
					$label = $dbh->prepare("UPDATE `issues` SET `type`=? WHERE `id`=?;");
					$label->execute(array($newType,$issue));
					$result["newType"] = $newType;

					$needMailNotify = false;
					$needSystemNotify = true;
				}
				$dbh->commit();
				if($needMailNotify){
					unset($sth);
					$sth = $dbh->prepare("SELECT `email`, `name` FROM `user` WHERE `uid`=(SELECT `uid` FROM `issues` WHERE `id`=?)");
					$sth->execute(array($issue));
					$row = $sth->fetch();

					$mail = new PHPMailer;
					$mail->CharSet = "UTF-8";
					$mail->isSMTP();
					$mail->Host = 'smtp.qq.com';
					$mail->Port = 25;
					$mail->SMTPSecure = 'tls';
					$mail->SMTPAuth = true;
					$mail->Username = MAIL_ADDRESS;
					$mail->Password = MAIL_PASSWORD;
					$mail->setFrom('service@j3pz.com', '剑网3配装器用户服务');
					$mail->addAddress($row["email"], $row['name']);
					$mail->Subject = '剑网3配装器用户反馈';

					$mail->msgHTML(
						'<center><table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" style="background-color:#f2f2f2"><tr><td align="center" valign="top" style="padding:40px 20px"><table border="0" cellpadding="0" cellspacing="0" style="width:600px"><tr><td align="center" valign="top"><a href="http://www.j3pz.com" title="剑网3配装器" style="text-decoration:none" target="_blank"><img src="http://www.j3pz.com/images/icon.png" alt="剑网3配装器" height="" width="75" style="border:0;color:#6dc6dd!important;font-family:Helvetica,Arial,sans-serif;font-size:60px;font-weight:bold;min-height:auto!important;letter-spacing:-4px;line-height:100%;outline:none;text-align:center;text-decoration:none"></a></td></tr><tr><td align="center" valign="top" style="padding-top:30px;padding-bottom:30px"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#ffffff;border-collapse:separate!important;border-radius:4px"><tr><td align="center" valign="top" style="color:#606060;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:150%;padding-top:40px;padding-right:40px;padding-bottom:30px;padding-left:40px;text-align:center"><h1 style="color:#606060!important;font-family:楷体,Helvetica,Arial,sans-serif;font-size:40px;font-weight:bold;letter-spacing:-1px;line-height:115%;margin:0;padding:0;text-align:center">剑网3配装器用户反馈</h1><br><h3 style="color:#606060!important;font-family:Helvetica,Arial,sans-serif;font-size:18px;letter-spacing:-.5px;line-height:115%;margin:0;padding:0;text-align:center">'.$row['name'].'你好</h3><br>感谢您在 <a href="http://www.j3pz.com" target="_blank">剑网3配装器</a> 上提交了用户反馈。您收到这封邮件是因为管理员回复了您的反馈。如果您需要补充信息，请<a href="http://www.j3pz.com/feedback/issue/'.$issue.'.html">点此进入</a>反馈页面提交评论。</td></tr><tr><td align="center" valign="middle" style="padding-right:40px;padding-bottom:40px;padding-left:40px">'.$content.'</td></tr><tr><td align="center" valign="top" style="color:#606060;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:150%;padding-top:0px;padding-right:40px;padding-bottom:30px;padding-left:40px;text-align:center">本邮件为系统自动发送，请不要直接回复。</td></tr></table></td></tr><tr><td align="center" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td align="center" valign="top" style="color:#606060;font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:125%">© 2013-2016 剑网3配装器, All Rights Reserved.</td></tr></table></td></tr></table></td></tr></table></center>');
					$mail->AltBody = "侠士你好：感谢您在 剑网3配装器 上提交了用户反馈。您收到这封邮件是因为管理员回复了您的反馈。如果您需要补充信息，请到配装器反馈页面提交评论。";

					if(!$mail->send()){
						$result = array('err'=> true,'errReason'=> "邮件发送失败".$mail->ErrorInfo); 
					}
				}
			}
		} catch(PDOException $e){
			if(isset($dbh)) $dbh->rollBack();
			$result = array('err'=> true,'errReason'=> "数据库连接失败");
		}
	}
	$jsonText = json_encode($result);
	$result = urldecode($jsonText);
	echo $result;
?>