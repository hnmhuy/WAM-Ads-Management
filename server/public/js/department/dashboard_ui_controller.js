// -------------- FILTER ------------------


const filter = document.querySelector("#filter");
filter.appendChild(createChoiceCheck("filterID", "Chọn Quận"));

const filterDate = document.querySelector("#filter-date-container");
const dateChild = createFilterDate("filter-date", "Chọn ngày");
dateFilterHandlers(dateChild);

filterDate.appendChild(dateChild);






const ctx = document.getElementById("chart");
const lineChart = document.getElementById("line-chart");


// ------------ CREATE CHART ------------------

new Chart(ctx, {
    type: "doughnut",
    data: {
        labels: [
            "Đóng góp ý kiến",
            "Giải đáp thắc mắc",
            "Đăng ký thông tin",
            "Tố cáo sai phạm",
        ],
        datasets: [
            {
                label: "Phần trăm",
                data: [29, 25, 31, 15],
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

const date = new Date();

// Get an array of month names
const months = Array.from({ length: 12 }, (_, index) => {
  date.setMonth(index);
  return date.toLocaleString('en-US', { month: 'long' });
});


const labels = months;
const data = {
  labels: labels,
  datasets: [{
    label: 'Dataset 1',
    data: [0, 59, 80, 81, 56, 55, 40, 52, 60, 80, 90, 1000, 50],
    fill: true,
    borderColor: 'rgb(79, 62, 215)',
    backgroundColor: 'rgba(79, 62, 215,.2)',
    tension: 0.4
  },
  {
    label: 'Dataset 2',
    data: [0, 30, 600, 15, 4, 36, 40, 45, 68, 82, 350, 100, 96],
    fill: true,
    borderColor: 'rgb(207, 149, 19)',
    backgroundColor: 'rgba(207, 149, 19,.2)',
    tension: 0.4
  }
]
};



new Chart(lineChart, {
    type: 'line',
    data: data,
    options: {
      responsive: true,
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




// ------------------ FETCH DATA FOR CHART -----------------





// ------------------ FETCH DATA FOR TAG ------------------