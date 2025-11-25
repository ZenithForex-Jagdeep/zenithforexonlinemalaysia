<?php
    
    class Right {
        public function getRightGroup($dbio){
            $groupArr = array();
            $sql = "SELECT group_srno, group_name FROM master_right_group";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            if($result){
                while($row = mysqli_fetch_assoc($result)){
                    $groupArr[] = $row;
                }
            }
            return $groupArr;
            $dbio->closeConn($dbconn);
        }

        public function getAllRights($dbio){
            $rightList = array();
            $sql = "SELECT rgt.right_key,grp.right_query
                    FROM master_right_group_link AS grp
                    LEFT OUTER JOIN master_right AS rgt ON rgt.right_srno = grp.right_srno
                    WHERE group_srno IN (SELECT rgtgrp_grpno FROM master_user_right_group_link WHERE rgtgrp_userno = ".$_SESSION["userSrno"]." )";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            if($result){
                while($row = mysqli_fetch_row($result)){
                    $rightList[$row[0]] = $row[1];
                }
            }
            return $rightList;
            $dbio->closeConn($dbconn);
        }

        public function getDetail($dbio, $srno){
            $sql = "select group_srno, group_name 
            from master_right_group where group_srno = ".$srno."";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            if($result){
                while($row = mysqli_fetch_row($result)){                
                    $this->srno = $row[0];
                    $this->group = $row[1];
                }
            }
            $dbio->closeConn($dbconn);
        }

        public function getRightDetails($dbio, $srno){
            $detail = array();
            $sql = "SELECT rgt.right_srno,rgt.right_key,rgt.right_desc,rgt.right_parent
                ,rgt.right_level
                ,CASE WHEN COALESCE(grp.right_query,0)=1 THEN 'YES' ELSE 'NO' END AS right_query
                ,CASE WHEN COALESCE(grp.right_add,0)=1 THEN 'YES' ELSE 'NO' END AS right_add
                ,CASE WHEN COALESCE(grp.right_edit,0)=1 THEN 'YES' ELSE 'NO' END AS  right_edit 
                FROM master_right AS rgt
                LEFT OUTER JOIN 
                (SELECT * FROM master_right_group_link WHERE group_srno = ".$srno." )
                AS grp ON rgt.right_srno = grp.right_srno";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn,$sql);
            if($result){
                while($row =mysqli_fetch_assoc($result))
                {
                    $detail[] = $row;
                }
            }
            return $detail;
            $dbio->closeConn($dbconn);
        }

        public function getRights($dbio){
            $rights = array();
            $sql = "SELECT right_srno, right_key FROM master_right ORDER BY right_srno ASC";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn,$sql);
            if($result){
                while($row =mysqli_fetch_assoc($result))
                {
                    $rights[] = $row;
                }
            }
            return $rights;
            $dbio->closeConn($dbconn);
        }

        public function changeRight($dbio, $obj){
            $sql = "DELETE FROM master_right_group_link WHERE group_srno = (SELECT group_srno FROM master_right_group WHERE group_name = '".$obj->groupname."') AND right_srno=".$obj->srno.";
                    INSERT INTO master_right_group_link (group_srno, right_srno, right_query, right_add, right_edit)
                    VALUES ((SELECT group_srno FROM master_right_group WHERE group_name = '".$obj->groupname."'), ".$obj->srno.", ".$obj->rightQry.", ".$obj->rightAdd.", ".$obj->rightEdit.")";
            $dbconn = $dbio->getConn();
            $result = $dbio->batchQueries($dbconn, $sql);
            if($result){
                $this->msg = 1;
            }else {
                $this->msg = 0;
            }
            $dbio->closeConn($dbconn);
        }

        public function saveNewRight($dbio, $obj){
            $groupname = strtoupper($obj->group);
            $sql = "SELECT * FROM master_right_group WHERE group_name = '".$groupname."'";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            $dbio->closeConn($dbconn);
            if(mysqli_num_rows($result) == 0){
                $sql = "INSERT INTO master_right_group (group_srno, group_name)
                        SELECT (SELECT COALESCE((SELECT max(group_srno) from master_right_group),1))+1, '".$groupname."'";
                $dbconn = $dbio->getConn();
                $result = $dbio->getSelect($dbconn, $sql);
                $dbio->closeConn($dbconn);
            }else {
                $this->msg = 0; //Group Already Exist
            }
            
        }

        private function getUserNavRightQuery($nav_key){
            return " SELECT rgt.right_key,grp.right_query,grp.right_add,grp.right_edit,grp.group_srno,grp.right_srno 
            FROM master_right_group_link AS grp
            LEFT OUTER JOIN master_right AS rgt ON rgt.right_srno = grp.right_srno
            WHERE group_srno IN (SELECT rgtgrp_grpno FROM master_user_right_group_link WHERE rgtgrp_userno = ".$_SESSION["userSrno"]." )
            AND rgt.right_key = '".$nav_key."' ";
        }
    
        public function getUserNavRight($dbio,$nav_key){     
            $this->navkey = $nav_key;
            $this->query = 0;
            $this->add = 0;
            $this->edit = 0;
    
            $sql=$this->getUserNavRightQuery($nav_key);
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn,$sql);
            if($result){
                while($row = mysqli_fetch_row($result)){                
                    $this->navkey = $row[0];
                    $this->query = $row[1];
                    $this->add = $row[2];
                    $this->edit = $row[3];
                }
            }
            $dbio->closeConn($dbconn);
        }

    }


?>