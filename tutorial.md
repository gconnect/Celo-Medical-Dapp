Build a Decentralized Medical DApp Using React Celo and IPFS Storage

Introduction​
Decentralized applications (Dapps) are becoming more and more popular, and one of the most promising use cases is in the healthcare industry. In this tutorial, we will be building a decentralized medical DApp using React, Celo, and IPFS storage. We will be using the MedicalRecord smart contract written in Solidity to store patient data and medical reports. 

The DApp will allow the admin or clinical personnel  to securely store patients medical records on the Celo blockchain, and clinical admin can add medical reports to the patient's records. We will be using IPFS for decentralized storage of patient records and the IPFS has stored on the blockchain.

We will use Next.js for the frontend, Hardhat for smart contract development and deployment, Celo Composer for blockchain integration, and IPFS for file storage.

Prerequisites​
To successfully follow along in this tutorial you need basic knowledge of:
HTML, CSS, React and Next.js
Blockchain, solidity and hardhat
Celo Alfajores account
IPFS decentralized storage 
Requirements​
To build this DApp we will need the following tools:

Vscode - But you can use any code editor of your choice
Hardhat - used to deploy the smart contract
Alfajores Testnet Account - required to connect to the dApp and make test transactions
Node - an open-source, cross-platform JavaScript runtime environment
Celo Composer - starter project with all code needed to build, deploy, and upgrade a dapps on Celo.
Celo Wallet Extension / Metamask -  For interacting with the Celo blockchain
Pinta IPFS - Decentralized storage

Let’s Get Started

In this tutorial, we will build a Dapp that allows clinical admin to create and manage the medical records of patients. The Dapp will have the following smart contract features:

Clinical admin can create a new medical record by uploading a file to IPFS and storing its hash on the Celo blockchain
Clinical admin can add medical reports to the existing records
Patients can view their medical records and reports
Only the patient and the contract owner can view the medical records and reports of the patient
Only the admin fetch all clinical record added

We will also be building the frontend for the Dapp. To do this we will be using Celo Composer. celo-composer is a starter project with all code needed to build, deploy, and upgrade a dapps on Celo. We will be building both the smart contract and frontend using Celo Composer.

Step 1: Setup the Project

First, let's set up our project. Create a new directory and run the following commands and follow the steps
npx @celo/celo-composer@latest create

Select React, Tailwind css and React-Celo option and then enter your project name. For detail on the steps checkout the Celo Composer github readme page.

Once you have successfully completed the steps do npm install or yarn to install all required dependencies. Once that is done you are ready to start building.

Now open your newly created project. You will see a packages folder inside the package folder you will see hardhat and react-app folder.

For security reasons in order not to expose your private keys to the public create a Create a new file named .env in the root of the hardhat folder add this line of code:

PRIVATE KEY = <YOUR PRIVATE KEY>

At the root of the react-app folder create a .env file and add this line of code:
NEXT_PUBLIC_PINATA_JWT_TOKEN = <YOUR TOKEN>

Step 2: Write the Smart Contract

Now, let's write the smart contract. The smart contract is written using solidity. Create a new file named MedicalRecord.sol in the contracts directory of the hardhat folder and add the following code:

```js
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


   struct PatientMedicalReport {
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
       require(isExist[_patientWalletAddress] != true, "Patient record already exist");
       require(bytes(_patientIPFSHash).length > 0, "IPFS Hash required");
       uint256 _id = patientId.current();
       string[] memory arr;
       bytes32 txHash = blockhash(block.number);
       uint256 dateCreated = block.timestamp;
       patients.push(PatientData(_id,_patientWalletAddress, _patientIPFSHash, arr, txHash, dateCreated));
       patientId.increment();
       isExist[_patientWalletAddress] = true;
       emit LogPatientData(patientCount, _patientWalletAddress, _patientIPFSHash, txHash, dateCreated);
   }

   function addHash(bytes32 hash) public {
       uint256 previousIndex = 1;
       uint256 currentCounter = patientId.current();
       require(currentCounter > 0, "No previous transaction exists");
       PatientData storage pd = patients[currentCounter - previousIndex];
       pd.txHash = hash;
   }

   function getAllpatients() public view onlyOwner returns(PatientData [] memory){
       return patients;
   }

   function getPatientData(uint256 _index, address _patientAddress) public contractOwnerOrDataOwner(_patientAddress)
       view returns( 
       uint256 id,
       address patientWalletAddress,
       string memory patientIPFSHash,
       string [] memory testResult,
       bytes32 txHash,
       uint256 dateCreated
       ){
           return (
               patients[_index].id,
               patients[_index].patientWalletAddress,
               patients[_index].patientIPFSHash,
               patients[_index].reports,
               patients[_index].txHash,
               patients[_index].dateCreated
           );
   }

   function addPatientMedicalReport(address _patientWalletAddress, string memory _testResult) public onlyOwner{
       require(bytes(_testResult).length > 0, "Enter a valid test result");
       bool patientExists = false;
       bytes32 txHash = blockhash(block.number);
       uint256 dateCreated = block.timestamp;
       for (uint256 i = 0; i < patients.length; i++) {
       if (patients[i].patientWalletAddress == _patientWalletAddress) {
           patientExists = true;
           patients[i].reports.push(_testResult);
           emit LogPatientMedicalReport(_patientWalletAddress, _testResult, txHash, dateCreated);
           }
       }
       require(patientExists, "Patient record does not exist");
       patientReports.push(PatientMedicalReport(_patientWalletAddress, _testResult, txHash, dateCreated));
   }

    function getPatientTestResults() public onlyOwner view returns(PatientMedicalReport [] memory){
       return patientReports;
   }

   function getPatientReport(uint256 _index, address _patientAddress) public contractOwnerOrDataOwner(_patientAddress) view returns(address patientWalletAddress, string[] memory testResult, bytes32 _txHash, uint256 _dateCreated) {
       return(
           patientReports[_index].patientWalletAddress,
           patients[_index].reports,
           patientReports[_index].txHash,
           patientReports[_index].dateCreated
       );
   }
}
```
Here is a detailed breakdown of what the above smart contract code does;

The first line indicates the license under which the code is distributed.
// SPDX-License-Identifier: GPL-3.0

The next line specifies the version of Solidity being used.
pragma solidity >=0.7.0 <0.9.0;

The Counters library from OpenZeppelin is imported to enable us to generate unique patient IDs.

import "@openzeppelin/contracts/utils/Counters.sol";

The MedicalRecord contract is defined, which will store medical records of patients.
contract MedicalRecord {}

The Counters library is used to create a counter to generate unique patient IDs.

```js
using Counters for Counters.Counter;
Counters.Counter public patientId;
```

A struct PatientData is defined which will store patient data, including the patient ID, the patient's wallet address, the IPFS hash of the patient's medical records, an array of medical reports, the transaction hash and the date created.

```js
struct PatientData {
    uint256 id;
    address patientWalletAddress;
    string patientIPFSHash;
    string [] reports;
    bytes32 txHash;
    uint256 dateCreated;
}
```
An event LogPatientData is defined which will be triggered when patient data is added.

```js
event LogPatientData(
    uint256 id,
    address patientWalletAddress,
    string patientIPFSHash,
    bytes32 txHash,
    uint256 dateCreated
);
```

Another struct PatientMedicalReport is defined which will store patient medical reports, including the patient's wallet address, the test result, the transaction hash and the date created.

```js
struct PatientMedicalReport {
    address patientWalletAddress;
    string testResult;
    bytes32 txHash;
    uint256 dateCreated;
}
```
An event LogPatientMedicalReport is defined which will be triggered when a patient medical report is added.

```js
event LogPatientMedicalReport(
    address patientWalletAddress,
    string testResult,
    bytes32 txHash,
    uint256 dateCreated
);
```

Two arrays are created, one for PatientData and one for PatientMedicalReport.

```js
PatientData [] public patients;
PatientMedicalReport [] public patientReports;
```

The contract owner's address is stored in the owner variable and a mapping is created to check if a patient exists.

```js
address public owner;
mapping(address => bool) public isExist;
```

The contract constructor is defined, which sets the owner variable to the address of the contract creator.

```js
constructor(){
   owner = msg.sender;
}
```

A modifier onlyOwner is defined, which will only allow the contract owner to execute certain functions.
```js
modifier onlyOwner {
    require(msg.sender == owner, "You are not the owner");
    _;
}
```

Another modifier contractOwnerOrDataOwner is defined, which will allow either the contract owner or the patient whose data is being accessed to execute certain functions.

```js
modifier contractOwnerOrDataOwner(address dataOwner) {
    require(msg.sender == owner || msg.sender == dataOwner, "You are not the owner");
    _; 
}
```	

A function addPatient is defined, which allows the contract owner to add patient data. It takes the patient's wallet address and the IPFS hash of the medical records as parameters. It checks if the patient record already exists, and if not, adds the patient data to the patients array and triggers the `Log

```js
function addPatient(
       address _patientWalletAddress,
       string memory _patientIPFSHash
      
       ) public onlyOwner{
       require(isExist[_patientWalletAddress] != true, "Patient record already exist");
       require(bytes(_patientIPFSHash).length > 0, "IPFS Hash required");
       uint256 _id = patientId.current();
       string[] memory arr;
       bytes32 txHash = blockhash(block.number);
       uint256 dateCreated = block.timestamp;
       patients.push(PatientData(_id,_patientWalletAddress, _patientIPFSHash, arr, txHash, dateCreated));
       patientId.increment();
       isExist[_patientWalletAddress] = true;
       emit LogPatientData(patientCount, _patientWalletAddress, _patientIPFSHash, txHash, dateCreated);
   }
```



Step 2: Build the Frontend

Conclusion​
Congratulations 🎉 on finishing this tutorial! Thank you for taking the time to complete it. In this tutorial, you have learned how to create a full stack dApp using Celo Composer and Solidity.

To have access to the full codebase, here is the link to the project repo on github.
Next Step
About the Author​
Glory Agatevure is a blockchain engineer, technical writer, and co-founder of Africinnovate. You can connect with me on Linkedin, Twitter and Github.
References​
https://github.com/celo-org/celo-composer




