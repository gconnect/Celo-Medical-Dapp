import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { getAllpatients } from '@/interact';
import { useCelo } from '@celo/react-celo';
import Image from 'next/image';

export default function Patient(): JSX.Element {
  const [data, setData] = useState<any>()
  const [ipfsData, setIpfsData] = useState<any>()
  const [loading, setLoading] = useState<boolean>(false)
  const { kit, address } = useCelo()

  const getPatientInfo = async () => {
    setLoading(true)
    const res = await getAllpatients(kit)
    if (!address) {
        return null
    } else {
          setLoading(false)
        return setData(res && res.find((item: any) => item.patientWalletAddress == address))
    }
  }
  const patientIPFSHash = data && data.patientIPFSHash
  
  // Fetching data from ipfs
  const fetchPatientData = async () => {
    setLoading(true)
    // "https://gateway.pinata.cloud/ipfs/" +
    // const url2 = "https://ipfs.io/ipfs/bafkreicjmxc2drbgxtoidx6xfatbffyx46oiyo6ktipss6dhdermwtsoze"
    
    try {
      const response = await axios.get(`https://ipfs.io/ipfs/${data.patientIPFSHash}`)
      console.log("patient", response.data)
      setIpfsData(response.data)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }
  console.log(data)
  console.log(ipfsData)
  useEffect(() => {
    fetchPatientData()
    getPatientInfo()
  }, [kit])
  return (
    <div>
        {  
        !data ? <div>No record found for you</div> : loading ? <div>loading...</div> :
          <div>
            <p>{`Welcome, ${ipfsData && ipfsData.fullName}`}</p> 
            <Image src={ `https://ipfs.io/ipfs/${ ipfsData &&ipfsData.image}`} alt="photo" width={100} height={ 100} />
              <p>{ipfsData && ipfsData.phoneNumber}</p>
              <p>{ipfsData && ipfsData.gender}</p>
              <p>{ipfsData && ipfsData.patientWalletAddress}</p>
              <p>{ipfsData && ipfsData.kinContact}</p> 
          </div>
              }
      
    </div>
  )
}
