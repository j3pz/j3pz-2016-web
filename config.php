<?php
// define( 'LOCAL_MODE',false);
define( 'LOCAL_MODE',true);
// === SAE ===
// define( 'DB_NAME', SAE_MYSQL_DB );
// define( 'DB_USER', SAE_MYSQL_USER );
// define( 'DB_PASSWORD', SAE_MYSQL_PASS );
// define( 'DB_HOST', SAE_MYSQL_HOST_M.':'.SAE_MYSQL_PORT );
if(LOCAL_MODE){
	// === Localhost ===
	define( 'DB_NAME', 'j3pz' );
	define( 'DB_USER', 'ziofat' );
	define( 'DB_PASSWORD', 'vz28yt90' );
	define( 'DB_HOST', 'localhost' );
	define( 'DB_PORT', 3306 );
	// define( 'DB_NAME', 'j3pz_database' );
	// define( 'DB_USER', 'j3pz' );
	// define( 'DB_PASSWORD', 'vz28yt90' );
	// define( 'DB_HOST', 'rdsfa32a3yufjby.mysql.rds.aliyuncs.com' );
	// define( 'DB_PORT', 3306 );
}else{
	// === Aliyun RDS ===
	define( 'DB_NAME', 'j3pz_database' );
	define( 'DB_USER', 'j3pz' );
	define( 'DB_PASSWORD', 'vz28yt90' );
	define( 'DB_HOST', 'rdsfa32a3yufjby.mysql.rds.aliyuncs.com' );
	define( 'DB_PORT', 3306 );
	// === Aliyun RDS for ACE ===
	// define( 'DB_NAME', 'dbva472826xtl1f5' );
	// define( 'DB_USER', 'jx3admin' );
	// define( 'DB_PASSWORD', 'vz28yt90' );
	// define( 'DB_HOST', 'rdsyybbjvyybbjv.mysql.rds.aliyuncs.com' );
	// define( 'DB_PORT', 3306 );
}


// === Memcached ===
define( 'MEMCACHED_SERVER', 'b6ea836f63d411e4.m.cnhzaliqshpub001.ocs.aliyuncs.com');
define( 'MEMCACHED_PORT', 11211);
// === Email Account ===
define( 'MAIL_ADDRESS', 'service@j3pz.com');
define( 'MAIL_PASSWORD', 'KF7f4B6189Dd7AD1');
// === Input check ===
$url_arr=array(
	'xss'=>"\\=\\+\\/v(?:8|9|\\+|\\/)|\\%0acontent\\-(?:id|location|type|transfer\\-encoding)",
);
$args_arr=array(
	'xss'=>"[\\'\\\"\\;\\*\\<\\>].*\\bon[a-zA-Z]{3,15}[\\s\\r\\n\\v\\f]*\\=|\\b(?:expression)\\(|\\<script[\\s\\\\\\/]|\\<\\!\\[cdata\\[|\\b(?:eval|alert|prompt|msgbox)\\s*\\(|url\\((?:\\#|data|javascript)",

	'sql'=>"[^\\{\\s]{1}(\\s|\\b)+(?:select\\b|update\\b|insert(?:(\\/\\*.*?\\*\\/)|(\\s)|(\\+))+into\\b).+?(?:from\\b|set\\b)|[^\\{\\s]{1}(\\s|\\b)+(?:create|delete|drop|truncate|rename|desc)(?:(\\/\\*.*?\\*\\/)|(\\s)|(\\+))+(?:table\\b|from\\b|database\\b)|into(?:(\\/\\*.*?\\*\\/)|\\s|\\+)+(?:dump|out)file\\b|\\bsleep\\([\\s]*[\\d]+[\\s]*\\)|benchmark\\(([^\\,]*)\\,([^\\,]*)\\)|(?:declare|set|select)\\b.*@|union\\b.*(?:select|all)\\b|(?:select|update|insert|create|delete|drop|grant|truncate|rename|exec|desc|from|table|database|set|where)\\b.*(charset|ascii|bin|char|uncompress|concat|concat_ws|conv|export_set|hex|instr|left|load_file|locate|mid|sub|substring|oct|reverse|right|unhex)\\(|(?:master\\.\\.sysdatabases|msysaccessobjects|msysqueries|sysmodules|mysql\\.db|sys\\.database_name|information_schema\\.|sysobjects|sp_makewebtask|xp_cmdshell|sp_oamethod|sp_addextendedproc|sp_oacreate|xp_regread|sys\\.dbms_export_extension)",

	'other'=>"\\.\\.[\\\\\\/].*\\%00([^0-9a-fA-F]|$)|%00[\\'\\\"\\.]"
);
$referer=empty($_SERVER['HTTP_REFERER']) ? array() : array($_SERVER['HTTP_REFERER']);
$query_string=empty($_SERVER["QUERY_STRING"]) ? array() : array($_SERVER["QUERY_STRING"]);
check_data($query_string,$url_arr);
check_data($_GET,$args_arr);
check_data($_POST,$args_arr);
check_data($_COOKIE,$args_arr);
check_data($referer,$args_arr);
function W_log($log)
{
	$logpath=$_SERVER["DOCUMENT_ROOT"]."/danger_log.txt";
	$log_f=fopen($logpath,"a+");
	fputs($log_f,$log."\r\n");
	fclose($log_f);
}
function check_data($arr,$v) {
 foreach($arr as $key=>$value)
 {
	if(!is_array($key))
	{ check($key,$v);}
	else
	{ check_data($key,$v);}
	
	if(!is_array($value))
	{ check($value,$v);}
	else
	{ check_data($value,$v);}
 }
}
function check($str,$v)
{
	foreach($v as $key=>$value)
	{
	if (preg_match("/".$value."/is",$str)==1||preg_match("/".$value."/is",urlencode($str))==1)
		{
			W_log("<br>IP: ".$_SERVER["REMOTE_ADDR"]."<br>时间: ".strftime("%Y-%m-%d %H:%M:%S")."<br>页面:".$_SERVER["PHP_SELF"]."<br>提交方式: ".$_SERVER["REQUEST_METHOD"]."<br>提交数据: ".$str);
			print '{"error":true,"errorReason":"您的提交带有不合法参数,谢谢合作"}';
			exit();
		}
	}
}
function logResult($word='') {
	$fp = fopen("log.txt","a");
	flock($fp, LOCK_EX) ;
	fwrite($fp,"执行日期：".strftime("%Y%m%d%H%M%S",time())."\n".$word."\n");
	flock($fp, LOCK_UN);
	fclose($fp);
}
?>