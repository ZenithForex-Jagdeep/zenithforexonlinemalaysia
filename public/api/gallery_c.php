<?php

    class GalleryImg {

        public function getAllGallery($dbio){
            $gallerylist = array();
            $sql = "SELECT tg_srno, tg_user, tg_photopath, tg_desc, tg_enable FROM tran_gallery WHERE tg_enable = 1";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            if($result){
                while($row = mysqli_fetch_assoc($result)){
                    $gallerylist[] = $row;
                }
            }
            return $gallerylist;            
            $dbio->closeConn($dbconn);
        }


        public function getGalleryMaster($dbio){
            $gallerylist = array();
            $sql = "SELECT tg_srno, tg_user, tg_photopath, tg_desc, tg_enable, tg_timestamp FROM tran_gallery";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            if($result){
                while($row = mysqli_fetch_assoc($result)){
                    $gallerylist[] = $row;
                }
            }
            return $gallerylist;            
            $dbio->closeConn($dbconn);
        }


        public function getPostBySrno($dbio, $srno){
            $sql = "SELECT tg_srno, tg_desc, tg_enable FROM tran_gallery WHERE tg_srno = ".$srno."";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            $dbio->closeConn($dbconn);
            if(mysqli_num_rows($result)>0){
                $row = mysqli_fetch_row($result);
                $this->msg = 1;
                $this->srno = $row[0];
                $this->desc = $row[1];
                $this->enable = $row[2];
            }else {
                $this->msg= 0;
            }
        }


        public function insertGalleryPost($dbio, $obj){
            $sql = "INSERT INTO tran_gallery (tg_srno, tg_user,tg_desc, tg_timestamp, tg_enable)
                    SELECT(SELECT COALESCE(MAX(tg_srno), 0) FROM tran_gallery)+1 AS srno, ".$_SESSION["userSrno"].", '".$obj->desc."', NOW(), ".$obj->status."";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            $dbio->closeConn($dbconn);
            if($result){
                $qry = "SELECT MAX(tg_srno) as srno FROM tran_gallery";
                $dbconn = $dbio->getConn();
                $res = $dbio->getSelect($dbconn, $qry);
                if(mysqli_num_rows($res)>0){
                    $row = mysqli_fetch_row($res);
                    $this->srno = $row[0];
                    $this->msg = "1";
                }else {
                    $this->msg = '0';
                }
                $dbio->closeConn($dbconn);
            }
        }

        public function updateGalleryPost($dbio, $obj){
            $sql = "UPDATE tran_gallery SET tg_desc = '".$obj->desc."', tg_enable=".$obj->status." WHERE tg_srno = ".$obj->srno." ";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            if($result){
                $this->srno = $obj->srno;
                $this->msg = "1";
            }else {
                $this->msg = '0';
            }
            $dbio->closeConn($dbconn);
            
        }


    }


?>