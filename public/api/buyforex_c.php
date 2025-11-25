<?php
class Buyforex
{
    public $msg;
    public $handlingcharge = 100;




    private function sendSeparateMail($title, $curtime, $ml, $email)
    {
        // $pid = pcntl_fork();
        // if ($pid == -1) {
        //     // Fork failed
        //     die("Could not fork\n");
        // } else {
        //     // Child process
        //     require_once ('mail_c.php');
        //     $m = new Mymail();
        //     $msent = $m->sendMail($title . $curtime . '', $ml, $email, '', '', '');
        //     $msent = true;
        //     // return $msent;
        //     exit(); // Child process exits after sending email
        // }
        require_once('mail_c.php');
        $m = new Mymail();
        $msent = $m->sendMail($title . $curtime . '', $ml, $email, '', '', '');
        $msent = true;
        return $msent;
    }

    private function orderConfirmMailFormat($row, $heading)
    {
        $ml = "<html>";
        $ml = $ml . "<body>";
        $ml = $ml . "
            <div style='width: 100%; max-width: 800px; margin: auto;'>
                <div class='maindiv' style='padding: 15px; color: white;background-color:#2f2e7e;'>
                    <div style='text-align: center; background-color: white;'>
                    <img src='https://zenithforexonline.com/img/logo.png' alt='' />
                    <h3 style='color: black;'>Zenith is Authorized Dealer Cat- II Foreign Exchange Company and amongst the Top 3 in the country</h3>
                    </div>
                    <div style='margin-top: 10px'>
                    <p>" . $heading . "</p>
                    <h3 style='margin-top: 15px;'>Order Details:</h3>
                    <table width='100%' style='color: black;border: 1px solid; background-color: white;'>
                        <tbody style='text-align: center;'>
                        <tr>
                            <th>Order Number</th>
                            <th>Reference No</th>
                            <th>Product</th>
                            <th>Order Type</th>
                            <th>Date</th>
                        </tr> ";
        if ($row[5] == 'buy') {
            if ($row[7] != '' and $row[11] != '') {
                $ml = $ml . "<tr>
                                <td>" . $row[3] . "</td>
                                <td>" . $row[4] . "</td>
                                <td>" . $row[7] . "</td>
                                <td>" . $row[5] . "</td>
                                <td>" . $row[6] . "</td>
                            </tr>
                            <tr>
                                <td>" . $row[3] . "</td>
                                <td>" . $row[4] . "</td>
                                <td>" . $row[11] . "</td>
                                <td>" . $row[5] . "</td>
                                <td>" . $row[6] . "</td>
                            </tr>
                            ";
            } else if ($row[7] == '') {
                $ml = $ml . "<tr>
                                <td>" . $row[3] . "</td>
                                <td>" . $row[4] . "</td>
                                <td>" . $row[11] . "</td>
                                <td>" . $row[5] . "</td>
                                <td>" . $row[6] . "</td>
                            </tr> ";
            } else if ($row[11] == '') {
                $ml = $ml . "<tr>
                                <td>" . $row[3] . "</td>
                                <td>" . $row[4] . "</td>
                                <td>" . $row[7] . "</td>
                                <td>" . $row[5] . "</td>
                                <td>" . $row[6] . "</td>
                            </tr> ";
            }
        } else {
            $ml = $ml . "<tr>
                                <td>" . $row[3] . "</td>
                                <td>" . $row[4] . "</td>
                                <td>" . $row[7] . "</td>
                                <td>" . $row[5] . "</td>
                                <td>" . $row[6] . "</td>
                            </tr> ";
        }
        $ml = $ml . "
                    </tbody>
                    </table>
                    <h3 style='margin-top: 35px;'>TRAVELLER/ REMITTER DETAILS:</h3>
                    <table width='100%' style='color: black;border: 1px solid; background-color: white;'>
                        <tbody style='text-align: left;'>
                            <tr>
                                <th>Traveller/Remitter name</th>
                                <th>Email ID</th>
                                <th>Contact Number</th>
                            </tr>
                            <tr>
                                <td style='border-bottom: 1px solid;'>" . $row[0] . "</td>
                                <td style='border-bottom: 1px solid;'>" . $row[1] . "</td>
                                <td style='border-bottom: 1px solid;'>" . $row[2] . "</td>
                            </tr>
                            <tr>
                                <th colspan='2'>Address</th>
                                <th>Location</th>
                            </tr>
                            <tr> ";
        if ($row[23] == "door-delivery") {
            $ml = $ml . "<td colspan='2'>" . $row[20] . "</td> ";
        } else {
            $ml = $ml . "<td colspan='2'>" . $row[22] . "</td> ";
        }
        $ml = $ml . "<td>" . $row[21] . "</td>
                            </tr>
                            </tbody>
                    </table>
                    <h3 style='margin-top: 35px;'>TRANSACTIONAL DETAILS:</h3>
                    <table width='100%' style='color: black;border: 1px solid; background-color: white;'>
                    <tbody style='text-align: left;'>
                        <tr>
                            <th>Purpose</th>
                            <th>Delivery Mode</th>
                            <th>Payment type</th>
                        </tr>
                        <tr>
                            <td>" . $row[19] . "</td>
                            <td>" . $row[23] . "</td> ";
        if ($row[24] == 'COD') {
            $ml = $ml . "<td>Others</td> ";
        } else if ($row[24] == 'PP') {
            $ml = $ml . "<td>Partial Payment(2%)</td> ";
        } else if ($row[24] == 'FP') {
            $ml = $ml . "<td>Full Payment</td> ";
        } else {
            $ml = $ml . "<td>" . $row[24] . "</td> ";
        }
        $ml = $ml . "</tr>
                    </tbody>
                    </table>
                    <table style='color: black;margin-top: 30px; background-color: white;' border='1' cellspacing='0' width='100%'>
                        <tbody style='text-align: left;'>
                            <tr>
                                <th>Product</th>
                                <th>Currency</th>
                                <th>Forex Amount</th>
                                <th>Customer Rate</th>
                                <th style='text-align: right;'>Sub-Total (INR)</th>
                            </tr> ";
        if ($row[7] != '' and $row[11] != '') {
            $ml = $ml . "<tr>
                                    <td>" . $row[7] . "</td>
                                    <td>" . $row[8] . "</td>
                                    <td>" . $row[9] . "</td>
                                    <td>" . $row[10] . "</td>
                                    <td><strong style='float:right;'>" . $row[9] * $row[10] . "</strong></td>
                                </tr>
                                <tr>
                                    <td>" . $row[11] . "</td>
                                    <td>" . $row[12] . "</td>
                                    <td>" . $row[13] . "</td>
                                    <td>" . $row[14] . "</td>
                                    <td><strong style='float:right;'>" . $row[13] * $row[14] . "</strong></td>
                                </tr>
                                ";
        } else if ($row[7] == '' and $row[11] != '') {
            $ml = $ml . "<tr>
                                    <td>" . $row[11] . "</td>
                                    <td>" . $row[12] . "</td>
                                    <td>" . $row[13] . "</td>
                                    <td>" . $row[14] . "</td>
                                    <td><strong style='float:right;'>" . $row[13] * $row[14] . "</strong></td>
                                </tr> ";
        } else {
            $ml = $ml . "<tr>
                                    <td>" . $row[7] . "</td>
                                    <td>" . $row[8] . "</td>
                                    <td>" . $row[9] . "</td>
                                    <td>" . $row[10] . "</td>
                                    <td><strong style='float:right;'>" . $row[9] * $row[10] . "</strong></td>
                                </tr> ";
        }
        $ml = $ml . "<tr>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>Service Charge -<strong style='float:right;'>" . $row[16] . "</strong></td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>GST -<strong style='float:right;'>" . $row[15] . "</strong></td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>Nostro Charge -<strong style='float:right;'>" . $row[17] . "</strong></td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td><strog>Total Amount-</strog><strong style='float:right;'>" . $row[18] . "</strong></td>
                            </tr>
                        </tbody>
                    </table>
                    <h3 style='margin-top: 30px;'>OTHER DETAILS:</h3>
                    <table width='100%' style='color: black;border: 1px solid; background-color: white;'>
                        <tbody style='text-align: left;'>
                            <tr>
                                
                                <th>Document Status</th>
                                <th>Visa on arrival</th>
                                <th>Order Status</th>
                            </tr>
                            <tr>
                                
                                <td>Pending</td>
                                <td>YES</td>
                                <td>" . $row[25] . "</td>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                    <div style='margin-top: 30px;background-color: white;'>
                    <p style='color: black; padding: 15px;text-align: center; letter-spacing: 1; font-weight: bold;'>35+ Branches India| 10 Abroad office | 4Airport counter| 26+ year experience| 1000+ Team | 1 millions Happy clients</p>
                    <div style='text-align: center;'>
                    <img width='10%' src='https://www.zeneremit.com/img/zenith-e-remit.png' alt=''>
                        <img width='10%' src='https://zenithfinserv.com/img/images/logo.png' alt=''>
                    </div>
                    </div>
                </div>
            </div>";
        $ml = $ml . "</body>";
        $ml = $ml . "</html>";
        return $ml;
    }

    function calculateTcs($dbio, $panNumber, $totalAmt, $purpose, $educationLoan,$handlingcharge=0, $gst=0)
    {
        //po_status 14 mean order completed; //,COALESCE(SUM(po_handlingcharge),0),COALESCE(SUM(po_CGST+po_SGST+po_IGST),0)
        $isok=true;
        $earlierForex = 0;
        //calculate earlier forex from zenithforexonline.com
        $earlierForexFromForexonline = 0;
        $dbconn = $dbio->getConn();
        if($isok && $panNumber != '' && $panNumber != null){
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
        $dbio->writeLog($earlierForex.' & '.$earlierForexFromForexonline.' & '.$forexRemit);
        $dbconn = $dbio->getConn();
        return $dbio->calcTcs($purpose, $educationLoan, $earlierForex, ($totalAmt+$handlingcharge+ $gst));
    }
    public function buyOrder($dbio, $product, $object)
    {
        $randomid = date("ymdhis");
        $type = $object->ordertype;
        $cashCurrency = $object->currency->cashCntSelect;
        $cardCurrency = $object->currency->cardCntSelect;
        $cashAmt = $object->amount->cashAmt;
        $cardAmt = $object->amount->cardAmt;
        $cashRate = $object->buyrate->cashRate;
        $cardRate = $object->buyrate->cardRate;
        $cashTotal = $object->cashTotal;
        $cardTotal = $object->cardTotal;
        $totalAmt = $object->totalAmt;
        $taxableAmt = $object->taxableAmt;
        $sid = $object->sid;
        $id = $_SESSION["userId"];
        $handlingcharge = 100;
        $gst = $taxableAmt * 0.18;
        $promo = "";
        if (is_string($object->promo)) {
            $promo = $object->promo;
        }
        $panNumber = $object->pan;
        //tcs is applicable only for remit case ;
        $tcs = $this->calculateTcs($dbio, $panNumber, $totalAmt, 0, "",$handlingcharge, $gst);
        $amountToBePaid = $totalAmt + $gst + $handlingcharge + $tcs;
        $roundAmt = round($amountToBePaid);
        $round = $roundAmt - $amountToBePaid;
        $dbconn = $dbio->getConn();
        if ($product == "2") {
            $sql = "UPDATE lead_order SET po_status = '5' WHERE po_status = 'D' AND po_usersrno = '" . $_SESSION['userSrno'] . "';
                INSERT INTO lead_order (po_srno, po_refno, po_ordertype,po_productcount, po_product, po_product_2, po_currency, po_card_currency, po_quantity, po_card_quantity, 
                po_buyrate, po_card_buyrate, po_totalamt, po_date, po_roundAmt, po_order_no, po_handlingcharge, 
                po_CGST, po_SGST, po_IGST, po_taxableval, po_status, po_usersrno, po_round, po_sumamount, po_location, po_promocode, po_leadsource, po_manuallead,po_tcs,po_pan)
                SELECT (SELECT COALESCE( MAX(po_srno),0)+1 FROM lead_order) AS srno, CONCAT('ZFX/', (SELECT COALESCE( MAX(po_srno),0)+1 FROM lead_order)), '" . $type . "', 2, 'CN', 'CARD',
                 '" . $cashCurrency . "', '" . $cardCurrency . "', " . $cashAmt . ", " . $cardAmt . ", " . $cashRate . ", " . $cardRate . ", " . $totalAmt . ", now(), " . $roundAmt . ", 
                CONCAT('" . $randomid . "', '/', (select user_srno from user_login where user_id = '" . $id . "')), " . $handlingcharge . ", " . $gst . ", " . $gst . ", " . $gst . ", '" . $taxableAmt . "', 'D',
                (SELECT user_srno from user_login where user_id = '" . $id . "'), '" . number_format($round, 3) . "', '" . $amountToBePaid . "', " . $object->loc . ", '" . $promo . "', 2, 0," . $tcs . ",UPPER('".$panNumber."');";
            $result = $dbio->batchQueries($dbconn, $sql);
            $this->msg = $product;
        } else if ($product == "CN") {
            $sql = "UPDATE lead_order SET po_status = '5' WHERE po_status = 'D' AND po_usersrno = (SELECT user_srno FROM user_login WHERE user_id='" . $id . "');
                INSERT INTO lead_order (po_srno, po_refno, po_ordertype,po_productcount, po_product, po_currency, po_quantity, po_buyrate, po_totalamt, po_date, po_roundAmt, po_order_no, po_handlingcharge, 
                po_CGST, po_SGST, po_IGST, po_taxableval, po_status, po_usersrno, po_round, po_sumamount, po_product_2, po_card_currency, po_card_quantity, po_card_buyrate, po_location, po_promocode, po_leadsource, po_manuallead,po_tcs,po_pan)
                SELECT (SELECT COALESCE( MAX(po_srno),0)+1 FROM lead_order) AS srno, CONCAT('ZFX/', (SELECT COALESCE( MAX(po_srno),0)+1 FROM lead_order)),'" . $type . "', 1, 'CN', '" . $cashCurrency . "', " . $cashAmt . ", " . $cashRate . ", " . $cashTotal . ", now(), " . $roundAmt . ", 
                CONCAT('" . $randomid . "', '/', (select user_srno from user_login where user_id = '" . $id . "')), " . $handlingcharge . ", " . $gst . ", " . $gst . ", " . $gst . ", '" . $taxableAmt . "', 'D',
                (SELECT user_srno from user_login where user_id = '" . $id . "'), '" . number_format($round, 3) . "', '" . $amountToBePaid . "', '', '', 0, 0, " . $object->loc . ", '" . $promo . "', 2, 0," . $tcs . ",UPPER('" . $panNumber . "');";
            $result = $dbio->batchQueries($dbconn, $sql);
            $this->msg = $product;

        } else if ($product == "CARD") {
            $sql = "UPDATE lead_order SET po_status = '5' WHERE po_status = 'D' AND po_usersrno = (SELECT user_srno FROM user_login WHERE user_id='" . $id . "');
                INSERT INTO lead_order (po_srno, po_refno, po_ordertype,po_productcount, po_product_2, po_card_currency, po_card_quantity, po_card_buyrate, po_totalamt, po_date, po_roundAmt, po_order_no, po_handlingcharge, 
                po_CGST, po_SGST, po_IGST, po_taxableval, po_status, po_usersrno, po_round, po_sumamount, po_product, po_currency, po_quantity, po_buyrate, po_location, po_promocode, po_leadsource, po_manuallead,po_tcs,po_pan)
                SELECT (SELECT COALESCE( MAX(po_srno),0)+1 FROM lead_order) AS srno, CONCAT('ZFX/', (SELECT COALESCE( MAX(po_srno),0)+1 FROM lead_order)),'" . $type . "',1, 'CARD', '" . $cardCurrency . "', " . $cardAmt . ", " . $cardRate . ", " . $cardTotal . ", now(), " . $roundAmt . ", 
                CONCAT('" . $randomid . "', '/', (select user_srno from user_login where user_id = '" . $id . "')), " . $handlingcharge . ", " . $gst . ", " . $gst . ", " . $gst . ", '" . $taxableAmt . "', 'D',
                (SELECT user_srno from user_login where user_id = '" . $id . "'), '" . number_format($round, 3) . "', '" . $amountToBePaid . "', '', '', 0, 0, " . $object->loc . ", '" . $promo . "', 2, 0," . $tcs . ",UPPER('" . $panNumber . "');";
            $result = $dbio->batchQueries($dbconn, $sql);
            $this->msg = $product;
        }
        $dbio->closeConn($dbconn);
        $dbconn = $dbio->getConn();
        //currency query
        if ($product == "CN" || $product == "2") {
            $queryCN = "INSERT INTO lead_product (lp_srno, lp_orderno, lp_travellernum, lp_isd, lp_producttype, lp_quantity, lp_rateofexchange, lp_totalamt, lp_sumtotalamount, lp_timestamp)
                      SELECT (SELECT MAX(lp_srno) + 1 FROM lead_product), CONCAT('" . $randomid . "', '/', '" . $_SESSION["userSrno"] . "'),
                       '1', '" . $cashCurrency . "', 'CN', " . $cashAmt . ", " . $cashRate . ", " . $cashTotal . ",
                        " . $amountToBePaid . ", now()";
            $resultCN = $dbio->getSelect($dbconn, $queryCN);
        }
        if ($product === "CARD" || $product == "2") {
            //card query
            $queryCA = "INSERT INTO lead_product (lp_srno, lp_orderno, lp_travellernum, lp_isd, lp_producttype, lp_quantity, lp_rateofexchange, lp_totalamt, lp_sumtotalamount, lp_timestamp)
                      SELECT (SELECT MAX(lp_srno) + 1  FROM lead_product),CONCAT('" . $randomid . "', '/', '" . $_SESSION["userSrno"] . "'),
                       '1', '" . $cardCurrency . "', 'CARD', " . $cardAmt . ", " . $cardRate . ", " . $cardTotal . ", " . $amountToBePaid . ", now()";
            $resultCA = $dbio->getSelect($dbconn, $queryCA);
        }

        $query = "SELECT user_id, user_name, user_mobile FROM user_login WHERE user_id = '" . $id . "';";
        $result = $dbio->getSelect($dbconn, $query);
        date_default_timezone_set('Asia/Kolkata');
        $curtime = date('d-m-Y H:i:s');
        if (mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_row($result);
            $ml = "<html>";
            $ml = $ml . "<body>";
            $ml = $ml . "New Lead from zenithforexonline.com <br>
                User Name: " . $row[1] . " <br> 
                User Email: " . $row[0] . " <br> 
                User Phone: " . $row[2] . " <br> 
                Order Type: BUY <br>
                <b>Thanks & Regards <br> Administrator </b>";
            $ml = $ml . "</body>";
            $ml = $ml . "</html>";
            $monikaMail = "online.manager@zenithforex.com";
            $karishmaMail = "onlinesales1@zenithforex.com";
            $tarunMail = "onlinesalesho@zenithforex.com";
            $msent = $this->sendSeparateMail('ZenithForexOnline Lead: ', $curtime, $ml, GROUPEMAILID);
            // $msent = $this->sendSeparateMail('ZenithForexOnline Lead: ', $curtime, $ml, $karishmaMail);
            // $msent = $this->sendSeparateMail('ZenithForexOnline Lead: ', $curtime, $ml, $tarunMail);
            if ($msent) {
                $this->data = array("msg" => "1");
            } else {
                $this->data = array("msg" => "Please contact to administrator.");
            }
            $this->sendSeparateMail('ZenithForexOnline Lead: ', $curtime, $ml, GROUPEMAILID);
        }
        $this->data = array("msg" => "1", "orderno" => $randomid . '/' . $_SESSION["userSrno"]);
        $dbio->closeConn($dbconn);

    }


    public function timeLimit($dbio)
    {
        $this->msg = "c";
    }

    public function calculateTotalEarlierForex($dbio, $panNumber)
    {
        $dbconn = $dbio->getConn();
        //po_status 14 mean order completed; 
        $qry = "SELECT COALESCE(SUM(po_totalamt),0) FROM lead_order WHERE po_status IN (14) AND po_pan=UPPER('" . $panNumber . "');";
        $result = $dbio->getSelect($dbconn, $qry);
        $row = mysqli_fetch_row($result);
        $earlierForex = 0;
        if ($row[0]) {
            $earlierForex = $row[0];
        }
        $dbconn = $dbio->getConn();
        return $earlierForex;
    }
    public function getBuyDetails($dbio, $usersrno,$obj)
    {
        $panNumber = "";
        $sql = "SELECT po_order_no, po_ordertype, po_product, po_currency, po_quantity, po_buyrate, po_totalamt, po_roundAmt,
         po_sumamount, po_CGST, po_round, po_nostrocharge,po_pan,po_tcs,po_travelpurpose,po_source_of_fund,po_itr,po_handlingcharge,
         po_round,po_sumamount
         FROM lead_order  WHERE po_status = 'D' AND po_usersrno ='" . $_SESSION["userSrno"] . "'";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if (mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_row($result);
            $this->msg = "Query Updated";
            $this->orderno = $row[0];
            $this->ordertype = $row[1];
            $this->product = $row[2];
            $this->currency = $row[3];
            $this->quantity = $row[4];
            $this->buyrate = $row[5];
            $this->totalAmt = $row[6];
            $this->roundAmt = $row[7];
            $this->sumamount = $row[8];
            $this->gst = $row[9];
            $this->round = $row[10];
            $this->nostro = $row[11];
            $this->pan = $row[12];
            $this->tcs = $row[13];
            $this->purpose = $row[14];
            $this->sourceoffund = $row[15];
            $this->itr = $row[16];
            $this->handlingchange = $row[17];
            //$this->tcspercent = (round($row[13])/round($row[7])) * 100;
            // $dbio->writeLog(json_encode($obj));
            // $dbio->writeLog(json_encode(isset($obj->panNumber)));
            if($row[12]!='' && $row[12]!=null){
                $panNumber = $row[12];
            }
            //if pan number available then only tcs can very and total amoutn also change;
        } else {
            $this->msg = "error";
        }
        $dbio->closeConn($dbconn);
        if(isset($obj->panNumber) && $obj->panNumber){
            $panNumber = $obj->panNumber;
            $this->totalEarlierForex=$this->calculateTotalEarlierForex($dbio, $panNumber);
            if($panNumber != '' && $panNumber != null){
                 $educationLoan="N";
                if($this->sourceoffund == "L" && $this->itr == "Y"){
                    $educationLoan="Y";
                }
                $tcs=$this->calculateTcs($dbio, $panNumber, $this->totalAmt, $this->purpose, $educationLoan,$this->handlingchange, $this->gst);
                $this->tcs= $tcs;
                $dbio->writeLog("New TCS ".$tcs);
            }
        }
    }


    public function getFinalOrderDetails($dbio, $orderno)
    {
        $sql = "SELECT po_totalamt, po_roundAmt, SUM(lp_quantity) AS forexamt, po_CGST, po_nostrocharge, 
                po_tcs,po_sumamount ,po_round,po_sumamount,lp_orderno
                FROM lead_product 
                LEFT OUTER JOIN lead_order ON lp_orderno = po_order_no 
                WHERE lp_orderno = '" . $orderno . "'";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        $dbio->closeConn($dbconn);
        $row = mysqli_fetch_row($result);
        $this->totalAmt = $row[0];
        $this->roundAmount = $row[1];
        $this->sumTotalAmt = $row[6];
        $this->gst = $row[3];
        $this->nostro = $row[4];
        $this->tcs = $row[5];
        $this->round = $row[7];
        $this->sumAmount = $row[8];
        $this->orderno = $row[9];
    }


    public function submitLeadHeader($dbio, $obj)
    {
        $purpose = $obj->purpose;
        $travelDate = $obj->travelDate;
        $countryToVisit = $obj->countryToVisit;
        $id = $obj->id;
        $sourceOfFund = $obj->sourceOfFund; // this should be S or L.
        $itr = $obj->itr; // this should be Y or N.

        if (date_format(date_create($travelDate), "Ymd") >= date("Ymd")) {
            // update lead_order -> tcs,amount,
            $query = "SELECT po_pan,po_sumamount,po_tcs,po_totalamt,po_CGST,po_handlingcharge from lead_order where  po_status = 'D' AND po_usersrno = ".$_SESSION["userSrno"].";";
            $dbconn = $dbio->getConn();
            $result1 = $dbio->getSelect($dbconn, $query);
            $dbio->closeConn($dbconn);
            $row = mysqli_fetch_row($result1);
            $panNumber = $row[0];
            $sumAmount = $row[1];
            $prevTcs = $row[2];
            $currentForexAmount = $row[3];
            $po_cgst = $row[4];
            $po_handlingcharge = $row[5];
            // if itr YES and SOURCEOFUND L than he it not aligible for tcs should be 0.5%
            $educationLoan = "N";
            if ($sourceOfFund == "L" && $itr == "Y") {
                $educationLoan = "Y";
            }
            $currTcs = $this->calculateTcs($dbio, $panNumber, $currentForexAmount, $purpose, $educationLoan,$po_handlingcharge,$po_cgst);
            $sumAmount = $sumAmount + $currTcs - $prevTcs;
            $roundAmt = round($sumAmount);
            $roundFig = $roundAmt - $sumAmount;
            $sql = "UPDATE lead_order SET po_travelpurpose='" . $purpose . "',  po_country=" . $countryToVisit . ", po_traveldate='" . $travelDate . "',
            po_sumamount=" . $sumAmount . ",po_roundAmt=" . $roundAmt . ",po_round=" . $roundFig . ",po_tcs=" . $currTcs . ", po_source_of_fund ='".$sourceOfFund."' , po_itr = '".$itr."'
            WHERE po_status = 'D' and  po_usersrno = ".$_SESSION["userSrno"]."";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            $dbio->closeConn($dbconn);
            $this->msg = "Query Successfully Updated";
        } else {
            $this->msg = "inv";
        }

    }


    public function clickBack($dbio, $userId)
    {
        $sql = "UPDATE lead_order SET po_status = '5' WHERE po_status = 'D' AND po_usersrno = (SELECT user_srno FROM user_login WHERE user_id = '" . $userId . "')";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        $dbio->closeConn($dbconn);
        $this->msg = "Status Expired!";
    }


    public function getPOdetails($dbio, $userId)
    {
        $sql = "SELECT po_pan, po_source_of_fund, po_itr, po_travelpurpose,po_product, po_quantity, po_buyrate, po_currency, po_totalamt, po_product_2, po_card_currency, po_card_buyrate, po_card_quantity, po_productcount
                , po_productcount
                FROM lead_order where po_status='D' AND 
                po_usersrno = ".$_SESSION["userSrno"]."";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        $pan = "";
        $sourceOfFund = "";
        $itr = "";
        $travelpurpose = "";
        // $dbio->closeConn($dbconn);
        if ($result && mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_row($result);
            $pan = $row[0];
            $sourceOfFund = $row[1];
            $itr = $row[2];
            $travelpurpose = $row[3];
        }
        $orderList = array();
        $travellerList = array();
        $sql = "SELECT lp_orderno,lp_producttype,lp_isd,lp_quantity,lp_rateofexchange,lp_totalamt,lp_travellernum FROM lead_product WHERE lp_orderno=
        (SELECT po_order_no FROM lead_order  WHERE po_status='D' AND po_usersrno='" . $_SESSION["userSrno"] . "')";
        $result = $dbio->getSelect($dbconn, $sql);
        if (mysqli_num_rows($result) > 0) {
            while ($row = mysqli_fetch_assoc($result)) {
                $orderList[] = $row;
            }
        } else {
            $orderList['msg'] = "err";
        }
        $sql = "SELECT * FROM lead_traveller  WHERE lt_orderno=(SELECT po_order_no FROM lead_order  WHERE po_status='D' AND po_usersrno='" . $_SESSION["userSrno"] . "') ORDER BY lt_srno DESC";
        $result = $dbio->getSelect($dbconn, $sql);
        if (mysqli_num_rows($result) > 0) {
            while ($row = mysqli_fetch_assoc($result)) {
                $travellerList[] = $row;
            }
        } else {
            $travellerList['msg'] = "err";
        }
        $dbio->closeConn($dbconn);
        return array("order" => $orderList, "traveller" => $travellerList, "pan"=>$pan, "sourceoffund"=>$sourceOfFund, "itr"=>$itr, "purpose"=>$travelpurpose);
    }


    public function addForexDetail($dbio, $obj, $sumAmount, $orderno, $nofpassenger){
        $travellerArray = $obj->travellerList;
        $pancard=isset($travellerArray[0]->pancard) ? $travellerArray[0]->pancard : '';
        $educationLoan = "N";
        if ($obj->tcsInfo->sourceOfFund == "L" && $obj->tcsInfo->itr == "Y") {
            $educationLoan = "Y";
        }
        $productArray = $obj->array;
        $gst = $obj->gst;
        $tcs = $this->calculateTcs($dbio, $obj->tcsInfo->pan, $sumAmount, $obj->tcsInfo->purpose, $educationLoan,$this->handlingcharge,$gst);
        $taxableVal = $gst * (100 / 18);
        $amountToPay = ($sumAmount * 1) + ($gst * 1) + $tcs*1 + 100;
        if ($obj->type == "sell") {
            $amountToPay = ($sumAmount * 1) - ($gst * 1) - 100;
        }
        $query = "UPDATE lead_order SET po_nofpassenger = " . $nofpassenger . ", po_CGST=" . $gst . ", po_SGST=" . $gst . ",
                  po_IGST=" . $gst . ", po_taxableval=" . $taxableVal . ",po_pan='".$pancard."'
                  , po_sumamount=" . $amountToPay . ", po_roundAmt=" . round($amountToPay) . ", po_totalamt = " . $sumAmount . ", po_tcs=".$tcs."
                  WHERE po_order_no = '" . $orderno . "'";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $query);
        $sql = "DELETE FROM lead_traveller WHERE lt_orderno = '" . $orderno . "'";
        $result = $dbio->getSelect($dbconn, $sql);
        foreach ($travellerArray as $item) {
            if ($obj->type !== "sell") {
                $q = "INSERT INTO lead_traveller(lt_srno, lt_orderno, lt_traveller, lt_title, lt_name, lt_mobile, lt_email, lt_pancard, lt_passport, lt_timestamp, lt_ordertype,lt_dob)
                    VALUES ((SELECT po_srno FROM lead_order WHERE po_order_no = '" . $orderno . "'), '" . $orderno . "', " . $item->srno . ", '', '" . $item->name .
                    "', '', '', UPPER('" . $item->pancard . "'), UPPER('" . $item->passport . "'), now(), '" . $obj->type . "','" . substr($item->dob, 0, 10) . "')";
            } else {
                $q = "INSERT INTO lead_traveller (lt_srno, lt_orderno, lt_title, lt_name, lt_mobile, lt_email, lt_pancard, lt_timestamp, lt_idtype, lt_idnum, lt_ordertype, lt_nationality,lt_dob)
                VALUES ((SELECT po_srno FROM lead_order WHERE po_order_no = '" . $orderno . "'),'" . $orderno . "', '',
                '" . $item->name . "', '', '', '',  now(), '" . $item->idType . "', UPPER('" . $item->idNum . "'), 'sell', '" . $item->nationality . "','" . substr($item->dob, 0, 10) . "')";
            }
            $res = $dbio->getSelect($dbconn, $q);
            $this->msg = "Info Inserted!";
        }
        $que = "DELETE FROM lead_product WHERE lp_orderno = '" . $orderno . "'";
        $result = $dbio->getSelect($dbconn, $que);
        foreach ($productArray as $value) {
            $query = "INSERT INTO lead_product (lp_srno, lp_orderno, lp_travellernum, lp_isd, lp_producttype, lp_quantity, lp_rateofexchange, lp_totalamt, lp_sumtotalamount, lp_timestamp)
                      VALUES ((SELECT po_srno FROM lead_order WHERE po_order_no = '" . $orderno . "'), '" . $orderno . "', '" . $value->traveller . "', '" . $value->currencyOpt . "', '" . $value->productType . "'
                    , " . $value->forexQuant . ", " . $value->rate . ", " . $value->total . ", " . $amountToPay . ", now())";
            $res = $dbio->getSelect($dbconn, $query);
        }
        $dbio->closeConn($dbconn);
    }


    public function updatePlaceOrder($dbio, $obj)
    {
        $userId = $obj->userId;
        $currency = $obj->currency;
        $product = $obj->product;
        $forexQuant = $obj->forexQuant;
        $totalAmt = $obj->total;
        $taxable = $obj->taxableAmt;
        $rate = $obj->rate;
        $handlingcharge = 100;
        $gst = $taxable * 0.18;
        $sumamount = $handlingcharge + $gst + $totalAmt;
        $roundAmt = round($sumamount);
        $round = $roundAmt - $sumamount;

        $sql = "UPDATE lead_order SET po_currency='" . $currency . "',po_quantity=" . $forexQuant . ",po_buyrate='" . $rate . "',
                po_totalamt='" . $totalAmt . "',po_roundAmt=" . $roundAmt . ",po_taxableval=" . $taxable . ", po_sumamount = '" . $sumamount . "', po_round = '" . number_format($round, 2) . "' WHERE po_status='D' AND
                po_usersrno = (SELECT user_srno FROM user_login WHERE user_id = '" . $userId . "')";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        $query = "SELECT po_totalamt, po_sumamount, po_product FROM lead_order WHERE po_status = 'D' AND po_usersrno = (SELECT user_srno FROM user_login WHERE user_id = '" . $userId . "')";
        $res = $dbio->getSelect($dbconn, $query);
        if (mysqli_num_rows($res) > 0) {
            $row = mysqli_fetch_row($res);
            $this->totalAmt = $row[0];
            $this->sumAmt = $row[1];
            $this->msg = "PO table updated";
        }
        $dbio->closeConn($dbconn);
    }


    private function insertOrderAddress($obj)
    {
        return "DELETE FROM lead_delivery WHERE ld_orderno IN (SELECT po_order_no FROM lead_order WHERE 
            po_usersrno = (SELECT user_srno FROM user_login WHERE user_id = '" . $obj->userId . "'));
            INSERT INTO lead_delivery (ld_orderno ,ld_deliverymode, ld_address, ld_city, ld_state, ld_country, ld_branchaddress, ld_branchname, ld_timestamp)
            VALUES ('" . $obj->orderno . "', '" . $obj->mode . "', '" . $obj->deliveryAdd . "','" . $obj->deliveryCity . "', '" . $obj->deliveryState . "'
            , '" . $obj->deliveryCountry . "', '" . $obj->branchAdd . "', '" . $obj->branchName . "', now())";
    }


    public function insertDeliveryDetails($dbio, $obj)
    {
        $totalamt = 0;
        $amountToPay = 0;
        if ($obj->mode == 'door-delivery') {
            $query = "SELECT po_handlingcharge, po_sumamount, po_roundAmt FROM lead_order WHERE po_order_no = '" . $obj->orderno . "'";
            $dbconn = $dbio->getConn();
            $res = $dbio->getSelect($dbconn, $query);
            if ($res) {
                if (mysqli_num_rows($res) > 0) {
                    $row = mysqli_fetch_row($res);
                    $totalamount = $row[1] * 1 + 199;
                    $roundamount = round($totalamount);
                    $roundfig = round($roundamount - $totalamount, 2);
                    $qry = "UPDATE lead_order SET po_handlingcharge = 299, po_round = " . $roundfig . ", po_roundAmt=" . $roundamount . " WHERE po_order_no = '" . $obj->orderno . "'";
                    $result = $dbio->getSelect($dbconn, $qry);

                    $sql = "UPDATE lead_product SET lp_sumtotalamount = " . $roundamount . " WHERE lp_orderno = '" . $obj->orderno . "'";
                    $result = $dbio->getSelect($dbconn, $sql);
                }
            }
            $dbio->closeConn($dbconn);
        }

        $sql = "DELETE FROM lead_delivery WHERE ld_orderno = '" . $obj->orderno . "';
                INSERT INTO lead_delivery (ld_orderno ,ld_deliverymode, ld_address, ld_city, ld_state, ld_country, ld_branchaddress, ld_branchname, ld_timestamp)
                VALUES ('" . $obj->orderno . "', '" . $obj->mode . "', '" . $obj->deliveryAddress . "','" . $obj->deliveryCity . "', '" . $obj->deliveryState . "'
                , '" . $obj->deliveryCountry . "', '" . $obj->branchAdd . "', '" . $obj->branchName . "', now())";
        $dbcon = $dbio->getConn();
        $result = $dbio->batchQueries($dbcon, $sql);
        $dbio->closeConn($dbcon);

        $q = "SELECT po_roundAmt FROM lead_order WHERE po_order_no = '" . $obj->orderno . "'";
        $dbconn = $dbio->getConn();
        $res = $dbio->getSelect($dbconn, $q);
        $dbio->closeConn($dbconn);
        if (mysqli_num_rows($res) > 0) {
            $row = mysqli_fetch_row($res);
            $totalamt = $row[0];
            if ($obj->paymentMode == 'FP' || $obj->paymentMode == 'COD') {
                $amountToPay = $row[0];
            } else {
                $amountToPay = $row[0] * 0.02;
            }
        }

        $sql = "DELETE FROM master_account_details WHERE ac_orderno = '" . $obj->orderno . "';
                INSERT INTO master_account_details (ac_srno, ac_paymentmode, ac_bankname, ac_bankaccnum, ac_isverified, ac_timestamp, ac_orderno, ac_ifsc, ac_totalamount, ac_amounttobepaid, ac_ordertype)
                    SELECT (SELECT COALESCE( MAX(ac_srno),0)+1 FROM master_account_details) AS ac_srno, '" . $obj->paymentMode . "', '" . $obj->clientBank . "', '" . $obj->clientAccount . "'
                    , 0, now(), '" . $obj->orderno . "', '" . $obj->IFSC . "', " . $totalamt . ", " . $amountToPay . ", 'BUY'";
        $dbconn = $dbio->getConn();
        $result = $dbio->batchQueries($dbconn, $sql);
        $dbio->closeConn($dbconn);

        $bankactive = 0;
        $dbconn = $dbio->getConn();
        if ($obj->paymentMode != "COD") {
            $q = "SELECT bm_active FROM bank_master WHERE bm_code = " . $obj->clientBank . "";
            $result = $dbio->getSelect($dbconn, $q);
            if (mysqli_num_rows($result) > 0) {
                $row = mysqli_fetch_row($result);
                $bankactive = $row[0];
            }
        }
        $qry = "UPDATE lead_order SET po_paymenttype = '" . $obj->paymentMode . "', po_paymentgateway = IF(" . $bankactive . "=1, 'C', 'P') WHERE po_order_no = '" . $obj->orderno . "'";
        $result = $dbio->getSelect($dbconn, $qry);
        $dbio->closeConn($dbconn);
        $this->msg = 1;
        // if($obj->paymentMode == "PP" or $obj->paymentMode == "FP"){
        // }else if($obj->paymentMode == "COD"){
        //     $sql = "DELETE FROM master_account_details WHERE ac_orderno = '".$obj->orderno."'";
        //     $dbconn = $dbio->getConn();
        //     $result = $dbio->getSelect($dbconn, $sql);
        //     $dbio->closeConn($dbconn);
        // }
    }


    public function getBankDetails($dbio, $orderno)
    {
        $sql = "SELECT ac_bankaccnum, ac_bankname, ac_ifsc, ac_paymentmode FROM master_account_details WHERE ac_orderno = '" . $orderno . "'";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        $dbio->closeConn($dbconn);
        if (mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_row($result);
            $this->accnum = $row[0];
            $this->bankcode = $row[1];
            $this->ifsc = $row[2];
            $this->paymode = $row[3];
        }
    }


    public function getAllDetails($dbio, $orderno)
    {
        $traveller = array();
        $product = array();
        $header = array();

        $query = "SELECT lt_name, lt_passport, lt_pancard, lt_traveller FROM lead_traveller WHERE lt_orderno ='" . $orderno . "'";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $query);
        if ($result) {
            while ($row = mysqli_fetch_assoc($result)) {
                $traveller[] = $row;
            }
        }

        $qry = "SELECT lp_travellernum, lp_isd, lp_producttype, lp_quantity, lp_rateofexchange, lp_totalamt, lp_sumtotalamount, isd_name FROM lead_product
                LEFT OUTER JOIN master_isd ON lp_isd = isd_code
                WHERE lp_orderno ='" . $orderno . "'";
        $result = $dbio->getSelect($dbconn, $qry);
        if ($result) {
            while ($row = mysqli_fetch_assoc($result)) {
                $product[] = $row;
            }
        }

        $qry = "SELECT po_order_no, po_traveldate, po_travelpurpose, ld_deliverymode, ld_address, ld_city, purpose_name, ld_branchname, ld_branchaddress, po_paymenttype, ml_branch
                FROM lead_order 
                LEFT OUTER JOIN lead_delivery  ON po_order_no  = ld_orderno
                LEFT OUTER JOIN master_purpose ON po_travelpurpose = purpose_id
                LEFT OUTER JOIN master_location ON ml_branchcd = ld_branchname
                WHERE po_order_no = '" . $orderno . "'";
        $result = $dbio->getSelect($dbconn, $qry);
        if ($result) {
            while ($row = mysqli_fetch_assoc($result)) {
                $header[] = $row;
            }
        }



        return array("traveller" => $traveller, "product" => $product, "header" => $header);

    }


    public function getDocuments($dbio, $sid, $orderno)
    {
        $sql = "SELECT master_document.m_documents,master_purpose_doc_link.docid FROM master_purpose_doc_link LEFT OUTER JOIN 
                master_document ON master_document.m_srno = master_purpose_doc_link.docid WHERE master_purpose_doc_link.purposeid=(SELECT po_travelpurpose FROM lead_order 
                WHERE po_order_no = '" . $orderno . "')";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        $dbio->closeConn($dbconn);
        if ($result) {
            $array = array();
            while ($row = mysqli_fetch_assoc($result)) {
                $array[] = $row;
            }
        }
        return $array;
    }


    public function getActiveBankName($dbio)
    {
        $bankList = array();
        $sql = "SELECT bm_code, bm_desc, bm_active FROM bank_master";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if ($result) {
            while ($row = mysqli_fetch_assoc($result)) {
                $bankList[] = $row;
            }
        }
        return $bankList;
        $dbio->closeConn($dbconn);
    }


    public function sendOrderMail($dbio, $obj)
    {
        include "placeordermail_a.php";
        //date_default_timezone_set('Asia/Kolkata');
        //$curtime = date('d-m-Y H:i:s');
        $orderno = $obj->orderno;
        $sql = "UPDATE lead_order SET po_status = '1', po_isplaced = 1, po_ispaid = 0 WHERE po_order_no = '" . $orderno . "'";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        $dbio->closeConn($dbconn);
        $usersrno = $_SESSION["userSrno"];
        $userid = $_SESSION["userId"];
        $this->msg = 1;
        sendPlaceOrderMail($dbio, $orderno, $usersrno, $userid);
    }



    public function getOrderHistory($dbio, $obj)
    {
        $orderHistory = array();
        $statuslist = array();
        $dbconn = $dbio->getConn();
        $query = "SELECT ms_code, ms_status FROM master_status";
        $res = $dbio->getSelect($dbconn, $query);
        if ($res) {
            while ($row = mysqli_fetch_assoc($res)) {
                $statuslist[] = $row;
            }
        }

        $sql = "SELECT po_order_no, po_ordertype,po_ispaid, po_promocode, lt_name, po_status, ms_status, rs_name,DATE_FORMAT(rs_timestamp, '%Y-%m-%d') AS rs_date, 
                    DATE_FORMAT(lt_timestamp, '%Y-%m-%d') AS lt_date, COALESCE(al_name, '') AS al_name, COALESCE(al_depdate, '') AS al_date,po_date FROM lead_order
                    LEFT OUTER JOIN lead_traveller ON po_order_no = lt_orderno
                    LEFT OUTER JOIN remit_sender ON po_order_no = rs_orderno
                    LEFT OUTER JOIN master_status ON po_status = ms_code
                    LEFT OUTER JOIN asego_leads ON po_order_no = al_orderno
                    WHERE po_isplaced=1 AND po_usersrno = (SELECT user_srno FROM user_login WHERE user_id = '" . $obj->userId . "') ORDER BY po_date desc";
        $result = $dbio->getSelect($dbconn, $sql);
        if ($result) {
            while ($row = mysqli_fetch_assoc($result)) {
                $orderHistory[] = $row;
            }
        }
        return array("orderhistory" => $orderHistory, "statuslist" => $statuslist);
        $dbio->closeConn($dbconn);
    }


    public function getBuyHistory($dbio, $orderno)
    {
        $traveller = array();
        $product = array();
        $transaction = array();
        $statuslist = array();
        $header = array();
        $query = "SELECT po_order_no, po_ordertype, user_name,po_name, po_mobile, po_traveldate, po_paymenttype, po_ispaid,po_product, ld_deliverymode, 
		        ld_address, ld_pincode, ld_branchaddress, purpose_name, ms_status, po_promocode,po_date,
		        po_quantity, po_buyrate, isd_name, po_totalamt, po_roundAmt, user_mobile,
                ac_amountpaid, ac_amountpending ,ml_branch 
                FROM lead_order 
                LEFT OUTER JOIN user_login ON po_usersrno = user_srno
                LEFT OUTER JOIN master_purpose ON po_travelpurpose = purpose_id
                LEFT OUTER JOIN lead_delivery  ON po_order_no  = ld_orderno
                LEFT OUTER JOIN master_status ON po_status = ms_code
                LEFT OUTER JOIN master_isd ON po_currency = isd_code
                LEFT OUTER JOIN master_account_details ON ac_orderno = po_order_no
                Left outer join master_location ON ml_branchcd=po_location
                WHERE po_order_no ='" . $orderno . "'";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $query);
        if ($result) {
            while ($row = mysqli_fetch_assoc($result)) {
                $header[] = $row;
            }
        }

        $query2 = "SELECT lt_name, lt_passport, lt_pancard, lt_traveller, lt_idnum, lt_idtype FROM lead_traveller WHERE lt_orderno ='" . $orderno . "'";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $query2);
        if ($result) {
            while ($row = mysqli_fetch_assoc($result)) {
                $traveller[] = $row;
            }
        }


        $qry = "SELECT lp_travellernum, lp_isd, lp_producttype, lp_quantity, lp_rateofexchange, lp_totalamt, lp_sumtotalamount, isd_name FROM lead_product
                LEFT OUTER JOIN master_isd ON lp_isd = isd_code
                WHERE lp_orderno ='" . $orderno . "'";
        $result = $dbio->getSelect($dbconn, $qry);
        if ($result) {
            while ($row = mysqli_fetch_assoc($result)) {
                $product[] = $row;
            }
        }

        $query3 = "SELECT ms_code, ms_status FROM master_status";
        $res = $dbio->getSelect($dbconn, $query3);
        if ($res) {
            while ($row = mysqli_fetch_assoc($res)) {
                $statuslist[] = $row;
            }
        }

        $dbio->closeConn($dbconn);
        return array("traveller" => $traveller, "product" => $product, "header" => $header, "transaction" => $transaction, "statuslist" => $statuslist);
    }


    public function getDetailsForPaytmGateway($dbio, $orderno)
    {

        $amttopay = 0;
        $name = '';
        $id = '';
        $mobile = '';
        $active = '';
        $sql = "SELECT  ac_amounttobepaid FROM master_account_details   WHERE ac_orderno = '" . $orderno . "'";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if ($result) {
            $row = mysqli_fetch_row($result);
            $amttopay = $row[0];
        }

        $qry = "SELECT user_name, user_id, user_mobile FROM user_login WHERE user_id = '" . $_SESSION["userId"] . "'";
        $result = $dbio->getSelect($dbconn, $qry);
        if ($result) {
            $row = mysqli_fetch_row($result);
            $name = $row[0];
            $id = $row[1];
            $mobile = $row[2];
        }

        $q = "SELECT bm_active FROM bank_master  LEFT OUTER JOIN master_account_details ON bm_code = ac_bankname WHERE ac_orderno = '" . $orderno . "'";
        $result = $dbio->getSelect($dbconn, $q);
        if (mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_row($result);
            $active = $row[0];
        } else {
            $active = 0;
        }

        $dbio->closeConn($dbconn);
        return array("amount" => $amttopay, "name" => $name, "userid" => $id, "mobile" => $mobile, "active" => $active);
    }


    public function getUsdRate($dbio, $branchcd)
    {
        $sql = "SELECT isd_code, mrc_product, isd_name
                , ROUND(CASE 
                    WHEN mrc_ratetype = 'F' THEN mrc_buy 
                    WHEN mrc_ratetype = 'M' THEN  or_sellrate + mrc_buy
                    WHEN mrc_ratetype = 'P' THEN (or_sellrate*mrc_buy/100)+or_sellrate
                    END, 3) AS mrc_buy
                , ROUND(CASE WHEN mrc_ratetype = 'F' THEN mrc_sell 
                    WHEN mrc_ratetype = 'M' THEN or_buyrate - mrc_sell
                    WHEN mrc_ratetype = 'P' THEN or_buyrate - (or_buyrate*mrc_sell/100)
                    END, 3) AS mrc_sell 
                FROM  
                (SELECT isd_code, mrc_ratetype,mrc_buy, mrc_sell , or_sellrate, or_buyrate, mrc_product, isd_name
                FROM master_isd
                LEFT OUTER JOIN master_rate_config ON mrc_isdcd= isd_code AND mrc_active = 1 AND mrc_product='CN'
                LEFT OUTER JOIN 
                (SELECT or_isd,or_sellrate,or_buyrate FROM master_online_rates WHERE or_refno = (SELECT MAX(or_refno) FROM master_online_rates)) AS mor 
                ON isd_code = or_isd
                WHERE isd_active = 1 AND isd_cash = 1 AND 
                mrc_branchcd = " . $branchcd . " AND isd_code = 'USD'
                ) AS t";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        $dbio->closeConn($dbconn);
        if (mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_row($result);
            $this->USDRate = $row[3];
        }
    }
    // public function sendPlaceOrderMail($dbio, $orderno){
    //     $dbconn= $dbio->getConn();
    //     $qry = "SELECT user_name FROM user_login WHERE user_id = '".$_SESSION["userId"]."'";
    //     $res = $dbio->getSelect($dbconn, $qry);
    //     $dbio->closeConn($dbconn);
    //     if(mysqli_num_rows($res) > 0){
    //         $row = mysqli_fetch_row($res);
    //         $ml = "<html>";
    //         $ml = $ml."<body>";
    //         $ml = $ml."Order Placed<br>
    //                 Dear ".$row[0]." <br>
    //                 You order has been placed. <br>
    //                 Order Number: <b>".$orderno."</b> <br>
    //                 <b>Thanks & Regards <br> Administrator </b>";
    //         $ml = $ml."</body>";
    //         $ml = $ml."</html>";
    //         require_once('mail_c.php');         
    //         $m = new Mymail();
    //         $msent = $m->sendMail('ORDER PLACED',$ml,$_SESSION["userId"],'','','');
    //         $msent = true;          
    //         if($msent){
    //             $this->data = array("msg"=>"1");
    //         }else{
    //             $this->data = array("msg"=>"Please contact to administrator.");
    //         }
    //     }
    // }


}



    
?>