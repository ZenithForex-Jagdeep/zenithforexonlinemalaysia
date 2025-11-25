<?php 
session_start();

require_once('dbio_c.php');
require 'vendoroffice/autoload.php';
require_once('report_c.php');

$dbio = new Dbio();
$sessionId = $_POST["1"];
$option = $_POST["2"];

if($dbio->validateSession($sessionId)){
    require_once('right_c.php');
    $right = new Right();
    $rightDash = new Right();
    $right->getUserNavRight($dbio,'REPMISBUDGET');
    $rightDash->getUserNavRight($dbio,'DASHBOARD');

    if($option=='getreport' and $right->query==1){
        //echo json_encode($entity->getJsonList($dbio,$_POST["3"]));
        $reqObject = json_decode($_POST["3"]);
        $filename = $dbio->getRandomString(8).".xls";
        $reqObject->filename = $filename;

        $rep = new MisBudget();
        $rep->genReport($dbio,$reqObject);
    }else if($option=='genAllReport' and $right->query==1){
        $reqObject = json_decode($_POST["3"]);
        $rep = new MisBudget();
        $rep->genAllReport($dbio,$reqObject);
    }
    else if($option == "getpercentreport" and ($right->query == 1 or $rightDash->query ==1)){
        $reqObject = json_decode($_POST["3"]);
        $filename = $dbio->getRandomString(8)."xls";
        $reqObject->filename = $filename;

        $rep = new MisBudget();
        $rep->genReportPercentage($dbio,$reqObject);
    }else if($option == "getdashfigures" and ($right->query == 1 or $rightDash->query ==1)){
        $reqObject = json_decode($_POST["3"]);
        $rep = new MisBudget();
        $rep->getDashFigures($dbio,$reqObject);
        echo json_encode($rep);
    }else if($option == "getbudgetreport" and $right->query == 1){
        $reqObject = json_decode($_POST["3"]);
        $filename = $dbio->getRandomString(8).".xls";
        $reqObject->filename = $filename;

        $rep = new MisBudget();
        $rep->genBudgetDownloadReport($dbio, $reqObject);
    }
}else{
    echo('{"msg": "MSG0010"}');
}
?>

<?php

    class MisBudget{


        private function getReportQuery($reqObject, $operation){
            // srchType,srchOneAll,srchBran,srchSalesExecutive
            $qry = " SELECT ";
            if($reqObject->srchType=="B" ){
                $qry = $qry." misb_brancode,  ml_branch ";
            }
            if($reqObject->srchType=="E" ){
                $qry = $qry." misb_empcode,  emp_name ";
            }
            if($operation == "N"){
                $qry = $qry." ,misb_apr,mist_totalsalesapr,mist_totalmarginapr
                ,misb_may,mist_totalsalesmay,mist_totalmarginmay
                ,misb_jun,mist_totalsalesjun,mist_totalmarginjun
                ,misb_jul,mist_totalsalesjul,mist_totalmarginjul
                ,misb_aug,mist_totalsalesaug,mist_totalmarginaug
                ,misb_sep,mist_totalsalessep,mist_totalmarginsep
                ,misb_oct,mist_totalsalesoct,mist_totalmarginoct
                ,misb_nov,mist_totalsalesnov,mist_totalmarginnov
                ,misb_dec,mist_totalsalesdec,mist_totalmargindec
                ,misb_jan,mist_totalsalesjan,mist_totalmarginjan
                ,misb_feb,mist_totalsalesfeb,mist_totalmarginfeb
                ,misb_mar,mist_totalsalesmar,mist_totalmarginmar
                 ";
            } elseif($operation == 'NP'){
                if($reqObject->srchType=="E" ){
                    $qry = $qry." ,'E' as type, 0 as misb_brancode, '' as ml_branch ";
                } else {
                    $qry = $qry." ,'B' as type, 0 as misb_empcode, '' as emp_name ";
                }
                $qry = $qry." ,misb_apr , mist_totalmarginapr ,COALESCE(ROUND((100*mist_totalmarginapr)/misb_apr),0) AS april
                ,misb_may , mist_totalmarginmay,COALESCE(ROUND((100*mist_totalmarginmay)/misb_may),0) AS may
                ,misb_jun, mist_totalmarginjun ,COALESCE(ROUND((100*mist_totalmarginjun)/misb_jun),0) AS june
                ,misb_jul, mist_totalmarginjul ,COALESCE(ROUND((100*mist_totalmarginjul)/misb_jul),0) AS july
                ,misb_aug, mist_totalmarginaug ,COALESCE(ROUND((100*mist_totalmarginaug)/misb_aug),0) AS august
                ,misb_sep, mist_totalmarginsep ,COALESCE(ROUND((100*mist_totalmarginsep)/misb_sep),0) AS september
                ,misb_oct, mist_totalmarginoct ,COALESCE(ROUND((100*mist_totalmarginoct)/misb_oct),0) AS october
                ,misb_nov, mist_totalmarginnov ,COALESCE(ROUND((100*mist_totalmarginnov)/misb_nov),0) AS november
                ,misb_dec, mist_totalmargindec ,COALESCE(ROUND((100*mist_totalmargindec)/misb_dec),0) AS december
                ,misb_jan, mist_totalmarginjan ,COALESCE(ROUND((100*mist_totalmarginjan)/misb_jan),0) AS january
                ,misb_feb, mist_totalmarginfeb ,COALESCE(ROUND((100*mist_totalmarginfeb)/misb_feb),0) AS february
                ,misb_mar, mist_totalmarginmar ,COALESCE(ROUND((100*mist_totalmarginmar)/misb_mar),0) AS march ";
            }else {
                if($reqObject->srchType=="E" ){
                    $qry = $qry." ,'E' as type, 0 as misb_brancode, '' as ml_branch ";
                } else {
                    $qry = $qry." ,'B' as type, 0 as misb_empcode, '' as emp_name ";
                }
                $qry = $qry." ,COALESCE(ROUND((100*mist_totalmarginapr)/misb_apr),0) AS april
                ,COALESCE(ROUND((100*mist_totalmarginmay)/misb_may),0) AS may
                ,COALESCE(ROUND((100*mist_totalmarginjun)/misb_jun),0) AS june
                ,COALESCE(ROUND((100*mist_totalmarginjul)/misb_jul),0) AS july
                ,COALESCE(ROUND((100*mist_totalmarginaug)/misb_aug),0) AS august
                ,COALESCE(ROUND((100*mist_totalmarginsep)/misb_sep),0) AS september
                ,COALESCE(ROUND((100*mist_totalmarginoct)/misb_oct),0) AS october
                ,COALESCE(ROUND((100*mist_totalmarginnov)/misb_nov),0) AS november
                ,COALESCE(ROUND((100*mist_totalmargindec)/misb_dec),0) AS december
                ,COALESCE(ROUND((100*mist_totalmarginjan)/misb_jan),0) AS january
                ,COALESCE(ROUND((100*mist_totalmarginfeb)/misb_feb),0) AS february
                ,COALESCE(ROUND((100*mist_totalmarginmar)/misb_mar),0) AS march ";
            }
            $qry = $qry."FROM mis_budget AS budgeted";
            if($reqObject->srchType=="B" ){
                // $qry = $qry." LEFT OUTER JOIN master_entity ON entity_type = 'B' AND  entity_id = misb_brancode ";    
                $qry = $qry." LEFT OUTER JOIN master_location ON ml_backofficebranch = misb_brancode ";
            }
            if($reqObject->srchType=="E" ){
                $qry = $qry." LEFT OUTER JOIN master_employee ON emp_srno= misb_empcode ";    
            }
            $qry = $qry." LEFT OUTER JOIN (SELECT  ";
            if($reqObject->srchType=="B" ){
                $qry = $qry." mist_brancode ";
            }
            if($reqObject->srchType=="E" ){
                $qry = $qry." mist_empcode ";
            }
            $qry = $qry." , SUM(mist_totalsalesapr) AS mist_totalsalesapr,SUM(mist_totalmarginapr) AS mist_totalmarginapr
            , SUM(mist_totalsalesmay) AS mist_totalsalesmay,SUM(mist_totalmarginmay) AS mist_totalmarginmay
            , SUM(mist_totalsalesjun) AS mist_totalsalesjun,SUM(mist_totalmarginjun) AS mist_totalmarginjun
            , SUM(mist_totalsalesjul) AS mist_totalsalesjul,SUM(mist_totalmarginjul) AS mist_totalmarginjul
            , SUM(mist_totalsalesaug) AS mist_totalsalesaug,SUM(mist_totalmarginaug) AS mist_totalmarginaug
            , SUM(mist_totalsalessep) AS mist_totalsalessep,SUM(mist_totalmarginsep) AS mist_totalmarginsep
            , SUM(mist_totalsalesoct) AS mist_totalsalesoct,SUM(mist_totalmarginoct) AS mist_totalmarginoct
            , SUM(mist_totalsalesnov) AS mist_totalsalesnov,SUM(mist_totalmarginnov) AS mist_totalmarginnov
            , SUM(mist_totalsalesdec) AS mist_totalsalesdec,SUM(mist_totalmargindec) AS mist_totalmargindec
            , SUM(mist_totalsalesjan) AS mist_totalsalesjan,SUM(mist_totalmarginjan) AS mist_totalmarginjan
            , SUM(mist_totalsalesfeb) AS mist_totalsalesfeb,SUM(mist_totalmarginfeb) AS mist_totalmarginfeb
            , SUM(mist_totalsalesmar) AS mist_totalsalesmar,SUM(mist_totalmarginmar) AS mist_totalmarginmar
            FROM ".DBNAMEFX.".mis_transactions_monthly 
            WHERE mist_finyear = '".$reqObject->finyear."' ";
            $qry = $qry." ";
            
            
            if($reqObject->srchType=="B" ){
                $qry = $qry." and mist_brancode in (SELECT ml_backofficebranch FROM master_location WHERE ml_branchcd IN (".$_SESSION["entitybranchallowed"]."))";
                $qry = $qry." GROUP BY mist_brancode  ";
                $qry = $qry." ) AS actual ON misb_brancode = mist_brancode ";
            }
            if($reqObject->srchType=="E" ){
                $qry = $qry." GROUP BY mist_empcode  ";
                $qry = $qry." ) AS actual ON misb_empcode = mist_empcode ";
            }
            $qry = $qry." WHERE misb_finyear = '".$reqObject->finyear."'  ";
            
            if($reqObject->srchOneAll=="O"){
                if($reqObject->srchType=="B" ){
                    $qry = $qry." AND misb_brancode = (SELECT ml_backofficebranch FROM master_location WHERE ml_branchcd = ".$reqObject->srchBran.") ";
                }
                if($reqObject->srchType=="E" ){
                    $qry = $qry." AND misb_empcode = ".$reqObject->srchSalesExecutive." ";    
                }    
            }

            if($reqObject->srchOneAll != "O" and $reqObject->srchOneAll != "A"){
                $qry = $qry." AND misb_empcode = ".$reqObject->srchOneAll." ";
            }

            if($reqObject->srchType=="B" ){
                $qry = $qry." and misb_brancode in (SELECT ml_backofficebranch FROM master_location WHERE ml_branchcd IN (".$_SESSION["entitybranchallowed"].")) ";
                $qry = $qry." and misb_brancode>0 ORDER BY ml_branch ";
            }
            if($reqObject->srchType=="E" ){
                $qry = $qry." AND (misb_empcode IN (SELECT merl_empcode FROM master_employee_reporting_link WHERE merl_reportingto = 
                (SELECT user_empsrno FROM user_login WHERE user_srno = ".$_SESSION["userSrno"].")) OR misb_empcode = (SELECT user_empsrno FROM user_login WHERE user_srno = ".$_SESSION["userSrno"].")) ";
                $qry = $qry." and misb_empcode>0 ORDER BY emp_name ";
            }
            return $qry ;
        }


        public function genReport($dbio,$reqObject){
            $qry = $this->getReportQuery($reqObject, "N");
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn,$qry);
            $strRep = "";
            $strRep=" <table className='table table-responsive'>";
            $strRep = $strRep."<thead><tr>";
            $strRep = $strRep."<th>Code</th>";
            $strRep = $strRep."<th>Name</th>";

            $strRep = $strRep."<th>Apr Budget</th>";
            $strRep = $strRep."<th>Apr Sale</th>";
            $strRep = $strRep."<th>Apr Achived</th>";

            $strRep = $strRep."<th>May Budget</th>";
            $strRep = $strRep."<th>May Sale</th>";
            $strRep = $strRep."<th>May Achived</th>";

            $strRep = $strRep."<th>Jun Budget</th>";
            $strRep = $strRep."<th>Jun Sale</th>";
            $strRep = $strRep."<th>Jun Achived</th>";

            $strRep = $strRep."<th>Jul Budget</th>";
            $strRep = $strRep."<th>Jul Sale</th>";
            $strRep = $strRep."<th>Jul Achived</th>";

            $strRep = $strRep."<th>Aug Budget</th>";
            $strRep = $strRep."<th>Aug Sale</th>";
            $strRep = $strRep."<th>Aug Achived</th>";

            $strRep = $strRep."<th>Sep Budget</th>";
            $strRep = $strRep."<th>Sep Sale</th>";
            $strRep = $strRep."<th>Sep Achived</th>";

            $strRep = $strRep."<th>Oct Budget</th>";
            $strRep = $strRep."<th>Oct Sale</th>";
            $strRep = $strRep."<th>Oct Achived</th>";

            $strRep = $strRep."<th>Nov Budget</th>";
            $strRep = $strRep."<th>Nov Sale</th>";
            $strRep = $strRep."<th>Nov Achived</th>";

            $strRep = $strRep."<th>Dec Budget</th>";
            $strRep = $strRep."<th>Dec Sale</th>";
            $strRep = $strRep."<th>Dec Achived</th>";

            $strRep = $strRep."<th>Jan Budget</th>";
            $strRep = $strRep."<th>Jan Sale</th>";
            $strRep = $strRep."<th>Jan Achived</th>";

            $strRep = $strRep."<th>Feb Budget</th>";
            $strRep = $strRep."<th>Feb Sale</th>";
            $strRep = $strRep."<th>Feb Achived</th>";

            $strRep = $strRep."<th>Mar Budget</th>";
            $strRep = $strRep."<th>Mar Sale</th>";
            $strRep = $strRep."<th>Mar Achived</th>";

            $strRep = $strRep."</tr></thead>";
            $strRep = $strRep."<tbody>";
            if(mysqli_num_rows($result)>0){
                while($row = mysqli_fetch_row($result)){
                    $strRep = $strRep."<tr>";
                    $strRep = $strRep."<td>".$row[0]."</td>";
                    $strRep = $strRep."<td>".$row[1]."</td>";

                    $strRep = $strRep."<td>".round($row[2])."</td>"; // apr
                    $strRep = $strRep."<td>".round($row[3])."</td>";
                    $strRep = $strRep."<td>".round($row[4])."</td>";

                    $strRep = $strRep."<td>".round($row[5])."</td>"; // may
                    $strRep = $strRep."<td>".round($row[6])."</td>";
                    $strRep = $strRep."<td>".round($row[7])."</td>";

                    $strRep = $strRep."<td>".round($row[8])."</td>"; // jun
                    $strRep = $strRep."<td>".round($row[9])."</td>";
                    $strRep = $strRep."<td>".round($row[10])."</td>";

                    $strRep = $strRep."<td>".round($row[11])."</td>"; // jul
                    $strRep = $strRep."<td>".round($row[12])."</td>";
                    $strRep = $strRep."<td>".round($row[13])."</td>";

                    $strRep = $strRep."<td>".round($row[14])."</td>"; // Aug
                    $strRep = $strRep."<td>".round($row[15])."</td>";
                    $strRep = $strRep."<td>".round($row[16])."</td>";

                    $strRep = $strRep."<td>".round($row[17])."</td>"; // Sep
                    $strRep = $strRep."<td>".round($row[18])."</td>";
                    $strRep = $strRep."<td>".round($row[19])."</td>";

                    $strRep = $strRep."<td>".round($row[20])."</td>"; // Oct
                    $strRep = $strRep."<td>".round($row[21])."</td>";
                    $strRep = $strRep."<td>".round($row[22])."</td>";

                    $strRep = $strRep."<td>".round($row[23])."</td>"; // Nov
                    $strRep = $strRep."<td>".round($row[24])."</td>";
                    $strRep = $strRep."<td>".round($row[25])."</td>";

                    $strRep = $strRep."<td>".round($row[26])."</td>"; // Dec
                    $strRep = $strRep."<td>".round($row[27])."</td>";
                    $strRep = $strRep."<td>".round($row[28])."</td>";

                    $strRep = $strRep."<td>".round($row[29])."</td>"; // Jan
                    $strRep = $strRep."<td>".round($row[30])."</td>";
                    $strRep = $strRep."<td>".round($row[31])."</td>";

                    $strRep = $strRep."<td>".round($row[32])."</td>"; // feb
                    $strRep = $strRep."<td>".round($row[33])."</td>";
                    $strRep = $strRep."<td>".round($row[34])."</td>";

                    $strRep = $strRep."<td>".round($row[35])."</td>"; // mar
                    $strRep = $strRep."<td>".round($row[36])."</td>";
                    $strRep = $strRep."<td>".round($row[37])."</td>";

                    $strRep = $strRep."</tr>";
                }
            }else {
                $strRep = $strRep."<tr></tr>";
            }
            $strRep = $strRep."</tbody>";
            
            $strRep = $strRep."</table>";
            
            $dbio->closeConn($dbconn);
            if($reqObject->mode=="D"){
                header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                header('Content-Disposition: attachment;filename="'.$reqObject->filename.'"');
            }
            echo($strRep);
        }


        // public function genReportPercentage($dbio,$reqObject){
        //     $qry = $this->getReportQuery($reqObject);
        //     $dbconn = $dbio->getConn();
        //     $result = $dbio->getSelect($dbconn,$qry);
        //     $strRep = "";
        //     if(mysqli_num_rows($result)>0){
        //         while($row = mysqli_fetch_row($result)){
        //             $strRep = $strRep."<tr>";
        //             $strRep = $strRep."<td>".$row[0]."</td>";
        //             $strRep = $strRep."<td>".$row[1]."</td>";

        //             // for($i = 2, $j=4; $i<count($row); $i+=3, $j+=3){
        //             //     if($row[$i] == 0){
        //             //         $strRep = $strRep."<td>0%</td>";
        //             //     }else {
        //             //         $strRep = $strRep."<td>".round($row[$j]*100/$row[$i])."%</td>"; // apr
        //             //     }    
        //             // }

        //             //apr
        //             if($row[2] == 0){
        //                 $strRep = $strRep."<td>0%</td>";
        //             }else {
        //                 $strRep = $strRep."<td>".round($row[4]*100/$row[2])."%</td>"; 
        //             }

        //             //may
        //             if($row[5] == 0){
        //                 $strRep = $strRep."<td>0%</td>";
        //             }else {
        //                 $strRep = $strRep."<td>".round($row[7]*100/$row[5])."%</td>";
        //             }
                    
        //             //jun
        //             if($row[8] == 0){
        //                 $strRep = $strRep."<td>0%</td>";
        //             }else {
        //                 $strRep = $strRep."<td>".round($row[10]*100/$row[8])."%</td>";
        //             }

        //             //jul
        //             if($row[11] == 0){
        //                 $strRep = $strRep."<td>0%</td>";
        //             }else {
        //                 $strRep = $strRep."<td>".round($row[13]*100/$row[11])."%</td>";
        //             }
                    
        //             //aug
        //             if($row[14] == 0){
        //                 $strRep = $strRep."<td>0%</td>";
        //             }else {
        //                 $strRep = $strRep."<td>".round($row[16]*100/$row[14])."%</td>";
        //             }
                    
        //             //sept
        //             if($row[17] == 0){
        //                 $strRep = $strRep."<td>0%</td>";
        //             }else {
        //                 $strRep = $strRep."<td>".round($row[19]*100/$row[17])."%</td>";
        //             }
                    
        //             //oct
        //             if($row[20] == 0){
        //                 $strRep = $strRep."<td>0%</td>";
        //             }else {
        //                 $strRep = $strRep."<td>".round($row[22]*100/$row[20])."%</td>";
        //             }
                    
        //             //nov
        //             if($row[23] == 0){
        //                 $strRep = $strRep."<td>0%</td>";
        //             }else {
        //                 $strRep = $strRep."<td>".round($row[25]*100/$row[23])."%</td>";
        //             }
                    
        //             //dec
        //             if($row[26] == 0){
        //                 $strRep = $strRep."<td>0%</td>";
        //             }else {
        //                 $strRep = $strRep."<td>".round($row[28]*100/$row[26])."%</td>";
        //             }
                    
        //             //jan
        //             if($row[29] == 0){
        //                 $strRep = $strRep."<td>0%</td>";
        //             } else {
        //                 $strRep = $strRep."<td>".round($row[31]*100/$row[29])."%</td>"; 
        //             }
                    

        //             //feb
        //             if($row[32] == 0){
        //                 $strRep = $strRep."<td>0%</td>";
        //             }else {
        //                 $strRep = $strRep."<td>".round($row[34]*100/$row[32])."%</td>";
        //             }
                    
        //             //mar
        //             if($row[35] == 0){
        //                 $strRep = $strRep."<td>0%</td>";
        //             } else {
        //                 $strRep = $strRep."<td>".round($row[37]*100/$row[35])."%</td>";
        //             }
        //             $strRep = $strRep."</tr>";
        //         }
        //     }else {
        //         $strRep = $strRep."<tr></tr>";
        //     }
        //     // $strRep = $strRep."</tbody>";
            
        //     // $strRep = $strRep."</table>";
            
        //     $dbio->closeConn($dbconn);
        //     echo($strRep);
        // }

        public function genReportPercentage($dbio,$reqObject){
            $qry = $this->getReportQuery($reqObject, "P");
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn,$qry);
            $data = array();
            if(mysqli_num_rows($result)>0){
                while($row = mysqli_fetch_assoc($result)){
                    $data[] = $row;
                }
            }
            $dbio->closeConn($dbconn);
            echo(json_encode($data));
        }


        public function getDashFigures($dbio, $reqObject){
            $qry = $this->getReportQuery($reqObject, "N");
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn,$qry);
            $totaltarget = 0;
            $totalachieved = 0;
            if(mysqli_num_rows($result)>0){
                while($row = mysqli_fetch_row($result)){
                    $totaltarget = $totaltarget + $row[2] + $row[5] + $row[8] + $row[11] + $row[14] + $row[17] + $row[20] + $row[23] + $row[26] + $row[29] + $row[32] + $row[35];
                    $totalachieved = $totalachieved + $row[4] + $row[7] + $row[10] + $row[13] + $row[16] + $row[19] + $row[22] + $row[25] + $row[28] + $row[31] + $row[34] + $row[37];
                }
            }
            $this->target = round($totaltarget);
            $this->achieved = round($totalachieved);
            if($totaltarget == 0){
                $this->achpercent = 0;
            }else {
                $this->achpercent = round(($totalachieved*100 / $totaltarget), 2)."%";
            }
            $dbio->closeConn($dbconn);
        }

        public function genBudgetDownloadReport($dbio, $reqObject){
            $data = array();
            $sql = "SELECT 'Code', 'Name', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'
                    UNION ";
            if($reqObject->srchType == "E"){
                $sql = $sql."SELECT emp_srno, emp_name, ";
            }else {
                $sql = $sql."SELECT ml_backofficebranch, ml_branch, ";
            }

            $sql = $sql." COALESCE(misb_apr,0), COALESCE(misb_mar,0), COALESCE(misb_jun,0), COALESCE(misb_jul,0), COALESCE(misb_aug,0), 
            COALESCE(misb_sep,0), COALESCE(misb_oct,0), COALESCE(misb_nov,0), COALESCE(misb_dec,0), COALESCE(misb_jan,0), COALESCE(misb_feb,0), COALESCE(misb_mar,0) FROM ";

            if($reqObject->srchType == "E"){
                $sql = $sql."master_employee LEFT OUTER JOIN mis_budget ON emp_srno = misb_empcode ";
            }else {
                $sql = $sql."master_location LEFT OUTER JOIN mis_budget ON ml_backofficebranch = misb_brancode ";
            }
            $sql = $sql." WHERE 1 = 1 and misb_finyear = '".$reqObject->finyear."'";
            if($reqObject->srchType == "B"){
                $sql = $sql." AND ml_backofficebranch > 0 ORDER BY misb_empcode desc";
            }

            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            if($result){
                while($row = mysqli_fetch_assoc($result)){
                    $data[] = $row;
                }
            }
            $dbio->closeConn($dbconn);

            require 'vendoroffice/autoload.php';
            $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
            $worksheet = $spreadsheet->getActiveSheet();
            $worksheet->fromArray($data, NULL, 'A1');
            header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            header('Content-Disposition: attachment;filename="'.$reqObject->filename.'"');
            header('Cache-Control: max-age=0');

            $writer = \PhpOffice\PhpSpreadsheet\IOFactory::createWriter($spreadsheet, 'Xlsx');
            ob_end_clean();
            $writer->save('php://output');
            exit();
            
        }
        public function genAllReport($dbio , $obj){
        // $rep = new RepDashboard(); 
        // $sql = $rep->getReportQuery($dbio,$reqObject);
            $filename = $dbio->getRandomString(8).".xlsx";
            $obj->filename = $filename;
            $sql = "
            SELECT
            'Code' AS Code,
            'Name' AS Name,
            'Budget Apr' AS 'Budget Apr', 'Margin Apr' AS 'Margin Apr', 'Profit Percentage Apr' AS 'Profit Percentage Apr',
            'Budget May' AS 'Budget May', 'Margin May' AS 'Margin May', 'Profit Percentage May' AS 'Profit Percentage May',
            'Budget Jun' AS 'Budget Jun', 'Margin Jun' AS 'Margin Jun', 'Profit Percentage Jun' AS 'Profit Percentage Jun',
            'Budget Jul' AS 'Budget Jul', 'Margin Jul' AS 'Margin Jul', 'Profit Percentage Jul' AS 'Profit Percentage Jul',
            'Budget Aug' AS 'Budget Aug', 'Margin Aug' AS 'Margin Aug', 'Profit Percentage Aug' AS 'Profit Percentage Aug',
            'Budget Sep' AS 'Budget Sep', 'Margin Sep' AS 'Margin Sep', 'Profit Percentage Sep' AS 'Profit Percentage Sep',
            'Budget Oct' AS 'Budget Oct', 'Margin Oct' AS 'Margin Oct', 'Profit Percentage Oct' AS 'Profit Percentage Oct',
            'Budget Nov' AS 'Budget Nov', 'Margin Nov' AS 'Margin Nov', 'Profit Percentage Nov' AS 'Profit Percentage Nov',
            'Budget Dec' AS 'Budget Dec', 'Margin Dec' AS 'Margin Dec', 'Profit Percentage Dec' AS 'Profit Percentage Dec',
            'Budget Jan' AS 'Budget Jan', 'Margin Jan' AS 'Margin Jan', 'Profit Percentage Jan' AS 'Profit Percentage Jan',
            'Budget Feb' AS 'Budget Feb', 'Margin Feb' AS 'Margin Feb', 'Profit Percentage Feb' AS 'Profit Percentage Feb',
            'Budget Mar' AS 'Budget Mar', 'Margin Mar' AS 'Margin Mar', 'Profit Percentage Mar' AS 'Profit Percentage Mar' union all 
                ";
                $sql .= " select misb_empcode,  emp_name ,misb_apr , mist_totalmarginapr , april
                ,misb_may , mist_totalmarginmay, may
                ,misb_jun, mist_totalmarginjun , june
                ,misb_jul, mist_totalmarginjul , july
                ,misb_aug, mist_totalmarginaug , august
                ,misb_sep, mist_totalmarginsep , september
                ,misb_oct, mist_totalmarginoct , october
                ,misb_nov, mist_totalmarginnov , november
                ,misb_dec, mist_totalmargindec , december
                ,misb_jan, mist_totalmarginjan , january
                ,misb_feb, mist_totalmarginfeb , february
                ,misb_mar, mist_totalmarginmar , march from ( " ; 
            $sql .= $this->getReportQuery($obj , 'NP'); // 23
            $sql .= " ) as t  " ; 
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            if($result){
                while($row = mysqli_fetch_assoc($result)){
                    $data[] = $row;
                }
            }
            $dbio->closeConn($dbconn); 
            $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
            $worksheet = $spreadsheet->getActiveSheet();
            $worksheet->fromArray($data, NULL, 'A1');
            header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            header('Content-Disposition: attachment;filename="'.$obj->filename.'"');
            header('Cache-Control: max-age=0');

            $writer = \PhpOffice\PhpSpreadsheet\IOFactory::createWriter($spreadsheet, 'Xlsx');
            ob_end_clean();
            $writer->save('php://output');
            exit();
    }


    }
?>