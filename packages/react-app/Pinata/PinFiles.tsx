import { QUERYPRAM } from "@/utils/Constants";
import axios from "axios";
import { JWT } from '@/utils/Constants';


// uploading image and extra meta data
export const pinFilesToPinata = async (image : string | File) => {
    const formData = new FormData();
    
    formData.append('file', image)

    // const metadata = JSON.stringify({
    //   name: QUERYPRAM,
    //   keyvalues: {
    //     fullName,
    //     phoneNumber,
    //     // residentialAddress,
    //     gender,
    //     // cityState,
    //     // maritalStatus,
    //     patientWalletAddress,
    //     // kinFullName,
    //     // relationshipWithKin,
    //     kinContact
    //   }
    // });
    // formData.append('pinataMetadata', metadata);
    
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
      const ipfshHash = "https://gateway.pinata.cloud/ipfs/" + res.data.IpfsHash
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
  residentialAddress: string,
  gender: string,
  cityState: string,
  maritalStatus: string,
  patientWalletAddress: string,
  kinFullName: string,
  relationshipWithKin: string,
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
          // residentialAddress,
          gender,
          // cityState,
          // maritalStatus,
          patientWalletAddress,
          // kinFullName,
          // relationshipWithKin,
          kinContact
        }
      },
        "pinataContent": {
        image,
        fullName,
        phoneNumber,
        // residentialAddress,
        gender,
        // cityState,
        // maritalStatus,
        patientWalletAddress,
        // kinFullName,
        // relationshipWithKin,
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
               pinataURL: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
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
