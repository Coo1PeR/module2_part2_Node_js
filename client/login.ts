const TOKEN_KEY: string = 'token'; // expected token
const TOKEN_LIFE_TIME: number = 10 * 60 * 1000; // 10 minutes

const btnLogin: HTMLElement = document.querySelector('.btnLogin');

function clearLocalStorage() {
  localStorage.removeItem(TOKEN_KEY);
  location.reload();
}

interface User {
  email: string;
  password: string;
}

async function login(user: User) {
  try {
    const responseLogin = await fetch(
      'http://127.0.0.1:2000/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(user),
      }
    );

    const resultLogin = await responseLogin.json();
    const resultToken = resultLogin.token;

    if (resultToken === TOKEN_KEY) {
      localStorage.setItem(TOKEN_KEY, resultToken);
      setTimeout(clearLocalStorage, TOKEN_LIFE_TIME);

      alert('You have successfully logged in!');
    }
  } catch (error) {
    alert(error);
  }
}

btnLogin.addEventListener('click', element => {
  element.preventDefault();

  const passwordValid: RegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8}$/;

  const mail: string = (document.getElementById('email') as HTMLInputElement).value;
  const password: string = (document.getElementById('password') as HTMLInputElement).value;

  if (!passwordValid.test(password)) {
    return alert('Password is not valid');
  }

  const user: User = {
    email: mail,
    password: password,
  };

  login(user);
});

export {};
