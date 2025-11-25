<html>
	<head>
		<style>
			td {
				padding: 12px;
				border: 1px solid lightgray;
				font-size: 18px;
			}
		</style>
	</head>
    <body>
<?php

header("Pragma: no-cache");
header("Cache-Control: no-cache");
header("Expires: 0");

include "placeordermail_a.php";
// following files need to be included
require_once("config.php");
require_once("dbio_c.php");
require_once("paytm_encdec.php");
$dbio = new Dbio();
$paytmChecksum = "";
$orderno = "";
$paymentStatus = "";
$paramList = array();
$isValidChecksum = "FALSE";

$paramList = $_POST;
$paytmChecksum = isset($_POST["CHECKSUMHASH"]) ? $_POST["CHECKSUMHASH"] : ""; //Sent by Paytm pg

//Verify all parameters received from Paytm pg to your application. Like MID received from paytm pg is same as your application�s MID, TXN_AMOUNT and ORDER_ID are same as what was sent by you to Paytm PG for initiating transaction etc.
$isValidChecksum = verifychecksum_e($paramList, PAYTM_MERCHANT_KEY, $paytmChecksum); //will return TRUE or FALSE string.


$ORDERID = isset($_POST["ORDERID"]) ? $_POST['ORDERID'] : "" ;
$MID = isset($_POST["MID"]) ? $_POST['MID'] : "";
$TXNID = isset($_POST["TXNID"]) ? $_POST['TXNID'] : "";
$TXNAMOUNT = isset($_POST["TXNAMOUNT"]) ? $_POST['TXNAMOUNT'] : "";
$PAYMENTMODE = isset($_POST["PAYMENTMODE"]) ? $_POST['PAYMENTMODE'] : "";
$CURRENCY = isset($_POST["CURRENCY"]) ? $_POST['CURRENCY'] : "";
$TXNDATE = isset($_POST["TXNDATE"]) ? $_POST['TXNDATE'] : "";	
$STATUS = isset($_POST["STATUS"]) ? $_POST['STATUS'] : "" ;
$RESPCODE = isset($_POST["RESPCODE"]) ? $_POST['RESPCODE'] : "" ;
$RESPMSG = isset($_POST["RESPMSG"]) ? $_POST['RESPMSG']: "";
$MERC_UNQ_REF = isset($_POST["MERC_UNQ_REF"]) ? $_POST['MERC_UNQ_REF']: "";
$GATEWAYNAME = isset($_POST["GATEWAYNAME"]) ? $_POST['GATEWAYNAME']: "";
$BANKTXNID = isset($_POST["BANKTXNID"]) ? $_POST['BANKTXNID']: "";
$CHECKSUMHASH = isset($_POST["CHECKSUMHASH"]) ? $_POST['CHECKSUMHASH']: "";

function callApiPost($url, $postData){
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL,$url);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/x-www-form-urlencoded'));
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS,  http_build_query($postData));
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$server_output = curl_exec($ch);
	$dataq['content']        = curl_exec( $ch );
	$dataq['err']            = curl_errno( $ch );
	$dataq['errmsg']         = curl_error( $ch );
	$dataq['result']         = curl_getinfo( $ch );
	$dataq['http_status']    = curl_getinfo($ch, CURLINFO_HTTP_CODE);      
	curl_close ($ch);
	return $server_output;
}

function encryptAES($plaintext, $key) {
	$method = 'AES-256-CBC';
	$iv = substr(REFKEY, 0, 16);
	$ciphertext = openssl_encrypt($plaintext, $method, $key, OPENSSL_RAW_DATA, $iv);
	return $ciphertext;
}

function getPolicyData($orderno, $row, $riderlist, $dbio, $amountpaid){
	$decoded_riderlist = json_decode(json_encode($riderlist));
	$string = "<policy><identity><sign>".ENCRYPTIONKEY."</sign><branchsign>e13b630d-e6dc-4bb0-99fa-f6d9c9c40dd8</branchsign>
	<username>Np_ZENITHFIT</username><reference>".$orderno."</reference></identity><plan><categorycode>".$row[3]."</categorycode>
	<plancode>".$row[4]."</plancode><basecharges>".$row[12]."</basecharges>";
	if(count($riderlist)>0){
		$string = $string."<riders>";
		foreach ($decoded_riderlist as $rider){
			$string = $string."<ridercode percent='".$rider->arl_riderpercent."'>".$rider->arl_ridercode."</ridercode>";
		}
		$string = $string."</riders>";
	}else {
		$string = $string."";
	}
	$string = $string."<totalbasecharges>".$row[12]."</totalbasecharges>
	<servicetax>".$row[13]."</servicetax><totalcharges>".$row[9]."</totalcharges></plan><traveldetails><departuredate>".$row[5]."</departuredate><days>".$row[7]."</days>
	<arrivaldate>".$row[6]."</arrivaldate></traveldetails><passengerreference> ".$row[0]." </passengerreference><insured><passport>NA</passport>
	<contactdetails><address1>NA</address1><address2>NA</address2><city>".$row[11]."</city><district>".$row[11]."</district><state>".$row[11]."</state><pincode>560009</pincode>
	<country>India</country><phoneno>".$row[2]."</phoneno><mobileno>".$row[2]."</mobileno><emailaddress>".$row[1]."</emailaddress></contactdetails>
	<name>".$row[0]."</name><dateofbirth>".$row[10]."</dateofbirth><age>".$row[8]."</age><trawelltagnumber></trawelltagnumber><nominee>NA</nominee><relation>NA</relation>
	<pastillness>NA</pastillness></insured><otherdetails>
	<policycomment>NA</policycomment><universityname>NA</universityname><universityaddress>NA</universityaddress></otherdetails></policy>";
	$encr = encryptAES($string, ENCRYPTIONKEY);
	$data = base64_encode($encr);
	$postData = array("Data"=>$data, "Ref"=>REFKEY);
	$url = "https://asegotravel.in/trawelltag/v2/CreatePolicy.aspx";
	$response = callApiPost($url, $postData);
	$envelope = new DOMDocument();
	$envelope->loadXML($response);
	$filename = $envelope->getElementsByTagName('document')[0]->nodeValue;
	$ext = pathinfo($filename, PATHINFO_EXTENSION);
	$file_content = file_get_contents(str_replace(' ', '', $filename));
	$file_path = 'ASEGO_'.str_replace('/', '_', $orderno).$dbio->getRandomString(5).'.'.$ext;
	$fp = fopen(UPLOADDOCSPATH.$file_path, "w+");
	$dbio->writeLog("String    ".$string);
	if(fwrite($fp, $file_content)){
		$paymentStatus = "TRANSACTION SUCCESSFULL";
		$sql = "UPDATE lead_order SET po_isplaced = 1, po_status = '1', po_ispaid = 1 WHERE po_order_no= '".$orderno."'";
		$dbconn = $dbio->getConn();
		$result = $dbio->getSelect($dbconn, $sql);

		$qry = "UPDATE asego_leads SET al_doclink = '".$filename."', al_docpath = '".$file_path."', al_paymentrecieved='1', al_amtrecieved = ".$amountpaid." WHERE al_orderno = '".$orderno."' ";
		$res = $dbio->getSelect($dbconn, $qry);
		$dbio->closeConn($dbconn);
	}else {
		$paymentStatus = "TRANSACTION SUCCESSFULL";
		$qry = "UPDATE asego_leads SET al_doclink = 'N/A', al_docpath = 'N/A', al_paymentrecieved='1', al_amtrecieved = ".$amountpaid." WHERE al_orderno = '".$orderno."' ";
		$dbconn = $dbio->getConn();
		$res = $dbio->getSelect($dbconn, $qry);
		$dbio->closeConn($dbconn);
	}
	fclose($fp);
}

function insertInsuranceOrder($row_a, $orderno){
	return "SELECT al_name, al_email, al_mobile, al_categorycode, al_plancode, DATE_FORMAT(STR_TO_DATE(REPLACE(al_depdate, '/', '-'), '%d-%c-%Y'), '%d-%b-%Y')AS al_depdate, 
	DATE_FORMAT(STR_TO_DATE(REPLACE(al_arrivaldate, '/', '-'), '%d-%c-%Y'), '%d-%b-%Y') AS al_arrivaldate, al_nofdays, al_age, al_premium,
	DATE_FORMAT(STR_TO_DATE(REPLACE(al_dob, '/', '-'), '%d-%c-%Y'), '%d-%b-%Y') AS al_dob,
	COALESCE((SELECT ml_branch FROM master_location WHERE ml_branchcd=".$row_a[1]."), 'N/A') AS location, al_basecharge, al_gst FROM asego_leads
	WHERE al_orderno='".$orderno."'";
}

function updateLeadStatus($orderno){
	return "UPDATE lead_order SET po_isplaced = 1, po_status = '1', po_ispaid = 1, po_donetimestamp=NOW() WHERE po_order_no= '".$orderno."'";
}

function insertOrderLog($orderno, $TXNAMOUNT){
	return "INSERT INTO master_order_remark SELECT 0, '".$orderno."', now(), 'Payment Recieved Through Paytm Gateway, Recieved Amount: ".$TXNAMOUNT."'";
}


$qry = "SELECT pg_orderno FROM payment_gateway WHERE pg_orderid = '".$ORDERID."'";
$dbconn = $dbio->getConn();
$result = $dbio->getSelect($dbconn, $qry);
if($result){
    $row = mysqli_fetch_row($result);
    $orderno = $row[0];
}

if($isValidChecksum == "TRUE" ) {
	//echo "<b>Checksum matched and following are the transaction details:</b>" . "<br/>";
	if ($_POST["STATUS"] == "TXN_SUCCESS") {
		$sql = updateLeadStatus($orderno);
		$result = $dbio->getSelect($dbconn, $sql);
		$qry_a = "SELECT po_ordertype, po_location, user_srno, user_id, po_roundAmt FROM lead_order 
		LEFT OUTER JOIN user_login ON po_usersrno = user_srno
		WHERE po_order_no = '".$orderno."'";
		$result2 = $dbio->getSelect($dbconn, $qry_a);
		if(mysqli_num_rows($result2)>0){
			$row_a = mysqli_fetch_row($result2);
			if($row_a[0] == "insurance"){
				$sql = insertInsuranceOrder($row_a, $orderno);
				$result3 = $dbio->getSelect($dbconn, $sql);
				if(mysqli_num_rows($result3)>0){
					$row = mysqli_fetch_row($result3);
					$riderlist = array();
					$query = "SELECT arl_ridercode, arl_riderpercent FROM asego_rider_leads WHERE arl_orderno = '".$orderno."'";
					$res = $dbio->getSelect($dbconn, $query);
					if(mysqli_num_rows($res)>0){
						while($r = mysqli_fetch_assoc($res)){
							$riderlist[] = $r;
						}
					}else {
						$riderlist = array();
					}
					getPolicyData($orderno, $row, $riderlist, $dbio, $TXNAMOUNT);
				}
			}else {
				$pendingamt = (1*$row_a[4])-(1*$TXNAMOUNT);
				$query = "UPDATE master_account_details SET ac_amountpaid = ".$TXNAMOUNT.", ac_amountpending = ".$pendingamt." WHERE ac_orderno = '".$orderno."'";
				$resultt = $dbio->getSelect($dbconn, $query);
				$q = insertOrderLog($orderno, $TXNAMOUNT);
				$r = $dbio->getSelect($dbconn, $q);
				$paymentStatus = "TRANSACTION SUCCESSFULL";
				$usersrno = $row_a[2];
				$userid = $row_a[3];
				sendPlaceOrderMail($dbio, $orderno, $usersrno, $userid);
			}
				//Process your transaction here as success transaction.
				//Verify amount & order id received from Payment gateway with your application's order id and amount.
		}
	}
	else {
		$paymentStatus = "TRANSACTION FAILED";
        $query = "UPDATE lead_order SET po_isplaced = 1, po_status = '1', , po_ispaid = 0 WHERE po_order_no= '".$orderno."'";

		$qry_a = "SELECT po_ordertype, po_location, user_srno, user_id FROM lead_order 
				LEFT OUTER JOIN user_login ON po_usersrno = user_srno
				WHERE po_order_no = '".$orderno."'";
		$res = $dbio->getSelect($dbconn, $qry_a);
		if(mysqli_num_rows($res)>0){
			$row_a = mysqli_fetch_row($res);
			if($row_a[0] == "insurance"){
				$sql = "SELECT al_name, al_email, al_mobile, al_categorycode, al_plancode, DATE_FORMAT(STR_TO_DATE(REPLACE(al_depdate, '/', '-'), '%d-%c-%Y'), '%d-%b-%Y')AS al_depdate, 
						DATE_FORMAT(STR_TO_DATE(REPLACE(al_arrivaldate, '/', '-'), '%d-%c-%Y'), '%d-%b-%Y') AS al_arrivaldate, al_nofdays, al_age, al_premium,
						DATE_FORMAT(STR_TO_DATE(REPLACE(al_dob, '/', '-'), '%d-%c-%Y'), '%d-%b-%Y') AS al_dob,
						COALESCE((SELECT ml_branch FROM master_location WHERE ml_branchcd=".$row_a[1]."), 'N/A') AS location, al_basecharge, al_gst FROM asego_leads
				WHERE al_orderno='".$orderno."'";
				$result = $dbio->getSelect($dbconn, $sql);
				if(mysqli_num_rows($result)>0){
					$row = mysqli_fetch_row($result);
					$riderlist = array();
					$query = "SELECT arl_ridercode, arl_riderpercent FROM asego_rider_leads WHERE arl_orderno = '".$orderno."'";
					$res = $dbio->getSelect($dbconn, $query);
					if(mysqli_num_rows($res)>0){
						while($r = mysqli_fetch_assoc($res)){
							$riderlist[] = $r;
						}
					}else {
						$riderlist = array();
					}
					getPolicyData($orderno, $row, $riderlist, $dbio, $TXNAMOUNT);
				}
			}
		}
        $result = $dbio->getSelect($dbconn, $query);
	}
	
$dbio->closeConn($dbconn);
	
	if (isset($_POST) && count($_POST)>0 )
	{ 
		//foreach($_POST as $paramName => $paramValue) {
				//echo "<br/>" . $paramName . " = " . $paramValue;
		// }
					
					$conn = $dbio->getConn();					

					$sql ="";
					if( $STATUS=="TXN_SUCCESS"){
						$sql = $sql." update payment_gateway set pg_status='D' , pg_success = now() 
						where pg_orderid ='".$ORDERID."'  ;  ";
					}
					$sql = $sql." insert into payment_gateway_response  
					(pr_timestamp,pr_orderid,pr_mid,pr_txnid,pr_txnamount,pr_paymentmode,pr_currency,pr_txndate
					,pr_status,pr_respcode,
					pr_respmsg,pr_merc_unq_ref,pr_gatewayname,pr_banktxnid,pr_checksumhash)  
					select now(),'".$ORDERID."','".$MID."','".$TXNID."','".$TXNAMOUNT."','".$PAYMENTMODE."','".$CURRENCY."','".$TXNDATE."'
					,'".$STATUS."','".$RESPCODE."'
					,'".$RESPMSG."','".$MERC_UNQ_REF."','".$GATEWAYNAME."','".$BANKTXNID."','".$CHECKSUMHASH."' ;";
				
					$dbio->batchQueries($conn,$sql);
					$dbio->closeConn($conn);
					

		
	}
	

}
else {
	//echo "<b>Checksum mism300atched.</b>";
	echo("<h1>Process transaction as suspicious.</h1>");
}
///////////////////////////////////


	 	

?>

<center>
<div>
	<img src="/img/logo.png" alt="IMG">
</div>
<div style="height:30px">&nbsp;</div>
<h2><?=$paymentStatus?></h2>
<table cellspacing="0" style="width:65%; ">
	<tbody>
		<tr>
			<td>Order Id</td>
			<td><?=$orderno?></td>
		</tr>
		<tr>
			<td class="data">Payment Mode</td>
			<td class="data"><?=$PAYMENTMODE?></td>
		</tr>
		<tr>
			<td class="data">Currency</td>
			<td class="data"><?=$CURRENCY?></td>
		</tr>
		<tr>
			<td>Amount</td>
			<td><?=$TXNAMOUNT?></td>
		</tr>
		<tr>
			<td>Bank Transaction ID</td>
			<td><?=$BANKTXNID?></td>
		</tr>
		<tr>
			<td>Date</td>
			<td><?=$TXNDATE?></td>
		</tr>
		<tr>
			<td>Status</td>
			<td><?=$STATUS?></td>
		</tr>
	</tbody>
</table>
<h3>You will be redirected.</h3>
</center>
</body>
<!-- <?php
// echo('<br/>');
// echo("<table>");
// echo("<tr><td>Order Id : </td><td>".$ORDERID."</td></tr>");
// echo("<tr><td>Payment Mode : </td><td>".$PAYMENTMODE."</td></tr>");
// echo("<tr><td>Currency : </td><td>".$CURRENCY."</td></tr>");
// echo("<tr><td>Amount : </td><td>".$TXNAMOUNT."</td></tr>");
// echo("<tr><td>Bank Transaction ID : </td><td>".$BANKTXNID."</td></tr>");
// echo("<tr><td>Date : </td><td>".$TXNDATE."</td></tr>");
// echo("<tr><td>STATUS : </td><td>".$STATUS."</td></tr>");
// echo ("<tr><td>You Will be redirected.</td></tr>");
// echo("</table>");
// echo('<br/>');
?> -->
    <script>
        setTimeout(() => {
            window.location.href = "https://www.zenithglobal.com.my/order-history";
        }, 8000);
    </script>
</html>