<?php

    header('Content-Type: application/json');
    $request = file_get_contents('php://input');
    $req_dump = print_r( $request, true );
    
    require_once('../dbio_c.php');
    $fp = file_put_contents( CASHFREELOG.'notify'.date("Ymd").'.txt', $req_dump.PHP_EOL, FILE_APPEND | LOCK_EX );
    
    $result = json_decode($req_dump);

    $dbio = new Dbio();
    $notify = new Notify();
    $obj = (object)[];
    $obj->backoffice_ref_no = "";
    $obj->headerTimeStamp = $notify->getHeader('X-Webhook-Timestamp');
    $obj->headerSignature = $notify->getHeader('X-Webhook-Signature');
    $obj->calling_ip = (getenv('HTTP_CLIENT_IP')?:getenv('HTTP_X_FORWARDED_FOR')?:getenv('HTTP_X_FORWARDED')?:getenv('HTTP_FORWARDED_FOR')?:getenv('HTTP_FORWARDED')?:getenv('REMOTE_ADDR'));

    $signedPayload = $obj->headerTimeStamp.$req_dump;
    $expectedSignature =  base64_encode(hash_hmac('sha256', $signedPayload, CASHFREE_SECRETKEY,true));


    if($obj->headerSignature == $expectedSignature ){
        if($result->type <> ""){
            $obj->event_time = $result->event_time;
            $obj->event_type = $result->type;
            $obj->order_id = $result->data->order->order_id;
            $obj->order_amount = $result->data->order->order_amount;
            $obj->order_currency = $result->data->order->order_currency;
    
            $obj->cf_payment_id = $result->data->payment->cf_payment_id;
            $obj->payment_status = $result->data->payment->payment_status;
            $obj->payment_amount = $result->data->payment->payment_amount;
            $obj->payment_currency = $result->data->payment->payment_currency;
            $obj->payment_message = $result->data->payment->payment_message;
            $obj->payment_time = $result->data->payment->payment_time;
            $obj->bank_reference = $result->data->payment->bank_reference;
    
            $obj->netbanking_bank_code = $result->data->payment->payment_method->netbanking->netbanking_bank_code;
            $obj->netbanking_bank_name = $result->data->payment->payment_method->netbanking->netbanking_bank_name;
    
        
            $obj->backoffice_ref_no = $notify->writeCashfreeResponse($dbio,$obj);
        }
    
        if($obj->backoffice_ref_no!="" and $obj->event_type == "PAYMENT_SUCCESS_WEBHOOK"){
            $notify->writePayment($dbio,$obj);
        }
    
    }else{
        $fp = file_put_contents( CASHFREELOG.'notify'.date("Ymd").'.txt', "Suspected Signature not matched.", FILE_APPEND | LOCK_EX );
        $headers = getallheaders();
        foreach($headers as $key => $value){
            $fp = file_put_contents( CASHFREELOG.'notify'.date("Ymd").'.txt', "{$key} => {$value} ".PHP_EOL, FILE_APPEND | LOCK_EX );
        }
        $fp = file_put_contents( CASHFREELOG.'notify'.date("Ymd").'.txt', "our signature : ".$expectedSignature, FILE_APPEND | LOCK_EX );
    }

    $fp = file_put_contents( CASHFREELOG.'notify'.date("Ymd").'.txt', $result->type.PHP_EOL, FILE_APPEND | LOCK_EX );
    $fp = file_put_contents( CASHFREELOG.'notify'.date("Ymd").'.txt', $expectedSignature.PHP_EOL, FILE_APPEND | LOCK_EX );
?>

<?php
    class Notify{
        public function writeCashfreeResponse($dbio,$obj){
            $backoffice_ref_no = "";
            $qry = " INSERT INTO notify_webhook (
                    event_time,event_type,order_id,order_amount,order_currency
                    ,cf_payment_id,payment_status,payment_amount,payment_currency
                    ,payment_message,payment_time,bank_reference,netbanking_bank_code
                    ,netbanking_bank_name
                    , ip_address , createdat
                    ) ";
            $qry = $qry." select '".$obj->event_time."' , '".$obj->event_type."', '".$obj->order_id."' , ".$obj->order_amount." , '".$obj->order_currency."'  ";
            $qry = $qry." , '".$obj->cf_payment_id."' , '".$obj->payment_status."' , ".$obj->payment_amount." , '".$obj->payment_currency."'  ";
            $qry = $qry." , '".$obj->payment_message."' , '".$obj->payment_time."' , '".$obj->bank_reference."' , '".$obj->netbanking_bank_code."' 
                        , '".$obj->netbanking_bank_name."' ";
            $qry = $qry." , '".$obj->calling_ip."'  , now() ; " ;
            $dbconn1= $dbio->getConnCashFree();
            $result = $dbio->batchQueries($dbconn1,$qry);

            $qry = " SELECT backoffice_order_no FROM orders WHERE order_id = '".$obj->order_id."' LIMIT 1 ";
            $result = $dbio->getSelect($dbconn1,$qry);
            if(mysqli_num_rows($result)>0){
                $row = mysqli_fetch_row($result);
                $backoffice_ref_no = $row[0];
            }
            $dbio->closeConn($dbconn1);
            return $backoffice_ref_no;
        }

        public function writePayment($dbio,$obj){
            $srno = '';
            $query = "SELECT po_usersrno FROM lead_orde WHERE po_order_no = '".$obj->backoffice_ref_no."'";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $query);
            if(mysqli_fetch_rows($result)>0){
                $row = mysqli_fetch_row($result);
                $srno = $row[0];
            }
            
            if($obj->payment_currency == "INR" and $obj->event_type == "PAYMENT_SUCCESS_WEBHOOK"){
                $sql = "INSERT INTO tran_requests_payment (pay_srno, pay_lineno, pay_bankcode, pay_refno, pay_amnt, pay_paymentgateway, pay_date, pay_timestamp)
                    VALUES (".$srno.", COALESCE((SELECT MAX(pay_lineno) FROM tran_requests_payment WHERE pay_srno = ".$srno."  ) ,0)+100 , '".$obj->netbanking_bank_code."',
                    '".$obj->cf_payment_id."', '".$obj->order_amount."', 1, '".$obj->payment_time."', '".$obj->payment_completion_time."')";

                $qry = "UPDATE master_account_details SET ac_amountpaid= ".$obj->order_amount." WHERE ac_orderno = '".$obj->backoffice_ref_no."'";
            }
            $result = $dbio->getSelect($dbconn, $sql);
            $result = $dbio->getSelect($dbconn,$qry);
            $dbio->closeConn($dbconn);
        }

        public function getHeader($headerName)
        {
            $headers = getallheaders();
            
            foreach($headers as $key => $value){
                $fp = file_put_contents( CASHFREELOG.'notify'.date("Ymd").'.txt', "{$key} => {$value} ".PHP_EOL, FILE_APPEND | LOCK_EX );
            }
            
             return $headers[$headerName];
            // return "a";
        }
    }  

?>

<?php
    /*
        Content-Type => application/json 
        Content-Length => 733 
        X-Webhook-Signature => VFg1PbjJgCRnEdX4ft7lYDe70z/f+w1GE4RpQE90nQM= 
        X-Webhook-Timestamp => 1653896516732 
        X-Webhook-Version => 2021-09-21 
        User-Agent => ReactorNetty/0.9.16.RELEASE 
        Host => zenithforexonline.in 
        Accept =>  
        Connection => close 

    */
?>

<?php
    /*
        Failed
        {"data":{"order":{"order_id":"20220528124237","order_amount":90160.00,"order_currency":"INR","order_tags":null}
                ,"payment":{"cf_payment_id":885247609,"payment_status":"FAILED","payment_amount":90160.00
                            ,"payment_currency":"INR","payment_message":"Your transaction has failed."
                            ,"payment_time":"2022-05-28T12:43:02+05:30","bank_reference":"232024","auth_id":null,
                            "payment_method":{"netbanking":{"channel":null,"netbanking_bank_code":"3022","netbanking_bank_name":"ICICI Bank"}}
                            ,"payment_group":"net_banking"}
                ,"customer_details":{"customer_name":null,"customer_id":"KOL_B1_20220527_S91"
                                    ,"customer_email":"jagdeepladdi@gmail.com","customer_phone":"9540066433"}
                ,"error_details":{"error_code":null,"error_description":null,"error_reason":null,"error_source":null}
                }
        ,"event_time":"2022-05-28T12:43:04+05:30"
        ,"type":"PAYMENT_FAILED_WEBHOOK"}
        Success
        orderId=20220528123750&orderAmount=90160.00&referenceId=885247594&txStatus=SUCCESS&paymentMode=NET_BANKING&txMsg=Transaction+pending&txTime=2022-05-28+12%3A38%3A18&signature=nBRSZjPMYg1LgwjOqh839JmpI4XUnLWkl8GLZMIEzjQ%3D

        {"data":{"order":{"order_id":"20220528123750","order_amount":90160.00,"order_currency":"INR","order_tags":null}
            ,"payment":{"cf_payment_id":885247594,"payment_status":"SUCCESS","payment_amount":90160.00
                        ,"payment_currency":"INR","payment_message":"Transaction pending"
                        ,"payment_time":"2022-05-28T12:38:18+05:30","bank_reference":"182750","auth_id":null
                        ,"payment_method":{"netbanking":{"channel":null,"netbanking_bank_code":"3022","netbanking_bank_name":"ICICI Bank"}}
                        ,"payment_group":"net_banking"}
            ,"customer_details":{"customer_name":null,"customer_id":"KOL_B1_20220527_S91",
                                "customer_email":"jagdeepladdi@gmail.com","customer_phone":"9540066433"}}
        ,"event_time":"2022-05-28T12:38:20+05:30"
        ,"type":"PAYMENT_SUCCESS_WEBHOOK"}
    */
?>