<?php

  class Master {

    
    public $msg;


    public function getUserDetails($dbio, $obj){
        $sql = "SELECT user_srno, user_id, user_name, user_active, user_entitytype, user_corpsrno, COALESCE(group_name, '') as group_name, group_srno  FROM user_login 
        LEFT OUTER JOIN 
        (SELECT rgtgrp_userno, rgtgrp_grpno, group_name, group_srno FROM master_user_right_group_link
        LEFT OUTER JOIN master_right_group ON group_srno = rgtgrp_grpno) AS t ON user_srno = rgtgrp_userno
        WHERE user_active = ".$obj->status." ";
        if($obj->name != ""){
          $sql = $sql." AND user_name LIKE '".$obj->name."%' ";
        }else if($obj->userid != ""){
          $sql = $sql." AND user_id = '".$obj->userid."' ";
        }else {
          if($obj->type != ""){
            $sql = $sql." AND user_entitytype = '".$obj->type."' ";
          }
        }
        if($obj->group != "A"){
          $sql = $sql." AND group_srno = ".$obj->group."";
        }
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if($result){
          $array = array();
          while($row = mysqli_fetch_assoc($result)){
            $array[] = $row;
          }
        }

        $query = "SELECT '0' as value, 'Select' as label UNION ALL
                  SELECT emp_srno as value, emp_name as label FROM master_employee";
        $result = $dbio->getSelect($dbconn, $query);
        $emplist = array();
        if(mysqli_num_rows($result)>0){
          while($row = mysqli_fetch_assoc($result)){
            $emplist[] = $row;
          }
        }else {
          $emplist = array();
        }

        $qry = "SELECT group_srno, group_name FROM master_right_group";
        $res = $dbio->getSelect($dbconn, $qry);
        if($res){
          $rightgrouplist = array();
          while($row = mysqli_fetch_assoc($res)){
            $rightgrouplist[] = $row;
          }
        }

        $qry2 = "SELECT entity_id, entity_name FROM master_entity WHERE entity_type = 'A'";
        $result2 = $dbio->getSelect($dbconn, $qry2);
        if($result2){
          $corplist = array();
          while($row = mysqli_fetch_assoc($result2)){
            $corplist[] = $row;
          }
        }

        $qry3 = "SELECT '0' as value, 'Select' as label UNION ALL
        SELECT hr_srno as value, hr_name as label FROM master_hr";
        $result3 = $dbio->getSelect($dbconn, $qry3);
        if($result3){
          $hrlist = array();
          while($row = mysqli_fetch_assoc($result3)){
            $hrlist[] = $row;
          }
        }

        return array("userlist"=>$array, "rightgrouplist"=>$rightgrouplist, "emplist"=>$emplist, "corplist"=>$corplist, "hrlist"=>$hrlist);
        $dbio->closeConn($dbconn);
    }


    public function getUserDetailsToEdit($dbio, $srno){
      $sql = "SELECT user_srno, user_name, user_id, user_mobile, user_email, user_enable, user_active, user_entitytype, group_srno, user_empsrno
              , COALESCE(entity_id,0) AS entity_id, emp_name, coalesce(user_hrsrno,0), hr_name FROM user_login 
              LEFT OUTER JOIN (SELECT rgtgrp_grpno, group_name,group_srno, rgtgrp_userno FROM master_user_right_group_link 
              LEFT OUTER JOIN master_right_group ON rgtgrp_grpno = group_srno) AS r ON user_srno = rgtgrp_userno
              LEFT OUTER JOIN master_employee ON user_empsrno = emp_srno
              LEFT OUTER JOIN master_entity ON entity_id = user_corpsrno
              LEFT OUTER JOIN master_hr ON hr_srno = user_hrsrno
              WHERE user_srno=".$srno."";
      $dbconn = $dbio->getConn();
      $result = $dbio->getSelect($dbconn, $sql);
      $dbio->closeConn($dbconn);
      if(mysqli_num_rows($result)>0){
          $row = mysqli_fetch_row($result);
          $this->srno = $row[0];
          $this->name = $row[1];
          $this->id = $row[2];
          $this->mobile = $row[3];
          $this->email = $row[4];
          $this->enable = $row[5];
          $this->active = $row[6];
          $this->type = $row[7];
          $this->groupname =$row[8];
          $this->empsrno =$row[9];
          $this->corpsrno =$row[10];
          if($row[9]*1 == 0){
            $this->empname = 'Select';  
          }else {
            $this->empname = $row[11];
          }
          $this->hrsrno = $row[12];
          $this->hrname = $row[12] == 0? 'Select':$row[13];

      }else {
        $this->msg = 'Something is wrong!';
      }
      

    }


    public function updateUser($dbio, $obj, $srno){
      $srno = $obj->srno;
      $name = $obj->name;
      $mobile = $obj->mobile;
      $email = $obj->email;
      $enable = $obj->enable;
      $active = $obj->active;
      $type = $obj->type;
      $corpsrno = $obj->corpsrno;
      if($srno != 0){
      $sql = "UPDATE user_login SET user_name = UPPER('".$name."'), user_mobile=TRIM('".$mobile."'), user_email=UPPER(TRIM('".$email."')), user_enable=".$enable.", user_active=".$active."
              , user_entitytype='".$type."', user_empsrno = ".$obj->empsrno.", user_corpsrno = ".$corpsrno.", user_hrsrno = ".$obj->hrsrno." WHERE user_srno=".$srno."";
      $dbconn = $dbio->getConn();
      $result = $dbio->getSelect($dbconn, $sql);
      
      $qry = "DELETE FROM master_user_right_group_link WHERE rgtgrp_userno=".$srno."";
      $result = $dbio->getSelect($dbconn, $qry);
      $dbio->closeConn($dbconn);
        if($result){
          $this->msg = 1;
        }
      if($obj->group !=""){
        $query= "INSERT INTO master_user_right_group_link (rgtgrp_userno, rgtgrp_grpno)
                SELECT ".$srno.", ".$obj->group."";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $query);
        $dbio->closeConn($dbconn);
      }
      
      }
    }


    public function insertUser($dbio, $obj){
      $pass = 'Zenith@1234';
      $srno = $obj->srno;
      $name = $obj->name;
      $mobile = $obj->mobile;
      $email = $obj->email;
      $enable = $obj->enable;
      $active = $obj->active;
      $type = $obj->type;
      if($srno == 0){
        $query = "SELECT * FROM user_login WHERE user_id = '".$email."' OR user_mobile = '".$mobile."'";
        $dbconn = $dbio->getConn();
        $res = $dbio->getSelect($dbconn, $query);
        if(mysqli_num_rows($res) < 1){
          $sql = "INSERT INTO user_login (user_srno, user_id, user_pass, user_mobile, user_email, user_name, user_active, user_enable, user_entitycode, user_entitytype,
                user_login_chng_pass, user_mobotpstatus, user_emailotpstatus, mobile_otp, email_otp, user_registerdate, user_empsrno, user_corpsrno,user_hrsrno,user_invalide_attempt)
                SELECT (SELECT COALESCE( MAX(user_srno),0)+1 FROM user_login) AS srno, UPPER(TRIM('".$email."')) as userid, '".$dbio->encryptString($pass)."' as pass, TRIM('".$mobile."') as mobile, UPPER(TRIM('".$email."')) as email, UPPER('".$name."') as name
                , ".$active." as active, ".$enable." as enable, 1 as entitycode, '".$type."' as entitytype, 1 as passchange, 1 as  mobilestatus, 1 as emailotpstatus, '1' as mobileotp, '1' as emailotp, now(), ".$obj->empsrno.", ".$obj->corpsrno."
                ,".$obj->hrsrno.",0;";
              $result = $dbio->getSelect($dbconn, $sql);
  
              if($obj->group != ""){
                if($type == "B"){
                  $qry = "INSERT INTO master_user_right_group_link (rgtgrp_userno, rgtgrp_grpno)
                        SELECT (SELECT COALESCE( MAX(user_srno),0) FROM user_login WHERE user_entitytype = 'B') AS srno, ".$obj->group.";";
                }else {
                  $qry = "INSERT INTO master_user_right_group_link (rgtgrp_userno, rgtgrp_grpno)
                  SELECT (SELECT COALESCE( MAX(user_srno),0) FROM user_login WHERE user_entitytype = 'E') AS srno, ".$obj->group.";";
                }
                $result = $dbio->getSelect($dbconn, $qry);
              }
              if($result){
                $this->msg = 1;
              }else {
                $this->msg = 2;        
              }
        }else {
          $this->msg = 0;
        }
        $dbio->closeConn($dbconn);
      }
    }


    public function getCountry($dbio){
      $sql = "SELECT cnt_srno, cnt_name, cnt_active, cnt_swiftcode, cnt_nationality FROM master_country";
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


    public function getCnt($dbio, $srno){
      $sql = "SELECT cnt_srno, cnt_name, cnt_nationality, cnt_swiftcode, cnt_fatf, cnt_active FROM master_country WHERE cnt_srno = ".$srno."";
      $dbconn = $dbio->getConn();
      $result = $dbio->getSelect($dbconn, $sql);
      $dbio->closeConn($dbconn);
      if(mysqli_num_rows($result)>0){
        $row = mysqli_fetch_row($result);
        $this->srno = $row[0];
        $this->name = $row[1];
        $this->nationality = $row[2];
        $this->swift = $row[3];
        $this->fatf = $row[4];
        $this->status = $row[5];
      }
    }


    public function insertOrUupdateCnt($dbio, $srno, $obj){
      $name = $obj->name;
      $nationality = $obj->nationality;
      $swift = $obj->swift;
      $status = $obj->status;
      $fatf = $obj->fatf;
      if($srno > 0){
      $sql = "UPDATE master_country SET cnt_name='".$name."', cnt_nationality='".$nationality."', cnt_swiftcode = '".$swift."', cnt_fatf = ".$fatf.", cnt_active = ".$status."
              WHERE cnt_srno = ".$srno."";
      $dbconn = $dbio->getConn();
      $result = $dbio->getSelect($dbconn, $sql);
      $dbio->closeConn($dbconn);
      $this->msg = "updated";
      }else {
        $sql = "INSERT INTO master_country (cnt_srno, cnt_name, cnt_nationality, cnt_swiftcode, cnt_fatf, cnt_active) SELECT (SELECT COALESCE( MAX(cnt_srno),0)+1 FROM master_country) AS srno, 
                '".$name."' as name, '".$nationality."' as nationality, '".$swift."' as swiftcode, ".$fatf." as fatf, ".$status." as status";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        $dbio->closeConn($dbconn);
        $this->msg = "Inserted";
      }
    }


    private function orderLogQuery($obj){
      $sql = "SELECT po_srno,po_order_no, po_refno, po_ordertype, src_name,po_name, lt_name,po_roundAmt, entity_right, ms_status, DATE_FORMAT(po_date,'%d-%m-%Y') AS order_date, 
            po_date, po_manuallead, po_currency,po_quantity FROM lead_traveller
            LEFT OUTER JOIN
            (SELECT po_currency,po_quantity,po_srno,po_order_no,po_roundAmt, po_location,po_manuallead, po_usersrno,po_status,src_name, ms_status, user_name, po_date, po_ordertype, po_refno, po_leadsource, po_name, po_profit, po_ispaid, po_isplaced
            ,CASE WHEN COALESCE(mu_usersrno,0) = 0 THEN '0' ELSE '1' END AS entity_right FROM lead_order
            LEFT OUTER JOIN user_login ON po_usersrno=user_srno
            LEFT OUTER JOIN master_lead_source ON po_leadsource= src_srno
            LEFT OUTER JOIN master_status ON po_status = ms_code
            LEFT OUTER JOIN (SELECT mu_usersrno,mu_branchcd FROM  master_user_branch_link WHERE mu_usersrno = ".$_SESSION["userSrno"].") AS rgt
            ON mu_branchcd = po_location WHERE po_isplaced =1";
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
      $sql = $sql.") AS t ON lt_orderno = po_order_no
            WHERE po_refno != '' AND entity_right = 1 ";
      if($obj->namefilter != ""){
        $sql = $sql." AND lt_name LIKE '".$obj->namefilter."%' ";
      }
      $sql = $sql." ORDER BY po_srno DESC";
      return $sql;
    }


    public function getOrderLog($dbio, $obj){
      $orderList = array();
      $statuslist = array();

      $dbconn = $dbio->getConn();
      $query = "SELECT ms_code as value, ms_status as label FROM master_status";
      $res = $dbio->getSelect($dbconn, $query);
      if($res){
          while($row = mysqli_fetch_assoc($res)){
              $statuslist[] = $row;
          }
      }
      $sql = $this->orderLogQuery($obj);
      $result = $dbio->getSelect($dbconn, $sql);
      if($result){
        while($row = mysqli_fetch_assoc($result)){
          $orderList[] = $row;
        }
      }
      
      return array("orderlist"=>$orderList, "statuslist"=>$statuslist);
      $dbio->closeConn($dbconn);
    }


    public function getFilterOption($dbio){
      $statusfilter = array();
      $isdfilter = array();
      $srcfilter = array();
      $sql_status = "SELECT 'A' AS value, 'All' AS label UNION ALL 
                    SELECT ms_code AS value, ms_status AS label FROM master_status";
      $dbconn = $dbio->getConn();
      $res = $dbio->getSelect($dbconn, $sql_status);
      if($res){
          while($row = mysqli_fetch_assoc($res)){
              $statusfilter[] = $row;
          }
      }
      $qry = "SELECT 'A' AS value, 'All' AS label UNION ALL 
              SELECT isd_code AS value, isd_name AS label FROM master_isd WHERE isd_active = 1";
      $result = $dbio->getSelect($dbconn, $qry);
      if($result){
        while($row = mysqli_fetch_assoc($result)){
            $isdfilter[] = $row;
        }
      }
      $qry = "SELECT 'A' AS value, 'All' AS label UNION ALL 
              SELECT src_srno AS VALUE, src_name AS label FROM master_lead_source WHERE src_active = 1";
      $result1 = $dbio->getSelect($dbconn, $qry);
      if($result1){
        while($row = mysqli_fetch_assoc($result1)){
            $srcfilter[] = $row;
        }
      }
      
      $dbio->closeConn($dbconn);
      return array('statusfilter'=>$statusfilter, 'isdfilter'=>$isdfilter, 'srcfilter'=>$srcfilter);
    }

    public function getFilterISD($dbio){
      $isok=true;
      $isdfilter = array();
      $dbconn = $dbio->getConn();
      $qry = "SELECT 'A' AS value, 'All' AS label UNION ALL 
              SELECT isd_code AS value, isd_name AS label FROM master_isd WHERE isd_active = 1";
      $result = $dbio->getSelect($dbconn, $qry);
      if($result){
        while($row = mysqli_fetch_assoc($result)){
            $isdfilter[] = $row;
        }
      }
      $dbio->closeConn($dbconn);
      return array('status'=>$isok, 'list'=>$isdfilter); 
    }
     public function getCorporateList($dbio){
      $isok=true;
      $corplist = array();
      $dbconn = $dbio->getConn();
      $qry2 = "SELECT entity_id, entity_name,entity_type FROM master_entity WHERE entity_type = 'A'";
        $result2 = $dbio->getSelect($dbconn, $qry2);
        if($result2){
          $corplist = array();
          while($row = mysqli_fetch_assoc($result2)){
            $corplist[] = $row;
          }
        }
      $dbio->closeConn($dbconn);
      return array('status'=>$isok, 'list'=>$corplist); 
    }


    public function getUserBranchLink($dbio, $srno, $corpsrno){
      $link = array();
      if($corpsrno > 0){
        $sql = "SELECT ml_branchcd,ml_branch,CASE WHEN COALESCE(cu_usersrno,0) = 0 THEN 'NO' ELSE 'YES' END AS entity_right 
        FROM master_location 
        LEFT OUTER JOIN             
        (SELECT cu_usersrno,cu_branchcd FROM  master_corporate_branch_link WHERE cu_usersrno = ".$srno.") AS rgt
        ON cu_branchcd = ml_branchcd";
      }else {
        $sql = "SELECT ml_branchcd,ml_branch,CASE WHEN COALESCE(mu_usersrno,0) = 0 THEN 'NO' ELSE 'YES' END AS entity_right 
                FROM master_location 
                LEFT OUTER JOIN             
                (SELECT mu_usersrno,mu_branchcd FROM  master_user_branch_link WHERE mu_usersrno = ".$srno.") AS rgt
                ON mu_branchcd = ml_branchcd";
      }
      $dbconn = $dbio->getConn();
      $result = $dbio->getSelect($dbconn, $sql);
      if($result){
        while($row = mysqli_fetch_assoc($result)){
          $link[] = $row;
        }
      }
      return $link;
      $dbio->closeConn($dbconn);  
    }
  

    public function changeRight($dbio, $obj){
      if($obj->allow == "1"){
        if($obj->corpsrno*1 > 0){
          $sql = "DELETE FROM master_corporate_branch_link WHERE cu_usersrno = ".$obj->srno." AND cu_branchcd = ".$obj->branch.";
                  INSERT INTO master_corporate_branch_link (cu_usersrno, cu_branchcd)
                  VALUES (".$obj->srno.", ".$obj->branch.")";
        }else {
          $sql = "DELETE FROM master_user_branch_link WHERE mu_usersrno = ".$obj->srno." AND mu_branchcd = ".$obj->branch.";
                  INSERT INTO master_user_branch_link (mu_usersrno, mu_branchcd)
                  VALUES (".$obj->srno.", ".$obj->branch.")";
        }
        $dbconn = $dbio->getConn();
        $result = $dbio->batchQueries($dbconn, $sql);
        if($result){
          $this->msg = 1;
        }
        $dbio->closeConn($dbconn);
      }else {
        if($obj->corpsrno*1 > 0){
          $sql = "DELETE FROM master_corporate_branch_link WHERE cu_usersrno = ".$obj->srno." AND cu_branchcd = ".$obj->branch." ;";
        }else {
          $sql = "DELETE FROM master_user_branch_link WHERE mu_usersrno = ".$obj->srno." AND mu_branchcd = ".$obj->branch." ;";
        }
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if($result){
          $this->msg = 1;
        }
        $dbio->closeConn($dbconn);
      }
     
    }


    public function getBranchByCode($dbio, $code){
      $sql = "SELECT ml_branchcd, ml_branch, ml_branchaddress, ml_active, ml_maplink,ml_backofficebranch FROM master_location WHERE ml_branchcd = ".$code."";
      $dbconn = $dbio->getConn();
      $result = $dbio->getSelect($dbconn, $sql);
      $dbio->closeConn($dbconn);
      $row = mysqli_fetch_row($result);
      $this->code = $row[0];
      $this->name = $row[1];
      $this->address = $row[2];
      $this->status = $row[3];
      $this->maplink = $row[4];
      $this->backOfficeBranch = $row[5];
    }


    public function updateMasterLocation($dbio, $obj){
      if($obj->addNewBranch == 1){
        $sql = "INSERT INTO master_location (ml_branchcd, ml_branch, ml_branchaddress, ml_active, ml_maplink, ml_backofficebranch)
                VALUES (".$obj->code.", '".$obj->name."', '".$obj->address."', ".$obj->status.", '".$obj->link."' , ".$obj->backOfficeBranch." )";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        $dbio->closeConn($dbconn);
      }else{
        $sql = "UPDATE master_location SET ml_branch = '".$obj->name."', ml_branchaddress = '".$obj->address."', ml_active = ".$obj->status.", 
        ml_maplink = '".$obj->link."' , ml_backofficebranch = ".$obj->backOfficeBranch." WHERE ml_branchcd = ".$obj->code."";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        $dbio->closeConn($dbconn);
      }
      $this->msg = 1;
    }


    public function updateOrderStatus($dbio, $obj){
      if($obj->status == '14'){
        $sql = "UPDATE lead_order SET po_status = '".$obj->status."', po_donetimestamp = now()  WHERE po_order_no = '".$obj->orderno."'";
      }else {
        $sql = "UPDATE lead_order SET po_status = '".$obj->status."', po_donetimestamp = NULL  WHERE po_order_no = '".$obj->orderno."'";
      }
      $dbconn = $dbio->getConn();
      $result = $dbio->getSelect($dbconn, $sql);
      $dbio->closeConn($dbconn);
      $this->msg = 1;
      $qry = "INSERT INTO master_order_log (lg_usersrno, lg_logtime, lg_orderno, lg_desc)
              VALUES (".$_SESSION["userSrno"].", now(), '".$obj->orderno."', CONCAT('Updated Status To ', (SELECT ms_status FROM master_status WHERE ms_code = ".$obj->status.")))";
      $dbconn = $dbio->getConn();
      $result = $dbio->getSelect($dbconn, $qry);
      $dbio->closeConn($dbconn);
    }

  
    public function insertRemark($dbio, $obj){
      $sql = "INSERT INTO master_order_remark (rem_userSrno, rem_orderno, rem_timestamp, rem_desc)
              VALUES (".$_SESSION["userSrno"].", '".$obj->orderno."', now(), '".$obj->remark."')";
      $dbconn = $dbio->getConn();
      $result = $dbio->getSelect($dbconn, $sql);
      if($result){
        return $this->getActivityLog($dbio, $obj->orderno);
      }
      $dbio->closeConn($dbconn);
    }


    public function getActivityLog($dbio, $orderno){
      $details = array();
      $remark[] = array();
      $query = "SELECT lg_usersrno, lg_logtime, lg_orderno, lg_desc, user_name FROM master_order_log
                LEFT OUTER JOIN user_login ON lg_usersrno = user_srno
                WHERE lg_orderno ='".$orderno."' ORDER BY lg_logtime DESC";
      $dbconn = $dbio->getConn();
      $res = $dbio->getSelect($dbconn, $query);
      if($res){
        while($row = mysqli_fetch_assoc($res)){
          $details[] = $row;
        }
      }
      $sql = "SELECT rem_userSrno, rem_orderno, user_name, rem_timestamp, rem_desc FROM master_order_remark 
              LEFT OUTER JOIN user_login ON rem_userSrno = user_srno
              WHERE rem_orderno = '".$orderno."' ORDER BY rem_timestamp DESC";
      $dbconn = $dbio->getConn();
      $result = $dbio->getSelect($dbconn, $sql);
      if($result){
        while($row = mysqli_fetch_assoc($result)){
          $remark[] = $row;
        }
      } 
      return array("details"=>$details, "remark"=> $remark);
      $dbio->closeConn($dbconn);
    }


    public function getDocLists($dbio){
      $doclist = array();
      $sql = "SELECT m_srno, m_documents FROM master_document";
      $dbconn = $dbio->getConn();
      $result = $dbio->getSelect($dbconn, $sql);
      if($result){
        while($row = mysqli_fetch_assoc($result)){
          $doclist[] = $row;
        }
      }
      return $doclist;
      $dbio->closeConn($dbconn);
    }


    public function insertDoc($dbio, $docname){
      $sql = "INSERT INTO master_document (m_srno, m_documents)
              SELECT (SELECT COALESCE((SELECT max(m_srno) FROM master_document),0))+1, UPPER('".$docname."')";
      $dbconn = $dbio->getConn();
      $result = $dbio->getSelect($dbconn, $sql);
      if($result){
        $this->msg = "1";
      }
      $dbio->closeConn($dbconn);
    }


    public function updateDoc($dbio, $docname, $docid){
      $sql = "UPDATE master_document SET m_documents = UPPER('".$docname."') WHERE m_srno = ".$docid."";
      $dbconn = $dbio->getConn();
      $result = $dbio->getSelect($dbconn, $sql);
      if($result){
        $this->msg = "1";
      }
      $dbio->closeConn($dbconn);
    }


    public function getEmployee($dbio){
      $employees = array();
      $allemp = array();
      $designation = array();
      $sql = "SELECT emp_srno, emp_name, emp_desig, emp_email, emp_mobile, dsg_desc FROM master_employee
              LEFT OUTER JOIN master_designation ON emp_desig = dsg_srno
              ORDER BY emp_srno";
      $dbconn = $dbio->getConn();
      $result = $dbio->getSelect($dbconn, $sql);
      if($result){
        while($row = mysqli_fetch_assoc($result)){
          $employees[] = $row;
        }
      }

      $qry = "SELECT dsg_srno, dsg_desc FROM master_designation";
      $result = $dbio->getSelect($dbconn, $qry);
      if($result){
        while($row = mysqli_fetch_assoc($result)){
          $designation[] = $row;
        }
      }

      $qry = "SELECT emp_srno, emp_name FROM master_employee";
      $result = $dbio->getSelect($dbconn, $qry);
      if($result){
        while($row = mysqli_fetch_assoc($result)){
          $allemp[] = $row;
        }
      }

      return array("employees"=>$employees, "designation"=>$designation, "allemp"=>$allemp);
      $dbio->closeConn($dbconn);
    }


    public function insertEmployee($dbio, $obj){
      $sql = "INSERT INTO master_employee (emp_srno, emp_name, emp_desig, emp_email, emp_mobile) SELECT";

      if($obj->srno > 0) $sql = $sql." ".$obj->srno."";
      else  $sql = $sql." (SELECT COALESCE(MAX(emp_srno), 0) FROM master_employee where emp_srno < 100000 ) + 1 ";
      
      $sql = $sql." , UPPER(TRIM('".$obj->name."')), ".$obj->designation.", UPPER(TRIM('".$obj->email."')), TRIM('".$obj->mobile."')";
      $dbconn = $dbio->getConn();
      $result = $dbio->getSelect($dbconn, $sql);
      if($result){
        $this->msg = 1;
      }else {
        $this->msg = 0;
      }
      $dbio->closeConn($dbconn);
    }


    public function updateEmployee($dbio, $obj){
      $sql = "UPDATE master_employee SET  emp_name = UPPER('".$obj->name."'), emp_desig = ".$obj->designation." ,emp_email = UPPER(TRIM('".$obj->email."')) ,emp_mobile = TRIM('".$obj->mobile."')
              WHERE emp_srno = ".$obj->srno."";
      $dbconn = $dbio->getConn();
      $result = $dbio->getSelect($dbconn, $sql);
      if($result){
        $this->msg = 1;
      }else {
        $this->msg = 0;
      }
      $dbio->closeConn($dbconn);
    }


    public function getEmployeeBySrno($dbio, $srno){
      $sql = "SELECT emp_srno, emp_name, emp_desig, emp_email, emp_mobile FROM master_employee WHERE emp_srno = ".$srno."";
      $dbconn = $dbio->getConn();
      $result= $dbio->getSelect($dbconn, $sql);
      if(mysqli_num_rows($result)>0){
        $row = mysqli_fetch_row($result);
        $this->msg = 1;
        $this->srno = $row[0];
        $this->name = $row[1];
        $this->desig = $row[2];
        $this->email = $row[3];
        $this->mobile = $row[4];
      }else {
        $this->msg = 0;
      }
      $dbio->closeConn($dbconn);
    }


    public function getReportingList($dbio, $srno){
      $reportinglist = array();
      $qry = "SELECT emp_srno, emp_name, merl_empcode, merl_reportingto FROM master_employee_reporting_link 
                LEFT OUTER JOIN master_employee ON merl_reportingto = emp_srno
                WHERE merl_empcode = ".$srno."";
      $dbconn = $dbio->getConn();
      $result = $dbio->getSelect($dbconn, $qry);
      if(mysqli_num_rows($result)>0){
        while($row = mysqli_fetch_assoc($result)){
          $reportinglist[] = $row;
        }
      }else {
        $reportinglist = array();
      }
      return $reportinglist;
      $dbio->closeConn($dbconn);
    }


    public function addReporting($dbio, $obj){
      $sql = "DELETE FROM master_employee_reporting_link WHERE merl_empcode = ".$obj->srno." AND merl_reportingto = ".$obj->reportingto.";
              INSERT INTO master_employee_reporting_link (merl_empcode, merl_reportingto)
              SELECT ".$obj->srno.", ".$obj->reportingto."";
      $dbconn = $dbio->getConn();
      $result = $dbio->batchQueries($dbconn, $sql);
      $dbio->closeConn($dbconn);
      if($result){
        $qry = "SELECT merl_empcode, merl_reportingto, emp_name FROM master_employee_reporting_link
                LEFT OUTER JOIN master_employee ON merl_reportingto = emp_srno
                WHERE merl_empcode = ".$obj->srno." AND merl_reportingto= ".$obj->reportingto."";
        $dbconn = $dbio->getConn();
        $res = $dbio->getSelect($dbconn, $qry);
        if(mysqli_num_rows($res)>0){
          $row = mysqli_fetch_row($res);
          $this->name = $row[2];
          $this->srno = $obj->srno;
        }
        $this->msg= 1;
        $dbio->closeConn($dbconn);
      }else {
        $this->msg = 0;
      }
    }


    public function deleteReporting($dbio, $reportingto, $empcode){
      $sql = "DELETE FROM master_employee_reporting_link WHERE merl_empcode=".$empcode." AND merl_reportingto=".$reportingto."";
      $dbconn = $dbio->getConn();
      $result = $dbio->getSelect($dbconn, $sql);
      if($result){
        $this->msg = 1;
        $this->srno = $empcode;
      }else {
        $this->msg = 0;
      }
      $dbio->closeConn($dbconn);
    }


    public function getThirdPartyList($dbio, $obj){
      $tplist = array();
      $sql = "SELECT part_srno, part_name, part_active FROM master_third_party WHERE 1=1 ";
      if($obj->activefilter != "A"){
        $sql = $sql." AND part_active = ".$obj->activefilter."";
      }
      $dbconn = $dbio->getConn();
      $result = $dbio->getSelect($dbconn, $sql);
      if(mysqli_num_rows($result)>0){
        while($row = mysqli_fetch_assoc($result)){
          $tplist[] = $row;
        }
      }
      return $tplist;
      $dbio->closeConn($dbconn);
    }


    public function insertThirdPartyData($dbio, $obj){
      $sql = "INSERT INTO master_third_party (part_srno, part_name, part_active)
              SELECT (SELECT COALESCE(MAX(part_srno), 0) + 1 FROM master_third_party), '".$obj->name."', ".$obj->active."";
      $dbconn = $dbio->getConn();
      $result = $dbio->getSelect($dbconn, $sql);
      if($result){
        $this->msg = 1;
      }else {
        $this->msg = 0;
      }
      $dbio->closeConn($dbconn);
    }


    public function updateThirdPartyData($dbio, $obj){
      $sql = "UPDATE master_third_party SET part_name = '".$obj->name."', part_active = ".$obj->active." WHERE part_srno = ".$obj->srno."";
      $dbconn = $dbio->getConn();
      $result = $dbio->getSelect($dbconn, $sql);
      if($result){
        $this->msg = 1;
      }else {
        $this->msg = 0;
      }
      $dbio->closeConn($dbconn);
    }


    public function getThirdPartyDataBySrno($dbio, $srno){
      $sql = "SELECT part_srno, part_name, part_active FROM master_third_party WHERE part_srno = ".$srno."";
      $dbconn = $dbio->getConn();
      $result = $dbio->getSelect($dbconn, $sql);
      if(mysqli_num_rows($result)>0){
        $row = mysqli_fetch_row($result);
        $this->msg = 1;
        $this->srno = $row[0];
        $this->name = $row[1];
        $this->active = $row[2];
      }else {
        $this->msg = 0;
      }
      $dbio->closeConn($dbconn);
    }

    public function getEmpList($dbio){
      $query = "SELECT '0' as value, 'Select' as label UNION ALL
                    SELECT emp_srno as value, emp_name as label FROM master_employee";
      $dbconn = $dbio->getConn();
      $result = $dbio->getSelect($dbconn, $query);
      $emplist = array();
      if (mysqli_num_rows($result) > 0) {
        while ($row = mysqli_fetch_assoc($result)) {
          $emplist[] = $row;
        }
      }
      $dbio->closeConn($dbconn);
      return $emplist;
    }


  }

?>