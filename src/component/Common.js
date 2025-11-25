var msgModel = [];
msgModel['ERR0000'] = 'Unidentified Error. Please contact to administrator';
msgModel['MSG0006'] = 'Please fill mandatory fields.';

export const getMessage = (key) => {
    return msgModel[key];
}

//export const appType = 1;
export const appType = 2;

function replaceSpecialChar(getString) {
    if (typeof getString != "number" && getString != null) {
        getString = getString.replace(/\#/g, "^^hash^^");
        getString = getString.replace(/\+/g, "^^plus^^");
        getString = getString.replace(/\%/g, "^^mod^^");
        getString = getString.replace(/\&amp;/g, "^^and^^");
        getString = getString.replace(/\&/g, "^^and^^");
        getString = getString.replace(/\=/g, "^^equal^^");
    }
    return getString;
}

function isLocalHost() {
    return window.location.hostname === 'localhost';
}

export const paymentGateway = (prm, gateway) => {
    var url = "";
    if (!isLocalHost()) {
        if (gateway === "CASHFREE") url = "https://www.zenithglobal.com.my/api/paynow_1.php?d=" + prm;
        else if (gateway === "RAZORPAY") url = "https://www.zenithglobal.com.my/api/paynow_rp.php?d=" + prm;
    } else {
        if (gateway === "CASHFREE") url = "http://localhost:8005/api/paynow_1.php?d=" + prm;
        else if (gateway === "RAZORPAY") url = "http://localhost:8005/api/paynow_rp.php?d=" + prm;
    }
    return url;
}

// CONVERA variable start
const isConveraLive = sessionStorage.getItem('live');
console.log(typeof isConveraLive);
console.log(isConveraLive);

let CONVERAID;
let CONVERASECRET;
let CONVERASRC;
let converaPaymentTrackerURL;
if (isConveraLive == 'true') {
    CONVERASRC = "https://paymentmodule.convera.com/static/js/main.js";
    converaPaymentTrackerURL = "https://students.convera.com/#!/tracking";
    CONVERAID = "c4cc451d6cad46aab3939093ba8631ae";
    CONVERASECRET = "e3d8a242a7b54dc5884895bcbcbb14a1";
} else {
    CONVERASRC = "https://sandbox-uat.spm.convera.com/static/js/main.js";
    converaPaymentTrackerURL = "https://uat.students.convera.com/#!/tracking";
    CONVERAID = "85a9f788e6d449df8f6d03648b7c2706"; // You may want to change this if there's a different sandbox ID
    CONVERASECRET = "bd41618292dc44d6a949cb7ec0f45188"; // Same here
}
// Export after setting
export { CONVERASRC, converaPaymentTrackerURL, CONVERAID, CONVERASECRET };
// CONVERA variable end


export const apiBasePath = "";
export const apiRegisterOrLogin = apiBasePath + "/api/login_a.php";
export const apiCountry = apiBasePath + "/api/country.php";
export const apiGetCurrency = apiBasePath + "/api/currency_a.php";
export const apiBuyDetails = apiBasePath + "/api/buyforex_a.php";
export const apiGetLocation = apiBasePath + "/api/location_a.php";
export const apiRemitDetails = apiBasePath + "/api/remit_a.php";
export const apiSellDetails = apiBasePath + "/api/sellforex_a.php";
export const apiMaster = apiBasePath + "/api/master_a.php";
export const apiUploadFile = apiBasePath + "/api/upload_a.php";
export const apiGetRate = apiBasePath + "/api/rate_a.php";
export const apiCallbackRequest = apiBasePath + "/api/callback_a.php";
export const apiReloadDetails = apiBasePath + "/api/reload_a.php";
export const apiRight = apiBasePath + "/api/right_a.php";
export const apiAddEditRight = apiBasePath + "/api/allrights_a.php";
export const apiPurpose = apiBasePath + "/api/purpose_a.php";
export const apiCashfree = apiBasePath + "/api/cashfree_a.php";
export const apiOfferLead = apiBasePath + "/api/offerlead_a.php"
export const apiBlogs = apiBasePath + "/api/blog_a.php";
export const apiGallery = apiBasePath + "/api/gallery_a.php";
export const apiCareer = apiBasePath + "/api/career_a.php";
export const apiAsego = apiBasePath + "/api/asego_a.php";
export const apiMisUpload = apiBasePath + "/api/misupload_a.php";
export const apiDocument = apiBasePath + "/api/document_a.php";
export const apiTieup = apiBasePath + "/api/tieup_a.php";
export const apiReport = apiBasePath + "/api/report_a.php";
export const apiDashboard = apiBasePath + "/api/dashboard_a.php";
export const apiMisBudget = apiBasePath + '/api/misbudget_a.php';
export const apiUser = apiBasePath + "/api/user_a.php";
export const apiModule = apiBasePath + "/api/module_a.php";
export const apiThirdParty = apiBasePath + "/api/thirdparty_a.php";
export const apiAutoMail = apiBasePath + "/api/shootmail_a.php";
export const apiCorpPayment = apiBasePath + "/api/corppayment_a.php";
export const apiReconciliationActivity = apiBasePath + '/api/reconciliation_activity_a.php';
export const apiConveyance = apiBasePath + '/api/conveyance_a.php';
export const apiPicklist = apiBasePath + '/api/picklist_a.php';
export const apiGetConveyanceRate = apiBasePath + '/api/conveyance_rate_a.php';
export const apiConvera = apiBasePath + "/api/convera_a.php";
export const liveSetup = apiBasePath + "/api/liveSetup_a.php";
export const apiCorporateRate = apiBasePath + "/api/corporate_rate_a.php";
export const apiMetaTags = apiBasePath + "/api/metaTags_a.php";
export const metaTagsJson = apiBasePath + "./metaTags.json";




//TCS Details
export const GST_RATE = .18;
export const TCS_RATE = 20;
export const SERVICE_CHARGE = 100;
export const TCS_THRESHOLD = 1000000;
export function calcTcs(purpose, sourceOfFund, isITR, earlierForex, thisForex) {
    console.log(purpose, sourceOfFund, earlierForex, thisForex);
    let tcsRate = TCS_RATE;
    const tcsThreshold = TCS_THRESHOLD;
    let tcs = 0;
    let extraForex = 0;
    let tcsTaxable = 0;
    if (earlierForex + thisForex > tcsThreshold) {
        // MEDICAL TREATMENT ABROAD(6), OVERSEAS EDUCATION(3)
        if (purpose == 6 || purpose == 3) {
            if (sourceOfFund === "L" && isITR === 'Y') {
                tcsRate = 0;
            } else {
                tcsRate = 5;
            }
        }
        extraForex = earlierForex + thisForex - tcsThreshold;
        console.log("extraForex:", extraForex);
        if (extraForex <= thisForex) {
            tcsTaxable = extraForex;
        } else {
            tcsTaxable = thisForex;
        }
        console.log("tcsTaxable:", tcsTaxable);
        tcs = Math.round((tcsTaxable * tcsRate / 100) * 100) / 100; // round to 2 decimals
        console.log("tcs:", tcs);
    }
    return tcs;
}






export const buildMessageFromArray = (prm) => {
    var msg = "", i = 0;
    if (typeof (prm) != "undefined") {
        for (; i < prm.length; i++) {
            if (prm[i] !== "") {
                msg = msg + "<div class='row'><div class='col-sm-12'>" + prm[i] + "</div></div>";
            }
        }
    }
    return msg;
}


function ajaxRequest() {
    if (window.XMLHttpRequest) {
        return new XMLHttpRequest();
    }
}


export const callApi = (url, prm, Success) => {
    var prms = "";
    if (typeof prm != "undefined") {
        for (let i = 0; i < prm.length; i++) {
            if (prms.length > 0) prms = prms + "&";
            prms = prms + (i + 1) + "=" + replaceSpecialChar(prm[i]);
        }
    }
    var xhr = new ajaxRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var SessXML = xhr.responseText
                .replace(/[\r\n\s]*</g, "<")
                .replace(/[\r\n\s]*$/g, "");
            if (SessXML.search(".php") >= 0) {
                alert(SessXML);

                //$('.loader').hide();
            }
            else if (SessXML.trim() === '{"msg": "MSG0010"}') {
                let keysToRemove = ['sessionId', 'userSrno', 'userId', 'entitytype', 'active', 'name', 'orderno', 'ordertype', 'isExist'];
                keysToRemove.forEach(k =>
                    sessionStorage.removeItem(k)
                );
                sessionStorage.isSessionTimeout = "1";
                const myLoc = window.location.href.split('/');
                window.location.replace(myLoc[0] + '//' + myLoc[2] + '/login');
            }
            else {
                Success(SessXML);
            }
        }
    };
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(prms);
};

export const callApiFixed = (url, prm, Success) => {
    var prms = "";
    if (typeof prm != "undefined") {
        for (let i = 0; i < prm.length; i++) {
            if (prms.length > 0) prms = prms + "&";
            prms = prms + (i + 1) + "=" + replaceSpecialChar(prm[i]);
        }
    }
    var xhr = new ajaxRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var SessXML = xhr.responseText
                .replace(/[\r\n\s]*</g, "<")
                .replace(/[\r\n\s]*$/g, "");
            Success(SessXML);
        }
    };
    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(prms);
};

// Input field Validations
const intRegExp = new RegExp("^([0-9]+)$");
export const validateNumValue = (e, f) => {
    if (e === "" || intRegExp.test(e)) {
        if (f) {
            return f(e);
        } else {
            return e;
        }
    } else {
        return false;
    }
};

const floatRegExp = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$')
export const validateDecValue = (e, f) => {
    if (e === "" || floatRegExp.test(e)) {
        f(e);
    } else {
        return false;
    }
}

const alpRegExp = new RegExp('^([a-zA-Z ]+)$');
export const validateAlpValue = (e, f) => {
    if (e === "" || alpRegExp.test(e)) {
        if (f) {
            f(e);
        } else {
            return e;
        }
    } else {
        return false;
    }
}


const emailRegExp = new RegExp("^[a-zA-Z0-9_.-]+@[a-zA-Z0-9]+[.]+[A-Za-z]+$");
export const validtateEmail = (e, f) => {
    if (e === "" || emailRegExp.test(e)) {
        f(e);
    } else {
        f("");
    }
};

const alpNumRegExp = new RegExp('^([0-9a-zA-Z ]+)$');
export const validateAlpNumValue = (e, f) => {
    if (e === "" || alpNumRegExp.test(e)) {
        f(e);
    } else {
        return false;
    }
}

export const buildDateFormat = (v, e) => {
    var len = v.length;
    if (len === 2 || len === 5) {
        e.value = v + "/";
    }
};

export const arrayRemoveItem = (arr, key, value) => {
    if (arr.length > 0) {
        for (var i = 0; i < arr.length; ++i) {
            if (arr[i][key] === value) {
                arr.splice(i, 1);
            }
        }
    }
    return arr;
};
export const callDownloadApiPost1 = (path, method, prm, Success) => {
    //set data in the form;
    var formData = new FormData();
    for (var i = 0; i < prm.length; i++) {
        formData.append(`${i + 1}`, prm[i]);
    }
    var xhr = new XMLHttpRequest();
    xhr.open(method, path, true);
    xhr.responseType = 'blob'; // Set response type as blob to handle binary data
    xhr.onload = function () {
        if (xhr.status === 200) {
            // Create a blob from the response
            const blob = xhr.response;
            const filefound = xhr.getResponseHeader('filefound');
            // console.log(xhr.responseText);
            if (filefound === 'true') {
                // Get the filename from the Content-Disposition header
                const contentDisposition = xhr.getResponseHeader('Content-Disposition');
                console.log(contentDisposition)
                let filename = "downloaded_file.xlsx"; // Default filename
                if (contentDisposition && contentDisposition.indexOf('attachment') !== -1) {
                    const filenameMatch = contentDisposition.split("filename=");
                    // console.log(filenameMatch)
                    if (filenameMatch.length === 2) {
                        filename = filenameMatch[1];
                    }
                }
                // Create a link element to download the file
                const url = window.URL.createObjectURL(blob);
                // console.log(url)
                const link = document.createElement('a');
                // console.log(link)
                link.href = url;
                link.setAttribute('download', filename);

                // Append the link to the document and trigger click to start download
                document.body.appendChild(link);
                link.click();
                // Clean up
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                // Optionally, call success callback
                console.log(Success);
                Success && Success(JSON.stringify({ msg: "File downloaded successfully" }));
            } else {
                const reader = new FileReader();
                reader.onload = function () {
                    // const jsonResponse = JSON.parse(reader.result); // now it's a string, so we can parse
                    Success && Success(reader.result);
                };
                reader.readAsText(xhr.response); // convert blob -> text
            }
        } else {
            console.error("Error during file download: ", xhr.statusText);
        }
    };

    xhr.onerror = function () {
        console.error("Error during XMLHttpRequest");
    };
    xhr.send(formData);
}
export const uploadApi = (obj, fileId, Success) => {
    var myFile = document.getElementById(fileId);
    var files = myFile.files;
    var file = files[0];

    var formData = new FormData();
    formData.append("1", obj);
    formData.append("file", file, file.name);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", apiUploadFile, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var responseText = xhr.responseText
                .replace(/[\r\n\s]*</g, "<")
                .replace(/[\r\n\s]*$/g, "");
            if (responseText.search(".php") >= 0) {
                alert(responseText);
            } else {
                Success(responseText);
            }
            // Success('Upload complete!' + responseText);
        } else {
            Success("Upload error. Try again.");
        }
    };
    xhr.send(formData);
};


export const callDocumentViewApi = (url, prm, Success) => {
    var prms = "";
    if (typeof (prm) != "undefined") {
        for (let i = 0; i < prm.length; i++) {
            if (prms.length > 0) prms = prms + "&";
            prms = prms + (i + 1) + '=' + replaceSpecialChar(prm[i]);
        }
    }
    var xhr = new ajaxRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            Success(xhr.responseText);
        }
    }
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(prms);
}

export const callDownloadApiPost = (path, method, prm) => {
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);
    form._submit_function_ = form.submit;

    for (var i = 1; i <= prm.length; i++) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", i);
        hiddenField.setAttribute("value", prm[i - 1]);
        form.appendChild(hiddenField);
    }

    document.body.appendChild(form);
    form._submit_function_();
}


export const dateYMD = (dt) => {
    // Convert To YYYY-MM-DD
    if (dt === "" || dt === null) {
        return dt;
    } else {
        return dt.toJSON().slice(0, 10);
    }
};

export const dateDMY = (dt) => {
    // Convert to DD/MM/YYYY
    console.log(dt.toJSON());
    if (dt === "" || dt === null) {
        return dt;
    } else {
        return dt.toJSON().slice(0, 10).split("-").reverse().join("/");
    }
};

export const dateDMYStr = (dt) => {       // Convert to DD/MM/YYYY
    if (dt === "" || dt === null) {
        return dt;
    } else {
        return dt.slice(0, 10).split('-').reverse().join('/');
    }
}


export function calcGSTTaxableValue(fxamnt, totchrg) {
    var GSTTaxableValslab = [250, 60000, 100000, 1000000, 0.01, 0.005, 0.001, 1000, 5500];
    //var fxamnt = $('#txtPayFxAmnt').val() * 1;
    //var totchrg = $("#txtPayTotChrg").val() * 1;
    var policy = 2; // sessionStorage.gstpolicy * 1;
    var TaxableVal = 0;
    switch (policy) {
        case 1: // total fx and charges then calculate taxable
            if (fxamnt + totchrg > 0 && fxamnt + totchrg <= GSTTaxableValslab[2]) {
                TaxableVal = Math.round((fxamnt + totchrg) * GSTTaxableValslab[4] * 100) / 100;
            } else if (fxamnt + totchrg > GSTTaxableValslab[2] && fxamnt + totchrg <= GSTTaxableValslab[3]) {
                TaxableVal = GSTTaxableValslab[7] + Math.round((fxamnt + totchrg - GSTTaxableValslab[2]) * GSTTaxableValslab[5] * 100) / 100;
            } else if (fxamnt + totchrg > GSTTaxableValslab[3]) {
                TaxableVal = GSTTaxableValslab[8] + Math.round((fxamnt + totchrg - GSTTaxableValslab[3]) * GSTTaxableValslab[6] * 100) / 100;
            }
            break;
        case 2: // calculate taxable from fx then add charges
            if (fxamnt > 0 && fxamnt <= GSTTaxableValslab[2]) {
                TaxableVal = Math.round((fxamnt) * GSTTaxableValslab[4] * 100) / 100;
            } else if (fxamnt > GSTTaxableValslab[2] && fxamnt <= GSTTaxableValslab[3]) {
                TaxableVal = GSTTaxableValslab[7] + Math.round((fxamnt - GSTTaxableValslab[2]) * GSTTaxableValslab[5] * 100) / 100;
            } else if (fxamnt > GSTTaxableValslab[3]) {
                TaxableVal = GSTTaxableValslab[8] + Math.round((fxamnt - GSTTaxableValslab[3]) * GSTTaxableValslab[6] * 100) / 100;
            }

            break;
        case 3: // calculate taxable only from fx
            if (fxamnt > 0 && fxamnt <= GSTTaxableValslab[2]) {
                TaxableVal = Math.round((fxamnt) * GSTTaxableValslab[4] * 100) / 100;
            } else if (fxamnt > GSTTaxableValslab[2] && fxamnt <= GSTTaxableValslab[3]) {
                TaxableVal = GSTTaxableValslab[7] + Math.round((fxamnt - GSTTaxableValslab[2]) * GSTTaxableValslab[5] * 100) / 100;
            } else if (fxamnt > GSTTaxableValslab[3]) {
                TaxableVal = GSTTaxableValslab[8] + Math.round((fxamnt - GSTTaxableValslab[3]) * GSTTaxableValslab[6] * 100) / 100;
            }
            break;
    }
    if (TaxableVal < GSTTaxableValslab[0])
        TaxableVal = GSTTaxableValslab[0];
    if (TaxableVal > GSTTaxableValslab[1])
        TaxableVal = GSTTaxableValslab[1];
    if (policy == 2) {
        TaxableVal += totchrg;
    }
    return (Math.round(TaxableVal * 100) / 100);
}

const panRegExp = new RegExp("^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$");
export const validatePan = (e) => {
    e = e.toUpperCase();
    var letter4_valid = /([A,B,C,F,G,H,J,L,P,T])/;
    var letter4 = e.substring(3, 4);
    if ((e === "" || panRegExp.test(e)) && letter4_valid.test(letter4)) {
        return e;
    } else {
        return "";
    }
};

export const validatePan2 = (e, f) => {
    e = e.toUpperCase();
    var letter4_valid = /([A,B,C,F,G,H,J,L,P,T])/;
    var letter4 = e.substring(3, 4);
    if ((e === "" || panRegExp.test(e)) && (letter4_valid.test(letter4))) {
        f(e);
    } else {
        f("");
    }
}

export const validateAlpNumVal = (e) => {
    if (e === "" || alpNumRegExp.test(e)) {
        return e;
    } else {
        return e.slice(0, -1);
    }
}


export function capitalizeEveryWord(str) {
    let words = str.split(" ");
    let capitalizedWords = words.map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    });
    return capitalizedWords.join(" ");
}

export const validateAlpVal = (e) => {
    if (e === "" || alpRegExp.test(e)) {
        return e;
    } else {
        return e.slice(0, -1);
    }
}


export const getRandomString = (x = 20) => {
    var a = (Math.random() + 1).toString(36).substring(2);
    var b = (Math.random() + 1).toString(36).substring(2);
    return (a + b).substring(0, x);
}

const alpNumSplRegExp = new RegExp('^([0-9a-zA-Z/-_!@$^*()#%& ]+)$');
export const validateAlpNumSplValue = (e, f) => {
    if (e === "" || alpNumSplRegExp.test(e)) {
        f(e);
    } else {
        return false;
    }
}

export const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

    if (!regex.test(password)) {
        if (password.length < 8) {
            return "Password must be at least 8 characters long.";
        }
        if (!/[A-Z]/.test(password)) {
            return "Password must contain at least one uppercase letter.";
        }
        if (!/[a-z]/.test(password)) {
            return "Password must contain at least one lowercase letter.";
        }
        if (!/\d/.test(password)) {
            return "Password must contain at least one number.";
        }
    }
    return ""; // No error
};

const getMetaTagList = async () => {
    let list = [];
    try {
        const response = await fetch(metaTagsJson);
        const data = await response.json();
        console.log(data)
        list = data; // Assuming data is directly the array of meta tags
    } catch (error) {
        console.error("Error fetching meta tags from JSON file:", error);
    }
    return list;
}

export const getMetaTagsById = async (id, setMetaTags) => {
    const list = await getMetaTagList();
    console.log(id)
    console.log(list)
    let metaTag = list.find((item) => item.page === id);
    console.log(metaTag)
    if (metaTag) {
        setMetaTags(metaTag);
    } else {
        setMetaTags({
            "id": 0,
            "page": "",
            "title": "",
            "description": "",
            "url": "",
            "keywords": ""
        })
    }
}

export function formatCity(name) {
    return name
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}