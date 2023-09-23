const knex = require("../database/knex")
const AppError = require("../utils/AppError")

class DishesController {
    async create(request, response) {
        const { picture, name, description, price, category, ingredients } = request.body
        const { user_id } = request.params
     
        const [dish_id] = await knex("dishes").insert(
            { 
                picture, 
                name, 
                description, 
                price,
                category: category ?? "Refeição",
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

    async update(request, response) {
        const { id, user_id } = request.query;

        const userdish = await knex("dishes").where({ id }).first();

        if (!userdish) {
            return response.status(404).json({ error: "Dish not found" });
        }


        const { picture, name, description, price, category, ingredients } = request.body;

        userdish.picture = picture || userdish.picture;
        userdish.name = name || userdish.name;
        userdish.description = description || userdish.description;
        userdish.price = price || userdish.price;
        userdish.category = category || userdish.category;

         try {
            // Start a transaction
            await knex.transaction(async (trx) => {
                // Update the dish in the "dishes" table
                await trx("dishes").where({ id }).update(userdish);

                // Remove existing ingredients for this dish
                await trx("ingredients").where({ user_id, dish_id: id }).del();

                // Insert new ingredients if provided
                if (ingredients) {
                    const newIngredients = ingredients.map((ingredient) => ({
                    user_id,
                    dish_id: id,
                    name: ingredient,
                    }));
                    await trx("ingredients").insert(newIngredients);
                }
            });
            return response.status(200).json({ message: "Dish updated successfully" });
        } catch (error) {
            return response.status(500).json({ error: "An error occurred during the update", details: error.message });
        }
    }

    
    async index(request, response) {
        const dishes = await knex("dishes")
        const dishesMeal  = dishes.filter(dish => dish.category === "Refeição")
        const dishesSnack  = dishes.filter(dish => dish.category === "Lanche")
        const dishesSugar  = dishes.filter(dish => dish.category === "Sobremesa")
        
        response.status(200).json(dishesSugar);
    }
}

module.exports = DishesController