<?php
 class Country {
    
    public function getCntAndPurpose($dbio){
        $countryArray = array();
        $purpose = array();

        $sql = "SELECT purpose_id, purpose_name FROM master_purpose WHERE purpose_card_active = 1";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if($result){
            while($row = mysqli_fetch_assoc($result)){
                $purpose[] = $row;
            }
        }
        $query = "select cnt_name, cnt_srno from master_country where cnt_srno != 1";
        $result = $dbio->getSelect($dbconn, $query);
        if($result){
            while($row = mysqli_fetch_assoc($result)){
                $countryArray[] = $row;
            }
        
        }
        return array("purpose"=>$purpose, "cntarray"=>$countryArray);
        $dbio->closeConn($dbconn);
    }

    
    public function getBranchForDelivery($dbio, $location){
        $sql = "SELECT ml_branch, ml_branchaddress FROM master_location WHERE ml_branchcd = ".$location."";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        $row = mysqli_fetch_row($result);
        $this->location = $row[0];
        $this->address = $row[1];
        $dbio->closeConn($dbconn);
    }

    

    public function getRemitRates($dbio, $isd, $branchcode){
        $sql = "SELECT isd_code, mrc_product, isd_name, ROUND(CASE WHEN mrc_ratetype = 'F' THEN mrc_buy WHEN mrc_ratetype = 'M' THEN  or_sellrate + mrc_buy
                WHEN mrc_ratetype = 'P' THEN (or_sellrate*mrc_buy/100)+or_sellrate END, 3) AS mrc_buy, ROUND(CASE WHEN mrc_ratetype = 'F' THEN mrc_sell WHEN mrc_ratetype = 'M' THEN or_buyrate - mrc_sell
                WHEN mrc_ratetype = 'P' THEN or_buyrate - (or_buyrate*mrc_sell/100)END, 3) AS mrc_sell FROM  
                (SELECT isd_code, mrc_ratetype,mrc_buy, mrc_sell , or_sellrate, or_buyrate, mrc_product, isd_name
                FROM master_isd
                LEFT OUTER JOIN master_rate_config ON mrc_isdcd= isd_code AND mrc_active = 1 AND mrc_product='TT'
                LEFT OUTER JOIN 
                (SELECT or_isd,or_sellrate,or_buyrate FROM master_online_rates WHERE or_refno = (SELECT MAX(or_refno) FROM master_online_rates)) AS mor 
                ON isd_code = or_isd
                WHERE isd_active = 1 AND isd_tt = 1 AND 
                mrc_branchcd = ".$branchcode." AND isd_code = '".$isd."'
                ) AS t";
        $dbconn= $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        $row = mysqli_fetch_row($result);
        $this->isdcode = $row[0];
        $this->buyrate = $row[3];
        $this->sellrate = $row[4];
        $dbio->closeConn($dbconn);
    }

 }


?>