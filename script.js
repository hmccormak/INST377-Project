async function mainEvent() {

  if (localStorage.getItem("b") === null | localStorage.getItem("b") === '{}') {
    const reply = await fetch("https://haveibeenpwned.com/api/v3/breaches");
    const breaches = await reply.json();
    localStorage.setItem("b", JSON.stringify(breaches));
  }

  const storedBreaches = JSON.parse(localStorage.getItem("b"));
  console.log(storedBreaches)
  
  renderTopFiveChart(storedBreaches);
  renderBreachTimeline(storedBreaches);
  renderPyramid(storedBreaches);

  const refreshData = document.querySelector("#refresh");
  refreshData.addEventListener("click", (event) => {
    console.log("refreshing...")
    refreshStorage();
    const storedBreaches = JSON.parse(localStorage.getItem("b"));
    renderTopFiveChart(storedBreaches);
    renderBreachTimeline(storedBreaches);
    renderPyramid(storedBreaches);
  });

  const filterByYear = document.querySelector("#years");
  filterByYear.addEventListener("change", (event) => {
    const selectedYear = event.target.value;
    renderTopFiveChart(storedBreaches, selectedYear);
    const storedBreaches = JSON.parse(localStorage.getItem("b"));
  });
}

async function refreshStorage() {
  if (localStorage.getItem("b") ===! null) {
    localStorage.clear();
    const reply = await fetch("https://haveibeenpwned.com/api/v3/breaches");
    const breaches = await reply.json();
    localStorage.setItem("b", JSON.stringify(breaches));
  }
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
      interval: 1,
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

function renderPyramid(data) {
  const countsByDataclassCount = {};
  data.forEach(breach => {
    const dataclassCount = breach.DataClasses.length;
    countsByDataclassCount[dataclassCount] = countsByDataclassCount[dataclassCount] || 0;
    countsByDataclassCount[dataclassCount]++;
  });

  const dataPoints = [];
  Object.entries(countsByDataclassCount).forEach(([dataclassCount, count]) => {
    dataPoints.push({ label: `${dataclassCount} Dataclasses`, y: count });
  });

  const chart = new CanvasJS.Chart('pyramidContainer', {
    animationEnabled: true,
    title: {
      text: 'Breaches by Number of Dataclasses'
    },
    data: [{
      type: 'pyramid',
      toolTipContent: '<b>{label}</b><br>{y} breaches',
      indexLabelFontColor: '#000',
      dataPoints: dataPoints
    }]
  });
  chart.render();
}

document.addEventListener("DOMContentLoaded", async () => mainEvent());
