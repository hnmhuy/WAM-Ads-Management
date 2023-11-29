const ctx = document.getElementById("chart");

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
