<?php
class User
{
    public $status;
    public $data = array();


    private function genSession()
    {
        $permitted_chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $this->session = substr(str_shuffle($permitted_chars), 0, 20);
        $_SESSION["sessionId"] = $this->session;
        $_SESSION["userSrno"] = $this->srno;
        $_SESSION["userId"] = $this->id;
        $_SESSION["entitytype"] = $this->entitytype;
        $_SESSION["finyear"] = $this->finyear;
        $_SESSION["entitybranchallowed"] = $this->entitybranchallowed;
        $_SESSION["userEmpsrno"] = $this->empSrno;
        $_SESSION["userHRsrno"] = $this->hrSrno;
        $_SESSION["isEmailVisible"] = $this->isEmailVisible;
        $_SESSION["isRequestPaymentLink"] = $this->isRequestPaymentLink;
        
    }


    function postdata($url, $data)
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


    private function insertSessionLog($dbio, $appname)
    {

        $sql = "UPDATE user_session SET s_active = 0 ,s_edate = DATE_FORMAT(NOW(),'%Y-%m-%d'),s_etime=now() where s_active = 1 AND s_uid = '" . $this->id . "';
        insert INTO user_session(s_usrno, s_uid, s_sid, s_sdate, s_stime, s_active, s_edate, s_etime, s_ip, s_lutime, s_dbg, s_appname)
        SELECT (SELECT COALESCE( MAX(s_usrno),0)+1 FROM user_session) AS srno,'" . $this->id . "' as id, '" . $this->session . "' as session, DATE_FORMAT(NOW(),'%Y-%m-%d') as sdate, NOW() AS nasdfsad,
         1 AS active, null as etime, null as edate, '" . (getenv('HTTP_CLIENT_IP') ?: getenv('HTTP_X_FORWARDED_FOR') ?: getenv('HTTP_X_FORWARDED') ?: getenv('HTTP_FORWARDED_FOR') ?: getenv('HTTP_FORWARDED') ?: getenv('REMOTE_ADDR')) . "' as ip, now() as ltime, null as ads, null as appname;";
        $dbconn = $dbio->getConn();
        $result = $dbio->batchQueries($dbconn, $sql);
        $dbio->closeConn($dbconn);
        // $query = "select s_active from user_session where s_sid='".$this->session."';";
        // $dbconn = $dbio->getConn();
        // $res = $dbio->getSelect($dbconn, $query);
        // if(mysqli_num_rows($res)>0){
        //     $row = mysqli_fetch_row($res);
        //     $this->active = $row[0];
        // }
        // $dbio->closeConn($dbconn);
    }


    ///////////////////////////////CHECK USER IF EXIST /////////////////  


    public function checkUserIfExist($dbio, $obj)
    {
        $sql = "SELECT * FROM user_login WHERE user_email = '" . $obj->email . "' OR user_mobile = '" . $obj->phone . "'";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if (mysqli_num_rows($result) > 0) {
            $this->status = 'L';
        } else {
            $this->status = 'R';
        }
    }


    //////////////////////////////   LOGIN   /////////////////

    public function validateLogin($dbio, $username, $password, $appname)
    {
        if (strlen($password) > 0 and strlen($username) > 0) {
            $sql = "SELECT user_srno, user_id, user_name, user_entitytype, user_pass, user_active, user_enable, user_login_chng_pass
                    , (SELECT GROUP_CONCAT(mu_branchcd) AS br FROM master_user_branch_link WHERE mu_usersrno = user_srno) AS um_branchallowed, COALESCE(entity_type,'') AS entity_type, user_empsrno
                    , coalesce(user_hrsrno,0) as user_hrsrno,DATEDIFF(CURDATE(), user_passchngdate) AS lastChangePassDays,user_invalide_attempt ,entity_ismailvisible ,entity_isrequestpaymentlinkvisible
                    FROM user_login 
                    LEFT OUTER JOIN master_entity ON user_corpsrno = entity_id
                    WHERE UPPER(user_id) =UPPER(TRIM('" . $username . "'))
                    AND user_mobotpstatus='1';";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            $dbio->closeConn($dbconn);
            if (mysqli_num_rows($result) > 0) {
                $row = mysqli_fetch_row($result);
                if ($row[4] == $dbio->encryptString($password)) { //correct password
                    if ($row[5] != 1 || (int) $row[13] >= 5) { //user inactive and invalid attempts more than 5 times.
                        $this->status = "MSG0003";
                    } elseif ($row[6] != 1) { //user disable
                        $this->status = "MSG0004";
                    } elseif (($row[3] == 'B' || $row[3] == 'E' || $row[3] == 'BC' || $row[3] == 'C') && (((int) $row[12]) > 60)) {
                        $this->status = "MSG0005";
                    } else {
                        $this->id = $username;
                        $this->name = $row[2];
                        $this->srno = $row[0];
                        $_SESSION["sesschecktime"] = date("His");
                        $_SESSION["debug"] = 'N';
                        $this->entitytype = $row[3];
                        $this->finyear = FINYEAR;
                        $this->status = "MSG0000";
                        $this->active = '1';
                        $this->changePass = $row[7];
                        $this->entitybranchallowed = $row[8];
                        $this->corptype = $row[9];
                        $this->empSrno = $row[10];
                        $this->hrSrno = $row[11];
                        $this->isEmailVisible = $row[14];
                        $this->isRequestPaymentLink = $row[15];
                        
                        $this->genSession();
                        $this->insertSessionLog($dbio, $appname);
                    }
                } else { // invalid password
                    if ((int) $row[13] < 5) {//update invalide user column in the user_login table
                        $sql = " UPDATE user_login SET user_invalide_attempt=user_invalide_attempt+1 WHERE UPPER(user_id) =UPPER(TRIM('" . $username . "')) AND user_mobotpstatus='1'; ";
                        $dbconn = $dbio->getConn();
                        $result = $dbio->getSelect($dbconn, $sql);
                        $dbio->closeConn($dbconn);
                    }else if (((int) $row[5] == 1) && ((int) $row[13] > 5)){//if wrong pass greater than 5 times than user should be invalid  
                        $sql = " UPDATE user_login SET user_active=0 WHERE UPPER(user_id) =UPPER(TRIM('" . $username . "')) AND user_mobotpstatus='1'; ";
                        $dbconn = $dbio->getConn();
                        $result = $dbio->getSelect($dbconn, $sql);
                        $dbio->closeConn($dbconn);
                    }
                    $this->status = "MSG0001";
                }
            } else { // user does not exists
                $this->status = "MSG0002";
            }
        }
    }

    //////////////////////   REGISTER USER  ////////////////////

    public function register($dbio, $mobile, $name, $email, $password, $conf_pass, $appname)
    {
        if (strlen($password) > 0 and strlen($name) > 0 and strlen($mobile) > 0 and strlen($email) > 0 and strlen($conf_pass) > 0) {

            $mailOtp = random_int(100000, 999999);
            $query = "select user_mobotpstatus, user_emailotpstatus FROM user_login WHERE user_email='" . $email . "' OR user_mobile = '" . $mobile . "';";
            $dbcon = $dbio->getConn();
            $res = $dbio->getSelect($dbcon, $query);
            $dbio->closeConn($dbcon);
            $row = mysqli_fetch_row($res);
            if ((mysqli_num_rows($res) == 0) || ($row[0] == 0 && $row[1] == 0)) {
                if ($password == $conf_pass) {
                    $OTP = random_int(100000, 999999);
                    $otpResult = $this->nimbusOtp($OTP, $mobile);
                    $encrypt_pass = $dbio->encryptString($password);
                    $sql = "DELETE FROM user_login WHERE (user_mobile='" . $mobile . "' OR user_email='" . $email . "') AND user_mobotpstatus = '0';
                            INSERT into user_login (user_srno, user_id, user_pass, user_mobile, user_email, user_name, mobile_otp , user_active, user_enable, user_entitycode, 
                            user_entitytype, user_login_chng_pass, user_passchngdate, email_otp, user_mobotpstatus, user_emailotpstatus, user_registerdate,user_empsrno, user_corpsrno,user_invalide_attempt)
                            SELECT (SELECT COALESCE( MAX(user_srno),0)+1 FROM user_login) AS srno
                            , UPPER(TRIM('" . $email . "')) AS myname, '" . $encrypt_pass . "' AS passwrd,TRIM('" . $mobile . "') AS mobile, UPPER(TRIM('" . $email . "')) AS mail, UPPER('" . $name . "') AS myname,'" . $OTP . "'
                                AS phoneotp, 1 as active, 1 as enable, 1 as entitycode, 'U' as entitytype, 0 as passchng, null as date, '" . $mailOtp . "' as mailotp, '0' as mobile_status, '0' as email_status, now(),
                                0,0,0;";
                    $dbconn = $dbio->getConn();
                    $result = $dbio->batchQueries($dbconn, $sql);
                    $dbio->closeConn($dbconn);
                    $ml = "<html>";
                    $ml = $ml . "<body>";
                    $ml = $ml . "Dear " . $name . "<br> Your OTP for Login is <b>" . $mailOtp . " <br> Thanks & Regards <br> Administrator </b>";
                    $ml = $ml . "</body>";
                    $ml = $ml . "</html>";
                    require_once('mail_c.php');
                    $m = new Mymail();
                    $msent = $m->sendMail('Login OTP', $ml, $email, '', '', $name);
                    $msent = true;
                    if ($msent) {
                        $this->data = array("msg" => "OTP has been sent to " . $email . " ");
                    } else {
                        $this->data = array("msg" => "OTP has been reset. But enable to sent email. Please contact to administrator.");
                    }

                    $this->status = "MSG0000";

                } else {  //password not matched
                    $this->status = "MSG0002";
                }
            } else {
                $this->status = '0';
            }
        } else {  //
            $this->status("MSG0001");
        }

    }


    public function checkPhoneOtp($dbio, $otp, $mobile)
    {
        $sql = "SELECT mobile_otp FROM user_login WHERE user_mobile = TRIM('" . $mobile . "') AND user_active = 1";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if (mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_row($result);
            if ($row[0] == $otp) {
                $query = "UPDATE user_login SET user_mobotpstatus = '1' WHERE user_mobile = TRIM('" . $mobile . "') AND user_active = 1";
                $res = $dbio->getSelect($dbconn, $query);
                $this->status = '1'; //mobile otp verified!
            } else {
                $q = "UPDATE user_login SET user_mobotpstatus = '0' WHERE user_mobile = TRIM('" . $mobile . "') AND user_active = 1";
                $r = $dbio->getSelect($dbconn, $q);
                $this->status = '0';
            }
        }
        $dbio->closeConn($dbconn);
    }


    public function checkEmailOtp($dbio, $emailotp, $email)
    {
        $sql = "SELECT email_otp FROM user_login WHERE UPPER(user_email) = UPPER(TRIM('" . $email . "')) AND user_active = 1";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if (mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_row($result);
            if ($row[0] == $emailotp) {
                $query = "UPDATE user_login SET user_emailotpstatus = '1' WHERE UPPER(user_email) = UPPER(TRIM('" . $email . "')) AND user_active = 1";
                $res = $dbio->getSelect($dbconn, $query);
                $this->status = '1'; //email otp verified!
            } else {
                $q = "UPDATE user_login SET user_emailotpstatus = '0' WHERE UPPER(user_email) = UPPER(TRIM('" . $email . "')) AND user_active = 1";
                $r = $dbio->getSelect($dbconn, $q);
                $this->status = '0';
            }
        }
        $dbio->closeConn($dbconn);
    }


    public function verifyOtp($dbio, $mobile, $email)
    {

        $query = "SELECT user_srno, user_id, user_entitytype, user_name, user_mobotpstatus, user_emailotpstatus FROM user_login 
                       WHERE user_mobile='" . $mobile . "' AND UPPER(user_email) = UPPER(TRIM('" . $email . "')) AND user_active = 1 AND user_mobotpstatus = '1';";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $query);
        $dbio->closeConn($dbconn);
        $row = mysqli_fetch_row($result);
        if ($row[4] == 1) { // && $row[5]==1
            $this->status = "MSG0000";
            $this->srno = $row[0];
            $this->id = $row[1];
            $_SESSION["sesschecktime"] = date("His");
            $_SESSION["debug"] = 'N';
            $this->entitytype = $row[2];
            $this->name = $row[3];
            $this->finyear = FINYEAR;
            $this->active = "1";
            $this->entitybranchallowed = NULL;
            $this->empSrno = null;
            $this->hrSrno = null;
            $this->isEmailVisible = null;
            $this->isRequestPaymentLink = null;
            
            
            $this->genSession();
            $this->insertSessionLog($dbio, null);
        } else {
            $this->status = "phone0"; //phone and email otp not verfied
        }
    }


    /////////////////////   FORGOT PASSWORD   //////////
    private function genPassword()
    {
        $permitted_chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return substr(str_shuffle($permitted_chars), 0, 20);
    }


    public function resetPass($dbio, $email)
    {
        $newPass = $this->genPassword();
        $sql = "UPDATE user_login SET user_passchngdate=CURDATE(), user_login_chng_pass='1',user_active=1, user_pass ='" . $dbio->encryptString($newPass) . "',
                user_invalide_attempt=0 WHERE UPPER(user_email) = UPPER(TRIM('" . $email . "'))
                AND user_mobotpstatus='1';";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if (mysqli_affected_rows($dbconn) > 0) {
            $query = "SELECT user_login_chng_pass, user_name, user_id FROM user_login WHERE UPPER(user_email) = UPPER(TRIM('" . $email . "')) AND user_mobotpstatus='1';";
            $res = $dbio->getSelect($dbconn, $query);

            $row = mysqli_fetch_row($res);
            $this->login_chng_pass = $row[0];
            $this->status = "verified";
            $ml = "<html>";
            $ml = $ml . "<body>";
            $ml = $ml . "Dear " . $row[1] . "<br><br> New password for your login is <b>" . $newPass . "</b> <br>
                    User ID: <b>" . $row[2] . " </b>  <br>
                    Link: https://www.zenithforexonline.com/login <br><br> <b>Thanks & Regards <br> Administrator </b>";
            $ml = $ml . "</body>";
            $ml = $ml . "</html>";
            require_once('mail_c.php');
            $m = new Mymail();
            $msent = $m->sendMail('Password Reset', $ml, $email, '', '', $row[2]);
            //$msent = $m->sendMail('Password Reset',$ml,"himanshu.tomar@zenithgodigital.com",'','',$row[2]);
            // $msent = true;
            if ($msent) {
                $this->data = array("msg" => "Password has been sent to " . $email . " ");
            } else {
                $this->data = array("msg" => "Password has been reset. But enable to sent email. Please contact to administrator.");
            }
        } else {
            $this->status = "NotVerified";
            $this->data = array("msg" => "Please check email id. Infomation provided is not correct.");

        }
        $dbio->closeConn($dbconn);
        return $this->data;
    }


    public function changePass($dbio, $oldPass, $newPass, $rnewPass, $id)
    {
        $isok = true;
        $dbconn = $dbio->getConn();
        $sql = "SELECT user_pass, user_id,user_entitytype FROM user_login WHERE user_id='" . $id . "' and user_login_chng_pass = '1' AND user_mobotpstatus='1'";
        $result = $dbio->getSelect($dbconn, $sql);
        if ($result) {
            $row = mysqli_fetch_row($result);
            if ($row[0] != $dbio->encryptString($oldPass)) {
                $this->status = "MSG0003";//Old Password entered is incorrect!
                $isok = false;
            }
        } else {
            $this->status = "Please contact to Addministration";
            $isok = false;
        }
        #cehck mail pass and Request pass 

        #check newpass and confirm pass
        if ($isok && $newPass != $rnewPass) {
            $this->status = "MSG0002";
            $isok = false;
        }
        #check newpass match with last 5 pass 
        if ($isok && ($row[2] == 'B' || $row[2] == 'E' || $row[2] == 'BC' || $row[2] == 'C')) {
            $sql = " select count(*) from (select um_pass from user_pass_history where um_srno = " . $_SESSION["userSrno"] . " 
                    order by um_stime desc limit 5 ) as t where um_pass = '" . $dbio->encryptString($newPass) . "' ;";
            $res = $dbio->getSelect($dbconn, $sql);

            if ($res) {
                $row = mysqli_fetch_row($res);
                if ($row[0] > 0) {
                    $this->status = "Password should not be match with last five password";
                    $isok = false;
                }
            } else {
                $this->status = "Please contact to Addministration";
                $isok = false;
            }
        }

        if ($isok) {
            $query = "UPDATE user_login SET user_pass='" . $dbio->encryptString($newPass) . "', user_login_chng_pass='0',user_active=1 WHERE user_id = '" . $id . "' AND user_mobotpstatus = '1' ;";
            //query to insert in the user_pass_history
            $query .= "INSERT INTO user_pass_history (um_stime,um_srno,um_id,um_pass) values (now()," . $_SESSION["userSrno"] . ",'" . $id . "','" . $dbio->encryptString($newPass) . "' ) ;";
            // $dbconn = $dbio->getConn();
            $res = $dbio->batchQueries($dbconn, $query);
            if ($res) {
                $this->status = "MSG0000";
            } else {
                $this->status = "Please contact to Addministration";
            }
        }
        $dbio->closeConn($dbconn);
    }

    // public function checkNewPassMatchWithLastFIvePass($dbio, $dbconn, $newPass)
    // {

    // }

    ////////////////////////  LOGIN WITH OTP   ///////////////////
    public function checkMobileNumber($dbio, $mobile)
    {
        $sql = "SELECT user_mobile FROM user_login WHERE user_mobile = '" . $mobile . "' AND user_mobotpstatus = '1'";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        $dbio->closeConn($dbconn);
        $otp = random_int(100000, 999999);
        $otpResult = $this->nimbusOtp($otp, $mobile);

        if (mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_row($result);
            if ($row[0] == $mobile) {
                $query = "UPDATE login_with_otp SET o_status = 'E', o_success = '0' where o_status = 'P' AND o_mobile = '" . $mobile . "';
                        insert into login_with_otp (o_mobile, o_otp, o_timestamp, o_status, o_success) values ('" . $mobile . "', '" . $otp . "', now(), 'P', '-');";
                $dbconn = $dbio->getConn();
                $res = $dbio->batchQueries($dbconn, $query);
                $dbio->closeConn($dbconn);
                $this->otptime = date("ymdhis", $_SERVER["REQUEST_TIME"]);

                $this->status = "valid";

            } else {
                $this->status = "Invalid Number";
            }
        } else {
            $this->status = "notexist";
        }
    }



    public function checkLoginOtp($dbio, $otp, $mobile)
    {
        $sql = "select o_otp from login_with_otp where o_mobile = '" . $mobile . "' and o_status = 'P';";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);

        if (mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_row($result);
            if ($row[0] == $otp) {
                $query1 = "SELECT user_srno, user_id, user_name, user_entitytype, user_pass, user_active, user_enable, user_login_chng_pass 
                        , (SELECT GROUP_CONCAT(mu_branchcd) AS br FROM master_user_branch_link WHERE mu_usersrno = user_srno) AS um_branchallowed, COALESCE(entity_type,'') AS entity_type
                        FROM user_login 
                        LEFT OUTER JOIN master_entity ON user_corpsrno = entity_id
                        WHERE user_mobile ='" . $mobile . "'
                        AND user_mobotpstatus='1';";
                $res = $dbio->getSelect($dbconn, $query1);
                $r = mysqli_fetch_row($res);
                $this->status = "1";
                $this->data = array("id" => $r[1], "pass" => $dbio->decryptString($r[4]));
                $query3 = "update login_with_otp set o_status = 'E', o_success = '1' where o_otp = '" . $row[0] . "' and o_mobile = '" . $mobile . "'";
                $result3 = $dbio->getSelect($dbconn, $query3);

            } else {
                $q = "update login_with_otp set o_status = 'E', o_success = '0' where o_otp = '" . $row[0] . "' and o_mobile = '" . $mobile . "'";
                $result = $dbio->getSelect($dbconn, $q);
                $this->status = "0";
            }
        }
        $dbio->closeConn($dbconn);
    }


    public function checkOtpTime($dbio, $num)
    {
        $sql = "UPDATE login_with_otp SET o_status = 'E', o_success = '0' WHERE o_status = 'P' AND o_mobile = '" . $num . "'";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        $dbio->closeConn($dbconn);
        $this->status = "OTP Time Limit Exceeded!";
    }


    ////////////////////////////   LOGOUT   /////////

    public function validateSignout($dbio)
    {
        if (isset($_SESSION["sessionId"])) {
            $sql = "update user_session set s_active=0, s_edate=now(), s_etime=now() where s_active ='1' and s_sid ='" . $_SESSION["sessionId"] . "' and s_uid='" . $_SESSION["userId"] . "';";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            if ($result) {
                $this->msg = 1;
            }
            $dbio->closeConn($dbconn);
        }
        session_destroy();
    }


    public function getCurrentUser($dbio)
    {
        $sql = "SELECT user_name, user_id, user_mobile, user_email, user_entitytype, user_mobotpstatus, user_emailotpstatus FROM user_login WHERE user_id='" . $_SESSION["userId"] . "'";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        $dbio->closeConn($dbconn);
        if (mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_row($result);
            $this->name = $row[0];
            $this->id = $row[1];
            $this->mobile = $row[2];
            $this->email = $row[3];
            $this->entitytype = $row[4];
            $this->mobotpstatus = $row[5];
            $this->emailotpstatus = $row[6];
        }
    }


    public function verifyMail($dbio, $name)
    {
        $mailOtp = random_int(100000, 999999);
        $sql = "UPDATE user_login SET email_otp='" . $mailOtp . "' WHERE user_id='" . $_SESSION["userId"] . "'";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        $dbio->closeConn($dbconn);
        $ml = "<html>";
        $ml = $ml . "<body>";
        $ml = $ml . "Dear " . $name . "<br> Your OTP to verify your email is <b>" . $mailOtp . " <br> Thanks & Regards <br> Administrator </b>";
        $ml = $ml . "</body>";
        $ml = $ml . "</html>";
        require_once('mail_c.php');
        $m = new Mymail();
        $msent = $m->sendMail('OTP Verification', $ml, $_SESSION["userId"], '', '', $name);
        $msent = true;
        if ($msent) {
            $this->status = 'sent';
            $this->data = array("msg" => "OTP has been sent to " . $_SESSION["userId"] . " ");
        } else {
            $this->data = array("msg" => "OTP has been reset. But unable to sent email. Please contact to administrator.");
        }
    }


    public function verifyProfileEmailOtp($dbio, $otp)
    {
        $sql = "SELECT email_otp FROM user_login WHERE user_id = '" . $_SESSION["userId"] . "' AND user_active=1";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        $dbio->closeConn($dbconn);
        if (mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_row($result);
            if ($row[0] == $otp) {
                $query = "UPDATE user_login SET user_emailotpstatus=1 WHERE user_id = '" . $_SESSION["userId"] . "'";
                $dbconn = $dbio->getConn();
                $res = $dbio->getSelect($dbconn, $query);
                $dbio->closeConn($dbconn);
                $this->status = 'V';
            } else {
                $this->status = 'NV';
            }
        }
    }



    public function getBranchAllowed($dbio)
    {
        $branchallowed = array();
        $sql = "SELECT mu_branchcd AS value, ml_branch AS label FROM master_user_branch_link
                LEFT OUTER JOIN master_location ON ml_branchcd = mu_branchcd
                WHERE mu_usersrno = " . $_SESSION["userSrno"] . "
                ORDER BY mu_branchcd";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if (mysqli_num_rows($result) > 0) {
            while ($row = mysqli_fetch_assoc($result)) {
                $branchallowed[] = $row;
            }
        }
        return $branchallowed;
        $dbio->closeConn($dbconn);
    }


    public function getDDListJson($dbio)
    {
        $ddlist = array();
        $sql = "SELECT merl_empcode AS value, emp_name AS label FROM master_employee_reporting_link 
                LEFT OUTER JOIN master_employee ON merl_empcode = emp_srno
                WHERE merl_reportingto = (SELECT user_empsrno FROM user_login WHERE user_srno = " . $_SESSION["userSrno"] . ")";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if (mysqli_num_rows($result) > 0) {
            while ($row = mysqli_fetch_assoc($result)) {
                $ddlist[] = $row;
            }
        }
        return $ddlist;
        $dbio->closeConn($dbconn);
    }


}

?>