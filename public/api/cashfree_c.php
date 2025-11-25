<?php
include "placeordermail_a.php";
require_once("config_t.php");
require_once("mail_c.php");
 class CashFree {
    
    function callApiGet($url){
        $ch = curl_init(urldecode($url));
        curl_setopt_array($ch, array(
            
            CURLOPT_RETURNTRANSFER => TRUE,
            CURLOPT_HTTPHEADER => array(
                'Content-Type: application/json',
                'Accept: application/json',
                'x-api-version:2022-01-01',
                'x-client-id:'.CASHFREE_APPID,
                'x-client-secret:'.CASHFREE_SECRETKEY
            )
        ));
        return curl_exec($ch);
    }
    public function paymentStatus($dbio, $obj){
        $response = (object)[];
        $url = CASHFREE_PAYMENT_CHECK.$obj->orderid."/payments";
        if($obj->orderid != ""){
            $response = json_decode($this->callApiGet($url));
        }
        $msg = "";
        if(isset($response[0]->payment_status)){
            $obj->payment_status = $response[0]->payment_status;
            $obj->order_amount = $response[0]->order_amount;
            $this->updateOrderStatus($dbio, $obj);
        }
        return $response;
    }

    public function updateOrderStatus($dbio, $obj){
        if($obj->payment_status == 'SUCCESS'){
            $sql = "UPDATE lead_order SET po_status = '1', po_isplaced = 1, po_ispaid = 1, po_payment_status = '".$obj->payment_status."' WHERE po_order_no = '".$obj->orderno."';
                update master_account_details SET ac_amountpaid=".$obj->order_amount." 
                , ac_amountpending= ac_totalamount-".$obj->order_amount.", ac_amounttobepaid = round(ac_totalamount-".$obj->order_amount.") where ac_orderno = '".$obj->orderno."';";
            $dbconn = $dbio->getConn();
            $result = $dbio->batchQueries($dbconn, $sql);
            $dbio->closeConn($dbconn);
            //send mail to our team
            sendPlaceOrderMail($dbio, $obj->orderno, $_SESSION["userSrno"], $_SESSION["userId"]);
        }else {
            $sql = "UPDATE lead_order SET po_status = '1', po_isplaced = 1, po_ispaid = 0, po_payment_status = '".$obj->payment_status."' WHERE po_order_no = '".$obj->orderno."'";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            $dbio->closeConn($dbconn);
        }
    }
    public function getBankListQuery(){
        return " SELECT bm_code as value , bm_desc as name FROM bank_master
        where bm_active = 1 
        order by bm_desc ";
    }
    public function getBankList($dbio){
        $sql = $this->getBankListQuery();
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn,$sql);
        //$resarray = array();
        $resarray = array(["name"=>"Select","value"=>"0"]);
        if($result){
            while($row =mysqli_fetch_assoc($result))
            {
                $resarray[] = $row;
            }
        }
        $dbio->closeConn($dbconn);
        return $resarray;        
    }
    public function getBankListAllQuery(){
        return " SELECT bm_code as value , bm_desc as label FROM bank_master
        order by bm_desc ";
    }

    public function getBankListAll($dbio){
        $sql = $this->getBankListAllQuery();
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn,$sql);
        //$resarray = array();
        $resarray = array(["label"=>"Select","value"=>"0"]);
        if($result){
            while($row =mysqli_fetch_assoc($result))
            {
                $resarray[] = $row;
            }
        }
        $dbio->closeConn($dbconn);
        return $resarray;        
    }
     
 }

 class Cashfree_asego{

    private function encryptAES($plaintext, $key) {
        $method = 'AES-256-CBC';
        $iv = substr(REFKEY, 0, 16);
        $ciphertext = openssl_encrypt($plaintext, $method, $key, OPENSSL_RAW_DATA, $iv);
        return $ciphertext;
    }

    private function callApiPost($url, $postData){
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

    private function callApiGet($url){
        $ch = curl_init(urldecode($url));
        curl_setopt_array($ch, array(
            CURLOPT_RETURNTRANSFER => TRUE,
            CURLOPT_HTTPHEADER => array(
                'Content-Type: application/json',
                'Accept: application/json',
                'x-api-version:2022-01-01',
                'x-client-id:'.A_CASHFREE_APPID,
                'x-client-secret:'.A_CASHFREE_SECRETKEY
            )
        ));
        return curl_exec($ch);
    }
    
    public function paymentStatus($dbio, $obj){
        $response = (object)[];
        $url = A_CASHFREE_PAYMENT_CHECK.$obj->orderid."/payments";
        if($obj->orderid != ""){
            $response = json_decode($this->callApiGet($url));
        }
        $msg = "";
        if(isset($response[0]->payment_status)){
            $obj->payment_status = $response[0]->payment_status;
            $obj->order_amount = $response[0]->order_amount;

            if($response[0]->payment_status == "SUCCESS"){
                $this->sendPolicy($dbio, $obj);
            }else {
                $this->updatePaymentFailure($dbio, $obj);
            }
        }
        return $response;
    }

    public function updatePaymentFailure($dbio, $obj){
        $qry = "update asego_leads SET al_status = '".$obj->payment_status."',al_paymentrecieved='0', al_amtrecieved = 0 WHERE al_orderno = '".$orderno."' ";
        $dbconn = $dbio->getConn();
        $res = $dbio->getSelect($dbconn, $qry);
        $dbio->closeConn($dbconn);   
    }

    private function getPolicyData($orderno, $row, $riderlist, $dbio, $obj){
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
        $encr = $this->encryptAES($string, ENCRYPTIONKEY); // AES encryption
        $data = base64_encode($encr);   // base 64 encryption
        $postData = array("Data"=>$data, "Ref"=>REFKEY);
        $url = "https://asegotravel.in/trawelltag/v2/CreatePolicy.aspx"; // API End point URL
        $response = $this->callApiPost($url, $postData); // call API post
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
            $sql = "UPDATE lead_order SET po_isplaced = 1, po_status = '1', po_ispaid = 1, po_payment_status = 'S' WHERE po_order_no= '".$orderno."'";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
    
            $qry = "UPDATE asego_leads SET al_doclink = '".$filename."', al_docpath = '".$file_path."', al_paymentrecieved='1', al_amtrecieved = ".$obj->order_amount.", al_status = '".$obj->payment_status."' 
            WHERE al_orderno = '".$orderno."' ";
            $res = $dbio->getSelect($dbconn, $qry);
            $dbio->closeConn($dbconn);
        // }else {
        //     $paymentStatus = "TRANSACTION SUCCESSFULL";
        //     $qry = "UPDATE asego_leads SET al_doclink = 'N/A', al_docpath = 'N/A', al_paymentrecieved='1', al_amtrecieved = ".$amountpaid." WHERE al_orderno = '".$orderno."' ";
        //     $dbconn = $dbio->getConn();
        //     $res = $dbio->getSelect($dbconn, $qry);
        //     $dbio->closeConn($dbconn);
        }
        fclose($fp);
    }
    
    public function sendPolicy($dbio, $obj){
        $sql = "SELECT al_name, al_email, al_mobile, al_categorycode, al_plancode, DATE_FORMAT(STR_TO_DATE(REPLACE(al_depdate, '/', '-'), '%d-%c-%Y'), '%d-%b-%Y')AS al_depdate, 
        DATE_FORMAT(STR_TO_DATE(REPLACE(al_arrivaldate, '/', '-'), '%d-%c-%Y'), '%d-%b-%Y') AS al_arrivaldate, al_nofdays, al_age, al_premium,
        DATE_FORMAT(STR_TO_DATE(REPLACE(al_dob, '/', '-'), '%d-%c-%Y'), '%d-%b-%Y') AS al_dob,
        ml_branch, al_basecharge, al_gst FROM asego_leads
        LEFT OUTER JOIN 
        (SELECT ml_branch, po_order_no FROM lead_order LEFT OUTER JOIN master_location ON ml_branchcd = po_location ) AS a ON po_order_no = al_orderno
        WHERE al_orderno='".$obj->orderno."'";
        $riderlist = array();
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        $row = mysqli_fetch_row($result);
        $qry = "SELECT arl_ridercode, arl_riderpercent FROM asego_rider_leads WHERE arl_orderno = '".$obj->orderno."'";
        $res = $dbio->getSelect($dbconn, $qry);
        if(mysqli_num_rows($res)>0){
            while($r = mysqli_fetch_assoc($res)){
                $riderlist[] = $r;
            }
        }
        $dbio->closeConn($dbconn);
        
        $this->getPolicyData($obj->orderno, $row, $riderlist, $dbio, $obj);

    }

    public function updateOrderStatus($dbio, $obj){
        if($obj->payment_status == 'SUCCESS'){
            $sql = "UPDATE lead_order SET po_status = '1', po_isplaced = 1, po_ispaid = 1, po_payment_status = 'S' WHERE po_order_no = '".$obj->orderno."';
                update master_account_details SET ac_amountpaid=".$obj->order_amount." 
                , ac_amountpending= ac_totalamount-".$obj->order_amount.", ac_amounttobepaid = round(ac_totalamount-".$obj->order_amount.") where ac_orderno = '".$obj->orderno."';";
            $dbconn = $dbio->getConn();
            $result = $dbio->batchQueries($dbconn, $sql);
            $dbio->closeConn($dbconn);
            //sendPlaceOrderMail($dbio, $obj->orderno, $_SESSION["userSrno"], $_SESSION["userId"]);
        }else {
            $sql = "UPDATE lead_order SET po_status = '1', po_isplaced = 1, po_ispaid = 0, po_payment_status = 'F' WHERE po_order_no = '".$obj->orderno."'";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            $dbio->closeConn($dbconn);
        }
    }
 }

 class CashFreeCorpModule{
    function callApiGet($url){
        $ch = curl_init(urldecode($url));
        curl_setopt_array($ch, array(
            
            CURLOPT_RETURNTRANSFER => TRUE,
            CURLOPT_HTTPHEADER => array(
                'Content-Type: application/json',
                'Accept: application/json',
                'x-api-version:2022-01-01',
                'x-client-id:'.CASHFREE_APPID,
                'x-client-secret:'.CASHFREE_SECRETKEY
            )
        ));
        return curl_exec($ch);
    }

    function callApiPost($url,$postData){
        $ch = curl_init(urldecode($url));
        curl_setopt_array($ch, array(
            CURLOPT_POST => TRUE,
            CURLOPT_RETURNTRANSFER => TRUE,
            CURLOPT_HTTPHEADER => array(
                'Content-Type: application/json',
                'Accept: application/json',
                'x-api-version:2022-01-01',
                'x-client-id:'.CASHFREE_APPID,
                'x-client-secret:'.CASHFREE_SECRETKEY
            ),
            CURLOPT_POSTFIELDS => json_encode($postData)
        ));
        return curl_exec($ch);
    }

    function createOrder($dbio,$reqjson){
        $cust = array(
            'customer_id'=>$reqjson->customer_id,
            'customer_email'=>$reqjson->customer_email,
            'customer_phone'=>$reqjson->customer_phone,
            'customer_bank_account_number'=>$reqjson->customer_bank_account_number,
            'customer_bank_ifsc'=>$reqjson->customer_bank_ifsc,
            'customer_bank_code' => (int) $reqjson->customer_bank_code
        );
        $orderMeta = array(
            'return_url'=>CASHFREE_RETURN_URL_CORP_MODULE,
            'notify_url'=>CASHFREE_NOTIFY_URL,
            'payment_methods'=>'nb,upi'
        );
        $reqArray = array(	
            'order_id' => str_replace('/', '', $reqjson->order_id),
            //*********************************************************JUST CHANGE ORDER ID IN CONFIG ********************************** */
            // 'order_id' => "111111111888",
            // ***************************************************************************************************************************
            'order_amount'=>$reqjson->order_amount,
            'order_currency'=>'INR',
            'customer_details'=>$cust,
            'order_meta'=>$orderMeta
        );
        return $this->callApiPost(CASHFREE_CREATE_ORDER,$reqArray);
        //$dbio->writeLog(CASHFREE_CREATE_ORDER);
        // return json_encode($reqArray);
        //return "a";
    }   

    function getTransactionDetail($srno){
        $qry = "";
        $qry .= "SELECT cl_orderno , corp_payment_user_email , corp_accno , corp_ifsc , corp_request_payment , cl_totalinr , user_srno , user_mobile 
            FROM corp_leads 
            LEFT OUTER JOIN user_login ON user_corpsrno = cl_corpsrno 
            WHERE COALESCE(user_corpsrno,0)>0  and cl_orderno = '".$srno."' ;";
        return $qry;
    }
    function getBankName($dbio,$bankcode){
        $bankName = "";
        $qry = " SELECT bm_desc FROM bank_master WHERE bm_code = ".$bankcode;
        $dbconn1= $dbio->getConnCashFree();
        $result = $dbio->getSelect($dbconn1,$qry);
        if($result){
            if(mysqli_num_rows($result)>0){
                $row = mysqli_fetch_row($result);
                $bankName = $row[0];
            }   
        }
        $dbio->closeConn($dbconn1);
        return $bankName ;
    }
    function sendPaymentLink($dbio,$srno){
        $msg=""; $err=""; $response="";
        $logmsg=""; $mailmsg = "";

        $sql = $this->getTransactionDetail($srno);
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn,$sql);
        if($result){
            if(mysqli_num_rows($result)>0){
                $row = mysqli_fetch_row($result);
                $reqjson = (object)[];
                $reqjson->srno = $srno;
                $reqjson->customer_email= $row[1];
                // $reqjson->customer_email= "it.developer3@zenithforex.com";
                $reqjson->customer_bank_account_number= $row[2];
                $reqjson->customer_bank_ifsc= $row[3];
                $reqjson->customer_bank_code= $row[4];
                $reqjson->order_id = $row[0];
                $reqjson->order_amount = $row[5];
                $reqjson->customer_id= $row[6];
                $reqjson->customer_phone= $row[7]; 
                $reqjson->customer_bank_name = $this->getBankName($dbio,$reqjson->customer_bank_code);
                $response = $this->createOrder($dbio,$reqjson);
                $dbio->writeLog(json_encode($reqjson)); // write to text log file.
                $dbio->writeLog($response);  // write to text log file
                
                $responseObj = json_decode($response);

                if(isset($responseObj->message) ){
                    $err = $responseObj->message;
                }else{
                    $writeLogFlag = false;
                    //*******************************************************************************************WORKING AREA ****************************** */
                    $writeLogFlag = $this->writeOrderLog($dbio,$reqjson,$responseObj);
                    $writeLogFlag = true;
                    //**************************************************************************************************************************************** */
                    
                    if($writeLogFlag){ // write to cashfree database
                        $logmsg="ORDERLOGED";
                    }else{
                        $logmsg="NOTORDERLOGED";
                    };
                    
                    $senMailFlag = false;
                    $senMailFlag = $this->sendEmail($reqjson,$responseObj); 
                    if($senMailFlag){
                        $mailmsg="MAILSENT";
                        $qry = " insert into tran_requests_log (reqlog_user,reqlog_logtime,reqlog_reqsrno,reqlog_rmk,reqlog_type) 
                        select ".$_SESSION["userSrno"].",now(),".$srno."
                        , 'Cashfree Payment Link Sent. Bank:".$reqjson->customer_bank_name." ACNO:".$reqjson->customer_bank_account_number." IFSC:".$reqjson->customer_bank_ifsc."','PAYMENTPGL' ; ";
                        $result = $dbio->getSelect($dbconn,$qry);
                    }else{
                        $mailmsg="NOTMAILSENT";
                    }
                    
                    $msg = "Payment link has been send successfully.";
                }
                
            }
        }else{
            $err="Unable to send payment link";
        }
        $dbio->closeConn($dbconn);
        return array("msg"=>$msg,"err"=>$err,"logmsg"=>$logmsg,"mailmsg"=>$mailmsg);
    }
    function writeOrderLog($dbio,$reqjson,$response){
            $qry = " insert into orders ( 
                  cf_order_id , order_id , order_currency 
                , order_amount , order_expiry_time , customer_id
                , customer_name , customer_email , customer_phone 
                , return_url , notify_url , payment_methods 
                , settlements , payments , refunds 
                , order_status , order_token , payment_link 
                , backoffice_order_no , customer_bank_code , customer_bank_ifsc 
                , customer_bank_account_number  , order_detail
            ) ";
            $qry = $qry." select '".$response->cf_order_id."', '".$response->order_id."', '".$response->order_currency."'  ";
            $qry = $qry." , ".$response->order_amount." , '".$response->order_expiry_time."' , '".$response->customer_details->customer_id."'  ";
            $qry = $qry." , '".$response->customer_details->customer_name."' , '".$response->customer_details->customer_email."' , '".$response->customer_details->customer_phone."'  ";
            $qry = $qry." , '".$response->order_meta->return_url."' , '".$response->order_meta->notify_url."' , '".$response->order_meta->payment_methods."'  ";
            $qry = $qry." , '".$response->settlements->url."' , '".$response->payments->url."' , '".$response->refunds->url."'  ";
            $qry = $qry." , '".$response->order_status."' , '".$response->order_token."' , '".$response->payment_link."'  ";
            $qry = $qry." , '".$reqjson->order_id."' , ".$reqjson->customer_bank_code." , '".$reqjson->customer_bank_ifsc."'  ";
            $qry = $qry." , '".$reqjson->customer_bank_account_number."' ";
            $qry = $qry." , 'srno:".$reqjson->srno.",order_amount:".$reqjson->order_amount."'; ";
            $dbio->writeLog($qry);
            
            $dbconn1= $dbio->getConnCashFree();
            $result = $dbio->batchQueries($dbconn1,$qry);
            $dbio->closeConn($dbconn1);
            if($result){
                return true;
            }else{
                return false;
            }
    }

    function sendEmail($reqjson,$response){
        $ml = "<html>";
        $ml = $ml."<body>";
        $ml = $ml."Dear Sir/Madam <br><br> ";
        $ml = $ml." Please pay : <br><br>";
        $ml = $ml." Total : ".$reqjson->order_amount."<br><br>";
        $ml = $ml." Payment Link : ".$response->payment_link." <br><br>";
        $ml = $ml." Please pay only through ".$reqjson->customer_bank_name." Account Number : ".$reqjson->customer_bank_account_number."<br><br>";
        $ml = $ml." ";
        $ml = $ml."Thanks & Regards <br> ZenEremit Team ";
        $ml = $ml."</body>";
        $ml = $ml."</html>";
        $m = new Mymail();
        $msent = $m->sendMail('ZenEremit Payment Link',$ml,$reqjson->customer_email,'','',"navnit",'');
        if($msent){ 
            return true;
        }else{
            return false;
        }
    }

 }


?>