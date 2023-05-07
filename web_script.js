async function mainEvent() {
  if (
    (localStorage.getItem("b") === null) |
    (localStorage.getItem("b") === "{}")
  ) {
    const reply = await fetch("https://haveibeenpwned.com/api/v3/breaches");
    const breaches = await reply.json();
    localStorage.setItem("b", JSON.stringify(breaches));
    const storedBreaches = JSON.parse(localStorage.getItem("b"));
  }

  const storedBreaches = JSON.parse(localStorage.getItem("b"));

  const siteLookupButton = document.querySelector("#site_lookup");
  siteLookupButton.addEventListener("click", (event) => {
    const siteInput = document.querySelector("#site");
    const siteName = siteInput.value;
    const site = storedBreaches.find((breach) => breach.Domain === siteName);
    console.log(site);
    
    let outName = document.getElementById('site_name');
    let outDate = document.getElementById('date');
    let outCount = document.getElementById('count');
    let outBlurb = document.getElementById('site_blurb');
    
    if (!site) {
      outName.innerHTML = 'Name: Not found in DB!';
      outDate.innerHTML = 'Breach date: Safe!';
      outCount.innerHTML = 'Breach count: Safe!';
      outBlurb.innerHTML = 'Safe!';
    } else {
      outName.innerHTML = `Name: ${site.Title}`
      outDate.innerHTML = `Date: ${site.BreachDate}`
      outCount.innerHTML = `Breach count: ${site.PwnCount}`
      outBlurb.innerHTML = `${site.Description}`
    }
  });

  const passLookupButton = document.querySelector('#pass_lookup');
  passLookupButton.addEventListener('click', async (event) =>{
    const passInput = document.querySelector("#pass");
    const pass = passInput.value;
    console.log(passInput);

    let msgUint8 = new TextEncoder().encode(pass);
    let hashBuffer = await crypto.subtle.digest("SHA-1", msgUint8);
    let hashArray = Array.from(new Uint8Array(hashBuffer));
    const shaPass = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    hashSlice = shaPass.slice(0, 5);
    console.log(shaPass);

    const passReply = await fetch(`https://api.pwnedpasswords.com/range/${hashSlice}`);
    const passBody = await passReply.text();
    console.log(passBody);

    matchCount = passBody.length;
    console.log(matchCount);

    let outHash = document.getElementById('hash_info');
    let outPwn = document.getElementById('exposures');
    let outJudge = document.getElementById('verdict');

    outHash.innerHTML = `SHA1 hash: ${shaPass}`;
    outPwn.innerHTML = `Breach count: ${matchCount}`;
    outJudge.innerHTML = 'Strength: Proabably not good'
  });
}

async function refreshStorage() {
  if (localStorage.getItem("b") === !null) {
    localStorage.clear();
    const reply = await fetch("https://haveibeenpwned.com/api/v3/breaches");
    const breaches = await reply.json();
    localStorage.setItem("b", JSON.stringify(breaches));
    const storedBreaches = JSON.parse(localStorage.getItem("b"));
  }
}

document.addEventListener("DOMContentLoaded", async () => mainEvent());
