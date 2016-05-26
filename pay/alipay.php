<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>跳转到支付宝</title>
</head>
<body>
正在跳转，请稍候...
<?php
require_once("alipay.config.php");
require_once("../libs/alipay/alipay_submit.class.php");
require '../config.php';

$order_sn = $_GET['id'];

mysql_connect(DB_HOST,DB_USER,DB_PASSWORD) or die(mysql_error());
$db = mysql_select_db(DB_NAME) or die(mysql_error());
mysql_query("set names 'utf8'");

$sql = 'SELECT * FROM `order` WHERE `orderID` = "'.$order_sn.'";';
$res = mysql_query($sql) or die(mysql_error());
$row = mysql_fetch_array($res);

$item = $row['item'];

$itemList=array(1,2,4,10);
$priceList=array(8,15,30,49);
$subjectList=array("1 格配装位","2 格配装位","4 格配装位","高端玩家套餐");
$descList=array("适用于所有用户，购买后配装位置加一","适用于所有用户，购买后配装位置加二","适用于所有用户，购买后配装位置加四","适用于未购买过配装位置的用户，购买后可用配装位置增加到10个。");

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
        $show_url = "http://www.j3pz.com/upgrade/";
        //需以http://开头的完整路径，例如：http://www.商户网址.com/myorder.html

        //防钓鱼时间戳
        $anti_phishing_key = "";
        //若要使用请调用类文件submit中的query_timestamp函数

        //客户端的IP地址
        $exter_invoke_ip = "";
        //非局域网的外网IP地址，如：221.0.0.1

        $expire_time = "1d";
/************************************************************/
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
                "it_b_pay"      => $expire_time
);
//建立请求
$alipaySubmit = new AlipaySubmit($alipay_config);
$html_text = $alipaySubmit->buildRequestForm($parameter,"get", "确认");
echo $html_text;

?>
</body>
</html>