const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");
const fs = require("fs");

async function main() {
    const [signer] = await ethers.getSigners();
    console.log(`Deploying contracts with the account: ${signer.address}`);

    const ERC20Token = await ethers.getContractFactory("ERC20Token");
    const erc20Token = await ERC20Token.connect(signer).deploy();
    console.log(`ERC20Token address: ${erc20Token.address}`);

    const TokenBuyer = await ethers.getContractFactory("TokenBuyer");
    const tokenBuyer = await TokenBuyer.connect(signer).deploy(erc20Token.address);
    console.log(`TokenBuyer address: ${tokenBuyer.address}`);

    let totalSupply = BigNumber.from(1000000);
    await erc20Token.transfer(tokenBuyer.address, totalSupply);
    console.log(`TokenBuyer balance: ${await erc20Token.balanceOf(tokenBuyer.address)}`)

    const data = {
        address: tokenBuyer.address,
        abi: JSON.parse(tokenBuyer.interface.format('json'))
    };
    fs.writeFileSync("frontend/src/TokenBuyer.json", JSON.stringify(data));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
