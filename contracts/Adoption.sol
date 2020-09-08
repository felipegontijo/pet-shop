pragma solidity ^0.5.0;

contract Adoption {
    address[16] public adopters; // an array of ethereum addresses of length 16

    // In solidity the types of both the function parameters and output must be specified
    function adopt(uint petId) public returns (uint) {
        require(petId >= 0 && petId <= 15); // ensure petId is in the range of our adopters array
        adopters[petId] = msg.sender; // msg.sender denotes the address which called this function
        return petId;
    }
    // view means the function will not modify the state of the contract
    function getAdopters() public view returns (address[16] memory) { // memory gives the data location for the variable
        return adopters;
    }
}