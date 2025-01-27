// Your Spoonacular API key (replace with your own key)
const API_KEY = "ab3d23b93e3549ba8084025b89ec0240";

// Base API URL
const BASE_URL = "https://api.spoonacular.com/recipes/complexSearch";

// DOM Elements
const queryInput = document.getElementById("query");
const recipesContainer = document.getElementById("recipesContainer");
const searchButton = document.getElementById("searchButton");

// Function to Fetch Recipes
async function fetchRecipes(query) {
  try {
    const response = await fetch(`${BASE_URL}?apiKey=${API_KEY}&query=${query}&number=10`);
    const data = await response.json();

    // Fetch detailed information for each recipe
    const recipesWithDetails = await Promise.all(
      data.results.map(async (recipe) => {
        const recipeDetails = await fetchRecipeDetails(recipe.id);
        return recipeDetails;
      })
    );

    // Display recipes
    displayRecipes(recipesWithDetails);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    recipesContainer.innerHTML = "<p class='text-red-500'>Failed to load recipes. Please try again later.</p>";
  }
}

// Function to Fetch Detailed Recipe Information
async function fetchRecipeDetails(id) {
  const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// Function to Display Recipes
function displayRecipes(recipes) {
  recipesContainer.innerHTML = ""; // Clear previous results

  if (!recipes || recipes.length === 0) {
    recipesContainer.innerHTML = "<p class='text-gray-700'>No recipes found. Try a different search.</p>";
    return;
  }

  recipes.forEach((recipe) => {
    // Create a card for each recipe
    const recipeCard = document.createElement("div");
    recipeCard.classList.add("p-4", "border", "rounded", "shadow-md", "max-w-xs", "bg-white");

    recipeCard.innerHTML = `
      <img class="rounded w-full h-40 object-cover mb-2" src="${recipe.image}" alt="${recipe.title}">
      <h3 class="text-lg font-bold mb-2">${recipe.title}</h3>
      <p class="text-gray-700 mb-2"><strong>Servings:</strong> ${recipe.servings}</p>
      <p class="text-gray-700 mb-2"><strong>Cooking Time:</strong> ${recipe.readyInMinutes} mins</p>
      <a href="${recipe.sourceUrl}" class="text-blue-500 underline" target="_blank">View Full Recipe</a>
    `;

    recipesContainer.appendChild(recipeCard);
  });
}

// Event Listener for Button Click
searchButton.addEventListener("click", () => {
  const query = queryInput.value.trim();
  if (!query) {
    alert("Please enter a recipe to search!");
    return;
  }
  fetchRecipes(query); // Fetch recipes based on user input
});
