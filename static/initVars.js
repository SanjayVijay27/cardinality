// Select the canvas element
const canvas = d3.select("#canvas");
const contextMenu = d3.select("#contextMenu");

// Initialize cardsData
let cardsData = [];

//offsets for the mouse when it moves a card
let offsetX, offsetY;


// Fetch the initial data from the /init_data endpoint
d3.json("/init_data").then(data => {
    console.log("Data fetched from /init_data:", data); // Debug log
    cardsData = data; // Initialize cardsData with fetched data
    // Render the cards on the canvas
    
}).catch(error => {
    console.error("Error fetching data from /init_data:", error); // Debug log
});