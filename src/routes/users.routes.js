const { Router } = require("express")
const UsersController = require("../controllers/UsersController")

const userController = new UsersController()
const usersRoutes = Router()

usersRoutes.post("/", userController.create)
usersRoutes.put("/:id", userController.update)

module.exports = usersRoutes