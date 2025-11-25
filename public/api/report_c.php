<?php
    

    class RepLeadStatus{
        private function getReportQuerySource($reqObject){
            // ".$_SESSION["userSrno"]."
            $qry = "";
            if($reqObject->reporttype == "S"){
                $qry = $qry." SELECT src_srno,src_name , COALESCE(po_newleads,0) AS po_newleads 
                    , COALESCE(po_pendingleads,0) AS po_pendingleads , COALESCE(po_doneleads,0) AS po_doneleads 
                    , COALESCE(po_cancelleads,0) AS po_cancelleads
                    , COALESCE(po_forexleads,0) AS po_forexleads
                    FROM master_lead_source
                    LEFT OUTER JOIN (
                    SELECT po_leadsource,COUNT(*) AS po_newleads FROM lead_order 
                    WHERE DATE_FORMAT(po_date,'%Y-%m-%d')  BETWEEN '".$reqObject->frmdt."' AND '".$reqObject->todt."'  
                    AND po_isplaced = 1  
                    GROUP BY po_leadsource
                    ) AS newleads ON newleads.po_leadsource = src_srno 
                    LEFT OUTER JOIN (
                        SELECT po_leadsource,COUNT(*) AS po_pendingleads 
                        FROM lead_order
                        LEFT OUTER JOIN  master_status ON po_status=ms_code 
                        WHERE DATE_FORMAT(po_date,'%Y-%m-%d')  BETWEEN '".$reqObject->frmdt."' AND '".$reqObject->todt."' 
                        AND ms_cstatus = 'PENDING' AND po_isplaced = 1 
                        GROUP BY po_leadsource
                        ) AS penleads ON penleads.po_leadsource = src_srno 
                        LEFT OUTER JOIN (
                            SELECT po_leadsource,COUNT(*) AS po_doneleads 
                            FROM lead_order
                    LEFT OUTER JOIN  master_status ON po_status=ms_code 
                    WHERE DATE_FORMAT(po_donetimestamp,'%Y-%m-%d')  BETWEEN '".$reqObject->frmdt."' AND '".$reqObject->todt."' 
                    AND ms_cstatus = 'DONE' AND po_isplaced = 1 
                    GROUP BY po_leadsource
                    ) AS doneleads ON doneleads.po_leadsource = src_srno 
                    LEFT OUTER JOIN (
                        SELECT po_leadsource,COUNT(*) AS po_cancelleads 
                        FROM lead_order
                    LEFT OUTER JOIN  master_status ON po_status=ms_code 
                    WHERE DATE_FORMAT(po_date,'%Y-%m-%d')  BETWEEN '".$reqObject->frmdt."' AND '".$reqObject->todt."' 
                    AND ms_cstatus = 'CANCEL' AND po_isplaced = 1
                    GROUP BY po_leadsource
                    ) AS cancelleads ON cancelleads.po_leadsource = src_srno 
                    LEFT OUTER JOIN (
                        SELECT po_leadsource,SUM(po_roundAmt) AS po_forexleads 
                        FROM lead_order
                        LEFT OUTER JOIN  master_status ON po_status=ms_code 
                        WHERE DATE_FORMAT(po_donetimestamp,'%Y-%m-%d')  BETWEEN '".$reqObject->frmdt."' AND '".$reqObject->todt."' 
                        AND ms_cstatus = 'DONE' AND po_isplaced = 1 
                        GROUP BY po_leadsource
                        ) AS forexleads ON forexleads.po_leadsource = src_srno ";
                        
                        $qry = $qry." ; ";
            }else {
                $qry = $qry."SELECT po_date,SUM(newleads) AS newleads,SUM(doneleads) AS doneleads, SUM(cancelleads) AS cancelleads, SUM(totalinr) AS totalamount FROM 
                        (
                            SELECT DATE(po_date) AS po_date, COUNT(*) AS newleads, 0 AS doneleads,0 AS cancelleads, 0 as totalinr
                            FROM lead_order
                            WHERE DATE_FORMAT(po_date,'%Y-%m-%d') BETWEEN '".$reqObject->frmdt."' AND '".$reqObject->todt."'
                            GROUP BY DATE(po_date)                        
                            UNION ALL
                            SELECT DATE(po_date) AS po_date,0 AS newleads, COUNT(*) AS doneleads,0 AS cancelleads, SUM(po_roundAmt) AS totalinr
                            FROM lead_order
                            WHERE DATE_FORMAT(po_date,'%Y-%m-%d') BETWEEN '".$reqObject->frmdt."' AND '".$reqObject->todt."' AND po_status = 14
                            GROUP BY DATE(po_date)
                            UNION ALL
                            SELECT DATE(po_date) AS po_date,0 AS newleads, 0 AS doneleads, COUNT(*) AS cancelleads, 0 AS totalinr
                            FROM lead_order
                            WHERE DATE_FORMAT(po_date,'%Y-%m-%d') BETWEEN '2022-02-06' AND '2024-02-05' AND po_status IN (SELECT ms_code FROM master_status WHERE ms_cstatus = 'CANCEL')
                            GROUP BY DATE(po_date)  
                        )AS t GROUP BY po_date";
                $qry = $qry." ; ";
            }
            return $qry;
        }

        public function genReportSource($dbio,$reqObject){
            $LeadsNew = 0 ;
            $LeadsPen = 0 ;
            $LeadsDone = 0 ;
            $LeadsCancel = 0;
            $ForexAmount = 0; 
            $strRep = "";
            $strHead="";
            $strFoot="";
            $dbconn = $dbio->getConn();
            if($reqObject->reporttype == "S"){
                $strHead = "<table className='table table-responsive'><thead><tr>";
                $strHead=$strHead."<td><b>Source</b></td>";
                $strHead=$strHead."<td><b>New</b></td>";
                $strHead=$strHead."<td><b>Pending</b></td>"; 
                $strHead=$strHead."<td><b>Done</b></td>";
                $strHead=$strHead."<td><b>Cancel</b></td>";
                $strHead=$strHead."<td><b>Forex Amount</b></td>";
                $strHead=$strHead."</tr></thead><tbody>";
                $strFoot = "</table></tbody>";
                
                $sql = $this->getReportQuerySource($reqObject);
                $result = $dbio->getSelect($dbconn,$sql);
                if($result){
                    while($row = mysqli_fetch_row($result)){                
                        $strRep = $strRep."<tr>";
                        $strRep = $strRep."<td>".$row[1]."</td>";   // Source            
                        $strRep = $strRep."<td>".$row[2]."</td>";   // New            
                        $strRep = $strRep."<td>".$row[3]."</td>";   // Pending            
                        $strRep = $strRep."<td>".$row[4]."</td>";   // Done        
                        $strRep = $strRep."<td>".$row[5]."</td>";   // Cancel        
                        $strRep = $strRep."<td>".$row[6]."</td>";   // ForexAmnt            
                        $strRep = $strRep."</tr>";
                        $LeadsNew = $LeadsNew + $row[2] ;
                        $LeadsPen = $LeadsPen + $row[3] ;
                        $LeadsDone = $LeadsDone + $row[4] ;
                        $LeadsCancel = $LeadsCancel + $row[5] ;
                        $ForexAmount = $ForexAmount + $row[6] ;
                    }
                }
                $strRep = $strRep."<tr><td><b>Total</b></td><td><b>".$LeadsNew."</b></td><td><b>".$LeadsPen."</b></td><td><b>".$LeadsDone."</b></td><td><b>".$LeadsCancel."</b></td><td><b>".$ForexAmount."</b></td></tr>";
            }else {
                $strHead = "<table className='table table-responsive'><thead><tr>";
                $strHead=$strHead."<td><b>Date</b></td>";
                $strHead=$strHead."<td><b>New</b></td>";
                $strHead=$strHead."<td><b>Done</b></td>";
                $strHead=$strHead."<td><b>Cancel</b></td>";
                $strHead=$strHead."<td><b>Amount(INR)</b></td>";
                $strHead=$strHead."</tr></thead><tbody>";
                $strFoot = "</table></tbody>";
                
                $sql = $this->getReportQuerySource($reqObject);
                $result = $dbio->getSelect($dbconn,$sql);
                if($result){
                    while($row = mysqli_fetch_row($result)){                
                        $strRep = $strRep."<tr>";
                        $strRep = $strRep."<td>".$row[0]."</td>"; //Date
                        $strRep = $strRep."<td>".$row[1]."</td>"; //New
                        $strRep = $strRep."<td>".$row[2]."</td>"; //Done
                        $strRep = $strRep."<td>".$row[3]."</td>"; //Cancel
                        $strRep = $strRep."<td>".$row[4]."</td>"; //INR
                        $strRep = $strRep."</tr>";
                        $LeadsNew = $LeadsNew + $row[1] ;
                        $LeadsCancel = $LeadsCancel + $row[3];
                        $ForexAmount = $ForexAmount + $row[4];
                        $LeadsDone = $LeadsDone + $row[2] ;
                    }
                }
                $strRep = $strRep."<tr><td><b>Total</b></td><td><b>".$LeadsNew."</b></td><td><b>".$LeadsDone."</b></td><td><b>".$LeadsCancel."</b></td><td><b>".$ForexAmount."</b></td></tr>";
            }
            $dbio->closeConn($dbconn);
            if($reqObject->mode=="D"){
                header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                header('Content-Disposition: attachment;filename="'.$reqObject->filename.'"');
            }
            echo($strHead.$strRep.$strFoot);
        }

        private function getReportQueryBranch($reqObject){
            // ".$_SESSION["userSrno"]."
            $qry = " SELECT po_location,ml_branch,po_leadcount, po_roundAmt FROM 
            (SELECT po_location,ROUND(SUM(po_roundAmt),0) AS po_roundAmt, COUNT(*) AS po_leadcount
            FROM lead_order 
            WHERE DATE_FORMAT(po_date,'%Y-%m-%d')  BETWEEN '".$reqObject->frmdt."' AND '".$reqObject->todt."' 
            AND po_isplaced = 1 
            GROUP BY po_location ) AS t
            LEFT OUTER JOIN master_location AS ml ON ml.ml_branchcd = t.po_location ";
            $qry = $qry." ; ";
            return $qry;
        }

        private function getReportQueryBranchDetails($reqObject){
            $qry = " SELECT po_location,ml_branch,po_leadcount, po_roundAmt
                        , SUM(onlineleads) AS onlineleads
                        , SUM(offlineleads) AS offlineleads
                        , SUM(offerleads) AS offerleads
                        , SUM(bmfleads) AS bmfleads
                        , SUM(extravelleads) AS extravelleads
                        , SUM(doneleads) AS doneleads
                        , SUM(cancelleads) AS cancelleads  
                    FROM 
                    (SELECT po_location,ROUND(SUM(po_roundAmt),0) AS po_roundAmt, COUNT(*) AS po_leadcount, 0 AS onlineleads, 0 AS bmfleads, 0 AS extravelleads, 0 AS offerleads
                        , 0 AS offlineleads, 0 AS doneleads, 0 AS cancelleads
                        FROM lead_order 
                        WHERE DATE_FORMAT(po_date,'%Y-%m-%d')  BETWEEN '".$reqObject->frmdt."' AND '".$reqObject->todt."' 
                        AND po_isplaced = 1 
                        GROUP BY po_location 
                    UNION ALL
                    SELECT po_location,0 AS po_roundAmt, 0 AS po_leadcount, COUNT(*) AS onlineleads, 0 AS bmfleads, 0 AS extravelleads, 0 AS offerleads, 0 AS offlineleads
                    , 0 AS doneleads, 0 AS cancelleads
                        FROM lead_order 
                        WHERE DATE_FORMAT(po_date,'%Y-%m-%d')  BETWEEN '".$reqObject->frmdt."' AND '".$reqObject->todt."' 
                        AND po_isplaced = 1 AND po_leadsource = 2
                        GROUP BY po_location
                    UNION ALL
                    SELECT po_location,0 AS po_roundAmt, 0 AS po_leadcount, 0 AS onlineleads, COUNT(*) AS bmfleads, 0 AS extravelleads, 0 AS offerleads, 0 AS offlineleads
                    , 0 AS doneleads, 0 AS cancelleads
                        FROM lead_order 
                        WHERE DATE_FORMAT(po_date,'%Y-%m-%d')  BETWEEN '".$reqObject->frmdt."' AND '".$reqObject->todt."' 
                        AND po_isplaced = 1 AND po_leadsource = 4
                        GROUP BY po_location
                    UNION ALL
                    SELECT po_location,0 AS po_roundAmt, 0 AS po_leadcount, 0 AS onlineleads, 0 AS bmfleads, COUNT(*) AS extravelleads, 0 AS offerleads, 0 AS offlineleads
                    , 0 AS doneleads, 0 AS cancelleads
                        FROM lead_order
                        WHERE DATE_FORMAT(po_date,'%Y-%m-%d')  BETWEEN '".$reqObject->frmdt."' AND '".$reqObject->todt."' 
                        AND po_isplaced = 1 AND po_leadsource = 5
                        GROUP BY po_location
                    UNION ALL
                    SELECT po_location,0 AS po_roundAmt, 0 AS po_leadcount, 0 AS onlineleads, 0 AS bmfleads, 0 AS extravelleads, COUNT(*) AS offerleads, 0 AS offlineleads
                    , 0 AS doneleads, 0 AS cancelleads
                        FROM lead_order
                        WHERE DATE_FORMAT(po_date,'%Y-%m-%d')  BETWEEN '".$reqObject->frmdt."' AND '".$reqObject->todt."' 
                        AND po_isplaced = 1 AND po_leadsource = 1
                        GROUP BY po_location
                    UNION ALL
                    SELECT po_location,0 AS po_roundAmt, 0 AS po_leadcount, 0 AS onlineleads, 0 AS bmfleads, 0 AS extravelleads, 0 AS offerleads, COUNT(*) AS offlineleads
                        , 0 AS doneleads, 0 AS cancelleads
                        FROM lead_order
                        WHERE DATE_FORMAT(po_date,'%Y-%m-%d')  BETWEEN '".$reqObject->frmdt."' AND '".$reqObject->todt."' 
                        AND po_isplaced = 1 AND po_leadsource = 3
                        GROUP BY po_location
                    UNION ALL
                    SELECT po_location,0 AS po_roundAmt, 0 AS po_leadcount, 0 AS onlineleads, 0 AS bmfleads, 0 AS extravelleads, 0 AS offerleads, 0 AS offlineleads
                        , COUNT(*) AS doneleads, 0 AS cancelleads
                        FROM lead_order
                        WHERE DATE_FORMAT(po_date,'%Y-%m-%d')  BETWEEN '".$reqObject->frmdt."' AND '".$reqObject->todt."' 
                        AND po_isplaced = 1 AND po_status = 14
                        GROUP BY po_location
                    UNION ALL
                    SELECT po_location,0 AS po_roundAmt, 0 AS po_leadcount, 0 AS onlineleads, 0 AS bmfleads, 0 AS extravelleads, 0 AS offerleads, 0 AS offlineleads
                        , 0 AS doneleads, COUNT(*) AS cancelleads
                        FROM lead_order
                        WHERE DATE_FORMAT(po_date,'%Y-%m-%d')  BETWEEN '".$reqObject->frmdt."' AND '".$reqObject->todt."' 
                        AND po_isplaced = 1 AND po_status IN (SELECT ms_code FROM master_status WHERE ms_cstatus = 'CANCEL')
                        GROUP BY po_location
                        ) AS t
                    LEFT OUTER JOIN master_location AS ml ON ml.ml_branchcd = t.po_location
                    GROUP BY po_location  ; ";
            return $qry;
        }
        
        public function genReportBranch($dbio,$reqObject){
            $ForexAmount = 0; 
            $totaltran = 0;
            $OnlineLeads = 0;
            $OfflineLeads = 0;
            $OfferLeads = 0;
            $BmfLeads = 0;
            $ExtravelLeads = 0;
            $DoneLeads = 0;
            $CancelLeads = 0;
            $strRep = "";
            
            $strHead = "<table className='table table-responsive'><thead><tr>";
            
            $strFoot = "</table></tbody>";
            if($reqObject->reporttype == "S"){
                $sql = $this->getReportQueryBranch($reqObject);
                $strHead=$strHead."<td><b>Branch</b></td>";
                $strHead=$strHead."<td><b>Transactions</b></td>";
                $strHead=$strHead."<td><b>Forex Amount</b></td>";
                $strHead=$strHead."</tr></thead><tbody>";
            }else {
                $sql = $this->getReportQueryBranchDetails($reqObject);
                $strHead=$strHead."<td><b>Branch</b></td>";
                $strHead=$strHead."<td><b>Transactions</b></td>";
                $strHead=$strHead."<td><b>Forex Amount</b></td>";
                $strHead=$strHead."<td><b>Online</b></td>";
                $strHead=$strHead."<td><b>Offline</b></td>";
                $strHead=$strHead."<td><b>Offer Page</b></td>";
                $strHead=$strHead."<td><b>Book My Forex</b></td>";
                $strHead=$strHead."<td><b>Extravel</b></td>";
                $strHead=$strHead."<td><b>Done Leads</b></td>";
                $strHead=$strHead."<td><b>Cancel Leads</b></td>";
                $strHead=$strHead."</tr></thead><tbody>";
            }
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn,$sql);
            if($result){
                while($row = mysqli_fetch_row($result)){ 
                    if($reqObject->reporttype == "S"){
                        $strRep = $strRep."<tr>";
                        $strRep = $strRep."<td>".$row[1]."</td>";   // Branch            
                        $strRep = $strRep."<td>".$row[2]."</td>";   // count            
                        $strRep = $strRep."<td>".$row[3]."</td>";   // forex amount             
                        $strRep = $strRep."</tr>";
                        $ForexAmount = $ForexAmount + $row[3] ;
                        $totaltran = $totaltran + $row[2];
                    }else {
                        $strRep = $strRep."<tr>";
                        $strRep = $strRep."<td>".$row[1]."</td>";   // Branch            
                        $strRep = $strRep."<td>".$row[2]."</td>";   // count            
                        $strRep = $strRep."<td>".$row[3]."</td>";   // forex amount             
                        $strRep = $strRep."<td>".$row[4]."</td>";
                        $strRep = $strRep."<td>".$row[5]."</td>";
                        $strRep = $strRep."<td>".$row[6]."</td>";
                        $strRep = $strRep."<td>".$row[7]."</td>";
                        $strRep = $strRep."<td>".$row[8]."</td>";
                        $strRep = $strRep."<td>".$row[9]."</td>";
                        $strRep = $strRep."<td>".$row[10]."</td>";
                        $strRep = $strRep."</tr>";
                        $ForexAmount = $ForexAmount + $row[3] ;
                        $totaltran = $totaltran + $row[2];
                        $OnlineLeads += $row[4];
                        $OfflineLeads += $row[5];
                        $OfferLeads += $row[6];
                        $BmfLeads += $row[7];
                        $ExtravelLeads += $row[8];
                        $DoneLeads += $row[9];
                        $CancelLeads += $row[10];
                    }
                }
            }
            $dbio->closeConn($dbconn);
            if($reqObject->reporttype == "S"){
                $strRep = $strRep."<tr><td><b>Total</b></td><td><b>".$totaltran."</b></td><td><b>".$ForexAmount."</b></td></tr>";
            }else {
                $strRep = $strRep."<tr><td><b>Total</b></td><td><b>".$totaltran."</b></td><td><b>".$ForexAmount."</b></td>
                <td><b>".$OnlineLeads."</b></td>
                <td><b>".$OfflineLeads."</b></td>
                <td><b>".$OfferLeads."</b></td>
                <td><b>".$BmfLeads."</b></td>
                <td><b>".$ExtravelLeads."</b></td>
                <td><b>".$DoneLeads."</b></td>
                <td><b>".$CancelLeads."</b></td>
                </tr>";
            }
            if($reqObject->mode=="D"){
                header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                header('Content-Disposition: attachment;filename="'.$reqObject->filename.'"');
            }
            echo($strHead.$strRep.$strFoot);
        }
    }

    class RepTieupStatus{
        private function getReportQuery($reqObject){
            $qry = " SELECT mtc_name 
                    , COALESCE(tabnewtieup.newTieUp,0) AS newTieUp
                    , COALESCE(tabpentieup.penTieUp,0) AS penTieUp
                    , COALESCE(tabdonetieup.donetieup,0) AS donetieup
                    , COALESCE(tabsignedtieup.signedTieUp,0) AS signedTieUp
                    FROM master_tieupcust
                    LEFT OUTER JOIN (
                        SELECT tl_customertype,COUNT(*) AS newTieUp FROM tieup_lead 
                        WHERE DATE_FORMAT(tl_date,'%Y-%m-%d')  BETWEEN '".$reqObject->frmdt."' AND '".$reqObject->todt."'
                        and (tl_userno IN (SELECT merl_empcode FROM master_employee_reporting_link WHERE merl_reportingto = 
                            (SELECT user_empsrno FROM user_login WHERE user_srno = ".$_SESSION["userSrno"].")) 
                            OR tl_userno = (SELECT user_empsrno FROM user_login WHERE user_srno = ".$_SESSION["userSrno"].")) group by tl_customertype
                    ) AS tabnewtieup ON tabnewtieup.tl_customertype = mtc_srno
                    LEFT OUTER JOIN (
                        SELECT tl_customertype,COUNT(*) AS doneTieUp FROM tieup_lead 
                        WHERE DATE_FORMAT(tl_donedate,'%Y-%m-%d') BETWEEN '".$reqObject->frmdt."' AND '".$reqObject->todt."'
                        and (tl_userno IN (SELECT merl_empcode FROM master_employee_reporting_link WHERE merl_reportingto = 
                            (SELECT user_empsrno FROM user_login WHERE user_srno = ".$_SESSION["userSrno"].")) 
                            OR tl_userno = (SELECT user_empsrno FROM user_login WHERE user_srno = ".$_SESSION["userSrno"].")) group by tl_customertype
                    ) AS tabdonetieup ON tabdonetieup.tl_customertype = mtc_srno
                    LEFT OUTER JOIN (
                        SELECT tl_customertype,COUNT(*) AS signedTieUp FROM tieup_lead 
                        WHERE DATE_FORMAT(tl_signdate,'%Y-%m-%d') BETWEEN '".$reqObject->frmdt."' AND '".$reqObject->todt."'
                        and (tl_userno IN (SELECT merl_empcode FROM master_employee_reporting_link WHERE merl_reportingto = 
                            (SELECT user_empsrno FROM user_login WHERE user_srno = ".$_SESSION["userSrno"].")) 
                            OR tl_userno = (SELECT user_empsrno FROM user_login WHERE user_srno = ".$_SESSION["userSrno"].")) group by tl_customertype
                    ) AS tabsignedtieup ON tabsignedtieup.tl_customertype = mtc_srno
                    LEFT OUTER JOIN (
                        SELECT tl_customertype,COUNT(*) AS penTieUp FROM tieup_lead 
                        WHERE DATE_FORMAT(tl_date,'%Y-%m-%d')  BETWEEN '".$reqObject->frmdt."' AND '".$reqObject->todt."' AND
                        tl_status = 1 and (tl_userno IN (SELECT merl_empcode FROM master_employee_reporting_link WHERE merl_reportingto = 
                            (SELECT user_empsrno FROM user_login WHERE user_srno = ".$_SESSION["userSrno"].")) 
                            OR tl_userno = (SELECT user_empsrno FROM user_login WHERE user_srno = ".$_SESSION["userSrno"].")) group by tl_customertype
                    ) AS tabpentieup ON tabpentieup.tl_customertype = mtc_srno ";
            $qry = $qry." ; ";
            return $qry;
        }
        public function genReport($dbio,$reqObject){
            $LeadsNew = 0 ;
            $LeadsPen = 0 ;
            $LeadsDone = 0 ;
            $LeadsSigned = 0 ;
            $strRep = "";
            
            $strHead = "<table className='table table-responsive'><thead><tr>";
            $strHead=$strHead."<td><b>Type</b></td>";
            $strHead=$strHead."<td><b>New</b></td>";
            $strHead=$strHead."<td><b>Pending</b></td>"; 
            $strHead=$strHead."<td><b>Done</b></td>";
            $strHead=$strHead."<td><b>Signed</b></td>";
            $strHead=$strHead."</tr></thead><tbody>";
            $strFoot = "</table></tbody>";
            
            $sql = $this->getReportQuery($reqObject);
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn,$sql);
            if($result){
                while($row = mysqli_fetch_row($result)){                
                    $strRep = $strRep."<tr>";
                    $strRep = $strRep."<td>".$row[0]."</td>";   // Type            
                    $strRep = $strRep."<td>".$row[1]."</td>";   // New            
                    $strRep = $strRep."<td>".$row[2]."</td>";   // Pending            
                    $strRep = $strRep."<td>".$row[3]."</td>";   // Done            
                    $strRep = $strRep."<td>".$row[4]."</td>";   // Signed            
                    $strRep = $strRep."</tr>";
                    $LeadsNew = $LeadsNew + $row[1] ;
                    $LeadsPen = $LeadsPen + $row[2] ;
                    $LeadsDone = $LeadsDone + $row[3] ;
                    $LeadsSigned = $LeadsSigned + $row[4] ;
                }
            }
            $dbio->closeConn($dbconn);
            $strRep = $strRep."<tr><td><b>Total</b></td><td><b>".$LeadsNew."</b></td><td><b>".$LeadsPen."</b></td><td><b>".$LeadsDone."</b></td><td><b>".$LeadsSigned."</b></td></tr>";
            if($reqObject->mode=="D"){
                header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                header('Content-Disposition: attachment;filename="'.$reqObject->filename.'"');
            }
            echo($strHead.$strRep.$strFoot);
        }
    }

    class RepNextFollowUp{
        private function getReportQuery($reqObject){
            $qry = " SELECT tl_userno,emp_name, tl_name,tl_mobile,tl_email,DATE_FORMAT(tl_nextvisit,'%d-%m-%Y')  as tl_nextvisit 
            FROM tieup_lead 
            LEFT OUTER JOIN master_employee ON emp_srno = tl_userno 
            WHERE (tl_userno IN (SELECT merl_empcode FROM master_employee_reporting_link WHERE merl_reportingto = 
                (SELECT user_empsrno FROM user_login WHERE user_srno = ".$_SESSION["userSrno"]."))
                OR tl_userno = (SELECT user_empsrno FROM user_login WHERE user_srno = ".$_SESSION["userSrno"]."))
                AND tl_nextvisit BETWEEN '".$reqObject->frmdt."' AND '".$reqObject->todt."' 
            order by tl_nextvisit ";
            $qry = $qry." ; ";
            return $qry;
        }
        public function genReport($dbio,$reqObject){
            $strRep = "";
            
            $strHead = "<table className='table table-responsive'><thead><tr>";
            $strHead=$strHead."<td><b>User</b></td>";
            $strHead=$strHead."<td><b>Party</b></td>";
            $strHead=$strHead."<td><b>Mobile</b></td>"; 
            $strHead=$strHead."<td><b>Email</b></td>";
            $strHead=$strHead."<td><b>Next Visit</b></td>";
            $strHead=$strHead."</tr></thead><tbody>";
            $strFoot = "</table></tbody>";
            
            $sql = $this->getReportQuery($reqObject);
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn,$sql);
            if($result){
                while($row = mysqli_fetch_row($result)){                
                    $strRep = $strRep."<tr>";
                    $strRep = $strRep."<td>".$row[1]."</td>";   // User            
                    $strRep = $strRep."<td>".$row[2]."</td>";   // Party
                    $strRep = $strRep."<td>".$row[3]."</td>";   // Mobile            
                    $strRep = $strRep."<td>".$row[4]."</td>";   // Email            
                    $strRep = $strRep."<td>".$row[5]."</td>";   // Next Visit            
                    $strRep = $strRep."</tr>";
                }
            }
            $dbio->closeConn($dbconn);
            
            if($reqObject->mode=="D"){
                header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                header('Content-Disposition: attachment;filename="'.$reqObject->filename.'"');
            }
            echo($strHead.$strRep.$strFoot);
        }
    }

    class RepDashboard{
        private function getReportQuery($reqObject){
            $qry = " SELECT mtc_name 
                , COALESCE(tabnewtieup.newTieUp,0) AS newTieUp
                , COALESCE(tabpentieup.penTieUp,0) AS penTieUp
                , COALESCE(tabdonetieup.donetieup,0) AS donetieup
                , COALESCE(tabsignedtieup.signedTieUp,0) AS signedTieUp
                FROM master_tieupcust
                LEFT OUTER JOIN (
                    SELECT tl_customertype,COUNT(*) AS newTieUp FROM tieup_lead WHERE tl_userno = (SELECT user_empsrno FROM user_login WHERE user_srno = ".$_SESSION["userSrno"].")
                    AND DATE_FORMAT(tl_date,'%Y-%m-%d')  BETWEEN '".$reqObject->frmdt."' AND '".$reqObject->todt."'
                ) AS tabnewtieup ON tabnewtieup.tl_customertype = mtc_srno
                LEFT OUTER JOIN (
                    SELECT tl_customertype,COUNT(*) AS doneTieUp FROM tieup_lead WHERE tl_userno = (SELECT user_empsrno FROM user_login WHERE user_srno = ".$_SESSION["userSrno"].")
                    AND DATE_FORMAT(tl_donedate,'%Y-%m-%d') BETWEEN '".$reqObject->frmdt."' AND '".$reqObject->todt."'
                ) AS tabdonetieup ON tabdonetieup.tl_customertype = mtc_srno
                LEFT OUTER JOIN (
                    SELECT tl_customertype,COUNT(*) AS signedTieUp FROM tieup_lead WHERE tl_userno = (SELECT user_empsrno FROM user_login WHERE user_srno = ".$_SESSION["userSrno"].")
                    AND DATE_FORMAT(tl_signdate,'%Y-%m-%d') BETWEEN '".$reqObject->frmdt."' AND '".$reqObject->todt."'
                ) AS tabsignedtieup ON tabsignedtieup.tl_customertype = mtc_srno
                LEFT OUTER JOIN (
                    SELECT tl_customertype,COUNT(*) AS penTieUp FROM tieup_lead WHERE tl_userno = (SELECT user_empsrno FROM user_login WHERE user_srno = ".$_SESSION["userSrno"].") AND tl_status = 1 
                ) AS tabpentieup ON tabpentieup.tl_customertype = mtc_srno ";
            return $qry;
        }
        private function getReportAllQuery($reqObject){
            $qry = " SELECT mtc_name 
                        , COALESCE(tabnewtieup.newTieUp,0) AS newTieUp
                        , COALESCE(tabpentieup.penTieUp,0) AS penTieUp
                        , COALESCE(tabdonetieup.donetieup,0) AS donetieup
                        , COALESCE(tabsignedtieup.signedTieUp,0) AS signedTieUp
                        FROM master_tieupcust
                        LEFT OUTER JOIN (
                            SELECT tl_customertype,COUNT(*) AS newTieUp FROM tieup_lead
                            WHERE ";
                            if($reqObject->srchOneAll == "A"){
                                $qry=$qry."tl_userno IN (SELECT merl_empcode FROM master_employee_reporting_link WHERE 
                                merl_reportingto=(SELECT user_empsrno FROM user_login WHERE user_srno = ".$_SESSION["userSrno"].")) ";
                            }else {
                                $qry=$qry."tl_userno = ".$reqObject->srchSalesExecutive." ";
                            }
                        $qry = $qry."AND DATE_FORMAT(tl_date,'%Y-%m-%d')  BETWEEN '".$reqObject->frmdt."' AND '".$reqObject->todt."') 
                        AS tabnewtieup ON tabnewtieup.tl_customertype = mtc_srno
                        LEFT OUTER JOIN (
                            SELECT tl_customertype,COUNT(*) AS doneTieUp FROM tieup_lead 
                            WHERE ";
                            if($reqObject->srchOneAll == "A"){
                                $qry=$qry." tl_userno IN (SELECT merl_empcode FROM master_employee_reporting_link WHERE 
                                merl_reportingto=(SELECT user_empsrno FROM user_login WHERE user_srno = ".$_SESSION["userSrno"].") ) ";
                            }else {
                                $qry=$qry."tl_userno = ".$reqObject->srchSalesExecutive." ";
                            }
                        $qry = $qry."AND DATE_FORMAT(tl_donedate,'%Y-%m-%d') BETWEEN '".$reqObject->frmdt."' AND '".$reqObject->todt."') 
                        AS tabdonetieup ON tabdonetieup.tl_customertype = mtc_srno
                        LEFT OUTER JOIN (
                            SELECT tl_customertype,COUNT(*) AS signedTieUp FROM tieup_lead 
                            WHERE ";
                            if($reqObject->srchOneAll == "A"){
                                $qry=$qry."tl_userno IN (SELECT merl_empcode FROM master_employee_reporting_link WHERE 
                                merl_reportingto=(SELECT user_empsrno FROM user_login WHERE user_srno = ".$_SESSION["userSrno"].")) ";
                            }else {
                                $qry=$qry."tl_userno = ".$reqObject->srchSalesExecutive." ";
                            }
                        $qry=$qry."AND DATE_FORMAT(tl_signdate,'%Y-%m-%d') BETWEEN '".$reqObject->frmdt."' AND '".$reqObject->todt."'
                        ) AS tabsignedtieup ON tabsignedtieup.tl_customertype = mtc_srno
                        LEFT OUTER JOIN (
                            SELECT tl_customertype,COUNT(*) AS penTieUp FROM tieup_lead WHERE tl_status = 1 ";
                            if($reqObject->srchOneAll == "A"){
                                $qry=$qry." AND tl_userno IN (SELECT merl_empcode FROM master_employee_reporting_link WHERE 
                                merl_reportingto=(SELECT user_empsrno FROM user_login WHERE user_srno = ".$_SESSION["userSrno"].")) ";
                            }else {
                                $qry=$qry." AND tl_userno = ".$reqObject->srchSalesExecutive." ";
                            }
                        $qry=$qry."AND DATE_FORMAT(tl_signdate,'%Y-%m-%d') BETWEEN '".$reqObject->frmdt."' AND '".$reqObject->todt."'";
                        $qry = $qry.") AS tabpentieup ON tabpentieup.tl_customertype = mtc_srno ";
            return $qry;
        }

        
        public function genReport($dbio,$reqObject){
           if(isset($reqObject->option) && $reqObject->option== "top5Perfomer"){
                 $this->getTop5Performer($dbio);
           }else{
             $LeadsNew = 0 ;
            $LeadsPen = 0 ;
            $LeadsDone = 0 ;
            $LeadsSigned = 0 ;
            $LeadsNewAll = 0 ;
            $LeadsPenAll = 0 ;
            $LeadsDoneAll = 0 ;
            $LeadsSignedAll = 0 ;
            $strRep = "";
            $strRepAll = "";
            
            $strHead = "<table className='table table-responsive'><thead><tr>";
            $strHead=$strHead."<td><b>Type</b></td>";
            $strHead=$strHead."<td><b>New</b></td>";
            $strHead=$strHead."<td><b>Pending</b></td>"; 
            $strHead=$strHead."<td><b>Done</b></td>";
            $strHead=$strHead."<td><b>Signed</b></td>";
            $strHead=$strHead."</tr></thead><tbody>";
            $strFoot = "</table></tbody>";
            
            $sql = $this->getReportQuery($reqObject);
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn,$sql);
            if($result){
                while($row = mysqli_fetch_row($result)){                
                    $strRep = $strRep."<tr>";
                    $strRep = $strRep."<td >".$row[0]."</td>";   // Type            
                    $strRep = $strRep."<td style='text-align: right;'>".$row[1]."</td>";   // New            
                    $strRep = $strRep."<td style='text-align: right;'>".$row[2]."</td>";   // Pending            
                    $strRep = $strRep."<td style='text-align: right;'>".$row[3]."</td>";   // Done            
                    $strRep = $strRep."<td style='text-align: right;'>".$row[4]."</td>";   // Signed            
                    $strRep = $strRep."</tr>";
                    $LeadsNew = $LeadsNew + $row[1] ;
                    $LeadsPen = $LeadsPen + $row[2] ;
                    $LeadsDone = $LeadsDone + $row[3] ;
                    $LeadsSigned = $LeadsSigned + $row[4] ;
                }
            }
            $qry = $this->getReportAllQuery($reqObject);
            $result = $dbio->getSelect($dbconn,$qry);
            if($result){
                while($row = mysqli_fetch_row($result)){                
                    $strRepAll = $strRepAll."<tr>";
                    $strRepAll = $strRepAll."<td >".$row[0]."</td>";   // Type            
                    $strRepAll = $strRepAll."<td style='text-align: right;'>".$row[1]."</td>";   // New            
                    $strRepAll = $strRepAll."<td style='text-align: right;'>".$row[2]."</td>";   // Pending            
                    $strRepAll = $strRepAll."<td style='text-align: right;'>".$row[3]."</td>";   // Done            
                    $strRepAll = $strRepAll."<td style='text-align: right;'>".$row[4]."</td>";   // Signed            
                    $strRepAll = $strRepAll."</tr>";
                    $LeadsNewAll = $LeadsNewAll + $row[1] ;
                    $LeadsPenAll = $LeadsPenAll + $row[2] ;
                    $LeadsDoneAll = $LeadsDoneAll + $row[3] ;
                    $LeadsSignedAll = $LeadsSignedAll + $row[4] ;
                }
            }
            $dbio->closeConn($dbconn);
            $strRep = $strRep."<tr><td><b>Total</b></td><td style='text-align: right;'><b>".$LeadsNew."</b></td><td style='text-align: right;'><b>".$LeadsPen."</b></td><td style='text-align: right;'><b>".$LeadsDone."</b></td><td style='text-align: right;'><b>".$LeadsSigned."</b></td></tr>";
            $strRepAll = $strRepAll."<tr><td><b>Total</b></td><td style='text-align: right;'><b>".$LeadsNewAll."</b></td><td style='text-align: right;'><b>".$LeadsPenAll."</b></td><td style='text-align: right;'><b>".$LeadsDoneAll."</b></td><td style='text-align: right;'><b>".$LeadsSignedAll."</b></td></tr>";
            if($reqObject->mode=="D"){
                // header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                // header('Content-Disposition: attachment;filename="'.$reqObject->filename.'"');
            }
            echo json_encode(array("strrep"=>$strRep, "strrepall"=>$strRepAll));
           }
        } 
        private function top5PerformerQuery(){
            $qry = "SELECT *,
                    (april + may + june + july + august + september + october + november + december + january + february + march) AS total_percentage
                FROM (
                    SELECT  
                        misb_empcode,  
                        emp_name,  
                        'E' AS TYPE,  
                        0 AS misb_brancode,  
                        '' AS ml_branch,
                        COALESCE(ROUND((100*mist_totalmarginapr)/misb_apr),0) AS april,
                        COALESCE(ROUND((100*mist_totalmarginmay)/misb_may),0) AS may,
                        COALESCE(ROUND((100*mist_totalmarginjun)/misb_jun),0) AS june,
                        COALESCE(ROUND((100*mist_totalmarginjul)/misb_jul),0) AS july,
                        COALESCE(ROUND((100*mist_totalmarginaug)/misb_aug),0) AS august,
                        COALESCE(ROUND((100*mist_totalmarginsep)/misb_sep),0) AS september,
                        COALESCE(ROUND((100*mist_totalmarginoct)/misb_oct),0) AS october,
                        COALESCE(ROUND((100*mist_totalmarginnov)/misb_nov),0) AS november,
                        COALESCE(ROUND((100*mist_totalmargindec)/misb_dec),0) AS december,
                        COALESCE(ROUND((100*mist_totalmarginjan)/misb_jan),0) AS january,
                        COALESCE(ROUND((100*mist_totalmarginfeb)/misb_feb),0) AS february,
                        COALESCE(ROUND((100*mist_totalmarginmar)/misb_mar),0) AS march
                    FROM mis_budget AS budgeted
                    LEFT OUTER JOIN master_employee ON emp_srno= misb_empcode  
                    LEFT OUTER JOIN (
                        SELECT mist_empcode,
                            SUM(mist_totalsalesapr) AS mist_totalsalesapr, SUM(mist_totalmarginapr) AS mist_totalmarginapr,
                            SUM(mist_totalsalesmay) AS mist_totalsalesmay, SUM(mist_totalmarginmay) AS mist_totalmarginmay,
                            SUM(mist_totalsalesjun) AS mist_totalsalesjun, SUM(mist_totalmarginjun) AS mist_totalmarginjun,
                            SUM(mist_totalsalesjul) AS mist_totalsalesjul, SUM(mist_totalmarginjul) AS mist_totalmarginjul,
                            SUM(mist_totalsalesaug) AS mist_totalsalesaug, SUM(mist_totalmarginaug) AS mist_totalmarginaug,
                            SUM(mist_totalsalessep) AS mist_totalsalessep, SUM(mist_totalmarginsep) AS mist_totalmarginsep,
                            SUM(mist_totalsalesoct) AS mist_totalsalesoct, SUM(mist_totalmarginoct) AS mist_totalmarginoct,
                            SUM(mist_totalsalesnov) AS mist_totalsalesnov, SUM(mist_totalmarginnov) AS mist_totalmarginnov,
                            SUM(mist_totalsalesdec) AS mist_totalsalesdec, SUM(mist_totalmargindec) AS mist_totalmargindec,
                            SUM(mist_totalsalesjan) AS mist_totalsalesjan, SUM(mist_totalmarginjan) AS mist_totalmarginjan,
                            SUM(mist_totalsalesfeb) AS mist_totalsalesfeb, SUM(mist_totalmarginfeb) AS mist_totalmarginfeb,
                            SUM(mist_totalsalesmar) AS mist_totalsalesmar, SUM(mist_totalmarginmar) AS mist_totalmarginmar
                        FROM fxdata.mis_transactions_monthly 
                        WHERE mist_finyear = '".FINYEAR."'
                        GROUP BY mist_empcode  
                    ) AS actual ON misb_empcode = mist_empcode
                    WHERE misb_finyear = '".FINYEAR."' AND misb_empcode > 0
                ) AS t1
                ORDER BY total_percentage DESC LIMIT 5;";
            return $qry;
        }

        public function getTop5Performer($dbio){
            $sql = $this->top5PerformerQuery();
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            $strRepAll = ""; 
            if($result && mysqli_num_rows($result) > 0){
                while($row = mysqli_fetch_assoc($result)){
                    $strRepAll .= "<tr>";
                    $strRepAll .= "<td style='text-align: right;'>".$row['misb_empcode']."</td>";   
                    $strRepAll .= "<td>".$row['emp_name']."</td>";   // Change this to your column names
                    $strRepAll .= "<td style='text-align:right;'>".$row['april']."%</td>";
                    $strRepAll .= "<td style='text-align:right;'>".$row['may']."%</td>";
                    $strRepAll .= "<td style='text-align:right;'>".$row['june']."%</td>";
                    $strRepAll .= "<td style='text-align:right;'>".$row['july']."%</td>";
                    $strRepAll .= "<td style='text-align:right;'>".$row['august']."%</td>";
                    $strRepAll .= "<td style='text-align:right;'>".$row['september']."%</td>";
                    $strRepAll .= "<td style='text-align:right;'>".$row['october']."%</td>";
                    $strRepAll .= "<td style='text-align:right;'>".$row['november']."%</td>";
                    $strRepAll .= "<td style='text-align:right;'>".$row['december']."%</td>";
                    $strRepAll .= "<td style='text-align:right;'>".$row['january']."%</td>";
                    $strRepAll .= "<td style='text-align:right;'>".$row['february']."%</td>";
                    $strRepAll .= "<td style='text-align:right;'>".$row['march']."%</td>";
                    $strRepAll .= "<td style='text-align:right;font-weight:bold;'>".$row['total_percentage']."%</td>"; // extra column
                    $strRepAll .= "</tr>";
                }
            }

            $dbio->closeConn($dbconn);
            $dbio->writeLog($strRepAll);
            echo json_encode($strRepAll); // returning ready-to-use HTML
        }  
    }
?>