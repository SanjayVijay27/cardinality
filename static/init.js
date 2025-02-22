
// // Initialize D3 selections for canvas, SVG canvas, and context menu
// const canvas = d3.select("#canvas");
// const svgCanvas = d3.select("#svgCanvas");
// const contextMenu = d3.select("#contextMenu");

// // Variables to track active edge maker and temporary arrow
// let activeEdgeMaker = null;
// let tempArrow = null;
// let startEdgeMaker = null;

// // Initial data for cards and edges
// let cardsData = [];
// let edgesData = [];

// // Load initial data from JSON file
// d3.json("init_data").then(data => {
//     data.forEach(node => {
//         if (node.type === "card") {
//             cardsData.push(node);
//         } else if (node.type === "edge") {
//             edgesData.push(node);
//         }
//     });

//     // Initial render of cards and edges
//     renderCards();
//     renderEdges();
// });
