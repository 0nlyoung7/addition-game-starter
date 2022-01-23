import Caver from "caver-js";
import {Spinner} from "spin.js";

const config = {
  rpcURL: "https://api.baobab.klaytn.net:8651"
}

const cav = new Caver(config.rpcURL);
const agContract = new cav.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);

const App = {
  auth: {
    accessType: 'keystore',
    keystore: '',
    password: ''
  },
  start: async function () {
    // 세션을 통해 인증한적 있는지 확인해야한다
    var walletFromSession = sessionStorage.getItem("walletInstance")
    if (walletFromSession) {
      try {
        var parsedInstance = JSON.parse(walletFromSession)
        cav.klay.accounts.wallet.add(parsedInstance)
        this.changeUI(parsedInstance)
      } catch (err) {
        console.log(err);
        sessionStorage.removeItem("walletInstance")
      }
    }
  },

  handleImport: async function () {
    const fileReader = new FileReader();
    fileReader.readAsText(event.target.files[0]);
    fileReader.onload = (event) => {
      try {
        if (!this.checkValidKeystore(event.target.result)) {
          $('#message').text('유효하지 않은 keystore 파일입니다.');
          return;
        }

        this.auth.keystore = event.target.result;
        $('#message').text('keystore 통과. 비밀번호를 입력하세요.');
        document.querySelector('#input-password').focus();
      } catch (err) {
        $('#message').text('유효하지 않은 keystore 파일입니다.');
      }
    }
  },

  handlePassword: async function () {
    this.auth.password = event.target.value;
  },

  handleLogin: async function () {
    if(this.auth.accessType === 'keystore') {
      try {
        // 비밀키 가져오기
        const privateKey = cav.klay.accounts.decrypt(this.auth.keystore, this.auth.password).privateKey;
        this.integrateWallet(privateKey)
      } catch (e) {
        console.log(e);
        $('#message').text('비밀번호가 일치하지 않습니다.');
      }
    }
  },

  handleLogout: async function () {
    this.removeWallet();
    location.reload();
  },

  generateNumbers: async function () {

  },

  submitAnswer: async function () {

  },

  deposit: async function () {
    var spinner = this.showSpinner();
    const walletInstance = this.getWallet();
    if (walletInstance) {
      // contract 배포한 계정인지 비교
      if (await this.callOwner() !== cav.utils.toChecksumAddress(walletInstance.address) ) {
        return;
      } else {
        var amount = $('#amount').val();
        if (amount) {
          try {
            var trx = await agContract.methods.deposit().send({
              from: walletInstance.address,
              gas: '250000',
              value: cav.utils.toPeb(amount, 'KLAY') 
            })

            if (trx.transactionHash && trx.blockNumber) {
              alert(amount + " KLAY를 컨트랙에 송금했습니다.");
            }
            location.reload();
          } catch (err) {
            alert(error.message);
          }

          /** 
          .on('transactionHash', (txHash) => {
            console.log(`txHash : ${txHash}`);
          })
          .on('receipt', (receipt) => {
            console.log(`${receipt.blockNumbr}`, receipt);
            alert(amout + " KLAY를 컨트랙에 송금했습니다.");
            location.reload();
          })
          .on('error', (error) => {
            alert(error.message);
          });
          */
        }
        return
      } 
    }
  },

  callOwner: async function () {
    return await agContract.methods.owner().call();
  },

  callContractBalance: async function () {
    return await agContract.methods.getBalance().call();
  },

  getWallet: function () {
    if (cav.klay.accounts.wallet.length) {
      // 로그인 되어 있는 계정을 리턴
      return cav.klay.accounts.wallet[0];
    }
  },

  checkValidKeystore: function (keystore) {
    const parsedKeystore = JSON.parse(keystore);
    const isValidKeystore = parsedKeystore.version && parsedKeystore.id && parsedKeystore.address && parsedKeystore.keyring
    return isValidKeystore;
  },

  integrateWallet: function (privateKey) {
    const walletInstance = cav.klay.accounts.privateKeyToAccount(privateKey);
    // wallet 에 계정 추가하기
    cav.klay.accounts.wallet.add(walletInstance)
    sessionStorage.setItem('walletInstance', JSON.stringify(walletInstance));
    this.changeUI(walletInstance)
  },

  reset: function () {
    this.auth = {
      keystore: '',
      password: ''
    }
  },

  changeUI: async function (walletInstance) {
    $("#loginModal").modal("hide");
    $("#login").hide();
    $("#logout").show();
    $("#address").append("<br><p>내계정 주소 :"+walletInstance.address+"</p>")
    $("#contractBalance").append("<p>이벤트 잔액 :"+cav.utils.fromPeb(await this.callContractBalance(), "KLAY") + " KLAY" + "</p>");

    // toChecksumAddress 로 비교해야한다. 대소문자 구분이 생기기 때문
    if (await this.callOwner() === cav.utils.toChecksumAddress(walletInstance.address)) {
      $("#owner").show();
    }
  },

  removeWallet: function () {
    sessionStorage.removeItem("walletInstance");
    this.reset();
  },

  showTimer: function () {

  },

  showSpinner: function () {
    var target = document.getElementById("spin");
    return new Spinner(opts).spin(target);
  },

  receiveKlay: function () {

  }
};

window.App = App;

window.addEventListener("load", function () {
  App.start();
});

var opts = {
  lines: 10, // The number of lines to draw
  length: 30, // The length of each line
  width: 17, // The line thickness
  radius: 45, // The radius of the inner circle
  scale: 1, // Scales overall size of the spinner
  corners: 1, // Corner roundness (0..1)
  color: '#5bc0de', // CSS color or array of colors
  fadeColor: 'transparent', // CSS color or array of colors
  speed: 1, // Rounds per second
  rotate: 0, // The rotation offset
  animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
  direction: 1, // 1: clockwise, -1: counterclockwise
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  className: 'spinner', // The CSS class to assign to the spinner
  top: '50%', // Top position relative to parent
  left: '50%', // Left position relative to parent
  shadow: '0 0 1px transparent', // Box-shadow for the lines
  position: 'absolute' // Element positioning
};