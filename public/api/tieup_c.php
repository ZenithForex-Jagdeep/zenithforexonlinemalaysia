<?php

class Tieup
{

    public function getFollowUpList($dbio) {
        $sql = "SELECT tl_srno, tl_name, mtc_name, fu_followed, fu_status FROM tieup_followup 
            LEFT OUTER JOIN tieup_lead ON tl_srno = fu_srno
            LEFT OUTER JOIN master_tieupcust ON mtc_srno = tl_customertype";
            //   WHERE fu_status = 2";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if($result){
            $array = array();
            while($row = mysqli_fetch_assoc($result)){
                $array[] = $row;
            }
        }
        $dbio->closeConn($dbconn);
        return $array;
    }

    public function insertTieUpLead($dbio, $obj)
    {
        $sql = "INSERT INTO tieup_lead (tl_srno, tl_userno, tl_customertype, tl_leadtype, tl_name, tl_mobile, tl_email, tl_address, tl_visitingcard, tl_remark
                    , tl_nextvisit, tl_status, tl_expvolume, tl_timestamp, tl_date, tl_personname, tl_donedate, tl_signdate)
                    SELECT (SELECT COALESCE(MAX(tl_srno), 0) FROM tieup_lead) +1, (SELECT user_empsrno FROM user_login WHERE user_srno = " . $_SESSION["userSrno"] . "), '" . $obj->custType . "', '" . $obj->leadType . "', '" . $obj->corpname . "'
                    , '" . $obj->mobile . "', '" . $obj->email . "', '" . $obj->address . "', '', '" . $obj->remark . "', '" . $obj->nextVisit . "', '" . $obj->status . "', " . $obj->volume . ", NOW(),
                    NOW(), '" . $obj->name . "' ";
        if ($obj->status * 1 == 1) {
            $sql = $sql . " , null, null";
        } else if ($obj->status * 1 == 2) {
            $sql = $sql . " , now(), null";
        } else {
            $sql = $sql . " , null, now()";
        }
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        $qry = "SELECT tl_srno, tl_visitingcard FROM tieup_lead WHERE tl_srno = (SELECT MAX(tl_srno) FROM tieup_lead)";
        $res = $dbio->getSelect($dbconn, $qry);
        if (mysqli_num_rows($res) > 0) {
            $row = mysqli_fetch_row($res);
            $this->srno = $row[0];
            $this->filename = $row[1];
            $this->msg = 1;
            $query = "INSERT INTO tieup_followup SELECT " . $row[0] . ", '" . $obj->remark . "', '" . $obj->leadType . "', '" . $obj->nextVisit . "', " . $obj->status . ", NOW()";
            $res = $dbio->getSelect($dbconn, $query);
            $query2 = "INSERT INTO tieup_activity_log SELECT (SELECT COALESCE(MAX(tal_srno), 0) +1 FROM tieup_activity_log), " . $_SESSION["userSrno"] . ", NOW(), 
                        (SELECT MAX(tl_srno) FROM tieup_lead), 'NEWLEAD'";
            $res2 = $dbio->getSelect($dbconn, $query2);
        } else {
            $this->msg = 0;
        }
        $dbio->closeConn($dbconn);
    }


    public function updateTieUpLead($dbio, $obj)
    {
        $sql = "UPDATE tieup_lead SET tl_personname = '" . $obj->name . "' , tl_mobile = '" . $obj->mobile . "' , tl_email = '" . $obj->email . "' , 
                    tl_address = '" . $obj->address . "', tl_expvolume = '" . $obj->volume . "' WHERE tl_srno = " . $obj->srno . "";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if ($result) {
            $this->srno = $obj->srno;
            $this->msg = 1;
            $query2 = "INSERT INTO tieup_activity_log SELECT (SELECT COALESCE(MAX(tal_srno), 0) +1 FROM tieup_activity_log), " . $_SESSION["userSrno"] . ", NOW(), 
                        " . $obj->srno . ", 'LEADEDIT'";
            $res2 = $dbio->getSelect($dbconn, $query2);
        } else {
            $this->msg = 0;
        }
        $dbio->closeConn($dbconn);
    }


    private function tiupDataQuery($param)
    {
        $qry = "SELECT ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS serial_no,	tl_srno, mtc_name, tl_userno, tl_customertype, ts_status, tl_leadtype, tl_name, 
            tl_mobile, tl_email, tl_address, tl_visitingcard, tl_remark, DATE_FORMAT(tl_nextvisit, '%d-%m-%Y') as tl_nextvisit
            , tl_status, tl_expvolume, tl_timestamp, emp_name
            FROM tieup_lead LEFT OUTER JOIN master_tieupcust ON tl_customertype = mtc_srno 
            LEFT OUTER JOIN master_tieupstatus ON tl_status = ts_srno
            LEFT OUTER JOIN master_employee ON emp_srno = tl_userno
            WHERE 1 = 1 ";

        //$dateType=$param->dateType==="NextVisit"?"tl_nextvisit":"tl_time_stamp";

        if ($param == "0") {
            $qry = $qry . "";
        } else {
            if ($param->leadtype != "") {
                $qry = $qry . " AND tl_leadtype = '" . $param->leadtype . "' ";
            }
            if ($param->corpfilter != "") {
                $qry = $qry . " AND tl_customertype = " . $param->corpfilter . " ";
            }
            if ($param->statusfilter != "") {
                $qry = $qry . " AND tl_status = " . $param->statusfilter . " ";
            }
            if($param->empSrno!='0'){
                $qry = $qry . " AND tl_userno = " . $param->empSrno . " ";
            }
            if ($param->dateType == "D") 
                $qry = $qry . " AND date_format(tl_timestamp, '%Y-%m-%d') BETWEEN '".$param->fromDate."' and '".$param->toDate."' ";
            else 
                $qry = $qry . " AND tl_nextvisit BETWEEN '".$param->fromDate."' and '".$param->toDate."' ";
        }
        $qry = $qry . " AND (tl_userno IN (SELECT merl_empcode FROM master_employee_reporting_link WHERE merl_reportingto IN (SELECT user_empsrno FROM user_login WHERE user_srno = " . $_SESSION["userSrno"] . "))
                OR tl_userno = (SELECT user_empsrno FROM user_login WHERE user_srno = " . $_SESSION["userSrno"] . "))  ORDER BY tl_timestamp DESC ";
        if ($param->filter != "") {
            $qry = $qry . "  LIMIT " . $param->filter . " ";
        }
        return $qry;
    }


    public function getTieupData($dbio)
    {
        $custtype = array();
        $leaddata = array();
        $statuslist = array();
        $sql = "SELECT ts_srno, ts_status FROM master_tieupstatus";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if ($result) {
            while ($row = mysqli_fetch_assoc($result)) {
                $statuslist[] = $row;
            }
        }

        $sql = "SELECT mtc_srno, mtc_name FROM master_tieupcust";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if ($result) {
            while ($row = mysqli_fetch_assoc($result)) {
                $custtype[] = $row;
            }
        }

        // $qry = $this->tiupDataQuery("0");
        // $result = $dbio->getSelect($dbconn, $qry);
        // if ($result) {
        //     while ($row = mysqli_fetch_assoc($result)) {
        //         $leaddata[] = $row;
        //     }
        // }
        return array("custtype" => $custtype, "leaddata" => $leaddata, "statuslist" => $statuslist);
        $dbio->closeConn($dbconn);
    }


    public function getFilterTieup($dbio, $obj)
    {
        $leaddata = array();
        $sql = $this->tiupDataQuery($obj);
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if ($result) {
            while ($row = mysqli_fetch_assoc($result)) {
                $leaddata[] = $row;
            }
        }
        return $leaddata;
        $dbio->closeConn($dbconn);
    }


    public function getTieUpDataBySrno($dbio, $srno)
    {
        $sql = "SELECT tl_srno, tl_userno, tl_customertype, tl_leadtype, tl_name, tl_mobile, tl_email, tl_address, tl_visitingcard, tl_remark, 
                    tl_nextvisit, tl_status, tl_expvolume, tl_timestamp, tl_personname, tl_cardext
                    FROM tieup_lead WHERE tl_srno = " . $srno . "";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if (mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_row($result);
            $this->msg = 1;
            $this->corporatetype = $row[2];
            $this->leadtype = $row[3];
            $this->name = $row[4];
            $this->mobile = $row[5];
            $this->email = $row[6];
            $this->address = $row[7];
            $this->visitcard = $row[8];
            $this->remark = $row[9];
            $this->nextvisit = $row[10];
            $this->status = $row[11];
            $this->volume = $row[12];
            $this->personname = $row[14];
            $this->ext = $row[15];
        } else {
            $this->msg = 0;
        }
        $dbio->closeConn($dbconn);
    }


    public function getFollowUpData($dbio, $srno)
    {
        $sql = "SELECT ts_srno, ts_status FROM master_tieupstatus";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if ($result) {
            while ($row = mysqli_fetch_assoc($result)) {
                $this->statuslist[] = $row;
            }
        }

        $query = "SELECT mtc_name, tl_srno, tl_name, tl_email, tl_mobile, tl_address,ts_status, tl_expvolume FROM tieup_lead
                    LEFT OUTER JOIN master_tieupcust ON tl_customertype = mtc_srno LEFT OUTER JOIN master_tieupstatus ON tl_status = ts_srno
                    WHERE tl_srno = " . $srno . "";
        $qresult = $dbio->getSelect($dbconn, $query);
        if ($qresult) {
            $row = mysqli_fetch_row($qresult);
            $this->type = $row[0];
            $this->name = $row[2];
            $this->email = $row[3];
            $this->mobile = $row[4];
            $this->address = $row[5];
            $this->status = $row[6];
            $this->volume = $row[7];
        }

        $qry = "SELECT ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS serial_no,fu_srno, fu_remark, fu_leadtype, DATE_FORMAT(fu_nextvisit, '%d-%m-%Y') as fu_nextvisit,
                    fu_status, fu_timestamp, ts_status, fu_timestamp, DATE_FORMAT(fu_followed, '%d-%m-%Y') as fu_followed FROM tieup_followup
                    LEFT OUTER JOIN master_tieupstatus ON fu_status = ts_srno WHERE fu_srno =" . $srno . "";
        $res = $dbio->getSelect($dbconn, $qry);
        if (mysqli_num_rows($res) > 0) {
            while ($row = mysqli_fetch_assoc($res)) {
                $this->followuplist[] = $row;
            }
        } else {
            $this->followuplist = array();
        }
        // return array("statuslist"=>$statuslist, "followuplist"=>$followuplist, "header"=>$header);
        $dbio->closeConn($dbconn);
    }


    private function getTieupActivityLog($leadsrno)
    {
        return "SELECT tal_srno, tal_usersrno, user_name, tal_timestamp, tal_desc FROM tieup_activity_log 
                    LEFT OUTER JOIN user_login ON tal_usersrno = user_srno
                    WHERE tal_leadsrno = " . $leadsrno . "";
    }

    public function getActivityLog($dbio, $leadsrno)
    {
        $activitylog = array();
        $sql = $this->getTieupActivityLog($leadsrno);
        $dbconn = $dbio->getConn();
        $res = $dbio->getSelect($dbconn, $sql);
        if (mysqli_num_rows($res) > 0) {
            while ($row = mysqli_fetch_assoc($res)) {
                $activitylog[] = $row;
            }
        } else {
            $activitylog = array();
        }
        return $activitylog;
        $dbio->closeConn($dbconn);
    }

    public function insertFollowUpData($dbio, $obj)
    {
        $sql = "INSERT INTO tieup_followup (fu_srno, fu_line_no, fu_remark, fu_leadtype, fu_nextvisit, fu_status, fu_timestamp, fu_followed, fu_empcode, fu_usersrno)
                    SELECT " . $obj->srno . ", (SELECT COALESCE(MAX(fu_line_no),0)+1 FROM tieup_followup WHERE fu_srno = " . $obj->srno . "), '" . $obj->remark . "', '" . $obj->leadtype . "', '" . $obj->nextvisit . "', '" . $obj->status . "', now(), '" . $obj->followed ."', ".$_SESSION["userEmpsrno"].", ".$_SESSION["userSrno"]." ";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if ($result) {
            $this->msg = 1;
        }
        $qry = "UPDATE tieup_lead SET tl_remark='" . $obj->remark . "', tl_nextvisit='" . $obj->nextvisit . "', tl_leadtype='" . $obj->leadtype . "', tl_status =" . $obj->status . "";
        if ($obj->status == "2") {
            $qry = $qry . ", tl_donedate = NOW(), tl_signdate = NULL WHERE tl_srno =" . $obj->srno . "";
        } else if ($obj->status == "3") {
            $qry = $qry . ", tl_donedate = NULL, tl_signdate = NOW() WHERE tl_srno =" . $obj->srno . "";
        } else {
            $qry = $qry . ", tl_donedate = NULL, tl_signdate = NULL WHERE tl_srno =" . $obj->srno . "";
        }
        $res = $dbio->getSelect($dbconn, $qry);

        $query = "INSERT INTO tieup_activity_log (tal_srno, tal_usersrno, tal_timestamp, tal_leadsrno, tal_desc)
                    SELECT (SELECT COALESCE(MAX(tal_srno), 0) FROM tieup_activity_log) +1, " . $_SESSION["userSrno"] . ", NOW(), " . $obj->srno . ", 'FOLLOWUP'";
        $result = $dbio->getSelect($dbconn, $query);

        $query_t = $this->getTieupActivityLog($obj->srno);
        $res = $dbio->getSelect($dbconn, $query_t);
        if (mysqli_num_rows($res) > 0) {
            while ($row = mysqli_fetch_assoc($res)) {
                $this->activitylog[] = $row;
            }
        } else {
            $this->activitylog = array();
        }
        $dbio->closeConn($dbconn);
    }


}




?>