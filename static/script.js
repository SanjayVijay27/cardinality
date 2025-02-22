const canvas = d3.select("#canvas");
const svgCanvas = d3.select("#svgCanvas");

const cardsData = [
    { id: "card1", x: 50, y: 50, text: "Card 1" },
    { id: "card2", x: 200, y: 50, text: "Card 2" },
    { id: "card3", x: 350, y: 50, text: "Card 3" }
];

const edgesData = [
    { startNode: "card1", endNode: "card2" },
    { startNode: "card2", endNode: "card3" }
];

const cards = canvas.selectAll(".card")
    .data(cardsData)
    .enter()
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

cards.append("input")
    .attr("type", "text")
    .attr("value", d => d.text)
    .on("change", function(event, d) {
        const card = d3.select(this.parentNode);
        const cardData = card.datum();
        cardData.text = this.value;
        sendCardUpdate(cardData);
    });

const edges = svgCanvas.selectAll(".arrow")
    .data(edgesData)
    .enter()
    .append("line")
    .attr("class", "arrow")
    .attr("id", (d, i) => `edge${i}`);

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
    edges.attr("x1", d => getCardCenter(d.startNode).x)
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

// Initial update of edges
updateEdges();