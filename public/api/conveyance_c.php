<?php

class Conveyance {

    public function getConveyanceList($dbio, $obj){
        $resarray = array();
        $sql = "SELECT
                CASE 
                    WHEN ce_empcode = ".$obj->userEmpSrno." THEN 'S'
                    ELSE 'O' 
                END AS convtype, 
                ce_srno, 
                ce_type,
                ce_mode, 
                ce_from, 
                ce_to, 
                ce_distance, 
                ce_amount, 
                ce_remark, 
                DATE_FORMAT(ce_from_date, '%d-%m-%Y') AS ce_from_date,
                DATE_FORMAT(ce_to_date, '%d-%m-%Y') AS ce_to_date,
                ce_document,
                ce_status,
                ce_entry_date,
                b1.ml_branch AS ml_branch,
                ce_manual_no, 
                ce_followup, 
                ce_followup_srno,
                user_name,
                ce_random_number,
                ce_empcode,
                ce_usersrno,
                b2.ml_branch AS ml_branchVisit
            FROM conveyance_entry AS t
            LEFT OUTER JOIN master_location AS b1 ON b1.ml_backofficebranch = t.ce_branch
            LEFT OUTER JOIN master_location AS b2 ON b2.ml_backofficebranch = t.ce_branch_visit
            LEFT OUTER JOIN user_login ON user_srno = t.ce_usersrno
            WHERE 
                (t.ce_empcode IN 
                    (SELECT merl_empcode 
                    FROM master_employee_reporting_link
                    WHERE merl_reportingto = ".$_SESSION["userEmpsrno"].") 
                OR t.ce_empcode = ".$_SESSION["userEmpsrno"].")
            AND 1=1";
        if($obj->branch != ""){
            $sql .= " AND ce_branch = ".$obj->branch."";
        }
        if($obj->filterStatus != ""){
            $sql .= " AND ce_status = '".$obj->filterStatus."'";
        }
        $sql .= " ORDER BY ce_srno";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if($result){
            while($row = mysqli_fetch_assoc($result)){
                $resarray[] = $row;
            }
        }
        $dbio->closeConn($dbconn);
        return $resarray;
    }

    private function callApiPost($url, $postData){
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL,$url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/x-www-form-urlencoded'));
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS,  http_build_query($postData));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $server_output = curl_exec($ch);
        $dataq['content']        = $server_output;
        $dataq['err']            = curl_errno( $ch );
        $dataq['errmsg']         = curl_error( $ch );
        $dataq['result']         = curl_getinfo( $ch );
        $dataq['http_status']    = curl_getinfo($ch, CURLINFO_HTTP_CODE);   
        curl_close ($ch);
        return $server_output;
    }

    public function submitConveyanceData($dbio, $obj){
        
        // if($obj->mode == "B" OR $obj->mode == "C"){
        //     $obj->amount = ($obj->distance * AMOUNT);
        // }

        $url = "http://localhost:1005/api/tran_conveyance_entry.php";
        $postData = array("obj"=>$obj);
        $this->callApiPost($url, $postData);

        $uploadDocs = $obj->uploadedDoc;
        $resarray = array();
        $sql1 = "";
        $msg = "";

        $sql = "INSERT INTO conveyance_entry (ce_srno, ce_type, ce_branch, ce_mode, ce_amount, ce_remark, ce_document, ce_status, ce_entry_date, ce_usersrno, ce_approval_1, ce_approval_email, ce_random_number, ce_empcode, ce_branch_visit, ce_manual_no, ce_followup, ce_followup_srno, ce_from_date, ce_to_date, ce_from, ce_to, ce_distance) SELECT (SELECT COALESCE(MAX(ce_srno),0)+1 FROM conveyance_entry), '".$obj->type."', ".$obj->branch.", '".$obj->mode."', ".$obj->amount.", '".$obj->remark."', '".$obj->documentUpload."', '".$obj->status."', NOW(), ".$_SESSION['userSrno'].", 0, 0, '".$obj->uniqueKey."', ".$_SESSION['userEmpsrno'].",";
        if($obj->type == "BV"){
            $sql .= " ".$obj->branchVisit.", 0, 0, 0,";
        }else if($obj->type == "D"){
            $sql .= " 0, '".$obj->manualNo."', 0, 0,";
        }else if($obj->type == "LG"){
            $sql .= " 0, 0, ".$obj->followUp.", ".$obj->followUpSrno.",";
        }
        if($obj->mode == "H"){
            $sql .= " '".$obj->fromDate."', '".$obj->toDate."', '', '', 0 ";
        }else if($obj->mode == "B" OR $obj->mode == "C"){
            $sql .= " '".$obj->fromDate."', null, '".$obj->fromPlace."', '".$obj->toPlace."', '".$obj->distance."' ";
        }else{
            $sql .= " '".$obj->fromDate."', null, '', '', 0 ";
        }
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);

        $sqlQuery = "SELECT MAX(ce_srno) FROM conveyance_entry WHERE ce_random_number = '". $obj->uniqueKey."' ";
        $response = $dbio->getSelect($dbconn, $sqlQuery);
        if($response){
            while($row = mysqli_fetch_row($response)){
                $srno = $row[0];
            }
        }

        for($i = 0; $i < count($uploadDocs); $i++){

            $temppath = TEMPPATH.$uploadDocs[$i]->cdt_filename;
            // $newFileName = 'CONV_'.$srno.'_'.$dbio->getRandomString(8).'.'.$uploadDocs[$i]->cdt_doc_ext;
            $newFileName = 'CONV_'.$srno.'_'.$obj->uniqueKey.'.'.$uploadDocs[$i]->cdt_doc_ext;
            $uploadpath = UPLOADDOCSPATH.$newFileName;
            $destination = 'D:\\Zenith\\zenithdocs\\conveyanceDocs\\';
            copy($temppath, $destination.$newFileName);
            rename($temppath, $uploadpath);
            
            $sql1 .= "DELETE FROM conveyance_document_temp WHERE cdt_random_number = '".$uploadDocs[$i]->cdt_random_number."'; ";
            $sql1 .= "INSERT INTO conveyance_document (cd_line_no, cd_srno, cd_filename, cd_doc_ext, cd_user, cd_date, cd_random_number, cd_doc_desc) SELECT (SELECT COALESCE(MAX(cd_line_no), 0) + 1 FROM conveyance_document WHERE cd_srno = ".$srno."), ".$srno.", '".$newFileName."', '".$uploadDocs[$i]->cdt_doc_ext."', ".$_SESSION['userSrno'].", NOW(), '".$uploadDocs[$i]->cdt_random_number."', '".$uploadDocs[$i]->cdt_doc_desc."';";
        }
        $result = $dbio->batchQueries($dbconn, $sql1);
        $dbio->closeConn($dbconn);
        if($result){
            if($obj->srno == 0){
                $resarray = $this->getConveyanceList($dbio, $obj);
            }
        }
        return array("resarray" => $resarray, "msg"=>$msg);
    }

    public function deleteConveyanceData($dbio, $obj){
        $resarray = array();
        $msg = "";
        if($obj->status != "P"){
            $sql = "DELETE FROM conveyance_entry WHERE ce_srno = ".$obj->srno." ";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            $dbio->closeConn($dbconn);
        }else{
            $msg = "Can't delete entry whose status is pending.";
        }
        $resarray = $this->getConveyanceList($dbio, $obj);
        return array("resarray"=>$resarray, "msg"=>$msg);
    }

    public function getDocList($dbio, $randomNumber){
        $doc_array = array();
        $sql = "SELECT cdt_srno, cdt_filename, cdt_doc_ext, cdt_random_number, cdt_doc_desc, cdt_line_no, cdt_user FROM conveyance_document_temp WHERE cdt_random_number = '".$randomNumber."' ";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if($result){
            if($result){
                while($row = mysqli_fetch_assoc($result)){
                    $doc_array[] = $row;
                }
            }
            $dbio->closeConn($dbconn);
            return $doc_array;  
        }
    }

    public function getDocListDocument($dbio, $randomNumber){
        $doc_array = array();
        $sql = "SELECT cd_srno, cd_filename, cd_doc_ext, cd_random_number, cd_doc_desc, cd_line_no, cd_user FROM conveyance_document WHERE cd_random_number = '".$randomNumber."' ";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if($result){
            if($result){
                while($row = mysqli_fetch_assoc($result)){
                    $doc_array[] = $row;
                }
            }
            $dbio->closeConn($dbconn);
            return $doc_array;  
        }
    }

    public function editFormData($dbio, $obj){
        
        $doc_array = array();
        $this->doc_array = $this->getDocListDocument($dbio, $obj->randomNumber);

        // $sql = "SELECT DISTINCT ce_srno, ce_type, ce_mode, ce_from, ce_to, ce_distance, ce_amount, ce_remark, ce_from_date, ce_to_date, ce_document, ce_status, b1.ml_branch, ce_manual_no, ce_followup, b2.ml_branch, ce_branch_visit, mtc_name, DATE_FORMAT(fu_followed,'%d-%m-%Y'), tl_name, fu_remark
        // FROM conveyance_entry
        // LEFT OUTER JOIN master_location AS b1 ON b1.ml_backofficebranch = ce_branch
	    // LEFT OUTER JOIN master_location AS b2 ON b2.ml_backofficebranch = ce_branch_visit
        // LEFT OUTER JOIN master_tieupcust ON mtc_srno = ce_followup
        // LEFT OUTER JOIN tieup_followup ON fu_srno = ce_followup
        // LEFT OUTER JOIN tieup_lead ON tl_srno = ce_followup
        // WHERE ce_srno = ".$obj->srno."";
        $sql = "SELECT ce_srno, ce_type, ce_mode, ce_from, ce_to, ce_distance, ce_amount, ce_remark, ce_from_date, ce_to_date, ce_document, ce_status, b1.ml_branch, ce_manual_no, ce_followup, b2.ml_branch, ce_branch_visit, t.id, t.label, t.description, ce_usersrno, ce_empcode
        FROM conveyance_entry
        LEFT OUTER JOIN master_location AS b1 ON b1.ml_backofficebranch = ce_branch
	    LEFT OUTER JOIN master_location AS b2 ON b2.ml_backofficebranch = ce_branch_visit        
        LEFT OUTER JOIN
        ( SELECT fu_line_no, fu_srno, tl_name, CONCAT('^',fu_srno, '^', fu_line_no, '^', tl_name, '^', fu_followed) AS id, 
            CONCAT(mtc_name,' ',DATE_FORMAT(fu_followed,'%d-%m-%Y'),' ',tl_name,' ',fu_remark) AS label,
            CONCAT(mtc_name,' ',DATE_FORMAT(fu_followed,'%d-%m-%Y'),' ',tl_name,' ',fu_remark) AS description FROM tieup_followup
            LEFT OUTER JOIN tieup_lead ON tl_srno = fu_srno
            LEFT OUTER JOIN master_tieupcust ON mtc_srno = tl_customertype
            WHERE fu_line_no = ".$obj->folloupLine." AND fu_srno = ".$obj->followUpSrno.") AS t ON fu_line_no = ce_followup AND fu_srno = ce_followup_srno
        WHERE ce_srno = ".$obj->srno."";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if($result){
            while($row = mysqli_fetch_row($result)){
                $this->srno = $row[0];
                $this->type = $row[1];
                $this->mode = $row[2];
                $this->from = $row[3];
                $this->to = $row[4];
                $this->distance = $row[5];
                $this->amount = $row[6];
                $this->remark = $row[7];
                $this->fromDate = $row[8];
                $this->toDate = $row[9];
                $this->document = $row[10];
                $this->status = $row[11];
                $this->branch = $row[12];
                $this->manualNo = $row[13];
                $this->followup = $row[14];
                $this->branchVisit = $row[15];
                $this->branchVisitCd = $row[16];
                $this->followupId = $row[17];
                $this->followupLabel = $row[18];
                $this->followupDesc = $row[19];
                $this->userSrno = $row[20];
            }
        }
        $dbio->closeConn($dbconn);
    }

    public function updateConveyanceData($dbio, $obj){

        // if($obj->mode == "B" OR $obj->mode == "C"){
        //     $obj->amount = ($obj->distance * AMOUNT);
        // }

        $resarray = array();
        $result = "";
        $msg = "";
        $sql = "UPDATE conveyance_entry SET ce_type = '".$obj->type."', ce_mode = '".$obj->mode."', ce_amount = ".$obj->amount.", ce_remark = '".$obj->remark."', ce_status = '".$obj->status."', ce_updated_date = NOW(), ce_random_number = '".$obj->uniqueKey."', ";
        if($obj->type == "BV"){
            $sql .= "ce_branch_visit = ".$obj->branchVisit.", ";
        }else if($obj->type == "D"){
            $sql .= "ce_manual_no = '".$obj->manualNo."', ";
        }else if($obj->type == "LG"){
            $sql .= "ce_followup = ".$obj->followUp.", ce_followup_Srno = ".$obj->followUpSrno.", ";
        }
        if($obj->mode == "H"){
            $sql .= "ce_from_date = '".$obj->fromDate."', ce_to_date = '".$obj->toDate."' ";
        }else if($obj->mode == "B" OR $obj->mode == "C"){
            $sql .= "ce_from_date = '".$obj->fromDate."', ce_from = '".$obj->fromPlace."', ce_to = '".$obj->toPlace."', ce_distance = ".$obj->distance." ";
        }else{
            $sql .= "ce_from_date = '".$obj->fromDate."' ";
        }
        $sql .= "WHERE ce_srno = ".$obj->srno." ";
        $dbconn = $dbio->getConn();
        if($obj->userSrno == $_SESSION['userSrno']){
            $result = $dbio->getSelect($dbconn, $sql);
        }
        $dbio->closeConn($dbconn);
        if($result != ""){
            $resarray = $this->getConveyanceList($dbio, $obj);
        }else{
            $msg = "Can't Update another user's Entry.";
        }
        // return $resarray;
        return array("resarray"=>$resarray, "msg"=>$msg);
    }

    public function approvedConveyanceData($dbio, $obj){
        $resarray = array();
        $msg = "";

        $url = "http://localhost:1005/api/tran_conveyance_entry.php";
        $postData = array("obj"=>$obj);
        $this->callApiPost($url, $postData);

        $sql = "UPDATE conveyance_entry SET ce_approval_1 = 1, ce_approval_user = ".$_SESSION["userSrno"].", ce_approval_email = 1, ce_status = 'A' WHERE ce_srno = ".$obj->srno." ";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        $dbio->closeConn($dbconn);
        if($result){
            $resarray = $this->getConveyanceList($dbio, $obj);
            $msg = "The Entry has been Approved.";
        }
        // return $resarray;
        return array("msg"=> $msg, "resarray"=>$resarray);
    }

    public function deleteConveyanceDocs($dbio, $obj){
        $resarray = array();
        if($obj->srno == 0){
            $sql = "DELETE FROM conveyance_document_temp WHERE cdt_srno = ".$obj->srno." AND cdt_line_no = ".$obj->lineNo." AND cdt_random_number = '".$obj->randomNumber."' AND cdt_user = ".$obj->user." ";
        }else {
            $sql = "DELETE FROM conveyance_document WHERE cd_srno = ".$obj->srno." AND cd_line_no = ".$obj->lineNo." AND cd_random_number = '".$obj->randomNumber."' AND cd_user = ".$obj->user." ";
        }
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if($result){
            if($obj->srno == 0){
                $resarray = $this->getDocList($dbio, $obj->randomNumber);
            }else {
                $resarray = $this->getDocListDocument($dbio, $obj->randomNumber);
            }
        }
        $dbio->closeConn($dbconn);
        return $resarray;
    }

    public function rejectedConveyance($dbio, $obj){
        $resarray = array();
        $msg = "";

        $url = "http://localhost:1005/api/tran_conveyance_entry.php";
        $postData = array("obj"=>$obj);
        $this->callApiPost($url, $postData);

        $sql = "UPDATE conveyance_entry SET ce_comments = '".$obj->comments."', ce_status = 'R' WHERE ce_srno = ".$obj->srno." ";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if($result){
            $resarray = $this->getConveyanceList($dbio, $obj);
            $msg = "The Entry has been rejected.";
        }
        $dbio->closeConn($dbconn);
        // return $resarray;
        return array("msg"=> $msg, "resarray"=>$resarray);
    }

}

?>