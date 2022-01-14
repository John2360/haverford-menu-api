//products.js

const { db } = require('../util/admin');

exports.getDaysMenus = (request, response) => {
    const dayNum = request.params.dayNum;
	
    const asyncWrapper = async (dayNum) => {
        
        // TODO: Add method to pull info
        weekend_day = {"Brunch": [
            "Blueberry Muffins",
            "Blueberry Muffins",
            "Selection of Scones",
            "Buttermilk Biscuits",
            "Scrambles Eggs",
            "Sliced Potatoes",
            "French Toast",
            "Hickory Smoked Bacon ",
            "Turkey Sausage Links",
            "Vegan Sausage",
            "Tofu Scramble",
            "Mexican Breakfast Casserole ",
        ], "Dinner": [
            "Asian BBQ Chicken",
            "Pineapple Pico De Gallo Spiced Tofu",
            "Chees Ravioli with Roasted Tomatoes & Rosa Sauce",
            "Roasted Potato Medley",
            "Roasted Brussel Sprouts",
            "Seasoned Baby Carrots",
            "Grilled Chicken Breast ",
            "Sundae Bar",
        ]}

        normal_day = {"Breakfast": [
            "Corn Muffins",
            "Corn Muffins",
            "Sausage, Egg & Cheese Bagel",
            "Egg & Cheese Bagel",
            "Scrambled Eggs",
            "Tater Tots",
            "Berry Pancakes",
            "Turkey Bacon",
            "Pork Sausage Patty",
            "Vegan Sausage",
            "Tofu Scramble",
        ], "Lunch": [
            "Vegan Jambalaya Soup ",
            "Chicken Parmesan",
            "Kale Potato Enchilada Bake",
            "Roasted Balsamic Marinated Portabella Mushrooms",
            "Spaghetti with Fire Roasted Marinara Sauce",
            "Broccoli Florets",
            "Cobb Salad",
            "Selection of Cookies",
            "Oatmeal Carrot Cookies",
        ], "Dinner": [
            "Shrimp Fajitas",
            "Tofu Fajitas",
            "Cilantro Lime Rice",
            "Ratatouille",
            "Roasted Local Button Mushrooms",
            "Grilled Chicken Breast ",
            "Chocolate Sponge Cake ",
            "Oreo Rice Krispy Treats",
        ]}

        temp_meal_list = [
            weekend_day,
            normal_day,
            normal_day,
            normal_day,
            normal_day,
            normal_day,
            weekend_day
        ]

        return response.json(temp_meal_list[dayNum]);
    }

    asyncWrapper(dayNum);
}