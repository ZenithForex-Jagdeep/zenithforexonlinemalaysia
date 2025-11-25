import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { MetaTags } from "react-meta-tags";
import * as Common from './Common'


function Footer_termsuse() {
  const [metaTag, setMetaTag] = useState({
    "id": 0,
    "page": "",
    "title": "",
    "description": "",
    "url": "",
    "keywords": ""
  })
  useEffect(() => {
    Common.getMetaTagsById('Terms of Use Page', setMetaTag);
  })
  return (
    <>
      <MetaTags>
        <title>{metaTag?.title}</title>
        <meta name="description" content={metaTag?.description} />
        <meta name="Keywords" content={metaTag?.keywords} />
        <link rel="canonical" href="https://www.zenithglobal.com.my/terms-of-use" />
      </MetaTags>
      {/* <MetaTags>
        <link rel="canonical" href="https://www.zenithglobal.com.my/terms-of-use" />
    </MetaTags> */}
      <Header />
      <div className="p-2 mb-5 footer_header">
        <div className="container">
          <h3>TERMS OF USE</h3>
        </div>
      </div>
      <div className="container about-detail padd-30">
        <div className="col-md-12 col-sm-12 col-xs-12">
          <p>
            This website at{" "}
            <a href="www.zenithglobal.com.my">www.zenithglobal.com.my</a>
            &nbsp;<strong>(&ldquo;Site&rdquo;)</strong> is owned and operated by
            Zenith Lesiure Holidays Ltd a company incorporated under the laws of
            India with its registered office at 68, Ballygunge Circular Road,
            Annapurna Apartment, Kolkata, West Bengal - 700019, India having
            Reserve Bank of India registration no. RBI License No - FE.KOL/AD
            CAT- II/01-2017 (<strong>&quot;we&quot;</strong>,{" "}
            <strong>&quot;us&quot;</strong>,{" "}
            <strong>&ldquo;Zenith Forexonline.com&rdquo;</strong>) and is
            provided for residents of India only. Among other things, this Site
            displays information about us and the products and services
            (specifically, foreign currency related products and services) that
            we provide.
          </p>
          <p>
            The following <strong>&quot;Terms of Use&quot;</strong> apply to any
            individual or entity who accesses this Site in any manner (including
            without limitation via fixed line services and mobile applications)
            for any reason (referred to in these Terms of Use as
            &quot;you&quot;, &ldquo;user&rdquo;). Please read these Terms of Use
            carefully. If you do not accept the Terms of Use, please do not use
            this Site. By using this Site, you agree to be bound by these Terms
            of Use.
          </p>
        </div>
        <div className="col-md-12 col-sm-12 col-xs-12">
          <div className="heading_in">
            <h5>Use of this Site</h5>
          </div>
        </div>
        <div className="col-md-12 col-sm-12 col-xs-12 about-content">
          <ol>
            <li>
              As a condition of you using this Site, you represent, warrant and
              agree that:
              <ul>
                <li>
                  you are at least 18 years of age and have legal authority to
                  enter binding contracts;
                </li>
                <li>
                  you will only access and use this Site for lawful purposes, in
                  a responsible and co-operative manner and in accordance with
                  these Terms of Use;
                </li>
                <li>
                  you will not use this Site for the purposes of reselling or
                  making speculative, false or fraudulent enquiries, requests,
                  bookings or transactions, or bookings or transactions in
                  anticipation of demand;
                </li>
                <li>
                  As a user of foreign exchange services, you agree and confirm
                  being aware of all regulatory norms;
                </li>
                <li>
                  All orders completely comply with regulatory guidelines; you
                  will be solely responsible for any deviation from the same;
                </li>
                <li>
                  you will not impersonate another person or otherwise use
                  another person&#39;s name, identification or log-in details
                  without their permission;
                </li>
                <li>
                  all information you provide on this Site is true, accurate,
                  current and complete, and, in the case of information you
                  provide about other person(s), you are authorised to provide
                  such information;
                </li>
                <li>
                  you will not knowingly introduce, or attempt to introduce, to
                  or through this Site any virus, worm, trojan or other
                  malicious code or disabling feature and you will not otherwise
                  use any device, software or routine to interfere, or attempt
                  to interfere, with the proper working of this Site;
                </li>
                <li>
                  you will not take any action that imposes, or may impose, in
                  our absolute discretion, an unreasonable or disproportionately
                  large load on this Site&#39;s infrastructure;
                </li>
                <li>
                  you will not frame this Site as part of another site or cache
                  this Site for commercial benefit without our express written
                  permission;
                </li>
                <li>
                  you will not access, monitor or copy any content or material
                  on this Site using any robot, scraper, spider, program,
                  algorithm or other automated means for any purpose without our
                  express written permission;
                </li>
                <li>
                  you will not tamper with, hinder the operation of or make
                  unauthorised modifications to this Site, including without
                  limitation, deletion of content, data or infrastructure of
                  this Site without our permission;
                </li>
                <li>
                  you will not post or transmit to or through this Site any
                  material which is unlawful, threatening, defamatory, obscene,
                  indecent, inflammatory or pornographic or which may breach any
                  third party rights (including without limitation intellectual
                  property rights and obligations of confidentiality owed to
                  third parties) or take any action that could be a criminal
                  offence, give rise to civil liability, breach any applicable
                  law or which is otherwise intended to annoy, disrupt or harm
                  us or others; and
                </li>
                <li>
                  if you have a log-in account for this Site, you are
                  responsible for maintaining the confidentiality of your log-in
                  details (including your password) and for all activities that
                  occur using your log-in account.
                </li>
              </ul>
            </li>
            <li>
              If you breach these Terms of Use or otherwise access or use this
              Site or any services available through this Site in a manner that
              is unlawful or which we consider, in our absolute discretion, to
              be inappropriate, we may suspend or terminate your access to this
              Site and/or services including any log-in account you may hold for
              this Site.
            </li>
            <li>
              Without limiting the foregoing, if any activity using your log-in
              account for this Site (if applicable) indicates signs of fraud,
              abuse or unlawful or suspicious activity, we reserve the right to
              cancel any service you have attempted to use on or through this
              Site and/or report the matter to law enforcement agencies.
            </li>
          </ol>
        </div>
        <div className="col-md-12 col-sm-12 col-xs-12">
          <div className="heading_in">
            <h5>Site Content</h5>
          </div>
        </div>
        <div className="col-md-12 col-sm-12 col-xs-12 about-content">
          <ol>
            <li>
              All content on this Site, including without limitation the
              software, design, text and graphics comprised in this Site, the
              selection and layout of this Site and the infrastructure used to
              provide this Site and content, are owned by us or licensed to us
              by third parties and are protected by intellectual property laws
              (including without limitation copyright and trade mark laws) and
              you must not do anything which interferes with or breaches such
              intellectual property rights. You may use this Site only for your
              personal and non-commercial purposes. Except to the extent
              permitted by these Terms of Use and relevant copyright law, you
              must not use, copy, modify, transmit, store, publish or distribute
              the material on this Site, or create any other material using
              content on this Site, without obtaining our prior written consent.
              You must not use or modify trade marks (whether registered or
              unregistered) or logos on this Site without obtaining our prior
              written consent.
            </li>
            <li>
              Restrictions and conditions apply to all of the products and
              services offered on this Site and such restrictions and conditions
              may affect your eligibility to purchase or use such products and
              services and the prices set out on the Site. To determine the
              applicable restrictions and conditions, please contact us or the
              relevant third-party provider (where applicable).
            </li>
            <li>
              We will endeavour to notify you of all applicable taxes, charges
              and any other additional costs when you contact us about
              purchasing our foreign currency-related products or services (as
              at that date) but these may be subject to variation prior to your
              purchase.
            </li>
            <li>
              Much of the content on this Site is supplied to us by third
              parties. Therefore, although we take reasonable care to ensure all
              content on this Site is correct and up to date, we cannot check
              the accuracy of all such information where it is provided to us by
              third parties and do not accept responsibility for such
              information. Third party providers may change their prices,
              details of their services and products and other information
              displayed on this Site at any time. For example, due to the
              fluctuating nature of currencies, any foreign currency conversion
              rates stated on the Site may need to be updated from time to time.
              For this reason, all prices and rates displayed on this Site are
              subject to change without notice and are subject to availability.
              If you are unsure whether any information on this Site is correct
              or up to date, please check it with one of our representatives.
            </li>
            <li>
              This Site may include links to third party websites which are not
              related to us and in relation to which we have no control or
              interest. These links are provided for your convenience only. The
              appearance of these links on this Site does not indicate any
              relationship between us and that third party or any endorsement by
              us of that third party, its website or its products or services.
            </li>
            <li>
              Where we display special deals on this Site, these are usually
              available for a specified period only or until availability is
              exhausted. We recommend you check with us whether a special
              displayed on this Site is available when you would like it. Please
              check the details of the special deal for additional terms,
              conditions and restrictions which may apply to the special deal.
            </li>
          </ol>
        </div>
        <div className="col-md-12 col-sm-12 col-xs-12">
          <div className="heading_in">
            <h5>Interactive Facilities and User Content</h5>
          </div>
        </div>
        <div className="col-md-12 col-sm-12 col-xs-12 about-content">
          <ol>
            <li>
              The functionality provided on this Site may include interactive
              communication facilities such as blogs, discussion groups and
              other communication forums where individuals may submit or post
              reviews, plans, comments and other information (collectively,
              &ldquo;Interactive Facilities&rdquo;).
            </li>
            <li>
              You are solely responsible for your use of any such Interactive
              Facilities and agree that you use them at your risk.
            </li>
            <li>
              You agree that, by submitting, posting or otherwise providing any
              message, blog, data, information, recommendations, opinions,
              reviews, news articles, directories, guides, text, music, sound,
              photos, video footage, art, illustrations, imagery, design,
              graphics, logos, audio clips and images, code or other material
              (&ldquo;Content&rdquo;) to or through this Site (including by
              using Interactive Facilities), You:
              <ul>
                <li>
                  grant to us and our affiliates (including, without limitation,
                  our related entities) a worldwide, nonexclusive, royalty-free,
                  perpetual, transferable, irrevocable and fully sub-licensable
                  right to use, reproduce, modify, adapt, translate, distribute,
                  publish, broadcast, communicate, create derivative works from,
                  publicly display and perform such Content throughout the world
                  in any media, for any purpose whatsoever
                  (&ldquo;Licence&rdquo;);
                </li>
                <li>
                  expressly acknowledge that we may sub-license our rights under
                  the Licence to third parties who may make use of the Content
                  consistent with the Licence including, by way of example, on
                  websites, in a written publication, compilation of works,
                  training materials, film, television program, script or
                  screenplay of either ourselves or a third party expressly
                  authorised by us;
                </li>
                <li>
                  grant us and our affiliates and sub-licensees the right to use
                  your name or any other name that you submit in connection with
                  such Content, at our discretion;
                </li>
                <li>
                  waive any entitlement to any moral rights you may have as an
                  author of the Content (and warrant that you have obtained a
                  waiver of moral rights from any person who may have such
                  rights in the Content); and
                </li>
                <li>
                  agree that we are under no obligation to treat the Content as
                  confidential.
                </li>
              </ul>
            </li>
            <li>
              We reserve the right to, at our absolute and unfettered
              discretion, remove, screen, edit or refuse to post without notice
              any Content submitted to, posted or stored on this Site (including
              the Interactive Facilities) at any time and for any reason. We
              accept no responsibility or liability for any Content posted,
              stored or uploaded by you or any third party, or for any loss or
              damage to any such Content. We accept no responsibility for
              statements, representations or other Content provided by you or
              other users of the Site, including individuals using Interactive
              Facilities. We reserve the right to disclose any Content as
              necessary to satisfy any applicable law, regulation or lawful
              request. You shall be solely liable for any damages resulting from
              any infringement of copyright, trade mark, or other proprietary or
              other right or loss or damage in connection with your use of this
              Site or submission of Content.
            </li>
            <li>
              For the avoidance of doubt, these Terms of Use do not restrict
              your rights to re-use Content you have posted or otherwise
              provided to or through the Site. However, other terms may apply
              different conditions to certain Content (e.g. competition terms
              and conditions). To the extent of any inconsistency between these
              Terms of Use and any of our terms which apply to specific Content,
              the latter will prevail.
            </li>
          </ol>
        </div>
        <div className="col-md-12 col-sm-12 col-xs-12">
          <div className="heading_in">
            <h5>Indemnity</h5>
          </div>
        </div>
        <div className="col-md-12 col-sm-12 col-xs-12 about-content">
          <ol>
            <li>
              We do not exclude any rights and remedies in respect of goods or
              services under applicable law which cannot be excluded, restricted
              or modified. However, to the fullest extent possible, and subject
              to our liabilities and obligations under applicable law:
              <ul>
                <li>
                  we do not warrant the accuracy, currency or completeness of
                  the content which you access through this Site. The content is
                  provided to you &quot;as is&quot; and on an &quot;as
                  available&quot; basis and on the condition that you accept all
                  responsibility for assessing the accuracy of the content and
                  rely on it at your own risk. All content which you access
                  through this Site may be changed at our sole discretion and
                  without notice;
                </li>
                <li>
                  we will have no responsibility or liability in relation to any
                  loss or damage that you incur, however caused, including
                  damage to your software or hardware, arising from your use of
                  or access to this Site; and
                </li>
                <li>
                  we do not warrant that functions of this Site, or which you
                  access through this Site, such as hyperlinks, will be
                  uninterrupted, timely or error free, that defects will be
                  corrected or that we or the server that makes it available,
                  are free of viruses or bugs. Because of the nature of the
                  Internet, we do not warrant that this Site will be secure and
                  we will not be liable for any disruptions to the Site.
                </li>
              </ul>
            </li>
            <li>
              You indemnify us and our officers, employees and agents against
              all losses, costs, damages, claims and expenses arising from
              breach of these Terms of Use by you or any of your officers,
              employees or agents.
            </li>
          </ol>
        </div>
        <div className="col-md-12 col-sm-12 col-xs-12">
          <div className="heading_in">
            <h5>Privacy</h5>
          </div>
        </div>
        <div className="col-md-12 col-sm-12 col-xs-12 about-content">
          <ol>
            <li>
              We will handle your personal information in accordance with the
              terms and conditions set out in our Privacy Policy which is posted
              on the Site.
            </li>
            <li>
              We may disclose aggregated information about users and use
              statistics relating to this Site and aggregated information about
              our sales and trading patterns to others.
            </li>
          </ol>
        </div>
        <div className="col-md-12 col-sm-12 col-xs-12">
          <div className="heading_in">
            <h5>General</h5>
          </div>
        </div>
        <div className="col-md-12 col-sm-12 col-xs-12 about-content">
          <ol>
            <li>
              In these Terms of Use, the term &ldquo;Site&rdquo; includes any
              email bulletins or content that we provide to you via or initiated
              from this Site.
            </li>
            <li>
              If any dispute arises between you and us, the laws of Kolkata,
              India will apply. You irrevocably and unconditionally submit to
              the exclusive jurisdiction of the courts of Kolkata, India, and
              waive any right that you may have to object to an action being
              brought in those courts.
            </li>
            <li>
              Please contact us at{" "}
              <a href="mailto:support@zenithforex.com">
                support@zenithforex.com
              </a>
            </li>
          </ol>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Footer_termsuse;
