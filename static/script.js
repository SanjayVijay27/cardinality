
/**
 * Renders the data in rows within a column group in the sidebar.
 * @param {Array} data - The data to render.
 */
function renderColumnGroup(data) {
    const columnGroup = sidebar.append("div")
        .attr("class", "column-group")
        .style("display", "flex")
        .style("flex-direction", "column");

    const rows = columnGroup.selectAll(".row")
        .data(data)
        .enter()
        .append("div")
        .attr("class", "row")
        .style("display", "flex")
        .style("flex-direction", "row")
        .style("margin", "5px")
        .style("padding", "10px")
        .style("border", "1px solid #ccc")
        .style("background-color", "lightblue")
        .on("click", function(event, d) {
            addSidebarCardToCanvas(d);
        });

    rows.append("div")
        .attr("class", "cell")
        .style("flex", "1")
        .text(d => `ID: ${d.id}`);

    rows.append("div")
        .attr("class", "cell")
        .style("flex", "1")
        .text(d => `X: ${d.x}`);

    rows.append("div")
        .attr("class", "cell")
        .style("flex", "1")
        .text(d => `Y: ${d.y}`);

    rows.append("div")
        .attr("class", "cell")
        .style("flex", "2")
        .text(d => `Text: ${d.text}`);
}

/**
 * Adds a copy of the card to the canvas with a different ID.
 * @param {Object} cardData - The data of the card to copy.
 */
function addSidebarCardToCanvas(cardData) {
    const newCardId = cardsData.length + 1;
    const newCardData = { 
        id: newCardId, 
        x: 0, //cardData.x + 20, // Offset the new card position slightly
        y: 0, //cardData.y + 20, 
        text: cardData.text 
    };
    cardsData.push(newCardData);
    renderCards(cardsData);
}

// Select the sidebar element
const sidebar = d3.select("#sidebar");
renderColumnGroup(cardsData);

//last render
renderCards(cardsData);
