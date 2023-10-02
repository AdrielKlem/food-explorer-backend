const { Router, request, response } = require("express")

const multer = require("multer")
const uploadConfig = require("../configs/upload")

const DishesController = require("../controllers/DishesController")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const dishesController = new DishesController()
const dishesRoutes = Router()
const upload = multer(uploadConfig.MULTER)

dishesRoutes.use(ensureAuthenticated)

dishesRoutes.post("/", upload.single("picture"), dishesController.create)
dishesRoutes.put("/:id",  upload.single("picture"), dishesController.update)
dishesRoutes.get("/:id", dishesController.show)
dishesRoutes.delete("/:id", dishesController.delete)
dishesRoutes.get("/", dishesController.index)

module.exports = dishesRoutes