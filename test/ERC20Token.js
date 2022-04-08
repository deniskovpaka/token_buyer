const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ERC20Token contract", () => {
    let tokenAmount = 20;
    let ERC20Token, erc20Token, addr1, addr2, addr3;

    beforeEach(async () => {
        ERC20Token = await ethers.getContractFactory("ERC20Token");
        [addr1, addr2, addr3, ...addrs] = await ethers.getSigners();
        erc20Token = await ERC20Token.connect(addr1).deploy();
    });

    describe("Deployment", () => {
        it("Should set the properties", async function () {
            expect(await erc20Token.name()).to.equal("ERC20 Token");
            expect(await erc20Token.symbol()).to.equal("ERC20");
            let decimals = 6;
            expect(await erc20Token.decimals()).to.equal(decimals);
            let totalSupply = "1000000000000"; // 1 million ERC20Tokens
            expect(await erc20Token.totalSupply()).to.equal(totalSupply);
            expect(await erc20Token.balanceOf(addr1.address)).to.equal(totalSupply);
        });
    });

    describe("Transfer", () => {
        it("Not enought balance for transfering tokens", async function () {
            const initialBalance = await erc20Token.balanceOf(addr1.address);
            await expect(erc20Token.connect(addr2).transfer(addr1.address, tokenAmount))
                .to.be.revertedWith("Not enought balance for transfering tokens");
            expect(await erc20Token.balanceOf(addr1.address)).to.equal(initialBalance);
        });

        it("Successfull transfer", async function () {
            await erc20Token.transfer(addr2.address, tokenAmount);
            expect(await erc20Token.balanceOf(addr2.address)).to.equal(tokenAmount);
        });

        it("Transfer emit event catch", async function () {
            await expect(erc20Token.transfer(addr2.address, tokenAmount))
              .to.emit(erc20Token, "Transfer")
              .withArgs(addr1.address, addr2.address, tokenAmount)
        });
    });

    describe("TransferFrom", () => {
        let initialBalance;

        it("Not enought balance for transfering tokens", async function () {
            initialBalance = await erc20Token.balanceOf(addr2.address);
            await erc20Token.connect(addr2).approve(addr3.address, tokenAmount);
            await expect(erc20Token.connect(addr3).transferFrom(
              addr2.address,
              addr1.address,
              tokenAmount))
                .to.be.revertedWith("Not enought balance for transfering tokens");
            expect(await erc20Token.balanceOf(addr2.address)).to.equal(initialBalance);
        });

        it("Transfer from is not allowed", async function () {
            await expect(erc20Token.transfer(addr2.address, tokenAmount));
            initialBalance = await erc20Token.balanceOf(addr2.address);
            await erc20Token.connect(addr2).approve(addr3.address, tokenAmount - 10);

            await expect(erc20Token.connect(addr3).transferFrom(
              addr2.address,
              addr1.address,
              tokenAmount))
                .to.be.revertedWith("Transfer from is not allowed");
            expect(await erc20Token.balanceOf(addr2.address)).to.equal(initialBalance);
        });

        it("Successfull transferFrom", async function () {
            await erc20Token.connect(addr1).approve(addr3.address, tokenAmount);
            await erc20Token.connect(addr3).transferFrom(addr1.address, addr2.address, tokenAmount);
            expect(await erc20Token.balanceOf(addr2.address)).to.equal(tokenAmount);
        });

        it("TransferFrom emit event catch", async function () {
            await erc20Token.connect(addr1).approve(addr3.address, tokenAmount);
            await expect(erc20Token.connect(addr3).transferFrom(addr1.address, addr2.address, tokenAmount))
              .to.emit(erc20Token, "Transfer")
              .withArgs(addr1.address, addr2.address, tokenAmount);
        });
    });

    describe("Approve", () => {
        it("Approval emit event catch", async function () {
            await expect(erc20Token.connect(addr1).approve(addr3.address, tokenAmount))
            .to.emit(erc20Token, "Approval")
            .withArgs(addr1.address, addr3.address, tokenAmount);
        });

        it("Successfull approval", async function () {
            await erc20Token.connect(addr1).approve(addr3.address, tokenAmount);
            expect(await erc20Token.allowance(addr1.address, addr3.address)).to.equal(tokenAmount);
        });
    });
});