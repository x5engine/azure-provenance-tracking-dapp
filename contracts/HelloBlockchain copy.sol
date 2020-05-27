// "SPDX-License-Identifier: MIT"
pragma solidity >=0.5.8 <0.6.9;

contract BlockchainRocks
{
     //Set of States
    enum StateType { Request, Respond }

    //List of properties
    StateType public  State;
    uint256 public callsCount;
    address public  Requestor;
    address public  Responder;

    string public RequestMessage;
    string public ResponseMessage;

    event StateChanged(string stateData);
    event ContractCallCounter(uint256 counter);

    // constructor function
    constructor(string memory message) public
    {
        RequestMessage = message;
        State = StateType.Request;

        emit StateChanged('Request');
    }

    // call this function to send a request
    function SendRequest(string memory requestMessage) public
    {
        Requestor = msg.sender;
        callsCount = callsCount + 1;
        RequestMessage = requestMessage;
        State = StateType.Request;
        emit ContractCallCounter(callsCount);
    }

    // call this function to send a response
    function SendResponse(string memory responseMessage) public
    {
        Responder = msg.sender;
        // call ContractUpdated() to record this action
        callsCount = callsCount + 1;
        ResponseMessage = responseMessage;
        State = StateType.Respond;

        emit StateChanged('Response');
        emit ContractCallCounter(callsCount);
    }
}