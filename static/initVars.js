// Select the canvas element
const canvas = d3.select("#canvas");
const contextMenu = d3.select("#contextMenu");

// Initialize cardsData
let cardsData = [];

//offsets for the mouse when it moves a card
let offsetX, offsetY;
let nextCardId;

// Fetch the initial data from the /init_data endpoint
d3.json("/init_data").then(data => {
    console.log("Data fetched from /init_data:", data); // Debug log
    cardsData = data; // Initialize cardsData with fetched data
    
    // Render the cards on the canvas
    renderCards(cardsData); //ABSOLUTELY NECESSARY TO AVOID RACE CONDITION. 

    // Render the data in rows within a column group
    renderColumnGroup(cardsData); // Render data in the sidebar

}).catch(error => {
    console.error("Error fetching data from /init_data:", error); // Debug log
})
.then(() => {
    nextCardId = getMaxCardId(cardsData) + 1 ; // Initialize nextCardId with the next available ID
}
);



// Static variable to keep track of the next available card ID
/**
 * Finds the maximum numerical value of the card ID in cardsData.
 * @param {Array} data - The array of card data.
 * @returns {number} - The maximum card ID value.
 */
function getMaxCardId(data) {
    return data.reduce((maxId, card) => Math.max(maxId, card.id), 0);
}
