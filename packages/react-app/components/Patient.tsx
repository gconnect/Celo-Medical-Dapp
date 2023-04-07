import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { JWT } from '@/utils/Constants';

export default function Patient(): JSX.Element {
  const [data, setData] = useState<any>()

  const fetchPatientData = async () => {
    try {
      const response = await axios.get("https://gateway.pinata.cloud/ipfs/bafkreibk2w2vtlezm7vwwqcx7hjmqoyw5gzlitilswbaehkeqsrzzlehou", {
        headers: {
            Authorization: JWT
        },       
    }
    )
    console.log("patient", response)
    setData(response)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchPatientData()
  })
  return (
    <div>
      hello
      {/* <p>{data.fullName}</p>
      <p>{data.phoneNumber}</p>
      <p>{data.gender}</p>
      <p>{data.patientWalletAddress}</p>
      <p>{data.kinContact}</p> */}
    </div>
  )
}
