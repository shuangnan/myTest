//这里实现一些polyfill方法
//以兼容低版本浏览器
//yinwaluo 20220217

export function polyfill() {
    if (typeof (Promise.allSettled) === "undefined") {
        polyfillAllSettled();
    }
}

function polyfillAllSettled() {
    Promise.allSettled = function (values) {
        let promises = [].slice.call(values)
        return new Promise((resolve, reject) => {
            let result = [], count = 0
            promises.forEach(promise => {
                Promise.resolve(promise).then(value => {
                    result.push({ status: 'fulfilled', value })
                }).catch(err => {
                    result.push({ status: 'rejected', value: err })
                }).finally(() => {
                    if (++count === promises.length) {
                        resolve(result)
                    }
                })
            })
        })
    }
}