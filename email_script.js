async function mainEvent() {
  if (localStorage.getItem("k") === null) {
    askAPIKey();
  }

  const getEmailInfo = document.querySelector("#email_lookup");
  getEmailInfo.addEventListener("click", (event) => {
    let userEmail = document.getElementById("email").value;
    let key = localStorage.getItem("k");
    console.log(userEmail);
    console.log(key);
    emailRequest();
  });
}

async function emailRequest() {
  fetch(
    "https://haveibeenpwned.com/api/v3/breachedaccount/hmccormack0@gmail.com ", {
    method: "GET",
    credentials: 'include',
    headers: {
      'hibp-api-key': 'KEYHERE',
    },
  }
  )
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
  console.log(response)
}

function askAPIKey() {
  const apiKey = prompt("Please enter your API key:");
  if (apiKey === null || apiKey === "") {
    alert("API key is required to proceed.");
    askAPIKey();
  } else {
    console.log("API key entered, but I wont tell.");
    localStorage.setItem("k", btoa(apiKey));
  }
}

document.addEventListener("DOMContentLoaded", async () => mainEvent());
