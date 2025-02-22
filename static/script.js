//frontend UI

// Initialize D3 selections for canvas, SVG canvas, and context menu
const canvas = d3.select("#canvas");
const svgCanvas = d3.select("#svgCanvas");
const contextMenu = d3.select("#contextMenu");

// Initial data for cards and edges
let cardsData = [
    { id: "card1", x: 50, y: 50, text: "Card 1" },
    { id: "card2", x: 200, y: 50, text: "Card 2" },
    { id: "card3", x: 350, y: 50, text: "Card 3" }
];

let edgesData = [
    { startNode: "card1", endNode: "card2" },
    { startNode: "card2", endNode: "card3" }
];

// Variables to track active edge maker and temporary arrow
let activeEdgeMaker = null;
let tempArrow = null;
let startEdgeMaker = null;

/**
 * Renders the cards on the canvas.
 */
function renderCards() {
    const cards = canvas.selectAll(".card")
        .data(cardsData, d => d.id);

    const newCards = cards.enter()
        .append("div")
        .attr("class", "card")
        .attr("id", d => d.id)
        .style("left", d => `${d.x}px`)
        .style("top", d => `${d.y}px`)
        .on("mouseover", function() {
            d3.select(this).classed("hover", true);
        })
        .on("mouseout", function() {
            d3.select(this).classed("hover", false);
        })
        .call(d3.drag()
            .on("start", dragStarted)
            .on("drag", dragged)
            .on("end", dragEnded)
        );

    newCards.append("textarea")
        .attr("value", d => d.text)
        .text(d => d.text)
        .on("change", function(event, d) {
            const card = d3.select(this.parentNode);
            const cardData = card.datum();
            cardData.text = this.value;
            sendCardUpdate(cardData);
        });

    newCards.append("div")
        .attr("class", "edgeMaker left")
        .style("left", "-10px")
        .style("top", "50%")
        .on("mouseover", function() {
            d3.select(this).classed("hover", true);
        })
        .on("mouseout", function() {
            d3.select(this).classed("hover", false);
        })
        .on("mousedown", function(event, d) {
            event.stopPropagation();
            activeEdgeMaker = this;
            startEdgeMaker = this;
            d3.selectAll(".edgeMaker").classed("active", true);
            startDraggingArrow(event, this);
        });

    newCards.append("div")
        .attr("class", "edgeMaker right")
        .style("right", "-10px")
        .style("top", "50%")
        .on("mouseover", function() {
            d3.select(this).classed("hover", true);
        })
        .on("mouseout", function() {
            d3.select(this).classed("hover", false);
        })
        .on("mousedown", function(event, d) {
            event.stopPropagation();
            activeEdgeMaker = this;
            startEdgeMaker = this;
            d3.selectAll(".edgeMaker").classed("active", true);
            startDraggingArrow(event, this);
        });

    cards.exit().remove();
}

/**
 * Renders the edges between cards on the SVG canvas.
 */
function renderEdges() {
    const edges = svgCanvas.selectAll(".arrow")
        .data(edgesData, (d, i) => `edge${i}`);

    edges.enter()
        .append("line")
        .attr("class", "arrow")
        .attr("id", (d, i) => `edge${i}`);

    edges.exit().remove();

    updateEdges();
}

/**
 * Starts dragging an arrow from an edge maker.
 * @param {Event} event - The mouse event.
 * @param {HTMLElement} edgeMaker - The edge maker element.
 */
function startDraggingArrow(event, edgeMaker) {
    const edgeMakerPosition = getEdgeMakerPosition(edgeMaker);
    tempArrow = svgCanvas.append("line")
        .attr("class", "arrow")
        .attr("x1", edgeMakerPosition.x)
        .attr("y1", edgeMakerPosition.y)
        .attr("x2", edgeMakerPosition.x)
        .attr("y2", edgeMakerPosition.y);

    d3.select(window)
        .on("mousemove.dragArrow", function(event) {
            const [x, y] = d3.pointer(event);
            tempArrow.attr("x2", x).attr("y2", y);
        })
        .on("mouseup.dragArrow", function(event) {
            const [x, y] = d3.pointer(event);
            const targetEdgeMaker = document.elementFromPoint(x, y);
            if (targetEdgeMaker && targetEdgeMaker.classList.contains("edgeMaker")) {
                const startCardId = d3.select(startEdgeMaker.parentNode).attr("id");
                const endCardId = d3.select(targetEdgeMaker.parentNode).attr("id");
                if (startCardId !== endCardId) {
                    edgesData.push({ startNode: startCardId, endNode: endCardId });
                    renderEdges();
                }
            }
            tempArrow.remove();
            tempArrow = null;
            startEdgeMaker = null;
            d3.select(window).on("mousemove.dragArrow", null).on("mouseup.dragArrow", null);
        });
}

/**
 * Gets the position of an edge maker.
 * @param {HTMLElement} edgeMaker - The edge maker element.
 * @returns {Object} The position of the edge maker.
 */
function getEdgeMakerPosition(edgeMaker) {
    const card = d3.select(edgeMaker.parentNode);
    const side = d3.select(edgeMaker).classed("right") ? "right" : "left";
    const x = parseFloat(card.style("left")) + (side === "right" ? card.node().offsetWidth : 0);
    const y = parseFloat(card.style("top")) + card.node().offsetHeight / 2;
    return { x, y };
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
    d3.selectAll(".edgeMaker").classed("active", false);
    activeEdgeMaker = null;
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
    renderCards();
    renderEdges();
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
    updateEdges();
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

/**
 * Updates the positions of the edges on the SVG canvas.
 */
function updateEdges() {
    svgCanvas.selectAll(".arrow")
        .attr("x1", d => getEdgeMakerPositionByCardId(d.startNode, "right").x)
        .attr("y1", d => getEdgeMakerPositionByCardId(d.startNode, "right").y)
        .attr("x2", d => getEdgeMakerPositionByCardId(d.endNode, "left").x)
        .attr("y2", d => getEdgeMakerPositionByCardId(d.endNode, "left").y);
}

/**
 * Gets the position of an edge maker by card ID.
 * @param {string} cardId - The ID of the card.
 * @param {string} side - The side of the card ("left" or "right").
 * @returns {Object} The position of the edge maker.
 */
function getEdgeMakerPositionByCardId(cardId, side) {
    const card = d3.select(`#${cardId}`);
    const x = parseFloat(card.style("left")) + (side === "right" ? card.node().offsetWidth : 0);
    const y = parseFloat(card.style("top")) + card.node().offsetHeight / 2;
    return { x, y };
}

// Initial render of cards and edges
renderCards();
renderEdges();
