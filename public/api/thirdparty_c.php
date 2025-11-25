<?php

    class ThirdParty {


        public function insertSaleData($dbio, $obj){
            $err = "";
            $msg = "";
            $sql = "INSERT INTO thirdpartycrm_sales (par_srno, par_partycode, par_empcode, par_brancode, par_date, par_sales, par_margin, par_timestamp)
                    SELECT (SELECT COALESCE(MAX(par_srno), 0) +1 FROM thirdpartycrm_sales), ".$obj->partycode.", ".$obj->empcode.",
                    ".$obj->branchcode.", '".$obj->date."', ".$obj->sales.", ".$obj->margin.", NOW()";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            if($result){
                $err = "";
                $msg = "Data Added";
            } else {
                $err = "Error while saving the record!";
                $msg = "Error while saving the record!";
            }
            $dbio->closeConn($dbconn);
            return array("err"=>$err, "msg"=>$msg);
        }


        public function deletePartyData($dbio, $srno){
            $sql = "DELETE FROM thirdpartycrm_sales WHERE par_srno = ".$srno."";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            if($result){
                $this->msg = 1;
            }else {
                $this->msg = 0;
            }
            $dbio->closeConn($dbconn);
        }


        public function getAllThirdPartyData($dbio, $obj){
            $listdata = array();
            $sql = "SELECT par_srno, emp_name, part_name, DATE_FORMAT(par_date,'%d-%m-%Y') AS par_date, par_sales, par_margin, ml_branch
                    FROM thirdpartycrm_sales
                    LEFT OUTER JOIN master_third_party ON part_srno = par_partycode
                    LEFT OUTER JOIN master_employee ON par_empcode = emp_srno
                    LEFT OUTER JOIN master_location ON ml_branchcd = par_brancode
                    WHERE 1=1 ";
            if($obj->branch != "0"){
                $sql = $sql." AND par_brancode = ".$obj->branch." ";
            }
            $sql = $sql." ORDER BY par_timestamp DESC";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            if(mysqli_num_rows($result)>0){
                while($row = mysqli_fetch_assoc($result)){
                    $listdata[] = $row;
                }
            }
            $dbio->closeConn($dbconn);
            return $listdata;
        }


        public function getPartyData($dbio){
            $tparty = array();
            $emplist = array();
            $branlist = array();
            $sql = "SELECT 0 AS value, 'Select' AS label UNION ALL
                    SELECT part_srno, part_name FROM master_third_party WHERE part_active = 1";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            if(mysqli_num_rows($result)>0){
                while($row = mysqli_fetch_assoc($result)){
                    $tparty[] = $row;
                }
            }

            $qry = "SELECT 0 AS value, 'Select' AS label UNION ALL
                    SELECT emp_srno, emp_name FROM master_employee";
            $result = $dbio->getSelect($dbconn, $qry);
            if(mysqli_num_rows($result)>0){
                while($row = mysqli_fetch_assoc($result)){
                    $emplist[] = $row;
                }
            }

            $qry = "SELECT 0 AS value, 'Select' AS label UNION ALL
                    SELECT ml_branchcd, ml_branch FROM master_location";
            $result = $dbio->getSelect($dbconn, $qry);
            if(mysqli_num_rows($result)>0){
                while($row = mysqli_fetch_assoc($result)){
                    $branlist[] = $row;
                }
            }
            $dbio->closeConn($dbconn);
            return array("tparty"=>$tparty, "emplist"=>$emplist, "branlist"=>$branlist);
        }


        public function downloadFormat($dbio){
            $doc_desc="third-party-doc-format";
            $doc_ext="xlsx";
            $doc_filename="third-party-format.xlsx";            
            if (file_exists(UPLOADDOCSPATH.$doc_filename)) {
                header('Content-Description: File Transfer');
                header('Content-Type: application/octet-stream');
                header('Content-Disposition: attachment; filename='.basename($doc_filename));
                header('Content-Transfer-Encoding: binary');
                header('Expires: 0');
                header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
                header('Pragma: public');
                header('Content-Length: '.filesize(UPLOADDOCSPATH.$doc_filename));
                ob_clean();
                flush();
                readfile(UPLOADDOCSPATH.$doc_filename);
                exit;
            }
        }


    }


?>