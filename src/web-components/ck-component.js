
const portal_api_base_url = "http://localhost:8092";
(function() {
  const template = document.createElement('template');
  template.innerHTML = `
   <style>
     iframe{
       border: none;
       z-index: 999;
       width:350px;
       height:630px
     }
   @media only screen and (max-width: 600px) {
      iframe{
        width:100%;
        height:100%
       }
    }
    </style>
    <iframe></iframe>
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
    }

    getCkoutData() {
      return {
        serviceid: this.serviceid,
        orderid: this.orderid,
        amount: this.amount,
        lang: this.lang,
        currency: this.currency,
        acceptpartialpayment: this.acceptmultipayment,
        payerphone: this.payerphone,
        payereremail: this.payeremail
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
        this.hasAttribute('currency')&&
        this.hasAttribute('amount');
    }

    loadIframe(data) {
      this.iframe.src = data.fulllurl;
    }

    handlePayementEvents() {
      (function () {
        function handlerEvent($message) {
          switch ($message.data.event) {
            case 'OnPaymentStart': {
              this.onPaymentStart.detail.data=$message.data.body;
              this.dispatchEvent(this.onPaymentStart);
              break;
            }
            case 'OnPaymentComplete': {
              this.onPaymentComplete.detail.data=$message.data.body;
              this.dispatchEvent(this.onPaymentComplete);
              break;
            }
            case 'OnPaymentCancel': {
              this.onPaymentCancel.detail.data=$message.data.body;
              this.dispatchEvent(this.onPaymentCancel);
              break;
            }
          }
        }
        window.addEventListener("message", handlerEvent, false);
      })();
    }
    static get observedAttributes() {
      return ['apikey','serviceid','orderid','amount','currency','lang','acceptmultipayment','payerphone','payeremail'];
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
    set lang(lang) {
      this.setAttribute('lang', lang);
    }
    set acceptmultipayment(accept_multipayment) {
      this.setAttribute('acceptmultipayment', accept_multipayment);
    }
    set payerphone(payer_phone) {
      this.setAttribute('payerphone', payer_phone);
    }
    set payeremail(payeremail) {
      this.setAttribute('payeremail', payeremail);
    }

    disconnectedCallback() {
    }
  }
  window.customElements.define('payment-frame', PaymentFrame);
})();
