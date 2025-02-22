// Select the canvas element
const canvas = d3.select("#canvas");

// Fetch the initial data from the /init_data endpoint
d3.json("/init_data").then(data => {
    console.log("Data fetched from /init_data:", data); // Debug log
    // Render the cards on the canvas
    renderCards(data);
}).catch(error => {
    console.error("Error fetching data from /init_data:", error); // Debug log
});

/**
 * Renders the cards on the canvas.
 * @param {Array} data - The data to render.
 */
function renderCards(data) {
    const cards = canvas.selectAll(".card")
        .data(data, d => d.id);

    const newCards = cards.enter()
        .append("div")
        .attr("class", "card")
        .attr("id", d => d.id)
        .style("left", d => `${d.x}px`)
        .style("top", d => `${d.y}px`)
        .style("position", "absolute")
        .style("width", "150px")
        .style("height", "150px")
        .style("background-color", "lightblue")
        .style("border", "1px solid #ccc")
        .style("padding", "10px")
        .style("box-sizing", "border-box")
        .style("cursor", "move")
        .call(d3.drag()
            .on("start", dragStarted)
            .on("drag", dragged)
            .on("end", dragEnded)
        );

    newCards.append("textarea")
        .attr("value", d => d.text)
        .text(d => d.text)
        .style("width", "100%")
        .style("height", "80%")
        .style("box-sizing", "border-box")
        .style("resize", "none")
        .style("overflow", "auto")
        .on("click", function() {
            d3.select(this).classed("active", true);
        })
        .on("blur", function() {
            d3.select(this).classed("active", false);
        })
        .on("change", function(event, d) {
            const card = d3.select(this.parentNode);
            const cardData = card.datum();
            cardData.text = this.value;
            sendCardUpdate(cardData);
        });

    cards.exit().remove();
}

/**
 * Event handler for when dragging starts on a card.
 * @param {Event} event - The mouse event.
 * @param {Object} d - The data bound to the card.
 */
function dragStarted(event, d) {
    d3.select(this).raise().classed("active", true);
}

/**
 * Event handler for when a card is being dragged.
 * @param {Event} event - The mouse event.
 * @param {Object} d - The data bound to the card.
 */
function dragged(event, d) {
    d3.select(this)
        .style("left", `${d.x = event.x}px`)
        .style("top", `${d.y = event.y}px`);
}

/**
 * Event handler for when dragging ends on a card.
 * @param {Event} event - The mouse event.
 * @param {Object} d - The data bound to the card.
 */
function dragEnded(event, d) {
    d3.select(this).classed("active", false);
    sendCardUpdate(d);
}

/**
 * Sends an update to the server with the new card position.
 * @param {Object} cardData - The data of the card to update.
 */
function sendCardUpdate(cardData) {
    fetch('/update_card_position', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            card_id: cardData.id,
            new_position: { x: cardData.x, y: cardData.y },
            text: cardData.text
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    });
}