<?php
header('Access-Control-Allow-Origin：http://www.j3pz.com');
include('../config.php');
require '../libs/mail/PHPMailerAutoload.php';
$mail = new PHPMailer;
if(isset($_POST['mail'])){
	try{
		$dbh = new PDO('mysql:host='.DB_HOST.';port='.DB_PORT.';dbname='.DB_NAME, DB_USER, DB_PASSWORD);
		$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$dbh->exec("set names 'utf8'");

		$email = stripslashes(trim($_POST['mail']));
		$sql="SELECT COUNT(`email`) FROM `user` WHERE `email`='".$email."'";
		$res = $dbh->query($sql);
		if($res->fetchColumn() <= 0){//该邮箱尚未注册！
			echo 'noreg';
		}else{
			unset($res);
			$sql = "SELECT `uid`,`password`,`name`,`lastlogin` FROM `user` WHERE `email`='".$email."'";
			$res = $dbh->query($sql);
			$row = $res->fetch();
			unset($res);
			$getpasstime = time();
			if($getpasstime-$row['lastlogin']<60){
				echo "邮件发送失败：请不要在 1 分钟内重复发送多封重置邮件";
				die();
			}
			$token = md5($row['uid']."ziofat".$getpasstime);//组合验证码
			$name = $row['name'];
			$url = "http://www.j3pz.com/reset.php?uid=".$row['uid']."&token=".$token;//构造URL
			$time = date('Y-m-d H:i');

			$mail->CharSet = "UTF-8";
			$mail->isSMTP();
			$mail->Host = 'smtp.dm.aliyun.com';
			$mail->Port = 25;
			$mail->SMTPSecure = 'tls';
			$mail->SMTPAuth = true;
			$mail->Username = MAIL_ADDRESS;
			$mail->Password = MAIL_PASSWORD;
			$mail->setFrom('service@mail.j3pz.com', '剑网3配装器用户服务');
			$mail->addAddress($email, $row['name']);
			$mail->Subject = '剑网3配装器密码重置';

			$mail->msgHTML(
				'<center><table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" style="background-color:#f2f2f2"><tr><td align="center" valign="top" style="padding:40px 20px"><table border="0" cellpadding="0" cellspacing="0" style="width:600px"><tr><td align="center" valign="top"><a href="http://www.j3pz.com" title="剑网3配装器" style="text-decoration:none" target="_blank"><img src="http://www.j3pz.com/images/icon.png" alt="剑网3配装器" height="" width="75" style="border:0;color:#6dc6dd!important;font-family:Helvetica,Arial,sans-serif;font-size:60px;font-weight:bold;min-height:auto!important;letter-spacing:-4px;line-height:100%;outline:none;text-align:center;text-decoration:none"></a></td></tr><tr><td align="center" valign="top" style="padding-top:30px;padding-bottom:30px"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#ffffff;border-collapse:separate!important;border-radius:4px"><tr><td align="center" valign="top" style="color:#606060;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:150%;padding-top:40px;padding-right:40px;padding-bottom:30px;padding-left:40px;text-align:center"><h1 style="color:#606060!important;font-family:楷体,Helvetica,Arial,sans-serif;font-size:40px;font-weight:bold;letter-spacing:-1px;line-height:115%;margin:0;padding:0;text-align:center">剑网3配装器密码重置邮件</h1><br><h3 style="color:#606060!important;font-family:Helvetica,Arial,sans-serif;font-size:18px;letter-spacing:-.5px;line-height:115%;margin:0;padding:0;text-align:center">侠士你好</h3><br>你收到这封邮件是因为你在'.$time.'于剑网3配装器网站上对该账户提交了忘记密码的请求，如果你确认是你自己的操作，请点击下面的按钮进行密码重置操作。否则请忽略这封邮件，你的密码不会被重置。</td></tr><tr><td align="center" valign="middle" style="padding-right:40px;padding-bottom:40px;padding-left:40px"><table border="0" cellpadding="0" cellspacing="0" style="background-color:#6dc6dd;border-collapse:separate!important;border-radius:3px"><tr><td align="center" valign="middle" style="color:#ffffff;font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:bold;line-height:100%;padding-top:18px;padding-right:15px;padding-bottom:15px;padding-left:15px"><a href="'.$url.'" style="color:#ffffff;text-decoration:none" target="_blank">重置密码</a></td></tr></table></td></tr><tr><td align="center" valign="top" style="color:#606060;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:150%;padding-top:0px;padding-right:40px;padding-bottom:30px;padding-left:40px;text-align:center">如果上面这个按钮无法点击的话，请将以下网址复制到浏览器地址栏，按回车键后并按提示操作。<br>'.$url.'</td></tr></table></td></tr><tr><td align="center" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td align="center" valign="top" style="color:#606060;font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:125%">© 2013-2016 剑网3配装器, All Rights Reserved.</td></tr></table></td></tr></table></td></tr></table></center>');

			$mail->AltBody = "侠士你好：您在".$time."提交了找回密码请求。请点击下面的链接重置密码（按钮24小时内有效，请不要回复此邮件），如果不是您提交的修改，请忽略本邮件，您的密码不会被更改。".$url;

			if (!$mail->send()) {
				echo "邮件发送失败: " . $mail->ErrorInfo;
			} else {
				$msg = "系统已向您的邮箱发送了一封邮件,请登录到您的邮箱及时重置您的密码！";
				//更新数据发送时间
				$sql = "UPDATE `user` SET `lastlogin`='".$getpasstime."' WHERE `email`='".$email."'";
				$res = $dbh->query($sql);
				echo $msg;
				unset($res);
			}
		}
	} catch (PDOException $e) {
		echo "邮件发送失败：数据库连接被断开";
		logResult("Error!: " . $e->getMessage() . "<br/>");
		die();
	}
}
?>