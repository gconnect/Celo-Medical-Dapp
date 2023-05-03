import MedicalABI from "./Medical.json"
import { CONTRACTADDRESS } from "./utils/Constants";

export function initContract(kit: any) {
  return new kit.connection.web3.eth.Contract(MedicalABI.abi, CONTRACTADDRESS)
} 

// Medical Record Contract Calls
export const addPatient = async (address: string | null | undefined,
  kit: any, patientAddress: string, ipfsHash: string) => {
  try {
    const txHash = await initContract(kit).methods
      .addPatient(patientAddress, ipfsHash).send({
    from: address,
    })
    console.log(txHash)
    return {sucesss: true, data: txHash.transactionHash}
  } catch (e : any) {
    console.log(e)
    return {sucesss: false, message: e.message}
  }
}

export const addPatientReport = async (address: string | null | undefined,
  kit: any, walletAddress: string, testResult: string) => {
  try {
    const txHash = await initContract(kit).methods
      .addPatientMedicalReport(walletAddress, testResult).send({
    from: address,
    })
    console.log(txHash)
    return {sucesss: true, data: txHash.transactionHash}
  } catch (e) {
    console.log(e)
  }
}

export const addHash= async (address: string | null | undefined,
  kit: any, hash: string | undefined) => {
  try {
    const txHash = await initContract(kit).methods
      .addHash(hash).send({
    from: address,
    })
    console.log(txHash)
    return {sucesss: true, data: "https://explorer.celo.org/alfajores/tx/" + txHash.transactionHash}
  } catch (e) {
    console.log(e)
  }
}

export const getPatientData = async (kit: any, index: number, patientAddress: string) => {
  try {
    const response = await initContract(kit).methods.getPatientData(index, patientAddress ).call()
    console.log(response)
    return response;
  } catch (e) {
    console.log(e)
  }
}

export const getAllpatients = async (kit: any) => {
  try {
    const response = await initContract(kit).methods.getAllpatients().call()
    console.log(response)
    return response;
  } catch (e) {
    console.log(e)
  }
}

export const getPatientTestResults = async (kit: any) => {
  try {
    const response = await initContract(kit).methods.getPatientTestResults().call()
    console.log(response)
    return response;
  } catch (e) {
    console.log(e)
  }
}

export const getPatientReport = async (kit: any, index: number, patientAddress: string | null |  undefined) => {
  try {
    const response = await initContract(kit).methods.getPatientReport(index, patientAddress).call()
    console.log(response)
    return response;
  } catch (e) {
    console.log(e)
  }
}
