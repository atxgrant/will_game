const colorSchemes = [
    { backgroundColor: "#FFD700", fontColor: "#000000" }, // Gold background, Black font
    { backgroundColor: "#000080", fontColor: "#FFFFFF" }, // Navy background, White font
    { backgroundColor: "#E6E6FA", fontColor: "#333333" }, // Lavender background, Dark Gray font
    { backgroundColor: "#2F4F4F", fontColor: "#FFFFFF" }, // Dark Slate Gray background, White font
    { backgroundColor: "#FFFACD", fontColor: "#000000" }  // Lemon Chiffon background, Black font
];

// Function to apply a random color scheme
function applyRandomColorScheme() {
    // Get a random index from the colorSchemes array
    const randomIndex = Math.floor(Math.random() * colorSchemes.length);
    const selectedScheme = colorSchemes[randomIndex];

    // Apply the colors and font family to the body element
    document.body.style.backgroundColor = selectedScheme.backgroundColor;
    document.body.style.color = selectedScheme.fontColor;
    document.body.style.fontFamily = '"Helvetica Neue", sans-serif'; // Added this line
}

// Call the function when the script is loaded
applyRandomColorScheme();
