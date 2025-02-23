# Cardinality - BoilerMake XII
by Richard Li and Sanjay Vijay

## Inspiration
Early into the hackathon, Richard asked how I keep track of my tasks. I showed him a crudely made Apple notes listing things I had to do and commitments I had. Richard asked, surely we can do better? 

## What it does
Cardinality, at its core, is a front end app for better displaying tabular data, such as CSV files. By using a graphical display that puts each row of a table into a card of its own, with some columns used as metadata, the table can be displayed, saved through program restarts, and new fields for the table can be added on the fly. 
These new fields are the core power of Cardinality: by using the same fields for multiple cards and sending a prompt (made by the user and fed the database) to an AI powered agent, the user can extract data about the cards (and as an extension the table) in fractions of the time it would take to find and debug tabular commands, such as those in Excel.
Users can add, delete, duplicate, and edit cards. Through adding "[key]::[value]" lines to a card's text, the program can add attributes to different cards. An AI terminal allows users to glean insights about their notes.

## How we built it
Richard and Sanjay collaborated in a 2 man team to build this app. Richard was responsible for the frontend, built using HTML, JS, and d3.js, which was hosted by a Flask based backend, handed by Pandas, which Sanjay was responsible for. Richard set up the Gemini agent for the AI terminal, and Sanjay downloaded and set up Deepseek using Ollama.

## Challenges we ran into
The team initially wanted to focus on backend (which we still do), but because the idea of a functional GUI was so important to the project, the front end ended up consuming the large majority of resources, which was unfortunate for all the plans that went astray. In fact, this was so bad that in the middle of the project the front end was completely scrapped and restarted to something more functional (arrows were initially idealized but scrapped). 
Because of the workflow, challenges in the frontend resulted in delays in the backend, which relies on the frontend. However, this was navigated to the best of the team's ability. 

## Accomplishments that we're proud of
By incorporating AI into this project, the project transformed from a post it note poster to a excel sheet-like monitor, just easier to use :) 
Both an offline AI (local AI - Deepseek with Ollama) and an online AI (Gemini) were used. 

## What we learned
It is extremely difficult to learn a new tech stack in a hackathon, but at the same time, by leveraging resources such as Copilot (which we learned about this hackathon!), realizing the possibilities of this previously impossible task can be immensely rewarding. 

## What's next for Cardinality
Arrows! 
The idea of a node and edge graph is a core fundamental of this project, and only the nodes have been implemented so far. By incorporating directed flow (edges = arrows), the power and functionality of this project can exponentially grow, surpassing all note taking sources available on the current market. 
With some more ease-of-life features like infinite canvas and color, this would become the most powerful note taking app. 

## Thanks for checking out our project!
