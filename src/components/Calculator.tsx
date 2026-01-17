import { useState } from "react";
import { motion } from "framer-motion";

const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(display);
    } else if (operation) {
      const currentValue = parseFloat(previousValue);
      let result = 0;

      switch (operation) {
        case "+":
          result = currentValue + inputValue;
          break;
        case "-":
          result = currentValue - inputValue;
          break;
        case "×":
          result = currentValue * inputValue;
          break;
        case "÷":
          result = inputValue !== 0 ? currentValue / inputValue : 0;
          break;
      }

      setDisplay(String(result));
      setPreviousValue(String(result));
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = () => {
    if (!operation || previousValue === null) return;

    const inputValue = parseFloat(display);
    const currentValue = parseFloat(previousValue);
    let result = 0;

    switch (operation) {
      case "+":
        result = currentValue + inputValue;
        break;
      case "-":
        result = currentValue - inputValue;
        break;
      case "×":
        result = currentValue * inputValue;
        break;
      case "÷":
        result = inputValue !== 0 ? currentValue / inputValue : 0;
        break;
    }

    setDisplay(String(result));
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  };

  const buttonVariants = {
    tap: { scale: 0.95 },
    hover: { scale: 1.05 },
  };

  const NumberButton = ({ value }: { value: string }) => (
    <motion.button
      variants={buttonVariants}
      whileTap="tap"
      whileHover="hover"
      onClick={() => inputNumber(value)}
      className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-card text-foreground font-fredoka text-2xl md:text-3xl font-semibold shadow-button hover:shadow-glow transition-shadow"
    >
      {value}
    </motion.button>
  );

  const OperationButton = ({ value, color = "primary" }: { value: string; color?: string }) => {
    const colorClasses = {
      primary: "bg-primary text-primary-foreground",
      secondary: "bg-secondary text-secondary-foreground",
      coral: "bg-coral text-coral-foreground",
      accent: "bg-accent text-accent-foreground",
    };

    return (
      <motion.button
        variants={buttonVariants}
        whileTap="tap"
        whileHover="hover"
        onClick={() => (value === "=" ? calculate() : performOperation(value))}
        className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl font-fredoka text-2xl md:text-3xl font-semibold shadow-button ${colorClasses[color as keyof typeof colorClasses]}`}
      >
        {value}
      </motion.button>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-3xl p-6 shadow-playful max-w-sm mx-auto"
    >
      <div className="bg-muted rounded-2xl p-4 mb-6">
        <div className="text-right text-4xl md:text-5xl font-fredoka font-bold text-foreground truncate">
          {display}
        </div>
        {operation && previousValue && (
          <div className="text-right text-lg text-muted-foreground font-nunito mt-1">
            {previousValue} {operation}
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-3">
        <motion.button
          variants={buttonVariants}
          whileTap="tap"
          whileHover="hover"
          onClick={clear}
          className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-destructive text-destructive-foreground font-fredoka text-xl md:text-2xl font-semibold shadow-button"
        >
          AC
        </motion.button>
        <motion.button
          variants={buttonVariants}
          whileTap="tap"
          whileHover="hover"
          onClick={() => setDisplay(String(parseFloat(display) * -1))}
          className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-muted text-foreground font-fredoka text-2xl md:text-3xl font-semibold shadow-button"
        >
          ±
        </motion.button>
        <motion.button
          variants={buttonVariants}
          whileTap="tap"
          whileHover="hover"
          onClick={() => setDisplay(String(parseFloat(display) / 100))}
          className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-muted text-foreground font-fredoka text-2xl md:text-3xl font-semibold shadow-button"
        >
          %
        </motion.button>
        <OperationButton value="÷" color="coral" />

        <NumberButton value="7" />
        <NumberButton value="8" />
        <NumberButton value="9" />
        <OperationButton value="×" color="coral" />

        <NumberButton value="4" />
        <NumberButton value="5" />
        <NumberButton value="6" />
        <OperationButton value="-" color="coral" />

        <NumberButton value="1" />
        <NumberButton value="2" />
        <NumberButton value="3" />
        <OperationButton value="+" color="coral" />

        <motion.button
          variants={buttonVariants}
          whileTap="tap"
          whileHover="hover"
          onClick={() => inputNumber("0")}
          className="col-span-2 h-16 md:h-20 rounded-2xl bg-card text-foreground font-fredoka text-2xl md:text-3xl font-semibold shadow-button"
        >
          0
        </motion.button>
        <motion.button
          variants={buttonVariants}
          whileTap="tap"
          whileHover="hover"
          onClick={inputDecimal}
          className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-card text-foreground font-fredoka text-3xl font-semibold shadow-button"
        >
          .
        </motion.button>
        <OperationButton value="=" color="primary" />
      </div>
    </motion.div>
  );
};

export default Calculator;
