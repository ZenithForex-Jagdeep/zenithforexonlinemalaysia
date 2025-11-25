<?php

class GetPurpose {
    
    public function getTravelPurpose($dbio){
        $purposeList = array();
        $alldocs = array();
        $sql = "SELECT purpose_id, purpose_name, purpose_active, purpose_card_active, purpose_tt_active FROM master_purpose";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if($result){
          while($row = mysqli_fetch_assoc($result)){
            $purposeList[] = $row;
          }
        } 
        $dbio->closeConn($dbconn);

        $qry = "SELECT m_srno, m_documents FROM master_document";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $qry);
        if($result){
          while($row = mysqli_fetch_assoc($result)){
            $alldocs[] = $row;
          }
        } 
        $dbio->closeConn($dbconn);
        return array("purposelist"=>$purposeList, "alldocs"=>$alldocs);
      }

      public function getDocuments($dbio, $code){
        $sql = "SELECT m_srno, m_documents, CASE WHEN COALESCE(docid, 0)>=1 THEN 'YES' ELSE 'NO' END AS doc_required
                FROM master_document
                LEFT OUTER JOIN (SELECT purposeid, docid FROM master_purpose_doc_link WHERE purposeid = ".$code.")AS t ON m_srno = docid";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if($result){
          while($row = mysqli_fetch_assoc($result)){
            $this->doclist[] = $row;
          }
        } 
        $dbio->closeConn($dbconn);
        
        $qry = "SELECT purpose_id, purpose_name, purpose_card_active, purpose_tt_active FROM master_purpose WHERE purpose_id = ".$code."";
        $dbconn = $dbio->getConn();
        $res = $dbio->getSelect($dbconn, $qry);
        if($res){
            while($row = mysqli_fetch_row($res)){
              $this->p_id = $row[0];
              $this->p_name = $row[1];
              $this->p_cardactive = $row[2];
              $this->p_ttactive = $row[3];
            }
        } 
        $dbio->closeConn($dbconn);
      }

      public function updatePurposeRight($dbio, $obj){
        if($obj->status == "0"){
          $sql = "DELETE FROM master_purpose_doc_link WHERE purposeid = ".$obj->purpose." AND docid = ".$obj->docid."";  
          $dbconn = $dbio->getConn();
          $result = $dbio->getSelect($dbconn, $sql);
          $dbio->closeConn($dbconn);
        }else {
          $sql = "DELETE FROM master_purpose_doc_link WHERE purposeid = ".$obj->purpose." AND docid = ".$obj->docid.";
                  INSERT INTO master_purpose_doc_link (purposeid, docid)
                  VALUES(".$obj->purpose.", ".$obj->docid.")";
          $dbconn = $dbio->getConn();
          $result = $dbio->batchQueries($dbconn, $sql);
          $dbio->closeConn($dbconn);
        }
      }


      public function editPurposeMaster($dbio, $obj){
        $sql = "UPDATE master_purpose SET purpose_name = '".$obj->purposename."', purpose_card_active = ".$obj->cardStatus.", purpose_tt_active =".$obj->ttStatus." WHERE purpose_id = ".$obj->purposeCode."";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        $dbio->closeConn($dbconn);
      }


      public function insertNewPurpose($dbio, $obj){
          $sql = "SELECT purpose_name FROM master_purpose WHERE purpose_name = '".$obj->purposeName."'";
          $dbconn = $dbio->getConn();
          $result = $dbio->getSelect($dbconn, $sql);
          $dbio->closeConn($dbconn);
          if(mysqli_num_rows($result)>0){
            $this->msg = 0;
          }else{
            $sql = "INSERT INTO master_purpose (purpose_id, purpose_name, purpose_card_active, purpose_tt_active, purpose_active)
                    SELECT (SELECT COALESCE((SELECT max(purpose_id) from master_purpose),0))+1, UPPER('".$obj->purposeName."'), ".$obj->cardactive.", ".$obj->ttactive.", 1";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            $dbio->closeConn($dbconn);
          }
      }

      public function getTTPurpose($dbio){
        $purposeList = array();
        $sql = "SELECT purpose_id, purpose_name FROM master_purpose WHERE purpose_tt_active = 1";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if(mysqli_num_rows($result)>0){
          while($row = mysqli_fetch_assoc($result)){
            $purposeList[] = $row;
          }
        }
        return $purposeList;
        $dbio->closeConn($dbconn);
      }
}


?>