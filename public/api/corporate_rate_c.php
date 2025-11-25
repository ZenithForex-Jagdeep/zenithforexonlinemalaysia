<?php

  class Corporate {

    public $msg;

  public function getCorporateRatesList($dbio, $obj) {
    $isok = true;
    $msg = "";
    $rateCardsList = array();
    $dbconn = null;
    try {
        $sql = "SELECT mrc_srno, mrc_product, mrc_isd, mrc_entity_id, mrc_entity_type, mrc_buy_rate, mrc_sell_rate, entity_name,
                       DATE_FORMAT(mrc_timestamp, '%Y-%m-%d') AS created_date
                FROM master_rate_corporate
                LEFT OUTER JOIN master_entity ON entity_id = mrc_entity_id AND entity_type = mrc_entity_type
                WHERE mrc_status = '1'";
        if (isset($obj->isdFilter->value) && $obj->isdFilter->value != 'A') {
            $sql .= " AND mrc_isd = '" . $obj->isdFilter->value . "'";
        }
        if (isset($obj->corporateFilter) && $obj->corporateFilter) {
            $sql .= " AND mrc_entity_id = " . $obj->corporateFilter->entity_id . " 
                      AND mrc_entity_type = '" . $obj->corporateFilter->entity_type . "'";
        }
        if (isset($obj->productFilter) && $obj->productFilter) {
            $sql .= " AND mrc_product = '" . $obj->productFilter . "'";
        }
        if (isset($obj->srno) && $obj->srno != 0) {
            $sql .= " AND mrc_srno = " . $obj->srno;
        }
        if (isset($obj->fromDate) && isset($obj->toDate)) {
            $sql .= " AND mrc_timestamp BETWEEN '" . $obj->fromDate . "' AND '" . $obj->toDate . "'";
        }
        $sql .= " ORDER BY mrc_srno DESC;";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if ($result) {
            while ($row = mysqli_fetch_assoc($result)) {
                $rateCardsList[] = $row;
            }
        } else {
            $isok = false;
            $msg = "Something went wrong. Please contact the administrator.";
        }
    } catch (Exception $e) {
        $isok = false;
        $msg = "Exception: " . $e->getMessage();
        $dbio->writeLog($msg."&&".$sql);
    } finally {
        if ($dbconn) {
            $dbio->closeConn($dbconn); // Always close connection
        }
    }

    return array("status" => $isok, "msg" => $msg, "list" => $rateCardsList);
  }
  public function insertEditCorporateRate($dbio, $obj) {
    $isok = true;
    $sql = "";
    // $srno = $obj->mrc_srno;
    $product = $obj->mrc_product;
    $entityId = $obj->mrc_entity_id;
    $entityType = $obj->mrc_entity_type;
    $scrMode = $obj->scrMode;
    $rateDetails = $obj->rateDetails;
    $msg="";
    $dbconn = null; 
    $resList=array();
    try {
        $dbconn = $dbio->getConn(); // Open connection once outside loop
        foreach ($rateDetails as $detail) {
            $detail_srno = $detail->mrc_srno;
            $detail_isd = $detail->mrc_isd;
            $detail_buyRate = $detail->mrc_buy_rate;
            $detail_sellRate = $detail->mrc_sell_rate;
            //get srno
            if($detail_srno == 0){
              $sql="SELECT COALESCE(MAX(mrc_srno), 0) + 1 FROM master_rate_corporate";
              $result = $dbio->getSelect($dbconn, $sql);
              if ($result===false) {
                throw new Exception("Failed to fetch new SRNO: " . mysqli_error($dbconn));
              }else if(mysqli_num_rows($result)>0){
                $row = mysqli_fetch_row($result);
                $obj->srno=$row[0];
              }
            }
            if ($detail_srno == 0) {
                // Insert new rate detail
                $sql = "INSERT INTO master_rate_corporate (mrc_srno, mrc_product, mrc_isd, mrc_entity_id, mrc_entity_type,
                        mrc_buy_rate, mrc_sell_rate, mrc_created_by, mrc_timestamp, mrc_status)
                        SELECT ".$obj->srno.",'".$product."', '".$detail_isd."', ".$entityId.", '".$entityType."', 
                        ".$detail_buyRate.", ".$detail_sellRate.", ".$_SESSION["userSrno"].", NOW(), '1'";
            } else {
                // Update existing rate detail //this will not in use because we are not providing edit option.
                $sql = "UPDATE master_rate_corporate 
                        SET mrc_product = '".$product."', 
                            mrc_isd = '".$detail_isd."', 
                            mrc_entity_id = ".$entityId.", 
                            mrc_entity_type = '".$entityType."', 
                            mrc_buy_rate = ".$detail_buyRate.", 
                            mrc_sell_rate = ".$detail_sellRate.", 
                            mrc_updated_date = NOW() 
                        WHERE mrc_srno = ".$detail_srno."";
            }
            if ($isok && $sql != '') {
                $result = $dbio->getSelect($dbconn, $sql);
                if($result===false) {
                    throw new Exception("Query failed: " . mysqli_error($dbconn) );
                }
            }else if ($result===true) {
                $isok = false;
                $msg = "craeted succcesfully."; // Indicate error if any detail fails
                break; // Exit loop on first error
            }
        }
        if ($isok) {
            $msg = 1;
        }
        $result=$this->getCorporateRatesList($dbio,$obj);
        if($result['status']){
          $resList=$result['list'];
        }
    } catch (Exception $e) {
        $isok = false;
        $msg = "EXECEPTION ERROR: " . $e->getMessage();
    } finally {
        if ($dbconn) {
            $dbio->closeConn($dbconn); // Always close the connection
        }
    }
    return array("status" => $isok, "msg" => $msg,"list"=>$resList);
  }
  public function getCorporateRateBySrno($dbio, $srno){
    $isok=true;
    $data=array();
    $sql = "SELECT mrc_srno, mrc_product, mrc_isd, mrc_entity_id, mrc_entity_type, mrc_buy_rate, mrc_sell_rate,entity_name ,isd_name
    FROM master_rate_corporate 
    LEFT OUTER JOIN master_entity ON   entity_id =mrc_entity_id AND entity_type=mrc_entity_type
    LEFT OUTER JOIN master_isd ON isd_code=mrc_isd
    WHERE mrc_srno = ".$srno."";
    $dbconn = $dbio->getConn();
    $result = $dbio->getSelect($dbconn, $sql);
    if(mysqli_num_rows($result)>0){
      $row = mysqli_fetch_assoc($result);
      $data[]=$row;
    }else {
        $isok=false;
    }
    $dbio->closeConn($dbconn);
    return array("status"=>$isok, "data"=> $data[0]);
  }

  public function deleteCorporateRate($dbio, $srno){
    $isok=true;
    $sql = "UPDATE master_rate_corporate SET mrc_status='0' WHERE mrc_srno=".$srno."";
    $dbconn = $dbio->getConn();
    $result = $dbio->getSelect($dbconn, $sql);
    if($result){
      $this->msg = 1;
    }else {
      $this->msg = 0;
        $isok=false;
    }
    $dbio->closeConn($dbconn);
      return array("status"=>$isok, "msg"=>$this->msg);
  }

  public function getCorporateRateByIsd($dbio, $obj){
    $isok=true;
    $buyRate = null;
    $sellRate = null;
    $msg = "";
    $dbconn = null;
    try {
      $sql = "SELECT mrc_buy_rate, mrc_sell_rate FROM master_rate_corporate
              WHERE mrc_isd='".$obj->isd."' AND mrc_product='".$obj->product."' AND mrc_status = 1 AND 
              mrc_entity_id = (SELECT user_corpsrno FROM user_login WHERE user_srno = ".$_SESSION["userSrno"].") 
              order by mrc_timestamp desc limit 1;";
      $dbconn = $dbio->getConn();
      $result = $dbio->getSelect($dbconn, $sql);
      if ($result) {
        if (mysqli_num_rows($result) > 0) {
          $row = mysqli_fetch_assoc($result);
          $buyRate = $row['mrc_buy_rate'];
          $sellRate = $row['mrc_sell_rate'];
          $msg = "Corporate rate retrieved successfully";
        } else {
          $msg = "No corporate rate found for the given criteria.";
        }
      } else {
        $isok = false;
        $msg = "Database query failed.";
        throw new Exception("Query Failed " . mysqli_error($dbconn) );
      }
    } catch (Exception $e) {
      $isok = false;
      $msg =  "EXECPOTION ERROR: ". $e->getMessage();
    } finally {
      if ($dbconn) {
        $dbio->closeConn($dbconn);
      }
    }
    return array("status"=>$isok, "msg"=>$msg, "buyRate"=>$buyRate, "sellRate"=>$sellRate);
  }
  public function getCorporateRateRight($dbio, $obj) {
    $isok = true;
    $msg = "";
    $right = array();
    try {
      $sql = "SELECT COALESCE(MAX(entity_liverate),0) as entity_liverate FROM master_entity
              LEFT OUTER JOIN user_login ON user_corpsrno=entity_id 
              WHERE user_srno = ".$_SESSION["userSrno"]."";
      $dbconn = $dbio->getConn();
      $result = $dbio->getSelect($dbconn, $sql);
      if($result && mysqli_num_rows($result)>0){
        $right = mysqli_fetch_assoc($result);
        $right = $right['entity_liverate'];
      }else {
        $isok = false;
        $msg = "Database query failed.";
        throw new Exception("Query Failed " . mysqli_error($dbconn) );
      }
    } catch (Exception $e) {
      $isok = false;
      $msg = "An error occurred: " . $e->getMessage();
      $dbio->writeLog($msg."&& (SQL: ".$sql.")");
    } finally {
      if (isset($dbconn) && $dbconn) {
        $dbio->closeConn($dbconn);
      }
    }
    return array("status"=>$isok, "msg"=>$msg, "right"=>$right);
  }

  public function getCorporateRateCardList($dbio, $obj) {
    $isok = true;
    $msg = "";
    $rateCardsList = array();
    $dbconn = null;
    $htmlformate="";
    $cosporateName="";
    if (!isset($_SESSION["userSrno"])) {
        $isok = false;
        $msg = "User not logged in or session expired.";
        return array("status" => $isok, "msg" => $msg, "list" => $rates);
    }
    try {
      $userSrno = $_SESSION["userSrno"];
      $dbconn = $dbio->getConn();
      if($isok){
        $sql="SELECT CONCAT(entity_id,' ',entity_name) as corpname FROM master_entity
              LEFT OUTER JOIN user_login ON user_corpsrno =entity_id 
              WHERE user_srno= ".$userSrno;
        $result = $dbio->getSelect($dbconn, $sql);
        if ($result) {
              while ($row = mysqli_fetch_assoc($result)) {
                   $cosporateName=$row['corpname'];
              }
          } else {
              $isok = false;
              $msg = "Something went wrong. Please contact the administrator.";
              throw new Exception("Query Failed " . mysqli_error($dbconn) );
          }
      }
      if($isok){
        $sql = "SELECT 'ISD','Product',	'Buy Rate',	'Sell Rate',	'Timestamp' UNION ALL
                SELECT t.mrc_isd,t.mrc_product,t.mrc_buy_rate,t.mrc_sell_rate,DATE_FORMAT(t.mrc_timestamp, '%d-%m-%Y %H:%i:%s')
                FROM master_rate_corporate t
                WHERE t.mrc_srno IN (SELECT MAX(mrc_srno) AS mrc_srno
                FROM master_rate_corporate
                WHERE mrc_entity_id = (SELECT user_corpsrno FROM user_login WHERE user_srno = ".$userSrno.")
                AND mrc_status = 1 GROUP BY mrc_isd)";
        $result = $dbio->getSelect($dbconn, $sql);
        if ($result) {
            while ($row = mysqli_fetch_assoc($result)) {
                $rateCardsList[] = $row;
            }
        } else {
            $isok = false;
            $msg = "Something went wrong. Please contact the administrator.";
            throw new Exception("Query Failed " . mysqli_error($dbconn) );
        }
      }
      if($isok && count($rateCardsList)>0){
        $htmlformate=$this->getHtmlTable($rateCardsList,$cosporateName);
      }  
    } catch (Exception $e) {
        $isok = false;
        $msg = "Exception: " . $e->getMessage();
        $dbio->writeLog($msg."&&".$sql);
    } finally {
        if ($dbconn) {
            $dbio->closeConn($dbconn); // Always close connection
        }
    }
    return array("status" => $isok, "msg" => $msg, "list" => $rateCardsList,"htmlformate"=>$htmlformate);
  }
    public function getHtmlTable($tableData,$cosporateName){
      $imgsrc="";
        //-----------------------------------------------------HTML FORMAT
        $format = "<html>";
        $format .= "<body style='font-family: \"Times-new-roman\"'>";
        $format .= "
          <div style='display:flex;margin-inline: 5%;align-items: center; justify-content: space-between;' >
            <div>
              <img src='img/logo.png' alt='Rate Card Image'/>
            </div>
            <div >
              <h1>Zenith Forex Online</h1>
            </div>
          </div>
          <div style='display:flex;align-items: center; justify-content: center;font-size: 30px;
          margin-bottom: 12px;'><strong>Corporate Name : </strong> ".$cosporateName."</div>

            <table width='100%' style='border: 2px solid black; border-collapse: collapse;font-size: 15px;text-align:center'>";
        if (count($tableData) > 0) {
            $ind = 0;
            foreach ($tableData as $row) {
                if ($ind < 1) {
                    $format .= "<thead><tr>";
                    foreach ($row as $value) {
                        $format .= "<th style='padding: 8px; background-color: #f2f2f2; border: 2px solid black;'>$value</th>";
                    }
                    $format .= "</tr></thead>";
                } else {
                    $format .= "<tbody>";
                    if ($ind == 1) {
                        $format .= "<tr >";
                        for ($i = 1; $i <= count($tableData); $i++) {
                            // $format .= "<td style='border: 2px solid black; padding :0.5px;'>($i)</td>";
                        }
                        $format .= "</tr>";
                    }

                    $format .= "<tr>";
                    foreach ($row as $value) {
                        $style = "border: 1px solid black; padding: 0.5px; white-space: nowrap;";
                        if (is_numeric($value)) {
                            $style .= " text-align: center;";
                        } else {
                            $style .= " text-align: left; padding-left: 4px;";
                        }
                        $format .= "<td style='$style'>$value</td>";
                    }
                    $format .= "</tr></tbody>";
                }
                $ind++;
            }
        }
        $format .= " </tbody>
            </table>
        </div>
        ";
        $format .= "</body>";
        $format .= "</html>";
        return $format;
    }
}

?>
