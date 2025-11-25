<?php
require_once('config.php');
class Dbio {

    public function convera_writeLog($msg){
        $f = fopen(TEMPPATH.QUERYLOG."_Convera_".date("Ymd").'.txt',"a");
        fwrite($f,"----------------------------------------------------------------------------------".PHP_EOL);
        fwrite($f,date("Ymd h:i:s a").PHP_EOL);
        //fwrite($f,$_SESSION["sesschecktime"].PHP_EOL);
        //fwrite($f,$_SERVER['HTTP_REFERER'].PHP_EOL);
        fwrite($f,(getenv('HTTP_CLIENT_IP')?:getenv('HTTP_X_FORWARDED_FOR')?:getenv('HTTP_X_FORWARDED')?:getenv('HTTP_FORWARDED_FOR')?:getenv('HTTP_FORWARDED')?:getenv('REMOTE_ADDR')).PHP_EOL);
        fwrite($f,$msg.PHP_EOL);
        fwrite($f,"----------------------------------------------------------------------------------".PHP_EOL);
        fclose($f);
    }

    public function writeLog($msg){
        $f = fopen(TEMPPATH.QUERYLOG.date("Ymd").'.txt',"a");
        fwrite($f,"----------------------------------------------------------------------------------".PHP_EOL);
        fwrite($f,date("Ymd h:i:s a").PHP_EOL);
        //fwrite($f,$_SESSION["sesschecktime"].PHP_EOL);
        //fwrite($f,$_SERVER['HTTP_REFERER'].PHP_EOL);
        fwrite($f,(getenv('HTTP_CLIENT_IP')?:getenv('HTTP_X_FORWARDED_FOR')?:getenv('HTTP_X_FORWARDED')?:getenv('HTTP_FORWARDED_FOR')?:getenv('HTTP_FORWARDED')?:getenv('REMOTE_ADDR')).PHP_EOL);
        fwrite($f,$msg.PHP_EOL);
        fwrite($f,"----------------------------------------------------------------------------------".PHP_EOL);
        fclose($f);
    }

    function getConnCashFree(){
        return mysqli_connect(HOSTCFPG,USERCFPG,PASSCFPG,DBNAMECFPG);
    }

    function getConnRazorPay(){
        return mysqli_connect(HOSTRZPG,USERRZPG,PASSRZPG,DBNAMERZPG);
    }
    
    function getConn(){
        return mysqli_connect(HOST,USER,PASS,DBNAME);
    }

    function getConnFin(){
        return mysqli_connect(FINHOST,FINUSER,FINPASS,FINDBNAME);
    }

    function closeConn($dbconn){
        mysqli_close($dbconn);
    }

    function getConnZenFX(){
        $connection_string = "host=".ZENFXHOST." port=".ZENFXPORT." dbname=".ZENFXDATABASE." user=".ZENFXUSER." password=".ZENFXPASS." ";
        return pg_connect($connection_string);
    }
    function getSelectZENFX($dbconn,$sql){
        $this->writeLog("ZENFX query".$sql);
        return pg_query($dbconn, $sql);
    }

    function getSelect($dbconn, $sql){
        $this->writeLog($sql);
        return mysqli_query($dbconn, $sql);
    }
    function closeConnZENFX($dbconn){
        pg_close($dbconn);
    }

    function batchQueries($dbconn, $sql){
        $this->writeLog($sql);
        return mysqli_multi_query($dbconn, $sql);
    }

    function validateSession($session){
        if(isset($_SESSION["sessionId"]) ){
            $ok = true;
            
            if( (date("His") - $_SESSION["sesschecktime"])>200 ){
                $sql = " update user_session set s_lutime = now() where s_sid = '".$_SESSION["sessionId"]."' and s_active = 1;";
                $dbconn = $this->getConn();
                $result = $this->batchQueries($dbconn,$sql);
                $sql=" select s_active ,case when s_dbg=1 then 'Y' else 'N' end from user_session where s_sid = '".$_SESSION["sessionId"]."' ; ";
                $result = $this->getSelect($dbconn,$sql);
                if(mysqli_num_rows($result)>0){
                    $row = mysqli_fetch_row($result);
                    if($row[0]==0){
                        $ok = false;
                    }else{
                        $_SESSION["debug"] = $row[1];
                        $_SESSION["sesschecktime"] = date("His");
                    }
                }else{
                    $ok = false;
                }
                $this->closeConn($dbconn);
            }    
            
            if($_SESSION["sessionId"] == $session and $ok ){
                $i=0;
                foreach($_POST as $key => $value){
                    $_POST[$key] = str_replace('^^and^^','&',$_POST[$key]);
                    $_POST[$key] = str_replace('^^hash^^','#',$_POST[$key]);
                    $_POST[$key] = str_replace('^^plus^^','+',$_POST[$key]);
                    $_POST[$key] = str_replace('^^mod^^','%',$_POST[$key]);
                    $_POST[$key] = str_replace('^^equal^^','=',$_POST[$key]);
                    $r = strtoupper($_POST[$key]);
                    if(strpos($r,' ALTER ')==true or strpos($r,' DROP ')==true or strpos($r,' TRUNCATE ') ==true or strpos($r,' DELETE ') ==true or strpos($r,' UPDATE ') ==true ){
                        $i=1;
                        if(strpos($r,' UPDATE ') != false){
                            $_POST[$key] = str_replace('update','up date',$_POST[$key]);
                            $i=0;
                        } 
                        
                        if(strpos($r,' ALTER ')!= false){
                            $_POST[$key] = str_replace('alter','alte r',$_POST[$key]);
                            $i=0;
                        }
                        
                        if(strpos($r,' DROP ')!= false){
                            $_POST[$key] = str_replace('drop','d rop',$_POST[$key]);
                            $i=0;
                        }
                        if(strpos($r,' TRUNCATE ') != false){
                            $_POST[$key] = str_replace('truncate','trun cate',$_POST[$key]);
                            $i=0;
                        }
                        if(strpos($r,' DELETE ') != false){
                            $_POST[$key] = str_replace('delete','d elete',$_POST[$key]);
                            $i=0;
                        }
                    }
                }
                if($i==0){
                    return true;
                }else{
                    return false;
                }                
            }else{
                return false;
            }   
        }else{
            return false;
        }        
    }

    function validatePostRequest(){
        $flag = true;
        foreach($_POST as $key => $value){
            $_POST[$key] = str_replace('^^and^^','&',$_POST[$key]);
            $_POST[$key] = str_replace('^^hash^^','#',$_POST[$key]);
            $_POST[$key] = str_replace('^^plus^^','+',$_POST[$key]);
            $_POST[$key] = str_replace('^^mod^^','%',$_POST[$key]);
            $value = strtoupper($value);
            if(
                strpos(strtoupper($value),' DROP ') 
                || strpos(strtoupper($value),' ALTER ') 
                || strpos(strtoupper($value),' UPDATE ') 
                || strpos(strtoupper($value),' TRUNCATE ') 
                || strpos(strtoupper($value),' DELETE ') 

            ){
                $flag = false;
            } 
        }
        return $flag;
    }

    function encryptString($str){
        return openssl_encrypt($str, CIPHERING,ENCRYPTION_KEY, OPTIONS, ENCRYPTION_IV);
    }

    function decryptString($str){
        return openssl_decrypt ($str, CIPHERING,ENCRYPTION_KEY, OPTIONS, ENCRYPTION_IV);
    } 

    function getRandomString($n) { 
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'; 
        $randomString = ''; 
      
        for ($i = 0; $i < $n; $i++) { 
            $index = rand(0, strlen($characters) - 1); 
            $randomString .= $characters[$index]; 
        } 
      
        return $randomString; 
    }

    function calcTcs($purpose, $educationLoan, $earlierForex, $thisForex)
    {
        $tcsRate = 20;
        $tcsThershold = 1000000;
        $tcs = 0;
        $extraForex = 0;
        $tcsTaxable = 0;
        if ($earlierForex + $thisForex > $tcsThershold) {
            // MEDICAL TREATMENT ABROAD(6) S111  OVERSEAS EDUCATION - S108 OVERSEAS EDUCATION(3) GIC S109
            if ($purpose == 6 or $purpose == 3) {
                if ($educationLoan == "Y") {
                    $tcsRate = 0;
                } else {
                    $tcsRate = 5;
                }
            }
            $extraForex = $earlierForex + $thisForex - $tcsThershold;
            if ($extraForex <= $thisForex) {
                $tcsTaxable = $extraForex;
            } else {
                $tcsTaxable = $thisForex;
            }
            $tcs = round($tcsTaxable * $tcsRate / 100, 2);

        }
        return $tcs;
    }

    function sendEmail($name,$mail,$subject,$msg){
        require_once('mail_c.php');
        $m = new Mymail();
        $msent = $m->sendMail($subject, $msg, $mail, '', '', $name);
        $this->writeLog("dbio".$msent);
        // $msent = true;
        if ($msent) {
            $this->status = 'sent';
            $this->data = array("msg" => "OTP has been sent to " . $mail . " ");
        } else {
            $this->data = array("msg" => "OTP has been reset. But unable to sent email. Please contact to administrator.");
        }
    }
    public function nimbusOtp($otp, $mobile)
    {
        $varUserName = 't1zenithapi';
        $varPWD = '59740235';
        $varSenderID = 'ZFOREX';
        $varPhNo = $mobile;
        $varEntityID = "1201159557369846030";
        $varTemplateId = "1107163187788214955";
        $varMSG = "Greeting%20from%20Zenithforex.%20Your%20one%20time%20password%20is%20" . $otp;
        $url = "http://nimbusit.co.in/api/swsendSingle.asp";
        $data = "username=" . $varUserName . "&password=" . $varPWD . "&sender=" . $varSenderID . "&sendto=" . $varPhNo;
        $data = $data . "&entityID=" . $varEntityID . "&templateID=" . $varTemplateId . "&message=" . $varMSG;
        return $this->postData($url, $data);
    }
    function postData($url, $data)
    {
        //The function uses CURL for posting data to
        $objURL = curl_init($url);
        curl_setopt(
            $objURL,
            CURLOPT_RETURNTRANSFER,
            1
        );
        curl_setopt($objURL, CURLOPT_POST, 1);
        curl_setopt($objURL, CURLOPT_POSTFIELDS, $data);
        $retval = trim(curl_exec($objURL));
        curl_close($objURL);
        return $retval;
    }
    public function RemoveSuchThat($qry){
        $qry = str_replace("%2F","/",$qry);
        return $qry;
    }
    function encryptData($plainText) {
        $encryptionKey = SECRET_KEY;
        $iv = SECRET_IV; 
        $cipher = "AES-256-CBC";
        $encrypted = openssl_encrypt($plainText, $cipher, $encryptionKey, 0, $iv);
        return base64_encode($encrypted);
    }

    function decryptData($encryptedText) {
        $encryptionKey = SECRET_KEY; // Same 32-char key
        $iv = SECRET_IV; // Same 16-char IV
        $cipher = "AES-256-CBC";
        $decrypted = openssl_decrypt(base64_decode($encryptedText), $cipher, $encryptionKey, 0, $iv);
        return $this->RemoveSuchThat($decrypted);
    }


}

?>