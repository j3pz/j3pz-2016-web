<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>跳转到支付宝</title>
</head>
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  ga('create', 'UA-17530182-11', 'auto');
  ga('require', 'displayfeatures');
  ga('send', 'pageview');
</script>
<body>
正在跳转，请稍后...
<?php
require_once("alipay.config.php");
require_once("../libs/alipay/alipay_submit.class.php");
require '../libs/mail/PHPMailerAutoload.php';
require '../config.php';

$item = $_GET['item'];
$uid = $_GET['uid'];

$itemList=array(1,2,4,10);
$priceList=array(8,15,30,49);
$subjectList=array("1 格配装位","2 格配装位","4 格配装位","高端玩家套餐");
$descList=array("适用于所有用户，购买后配装位置加一","适用于所有用户，购买后配装位置加二","适用于所有用户，购买后配装位置加四","适用于未购买过配装位置的用户，购买后可用配装位置增加到10个。");
$order_sn = date('ymd').substr(time(),-5).substr(microtime(),2,5);

for ($i=0; $i < 4; $i++) { 
	if($item == $itemList[$i]){
		break;
	}
}

if($i>=4){
	echo "非法操作";
	exit;
}

/**************************请求参数**************************/
	//支付类型
	$payment_type = "1";
	//必填，不能修改
	//服务器异步通知页面路径
	$notify_url = "http://www.j3pz.com/pay/notify_url.php";
	//需http://格式的完整路径，不能加?id=123这类自定义参数
	//页面跳转同步通知页面路径
	$return_url = "http://www.j3pz.com/pay/return_url.php";
	//需http://格式的完整路径，不能加?id=123这类自定义参数，不能写成http://localhost/
	//商户订单号
	$out_trade_no = $order_sn;
	//商户网站订单系统中唯一订单号，必填
	//订单名称
	$subject = $subjectList[$i];
	//必填
	//付款金额
	$total_fee = $priceList[$i];
	//必填
	//订单描述
	$body = $descList[$i];
	//商品展示地址
	$show_url = "https://www.j3pz.com/upgrade/";
	//需以http://开头的完整路径，例如：http://www.商户网址.com/myorder.html
	//防钓鱼时间戳
	$anti_phishing_key = "";
	//若要使用请调用类文件submit中的query_timestamp函数
	//客户端的IP地址
	$exter_invoke_ip = "";
	//非局域网的外网IP地址，如：221.0.0.1
	$expire_time = "1d";
/************************************************************/
try{
	$dbh = new PDO('mysql:host='.DB_HOST.';port='.DB_PORT.';dbname='.DB_NAME, DB_USER, DB_PASSWORD);
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$dbh->exec("set names 'utf8'");

	$sql = "INSERT INTO `order`(`orderID`,`uid`,`item`,`price`,`issueTime`,`state`,`finishTime`,`alipayNo`) VALUES ('".$order_sn."','".$uid."','".$item."','".$total_fee."',now(),'TRADE_IN_PROGRESS',null,null);";
	$res = $dbh->query($sql);
	unset($res);
	$sql = "SELECT `email`,`name` FROM `user` WHERE `uid`='".$uid."'";
	$res = $dbh->query($sql);
	$row = $res->fetch();
	unset($res);
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
	$mail->addAddress($row['email'], $row['name']);
	$mail->Subject = '剑网3配装器订单确认';

	$mail->msgHTML(
		'<center><table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" style="background-color:#f2f2f2"><tr><td align="center" valign="top" style="padding:40px 20px"><table border="0" cellpadding="0" cellspacing="0" style="width:600px"><tr><td align="center" valign="top"><a href="http://www.j3pz.com" title="剑网3配装器" style="text-decoration:none" target="_blank"><img src="http://www.j3pz.com/images/icon.png" alt="剑网3配装器" height="" width="75" style="border:0;color:#6dc6dd!important;font-family:Helvetica,Arial,sans-serif;font-size:60px;font-weight:bold;min-height:auto!important;letter-spacing:-4px;line-height:100%;outline:none;text-align:center;text-decoration:none"></a></td></tr><tr><td align="center" valign="top" style="padding-top:30px;padding-bottom:30px"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#ffffff;border-collapse:separate!important;border-radius:4px"><tr><td align="center" valign="top" style="color:#606060;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:150%;padding-top:40px;padding-right:40px;padding-bottom:30px;padding-left:40px;text-align:center"><h1 style="color:#606060!important;font-family:楷体,Helvetica,Arial,sans-serif;font-size:40px;font-weight:bold;letter-spacing:-1px;line-height:115%;margin:0;padding:0;text-align:center">剑网3配装器订单确认</h1><br><h3 style="color:#606060!important;font-family:Helvetica,Arial,sans-serif;font-size:18px;letter-spacing:-.5px;line-height:115%;margin:0;padding:0;text-align:center">'.$row['name'].'你好</h3><br>感谢您在 <a href="http://www.j3pz.com" target="_blank">剑网3配装器</a> 上购买了我们的增值服务。本邮件用于确认您的订单已被正确处理，请及时支付您的订单，该订单将于 24 小时后过期。</td></tr><tr><td align="center" valign="middle" style="padding-right:40px;padding-bottom:40px;padding-left:40px"><table border="0" cellpadding="0" cellspacing="0" style="margin:0;padding:0;margin-bottom:15px;width:100%"><thead style="margin:0;padding:0;"><tr style="margin:0;padding:0;"><tr style="margin:0;padding:0;"><td align="left" style="margin:0;padding:10px 0 10px 15px;">订单号:'.$order_sn.'</td></tr><th align="left" colspan="2" style="margin:0;padding:10px 0 10px 15px;border-bottom:1px solid #1d1d1d;width:70%;">产品</th><th align="center" style="margin:0;padding:10px 15px;border-bottom:1px solid #1d1d1d;min-width:40px;width:15%;">数量</th><th align="right" style="margin:0;padding:10px 15px;border-bottom:1px solid #1d1d1d;min-width:60px;width:15%;">总价</th></tr></thead><tbody style="margin:0;padding:0;"><tr style="margin:0;padding:0;"><td align="left" colspan="2" style="margin:0;padding:10px 0 10px 15px;border-bottom:1px solid #1d1d1d;width:70%;">'.$subject.'</td><td align="center" style="margin:0;padding:10px 15px;border-bottom:1px solid #1d1d1d;min-width:40px;width:15%;">1</td><td align="right" style="margin:0;padding:10px 15px;border-bottom:1px solid #1d1d1d;min-width:60px;width:15%;">￥'.number_format($total_fee,2).'</td></tr></tbody></table></td></tr><tr><td align="center" valign="top" style="color:#606060;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:150%;padding-top:0px;padding-right:40px;padding-bottom:30px;padding-left:40px;text-align:center">如果对该订单有任何疑问，请直接回复本邮件。</td></tr></table></td></tr><tr><td align="center" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td align="center" valign="top" style="color:#606060;font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:125%">© 2013-2016 剑网3配装器, All Rights Reserved.</td></tr></table></td></tr></table></td></tr></table></center>');

	$mail->AltBody = "侠士你好：感谢您在剑网3配装器上购买了 ".$subject." 。本邮件用于确认您的订单已被正确处理，请及时支付您的订单，该订单将于 24 小时后过期。您的订单号为".$order_sn."，总价￥".number_format($total_fee,2)."。如果您对本订单存在任何问题，请直接回复本邮件。";
	$mail->send();
} catch (PDOException $e) {
	echo "创建订单失败";
	logResult("Error!: " . $e->getMessage() . "<br/>");
	die();
}

//构造要请求的参数数组，无需改动
$parameter = array(
	"service" => "create_direct_pay_by_user",
	"partner" => trim($alipay_config['partner']),
	"seller_email" => trim($alipay_config['seller_email']),
	"payment_type"	=> $payment_type,
	"notify_url"	=> $notify_url,
	"return_url"	=> $return_url,
	"out_trade_no"	=> $out_trade_no,
	"subject"	=> $subject,
	"total_fee"	=> $total_fee,
	"body"	=> $body,
	"show_url"	=> $show_url,
	"anti_phishing_key"	=> $anti_phishing_key,
	"exter_invoke_ip"	=> $exter_invoke_ip,
	"_input_charset"	=> trim(strtolower($alipay_config['input_charset'])),
	"it_b_pay"	=> $expire_time
);
//建立请求
$alipaySubmit = new AlipaySubmit($alipay_config);
$html_text = $alipaySubmit->buildRequestForm($parameter,"get", "确认");
echo $html_text;

?>
</body>
</html>