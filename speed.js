const startButton = document.getElementById('start');
const notificationElement = document.getElementById('notification');
const highScoreElement = document.getElementById('high-score');
const scoreElement = document.getElementById('score');
const inputElement = document.getElementById('input');
let score = 0;
const timeElement = document.getElementById('time');
let time = 0;
const levelElement = document.getElementById('level');
const wordElement = document.getElementById('word');


startButton.addEventListener('click', startGame);
inputElement.addEventListener('keyup', markCorrect);
levelElement.addEventListener('change', () => timeElement.textContent = levelElement.value);

const startGame = (e)=> {
    e.preventDefault();
    inputElement.focus();
    scoreElement.textContent = 0;
    notificationElement.innerHTML = '';
    generateWord();
    startButton.disabled = 'true';
}

const generateWord = async () =>{
   const word = await fetchData();
   if(!word){
     return notificationElement.textContent = 'Please connect to the internet !';
   }else{
   notificationElement.textContent = '';
   wordElement.innerHTML = '';
   word.split('').forEach(word => wordElement.innerHTML += `<span>${word}</span>`);
   countDown(word);
   }
}

const fetchData = async () => {
    notificationElement.textContent = 'getting word...';
    const response = await fetch('https://random-words-api.vercel.app/word');
    if(!response.ok) return false;
    const wordObj = await response.json();
    return wordObj[0].word;
}

const countDown = word => {
    time = levelElement.value;
    levelElement.disabled = 'true';
    timeElement.textContent = time;
    const interval = setInterval(() => {
        time--;
        if (time < 0) {
            clearInterval(interval)
            checkResult(word);
            return;
        }
        timeElement.textContent = time;
    }, 1000);
}

const checkResult = word => {
    if (inputElement.value.toLowerCase() === word.toLowerCase()) {
        notificationElement.innerHTML = 'Correct &check;';
        setTimeout(() => { notificationElement.innerHTML = ''; }, 1500);
        score++;
        scoreElement.textContent = score;
        setTimeout(generateWord, 500);
    } else {
        let isHighScore = updateHighScore();
        startButton.disabled = '';
        levelElement.disabled = '';
        let isPlural;
        if (score === 1) isPlural = 'point';
        else isPlural = 'points';
        notificationElement.innerHTML = `Game Over <br> You scored <span style = "color:#013350">${score}</span> ${isPlural}`;
        if (isHighScore) notificationElement.innerHTML += ' <br><span class="animate-high">New high score &star;</span>';
        score = 0;
        setTimeout(() => wordElement.innerHTML = '', 1000);
        startButton.textContent = 'New Game'
    }
    inputElement.value = '';
}

const markCorrect = ()=> {
    let finalArray = wordElement.querySelectorAll('span');
    let typedArray = inputElement.value.split('');
    let isCorrect = true;

    finalArray.forEach((char, index) => {
        if (!typedArray[index]) return char.className = '';
        if (char.textContent.toLowerCase() === typedArray[index].toLowerCase()) {
            char.className = 'correct';
        } else {
            isCorrect = false;
            char.className = 'incorrect';
        }
    });
    if (typedArray[finalArray.length - 1] && isCorrect) time = 0;
}

const updateHighScore = ()=> {
    let highScore = localStorage.getItem('highScore');
    if (!highScore && score > 0) {
        localStorage.setItem('highScore', score);
        highScoreElement.textContent = localStorage.getItem('highScore');
        return true;
    } else {
        if (score > highScore) {
            localStorage.setItem('highScore', score);
            highScoreElement.textContent = score;
            return true;
        } else return false;
    }
}
if (localStorage.getItem('highScore')) highScoreElement.textContent = localStorage.getItem('highScore');
