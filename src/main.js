import './style.css'

// 1. DOM Element Reference
const app = document.getElementById('js--app-id');

// --- VIEW RENDERING FUNCTIONS ---

// A. Start Screen
function renderStartScreen() {
  app.innerHTML = `
    <div class="text-center">
      <h1 class="text-4xl font-extrabold text-indigo-600 mb-4 tracking-tight">
        QuizApp 🧠
      </h1>
      <p class="text-gray-600 text-lg">
        Test your computer knowledge!<br>
      </p>
      <p class="text-gray-600 mb-8 text-lg">
        Configure your settings below.
      </p>
      

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
  document.getElementById('js--start-btn-id').addEventListener('click', () => {
    console.log('Start clicked! Switching view...');
    renderGameScreen();
  });
}

// B. Game Screen (Mockup)
function renderGameScreen() {
  app.innerHTML = `
    <div class="w-full">
      <div class="flex justify-between items-center mb-4 text-sm text-gray-500 font-medium">
        <span>Question 1 / 10</span>
        <span class="text-indigo-600">Score: 0</span>
      </div>
      
      <div class="w-full bg-gray-200 rounded-full h-2.5 mb-8">
        <div class="bg-indigo-600 h-2.5 rounded-full" style="width: 10%"></div>
      </div>

      <h2 class="text-2xl font-bold text-gray-800 mb-8 leading-tight">
        What does HTML stand for?
      </h2>

      <div class="grid gap-4">
        <button class="answer-btn bg-gray-100 hover:bg-indigo-50 border-2 border-transparent hover:border-indigo-200 p-4 rounded-xl text-left transition font-medium text-gray-700">
          Hyper Text Markup Language
        </button>
        <button class="answer-btn bg-gray-100 hover:bg-indigo-50 border-2 border-transparent hover:border-indigo-200 p-4 rounded-xl text-left transition font-medium text-gray-700">
          Hyperlinks and Text Markup Language
        </button>
        <button class="answer-btn bg-gray-100 hover:bg-indigo-50 border-2 border-transparent hover:border-indigo-200 p-4 rounded-xl text-left transition font-medium text-gray-700">
          Home Tool Markup Language
        </button>
        <button class="answer-btn bg-gray-100 hover:bg-indigo-50 border-2 border-transparent hover:border-indigo-200 p-4 rounded-xl text-left transition font-medium text-gray-700">
          Hard Text Marking Level
        </button>
      </div>
      
      <button id="js--end-sim-btn-id" class="mt-8 text-xs text-gray-400 underline">Simulate Game Over</button>
    </div>
  `;

  document.getElementById('js--end-sim-btn-id').addEventListener('click', renderEndScreen);
};

// C. End Screen (Mockup)
function renderEndScreen() {
  app.innerHTML = `
    <div class="text-center animate-fade-in">
      <div class="text-6xl mb-4">🏆</div>
      <h2 class="text-3xl font-extrabold text-gray-900 mb-2">Congratulations!</h2>
      <p class="text-gray-600 mb-8">You have completed the quiz.</p>

      <div class="bg-indigo-50 rounded-2xl p-6 mb-8">
        <span class="block text-sm text-gray-500 uppercase tracking-wide font-semibold">Your Score</span>
        <span class="block text-5xl font-black text-indigo-600 mt-2">8/10</span>
      </div>

      <button id="js--restart-btn-id" class="w-full bg-gray-900 text-white font-bold py-4 px-6 rounded-xl hover:bg-gray-800 transition duration-300 shadow-lg">
        PLAY AGAIN 🔄
      </button>
    </div>
  `;

  document.getElementById('js--restart-btn-id').addEventListener('click', renderStartScreen);
};

// --- APP INITIALIZATION ---
renderStartScreen();