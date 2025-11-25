<?php


class Location {
    public function getLocation($dbio) {
        $sql = "SELECT ml_branchcd, ml_branch, ml_branchaddress, ml_active FROM master_location 
        WHERE ml_active = 1  order by ml_branch";
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

        public function getLocationForModel($dbio) {
        $sql = "SELECT ml_branchcd, ml_branch, ml_branchaddress, ml_active FROM master_location 
        WHERE ml_active = 1 AND ml_home_model_active=1  order by ml_branch";
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
    public function getLocationUser($dbio) {
        $sql = " SELECT ml_branchcd, ml_branch, ml_branchaddress, ml_active, ml_backofficebranch FROM master_location 
        WHERE ml_active = 1 AND ml_branchcd IN (
		SELECT mu_branchcd FROM master_user_branch_link WHERE mu_usersrno = ".$_SESSION["userSrno"]."         
        ) ";
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


    public function getAllBranches($dbio){
        $sql = "SELECT ml_branchcd, ml_branch, ml_branchaddress, ml_active FROM master_location";
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

    public function getCashfreeActive($dbio, $orderno){
        $query = "SELECT  bm_active FROM bank_master 
                LEFT OUTER JOIN master_account_details ON bm_code = ac_bankname
                WHERE ac_orderno = '".$orderno."'";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $query);
        if(mysqli_num_rows($result)>0){
            $row = mysqli_fetch_row($result);
            $this->active = $row[0];
        }else {
            $this->active = '0';
        }
        $dbio->closeConn($dbconn);
    }

    public function getAllBranchAddress($dbio){
        $branlist = array();
        $sql = "SELECT ml_branchcd, ml_branch, ml_branchaddress, ml_active, ml_maplink FROM master_location WHERE ml_active = 1";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if($result){
            while($row = mysqli_fetch_assoc($result)){
                $branlist[] = $row;
            }
        }
        return $branlist;
        $dbio->closeConn($dbconn);
    }

    public function getBranchAddress($dbio, $branchcd){
        //$branchlist = array();
        $dbconn = $dbio->getConn();
        if($branchcd == "A"){
            $sql = "SELECT ml_branchcd, ml_branch, ml_branchaddress, ml_active, ml_maplink FROM master_location";
            $result = $dbio->getSelect($dbconn, $sql);
        }else {
            $query = "SELECT ml_branchcd, ml_branch, ml_branchaddress, ml_active, ml_maplink FROM master_location WHERE ml_branchcd = ".$branchcd."";
            $result = $dbio->getSelect($dbconn, $query);
        }
        if($result){
            $this->msg = 1;
            while($row = mysqli_fetch_assoc($result)){
                $this->branchlist[] = $row;
            }
        }
        $dbio->closeConn($dbconn);
    }

    public function getOfferActiveLoc($dbio){
        $locarray = array();
        $sql = "SELECT ml_branchcd, ml_branch FROM master_location WHERE ml_offer_active =1;";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if($result){
            while($row = mysqli_fetch_assoc($result)){
                $locarray[] = $row;
            }
        }
        return $locarray;
        $dbio->closeConn($dbconn);
    }

    public function getLocationForSearch($dbio){
        $list = array();
        $sql = "SELECT ml_branchcd AS value, ml_branch AS label FROM master_location  WHERE ml_active = 1 AND ml_home_model_active=1 ;";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if($result){
            while($row = mysqli_fetch_assoc($result)){
                $list[] = $row;
            }
        }
        return $list;
        $dbio->closeConn($dbconn);
    }
    
    public function getLocationIdByName($dbio, $branname){
        $list = array();
        $sql = "SELECT ml_branchcd FROM master_location WHERE ml_branch = '".$branname."'";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        $branchId = 0;
        if(mysqli_num_rows($result)>0){
            $row = mysqli_fetch_row($result);
            $branchId = $row[0];
        }
        $dbio->closeConn($dbconn);
        return $branchId;
    }


}


?>