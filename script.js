const colorSchemes = [
    { backgroundColor: "#0F198F", fontColor: "#10CCDA" }, // Navy background, Cyan font
    { backgroundColor: "#7C21B7", fontColor: "#6AEB96" }, // Purple background, Lime font
    { backgroundColor: "#10FBAE", fontColor: "#272D1F" }, // Cyan background, Black font
    { backgroundColor: "#982209", fontColor: "#A1DDFD" }, // Red background, Light Blue font
    { backgroundColor: "#5A57AC", fontColor: "#5EFCEF" }  // Lavendar background, Cyan font
];

// Function to apply a random color scheme
function applyRandomColorScheme() {
    // Get a random index from the colorSchemes array
    const randomIndex = Math.floor(Math.random() * colorSchemes.length);
    const selectedScheme = colorSchemes[randomIndex];

    // Apply the colors to the body element
    document.body.style.backgroundColor = selectedScheme.backgroundColor;
    document.body.style.color = selectedScheme.fontColor;
}

// Call the function when the script is loaded
applyRandomColorScheme();
