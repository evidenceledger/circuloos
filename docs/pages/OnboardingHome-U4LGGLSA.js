import {
  Client
} from "../chunks/chunk-QRP43PCI.js";

// front/src/pages/OnboardingHome.js
var MHR = window.MHR;
console.log("ENVIRONMENT", window.domeEnvironment);
console.log("BUYER ONBOARDING API", window.onboardServer);
var pb = new Client(window.onboardServer);
var gotoPage = MHR.gotoPage;
var html = MHR.html;
var serverAvailable = false;
MHR.register(
  "OnboardingHome",
  class extends MHR.AbstractPage {
    /**
     * @param {string} id
     */
    constructor(id) {
      super(id);
    }
    async enter() {
      try {
        const result = await fetch(window.onboardServer + "/api/health");
        console.log("Server is available:", result);
        serverAvailable = true;
      } catch (error) {
        console.log("Server is not available:", error);
        serverAvailable = false;
      }
      const logedIn = pb.authStore.isValid;
      let params = new URLSearchParams(document.location.search);
      let page = params.get("page");
      if (page == "buyer") {
        debugger;
        gotoPage("BuyerOnboardingForm", null);
        return;
      }
      if (page == "buyerotp") {
        gotoPage("BuyerOnboardingOTP", null);
        return;
      }
      if (page == "buyershow") {
        gotoPage("BuyerOnboardingShowData", null);
        return;
      }
      gotoPage("BuyerOnboardingForm", null);
    }
  }
);
MHR.register(
  "BuyerOnboardingForm",
  class extends MHR.AbstractPage {
    /**
     * @param {string} id
     */
    constructor(id) {
      super(id);
    }
    async enter(pageData) {
      const records = await pb.collection("tandc").getFullList({});
      debugger;
      var theHtml = html`
      <!-- Header -->
      <div class="dome-header">
        <div class="dome-content">
          <div class="w3-bar">
            <div class="w3-bar-item padding-right-0">
              <a href="#">
                <img src="assets/logos/circuloos.png" alt="Circuloos Icon" style="width:100%;max-height:32px">
              </a>
            </div>
            <div class="w3-bar-item">
              <span class="blinker-semibold w3-xlarge nowrap">Onboarding</span>
            </div>
          </div>
        </div>
      </div>


      <!-- Process structure -->
      <div class="w3-card-4 dome-content w3-round-large w3-white w3-margin-bottom">
        <div class="w3-container">
          <h2>The process is structured in three main steps</h2>

          <div class="w3-row-padding">

            <div class="w3-third">
              <div class="parent">
                <div class="child padding-right-8">
                  <span class="material-symbols-outlined dome-color w3-xxxlarge">
                    counter_1
                  </span>
                </div>
                <div class="child padding-right-24">
                  <p>Provide all the information required in the forms below and
                    acceptance of the terms and conditions
                    <a target="_blank"
                      href="https://circuloos.eu/privacy/">
                      here.
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div class="w3-third">
              <div class="parent">
                <div class="child padding-right-8">
                  <span class="material-symbols-outlined dome-color w3-xxxlarge">
                    counter_2
                  </span>
                </div>
                <div class="child padding-right-24">
                  <p>Verification of the email used to perform onboarding</p>
                </div>
              </div>
            </div>

            <div class="w3-third">
              <div class="parent">
                <div class="child padding-right-8">
                  <span class="material-symbols-outlined dome-color w3-xxxlarge">
                    counter_3
                  </span>
                </div>
                <div class="child padding-right-24">
                  <p>Generation of the verifiable credential for the Legal Entity Appointed Representative (LEAR)</p>
                </div>
              </div>
            </div>

          </div>

          <h4>Upon the generation of the LEAR verifiable credential,
            the company account is complete and you can start operating.
          </h4>
        </div>

      </div>


      <!-- Instructions -->
      <div class="card w3-card-4 dome-content w3-round-large dome-bgcolor w3-margin-bottom">

        <div class="parent">
          <div class="child">
            <div class="w3-panel">
              <h1>Filling Out Forms</h1>
              <p class="w3-large">
                In this page you will find a form with three sections. Fill in all the fields 
                (unless marked as optional), making sure to use Latin characters.
              </p>
              <p class="w3-large">
                The information you enter in the forms will be used for the registration of your company
                in CIRCULOOS.
                The whole process is described in more detail in the CIRCULOOS knowledge base.
                You can read the description in the knowledgebase and come back here whenever you want.
              </p>
              <p class="w3-large">
                The forms are below. Please, click the "Start registration" button after filling all the fields.
              </p class="w3-large">
            </div>
          </div>
          <div class="">
            <img src="assets/images/form.png" alt="Form image" style="max-width:450px">
          </div>
        </div>
      </div>

      <!-- Form -->
      <div class="dome-content">
        <form
        name="buyer_onboarding_form"
        id="buyer_onboarding_form"
        @submit=${(ev) => this.submitForm(ev)}
        class="w3-margin-bottom"
        >

          ${LegalRepresentativeForm()}

          ${TermsAndConditionsForm(records)}

          ${CompanyForm()}

          ${LEARForm()}

          <div class="w3-bar w3-center">
            <button class="w3-btn dome-bgcolor w3-round-large w3-margin-right blinker-semibold"
              title="Submit and create documents">Start registration
            </button>
            <a @click=${this.fillTestData}
              class="w3-btn dome-color border-2 w3-round-large w3-margin-left blinker-semibold">
              Fill with test data (only for testing)
            </a>
          </div>

        </form>

        <div class="card w3-card-4 dome-content w3-round-large dome-bgcolor w3-margin-bottom">
          <div class="w3-container">

            <p>
              Click the "<b>Start registration</b>" button above to start the registration.
            </p>
            <p>
              After submission, you will see a confirmation screen where you have to enter the one-time
              code that you will receive in your email inbox.
            </p>

          </div>

        </div>


      </div>

      `;
      this.render(theHtml, false);
    }
    async fillTestData(ev) {
      ev.preventDefault();
      document.forms["buyer_onboarding_form"].elements["LegalRepCommonName"].value = "Jesus Ruiz";
      document.forms["buyer_onboarding_form"].elements["LegalRepEmail"].value = "jesus@alastria.io";
      document.forms["buyer_onboarding_form"].elements["CompanyName"].value = "Air Quality Cloud";
      document.forms["buyer_onboarding_form"].elements["CompanyStreetName"].value = "C/ Academia 54";
      document.forms["buyer_onboarding_form"].elements["CompanyCity"].value = "Madrid";
      document.forms["buyer_onboarding_form"].elements["CompanyPostal"].value = "28654";
      document.forms["buyer_onboarding_form"].elements["CompanyCountry"].value = "ES";
      document.forms["buyer_onboarding_form"].elements["CompanyOrganizationID"].value = "VATES-B35664875";
      document.forms["buyer_onboarding_form"].elements["LEARFirstName"].value = "John";
      document.forms["buyer_onboarding_form"].elements["LEARLastName"].value = "Doe CIRCULOOS";
      document.forms["buyer_onboarding_form"].elements["LEARNationality"].value = "Spanish";
      document.forms["buyer_onboarding_form"].elements["LEARIDNumber"].value = "56332876F";
      document.forms["buyer_onboarding_form"].elements["LEARPostalAddress"].value = "C/ Academia 54, Madrid - 28654, Spain";
      document.forms["buyer_onboarding_form"].elements["LEAREmail"].value = "hesus.ruiz@gmail.com";
      document.forms["buyer_onboarding_form"].elements["LEARMobilePhone"].value = "+34876549022";
    }
    async submitForm(ev) {
      ev.preventDefault();
      debugger;
      var form = {};
      any("#buyer_onboarding_form input").run((el) => {
        if (el.value.length > 0) {
          form[el.name] = el.value;
        } else {
          form[el.name] = "[N/A]";
        }
      });
      form.CompanyCountry = me("#buyerCompanyCountry").value;
      console.log(form);
      const data = {
        email: form.LegalRepEmail,
        emailVisibility: true,
        name: form.LegalRepCommonName,
        organizationIdentifier: form.CompanyOrganizationID,
        organization: form.CompanyName,
        street: form.CompanyStreetName,
        city: form.CompanyCity,
        postalCode: form.CompanyPostal,
        country: form.CompanyCountry,
        learFirstName: form.LEARFirstName,
        learLastName: form.LEARLastName,
        learNationality: form.LEARNationality,
        learIdcard: form.LEARIDNumber,
        learStreet: form.LEARPostalAddress,
        learEmail: form.LEAREmail,
        learMobile: form.LEARMobilePhone,
        password: "12345678",
        passwordConfirm: "12345678"
      };
      try {
        const record = await pb.collection("buyers").create(data);
        console.log(record);
      } catch (error) {
        myerror(error);
        if (error.response?.data?.organizationIdentifier?.code == "validation_not_unique") {
          gotoPage("MessagePage", {
            title: "Error in registration",
            msg: "The organization is already registered",
            details: "If you want to modify your registration data, or have any doubts, please contact us at info@circuloos.eu",
            level: "info"
          });
          return;
        }
        gotoPage("MessagePage", {
          title: "Error in registration",
          msg: error.message
        });
        return;
      }
      try {
        const record = await pb.collection("buyers").requestOTP(form.LegalRepEmail);
        console.log(record);
        localStorage.setItem("buyerEmail", form.LegalRepEmail);
        localStorage.setItem("buyerOtpId", record.otpId);
        loadPage("buyerotp");
        return;
      } catch (error) {
        myerror(error);
        gotoPage("MessagePage", {
          title: "Error in registration",
          msg: error.message
        });
        return;
      }
    }
  }
);
MHR.register(
  "BuyerOnboardingShowData",
  class extends MHR.AbstractPage {
    /**
     * @param {string} id
     */
    constructor(id) {
      super(id);
    }
    async enter(pageData) {
      debugger;
      if (!pb.authStore.isValid) {
        gotoPage("MessagePage", {
          title: "User not authenticated",
          msg: "The user has not yet authenticated"
        });
        return;
      }
      let r = pb.authStore.record;
      var theHtml = html`
            <!-- Header -->
            <div class="dome-header">
              <div class="dome-content">
                <div class="w3-bar">
                  <div class="w3-bar-item padding-right-0">
                    <a href="#">
                      <img src="assets/logos/circuloos.png" alt="Circuloos Icon" style="width:100%;max-height:32px">
                    </a>
                  </div>
                  <div class="w3-bar-item">
                    <span class="blinker-semibold w3-xlarge nowrap">Onboarding</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="w3-padding-32" style="background-color: #EDF2FA;">
               <!-- Form -->
               <div class="dome-content">
                  <form
                     name="theform"
                     @submit=${(e) => this.validateForm(e)}
                     id="formElements"
                     class="w3-margin-bottom"
                  >
                     ${LegalRepresentativeDisplay(r)} ${CompanyDisplay(r)} ${LEARDisplay(r)}

                     <div class="w3-bar w3-center">
                        <a
                           href=${domeHome}
                           class="w3-btn dome-bgcolor w3-round-large w3-margin-right blinker-semibold"
                           title="Go to the DOME Marketplace"
                        >
                           Go to CIRCULOOS homepage
                        </a>
                     </div>
                  </form>

                  <div
                     class="card w3-card-4 dome-content w3-round-large dome-bgcolor w3-margin-bottom"
                  >
                     <div class="w3-container">
                        <p>
                           Click the "<b>Go to the CIRCULOOS homepage</b>" button above to go to the
                           CIRCULOOS main page.
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         `;
      this.render(theHtml, false);
    }
  }
);
function LegalRepresentativeForm() {
  return html`
      <div class="card w3-card-2 w3-white">
         <div class="w3-container">
            <h1>Person driving the onboarding process</h1>
         </div>

         <div class="w3-row">
            <div class="w3-quarter w3-container">
               <p>
                  We need information identifying the person performing the onboarding process on
                  behalf of the company.
               </p>
               <p>
                  Your email will be used to receive important messages from us. After submitting
                  the form, you will receive a message for confirmation.
               </p>
            </div>

            <div class="w3-rest w3-container">
               <div class="w3-panel w3-card-2  w3-light-grey">
                  <p>
                     <label><b>Name and Surname</b></label>
                     <input
                        name="LegalRepCommonName"
                        class="w3-input w3-border"
                        type="text"
                        placeholder="Name and Surname"
                        required
                     />
                  </p>

                  <p>
                     <label><b>Email</b></label>
                     <input
                        name="LegalRepEmail"
                        class="w3-input w3-border"
                        type="text"
                        placeholder="Email"
                        required
                     />
                  </p>

                  <p>
                     <b>IMPORTANT:</b> your onboarding request can only be processed after you
                     confirm your email address. After you submit the onboarding request, you will
                     receive a message from us at the email address you specify here, allowing you
                     to confirm it.
                  </p>
                  <p>
                     We send the email immediately, but depending on the email server configuration,
                     you may require some minutes before receiving the message. Also, if you do not
                     receive the email in a reasonable time, please look in your spam inbox, just in
                     case your email server has clasified it as such.
                  </p>
               </div>
            </div>
         </div>
      </div>
   `;
}
function TermsAndConditionsForm(records) {
  return html`
      <div class="card w3-card-2 w3-white">
         <div class="w3-container">
            <h1>Accept Terms and Conditions</h1>
         </div>

         <div class="w3-row">
            <div class="w3-quarter w3-container">
               <p>We need the company to accept the DOME Terms and Conditions.</p>
               <p>
                  Please, read the linked documents and click on the checkbox to accept the
                  conditions described in them.
               </p>
            </div>

            <div class="w3-rest w3-container">
               <div class="w3-panel w3-card-2  w3-light-grey">
                  ${records.map((element) => {
    debugger;
    let name = element.name;
    let fileName = element.file;
    let description = element.description;
    let url = pb.files.getURL(element, fileName);
    return html`
                        <p>
                           <a href=${url}>${description}</a>
                        </p>
                     `;
  })}
                  <p>
                     <input class="w3-check" type="checkbox" name="TermsAndConditions" required />
                     <label
                        >I have read and accept the DOME terms and conditions and the DOME
                        MArketplace privacy policy</label
                     >
                  </p>
               </div>
            </div>
         </div>
      </div>
   `;
}
function LegalRepresentativeDisplay(r) {
  return html`
      <div class="card w3-card-2 w3-white">
         <div class="w3-container">
            <h1>Person performing onboarding</h1>
         </div>

         <div class="w3-row">
            <div class="w3-quarter w3-container">
               <p>This is the information we have about you.</p>
            </div>

            <div class="w3-rest w3-container">
               <div class="w3-panel w3-card-2  w3-light-grey">
                  <p>
                     <label><b>Name and Surname</b></label>
                     <input
                        name="LegalRepCommonName"
                        class="w3-input w3-border"
                        type="text"
                        value=${r ? r.name : null}
                        ?readonly=${r}
                        disabled
                     />
                  </p>

                  <p>
                     <label><b>Email</b></label>
                     <input
                        name="LegalRepEmail"
                        class="w3-input w3-border"
                        type="text"
                        placeholder="Email"
                        value=${r ? r.email : null}
                        ?readonly=${r}
                        disabled
                     />
                  </p>
               </div>
            </div>
         </div>
      </div>
   `;
}
function CompanyDisplay(r) {
  var theHtml = html`
      <div class="card w3-card-2 w3-white">
         <div class="w3-container">
            <h1>Company information</h1>
         </div>

         <div class="w3-row">
            <div class="w3-quarter w3-container">
               <p>This is the information about the company.</p>
            </div>

            <div class="w3-rest w3-container">
               <div class="w3-panel w3-card-2  w3-light-grey">
                  <p>
                     <label><b>Official Name</b></label>
                     <input
                        name="CompanyName"
                        class="w3-input w3-border"
                        type="text"
                        placeholder="Name"
                        value=${r ? r.organization : null}
                        ?readonly=${r}
                        disabled
                     />
                  </p>

                  <p>
                     <label><b>Street name and number</b></label>
                     <input
                        name="CompanyStreetName"
                        class="w3-input w3-border"
                        type="text"
                        placeholder="Street name and number"
                        value=${r ? r.street : null}
                        ?readonly=${r}
                        disabled
                     />
                  </p>

                  <p>
                     <label><b>City</b></label>
                     <input
                        name="CompanyCity"
                        class="w3-input w3-border"
                        type="text"
                        placeholder="City"
                        value=${r ? r.city : null}
                        ?readonly=${r}
                        disabled
                     />
                  </p>

                  <p>
                     <label><b>Postal code</b></label>
                     <input
                        name="CompanyPostal"
                        class="w3-input w3-border"
                        type="text"
                        placeholder="Postal code"
                        value=${r ? r.postalCode : null}
                        ?readonly=${r}
                        disabled
                     />
                  </p>

                  <p>
                     <label><b>Country</b></label>
                     <input
                        name="CompanyCountry"
                        class="w3-input w3-border"
                        type="text"
                        placeholder="Country"
                        value=${r ? r.country : null}
                        ?readonly=${r}
                        disabled
                     />
                  </p>

                  <p>
                     <label><b>Tax identifier</b></label>
                     <input
                        name="CompanyOrganizationID"
                        class="w3-input w3-border"
                        type="text"
                        placeholder="VAT number"
                        value=${r ? r.organizationIdentifier : null}
                        ?readonly=${r}
                        disabled
                     />
                  </p>
               </div>
            </div>
         </div>
      </div>
   `;
  return theHtml;
}
function LEARDisplay(r) {
  var theHtml = html`
      <div class="card w3-card-2 w3-white">
         <div class="w3-container">
            <h1>Information about the LEAR</h1>
         </div>

         <div class="w3-row">
            <div class="w3-quarter w3-container">
               <p>
                  This is the information about the LEAR, identifying the employee of the company
                  who will act as the Legal Entity Authorised Representative.
               </p>
            </div>

            <div class="w3-rest w3-container">
               <div class="w3-panel w3-card-2  w3-light-grey">
                  <p>
                     <label><b>First name</b></label>
                     <input
                        name="LEARFirstName"
                        class="w3-input w3-border"
                        type="text"
                        placeholder="First name"
                        value=${r ? r.learFirstName : null}
                        ?readonly=${r}
                        disabled
                     />
                  </p>

                  <p>
                     <label><b>Last name</b></label>
                     <input
                        name="LEARLastName"
                        class="w3-input w3-border"
                        type="text"
                        placeholder="Last name"
                        value=${r ? r.learLastName : null}
                        ?readonly=${r}
                        disabled
                     />
                  </p>

                  <p>
                     <label><b>Nationality</b></label>
                     <input
                        name="LEARNationality"
                        class="w3-input w3-border"
                        type="text"
                        placeholder="Nationality"
                        value=${r ? r.learNationality : null}
                        ?readonly=${r}
                        disabled
                     />
                  </p>

                  <p>
                     <label><b>ID card number</b></label>
                     <input
                        name="LEARIDNumber"
                        class="w3-input w3-border"
                        type="text"
                        placeholder="ID card number"
                        value=${r ? r.learIdcard : null}
                        ?readonly=${r}
                        disabled
                     />
                  </p>

                  <p>
                     <label><b>Complete postal professional address</b></label>
                     <input
                        name="LEARPostalAddress"
                        class="w3-input w3-border"
                        type="text"
                        placeholder="Complete postal professional address"
                        value=${r ? r.learStreet : null}
                        ?readonly=${r}
                        disabled
                     />
                  </p>

                  <p>
                     <label><b>Email</b></label>
                     <input
                        name="LEAREmail"
                        class="w3-input w3-border"
                        type="text"
                        placeholder="Email"
                        value=${r ? r.learEmail : null}
                        ?readonly=${r}
                        disabled
                     />
                  </p>

                  <p>
                     <label><b>Mobile phone</b></label>
                     <input
                        name="LEARMobilePhone"
                        class="w3-input w3-border"
                        type="text"
                        placeholder="Mobile phone"
                        value=${r ? r.learMobile : null}
                        ?readonly=${r}
                        disabled
                     />
                  </p>
               </div>
            </div>
         </div>
      </div>
   `;
  return theHtml;
}
function CompanyForm(r) {
  var theHtml = html`
      <div class="card w3-card-2 w3-white">
         <div class="w3-container">
            <h1>Company information</h1>
         </div>

         <div class="w3-row">
            <div class="w3-quarter w3-container">
               <p>We also need information about the company so we can register it in DOME.</p>
               <p>
                  The name must be the official name of the company as it appears in the records of
                  incorporation of your company. The address must be that of the official place of
                  incorporation of your company.
               </p>
               <p>
                  The Tax identifier will be used as a unique identifier of your company in the DOME
                  Marketplace, and also when you buy services published in the marketplace.
               </p>
            </div>

            <div class="w3-rest w3-container">
               <div class="w3-panel w3-card-2  w3-light-grey">
                  <p>
                     <label><b>Official Name</b></label>
                     <input
                        name="CompanyName"
                        class="w3-input w3-border"
                        type="text"
                        placeholder="Name"
                        value=${r ? r.organization : null}
                        ?readonly=${r}
                        required
                     />
                  </p>

                  <p>
                     <label><b>Street name and number</b></label>
                     <input
                        name="CompanyStreetName"
                        class="w3-input w3-border"
                        type="text"
                        placeholder="Street name and number"
                        value=${r ? r.street : null}
                        ?readonly=${r}
                        required
                     />
                  </p>

                  <p>
                     <label><b>City</b></label>
                     <input
                        name="CompanyCity"
                        class="w3-input w3-border"
                        type="text"
                        placeholder="City"
                        value=${r ? r.city : null}
                        ?readonly=${r}
                        required
                     />
                  </p>

                  <p>
                     <label><b>Postal code</b></label>
                     <input
                        name="CompanyPostal"
                        class="w3-input w3-border"
                        type="text"
                        placeholder="Postal code"
                        value=${r ? r.postalCode : null}
                        ?readonly=${r}
                        required
                     />
                  </p>

                  <p>
                     <label><b>Country</b></label>
                     <select
                        id="buyerCompanyCountry"
                        class="w3-select w3-border"
                        name="CompanyCountry"
                        required
                        value=${r ? r.postalCode : null}
                        ?readonly=${r}
                     >
                        <option value="" disabled selected>Choose the country</option>
                        <option value="AT">Austria</option>
                        <option value="BE">Belgium</option>
                        <option value="BG">Bulgaria</option>
                        <option value="HR">Croatia</option>
                        <option value="CY">Cyprus</option>
                        <option value="CZ">Czech Republic</option>
                        <option value="DK">Denmark</option>
                        <option value="EE">Estonia</option>
                        <option value="FI">Finland</option>
                        <option value="FR">France</option>
                        <option value="DE">Germany</option>
                        <option value="EL">Greece</option>
                        <option value="HU">Hungary</option>
                        <option value="IS">Iceland</option>
                        <option value="IE">Ireland</option>
                        <option value="IT">Italy</option>
                        <option value="LV">Latvia</option>
                        <option value="LI">Liechtenstein</option>
                        <option value="LT">Lithuania</option>
                        <option value="LU">Luxembourg</option>
                        <option value="MT">Malta</option>
                        <option value="NL">Netherlands</option>
                        <option value="NO">Norway</option>
                        <option value="PL">Poland</option>
                        <option value="PT">Portugal</option>
                        <option value="RO">Romania</option>
                        <option value="SK">Slovakia</option>
                        <option value="SI">Slovenia</option>
                        <option value="ES">Spain</option>
                        <option value="SE">Sweden</option>
                     </select>
                  </p>

                  <p>
                     <label><b>Tax identifier</b></label>
                     <input
                        name="CompanyOrganizationID"
                        class="w3-input w3-border"
                        type="text"
                        placeholder="VAT number"
                        value=${r ? r.organizationIdentifier : null}
                        ?readonly=${r}
                        required
                     />
                  </p>
               </div>
            </div>
         </div>
      </div>
   `;
  return theHtml;
}
function LEARForm(r) {
  var theHtml = html`
      <div class="card w3-card-2 w3-white">
         <div class="w3-container">
            <h1>Information about the LEAR</h1>
         </div>

         <div class="w3-row">
            <div class="w3-quarter w3-container">
               <p>This section identifies the person who will act as LEAR of your company.</p>
               <p>
                  The LEAR is the Legal Entity Appointed Representative, and she/he can be any
                  person who is authorized by your company to act on behalf of the company within
                  the DOME Marketplace. There is specific information about the LEAR in the
                  Knowledge Base.
               </p>
            </div>

            <div class="w3-rest w3-container">
               <div class="w3-panel w3-card-2  w3-light-grey">
                  <p>
                     <label><b>First name</b></label>
                     <input
                        name="LEARFirstName"
                        class="w3-input w3-border"
                        type="text"
                        placeholder="First name"
                        value=${r ? r.learFirstName : null}
                        ?readonly=${r}
                        required
                     />
                  </p>

                  <p>
                     <label><b>Last name</b></label>
                     <input
                        name="LEARLastName"
                        class="w3-input w3-border"
                        type="text"
                        placeholder="Last name"
                        value=${r ? r.learLastName : null}
                        ?readonly=${r}
                        required
                     />
                  </p>

                  <p>
                     <label><b>Nationality</b></label>
                     <input
                        name="LEARNationality"
                        class="w3-input w3-border"
                        type="text"
                        placeholder="Nationality"
                        value=${r ? r.learNationality : null}
                        ?readonly=${r}
                        required
                     />
                  </p>

                  <p>
                     <label><b>ID card number (optional)</b></label>
                     <input
                        name="LEARIDNumber"
                        class="w3-input w3-border"
                        type="text"
                        placeholder="ID card number"
                        value=${r ? r.learIdcard : null}
                        ?readonly=${r}
                     />
                  </p>

                  <p>
                     <label><b>Complete postal professional address</b></label>
                     <input
                        name="LEARPostalAddress"
                        class="w3-input w3-border"
                        type="text"
                        placeholder="Complete postal professional address"
                        value=${r ? r.learStreet : null}
                        ?readonly=${r}
                        required
                     />
                  </p>

                  <p>
                     <label><b>Email</b></label>
                     <input
                        name="LEAREmail"
                        class="w3-input w3-border"
                        type="text"
                        placeholder="Email"
                        value=${r ? r.learEmail : null}
                        ?readonly=${r}
                        required
                     />
                  </p>

                  <p>
                     <label><b>Mobile phone</b></label>
                     <input
                        name="LEARMobilePhone"
                        class="w3-input w3-border"
                        type="text"
                        placeholder="Mobile phone"
                        value=${r ? r.learMobile : null}
                        ?readonly=${r}
                     />
                  </p>
               </div>
            </div>
         </div>
      </div>
   `;
  return theHtml;
}
MHR.register(
  "BuyerOnboardingOTP",
  class extends MHR.AbstractPage {
    /**
     * @param {string} id
     */
    constructor(id) {
      super(id);
    }
    /**
     * @param {{email: string, otpId: string}} pageData
     */
    async enter(pageData) {
      debugger;
      let email = localStorage.getItem("buyerEmail");
      if (!email) {
        email = "";
      }
      let otpId = localStorage.getItem("buyerOtpId");
      if (!otpId) {
        otpId = "";
      }
      var theHtml = html`
            <!-- Header -->
            <div class="dome-header">
              <div class="dome-content">
                <div class="w3-bar">
                  <div class="w3-bar-item padding-right-0">
                    <a href="#">
                      <img src="assets/logos/circuloos.png" alt="Circuloos Icon" style="width:100%;max-height:32px">
                    </a>
                  </div>
                  <div class="w3-bar-item">
                    <span class="blinker-semibold w3-xlarge nowrap">Onboarding</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="w3-padding-32" style="background-color: #EDF2FA;">
               <!-- Form -->
               <div class="dome-content">
                  <form
                     name="otpform"
                     @submit=${(ev) => this.submitForm(ev)}
                     id="loginform"
                     class="w3-margin-bottom"
                  >
                     <div class="card w3-card-2 w3-white">
                        <div class="w3-container">
                           <h1>Confirm your email</h1>
                        </div>

                        <div class="w3-row">
                           <div class="w3-quarter w3-container">
                              <p>
                                 Please, enter the code that you must have received in your email
                                 from us.
                              </p>
                              <p>
                                 After submitting the form, you will receive a message for
                                 confirmation.
                              </p>
                              <p>If your previous code expired, you can request a new one.</p>
                           </div>

                           <div class="w3-rest w3-container">
                              <div class="w3-panel w3-card-2  w3-light-grey">
                                 <p>
                                    <label><b>Email to verify</b></label>
                                    <input
                                       name="LegalRepEmail"
                                       class="w3-input w3-border"
                                       type="text"
                                       placeholder="Email"
                                       value=${email}
                                       readonly
                                    />
                                 </p>
                                 <p>
                                    <label><b>Enter the code you received</b></label>
                                    <input
                                       name="ReceivedOTP"
                                       class="w3-input w3-border"
                                       type="text"
                                       placeholder="OTP"
                                       required
                                    />
                                 </p>
                                 <input name="otpId" type="hidden" value=${otpId} />
                              </div>
                           </div>
                        </div>
                     </div>

                     <!-- Buttons -->
                     <div class="w3-bar w3-center">
                        <button
                           id="login_button"
                           class="w3-btn dome-bgcolor w3-round-large w3-margin-right blinker-semibold"
                           style="width:30%"
                           title="Confirm"
                        >
                           Confirm
                        </button>
                        <div
                           id="anotherotp_button"
                           class="w3-btn dome-bgcolor w3-round-large w3-margin-right blinker-semibold"
                           style="width:30%"
                           title="Request another code"
                           @click=${async () => {
        try {
          const record = await pb.collection("buyers").requestOTP(email);
          console.log(record);
          localStorage.setItem("buyerEmail", email);
          localStorage.setItem("buyerOtpId", record.otpId);
          alert("A new code has been sent to your email.");
          loadPage("buyerotp");
          return;
        } catch (error) {
          myerror(error);
          gotoPage("MessagePage", {
            title: "Error in registration",
            msg: error.message
          });
          return;
        }
      }}
                        >
                           Request another code
                        </div>
                     </div>
                  </form>
               </div>
            </div>
         `;
      this.render(theHtml, false);
    }
    /**
     * @param {SubmitEvent} ev
     */
    async submitForm(ev) {
      ev.preventDefault();
      debugger;
      var form = {};
      ev.target;
      any("#loginform input").run((el) => {
        if (el.value.length > 0) {
          form[el.name] = el.value;
        } else {
          form[el.name] = "[" + el.name + "]";
        }
      });
      console.log(form);
      try {
        debugger;
        const authData = await pb.collection("buyers").authWithOTP(form.otpId, form.ReceivedOTP);
        console.log(authData);
        loadPage("buyershow");
        return;
      } catch (error) {
        myerror(error);
        gotoPage("MessagePage", {
          title: "Error in registration",
          msg: error.message
        });
        return;
      }
    }
  }
);
function loadPage(page) {
  window.location = window.location.origin + window.location.pathname + "?page=" + page;
  return;
}
