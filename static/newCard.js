//creating a new card

// Context menu event handler for the canvas
canvas.on("contextmenu", function(event) {
    event.preventDefault();
    if (event.target.classList.contains('card')) {
        // Right-clicked on a card
        const cardId = d3.select(event.target).attr("id");
        contextMenu.html(`<ul><li id="deleteCard" data-id="${cardId}">Delete Card</li></ul>`) // Set context menu for deleting card
                   .style("left", `${event.clientX}px`)
                   .style("top", `${event.clientY}px`)
                   .style("display", "block");

        // Attach event handler for deleting card
        d3.select("#deleteCard").on("click", function() {
            const cardId = d3.select(this).attr("data-id");
            deleteCard(cardId);
            contextMenu.style("display", "none");
        });
    } else {
        // Right-clicked on the canvas
        const canvasRect = canvas.node().getBoundingClientRect();
        const x = event.clientX - canvasRect.left;
        const y = event.clientY - canvasRect.top;
        contextMenu.html('<ul><li id="addCard">Add Card</li></ul>') // Set context menu for adding card
                   .style("left", `${event.clientX}px`)
                   .style("top", `${event.clientY}px`)
                   .style("display", "block");
        contextMenu.attr("data-x", x);
        contextMenu.attr("data-y", y);

        // Attach event handler for adding card
        d3.select("#addCard").on("click", function() {
            const x = +contextMenu.attr("data-x");
            const y = +contextMenu.attr("data-y");
            addCard(x, y);
            contextMenu.style("display", "none");
        });
    }
});

// Hide context menu on body click
d3.select("body").on("click", function() {
    contextMenu.style("display", "none");
});

/**
 * Adds a new card to the canvas.
 * @param {number} x - The x-coordinate of the new card.
 * @param {number} y - The y-coordinate of the new card.
 */
function addCard(x, y) {
    const newCardId = cardsData.length + 1;
    const newCardData = { id: newCardId, x, y, text: `Card ${cardsData.length + 1}` };
    cardsData.push(newCardData);
    

    fetch('/add_card', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            card_id: newCardId,
            new_position: { x: x, y: y },
            text: `Card ${cardsData.length}`
        })
    });
    reRenderCards();
}

/**
 * Deletes a card from the canvas.
 * @param {string} cardId - The ID of the card to delete.
 */
function deleteCard(cardId) {
    //cardsData = cardsData.filter(card => card.id !== cardId);
    //reRenderCards();

    fetch('/delete_card', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            card_id: cardId
        })
    })    
    .then(response => response.json())
    .then(data => {
        console.log(data);
    });

    reRenderCards();
}

/**
 * Re-renders all cards from the cardsData.
 */
function reRenderCards() {

    
    // Clear existing cards
    canvas.selectAll(".card").remove();

    d3.json("/get_data").then(data => {
        console.log("Data fetched from /get_data:", data); // Debug log
        cardsData = data; // Initialize cardsData with fetched data
        
        // Render the cards on the canvas
        //renderCards(cardsData); //ABSOLUTELY NECESSARY TO AVOID RACE CONDITION. 
        // Render cards from cardsData
        renderCards(cardsData);
    
        // Render the data in rows within a column group
        //renderColumnGroup(cardsData); // Render data in the sidebar
    })



}

renderCards(cardsData);