import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { router } from "../router/Routes";
import { Group } from "@mui/icons-material";

const sleep = () => new Promise(resolve => setTimeout(resolve, 500));

axios.defaults.baseURL = 'https://localhost:7179/api';
// axios.defaults.withCredentials = true;

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.response.use(async response => {
    await sleep();
    return response;
},(error:AxiosError) => {
    const {data, status} = error.response as AxiosResponse;
    switch(status){
        case 400:
            toast.error('data.title');
            break;
        case 401:
            toast.error('unauthorized');
            break;
        case 404:
            router.navigate('/server-error',{state: {error: data}});
            break;
        case 500:
            router.navigate('/server-error');
            break;
        default:
            break;
    }
    return Promise.reject(error.response);
})

const request = {
    get: (url: string) => axios.get(url).then(responseBody),
    getByParam: (url: string, params: string) => axios.get(url, {params}).then(responseBody),
    post: (url: string, body: object) => axios.post(url, body).then(responseBody),
    put: (url: string, body: object) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody)
}

const Company = {
    list: () => request.get('Company'),
    details: (id: number) => request.get(`Company/${id}`),
}

// const Create = (params: string) => ({
//     group: () => request.getByParam(`/subscriptions/${id}`, params),
// });

const Create = {
    getGroup: (subscriptionid: string) => request.get(`subscriptions/${subscriptionid}`),
    // group: () => request.getByParam(`/subscriptions`, params),
}


const TestErrors = {
    get400Error: () => request.get('buggy/bad-request'),
    get401Error: () => request.get('buggy/unauthorized'),
    get404Error: () => request.get('buggy/not-found'),
    get500Error: () => request.get('buggy/server-error'),
    getValidationError: () => request.get('buggy/validation-error'),
}


const agent = {
    Company,
    Create,
    TestErrors
}


export default agent;

