/**
 * Renders the cards on the canvas.
 * @param {Array} data - The data to render.
 */
function renderCards(data) {
    console.log("Rendering cards with data:", data); // Debug log

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
        .attr("data-tag", "card") // Add a custom attribute to identify draggable elements
        .call(d3.drag()
            .on("start", dragStarted)
            .on("drag", dragged)
            .on("end", dragEnded)
        )
        .on("dblclick", function() {
            d3.select(this).select("textarea").node().focus();
        });

    // Add a label to display the card ID
    newCards.append("div")
        .attr("class", "card-id-label")
        .style("position", "absolute")
        .style("top", "-5px")
        .style("left", "2px")
        .style("background-color", "rgba(255, 255, 255, 0.8)")
        .style("padding", "2px 5px")
        .style("border-radius", "3px")
        .style("font-size", "12px")
        .style("pointer-events", "none") // Ensure the label does not interfere with drag events
        .text(d => `ID: ${d.id}`);

    newCards.append("textarea")
        .attr("value", d => d.text)
        .text(d => d.text)
        .style("width", "100%")
        .style("height", "80%")
        .style("box-sizing", "border-box")
        .style("resize", "none")
        .style("overflow", "auto")
        .on("mousedown", function(event) {
            event.stopPropagation(); // Prevent drag from starting when clicking on textarea
        })
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
            sendCardUpdate(cardData); // Call sendCardUpdate when text is edited
        });

    cards.exit().remove();
}

/**
 * Event handler for when dragging starts on a card.
 * @param {Event} event - The mouse event.
 * @param {Object} d - The data bound to the card.
 */
function dragStarted(event, d) {
    if (event.sourceEvent.target.tagName !== 'TEXTAREA') {
        d3.select(this).raise().classed("active", true);
        const card = d3.select(this);
        offsetX = event.x - parseFloat(card.style("left"));
        offsetY = event.y - parseFloat(card.style("top"));
    }
}

/**
 * Event handler for when a card is being dragged.
 * @param {Event} event - The mouse event.
 * @param {Object} d - The data bound to the card.
 */
function dragged(event, d) {
    if (event.sourceEvent.target.tagName !== 'TEXTAREA') {
        d3.select(this)
            .style("left", `${event.x - offsetX}px`)
            .style("top", `${event.y - offsetY}px`);
    }
}

/**
 * Event handler for when dragging ends on a card.
 * @param {Event} event - The mouse event.
 * @param {Object} d - The data bound to the card.
 */
function dragEnded(event, d) {
    if (event.sourceEvent.target.tagName !== 'TEXTAREA') {
        d3.select(this).classed("active", false);
        d.x = event.x - offsetX;
        d.y = event.y - offsetY;
        sendCardUpdate(d);
    }
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

/**
 * Re-renders all cards from the cardsData.
 */
function reRenderCards() {
    // Clear existing cards
    canvas.selectAll(".card").remove();

    //clear column
    clearSidebar();

    d3.json("/get_data").then(data => {
        console.log("Data fetched from /get_data:", data); // Debug log
        cardsData = data; // Initialize cardsData with fetched data
        
        // Render the cards on the canvas
        renderCards(cardsData);

        //render sidebar
        renderColumnGroup(cardsData);

    });
}

renderCards(cardsData);
