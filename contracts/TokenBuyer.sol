//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "./ERC20Token.sol";
import "hardhat/console.sol";

contract TokenBuyer {
    uint256 public tokensSold;
    ERC20Token private erc20Token;

    event Buy(
        address indexed _recepient,
        uint256 _tokensAmount);

    constructor(ERC20Token _erc20Token) {
        erc20Token = _erc20Token;
    }

    function buy(uint256 _tokensAmount) public {
        console.log("TokensAmount %s", _tokensAmount);
        require(erc20Token.balanceOf(address(this)) >= _tokensAmount, "Not enought balance for buying tokens");
        require(erc20Token.transfer(msg.sender, _tokensAmount));
        console.log("Bought %s tokens for %s", _tokensAmount, msg.sender);

        tokensSold += _tokensAmount;

        emit Buy(msg.sender, _tokensAmount);
    }

    function getERC20TokenBalance() public view returns (uint256) {
        return erc20Token.balanceOf(address(this));
    }
}
