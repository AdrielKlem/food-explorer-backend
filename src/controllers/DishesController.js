const knex = require("../database/knex")
const AppError = require("../utils/AppError")

class DishesController {
    async create(request, response) {
        const { picture, name, description, price, ingredients } = request.body
        const { user_id } = request.params
     
        const [dish_id] = await knex("dishes").insert(
            { 
                picture, 
                name, 
                description, 
                price,
                user_id
            })

        const ingredientsInsert = ingredients.map(ingredient => {
            return {
                name: ingredient,
                dish_id,
                user_id
            }
        })

        await knex("ingredients").insert(ingredientsInsert)

        response.status(201).json()
    }
}

module.exports = DishesController