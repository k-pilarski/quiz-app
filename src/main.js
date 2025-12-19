import './style.css'

// 1. DOM Element Reference
const app = document.getElementById('js--app-id');

// 2. APPLICATION STATE (Data Store)
let gameState = {
  questions: [],        // Array to store fetched questions
  currentQuestionIndex: 0,
  score: 0,
  config: {
    amount: 10,
    difficulty: 'easy',
    category: 9 // ID 18 = Science: Computers
  }
};

// --- API FUNCTIONS ---

async function fetchQuestions() {
  const { amount, difficulty, category } = gameState.config;
  const url = `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&category=${category}&type=multiple`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    // Log the full response to debug
    console.log('API Raw Response:', data);

    // Code 0 means Success
    if (data.response_code === 0) {
      gameState.questions = data.results;
      console.log('✅ Questions fetched:', gameState.questions);
      return true;
    } 
    // Code 5 means Rate Limit (Too many requests)
    else if (data.response_code === 5) {
      console.warn('⚠️ Rate Limit! You are clicking too fast.');
      alert('Too many requests! 🛑\nPlease wait 5 seconds before starting again.');
      return false;
    }
    // Code 1 means No Results (Not enough questions in DB)
    else if (data.response_code === 1) {
      console.warn('⚠️ Not enough questions for these settings.');
      alert(`Not enough questions found for "${difficulty}".\nTry selecting fewer questions or a different difficulty.`);
      return false;
    }
    else {
      alert('API Error code: ' + data.response_code);
      return false;
    }

  } catch (error) {
    console.error('❌ Network Error:', error);
    alert('Failed to connect to the quiz server. Check your internet.');
    return false;
  }
}

// --- VIEW RENDERING FUNCTIONS ---

// A. Start Screen
function renderStartScreen() {
  app.innerHTML = `
    <div class="text-center">
      <h1 class="text-4xl font-extrabold text-indigo-600 mb-4 tracking-tight">
        QuizApp 🧠
      </h1>
      <p class="text-gray-600 text-lg">
        Test your knowledge!<br>
      </p>
      <p class="text-gray-600 mb-8 text-lg">
        Configure your settings below.
      </p>
      
      <div class="space-y-4 mb-8 text-left">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select id="js--category-id" class="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 bg-gray-50 border">
            <option value="9">General Knowledge 🔎</option>  
            <option value="10">Books 📖</option> 
            <option value="15">Video Games 🎮</option> 
            <option value="18">Computer Science 💻</option>
            <option value="19">Mathematics 🧮</option>
            <option value="22">Geography 🌍</option>
          </select>
        </div>    

      <div class="space-y-4 mb-8 text-left">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
          <select id="js--difficulty-id" class="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 bg-gray-50 border">
            <option value="easy">Easy 😎</option>
            <option value="medium">Medium 🧐</option>
            <option value="hard">Hard 🤯</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Number of Questions</label>
          <select id="js--amount-id" class="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 bg-gray-50 border">
            <option value="5">5 Questions</option>
            <option value="10" selected>10 Questions</option>
            <option value="15">15 Questions</option>
          </select>
        </div>
      </div>

      <button id="js--start-btn-id" class="w-full bg-indigo-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-indigo-700 transition duration-300 transform hover:scale-105 shadow-lg">
        START QUIZ 🚀
      </button>
    </div>
  `;

  // Event Listener for Start Button
  document.getElementById('js--start-btn-id').addEventListener('click', async () => {
    const btn = document.getElementById('js--start-btn-id');
    
    // 1. Get values from inputs
    const difficultySelect = document.getElementById('js--difficulty-id');
    const amountSelect = document.getElementById('js--amount-id');
    const categorySelect = document.getElementById('js--category-id');

    gameState.config.difficulty = difficultySelect.value;
    gameState.config.amount = parseInt(amountSelect.value);
    gameState.config.category = categorySelect.value;

    // 2. UI Loading State (User Experience!)
    const originalText = btn.textContent;
    btn.textContent = 'Loading Questions... ⏳';
    btn.disabled = true;
    btn.classList.add('opacity-50', 'cursor-not-allowed');

    // 3. Fetch Data
    const success = await fetchQuestions();

    // 4. Start Game if success
    if (success) {
        // Reset game state for new game
        gameState.currentQuestionIndex = 0;
        gameState.score = 0;
        renderGameScreen();
    } else {
        // Reset button if failed
        btn.textContent = originalText;
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
  });
}

// --- GAME LOGIC ---

function handleAnswer(selectedBtn, isCorrect) {
  const allButtons = document.querySelectorAll('.answer-btn');
  
  // 1. Disable all buttons to prevent double clicking
  allButtons.forEach(btn => {
    btn.disabled = true;
    btn.classList.add('cursor-not-allowed', 'opacity-60');
  });

  // 2. Highlight selected answer
  if (isCorrect) {
    selectedBtn.classList.remove('bg-gray-100', 'hover:bg-indigo-50');
    selectedBtn.classList.add('bg-green-500', 'text-white', 'border-green-600');
    gameState.score++;
  } else {
    selectedBtn.classList.remove('bg-gray-100', 'hover:bg-indigo-50');
    selectedBtn.classList.add('bg-red-500', 'text-white', 'border-red-600');
  }

  // 3. Wait and go to next question
  setTimeout(() => {
    gameState.currentQuestionIndex++;
    
    // Check if there are more questions
    if (gameState.currentQuestionIndex < gameState.questions.length) {
      renderGameScreen();
    } else {
      renderEndScreen();
    }
  }, 1500); // 1.5 second delay
}

// B. Game Screen (Dynamic)
function renderGameScreen() {
  const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
  
  // Combine correct and incorrect answers into one array
  const answers = [
    { text: currentQuestion.correct_answer, correct: true },
    ...currentQuestion.incorrect_answers.map(ans => ({ text: ans, correct: false }))
  ];

  // Shuffle the answers so the correct one isn't always first
  shuffleArray(answers);

  // Calculate Progress %
  const progressPercent = ((gameState.currentQuestionIndex + 1) / gameState.config.amount) * 100;

  app.innerHTML = `
    <div class="w-full animate-fade-in">
      <div class="flex justify-between items-center mb-4 text-sm text-gray-500 font-medium">
        <span>Question ${gameState.currentQuestionIndex + 1} / ${gameState.config.amount}</span>
        <span class="text-indigo-600">Score: ${gameState.score}</span>
      </div>
      
      <div class="w-full bg-gray-200 rounded-full h-2.5 mb-8">
        <div class="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" style="width: ${progressPercent}%"></div>
      </div>

      <h2 class="text-2xl font-bold text-gray-800 mb-8 leading-tight">
        ${currentQuestion.question}
      </h2>

      <div class="grid gap-4" id="js--answers-container">
        ${answers.map(answer => `
          <button 
            data-correct="${answer.correct}"
            class="answer-btn w-full bg-gray-100 hover:bg-indigo-50 border-2 border-transparent hover:border-indigo-200 p-4 rounded-xl text-left transition font-medium text-gray-700 shadow-sm">
            ${answer.text}
          </button>
        `).join('')}
      </div>
    </div>
  `;

  // Attach Event Listeners to the new dynamic buttons
  document.querySelectorAll('.answer-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // "true" comes as a string from data attribute, so we compare strings
      const isCorrect = e.currentTarget.dataset.correct === 'true';
      handleAnswer(e.currentTarget, isCorrect);
    });
  });
}

// C. End Screen (Dynamic)
function renderEndScreen() {
  app.innerHTML = `
    <div class="text-center animate-fade-in">
      <div class="text-6xl mb-4">🏆</div>
      <h2 class="text-3xl font-extrabold text-gray-900 mb-2">Congratulations!</h2>
      <p class="text-gray-600 mb-8">You have completed the quiz.</p>

      <div class="bg-indigo-50 rounded-2xl p-6 mb-8">
        <span class="block text-sm text-gray-500 uppercase tracking-wide font-semibold">Your Score</span>
        <span class="block text-5xl font-black text-indigo-600 mt-2">
          ${gameState.score} / ${gameState.config.amount}
        </span>
      </div>

      <button id="js--restart-btn-id" class="w-full bg-gray-900 text-white font-bold py-4 px-6 rounded-xl hover:bg-gray-800 transition duration-300 shadow-lg">
        PLAY AGAIN 🔄
      </button>
    </div>
  `;

  document.getElementById('js--restart-btn-id').addEventListener('click', renderStartScreen);
}

// --- UTILITY FUNCTIONS ---

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// --- APP INITIALIZATION ---
renderStartScreen();