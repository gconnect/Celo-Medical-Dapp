import React, { useState, useEffect, useCallback  } from 'react'
import {
   getAllpatients
} from '@/interact'
import { useCelo } from '@celo/react-celo';
import PatientModal from '@/components/PatientModal';
import TableList from '@/components/TableList';
import { CONTRACTOWNER } from '@/utils/Constants';
import Patient from '@/components/Patient';
import Router from 'next/router';

export default function Home() {
  const { address, kit } = useCelo()
   const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const handlePatients = useCallback(async () => {
    setLoading(true)
    const employeeList = await getAllpatients(kit)
    setPatients(employeeList)
    setLoading(false)
  }, [kit]) 


   useEffect(() => {
    // if (address && address !== CONTRACTOWNER) {
    //   Router.push(`/account/${address}`);
    // } else {
    //   Router.push('/')
    // }
    handlePatients()

  }, [address, handlePatients]);

  return (
    <div>
      <div>
          {!address ? <div>Please connect your wallet</div> :  address !== CONTRACTOWNER ? <Patient/> :
        <div>
          <h1 className='text-4xl text-center m-4'>Decentralized Medical Record System</h1>
              <div className="flex justify-end ">
              <button
                type="button"
                className="inline-block rounded bg-primary px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                data-te-toggle="modal"
                data-te-target="#patientModal"
                data-te-ripple-init
                data-te-ripple-color="light">
                Add Patient
            </button>
            </div>
            
            <PatientModal action={handlePatients} />
            {loading ? <div className='text-center'> loading...</div> : 
              <TableList patientList={patients}/>
            }
        </div>      
    }
      </div>
    
    </div>   
  )
}
