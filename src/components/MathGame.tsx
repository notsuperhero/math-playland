import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Trophy, Sparkles, RotateCcw } from "lucide-react";

type Difficulty = "easy" | "medium" | "hard";
type Operation = "+" | "-" | "×";

interface Problem {
  num1: number;
  num2: number;
  operation: Operation;
  answer: number;
}

const MathGame = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const generateProblem = useCallback(() => {
    const operations: Operation[] =
      difficulty === "easy" ? ["+"] : difficulty === "medium" ? ["+", "-"] : ["+", "-", "×"];

    const operation = operations[Math.floor(Math.random() * operations.length)];

    let maxNum = difficulty === "easy" ? 10 : difficulty === "medium" ? 20 : 12;
    let num1 = Math.floor(Math.random() * maxNum) + 1;
    let num2 = Math.floor(Math.random() * maxNum) + 1;

    // Ensure subtraction doesn't result in negative numbers for kids
    if (operation === "-" && num2 > num1) {
      [num1, num2] = [num2, num1];
    }

    let answer = 0;
    switch (operation) {
      case "+":
        answer = num1 + num2;
        break;
      case "-":
        answer = num1 - num2;
        break;
      case "×":
        answer = num1 * num2;
        break;
    }

    setProblem({ num1, num2, operation, answer });
    setUserAnswer("");
    setFeedback(null);
  }, [difficulty]);

  useEffect(() => {
    if (gameStarted) {
      generateProblem();
    }
  }, [gameStarted, generateProblem]);

  const checkAnswer = () => {
    if (!problem || userAnswer === "") return;

    const isCorrect = parseInt(userAnswer) === problem.answer;

    if (isCorrect) {
      setFeedback("correct");
      const points = difficulty === "easy" ? 10 : difficulty === "medium" ? 20 : 30;
      setScore((prev) => prev + points + streak * 5);
      setStreak((prev) => prev + 1);

      if ((streak + 1) % 5 === 0) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
      }

      setTimeout(() => {
        generateProblem();
      }, 1000);
    } else {
      setFeedback("wrong");
      setStreak(0);
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  const inputNumber = (num: string) => {
    if (userAnswer.length < 4) {
      setUserAnswer((prev) => prev + num);
    }
  };

  const clearAnswer = () => {
    setUserAnswer("");
    setFeedback(null);
  };

  const backspace = () => {
    setUserAnswer((prev) => prev.slice(0, -1));
  };

  const startGame = (diff: Difficulty) => {
    setDifficulty(diff);
    setScore(0);
    setStreak(0);
    setGameStarted(true);
  };

  const encouragements = ["Great job! 🎉", "You're amazing! ⭐", "Keep it up! 🚀", "Brilliant! 🌟", "Fantastic! 🎊"];

  if (!gameStarted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-3xl p-8 shadow-playful max-w-sm mx-auto text-center"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-6xl mb-4"
        >
          🧮
        </motion.div>
        <h2 className="text-3xl font-fredoka font-bold text-foreground mb-2">Math Adventure!</h2>
        <p className="text-muted-foreground font-nunito mb-8">Choose your level and start playing!</p>

        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => startGame("easy")}
            className="w-full py-4 rounded-2xl gradient-cool text-primary-foreground font-fredoka text-xl font-semibold shadow-button"
          >
            🌱 Easy (Addition)
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => startGame("medium")}
            className="w-full py-4 rounded-2xl gradient-fun text-primary-foreground font-fredoka text-xl font-semibold shadow-button"
          >
            🌿 Medium (+/-)
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => startGame("hard")}
            className="w-full py-4 rounded-2xl gradient-warm text-primary-foreground font-fredoka text-xl font-semibold shadow-button"
          >
            🌳 Hard (+/-/×)
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-3xl p-6 shadow-playful max-w-sm mx-auto relative overflow-hidden"
    >
      {/* Celebration overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-primary/20 backdrop-blur-sm z-10 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
              exit={{ scale: 0 }}
              className="text-center"
            >
              <Sparkles className="w-16 h-16 text-accent mx-auto mb-2" />
              <p className="text-2xl font-fredoka font-bold text-foreground">
                {streak} in a row! 🔥
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Score header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-accent" />
          <span className="font-fredoka font-bold text-xl text-foreground">{score}</span>
        </div>
        <div className="flex items-center gap-1">
          {[...Array(Math.min(streak, 5))].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Star className="w-5 h-5 fill-accent text-accent" />
            </motion.div>
          ))}
        </div>
        <motion.button
          whileHover={{ rotate: -180 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setGameStarted(false)}
          className="p-2 rounded-xl bg-muted"
        >
          <RotateCcw className="w-5 h-5 text-muted-foreground" />
        </motion.button>
      </div>

      {/* Problem display */}
      {problem && (
        <motion.div
          key={`${problem.num1}-${problem.operation}-${problem.num2}`}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-muted rounded-2xl p-6 mb-6 text-center"
        >
          <div className="text-4xl md:text-5xl font-fredoka font-bold text-foreground mb-4">
            {problem.num1} {problem.operation} {problem.num2} = ?
          </div>

          <motion.div
            animate={
              feedback === "correct"
                ? { backgroundColor: ["hsl(var(--muted))", "hsl(var(--success))", "hsl(var(--muted))"] }
                : feedback === "wrong"
                ? { x: [-5, 5, -5, 5, 0] }
                : {}
            }
            className={`text-5xl font-fredoka font-bold py-3 px-6 rounded-xl inline-block min-w-[120px] ${
              feedback === "correct"
                ? "text-success"
                : feedback === "wrong"
                ? "text-destructive"
                : "text-foreground"
            }`}
          >
            {userAnswer || "_"}
          </motion.div>

          <AnimatePresence>
            {feedback === "correct" && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-lg font-nunito font-semibold text-success mt-2"
              >
                {encouragements[Math.floor(Math.random() * encouragements.length)]}
              </motion.p>
            )}
            {feedback === "wrong" && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-lg font-nunito font-semibold text-destructive mt-2"
              >
                Try again! 💪
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Number pad */}
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <motion.button
            key={num}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => inputNumber(String(num))}
            className="h-14 md:h-16 rounded-2xl bg-card text-foreground font-fredoka text-2xl font-semibold shadow-button border-2 border-border"
          >
            {num}
          </motion.button>
        ))}
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={clearAnswer}
          className="h-14 md:h-16 rounded-2xl bg-destructive text-destructive-foreground font-fredoka text-xl font-semibold shadow-button"
        >
          C
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => inputNumber("0")}
          className="h-14 md:h-16 rounded-2xl bg-card text-foreground font-fredoka text-2xl font-semibold shadow-button border-2 border-border"
        >
          0
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={backspace}
          className="h-14 md:h-16 rounded-2xl bg-muted text-foreground font-fredoka text-xl font-semibold shadow-button"
        >
          ←
        </motion.button>
      </div>

      {/* Submit button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.02 }}
        onClick={checkAnswer}
        disabled={!userAnswer}
        className="w-full mt-4 py-4 rounded-2xl gradient-fun text-primary-foreground font-fredoka text-xl font-semibold shadow-button disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Check Answer ✓
      </motion.button>
    </motion.div>
  );
};

export default MathGame;
