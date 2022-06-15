async function login() {
  console.log("button was clicked");
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  const data = await response.json();
  console.log(data);
  if (data.success) {
    window.location.href = "/";
  } else {
    alert(data.message);
  }
}

async function register() {
  console.log("button was clicked");
  const username = document.getElementById("usernameRegister").value;
  const password = document.getElementById("passwordRegister").value;
  const password2 = document.getElementById("password2Register").value;
  if (password !== password2) {
    alert("Passwords do not match");
    return;
  }
  const response = await fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  const data = await response.json();
  console.log(data);
  if (data.success) {
    window.location.href = "/";
  } else {
    alert(data.message);
  }
}
