import { QUERYPRAM } from "@/utils/Constants";
import axios from "axios";

export const pinFilesToPinata = async (
  image: string | File,
  fullName: string,
  phoneNumber: string,
  residentialAddress: string,
  gender: string,
  cityState: string,
  maritalStatus: string,
  patientWalletAddress: string,
  kinFullName: string,
  relationshipWithKin: string,
  kinContact: string
) => {
    const JWT = `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`
    const formData = new FormData();
    
    formData.append('file', image)

    const metadata = JSON.stringify({
      name: QUERYPRAM,
      keyvalues: {
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
    formData.append('pinataMetadata', metadata);
    
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
