// function readTextFile(file, callback) {
//     var rawFile = new XMLHttpRequest();
//     rawFile.overrideMimeType("application/json");
//     rawFile.open("GET", file, true);
//     rawFile.onreadystatechange = function() {
//         if (rawFile.readyState === 4 && rawFile.status == "200") {
//             callback(rawFile.responseText);
//         }
//     }
//     rawFile.send(null);
// }

// //usage:
// readTextFile("/test1.json", function(text){
//     var data = JSON.parse(text);
//     console.log(data);
// });


// fetch('./test1.json')
//   .then(response => response.json())
//   .then(data => {
//     console.log(data); // Process the JSON data
//   })
//   .catch(error => {
//     console.error('Error fetching JSON:', error);
//   });


const fs = require('fs');

fs.readFile('js\\test1,json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  const jsonData = JSON.parse(data);
  console.log(jsonData);
});
