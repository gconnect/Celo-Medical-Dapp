import { JWT } from '@/utils/Constants';
import axios  from 'axios';


export const PatientList = async (queryParams: any) => {

  const url = `https://api.pinata.cloud/data/pinList?metadata[name]=${queryParams}`;

    return axios
        .get(url, {
            headers: {
                Authorization: JWT
            }
        })
        .then(function (response) {
            // console.log(response)
            const list = response.data.rows
            console.log(list)
            return list
        })
        .catch(function (error) {
            console.log(error)
        });
} 