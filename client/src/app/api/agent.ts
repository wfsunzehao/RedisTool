import axios, { AxiosError, AxiosResponse } from 'axios'
import { toast } from 'react-toastify'
import { router } from '../router/Routes'

const sleep = () => new Promise((resolve) => setTimeout(resolve, 500))

axios.defaults.baseURL = 'https://localhost:7179/api'
axios.defaults.withCredentials = true

const responseBody = (response: AxiosResponse) => response.data

// Request interceptor: Add Authorization header
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken') // Retrieve the token stored in localStorage
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}` // Add the token to the request header
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

axios.interceptors.response.use(
    async (response) => {
        await sleep()
        return response
    },
    (error: AxiosError) => {
        const { data, status } = error.response as AxiosResponse
        switch (status) {
            case 400:
                toast.error(data.title)
                break
            case 401:
                toast.error(data.message)
                break
            case 404:
                router.navigate('/server-error', { state: { error: data } })
                break
            case 500:
                router.navigate('/server-error')
                break
            default:
                break
        }
        return Promise.reject(error.response)
    }
)

const request = {
    get: (url: string) => axios.get(url).then(responseBody),
    getByParam: (url: string, params: string) => axios.get(url, { params }).then(responseBody),
    post: (url: string, body: object) => axios.post(url, body).then(responseBody),
    put: (url: string, body: object) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),
    deleteByGroup: (url: string, body: object) => axios.delete(url, { data: body }).then(responseBody),
}

const Company = {
    list: () => request.get('Company'),
    details: (id: number) => request.get(`Company/${id}`),
}

const Create = {
    getGroup: (subscriptionid: string) => request.get(`Subscription/${subscriptionid}`),
    sendAllBvtJson: (body: object) => request.post(`/Creation/CreateBVTCache`, body),
    sendOneBvtJson: (body: object) => request.post(`/Creation/CreateBVTCacheByCase`, body),
    sendManJson: (body: object) => request.post(`/Creation/CreateManualCache`, body),
    sendPerfJson: (body: object) => request.post(`/Creation/CreatePerfCache`, body),
    sendAltJson: (body: object) => request.post(`/Creation/CreateAltCache`, body),
    sendBenchmarkRunJson: (body: object) => request.post('/BenchmarkRun/enqueue', body),
    sendGetBenchmarkRequestData: () =>
        axios
            .get('/Data/GetBenchmarkRequestData')
            .then((res) => {
                const data = res?.data
                if (Array.isArray(data)) {
                    return data
                }
                if (Array.isArray(data?.data)) {
                    return data.data
                }
                console.warn('Unexpected response format:', data)
                return []
            })
            .catch((error) => {
                console.error('Error fetching data:', error)
                throw error
            }),
    InsertQCommandByGroupNameJson: (group: string) =>
        axios
            .post(
                'BenchmarkRun/InsertQCommandByGroupName',
                group,
                { headers: { 'Content-Type': 'application/json' } } // 修正 Content-Type
            )
            .then(responseBody),
    executetasksJson: (sub: string, group: string, vmList: string[]) =>
        request.post(`BenchmarkRun/execute-tasks?sub=${sub}&group=${group}`, vmList),
    FinalDataTestJson: (data: Date) => request.post('/BenchmarkRun/FinalDataTest', data),
    GetBenchmarkDataBlob: (date: string, config: object = {}) =>
        axios.get('BenchmarkRun/GetBenchmarkData', {
            params: { date },
            ...config, // 将传入的 config 合并到默认配置中
        }),
    getGroupOptions: (subscriptionId: string) =>
        axios
            .get(`/Subscription/${subscriptionId}`)
            .then((res) => res.data)
            .catch((err) => {
                console.error('Error fetching group list:', err);
                throw err;
            }),

    getVmList: (subId: string, groupName: string) =>
        axios
            .post(`/BenchmarkRun/getVMs?sub=${encodeURIComponent(subId)}&group=${encodeURIComponent(groupName)}`, '', {
                headers: {
                    accept: '*/*',
                },
            })
            .then((res) => {
                const contentType = res.headers['content-type'];
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error('Invalid content type received from API');
                }
                return res.data;
            })
            .catch((err) => {
                console.error('Error fetching VM list:', err);
                throw err;
            }),

    submitSelectedVMs: (payload: { sub: string; group: string; vms: string[] }) =>
        axios
            .post('/BenchmarkRun/runSelectedVMs', payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((res) => res.data)
            .catch((err) => {
                console.error('Error submitting selected VMs:', err);
                throw err;
            }),
    FlushQueue: () =>
        axios
            .post('BenchmarkRun/FlushQueue')
            .then(response => response.data)
            .catch(error => {
                console.error('FlushQueue error:', error)
                throw error
            }),
    FlushRequest: () =>
        axios
            .post('BenchmarkRun/FlushRequest')
            .then(response => response.data)
            .catch(error => {
                console.error('FlushRequest error:', error)
                throw error
            }),
            
    
}

const Delete = {
    getResource: (subscriptionid: string, group: string) => request.get(`ResourceDeletion/${subscriptionid}/${group}`),
    //sendDelGroupJson:(body: object)=>request.deleteByGroup(`/StackExchange/DeleteGroup`,body),
    sendDelGroupJson: (subscription: string, group: string) =>
        request.delete(`/AzureClient/DeleteResource?subscription=${subscription}&resourceGroupName=${group}`),
    sendDelGroupJsonT: (body: object) => request.deleteByGroup(`/ResourceDeletion/DeleteResource`, body),
}

const Other = {
    sendInsertJson: (body: object) => request.post(`/StackExchange/AddDataToRedis`, body),
    sendMedianJson: (body: object) => axios.post('/Median/sendMedianJson', body, { responseType: 'blob' }),
}

const Auth = {
    login: (username: string, password: string) => request.post(`/Auth/login`, { username, password }),
    register: (username: string, password: string) => request.post(`/Auth/register`, { username, password }),
    resetPassword: (username: string, newPassword: string) =>
        request.post(`/Auth/reset-password`, { username, newPassword }),
}

const TestErrors = {
    get400Error: () => request.get('buggy/bad-request'),
    get401Error: () => request.get('buggy/unauthorized'),
    get404Error: () => request.get('buggy/not-found'),
    get500Error: () => request.get('buggy/server-error'),
    getValidationError: () => request.get('buggy/validation-error'),
}

const SignalR = {
    hubUrl: '/createHub',
}

const agent = {
    Company,
    Create,
    Delete,
    Other,
    Auth,
    TestErrors,
    SignalR,
}

export default agent
