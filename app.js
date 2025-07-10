const wordList = ["react", "design", "canvas", "memory", "system", "object", "python", "layout", "markup", "frontend"];
const maxStrikes = 3;
const maxPasses = 3;

function shuffle(str) {
  const arr = typeof str === "string" ? str.split("") : str;
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return typeof str === "string" ? arr.join("") : arr;
}

function ScrambleGame() {
  const [words, setWords] = React.useState(() => [...wordList]);
  const [currentWord, setCurrentWord] = React.useState("");
  const [answer, setAnswer] = React.useState("");
  const [guess, setGuess] = React.useState("");
  const [score, setScore] = React.useState(() => Number(localStorage.getItem("score")) || 0);
  const [strikes, setStrikes] = React.useState(() => Number(localStorage.getItem("strikes")) || 0);
  const [passes, setPasses] = React.useState(() => Number(localStorage.getItem("passes")) || maxPasses);
  const [message, setMessage] = React.useState("");
  const [gameOver, setGameOver] = React.useState(false);

  React.useEffect(() => {
    if (words.length > 0) {
      const word = words[0];
      setAnswer(word);
      setCurrentWord(shuffle(word));
    } else {
      setGameOver(true);
    }
  }, [words]);

  React.useEffect(() => {
    localStorage.setItem("score", score);
    localStorage.setItem("strikes", strikes);
    localStorage.setItem("passes", passes);
  }, [score, strikes, passes]);

  function handleGuessSubmit(e) {
    e.preventDefault();
    if (guess.toLowerCase() === answer.toLowerCase()) {
      setScore(prev => prev + 1);
      setWords(prev => prev.slice(1));
      setMessage("✅ Correct!");
    } else {
      setStrikes(prev => {
        const updated = prev + 1;
        if (updated >= maxStrikes || passes - 1 <= 0) setGameOver(true);
        return updated;
      });

      setPasses(prev => Math.max(prev - 1, 0));

      setMessage("❌ Incorrect. Try again.");
    }
    setGuess("");
  }

  function handlePass() {
    if (passes > 0) {
      setPasses(prev => prev - 1);
      setWords(prev => prev.slice(1));
      setMessage("⏭️ Word passed.");
    } else {
      setMessage("🚫 No passes left.");
    }
  }

  function handleRestart() {
    setWords([...wordList]);
    setScore(0);
    setStrikes(0);
    setPasses(maxPasses);
    setGuess("");
    setMessage("");
    setGameOver(false);
    localStorage.clear();
  }

  return (
    <div className="game-container">
      <h1>Welcome to Scramble.</h1>

      {gameOver ? (
        <>
          <p className="scrambled-word">Game Over</p>
          <p>Final Score: {score}</p>
          <button className="pass-btn" onClick={handleRestart}>Play Again</button>
        </>
      ) : (
        <>
          <div className="stats">
            <div>
              <div>{score}</div>
              <div>POINTS</div>
            </div>
            <div>
              <div>{strikes}</div>
              <div>STRIKES</div>
            </div>
          </div>

          <div className="scrambled-word">{currentWord}</div>

          <form onSubmit={handleGuessSubmit}>
            <input
              type="text"
              value={guess}
              onChange={e => setGuess(e.target.value)}
              placeholder="Enter your guess"
              autoFocus
            />
          </form>

          <button className="pass-btn" onClick={handlePass}>
            {passes} Passes Remaining
          </button>

          <p>{message}</p>
        </>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<ScrambleGame />);
