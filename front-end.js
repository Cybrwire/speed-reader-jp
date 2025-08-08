const textInput = document.querySelector('.text-input');
const speedControl = document.querySelector('.speed-control > input');
const processButton = document.querySelector('.process');
const playButton = document.querySelector('.play');
const stopButton = document.querySelector('.stop');
const sentenceDisplay = document.querySelector('.sentence-display-area');
const revealButton = document.querySelector('.reveal-button');
let sentenceVisible = false;

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
    //adjust sentence display styling for longer sentences
    if(sentenceContainer.offsetHeight > 80){
        sentenceDisplay.style.borderRadius = '2rem';
        sentenceDisplay.style.padding = '1rem';

    }else{
        sentenceDisplay.style.borderRadius = '';
        sentenceDisplay.style.padding = '';
    }
    
}
function showTokensOneByOne() {
    const tokens = document.querySelectorAll('.token');
    let index = 0;
    tokens.forEach(item => {
        item.classList.add('hidden');
    })
    function showNextToken() {
        if (index > 0) {
            tokens[index - 1].classList.add('hidden');
        }
        if (index < tokens.length) {
            tokens[index].classList.remove('hidden');
            index++;
            const delay = Math.abs(parseInt(speedControl.value));
            flickerID = setTimeout(showNextToken, delay); // Adjust the delay as needed

        }else {
            // All tokens shown, re-enable playButton if disabled
            if (playButton.disabled) {
                playButton.disabled = false;
                revealButton.disabled = false;
            }
        }
        
    }
    showNextToken();

}

//loads sentence from input field into sentence display container
processButton.addEventListener('click', async () =>{
    const text = textInput.value;
    words = await fetchTokenizedText(text);
    loadSentence();

})

//begins sentence display playback
playButton.addEventListener('click', () => {
    playButton.disabled = true;
    revealButton.disabled = true;
    stopButton.disabled = false;
    stopButton.addEventListener('click', () => {
        if(playButton.disabled){
            playButton.disabled = false;
            revealButton.disabled = false;
            stopButton.disabled = true;
        }
        document.querySelectorAll('.sentence-container > .token').forEach(item => { 
            if(!item.classList.contains('hidden')){
                item.classList.add('hidden');
            }
        })
        clearTimeout(flickerID);
    })
    showTokensOneByOne();

})

//toggle button to display or hide entire text in sentence container
revealButton.addEventListener('click', () => {
    if(sentenceVisible == false){
        sentenceVisible = true;
        console.log('pass')
        document.querySelectorAll('.sentence-container > .token').forEach(item => { 
            if(item.classList.contains('hidden')){
                item.classList.remove('hidden');
            }
        })
    }else{ 
        sentenceVisible = false;
        document.querySelectorAll('.sentence-container > .token').forEach(item => { 
            if(!item.classList.contains('hidden')){
                item.classList.add('hidden');
            }
        })
    }

})
