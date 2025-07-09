const textInput = document.querySelector('.text-input');
const speedControl = document.querySelector('.speed-control > input');
const processButton = document.querySelector('.process');
const playButton = document.querySelector('.play');
const stopButton = document.querySelector('.stop');
const sentenceDisplay = document.querySelector('.sentence-display-area');
let sentenceDisplayControl;

let words = [];

async function fetchTokenizedText(text) {
    const response = await fetch('http://127.0.0.1:8080/api/tokenize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
    
    const data = await response.json();
    return data.words;
}

function loadSentence(){
    // Clear previous sentence
    let sentenceContainer = document.querySelector('.sentence-container');
    sentenceContainer.innerHTML = '';

    words.forEach(word => {
        let token = document.createElement('span');
        token.textContent = word;
        token.classList.add('token', 'hidden');
        sentenceContainer.appendChild(token);
    })
    
}
function showTokensOneByOne() {
    const tokens = document.querySelectorAll('.token');
    let index = 0;

    function showNextToken() {
        if (index > 0) {
            tokens[index - 1].classList.add('hidden');
        }
        if (index < tokens.length) {
            tokens[index].classList.remove('hidden');
            index++;
            const delay = Math.abs(parseInt(speedControl.value));
            flickerID = setTimeout(showNextToken, delay); // Adjust the delay as needed

        }
        
    }
    showNextToken();

}

function unhideSentence(){
    //first button press
        //get the one span that doesn't have hidden class, save it to a variable
        //remove hidden from all spans in sentence
    //next button press
        //add hidden to all spans that aren't the one that was saved to a variable
}

processButton.addEventListener('click', async () =>{
    const text = textInput.value;
    words = await fetchTokenizedText(text);
    console.log(words)
    loadSentence();

})

playButton.addEventListener('click', () => {

    stopButton.addEventListener('click', () => {
        clearTimeout(flickerID);
    })
    showTokensOneByOne();
    
})

