import md5 from 'js-md5'
import axios from 'axios'

const appKey = '62D50CBCBD8C4BC8C0073547'
const appSecret = 'A5D554EDE1B24D0A8C7018BD5E000CB5'
const version = '1.0.0'

const errorMessage = '网络连接超时，请稍后再试'

export default {
    data: {
        authUrl: 'https://kyd.cd-rail.com/way/veil/authorize',
        serviceUrl: 'https://kyd.cd-rail.com/way/4/GeneralProServlet',
        fileServiceUrl: 'https://kyd.cd-rail.com/FileUpload/services/UploadFile',
        auth: '',
        last: ''
    },
    getAuth() {
        return new Promise((resolve, reject) => {
            axios.post(this.data.authUrl, this.getParams(), {
                headers: {
                    'content-type': 'application/json'
                }
            }).then((res) => {
                if (res.data.code === 1) {
                    console.log('获取令牌', res)
                    this.data.auth = res.data.data.Authentication
                    resolve()
                } else {
                    console.log('获取令牌失败', res.data)
                    reject(errorMessage)
                }
            }).catch(() => {
                reject(errorMessage)
            })
        })
    },
    getParams() {
        const timestamp = new Date().valueOf();
        this.data.last = timestamp
        const text =
            `path${appKey}timestamp${timestamp}version${version}${appSecret}`;
        return {
            appKey,
            timestamp,
            sign: md5(text).toUpperCase(),
            version,
        };
    },
    getData(payload, retryCount = 0) {
        return new Promise((resolve, reject) => {
            if (retryCount > 2) {
                reject(errorMessage)
            }
            if (this.isAuthenticationAlive()) {
                axios.post(this.data.serviceUrl, payload, {
                    headers: {
                        'content-type': 'application/json'
                    },
                    params: {
                        'Authentication': this.data.auth
                    }
                }).then((res) => {
                    if (res.data.code === 451 || res.data.code === 452) {
                        this.getAuth().then(() => {
                            this.getData(payload, retryCount + 1).then((r) => resolve(r)).catch(() => reject(errorMessage))
                        })
                    } else if (res.data.code === '0') {
                        resolve(res.data)
                    } else {
                        reject(errorMessage)
                    }
                }).catch(() => {
                    reject(errorMessage)
                })
            } else {
                this.getAuth().then(() => {
                    this.getData(payload, retryCount + 1).then((r) => resolve(r)).catch(() => reject(errorMessage))
                })
            }
        })
    },
    isAuthenticationAlive() {
        console.log(Date.now() - this.data.last, this.data.auth)
        if (Date.now() - this.data.last >= 1800000 || this.data.auth === '') {
            // 超过半小时，令牌过期
            console.log('令牌不可用')
            return false
        } else {
            return true
        }
    },
}
