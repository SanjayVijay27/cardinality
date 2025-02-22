// Select the canvas element
const canvas = d3.select("#canvas");
const contextMenu = d3.select("#contextMenu");

// Initialize cardsData
let cardsData = [];

// Fetch the initial data from the /init_data endpoint
d3.json("/init_data").then(data => {
    console.log("Data fetched from /init_data:", data); // Debug log
    cardsData = data; // Initialize cardsData with fetched data
    // Render the cards on the canvas
    renderCards(cardsData);
}).catch(error => {
    console.error("Error fetching data from /init_data:", error); // Debug log
});

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
            sendCardUpdate(cardData);
        });

    cards.exit().remove();
}

let offsetX, offsetY;

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
    const newCardId = `card${cardsData.length + 1}`;
    const newCardData = { id: newCardId, x, y, text: `Card ${cardsData.length + 1}` };
    cardsData.push(newCardData);
    renderCards(cardsData);
}

// Initial render
renderCards(cardsData);