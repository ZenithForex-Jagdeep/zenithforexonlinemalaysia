<?php

    class Rate {

    private function getActiveIsd($branchcode, $product) {
        $productCondition = "";
        $cashCardTTCondition = "";
        if ($product === "CN") {
            $productCondition = " AND rc.mrc_active = 1 AND rc.mrc_product = 'CN' AND rc.mrc_buy !=0 ";
            $cashCardTTCondition = "AND isd.isd_cash = 1";
        } elseif ($product === "CARD") {
            $productCondition = " AND rc.mrc_active = 1 AND rc.mrc_product = 'CARD'";
            $cashCardTTCondition = "AND isd.isd_card = 1";
        } elseif ($product === "TT") {
            $productCondition = " AND rc.mrc_active = 1 AND rc.mrc_product = 'TT'";
            $cashCardTTCondition = " AND isd.isd_tt = 1";
        }elseif ($product === "SELL") {
            $productCondition = " AND rc.mrc_sell_active = 1 AND rc.mrc_product = 'CN'";
            $cashCardTTCondition = " AND isd.isd_cash = 1";
        }

        // Build final query
        $qry = " WITH rate_source AS (
                SELECT 
                    isd.isd_code,
                    COALESCE(rc.mrc_branchcd, 0) AS mrc_branchcd,
                    rc.mrc_product,
                    isd.isd_name,
                    rc.mrc_buy AS buy_margin,
                    rc.mrc_sell AS sell_margin,
                    CASE 
                        WHEN rc.mrc_ratetype = 'F' THEN rc.mrc_buy
                        WHEN rc.mrc_ratetype = 'M' THEN mor.or_sellrate + rc.mrc_buy
                        WHEN rc.mrc_ratetype = 'P' THEN (mor.or_sellrate * rc.mrc_buy / 100) + mor.or_sellrate
                        ELSE mor.or_sellrate
                    END AS calc_buy,
                    CASE 
                        WHEN rc.mrc_ratetype = 'F' THEN rc.mrc_sell
                        WHEN rc.mrc_ratetype = 'M' THEN mor.or_buyrate - rc.mrc_sell
                        WHEN rc.mrc_ratetype = 'P' THEN mor.or_buyrate - (mor.or_buyrate * rc.mrc_sell / 100)
                        ELSE mor.or_buyrate
                    END AS calc_sell
                FROM master_isd AS isd
                LEFT JOIN master_rate_config AS rc
                    ON rc.mrc_isdcd = isd.isd_code
                    
                    {$productCondition}
                LEFT JOIN (
                    SELECT or_isd, or_sellrate, or_buyrate
                    FROM master_online_rates
                    WHERE or_refno = (SELECT MAX(or_refno) FROM master_online_rates)
                ) AS mor
                    ON isd.isd_code = mor.or_isd
                WHERE isd.isd_active = 1
                    {$cashCardTTCondition}
                    AND FIND_IN_SET(rc.mrc_branchcd, (
                        SELECT REPLACE(REPLACE(REPLACE(ml_connected_branch, '(', ''), ')', ''), ' ', '') 
                        FROM master_location 
                        WHERE ml_branchcd = {$branchcode}
                    ))
            ),
            ranked AS (
                SELECT 
                    rs.*,
                    ROW_NUMBER() OVER (
                        PARTITION BY rs.isd_code
                        ORDER BY rs.calc_buy ASC, rs.mrc_branchcd ASC
                    ) AS rn
                FROM rate_source rs
            )
            SELECT *
            FROM ranked
            WHERE rn = 1
            ORDER BY isd_code;
        ";
        return $qry;
    }



    public function getActiveCurrencyCode($dbio, $branchcode){
        $currencyArray = array();
        $sellcurrencyArray = array();
        $cardArray = array();
        $ttArray = array();
        $query = $this->getActiveIsd($branchcode, 'CN');
        $conn = $dbio->getConn();
        $result = $dbio->getSelect($conn, $query);
        if($result){
            while($row = mysqli_fetch_assoc($result)){
                $currencyArray[] = $row;
            }
        }

        $sql = $this->getActiveIsd($branchcode, 'CARD');
        $res = $dbio->getSelect($conn, $sql);
        if($res){
            while($row = mysqli_fetch_assoc($res)){
                $cardArray[] = $row;
            }
        }

        $qry = $this->getActiveIsd($branchcode, 'TT');
        $result2 = $dbio->getSelect($conn, $qry);
        if($result2){
            while($row = mysqli_fetch_assoc($result2)){
                $ttArray[] = $row;
            }
        }

        // $sql="select isd_code,isd_name from master_isd where isd_active=1 and isd_cash=1 order by isd_code";
        $qry = $this->getActiveIsd($branchcode, 'SELL');
        $result2 = $dbio->getSelect($conn, $qry);
        if($result2){
            while($row = mysqli_fetch_assoc($result2)){
                $sellcurrencyArray[] = $row;
            }
        }

        $dbio->closeConn($conn);
        return array('cashisd'=>$currencyArray, 'cardisd'=>$cardArray, 'ttisd'=>$ttArray,'sellcurrency'=>$sellcurrencyArray);
    }

    private function getLocRate($obj){
        $qry = "SELECT isd_code, mrc_product, isd_name
                , ROUND(CASE WHEN mrc_ratetype = 'F' THEN mrc_buy 
                WHEN mrc_ratetype = 'M' THEN  or_sellrate + mrc_buy
                WHEN mrc_ratetype = 'P' THEN (or_sellrate*mrc_buy/100)+or_sellrate
                END, 3) AS mrc_buy
                , ROUND(CASE WHEN mrc_ratetype = 'F' THEN mrc_sell 
                WHEN mrc_ratetype = 'M' THEN or_buyrate - mrc_sell 
                WHEN mrc_ratetype = 'P' THEN or_buyrate - (or_buyrate*mrc_sell/100)
                END, 3) AS mrc_sell 
                FROM  
                (SELECT isd_code, mrc_ratetype,mrc_buy, mrc_sell , or_sellrate, or_buyrate, mrc_product, isd_name
                FROM master_isd
                LEFT OUTER JOIN master_rate_config ON mrc_isdcd= isd_code AND mrc_active = 1 AND mrc_product='".$obj->product."'
                LEFT OUTER JOIN 
                (SELECT or_isd,or_sellrate,or_buyrate FROM master_online_rates WHERE or_refno = (SELECT MAX(or_refno) FROM master_online_rates)) AS mor 
                ON isd_code = or_isd
                WHERE isd_active = 1 AND 
                mrc_branchcd = ".$obj->branchcd." AND isd_code = '".$obj->currency."' ";

                if($obj->product == 'CN'){
                    $qry = $qry."AND isd_cash = 1) AS t ";
                }else {
                    $qry = $qry."AND isd_card = 1) AS t ";
                }
        return $qry;
    }


    public function getRateAsPerLocation($dbio, $obj){
        $sql = $this->getLocRate($obj);
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if(mysqli_num_rows($result)>0){
            $row = mysqli_fetch_row($result);
            $this->isd = $row[0];
            $this->buyrate = $row[3];
            $this->sellrate = $row[4];
        }
        $dbio->closeConn($dbconn);
    }

    private function getLowestRate($obj){
        // Build the query dynamically based on product (CN or CARD)
        $qry = "SELECT isd_code, mrc_product, isd_name,mrc_branchcd AS branch_code, ROUND(calc_buy, 3) AS mrc_buy,
                ROUND(
                    CASE 
                        WHEN mrc_ratetype = 'F' THEN mrc_sell
                        WHEN mrc_ratetype = 'M' THEN or_buyrate - mrc_sell
                        WHEN mrc_ratetype = 'P' THEN or_buyrate - (or_buyrate * mrc_sell / 100)
                        else or_buyrate
                    END,3) AS mrc_sell
                FROM ( SELECT isd_code, mrc_ratetype,mrc_buy,mrc_sell,or_sellrate, or_buyrate, mrc_product,isd_name, mrc_branchcd,
                    CASE 
                        WHEN mrc_ratetype = 'F' THEN mrc_buy
                        WHEN mrc_ratetype = 'M' THEN or_sellrate + mrc_buy
                        WHEN mrc_ratetype = 'P' THEN (or_sellrate * mrc_buy / 100) + or_sellrate
                        ELSE or_sellrate
                    END AS calc_buy
                FROM master_isd
                LEFT JOIN master_rate_config ON mrc_isdcd = isd_code AND mrc_active = 1 AND mrc_product = '".$obj->product."'
                LEFT JOIN (
                    SELECT or_isd, or_sellrate, or_buyrate FROM master_online_rates 
                    WHERE or_refno = (SELECT MAX(or_refno) FROM master_online_rates)
                ) AS mor ON isd_code = or_isd WHERE isd_active = 1 AND FIND_IN_SET(mrc_branchcd, (
                SELECT REPLACE(REPLACE(REPLACE(ml_connected_branch, '(', ''), ')', ''), ' ', '') 
                FROM master_location  WHERE ml_branchcd = ".$obj->branchcd.")) AND isd_code = '".$obj->currency."' ";
        if ($obj->product == 'CN') {
            $qry .= "AND isd_cash = 1 ";
            if(isset($obj->type) && $obj->type == "BUY"){
                $qry .= "AND mrc_buy !=0 ";
            }
        } else {
            $qry .= "AND isd_card = 1 ";
        }
        $qry .= ") AS t ORDER BY calc_buy ASC LIMIT 1; ";
        return $qry;
    }

    private function getLowestRateForSell($obj){
        $sql="SELECT isd_code, mrc_product, isd_name, or_buyrate,or_sellrate, mrc_branchcd AS branch_code, ROUND(calc_buy, 3) AS mrc_buy,
                ROUND(
                    CASE 
                    WHEN mrc_ratetype = 'F' THEN mrc_sell
                    WHEN mrc_ratetype = 'M' THEN or_buyrate - mrc_sell
                    WHEN mrc_ratetype = 'P' THEN or_buyrate - (or_buyrate * mrc_sell / 100)
                    ELSE or_buyrate
                    END,3) AS mrc_sell
                FROM ( 

                SELECT isd_code, mrc_ratetype,mrc_buy,mrc_sell,or_sellrate, or_buyrate, mrc_product,isd_name, mrc_branchcd,
                    CASE 
                    WHEN mrc_ratetype = 'F' THEN mrc_buy
                    WHEN mrc_ratetype = 'M' THEN or_sellrate + mrc_buy
                    WHEN mrc_ratetype = 'P' THEN (or_sellrate * mrc_buy / 100) + or_sellrate
                    ELSE or_sellrate
                    END AS calc_buy
                FROM master_isd
                LEFT JOIN master_rate_config ON mrc_isdcd = isd_code and mrc_sell_active=1  AND mrc_product = '".$obj->product."'
                LEFT JOIN (SELECT or_isd, or_sellrate, or_buyrate FROM master_online_rates WHERE or_refno = (SELECT MAX(or_refno) FROM master_online_rates)) AS mor ON isd_code = or_isd 
                WHERE isd_active = 1 AND isd_code =  '".$obj->currency."' AND isd_cash = 1 AND FIND_IN_SET(mrc_branchcd, (
                SELECT REPLACE(REPLACE(REPLACE(ml_connected_branch, '(', ''), ')', ''), ' ', '') 
                FROM master_location  WHERE ml_branchcd = ".$obj->branchcd."))
                ) AS t 
                ORDER BY mrc_sell DESC LIMIT 1;";
        return $sql;
    }



    public function getCardCashRateAsPerLowestRate($dbio, $obj){
        $sql = $this->getLowestRate($obj);
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if(mysqli_num_rows($result)>0){
            $row = mysqli_fetch_row($result);
            $this->isd = $row[0];
            $this->branchCode = $row[3];
            $this->buyrate = $row[4];
            $this->sellrate = $row[5];
        }
        $dbio->closeConn($dbconn);
    }

    public function getCardCashMaxRateForSell($dbio, $obj){
        $ersArray=array();
        $dbconn = $dbio->getConn();
        if($obj->product == 'CN' && isset($obj->type) && $obj->type == "SELL"){
            $sql = $this->getLowestRateForSell($obj);
            $result = $dbio->getSelect($dbconn, $sql);
            if( $result && mysqli_num_rows($result)>0){
                $row = mysqli_fetch_assoc($result);
                $ersArray[] = $row;
            }
        }
        $dbio->closeConn($dbconn);
        return $ersArray;
    }


    private function getBranchRates($obj){
        $qry = "SELECT COALESCE(mrc_product,'".$obj->type."') AS Product ,COALESCE(mrc_active,1) AS active,COALESCE(mrc_sell_active,0) AS sellactive,ml_branchcd , ml_branch,isd_code, or_isd, 
        ROUND(or_buyrate, 3) AS or_buyrate, ROUND(or_sellrate, 3) AS or_sellrate,COALESCE( mrc_ratetype,'F') AS ratetype, COALESCE(mrc_buy,0) AS buy,
        COALESCE(mrc_sell,0) AS sell FROM master_isd 
        LEFT OUTER JOIN master_location ON ml_branchcd = ".$obj->srno."
        LEFT OUTER JOIN 
        (SELECT or_isd,or_sellrate,or_buyrate FROM master_online_rates WHERE or_refno = (SELECT MAX(or_refno) FROM master_online_rates)) AS mor 
        ON isd_code = or_isd
        LEFT OUTER JOIN master_rate_config ON mrc_isdcd = isd_code AND mrc_branchcd= ".$obj->srno." AND mrc_product = '".$obj->type."'
        WHERE isd_active = 1";
        if($obj->type == "CN"){
            $qry = $qry." AND isd_cash = 1";
        }else if($obj->type == "CARD"){
            $qry = $qry." AND isd_card = 1";
        }else if($obj->type == "TT"){
            $qry = $qry." AND isd_tt = 1";
        }else if($obj->type == "DD"){
            $qry = $qry." AND isd_dd = 1";
        }
        return $qry;
    }


    public function getRate($dbio, $obj){
            $sql = $this->getBranchRates($obj);
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


    public function updateRate($dbio, $obj){
        foreach($obj as $item){
            $sql = "DELETE FROM master_rate_config WHERE mrc_isdcd = '".$item->isd_code."' AND mrc_branchcd = ".$item->ml_branchcd." AND mrc_product = '".$item->Product."';
                    INSERT INTO master_rate_config(mrc_branchcd, mrc_isdcd, mrc_ratetype, mrc_buy, mrc_sell,mrc_active, mrc_product, mrc_sell_active)
                    VALUES (".$item->ml_branchcd.", '".$item->isd_code."', '".$item->ratetype."', ".$item->buy.", ".$item->sell.", ".$item->active.", '".$item->Product."', ".$item->sellactive.");";
            $dbconn = $dbio->getConn();
            $result = $dbio->batchQueries($dbconn, $sql);
            $dbio->closeConn($dbconn);
            $this->msg = "1";
        }
    }


    public function copyRateData($dbio, $obj){
        $branchArr = $obj->toBranch->value;
        $branchlen = count($branchArr);
        if($branchArr[0] == ''){
            $this->msg = "0";
        }else {
            for($i=0; $i<$branchlen; $i++){
                $sql = "DELETE FROM master_rate_config WHERE mrc_branchcd = ".$branchArr[$i]." AND mrc_product = '".$obj->copyType."'";
                $dbconn = $dbio->getConn();
                $res = $dbio->getSelect($dbconn, $sql);
                $dbio->closeConn($dbconn);
                foreach($obj->dataToCopy as $item){
                    $query = "INSERT INTO master_rate_config (mrc_branchcd, mrc_isdcd, mrc_ratetype, mrc_buy, mrc_sell, mrc_active, mrc_product, mrc__sell_active)
                                VALUES (".$branchArr[$i].", '".$item->mrc_isdcd."', '".$item->mrc_ratetype."', ".$item->mrc_buy.", ".$item->mrc_sell.", ".$item->mrc_active.", '".$item->mrc_product."', ".$item->mrc_sell_active.");";
                    $dbconn = $dbio->getConn();
                    $res = $dbio->getSelect($dbconn, $query);
                    $dbio->closeConn($dbconn);
                    $this->msg = "1";
                }
            }
        }  
    } 
        

    public function getDataToCopy($dbio, $branch, $type, $branchArr){
        $branchlen = count($branchArr);
        $dbconn = $dbio->getConn();
        if($branchArr[0] != ""){
            $sql = "SELECT mrc_branchcd, mrc_isdcd, mrc_ratetype, mrc_buy, mrc_sell, mrc_active, mrc_product FROM master_rate_config WHERE mrc_branchcd = ".$branch." AND mrc_product = '".$type."'";
            $result = $dbio->getSelect($dbconn, $sql);
        }
        
        if($result){
            $data = array();
            while($row = mysqli_fetch_assoc($result)){
                $data[] = $row;
            }
        }
        $dbio->closeConn($dbconn);
        return $data;
    }


    private function getLiveCRates($location){
        $qry = "SELECT isd_code,isd_name 
                ,  COALESCE(mrc_cn_buy,0) AS mrc_cn_buy,  COALESCE(mrc_cn_sell,0) AS mrc_cn_sell, COALESCE(mrc_card_buy,0) AS mrc_card_buy , COALESCE( mrc_card_sell,0) AS mrc_card_sell , COALESCE( mrc_tt_buy,0) AS mrc_tt_buy
                FROM master_isd AS mi ";
        $qry = $qry."LEFT OUTER JOIN 
                    (SELECT isd_code AS isd_cn_code
                        , ROUND(CASE 
                            WHEN mrc_ratetype = 'F' THEN mrc_buy 
                            WHEN mrc_ratetype = 'M' THEN  or_sellrate + mrc_buy
                            WHEN mrc_ratetype = 'P' THEN (or_sellrate*mrc_buy/100)+or_sellrate
                            END, 3) AS mrc_cn_buy
                        , ROUND(CASE WHEN mrc_ratetype = 'F' THEN mrc_sell 
                            WHEN mrc_ratetype = 'M' THEN or_buyrate - mrc_sell
                            WHEN mrc_ratetype = 'P' THEN or_buyrate - (or_buyrate*mrc_sell/100)
                            END, 3) AS mrc_cn_sell 
                        FROM (SELECT isd_code, mrc_ratetype,mrc_buy, mrc_sell , or_sellrate, or_buyrate, mrc_product, isd_name
                        FROM master_isd
                        LEFT OUTER JOIN master_rate_config ON mrc_isdcd= isd_code AND mrc_active = 1 AND mrc_product='CN'
                        LEFT OUTER JOIN 
                        (SELECT or_isd,or_sellrate,or_buyrate FROM master_online_rates WHERE or_refno = (SELECT MAX(or_refno) FROM master_online_rates)) AS mor 
                        ON isd_code = or_isd
                        WHERE isd_active = 1  AND 
                        mrc_branchcd = ".$location."  AND isd_cash = 1) AS t
                    ) AS cn ON mi.isd_code = cn.isd_cn_code ";
        $qry = $qry."LEFT OUTER JOIN 
                    (SELECT isd_code AS isd_card_code 
                        , ROUND(CASE 
                            WHEN mrc_ratetype = 'F' THEN mrc_buy 
                            WHEN mrc_ratetype = 'M' THEN  or_sellrate + mrc_buy
                            WHEN mrc_ratetype = 'P' THEN (or_sellrate*mrc_buy/100)+or_sellrate
                            END, 3) AS mrc_card_buy
                        , ROUND(CASE WHEN mrc_ratetype = 'F' THEN mrc_sell 
                            WHEN mrc_ratetype = 'M' THEN or_buyrate - mrc_sell
                            WHEN mrc_ratetype = 'P' THEN or_buyrate - (or_buyrate*mrc_sell/100)
                            END, 3) AS mrc_card_sell 
                        FROM  
                        (SELECT isd_code, mrc_ratetype,mrc_buy, mrc_sell , or_sellrate, or_buyrate, mrc_product, isd_name
                        FROM master_isd
                        LEFT OUTER JOIN master_rate_config ON mrc_isdcd= isd_code AND mrc_active = 1 AND mrc_product='CARD'
                        LEFT OUTER JOIN 
                        (SELECT or_isd,or_sellrate,or_buyrate FROM master_online_rates WHERE or_refno = (SELECT MAX(or_refno) FROM master_online_rates)) AS mor 
                        ON isd_code = or_isd
                        WHERE isd_active = 1  AND 
                    mrc_branchcd = ".$location."  AND isd_card = 1) AS t ) AS card ON card.isd_card_code = mi.isd_code ";
        $qry = $qry."LEFT OUTER JOIN 
                    (SELECT isd_code AS isd_tt_code 
                        , ROUND(CASE 
                            WHEN mrc_ratetype = 'F' THEN mrc_buy 
                            WHEN mrc_ratetype = 'M' THEN  or_sellrate + mrc_buy
                            WHEN mrc_ratetype = 'P' THEN (or_sellrate*mrc_buy/100)+or_sellrate
                            END, 3) AS mrc_tt_buy
                            
                        FROM  
                        (SELECT isd_code, mrc_ratetype,mrc_buy, mrc_sell , or_sellrate, or_buyrate, mrc_product, isd_name
                        FROM master_isd
                        LEFT OUTER JOIN master_rate_config ON mrc_isdcd= isd_code AND mrc_active = 1 AND mrc_product='TT'
                        LEFT OUTER JOIN 
                        (SELECT or_isd,or_sellrate,or_buyrate FROM master_online_rates WHERE or_refno = (SELECT MAX(or_refno) FROM master_online_rates)) AS mor 
                        ON isd_code = or_isd
                        WHERE isd_active = 1  AND 
                    mrc_branchcd = ".$location."  AND isd_tt = 1) AS t ) AS tt ON tt.isd_tt_code = mi.isd_code ";
        $qry = $qry."WHERE isd_active = 1";
        return $qry;
    }


    public function getLiveRate($dbio, $loc){
        $rateList = array();
        $sql = $this->getLiveCRates($loc);
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if($result){
            while($row = mysqli_fetch_assoc($result)){
                $rateList[] = $row;
            }
        }
        return $rateList;
        $dbio->closeConn($dbconn);
    }


    private function getUserRateLog(){
        return "SELECT bu_prtype, bu_srno,bu_branch, bu_usersrno, ml_branch, user_name,  bu_updatedat
                FROM branch_rate_updatelog
                LEFT OUTER JOIN master_location ON bu_branch = ml_branchcd
                LEFT OUTER JOIN user_login ON bu_usersrno = user_srno
                WHERE DATE(bu_updatedat) = CURDATE()
                ORDER BY bu_srno DESC";
    }


    public function insertUserRateLog($dbio, $branch, $type){
        $list = array();
        $sql = "INSERT INTO branch_rate_updatelog (bu_srno, bu_branch, bu_usersrno, bu_updatedat, bu_prtype)
                SELECT(SELECT COALESCE(MAX(bu_srno), 0)+1 FROM branch_rate_updatelog) AS srno, ".$branch.", ".$_SESSION["userSrno"].", NOW(), '".$type."'";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if($result){
            $qry = $this->getUserRateLog();
            $res = $dbio->getSelect($dbconn, $qry);
            if(mysqli_num_rows($res)>0){
                while($row = mysqli_fetch_assoc($res)){
                    $list[] = $row;
                }
            }
        }
        return $list;
        $dbio->closeConn($dbconn);
    }

        
    public function getRateUpdateLog($dbio){
        $list = array();
        $lastLogin = array();
        $sql = $this->getUserRateLog();
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if(mysqli_num_rows($result)>0){
            while($row = mysqli_fetch_assoc($result)){
                $list[] = $row;
            }
        }
        $qry = "SELECT user_srno, user_id, mu_branchcd,user_name, COALESCE(s_sdate, 'NEVER LOGGED IN')AS s_sdate, COALESCE(s_active, '')AS s_active FROM user_login 
                LEFT OUTER JOIN (SELECT s_usrno,s_active,s_uid, s_sdate FROM user_session ORDER BY s_usrno DESC) AS ss ON user_id = s_uid
                LEFT OUTER JOIN master_user_branch_link ON user_srno = mu_usersrno
                WHERE user_entitytype = 'B' GROUP BY user_srno ORDER BY s_sdate DESC";
        $res = $dbio->getSelect($dbconn, $qry);
        if($res){
            while($row = mysqli_fetch_assoc($res)){
                $lastLogin[] = $row;
            }
        }
        return array("ratelog"=>$list, "loginlog"=>$lastLogin);
        $dbio->closeConn($dbconn);
    }
        

    }


?>

