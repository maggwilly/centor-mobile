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
      this.onPaymentStart = new CustomEvent('onPaymentStart',{cancelable: true, detail:{data:''}});
      this.onPaymentComplete = new CustomEvent('onPaymentComplete',{cancelable: true, detail:{data:''}});
      this.onPaymentCancel = new CustomEvent('onPaymentCancel',{cancelable: true, detail:{data:''}});
      this.onFrameError = new CustomEvent('onFrameError',{cancelable: true, detail:{data:''}});
    }

    connectedCallback() {
      this.showLoading();
      this.handlePayementEvents();
    }

    showLoading() {
      let html = `<html>
<head>
<style>
.box {
  display: flex;
  align-items: center;
  justify-content: center;
}
.loader {
  border: 16px solid #f3f3f3;
  border-radius: 50%;
  border-top: 16px solid #3498db;
  width: 60px;
  height: 60px;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
}
/* Safari */
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
</head>
<body class="box">
<div class="loader"></div>
</body>
</html>`;
      const blob = new Blob([html], {type: 'text/html'});
      this.iframe.src = window.URL.createObjectURL(blob);
    }

    showErrorsMessage(err) {
      let message = err.message || 'Unable to initialize payment.';
      let html =
        `<html>  
        <head>  
            <style>  
                body {  
                    font-family: -apple-system, ubuntu, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;  
                    color: #414141;  
                    background: #ecf0f1;  
                }  
                #failure path {  
                    fill: #e74c3c;  
                }  
                h3 {  
                    font-weight: normal;  
                }  
                .card {  
                    background: #fff;  
                    width: 90% ; height: 50%;  
                    margin: 20% auto; padding-top: 57px;  
                    text-align: center;  
                }
                .msg-txt{
                  width: 80%;
                  margin: auto;
                  font: 17px  ubuntu, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
                  line-height: 1.6;
                }  
            </style>  
        </head>  
        </head>  
        <body><div id="failure" class="card">  
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 16.538l-4.592-4.548 4.546-4.587-1.416-1.403-4.545 4.589-4.588-4.543-1.405 1.405 4.593 4.552-4.547 4.592 1.405 1.405 4.555-4.596 4.591 4.55 1.403-1.416z"/></svg>  
            <h2>Error</h2>  
            <p class="msg-txt">${message}.</p>  
        </div>  
        </body>  
        </html>`;
      const blob = new Blob([html], {type: 'text/html'});
      this.iframe.src = window.URL.createObjectURL(blob);
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
        console.log(body);
        (function () {
          fetch(`${portal_api_base_url}/api/v1/payment-requests/embedded`, {
            method: "post",
            body: body ,
            headers: {'Content-Type': 'application/json','Api-key': `${apikey}`}
          }).then(function (response) {
            console.log(response.ok);
             return  response.json().then(function (data) {
               if(response.ok) {
                 self.loadIframe(data, self);
               }else self.showErrorsMessage(data);
              });
          }).catch(err => {
            self.showErrorsMessage(err);
            self.onFrameError.detail.error=err;
            self.dispatchEvent(err);
          })
        })();
    }

    loadIframe(data) {
      this.iframe.src = data.fullUrl;
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
  window.customElements.define('payment-frame', PaymentFrame);
})();
