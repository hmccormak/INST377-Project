async function mainEvent() {
  if (
    (localStorage.getItem("b") === null) |
    (localStorage.getItem("b") === "{}")
  ) {
    const reply = await fetch("https://haveibeenpwned.com/api/v3/breaches");
    const breaches = await reply.json();
    localStorage.setItem("b", JSON.stringify(breaches));
  }

  const siteLookupButton = document.querySelector("#site_lookup");
  siteLookupButton.addEventListener("click", (event) => {
    const siteInput = document.querySelector("#site");
    const siteName = siteInput.value;
    const site = storedBreaches.find((breach) => breach.Name === siteName);
  });
}

document.addEventListener("DOMContentLoaded", async () => mainEvent());
