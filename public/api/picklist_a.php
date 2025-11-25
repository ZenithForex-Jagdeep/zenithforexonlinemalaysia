<?php
session_start();
require_once('dbio_c.php');
require_once('convera_c.php');
$obj = json_decode($_GET["1"]);
$obj->limit = 8;
$dbio = new Dbio();

if( isset($obj->sid) && $dbio->validateSession($obj->sid)){
    if($obj->type == 'followup'){
        $l = new FollowUp();
        echo json_encode($l->getDdJsonList($dbio, $obj));
    }elseif($obj->type=='locationallowed'){
        $l = new Location();
        echo json_encode($l->getDdJsonList($dbio,$obj));
    }
} else if($obj->type=='country'){
        $l = new Country();
        echo json_encode($l->getDdCountryJsonList($dbio,$obj));
}else if($obj->type=='allInstitute' && CONVERAACTIVATION===1){
    $conv = new Convera();
    echo json_encode($conv->getInstituteListByCountry($dbio,$obj));
}else {
    echo ('{"status":"MSG0002"}');
}    

?>

<?php

class FollowUp{
    public function getDdJsonListQuery($obj){
        return "
            SELECT CONCAT('^',fu_srno, '^', fu_line_no, '^', tl_name, '^', fu_followed) AS id, 
            CONCAT(mtc_name,' ',DATE_FORMAT(fu_followed,'%d-%m-%Y'),' ',tl_name,' ',fu_remark) AS label,
            CONCAT(mtc_name,' ',DATE_FORMAT(fu_followed,'%d-%m-%Y'),' ',tl_name,' ',fu_remark) AS description FROM tieup_followup
            LEFT OUTER JOIN tieup_lead ON tl_srno = fu_srno
            LEFT OUTER JOIN master_tieupcust ON mtc_srno = tl_customertype
            WHERE 1=1 AND (fu_empcode IN
                    (SELECT merl_empcode
                    FROM master_employee_reporting_link
                    WHERE merl_reportingto = ".$_SESSION["userEmpsrno"].")
                OR fu_empcode = ".$_SESSION["userEmpsrno"].")
            AND UPPER(tl_name) LIKE UPPER('%".$obj->srch."%') ORDER BY fu_followed DESC LIMIT ".$obj->limit."; ";
    }

    public function getDdJsonList($dbio, $obj){
        $sql = $this->getDdJsonListQuery($obj);
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        $responseStr = "";
        if($result){
            while($row = mysqli_fetch_row($result)){
                if($responseStr == ""){
                    $responseStr = $responseStr.'{"id":"'.$row[0].'", "label":"'.$row[1].'", "desc":"'.$row[2].'"}';
                }else{
                    $responseStr = $responseStr.',{"id":"'.$row[0].'", "label":"'.$row[1].'", "desc":"'.$row[2].'"}';
                }
            }
        }
        $dbio->closeConn($dbconn);
        $responseStr = "[".$responseStr."]";
        return $responseStr;
        //return '{"id":"1", "label":"Label"}';
    }

}

class Location{

    public function getDdJsonListQuery($obj){
        return " select CONCAT('^',ml_backofficebranch,'^',ml_branch,'^',ml_branchcd,'^', ml_active) AS id, 
        CONCAT(ml_backofficebranch,' ', ml_branch) FROM master_location AS label
        -- LEFT OUTER JOIN master_state on state_id = entity_state
        -- LEFT OUTER JOIN master_voucher_ledger_info ON entity_group = mvli_group and mvli_srno = entity_account
        WHERE 1=1 AND ml_branchcd  IN (".$_SESSION["entitybranchallowed"].")
        AND UPPER(CONCAT(ml_backofficebranch,' ', ml_branch)) LIKE UPPER('%".$obj->srch."%') 
        ORDER BY UPPER(CONCAT(ml_backofficebranch,' ', ml_branch))
        LIMIT ".$obj->limit.";";
    }

    public function getDdJsonList($dbio, $obj){
        $sql = $this->getDdJsonListQuery($obj);
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn,$sql);
        $responseStr = "";
        if($result){
            while($row = mysqli_fetch_row($result))
            {
                if($responseStr==""){
                    $responseStr = $responseStr.'{"id":"'.$row[0].'", "label":"'.$row[1].'"}';
                }else{
                    $responseStr = $responseStr.',{"id":"'.$row[0].'", "label":"'.$row[1].'"}';
                }   
            }
        }

        $dbio->closeConn($dbconn);
        $responseStr = "[".$responseStr."]";
        return $responseStr;        
    }
}

class Country
{
    public function getDdJsonListQuery($requestObj)
    {
        $query= "
            SELECT CONCAT('^', cnt_srno, '^', cnt_name, '^', cnt_nationality, '^' ,cnt_iso3digitcode,'^') AS value,
            CONCAT(' ', cnt_name, ' ') AS label FROM master_country 
            WHERE 1=1 ";

            if(trim($requestObj->srch)==""){
                $query= $query." and 1=2 ";        
            }

        $query= $query." AND cnt_active 
            AND UPPER(cnt_name) LIKE UPPER ('" . $requestObj->srch . "%')
            ORDER BY UPPER(cnt_name) ";
            // AND UPPER(CONCAT(cnt_srno,' ', cnt_name, ' ', cnt_nationality)) LIKE UPPER ('%" . $requestObj->srch . "%')
            if($requestObj->isAll==false){
                $query.= " LIMIT " . $requestObj->limit . "; ";
            }
            return $query;
    }
    public function getDdCountryJsonList($dbio, $requestObj)
    {
        $sql = $this->getDdJsonListQuery($requestObj);
        $dbconn = $dbio->getConn();
        $dbio->writeLog(json_encode($requestObj));
        $result = $dbio->getSelect($dbconn, $sql);
        $responseStr = "";
        if ($result) {
            while ($row = mysqli_fetch_row($result)) {
                if ($responseStr == "") {
                    $responseStr = $responseStr . '{"id":"' . $row[0] . '", "label":"' . $row[1] . '"}';
                } else {
                    $responseStr = $responseStr . ',{"id":"' . $row[0] . '", "label":"' . $row[1] . '"}';
                }
            }
        }
        $dbio->closeConn($dbconn);
        $responseStr = "[" . $responseStr . "]";
        return $responseStr;
    }
}
?>