<?php
//session_start();

//sendPlaceOrderMail( $dbio, $orderno, $usersrno, $userid );

function sendPlaceOrderMail( $dbio, $orderno, $usersrno, $userid ) {

    $docflag = 0;
    $prdata = array();
    $data;
    date_default_timezone_set( 'Asia/Kolkata' );
    $curtime = date( 'd-m-Y H:i:s' );
    $qry = "SELECT user_name, user_email, user_mobile, po_order_no, po_refno, po_ordertype, DATE_FORMAT(po_traveldate, '%d-%m-%Y'), po_product, po_currency, po_quantity,po_buyrate, po_product_2, 
            po_card_currency, po_card_quantity, po_card_buyrate,
            po_CGST, po_handlingcharge, COALESCE(po_nostrocharge, '')AS po_nostrocharge,
            po_roundAmt,purpose_name, ld_address, ml_branch,ld_branchaddress,ld_deliverymode, po_paymenttype, ms_status, po_ispaid, COALESCE(ac_amountpaid,0)AS ac_amountpaid
            FROM lead_order
            LEFT OUTER JOIN user_login ON po_usersrno = user_srno
            LEFT OUTER JOIN master_purpose ON po_travelpurpose = purpose_id
            LEFT OUTER JOIN lead_delivery ON po_order_no = ld_orderno
            LEFT OUTER JOIN master_location ON po_location = ml_branchcd
            LEFT OUTER JOIN master_status ON po_status = ms_code
            LEFT OUTER JOIN master_account_details ON po_order_no = ac_orderno
            WHERE po_order_no = '".$orderno."' AND po_usersrno = ".$usersrno.'';
    $dbconn = $dbio->getConn();
    $res = $dbio->getSelect( $dbconn, $qry );
    if ( mysqli_num_rows( $res ) > 0 ) {
        $row = mysqli_fetch_row( $res );
        $sql = "SELECT lp_producttype, lp_isd, lp_quantity, lp_rateofexchange, lp_totalamt FROM lead_product WHERE lp_orderno = '".$orderno."'";
        $result = $dbio->getSelect( $dbconn, $sql );
        if ( mysqli_num_rows( $result )>0 ) {
            while( $r = mysqli_fetch_assoc( $result ) ) {
                $prdata[] = $r;
            }
        }
        $query = "SELECT * FROM lead_req_document WHERE doc_orderno = '".$orderno."'";
        $result1 = $dbio->getSelect( $dbconn, $query );
        if ( mysqli_num_rows( $result1 )>0 ) {
            $docflag = 1;
        }
        $ml = orderConfirmMailFormat( $row, $prdata, $docflag, 'Thank you for accepting the order assigned to you. Please check the liability of TCS application at your end before releasing the forex to the customer. Please find the order details below' );
        $dbio->writeLog( $ml );
        $ml2 = orderConfirmMailFormat( $row, $prdata, $docflag, 'Thank you for the request. <br>Order confirmation subject to receipt of payment, documentation and other compliance approval.<br>Congratulations! You are now entitled for a discount voucher on successful completion of transaction. The voucher will reach your email ID within 24 to 48 Hours.<br> Terms and conditions applied.' );
        $attachment = ATTACHMENT.'offerpagepdf.pdf';
        $msent = sendSeparateMail( 'ORDER PLACED: ', $curtime, $ml2, $userid, $cc = '', $attachment );
        $msent = sendSeparateMail( 'ORDER PLACED: ', $curtime, $ml, GROUPEMAILID, $cc = '' );
        if ( $msent ) {
            $data = array( 'msg'=>'1' );
        } else {
            $data = array( 'msg'=>'Please contact to administrator.' );
        }
        return $data;
    }
    $dbio->closeConn( $dbconn );
}

function orderConfirmMailFormat( $row, $prdata, $docflag, $heading ) {
    $ml = '<html>';
    $ml = $ml.'<body>';
    $ml = $ml."
            <div style='width: 100%; max-width: 800px; margin: auto;'>
                <div class='maindiv' style='padding: 15px; color: white;background-color:#2f2e7e;'>
                    <div style='text-align: center; background-color: white;'>
                    <img src='https://zenithglobal.com.my/img/logo.png' alt='' />
                    <h3 style='color: black;'>Zenith is Authorized Dealer Cat- II Foreign Exchange Company and amongst the Top 3 in the country</h3>
                    </div>
                    <div style='margin-top: 10px'>
                    <p>".$heading."</p>
                    <h3 style='margin-top: 15px;'>Order Details:</h3>
                    <table width='100%' style='color: black;border: 1px solid; background-color: white;'>
                        <tbody style='text-align: center;'>
                        <tr>
                            <th>Order Number</th>
                            <th>Reference No</th>
                            <th>Product</th>
                            <th>Order Type</th>
                            <th>Date</th>
                        </tr> ";
    if ( $row[ 5 ] == 'buy' ) {
        if ( $row[ 7 ] != '' and $row[ 11 ] != '' ) {
            $ml = $ml."<tr>
                                <td>".$row[ 3 ]."</td>
                                <td>".$row[ 4 ]."</td>
                                <td>".$row[ 7 ]."</td>
                                <td>".$row[ 5 ]."</td>
                                <td>".$row[ 6 ]."</td>
                            </tr>
                            <tr>
                                <td>".$row[ 3 ]."</td>
                                <td>".$row[ 4 ]."</td>
                                <td>".$row[ 11 ]."</td>
                                <td>".$row[ 5 ]."</td>
                                <td>".$row[ 6 ]."</td>
                            </tr>
                            ";
        } else if ( $row[ 7 ] == '' ) {
            $ml = $ml."<tr>
                                <td>".$row[ 3 ]."</td>
                                <td>".$row[ 4 ]."</td>
                                <td>".$row[ 11 ]."</td>
                                <td>".$row[ 5 ]."</td>
                                <td>".$row[ 6 ]."</td>
                            </tr> ";
        } else if ( $row[ 11 ] == '' ) {
            $ml = $ml."<tr>
                                <td>".$row[ 3 ]."</td>
                                <td>".$row[ 4 ]."</td>
                                <td>".$row[ 7 ]."</td>
                                <td>".$row[ 5 ]."</td>
                                <td>".$row[ 6 ]."</td>
                            </tr> ";

        }
    } else {
        $ml = $ml."<tr>
                                <td>".$row[ 3 ]."</td>
                                <td>".$row[ 4 ]."</td>
                                <td>".$row[ 7 ]."</td>
                                <td>".$row[ 5 ]."</td>
                                <td>".$row[ 6 ]."</td>
                            </tr> ";
    }

    $ml = $ml."
                    </tbody>
                    </table>
                    <h3 style='margin-top: 35px;'>TRAVELLER/ REMITTER DETAILS:</h3>
                    <table width='100%' style='color: black;border: 1px solid; background-color: white;'>
                        <tbody style='text-align: left;'>
                            <tr>
                                <th>Traveller/Remitter name</th>
                                <th>Email ID</th>
                                <th>Contact Number</th>
                            </tr>
                            <tr>
                                <td style='border-bottom: 1px solid;'>".$row[ 0 ]."</td>
                                <td style='border-bottom: 1px solid;'>".$row[ 1 ]."</td>
                                <td style='border-bottom: 1px solid;'>".$row[ 2 ]."</td>
                            </tr>
                            <tr>
                                <th colspan='2'>Address</th>
                                <th>Location</th>
                            </tr>
                            <tr> ";
    if ( $row[ 23 ] == 'door-delivery' ) {
        $ml = $ml."<td colspan='2'>".$row[ 20 ].'</td> ';
    } else {
        $ml = $ml."<td colspan='2'>".$row[ 22 ].'</td> ';
    }
    $ml = $ml.'<td>'.$row[ 21 ]."</td>
                            </tr>
                            </tbody>
                    </table>
                    <h3 style='margin-top: 35px;'>TRANSACTIONAL DETAILS:</h3>
                    <table width='100%' style='color: black;border: 1px solid; background-color: white;'>
                    <tbody style='text-align: left;'>
                        <tr>
                            <th>Purpose</th>
                            <th>Delivery Mode</th>
                            <th>Payment type</th> ";
    if ( $row[ 26 ] == 1 and $row[ 27 ] != 0 ) {
        $ml = $ml.' <th>Payment Paid</th>';
    }
    $ml = $ml."</tr>
                        <tr>
                            <td>".$row[ 19 ]."</td>
                            <td>".$row[ 23 ].'</td> ';
    if ( $row[ 24 ] == 'COD' ) {
        $ml = $ml.'<td>Others</td> ';
    } else if ( $row[ 24 ] == 'PP' ) {
        $ml = $ml.'<td>Partial Payment(2%)</td> ';
    } else if ( $row[ 24 ] == 'FP' ) {
        $ml = $ml.'<td>Full Payment</td> ';
    } else {
        $ml = $ml.'<td>'.$row[ 24 ].'</td> ';
    }
    if ( $row[ 26 ] == 1 and $row[ 27 ] != 0 ) {
        $ml = $ml.' <td><b>'.$row[ 27 ].'</b></td>';
    }
    $ml = $ml."</tr>
                    </tbody>
                    </table>
                    <table style='color: black;margin-top: 30px; background-color: white;' border='1' cellspacing='0' width='100%'>
                        <tbody style='text-align: left;'>
                            <tr>
                                <th>Product</th>
                                <th>Currency</th>
                                <th>Forex Amount</th>
                                <th>Customer Rate</th>
                                <th style='text-align: right;'>Sub-Total (INR)</th>
                            </tr> ";
    for ( $i = 0; $i < count( $prdata );
    $i++ ) {
        $ml = $ml."<tr>
                                            <td>".$prdata[ $i ][ 'lp_producttype' ]."</td>
                                            <td>".$prdata[ $i ][ 'lp_isd' ]."</td>
                                            <td>".$prdata[ $i ][ 'lp_quantity' ]."</td>
                                            <td>".$prdata[ $i ][ 'lp_rateofexchange' ]."</td>
                                            <td><strong style='float:right;'>".$prdata[ $i ][ 'lp_totalamt' ]."</strong></td>
                                        </tr>";
    }
    // if ( $row[ 7 ] != '' and $row[ 11 ] != '' ) {
    //     $ml = $ml."<tr>
                            //         <td>".$row[ 7 ]."</td>
                            //         <td>".$row[ 8 ]."</td>
                            //         <td>".$row[ 9 ]."</td>
                            //         <td>".$row[ 10 ]."</td>
                            //         <td><strong style='float:right;'>".$row[ 9 ]*$row[ 10 ]."</strong></td>
                            //     </tr>
                            //     <tr>
                            //         <td>".$row[ 11 ]."</td>
                            //         <td>".$row[ 12 ]."</td>
                            //         <td>".$row[ 13 ]."</td>
                            //         <td>".$row[ 14 ]."</td>
                            //         <td><strong style='float:right;'>".$row[ 13 ]*$row[ 14 ]."</strong></td>
                            //     </tr>
                            //     ";
    // } else if ( $row[ 7 ] == '' and $row[ 11 ] != '' ) {
    //     $ml = $ml."<tr>
                            //         <td>".$row[ 11 ]."</td>
                            //         <td>".$row[ 12 ]."</td>
                            //         <td>".$row[ 13 ]."</td>
                            //         <td>".$row[ 14 ]."</td>
                            //         <td><strong style='float:right;'>".$row[ 13 ]*$row[ 14 ]."</strong></td>
                            //     </tr> ";
    // } else {
    //     $ml = $ml."<tr>
                            //         <td>".$row[ 7 ]."</td>
                            //         <td>".$row[ 8 ]."</td>
                            //         <td>".$row[ 9 ]."</td>
                            //         <td>".$row[ 10 ]."</td>
                            //         <td><strong style='float:right;'>".$row[ 9 ]*$row[ 10 ]."</strong></td>
                            //     </tr> ";
    // }
    $ml = $ml."<tr>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>Service Charge -<strong style='float:right;'>".$row[ 16 ]."</strong></td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>GST -<strong style='float:right;'>".$row[ 15 ]."</strong></td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>Nostro Charge -<strong style='float:right;'>".$row[ 17 ]."</strong></td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td><strog>Total Amount-</strog><strong style='float:right;'>".$row[ 18 ]."</strong></td>
                            </tr>
                        </tbody>
                    </table>
                    <h3 style='margin-top: 30px;'>OTHER DETAILS:</h3>
                    <table width='100%' style='color: black;border: 1px solid; background-color: white;'>
                        <tbody style='text-align: left;'>
                            <tr>
                                
                                <th>Document Status</th>
                                <th>Visa on arrival</th>
                                <th>Order Status</th>
                            </tr>
                            <tr>";
    if ( $docflag ) {
        $ml = $ml.'<td>Uploaded</td>';
    } else {
        $ml = $ml.'<td>Pending</td>';
    }
    $ml = $ml."<td>YES</td>
                                <td>".$row[ 25 ]."</td>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                    <div style='margin-top: 30px;background-color: white;'>
                    <p style='color: black; padding: 15px;text-align: center; letter-spacing: 1; font-weight: bold;'>35+ Branches India| 10 Abroad office | 4Airport counter| 26+ year experience| 1000+ Team | 1 millions Happy clients</p>
                    <div style='text-align: center;'>
                    <img width='10%' src='https://www.zeneremit.com/img/zenith-e-remit.png' alt=''>
                        <img width='10%' src='https://zenithfinserv.com/img/images/logo.png' alt=''>
                    </div>
                    </div>
                </div>
            </div>";
    $ml = $ml.'</body>';
    $ml = $ml.'</html>';
    return $ml;
}

function sendSeparateMail( $title, $curtime, $ml, $email, $cc = '', $attachment = '' ) {
    require_once( 'mail_c.php' );

    $m = new Mymail();
    $msent = $m->sendMail( $title.$curtime.'', $ml, $email, $cc = '', '', '', $attachment );
    $msent = true;
    return $msent;
}

?>