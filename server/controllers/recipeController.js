require("../models/database")
const Category=require("../models/Category");
const Recipe=require("../models/Recipe");

/*get /
homepage
*/
exports.homepage=async(req,res)=>{
    try {
        const limitNumber=5;
        const categories=await Category.find({}).limit(limitNumber);
        const latest=await Recipe.find({}).sort({_id:-1}).limit(limitNumber);
const indian=await Recipe.find({'category':'Indian'}).limit(limitNumber);
const desserts=await Recipe.find({'category':'Desserts'}).limit(limitNumber);
const mocktails=await Recipe.find({'category':'Mocktails'}).limit(limitNumber);

        const food={latest,indian,desserts,mocktails};
        res.render('index',{title:'RecipeBook-Home',categories,food});
    } catch (error) {
        res.status(500).send({message:error.message || "Error occured"});
    }
    
}

exports.exploreCategories=async(req,res)=>{
try {
    const limitNumber=20;
    const categories=await Category.find({}).limit(limitNumber);
    res.render('categories',{title:'RecipeBook-Categories',categories});
} catch (error) {
    res.status(500).send({message:error.message||"Error occurred"})
}
}
/*get categories/:id*/
exports.exploreCategoriesById=async(req,res)=>{
    try {
        let categoryId=req.params.id;
        const limitNumber=20;
        const categoryById=await Recipe.find({'category':categoryId}).limit(limitNumber);
        res.render('categories',{title:'RecipeBook-Categories',categoryById});
    } catch (error) {
        res.status(500).send({message:error.message||"Error occurred"})
    }
    }

/*get recipe/:id*/
exports.exploreRecipe=async(req,res)=>{
    try {
       let recipeId=req.params.id;
       const recipe=await Recipe.findById(recipeId);
        res.render('recipe',{title:'RecipeBook-Recipe',recipe});
    } catch (error) {
        res.status(500).send({message:error.message||"Error occurred"})
    }
    }

/*POST /search
Search*/
exports.searchRecipe=async(req,res)=>{
    try {
        let searchTerm=req.body.searchTerm;
        let recipe=await Recipe.find({$text:{$search:searchTerm,$diacriticSensitive:true}});
        res.render('search',{title:'RecipeBook-Search',recipe});
    } catch (error) {
        res.status(500).send({message:error.message||"Error occurred"})
    }
    
}

/*get explore latest*/
exports.exploreLatest=async(req,res)=>{
    try {
       const limitNumber=20;
       const recipe=await Recipe.find({}).sort({_id:-1}).limit(limitNumber);
        res.render('explore-latest',{title:'RecipeBook-Explore Latest',recipe});
    } catch (error) {
        res.status(500).send({message:error.message||"Error occurred"})
    }
    }


    /*get explore random as json*/
exports.exploreRandom=async(req,res)=>{
    try {
    let count=await Recipe.find().countDocuments();
    let random=Math.floor(Math.random()*count);
    let recipe=await Recipe.findOne().skip(random).exec();

        res.render('explore-random',{title:'RecipeBook-Explore Latest',recipe});
    } catch (error) {
        res.status(500).send({message:error.message||"Error occurred"})
    }
    }

/*submit recipe*/
    exports.submitRecipe=async(req,res)=>{
        const infoErrorsObj=req.flash('infoErrors');
        const infoSubmitObj=req.flash('infoSubmit');
        res.render('submit-recipe',{title:'RecipeBook-Post recipe',infoErrorsObj,infoSubmitObj});
    }

    /*post recipe*/
    exports.submitRecipeOnPost=async(req,res)=>{

        try {

let imageUploadFile;
let uploadPath;
let newImageName;

if(!req.files || Object.keys(req.files).length===0){
    console.log('No files were uploaded');
}else{
imageUploadFile=req.files.image;
newImageName=Date.now()+imageUploadFile.name;

uploadPath=require('path').resolve('./')+'/public/uploads/'+newImageName;
imageUploadFile.mv(uploadPath,function(err){
    if(err) return res.status(500).send(err);
})

}
const newRecipe=new Recipe({
                name:req.body.name,
                description:req.body.description,
                email:req.body.email,
                ingredients:req.body.ingredients,
                category:req.body.category,
                image:newImageName
            });

await newRecipe.save();

            req.flash('infoSubmit','Recipe has been added.')
            res.redirect('/submit-recipe');
        } catch (error) {
            //res.json(error);
            req.flash('infoErrors',error);
            res.redirect('/submit-recipe');
        }
    }

 /*   async function deleteRecipe(){
        try {
          await Recipe.deleteOne({name:'Lasoooni Murgh'}); 
        } catch (error) {
            console.log(error);
        }
    }
    updateRecipe();*/


/*    async function updateRecipe(){
        try {
          const res=await Recipe.updateOne({name:'Lasooni Murgh'},{name:'Lasoooni Murgh'});
          res.n;  //number of documents matched
          res.nModified;  //number of documents modified  
        } catch (error) {
            console.log(error);
        }
    }
    updateRecipe();  */


















    
/*async function insertDymmyCategoryData(){
    try {
        await Category.insertMany([
            {
        "name":"Indian",
        "image":"indian.jpg"
            },
            {
        "name":"Chinese",
        "image":"chinese.jpeg"
            },
            {
        "name":"Thai",
        "image":"thai.jpeg"
            },
            {
        "name":"Continental",
        "image":"continental.jpg"
            },
            {
        "name":"British food",
        "image":"british.jpeg"
            },
            {
                "name":"South Indian",
                "image":"south-indian.jpg"
            }
        ]);
    } catch (error) {
        console.log('err'+error);
    }
}

insertDymmyCategoryData();*/

/*async function insertDymmyRecipeData(){
    try {
        await Recipe.insertMany([
            {
                "name":"Chicken Burger",
                "description":"Mix Garlic Mayo ingredients in a small bowl, set aside for 20+ minutes.Mix Seasoning in a flat bowl / dish.If required, pound chicken to about 1 cm / 2/5” thick. If wanting to be exact, trim to shape of rolls BUT ensure it is about 15% larger (it shrinks) (Note 2).Heat 1 tbsp oil in a skillet over high heat (if doing on BBQ, drizzle flat plate).Add onion and cook, turning regularly, for 5 minutes until golden. Season with salt and pepper, toss, then remove.While cooking the onions, preheat oven to 160C/320F. Split rolls, then lightly toast / warm the rolls (if using BBQ, just toast the cut side until crispy). Leave in turned off oven with door ajar while you cook chicken.Heat 1 tbsp oil into the same skillet, still on high heat.Dredge chicken in Seasoning, shake off excess, then place in skillet. Repeat.Cook for 2 ½ minutes until golden, then flip.Top with cheese then leave for 1 1/2 minutes. When the underside is golden, if the cheese is not yet melted, place lid on for 15 seconds (or tray or foil).Remove chicken from skillet onto plate. Cover loosely with foil while you start assembling the burgers.Smear base of roll with avocado, sprinkle with salt and pepper. Top with chicken, onion, lettuce then tomato.Smear lid of roll with Garlic Mayo, place on burger. Enjoy!",
            "email":"abc@gmail.com",
            "ingredients":[
                "1/3 cup /80g flour (any white)",
                "1 tsp salt",
                "½ tsp black pepper",
                "¾ tsp paprika",
                "1 tsp thyme",
                "½ tsp garlic powder",
                "½ tsp onion powder",
                "2 tbsp olive oil",
"2 large onions , halved them sliced (white, brown or yellow)",
"400 – 500g / 14 oz – 1 lb chicken breast (2 pieces) , cut in half horizontally into 2 thin steaks",
"4 – 8 slices Swiss or other melting cheese slices (Note 1)",
"4 soft rolls (I used brioche burger buns)",
"1 avocado",
"Lettuce",
"2 large tomatoes",
"½ cup mayonnaise (I use whole egg)",
"1 large garlic clove , minced"
            ],
            "category":"Continental",
"image":"chicken-burger.jpeg"
            
            },
            {
                "name":"Golden Butter Rice",
                "description":"Melt butter in a pan or pot with a tight-fitting lid over medium heat. As soon as butter starts to bubble, add in ginger, turmeric, cayenne, brown sugar, and salt. Cook, whisking, for 1 minute. Add rice, and stir until every grain is coated with butter. Stir in water, and bring to a boil over high heat. As soon as it begins to boil, gently shake and swirl the pan to settle rice into an even layer, then reduce heat to medium-low. Cover tightly and simmer for 15 minutes. Turn off heat, and let rest, covered, for 10 minutes. DO NOT lift the lid or try to stir yet. Now, remove the lid and use a fork to fluff and separate rice grains. Season to taste, and serve immediately, garnished with walnuts and green onions.",
            "email":"def@gmail.com",
            "ingredients":[
                "1/2 cup unsalted butter",
                "1 tablespoon finely grated fresh ginger",
                "1 1/4 teaspoons ground turmeric",
"1/4 teaspoon cayenne pepper",
"1 tablespoon brown sugar",
"1 teaspoon fine salt",
"2 cups basmati rice or other long grain white rice",
"3 cups water",
"1/3 cup chopped walnuts (optional)",
"1/3 cup sliced green onions (optional)"
            ],
            "category":"Indian",
"image":"golden.webp"
            },
            {
                "name":"Chicken Wings",
                "description":"Stir together soy sauce, brown sugar, and garlic powder in a saucepan over medium heat. Cook and stir until sugar has dissolved. Remove from heat and allow to cool.Place chicken wings in a large bowl. Pour soy sauce mixture over wings and toss to coat evenly. Cover the bowl with plastic wrap. Allow chicken to marinate in the refrigerator for 8 hours to overnight. Preheat the oven to 350 degrees F (175 degrees C). Pour chicken wings and marinade into a 9x13-inch baking dish. Cover the baking dish with aluminum foil. Bake in the preheated oven until thoroughly hot, about 45 minutes. Remove foil and bake for 15 more minutes. Serve hot.",
            "email":"ghi@gmail.com",
            "ingredients":[
"2 cups soy sauce",
"2 cups brown sugar",
"2 tablespoons garlic powder",
"5 pounds chicken wings, split and tips discarded"
            ],
            "category":"Chinese",
"image":"wings.webp"
            },
            {
                "name":"Chocolate Mousse",
                "description":"Break up or chop chocolate into small pieces and set aside with butter. Add egg yolks, sugar, water, and salt to a metal mixing bowl. Cook, whisking, directly over medium-low heat until the mixture is thick, foamy, and hot to the touch (145 to 150 degrees F (63 to 65 degrees C)). This mixture can also be cooked in a saucepan, but make sure the whisk is getting into the corners of the pan so egg doesn’t stick. Once the yolk mixture is thick and hot, add chocolate and butter, and whisk until all chocolate is melted. Let rest for a few minutes on the counter, whisking occasionally to further cool the mixture to just above or at room temperature. The chocolate mixture shouldn’t go into the whipped cream while still warm, but if cooled too long, the mixture may get too firm to fold in. Whisk cold cream until medium stiff peaks form. If cream is whisked further, it will separate and the final texture will be grainy. Transfer about 1/3 of chocolate mixture into whipped cream, and fold with a spatula until almost incorporated. Gently fold in remaining chocolate, trying to keep as much air in the mixture as possible.Transfer into 4 serving dishes, wrap, and chill before serving, at least 1 hour.",
            "email":"jkl@gmail.com",
            "ingredients":[
                "3 1/2 ounces dark chocolate (62% cacao is ideal)",
                "1 tablespoon unsalted butter",
                "2 large egg yolks",
                "1 tablespoon white sugar",
                "1/4 cup water",
                "1 tiny pinch salt",
                "1/2 cup chilled heavy whipping cream"
            ],
            "category":"Desserts",
"image":"d1.webp"
            },
            {
                "name":"Blueberry-Basil Limeade",
                "description":"Heat the sugar and 1 cup water in a small saucepan over medium-high heat, stirring occasionally, until the sugar has dissolved. Add 3 sprigs basil, remove from the heat and let steep 30 minutes. Strain into a pitcher, discarding the basil. Stir in the lime juice and 4 cups cold water; chill at least 4 hours or until ready to serve. Add the blueberries to the pitcher. Pour into ice-filled glasses and garnish with basil leaves.",
            "email":"mno@gmail.com",
            "ingredients":[
                "1 c. sugar",
                "3 large sprigs fresh basil, plus leaves for garnish",
                "1 1/2 c. fresh lime juice (from about 12 limes)",
                "1 6-ounce container blueberries"
            ],
            "category":"Mocktails",
"image":"basil.jpg"
            },   
        ]);
    } catch (error) {
        console.log('err'+error);
    }
}

insertDymmyRecipeData();*/