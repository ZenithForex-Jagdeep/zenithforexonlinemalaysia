<?php
    session_start();
    require_once("dbio_c.php");
    require_once('right_c.php');

    $dbio = new Dbio();
    $right = new Right();
    $right->getUserNavRight($dbio,"CORPMODULE");
    $option = $_POST["2"];
    $session = $_POST["1"];
    $corppayment = new CorpPayment();

    if($dbio->validateSession($session)){
        if ($option == "getoutslist" and $right->query == 1){
            echo(json_encode($corppayment->getOutstandingList($right,json_decode($_POST["3"]),$dbio)));
        }else if($option == "paymentupdate" and $right->query == 1){
            echo(json_encode($corppayment->updatePayment(json_decode($_POST["3"]),$dbio)));
        }else if($option == "getpayhistorylist" and $right->query == 1){
            echo(json_encode($corppayment->getPaymentHistory($right,json_decode($_POST["3"]),$dbio)));
        }else if($option == "paymentapprove" and $right->query == 1){
            echo(json_encode($corppayment->approvePayment($right,json_decode($_POST["3"]),$dbio)));
        }else if($option == "viewpaymentdetail" and $right->query == 1){
            echo json_encode($corppayment->viewPaymentDetail(json_decode($_POST["3"]),$dbio));
        } else if($option == "getbranch" and $right->query == 1){
            echo(json_encode($corppayment->getBranchList($right, $dbio)));
        } else if($option == "manualoutstanding" and $right->query == 1){
            echo(json_encode($corppayment->getOutstandingManualList($dbio, json_decode($_POST["3"]))));
        }elseif($option == "getpayables" and $right->query == 1){
            echo(json_encode($corppayment->getPayables($dbio, json_decode($_POST["3"]))));
        }else if($option == "getbank" and $right->query == 1){
            echo(json_encode($corppayment->getBankList($dbio)));
        }else {
            echo '{"msg": "MSG0010"}';
        }  
    }else {
        echo '{"msg": "MSG0010"}';
    }
?>

<?php

    class CorpPayment{

        public function getBankList($dbio){
            $sql = "select bm_code, bm_desc from bank_master where bm_active = 1";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            $resarray = array();
            if(mysqli_num_rows($result)>0){
                while($row = mysqli_fetch_assoc($result)){
                    $resarray[] = $row;
                }
            }
            $dbio->closeConn($dbconn);
            return $resarray;
        }

        public function getOutstandingList($right,$request,$dbio){
            $qry = " SELECT cl_srno,cl_ordertype,cl_corpsrno,cl_name,cl_deliverydate,cl_orderno,cl_totalinr,cl_totalinvoice,cl_branchcd 
            , DATE_FORMAT(cl_deliverydate,'%d-%m-%Y') AS cl_deliverydatedmy
            , ml_branch, cl_receivedinr
            FROM corp_leads
            left outer join master_location on ml_branchcd = cl_branchcd
            WHERE 1=1
            AND cl_status IN (2)AND cl_totalinvoice > cl_receivedinr";

            if($request->operationType == "P") $qry .= " AND cl_ordertype = 'BUY' ";
            else $qry .= " AND cl_ordertype = 'SELL' ";

            if($right->edit=="0"){
                $qry = $qry." AND cl_corpsrno= (SELECT user_corpsrno FROM user_login WHERE user_srno = ".$_SESSION["userSrno"]." ) 
                AND cl_branchcd IN (SELECT cu_branchcd FROM master_corporate_branch_link WHERE cu_usersrno = ".$_SESSION["userSrno"]." ) ";
            }else{
                $qry = $qry." and cl_branchcd in (".$_SESSION["entitybranchallowed"].") ";
            }
            $qry = $qry." ; ";

            $productlist = array();
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $qry);
            if($result){
                while($row = mysqli_fetch_assoc($result)){
                    $productlist[] = $row;
                }
            }
            $dbio->closeConn($dbconn);
            return($productlist);
        }

        public function updatePayment($request,$dbio){
            $err = "";
            $msg = "";
            $rand = $dbio->getRandomString(10);
            $qry = " insert into corp_payheader (cph_srno,cph_mode,cph_bank,cph_amount,cph_refno,cph_date, cph_corpsrno, cph_branchcd, cph_key, cph_remark, cph_status, cph_type ) 
            select (SELECT COALESCE(MAX(cph_srno),0)+1 FROM corp_payheader),1
            ,".$request->payBank.",".$request->payAmount.",'".$request->payReference."','".$request->payDate."'
            , (SELECT user_corpsrno FROM user_login WHERE user_srno = ".$_SESSION["userSrno"]." ) , ".$request->payBranchCode.", '".$rand."', '".$request->corpRemark."' " ;
            if($request->entityType == "B"){
                $qry = $qry." , 'A'";
            }else {
                $qry = $qry." , 'P'";
            }
            if($request->operationType == "P"){
                $qry = $qry." , 'BUY'";
            }else {
                $qry = $qry." , 'SELL'";
            }
            $qry = $qry.";";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $qry);
            $dbio->closeConn($dbconn);
            if($result){
                if($request->outstandingtype == "M"){
                    $ordersrno = 0;
                    $isOk = 0;
                    $dbconn = $dbio->getConn();
                    foreach ($request->manuallist as $item) {
                        if($item->ischecked == "1" or $item->ischecked == true){
                            $sql = "INSERT INTO corp_paydetail (cpd_hdrsrno, cpd_line, cpd_ordersrno, cpd_amount)
                                    select (SELECT cph_srno FROM corp_payheader WHERE cph_key = '".$rand."'), (SELECT COALESCE(MAX(cph_srno), 0) + 1 FROM corp_payheader), 
                                    ".$item->cl_srno.", ".$item->amounttopay." ; ";
                            $result = $dbio->getSelect($dbconn, $sql);
                            $ordersrno = $item->cl_srno;
                            $sql1 = "UPDATE corp_leads SET cl_requestedinr = cl_requestedinr + ".$item->amounttopay." ";
                            if($request->entityType == "B"){
                                $sql1 = $sql1.", cl_receivedinr = cl_receivedinr + ".$item->amounttopay."";
                            }
                            $sql1 = $sql1." WHERE cl_srno = ".$item->cl_srno." ;";
                            $result1 = $dbio->getSelect($dbconn, $sql1);
                            if($result){
                                $isOk = 1;
                            }
                        }
                    }
                    if($isOk){
                        $sq = "UPDATE corp_payheader SET cph_key = ''";
                        if($request->operationType == "Q"){
                            $sq = $sq." , cph_corpsrno = (select cl_corpsrno from corp_leads where cl_srno = ".$ordersrno.")";
                        }
                        $sq = $sq." WHERE cph_key = '".$rand."'";
                        $result = $dbio->getSelect($dbconn, $sq);
                    }
                    $dbio->closeConn($dbconn);
                }
                $msg = "Payment updated successfully.";
            }else{
                $err = "Not Able to add payment.";
            }
            return array("err"=>$err, "msg"=>$msg);
        }

        public function getPaymentHistory($right,$request,$dbio){
            $qry = " SELECT cph_srno,cph_mode,cph_bank,cph_amount,cph_refno,cph_status,cph_date,cph_corpsrno,cph_branchcd 
                    , DATE_FORMAT(cph_date,'%d-%m-%Y') AS cph_datedmy
                    , ml_branch
                    , case when cph_status = 'P' then 'Pending' when cph_status='A' then 'Approved' when cph_status='R' then 'Rejected' end as cph_statusnm 
                    , COALESCE(bm_desc, '') AS bm_desc
                    FROM corp_payheader AS t
                    LEFT OUTER JOIN master_location ON ml_branchcd = cph_branchcd
                    LEFT OUTER JOIN bank_master ON bm_code = cph_bank
                    WHERE 1=1  
                     ";
            if($right->edit=="0"){
                $qry = $qry." AND cph_corpsrno= (SELECT user_corpsrno FROM user_login WHERE user_srno = ".$_SESSION["userSrno"]." ) ";
                if($request->operationType == "P") $qry .= "AND cph_branchcd IN (SELECT cu_branchcd FROM master_corporate_branch_link WHERE cu_usersrno = ".$_SESSION["userSrno"]." ) ";
            }else{
                if($request->operationType == "P") $qry .= " and cph_branchcd in (".$_SESSION["entitybranchallowed"].") ";
            }
            if($request->operationType == "P") $qry = $qry." and cph_type = 'BUY'";
            else $qry = $qry." and cph_type = 'SELL'";
            $qry = $qry." ORDER BY cph_srno DESC ; ";
            $productlist = array();
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $qry);
            if($result){
                while($row = mysqli_fetch_assoc($result)){
                    $productlist[] = $row;
                }
            }
            $dbio->closeConn($dbconn);
            return($productlist);
        }


        private function adjustAutoPayment($dbio, $request, $right, $totalPayment){
            $qry = " SELECT cl_srno,round(cl_totalinvoice,2) as cl_totalinvoice,round(cl_receivedinr,2) as cl_receivedinr, cl_orderno
            FROM corp_leads  
            WHERE 1=1 and cl_totalinvoice-cl_receivedinr>0 and cl_ordertype = 'BUY' ";
            if($right->edit==0){
                $qry = $qry." AND cl_corpsrno= (SELECT user_corpsrno FROM user_login WHERE user_srno = ".$_SESSION["userSrno"]." ) 
                AND cl_branchcd IN (SELECT cu_branchcd FROM master_corporate_branch_link WHERE cu_usersrno = ".$_SESSION["userSrno"]." ) ";
            }else{
                $qry = $qry." and cl_branchcd in (".$_SESSION["entitybranchallowed"].") ";
            }
            $qry = $qry." order by cl_srno ; ";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $qry);
            if($result){
                $qry1 = "";$i=1;
                while($row = mysqli_fetch_row($result)){
                    $ordersrno = $row[0];
                    $invoice = $row[1];
                    $received = $row[2];

                    if($invoice-$received > 0 and $totalPayment >0  ){
                        if(($invoice-$received) >= $totalPayment ){
                            if($request->outstandingtype == "A"){ //or $request->outstandingtype == ""){
                                $qry1 = $qry1." insert into corp_paydetail ( cpd_hdrsrno,cpd_line,cpd_ordersrno,cpd_amount ) 
                                select ".$request->srno.",".$i.",".$ordersrno.",".$totalPayment." ; ";
                            }
                            $qry1 = $qry1." update corp_leads set cl_receivedinr = cl_receivedinr + ".$totalPayment." where cl_srno = ".$ordersrno." ; ";
                            $totalPayment =0;
                            $qry1 = $qry1."insert into master_order_log (lg_usersrno, lg_logtime, lg_orderno, lg_desc, lg_activity_code)
                               select ".$_SESSION["userSrno"].", now(), '".$row[3]."', 'PAYMENT APPROVED : Rs. ".$totalPayment."', 'CORPORATE' ; ";
                        }else{
                            if($request->outstandingtype == "A"){// or $request->outstandingtype == ""){
                                $qry1 = $qry1." insert into corp_paydetail ( cpd_hdrsrno,cpd_line,cpd_ordersrno,cpd_amount ) 
                                select ".$request->srno.",".$i.",".$ordersrno.",".($invoice-$received)." ; ";
                            }
                            $qry1 = $qry1." update corp_leads set cl_receivedinr = cl_receivedinr + ".($invoice-$received)." where cl_srno = ".$ordersrno." ; ";
                            $qry1 = $qry1."insert into master_order_log (lg_usersrno, lg_logtime, lg_orderno, lg_desc, lg_activity_code)
                                select ".$_SESSION["userSrno"].", now(), '".$row[3]."', 'PAYMENT APPROVED : Rs. ".($invoice-$received)."', 'CORPORATE' ; ";
                            $totalPayment = $totalPayment - ($invoice-$received);
                        }
                        $i++;
                    }
                }
            }
            $result = $dbio->batchQueries($dbconn, $qry1);
            $dbio->closeConn($dbconn);
            return $i;
        }

        private function updateManualPayment($dbio, $request){
            $qry = " SELECT cl_orderno, cpd_amount, cl_ordertype FROM corp_paydetail
            LEFT OUTER JOIN corp_leads ON cpd_ordersrno = cl_srno
            WHERE cpd_hdrsrno = ".$request->srno."";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $qry);
            $dbio->closeConn($dbconn);
            $i=1;
            $qry1 = "";
            if(mysqli_num_rows($result)>0){
                while($row = mysqli_fetch_assoc($result)){
                    $orderno = $row['cl_orderno'];
                    $amount = $row['cpd_amount']*1;
                    $qry1 = $qry1." update corp_leads set cl_receivedinr = cl_receivedinr + ".$amount." where cl_orderno = '".$orderno."' ; ";
                    $qry1 = $qry1."insert into master_order_log (lg_usersrno, lg_logtime, lg_orderno, lg_desc, lg_activity_code)
                            select ".$_SESSION["userSrno"].", now(), '".$orderno."', 'PAYMENT APPROVED : Rs. ".$amount."', 'CORPORATE' ; ";
                    $i++;
                }
            }
            if($qry1 != "") {
                $dbconn = $dbio->getConn();
                $result2 = $dbio->batchQueries($dbconn, $qry1);
                $dbio->closeConn($dbconn);
            }
            return $i;
        }

        public function approvePayment($right,$request,$dbio){
            // $request->srno
            $err="";
            $msg="";
            $totalPayment = 0;
            $totalOutstanding = 0;

            // Get payment details
            $qry =" SELECT round(cph_amount,2),cph_srno,cph_status FROM corp_payheader 
            WHERE 1=1 
            and cph_srno = ".$request->srno." AND cph_status = 'P'   ";
            if($right->edit==0){
                $qry = $qry." AND cph_corpsrno= (SELECT user_corpsrno FROM user_login WHERE user_srno = ".$_SESSION["userSrno"]." ) 
                AND cph_branchcd IN (SELECT cu_branchcd FROM master_corporate_branch_link WHERE cu_usersrno = ".$_SESSION["userSrno"]." ) ";
            }else{
                $qry = $qry." and cph_branchcd in (".$_SESSION["entitybranchallowed"].") ";
            }
            $qry = $qry." ; ";

            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $qry);
            if($result){
                if(mysqli_num_rows($result) != 0){
                    $row = mysqli_fetch_row($result);
                    $totalPayment = $row[0];
               }

            }else{
                $totalPayment = 0;
            }
            $dbio->closeConn($dbconn);

            // get total outstanding.  ,cl_totalinvoice,cl_receivedinr,cl_srno,cl_status 

            $qry = "SELECT round(sum(cl_totalinvoice-cl_receivedinr),2)
            FROM corp_leads  
            WHERE 1=1 and cl_totalinvoice-cl_receivedinr>0 and cl_ordertype = 'BUY' ";
            if($right->edit==0){
                $qry = $qry." AND cl_corpsrno= (SELECT user_corpsrno FROM user_login WHERE user_srno = ".$_SESSION["userSrno"]." ) 
                AND cl_branchcd IN (SELECT cu_branchcd FROM master_corporate_branch_link WHERE cu_usersrno = ".$_SESSION["userSrno"]." ) ";
            }else{
                $qry = $qry." and cl_branchcd in (".$_SESSION["entitybranchallowed"].") ";
            }
            $qry = $qry." ; ";

            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $qry);
            if($result){
                if(mysqli_num_rows($result)>0){
                    $row = mysqli_fetch_row($result);
                    $totalOutstanding = $row[0];
                }
            }else{
                $totalOutstanding = 0;
            }
            $dbio->closeConn($dbconn);

            // Adjust Payment 
            if($totalPayment<=$totalOutstanding){
                $i = 1;
                if($request->outstandingtype == "A") $i = $this->adjustAutoPayment($dbio, $request, $right, $totalPayment);  //auto adjust payment  
                else $i = $this->updateManualPayment($dbio, $request); //update manual payment

                if($i>1){
                    $sql = " update corp_payheader set cph_status = 'A' where cph_srno = ".$request->srno." ; ";
                    $dbconn = $dbio->getConn();
                    $result = $dbio->getSelect($dbconn, $sql);
                    $dbio->closeConn($dbconn);
                }
                $err="";
                $msg="Payment Knocked of Successfully.";

            }else{
                $err=" Outstanding is less than payment. Please approve later. ";
                $msg="  Outstanding is less than payment. Please approve later.  ";
            }
            return array("err"=>$err, "msg"=>$msg);
        }
        
        public function viewPaymentDetail($request,$dbio){
            $adjustmentdata = array();
            $sql = "SELECT cl_orderno, cl_name, cpd_amount, DATE_FORMAT(cl_deliverydate, '%d-%m-%Y') AS cl_deliverydate, cl_ordertype FROM corp_paydetail
                    LEFT OUTER JOIN corp_leads ON cpd_ordersrno = cl_srno
                    WHERE cpd_hdrsrno = ".$request->srno."";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            if(mysqli_num_rows($result)>0){
                while($row = mysqli_fetch_assoc($result)){
                    $adjustmentdata[] = $row;
                }
            }
            $dbio->closeConn($dbconn);
            return $adjustmentdata;
        }


        public function getOutstandingManualList($dbio, $request){
            $orderlist = array();
            $outstandingtype = 'M';
            $entityType = "";
            $qry = "";
            $sql = "SELECT entity_outstandingtype, entity_id FROM master_entity WHERE entity_id = 
                    (SELECT user_corpsrno FROM user_login WHERE user_srno = ".$_SESSION["userSrno"].") ";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            if(mysqli_num_rows($result)>0){
                $row = mysqli_fetch_row($result);
                $outstandingtype = $row[0];
                if($row[0] == "M"){
                    $qry = $qry."SELECT cl_srno, cl_orderno, cl_ordertype, ml_branch, DATE_FORMAT(cl_deliverydate,'%d-%m-%Y') AS cl_deliverydate, cl_status, mcs_statusname, cl_name
                            , cl_totalinvoice, cl_requestedinr, (cl_totalinvoice - cl_requestedinr) as amounttopay, FALSE AS ischecked, cl_ordertype FROM corp_leads 
                            LEFT OUTER JOIN master_corp_status ON cl_status = mcs_srno
                            LEFT OUTER JOIN master_location ON cl_branchcd = ml_branchcd
                            WHERE (cl_totalinvoice - cl_requestedinr) > 0 AND cl_status = 2 and cl_ordertype = 'BUY' AND cl_corpsrno = ".$row[1].";";
                }
            }
            if($qry != ""){
                $res = $dbio->getSelect($dbconn, $qry);
                if(mysqli_num_rows($res)>0){
                    while($row = mysqli_fetch_assoc($res)){
                        $orderlist[] = $row;
                    }
                }
            }
            $dbio->closeConn($dbconn);
            return array("orderlist"=>$orderlist, "type"=>$outstandingtype, "entityType"=>$entityType);
        }

        public function getPayables($dbio){
            $orderlist = array();
            $qry = "SELECT cl_srno, cl_orderno, cl_ordertype, ml_branch, DATE_FORMAT(cl_deliverydate,'%d-%m-%Y') AS cl_deliverydate, cl_status, mcs_statusname, cl_name
                    , cl_totalinvoice, cl_requestedinr, (cl_totalinvoice - cl_requestedinr) as amounttopay, FALSE AS ischecked, cl_ordertype FROM corp_leads 
                    LEFT OUTER JOIN master_corp_status ON cl_status = mcs_srno
                    LEFT OUTER JOIN master_location ON cl_branchcd = ml_branchcd
                    WHERE (cl_totalinvoice - cl_requestedinr) > 0 AND cl_status = 2  and cl_ordertype = 'SELL' and cl_branchcd in (".$_SESSION["entitybranchallowed"].") ;";
            $dbconn = $dbio->getConn();
            $res = $dbio->getSelect($dbconn, $qry);
            if(mysqli_num_rows($res)>0){
                while($row = mysqli_fetch_assoc($res)){
                    $orderlist[] = $row;
                }
            }
            $dbio->closeConn($dbconn);
            return array("orderlist"=>$orderlist, "type"=>"M");
        }

        public function getBranchList($right, $dbio){
            $sql = '';
            $branlist = array();
            $entityType = "";
            $qry1 = "select rgtgrp_userno, rgtgrp_grpno from master_user_right_group_link where rgtgrp_userno = ".$_SESSION["userSrno"]."";
            $dbconn = $dbio->getConn();
            $res = $dbio->getSelect($dbconn, $qry1);
            $r = mysqli_fetch_row($res);
            if($r[1] == 10 || $r[1] == 13){
                $sql = "SELECT cu_branchcd, ml_branch FROM master_corporate_branch_link
                LEFT OUTER JOIN master_location ON cu_branchcd = ml_branchcd
                WHERE cu_usersrno = ".$_SESSION["userSrno"]." ORDER BY ml_branch";
                $entityType = "C";
            }else {
                $sql = "SELECT mu_branchcd, ml_branch FROM master_user_branch_link
                LEFT OUTER JOIN master_location ON mu_branchcd = ml_branchcd
                WHERE mu_usersrno = ".$_SESSION["userSrno"]." ORDER BY ml_branch";
                $entityType = "B";
            }
            $result1 = $dbio->getSelect($dbconn, $sql);
            if(mysqli_num_rows($result1) > 0){
                while($row = mysqli_fetch_assoc($result1)){
                    $branlist[] = $row;
                }
            }
            $dbio->closeConn($dbconn);
            return array("branlist"=>$branlist,"entityType"=>$entityType);
        }


    }

?>
