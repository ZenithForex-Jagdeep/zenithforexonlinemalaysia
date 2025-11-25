<?php
require_once("dbio_c.php");
$dbio = new Dbio();

$response = (object)[];
$response->rz_order_id = $_POST["razorpay_order_id"];
$response->rz_signature = $_POST["razorpay_signature"];
$response->rz_paymentid = $_POST["razorpay_payment_id"];

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

function updatePayment($dbio, $response, $row){
    $qry = "update razorpay_payments set rz_payment_signature = '".$response->rz_signature."',rz_payment_id = '".$response->rz_paymentid."', order_status = 'CAPTURED' where rz_order_id = '".$response->rz_order_id."';";
    $dbconn = $dbio->getConnRazorPay();
    $res = $dbio->getSelect($dbconn, $qry);
    $dbio->closeConn($dbconn);
}

function getPolicyData($orderno, $row, $riderlist, $dbio, $amount){
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
    $encr = encryptAES($string, ENCRYPTIONKEY); // AES encryption
    $data = base64_encode($encr);   // base 64 encryption
    $postData = array("Data"=>$data, "Ref"=>REFKEY);
    $url = "https://asegotravel.in/trawelltag/v2/CreatePolicy.aspx"; // API End point URL
    $response = callApiPost($url, $postData); // call API post
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
        $sql = "UPDATE lead_order SET po_isplaced = 1, po_status = '1', po_ispaid = 1, po_payment_status = 'S' WHERE po_order_no= '".$orderno."';
        UPDATE asego_leads SET al_doclink = '".$filename."', al_docpath = '".$file_path."', al_paymentrecieved='1', al_amtrecieved = ".$amount.", al_status = 'CAPTURED' 
        WHERE al_orderno = '".$orderno."'; ";
        $dbconn = $dbio->getConn();
        $result = $dbio->batchQueries($dbconn, $sql);
        $dbio->closeConn($dbconn);
    }
    fclose($fp);
}

function sendPolicy($dbio, $order_row){
    $sql = "select al_name, al_email, al_mobile, al_categorycode, al_plancode, DATE_FORMAT(STR_TO_DATE(REPLACE(al_depdate, '/', '-'), '%d-%c-%Y'), '%d-%b-%Y')AS al_depdate, 
    DATE_FORMAT(STR_TO_DATE(REPLACE(al_arrivaldate, '/', '-'), '%d-%c-%Y'), '%d-%b-%Y') AS al_arrivaldate, al_nofdays, al_age, al_premium,
    DATE_FORMAT(STR_TO_DATE(REPLACE(al_dob, '/', '-'), '%d-%c-%Y'), '%d-%b-%Y') AS al_dob,
    ml_branch, al_basecharge, al_gst FROM asego_leads
    LEFT OUTER JOIN 
    (SELECT ml_branch, po_order_no FROM lead_order LEFT OUTER JOIN master_location ON ml_branchcd = po_location ) AS a ON po_order_no = al_orderno
    WHERE al_orderno='".$order_row[9]."'";
    $riderlist = array();
    $dbconn = $dbio->getConn();
    $result = $dbio->getSelect($dbconn, $sql);
    $row = mysqli_fetch_row($result);
    $qry = "SELECT arl_ridercode, arl_riderpercent FROM asego_rider_leads WHERE arl_orderno = '".$order_row[9]."'";
    $res = $dbio->getSelect($dbconn, $qry);
    if(mysqli_num_rows($res)>0){
        while($r = mysqli_fetch_assoc($res)){
            $riderlist[] = $r;
        }
    }
    $dbio->closeConn($dbconn);
    
    getPolicyData($order_row[9], $row, $riderlist, $dbio, $order_row[5]);
}

function checkPayment($dbio, $response){
    $AMT=0;$CREATEDAT="";$ORDERNO="";$MSG="";$MSGCODE="";
    $sql = "select rz_order_id,rz_payment_signature,rz_payment_id,order_id, order_currency , order_amount, customer_name,customer_email,customer_phone,backoffice_order_no, order_created_at
    from razorpay_payments where rz_order_id = '".$response->rz_order_id."'";
    $dbconn = $dbio->getConnRazorPay();
    $result = $dbio->getSelect($dbconn, $sql);
    $dbio->closeConn($dbconn);
    if(mysqli_num_rows($result)>0){
        $row = mysqli_fetch_row($result);
        $signature = hash_hmac('sha256', $row[0].'|'.$response->rz_paymentid, RAZORPAY_SECRETKEY);
        if($signature == $response->rz_signature){
            $AMT = $row[5];
            $CREATEDAT = $row[10];
            $ORDERNO = $row[9];
            $MSGCODE = "SUCCESS";
            $MSG = "Payment Successful";
            sendPolicy($dbio, $row);
            updatePayment($dbio,$response, $row);
        } else {
            $MSGCODE = "FAILED";
            $MSG = "Siganture Verification Failed.";
        }
    } else {
        $MSGCODE = "FAILED";
        $MSG = "Invalid Order Id Detected.";
    }
    return array(
        "amt"=>$AMT,
        "createdat"=>$CREATEDAT,
        "orderno"=>$ORDERNO,
        "paymentid"=>$response->rz_paymentid,
        "msgcode"=>$MSGCODE,
        "msg"=>$MSG
    );
}

$payment = checkPayment($dbio,$response);

?>

<html>
    <body>
        <center>
        <div>
            <img src="/img/logo.png" alt="IMG">
        </div>
        <div style="height:30px">&nbsp;</div>
        <h2><?=$payment['msg']?></h2>
        <table cellspacing="0" border >
            <tbody style="font-size:18px;">
                <tr>
                    <td style="padding: 10px 90px 10px;">Order No</td>
                    <td style="padding: 10px 90px 10px;"><?=$payment['orderno']?></td>
                </tr>
                <tr>
                    <td style="padding: 10px 90px 10px;">Amount</td>
                    <td style="padding: 10px 90px 10px;"><?=$payment['amt']?></td>
                </tr>
                <tr>
                    <td style="padding: 10px 90px 10px;">Payment ID</td>
                    <td style="padding: 10px 90px 10px;"><?=$payment['paymentid']?></td>
                </tr>
                <tr>
                    <td style="padding: 10px 90px 10px;">Created At</td>
                    <td style="padding: 10px 90px 10px;"><?=$payment['createdat']?></td>
                </tr>
                <tr>
                    <td style="padding: 10px 90px 10px;">Status</td>
                    <td style="padding: 10px 90px 10px;"><?=$payment['msgcode']?></td>
                </tr>
            </tbody>
        </table>
        <p>You will be redirected in (<span class='timer' id='timer'>7</span> sec).</p>
        </center>
    </body>
    <script>
        let countdown = 7;
        function updateTimer() {
            if (countdown >= 0) {
                document.getElementById('timer').innerText = countdown;
                countdown--;
                setTimeout(updateTimer, 1000);
            } else {
                window.location.href = <?="'".RAZORPAY_AFTER_PAYMENT_PAGE."'"?>;
            }
        }
        updateTimer();
    </script>
<html>