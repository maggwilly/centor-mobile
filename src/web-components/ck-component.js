const portal_api_base_url = "http://api.paygarde.com";
(function() {
  const template = document.createElement('template');
  template.innerHTML = `
   <style>
     iframe{
       border: none;
       z-index: 999;
       width:400px;
       height:100%
     }

   @media only screen and (max-width: 900px) {
      iframe{
        width:100%;
        height:100%;
       }
    }
    </style>
    <iframe scrolling="no"></iframe>
  `;

  class PaymentFrame extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this.iframe = this.shadowRoot.querySelector('iframe');
      this.onPaymentStart = new CustomEvent('onPaymentStart',{cancelable: true, detail:{}});
      this.onPaymentComplete = new CustomEvent('onPaymentComplete',{cancelable: true, detail:{}});
      this.onPaymentCancel = new CustomEvent('onPaymentCancel',{cancelable: true, detail:{}});
      this.onFrameError = new CustomEvent('onFrameError',{cancelable: true, detail:{}});
    }

    connectedCallback() {
     this.handlePayementEvents();
      if (!this.hasAttribute('country')) {
        this.setAttribute('country', 'CM');
      }
      if (!this.hasAttribute('lang')) {
        this.setAttribute('lang', navigator.language);
      }
      if (!this.hasAttribute('currency')) {
        this.setAttribute('currency', 'XAF');
      }
      if (!this.hasAttribute('acceptmultipayment')) {
        this.setAttribute('acceptmultipayment', false);
      }
    }

    getCkoutData() {
      return {
        serviceid: this.serviceid,
        orderid: this.orderid,
        amount: this.amount,
        lang: this.lang || 'EN',
        currency: this.currency || 'XAF',
        country: this.country || 'XAF',
        acceptpartialpayment: this.acceptmultipayment,
        payerphone: this.payerphone,
        payereremail: this.payeremail,
        primaryColor: this.primarycolor,
        viewMode: this.viewmode || 'full',
        collectpayergeneratlinfo: this.collectpayergeneratlinfo || false,
      };
    }
    attributeChangedCallback(name, oldValue, newValue) {
      let self=this;
      if (this.isDataValide()&&!this.hasAttribute('isloading')){
        this.setAttribute('isloading', true);
        const apikey= this.apikey;
        const ckout_data = this.getCkoutData();
        (function () {
          fetch(`${portal_api_base_url}/api/v1/payment-requests/embeded`, {
            method: "post",
            body: JSON.stringify(ckout_data),
            headers: {'Content-Type': 'application/json','Authorization': `Bearer ${apikey}`}
          }).then(function (response) {
            return response.json()
              .then(json => {
                if (response.ok) {
                  return json
                }
                return Promise.reject(Object.assign({}, json, {
                  status: response.status,
                  statusText: response.statusText
                }))
              })
          }).then(data=>{
            self.loadIframe(data, self);
          }).catch(err => {
            self.onFrameError.detail.error=err;
            self.dispatchEvent(self.onFrameError);
          })
        })();
      }
    }

    isDataValide(){
      return this.hasAttribute('apikey')&&
        this.hasAttribute('serviceid')&&
        this.hasAttribute('orderid')&&
        this.hasAttribute('country')&&
        this.hasAttribute('currency')&&
        this.hasAttribute('amount');
    }

    loadIframe(data) {
      this.iframe.src = data.fulllurl;
    }

    handlePayementEvents() {
      let self=this;
      (function () {
        function handlerEvent($message) {
          switch ($message.data.event) {
            case 'OnPaymentStart': {
              self.onPaymentStart.detail.data=$message.data.body;
              this.dispatchEvent(self.onPaymentStart);
              break;
            }
            case 'OnPaymentComplete': {
              self.onPaymentComplete.detail.data=$message.data.body;
              this.dispatchEvent(self.onPaymentComplete);
              break;
            }
            case 'OnPaymentCancel': {
              self.onPaymentCancel.detail.data=$message.data.body;
              self.dispatchEvent(self.onPaymentCancel);
              break;
            }
          }
        }
        window.addEventListener("message", handlerEvent, false);
      })();
    }
    static get observedAttributes() {
      return ['apikey','serviceid','orderid','amount','currency','lang','acceptmultipayment','payerphone','payeremail','country'];
    }

    set isloading(isloading) {
      this.setAttribute('isloading', isloading);
    }
    get apikey() {
      return this.getAttribute('apikey');
    }
    get serviceid() {
      return this.getAttribute('serviceid');
    }
    get orderid() {
      return this.getAttribute('orderid');
    }
    get amount() {
      return this.getAttribute('amount');
    }
    get currency() {
      return this.getAttribute('currency');
    }
    get country() {
      return this.getAttribute('country');
    }
    get lang() {
      return this.getAttribute('lang');
    }
    get acceptmultipayment() {
      return this.getAttribute('acceptmultipayment');
    }
    get payerphone() {
      return this.getAttribute('payerphone');
    }
    get payeremail() {
      return this.getAttribute('payeremail');
    }
    get viewmode() {
      return this.getAttribute('viewmode');
    }
    get primarycolor() {
      return this.getAttribute('primarycolor');
    }
    get collectpayergeneratlinfo() {
      return this.getAttribute('collectpayergeneratlinfo');
    }

    set apikey(api_key) {
      this.setAttribute('apikey', api_key);
    }
    set serviceid(serviceId) {
      this.setAttribute('serviceid', serviceId);
    }
    set orderid(orderid) {
      this.setAttribute('orderid', orderid);
    }
    set amount(amount) {
      this.setAttribute('amount', amount);
    }
    set currency(currency) {
      this.setAttribute('currency', currency);
    }
    set country(country) {
      this.setAttribute('country', country);
    }
    set lang(lang) {
      this.setAttribute('lang', lang);
    }
    set acceptmultipayment(acceptmultipayment) {
      this.setAttribute('acceptmultipayment', acceptmultipayment);
    }
    set collectpayergeneratlinfo(collectpayergeneratlinfo) {
      this.setAttribute('collectpayergeneratlinfo', collectpayergeneratlinfo);
    }
    set payerphone(payer_phone) {
      this.setAttribute('payerphone', payer_phone);
    }
    set payeremail(payeremail) {
      this.setAttribute('payeremail', payeremail);
    }
    set viewmode(viewmode) {
      this.setAttribute('viewmode', viewmode);
    }
    set primarycolor(primarycolor) {
      this.setAttribute('primarycolor', primarycolor);
    }
    disconnectedCallback() {
    }
  }
  window.customElements.define('payment-frame', PaymentFrame);
})();
