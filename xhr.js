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

	post(url, data){
  	return new Promise((resolve, reject) => {
			fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			}).then(res => {
				return res.json()
			}).then(json => {
				resolve(json)
			}).catch(err => {
				reject()
			})
		})
	}
}

const xhr = new Xhr()

export default xhr
