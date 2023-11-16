
// Bảng các điểm đặt quảng cáo
const locations = {
    heading: ["Quận", "Phường", "Địa chỉ", "Loại vị trí", "Số lượng", "Hình thức", "Trang thái"],
    row: [
        {
            head1: "Bình Thạnh",
            head2: "7",
            head3: "23 Bùi Hữu Nghĩa",
            head4: "Hành lang an toàn giao thông",
            head5: "4",
            head6: "Thương mại",
            head7: "Đã quy hoạch"
        },
        {
            head1: "1",
            head2: "Bến Nghé",
            head3: "23 Nguyễn Thị Minh Khai",
            head4: "Đất công/Công viên",
            head5: "7",
            head6: "Cổ động chính trị",
            head7: "Chưa quy hoạch"
        },
        {
            head1: "Bình Thạnh",
            head2: "7",
            head3: "23 Bùi Hữu Nghĩa",
            head4: "Hành lang an toàn giao thông",
            head5: "4",
            head6: "Thương mại",
            head7: "Đã quy hoạch"
        },
        {
            head1: "1",
            head2: "Bến Nghé",
            head3: "23 Nguyễn Thị Minh Khai",
            head4: "Đất công/Công viên",
            head5: "7",
            head6: "Cổ động chính trị",
            head7: "Chưa quy hoạch"
        },
        {
            head1: "Bình Thạnh",
            head2: "7",
            head3: "23 Bùi Hữu Nghĩa",
            head4: "Hành lang an toàn giao thông",
            head5: "4",
            head6: "Thương mại",
            head7: "Đã quy hoạch"
        },
        {
            head1: "1",
            head2: "Bến Nghé",
            head3: "23 Nguyễn Thị Minh Khai",
            head4: "Đất công/Công viên",
            head5: "7",
            head6: "Cổ động chính trị",
            head7: "Chưa quy hoạch"
        },
        {
            head1: "Bình Thạnh",
            head2: "7",
            head3: "23 Bùi Hữu Nghĩa",
            head4: "Hành lang an toàn giao thông",
            head5: "4",
            head6: "Thương mại",
            head7: "Đã quy hoạch"
        },
        {
            head1: "1",
            head2: "Bến Nghé",
            head3: "23 Nguyễn Thị Minh Khai",
            head4: "Đất công/Công viên",
            head5: "7",
            head6: "Cổ động chính trị",
            head7: "Chưa quy hoạch"
        },
        {
            head1: "Bình Thạnh",
            head2: "7",
            head3: "23 Bùi Hữu Nghĩa",
            head4: "Hành lang an toàn giao thông",
            head5: "4",
            head6: "Thương mại",
            head7: "Đã quy hoạch"
        },
        {
            head1: "1",
            head2: "Bến Nghé",
            head3: "23 Nguyễn Thị Minh Khai",
            head4: "Đất công/Công viên",
            head5: "7",
            head6: "Cổ động chính trị",
            head7: "Chưa quy hoạch"
        },
        {
            head1: "Bình Thạnh",
            head2: "7",
            head3: "23 Bùi Hữu Nghĩa",
            head4: "Hành lang an toàn giao thông",
            head5: "4",
            head6: "Thương mại",
            head7: "Đã quy hoạch"
        },
        {
            head1: "1",
            head2: "Bến Nghé",
            head3: "23 Nguyễn Thị Minh Khai",
            head4: "Đất công/Công viên",
            head5: "7",
            head6: "Cổ động chính trị",
            head7: "Chưa quy hoạch"
        },
        {
            head1: "Bình Thạnh",
            head2: "7",
            head3: "23 Bùi Hữu Nghĩa",
            head4: "Hành lang an toàn giao thông",
            head5: "4",
            head6: "Thương mại",
            head7: "Đã quy hoạch"
        },
        {
            head1: "1",
            head2: "Bến Nghé",
            head3: "23 Nguyễn Thị Minh Khai",
            head4: "Đất công/Công viên",
            head5: "7",
            head6: "Cổ động chính trị",
            head7: "Chưa quy hoạch"
        },
        {
            head1: "Bình Thạnh",
            head2: "7",
            head3: "23 Bùi Hữu Nghĩa",
            head4: "Hành lang an toàn giao thông",
            head5: "4",
            head6: "Thương mại",
            head7: "Đã quy hoạch"
        },
        {
            head1: "1",
            head2: "Bến Nghé",
            head3: "23 Nguyễn Thị Minh Khai",
            head4: "Đất công/Công viên",
            head5: "7",
            head6: "Cổ động chính trị",
            head7: "Chưa quy hoạch"
        }
    ]
}
const reports = {
    heading: ["Quận", "Phường", "Địa chỉ", "Mã báo cáo", "Thời gian báo cáo", "Hình thức", "Trang thái"],
    row: [
        {
            head1: "Bình Thạnh",
            head2: "7",
            head3: "23 Bùi Hữu Nghĩa",
            head4: "MBC100001",
            head5: "16/11/2023",
            head6: "Tố giác tội phạm",
            head7: "Đã giải quyết"
        },
        {
            head1: "1",
            head2: "Bến Nghé",
            head3: "23 Nguyễn Thị Minh Khai",
            head4: "MBC100002",
            head5: "16/11/2023",
            head6: "Đóng góp ý kiến",
            head7: "Chưa giải quyết"
        },
        {
            head1: "Bình Thạnh",
            head2: "7",
            head3: "23 Bùi Hữu Nghĩa",
            head4: "MBC100001",
            head5: "16/11/2023",
            head6: "Tố giác tội phạm",
            head7: "Đã giải quyết"
        },
        {
            head1: "1",
            head2: "Bến Nghé",
            head3: "23 Nguyễn Thị Minh Khai",
            head4: "MBC100002",
            head5: "16/11/2023",
            head6: "Đóng góp ý kiến",
            head7: "Chưa giải quyết"
        },
        {
            head1: "Bình Thạnh",
            head2: "7",
            head3: "23 Bùi Hữu Nghĩa",
            head4: "MBC100001",
            head5: "16/11/2023",
            head6: "Tố giác tội phạm",
            head7: "Đã giải quyết"
        },
        {
            head1: "1",
            head2: "Bến Nghé",
            head3: "23 Nguyễn Thị Minh Khai",
            head4: "MBC100002",
            head5: "16/11/2023",
            head6: "Đóng góp ý kiến",
            head7: "Chưa giải quyết"
        },
        {
            head1: "Bình Thạnh",
            head2: "7",
            head3: "23 Bùi Hữu Nghĩa",
            head4: "MBC100001",
            head5: "16/11/2023",
            head6: "Tố giác tội phạm",
            head7: "Đã giải quyết"
        },
        {
            head1: "1",
            head2: "Bến Nghé",
            head3: "23 Nguyễn Thị Minh Khai",
            head4: "MBC100002",
            head5: "16/11/2023",
            head6: "Đóng góp ý kiến",
            head7: "Chưa giải quyết"
        },
        {
            head1: "Bình Thạnh",
            head2: "7",
            head3: "23 Bùi Hữu Nghĩa",
            head4: "MBC100001",
            head5: "16/11/2023",
            head6: "Tố giác tội phạm",
            head7: "Đã giải quyết"
        },
        {
            head1: "1",
            head2: "Bến Nghé",
            head3: "23 Nguyễn Thị Minh Khai",
            head4: "MBC100002",
            head5: "16/11/2023",
            head6: "Đóng góp ý kiến",
            head7: "Chưa giải quyết"
        },
        {
            head1: "Bình Thạnh",
            head2: "7",
            head3: "23 Bùi Hữu Nghĩa",
            head4: "MBC100001",
            head5: "16/11/2023",
            head6: "Tố giác tội phạm",
            head7: "Đã giải quyết"
        },
        {
            head1: "1",
            head2: "Bến Nghé",
            head3: "23 Nguyễn Thị Minh Khai",
            head4: "MBC100002",
            head5: "16/11/2023",
            head6: "Đóng góp ý kiến",
            head7: "Chưa giải quyết"
        },
        {
            head1: "Bình Thạnh",
            head2: "7",
            head3: "23 Bùi Hữu Nghĩa",
            head4: "MBC100001",
            head5: "16/11/2023",
            head6: "Tố giác tội phạm",
            head7: "Đã giải quyết"
        },
        {
            head1: "1",
            head2: "Bến Nghé",
            head3: "23 Nguyễn Thị Minh Khai",
            head4: "MBC100002",
            head5: "16/11/2023",
            head6: "Đóng góp ý kiến",
            head7: "Chưa giải quyết"
        },
        {
            head1: "Bình Thạnh",
            head2: "7",
            head3: "23 Bùi Hữu Nghĩa",
            head4: "MBC100001",
            head5: "16/11/2023",
            head6: "Tố giác tội phạm",
            head7: "Đã giải quyết"
        },
        {
            head1: "1",
            head2: "Bến Nghé",
            head3: "23 Nguyễn Thị Minh Khai",
            head4: "MBC100002",
            head5: "16/11/2023",
            head6: "Đóng góp ý kiến",
            head7: "Chưa giải quyết"
        }
    ]
}

const permissions = {
    heading: ["Mã quảng cáo", "Địa điểm", "Hình thức", "Công ty", "Trạng thái"],
    row: [
        {
            head1: "MQC0001",
            head2: "24 Bùi Hữu Nghĩa",
            head3: "Cổ động chính trị",
            head4: "Công ty TNHH MTV Alone",
            head5: "Đã hủy"
        },
        {
            head1: "MQC0002",
            head2: "24 Bùi Hữu Nghĩa",
            head3: "Đất công/Công viên",
            head4: "Công ty TNHH MTV Alone",
            head5: "Đang quảng cáo"
        },
        {
            head1: "MQC0001",
            head2: "24 Bùi Hữu Nghĩa",
            head3: "Cổ động chính trị",
            head4: "Công ty TNHH MTV Alone",
            head5: "Đã cấp phép"
        },
        {
            head1: "MQC0002",
            head2: "24 Bùi Hữu Nghĩa",
            head3: "Đất công/Công viên",
            head4: "Công ty TNHH MTV Alone",
            head5: "Đang quảng cáo"
        },
        {
            head1: "MQC0001",
            head2: "24 Bùi Hữu Nghĩa",
            head3: "Cổ động chính trị",
            head4: "Công ty TNHH MTV Alone",
            head5: "Đã cấp phép"
        },
        {
            head1: "MQC0002",
            head2: "24 Bùi Hữu Nghĩa",
            head3: "Đất công/Công viên",
            head4: "Công ty TNHH MTV Alone",
            head5: "Đang quảng cáo"
        },
        {
            head1: "MQC0001",
            head2: "24 Bùi Hữu Nghĩa",
            head3: "Cổ động chính trị",
            head4: "Công ty TNHH MTV Alone",
            head5: "Đã cấp phép"
        },
        {
            head1: "MQC0002",
            head2: "24 Bùi Hữu Nghĩa",
            head3: "Đất công/Công viên",
            head4: "Công ty TNHH MTV Alone",
            head5: "Đang quảng cáo"
        },
        {
            head1: "MQC0001",
            head2: "24 Bùi Hữu Nghĩa",
            head3: "Cổ động chính trị",
            head4: "Công ty TNHH MTV Alone",
            head5: "Đang chờ duyệt"
        },
        {
            head1: "MQC0002",
            head2: "24 Bùi Hữu Nghĩa",
            head3: "Đất công/Công viên",
            head4: "Công ty TNHH MTV Alone",
            head5: "Đang quảng cáo"
        },
        {
            head1: "MQC0001",
            head2: "24 Bùi Hữu Nghĩa",
            head3: "Cổ động chính trị",
            head4: "Công ty TNHH MTV Alone",
            head5: "Đã cấp phép"
        },
        {
            head1: "MQC0002",
            head2: "24 Bùi Hữu Nghĩa",
            head3: "Đất công/Công viên",
            head4: "Công ty TNHH MTV Alone",
            head5: "Đang quảng cáo"
        },
        {
            head1: "MQC0001",
            head2: "24 Bùi Hữu Nghĩa",
            head3: "Cổ động chính trị",
            head4: "Công ty TNHH MTV Alone",
            head5: "Đã cấp phép"
        },
        {
            head1: "MQC0002",
            head2: "24 Bùi Hữu Nghĩa",
            head3: "Đất công/Công viên",
            head4: "Công ty TNHH MTV Alone",
            head5: "Đang quảng cáo"
        },
        {
            head1: "MQC0001",
            head2: "24 Bùi Hữu Nghĩa",
            head3: "Cổ động chính trị",
            head4: "Công ty TNHH MTV Alone",
            head5: "Đã cấp phép"
        },
        {
            head1: "MQC0002",
            head2: "24 Bùi Hữu Nghĩa",
            head3: "Đất công/Công viên",
            head4: "Công ty TNHH MTV Alone",
            head5: "Đang quảng cáo"
        },
        {
            head1: "MQC0001",
            head2: "24 Bùi Hữu Nghĩa",
            head3: "Cổ động chính trị",
            head4: "Công ty TNHH MTV Alone",
            head5: "Đã cấp phép"
        },
        {
            head1: "MQC0002",
            head2: "24 Bùi Hữu Nghĩa",
            head3: "Đất công/Công viên",
            head4: "Công ty TNHH MTV Alone",
            head5: "Đang quảng cáo"
        },
        {
            head1: "MQC0001",
            head2: "24 Bùi Hữu Nghĩa",
            head3: "Cổ động chính trị",
            head4: "Công ty TNHH MTV Alone",
            head5: "Đã cấp phép"
        },
        {
            head1: "MQC0002",
            head2: "24 Bùi Hữu Nghĩa",
            head3: "Đất công/Công viên",
            head4: "Công ty TNHH MTV Alone",
            head5: "Đang quảng cáo"
        },
        {
            head1: "MQC0001",
            head2: "24 Bùi Hữu Nghĩa",
            head3: "Cổ động chính trị",
            head4: "Công ty TNHH MTV Alone",
            head5: "Đã cấp phép"
        },
        {
            head1: "MQC0002",
            head2: "24 Bùi Hữu Nghĩa",
            head3: "Đất công/Công viên",
            head4: "Công ty TNHH MTV Alone",
            head5: "Đang quảng cáo"
        },
        {
            head1: "MQC0001",
            head2: "24 Bùi Hữu Nghĩa",
            head3: "Cổ động chính trị",
            head4: "Công ty TNHH MTV Alone",
            head5: "Đã cấp phép"
        },
        {
            head1: "MQC0002",
            head2: "24 Bùi Hữu Nghĩa",
            head3: "Đất công/Công viên",
            head4: "Công ty TNHH MTV Alone",
            head5: "Đang quảng cáo"
        },
        {
            head1: "MQC0001",
            head2: "24 Bùi Hữu Nghĩa",
            head3: "Cổ động chính trị",
            head4: "Công ty TNHH MTV Alone",
            head5: "Đã cấp phép"
        },
        {
            head1: "MQC0002",
            head2: "24 Bùi Hữu Nghĩa",
            head3: "Đất công/Công viên",
            head4: "Công ty TNHH MTV Alone",
            head5: "Đang quảng cáo"
        }
    ]
}
module.exports = {
    locations, reports, permissions
}