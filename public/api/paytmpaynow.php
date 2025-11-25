<?php
    header("Pragma: no-cache");
    header("Cache-Control: no-cache");
    header("Expires: 0");
    // following files need to be included
    // require_once("config.php");
    require_once("dbio_c.php");
    require_once("paytm_encdec.php");

    $dbio = new Dbio();

    $requestString = base64_decode($_REQUEST['d']);
    $paramArray = explode("^",$requestString);

    $txtName = $paramArray[0];
    $txtEmail = $paramArray[1];
    $txtAmount = $paramArray[2];
    $txtPhone = $paramArray[3];
    $orderno = $paramArray[4];
    $replacedOrderno = str_replace('/', '_', $paramArray[4]);
    $randomNumber = rand(1000000,9999999);

    $ORDER_ID = "ZENFOR".$replacedOrderno.$randomNumber; 
    $CUST_ID = "ZENFOR".date("Ymd").$randomNumber; 
    $TXN_AMOUNT = $txtAmount;
    ////// ******************* Write Log ********************** */

    $conn = $dbio->getConn();
    $sql = " insert into payment_gateway 
    (pg_srno
    ,pg_orderid,pg_custid,pg_amnt,pg_custname
    ,pg_email,pg_phone,pg_message,pg_status,pg_init, pg_orderno) 
    select (SELECT COALESCE((SELECT MAX(pg_srno) FROM payment_gateway),0))+1 
    ,'".$ORDER_ID."','".$CUST_ID."',".$txtAmount.",'".$txtName."'
    ,'".$txtEmail."','".$txtPhone."','','P',now(), '".$orderno."' ";
    
    $dbio->getSelect($conn,$sql);
    $dbio->closeConn($conn);

    ///////*********************************************** */
    $checkSum = "";
    $paramList = array();
    // Create an array having all required parameters for creating checksum.
    $paramList["MID"] = PAYTM_MERCHANT_MID;
    $paramList["ORDER_ID"] = $ORDER_ID;
    $paramList["CUST_ID"] = $CUST_ID;
    $paramList["INDUSTRY_TYPE_ID"] = PAYTM_INDUSTRY_TYPE_ID;
    $paramList["CHANNEL_ID"] = PAYTM_CHANNEL_ID;
    $paramList["TXN_AMOUNT"] = $TXN_AMOUNT;
    $paramList["WEBSITE"] = PAYTM_MERCHANT_WEBSITE;
    $paramList["CALLBACK_URL"] = MERCHANT_CALLBACK_URL;

    //Here checksum string will return by getChecksumFromArray() function.
    $checkSum = getChecksumFromArray($paramList,PAYTM_MERCHANT_KEY);

?>
<html>
<head>
<title>Merchant Check Out Page</title>
</head>
<body>
	<center><h1>Please do not refresh this page...</h1></center>
		<form method="post" action="<?php echo PAYTM_TXN_URL ?>" name="f1">
		<table border="1">
			<tbody>
			<?php
			foreach($paramList as $name => $value) {
				echo '<input type="hidden" name="' . $name .'" value="' . $value . '">';
			}
			?>
			<input type="hidden" name="CHECKSUMHASH" value="<?php echo $checkSum ?>">
			</tbody>
		</table>
		<script type="text/javascript">
			document.f1.submit();
		</script>
	</form>
</body>
</html>