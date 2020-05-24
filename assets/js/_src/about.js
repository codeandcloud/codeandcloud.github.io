(function () {
  const name = document.querySelector('#contact-name');
  const email = document.querySelector('#contact-email');
  const message = document.querySelector('#contact-message');
  const status = document.querySelector('#contact-status');
  const button = document.querySelector('#send-mail');
  document.querySelector('#contact-form').addEventListener("submit", function (ev) {
      button.disabled = true;
      button.innerHTML = 'Sending Message...';
      ev.preventDefault();
      postData('https://formspree.io/mbjzglaa', {
          name: name.value,
          email: email.value,
          message: message.value
      })
          .then(response => {
              status.innerHTML = response.ok ? 'Message successfully sent.' : 'Message sending failed.';
              button.innerHTML = 'Send Message';
              name.value = '';
              email.value = '';
              message.value = '';
              setTimeout(_ => {
                  button.disabled = false;
                  status.innerHTML = '';
              }, 10000);
          }).catch(err => console.log(err));
  });
  async function postData(url, data) {
      const response = await fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      });
      return response.json();
  }
}());
