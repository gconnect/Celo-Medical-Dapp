import { QUERYPRAM, TESTQUERYPRAM } from "@/utils/Constants";
import axios from "axios";
import { JWT } from '@/utils/Constants';
var FormData = require('form-data');


// uploading image and extra meta data
export const pinFilesToPinata = async (image : string | File) => {
    const formData = new FormData();
    
    formData.append('file', image)
    
    const options = JSON.stringify({
      cidVersion: 0,
    })
    formData.append('pinataOptions', options);

    try{
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxBodyLength: Infinity,
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData.getboundary}`,
          Authorization: JWT
        }
      });
      console.log(res.data.IpfsHash);
      const ipfshHash = res.data.IpfsHash
      return {isSuccess: true, hash: ipfshHash}
    } catch (error) {
      console.log(error);
     return {isSuccess: false, error: error}
    }
  };
  
// Option 2 uploading json file
export const uploadJSONToIPFS  = async ( 
  image: string | undefined,
  fullName: string,
  phoneNumber: string,
  gender: string,
  patientWalletAddress: string,
  residentialAddress: string,
  maritalStatus: string,
  kFullName: string,
  kinContact: string,
  relationshipWithKin: string

) => {
  
      let data = JSON.stringify({
      "pinataOptions": {
        "cidVersion": 1
      },
      "pinataMetadata": {
        name: QUERYPRAM,
        keyvalues: {
          image,
          fullName,
          phoneNumber,
          gender,
          patientWalletAddress,
          residentialAddress,
          maritalStatus,
          kFullName,
          kinContact,
          relationshipWithKin
        }
      },
        "pinataContent": {
        image,
        fullName,
        phoneNumber,
        gender,
        patientWalletAddress,
        residentialAddress,
        maritalStatus,
        kFullName,
        kinContact,
        relationshipWithKin
      }
    });
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    //making axios POST request to Pinata ⬇️
  try {
    const response =  await axios 
        .post(url, data, {
          headers: {
                'Content-Type': 'application/json',
                Authorization: JWT
            }
        })
    return {
        isSuccess: true,
        pinataURL: response.data.IpfsHash
    }
  } catch (error) {
    console.log(error)
    return {
      error: error
    }
  }
  
};


// Patient Test result
export const uploadJSONTestResultToIPFS = async ( 
  patientWalletAddress: string,
  testResult: string,
) => {
  
      let data = JSON.stringify({
      "pinataOptions": {
        "cidVersion": 1
      },
      "pinataMetadata": {
        name: TESTQUERYPRAM,
        keyvalues: {
          patientWalletAddress,
          testResult
        }
      },
        "pinataContent": {
         patientWalletAddress,
         testResult
      }
    });
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    //making axios POST request to Pinata ⬇️
  try {
    const response =  await axios 
        .post(url, data, {
          headers: {
                'Content-Type': 'application/json',
                Authorization: JWT
            }
        })
    return {
        isSuccess: true,
        pinataURL: response.data.IpfsHash
    }
  } catch (error) {
    console.log(error)
    return {
      error: error
    }
  }
  
};