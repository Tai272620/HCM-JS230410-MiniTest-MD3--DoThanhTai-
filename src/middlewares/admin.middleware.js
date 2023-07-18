let isAdmin = true;
module.exports = {
    adminCheck: function (req, res, next) {
        if (isAdmin) {
            next()
        } else {
            res.status(200).json(
                {
                    message: "Bạn không phải là admin!"
                }
            )
        }
    }
}