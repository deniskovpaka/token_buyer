//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract ERC20Token {
    string public name = "ERC20 Token";
    string public symbol = "ERC20";
    uint8 public decimals = 6;
    uint256 public totalSupply = 1000000000000; // 1 million ERC20Tokens

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) private allowed;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value);

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value);

    constructor() {
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value, "Not enought balance for transfering tokens");

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        console.log("Sender balance is %s tokens", balanceOf[msg.sender]);
        console.log("Transferred %s tokens to %s", _value, _to);

        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[_from] >= _value, "Not enought balance for transfering tokens");
        require(allowance(_from, msg.sender) >= _value, "Transfer from is not allowed");

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowed[_from][msg.sender] -= _value;
        console.log("Sender balance is %s tokens", balanceOf[_from]);
        console.log("Transferred to %s address %s tokens", _to, _value);

        emit Transfer(_from, _to, _value);

        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        console.log("Approved %s tokens for %s address", allowed[msg.sender][_spender], _spender);

        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
        console.log("Allowance for %s address is %s", _spender, allowed[_owner][_spender]);
        return allowed[_owner][_spender];
    }
}
