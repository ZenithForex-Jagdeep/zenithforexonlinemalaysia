import Footer from "../Footer"
import Services_form from "../Services_form"
import Services_form1 from "../Services_form1"
// ../css/main.css
import "../../css/main.css";

function EnquiryForm() {

    return (
        <div div style={{display:'flex',flexDirection:'column'}}>
            <div className="header_row" style={{margin:"auto"}}>
                <span style={{ cursor: "pointer" }}>
                    <img className="img-fluid logo" src="../img/logo.png" alt="img" loading="lazy" />
                </span>
            </div>
            <div style={{ paddingInline: '30%' }}><Services_form1 /></div>
            {/* <Footer /> */}
        </div>
    )
}
export default EnquiryForm;