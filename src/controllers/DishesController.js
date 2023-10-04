const knex = require("../database/knex")
const AppError = require("../utils/AppError")
const DiskStorage = require("../providers/DiskStorage")

class DishesController {
    async create(request, response) {
        const { name, description, price, category, ingredients } = request.body
        const user_id = request.user.id

        const checkDishAlreadyExists = await knex("dishes").where({name}).first();
    
        const ingredientsArray = ingredients.split(',');

        if(checkDishAlreadyExists){
            throw new AppError("Este prato já existe no cardápio.")
        }

        const pictureFileName = request.file.filename ?? null ;
        const diskStorage = new DiskStorage()
        const filename = await diskStorage.saveFile(pictureFileName);

        const [dish_id] = await knex("dishes").insert(
            { 
                picture:filename, 
                name, 
                description, 
                price,
                category: category ?? "Refeição",
                user_id
            })

        const ingredientsInsert = ingredientsArray.map(ingredient => {
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

        const imageFileName = request.file.filename
        const diskStorage = new DiskStorage()
        const userdish = await knex("dishes").where({ id }).first();

        if (!userdish) {
            return response.status(404).json({ error: "Dish not found" });
        }

        if (dish.picture) {
          await diskStorage.deleteFile(dish.picture);
        }

        const filename = await diskStorage.saveFile(imageFileName)

        const { name, description, price, category, ingredients } = request.body;

        userdish.picture = picture ?? filename;
        userdish.name = name ?? userdish.name;
        userdish.description = description ?? userdish.description;
        userdish.price = price ?? userdish.price;
        userdish.category = category ?? userdish.category;

         try {
            await knex.transaction(async (trx) => {
                await trx("dishes").where({ id }).update(userdish);

                await trx("ingredients").where({ user_id, dish_id: id }).del();

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
        try {
            const { name, ingredients } = request.query;
                
            // Listing Dishes and Ingredients at the same time (innerJoin)
            let dishes;

            if (ingredients) {
                const filterIngredients = ingredients.split(',').map(ingredient => ingredient.trim());
                
                dishes = await knex("ingredients")
                    .select([
                        "dishes.id",
                        "dishes.name",
                        "dishes.description",
                        "dishes.category",
                        "dishes.price",
                        "dishes.picture",
                    ])
                    .whereLike("dishes.name", `%${name}%`)
                    .whereIn("ingredients.name", filterIngredients)
                    .innerJoin("dishes", "dishes.id", "ingredients.dish_id")
                    .groupBy("dishes.id")
                    .orderBy("dishes.name")
            } else {
                dishes = await knex("dishes")
                    .whereLike("name", `%${name}%`)
                    .orderBy("name");
            }
            
            const dishesIngredients = await knex("ingredients") 
            const dishesWithIngredients = dishes.map(dish => {
                const dishIngredient = dishesIngredients.filter(ingredient => ingredient.dish_id === dish.id);
        
                return {
                    ...dish,
                    ingredients: dishIngredient
                }
            })
            
            return response.status(200).json(dishesWithIngredients);
        } catch (error) {
            response.status(500).json({ error: "An error occurred during the update", details: error.message });
        }
    }

    async show(request, response) {
        const { id } = request.params

        const dish = await knex("dishes").where({ id }).first()
        const ingredients = await knex("ingredients").where({ dish_id: id }).select("*")

        return response.json({
            ...dish,
            ingredients
        })
    }

    async delete(request, response) {
        try {
            const user_id = request.user.id
            
            await knex("dishes").where({ user_id }).delete()
            
            return response.json()
        } catch (error) {
            response.status(500).json({ error: "An error occurred during the update", details: error.message });
        }
    }
}

module.exports = DishesController