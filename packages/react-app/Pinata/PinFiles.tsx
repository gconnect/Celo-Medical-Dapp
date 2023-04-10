import { QUERYPRAM } from "@/utils/Constants";
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
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          Authorization: JWT
        }
      });
      console.log(res.data.IpfsHash);
      const ipfshHash = res.data.IpfsHash
      return {isSuccess: true, hash: ipfshHash}
    } catch (error) {
      console.log(error);
     return {isSuccess: false, error: error.message}
    }
  };

// Option 2 uploading json file
export const uploadJSONToIPFS = async (
  image: string | undefined,
  fullName: string,
  phoneNumber: string,
  gender: string,
  patientWalletAddress: string,
  kinContact: string) => {
  
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
          kinContact
        }
      },
        "pinataContent": {
        image,
        fullName,
        phoneNumber,
        gender,
        patientWalletAddress,
        kinContact
      }
    });
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    //making axios POST request to Pinata ⬇️
    return axios 
        .post(url, data, {
          headers: {
                'Content-Type': 'application/json',
                Authorization: JWT
            }
        })
      .then(function (response) {
          console.log(response.data.IpfsHash)
           return {
               isSuccess: true,
               pinataURL: response.data.IpfsHash
           };
        })
        .catch(function (error) {
            console.log(error)
            return {
                isSuccess: false,
                error: error.message,
            }

    });
};
