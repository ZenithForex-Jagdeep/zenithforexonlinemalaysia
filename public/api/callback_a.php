<?php
require_once ("dbio_c.php");
$dbio = new Dbio();
$request = new CallBack();
$obj = json_decode($_POST["2"]);
$option = $_POST["1"];
if ($option == "callback") {
    echo json_encode($request->requestCallBack($dbio, $obj));
} else if ($option == "sendservicemail") {
    echo json_encode($request->serviceRequest($dbio, $obj));
} else if ($option == "saveenquiryrequest") {
    echo json_encode($request->saveEnquiryRequest($dbio, $obj));
} else if ($option == "sendenquiryemail") {
    echo json_encode($request->sendEnquiryEmail($dbio, $obj));
} else {
    return;
}
?>

<?php

class CallBack
{

    private function insertCallbackData($dbio, $obj)
    {
        $sql = "INSERT INTO tran_callback_requests (req_srno,req_name,req_phone,req_email,req_msg ,req_timestamp, req_service) 
            SELECT (SELECT COALESCE( MAX(req_srno),0)+1 FROM tran_callback_requests) AS req_srno, '" . $obj->name . "','" . $obj->phone . "','" . $obj->email . "',
            '" . $obj->message . "', NOW(), '" . $obj->pg . "'";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        $dbio->closeConn($dbconn);
    }

    public function requestCallBack($dbio, $obj)
    {
        date_default_timezone_set('Asia/Kolkata');
        $curtime = date('d-m-Y H:i:s');
        $err = "";
        $msg = "";
        $obj->pg = '';
        $this->insertCallbackData($dbio, $obj);
        $ml = "<html>";
        $ml = $ml . "<body>";
        $ml = $ml . "Query From zenithforexonline.com :<br>
                    <b>Name:</b> " . $obj->name . " <br>
                    <b>Mobile Number:</b> " . $obj->phone . " <br>
                    <b>Email ID:</b> " . $obj->email . " <br>
                    <b>Message:</b> " . $obj->message . " <br>
                    <br>
                    <b>Thanks</b>";
        $ml = $ml . "</body>";
        $ml = $ml . "</html>";
        require_once ('mail_c.php');
        $m = new Mymail();
        $msent = $m->sendMail('Zenith Forex Online Query: ' . $curtime . '', $ml, GROUPEMAILID, '', '', '');
        $msent = true;
        if ($msent) {
            $err = "";
            $msg = "Query submitted successfully. We will Contact You Shortly";
        } else {
            $err = "Please contact to administrator.";
            $msg = "Please contact to administrator.";
        }
        return array("msg" => $msg, "err" => $err);
    }


    public function serviceRequest($dbio, $obj)
    {
        $curtime = date('d-m-Y H:i:s');
        $err = "";
        $msg = "";
        $this->insertCallbackData($dbio, $obj);
        $ml = "<html>";
        $ml = $ml . "<body>";
        if ($obj->service == "") {
            $ml = $ml . "GIC Query From zenithforexonline/services :<br>";
        } else {
            $ml = $ml . "Query From zenithforexonline/services :<br>";
        }
        $ml = $ml . "<b>Name:</b> " . $obj->name . " <br>
                    <b>Mobile Number:</b> " . $obj->phone . " <br>
                    <b>Email ID:</b> " . $obj->email . " <br>
                    <b>Service:</b> " . $obj->service . " <br>
                    <b>Message:</b> " . $obj->message . " <br>
                    <br>
                    <b>Thanks</b>";
        $ml = $ml . "</body>";
        $ml = $ml . "</html>";
        require_once ('mail_c.php');
        $m = new Mymail();
        $msent = $m->sendMail('Zenith Forex Online Query: ' . $curtime . '', $ml, GROUPEMAILID, '', '', '');
        $msent = true;
        if ($msent) {
            $err = "";
            $msg = "Request submitted successfully. We will Contact You Shortly";
        } else {
            $err = "Please contact to administrator.";
            $msg = "Please contact to administrator.";
        }
        return array("msg" => $msg, "err" => $err);
    }

    public function saveEnquiryRequest($dbio, $obj)
    {
        $err = "";
        $msg = "";
        $sql = "INSERT INTO tran_callback_requests (req_srno,req_name,req_phone,req_email,req_msg ,req_timestamp, req_service,req_mail_send) 
            SELECT (SELECT COALESCE( MAX(req_srno),0)+1 FROM tran_callback_requests) AS req_srno, '" . $obj->name . "','" . $obj->phone . "','" . $obj->email . "',
            '" . $obj->message . "', NOW(), '" . $obj->pg . "', 0 ;";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if ($result) {
            $err = "";
            $msg = "Request submitted successfully. We will Contact You Shortly";
        } else {
            $err = "Please contact to administrator.";
            $msg = "Please contact to administrator.";
        }

        $dbio->closeConn($dbconn);
        return array("msg" => $msg, "err" => $err);
    }

    public function sendEnquiryEmail($dbio, $obj)
    {
        //check mail send or not

        $curtime = date('d-m-Y H:i:s');
        $err = "";
        $msg = "";
        $ml = "<html>";
        $ml = $ml . "<body>";
        if ($obj->service == "") {
            $ml = $ml . "GIC Query From zenithforexonline/services :<br>";
        } else {
            $ml = $ml . "Query From zenithforexonline/services :<br>";
        }
        $ml = $ml . "<b>Name:</b> " . $obj->name . " <br>
                    <b>Mobile Number:</b> " . $obj->phone . " <br>
                    <b>Email ID:</b> " . $obj->email . " <br>
                    <b>Service:</b> " . $obj->service . " <br>
                    <br>
                    <b>Thanks</b>";
        $ml = $ml . "</body>";
        $ml = $ml . "</html>";
        require_once ('mail_c.php');
        $m = new Mymail();
        $msent = $m->sendMail('Zenith Forex Online Query: ' . $curtime . '', $ml, GROUPEMAILID, '', '', '');
        if ($msent) {
            $sql = " SELECT req_srno from tran_callback_requests WHERE  req_name='" . $obj->name . "' AND req_email='" . $obj->email . "'
            AND req_phone='" . $obj->phone . "' AND req_service='" . $obj->pg . "' order by req_srno desc limit 1; ";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            $data = mysqli_fetch_row($result);
            $sql = " UPDATE  tran_callback_requests SET req_mail_send=1 WHERE  req_srno = " . $data[0] . "; ";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            $err = "";
            $msg = "mail send Succesfully";
        } else {
            $err = "Please contact to administrator.";
            $msg = "Please contact to administrator.";
        }
        $dbio->closeConn($dbconn);
        return array("msg" => $msg, "err" => $err);
    }


}

?>