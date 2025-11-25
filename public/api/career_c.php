<?php

class Career
{


    public function getCareerDetails($dbio, $jobno){
    $resArr=array();
        $dbconn = $dbio->getConn();
        $mcdKeyCodeArr=array();
        $result = $dbio->getSelect($dbconn, "SELECT cr_skillcode,cr_skillname FROM master_careerreq;");
        while($row = mysqli_fetch_assoc($result)){
        $mcdKeyCodeArr[]=$row;
        }
        // return $mcdKeyCodeArr;
        for ($i = 0; $i < count($mcdKeyCodeArr); $i++) {
            $careerlist = array();
            $sql = "SELECT mcd_jobsrno, mcd_desc FROM master_career_details WHERE mcd_jobsrno=" . $jobno . " AND mcd_keycode=" . $mcdKeyCodeArr[$i]["cr_skillcode"] . " ;";
            $result = $dbio->getSelect($dbconn, $sql);
            while ($row = mysqli_fetch_assoc($result)) {
                $careerlist[] = $row;
            }
            $resArr[$mcdKeyCodeArr[$i]["cr_skillname"]]=$careerlist;
        }
        $dbio->closeConn($dbconn);
        return $resArr;
    }

    public function getJobRole($dbio){
        $joblist = array();
        $sql = "SELECT mj_jobno, mj_jobname, mj_open_position, mj_open_date, mj_close_date, mj_active, mj_job_status,
            mj_job_location FROM master_jobrole WHERE mj_active = 1 AND mj_job_status=2";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if ($result) {
            while ($row = mysqli_fetch_assoc($result)) {
                $joblist[] = $row;
            }
        }
        $dbio->closeConn($dbconn);
        return $joblist;
    }


    public function getCareerRole($dbio, $obj){
        // $formatted_close_date = $date->format("d/m/Y");
        $joblist = array();
        $sql = "SELECT mj_jobno, mj_jobname, mj_open_position, DATE_FORMAT(mj_open_date, '%d-%m-%Y')
            AS formatted_open_date, DATE_FORMAT(mj_close_date, '%d-%m-%Y') 
            AS formatted_close_date, mj_active, mj_job_status, mj_job_location FROM master_jobrole WHERE 1=1";
        if ($obj->showtitle != "") {
            $sql = $sql . " AND mj_jobname LIKE '" . $obj->showtitle . "%' ";
        }
        if ($obj->showstatus != "") {
            $sql = $sql . " AND mj_job_status = " . $obj->showstatus . " ";
        }
        if ($obj->showlocation != "") {
            $sql = $sql . " AND mj_job_location LIKE '" . $obj->showlocation . "%' ";
        }

        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if ($result) {
            while ($row = mysqli_fetch_assoc($result)) {
                $joblist[] = $row;
            }
        }
        $dbio->closeConn($dbconn);
        return $joblist;
    }

    public function insertNewJobRole($dbio, $obj){
        $sql = "INSERT INTO master_jobrole (mj_jobno, mj_jobname, mj_open_position, mj_open_date, mj_close_date, mj_active,
             mj_job_status, mj_job_location, mj_timestamp)
            SELECT (SELECT COALESCE(MAX(mj_jobno), 0) FROM master_jobrole)+1, '" . $obj->title . "', " . $obj->noposition . ", 
            '" . $obj->opendate . "', '" . $obj->closedate . "', " . $obj->active . ", " . $obj->jobstatus . ", '" . $obj->joblocation . "', now()";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if ($result) {
            $sql = "SELECT MAX(mj_jobno) FROM master_jobrole";
            $res = $dbio->getSelect($dbconn, $sql);
            if ($res) {
                $row = mysqli_fetch_row($res);
                $this->jobSrno = $row[0];
                $this->msg = 1;
            }
            $this->jobrole = $this->getCareerRole($dbio, $obj);
        }
        $dbio->closeConn($dbconn);
    }


    public function updateJobRole($dbio, $obj){
        $sql = "UPDATE master_jobrole SET mj_jobname ='" . $obj->title . "', mj_open_position =" . $obj->noposition . ", 
            mj_open_date='" . $obj->opendate . "', mj_close_date='" . $obj->closedate . "', mj_active =" . $obj->active . ", 
            mj_job_status =" . $obj->jobstatus . ", mj_job_location='" . $obj->joblocation . "' WHERE mj_jobno=" . $obj->srno . "";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if ($result) {
            $this->jobrole = $this->getCareerRole($dbio, $obj);
            $this->jobSrno = $obj->srno;
            $this->msg = 1;
        }
        $dbio->closeConn($dbconn);
    }


    public function getCareerReq($dbio){
        $list = array();
        $sql = "SELECT cr_skillcode, cr_skillname FROM master_careerreq";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if ($result) {
            while ($row = mysqli_fetch_assoc($result)) {
                $list[] = $row;
            }
        }
        $dbio->closeConn($dbconn);
        return $list;
    }


    public function getCareerData($dbio, $jobSrno){
        $list = array();
        $sql = "SELECT mcd_srno, mcd_keycode, mcd_desc, mcd_display_srno FROM master_career_details 
            WHERE mcd_jobsrno = " . $jobSrno . " order by mcd_display_srno ";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if ($result) {
            while ($row = mysqli_fetch_assoc($result)) {
                $list[] = $row;
            }
        }
        $dbio->closeConn($dbconn);
        return $list;
    }


    public function getJobRoleBySrno($dbio, $jobsrno){
        $sql = "SELECT mj_jobno, mj_jobname, mj_open_position, mj_open_date, mj_close_date, mj_active, 
            mj_job_status, mj_job_location FROM master_jobrole WHERE mj_jobno = " . $jobsrno . "";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if ($result) {
            $row = mysqli_fetch_row($result);
            $this->srno = $row[0];
            $this->jobname = $row[1];
            $this->noposition = $row[2];
            $this->opendate = $row[3];
            $this->closedate = $row[4];
            $this->active = $row[5];
            $this->jobstatus = $row[6];
            $this->joblocation = $row[7];
        }
        $dbio->closeConn($dbconn);
    }


    public function insertDescription($dbio, $obj){
        $descarr = $obj->desc;
        for ($i = 0; $i < count($descarr); $i++) {
            $sql = "INSERT INTO master_career_details (mcd_srno, mcd_jobsrno, mcd_keycode, mcd_desc, mcd_display_srno)
                SELECT (SELECT COALESCE(MAX(mcd_srno), 0) FROM master_career_details) +1, 
                " . $obj->jobsrno . ", " . $obj->keycode . ", '" . $descarr[$i] . "', 
                ( SELECT COALESCE(MAX(mcd_display_srno),0)+1 FROM master_career_details 
                WHERE mcd_keycode = " . $obj->keycode . " AND mcd_jobsrno = " . $obj->jobsrno . "  ); ";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            if ($result) {
                $this->msg = 1;
            }
        }
        $dbio->closeConn($dbconn);
    }


    public function deleteDesc($dbio, $srno){
        $sql = "DELETE FROM master_career_details WHERE mcd_srno = " . $srno . "";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if ($result) {
            return ["msg" => "true"];
        }
        $dbio->closeConn($dbconn);
    }

    public function editDesc($dbio, $srno){
        $list = array();
        $mdesc = "";
        $sql = "SELECT mcd_desc FROM master_career_details WHERE mcd_srno = " . $srno . "";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if ($result) {
            $row = mysqli_fetch_row($result);
            $this->mdesc = $row[0];
        }
        // return (array("mcd_desc"=>$mdesc));
        $dbio->closeConn($dbconn);
    }

    public function updateDesc($dbio, $srno, $mdesc){
        $list = array();
        $sql = "UPDATE master_career_details SET mcd_desc ='" . $mdesc . "' WHERE mcd_srno =" . $srno . "";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if ($result) {
            $qry = "SELECT mcd_desc from master_career_details WHERE mcd_srno = " . $srno . "";
            $res1 = $dbio->getSelect($dbconn, $qry);
            if ($res1) {
                $row = mysqli_fetch_row($res1);
                $this->mdesc = $row[0];
            }
        }
        $dbio->closeConn($dbconn);
        // $dbio->insertDescription($dbio, $obj);
    }

    public function moveUpOrDownDesc($dbio, $obj){
        $srno = $obj->srno;
        $jobsrno = $obj->jobsrno;
        $currentDisplaySrno = $obj->displaySr;
        $keycode = $obj->keycode;
        $operation = $obj->operation;
        $newPosition = 0;
        $dbconn = $dbio->getConn();
        if ($operation === "UP") {
            $sql = "SELECT mcd_display_srno FROM master_career_details WHERE mcd_jobsrno=" . $jobsrno . " AND mcd_keycode=" . $keycode . " AND mcd_display_srno<" . $currentDisplaySrno . " ORDER BY mcd_display_srno DESC LIMIT 1;";
            $result = $dbio->getSelect($dbconn, $sql);
            if (mysqli_num_rows($result) > 0) {
                $row = mysqli_fetch_row($result);
                $newPosition = $row[0];
            } else {
                return "already on the top of the description.";
            }
        } else if ($operation === "DOWN") {
            $sql = "SELECT mcd_display_srno FROM master_career_details WHERE mcd_jobsrno=" . $jobsrno . " AND mcd_keycode=" . $keycode . " AND mcd_display_srno>" . $currentDisplaySrno . " ORDER BY mcd_display_srno ASC LIMIT 1;";
            $result = $dbio->getSelect($dbconn, $sql);
            if (mysqli_num_rows($result) > 0) {
                $row = mysqli_fetch_row($result);
                $newPosition = $row[0];
            } else {
                return "already in the Bottom of the description.";
            }
        }
        $sql = "SELECT mcd_srno FROM master_career_details WHERE mcd_display_srno = " . $newPosition . " AND mcd_jobsrno=" . $jobsrno . " AND mcd_keycode=" . $keycode . " ;";
        $result = $dbio->getSelect($dbconn, $sql);
        if ($result) {
            $row = mysqli_fetch_assoc($result);
            $aboveSrno = $row['mcd_srno'];
            $sql_update_above = "UPDATE master_career_details SET mcd_display_srno = " . $currentDisplaySrno . " WHERE mcd_srno = " . $aboveSrno . "; ";
            $result1 = $dbio->getSelect($dbconn, $sql_update_above);
            $sql_update_curr = "UPDATE master_career_details SET mcd_display_srno = " . $newPosition . " WHERE mcd_srno = " . $srno . "; ";
            $result2 = $dbio->getSelect($dbconn, $sql_update_curr);
            if ($result1 && $result2) {
                return (object) ["msg" => "true"];
            }
        }
        $dbio->closeConn();
        return (object) ["msg" => "false"];
    }


    public function insertCareerLead($dbio, $obj){
        date_default_timezone_set('Asia/Kolkata');
        $curtime = date('d-m-Y H:i:s');
        $sql = "UPDATE master_career_lead SET mcl_name ='" . $obj->cname . "', mcl_email ='" . $obj->cemail . "', 
            mcl_mobile='" . $obj->cmobile . "' WHERE mcl_srno = " . $obj->srno . "";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        $email = "himanshu.tomar@zenithforex.com";
        if ($result) {
            $qry = "SELECT mcl_srno, mcl_resume, mj_jobname FROM master_career_lead
                        LEFT OUTER JOIN master_jobrole ON mcl_jobno = mj_jobno
                        WHERE mcl_srno = " . $obj->srno . "";
            $res = $dbio->getSelect($dbconn, $qry);
            $row = mysqli_fetch_row($res);
            $ml = "<html>";
            $ml = $ml . "<body>";
            $ml = $ml . "Job Application from ZenithForexOnline.Com/career <br>
                    Name: " . $obj->cname . " <br> 
                    Email: " . $obj->cemail . " <br> 
                    Phone: " . $obj->cmobile . " <br> 
                    Profile: " . $row[2] . " <br>
                    Resume: <a href='https://www.zenithforexonline.com/upload/" . $row[1] . "' download>Download</a> <br>
                    <b>Thanks & Regards <br> Administrator </b>";
            $ml = $ml . "</body>";
            $ml = $ml . "</html>";
            require_once ('mail_c.php');
            $m = new Mymail();
            $msent = $m->sendMail('Job Application ' . $curtime . '', $ml, $email, '', '', '');
            $msent = true;
            if ($msent) {
                $this->data = array("msg" => "1");
            } else {
                $this->data = array("msg" => "Please contact to administrator.");
            }
        } else {
            $this->data = array("msg" => "0");
        }
        $dbio->closeConn($dbconn);
    }


    public function viewJobs($dbio, $obj){
        $jobs = array();
        $sql = "SELECT mcl_srno, mcl_name, mcl_jobno, mcl_email, mcl_mobile, mcl_resume,mcl_status,mcl_type, mcs_status FROM master_career_lead LEFT OUTER JOIN master_career_status ON mcl_status= mcs_srno
            WHERE 1=1 ";
        if($obj->filtermod == "N"){
            if ($obj->name != "") $sql .= " AND mcl_name LIKE '%".$obj->name."%' ";
        }elseif($obj->filtermod == "M"){
            if ($obj->mobile != "") $sql .= " AND mcl_mobile LIKE '%".$obj->mobile."%' ";
        }elseif($obj->filtermod == "E"){
            if ($obj->email != "") $sql .= " AND mcl_email LIKE '%".$obj->email."%' ";
        }elseif($obj->filtermod == "S"){
            if ($obj->filterstatus != "") $sql .= " AND mcl_status = '".$obj->filterstatus."' ";
        }
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if ($result) {
            while ($row = mysqli_fetch_assoc($result)) {
                $jobs[] = $row;
            }
        }
        $dbio->closeConn($dbconn);
        return $jobs;
    }


    private function getVerifyDocumentQuery($obj){
        return "SELECT  mcl_resume, mcl_srno,mcl_ext FROM master_career_lead WHERE 
            mcl_resume = '" . $obj->name . "' 
            AND mcl_srno = " . $obj->srno . "";
    }


    public function viewDocument($dbio, $request){
        $doc_desc = "";
        $doc_ext = "";
        $doc_filename = "";
        $typ = "";
        $bs64 = "";
        $sql = $this->getVerifyDocumentQuery($request);
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if ($result) {
            $row = mysqli_fetch_row($result);
            $doc_filename = $row[0];
            $doc_ext = $row[2];
        }
        $dbio->closeConn($dbconn);
        if ($doc_ext == "jpg") {
            $typ = "image/jpg";
            $bs64 = "data:image/jpg;base64," . base64_encode(file_get_contents(UPLOADPATHTOBUILD . $doc_filename));
        } elseif ($doc_ext == "png") {
            $typ = "image/png";
            $bs64 = "data:image/png;base64," . base64_encode(file_get_contents(UPLOADPATHTOBUILD . $doc_filename));
        } elseif ($doc_ext == "gif") {
            $typ = "image/gif";
            $bs64 = "data:image/gif;base64," . base64_encode(file_get_contents(UPLOADPATHTOBUILD . $doc_filename));
        } elseif ($doc_ext == "bmp") {
            $typ = "image/bmp";
            $bs64 = "data:image/bmp;base64," . base64_encode(file_get_contents(UPLOADPATHTOBUILD . $doc_filename));
        } elseif ($doc_ext == "pdf") {
            $typ = "application/pdf";
            $bs64 = "data:application/pdf;base64," . base64_encode(file_get_contents(UPLOADPATHTOBUILD . $doc_filename));
        } elseif ($doc_ext == "txt") {
            $typ = "text/plain"; // Corrected MIME type for plain text files
            $bs64 = "data:text/plain;base64," . base64_encode(file_get_contents(UPLOADPATHTOBUILD . $doc_filename));
        } else if ($doc_ext == "jpeg") {
            $typ = "image/jpeg";
            $bs64 = "data:image/jpeg;base64," . base64_encode(file_get_contents(UPLOADPATHTOBUILD . $doc_filename));
        } else if ($doc_ext == "jfif") {
            $typ = "application/jfif";
            $bs64 = "data:application/jfif;base64," . base64_encode(file_get_contents(UPLOADPATHTOBUILD . $doc_filename));
        } else {
            $typ = "image/png";
            $bs64 = "data:image/png;base64," . base64_encode(file_get_contents(UPLOADPATHTOBUILD . "fnf.png"));
        }
        echo json_encode(array("typ" => $typ, "bs64" => $bs64, "desc" => $doc_desc, "ext" => $doc_ext, "fname" => $doc_filename));
    }


    public function downloadDocument($dbio, $request){
        $doc_desc = "";
        $doc_ext = "";
        $doc_filename = "";
        $sql = $this->getVerifyDocumentQuery($request);
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if ($result) {
            $row = mysqli_fetch_row($result);
            $doc_ext = $row[2];
            $doc_filename = $row[0];
        }
        $dbio->closeConn($dbconn);
        if (file_exists(UPLOADPATHTOBUILD . $doc_filename)) {
            header('Content-Description: File Transfer');
            header('Content-Type: application/octet-stream');
            header('Content-Disposition: attachment; filename=' . basename($doc_filename));
            header('Content-Transfer-Encoding: binary');
            header('Expires: 0');
            header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
            header('Pragma: public');
            header('Content-Length: ' . filesize(UPLOADPATHTOBUILD . $doc_filename));
            ob_clean();
            flush();
            readfile(UPLOADPATHTOBUILD . $doc_filename);
            exit;
        }
    }


    public function insertRemark($dbio, $remark, $srno){
        $sql = "INSERT INTO master_order_remark (rem_userSrno, rem_timestamp, rem_desc,rem_activity_code,rem_orderno)
                    VALUES (" . $_SESSION["userSrno"] . ",  now(),'" . $remark . "','CAREERAPPLICATION'," . $srno . ")";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if ($result) {
            return $this->getRemarkLog($dbio, $srno);
        }
        $dbio->closeConn($dbconn);
    }

    public function getRemarkLog($dbio, $srno){
        $details = array();
        $remark[] = array();
        $query = "SELECT lg_usersrno, lg_logtime, lg_desc, user_name FROM master_order_log
                      LEFT OUTER JOIN user_login ON lg_usersrno = user_srno
                      WHERE lg_usersrno =" . $_SESSION["userSrno"] . " and lg_activity_code = 'CAREERAPPLICATION' and lg_orderno = " . $srno . "  ORDER BY lg_logtime DESC";
        $dbconn = $dbio->getConn();
        $res = $dbio->getSelect($dbconn, $query);
        if ($res) {
            while ($row = mysqli_fetch_assoc($res)) {
                $details[] = $row;
            }
        }
        $sql = "SELECT rem_userSrno, user_name,  DATE_FORMAT(rem_timestamp, '%d-%m-%Y %h:%i %p') AS formatted_comment_date, rem_timestamp, rem_desc FROM master_order_remark 
            LEFT OUTER JOIN user_login ON rem_userSrno = user_srno
            WHERE  rem_activity_code = 'CAREERAPPLICATION' and rem_orderno = " . $srno . " ORDER BY rem_timestamp DESC";
        $result = $dbio->getSelect($dbconn, $sql);
        if ($result) {
            while ($row = mysqli_fetch_assoc($result)) {
                $remark[] = $row;
            }
        }
        $dbio->closeConn($dbconn);
        return array("details" => $details, "remark" => $remark);
    }


    private function getHrsrnoQry($dbio){
        $hrsrno = 0;
        $qry = "select user_hrsrno from user_login where user_srno = " . $_SESSION["userSrno"] . " ";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $qry);
        if (mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_row($result);
            if ($row[0] != null) {
                $hrsrno = $row[0];
            }
        }
        $dbio->closeConn($dbconn);
        return $hrsrno;
    }


    public function updateJobStatus($dbio, $obj){
        $data = array();
        $hrsno = $this->getHrsrnoQry($dbio);
        $sql = "UPDATE master_career_lead SET mcl_status = ".$obj->status." ";
        if ($obj->status == 3 or $obj->status == 7)
            $sql = $sql." , mcl_interviewschdldate = '".$obj->interviewDate."' , mcl_interviewschdlusersrno = ".$hrsno."";
        else if ($obj->status == 1)
            $sql = $sql." , mcl_shortlistusersrno = ".$hrsno." ";
        else if($obj->status == 4)
            $sql = $sql." , mcl_feedback = '".$obj->feedback."' ";
        
        $sql .= " WHERE mcl_srno = ".$obj->srno."";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);

        $qry = "INSERT INTO master_order_log (lg_usersrno, lg_logtime, lg_orderno, lg_desc, lg_activity_code)
                    VALUES (" . $_SESSION["userSrno"] . ", now(), " . $obj->srno . ", ";
        $qry .= "CONCAT('Status Updated : ', (SELECT mcs_status FROM master_career_status WHERE mcs_srno = ".$obj->status.")), 'CAREERAPPLICATION')";
        $result = $dbio->getSelect($dbconn, $qry);

        $data = $this->getActivityLog($dbio, $dbconn, $obj);
        $dbio->closeConn($dbconn);
        $hdrdata = $this->viewJobs($dbio, $obj);
        return array("logdata" => $data, "msg" => "1", 'hdrdata'=>$hdrdata);
    }

    public function getActivityLog($dbio, $dbconn, $obj){
        $sql1 = "SELECT lg_usersrno,user_name, DATE_FORMAT(lg_logtime, '%d-%m-%Y %h:%i %p') AS formatted_activity_date , lg_logtime, lg_desc FROM master_order_log 
        LEFT OUTER JOIN user_login ON lg_usersrno = user_srno
        WHERE lg_activity_code = 'CAREERAPPLICATION' and 
        lg_orderno = ".$obj->srno."  ORDER BY lg_logtime DESC";
        $data = array();
        $res = $dbio->getSelect($dbconn, $sql1);
        if (mysqli_num_rows($res) > 0) {
            while ($row = mysqli_fetch_assoc($res)) {
                $data[] = $row;
            }
        }
        return $data;
    }

    public function getData($dbio, $srno){
        $data = array();
        $sql1 = "SELECT lg_usersrno,user_name,DATE_FORMAT(lg_logtime, '%d-%m-%Y %h:%i %p') AS formatted_activity_date , lg_logtime, lg_desc FROM master_order_log 
            LEFT OUTER JOIN user_login ON lg_usersrno = user_srno
            WHERE  lg_activity_code = 'CAREERAPPLICATION' and 
            lg_orderno = " . $srno . "  ORDER BY lg_logtime DESC ";
        $dbconn = $dbio->getConn();

        $res = $dbio->getSelect($dbconn, $sql1);
        if (mysqli_num_rows($res) > 0) {
            while ($row = mysqli_fetch_assoc($res)) {
                $data[] = $row;
            }
        }
        $dbio->closeConn($dbconn);
        return $data;
    }


    public function getJobData($dbio, $srno, $status, $type){
        $data = array();
        //if($type == "manual"){             
        $sql = "SELECT
                mcl_name,mcl_email,mcl_mobile,mcl_status,mcl_feedback,mcl_interviewschdlusersrno,mcl_shortlistusersrno,
                shortlist_user.hr_name AS shortlist,
                interview_user.hr_name AS interview,
                DATE_FORMAT(mcl_interviewschdldate, '%d-%m-%Y') AS formatted_interview_date,
                mcs_status, mcl_interview_place, 
                DATE_FORMAT(mcl_reject_date, '%d-%m-%Y') AS mcl_reject_date,
                DATE_FORMAT(mcl_shortlisttimestamp, '%d-%m-%Y') AS mcl_shortlisttimestamp
                FROM master_career_lead
                LEFT OUTER JOIN master_hr AS shortlist_user ON mcl_shortlistusersrno = shortlist_user.hr_srno
                LEFT OUTER JOIN master_career_status ON mcl_status = mcs_srno
                LEFT OUTER JOIN master_hr AS interview_user ON mcl_interviewschdlusersrno = interview_user.hr_srno
                WHERE mcl_srno = " . $srno . " AND mcl_status = " . $status . "";
        $dbconn = $dbio->getConn();
        $res = $dbio->getSelect($dbconn, $sql);
        if (mysqli_num_rows($res) > 0) {
            $row = mysqli_fetch_row($res);
            $this->name = $row[0];
            $this->email = $row[1];
            $this->mobile = $row[2];
            $this->status = $row[3];
            $this->feed = $row[4];
            $this->interviewschdlusersrno = $row[5];
            $this->shortlistusersrno = $row[6];
            $this->shortlistby = $row[7];
            $this->interviewschdlby = $row[8];
            $this->interviewdate = $row[9];
            $this->mcsstatus = $row[10];
            $this->interviewplace = $row[11];
            $this->rejectdate = $row[12];
            $this->shortlistdate = $row[13];
        }
        $dbio->closeConn($dbconn);
    }


    public function addJobData($dbio, $obj){

        $obj->name = strtoupper($obj->name);
        $sql = "UPDATE master_career_lead SET mcl_name = '" . $obj->name . "', mcl_email = '" . $obj->email . "', mcl_mobile = " . $obj->mobile . ", mcl_status = " . $obj->status . " , mcl_type = 'manual' ";
        if ($obj->status == "1") {
            $sql = $sql . " ,mcl_shortlistusersrno = " . $obj->shortlistby . " ";
        } else if ($obj->status == "3") {
            $sql = $sql . " ,mcl_shortlistusersrno = " . $obj->shortlistby . " , mcl_interviewschdlusersrno= " . $obj->interviewschdlby . ", 
                    mcl_interviewschdldate = '" . $obj->interviewDate . "' ";
        } else if ($obj->status == "4" || $obj->status == "6") {
            $sql = $sql . " , mcl_feedback = '" . $obj->feedback . "'";
        }
        $sql = $sql . "  WHERE mcl_srno = " . $obj->srno . " ";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if ($result) {
            $this->msg = "1";
        } else {
            $this->msg = "2";
        }
        $dbio->closeConn($dbconn);


    }

    public function showJobList($dbio){
        $joblist = array();
        $qry = "SELECT '0' as value, 'Select' as label UNION ALL
            SELECT mj_jobno as value, mj_jobname as label FROM master_jobrole";
        $dbconn = $dbio->getConn();
        $result3 = $dbio->getSelect($dbconn, $qry);
        if ($result3) {
            while ($row = mysqli_fetch_assoc($result3)) {
                $joblist[] = $row;
            }
        }
        $dbio->closeConn($dbconn);
        return $joblist;
    }

    public function showStatusList($dbio){
        $statuslist = array();
        $qry = "SELECT '0' as value, 'Select' as label UNION ALL
            SELECT mcs_srno as value, mcs_status as label FROM master_career_status";
        $dbconn = $dbio->getConn();
        $result3 = $dbio->getSelect($dbconn, $qry);
        if ($result3) {
            while ($row = mysqli_fetch_assoc($result3)) {
                $statuslist[] = $row;
            }
        }
        $dbio->closeConn($dbconn);
        return $statuslist;
    }

    public function selectHr($dbio)
    {
        $hrlist = array();
        $qry = "SELECT '0' as value, 'Select' as label UNION ALL
            SELECT hr_srno as value, hr_name as label FROM master_hr";
        $dbconn = $dbio->getConn();
        $result3 = $dbio->getSelect($dbconn, $qry);
        if ($result3) {
            while ($row = mysqli_fetch_assoc($result3)) {
                $hrlist[] = $row;
            }
        }
        $dbio->closeConn($dbconn);
        return $hrlist;
    }


}



?>