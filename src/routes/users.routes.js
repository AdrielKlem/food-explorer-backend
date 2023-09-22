const { Router } = require("express")
const UsersController = require("../controllers/UsersController")

const userController = new UsersController()
const usersRoutes = Router()

usersRoutes.post("/", userController.create)

module.exports = usersRoutes