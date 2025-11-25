<?php
class Remit
{


    public $msg;

    function calculateTcs($dbio, $panNumber, $totalAmt, $purpose, $educationLoan, $handlingCharge = 0, $gst = 0)
    {
        $dbconn = $dbio->getConn();
        $isok=true;
        $earlierForex = 0;
        //calculate earlier forex from zenithforexonline.com
        $earlierForexFromForexonline = 0;
        //po_status 14 mean order completed; 
        if($isok){
            $qry = "SELECT COALESCE(SUM(po_totalamt),0) FROM lead_order WHERE po_status IN (14) AND po_pan=UPPER('" . $panNumber . "');";
            $result = $dbio->getSelect($dbconn, $qry);
            $row = mysqli_fetch_row($result);
            if ($row[0]) {
                $earlierForexFromForexonline = $row[0];
            }
        }
        //calculate earlier forex from zenithremit.com
        $forexRemit = 0;
        if($isok && $panNumber != '' && $panNumber != null){
            $qry1 = "select coalesce(SUM(ROUND((req_quantity*req_sellrate) +coalesce(req_bankcharges,0) +coalesce(req_cgst,0) +coalesce(req_sgst,0) +coalesce(req_igst,0)+coalesce(req_nostrocharges,0) + coalesce(req_tcs,0),2)),0) AS req_forexinr 
                    from zenithadii.tran_requests AS t WHERE req_status = 1 AND req_pan = UPPER('" . $panNumber . "') 
                    and (req_bankfiletrandate >= '".FYFromDateYMD."' or req_bankfiletrandate is null );"; 
            $result1 = $dbio->getSelect($dbconn, $qry1);
            if($result1){
                $row = mysqli_fetch_row($result1);
                $forexRemit = $row[0]*1;
            }
        }
        $earlierForex=$earlierForexFromForexonline+$forexRemit;
        $dbconn = $dbio->getConn();
        return $dbio->calcTcs($purpose, $educationLoan, $earlierForex, ($totalAmt+$handlingCharge+$gst));
    }

    public function insertRemitDetails($dbio, $object)
    {
        $randomid = date("ymdhis");
        $type = $object->ordertype;
        $currency = $object->currency;
        $quantity = $object->quantity;
        $rate = $object->rate;
        $country = $object->country;
        $totalAmt = $object->totalAmt;
        $sid = $object->sid;
        $id = $object->id;
        $taxableVal = $object->taxableVal;
        $gst = $taxableVal * 0.18;
        if ($totalAmt < 1000000) {
            $nostroCharge = 1500;
        } else if ($totalAmt < 2000000) {
            $nostroCharge = 2000;
        } else {
            $nostroCharge = 3000;
        }
        $servicecharge = 100;
        $panNumber = $object->pan;
        $tcs = $this->calculateTcs($dbio, $panNumber, $totalAmt, 0, "",$servicecharge,$gst);
        $amountToPay = $nostroCharge + $gst + $servicecharge + $totalAmt + $tcs;
        $roundAmt = round($amountToPay);
        $roundFig = $roundAmt - $amountToPay;
        if ($sid != null) {
            $sql = "UPDATE lead_order SET po_status='E' WHERE po_status = 'D' AND po_usersrno = " . $_SESSION["userSrno"] . " ;
                INSERT INTO lead_order (po_srno, po_refno, po_ordertype, po_currency, po_quantity, po_buyrate, po_totalamt, po_date, po_roundAmt, po_order_no, po_CGST, po_SGST, 
                po_IGST, po_taxableval, po_status, po_country, po_usersrno, po_sumamount, po_round, po_location, po_promocode, po_nostrocharge, po_handlingcharge, po_product, po_manuallead, po_leadsource, po_pan,po_tcs)
                SELECT (SELECT COALESCE( MAX(po_srno),0)+1 FROM lead_order) AS srno, CONCAT('ZFX/', (SELECT COALESCE( MAX(po_srno),0)+1 FROM lead_order)),'" . $type . "', '" . $currency . "', '" . $quantity . "', '" . $rate . "', '" . $totalAmt . "', 
                now(), '" . $roundAmt . "', CONCAT('" . $randomid . "', '/', " . $_SESSION["userSrno"] . "), " . $gst . ", " . $gst . ", " . $gst . ", '" . $taxableVal . "', 
                'D', " . $country . ", " . $_SESSION["userSrno"] . ", " . $amountToPay . ", " . $roundFig . ", " . $object->loc . ", '" . $object->promo . "', " . $nostroCharge . ", " . $servicecharge . ", 'tt', 0, 2,UPPER('" . $panNumber . "')," . $tcs . ";";
            $dbconn = $dbio->getConn();
            $result = $dbio->batchQueries($dbconn, $sql);
            $dbio->closeConn($dbconn);

            $dbconn = $dbio->getConn();
            $query = "INSERT INTO lead_product (lp_srno, lp_orderno, lp_travellernum, lp_isd, lp_producttype, lp_quantity, lp_rateofexchange, lp_totalamt, lp_sumtotalamount, lp_timestamp)
                      SELECT (SELECT MAX(lp_srno) + 1 FROM lead_product), CONCAT('" . $randomid . "', '/', '" . $_SESSION["userSrno"] . "'),
                       '1', '" . $currency . "', 'TT', " . $quantity . ", " . $rate . ", " . $totalAmt . ",
                        " . $amountToPay . ", now()";
            $res = $dbio->getSelect($dbconn, $query);

            if ($result) {
                // $qry = "INSERT INTO lead_product(lp_srno, lp_orderno, lp_travellernum, lp_isd, lp_producttype, lp_quantity, lp_rateofexchange, lp_totalamt, lp_sumtotalamount, lp_timestamp, lp_pancard
                //         , lp_ibr, lp_settlementrate)
                //         SELECT (SELECT MAX(po_srno)+1 FROM lead_order) as srno, CONCAT('".$randomid."', '/', ".$_SESSION["userSrno"]."), '1', '".$currency."', 'TT', ".$quantity.", ".$rate.", '".$totalAmt."'
                //         , '".$roundAmt."', NOW(), '', 0, 0";
                // $dbconn = $dbio->getConn();
                // $result = $dbio->getSelect($dbconn, $qry);

                // $email = "himanshu.tomar@zenithforex.com";
                date_default_timezone_set('Asia/Kolkata');
                $curtime = date('d-m-Y H:i:s');
                $email = "online.manager@zenithforex.com";
                $query = "SELECT user_id, user_name, user_mobile FROM user_login WHERE user_id = '" . $id . "'";
                $result = $dbio->getSelect($dbconn, $query);
                $dbio->closeConn($dbconn);
                if ($result) {
                    $row = mysqli_fetch_row($result);
                    $ml = "<html>";
                    $ml = $ml . "<body>";
                    $ml = $ml . "New Lead from zenithforexonline.com <br>  
                        User Name: '" . $row[1] . "' <br>   
                        User Email: '" . $row[0] . "' <br> 
                        User Phone: '" . $row[2] . "' <br> 
                        Order Type: REMIT <br>
                        Currency: '" . $currency . "' <br>
                        Quantity: " . $quantity . " <br>
                        <b>Thanks & Regards <br> Administrator </b>";
                    $ml = $ml . "</body>";
                    $ml = $ml . "</html>";
                    require_once('mail_c.php');
                    $m = new Mymail();
                    $msent = $m->sendMail('ZENITHFOREXONLINE.COM Lead :' . $curtime . '', $ml, GROUPEMAILID, '', '', '');
                    $msent = true;
                    if ($msent) {
                        $this->data = array("msg" => "1", "orderno" => $randomid . '/' . $_SESSION["userSrno"]);
                    } else {
                        $this->data = array("msg" => "Please contact to administrator.");
                    }
                }
            }

        } else {
            $this->msg = "Session does not exist!";
        }
    }


    public function insertSenderDetails($dbio, $o, $orderno)
    {
        $senderName = $o->senderName;
        $senderEmail = $o->senderEmail;
        $senderMobile = $o->senderMobile;
        $purpose = $o->purpose;
        $senderID = $o->senderID;
        $idNum = $o->idNum;
        $placeOfIssue = $o->placeOfIssue;
        $expiryDate = $o->expiryDate;
        $userId = $o->userId;
        $sourceOfFund = $o->sourceOfFund; // this should be S or L.
        $itr = $o->itr; // this should be Y or N.

        $sql = "DELETE FROM remit_sender WHERE rs_orderno = '" . $orderno . "';
                INSERT INTO remit_sender (rs_orderno ,rs_name ,rs_email ,rs_mobile ,rs_purpose, rs_idtype, rs_idnum , rs_placeofissue,rs_expirydate, rs_timestamp,rs_source_of_fund,rs_itr)
                VALUES ('" . $orderno . "', '" . $senderName . "', '" . $senderEmail . "', '" . $senderMobile . "', '" . $purpose . "', '" . $senderID . "', 
                '" . $idNum . "', '" . $placeOfIssue . "', null, now(),'" . $sourceOfFund . "','" . $itr . "' );";

        $sql = $sql . "DELETE FROM lead_traveller WHERE lt_orderno = '" . $orderno . "';
                INSERT INTO lead_traveller (lt_orderno, lt_ordertype, lt_traveller, lt_title, lt_name, lt_mobile, lt_email, lt_pancard, lt_passport, lt_timestamp, lt_idtype, lt_idnum, lt_nationality,lt_source_of_fund,lt_itr)
                VALUES ('" . $orderno . "', 'remit', 1, '', '" . $senderName . "', '" . $senderMobile . "', '" . $senderEmail . "', '" . $idNum . "', '', NOW(), '" . $senderID . "', '" . $idNum . "', '','" . $sourceOfFund . "','" . $itr . "');";

        // update lead_order -> tcs,amount,
        $query = "SELECT po_pan,po_sumamount,po_tcs,po_totalamt,po_cgst,po_handlingcharge from lead_order where po_order_no = '" . $orderno . "';";
        $dbconn = $dbio->getConn();
        $result1 = $dbio->getSelect($dbconn, $query);
        $dbio->closeConn($dbconn);
        $row = mysqli_fetch_row($result1);
        $panNumber = $row[0];
        $sumAmount = $row[1];
        $prevTcs = $row[2];
        $currentForexAmount = $row[3];
        $gst = $row[4] ?? 0;
        $handlingCharge = $row[5] ?? 0;
        // if itr YES and SOURCEOFUND L than he it not aligible for tcs should be 0.5%
        $educationLoan = "N";
        if ($sourceOfFund == "L" && $itr == "Y") {
            $educationLoan = "Y";
        }
        $currTcs = $this->calculateTcs($dbio, $panNumber, $currentForexAmount, $purpose, $educationLoan,$handlingCharge,$gst);
        $sumAmount = $sumAmount + $currTcs - $prevTcs;
        $roundAmt = round($sumAmount);
        $roundFig = $roundAmt - $sumAmount;
        $sql = $sql . "update lead_order SET po_travelpurpose = " . $purpose . ", po_sumamount=" . $sumAmount . ",po_roundAmt=" . $roundAmt . ",
        po_round=" . $roundFig . ",po_tcs=" . $currTcs . " WHERE po_order_no = '" . $orderno . "';";
        $dbconn = $dbio->getConn();
        $result = $dbio->batchQueries($dbconn, $sql);
        $dbio->closeConn($dbconn);
        $this->tcs = $currTcs;
    }


    public function insertBeneficiaryDetails($dbio, $obj, $orderno)
    {
        $benName = $obj->benName;
        $benAdd = $obj->benAddress;
        $accNum = $obj->accNumber;
        $swiftCode = $obj->swiftCode;
        $benBankName = $obj->benBankName;
        $benBankAdd = $obj->benBankAdd;
        $benTransitNo = $obj->benTransitNo;
        $userId = $obj->userId;
        $sql = "DELETE FROM remit_beneficiary WHERE rb_orderno =  '" . $orderno . "';
                INSERT INTO remit_beneficiary(rb_orderno, rb_name, rb_swiftcode, rb_bankname , rb_bankaddr , rb_transitno ,rb_timestamp, rb_accountnumber,rb_address) 
                VALUES('" . $orderno . "', '" . $benName . "', '" . $swiftCode . "', '" . $benBankName . "', '" . $benBankAdd . "', '" . $benTransitNo . "', now(), '" . $accNum . "','" . $benAdd . "')";
        $dbconn = $dbio->getConn();
        $result = $dbio->batchQueries($dbconn, $sql);
        $dbio->closeConn($dbconn);

    }


    public function insertProcessDetails($dbio, $obj, $orderno)
    {
        $mode = $obj->mode;
        $nearestBranch = $obj->nearBranch;
        $nearestBranchAdd = $obj->nearBranchAdd;
        $bdate = $obj->date;
        $doorAdd = $obj->doorAdd;
        $doorPincode = $obj->doorPincode;
        $doorCity = $obj->doorCity;
        $doorCountry = $obj->doorCountry;
        $doorState = $obj->doorState;
        $userId = $obj->userId;
        if (date_format(date_create($bdate), "Ymd") >= date("Ymd")) {
            $sql = "DELETE FROM remit_process WHERE rp_orderno = '" . $orderno . "';
                    INSERT INTO remit_process (rp_orderno, rp_branch, rp_address, rp_doorstepAddress, rp_doorpin, rp_doorcity, rp_state, rp_country, rp_verificationdate, rp_timestamp, rp_mode)
                    VALUES ('" . $orderno . "', '" . $nearestBranch . "', 
                    '" . $nearestBranchAdd . "', '" . $doorAdd . "', '" . $doorPincode . "', '" . $doorCity . "', '" . $doorState . "', '" . $doorCountry . "', '" . $bdate . "', now(), '" . $mode . "')";
            $dbconn = $dbio->getConn();
            $result = $dbio->batchQueries($dbconn, $sql);
            $dbio->closeConn($dbconn);

            $q = "SELECT po_roundAmt FROM lead_order WHERE po_order_no = '" . $orderno . "'";
            $dbconn = $dbio->getConn();
            $res = $dbio->getSelect($dbconn, $q);
            $dbio->closeConn($dbconn);
            if (mysqli_num_rows($res) > 0) {
                $row = mysqli_fetch_row($res);
                $totalamt = $row[0];
                if ($obj->paymentMode == 'PP') {
                    $amountToPay = $row[0] * 0.02;
                } else {
                    $amountToPay = $row[0];
                }
            }


            $sql = "DELETE FROM master_account_details WHERE ac_orderno = '" . $orderno . "';
        INSERT INTO master_account_details (ac_srno, ac_paymentmode, ac_bankname, ac_bankaccnum, ac_isverified, ac_timestamp, ac_orderno, ac_ifsc, ac_totalamount, ac_amounttobepaid, ac_ordertype)
        SELECT (SELECT COALESCE( MAX(ac_srno),0)+1 FROM master_account_details) AS ac_srno, '" . $obj->paymentMode . "', '" . $obj->clientBank . "', '" . $obj->clientAccount . "'
        , 0, now(), '" . $orderno . "', '" . $obj->IFSC . "', " . $totalamt . ", " . $amountToPay . ", 'REMIT'";
            $dbconn = $dbio->getConn();
            $result = $dbio->batchQueries($dbconn, $sql);
            $dbio->closeConn($dbconn);
            $qry = "UPDATE lead_order SET po_paymenttype = '" . $obj->paymentMode . "' WHERE po_order_no = '" . $orderno . "'";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $qry);
            $dbio->closeConn($dbconn);
            $this->msg = 1;

        } else {
            $this->msg = 0;
        }
    }


    public function getAllInfo($dbio, $orderno)
    {
        $header = array();
        $senderDetails = array();
        $beneDetails = array();
        $statuslist = array();
        $paymode = '';

        $sql = "SELECT po_order_no,ms_status, po_ordertype, po_promocode, po_status,po_quantity,isd_name,po_nostrocharge,po_CGST,po_handlingcharge, po_paymenttype,
            po_totalamt, po_roundAmt, rp_branch, rp_address, rp_doorstepAddress, rp_doorpin, rp_doorcity, rp_state, rp_country
            , rp_verificationdate,rp_mode, cnt_name, po_paymenttype, user_mobile
            FROM lead_order
            LEFT OUTER JOIN user_login ON po_usersrno = user_srno
            LEFT OUTER JOIN remit_process ON po_order_no = rp_orderno
            LEFT OUTER JOIN master_country ON po_country = cnt_srno
            LEFT OUTER JOIN master_isd ON po_currency = isd_code
            LEFT OUTER JOIN master_status ON po_status = ms_code
            WHERE po_order_no = '" . $orderno . "'
            ";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if ($result) {
            while ($row = mysqli_fetch_assoc($result)) {
                $header[] = $row;
            }
        }

        $sql = "SELECT rs_orderno, rs_name, rs_email, rs_mobile, rs_purpose, rs_idtype, rs_idnum, rs_placeofissue, rs_expirydate, purpose_name 
        FROM remit_sender 
        left outer join master_purpose on purpose_id = rs_purpose
        WHERE rs_orderno = '" . $orderno . "'";
        $result = $dbio->getSelect($dbconn, $sql);
        if ($result) {
            while ($row = mysqli_fetch_assoc($result)) {
                $senderDetails[] = $row;
            }
        }

        $query3 = "SELECT ms_code, ms_status FROM master_status";
        $res = $dbio->getSelect($dbconn, $query3);
        if ($res) {
            while ($row = mysqli_fetch_assoc($res)) {
                $statuslist[] = $row;
            }
        }

        $sql = "SELECT rb_name, rb_swiftcode, rb_bankname, rb_bankaddr, rb_transitno, rb_accountnumber  FROM remit_beneficiary WHERE rb_orderno = '" . $orderno . "'";
        $result = $dbio->getSelect($dbconn, $sql);
        if ($result) {
            while ($row = mysqli_fetch_assoc($result)) {
                $beneDetails[] = $row;
            }
        }

        return array("header" => $header, "sender" => $senderDetails, "bene" => $beneDetails, "statuslist" => $statuslist);
        $dbio->closeConn($dbconn);

    }


}

?>