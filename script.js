async function mainEvent() {
  const key = askAPIKey(); // Ask for API key before continuing

  const reply = await fetch("https://haveibeenpwned.com/api/v3/breaches");
  const breaches = await reply.json();

  console.log(breaches);

  renderChart(breaches);
}

function renderChart(data) {
  const domainCounts = {};

  console.log("counting domains...");
  data.forEach((breach) => {
    const domain = breach.Domain;
    if (domain) {
      if (!domainCounts[domain]) {
        domainCounts[domain] = breach.PwnCount;
      } else {
        domainCounts[domain] += breach.PwnCount;
      }
    }
  });

  console.log("sorting domains...");
  const sortedDomains = Object.entries(domainCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topFive = sortedDomains.map(([domain, count]) => ({
    label: domain,
    y: count,
  }));

  console.log("rendering chart...");
  const chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    title: {
      text: "Top 5 Websites by number of Breached Accounts",
    },
    axisX: {
      title: "Website",
    },
    axisY: {
      title: "Number of Breached Accounts",
    },
    data: [
      {
        type: "column",
        dataPoints: topFive,
      },
    ],
  });

  chart.render();
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
