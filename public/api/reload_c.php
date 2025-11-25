<?php

class ReloadForex {

    function calculateTcs($dbio, $panNumber, $totalAmt, $purpose, $educationLoan,$po_handlingcharge=0,$gst=0)
    {
        $isok=true;
        //po_status 14 mean order completed; 
        $earlierForex = 0;
        //calculate earlier forex from zenithforexonline.com
        $earlierForexFromForexonline = 0;
        $dbconn = $dbio->getConn();
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
            // $dbconnEremit = $dbio->getConnEremit();
            $result1 = $dbio->getSelect($dbconn, $qry1);
            // $dbio->closeConnEremit($dbconnEremit);
            if($result1){
                $row = mysqli_fetch_row($result1);
                $forexRemit = $row[0]*1;
            }
        }
        $earlierForex=$earlierForexFromForexonline+$forexRemit;
        $dbconn = $dbio->getConn();
        return $dbio->calcTcs($purpose, $educationLoan, $earlierForex, ($totalAmt+$po_handlingcharge+$gst));
    }
    public function insertReloadDetails($dbio, $obj){
        $randomid = date("ymdhis");
        $currency=$obj->currencyOpt;
        $quantity=$obj->quantity;
        $rate=$obj->buyRate;
        $totalAmt = $obj->totalAmt;
        $taxableVal = $obj->taxableVal;
        $gst = $taxableVal * 0.18;
        $handlingCharge = 100;
        $panNumber = $obj->pan;
        $gst = $taxableVal * 0.18;
        $tcs = $this->calculateTcs($dbio, $panNumber, $totalAmt, $obj->purpose, "",$handlingCharge,$gst);
        $amountToPay = $totalAmt + $gst + $handlingCharge+$tcs;
        $roundSumAmt = round($amountToPay);
        $roundFig = $roundSumAmt - $amountToPay;
        $sql = "UPDATE lead_order SET po_status = 'E' WHERE po_status = 'D' AND po_usersrno = ".$_SESSION["userSrno"].";
                INSERT INTO lead_order (po_srno, po_refno, po_ordertype, po_productcount, po_product, po_product_2, po_currency, po_card_currency, po_quantity,
                po_card_quantity, po_buyrate, po_card_buyrate, po_totalamt, po_handlingcharge, po_taxableval, po_CGST, po_SGST, po_IGST, po_sumamount, po_round, po_roundAmt, 
                po_date, po_order_no, po_status, po_nofpassenger, po_nofcurrency, po_travelpurpose, po_traveldate, po_usersrno, po_paymenttype, po_location, po_manuallead, po_leadsource,po_tcs, po_pan)
                SELECT (SELECT COALESCE( MAX(po_srno),0)+1 FROM lead_order) AS srno, CONCAT('ZFX/', (SELECT COALESCE( MAX(po_srno),0)+1 FROM lead_order)),'".$obj->ordertype."', 1, 'CARD'
                , '', '".$currency."', '', ".$quantity.", 0, ".$rate.", 0, ".$totalAmt.", ".$handlingCharge.", 
                ".$taxableVal.", ".$gst.", ".$gst.", ".$gst.", ".$amountToPay.", ".number_format($roundFig, 2).", ".$roundSumAmt.", now(), CONCAT('".$randomid."',
                '/', ".$_SESSION["userSrno"]."), 'D', 0, 0, '".$obj->purpose."', '', ". $_SESSION["userSrno"].", '', ".$obj->loc.", 0, 2,".$tcs.", '".$obj->pan."';";
        $dbconn = $dbio->getConn();
        $result = $dbio->batchQueries($dbconn, $sql);
        $dbio->closeConn($dbconn);

        $dbconn = $dbio->getConn();
        $query = "INSERT INTO lead_product (lp_srno, lp_orderno, lp_travellernum, lp_isd, lp_producttype, lp_quantity, lp_rateofexchange, lp_totalamt, lp_sumtotalamount, lp_timestamp)
                      SELECT (SELECT MAX(lp_srno) + 1 FROM lead_product), CONCAT('" . $randomid . "', '/', '" . $_SESSION["userSrno"] . "'),
                       '1', '" . $currency . "', 'CARD', " . $quantity . ", " . $rate . ", " . $totalAmt . ",
                        " . $amountToPay . ", now()";
        $res = $dbio->getSelect($dbconn, $query);
        
        date_default_timezone_set('Asia/Kolkata');
        $curtime = date('d-m-Y H:i:s');
        // $email = "himanshu.tomar@zenithforex.com";
        $email = "online.manager@zenithforex.com";
            $query = "SELECT user_id, user_name, user_mobile FROM user_login WHERE user_srno = '".$obj->userSrno."'";
            $result = $dbio->getSelect($dbconn, $query);
            $dbio->closeConn($dbconn);
            if($result){
                $row = mysqli_fetch_row($result);
                $ml = "<html>";
                $ml = $ml."<body>";
                $ml = $ml."<b>New Lead from zenithforexonline.com </b><br> 
                    User Name: '".$row[1]."' <br> 
                    User Email: '".$row[0]."' <br> 
                    User Phone: '".$row[2]."' <br> 
                    Ordertype: '".$obj->ordertype."'  <br>
                    Currency: '".$obj->currencyOpt."' <br>
                    Quanity: ".$obj->quantity." <br>
                    <b>Thanks & Regards <br> Administrator </b>";
                $ml = $ml."</body>";
                $ml = $ml."</html>";
                require_once('mail_c.php');         
                $m = new Mymail();
                $msent = $m->sendMail('ZENITHFOREXONLINE.COM Lead : '.$curtime.'',$ml,GROUPEMAILID,'','','');
                $msent = true;          
                if($msent){
                    $this->data = array("msg"=>"1", "orderno"=>$randomid.'/'.$_SESSION["userSrno"]);
                }else{
                    $this->data = array("msg"=>"OTP has been reset. But enable to sent email. Please contact to administrator.");
                }
            }
    }


    public function insertTraveldetail($dbio, $obj){
        $sourceOfFund = $obj->sourceOfFund; // this should be S or L.
        $itr = $obj->itr; // this should be Y or N.
        $educationLoan = "N";
        if ($sourceOfFund == "L" && $itr == "Y") {
            $educationLoan = "Y";
        }

        $query = "SELECT po_pan,po_sumamount,po_tcs,po_totalamt,po_CGST,po_handlingcharge from lead_order where po_order_no = '".$obj->orderno."';";
        $dbconn = $dbio->getConn();
        $result1 = $dbio->getSelect($dbconn, $query);
        $row = mysqli_fetch_row($result1);
        $sumAmount = $row[1];
        $prevTcs = $row[2];
        $currentForexAmount = $row[3];
        $gst = $row[4]??0;
        $handlingCharge = $row[5]??0;



        $currTcs = $this->calculateTcs($dbio, $obj->pan, $currentForexAmount, $obj->purpose, $educationLoan,$handlingCharge,$gst);
        $sumAmount = $sumAmount + $currTcs - $prevTcs;
        $roundAmt = round($sumAmount);
        $roundFig = $roundAmt - $sumAmount;

        $query = "UPDATE lead_order SET po_travelpurpose = '".$obj->purpose."', po_sumamount= ".$sumAmount.", po_roundAmt= ".$roundAmt.", po_round=".$roundFig."
        , po_tcs=".$currTcs.", po_source_of_fund ='".$sourceOfFund."' , po_itr = '".$itr."' WHERE po_order_no = '".$obj->orderno."'";
        $result = $dbio->getSelect($dbconn, $query);
        $dbio->closeConn($dbconn);

        if(date_format(date_create($obj->travelDate), "Ymd") >= date("Ymd")){
        $sql = "DELETE FROM reload_travel WHERE rt_orderno = '".$obj->orderno."';
                INSERT INTO reload_travel (rt_orderno, rt_purpose, rt_traveldate, rt_countrytovisit, rt_cardno, rt_cardissuer, rt_timestamp)
                VALUES ('".$obj->orderno."', '".$obj->purpose."', '".$obj->travelDate."', '".$obj->cnt."', '".$obj->cardno."', '".$obj->issuer."', now());";
        $dbconn = $dbio->getConn();
        $result = $dbio->batchQueries($dbconn, $sql);
        $dbio->closeConn($dbconn);
        $this->msg = 1;
        }else {
            $this->msg = 0;
        }
    }


    public function getPurposeDetails($dbio){
        $query = "SELECT po_travelpurpose, po_pan FROM lead_order WHERE po_status = 'D' AND po_ordertype = 'reload' AND po_usersrno = '".$_SESSION["userSrno"]."'";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $query);
        $dbio->closeConn($dbconn);
        $row = mysqli_fetch_row($result);
        $this->purpose = $row[0];
        $this->pan = $row[1];
    }


    public function getForexDetails($dbio, $orderno){
        $empArr = array();
        $sql = "SELECT po_product, po_currency, po_quantity, po_buyrate, po_totalamt
                FROM lead_order
                WHERE po_order_no='".$orderno."'";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        $dbio->closeConn($dbconn);
        $row = mysqli_fetch_row($result);
        $this->product = $row[0];
        $this->currency = $row[1];
        $this->quantity = $row[2];
        $this->rate = $row[3];
        $this->totalAmt = $row[4];
    }


    public function getAllDetails($dbio, $orderno){
        $list = array();
        $statuslist = array();
        $productlist = array();
        $sql = "SELECT po_order_no, COALESCE(po_promocode,'') AS po_promocode, COALESCE(ms_status,'') AS ms_status,rt_traveldate, rt_countrytovisit, rt_cardno, rt_cardissuer,
                po_ordertype, po_product, lt_name, lt_pancard, lt_passport, po_roundAmt, user_mobile  
                ,ac_amountpaid, ac_amountpending ,po_paymenttype
                FROM lead_order
                LEFT OUTER JOIN lead_traveller ON po_order_no = lt_orderno
                LEFT OUTER JOIN user_login ON po_usersrno = user_srno
                LEFT OUTER JOIN master_status ON po_status = ms_code
                LEFT OUTER JOIN reload_travel ON po_order_no = rt_orderno
                LEFT OUTER JOIN master_account_details ON ac_orderno = po_order_no
                WHERE po_order_no ='".$orderno."' limit 1";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if($result){
            while($row = mysqli_fetch_assoc($result)){
                $list[] = $row;
            }
        }

        $query3 = "SELECT ms_code, ms_status FROM master_status";
        $res = $dbio->getSelect($dbconn, $query3);
        if($res){
            while($row = mysqli_fetch_assoc($res)){
                $statuslist[] = $row;
            }
        }
        
        $qry = "SELECT lp_orderno, po_CGST, po_handlingcharge, isd_name, lp_quantity, lp_rateofexchange, lp_totalamt, lp_sumtotalamount FROM lead_product 
                LEFT OUTER JOIN master_isd ON lp_isd = isd_code
                LEFT OUTER JOIN lead_order ON lp_orderno = po_order_no
                WHERE lp_orderno = '".$orderno."'";
        $result = $dbio->getSelect($dbconn, $qry);
        if($result){
            while($row = mysqli_fetch_assoc($result)){
                $productlist[] = $row;
            }
        }

        return array("list"=>$list, "productlist"=>$productlist, "statuslist"=>$statuslist);
        $dbio->closeConn($dbconn);
    }


    public function insertAccDetails($dbio, $obj){
        $amountToPay=0;
        $totalamt = 0;
        $q = "SELECT po_roundAmt FROM lead_order WHERE po_order_no = '".$obj->orderno."'";
        $dbconn = $dbio->getConn();
        $res = $dbio->getSelect($dbconn, $q);
        $dbio->closeConn($dbconn);          
        if(mysqli_num_rows($res)>0)  {
            $row = mysqli_fetch_row($res);
            $totalamt = $row[0];
            if($obj->paymentMode == 'FP'){
                $amountToPay = $row[0];
            }else {
                $amountToPay = $row[0] * 0.02;
            }
        }

        $sql = "DELETE FROM master_account_details WHERE ac_orderno = '".$obj->orderno."';
                INSERT INTO master_account_details (ac_srno, ac_paymentmode, ac_bankname, ac_bankaccnum, ac_isverified, ac_timestamp, ac_orderno, ac_ifsc, ac_totalamount, ac_amounttobepaid, ac_ordertype)
                    SELECT (SELECT COALESCE( MAX(ac_srno),0)+1 FROM master_account_details) AS ac_srno, '".$obj->paymentMode."', '".$obj->clientBank."', '".$obj->clientAccount."'
                    , 0, now(), '".$obj->orderno."', '".$obj->IFSC."', ".$totalamt.", ".$amountToPay.", 'RELOAD'";
                    $dbconn = $dbio->getConn();
                    $result = $dbio->batchQueries($dbconn, $sql);
                    $dbio->closeConn($dbconn);            
        $qry = "UPDATE lead_order SET po_paymenttype = '".$obj->paymentMode."' WHERE po_order_no = '".$obj->orderno."'";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $qry);
        $dbio->closeConn($dbconn);
        $this->msg = 1;
    }
    

}

?>