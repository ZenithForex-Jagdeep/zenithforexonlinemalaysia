<?php
        require_once("dbio_c.php");
        $dbio = new Dbio();
        $requestString = base64_decode($_REQUEST['d']);
        $paramArray = explode("^",$requestString);

        $accnum = $paramArray[0];
        $acccode = $paramArray[1];
        $ifsc = $paramArray[2];
        $uid = $paramArray[3];
        $orderno = $paramArray[4];
        $date = date("Ymdhis");
        $replacedOrder = str_replace('/', '_', $orderno);
        $orderid = "".$date."ZENFOREX".$replacedOrder."";
        
        $sql = "SELECT po_order_no,po_roundAmt, po_ordertype, po_location, po_product, po_product_2, 
                po_currency, po_card_currency,
                po_buyrate, po_card_buyrate, po_quantity, po_card_quantity, po_SGST, po_handlingcharge, po_round, 
                ac_bankaccnum, ac_bankname, ac_ifsc, ac_paymentmode, ac_amounttobepaid
                FROM lead_order
                LEFT OUTER JOIN master_account_details ON po_order_no = ac_orderno
                WHERE po_order_no ='".$orderno."'"; 
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        $dbio->closeConn($dbconn);
        $r = mysqli_fetch_row($result);

        $query = "SELECT user_name, user_id, user_srno, user_mobile, user_email FROM user_login WHERE user_id = '".$uid."'";
        $dbconn = $dbio->getConn();
        $res = $dbio->getSelect($dbconn, $query);
        $dbio->closeConn($dbconn);
        $row = mysqli_fetch_row($res);


        function writeLog($msg){
            $f = fopen(CASHFREELOG.date("Ymd").'_zenithforexorder.txt',"a");
            fwrite($f,"----------------------------------------------------------------------------------".PHP_EOL);
            fwrite($f,date("Ymd h:i:s a").PHP_EOL);
            fwrite($f,(getenv('HTTP_CLIENT_IP')?:getenv('HTTP_X_FORWARDED_FOR')?:getenv('HTTP_X_FORWARDED')?:getenv('HTTP_FORWARDED_FOR')?:getenv('HTTP_FORWARDED')?:getenv('REMOTE_ADDR')).PHP_EOL);
            fwrite($f,$msg.PHP_EOL);
            fwrite($f,"----------------------------------------------------------------------------------".PHP_EOL);
            fclose($f);
        }

        function callApiPost($url,$postData){
            $ch = curl_init(urldecode($url));
            curl_setopt_array($ch, array(
                CURLOPT_POST => TRUE,
                CURLOPT_RETURNTRANSFER => TRUE,
                CURLOPT_HTTPHEADER => array(
                    'Content-Type: application/json',
                    'Accept: application/json',
                    'x-api-version:2022-09-01',
                    'x-client-id:'.CASHFREE_APPID,
                    'x-client-secret:'.CASHFREE_SECRETKEY
                ),
                CURLOPT_POSTFIELDS => json_encode($postData)
            ));
            return curl_exec($ch);
        }

         function createOrder($r, $row, $accnum, $ifsc, $acccode, $orderid){
            $cust = array(
                'customer_id'=>$row[2],
                'customer_name'=>$row[0],
                'customer_email'=>$row[4],
                'customer_phone'=>$row[3],
                'customer_bank_account_number'=>$accnum,
                'customer_bank_ifsc'=>$ifsc,
                'customer_bank_code'=>$acccode*1
            );
            $orderMeta = array(
                'return_url'=>CASHFREE_RETURN_URL,
                'notify_url'=>CASHFREE_NOTIFY_URL,
                'payment_methods'=>'nb,upi'
            );
            $reqArray = array(	
                'order_id'=>$orderid,
                'order_amount'=>$r[19],
                'order_currency'=>'INR',
                'customer_details'=>$cust,
                'order_meta'=>$orderMeta
            );
            return callApiPost(CASHFREE_CREATE_ORDER,$reqArray);
            //$dbio->writeLog(CASHFREE_CREATE_ORDER);
            //return json_encode($reqArray);
            //return "a";
        }   

    // echo $orderid;
    $response = createOrder($r, $row, $accnum, $ifsc, $acccode, $orderid);
    writeLog($response);
    $decode = json_decode($response);


    $qry = " insert into orders ( 
        cf_order_id , order_id , order_currency 
      , order_amount , order_expiry_time , customer_id
      , customer_name , customer_email , customer_phone 
      , return_url , notify_url , payment_methods 
      , settlements , payments , refunds 
      , order_status , order_token , payment_link 
      , backoffice_order_no , customer_bank_code , customer_bank_ifsc 
      , customer_bank_account_number , remitter_name , order_detail
        ) ";
        $qry = $qry." select '".$decode->cf_order_id."', '".$decode->order_id."', '".$decode->order_currency."'  ";
        $qry = $qry." , ".$decode->order_amount." , '".$decode->order_expiry_time."' , '".$decode->customer_details->customer_id."'  ";
        $qry = $qry." , '".$decode->customer_details->customer_name."' , '".$decode->customer_details->customer_email."' , '".$decode->customer_details->customer_phone."'  ";
        $qry = $qry." , '".$decode->order_meta->return_url."' , '".$decode->order_meta->notify_url."' , '".$decode->order_meta->payment_methods."'  ";
        $qry = $qry." , '".$decode->settlements->url."' , '".$decode->payments->url."' , '".$decode->refunds->url."'  ";
        $qry = $qry." , '".$decode->order_status."' , '".$decode->payment_session_id."' , ''  ";
        $qry = $qry." , '".$r[0]."' , ".$r[16]." , '".$r[17]."'  ";
        $qry = $qry." , '".$r[15]."' , '".$row[0]."' ";
        $qry = $qry." , 'srno:".$row[2].", order_type: ".$r[2].",brnno:".$r[3].",product:".$r[4]." ".$r[5].",isd:".$r[6]." ".$r[7]."";
        $qry = $qry.",quantity:".$r[10]." ".$r[11].",rate:".$r[8]." ".$r[9].",gst:".$r[12].",bank_charges:".$r[13]."";
        $qry = $qry.",nostro_charges:'',round_off:".$r[14].",order_amount:".$r[1]."' ;   ";

    $dbconn = $dbio->getConnCashFree();
    $result = $dbio->getSelect($dbconn, $qry);
    $dbio->closeConn($dbconn);
    
?>

<html>
    <body>
        <center>
            <div>&nbsp;</div>
            <h1>Please do not refresh this page.</h1>
            <hr>
            <div>
            <?php
                //echo($amountToPay);
            ?>

            </div>
        </center>
    </body>
          <!-- <script src="https://sdk.cashfree.com/js/ui/2.0.0/cashfree.sandbox.js"></script> -->
          <script src="https://sdk.cashfree.com/js/ui/2.0.0/cashfree.prod.js"></script>
            <script>
            //const paymentSessionId = "<?php   ?>";
            const cf = new Cashfree("<?php echo $decode->payment_session_id ?>");
            document.addEventListener('DOMContentLoaded', function () {
                cf.redirect();
                // do something here ...
            }, false);
        </script> 
      
</html>
  
    