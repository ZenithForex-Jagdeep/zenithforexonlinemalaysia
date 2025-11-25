<?php

    class Blogs {

        public function getAllBlogs($dbio){
            $postlist = array();
            $sql = "SELECT bl_srno, user_name, bl_title, bl_posturl, bl_isenable, bl_content, DATE_FORMAT(bl_timestamp, '%d-%m-%Y')AS bl_date, bl_timestamp, COALESCE(bl_blogby,'') as bl_blogby FROM tran_blogposts
                    LEFT OUTER JOIN user_login ON bl_author = user_srno WHERE bl_isenable =1 ORDER BY bl_timestamp DESC";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            if($result){
                while($row = mysqli_fetch_assoc($result)){
                    $postlist[] = $row;
                }
            }
            return $postlist;
            $dbio->closeConn($dbconn);
        }

        public function getBlogTable($dbio, $src){
            $postlist = array();
            $sql = "SELECT bl_srno, bl_title, bl_isenable, DATE_FORMAT(bl_timestamp, '%d-%m-%Y') AS bl_timestamp FROM tran_blogposts";
            if($src == "ZFX"){
                $dbconn = $dbio->getConn();
            } else {
                $dbconn = $dbio->getConnFin();
            }
            $result = $dbio->getSelect($dbconn, $sql);
            if($result){
                while($row = mysqli_fetch_assoc($result)){
                    $postlist[] = $row;
                }
            }
            return $postlist;
            $dbio->closeConn($dbconn);
        }

        public function getForFinBlog($dbio, $srno, $src){
            $sql = "SELECT COALESCE(bl_blogby, '') as bl_blogby, bl_title, bl_posturl, bl_content, DATE_FORMAT(bl_timestamp, '%d-%m-%Y')AS bl_timestamp
                , bl_isenable, bl_srno FROM tran_blogposts
                WHERE bl_srno = ".$srno."";
            if($src == "ZFX"){
                $dbconn = $dbio->getConn();
            }else {
                $dbconn = $dbio->getConnFin();
            }
            $result = $dbio->getSelect($dbconn, $sql);
            if(mysqli_num_rows($result)>0){
                $row = mysqli_fetch_row($result);
                $this->author = $row[0];
                $this->title = $row[1];
                $this->imgurl = $row[2];
                $this->content = $row[3];
                $this->date = $row[4];
                $this->status = $row[5];
                $this->srno = $row[6];
                
            }else {
                $this->status = "0";
            }
            $dbio->closeConn($dbconn);
        }

        public function getBlogBysrno($dbio, $srno){
            $srno = str_replace('^^and^^','&',$srno);
            $srno = str_replace('^^hash^^','#',$srno);
            $srno = str_replace('^^plus^^','+',$srno);
            $srno = str_replace('^^mod^^','%',$srno);
            $srno = str_replace('^^equal^^','=',$srno);
            $srno = str_replace("-", " ", $srno);
            $sql = "SELECT COALESCE(bl_blogby, '') as bl_blogby, bl_title, bl_posturl, bl_content, DATE_FORMAT(bl_timestamp, '%d-%m-%Y')AS bl_timestamp,
                    bl_isenable, bl_srno 
                    FROM tran_blogposts
                    -- LEFT OUTER JOIN user_login ON bl_author = ".$_SESSION["userSrno"]."
                     WHERE bl_srno= ".$srno." ;";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            if(mysqli_num_rows($result)>0){
                $row = mysqli_fetch_row($result);
                $this->author = $row[0];
                $this->title = $row[1];
                $this->imgurl = $row[2];
                $this->content = $row[3];
                $this->date = $row[4];
                $this->status = $row[5];
                $this->srno = $row[6];
                
            }else {
                $this->status = "0";
            }
            $dbio->closeConn($dbconn);
        }
          public function getpostByTitle($dbio, $title){
            $title = str_replace('^^and^^','&',$title);
            $title = str_replace('^^hash^^','#',$title);
            $title = str_replace('^^plus^^','+',$title);
            $title = str_replace('^^mod^^','%',$title);
            $title = str_replace('^^equal^^','=',$title);
            $title = str_replace("-", " ", $title);
            $sql = "SELECT COALESCE(bl_blogby, '') as bl_blogby, bl_title, bl_posturl, bl_content, DATE_FORMAT(bl_timestamp, '%d-%m-%Y')AS bl_timestamp,
                    bl_isenable, bl_srno 
                    FROM tran_blogposts
                    
                     WHERE bl_title like '%".$title."%' ;";
                     // -- LEFT OUTER JOIN user_login ON bl_author = ".$_SESSION["userSrno"]."
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            if(mysqli_num_rows($result)>0){
                $row = mysqli_fetch_row($result);
                $this->author = $row[0];
                $this->title = $row[1];
                $this->imgurl = $row[2];
                $this->content = $row[3];
                $this->date = $row[4];
                $this->status = $row[5];
                $this->srno = $row[6];
                
            }else {
                $this->status = "0";
            }
            $dbio->closeConn($dbconn);
        }

        public function addNewBlogPost($dbio, $obj){
            $content = str_replace("'", "\'", $obj->postContent);
            $sql = "INSERT INTO tran_blogposts (bl_srno, bl_author, bl_posturl, bl_title, bl_content, bl_isenable, bl_timestamp, bl_blogby)
                    SELECT(SELECT COALESCE(MAX(bl_srno),0) FROM tran_blogposts)+1 AS srno, ".$_SESSION["userSrno"].", '', '".$obj->postTitle."',
                    '".$content."', ".$obj->postEnable.", now(), '".$obj->postAuthor."'";
            if($obj->src == "ZFX"){
                $dbconn = $dbio->getConn();
            }else {
                $dbconn = $dbio->getConnFin();
            }
            $result = $dbio->getSelect($dbconn, $sql);
            if($result){
                $qry = "SELECT MAX(bl_srno) AS srno FROM tran_blogposts";
                $res = $dbio->getSelect($dbconn, $qry);
                $row = mysqli_fetch_row($res);
                $this->srno = $row[0];
                $this->status = "1";
            }
            $dbio->closeConn($dbconn);
        }

        public function updateBlogPost($dbio, $obj){
            $content = str_replace("'", "\'", $obj->postContent);
            $sql = "UPDATE tran_blogposts SET bl_blogby = '".$obj->postAuthor."', bl_isenable = ".$obj->postEnable.", bl_title='".$obj->postTitle."'
            , bl_content = '".$content."'
            WHERE bl_srno = ".$obj->postSrno.";";
            if($obj->src == "ZFX"){
                $dbconn = $dbio->getConn();
            }else {
                $dbconn = $dbio->getConnFin();
            }
            $result = $dbio->getSelect($dbconn, $sql);
            $dbio->closeConn($dbconn);
            if($result){
                $this->status = "1";
                $this->srno = $obj->postSrno;
            }
        }

        
    }


?>