const { Router } = require("express")
const DishesController = require("../controllers/DishesController")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const dishesController = new DishesController()
const dishesRoutes = Router()

dishesRoutes.use(ensureAuthenticated)

dishesRoutes.get("/", dishesController.index)
dishesRoutes.get("/:id", dishesController.show)
dishesRoutes.post("/:user_id", dishesController.create)
dishesRoutes.put("/", dishesController.update)
dishesRoutes.delete("/:id", dishesController.delete)

module.exports = dishesRoutes