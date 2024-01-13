const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const models = require("./models");
const port = 3000;

require('dotenv').config();

const adminUser = {
    email: process.env.admin_email,
    password: process.env.admin_password,
    first_name: process.env.admin_name,
    areaLevel: 0,
    delegation: null,
    dob: "1999-01-01",
}

async function createFields() {
    let data = [
        {
            id: "T1",
            name: "Vị trí",
            description: "Mô tả ngắn gọn vị trí điểm đặt quảng cáo"
        },
        {
            id: "T2",
            name: "Mục đích",
            description: "Chủ đề chung của các bảng quảng cáo"
        },
        {
            id: "T3",
            name: "Loại QC",
            description: "Loại bảng quảng cáo được lắp đặt"
        },
        {
            id: "T4",
            name: "Phản ánh",
            description: "Phân loại phản ánh từ người dân"
        }
    ]

    try {
        for(let i = 0; i < data.length; i++) {
            await models.field.create(data[i]);
        }
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function createCategories() {
    let data = [
        {
            name: "Đất công/ Công viên/Hành lang an toàn giao thông",
            description: "Đất công/ Công viên/Hành lang an toàn giao thông",
            field_id: "T1"
        },
        {
            name: "Đất tư nhân/Nhà ở riêng lẻ",
            description: "Đất tư nhân/Nhà ở riêng lẻ",
            field_id: "T1"
        },
        {
            name: "Trung tâm thương mại",
            description: "Trung tâm thương mại",
            field_id: "T1"
        },
        {
            name: "Chợ",
            description: "Chợ",
            field_id: "T1"
        },
        {
            name: "Nhà chờ xe buýt",
            description: "Nhà chờ xe buýt",
            field_id: "T1"
        },
        {
            name: "Cây xăng",
            description: "Cây xăng",
            field_id: "T1"
        },
        {
            name: "Cổ động chính trị",
            description: "Cổ động chính trị",
            field_id: "T2"
        },
        {
            name: "Quảng cáo thương mại",
            description: "Quảng cáo thương mại",
            field_id: "T2"
        },
        {
            name: "Xã hội hóa",
            description: "Xã hội hóa",
            field_id: "T2"
        },
        {
            name: "Trụ bảng hiflex",
            description: "Trụ bảng hiflex",
            field_id: "T3"
        },
        {
            name: "Trụ màn hình điện tử LED",
            description: "Trụ màn hình điện tử LED",
            field_id: "T3"
        },
        {
            name: "Trụ hộp đèn",
            description: "Trụ hộp đèn",
            field_id: "T3"
        },
        {
            name: "Bảng hiflex ốp tường",
            description: "Bảng hiflex ốp tường",
            field_id: "T3"
        },
        {
            name: "Trụ treo băng rôn dọc",
            description: "Trụ treo băng rôn ngang",
            field_id: "T3"
        },
        {
            name: "Trụ/Cụm pano",
            description: "Trụ/Cụm pano",
            field_id: "T3"
        },
        {
            name: "Cổng chào",
            description: "Cổng chào",
            field_id: "T3"
        },
        {
            name: "Trung tâm thương mại",
            description: "Trung tâm thương mại",
            field_id: "T3"
        },
        {
            name: "Tố giác sai phạm",
            description: "Tố giác sai phạm",
            field_id: "T4"
        },
        {
            name: "Đóng góp ý kiến",
            description: "Đóng góp ý kiến",
            field_id: "T4"
        },
        {
            name: "Giải đáp thắc mắc",
            description: "Giải đáp thắc mắc",
            field_id: "T4"
        },
        {
            name: "Đăng ký nội dung",
            description: "Đăng ký nội dung",
            field_id: "T4"
        }
    ]

    try {
        await models.category.bulkCreate(data);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function preprocessData(formData) {
    console.log(formData);
    let {email, name, phone, dob, delegation, areaLevel, password} = formData;
    var formattedDate = dob.replace(/-/g, '');
    var sortedDate = formattedDate.slice(6, 8) + formattedDate.slice(4, 6) + formattedDate.slice(0, 4);
    const hashedPassword = await bcrypt.hash(password, 10); 
  
    const nameParts = name.split(' ');
    // The first part is the last name
    const lastName = nameParts.shift();
  
    // The remaining parts are the first name
    const firstName = nameParts.join(' ');
  
    areaLevel = parseInt(areaLevel);
    if(delegation === '') {
      delegation = null;
    }
  
    return {
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: hashedPassword,
      phone: phone,
      areaLevel: areaLevel,
      delegation: delegation,
      dob: dob
    }
}

app.get("/createTables", async (req, res) => {
    models.sequelize.sync().then(async () => {
        res.redirect("/createFields");
    });
})

app.get("/createFields", async (req, res) => {
    let isCreated = await createFields();
    if(isCreated) {
        res.redirect("/createCategories");
    } else {
        res.send("Create failed");
    }
})

app.get("/createCategories", async (req, res) => {
    let isCreated = await createCategories();
    if(isCreated) {
        res.redirect("/createAdmin");
    } else {
        res.send("Create failed");
    }
})

app.get("/createAdmin", async (req, res) => {
    try {
        const user = await models.account.findOne({where: {email: adminUser.email}});
        if(user) {
            res.send("Admin account existed");
        } else {
            const hashedPassword = await bcrypt.hash(adminUser.password, 10);
            adminUser.password = hashedPassword;
            await models.account.create(adminUser);
            res.send("Create admin successfully");
        }
    } catch (error) {
        console.log(error); 
        res.send("Create admin failed");
    }
})

app.listen(port, () => {
    console.log(`Create tables tool is running at http://localhost:${port}`);
});