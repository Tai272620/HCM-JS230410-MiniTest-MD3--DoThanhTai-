import fs from 'fs';
import path from 'path';
import multiparty from 'multiparty';

// Middleware kiểm tra trùng lặp Todo
module.exports = {
    checkDuplicateTodo: async function (req, res, next) {
        try {
            let form = new multiparty.Form();
            const fields = await new Promise((resolve, reject) => {
                form.parse(req, (err, fields) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(fields);
                });
            });

            const newTitle = fields.title[0];

            fs.readFile(path.join(__dirname, "todos.json"), 'utf-8', (err, data) => {
                if (err) {
                    return res.status(500).json({
                        message: "Lấy dữ liệu thất bại!"
                    });
                }

                const todos = JSON.parse(data);

                // Kiểm tra xem Tiêu đề Todo mới có trùng với bất kỳ Todo nào trong danh sách hiện tại không
                const isDuplicate = todos.some(todo => todo.title === newTitle);

                if (isDuplicate) {
                    return res.status(400).json({
                        message: "Tiêu đề Todo đã tồn tại. Vui lòng chọn tiêu đề khác!"
                    });
                }

                // Nếu không có Todo trùng lặp, tiếp tục chuyển quyền điều hướng đến route handler tiếp theo
                next();
            });
        } catch (err) {
            return res.status(500).json({
                message: "Lỗi đọc form!"
            });
        }
    }
};
