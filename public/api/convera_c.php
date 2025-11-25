<?php
require_once("dbio_c.php");

class Convera {

    public function getInstituteListByCountry($dbio,$requestData){
        $payload = $this->formatRequestPayloadForGetClientAPI($requestData->countryCode,$requestData->srch);
        $url = CONVERASRC.'/clientSearch';
        $dbio->writeLog($url);
        // $dbio->writeLog(CONVERAUSERNAME);
        // $dbio->writeLog(CONVERAPASSWORD);
        // $dbio->writeLog(CONVERAUSERNAME . ":" . CONVERAPASSWORD);
        $response = $this->callApiPost($url, $payload);
        $formatedResp = $this->formatedResponseForGetClientAPI($response);
        return $formatedResp;
    }

    public function getServiceListByClientId($dbio,$obj) {
        $payload='<?xml version="1.0" encoding="UTF-8"?>
                <clientServicesRequest xmlns="http://api.globalpay.convera.com">
                    <clientId>'.($obj->id).'</clientId>
                </clientServicesRequest>';
        $url = CONVERASRC.'/clientServices';
        $response = $this->callApiPost($url, $payload);
        $formatedResp = $this->getFormattedServiceItems($response);
        return $formatedResp;
    }

    public function formatRequestPayloadForGetClientAPI($countryCode, $clientName = '') {
        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<clientSearchRequest xmlns="http://api.globalpay.convera.com">';
        $xml .= '<countryCode>' . htmlspecialchars($countryCode) . '</countryCode>';
        // $xml .= '<clientName>'.($clientName ? $clientName : '').'</clientName>';
        $xml .= '</clientSearchRequest>';
        return $xml;
    }

    private function formatedResponseForGetClientAPI($xmlString) {
        $xml = simplexml_load_string($xmlString, "SimpleXMLElement", LIBXML_NOCDATA);
        $json = json_encode($xml);
        $array = json_decode($json, true);
        $clients = [];
        if (isset($array['clients']['client'])) {
            $clientList = $array['clients']['client'];
            if (isset($clientList['id'])) {
                $clientList = [$clientList];
            }
            foreach ($clientList as $client) {
                $clients[] = [
                    'value' => ($client['id'] ?? '').'^'.($client['name'] ?? '').'^'.($client['defaultSettlementCurrencyCode'] ?? '').'^'.($client['defaultLanguage'] ?? ''),
                    'label' => ($client['name'] ?? '')
                ];
                // $clients[] = [
                //     'id'       => $client['id'] ?? null,
                //     'name'     => $client['name'] ?? null,
                //     'country'  => $client['defaultSettlementCurrencyCode'] ?? null,
                //     'language' => $client['defaultLanguage'] ?? null
                // ];
            }
        }
        $dbio = new Dbio();
        $dbio->writeLog(json_encode($clients));
        return $clients;
    }

    private function getFormattedServiceItems($xmlString) {
        // Try to parse the XML string
        $xml = simplexml_load_string($xmlString);
        if (!$xml) return [];

        // Convert to JSON and then to PHP array
        $arrayData = json_decode(json_encode($xml), true);

        $items = [];

        // Check if debtorGroup and serviceItems exist
        if (!empty($arrayData['debtorGroups']['debtorGroup']['serviceItem'])) {
            $serviceItems = $arrayData['debtorGroups']['debtorGroup']['serviceItem'];

            // Make sure it's always an array
            if (isset($serviceItems['id'])) {
                $serviceItems = [$serviceItems];
            }

            // Loop through each service item and extract required fields
            foreach ($serviceItems as $item) {
                $items[] = [
                    'id'          => $item['id'] ?? null,
                    'name'        => $item['name'] ?? null,
                    'description' => $item['description'] ?? null,
                    'mandatory'   => $item['mandatory'] ?? null,
                    'amountOwing' => $item['amountOwing'] ?? null,
                    'editable'    => $item['editable'] ?? null
                ];
            }
         }

        return $items;
    }

    private function parseBuyerFieldsResponse($xmlString) {
        // Load the XML string into a SimpleXMLElement
        $xml = simplexml_load_string($xmlString, "SimpleXMLElement", LIBXML_NOCDATA);
        if (!$xml) return ['success' => false, 'errors' => ['Invalid XML format.']];

        // Check success status
        $status = $xml->status;
        $isSuccess = ((string)$status['success']) === 'true';

        if (!$isSuccess) {
            // Handle error messages if needed (not shown in this case)
            return ['success' => false, 'errors' => ['Request failed']];
        }

        // Prepare the formatted fields array
        $fields = [];
        foreach ($xml->fields->field as $field) {
            $fields[] = [
                'labelText' => (string)$field->labelText,
                'name' => (string)$field->name,
                'display' => (string)$field->display === 'true',
                'mandatory' => (string)$field->mandatory === 'true',
                'description' => (string)$field->description,
                'type' => (string)$field->type,
                'minLength' => isset($field->minLength) ? (int)$field->minLength : null,
                'maxLength' => isset($field->maxLength) ? (int)$field->maxLength : null,
                'sequence' => isset($field->sequence) ? (int)$field->sequence : null,
                'validationExpression' => (string)$field->validationExpression,
            ];
        }

        return ['success' => true, 'fields' => $fields];
    }

    private function callApiPost($url, $postData) {
        $dbio = new Dbio();
        $dbio->writeLog('request' . PHP_EOL . $postData);

        $ch = curl_init(); 

        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 60,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => $postData,
            CURLOPT_HTTPHEADER => [
                "Content-Type: text/xml",
                "Accept: application/xml"
            ],
            CURLOPT_USERPWD => CONVERAUSERNAME . ":" . CONVERAPASSWORD,
            CURLOPT_SSL_VERIFYPEER => false
        ]);

        $response = curl_exec($ch);

        $dataq['content']      = $response;
        $dataq['err']          = curl_errno($ch);
        $dataq['errmsg']       = curl_error($ch);
        $dataq['result']       = curl_getinfo($ch);
        $dataq['http_status']  = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        curl_close($ch);

        $dbio->writeLog('response' . PHP_EOL . $response);

        return $response;
    }

    public function searchClient($requestData) {
        $payload = $this->formatRequestPayloadForGetClientAPI($requestData['countryCode'], $requestData['clientName']);
        $url = CONVERASRC.'/clientSearch';
        $response = $this->callApiPost($url, $payload);
        $formatedResp = $this->formatedResponseForGetClientAPI($response);
        echo json_encode($formatedResp);
    }



    public function searchBuyerDetailsByServiceId($id) {
        $payload='<buyerFieldsRequest xmlns="http://api.globalpay.convera.com">
                    <clientId>'.$id.'</clientId>
                  </buyerFieldsRequest>';
        $url = CONVERASRC.'/buyerFields';
        $response = $this->callApiPost($url, $payload);
        $formatedResp = $this->parseBuyerFieldsResponse($response);
        echo json_encode($formatedResp);
    }

    public function saveData($dbio,$obj){
        $isok=true;
        $msg="";
        $srno=0;
        $dbconn = $dbio->getConn();
        $respArray=array();
        $mOtp = random_int(100000, 999999);
        $eOtp = random_int(100000, 999999);
        $refno="";
        //validation 
        if($isok){
            $msg="PLEASE FILL ALL NECCESARY .<br>";
            if( $obj->firstName ==='' && $obj->lastName===''){
                $isok=false;
                $msg.="FIRST NAME. <br> LAST NAME. <br> ";
            }
            if( $obj->email ===''){
                $isok=false;
                $msg.="EMAIL. <br>";
            }
            // if( $obj->country ===''){
            //     $isok=false;
            //     $msg.="COUNTRY. <br>";
            // }
            // if( $obj->clientId ===''){
            //     $isok=false;
            //     $msg.="CLIENT. <br>";
            // }
            // if( $obj->studentId ===''){
            //     $isok=false;
            //     $msg.="STUDENT ID. <br>";
            // }
            if( $obj->mobile ===''){
                $isok=false;
                $msg.="MOBILE NO . <br>";
            }
            if($isok){
                $msg="";
            }
        }
        //get srno
        if($isok){
            $sql="SELECT COALESCE(MAX(ch_srno),0)+1 FROM convera_header;";
            $result = $dbio->getSelect($dbconn, $sql);
            if($result){
                $row = mysqli_fetch_row($result);
                $srno=$row[0];
            }else{
                $isok=false;
            }
        }
        #generate refnumber
        if($isok){
            $refno='ONN'.date("Ymdhis").'CON'.$srno;
            $dbio->writeLog("refno".$refno);
        }
        //insret in to header table
        if($isok && $srno>0){
            $sql="INSERT INTO convera_header (ch_srno,ch_first_name,ch_last_name,ch_address,ch_city,ch_state,
            ch_zipcode, ch_email, ch_country, ch_client_id,ch_amount,ch_student_id,ch_mbile,ch_mbile_otp,ch_email_otp,
            ch_timestamp,ch_client_name,ch_externalrefno) 
                SELECT ".$srno.",'". $obj->firstName."','". $obj->lastName."','". $obj->address."','". $obj->city."',
                '". $obj->state."','". $obj->zipcode."','".$obj->email."','".$obj->country."',
                '".$obj->clientId."',$obj->amount,'".$obj->studentId."','".$obj->mobile."','".$mOtp."','".$eOtp."',NOW(),
                '".$obj->clientName."','".$refno."' ; ";
            $result = $dbio->getSelect($dbconn, $sql);
            if(!$result){
                $msg="1 Something Went Wrong. Please Contact to the addministration. ";
                $isok=false;
            }
        }
        //send OTP //mobile OTP
        if($isok && $obj->mobile!=''){
            $motpResult = $dbio->nimbusOtp($mOtp, $obj->mobile);
            $dbio->writeLog(json_encode($motpResult));
            $dbio->writeLog(json_encode(strpos($motpResult, 'LogID=')));
            if(strpos($motpResult, 'LogID=') !== 0){
                $isok=false;
                $msg="Mobile OTP ERROR.";
            }else{
                $msg="OTP send Succesfully.";
            }
        }
        // send Email OTP
        if($isok && $obj->email!=""){
            $name=$obj->firstName.' '.$obj->lastName;
            $msg = "<html>";
            $msg = $msg . "<body>";
            $msg = $msg . "Dear " . $name. "<br> Your OTP to verify your email is <b>" . $eOtp . " <br> Thanks & Regards <br> Administrator </b>";
            $msg = $msg . "</body>";
            $msg = $msg . "</html>";
            $eOtpResult=$dbio->sendEmail($name,$obj->email,'OTP Verification',$msg);
            $dbio->writeLog("email otp".json_encode($eOtpResult));
            if($eOtpResult){
                $isok=false;
                $msg="Email OTP ERROR.";
            }
        }
        $dbio->closeConn($dbconn);      
        $respArray['srno']=$srno;
        $respArray['refno']=$refno;
        return array("status"=>$isok,"msg"=>$msg,"data"=>$respArray);    
    }

    public function updateService($dbio,$obj){
        $isok=true;
        $msg="";
        $dbconn = $dbio->getConn();
        if($isok){
            $sql=" UPDATE convera_header SET ch_country='".$obj->country."',ch_client_id='".$obj->clientId."',ch_client_name='".$obj->clientName."' 
                WHERE ch_srno=".$obj->srno." ; ";
            $result = $dbio->getSelect($dbconn, $sql);
            if(!$result){ 
                $msg=" Something Went Wrong. Please Contact to the addministration. ";
                $isok=false;
            }
        }
        //update services
        if($isok){
            $sql="";
            $line_no=1;
            foreach($obj->services as $service){
            $desc = is_array($service->description) ? implode(', ', $service->description) : $service->description;
                $sql.="INSERT INTO convera_service_details (csd_srno,csd_lineno, csd_serviceid, csd_service_name, csd_service_desc,csd_amount) 
                    SELECT ".$obj->srno.",".$line_no.",'".$service->id."','".$service->name."','".$desc."',".$service->amountOwing." ; ";
                $line_no=$line_no+1;    
            }
            if($sql!=""){
                $result = $dbio->batchQueries($dbconn, $sql);
                if(!$result){
                    $msg="2 Something Went Wrong. Please Contact to the addministration. ";
                    $isok=false;
                }
            }
        }
        if($isok){
            $this->sendDataToFX($dbio,$dbconn,$obj);
        }
        $dbio->closeConn($dbconn);      
        return array("status"=>$isok,"msg"=>$msg);    
    }

    public function verifyOTP($dbio,$obj){
        $isok=true;
        $msg="";
        $dbconn = $dbio->getConn();
        //insret in to header table
        $eOtp="";
        $mOtp="";
        if($isok && $obj->srno>0){
            $sql="SELECT ch_mbile_otp,ch_email_otp FROM convera_header WHERE ch_srno=".$obj->srno.";  ";
            $result = $dbio->getSelect($dbconn, $sql);
            if($result){
                if($row=mysqli_fetch_assoc($result)){
                    $dbio->writeLog(json_encode($row));
                    $eOtp=$row['ch_email_otp'];
                    $mOtp=$row['ch_mbile_otp'];
                }else{
                    $msg=" User Not Found not found. ";
                    $isok=false;
                }
            }else{
                $msg=" Something Went Wrong. Please Contact to the addministration. ";
                $isok=false;
            }
        }
        if($isok && $eOtp!='' && $mOtp!=''){
            if($eOtp===$obj->mobileOtp){
                $isok=false;
                $msg="MOBILE OTP Does not MATCH";
            }
            if($mOtp===$obj->emailOtp){
                $isok=false;
                $msg.="EMAIL OTP Does not MATCH";
            }
        }
        //send email to our team
        if($isok){
            $sql="SELECT CONCAT(ch_first_name,' ',ch_last_name)as ch_name,ch_email,ch_amount,ch_address,ch_city,ch_state,ch_zipcode,
                ch_student_id,ch_mbile FROM convera_header WHERE ch_srno=".$obj->srno.";  ";
            $result = $dbio->getSelect($dbconn, $sql);
            if($result){
                if($row=mysqli_fetch_assoc($result)){
                    $msg = "<html>";
                    $msg = $msg . "<body>";
                    $msg = $msg . "Query From CONVERA-zenithglobal.com.my :<br>
                                    <b>Name :</b> " . $row['ch_name'] . " <br>
                                    <b>Mobile Number :</b> " . $row['ch_mbile'] . " <br>
                                    <b>Email ID :</b> " . $row['ch_email'] . " <br>
                                    <b>Student ID :</b> " . $row['ch_student_id'] . " <br>
                                    <b>Amount :</b> " . $row['ch_email'] . " <br>
                                    <b>Address :</b> " . $row['ch_address'] . " <br>
                                    <b>City :</b> " . $row['ch_city'] . " <br>
                                    <b>State :</b> " . $row['ch_state'] . " <br>
                                    <b>Zipcode :</b> " . $row['ch_zipcode'] . " <br";
                    $msg = $msg .  " <br> Thanks & Regards </b>";
                    $msg = $msg . "</body>";
                    $msg = $msg . "</html>";
                    $senEmail=$dbio->sendEmail("",GROUPEMAILID,'CONVERA-ZENITHFOREXONLINE Enquiry',$msg);
                }else{
                    $msg=" User Not Found not found. ";
                    $isok=false;
                }
            }
            // else{
            //     $msg=" Something Went Wrong. Please Contact to the addministration. ";
            //     $isok=false;
            // }
        }
        $dbio->closeConn($dbconn);      
        return array("status"=>$isok,"msg"=>$msg);    
    }
    //send data to the zenfx
    public function sendDataToFX($dbio,$dbconn,$obj){
        $isok=true;
        $msg="";
        $forexonlineConveraData=[];
        $forexonlineConveraServiceData=[];

        //get data that we want to send to zenfx
        if($isok &&  $obj->srno>0){
            $sql=" SELECT ch_srno,ch_first_name,ch_last_name,ch_address,ch_city,ch_state,ch_timestamp,ch_client_name,
                ch_zipcode, ch_email, ch_country, ch_client_id,ch_amount,ch_student_id,ch_mbile,ch_externalrefno FROM convera_header WHERE ch_srno=".$obj->srno. ";";
            $serviSql=" SELECT csd_srno,csd_lineno, csd_serviceid, csd_service_name, csd_service_desc,csd_amount FROM convera_service_details
                WHERE csd_srno=".$obj->srno. ";";    
            $result = $dbio->getSelect($dbconn, $sql);
            $servresult = $dbio->getSelect($dbconn, $serviSql);
            if($result){
                $forexonlineConveraData= mysqli_fetch_assoc($result);
                while($row=mysqli_fetch_assoc($servresult)){
                    $forexonlineConveraServiceData[]= $row;
                }
            }else{
                $msg="1 Something Went Wrong. Please Contact to the addministration. ";
                $isok=false;
            }
        }
        //send header data
        $zenfxdbconn=$dbio->getConnZenFX();
        if($isok && count($forexonlineConveraData)>0){
            $sql="INSERT INTO convera_header (ch_srno,ch_first_name,ch_last_name,ch_address,ch_city,ch_state,
                ch_zipcode, ch_email, ch_country, ch_client_id,ch_amount,ch_student_id,ch_mbile,ch_location,ch_executive,ch_source,ch_timestamp,ch_client_name,ch_externalrefno) 
                SELECT ".$obj->srno.",'". $forexonlineConveraData['ch_first_name']."','". $forexonlineConveraData['ch_last_name']."','". $forexonlineConveraData['ch_address']."',
                '". $forexonlineConveraData['ch_city']."', '". $forexonlineConveraData['ch_state']."','". $forexonlineConveraData['ch_zipcode']."','".$forexonlineConveraData['ch_email']."',
                '".$forexonlineConveraData['ch_country']."','".$forexonlineConveraData['ch_client_id']."','".$forexonlineConveraData['ch_amount']."',
                '".$forexonlineConveraData['ch_student_id']."','".$forexonlineConveraData['ch_mbile']."',1001,0,'ONLINE',
                '".$forexonlineConveraData['ch_timestamp']."','".$forexonlineConveraData['ch_client_name']."','".$forexonlineConveraData['ch_externalrefno']."' ; ";
            $result=$dbio->getSelectZENFX($zenfxdbconn,$sql);
        }else{
            $msg="2 Something Went Wrong. Please Contact to the addministration. ";
            $dbio->writeLog("No data Found with given SRNO ".$obj->srno);
            $isok=false;
        }
        //send service data
        if($isok && count($forexonlineConveraServiceData)>0){
            $sql='';
            foreach($forexonlineConveraServiceData as $service){
                $sql.="INSERT INTO convera_service_details (csd_srno,csd_lineno, csd_serviceid, csd_service_name, csd_service_desc,csd_amount) 
                    SELECT ".$obj->srno.",'". $service['csd_lineno']."','". $service['csd_serviceid']."',
                    '". $service['csd_service_name']."', '". $service['csd_service_desc']."',
                    '". $service['csd_amount']."' ; ";
                }
                if($sql!=''){
                    $result=$dbio->getSelectZENFX($zenfxdbconn,$sql);
                }
            }else{
                $msg="2 Something Went Wrong. Please Contact to the addministration. ";
                $dbio->writeLog("No data Found with given SRNO ".$obj->srno);
                $isok=false;
            }
            $dbio->closeConnZENFX($zenfxdbconn);


    }
    
}
?> 