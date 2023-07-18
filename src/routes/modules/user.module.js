import express from 'express';
const router = express.Router();

let users = [
    {
        id: 1,
        name: "Jack",
        age: 25,
        isAdmin: true,
        active: true
    },
    {
        id: 2,
        name: "Peter",
        age: 20,
        isAdmin: false,
        active: true
    },
]

function removeVietnameseAccent(str) {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");
}

router.get('/', (req, res) => {
    if (req.query.id) {
        let result = users.find(user => user.id == req.query.id);
        if (result) {
            return res.status(200).json({
                message: "OK! get user have id: " + req.query.id,
                data: result
            })
        } else {
            return res.status(200).json({
                message: "Get failed, không có user nào tương ứng id: " + req.query.id,
            })
        }

    }

    if (req.query.search) {
        let result = [];

        users.map(user => {
            if (removeVietnameseAccent(user.name + user.age).toLowerCase().includes(removeVietnameseAccent(req.query.search).toLowerCase())) {
                result.push(user);
            }
        })

        return res.status(200).json({
            message: "OK! Result",
            data: result
        })
    }

    return res.status(200).json({
        message: "OK! get all users",
        data: users
    })
})


router.post('/', (req, res) => {
    if (req.body) {
        users.push(req.body);
        res.status(200).json({
            message: "OK!",
            data: users
        })
    }
})

router.delete('/:id', (req, res) => {
    if (req.params.id) {
        users = users.filter(user => user.id != req.params.id);
        return res.status(200).json({
            message: 'Xóa thành công users có id là: ' + req.params.id,
            data: users
        })
    }
    res.status(500).json({
        message: "Vui lòng truyền param id"
    })
})

router.put('/:id', (req, res) => {
    console.log(req.body, req.params.id)
    if (!req.params.id) {
        return res.status(500).json(
            {
                message: "Vui lòng truyền id bạn muốn update"
            }
        )
    }
    users = users.map(user => {
        if (user.id == req.params.id) {
            return {
                ...req.body,
                id: user.id
            }
        }
        return user
    })
    return res.status(200).json(
        {
            message: "Cập nhật thành công thông tin của user có id là: " + req.params.id,
            data: {
                ...req.body,
                id: req.params.id
            }
        }
    )
})

router.patch('/:id', (req, res) => {
    let dataPatch;
    if (req.params.id) {
        let flag = false;
        users = users.map(user => {
            if (user.id == req.params.id) {
                flag = true;
                dataPatch = {
                    ...user,
                    ...req.body
                }
                return {
                    ...user,
                    ...req.body
                }
            }
            return user
        })
        if (!flag) {
            return res.status(500).json({
                message: `user có id là: ${req.params.id} không tồn tại`
            })
        }
        return res.status(200).json({
            message: 'Patch thành công cho user có id là: ' + req.params.id,
            data: dataPatch
        })
    }

    return res.status(500).json({
        message: "Vui lòng truyền params id"
    })
})

module.exports = router;