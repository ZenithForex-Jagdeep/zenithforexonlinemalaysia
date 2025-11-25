<?php
 
    class Documents {
        public function getDocList($dbio, $orderno){
            $doclist =array();
            $sql = "SELECT doc_orderno, doc_name, doc_id, doc_filename, doc_ext FROM lead_req_document WHERE doc_orderno = '".$orderno."'";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            if($result){
                while($row = mysqli_fetch_assoc($result)){
                    $doclist[] = $row;
                }
            }
            return $doclist;
            $dbio->closeConn($dbconn);
        }


        private function getVerifyDocumentQuery($obj){
            return "SELECT  doc_filename, doc_orderno, doc_name, doc_id, doc_ext FROM lead_req_document WHERE doc_filename = '".$obj->filename."' 
            AND doc_orderno = '".$obj->orderno."'";
        }

        private function getTieUpVerifyDocumentQuery($obj){
            return "SELECT tl_visitingcard, tl_srno, tl_name, tl_email, tl_cardext FROM tieup_lead WHERE tl_srno = ".$obj->srno."";
        }

        private function getConveyanceDocumentQuery($obj){
            return "SELECT cdt_filename, cdt_srno, cdt_doc_desc, cdt_random_number, cdt_doc_ext FROM conveyance_document_temp WHERE cdt_srno = ".$obj->srno." AND cdt_line_no = ".$obj->lineNo." AND cdt_random_number = '".$obj->randomNumber."'";
        }

        private function getConveyanceDocumentsQuery($obj){
            return "SELECT cd_filename, cd_srno, cd_doc_desc, cd_random_number, cd_doc_ext FROM conveyance_document WHERE cd_srno = ".$obj->srno." AND cd_line_no = ".$obj->lineNo." AND cd_random_number = '".$obj->randomNumber."'";
        }   

        public function viewDocument($dbio, $request){
            $doc_desc="";
            $doc_ext="";
            $doc_filename="";
            $typ = "";
            $bs64 ="";
            if($request->doctype == "orderhistory"){
                $sql = $this->getVerifyDocumentQuery($request);
            }else if($request->doctype == "conveyanceDoc"){
                if($request->srno == 0){
                    $sql = $this->getConveyanceDocumentQuery($request);
                }else{
                    $sql = $this->getConveyanceDocumentsQuery($request);
                }
            }else {
                $sql = $this->getTieUpVerifyDocumentQuery($request);
            }
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn,$sql);
            if($result){
                while($row = mysqli_fetch_row($result)){
                    $doc_desc=$row[2];
                    $doc_filename = $row[0];
                    $doc_ext = $row[4];
                }
            }
            $dbio->closeConn($dbconn);

            $uploadpath = "";
            $uploadpath = UPLOADDOCSPATH;
            if(isset($request->doctype) == "conveyanceDoc" ){
                if($request->doctype == "conveyanceDoc"){
                    if($request->srno == 0){
                        $uploadpath = TEMPPATH;
                    }else{
                        $uploadpath = UPLOADDOCSPATH;
                    }
                }
            }
            

            if($doc_ext=="jpg"){
                $typ = "image/jpg";
                $bs64 = "data:image/jpg;base64,".base64_encode(file_get_contents($uploadpath.$doc_filename));
            }elseif($doc_ext=="png"){
                $typ = "image/png";
                $bs64 = "data:image/png;base64,".base64_encode(file_get_contents($uploadpath.$doc_filename));
            }elseif($doc_ext=="gif"){
                $typ = "image/gif";
                $bs64 = "data:image/gif;base64,".base64_encode(file_get_contents($uploadpath.$doc_filename));
            }elseif($doc_ext=="bmp"){
                $typ = "image/bmp";
                $bs64 = "data:image/bmp;base64,".base64_encode(file_get_contents($uploadpath.$doc_filename));
            }elseif($doc_ext=="pdf"){
                $typ = "application/pdf";
                $bs64 = "data:application/pdf;base64,".base64_encode(file_get_contents($uploadpath.$doc_filename));
            }else if($doc_ext=="jpeg"){
                $typ = "image/jpeg";
                $bs64 = "data:image/jpeg;base64,".base64_encode(file_get_contents($uploadpath.$doc_filename));
            }else if($doc_ext=="jfif"){
                $typ = "application/jfif";
                $bs64 = "data:application/jfif;base64,".base64_encode(file_get_contents($uploadpath.$doc_filename));
            }else{
                $typ = "image/png";
                $bs64 = "data:image/png;base64,".base64_encode(file_get_contents($uploadpath."fnf.png")); /// file not found file not available
            }
            echo json_encode(array( "typ"=>$typ, "bs64"=>$bs64, "desc"=>$doc_desc, "ext"=>$doc_ext, "fname"=>$doc_filename ));
        }


        public function downloadDocument($dbio, $request){
            $doc_desc="";
            $doc_ext="";
            $doc_filename="";
            if($request->doctype == "conveyanceDoc"){
                if($request->srno == 0){
                    $sql = $this->getConveyanceDocumentQuery($request);
                }else{
                    $sql = $this->getConveyanceDocumentsQuery($request);
                }
            }else{
                $sql = $this->getVerifyDocumentQuery($request);
            }
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn,$sql);
            if($result){
                while($row = mysqli_fetch_row($result)){
                    $doc_desc = $row[2];
                    $doc_ext = $row[4];
                    $doc_filename = $row[0];
                }
            }

            $uploadpath = "";
            $uploadpath = UPLOADDOCSPATH;
            if(isset($request->doctype)){
                if($request->doctype == "conveyanceDoc"){
                    if($request->srno == 0){
                        $uploadpath = TEMPPATH;
                    }else {
                        $uploadpath = UPLOADDOCSPATH;
                    }
                }
            }

            $dbio->closeConn($dbconn);
            if (file_exists($uploadpath.$doc_filename)) {
                header('Content-Description: File Transfer');
                header('Content-Type: application/octet-stream');
                header('Content-Disposition: attachment; filename='.basename($doc_filename));
                header('Content-Transfer-Encoding: binary');
                header('Expires: 0');
                header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
                header('Pragma: public');
                header('Content-Length: '.filesize($uploadpath.$doc_filename));
                ob_clean();
                flush();
                readfile($uploadpath.$doc_filename);
                exit;
            }
        }

    }


?>