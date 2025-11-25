<?php

    class OfferLead {

        function postdata($url,$data){
            //The function uses CURL for posting data to
            $objURL = curl_init($url); curl_setopt($objURL,
            CURLOPT_RETURNTRANSFER,1);
            curl_setopt($objURL,CURLOPT_POST,1);
            curl_setopt($objURL, CURLOPT_POSTFIELDS,$data);
            $retval = trim(curl_exec($objURL));
            curl_close($objURL);
            return $retval;
        }
        
        public function nimbusOtp($otp, $mobile){
            $varUserName='t1zenithapi';
            $varPWD='59740235';
            $varSenderID='ZFOREX';
            $varPhNo=$mobile;
            $varEntityID="1201159557369846030";
            $varTemplateId="1107163187788214955";
            $varMSG="Greeting%20from%20Zenithforex.%20Your%20one%20time%20password%20is%20".$otp;
            $url="http://nimbusit.co.in/api/swsendSingle.asp";
            $data="username=".$varUserName."&password=".$varPWD."&sender=".$varSenderID."&sendto=".$varPhNo;
            $data = $data."&entityID=".$varEntityID."&templateID=".$varTemplateId."&message=".$varMSG;
            return $this->postData($url,$data);
        }

        public function sendOtp($dbio, $obj){
            $OTP = random_int(100000, 999999);
            $qry = "UPDATE master_offer_data SET mo_isverified = 'E' WHERE mo_phone = '".$obj->phone."' AND mo_isverified = '0';
                    INSERT INTO master_offer_data(mo_srno, mo_name, mo_email, mo_phone, mo_currency, mo_location, mo_timestamp, mo_service, mo_mobotp, mo_isverified)
                    SELECT(SELECT COALESCE(MAX(mo_srno), 0)+1 FROM master_offer_data) AS srno, '".$obj->name."', '".$obj->email."', '".$obj->phone."', '".$obj->currency."',
                    (SELECT ml_branch FROM master_location WHERE ml_branchcd = ".$obj->branch."), now(), '".$obj->service."', '".$OTP."', '0'";
            $dbconn = $dbio->getConn();
            $result = $dbio->batchQueries($dbconn, $qry);
            $dbio->closeConn($dbconn);
            $otpResult = $this->nimbusOtp($OTP, $obj->phone);
            if($otpResult){
                $this->msg = 1;
            }else {
                $this->msg = 0;
            }
        }

        
        private function sendSeparateMail($curtime, $ml, $email){
            require_once('mail_c.php');         
            $m = new Mymail();
            $msent = $m->sendMail('ZENITHFOREXONLINE.IN/OFFER Lead :'.$curtime.'',$ml,$email,'','','');
            $msent = true;
            return $msent;
        }


        public function verifyOtp($dbio, $obj){
            date_default_timezone_set('Asia/Kolkata');
            $curtime = date('d-m-Y H:i:s');
            $dbconn = $dbio->getConn();
            $qry = "SELECT mo_mobotp FROM master_offer_data WHERE mo_isverified = '0' AND mo_phone = trim('".$obj->phone."')";
            $res = $dbio->getSelect($dbconn, $qry);
            if(mysqli_num_rows($res)>0){
                $r = mysqli_fetch_row($res);
                if($r[0] == $obj->otp){
                    $qry = "UPDATE master_offer_data SET mo_isverified = 1 WHERE mo_isverified = '0' AND mo_phone = trim('".$obj->phone."')";
                    $resu = $dbio->getSelect($dbconn, $qry);
                    $sql = "SELECT ml_branch FROM master_location WHERE ml_branchcd = ".$obj->branch."";
                    $result = $dbio->getSelect($dbconn, $sql);
                    
                    if(mysqli_num_rows($result) > 0){
                        $row = mysqli_fetch_row($result);
                        $ml = "<html>";
                        $ml = $ml."<body>";
                        $ml = $ml."New Lead from zenithforexonline.in/offer <br>
                        User Name: ".$obj->name." <br> 
                        User Email: ".$obj->email." <br> 
                        User Phone: ".$obj->phone." <br> 
                        Currency: ".$obj->currency." <br>
                        Location: ".$row[0]." <br>
                        Service: ".$obj->service." <br>
                        <b>Thanks & Regards </b>";
                        $ml = $ml."</body>";
                        $ml = $ml."</html>";    

                        $monikaMail = "online.manager@zenithforex.com";
                        $karishmaMail = "onlinesales1@zenithforex.com";
                        $tarunMail = "onlinesalesho@zenithforex.com";
                        $msent = $this->sendSeparateMail($curtime, $ml, GROUPEMAILID);
                        // $msent = $this->sendSeparateMail($curtime, $ml, $karishmaMail);
                        // $msent = $this->sendSeparateMail($curtime, $ml, $tarunMail);
                        if($msent){
                            $this->data = array("msg"=>"1");
                        }else{
                            $this->data = array("msg"=>"Please contact to administrator.");
                        }
                    }
                }else {
                    $this->data = array("msg"=>"0");
                }
            }else {
                $this->data = array("msg"=>"0");
            }
            $dbio->closeConn($dbconn);
        }
    }
    
?>