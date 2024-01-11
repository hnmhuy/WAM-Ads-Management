const today = new Date();

// Extract year, month, and day components
const year = today.getFullYear();
const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
const day = today.getDate().toString().padStart(2, '0');

// Formatted date string
const formattedToday = `${year}-${month}-${day}`


// ------------------ FETCH DATA CALL BACK FOR FILTER ------------------
const fetchDistictData = async () => {
  console.log("FETCH DISTRICT DATA");
  const districtData = await fetch("/api/area/getArea?opts=db&level=1").then(res => res.json());
  let data = undefined;
  if(districtData.status === 'success') {
    data = [];
    districtData.data.forEach(district => {
      data.push({
        id: district.id,
        name: district.name,
        checked: false
      })
    })
  }
  return data;
}

const selectDistrictHandler = (e) => {
  if(e.target.checked) {
    console.log("SELECTED: ", e.target);
    console.log("SELECTED: ", e.target.value);
    onClickAddRequestDataset(e.target.value);
  }
}

// --------------- SET DEFAULT VALUE FOR THE DATE --------
const monthInput = document.getElementById('month');
console.log(monthInput.value);

function setDefaultMonth()
{
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based

  const defaultValue = `${year}-${month}`;
  monthInput.value = defaultValue;
}

setDefaultMonth();


// --------------------- ONLOAD SCREEN --------------------
const monthReportContainer = document.querySelector(".month-report");

const feedbackID = monthReportContainer.querySelector("#feedback-tag");
const requestID = monthReportContainer.querySelector("#request-tag");
const adID = monthReportContainer.querySelector("#ad-tag");


window.onload = fetchMonthReportData(feedbackID, requestID, adID, monthInput.value);



// ------------------ FETCH DATA FOR CHART -----------------
const doughnutChartContainer = document.querySelector(".chart-container");
const totalFeedback = doughnutChartContainer.querySelector(".total");
let labelsDoughnut = [], dataDoughnut = [];
function convertDate (date)
{
  
    const dateString = date.split("/");
    let day = dateString[0];
    let month = dateString[1];
    let year = dateString[2];
    return `${year}-${month}-${day}`
  
}

async function getFilterDate(e)
{
  console.log("today",e);
  fetchFeedbackFilterDate(e);
  
}

async function fetchFeedbackFilterDate(e)
{
  let date, mode;
  let container = document.querySelector(".detail-container");

  if (e.includes(" to "))
  {
    const periodString = e.split(" to ");
    const startDate = convertDate(periodString[0]);
    const endDate = convertDate(periodString[1]) ;
    date = `${startDate}to${endDate}`
    mode = "period";

  }
  else if (e.includes("/"))
  {
    date = convertDate(e);
    mode = "date";
  }
  else
  {
    date = e;
    mode = "date";
  }
  console.log("DATE",date);
  let feedbackData = await fetch(`/api/analysis/getQuantity?type=feedback&mode=${mode}&date=${date}`).then(res => res.json());
  feedbackData = preProcessFeedbackData(feedbackData);
  await generateDoughnutChart(feedbackData);
  console.log("DATA: ", feedbackData);
  generateDetailChart(container, feedbackData)
  
}

window.onload = fetchFeedbackFilterDate(formattedToday);






// -------------- FILTER ------------------

const filter = document.querySelector("#filter");
filter.appendChild(createChoiceCheck("filterID", "Chọn Quận", "fetchDistictData", "selectDistrictHandler"));

const filterDate = document.querySelector("#filter-date-container");
const dateChild = createFilterDate("filter-date", "Chọn ngày");
let calendar = dateFilterHandlers(dateChild, getFilterDate);
setDateForDateFilter(calendar, dateChild, today);
filterDate.appendChild(dateChild);


const ctx = document.getElementById("chart");
const lineChart = document.getElementById("line-chart");


// ------------ CREATE CHART ------------------


const doughnut = new Chart(ctx, {
    type: "doughnut",
    data: {
        labels: [],
        datasets: [
            {
                label: "Phần trăm",
                data: [],
                backgroundColor: [
                    "rgb(38, 32, 88)",
                    "rgb(79, 62, 215)",
                    "rgb(183, 203, 191)",
                    "rgb(207, 149, 19)",
                ],
                hoverOffset: 4,
            },
        ],
    },
    options: {
        responsive: false,
        borderJoinStyle: "round",
        borderRadius: 10,
        hoverBorderWidth: 8,
        borderWidth: 5,
        plugins: {
            legend: false,
        },
        animation: {
            animateScale: true,
            animateRotate: true,
        },
    },
});


const currentMonth = today.getMonth() + 1; // Adding 1 because months are zero-indexed
const months = Array.from({ length: currentMonth }, (_, index) => {
  const newDate = new Date(today);
  newDate.setMonth(today.getMonth() - index);
  return newDate.toLocaleString('en-US', { month: 'long' });
});


console.log("MONTH: ", months);
const labels = months;
const data = {
  labels: '',
  datasets: []
};



const areaChart = new Chart(lineChart, {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      hoverBorderWidth: 5,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Đăng ký'
        },
      },
      
    },
})


const onClickAddRequestDataset = async function (e)
{
  const requestData = await fetch(`api/analysis/getQuantity?type=request&mode=month&areaId=${e}`).then(res => res.json());
  console.log("REQUEST: ",requestData.areaName);
  await addDataset(requestData);
  await addData();
  await onClickRemoveRequestData("Quận 5");
  
}




function addDataset(requestData)
{
  const color = setBg();
  const rgbaColor = hexToRgba(color,0.2);
  const newDataset = {
    label: requestData.areaName,
    backgroundColor: rgbaColor,
    borderColor: color,
    data: requestData.monthData,
    tension: 0.4,
    fill: true,
  };  
  console.log("DATA SET", newDataset);
  areaChart.data.datasets.push(newDataset);
  areaChart.update();

}

function addData()
{
  const data = areaChart.data;
  if (data.datasets.length > 0) {
    data.labels = months;
    areaChart.update();
  }

}

const onClickRemoveRequestData = function (areaName)
{
  // areaChart.data.datasets.forEach(dataset => {
  //   if (dataset.label === areaName)
  //   {
  //     areaChart.data.datasets.pop();

  //   }
  // })
  // areaChart.update();
  areaChart.data.datasets = areaChart.data.datasets.filter(dataset => dataset.label !== areaName);
  console.log("DELETE", areaChart.data.datasets);


}



function generateDoughnutChart (data)
{
  let total = 0;
  let percentDoughnut = [];

  for (let i = 0; i < data.length; i++)
  {
    labelsDoughnut[i] = data[i].categoryName;
    dataDoughnut[i] = data[i].count
    total += parseInt(dataDoughnut[i]);
  }

  for (let i = 0; i < data.length; i++)
  {
    percentDoughnut[i] = (parseInt(dataDoughnut[i]) / total) * 100;
  }

  totalFeedback.textContent = total === 0 ? "Không có dữ liệu" : total;

  doughnut.data.labels = [];
  doughnut.data.datasets[0].data = [];
  doughnut.data.labels = labelsDoughnut;
  doughnut.data.datasets[0].data = percentDoughnut;
  doughnut.data.datasets[0].backgroundColor = [];
  doughnut.data.datasets[0].backgroundColor = bgColorArray;


  console.log("chart: ", doughnut.data.datasets[0].data);

  doughnut.update();
  
}

let bgColorArray;

const setBg = () => {
  const randomColor = Math.floor(Math.random()*16777215).toString(16);
  return `#${randomColor}`;
}

function hexToRgba(hex, alpha) {
  hex = hex.replace(/^#/, '');
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function preProcessFeedbackData(data)
{
  let length = data.length;
  if (bgColorArray === undefined)
  {
    bgColorArray = new Array(length).fill().map(()=>setBg());
  }
  else
  {
    if (bgColorArray.length < data.length);
    bgColorArray = bgColorArray.concat(new Array(length - bgColorArray.length).fill().map(()=>setBg()));
  }
  data.forEach((data, index) => {
    data.color = bgColorArray[index];
  })
  return data;
}

function generateDetailFeedback(data)
{
  let detailDiv = document.createElement("div");
  detailDiv.classList.add("detail");
  let done = parseInt(data.done);
  let count = parseInt(data.count);


  let percentDone = count === 0 ? 0 : (done/count) * 100;

  
  let percentDoneCircle = 219.911 - (percentDone / 100) * 219.911;
  detailDiv.innerHTML = ` 
  <div class="detail-amount">
        <p style="color: ${data.color};">${data.categoryName}</p>
        <p>${data.count}</p>
  </div>
      <div class="circle-container">
        <svg width="80" height="80" style=" stroke-dashoffset: ${percentDoneCircle};">
            <circle cx="40" cy="40" r="35"></circle>
        </svg>
      <div class="percentage-text">${percentDone.toFixed(1)}</div>
  </div>`

  return detailDiv;
}

function generateDetailChart(container, data)
{
  container.innerHTML =`
  <div
                    style="position: sticky; top: 0; background-color: rgb(249, 250, 253); width: 100%; z-index: 2; padding-top: 15px;">
                    <h4>Chi tiết</h4>
                    <p>Số lượng và tỉ lệ hoàn thành</p>
                </div>
  `
  data.forEach(data => {
    container.appendChild(generateDetailFeedback(data));
  })
}


// ------------------ FETCH DATA FOR TAG ------------------



async function fetchMonthReportData(feedbackID, requestID, adID, date)
{
  try
  {
    const feedbackData = await fetch(`/api/analysis/getQuantity?type=feedback&mode=month&date=${date}`).then(res => res.json());
    console.log(feedbackData);
    generateTag(feedbackID, feedbackData);
    const requestData = await fetch(`/api/analysis/getQuantity?type=request&mode=month&areaId=all&date=${date}`).then(res => res.json());
    generateTag(requestID, requestData);
    const adData = await fetch(`/api/analysis/getQuantity?type=adPlace&mode=month&date=${date}`).then(res => res.json());
    generateTag(adID, adData);
  }catch(err)
  {
    console.log(err);
  }
}

function onClickDate(e)
{
  fetchMonthReportData(feedbackID, requestID, adID, e.value);
}

function generateTag(tagId, data)
{
  let percent;
  let amountDiv = tagId.children[1];
  let percentDiv = tagId.children[2];
  let img = percentDiv.children[0];
  let percentContent = percentDiv.children[1];
  amountDiv.textContent = data.thisMonth.count;
  let lastMonth = data.lastMonth.count
  percent = lastMonth === 0 ? 100 : ((data.thisMonth.count - lastMonth) / lastMonth) * 100;
  if (data.thisMonth.count === 0 && lastMonth === 0)
    percent = 0;
  if(percent < 0)
  {

    percent = -percent;
    percentDiv.style.backgroundColor = 'var(--report-card-down)';
    img.src = "/public/images/down-arrow.svg"
    img.alt = "arrow-down"
    percentContent.textContent = `${percent.toFixed(1)}%`
  }
  else if(percent > 0)
  {
    percentDiv.style.backgroundColor = 'var(--report-card-up)';
    img.src = "/public/images/up-arrow.svg"
    img.alt = "arrow-up"
    percentContent.textContent = `${percent.toFixed(1)}%`
  }
  else
  {
    percentDiv.style.backgroundColor = 'var(--report-card-noChange)';

    img.src = "/public/images/noChange-arrow.svg"
    img.alt = "arrow"
    percentContent.textContent = `${percent}%`
  }

}

