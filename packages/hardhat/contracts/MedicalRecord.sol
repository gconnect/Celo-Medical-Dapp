// SPDX-License-Identifier:GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/utils/Counters.sol";

contract MedicalRecord {

    struct PatientMedicalReport {
        uint256 reportId;
        address patientWalletAddress;
        string testResult;
        bytes32 txHash;
        uint256 dateCreated;
    }

    event LogPatientMedicalReport(
        address patientWalletAddress,
        string testResult,
        bytes32 txHash,
        uint256 dateCreated
    );

    struct PatientData {
        uint256 id;
        address patientWalletAddress;
        string patientIPFSHash;
        string [] reports;
        bytes32 txHash;
        uint256 dateCreated;
    }
    
    event LogPatientData(
        uint256 id,
        address patientWalletAddress,
        string patientIPFSHash,
        bytes32 txHash,
        uint256 dateCreated
    );
   
    uint256 public patientCount;
    uint256 public reportCount;
    PatientData [] public patients;
    PatientMedicalReport [] public patientReports;
    
    address public owner;
    mapping(address => PatientData) patientMap;
    mapping(address => PatientMedicalReport) reportMap;
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
        require(bytes(_patientIPFSHash).length > 0, "IPFS Hash required");
        PatientData storage patient = patientMap[_patientWalletAddress];
        string[] memory arr;
        bytes32 txHash = blockhash(block.number);
        uint256 dateCreated = block.timestamp;
        patient.reports = arr;
        patient.id = patientCount;
        patient.txHash = blockhash(block.number);
        patient.dateCreated = block.timestamp;
        patient.patientWalletAddress = _patientWalletAddress;
        patient.patientIPFSHash = _patientIPFSHash;
    
        patients.push(PatientData(patientCount, _patientWalletAddress, _patientIPFSHash, arr, txHash, dateCreated));
        isExist[_patientWalletAddress] = true;
        patientCount++;
        emit LogPatientData(patientCount, _patientWalletAddress, _patientIPFSHash, txHash, dateCreated);
    }

    function addHash(bytes32 hash) public {
        uint256 previousIndex = 1;
        require(patientCount > 0, "No previous transaction exists");
        PatientData storage pd = patients[patientCount - previousIndex];
        pd.txHash = hash;
    }

    function getAllpatients() public view returns(PatientData [] memory){
        return patients;
    }

    function getPatientData(address _patientAddress) public contractOwnerOrDataOwner(_patientAddress) 
        view returns(  
        uint256 id,
        address patientWalletAddress,
        string memory patientIPFSHash,
        string [] memory testResult,
        bytes32 txHash,
        uint256 dateCreated
        ){
            return (
                patientMap[_patientAddress].id,
                patientMap[_patientAddress].patientWalletAddress,
                patientMap[_patientAddress].patientIPFSHash,
                patientMap[_patientAddress].reports,
                patientMap[_patientAddress].txHash,
                patientMap[_patientAddress].dateCreated
            );
    }


    function addPatientMedicalReport( uint256 index, address _address, string memory _testResult) public{
        require(patientMap[_address].patientWalletAddress == _address, "Patient does not exist");
        require(patients[index].patientWalletAddress == _address, "Address does. not correspond with the index");
        PatientData storage patient = patientMap[_address];
        patient.reports.push(_testResult);
        patients[index].reports.push(_testResult);
        bytes32 txHash = blockhash(block.number);

        // store report data in the reportmap
        PatientMedicalReport storage report = reportMap[_address];
        report.reportId = reportCount;
        report.patientWalletAddress = _address;
        report.testResult = _testResult;
        report.txHash = txHash;
        report.dateCreated = block.timestamp;

        patientReports.push(PatientMedicalReport(reportCount, _address, _testResult, txHash, block.timestamp));
        reportCount++;
    }


    function getPatientTestResults() public view returns(PatientMedicalReport [] memory){
        return patientReports;
    }


    function getPatientReport(address _patientAddress) public contractOwnerOrDataOwner(_patientAddress) 
     view returns(
        address patientWalletAddress, 
        string [] memory testResult, 
        bytes32 _txHash, 
        uint256 _dateCreated
        ) {
        return(
            reportMap[_patientAddress].patientWalletAddress,
            patientMap[_patientAddress].reports,
            reportMap[_patientAddress].txHash,
            reportMap[_patientAddress].dateCreated
        );
    }
}