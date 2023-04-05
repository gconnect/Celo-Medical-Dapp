import React,{ useState, useEffect } from 'react'
import { useCelo } from '@celo/react-celo'
import { getAllpatients, addPatientReport } from '@/interact'
import UpdateModal from './UpdateModal'
import { PatientList } from '@/Pinata/ListPin'
import Image from 'next/image'
import { QUERYPRAM } from '@/utils/Constants'

export default function TableList(): JSX.Element {
  const { kit, address } = useCelo()
  const [patients, setPatients] = useState<any[]>([])
  const [pinnedList, setPinnedList] = useState<any[]>([])

  const handlePatients = async () => {
    const employeeList = await getAllpatients(kit)
    setPatients(employeeList)
  }

  const getPinnedItems = async () => {
    const data = await PatientList(QUERYPRAM)
    setPinnedList(data)
  }

  const truncate = (walletAddress: string) => {
    const formated = walletAddress.substring(0, 10)
    return `${formated}...`
  }

  useEffect(() => {
    handlePatients()
    getPinnedItems()
  }, [kit])
  
  return (
    <div>
      {pinnedList.length == 0 ? <div className='text-center text-xl'> No Patient added yet.</div> :
        <div className="flex flex-col">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="min-w-full text-left text-sm font-light">
                  <thead className="border-b font-medium dark:border-neutral-500">
                    <tr>
                      <th scope="col" className="px-6 py-4">SN</th>
                      <th scope="col" className="px-6 py-4">Profile Pix</th>
                      <th scope="col" className="px-6 py-4">Full Name</th>
                      <th scope="col" className="px-6 py-4">Phone Number</th>
                      {/* <th scope="col" className="px-6 py-4">Residential Address</th> */}
                      <th scope="col" className="px-6 py-4">Gender</th>
                      {/* <th scope="col" className="px-6 py-4">Marital Status</th> */}
                      <th scope="col" className="px-6 py-4">Wallet Address</th>
                      {/* <th scope="col" className="px-6 py-4">Next of Kin Full Name</th>
                    <th scope="col" className="px-6 py-4">Relationship with Next of Kin</th>
                    <th scope="col" className="px-6 py-4">Full Name</th> */}
                      <th scope="col" className="px-6 py-4">Next of Kin Contact</th>
                      <th scope="col" className="px-6 py-4">Date Created</th>
                      <th scope="col" className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!pinnedList ? <div>Patients not yet added</div> : pinnedList.map((item, index) => <tr className="border-b dark:border-neutral-500" key={index}>
                      <td className="whitespace-nowrap px-6 py-4 font-medium">{index + 1}</td>
                      <td className="whitespace-nowrap px-6 py-4 border rounded-full"><a href={`https://ipfs.io/ipfs/${item.patientIPFSHash}`}><Image src={`https://ipfs.io/ipfs/${item.ipfs_pin_hash}`} alt='pix' width={50} height={50} /></a></td>
                      <td className="whitespace-nowrap px-6 py-4">{item.metadata.keyvalues['fullName']}</td>
                      <td className="whitespace-nowrap px-6 py-4">{item.metadata.keyvalues['phoneNumber']}</td>
                      <td className="whitespace-nowrap px-6 py-4">{item.metadata.keyvalues['gender']}</td>
                      <td className="whitespace-nowrap px-6 py-4">{ truncate(item.metadata.keyvalues['patientWalletAddress'])}</td>
                      <td className="whitespace-nowrap px-6 py-4">{item.metadata.keyvalues['kinContact']}</td>
                      <td className="whitespace-nowrap px-6 py-4">{item.date_pinned}</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <button
                          type="button"
                          className="inline-block rounded bg-yellow-500 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                          data-te-toggle="modal"
                          data-te-target="#updateModal"
                          data-te-ripple-init
                          data-te-ripple-color="light">
                          Add Test Result
                        </button>
                      </td>
                      <UpdateModal patientAddress={item.patientWalletAddress} />
                    </tr>)}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  )
}
