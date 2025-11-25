<?php

    class AsegoDetail {


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


        private function genSession(){
            $permitted_chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            $this->session = substr(str_shuffle($permitted_chars), 0, 20);
            $_SESSION["sessionId"] = $this->session;
            $_SESSION["userSrno"] = $this->srno;
            $_SESSION["userId"] = $this->id;
            $_SESSION["entitytype"] = $this->entitytype;
            $_SESSION["finyear"] = $this->finyear;       
            //$_SESSION["entitybranchallowed"] = $this->entitybranchallowed;
        }


        private function insertSessionLog($dbio,$appname){
        
            $sql = "UPDATE user_session SET s_active = 0 ,s_edate = DATE_FORMAT(NOW(),'%Y-%m-%d'),s_etime=now() where s_active = 1 AND s_uid = '".$this->id."';
            insert INTO user_session(s_usrno, s_uid, s_sid, s_sdate, s_stime, s_active, s_edate, s_etime, s_ip, s_lutime, s_dbg, s_appname)
            SELECT (SELECT COALESCE( MAX(s_usrno),0)+1 FROM user_session) AS srno,'".$this->id."' as id, '".$this->session."' as session, DATE_FORMAT(NOW(),'%Y-%m-%d') as sdate, NOW() AS nasdfsad,
             1 AS active, null as etime, null as edate, '".(getenv('HTTP_CLIENT_IP')?:getenv('HTTP_X_FORWARDED_FOR')?:getenv('HTTP_X_FORWARDED')?:getenv('HTTP_FORWARDED_FOR')?:getenv('HTTP_FORWARDED')?:getenv('REMOTE_ADDR'))."' as ip, now() as ltime, null as ads, null as appname;"; 
            $dbconn = $dbio->getConn();
            $result = $dbio->batchQueries($dbconn,$sql);
            $dbio->closeConn($dbconn);
        }


        private function insertIntoLeadOrder($dbio, $srno, $premium, $location, $depDate, $inusrancesrno){
            $randomid = date("ymdhis");
            $gst = $premium * 0.18;
            $roundAmt = round($premium)*1;
            $roundfig = 0;
            $sql = "UPDATE lead_order SET po_status = '5' WHERE po_status = 'D' AND po_usersrno = ".$srno.";
                    INSERT INTO lead_order (po_srno, po_ordertype, po_productcount, po_product, po_product_2, po_currency, po_card_currency, po_quantity, po_card_quantity, 
                    po_buyrate, po_card_buyrate, po_totalamt, po_handlingcharge, po_nostrocharge, po_taxableval, po_CGST, po_SGST, po_IGST, po_sumamount, po_round, po_roundAmt,
                    po_date, po_order_no, po_refno, po_status, po_nofpassenger, po_nofcurrency, po_travelpurpose, po_country, po_traveldate, po_usersrno, po_paymenttype, 
                    po_location, po_isplaced, po_paymentgateway, po_promocode, po_ispaid)
                    SELECT (SELECT MAX(po_srno) FROM lead_order) +1, 'insurance', 0, '', '', '', '', 0, 0, 0, 0, ".$premium.", 0, 0, 0, ".$gst.", ".$gst.", ".$gst.", ".$premium.",
                    '".$roundfig."', ".$roundAmt.",
                    now(), CONCAT('".$randomid."', '/', ".$srno."), CONCAT('ZFX/', (SELECT COALESCE( MAX(po_srno),0)+1 FROM lead_order)), 'D', 0, 0, '', 0, '".$depDate."', 
                    ".$srno.", 'FP', ".$location.", 0, 'P', '', 0";
            $dbconn = $dbio->getConn();
            $result = $dbio->batchQueries($dbconn, $sql);
            $dbio->closeConn($dbconn);

            $query = "UPDATE asego_leads SET al_orderno = CONCAT('".$randomid."', '/', ".$srno.") WHERE al_srno = ".$inusrancesrno."";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $query);
            $dbio->closeConn($dbconn);
            return $randomid.'/'.$srno;
        }


        private function createNewUser($dbio, $row, $encrypt_pass){
            return "DELETE FROM user_login WHERE (user_mobile='".$row[7]."' OR user_email='".$row[6]."') AND user_mobotpstatus = '0';
                    insert into user_login (user_srno, user_id, user_pass, user_mobile, user_email, user_name, mobile_otp, user_active, user_enable, user_entitycode, 
                    user_entitytype, user_login_chng_pass, user_passchngdate, email_otp, user_mobotpstatus, user_emailotpstatus, user_registerdate,user_invalide_attempt)
                    SELECT (SELECT COALESCE( MAX(user_srno),0)+1 FROM user_login) AS srno
                    , UPPER(TRIM('".$row[6]."')) AS id, '".$encrypt_pass."' AS passwrd,TRIM('".$row[7]."') AS mobile, UPPER(TRIM('".$row[6]."')) AS mail, UPPER('".$row[5]."') AS myname,'1'
                    AS phoneotp, 1 as active, 1 as enable, 1 as entitycode, 'U' as entitytype, 1 as passchng, null as date, '1' as mailotp, '1' as mobile_status, '1' as email_status, now(),0;"; 
        }


        public function getCategory($dbio){
            $catlist = array();
            $sql = "SELECT ac_catcode, ac_catdesc FROM asego_category";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            if($result){
                while($row = mysqli_fetch_assoc($result)){
                    $catlist[] = $row;
                }
            }
            return $catlist;
            $dbio->closeConn($dbconn);
        }

        private function getRiders($plancode){
            return "SELECT pr_plancode, pr_ridercode, pr_chargepercent, rm_ridername FROM asego_planriderlink
                    LEFT OUTER JOIN asego_ridermaster ON pr_ridercode = rm_ridercode
                    WHERE pr_plancode = '".$plancode."'";
        }

        private function getPremiumDetails($row, $plancode){
            $sql = "SELECT  pc_plancode,COALESCE(ap_planname,'')AS ap_planname, ap_catcode, ac_catdesc, pc_daylimit, pc_agelimit, pc_premium,ap_countrycode FROM asego_premiumchart 
                    LEFT OUTER JOIN
                    (SELECT ap_plancode, ap_planname, ap_catcode, ac_catcode, ac_catdesc,ap_countrycode FROM asego_plan
                    LEFT OUTER JOIN asego_category ON ap_catcode = ac_catcode  WHERE ac_catcode = '".$row[1]."') AS t ON pc_plancode = ap_plancode
                    WHERE pc_daylimit >=".$row[9]." AND pc_agelimit >=".$row[11]." AND ap_planname !='' AND ap_countrycode=".$row[12]." ";
            if($plancode =="0"){
                $sql = $sql."";
            }else {
                $sql = $sql." and ap_plancode = '".$plancode."' ";
            }
            $sql = $sql." group by ap_plancode ORDER BY pc_agelimit, pc_daylimit ;";
            return $sql;
        }
        

        public function sendOtp($dbio, $obj){
            date_default_timezone_set('Asia/Kolkata');
            $curtime = date('d-m-Y H:i:s');
            $mobOtp = random_int(100000, 999999);
            $mailOtp = random_int(100000, 999999);
            $otpResult = $this->nimbusOtp($mobOtp, $obj->mobile);

            $sql = "SELECT * FROM user_login WHERE user_mobile = '".$obj->mobile."' OR user_email = '".$obj->email."'";
            $dbconn = $dbio->getConn();
            $result1 = $dbio->getSelect($dbconn, $sql);
            if(mysqli_num_rows($result1)==0){
                $this->isexist = "N";
            }else {
                $this->isexist = "Y";
            }
            $qry = "INSERT INTO asego_leads (al_srno, al_name, al_email, al_mobile, al_categorycode, al_plancode, al_ridercode, al_nofdays, al_age, al_gst, 
                    al_riderpercent, al_premium, al_timestamp, al_mobotp, al_emailotp, al_emailotpstatus, al_mobotpstatus, al_depdate, al_arrivaldate, al_dob, al_basecharge,al_countrycode)
                    SELECT (SELECT COALESCE(MAX(al_srno), 0) FROM asego_leads) +1, '".$obj->name."', '".$obj->email."', '".$obj->mobile."', '".$obj->categorycode."', '',
                    '', ".$obj->numOfDay.", ".$obj->personAge.", 0, 0, null, NOW(), '".$mobOtp."', '".$mailOtp."', 'P', 'P', '".$obj->depDate."', '".$obj->arrDate."', '".$obj->dob."'
                    , null, ".$obj->region." ";
                    $res = $dbio->getSelect($dbconn, $qry);
            if($res){
                $ml = "<html>";
                $ml = $ml."<body>";
                $ml = $ml."Dear ".$obj->name." <br>
                    Otp to verify your email id is <b>".$mailOtp."</b><br>                    
                    <b>Thanks & Regards <br> Administrator </b>";
                $ml = $ml."</body>";
                $ml = $ml."</html>";
                require_once('mail_c.php');         
                $m = new Mymail();
                $msent = $m->sendMail('OTP Verification '.$curtime.'',$ml,$obj->email,'','','');
                $msent = true;
                if($msent){
                    $this->data = array("msg"=>"1");
                    $q = "SELECT MAX(al_srno) FROM asego_leads";
                    $result3 = $dbio->getSelect($dbconn, $q);
                    if(mysqli_num_rows($result3)>0){
                        $row = mysqli_fetch_row($result3);
                        $this->srno = $row[0];
                    }
                }else{
                    $this->data = array("msg"=>"Please contact to administrator.");
                }
            }
            $dbio->closeConn($dbconn);
        }


        public function getPlans($dbio, $srno){
            $planlist = array();
            $sql = "select al_srno, al_categorycode, al_plancode, al_depdate, al_arrivaldate, al_name, al_email, al_mobile,
            al_ridercode, al_nofdays, al_dob, al_age, al_countrycode FROM asego_leads where al_srno = ".$srno."";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            if(mysqli_num_rows($result)>0){
                $row = mysqli_fetch_row($result);
                $query = $this->getPremiumDetails($row, "0");
                $result2 = $dbio->getSelect($dbconn, $query);
                if(mysqli_num_rows($result2)>0){
                    while($row1 = mysqli_fetch_assoc($result2)){
                        $planlist[] = $row1;
                    }
                }
            }
            $dbio->closeConn($dbconn);
            return $planlist;
        }


        public function verifyPhoneMailOtp($dbio, $obj){
            $encrypt_pass = 'fORZQCurdB0=';
            $sql = "SELECT al_mobotp, al_emailotp, al_emailotpstatus, al_mobotpstatus, al_srno, al_name, al_email, al_mobile, al_premium, al_depdate FROM asego_leads WHERE al_srno = ".$obj->srno."";
            $dbconn = $dbio->getConn();
            $result4 = $dbio->getSelect($dbconn, $sql);
            $row = mysqli_fetch_row($result4);
            if($row[0] == $obj->mobotp and $row[1] == $obj->emailotp){
                $qry = "UPDATE asego_leads SET al_mobotpstatus = '1', al_emailotpstatus='1' WHERE al_srno = ".$obj->srno."";
                $result = $dbio->getSelect($dbconn,$qry);
                $this->otpstatus = 'A';

                if($obj->sid == "undefined" || $obj->sid == null){
                    if($obj->isexist == "Y"){
                        $sql = "SELECT user_srno, user_id, user_name, user_mobile, user_email, user_entitytype FROM user_login WHERE user_mobile = '".$row[7]."' OR user_email = '".$row[6]."'";
                        $res = $dbio->getSelect($dbconn, $sql);
                        $row2 = mysqli_fetch_row($res);
                        $this->id = $row2[1];
                        $this->name = $row2[2];
                        $this->srno = $row2[0];
                        $_SESSION["sesschecktime"] = date("His");
                        $_SESSION["debug"] = 'N';
                        $this->entitytype = $row2[5];
                        $this->finyear = "2223";
                        $this->status = "MSG0000";
                        $this->active = '1';
                        // $this->changePass= $row[7];
                        $this->genSession();
                        $this->insertSessionLog($dbio, "ZENFOREX");   
                        $lead_order = $this->insertIntoLeadOrder($dbio, $row2[0], 0, $obj->location, $row[9], $obj->srno);
                    }else {
                        $sql = $this->createNewUser($dbio, $row, $encrypt_pass);
                        $dbcon = $dbio->getConn();
                        $result = $dbio->batchQueries($dbcon, $sql);
                        $dbio->closeConn($dbcon);

                        $qry = "SELECT MAX(user_srno) FROM user_login";
                        $res = $dbio->getSelect($dbconn, $qry);
                        $row3 = mysqli_fetch_row($res);
                        if($result){
                            $this->srno = $row3[0];
                            $this->id = $row[6];
                            $_SESSION["sesschecktime"] = date("His");
                            $_SESSION["debug"] = 'N';
                            $this->entitytype = 'U';
                            $this->name = $row[5];
                            $this->finyear = "2223";
                            $this->active = "1";
                            //$this->entitybranchallowed = NULL;
                            $this->genSession();
                            $this->insertSessionLog($dbio, null);
                            $lead_order = $this->insertIntoLeadOrder($dbio, $row3[0], 0, $obj->location, $row[9], $obj->srno);
                        }
                    }
                }else {
                    $this->msg = "AL";
                    $lead_order = $this->insertIntoLeadOrder($dbio, $_SESSION["userSrno"], 0, $obj->location, $row[9], $obj->srno);
                }
                $this->orderno = $lead_order;
            }else if($row[0] == $obj->mobotp and $row[1] != $obj->emailotp){
                $this->otpstatus = 'E';
            }else if($row[0] != $obj->mobotp and $row[1] == $obj->emailotp){
                $this->otpstatus = 'M';
            }else {
                $this->otpstatus = 'N';
            }
            $dbio->closeConn($dbconn);
        }   


        public function getRiderDetails($dbio, $plancode, $srno){
            $sql = "select al_srno, al_categorycode, al_plancode, al_depdate, al_arrivaldate, al_name, al_email, al_mobile,
                al_ridercode, al_nofdays, al_dob, al_age, al_countrycode, al_orderno FROM asego_leads where al_srno = ".$srno."";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            if(mysqli_num_rows($result)>0){
                $row =mysqli_fetch_row($result);
                $this->age = $row[11];
                $this->daylimit = $row[9];
                $this->orderno = $row[13];
                $this->msg = 1;
                $q = $this->getRiders($plancode);
                $result2 = $dbio->getSelect($dbconn, $q);
                if(mysqli_num_rows($result2)>0){
                    $this->ridermsg = 1;
                    while($r = mysqli_fetch_assoc($result2)){
                        $this->riders[] = $r;
                    }
                }else {
                    $this->ridermsg = 0;
                }

                $query = $this->getPremiumDetails($row, $plancode);
                $res = $dbio->getSelect($dbconn, $query);
                if(mysqli_num_rows($res)>0){
                    $premiumrow = mysqli_fetch_row($res);
                    $gst = $premiumrow[6]* 0.18;
                    $qry = "update asego_leads set al_plancode = '".$plancode."', al_premium = ".$premiumrow[6].", al_basecharge = ".$premiumrow[6].", al_gst = ".$gst." where al_srno = ".$srno."";
                    $result1 = $dbio->getSelect($dbconn, $qry);
                    $this->plancode = $premiumrow[0];
                    $this->planname = $premiumrow[1];
                    $this->categoryname = $premiumrow[3];
                    $this->premium = $premiumrow[6];
                }
            }else {
                $this->msg = 0;
            }
            $dbio->closeConn($dbconn);
        }


        public function getRiderPercents($dbio, $ridercode){
            $sql = "SELECT pr_ridercode, pr_chargepercent FROM asego_planriderlink WHERE pr_ridercode = '".$ridercode."'";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            if($result){
                $row = mysqli_fetch_row($result);
                $this->percent = $row[1];
            }
            $dbio->closeConn($dbconn);
        }

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

        private function getPolicyData($orderno, $row, $riderlist, $dbio){
            $decoded_riderlist = json_decode(json_encode($riderlist));
            $string = "<policy><identity><sign>".ENCRYPTIONKEY."</sign><branchsign>e13b630d-e6dc-4bb0-99fa-f6d9c9c40dd8</branchsign>
            <username>Np_ZENITHFIT</username><reference>".$orderno."</reference></identity><plan><categorycode>".$row[3]."</categorycode>
            <plancode>".$row[4]."</plancode><basecharges>".$row[12]."</basecharges>";
            if(count($riderlist)>0){
                // $string = $string."<riders>";
                // foreach ($decoded_riderlist as $rider){
                //     $string = $string."<ridercode percent='".$rider->arl_riderpercent."'>String</ridercode>";
                // }
                //$string = $string."</riders>";
                $string = $string."";
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
            $encr = $this->encryptAES($string, ENCRYPTIONKEY);
            $data = base64_encode($encr);
            $postData = array("Data"=>$data, "Ref"=>REFKEY);
            $url = "https://asegotravel.in/trawelltag/v2/CreatePolicy.aspx";
            $response = $this->callApiPost($url, $postData);
            $envelope = new DOMDocument();
            $envelope->loadXML($response);
            $filename = $envelope->getElementsByTagName('document')[0]->nodeValue;
            $ext = pathinfo($filename, PATHINFO_EXTENSION);
            $file_content = file_get_contents(str_replace(' ', '', $filename));
            $dbio->writeLog("^^^^^^^^".$file_content."^^^^^^^^^");
            $fp = fopen(UPLOADDOCSPATH.'ASEGO_'.str_replace('/', '_', $orderno).$dbio->getRandomString(5).'.'.$ext, "w+");
            if(fwrite($fp, $file_content)){
                $this->uploadmsg = 1;
            }else {
                $this->uploadmsg = 0;
            }
            fclose($fp);
        }

        public function insertRiders($dbio, $obj, $selectedRider){
            $ridercount = count($selectedRider);
            $sql_del = "DELETE FROM asego_rider_leads WHERE arl_orderno = '".$obj->orderno."'";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql_del);
            $dbio->closeConn($dbconn);
            if($ridercount > 0){
                for ($i=0; $i < $ridercount; $i++) { 
                    $query = "INSERT INTO asego_rider_leads (arl_srno, arl_nofriders, arl_orderno, arl_plancode, arl_ridercode, arl_riderpercent, arl_totalpremium, arl_timestamp)
                              SELECT (SELECT COALESCE(MAX(arl_srno), 0) FROM asego_rider_leads)+1, ".$ridercount.", '".$obj->orderno."', (SELECT al_plancode FROM asego_leads WHERE al_orderno = '".$obj->orderno."')
                              , '".$selectedRider[$i]."', (SELECT pr_chargepercent FROM asego_planriderlink WHERE pr_ridercode = '".$selectedRider[$i]."'), ".$obj->premium.", now()";
                    $dbconn = $dbio->getConn();                    
                    $result = $dbio->getSelect($dbconn, $query);
                    $dbio->closeConn($dbconn);
                }
            }
            $qry = "UPDATE asego_leads SET al_premium = ".$obj->premium." WHERE al_orderno = '".$obj->orderno."'";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $qry);

            $sql = "SELECT al_name, al_email, al_mobile, al_premium, al_orderno FROM asego_leads WHERE al_orderno = '".$obj->orderno."'";
            $result = $dbio->getSelect($dbconn, $sql);
            if(mysqli_num_rows($result)>0){
                $row = mysqli_fetch_row($result);
                $this->msg = 1;
                $this->name = $row[0];
                $this->email = $row[1];
                $this->mobile = $row[2];
                $this->premium = $row[3];
                $this->orderno = $row[4];
            }else {
                $this->msg = 0;
            }            
            $dbio->closeConn($dbconn);
        }

        public function getOrderHistory($dbio, $orderno){
            $sql = "SELECT al_name, al_email, ac_catdesc, ap_planname, al_depdate, al_arrivaldate, al_nofdays, al_gst, al_basecharge, al_premium, al_amtrecieved, al_orderno FROM asego_leads 
                    LEFT OUTER JOIN asego_category ON al_categorycode = ac_catcode
                    LEFT OUTER JOIN asego_plan ON al_plancode = ap_plancode
                    WHERE al_orderno = '".$orderno."' ";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            if(mysqli_num_rows($result)>0){
                $row = mysqli_fetch_row($result);
                $this->name = $row[0];
                $this->email = $row[1];
                $this->category = $row[2];
                $this->planname = $row[3];
                $this->depdate = $row[4];
                $this->arrivaldate = $row[5];
                $this->nofdays = $row[6];
                $this->gst = $row[7];
                $this->basecharge = $row[8];
                $this->totalpremium = $row[9];
                $this->amountpaid = $row[10];
                $this->orderno = $row[11];
            }

            $qry = "SELECT arl_riderpercent, rm_ridername FROM asego_rider_leads 
                    LEFT OUTER JOIN asego_ridermaster ON arl_ridercode = rm_ridercode
                    WHERE arl_orderno = '".$orderno."'";
            $res = $dbio->getSelect($dbconn, $qry);
            if(mysqli_num_rows($res)>0){
                while($row = mysqli_fetch_assoc($res)){
                    $this->riderlist[] = $row;
                }
            }else {
                $this->riderlist = array();
            }
            $dbio->closeConn($dbconn);
        }


        public function downloadDocument($dbio){
            $doc_desc="Terms_Condition_For_Asego";
            $doc_ext="pdf";
            $doc_filename="asego-terms-condition.pdf";
            if (file_exists(ASEGOTERMSFILE.$doc_filename)) {
                header('Content-Description: File Transfer');
                header('Content-Type: application/octet-stream');
                header('Content-Disposition: attachment; filename='.basename($doc_filename));
                header('Content-Transfer-Encoding: binary');
                header('Expires: 0');
                header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
                header('Pragma: public');
                header('Content-Length: '.filesize(ASEGOTERMSFILE.$doc_filename));
                ob_clean();
                flush();
                readfile(ASEGOTERMSFILE.$doc_filename);
                exit;
            }
        }


    }




?>