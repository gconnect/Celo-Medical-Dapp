import React, {useState, useCallback, useEffect} from 'react'
import {useRouter} from 'next/router'
import { getAllpatients, getPatientReport } from '@/interact';
import { useCelo } from '@celo/react-celo';

export default function PatientPage() {
  const router = useRouter()
  const { account } = router.query
  const [reports, setReports] = useState<any[]>([])
  const [patientReport, setPatientReport] = useState<any>({})
  const { kit, address } = useCelo()
  
  const fetchReports = useCallback(async () => {
    const patientReport = await getPatientReport(kit, 0, address)
    setPatientReport(patientReport)
    
  }, [address, kit])
  
  useEffect(() => {
    fetchReports()
  }, [fetchReports])
  
  return (
    <div>
      <div>
        {/* {reports && reports.map((item: any, index) => <div key={index}>
          {item.patientWalletAddress}
          {item.reports}
          {item.txHash}
          {item.dateCreated}
        </div>
        )} */}

        {patientReport && patientReport.patientWalletAddress}
        </div>
    </div>
  )
}
