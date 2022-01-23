const Migrations = artifacts.require('./Migrations.sol')

// 클레이튼 노드에 디플로이
module.exports = function (deployer) {
  deployer.deploy(Migrations)
}
