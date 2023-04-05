// SPDX-License-Identifier:GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/utils/Counters.sol";

contract MedicalRecord {

    using Counters for Counters.Counter;
    Counters.Counter public patientId;

    struct PatientData {
        uint256 id;
        address patientWalletAddress;
        string patientIPFSHash;
        string [] reports;

    }
    
    event LogPatientData(
        uint256 id,
        address patientWalletAddress,
        string patientIPFSHash
    );


    struct PatientMedicalReport {
        address patientWalletAddress;
        string testResult;
    }


    event LogPatientMedicalReport(
        address patientWalletAddress,
        string testResult
    );
   
    uint256 public patientCount;

    PatientData [] public patients;
    PatientMedicalReport [] public patientReports;

    address public owner;
    mapping(address => bool) public isExist;

    constructor(){
       owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    modifier contractOwnerOrDataOwner(address dataOwner) {
        require(msg.sender == owner || msg.sender == dataOwner, "You are not the owner");
        _; 
    }

    function addPatient( 
        address _patientWalletAddress,
        string memory _patientIPFSHash
        
        ) public onlyOwner{
        require(!isExist[_patientWalletAddress], "Patient record already exist");
        uint256 _id = patientId.current();
        string[] memory arr;
        patients.push(PatientData(_id,_patientWalletAddress, _patientIPFSHash, arr));
        patientId.increment();
        isExist[_patientWalletAddress];
        emit LogPatientData(patientCount, _patientWalletAddress, _patientIPFSHash);
    }

    function getAllpatients() public view onlyOwner returns(PatientData [] memory){
        return patients;
    }

    function getPatientData(uint256 _index, address _patientAddress) public contractOwnerOrDataOwner(_patientAddress) 
        view returns(  
        uint256 id,
        address patientWalletAddress,
        string memory patientIPFSHash,
        string [] memory testResult
        ){
            return (
                patients[_index].id,
                patients[_index].patientWalletAddress,
                patients[_index].patientIPFSHash,
                patients[_index].reports
            );
    }

    function addPatientMedicalReport(address _patientWalletAddress, string memory _testResult) public onlyOwner{
        bool patientExists = false;
        for (uint256 i = 0; i < patients.length; i++) {
        if (patients[i].patientWalletAddress == _patientWalletAddress) {
            patientExists = true;
            patients[i].reports.push(_testResult);
            emit LogPatientMedicalReport(_patientWalletAddress, _testResult);
            }
        }
        require(patientExists, "Patient record does not exist");
        patientReports.push(PatientMedicalReport(_patientWalletAddress, _testResult));
    }

     function getPatientTestResults() public onlyOwner view returns(PatientMedicalReport [] memory){
        return patientReports;
    }

    function getPatientReport(uint256 _index, address _patientAddress) public contractOwnerOrDataOwner(_patientAddress) view returns(address patientWalletAddress, string[] memory testResult) {
        return(
            patientReports[_index].patientWalletAddress,
            patients[_index].reports
        );
    }
}