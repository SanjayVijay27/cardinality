//creating a new card


// Context menu event handler for the canvas
canvas.on("contextmenu", function(event) {
    event.preventDefault();
    const [x, y] = d3.pointer(event);
    contextMenu.style("left", `${x}px`)
               .style("top", `${y}px`)
               .style("display", "block");
    contextMenu.attr("data-x", x);
    contextMenu.attr("data-y", y);
});

// Prevent context menu on cards
canvas.selectAll(".card").on("contextmenu", function(event) {
    event.stopPropagation();
});

// Hide context menu on body click
d3.select("body").on("click", function() {
    contextMenu.style("display", "none");
});

// Add card event handler
d3.select("#addCard").on("click", function() {
    const x = +contextMenu.attr("data-x");
    const y = +contextMenu.attr("data-y");
    addCard(x, y);
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
    renderCards(cardsData);

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
    })
}

renderCards(cardsData);