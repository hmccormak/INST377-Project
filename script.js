async function mainEvent() {
  // Ask for API key before continuing if not in cache
  if (localStorage.getItem("k") === null) {
    askAPIKey();
  }

  const reply = await fetch("https://haveibeenpwned.com/api/v3/breaches");
  const breaches = await reply.json();

  console.log(breaches);

  localStorage.setItem("b", JSON.stringify(breaches));
  const storedBreaches = JSON.parse(localStorage.getItem("b"));
  console.log(storedBreaches);

  renderTopFiveChart(storedBreaches);
  renderBreachTimeline(storedBreaches);

  const filterByYear = document.querySelector("#years");
  filterByYear.addEventListener("change", (event) => {
    const selectedYear = event.target.value;
    renderTopFiveChart(storedBreaches, selectedYear);
  });
}

function renderTopFiveChart(data, selectedYear = "All") {
  const domainCounts = {};

  data.forEach((breach) => {
    let domain = breach.Domain;
    let year = new Date(breach.BreachDate).getFullYear();
    if (selectedYear === "All" || year == selectedYear) {
      if (domain) {
        if (!domainCounts[domain]) {
          domainCounts[domain] = breach.PwnCount;
        } else {
          domainCounts[domain] += breach.PwnCount;
        }
      }
    }
  });

  let sortedDomains = Object.entries(domainCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  let topFive = sortedDomains.map(([domain, count]) => ({
    label: domain,
    y: count,
  }));

  let titleText = "Top Websites by number of Breached Accounts";
  if (selectedYear !== "All") {
    titleText += " in " + selectedYear;
  }

  console.log("rendering top 5 chart...");
  let chart = new CanvasJS.Chart("topFiveContainer", {
    animationEnabled: true,
    title: {
      text: titleText,
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

function renderBreachTimeline(data) {
  let years = {};
  for (var i = 0; i < data.length; i++) {
    let date = new Date(data[i].BreachDate);
    let year = date.getFullYear();
    if (year in years) {
      years[year] += 1;
    } else {
      years[year] = 1;
    }
  }

  let sortedYears = Object.keys(years).sort(function (a, b) {
    return a - b;
  });

  let dataPoints = sortedYears.map(function (year) {
    return {
      x: new Date(year, 0),
      y: years[year],
    };
  });

  console.log("rendering timeline chart...");
  let chart = new CanvasJS.Chart("timelineContainer", {
    animationEnabled: true,
    title: {
      text: "Breaches by Year",
    },
    axisX: {
      title: "Year",
      valueFormatString: "YYYY",
      intervalType: "year",
    },
    axisY: {
      title: "Number of Breaches",
      minimum: 0,
    },
    data: [
      {
        type: "line",
        dataPoints: dataPoints,
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
    console.log("API key entered, but I wont tell.");
    localStorage.setItem("k", btoa(apiKey));
  }
}

document.addEventListener("DOMContentLoaded", async () => mainEvent());
