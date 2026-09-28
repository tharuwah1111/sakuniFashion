let isLogedIn = false;

const db = require("../db/database")

const login = (req, res) => {
    const { userName, password } = req.body;

    const sql = "select*from Users WHERE U_Name = ? ";
    db.query(sql, [userName], (error, result) => {
        if (error) {
            console.log("DATABASE ERROR:", error);
            return res.status(500).json({
                message: "Error found in login"
            })
        }
        if (result.length === 0) {
            return res.json({
                login: false,
                message: "No users found"
            });
        }

        if (result[0].Password === password) {
            return res.json({
                login: true
            });
        }

        return res.json({
            login: false,
            message: "Wrong password"
        });
    });
}
const logOut = (req, res) => {
    isLogedIn = false;
    return res.json({
        login: false,
        message: "logout"
    })
}


const isLogin = () => {
    return isLogedIn === true ? true : false;
}

module.exports = { login, logOut, isLogin }