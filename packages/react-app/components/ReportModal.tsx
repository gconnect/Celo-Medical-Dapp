import React,{useState} from 'react'
import { useCelo } from '@celo/react-celo';
import { addPatientReport } from '@/interact';

interface IParams {
  walletAddress: string;
  show: boolean | undefined;
  onHide: () => void;
}

export default function ReportModal(param: IParams) {
  const [testResult, setTestResult] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>()
  const { kit, address } = useCelo()

  const handleTestResult = (e: React.FormEvent<HTMLInputElement>) => {
    setTestResult(e.currentTarget.value)
    console.log(e.currentTarget.value)
    e.preventDefault()
  }

  const handlePatientReport = async (patientAddress: string) => {
    setShowModal(true)
    setLoading(true)
    if (!testResult) {
      alert("field is required")
      return
   }
    await addPatientReport(address, kit, patientAddress, testResult)  
    setShowModal(false)
    setLoading(false)
  }
  return (
    <div>
      {param.show ?
        <div>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-gray-900 bg-opacity-60 w-full h-full outline-none">
            <div className="relative lg:w-1/2 md:w-full sm:w-full my-6 mx-auto">
              <div className="shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t-md">
                  <h3 className="text-xl font-medium leading-normal text-gray-800">{`Medical Test Report`}</h3>
                  <button
                    className="box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                    onClick={param.onHide}
                  >
                    <span className="text-black border-2 p-2 rounded-l-full ">
                      X
                    </span>
                  </button>
                </div>
                <div className="relative p-6 flex-auto">
                  <div className="flex justify-center flex flex-col">
                    <input type="text" placeholder='Enter test result' className='border-2 p-2 mt-2 rounded-md w-full' value={testResult} onChange={handleTestResult} />
                  </div>
                  <button
                    onClick={() => handlePatientReport(param.walletAddress)}
                    type="button"
                    className="ml-1 inline-block rounded bg-primary px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                    data-te-ripple-init
                    data-te-ripple-color="light">
                    {loading ? "Loading..." : "Add Test Result"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div> : <div></div>}
    </div>
  )
}
