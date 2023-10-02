const knex = require("../database/knex")
const AppError = require("../utils/AppError")
const DiskStorage = require("../providers/DiskStorage")

class DishesController {
    async create(request, response) {
        const { name, description, price, category, ingredients } = request.body
        const user_id = request.user.id

        const checkDishAlreadyExists = await knex("dishes").where({name}).first();
    
        const ingredientsArray = ingredients.split(',');

        console.log(typeof ingredientsArray)


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
            const { name } = request.query
            const dishes = await knex("dishes").whereLike("name",`%${name}%`).select("*");
            const dishesByCategory = {
            Refeicao: [],
            Sobremesa: [],
            Lanche: [],
            };

            async function chooseCategory(dish, Category = "Refeição") {
                const dishCategory = dishes
                .filter((dish) => dish.category === Category)
                .map((dish) => dish.id);

                const ingredients = await knex("ingredients")
                .whereIn("dish_id", dishCategory);

                return ingredients.filter((ingredient) => ingredient.dish_id === dish.id);
            }

            for (const dish of dishes) {
                switch (dish.category) {
                    case "Refeição":

                        const dishIngredientsMeal = await chooseCategory(dish, "Refeição")
                        dishesByCategory.Refeicao.push({
                            ...dish,
                            ingredients: dishIngredientsMeal,
                        });
                        break
                    case "Sobremesa":
                        const dishIngredientsDessert = await chooseCategory(dish, "Sobremesa")
                        
                        dishesByCategory.Sobremesa.push({
                            ...dish,
                            ingredients: dishIngredientsDessert,
                        });
                        break
                    case "Lanche":
                        const dishIngredientsSnack = await chooseCategory(dish, "Lanche")

                        dishesByCategory.Lanche.push({
                            ...dish,
                            ingredients: dishIngredientsSnack,
                        });
                        break
                }
            };
            response.status(200).json(dishesByCategory);
        } catch (error) {
            response.status(500).json({ error: "An error occurred during the update", details: error.message });
        }
    }

    async show(request, response) {
        const user_id = request.user.id

        const dish = await knex("dishes").where({ id }).first()
        const ingredients = await knex("ingredients").where({ dish_id: user_id }).select("*")

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