<?php

class Currency {
    public function getCurrencyVal($dbio, $isd, $product, $branchcd){   
        
        if($product == "CARD"){
            $sql = "SELECT isd_code, mrc_product, isd_name
            , CASE 
                WHEN mrc_ratetype = 'F' THEN mrc_buy 
                WHEN mrc_ratetype = 'M' THEN  or_sellrate + mrc_buy
                WHEN mrc_ratetype = 'P' THEN (or_sellrate*mrc_buy/100)+or_sellrate
                END AS mrc_buy
            , CASE WHEN mrc_ratetype = 'F' THEN mrc_sell 
                WHEN mrc_ratetype = 'M' THEN or_buyrate - mrc_sell
                WHEN mrc_ratetype = 'P' THEN or_buyrate - (or_buyrate*mrc_sell/100)
                END AS mrc_sell 
            FROM  
            (SELECT isd_code, mrc_ratetype,mrc_buy, mrc_sell , or_sellrate, or_buyrate, mrc_product, isd_name
            FROM master_isd
            LEFT OUTER JOIN master_rate_config ON mrc_isdcd= isd_code AND mrc_active = 1 AND mrc_product='".$product."'
            LEFT OUTER JOIN 
            (SELECT or_isd,or_sellrate,or_buyrate FROM master_online_rates WHERE or_refno = (SELECT MAX(or_refno) FROM master_online_rates)) AS mor 
            ON isd_code = or_isd
            WHERE isd_active = 1 AND isd_card = 1 AND 
            mrc_branchcd = ".$branchcd." AND isd_code = '".$isd."'
            ) AS t";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            if(mysqli_num_rows($result)>0){
                $row = mysqli_fetch_row($result);
                $this->isd = $row[0];
                $this->buyrate = $row[3];
                $this->sellrate = $row[4];
            }else {
                $this->msg = 0;
            }
            $dbio->closeConn($dbconn);
        }else if ($product == "CN"){
            $sql = "SELECT isd_code, mrc_product, isd_name
            , CASE 
                WHEN mrc_ratetype = 'F' THEN mrc_buy 
                WHEN mrc_ratetype = 'M' THEN  or_sellrate + mrc_buy
                WHEN mrc_ratetype = 'P' THEN (or_sellrate*mrc_buy/100)+or_sellrate
                END AS mrc_buy
            , CASE WHEN mrc_ratetype = 'F' THEN mrc_sell 
                WHEN mrc_ratetype = 'M' THEN or_buyrate - mrc_sell
                WHEN mrc_ratetype = 'P' THEN or_buyrate - (or_buyrate*mrc_sell/100)
                END AS mrc_sell 
            FROM  
            (SELECT isd_code, mrc_ratetype,mrc_buy, mrc_sell , or_sellrate, or_buyrate, mrc_product, isd_name
            FROM master_isd
            LEFT OUTER JOIN master_rate_config ON mrc_isdcd= isd_code AND mrc_active = 1 AND mrc_product='".$product."'
            LEFT OUTER JOIN 
            (SELECT or_isd,or_sellrate,or_buyrate FROM master_online_rates WHERE or_refno = (SELECT MAX(or_refno) FROM master_online_rates)) AS mor 
            ON isd_code = or_isd
            WHERE isd_active = 1 AND isd_cash = 1 AND 
            mrc_branchcd = ".$branchcd."  AND isd_code = '".$isd."'
            ) AS t";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            if(mysqli_num_rows($result)>0){
                $row = mysqli_fetch_row($result);
                $this->isd = $row[0];
                $this->buyrate = $row[3];
                $this->sellrate = $row[4];
            }else {
                $this->msg = 0;
            }
            $dbio->closeConn($dbconn);
        }
        
            
    }


    public function getProductType($dbio, $product, $userId){
        $sql = "UPDATE lead_order SET po_product = '".$product."' WHERE po_status = 'D' AND po_usersrno = (SELECT user_srno from user_login where user_id = '".$userId."')";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        $dbio->closeConn($dbconn);
    }


    public function getMasterCurrency($dbio){
        $sql = "SELECT isd_code, isd_name, isd_active, isd_tt, isd_cash, isd_card FROM master_isd WHERE isd_active = 1";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if($result){
            $myArr = array();
            while($row = mysqli_fetch_assoc($result)){
                $myArr[] = $row;
            }
        }
        $dbio->closeConn($dbconn);
        return $myArr;
    }

    public function updateIsdActive($dbio, $status, $isdcode){
        $sql = "UPDATE master_isd SET isd_tt = ".$status." WHERE isd_code='".$isdcode."'";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        $dbio->closeConn($dbconn);
    }

    public function updateCardActive($dbio, $status, $isdcode){
        $sql = "UPDATE master_isd SET isd_card = ".$status." WHERE isd_code='".$isdcode."'";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        $dbio->closeConn($dbconn);   
    }

    public function updateCashActive($dbio, $status, $isdcode){
        $sql = "UPDATE master_isd SET isd_cash = ".$status." WHERE isd_code='".$isdcode."'";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        $dbio->closeConn($dbconn);
    }

    public function showFilteredCurrency($dbio, $filterType, $status){
        $dbconn = $dbio->getConn();
        if($filterType == "TT"){
            $sql = "SELECT isd_code, isd_name, isd_active, isd_tt, isd_cash, isd_card FROM master_isd WHERE isd_tt = ".$status." AND isd_active=1";
            $result = $dbio->getSelect($dbconn, $sql);
        }else if($filterType == "CN"){
            $sql = "SELECT isd_code, isd_name, isd_active, isd_tt, isd_cash, isd_card FROM master_isd WHERE isd_cash = ".$status." AND isd_active=1";
            $result = $dbio->getSelect($dbconn, $sql);
        }else if($filterType == "CARD"){
            $sql = "SELECT isd_code, isd_name, isd_active, isd_tt, isd_cash, isd_card FROM master_isd WHERE isd_card = ".$status." AND isd_active=1";
            $result = $dbio->getSelect($dbconn, $sql);
        }
        if($result){
            $myArr = array();
            while($row = mysqli_fetch_assoc($result)){
                $myArr[] = $row;
            }
        }
        $dbio->closeConn($dbconn);
        return $myArr;
    }

    public function getOfferCn($dbio){
        $cnarray = array();
        $sql = "SELECT isd_code, isd_name FROM master_isd WHERE isd_active = 1 AND isd_offer_active = 1";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if($result){
            while($row = mysqli_fetch_assoc($result)){
                $cnarray[] = $row;
            }
        }
        return $cnarray;
        $dbio->closeConn($dbconn);
    }


}




?>