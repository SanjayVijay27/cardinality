console.log("here!")



// Select the SVG container
const svg = d3.select("svg");

// Sample data: array of objects with x and y coordinates
const data = [
    { x: 100, y: 100 },
    { x: 200, y: 200 },
    { x: 300, y: 300 },
    { x: 400, y: 400 }
];

// Create circles for each data point
const circles = svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", 30)
    .call(d3.drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded)
    );

// Drag event handlers
function dragStarted(event, d) {
    d3.select(this).classed("dragging", true);
}

function dragged(event, d) {
    d3.select(this)
        .attr("cx", d.x = event.x)
        .attr("cy", d.y = event.y);
}

function dragEnded(event, d) {
    d3.select(this).classed("dragging", false);
}
