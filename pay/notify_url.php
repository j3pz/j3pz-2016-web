<?php
/* *
 * 功能：支付宝服务器异步通知页面
 * 版本：3.3
 * 日期：2012-07-23
 * 说明：
 * 以下代码只是为了方便商户测试而提供的样例代码，商户可以根据自己网站的需要，按照技术文档编写,并非一定要使用该代码。
 * 该代码仅供学习和研究支付宝接口使用，只是提供一个参考。


 *************************页面功能说明*************************
 * 创建该页面文件时，请留心该页面文件中无任何HTML代码及空格。
 * 该页面不能在本机电脑测试，请到服务器上做测试。请确保外部可以访问该页面。
 * 该页面调试工具请使用写文本函数logResult，该函数已被默认关闭，见alipay_notify_class.php中的函数verifyNotify
 * 如果没有收到该页面返回的 success 信息，支付宝会在24小时内按一定的时间策略重发通知
 */

require_once("alipay.config.php");
require_once("../libs/alipay/alipay_notify.class.php");
require '../config.php';
require '../libs/mail/PHPMailerAutoload.php';

//计算得出通知验证结果
$alipayNotify = new AlipayNotify($alipay_config);
$verify_result = $alipayNotify->verifyNotify();

if($verify_result) {//验证成功
	//商户订单号
	$out_trade_no = $_POST['out_trade_no'];
	//支付宝交易号
	$trade_no = $_POST['trade_no'];
	//交易状态
	$trade_status = $_POST['trade_status'];
	try {
		$dbh = new PDO('mysql:host='.DB_HOST.';port='.DB_PORT.';dbname='.DB_NAME, DB_USER, DB_PASSWORD);
		$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	    $dbh->exec("set names 'utf8'");
	    $sql = "SELECT * FROM `order` WHERE `orderID`='".$out_trade_no."';";
	    $res = $dbh->query($sql);
	} catch (PDOException $e) {
		logResult("Error!: " . $e->getMessage() . "<br/>");
		die();
	}

	foreach ($res as $row) {
		$state = $row['state'];
		$item = $row['item'];
    	$uid = $row['uid'];
	}

    if($_POST['trade_status'] == 'TRADE_FINISHED'||$_POST['trade_status'] == 'TRADE_SUCCESS') {
    	if($row['state'] == 'TRADE_IN_PROGRESS'){
    		$sql0 = "SELECT `equipNum`,`name`,`email` FROM `user` WHERE `uid`='".$uid."';";
			$res0 = $dbh->query($sql0);
			foreach ($res0 as $row) {
				$equipNum = $row['equipNum'];
				$username = $row['name'];
				$usermail = $row['email'];
			}
			$finalNum = $equipNum + $item;
			$dbh->beginTransaction();
			if($item==10)
    			$sql1 = 'UPDATE `user` SET `equipNum` = "10" WHERE `uid` = "'.$uid.'" AND `equipNum` = "'.$equipNum.'";';
    		else
    			$sql1 = 'UPDATE `user` SET `equipNum` = "'.$finalNum.'" WHERE `uid` = "'.$uid.'" AND `equipNum` = "'.$equipNum.'";';
    		$sql2 = 'UPDATE `order` SET `state` = "TRADE_FINISHED" , `finishTime` = now() , `alipayNo`="'.$trade_no.'" WHERE `orderID` = "'.$out_trade_no.'";';
    		$sth = $dbh->exec($sql1);
    		$sth = $dbh->exec($sql2);
    		$dbh->commit();

    		$itemList=array(1,2,4,10);
			$priceList=array(8,15,30,49);
			$subjectList=array("1 格配装位","2 格配装位","4 格配装位","高端玩家套餐");
			for ($i=0; $i < 4; $i++) { 
				if($item == $itemList[$i]){
					break;
				}
			}
			$subject = $subjectList[$i];
			$total_fee = $priceList[$i];

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
			$mail->addAddress($usermail, $username);
			$mail->Subject = '剑网3配装器订单支付确认';
			$mail->msgHTML(
				'<center><table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" style="background-color:#f2f2f2"><tr><td align="center" valign="top" style="padding:40px 20px"><table border="0" cellpadding="0" cellspacing="0" style="width:600px"><tr><td align="center" valign="top"><a href="http://www.j3pz.com" title="剑网3配装器" style="text-decoration:none" target="_blank"><img src="http://www.j3pz.com/images/icon.png" alt="剑网3配装器" height="" width="75" style="border:0;color:#6dc6dd!important;font-family:Helvetica,Arial,sans-serif;font-size:60px;font-weight:bold;min-height:auto!important;letter-spacing:-4px;line-height:100%;outline:none;text-align:center;text-decoration:none"></a></td></tr><tr><td align="center" valign="top" style="padding-top:30px;padding-bottom:30px"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#ffffff;border-collapse:separate!important;border-radius:4px"><tr><td align="center" valign="top" style="color:#606060;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:150%;padding-top:40px;padding-right:40px;padding-bottom:30px;padding-left:40px;text-align:center"><h1 style="color:#606060!important;font-family:楷体,Helvetica,Arial,sans-serif;font-size:40px;font-weight:bold;letter-spacing:-1px;line-height:115%;margin:0;padding:0;text-align:center">剑网3配装器订单支付确认</h1><br><h3 style="color:#606060!important;font-family:Helvetica,Arial,sans-serif;font-size:18px;letter-spacing:-.5px;line-height:115%;margin:0;padding:0;text-align:center">'.$username.'你好</h3><br>感谢您在 <a href="http://www.j3pz.com" target="_blank">剑网3配装器</a> 上购买了我们的增值服务。本邮件用于确认您的订单已完成支付，对应的增值服务已经发放到您的账号，感谢您的支持与信任。</td></tr><tr><td align="center" valign="middle" style="padding-right:40px;padding-bottom:40px;padding-left:40px"><table border="0" cellpadding="0" cellspacing="0" style="margin:0;padding:0;margin-bottom:15px;width:100%"><thead style="margin:0;padding:0;"><tr style="margin:0;padding:0;"><td align="left" style="margin:0;padding:10px 0 10px 15px;">订单号:'.$out_trade_no.'</td></tr><tr style="margin:0;padding:0;"><th align="left" colspan="10" style="margin:0;padding:10px 0 10px 15px;border-bottom:1px solid #1d1d1d;width:70%;">产品</th><th align="center" style="margin:0;padding:10px 15px;border-bottom:1px solid #1d1d1d;min-width:40px;width:15%;">数量</th><th align="right" style="margin:0;padding:10px 15px;border-bottom:1px solid #1d1d1d;min-width:60px;width:15%;">总价</th></tr></thead><tbody style="margin:0;padding:0;"><tr style="margin:0;padding:0;"><td align="left" colspan="10" style="margin:0;padding:10px 0 10px 15px;border-bottom:1px solid #1d1d1d;width:70%;">'.$subject.'</td><td align="center" style="margin:0;padding:10px 15px;border-bottom:1px solid #1d1d1d;min-width:40px;width:15%;">1</td><td align="right" style="margin:0;padding:10px 15px;border-bottom:1px solid #1d1d1d;min-width:60px;width:15%;">￥'.number_format($total_fee,2).'</td></tr></tbody></table></td></tr><tr><td align="center" valign="top" style="color:#606060;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:150%;padding-top:0px;padding-right:40px;padding-bottom:30px;padding-left:40px;text-align:center">如果对该订单有任何疑问，请直接回复本邮件。</td></tr></table></td></tr><tr><td align="center" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td align="center" valign="top" style="color:#606060;font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:125%">© 2013-2016 剑网3配装器, All Rights Reserved.</td></tr></table></td></tr></table></td></tr></table></center>');
			$mail->AltBody = "侠士你好：感谢您在剑网3配装器上购买了 ".$subject." 。本邮件用于确认您的订单已完成支付，对应的增值服务已经发放到您的账号，感谢您的支持与信任。您的订单号为".$order_sn."，总价￥".number_format($total_fee,2)."。如果您对本订单存在任何问题，请直接回复本邮件。";
			$mail->send();
    	}
    }      
	echo "success";		//请不要修改或删除
}
else {
    //验证失败
    echo "fail";
}
?>