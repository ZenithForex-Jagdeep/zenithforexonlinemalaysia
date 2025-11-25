<?php
session_start();
require_once ("dbio_c.php");
require_once ("career_c.php");
$option = $_POST["1"];
$dbio = new Dbio();
$career = new Career();
if ($option == "getCareerData") {
    $jobno = $_POST["2"];
    echo json_encode($career->getCareerDetails($dbio,$jobno));
} else if ($option == "getjobrole") {
    echo json_encode($career->getJobRole($dbio));
} else if ($option == "getAllCareerRole") {
    echo json_encode($career->getCareerRole($dbio, json_decode($_POST["2"])));
} else if ($option == "insertJobRole") {
    $obj = json_decode($_POST["2"]);
    if ($obj->operationType == "A") {
        $career->insertNewJobRole($dbio, $obj);
    } else {
        $career->updateJobRole($dbio, $obj);
    }
    echo json_encode($career);
} else if ($option == "getcareerreq") {
    echo json_encode($career->getCareerReq($dbio));
} else if ($option == "getjobdata") {
    echo json_encode($career->getCareerData($dbio, $_POST["2"]));
} else if ($option == "getJobRoleBySrno") {
    $career->getJobRoleBySrno($dbio, $_POST["2"]);
    echo json_encode($career);
} else if ($option == "insertDesc") {
    $career->insertDescription($dbio, json_decode($_POST["2"]));
    echo json_encode($career);
} else if ($option == "deletebySrno") {
    echo json_encode($career->deleteDesc($dbio, $_POST["2"]));
} else if ($option == "editbySrno") {
    $career->editDesc($dbio, $_POST["2"]);
    echo json_encode($career);
} else if ($option == "updatebySrno") {
    $career->updateDesc($dbio, $_POST["2"], $_POST["3"]);
    echo json_encode($career);
} else if ($option == "moveUpOrDown") {
    echo json_encode($career->moveUpOrDownDesc($dbio, json_decode($_POST["2"])));
} else if ($option == "addCareerLead") {
    $career->insertCareerLead($dbio, json_decode($_POST["2"]));
    echo json_encode($career);
} else if ($option == "showjobs") {
    //echo($_POST["2"]);
    echo json_encode($career->viewJobs($dbio, json_decode($_POST["2"])));
} else if ($option == "docview") {
    $career->viewDocument($dbio, json_decode($_POST["2"]));
} else if ($option == "docdownload") {
    $career->downloadDocument($dbio, json_decode($_POST["2"]));
} else if ($option == "updateremark") {
    echo json_encode($career->insertRemark($dbio, $_POST["2"], $_POST["3"]));
    //echo json_encode($career);
} else if ($option == "getlog") {
    echo json_encode($career->getRemarkLog($dbio, $_POST["2"]));
    //echo json_encode($career);
} else if ($option == "updateStatus") {
    echo json_encode($career->updateJobStatus($dbio, json_decode($_POST["2"])));
} else if ($option == "getdata") {
    echo json_encode($career->getData($dbio, $_POST["2"]));
} else if ($option == "getjob") {
    $career->getJobData($dbio, $_POST["2"], $_POST["3"], $_POST["4"]);
    echo json_encode($career);
} else if ($option == "addnew") {
    echo json_encode($career->addJobData($dbio, json_decode($_POST["2"])));
} else if ($option == "showjoblist") {
    echo json_encode($career->showJobList($dbio));
} else if ($option == "showstatuslist") {
    echo json_encode($career->showStatusList($dbio));
} else if ($option == "showhr") {
    echo json_encode($career->selectHr($dbio));
} else {
    echo '{"msg":"MSG0010"}';
}

?>