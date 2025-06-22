const textInput = document.querySelector('.text-input');
const speedControl = document.querySelector('.speed-control');
const processButton = document.querySelector('.process');
const playButton = document.querySelector('.play');
const sentenceDisplay = document.querySelector('.sentence-display-area');


let words = [];
//currentIndex
//interval?

async function fetchTokenizedText(text) {
    const response = await fetch('http://127.0.0.1:8080/api/tokenize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
    
    const data = await response.json();
    return data.words;
}

function displaySentence(){
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
            const delay = parseInt(speedControl.value);
            setTimeout(showNextToken, 150); // Adjust the delay as needed
        }
    }
    showNextToken();
}

processButton.addEventListener('click', async () =>{
    const text = textInput.value;
    words = await fetchTokenizedText(text);
    console.log(words)
    displaySentence();

})

playButton.addEventListener('click', () => {
    showTokensOneByOne();
    
})
