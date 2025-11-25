<?php

    class AllRights {
        public function getUserRights($dbio, $type){
            $sql ="SELECT * FROM master_right_group_link WHERE group_srno in (SELECT rgtgrp_grpno FROM master_user_right_group_link 
                   WHERE rgtgrp_userno = ".$_SESSION["userSrno"].") AND right_srno in (SELECT right_srno FROM master_right WHERE right_key = '".$type."')";
            $dbconn =$dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            $dbio->closeConn($dbconn);
            if(mysqli_num_rows($result)>0){
                $row = mysqli_fetch_row($result);
                $this->QUERY = $row[2];
                $this->ADD = $row[3];
                $this->EDIT = $row[4];
            }else {
                $this->QUERY = 0;
                $this->ADD = 0;
                $this->EDIT = 0;
            }
        }
    }


?>