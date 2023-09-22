const { Router } = require("express")
const DishesController = require("../controllers/DishesController")

const dishesController = new DishesController()
const dishesRoutes = Router()

dishesRoutes.post("/:user_id", dishesController.create)

module.exports = dishesRoutes