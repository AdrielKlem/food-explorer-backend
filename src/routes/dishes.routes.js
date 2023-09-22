const { Router } = require("express")
const DishesController = require("../controllers/DishesController")

const dishesController = new DishesController()
const dishesRoutes = Router()

dishesRoutes.post("/:id", dishesController.create)
dishesRoutes.put("/:id", dishesController.update)

module.exports = dishesRoutes