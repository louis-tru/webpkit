import 'whatwg-fetch'

class Xhr {
  request(url) {
    return new Promise((resolve, reject) =>{
      fetch(url)
      .then(res=>{return res.json()})
      .then(json=>{
        resolve(json)
      })
      .catch(err => {
        reject()
      })
    })
  }
}

const xhr = new Xhr()

export default xhr