<?php
require_once('config.php');
    $userName="gV2dKf7PqXw49zBa1NLoYt6RUeJcM3";
    $password="W9mJpZL27FbXh8CyKE1vuTgRqo5nAD";
    $response=new Convera_response();    
    $response->TEMPPATH= "D:\\Zenith\\zenithforexonline.com\\temp\\";//modify according to the esx
    $response->DATABASE=ZENFXDATABASE;
    $response->HOST="localhost";
    $response->USER="postgres";
    $response->PASS="postgres";
    $response->PORT="5432";

    foreach ($_SERVER as $key => $value) {
        if (strpos($key, 'HTTP_') === 0) {
            $header = str_replace('_', '-', substr($key, 5));
            $header = ucwords(strtolower($header), '-');
        }
    }
    $rawData = file_get_contents("php://input");
    $response->convera_writeLog("raw data".$rawData);
    $data = $response->xmlToJson($rawData);
    if($data['userName']===$userName && $data['password']===$password){
       echo json_encode($response->saveWebBookResult($data));
    }else{
       $response->convera_writeLog("USER ID :".$data['userName']." and PASSWORD ".$data['password']."is not matching;");
       echo json_encode("USER ID :".$data['userName']." and PASSWORD ".$data['password']." is not CORRECT.") ;
    }
//save Webbook result
Class Convera_response{
    public function saveWebBookResult($obj){
        // $connection_string = "host=localhost port=5432 dbname=ZENFX2526 user=postgres password=postgres ";
        $connection_string = "host=".$this->HOST." port=".$this->PORT." dbname=".$this->DATABASE." user=".$this->USER." password=".$this->PASS." ";
        $isok=true;
        $msg="Message save succesfully";
        $dbconn = pg_connect($connection_string);
        if($isok && count($obj)>0){
            $sql = "INSERT INTO convera_webpack (cw_externalReferenceID,cw_processorReferenceID,cw_processorInitiatedReferenceID,
                cw_invoiceNumber,cw_transactionStatus,cw_paymentType,cw_reportingDate,cw_statusDate,cw_response_string) SELECT 
                '".$this->safeValue($obj['externalReferenceID'])."','".$this->safeValue($obj['processorReferenceID'])."','".$this->safeValue($obj['processorInitiatedReferenceID'])."',
                '".$this->safeValue($obj['invoiceNumber'])."','".$this->safeValue($obj['transactionStatus'])."','".$this->safeValue($obj['paymentType'])."','".$this->safeValue($obj['reportingDate'])."',
                '".$this->safeValue($obj['statusDate'])."','".$this->safeValue($obj)."';";
            $result = $this->getSelect($dbconn, $sql);
            if(!$result){
                $isok=false;
                $msg="Something went wrong Please Contact to the Administration";
            }
        }
        if($isok && count($obj)>0){
            $sql = "UPDATE convera_header set  ch_status= '".$this->safeValue($obj['transactionStatus'])."',
                    ch_last_status_updated_date='".$this->safeValue($obj['statusDate'])."',
                    ch_payment_ref_no='".$this->safeValue($obj['supplementalReferenceID'])."'
                    WHERE ch_externalrefno='".$this->safeValue($obj['externalReferenceID'])."';";
            $result = $this->getSelect($dbconn, $sql);
            if(!$result){
                $isok=false;
                $msg="Something went wrong Please Contact to the Administration";
            }
        }
        pg_close($dbconn);      
        return ['status'=>$isok,'$msg'=>$msg];    
    }
    function safeValue($value) {
        if (is_array($value)) {
            return json_encode($value);
        }
        return $value;
    }
    function getSelect($dbconn,$sql){
        $this->convera_writeLog($sql);
        return pg_query($dbconn, $sql);
    }
    function convera_writeLog($msg){
        $f = fopen($this-> TEMPPATH."Convera_".date("Ymd").'.txt',"a");
        fwrite($f,"----------------------------------------------------------------------------------".PHP_EOL);
        fwrite($f,date("Ymd h:i:s a").PHP_EOL);
        fwrite($f,(getenv('HTTP_CLIENT_IP')?:getenv('HTTP_X_FORWARDED_FOR')?:getenv('HTTP_X_FORWARDED')?:getenv('HTTP_FORWARDED_FOR')?:getenv('HTTP_FORWARDED')?:getenv('REMOTE_ADDR')).PHP_EOL);
        fwrite($f,$msg.PHP_EOL);
        fwrite($f,"----------------------------------------------------------------------------------".PHP_EOL);
        fclose($f);
    }
    function xmlToJson($xmlString) {
        $xml = simplexml_load_string($xmlString, "SimpleXMLElement", LIBXML_NOCDATA);
            if ($xml === false) {
                $this->convera_writeLog("Invalid XML");
                return "";
            }
        $json = json_encode($xml);
        $array = json_decode($json, true); // convert JSON to array
        return $array; 
    }
}



?>