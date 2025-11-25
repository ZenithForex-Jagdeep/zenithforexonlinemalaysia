<?php

    class MisUpload {

        public function getMisDetails($dbio){
            $isdlist = array();
            $srclist = array();
            $statuslist = array();
            $loclist = array();
            $pglist = array();
            $sql = "SELECT isd_code, isd_name FROM master_isd WHERE isd_active = 1 AND isd_offline_active=1";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            if($result){
                while($row = mysqli_fetch_assoc($result)){
                    $isdlist[] = $row;
                }
            }

            $qry = "SELECT ms_code, ms_status FROM master_status";
            $result = $dbio->getSelect($dbconn, $qry);
            if($result){
                while($row = mysqli_fetch_assoc($result)){
                    $statuslist[] = $row;
                }
            }

            $qry_t = "SELECT pg_srno, pg_gatename FROM master_payment_gate";
            $result = $dbio->getSelect($dbconn, $qry_t);
            if($result){
                while($row = mysqli_fetch_assoc($result)){
                    $pglist[] = $row;
                }
            }
            
            $sql_t = "SELECT src_srno, src_name, src_ordereditable FROM master_lead_source WHERE src_active= 1 ORDER BY src_displayorder ";
            $result_t = $dbio->getSelect($dbconn, $sql_t);
            if($result_t){
                while($row = mysqli_fetch_assoc($result_t)){
                    $srclist[] = $row;
                }
            }

            $sql_p = "SELECT ml_branchcd, ml_branch FROM master_location WHERE ml_active =1";
            $result_p = $dbio->getSelect($dbconn, $sql_p);
            if($result_p){
                while($row = mysqli_fetch_assoc($result_p)){
                    $loclist[] = $row;
                }
            }
            return array("isdlist" => $isdlist, "srclist"=> $srclist, "statuslist"=>$statuslist, "pglist"=>$pglist, "loclist"=>$loclist);
            $dbio->closeConn($dbconn);
        }
        

        public function getCalculatedTcs($dbio, $amount) {
            $sql = "SELECT mt_minamount, mt_percent, mt_fromdate, mt_todate FROM master_tcs WHERE mt_active = 1";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            if(mysqli_num_rows($result)>0){
                $row = mysqli_fetch_row($result);
                if($amount > $row[0]){
                    if($row[2] < date("Y-m-d") && $row[3] > date("Y-m-d")){
                        $tcsval = ($amount*1) - ($row[0]*1);
                        $this->tcs = $tcsval*$row[1]/100;
                        $this->msg = 1;
                    }else {
                        $this->msg = "D";
                        $this->tcs=0;
                    }
                }else {
                    $this->msg = "A";
                    $this->tcs=0;
                }
            }
            $dbio->closeConn($dbconn);
        }


        private function insertPaymentDetail($dbio, $obj, $sumamt, $pendingamt, $orderno){
            $paid = $obj->paymentpaid == ""?0:$obj->paymentpaid;
            $qry = "DELETE FROM master_account_details WHERE ac_srno = '".$obj->ammsrno."';
                    INSERT INTO master_account_details (ac_srno, ac_ordertype, ac_paymentmode, ac_bankname, ac_bankaccnum, ac_ifsc, ac_bankcheque, ac_isverified, ac_timestamp
                    , ac_orderno, ac_totalamount, ac_amounttobepaid, ac_amountpaid, ac_amountpending, ac_paydate, ac_bankrefno, ac_authcode)
                    SELECT (SELECT MAX(ac_srno) from master_account_details) + 1, '".$obj->ordertype."',  '', '', '', '', '', 1, now(), '".$orderno."', ".$sumamt."
                    , ".$sumamt.", ".round($paid).", ".round($pendingamt).", '".$obj->paymentDate."', '".$obj->refnumber."', '".$obj->authCode."'";
            $dbconn = $dbio->getConn();
            $result = $dbio->batchQueries($dbconn, $qry);
            $dbio->closeConn($dbconn);
        }

        private function insertTraveller($dbio, $obj, $srno, $orderno){
            $sql = "DELETE FROM lead_traveller WHERE lt_srno = ".$srno.";
                    INSERT INTO lead_traveller (lt_orderno, lt_srno, lt_ordertype, lt_traveller, lt_title, lt_name, lt_mobile, lt_email, 
                    lt_pancard, lt_passport, lt_timestamp, lt_idtype, lt_idnum, lt_nationality)
                    VALUES ('".$orderno."', ".$srno.", '".$obj->ordertype."', 1, '', '".$obj->name."', '".$obj->mobile."', '".$obj->email."', '', '', now(),
                    '','','')";
            $dbconn = $dbio->getConn();
            $result = $dbio->batchQueries($dbconn, $sql);
            $dbio->closeConn($dbconn);
        }

        public function checkOrderNo($dbio, $obj){
            if($obj->optype == "E"){
                $qr = "SELECT po_order_no FROM lead_order WHERE po_order_no ='".$obj->orderno."' AND po_srno != ".$obj->srno."";
            }else {
                $qr = "SELECT po_order_no FROM lead_order WHERE po_order_no ='".$obj->orderno."'";
            }
                $dbconn = $dbio->getConn();
                $result= $dbio->getSelect($dbconn, $qr);
                $dbio->closeConn($dbconn);
                if(mysqli_num_rows($result)>0){
                    $this->msg = 2;
                }else {
                    $this->msg = 1;
                }
        }
        

        public function addNewProduct($dbio, $obj){
            $permitted_chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            $uniquekey =substr(str_shuffle($permitted_chars), 0, 5);
            $key = "";
            $profit = 0;
            if($obj->srno ==""){
                $srno = 'NULL';
            }else {
                $srno = $obj->srno;
            }
            $totalinr = $obj->custrate * $obj->quantity;
            if($obj->ordertype == "sell"){
                $profit = ($obj->ibr*$obj->quantity) - ($obj->custrate * $obj->quantity);
            }else {
                $profit = ($obj->custrate*$obj->quantity) - ($obj->procurementrate * $obj->quantity);
            }

            if($obj->productKey == ""){
                $key = $uniquekey;
            }else {
                $key = $obj->productKey;
            }
            
            $sql = "INSERT INTO mis_product (tp_srno, tp_userno, tp_currency, tp_product, tp_quantity, tp_settlementrate, tp_custrate, tp_ibr, tp_productkey, tp_forexinr, tp_profit, tp_ordersrno)
                SELECT (SELECT COALESCE(MAX(tp_srno), 0) FROM mis_product) +1, ".$_SESSION["userSrno"].", '".$obj->currency."', '".$obj->product."', ".$obj->quantity."
                , ".$obj->procurementrate.", ".$obj->custrate.", ".$obj->ibr.", '".$key."', ".$totalinr.", ".$profit.", ".$srno."";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            if($result){
                $this->msg = 1;
            }else {
                $this->msg = 0;
            }
            $qry = "SELECT tp_srno, tp_userno, tp_currency, tp_product, tp_quantity, tp_settlementrate, tp_custrate, tp_ibr, tp_productkey, tp_forexinr, tp_profit
                    FROM mis_product WHERE tp_productkey='".$key."'";
            $res = $dbio->getSelect($dbconn, $qry);
            if(mysqli_num_rows($res)>0){
                while($row =mysqli_fetch_assoc($res)){
                    $this->product[] = $row;
                }
                $this->prodkey = $key;
            }else {
                $this->product = array();
            }
            $dbio->closeConn($dbconn);
        }


        public function deleteProduct($dbio, $obj){
            $product = array();
            $sql = "DELETE FROM mis_product WHERE tp_srno = ".$obj->srno."";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            if($result){
                $qry = "SELECT tp_srno, tp_userno, tp_currency, tp_product, tp_quantity, tp_settlementrate, tp_custrate, tp_ibr, tp_productkey, tp_forexinr, tp_profit
                        FROM mis_product WHERE tp_productkey='".$obj->key."'";
                $res = $dbio->getSelect($dbconn, $qry);
                if($res){
                    while($row =mysqli_fetch_assoc($res)){
                        $product[] = $row;
                    }
                }
            }
            return $product;
            $dbio->closeConn($dbconn);
        }


        public function insertMisDetails($dbio, $obj, $productArr){    
            if(count($productArr)>0){
                $firstProd = $productArr[0];
            }
            $sumamt = $obj->totalinvoice*1;
            $roundfig = round($sumamt) - $sumamt;
            $pendingamt = $sumamt - $obj->paymentpaid*1;
            $randomid = date("ymdhis");
            $orderno = $obj->orderno == ""?$randomid.'/00':$obj->orderno;
            $dbconn = $dbio->getConn();
            $srno = '';
            $qry = "INSERT INTO lead_activity_log (al_orderno, al_usersrno, al_changes, al_changedate)
                    VALUES ('".$orderno."', ".$_SESSION["userSrno"].", 'Last Updated By', NOW())";
            $res = $dbio->getSelect($dbconn, $qry);

                if($obj->optype == "A"){
                    $sql = "INSERT INTO lead_order (po_srno, po_leadsource, po_ordertype, po_productcount, po_product_2, po_card_currency
                        , po_card_quantity, po_card_buyrate, po_totalamt, po_handlingcharge, po_nostrocharge, po_taxableval, po_CGST, po_SGST, po_IGST
                        , po_sumamount, po_round, po_roundAmt, po_date, po_order_no, po_refno, po_nofpassenger, po_nofcurrency, po_travelpurpose, po_country, 
                        po_traveldate, po_usersrno, po_paymenttype, po_location, po_isplaced, po_paymentgateway, po_promocode, po_ispaid, po_profit, po_tcs, po_name, po_mobile
                        , po_email, po_manuallead, po_leadaddby, po_status, po_product, po_currency, po_quantity, po_buyrate, po_donetimestamp)
                        SELECT (SELECT MAX(po_srno) FROM lead_order) + 1, ".$obj->vendor.", '".$obj->ordertype."', ".count($productArr)."
                        , '','', 0, 0, ".$obj->total.", ".$obj->othercharges.", 0, 0, ".$obj->gst."
                        , ".$obj->gst.", ".$obj->gst.", ".$obj->totalinvoice.", ".$roundfig.", ".round($obj->totalinvoice).", now(), '".$orderno."', CONCAT('ZFX', (SELECT MAX(po_srno) FROM lead_order) + 1)
                        , 1, 0, '', 0, '".$obj->date."', 0, '".$obj->paymode."', ".$obj->location.", 1, '".$obj->paymentstatus."', '', CASE WHEN '".$obj->paymode."' = 'FP' THEN 1 ELSE 0 END AS paystatus
                        , ".$obj->profit.", ".$obj->tcs.", '".$obj->name."', '".$obj->mobile."', '".$obj->email."', 1, ".$_SESSION["userSrno"].", '".$obj->status."', ";
                        if(count($productArr)>0){
                            if($obj->status == '14'){
                                $sql = $sql."  '".$firstProd->tp_product."', '".$firstProd->tp_currency."', ".$firstProd->tp_quantity.", ".$firstProd->tp_custrate.", NOW()";
                            }else {
                                $sql = $sql."  '".$firstProd->tp_product."', '".$firstProd->tp_currency."', ".$firstProd->tp_quantity.", ".$firstProd->tp_custrate.", NULL";
                            }
                            
                        }else {
                            if($obj->status == '14'){
                                $sql = $sql." '','',0,0, NOW()";
                            }else {
                                $sql = $sql." '','',0,0, NULL";
                            }
                        }
                        $result = $dbio->getSelect($dbconn, $sql);
                        if($result){
                            $this->msg = 1;
                        }else {
                            $this->msg = 0;
                        }

                    $q = "SELECT po_srno, po_order_no FROM lead_order WHERE po_order_no='".$orderno."'";
                    $res = $dbio->getSelect($dbconn, $q);
                    $row = mysqli_fetch_row($res);
                    if($obj->submittype == "S"){
                        $this->ordersrno = $row[0];
                        $this->orderno = $row[1];
                    }
                    if(count($productArr)>0){
                        $qry = "UPDATE mis_product SET tp_orderno ='".$orderno."', tp_ordersrno = ".$row[0]." WHERE tp_productkey = '".$obj->key."'";
                        $result = $dbio->getSelect($dbconn, $qry);
                    }
                    $srno = $row[0];
                }else {
                    $srno = $obj->srno;
                    $sql = "UPDATE lead_order SET
                    po_leadsource = '".$obj->vendor."' , po_ordertype = '".$obj->ordertype."' ,po_productcount = ".count($productArr)." ,po_totalamt = ".$obj->total." , 
                    po_handlingcharge = ".$obj->othercharges." ,po_CGST = ".$obj->gst." ,po_SGST = ".$obj->gst." ,po_IGST = ".$obj->gst." , 
                    po_sumamount = ".$obj->totalinvoice." ,po_round = ".$roundfig." ,po_roundAmt = ".round($obj->totalinvoice).",po_status = '".$obj->status."' ,po_paymenttype = '".$obj->paymode."' , 
                    po_ispaid = IF('".$obj->paymode."'='FP', 1, 0),  po_order_no = '".$obj->orderno."',
                    po_profit = ".$obj->profit." ,po_tcs = ".$obj->tcs." ,po_name = '".$obj->name."' ,po_mobile = '".$obj->mobile."' ,po_email = '".$obj->email."',
                    po_paymentgateway='".$obj->paymentstatus."', po_location = ".$obj->location.", ";
                    if(count($productArr)>0){
                        if($obj->status == "14"){
                            $sql = $sql." po_donetimestamp = NOW(), po_product = '".$firstProd->tp_product."' ,po_currency = '".$firstProd->tp_currency."', po_quantity = ".$firstProd->tp_quantity."
                                    ,po_buyrate = ".$firstProd->tp_custrate." WHERE po_srno = ".$srno." ;";
                        }else {
                            $sql = $sql." po_donetimestamp = NULL, po_product = '".$firstProd->tp_product."' ,
                                    po_currency = '".$firstProd->tp_currency."', po_quantity = ".$firstProd->tp_quantity." ,po_buyrate = ".$firstProd->tp_custrate." WHERE po_srno = ".$srno." ;";
                        }
                    $qry = "UPDATE mis_product SET tp_orderno ='".$orderno."' WHERE tp_ordersrno = '".$srno."'";
                    $result = $dbio->getSelect($dbconn, $qry);
                    }else {
                        if($obj->status == "14"){
                            $sql = $sql." po_donetimestamp = NOW(), po_product = '', po_currency = '', po_quantity = 0 ,po_buyrate = 0 WHERE po_srno = ".$srno." ;";
                        }else {
                            $sql = $sql." po_donetimestamp = NULL, po_product = '', po_currency = '', po_quantity = 0 ,po_buyrate = 0 WHERE po_srno = ".$srno." ;";
                        }
                    }
                    $dbconn = $dbio->getConn();
                    $result = $dbio->getSelect($dbconn, $sql);
                    if($result){
                        $this->msg = 1;
                    }else {
                        $this->msg = 0;
                    }
                }             
                
                $qry = "DELETE FROM lead_product WHERE lp_srno = ".$srno.";";
                $result = $dbio->getSelect($dbconn, $qry);
                $dbio->closeConn($dbconn);
                if(count($productArr)>0){
                    foreach ($productArr as $item) {
                        $query = "INSERT INTO lead_product(lp_srno, lp_orderno, lp_travellernum, lp_isd, lp_producttype, lp_quantity, lp_rateofexchange, lp_totalamt, lp_sumtotalamount, lp_timestamp, lp_pancard
                                , lp_ibr, lp_settlementrate)
                                VALUES (".$srno.", '".$orderno."', 1, '".$item->tp_currency."', '".$item->tp_product."', ".$item->tp_quantity.", ".$item->tp_custrate.",
                                 ".$item->tp_forexinr.", ".round($obj->totalinvoice).", now(), '', ".$item->tp_ibr.",
                                ".$item->tp_settlementrate.")";
                        $dbconn = $dbio->getConn();
                        $result = $dbio->getSelect($dbconn, $query);
                        $dbio->closeConn($dbconn);
                    }
                }else {
                    $query = "INSERT INTO lead_product(lp_srno, lp_orderno, lp_travellernum, lp_isd, lp_producttype, lp_quantity, lp_rateofexchange, lp_totalamt, lp_sumtotalamount, lp_timestamp, lp_pancard
                            , lp_ibr, lp_settlementrate)
                            VALUES (".$srno.", '".$orderno."', 1, '', '', 0, 0, 0, 0, now(), '', 0,0)";
                    $dbconn = $dbio->getConn();
                    $result = $dbio->getSelect($dbconn, $query);
                    $dbio->closeConn($dbconn);
                }
                $this->insertTraveller($dbio, $obj, $srno, $orderno);
                $this->insertPaymentDetail($dbio, $obj, $sumamt, $pendingamt, $orderno);

        }


        public function getLeadType($dbio, $orderno){
            $sql = "SELECT po_manuallead FROM lead_order WHERE po_order_no = '".$orderno."'";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            if($result){
                $row = mysqli_fetch_row($result);
                $this->leadtype = $row[0];
            }
            $dbio->closeConn($dbconn);
        }


        public function getManualOrderLog($dbio, $orderno){
            $list= array();
            $statuslist = array();
            $productlist = array();
            $sql = "SELECT src_name, po_order_no, po_ordertype, po_product, isd_name, po_quantity, po_buyrate, po_totalamt, po_handlingcharge, po_nostrocharge,
                    po_CGST, po_sumamount, po_roundAmt, ms_status, po_tcs, po_name, po_email, po_mobile, po_profit FROM lead_order 
                    LEFT OUTER JOIN master_lead_source ON po_leadsource = src_srno
                    LEFT OUTER JOIN master_status ON po_status = ms_code
                    LEFT OUTER JOIN master_isd ON po_currency = isd_code 
                    WHERE po_order_no='".$orderno."'";
            
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            if($result){
                while($row = mysqli_fetch_assoc($result)){
                    $list[] = $row;
                }
            }

            $qry = "SELECT isd_name, lp_producttype, lp_quantity, lp_rateofexchange, lp_totalamt, lp_sumtotalamount FROM lead_product 
                    LEFT OUTER JOIN master_isd ON lp_isd = isd_code
                    WHERE lp_orderno = '".$orderno."'";
            $result = $dbio->getSelect($dbconn, $qry);
            if($result){
                while($row = mysqli_fetch_assoc($result)){
                    $productlist[] = $row;
                }
            }

            $query3 = "SELECT ms_code, ms_status FROM master_status";
            $res = $dbio->getSelect($dbconn, $query3);
            if($res){
                while($row = mysqli_fetch_assoc($res)){
                    $statuslist[] = $row;
                }
            }

            return array("list"=>$list, "statuslist"=>$statuslist, "productlist"=>$productlist);
            $dbio->closeConn($dbconn);
        }


        public function getOrderToEdit($dbio, $orderno){
            $sql = "SELECT po_leadsource, po_order_no, po_name, po_email, po_mobile, po_status, po_paymentgateway, po_profit, po_tcs, po_ordertype, 
                    po_handlingcharge, po_CGST, po_roundAmt, po_paymenttype, po_srno, po_totalamt, po_location, po_traveldate FROM lead_order WHERE po_order_no = '".$orderno."'";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            if(mysqli_num_rows($result) >0){
                $row = mysqli_fetch_row($result);
                $this->leadsrc = $row[0];
                $this->orderno = $row[1];
                $this->name = $row[2];
                $this->email = $row[3];
                $this->mobile= $row[4];
                $this->status = $row[5];
                $this->paygateway = $row[6];
                $this->profit = $row[7];
                $this->tcs = $row[8];
                $this->ordertype = $row[9];
                $this->handlingcharge = $row[10];
                $this->gst = $row[11];
                $this->totalinvoice = $row[12];
                $this->paytype = $row[13];
                $this->ordersrno = $row[14];
                $this->forexinr = $row[15];
                $this->location = $row[16];
                $this->date = $row[17];
            }else {
                $this->msg = "HEAD";
            }

            $qry = "SELECT tp_srno, tp_userno, tp_currency, tp_product, tp_quantity, tp_settlementrate, tp_custrate, tp_ibr, tp_productkey, tp_forexinr, tp_profit, tp_ordersrno
                    FROM mis_product WHERE tp_orderno='".$orderno."'";
            $result = $dbio->getSelect($dbconn, $qry);
            if(mysqli_num_rows($result)>0){
                while($row = mysqli_fetch_assoc($result)){
                    $this->productlist[] = $row;
                }
            }else {
                $this->productlist = array();
            }

            $q = "SELECT al_usersrno, user_name, al_changes, DATE_FORMAT(al_changedate, '%d/%m/%Y %H:%i:%S') as al_changedate FROM lead_activity_log
                LEFT OUTER JOIN user_login ON al_usersrno = user_srno
                WHERE al_orderno ='".$orderno."'";
            $result = $dbio->getSelect($dbconn, $q);
            if(mysqli_num_rows($result)>0){
                while($row = mysqli_fetch_assoc($result)){
                    $this->loglist[] = $row;
                }
            }else {
                $this->loglist = array();
            }
            
            $sql = "SELECT rem_userSrno, rem_orderno, user_name, rem_timestamp, rem_desc FROM master_order_remark 
                    LEFT OUTER JOIN user_login ON rem_userSrno = user_srno
                    WHERE rem_orderno = '".$orderno."' ORDER BY rem_timestamp DESC";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            if(mysqli_num_rows($result)>0){
              while($row = mysqli_fetch_assoc($result)){
                $this->remark[] = $row;
              }
            }else {
                $this->remark = array();
            }

            $query = "SELECT ac_ordertype, ac_paymentmode, ac_totalamount, ac_amounttobepaid, ac_amountpaid, ac_amountpending, ac_srno, 
                COALESCE(ac_paydate,'')AS ac_paydate, COALESCE(ac_bankrefno,'') AS ac_bankrefno, COALESCE(ac_authcode,'') AS ac_authcode FROM master_account_details WHERE ac_orderno = '".$orderno."'";
            $result = $dbio->getSelect($dbconn, $query);
            if(mysqli_num_rows($result)>0){

                $r = mysqli_fetch_row($result);
                $this->ammpaid = $r[4];
                $this->ammsrno = $r[6];
                $this->paydate = $r[7];
                $this->bankrefno = $r[8];
                $this->authcode = $r[9];
            }else {
                $this->msg = "ACC";
                $this->ammpaid = 0;
                $this->ammsrno = 0;
                $this->paydate = "";
                $this->bankrefno = "";
                $this->authcode = "";
            }

            $dbio->closeConn($dbconn);
        }


        public function getIsOrderEditable($dbio, $source){
            $sql = "SELECT src_ordereditable FROM master_lead_source WHERE src_srno = ".$source."";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            if($result){
                $row = mysqli_fetch_row($result);
                $this->orderdisable = $row[0];
            }
            $dbio->closeConn($dbconn);
        }


        public function checkOrderEditable($dbio, $orderno){
            $sql = "SELECT src_ordereditable FROM master_lead_source WHERE src_srno = (SELECT po_leadsource FROM lead_order WHERE po_order_no = '".$orderno."')";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            if($result){
                $row = mysqli_fetch_row($result);
                $this->orderdisable = $row[0];
            }
            $dbio->closeConn($dbconn);
        }


        public function deleteComment($dbio, $obj){
            $sql = "DELETE FROM master_order_remark WHERE rem_timestamp = '".$obj->time."' AND rem_desc = '".$obj->desc."'; ";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            if($result){
                $this->msg = 1;
            }else {
                $this->msg = 0;
            }
            $qry = "SELECT rem_userSrno, rem_orderno, user_name, rem_timestamp, rem_desc FROM master_order_remark 
                LEFT OUTER JOIN user_login ON rem_userSrno = user_srno
                WHERE rem_orderno = '".$obj->orderno."' ORDER BY rem_timestamp DESC";
            $result1 = $dbio->getSelect($dbconn, $qry);
            if(mysqli_num_rows($result1)>0){
                while($row = mysqli_fetch_assoc($result1)){
                    $this->remarklist[] = $row;
                }
            } else {
                $this->remarklist = array();
            }
            $dbio->closeConn($dbconn);
        }

        public function summaryWiseQry($obj){
            $sql = "select po_srno, po_order_no, po_ordertype, src_name, po_name,po_mobile, po_product, po_totalamt, po_handlingcharge, po_nostrocharge, po_CGST, po_roundAmt
            , ml_branch, ms_status,DATE_FORMAT(po_date,'%d-%m-%Y') AS pso_date, ms_cstatus, CASE WHEN COALESCE(mu_usersrno,0) = 0 THEN '0' ELSE '1' END AS entity_right
            FROM lead_order
            LEFT OUTER JOIN master_status ON po_status = ms_code
            LEFT OUTER JOIN master_lead_source ON src_srno = po_leadsource
            LEFT OUTER JOIN master_location ON ml_branchcd = po_location
            LEFT OUTER JOIN (SELECT mu_usersrno,mu_branchcd FROM master_user_branch_link WHERE mu_usersrno = 1) AS rgt
            ON mu_branchcd = po_location where 1=1 and po_product = '".$obj->filterProductType."'";
            if($obj->orderno != ""){
                $sql = $sql." AND po_order_no = TRIM('".$obj->orderno."')";
            } else if($obj->mobile != ""){
                $sql = $sql." AND po_mobile = TRIM('".$obj->mobile."')";
            } else {
                if($obj->ordertype != "A"){
                  $sql = $sql." AND po_ordertype = '".$obj->ordertype."'";
                }
                if($obj->status != "A"){
                  $sql = $sql." AND po_status = ".$obj->status." ";
                }  
                if($obj->srcfilter != ""){
                  $sql = $sql." AND po_leadsource = ".$obj->srcfilter." ";
                }
                if($obj->isdfilter != "A"){
                  $sql = $sql." AND po_currency = '".$obj->isdfilter."' ";
                }
                $sql=$sql." AND DATE_FORMAT(po_date, '%Y-%m-%d') BETWEEN '".$obj->frmdate."' AND '".$obj->todate."'";
            }
            $sql = $sql." ORDER BY po_srno";
            return $sql;
        }

        public function detailWiseQry($obj){
            $sql = "SELECT lp_orderno, po_ordertype, src_name, lp_producttype, lp_isd, lp_quantity, lp_rateofexchange, lp_totalamt, lp_sumtotalamount, ml_branch, ms_status, ms_cstatus
                , DATE_FORMAT(po_date,'%d-%m-%Y') AS order_date
                , po_status, po_leadsource
                FROM lead_product
                LEFT OUTER JOIN
                (SELECT po_currency,po_quantity,po_srno,po_order_no,po_roundAmt, ml_branch,po_location,po_manuallead, po_usersrno,po_status,src_name, ms_status, ms_cstatus
                , po_date, po_ordertype, po_refno, po_leadsource, po_name, po_profit, po_ispaid, po_isplaced
                        ,CASE WHEN COALESCE(mu_usersrno,0) = 0 THEN '0' ELSE '1' END AS entity_right FROM lead_order
                        LEFT OUTER JOIN master_lead_source ON po_leadsource= src_srno
                        LEFT OUTER JOIN master_status ON po_status = ms_code
                        LEFT OUTER JOIN master_location ON ml_branchcd = po_location
                        LEFT OUTER JOIN (SELECT mu_usersrno,mu_branchcd FROM  master_user_branch_link WHERE mu_usersrno = 1) AS rgt
                        ON mu_branchcd = po_location) AS ld ON ld.po_order_no = lp_orderno
                        WHERE po_isplaced =1 and lp_producttype = '".$obj->filterProductType."'";
            if($obj->orderno != ""){
                $sql = $sql." AND lp_orderno = TRIM('".$obj->orderno."')";
            } else {
                if($obj->ordertype != "A"){
                  $sql = $sql." AND po_ordertype = '".$obj->ordertype."'";
                }
                if($obj->status != "A"){
                  $sql = $sql." AND po_status = ".$obj->status." ";
                }  
                if($obj->srcfilter != ""){
                  $sql = $sql." AND po_leadsource = ".$obj->srcfilter." ";
                }
                if($obj->isdfilter != "A"){
                  $sql = $sql." AND lp_isd = '".$obj->isdfilter."' ";
                }
                $sql=$sql." AND DATE_FORMAT(po_date, '%Y-%m-%d') BETWEEN '".$obj->frmdate."' AND '".$obj->todate."'";
            }
            $sql = $sql." order by lp_timestamp ";
            return $sql;
        }

        public function getOrderDump($dbio, $obj){
            $filename = $dbio->getRandomString(8).".xls";
            $strHead = "<table className='table table-responsive'><thead><tr>";
            $strFoot = "</table></tbody>";
            $strRep="";
            $sql = "";
            if($obj->filterType == "S"){
                $sql = $this->summaryWiseQry($obj);
                $strHead=$strHead."<td><b>Order no</b></td>";
                $strHead=$strHead."<td><b>Order Type</b></td>";
                $strHead=$strHead."<td><b>Source Name</b></td>"; 
                $strHead=$strHead."<td><b>Traveller Name</b></td>";
                $strHead=$strHead."<td><b>Mobile</b></td>";
                $strHead=$strHead."<td><b>Product</b></td>";
                $strHead=$strHead."<td><b>Forex Total</b></td>";
                $strHead=$strHead."<td><b>Other Charges</b></td>";
                $strHead=$strHead."<td><b>Nostro Charges</b></td>";
                $strHead=$strHead."<td><b>GST</b></td>";
                $strHead=$strHead."<td><b>Total Amount(Round)</b></td>";
                $strHead=$strHead."<td><b>Branch</b></td>";
                $strHead=$strHead."<td><b>Date</b></td>";
                $strHead=$strHead."<td><b>Status</b></td>";
                $strHead=$strHead."<td><b>Status Desc</b></td>";
                $strHead=$strHead."</tr></thead><tbody>";
            }else {
                $sql = $this->detailWiseQry($obj);
                $strHead=$strHead."<td><b>Order no</b></td>";
                $strHead=$strHead."<td><b>Order Type</b></td>";
                $strHead=$strHead."<td><b>Source Name</b></td>"; 
                $strHead=$strHead."<td><b>Product</b></td>";
                $strHead=$strHead."<td><b>Isd</b></td>";
                $strHead=$strHead."<td><b>Quantity</b></td>";
                $strHead=$strHead."<td><b>Rate</b></td>";
                $strHead=$strHead."<td><b>Forex Amount</b></td>";
                $strHead=$strHead."<td><b>Total Inr</b></td>";
                $strHead=$strHead."<td><b>Branch</b></td>";
                $strHead=$strHead."<td><b>Date</b></td>";
                $strHead=$strHead."<td><b>Status</b></td>";
                $strHead=$strHead."<td><b>Status Desc</b></td>";
                $strHead=$strHead."</tr></thead><tbody>";
            }
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            if(mysqli_num_rows($result)>0){
                while($row = mysqli_fetch_row($result)){                
                    $strRep = $strRep."<tr>";
                    if($obj->filterType  == "S"){
                        $strRep = $strRep."<td>".$row[1]."</td>";
                        $strRep = $strRep."<td>".$row[2]."</td>";
                        $strRep = $strRep."<td>".$row[3]."</td>";
                        $strRep = $strRep."<td>".$row[4]."</td>";
                        $strRep = $strRep."<td>".$row[5]."</td>";
                        $strRep = $strRep."<td>".$row[6]."</td>";
                        $strRep = $strRep."<td>".$row[7]."</td>";
                        $strRep = $strRep."<td>".$row[8]."</td>";
                        $strRep = $strRep."<td>".$row[9]."</td>";
                        $strRep = $strRep."<td>".$row[10]."</td>";
                        $strRep = $strRep."<td>".$row[11]."</td>";
                        $strRep = $strRep."<td>".$row[12]."</td>";
                        $strRep = $strRep."<td>".$row[14]."</td>";
                        $strRep = $strRep."<td>".$row[15]."</td>";
                        $strRep = $strRep."<td>".$row[13]."</td>";
                        $strRep = $strRep."</tr>";
                    }else {
                        $strRep = $strRep."<td>".$row[0]."</td>";
                        $strRep = $strRep."<td>".$row[1]."</td>";
                        $strRep = $strRep."<td>".$row[2]."</td>";
                        $strRep = $strRep."<td>".$row[3]."</td>";
                        $strRep = $strRep."<td>".$row[4]."</td>";
                        $strRep = $strRep."<td>".$row[5]."</td>";
                        $strRep = $strRep."<td>".$row[6]."</td>";
                        $strRep = $strRep."<td>".$row[7]."</td>";
                        $strRep = $strRep."<td>".$row[8]."</td>";
                        $strRep = $strRep."<td>".$row[9]."</td>";
                        $strRep = $strRep."<td>".$row[12]."</td>";
                        $strRep = $strRep."<td>".$row[11]."</td>";
                        $strRep = $strRep."<td>".$row[10]."</td>";
                    }
                }
            }
            $dbio->closeConn($dbconn);
            if($obj->filterMode=="D"){
                header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                header('Content-Disposition: attachment;filename="'.$filename.'"');
            }
            echo($strHead.$strRep.$strFoot);
        }


    }


?>