<?php

    class Dashboard {

        public function getAllotedEmployee($dbio){
            $sql = "SELECT merl_empcode, merl_reportingto, emp_name FROM master_employee_reporting_link 
                    LEFT OUTER JOIN master_employee ON merl_empcode = emp_srno
                    WHERE merl_reportingto = (SELECT user_empsrno FROM user_login WHERE user_srno = ".$_SESSION["userSrno"].")";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            if(mysqli_num_rows($result)>0){
                while($row = mysqli_fetch_assoc($result)){
                    $this->emplist[] = $row;
                }
            }else {
                $this->emplist = array();
            }

            $qry = "SELECT emp_srno, emp_name FROM master_employee
                    LEFT OUTER JOIN user_login ON emp_srno = user_empsrno WHERE user_srno = ".$_SESSION["userSrno"]."";
            $result = $dbio->getSelect($dbconn, $qry);
            if(mysqli_num_rows($result)>0){
                $row = mysqli_fetch_row($result);
                $this->empsrno = $row[0];
            }
            $dbio->closeConn($dbconn);
        }


        // private function transactionQry($obj){
        //     $qry = "";
        //     $qry = $qry."SELECT mist_finyear, mist_brancode, mist_empcode, ROUND(SUM(mist_totalsales),2) AS mist_totalsales, round(SUM(mist_totalmargin),2) AS mist_totalmargin
        //             , DATE_FORMAT(mist_trandateymd,'%d-%m-%Y') AS mist_trandateymd 
        //             FROM fxdata.mis_transactions_monthly
        //             WHERE mist_finyear = '".$obj->finyear."' AND MONTH(mist_trandateymd) = ".$obj->month." ";
        //     if($obj->type == "E"){
        //         $qry = $qry." AND mist_empcode = ".$obj->empcode." ";
        //     } else {
        //         $qry = $qry." AND mist_brancode = ".$obj->brancode." ";
        //     }
        //     $qry = $qry." GROUP BY mist_trandateymd  ";
        //     $qry.=" UNION ALL
        //             SELECT 'TOTAL' AS mist_finyear,NULL AS mist_brancode,NULL AS mist_empcode,
        //             ROUND(SUM(mist_totalsales), 2) AS mist_totalsales,ROUND(SUM(mist_totalmargin), 2) AS mist_totalmargin,
        //             'TOTAL' AS mist_trandateymd
        //             FROM fxdata.mis_transactions_monthly
        //             WHERE mist_finyear = '".$obj->finyear."' AND MONTH(mist_trandateymd) = ".$obj->month."  "; 
        //     if($obj->type == "E"){
        //         $qry = $qry." AND mist_empcode = ".$obj->empcode." ";
        //     } else {
        //         $qry = $qry." AND mist_brancode = ".$obj->brancode." ";
        //     }
        //     $qry.=  " ORDER BY mist_trandateymd;";
        //     return $qry;
        // }
        private function transactionQry($obj){
            $qry = "";
            if(LIVE){
                $qry = $qry. "SELECT mist_finyear, mist_brancode, mist_empcode, ROUND(SUM(mist_totalsales),2) AS mist_totalsales, round(SUM(mist_totalmargin),2) AS mist_totalmargin
                        , DATE_FORMAT(mist_trandateymd,'%d-%m-%Y') AS mist_trandateymd 
                        FROM fxdata.mis_transactions_monthly
                        WHERE mist_finyear = '".$obj->finyear."' AND MONTH(mist_trandateymd) = ".$obj->month." ";
            }else{
                $qry = $qry."SELECT MAX(mist_finyear) AS mist_finyear,
                            MAX(mist_brancode) AS mist_brancode,
                            MAX(mist_empcode) AS mist_empcode,
                            ROUND(SUM(mist_totalsales), 2) AS mist_totalsales,
                            ROUND(SUM(mist_totalmargin), 2) AS mist_totalmargin,
                            DATE_FORMAT(mist_trandateymd, '%d-%m-%Y') AS mist_trandateymd  
                        FROM fxdata.mis_transactions_monthly
                        WHERE mist_finyear = '".$obj->finyear."' AND MONTH(mist_trandateymd) = ".$obj->month." ";
            }
            if($obj->type == "E"){
                $qry = $qry." AND mist_empcode = ".$obj->empcode." ";
            } else {
                $qry = $qry." AND mist_brancode = ".$obj->brancode." ";
            }
            $qry = $qry." GROUP BY mist_trandateymd  ";
            $qry.=" UNION ALL
                    SELECT 'TOTAL' AS mist_finyear,NULL AS mist_brancode,NULL AS mist_empcode,
                    ROUND(SUM(mist_totalsales), 2) AS mist_totalsales,ROUND(SUM(mist_totalmargin), 2) AS mist_totalmargin,
                    'TOTAL' AS mist_trandateymd
                    FROM fxdata.mis_transactions_monthly
                    WHERE mist_finyear = '".$obj->finyear."' AND MONTH(mist_trandateymd) = ".$obj->month."  "; 
            if($obj->type == "E"){
                $qry = $qry." AND mist_empcode = ".$obj->empcode." ";
            } else {
                $qry = $qry." AND mist_brancode = ".$obj->brancode." ";
            }
            $qry.=  " ORDER BY mist_trandateymd;";
            return $qry;
        }

        public function getDailyTransaction($dbio, $obj){
            $sql = $this->transactionQry($obj);
            $dbconn = $dbio->getConn();
            $dbio->writeLog(json_encode($dbconn));
            $result = $dbio->getSelect($dbconn, $sql);
            $data = array();
            if($result &&  mysqli_num_rows($result)>0){
                while($row = mysqli_fetch_assoc($result)){
                    $data[] = $row;
                }
            }
            $dbio->closeConn($dbconn);
            return $data;
        }


        private function dayWiseTranQry($obj){
            $qry = "";
            $qry = $qry."SELECT mist_finyear, (mist_inrcn+mist_inrtc+mist_inrvtm+mist_inrdd+mist_inrtt) AS mist_totalsales, mist_totalmargin,
                mist_trandateymd, mist_trantype, mist_certno, mist_empcode, mist_brancode, mist_clientname, mist_curisd, mist_forextotal FROM fxdata.mis_transactions
                WHERE mist_finyear = '".$obj->finyear."' AND date_format(mist_trandateymd, '%d-%m-%Y') = '".$obj->date."' ";
            if($obj->type == "E"){
                $qry = $qry." AND mist_empcode = ".$obj->recempcode." ";
            } else {
                $qry = $qry." AND mist_brancode = ".$obj->recbrancode." ";
            }
            return $qry;
        }


        public function getoneDayTransaction($dbio, $obj){
            $sql = $this->dayWiseTranQry($obj);
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            $data = array();
            if(mysqli_num_rows($result)>0){
                while($row = mysqli_fetch_assoc($result)){
                    $data[] = $row;
                }
            }
            $dbio->closeConn($dbconn);
            return $data;
        }
    

    }




?>