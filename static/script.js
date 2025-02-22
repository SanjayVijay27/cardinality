const canvas = d3.select("#canvas");
const svgCanvas = d3.select("#svgCanvas");
const contextMenu = d3.select("#contextMenu");

let cardsData = [
    { id: "card1", x: 50, y: 50, text: "Card 1" },
    { id: "card2", x: 200, y: 50, text: "Card 2" },
    { id: "card3", x: 350, y: 50, text: "Card 3" }
];

const edgesData = [
    { startNode: "card1", endNode: "card2" },
    { startNode: "card2", endNode: "card3" }
];

function renderCards() {
    const cards = canvas.selectAll(".card")
        .data(cardsData, d => d.id);

    const newCards = cards.enter()
        .append("div")
        .attr("class", "card")
        .attr("id", d => d.id)
        .style("left", d => `${d.x}px`)
        .style("top", d => `${d.y}px`)
        .call(d3.drag()
            .on("start", dragStarted)
            .on("drag", dragged)
            .on("end", dragEnded)
        );

    newCards.append("input")
        .attr("type", "text")
        .attr("value", d => d.text)
        .on("change", function(event, d) {
            const card = d3.select(this.parentNode);
            const cardData = card.datum();
            cardData.text = this.value;
            sendCardUpdate(cardData);
        });

    cards.exit().remove();
}

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

canvas.on("contextmenu", function(event) {
    event.preventDefault();
    const [x, y] = d3.pointer(event);
    contextMenu.style("left", `${x}px`)
               .style("top", `${y}px`)
               .style("display", "block");
    contextMenu.attr("data-x", x);
    contextMenu.attr("data-y", y);
});

canvas.selectAll(".card").on("contextmenu", function(event) {
    event.stopPropagation();
});

d3.select("body").on("click", function() {
    contextMenu.style("display", "none");
});

d3.select("#addCard").on("click", function() {
    const x = +contextMenu.attr("data-x");
    const y = +contextMenu.attr("data-y");
    addCard(x, y);
    contextMenu.style("display", "none");
});

function addCard(x, y) {
    const newCardId = `card${cardsData.length + 1}`;
    const newCardData = { id: newCardId, x, y, text: `Card ${cardsData.length + 1}` };
    cardsData.push(newCardData);
    renderCards();
    renderEdges();
}

function dragStarted(event, d) {
    d3.select(this).raise().classed("active", true);
}

function dragged(event, d) {
    d3.select(this)
        .style("left", `${d.x = event.x}px`)
        .style("top", `${d.y = event.y}px`);
    updateEdges();
}

function dragEnded(event, d) {
    d3.select(this).classed("active", false);
    sendCardUpdate(d);
}

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

function updateEdges() {
    svgCanvas.selectAll(".arrow")
        .attr("x1", d => getCardCenter(d.startNode).x)
        .attr("y1", d => getCardCenter(d.startNode).y)
        .attr("x2", d => getCardCenter(d.endNode).x)
        .attr("y2", d => getCardCenter(d.endNode).y);
}

function getCardCenter(cardId) {
    const card = d3.select(`#${cardId}`);
    const x = parseFloat(card.style("left")) + card.node().offsetWidth / 2;
    const y = parseFloat(card.style("top")) + card.node().offsetHeight / 2;
    return { x, y };
}

// Initial render
renderCards();
renderEdges();