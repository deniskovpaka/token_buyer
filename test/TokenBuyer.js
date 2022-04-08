const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ERC20Token contract", () => {
    let tokenAmount = 20;
    let tokensAvailable = 1000;
    let ERC20Token, erc20Token, TokenBuyer, tokenBuyer, addr1, addr2, addr3; 

    beforeEach(async () => {
        ERC20Token = await ethers.getContractFactory("ERC20Token");
        [addr1, addr2, addr3, ...addrs] = await ethers.getSigners();
        erc20Token = await ERC20Token.connect(addr1).deploy();

        TokenBuyer = await ethers.getContractFactory("TokenBuyer");
        tokenBuyer = await TokenBuyer.deploy(erc20Token.address);
    });

    describe("Deployment", () => {
        it("Should set the properties", async function () {
            expect(await tokenBuyer.tokensSold()).to.equal(0);
        });
    });

    describe("Buy", () => {
        it("Not enought balance for buying tokens", async function () {
        await expect(tokenBuyer.connect(addr2).buy(tokenAmount))
            .to.be.revertedWith("Not enought balance for buying tokens");
        });

        it("Successfull buy", async function () {
            await erc20Token.connect(addr1).transfer(tokenBuyer.address, tokensAvailable);
            expect(await erc20Token.balanceOf(tokenBuyer.address)).to.equal(tokensAvailable);

            await tokenBuyer.connect(addr2).buy(tokenAmount);
            expect(await erc20Token.balanceOf(tokenBuyer.address)).to.equal(tokensAvailable - tokenAmount);
            expect(await erc20Token.balanceOf(addr2.address)).to.equal(tokenAmount);
            expect(await tokenBuyer.tokensSold()).to.equal(tokenAmount);
        });

        it("Buy emit event catch", async function () {
            await erc20Token.connect(addr1).transfer(tokenBuyer.address, tokensAvailable);

            await expect(tokenBuyer.connect(addr2).buy(tokenAmount))
                .to.emit(tokenBuyer, "Buy")
                .withArgs(addr2.address, tokenAmount);
        });
    });
});
