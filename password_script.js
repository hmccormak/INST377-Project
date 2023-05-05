async function mainEvent() {
    const getEmailInfo = document.querySelector("#pass_lookup");
    getEmailInfo.addEventListener("click", async (event) => {
      let userPass = document.getElementById("pass").value;
      let msgUint8 = new TextEncoder().encode(userPass);
      let hashBuffer = await crypto.subtle.digest("SHA-1", msgUint8);
      let hashArray = Array.from(new Uint8Array(hashBuffer));
      const shaPass = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
  
      hashSlice = shaPass.slice(0, 5);
      console.log(hashSlice);
      
      const response = await fetch(`https://api.pwnedpasswords.com/range/${hashSlice}`);
      
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      
      const responseBody = await response.text();
      const passList = responseBody.split("\n").map(line => {
        const [hashSuffix, count] = line.split(":");
        return { hashSuffix, count: parseInt(count) };
      });
      
      localStorage.setItem("p", JSON.stringify(passList));
      const storedPassList = JSON.parse(localStorage.getItem("p"));
      console.log(storedPassList);
    });
  }

document.addEventListener("DOMContentLoaded", async () => mainEvent());
