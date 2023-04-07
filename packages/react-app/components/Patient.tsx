import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { JWT } from '@/utils/Constants';

export default function Patient(): JSX.Element {
  const [data, setData] = useState<any>()

  const fetchPatientData = async () => {
    const url = "https://ipfs.io/ipfs/bafkreibk2w2vtlezm7vwwqcx7hjmqoyw5gzlitilswbaehkeqsrzzlehou"
    const url2 = "https://ipfs.io/ipfs/bafkreicjmxc2drbgxtoidx6xfatbffyx46oiyo6ktipss6dhdermwtsoze"
    try {
      const response = await axios.get(url, {
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
      { data && data.fullName }
      {/* <p>{data.fullName}</p>
      <p>{data.phoneNumber}</p>
      <p>{data.gender}</p>
      <p>{data.patientWalletAddress}</p>
      <p>{data.kinContact}</p> */}
    </div>
  )
}
