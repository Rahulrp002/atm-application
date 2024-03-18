// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;
    string constant PASSWORD = "rahul";

    event Deposit(uint256 amount);
    event InterestCalculated(uint256 principle, uint256 rate, uint256 time, uint256 interest);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns(uint256){
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        uint _previousBalance = balance;

        // make sure this is the owner
        require(msg.sender == owner, "You are not the owner of this account");

        // perform transaction
        balance += _amount;

        // assert transaction completed successfully
        assert(balance == _previousBalance + _amount);

        // emit the event
        emit Deposit(_amount);
    }

function withdraw(uint256 _amount) public {
    // make sure this is the owner
    require(msg.sender == owner, "You are not the owner of this account");
    
    // make sure the balance is sufficient
    require(_amount <= balance, "Insufficient balance");

    // perform transaction
    balance -= _amount;

    // transfer the funds
    owner.transfer(_amount);
}

    function checkPassword(string memory _password) public pure returns(bool) {
        return keccak256(abi.encodePacked(_password)) == keccak256(abi.encodePacked(PASSWORD));
    }

    function calculateInterest(uint256 _principle, uint256 _rate, uint256 _time) public pure returns(uint256) {
        return (_principle * _rate * _time) / 100;
    }
}
