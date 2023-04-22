async function mainEvent() {
    const key = askAPIKey(); // Ask for API key before continuing

    const reply = await fetch("https://haveibeenpwned.com/api/v3/breaches");
    const breaches = await reply.json();

    console.log(breaches)
}

function askAPIKey() {
    const apiKey = prompt("Please enter your API key:");
    if (apiKey === null || apiKey === "") {
      alert("API key is required to proceed.");
      askAPIKey();
    } else {
      // store the API key or proceed to the webpage using the API key
      console.log("API key entered:", apiKey);
      // replace this console log with your logic to store the API key or proceed to the webpage
      return apiKey;
    }
  }

document.addEventListener("DOMContentLoaded", async () => mainEvent());