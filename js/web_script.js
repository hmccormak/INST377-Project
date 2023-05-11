async function mainEvent() {
  if (
    (localStorage.getItem("b") === null) |
    (localStorage.getItem("b") === "{}")
  ) {
    const reply = await fetch("https://haveibeenpwned.com/api/v3/breaches");
    const breaches = await reply.json();
    localStorage.setItem("b", JSON.stringify(breaches));
  }

  const storedBreaches = JSON.parse(localStorage.getItem("b"));

  const siteLookupButton = document.querySelector("#site_lookup");
  siteLookupButton.addEventListener("click", (event) => {
    const siteInput = document.querySelector("#site");
    const siteName = siteInput.value;
    const site = storedBreaches.find((breach) => breach.Domain === siteName);
    console.log(site);

    // i have no idea why i need to do this but the other queryselector is fine
    let outName = document.querySelector("#name");
    const nameSpan = outName.querySelector("span");
    let outDate = document.querySelector("#date");
    const dateSpan = outDate.querySelector("span");
    let outCount = document.querySelector("#count");
    const countSpan = outCount.querySelector("span");
    const outBlurb = document.querySelector("#site_blurb");
    const siteLogo = document.querySelector("#site_logo");

    if (!site) {
      nameSpan.dataset.after = "Not found in DB!";
      dateSpan.dataset.after = "Safe!";
      countSpan.dataset.after = "Safe!";
      outBlurb.innerHTML = "Safe!";
    } else {
      nameSpan.dataset.after = site.Title;
      dateSpan.dataset.after = site.BreachDate;
      countSpan.dataset.after = site.PwnCount;
      outBlurb.innerHTML = site.Description;
      siteLogo.src = site.LogoPath;
    }
  });

  const passLookupButton = document.querySelector("#pass_lookup");
  passLookupButton.addEventListener("click", async (event) => {
    const passInput = document.querySelector("#pass");
    const pass = passInput.value;
    console.log(passInput);

    let msgUint8 = new TextEncoder().encode(pass);
    let hashBuffer = await crypto.subtle.digest("SHA-1", msgUint8);
    let hashArray = Array.from(new Uint8Array(hashBuffer));
    const shaPass = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    hashPrefix = shaPass.slice(0, 5);
    hashSuffix = shaPass.slice(5);
    console.log(shaPass);

    const passReply = await fetch(
      `https://api.pwnedpasswords.com/range/${hashPrefix}`
    );
    const passBody = await passReply.text();
    console.log(passBody);

    const lines = passBody.trim().split("\n");

    let match = lines.find((line) => line.startsWith(hashSuffix.toUpperCase()));

    const hashInfoSpan = document.querySelector("#hash_info .no-bold");
    const exposuresSpan = document.querySelector("#exposures .no-bold");
    const verdictSpan = document.querySelector("#verdict .no-bold");

    if (match) {
      match = match.replace(/\r$/, "");
      console.log(match.slice(36));

      const matchCount = parseInt(match.slice(36));

      hashInfoSpan.dataset.after = shaPass;
      exposuresSpan.dataset.after = matchCount;
      let judgement = verdict(matchCount);
      verdictSpan.dataset.after = judgement;
    } else {
      const matchCount = 0;

      hashInfoSpan.dataset.after = shaPass;
      exposuresSpan.dataset.after = matchCount;
      let judgement = verdict(matchCount);
      verdictSpan.dataset.after = judgement;
    }
  });
}

function verdict(count) {
  if (count < 1) {
    return "Safe!";
  } else if (count < 100) {
    return "Breached!";
  } else {
    return "Everyone knows it!";
  }
}

async function refreshStorage() {
  if (localStorage.getItem("b") === !null) {
    localStorage.clear();
    const reply = await fetch("https://haveibeenpwned.com/api/v3/breaches");
    const breaches = await reply.json();
    localStorage.setItem("b", JSON.stringify(breaches));
  }
}

document.addEventListener("DOMContentLoaded", async () => mainEvent());
