import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import * as Common from './Common'
import { MetaTags } from "react-meta-tags";


function Footer_privacy() {
  const [metaTag, setMetaTag] = useState({
    "id": 0,
    "page": "",
    "title": "",
    "description": "",
    "url": "",
    "keywords": ""
  })
  useEffect(() => {
    Common.getMetaTagsById('Privacy Policy Page', setMetaTag);
  })
  return (
    <>
      <MetaTags>
        <title>{metaTag?.title}</title>
        <meta name="description" content={metaTag?.description} />
        <meta name="Keywords" content={metaTag?.keywords} />
        <link rel="canonical" href="https://www.zenithglobal.com.my/privacy-policy" />
      </MetaTags>
      <Header />
      <div className="p-2 mb-4 footer_header">
        <div className="container">
          <h3>PRIVACY POLICY</h3>
        </div>
      </div>
      <div className="container about-det padd-30">
        <div className="col-md-12 about-content">
          <p>&nbsp;</p>
          <p>
            Zenith Leisure Holidays Ltd (ZLHL) isan AD Cat II licensed by
            Reserve Bank of India &nbsp;recognizes the expectations of its
            customers with regard to privacy, confidentiality and security of
            their personal information that resides with us. Keeping personal
            information of customers secure and using it solely for activities
            related to us and preventing any misuse thereof is a top priority.
          </p>
          <p>
            <strong>Definitions</strong>
          </p>
          <p>
            &nbsp;”Personal information” means any information that relates to a
            natural person, which either directly or indirectly, in combination
            with other information available or likely to be available with us,
            is capable of identifying such person.
          </p>
          <p>
            <strong>Applicability</strong>
          </p>
          <p>
            This Policy is applicable to personal information and sensitive
            personal data or information collected by ZLHL directly from the
            customer or through the online portal.
          </p>
          <p>
            <strong>
              Purpose of Collection and Use of Personal Information
            </strong>
          </p>
          <p>
            ZLHL collects and uses the financial information and other personal
            information from its customers. This information is collected and
            used for specific business purposes or for other related purposes
            designated by ZLHL or for a lawful purpose to comply with the
            applicable laws and regulations. ZLHL shall not divulge any personal
            information collected from the customer, for cross selling or any
            other purposes.
          </p>
          <p>
            The authenticity of the personal information provided by the
            customer shall not be the responsibility of the ZLHL
          </p>
          <p>
            <strong>Disclosure of Personal Information</strong>
          </p>
          <p>
            The personal information collected by ZLHL shall not be disclosed to
            any other organization except:
          </p>
          <ol>
            <li>
              where the disclosure has been agreed in a written contract or
              otherwise between ZLHL and the customer;
            </li>
            <li>
              where the disclosure has been agreed in a written contract or
              otherwise between ZLHL and the customer;
            </li>
            <li>
              whereZLHL is required to disclose the personal information to a
              third party on a need-to-know basis and shall keep the same
              standards of information/ data security as that of ZLHL.
            </li>
            <li>
              <strong>
                <u>
                  <i>
                    Where ZLHL is required to submit data to any regulatory
                    authority or any government authority appointed by
                    Government of India.
                  </i>
                </u>
              </strong>
            </li>
          </ol>
          <p>
            <strong>Reasonable Security Practices and Procedures</strong>
          </p>
          <p>
            ZLHL maintains its security systems to ensure that the personal
            information of the customer is appropriately protected and follows
            the extant standard encryption norms followed for the transmission
            of information. ZLHL ensures that its employees and affiliates
            respect the confidentiality of any personal information heldbyZLHL.
            <strong>
              <i>
                <u>
                  All documentations being collected as a part of Due Diligence
                  measures are then audited by Concurrent Auditors on monthly
                  basis and should there be any pendency ZLHL may contact the
                  Customer for completion of the same.
                </u>
              </i>
            </strong>
          </p>
          <p>
            <strong>Contact Information</strong>
          </p>
          <p>
            In order to address any discrepancies or grievances related to the
            personal information residing with ZLHL would be mailed to{" "}
            <a href="mailto:feedback@zenithforex.com">
              feedback@zenithforex.com
            </a>{" "}
            for a reply within 24 hrs.
          </p>
          <p>
            <strong>Notice of change</strong>
          </p>
          <p>
            ZLHL may, from time to time, change this Policy. The effective date
            of this Policy, as stated below, indicates the last time this Policy
            was revised or materially changed.
          </p>
          <p>
            <strong>Cookie policy&nbsp;</strong>
          </p>
          <p>
            ZLHL’s digital platforms use various third
            party&nbsp;services&nbsp;to promote its products and services.
            These&nbsp;third party services&nbsp;use cookies which are
            downloaded to your device when you visit a website in order to
            provide a personalized browsing experience. Cookies are used for
            lots of tasks like remembering your preferences &amp;settings,
            provide personalized browsing experience and analyze site
            operations. These cookies collect information about how users use a
            website, for instance, how often visited pages. All information
            collected by third party cookies is aggregated and anonymous. By
            using our website user/s agree that these types of cookies can be
            placed on his/her device. User/s is free to disable/delete these
            cookies by changing his/her device / browser settings. ZLHL is not
            responsible for cookies placed in the device of user/s by any other
            website and information collected thereto.
          </p>
          <h5>Use of Information and Materials</h5>
          <p>
            The information and materials contained in these pages - and the
            terms, conditions, and descriptions that appear - are subject to
            change. Not all products and services are available in all
            geographic areas. Your eligibility for particular products and
            services is subject to final ZLHL determination and acceptance.
          </p>
          <h5>No Warranty</h5>
          <p>
            The information and materials contained in this site, including
            text, graphics, links or other items - are provided "as is," "as
            available". ZLHL does not warrant the accuracy, adequacy or
            completeness s of this information and materials and expressly
            disclaims liability for errors or omissions in this information and
            materials. No warranty of any kind, implied, express or statutory,
            including but not limited to the warranties of non-infringement of
            third party rights, title, merchantability, fitness for a particular
            purpose and freedom from computer virus, is given in conjunction
            with the information and materials.
          </p>
          <h5>Submissions</h5>
          <p>
            All information submitted to ZLHL via this site shall be deemed and
            remain the property of ZLHL.ZLHL shall be free to use, for any
            purpose, any ideas, concepts, know-how or techniques contained in
            information a visitor to this site. ZLHL shall not be subject to any
            obligations of confidentiality regarding submitted information
            except as agreed by the ZLHL, entity having the direct customer
            relationship or as otherwise specifically agreed or required by law.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Footer_privacy;
