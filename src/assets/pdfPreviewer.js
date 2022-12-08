import axios from 'axios'

export default {
  /**
   * 浏览器原生在线预览PDF (Chrome内核可用)
   * @param {String} url 预览的PDF文件地址
   */
  previewPDFNative(url) {
    axios({
      method: 'get',
      url: url,
      responseType: 'blob'
    }).then((res) => {
      let binary = []
      binary.push(res.data)
      let url = URL.createObjectURL(new Blob(binary, {type: 'application/pdf'}))
      window.open(url)
    })
  },
  getPDFPreviewBlob(url) {
    return new Promise((resolve,rej) => {
      axios({
        method: 'get',
        url: url,
        responseType: 'blob'
      }).then((res) => {
        let binary = []
        binary.push(res.data)
        let url = URL.createObjectURL(new Blob(binary, {type: 'application/pdf'}))
        console.log(url)
        resolve(url)
      })
    })
  }
}