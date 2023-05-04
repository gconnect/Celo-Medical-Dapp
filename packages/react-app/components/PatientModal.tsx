import React, {useCallback, useEffect, useState} from 'react'
import { addPatient, addHash, getAllpatients } from '@/interact'
import { useCelo } from '@celo/react-celo'
import { pinFilesToPinata, uploadJSONToIPFS } from '@/Pinata/PinFiles'
import Alert from './Alert'

interface IParam{
  action: () => void
}
export default function PatientModal({action} : IParam): JSX.Element {
    const [fullName, setFullName] = useState<string>('')
    const [phoneNumber, setPhoneNumber] = useState<string>('')
    const [gender, setGender] = useState<string>('')
    const [patientWalletAddress, setPatientWalletAddress] = useState<string>('')
    const [kinContact, setKinContact] = useState<string>('')
    const [image, setSelectedImage] = useState<string | File>('')
    const [dataValue, setData] = useState<string | undefined>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [ipfsHashValue, setIPFSHASH] = useState<string>("")
    const [blockSuccess, setBlockSuccess] = useState<boolean>(false)
    const [blockMessage, setBlockMessage] = useState<any>()
    const [errorMessage, setErrorMessage] = useState<string>("")
    const [updatedPatientList, seUpdatedPatientList] = useState<any[]>([])
    const [residentialAddress, setPatientResidentialAddress] = useState<string>("")
    const [maritalStatus, setMaritalStatus] = useState<string>("")
    const [kFullName, setKinFullName] = useState<string>("")
    const [relationshipWithKin, setRelationshipWithKin] = useState<string>("")
    
    const [successImage, setSuccessImage] = useState<boolean>(false)
    const [hash, setHash] = useState<string>("")
    const [imageError, setImageError] = useState<any>()
  
    const [successState, setSuccess] = useState<boolean | undefined>(false)
    const [msg, setMessage] = useState<any>()

    
  
  const [showModal, setShowModal] = useState<boolean>(false)
  
  const { kit, address } = useCelo()
  

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files != null) {
          setSelectedImage(e.target.files[0]); 
          console.log(e.target.files[0])
    } 
    }

    const handleFullName = (e: React.FormEvent<HTMLInputElement>) => {
      setFullName(e.currentTarget.value)
    }
   const handlePhoneNumber = (e: React.FormEvent<HTMLInputElement>) => {
      setPhoneNumber(e.currentTarget.value)
   }
  
   const handleGender = (e: React.FormEvent<HTMLInputElement>) => {
      setGender(e.currentTarget.value)
   }

    const handlePatientWalletAddress = (e: React.FormEvent<HTMLInputElement>) => {
      setPatientWalletAddress(e.currentTarget.value)
    }
  
    const handleKinContact= (e: React.FormEvent<HTMLInputElement>) => {
      setKinContact(e.currentTarget.value)
    }
  
   const handlePatientResidentialAddress= (e: React.FormEvent<HTMLInputElement>) => {
      setPatientResidentialAddress(e.currentTarget.value)
    }
     const handleKinFullName= (e: React.FormEvent<HTMLInputElement>) => {
      setKinFullName(e.currentTarget.value)
     }
   const handleRelationshipWithKin= (e: React.FormEvent<HTMLInputElement>) => {
      setRelationshipWithKin(e.currentTarget.value)
   }
   const handleMaritalStatus= (e: React.FormEvent<HTMLInputElement>) => {
      setMaritalStatus(e.currentTarget.value)
    }

  const handleAddPatient = async () => {

    if (!fullName || !phoneNumber || !kinContact || !image || !gender || !patientWalletAddress ||
      !maritalStatus || !residentialAddress || !kFullName) {
      setErrorMessage("All Fields are required")
      return;
    }

    setLoading(true)
    // setShowModal(true)

    const { successImage, errorMessage, hash } = await pinFilesToPinata(image)
    setSuccessImage(successImage)
    setImageError(errorMessage)
    setHash(hash)

    const {isSuccess, error, pinataURL } = await uploadJSONToIPFS(
        hash,
        fullName,
        phoneNumber,
        gender,      
        patientWalletAddress,      
        residentialAddress,
        maritalStatus,
        kFullName,
        kinContact,
        // relationshipWithKin
    )
    
    setIPFSHASH(pinataURL)
    setSuccess(isSuccess)
    setMessage(error)

    const { sucesss, data, message} = await addPatient(address, kit, patientWalletAddress, pinataURL)
    setBlockSuccess(sucesss)
    setData(data)
    setBlockMessage(message) 
    
    await addHash(address, kit, data) 
    

      setLoading(false)
      // setShowModal(false)
      // window.location.reload()
    
    if (document.getElementById('patientModal') != null) {
        document.getElementById('patientModal').style.display = 'none'
    }
    action()

  }
  
  
  return (
    
    <div>
      {successState || blockSuccess || blockMessage || msg ?
        <div>
          <Alert success={successImage} error={imageError} data={hash} />
          <Alert success={successState} error={msg} data={ipfsHashValue} />
          <Alert success={blockSuccess} error={blockMessage} data={dataValue} />

      </div> : null
      }
      <div>
      <div
      data-te-modal-init
      className={"fixed top-0 left-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"}
      id="patientModal"
      aria-labelledby="exampleModalCenterTitle"
      aria-modal="true" 
      role="dialog">
        <div
          data-te-modal-dialog-ref
          className="pointer-events-none relative flex min-h-[calc(100%-1rem)] w-auto translate-y-[-50px] items-center opacity-0 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:min-h-[calc(100%-3.5rem)] min-[576px]:max-w-[500px]">
          <div
            className="pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-lg outline-none dark:bg-neutral-600">
            <div
              className="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
              <h5
                className="text-xl font-medium leading-normal text-neutral-800 dark:text-neutral-200"
                id="exampleModalScrollableLabel">
                Add Patient
              </h5>
              <button
                type="button"
                className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                data-te-modal-dismiss
                aria-label="Close">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="h-6 w-6">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
                </div>
            
              <label className='my-2 mx-4'>Patient Information</label>
              <div className="relative p-4 grid grid-cols-2">
              <input type="text" placeholder='Full Name' className='border-2 p-2 mt-2 rounded-md w-full' value={fullName} onChange={handleFullName} />
              <input type="tel" placeholder='Phone Number' className='border-2 p-2 mt-2 rounded-md w-full' value={phoneNumber} onChange={handlePhoneNumber} />
              <input type="text" placeholder='Gender' className='border-2 p-2 mt-2 rounded-md w-full' value={gender} onChange={handleGender}/>
              <input type="text" placeholder='Patient Wallet Address' className='border-2 p-2 mt-2 rounded-md w-full' value={patientWalletAddress} onChange={handlePatientWalletAddress}/>
              <input type="text" placeholder='Residential Address' className='border-2 p-2 mt-2 rounded-md w-full' value={residentialAddress} onChange={handlePatientResidentialAddress}/>
              <input type="text" placeholder='Marital Status' className='border-2 p-2 mt-2 rounded-md w-full' value={maritalStatus} onChange={handleMaritalStatus}/>
              
              <div>
                <label className='my-2'>Upload Passport</label>
                <input type="file" placeholder='Upload Picture' className='border-2 p-2 mt-2 rounded-md w-full' onChange={handleImageUpload} />    
                  </div>
                <div>
                  <label className='my-2'>Next of Kin Information</label>            
                  <input type="text" placeholder='Next of Kin Full Name' className='border-2 p-2 mt-2 rounded-md w-full' value={kFullName} onChange={handleKinFullName}/>
                </div>
              
                <input type="text" placeholder='Next of Kin Phone Contact' className='border-2 p-2 mt-2 rounded-md w-full' value={kinContact} onChange={handleKinContact}/>
                {/* <input type="text" placeholder='Relationship With Next of Kin' className='border-2 p-2 mt-2 rounded-md w-full' value={relationshipWithKin} onChange={handleRelationshipWithKin}/> */}
                <p className='text-red-500'>{ errorMessage}</p>
            </div>
            <div
              className="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
              <button
                type="button"
                className="inline-block rounded bg-primary-100 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                data-te-modal-dismiss
                data-te-ripple-init
                data-te-ripple-color="light">
                Close
              </button>
              <button
                onClick={handleAddPatient}
                type="button"
                className="ml-1 inline-block rounded bg-primary px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                data-te-ripple-init
                // data-te-modal-dismiss = {showModal ? false : true}
                data-te-ripple-color="light">
               { loading ? "Loading..." :" Add patient"}
              </button>
            </div>
          </div>
        </div>
          </div>
      </div>
  </div>
  )
}
