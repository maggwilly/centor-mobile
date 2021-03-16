const portal_api_base_url = "http://api.paygarde.com";
(function() {
  const template = document.createElement('template');
  template.innerHTML =`<style>
  .body-container {
    font-family: -apple-system, ubuntu, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    color: #414141;
    background: #c1d8f1;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #failure path {
    fill: #e74c3c;
  }

  h3 {
    font-weight: normal;
  }

  .card {
    background: #e6ecf1;
    width: 76%;
    height: 37%;
    margin:  auto;
    border-radius: 6px;
    padding-top: 57px;
    text-align: center;
  }

  .msg-txt {
    width: 80%;
    margin: auto;
    font: 17px ubuntu, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    line-height: 1.6;
  }
</style>
<style>
  iframe {
    border: none;
    z-index: 999;
    width: 400px;
    height: 100%
  }

  @media only screen and (max-width: 900px) {
    iframe {
      width: 100%;
      height: 100%;
    }
  }
</style>
<style>
  .loading-box {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
  }

.loader,
.loader:before,
.loader:after {
  border-radius: 50%;
  width: 2.5em;
  height: 2.5em;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation: load7 1.8s infinite ease-in-out;
  animation: load7 1.8s infinite ease-in-out;
}
.loader {
  color: #a5a1a1;
  font-size: 10px;
  margin: 80px auto;
  position: relative;
  text-indent: -9999em;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}
.loader:before,
.loader:after {
  content: '';
  position: absolute;
  top: 0;
}
.loader:before {
  left: -3.5em;
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}
.loader:after {
  left: 3.5em;
}
@-webkit-keyframes load7 {
  0%,
  80%,
  100% {
    box-shadow: 0 2.5em 0 -1.3em;
  }
  40% {
    box-shadow: 0 2.5em 0 0;
  }
}
@keyframes load7 {
  0%,
  80%,
  100% {
    box-shadow: 0 2.5em 0 -1.3em;
  }
  40% {
    box-shadow: 0 2.5em 0 0;
  }
}
</style>
<div class="loading-box" id="loading-box">
  <div class="loader"></div>
</div>`;
  class PaymentFrame extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this.onPaymentStart = new CustomEvent('onPaymentStart',{cancelable: true, detail:{data:''}});
      this.onPaymentComplete = new CustomEvent('onPaymentComplete',{cancelable: true, detail:{data:''}});
      this.onPaymentCancel = new CustomEvent('onPaymentCancel',{cancelable: true, detail:{data:''}});
      this.onFrameError = new CustomEvent('onFrameError',{cancelable: true, detail:{data:''}});
    }

    connectedCallback() {
      this.handlePayementEvents();
    }

    showErrorsMessage(err) {
      let message = err.message || 'Unable to initialize payment.';
      const errorTemplate = document.createElement('template');
      errorTemplate.innerHTML =
        ` <div class="body-container">
        <div id="failure" class="card">  
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 16.538l-4.592-4.548 4.546-4.587-1.416-1.403-4.545 4.589-4.588-4.543-1.405 1.405 4.593 4.552-4.547 4.592 1.405 1.405 4.555-4.596 4.591 4.55 1.403-1.416z"/></svg>  
            <h2>Error</h2>  
            <p class="msg-txt">${message}.</p>  
        </div>  
        </div>`;
      this.shadowRoot.removeChild(this.shadowRoot.getElementById("loading-box"));
      this.shadowRoot.appendChild(errorTemplate.content.cloneNode(true));
    }

    loadIframe(data) {
      const template = document.createElement('template');
      template.innerHTML = `<iframe  src="${data.fullUrl}" [scrolling]="true" allow="payment" name="paygarde-frame"></iframe>`;
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      let root=this.shadowRoot;
      this.shadowRoot.querySelector('iframe').addEventListener( "load", function(e) {
        root.removeChild(root.getElementById("loading-box"));
      });
    }

    getCkoutData() {
      return {
        serviceid: this.serviceid || '',
        orderid: this.orderid,
        amount: this.amount,
        lang: (this.lang || 'EN').slice(0,2).toUpperCase(),
        currency: (this.currency || 'XAF').toUpperCase(),
        country: (this.country || 'CM').slice(0,2).toUpperCase(),
        acceptpartialpayment: this.acceptmultipayment || false,
        payerphone: this.payerphone || '',
        payeremail: this.payeremail || '',
        primaryColor: this.primarycolor || 'default',
        viewMode: this.viewmode || 'full',
        collectpayergeneratlinfo: this.collectpayergeneratlinfo || false,
      };
    }


    checkProperties(obj) {
      for (var key in obj) {
        if (obj[key] === null)
          return false;
      }
      return true;
    }
    attributeChangedCallback(name, oldValue, newValue){
      let self=this;
        const apikey= this.apikey;
        const ckoutData = this.getCkoutData();
        if(!this.checkProperties(ckoutData) || apikey===null || this.hasAttribute('isloading'))
           return;
       this.setAttribute("isloading",true);
        let body = JSON.stringify(ckoutData);
        (function () {
          fetch(`${portal_api_base_url}/api/v1/payment-requests/embedded`, {
            method: "post",
            body: body ,
            headers: {'Content-Type': 'application/json','Api-key': `${apikey}`}
          }).then(function (response) {
             return  response.json().then(function (data) {
               if(response.ok) {
                 self.loadIframe(data, self);
               }else self.showErrorsMessage(data);
              });
          }).catch(err => {
           self.showErrorsMessage(err);
            self.onFrameError.detail.error=err;
            self.dispatchEvent(self.onFrameError);
          })
        })();
    }

    handlePayementEvents() {
      let self=this;
      (function () {
        function handlerEvent($message) {
          switch ($message.data.event) {
            case 'OnPaymentStart': {
              self.onPaymentStart.detail.data=$message.data.body;
              self.dispatchEvent(self.onPaymentStart);
              break;
            }
            case 'OnPaymentComplete': {
              self.onPaymentComplete.detail.data=$message.data.body;
              self.dispatchEvent(self.onPaymentComplete);
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
      return ['collectpayergeneratlinfo', 'apikey','serviceid','orderid','amount','currency','lang','payerphone','acceptmultipayment','payeremail','country'];
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
  window.customElements.define('pg-payment-form', PaymentFrame);
})();
