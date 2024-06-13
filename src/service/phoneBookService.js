import axios from "axios"
const url='https://cmcv4p-3000.csb.app/api/persons'


const getPhoneBook=()=>{
   return axios.get(url)
}

const postPhoneBook=(obj)=>{
  return  axios.post(url,obj)
}

const deletePhoneBook=(obj)=>{
   return axios.delete(`${url}/${obj.id}`);
}

const updatePhoneBook=(obj,newObj)=>{
    newObj.id=obj.id;
    return axios.put(`${url}/${obj.id}`,newObj)
}

export default{
    getPhoneBook,
    postPhoneBook,
    deletePhoneBook,
    updatePhoneBook
}