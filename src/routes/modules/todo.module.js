import express from 'express';
const router = express.Router();
import fs from 'fs';
import path from 'path';
import multiparty from 'multiparty';

router.get('/', (req, res) => {
    fs.readFile(path.join(__dirname, "todos.json"), 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({
                message: "Lay todos that bai!"
            })
        }
        return res.status(200).json({
            message: "Lay todos thanh cong",
            data: JSON.parse(data)
        })
    })
})

router.post('/', (req, res) => {
    //import multiparty from 'multiparty';
    let form = new multiparty.Form();

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(500).send("Lỗi đọc form!")
        }
        console.log("fields", fields)

        let newTodo = {
            id: Date.now(),
            title: fields.title[0],
            completed: false
        }

        fs.readFile(path.join(__dirname, "todos.json"), 'utf-8', (err, data) => {
            if (err) {
                return res.status(500).json(
                    {
                        message: "Đọc dữ liệu thất bại!"
                    }
                )
            }

            let oldData = JSON.parse(data);
            oldData.unshift(newTodo)

            fs.writeFile(path.join(__dirname, "todos.json"), JSON.stringify(oldData), (err) => {
                if (err) {
                    return res.status(500).json(
                        {
                            message: "Ghi file thất bại!"
                        }
                    )
                }
                return res.redirect('/todos')
            })
        })
    })
})

router.delete('/:id', (req, res) => {
    if (req.params.id) {
        fs.readFile(path.join(__dirname, "todos.json"), 'utf-8', (err, data) => {
            if (err) {
                return res.status(500).json({
                    message: "Lấy todos thất bại!"
                })
            }
            let todos = JSON.parse(data);
            let todoDelete = todos.find(todo => todo.id == req.params.id);
            todos = todos.filter(todo => todo.id != req.params.id);

            fs.writeFile(path.join(__dirname, "todos.json"), JSON.stringify(todos), (err) => {
                if (err) {
                    return res.status(500).json({
                        message: "Lưu file thất bại!"
                    })
                }
                return res.status(200).json(
                    {
                        message: "Xoa todo thanh cong"
                    }
                )
            })
        })
    } else {
        return res.status(500).json(
            {
                message: "Vui lòng truyền meoId!"
            }
        )
    }
})

router.patch('/:id', (req, res) => {
    if (req.params.id) {
        let flag = false;
        fs.readFile(path.join(__dirname, "todos.json"), 'utf-8', (err, data) => {
            if (err) {
                return res.status(500).json({
                    message: "Lấy todos thất bại!"
                })
            }
            let todos = JSON.parse(data);

            todos = todos.map(todo => {
                if (todo.id == req.params.id) {
                    flag = true;
                    return {
                        ...todo,
                        ...req.body
                    }
                }
                return todo
            })

            fs.writeFile(path.join(__dirname, "todos.json"), JSON.stringify(todos), (err) => {
                if (err) {
                    return res.status(500).json({
                        message: "Lưu file thất bại!"
                    })
                }
                return res.status(200).json(
                    {
                        message: "Patch todo thanh cong"
                    }
                )
            })
        })
    }
})

module.exports = router;