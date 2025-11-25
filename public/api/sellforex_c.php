<?php

class Sell
 {

    public $msg;

    public function insertSellDetails( $dbio, $obj )
 {
        $randomid = date( 'ymdhis' );
        $ordertype = $obj->ordertype;
        $product = $obj->product;
        $currency = $obj->currency;
        $quantity = $obj->quantity;
        $rate = $obj->rate;
        $totalAmt = $obj->totalAmt;
        $taxableAmt = $obj->taxableVal;
        $gst = $taxableAmt * 0.18;
        $handlingCharge = 100;
        $amountToPay = $totalAmt - $gst - $handlingCharge;
        $roundAmt = round( $amountToPay );
        $roundFig = $roundAmt - $amountToPay;
        $userId = $obj->id;

        $sql = "UPDATE lead_order SET po_status = 'E' WHERE po_status = 'D' AND po_usersrno = " . $_SESSION[ 'userSrno' ] . ";
                INSERT INTO lead_order (po_srno, po_refno, po_ordertype, po_product, po_currency, po_quantity, po_buyrate, po_totalamt, po_date, po_sumamount, po_roundAmt, po_order_no, po_handlingcharge, 
                po_CGST, po_SGST, po_IGST, po_taxableval, po_status, po_travelpurpose, po_traveldate, po_usersrno, po_product_2, po_card_currency, po_card_buyrate, po_card_quantity, po_round, po_location, po_manuallead, po_leadsource)
                SELECT (SELECT COALESCE( MAX(po_srno),0)+1 FROM lead_order) AS srno, CONCAT('ZFX/', (SELECT COALESCE( MAX(po_srno),0)+1 FROM lead_order)),'" . $ordertype . "', '" . $product . "', '" . $currency . "',
                 '" . $quantity . "', '" . $rate . "', '" . $totalAmt . "',  now(), " . $amountToPay . ", '" . $roundAmt . "', CONCAT('" . $randomid . "',
                 '/', (select user_srno from user_login where user_id = '" . $userId . "')), " . $handlingCharge . ', ' . $gst . ', ' . $gst . ', ' . $gst . ", 
                '" . $taxableAmt . "', 'D', '', '', (SELECT user_srno FROM user_login WHERE user_id = '" . $userId . "'), '', '', 0, 0, " . $roundFig . ', ' . $obj->loc . ', 0, 2';
        $dbconn = $dbio->getConn();
        $result = $dbio->batchQueries( $dbconn, $sql );
        $dbio->closeConn( $dbconn );
        $this->msg = 'Added';
        //add sell currency in lead_product table
        $dbconn = $dbio->getConn();
        $query = "INSERT INTO lead_product (lp_srno, lp_orderno, lp_travellernum, lp_isd, lp_producttype, lp_quantity, lp_rateofexchange, lp_totalamt, lp_sumtotalamount, lp_timestamp)
                      SELECT (SELECT MAX(lp_srno) + 1 FROM lead_product), CONCAT('" . $randomid . "', '/', '" . $_SESSION[ 'userSrno' ] . "'),
                       '1', '" . $currency . "', 'CN', " . $quantity . ', ' . $rate . ', ' . $totalAmt . ",
                        " . $amountToPay . ', now()';
        $res = $dbio->getSelect( $dbconn, $query );

        date_default_timezone_set( 'Asia/Kolkata' );
        $curtime = date( 'd-m-Y H:i:s' );
        // $email = 'himanshu.tomar@zenithforex.com';
        $email = 'online.manager@zenithforex.com';
        $query = "SELECT user_id, user_name, user_mobile FROM user_login WHERE user_id = '" . $userId . "'";
        $result = $dbio->getSelect( $dbconn, $query );
        if ( $result ) {
            $row = mysqli_fetch_row( $result );
            $ml = '<html>';
            $ml = $ml . '<body>';
            $ml = $ml . "New Lead from zenithglobal.com.my <br>
                    User Name: '" . $row[ 1 ] . "' <br> 
                    User Email: '" . $row[ 0 ] . "' <br> 
                    User Phone: '" . $row[ 2 ] . "' <br>
                    Order Type: SELL <br>
                    Currency: '" . $currency . "' <br>
                    Quantity: '" . $quantity . "' <br>
                    <b> Thanks & Regards <br> Administrator </b>";
            $ml = $ml . '</body>';
            $ml = $ml . '</html>';
            require_once ( 'mail_c.php' );
            $m = new Mymail();
            $msent = $m->sendMail( 'zenithglobal.com.my Lead: ' . $curtime . '', $ml, GROUPEMAILID, '', '', '' );
            $msent = true;
            if ( $msent ) {
                $this->data = array( 'msg' => '1', 'orderno'=>$randomid.'/'.$_SESSION[ 'userSrno' ] );
            } else {
                $this->data = array( 'msg' => 'Please contact to administrator.' );
            }
        }
        $dbio->closeConn( $dbconn );
    }

    public function insertForexDetails( $dbio, $obj, $productArray, $orderno, $sumamount )
 {
        $name = $obj->name;
        $idtype = $obj->idtype;
        $idNum = $obj->idNum;
        $dob = $obj->dob;
        $nationality = $obj->nationality;
        $gst = $obj->taxableVal * 0.18;
        $amountToPay = ( $sumamount * 1 ) - $gst - 100;
        $query = 'UPDATE lead_order SET po_CGST=' . $gst . ', po_SGST=' . $gst . ', po_IGST=' . $gst . ', po_taxableval=' . $obj->taxableVal . "
                  , po_sumamount=" . $amountToPay . ', po_roundAmt=' . round( $amountToPay ) . ', po_totalamt = ' . $sumamount . "
                  WHERE po_order_no = '" . $orderno . "'";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect( $dbconn, $query );
        $dbio->closeConn( $dbconn );

        $sql = "DELETE FROM lead_traveller WHERE lt_ordertype='sell' AND lt_orderno = '" . $orderno . "';
                INSERT INTO lead_traveller (lt_srno, lt_orderno, lt_title, lt_name, lt_mobile, lt_email, lt_pancard, lt_timestamp, lt_idtype, lt_idnum, lt_ordertype, lt_nationality,lt_dob)
                VALUES ((SELECT po_srno FROM lead_order WHERE po_order_no = '" . $orderno . "'),'" . $orderno . "', '',
                '" . $name . "', '', '', '',  now(), '" . $idtype . "', UPPER('" . $idNum . "'), 'sell', '" . $nationality . "','" . $dob . "')";
        $dbconn = $dbio->getConn();
        $result = $dbio->batchQueries( $dbconn, $sql );
        $dbio->closeConn( $dbconn );

        $que = "DELETE FROM lead_product WHERE lp_orderno = '" . $orderno . "'";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect( $dbconn, $que );
        foreach ( $productArray as $value ) {
            $query = "INSERT INTO lead_product (lp_srno, lp_orderno, lp_travellernum, lp_isd, lp_producttype, lp_quantity, lp_rateofexchange, lp_totalamt, lp_sumtotalamount, lp_timestamp)
                      VALUES ((SELECT po_srno FROM lead_order WHERE po_order_no = '" . $orderno . "'),'" . $orderno . "', '" . $value->traveller . "', '" . $value->currencyOpt . "', '" . $value->productType . "'
                    , " . $value->forexQuant . ', ' . $value->rate . ', ' . $value->total . ', ' . $amountToPay . ', now())';
            $res = $dbio->getSelect( $dbconn, $query );
        }
        $dbio->closeConn( $dbconn );

        $this->msg = 'Inserted';
    }

    public function insertSellDelivery( $dbio, $obj )
 {
        // if ( $obj->paymentMode == 'PP' or $obj->paymentMode == 'FP' ) {
        //     $sql = "DELETE FROM master_account_details WHERE ac_orderno = '".$obj->orderno."';
        //             INSERT INTO master_account_details (ac_srno, ac_paymentmode, ac_bankname, ac_bankaccnum, ac_isverified, ac_timestamp, ac_orderno, ac_ordertype)
        //             SELECT (SELECT COALESCE( MAX(ac_srno),0)+1 FROM master_account_details) AS ac_srno, '".$obj->paymentMode."', '".$obj->clientBank."', '".$obj->clientAccount."'
        //             , 0, now(), '".$obj->orderno."', 'sell'";
        //             $dbconn = $dbio->getConn();
        //             $result = $dbio->batchQueries( $dbconn, $sql );
        //             $dbio->closeConn( $dbconn );
        //             $this->status = 1;
        // } else if ( $obj->paymentMode == 'COD' ) {
        //     $sql = "DELETE FROM master_account_details WHERE ac_orderno = '".$obj->orderno."'";
        //     $dbconn = $dbio->getConn();
        //     $result = $dbio->getSelect( $dbconn, $sql );
        //     $dbio->closeConn( $dbconn );
        // }

        $sql = "UPDATE lead_order SET po_paymenttype = 'COD' WHERE po_order_no = '" . $obj->orderno . "'";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect( $dbconn, $sql );
        $dbio->closeConn( $dbconn );
        if ( $obj->mode == 'door-delivery' or $obj->mode == 'pickup-from-branch' ) {
            $sql = "DELETE FROM lead_delivery WHERE ld_orderno = '" . $obj->orderno . "';
                    INSERT INTO lead_delivery (ld_orderno ,ld_deliverymode, ld_address, ld_city, ld_state, ld_country, ld_branchaddress, ld_branchname, ld_timestamp)
                    VALUES ('" . $obj->orderno . "',  '" . $obj->mode . "', '" . $obj->deliveryAdd . "','" . $obj->deliveryCity . "', '" . $obj->deliveryState . "', '" . $obj->deliveryCountry . "'
                    , '" . $obj->branchAdd . "', '" . $obj->branchName . "', now())";
            $dbconn = $dbio->getConn();
            $result = $dbio->batchQueries( $dbconn, $sql );
        } else {
            $sql = "DELETE FROM lead_delivery WHERE ld_orderno = '" . $obj->orderno . "';
                    INSERT INTO lead_delivery (ld_orderno ,ld_deliverymode, ld_address, ld_city, ld_state, ld_country, ld_branchaddress, ld_branchname, ld_timestamp)
                    VALUES ('" . $obj->orderno . "', 
                    '" . $obj->mode . "', '" . $obj->expressDeliveryAdd . "','" . $obj->expressDeliveryCity . "', '" . $obj->expressDeliveryState . "', '" . $obj->expressDeliveryCountry . "'
                    , '', '', now())";
            $dbconn = $dbio->getConn();
            $result = $dbio->batchQueries( $dbconn, $sql );
        }
        $dbio->closeConn( $dbconn );
        $this->msg = 'Inserted!';
    }

    public function getAllSellDetails( $dbio, $userId, $orderno )
 {
        $traveller = array();
        $product = array();
        $header = array();
        $query = "SELECT lt_name,lt_idtype, lt_idnum, lt_nationality  FROM lead_traveller WHERE lt_orderno ='" . $orderno . "'";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect( $dbconn, $query );
        if ( $result ) {
            while ( $row = mysqli_fetch_assoc( $result ) ) {
                $traveller[] = $row;
            }
        }
        $dbio->closeConn( $dbconn );

        $qry = "SELECT lp_travellernum, lp_isd, lp_producttype, lp_quantity, lp_rateofexchange, lp_totalamt, lp_sumtotalamount, isd_name FROM lead_product
                LEFT OUTER JOIN master_isd ON lp_isd = isd_code
                WHERE lp_orderno ='" . $orderno . "'";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect( $dbconn, $qry );
        if ( $result ) {
            while ( $row = mysqli_fetch_assoc( $result ) ) {
                $product[] = $row;
            }
        }
        $dbio->closeConn( $dbconn );

        $qry = "SELECT po_order_no, po_promocode, po_ordertype, ld_deliverymode, ld_address, ld_city, ld_branchname, ld_branchaddress, po_paymenttype
                FROM lead_order 
                LEFT OUTER JOIN lead_delivery  ON po_order_no  = ld_orderno
                WHERE po_order_no = '" . $orderno . "'";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect( $dbconn, $qry );
        if ( $result ) {
            while ( $row = mysqli_fetch_assoc( $result ) ) {
                $header[] = $row;
            }
        }
        $dbio->closeConn( $dbconn );
        return array( 'traveller' => $traveller, 'product' => $product, 'header' => $header );
    }

}

?>