import React, {useState, useCallback, useEffect} from 'react'
import {useRouter} from 'next/router'
import { getAllpatients, getPatientReport } from '@/interact';
import { useCelo } from '@celo/react-celo';
import { addComma } from '@/utils/truncate';
import axios from 'axios';
import Image from 'next/image';

export default function PatientPage() {
  const router = useRouter()
  const { walletAddress } = router.query

  const [reports, setReports] = useState<any[]>([])
  const [patientReport, setPatientReport] = useState<any>({})
  const [ipfsData, setIpfsData] = useState<any>()
  const [loading, setLoading] = useState<boolean>(false)

  const { kit, address } = useCelo()
  
  const fetchPatientData = useCallback(async (patientIPFSHash: string) => {
    setLoading(true)
    // "https://gateway.pinata.cloud/ipfs/" +
    // const url2 = "https://ipfs.io/ipfs/bafkreicjmxc2drbgxtoidx6xfatbffyx46oiyo6ktipss6dhdermwtsoze"
    
    try {
      setLoading(true)
      const response = await axios.get(`https://ipfs.io/ipfs/${patientIPFSHash}`)
      console.log("patient", response.data)
      setIpfsData(response.data)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }, [])

  const fetchReports = useCallback(async () => {
    setLoading(true)
    const patientRecords = await getAllpatients(kit)
    const data = patientRecords.find((item: any) => item.patientWalletAddress === walletAddress)
    if (data) {
    await fetchPatientData(data.patientIPFSHash)
    setPatientReport(data)
    console.log(data)
    } else {
      setLoading(false)
      return null
    }
    
  }, [fetchPatientData,walletAddress, kit])
  
  useEffect(() => {
    fetchReports()
  }, [fetchReports])
  
  return (
    <div>
      <div>
        { loading ? <div>Loading...</div> : !patientReport || !ipfsData ? <div>No data for you</div> :
          <div className='text-lg'>
            <p>{`${ipfsData && ipfsData.fullName}`}</p> 
            <Image src={ `https://ipfs.io/ipfs/${ ipfsData &&ipfsData.image}`} alt="photo" width={100} height={ 100} />
              <p>{ipfsData.phoneNumber}</p>
              <p>{ipfsData.gender}</p>
              <p>{ipfsData.patientWalletAddress}</p>
            <p>{ipfsData.kinContact}</p> 
            <label className='font-bold'>Medical Reports:</label>
            <p> {addComma(patientReport.reports)}</p>
          </div>
        }
      </div>
      </div>
  )
}
