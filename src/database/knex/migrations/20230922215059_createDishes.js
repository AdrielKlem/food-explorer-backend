exports.up = knex => knex.schema.createTable("dishes", table => {
    table.increments("id");
    table.text("picture")
    table.text("name").notNullable();
    table.text("description").notNullable()
    table.decimal("price")
    table.integer("user_id").references("id").inTable("users")
});

exports.down = knex => knex.schema.dropTable("dishes");
