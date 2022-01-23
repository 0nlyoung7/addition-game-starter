// truffle.js config for klaytn.
const PrivateKeyConnector = require('connect-privkey-to-provider')
const NETWORK_ID = '1001' // 바오밥 전용 네트워크
const GASLIMIT = '20000000'
const URL = 'https://api.baobab.klaytn.net:8651' // 바오밥 API주소
const PRIVATE_KEY = '0x4b4870deded8bcb2394b41e1898e73da69d4651faaf43a0212136e0aa25fa025' // 바오밥 테스트용 키

module.exports = {
    networks: {
        klaytn: {
            provider: new PrivateKeyConnector(PRIVATE_KEY, URL),
            network_id: NETWORK_ID,
            gas: GASLIMIT,
            gasPrice: null,
        }

    },
}