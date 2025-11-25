<?php
        session_start();
        require_once("dbio_c.php");
        $dbio = new Dbio();
        $requestString = base64_decode($_REQUEST['d']);
        $paramArray = explode("^",$requestString);

        $payObj = (object)[];
        $payObj->name = $paramArray[0];
        $payObj->email = $paramArray[1];
        $payObj->amount = $paramArray[2];
        $payObj->mobile = $paramArray[3];
        $payObj->orderno = $paramArray[4];
        $session = $paramArray[5];

        $date = date("Ymdhis");
        $replacedOrder = str_replace('/', '_', $paramArray[4]);
        $payObj->orderid = "".$date."ZENFOREX".$replacedOrder."";
        $rz_order_id = "";$custname="";$custemail="";$custphone="";

        if($dbio->validateSession($session)){

            function getInsuranceDetails($dbio, $orderno){
                $sql = "select al_name, al_email, al_mobile, al_premium,al_srno FROM asego_leads WHERE al_orderno='".$orderno."'";
                $dbconn = $dbio->getConn();
                $result = $dbio->getSelect($dbconn, $sql);
                $dbio->closeConn($dbconn);
                $row = mysqli_fetch_row($result);
                return $row;
            }

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
                $auth = base64_encode(RAZORPAY_APPID.':'.RAZORPAY_SECRETKEY);
                curl_setopt_array($ch, array(
                    CURLOPT_POST => TRUE,
                    CURLOPT_RETURNTRANSFER => TRUE,
                    CURLOPT_HTTPHEADER => array(
                        'content-type:application/json',
			            'Authorization: Basic ' . $auth
                    ),
                    CURLOPT_POSTFIELDS => json_encode($postData)
                ));
                return curl_exec($ch);
            }

            function createOrder($dbio, $payObj){
                $row = getInsuranceDetails($dbio, $payObj->orderno);
                $payObj->custname = $row[0];
                $payObj->custemail = $row[1];
                $payObj->custphone = $row[2];
                $amount = $row[3];

                $custArray = array(
                    'name'=> $row[0],
                    'email'=> $row[1],
                    'phone'=> $row[2]
                );
                
                $reqArray = array(	
                    'amount'=> round($amount)*100,
                    'currency'=>'INR',
                    'receipt'=>$payObj->orderid,
                    'notes'=> $custArray
                );
                return callApiPost(RAZORPAY_CREATE_ORDER,$reqArray);
            }
                
            function addOrderDetails($dbio, $payObj, $decode){
                $qry = "insert into razorpay_payments(
                    rz_order_id,rz_payment_signature,rz_payment_id,order_id, order_currency , order_amount, customer_name,customer_email,customer_phone,backoffice_order_no
                    , order_created_at, order_status)
                    select '".$decode->id."', '', '', '".$decode->receipt."', '".$decode->currency."', ".($decode->amount/100).", '".$decode->notes->name."'
                    , '".$decode->notes->email."', '".$decode->notes->phone."', '".$payObj->orderno."', '".$decode->created_at."', '".$decode->status."';";
                $dbconn = $dbio->getConnRazorPay();
                $result = $dbio->getSelect($dbconn, $qry);
                $dbio->closeConn($dbconn);
                if($result) return "aa";
            }

            $response = createOrder($dbio, $payObj);
            writeLog($response);
            $decode = json_decode($response);
            $rz_order_id = $decode->id;
            $rz_amount = $decode->amount;
            addOrderDetails($dbio, $payObj, $decode);

        } else {
            echo '{"msg": "MSG0010"}';
        }
?>


<html>
    <body>
        <h1 style="display:flex; justify-content:center; align-items: center">Please do not refresh this page.</h1>
        <button id="rzp-button1" style="display: none;">Pay</button>
    </body>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
            <script>
            var options = {
                "key": "<?php echo RAZORPAY_APPID ?>",
                "amount": "<?php echo $rz_amount ?>",
                "currency": "INR",
                "order_id": "<?php echo $rz_order_id ?>",
                "callback_url": "<?php echo RAZORPAY_CALLBACK_URL ?>",
                "prefill": {
                    "name": "<?php echo $payObj->custname ?>",
                    "email": "<?php echo $payObj->custemail ?>",
                    "contact": "<?php echo $payObj->custphone ?>"
                }
            };
            var rzp1 = new Razorpay(options);
            document.getElementById('rzp-button1').onclick = function(e){
                rzp1.open();
                e.preventDefault();
            }
            document.getElementById('rzp-button1').click();
        </script> 
      
</html>
  