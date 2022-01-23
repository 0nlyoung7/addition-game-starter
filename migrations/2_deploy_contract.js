const AdditionGame = artifacts.require('./AdditionGame.sol')
const fs = require('fs')

// 클레이튼 노드에 디플로이
module.exports = function (deployer) {
  deployer.deploy(AdditionGame).then( () => {
    if (AdditionGame._json) {
        // ABI 정보 저장 : 블록체인과 컨트랙간의 상호작용을 할 수 있는 내용
        fs.writeFile('deployedABI', JSON.stringify(AdditionGame._json.abi), (err) => {
            if (err) throw err;
            console.log('파일에 입력 성공')
        });

        // ABI 정보 저장 : 디플로이된 주소 정보 저장
        fs.writeFile('deployedAddress', AdditionGame.address, (err) => {
            if (err) throw err;
            console.log('파일에 주소 입력 성공')
        });
    }
  }) // 배포하기
}
