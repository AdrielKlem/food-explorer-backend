const { Router } = require("express")
const DishesController = require("../controllers/DishesController")

const dishesController = new DishesController()
const dishesRoutes = Router()

dishesRoutes.get("/", dishesController.index)
dishesRoutes.post("/:user_id", dishesController.create)
dishesRoutes.put("/", dishesController.update)
dishesRoutes.delete("/:id", dishesController.delete)

module.exports = dishesRoutes