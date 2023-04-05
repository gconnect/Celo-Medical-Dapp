import React, { useState, useEffect  } from 'react'
import {
   getAllpatients
} from '@/interact'
import { useCelo } from '@celo/react-celo';
import PatientModal from '@/components/PatientModal';
import TableList from '@/components/TableList';


export default function Home() {

  const { kit, address } = useCelo()
  const [employees, setEmployees] = useState<any[]>([])

   const handlePatients = async () => {
    const employeeList = await getAllpatients(kit)
    setEmployees(employeeList)
  }

  useEffect(() => {
    handlePatients()
  }, [])
 
  return (
    <div>
    {!address ? <div>Please connect your wallet</div> :  
        <div>
          <h1 className='text-4xl text-center m-4'>Decentralized Medical Record System</h1>
              <div className="flex ">
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
            
          <PatientModal />
          <TableList/>
        </div>      
    }
    </div>   
  )
}