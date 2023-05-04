import React, { useState, useEffect, useCallback } from 'react'
import { useCelo } from '@celo/react-celo'
import { getAllpatients } from '@/interact'
import UpdateModal from './UpdateModal'
import { addComma, truncate } from '@/utils/truncate'
import { formateDateTime } from '@/utils/formatDateTime'
import Router from 'next/router'
import Link from 'next/link'
interface IParam{
  patientList : any[]
}
export default function TableList({patientList} : IParam): JSX.Element {
  const { kit } = useCelo()
  const [id, setId] = useState<number>(0)
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [patients, setPatients] = useState<any[]>(patientList)
  const [patient, setPatient] = useState<any>({})
  const [showModal, setShowModal] = useState<boolean>()


  function handleButtonClick(id: number, walletAddress: string) {
    setId(id);
    setWalletAddress(walletAddress)
  }

  // Define a function to update the list
  function handleUpdateList() {
        // const newItem: any = { report };       
    setPatients([...patients]);
  }

  // const handleDetail = (walletAddress : string) => {
  //   Router.push( 
  //     `/account/${walletAddress}`

  //   )
  // }

  return (
    <div>
      <div>
        <div className="flex flex-col">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="min-w-full text-left text-sm font-light">
                  <thead className="border-b font-medium dark:border-neutral-500">
                    <tr>
                      <th scope="col" className="px-6 py-4">SN</th>
                      <th scope="col" className="px-6 py-4">Wallet Address</th>
                      <th scope="col" className="px-6 py-4">IPFSH Hash</th>
                      <th scope="col" className="px-6 py-4">Transaction Hash</th>
                      <th scope="col" className="px-6 py-4">Date Created</th>
                      {/* <th scope="col" className="px-6 py-4">Test Results</th> */}
                      <th scope="col" className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients && patients.map((item, index) => <tr className="border-b dark:border-neutral-500"
                      key={index}>
                      <td className="whitespace-nowrap px-6 py-4 font-medium">{index + 1}</td>
                      <td
                        className="whitespace-nowrap px-6 py-4">
                        <Link href={{
                            pathname: `/account/${item.id}`,
                            query: {
                              walletAddress: item.patientWalletAddress
                            }
                          }}
                        >
                        {truncate(item.patientWalletAddress)}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4"> <a href={`https://ipfs.io/ipfs/${item.patientIPFSHash}`}>{truncate(item.patientIPFSHash)}</a></td>
                      <td className="whitespace-nowrap px-6 py-4"><a href={"https://explorer.celo.org/alfajores/tx/" + item.txHash}>{truncate(item.txHash)}</a></td>
                      <td className="whitespace-nowrap px-6 py-4">{ formateDateTime(item.dateCreated)}</td>
                      {/* <td className="whitespace-nowrap px-6 py-4">{addComma(item.reports)}</td> */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <button
                          onClick={() => handleButtonClick(item.id, item.patientWalletAddress)}
                          type="button"
                          className="inline-block rounded bg-yellow-500 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                          data-te-toggle="modal"
                          data-te-target="#updateModal"
                          data-te-ripple-init
                          data-te-ripple-color="light">
                          Add Test Result
                        </button>
                        <UpdateModal index={id} walletAddress={walletAddress} updateList ={handleUpdateList} />
                      </td>
                    </tr>)}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>    
  )
}
