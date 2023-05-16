module.exports = function myFunction(data2){





   const axios = require('axios');
const FormData = require('form-data');
let data = new FormData();
data.append('channel', 'sms');
data.append('phone_sms', data2);
data.append('callback_url', 'https://voting.com/payments/otp-callback/');
data.append('success_redirect_url', 'https://voting.com/payments/qHgZiJQ8YF/otp-complete/');
data.append('fail_redirect_url', 'https://voting.com/payments/qHgZiJQ8YF/otp-fail/');
data.append('metadata', '{"order_id":"xfdu48sfdjsdf", "agent_id":2258}');
data.append('captcha', 'true');
data.append('hide', 'true');
data.append('lang', 'en');

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://otp.dev/api/verify/',
  headers: { 
    'Authorization': 'Basic eG9yVjlicDZVN2gxUk5kQVhEV3RjTFNmd0plRWkwSHk6bmdxcjhhNHltdzB4ZjViMjFwdjZraWp1em83c3QzY2g=', 
    'Cookie': 'csrftoken=b6cKd6ufiEyIpWmKChqeCjyu41QbVXplVtPfX6NxKwN1XzH3gYILsYS09BckPs7M', 
    ...data.getHeaders()
  },
  data : data
};

axios.request(config)
.then((response) => {


result = JSON.stringify(response.data);
const json = JSON.parse(result);

const link = json.link;


// sending the post data:::
let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: link,
    headers: { 
      'Cookie': 'csrftoken=b6cKd6ufiEyIpWmKChqeCjyu41QbVXplVtPfX6NxKwN1XzH3gYILsYS09BckPs7M'
    }
  };
  
  axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });
  



// ends here


})

// axios
.catch((error) => {
  console.log(error);
});

}
