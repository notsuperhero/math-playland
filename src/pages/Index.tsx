import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Calculator from "@/components/Calculator";
import MathGame from "@/components/MathGame";
import { Calculator as CalcIcon, Gamepad2 } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"calculator" | "game">("calculator");

  return (
    <div className="min-h-screen py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-fredoka font-bold text-foreground mb-2">
          Math Fun! 🎮
        </h1>
        <p className="text-lg text-muted-foreground font-nunito">
          Calculate and play your way to math mastery!
        </p>
      </motion.div>

      {/* Tab switcher */}
      <div className="flex justify-center mb-8">
        <div className="bg-card rounded-2xl p-2 shadow-playful flex gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("calculator")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-fredoka font-semibold text-lg transition-all ${
              activeTab === "calculator"
                ? "gradient-cool text-primary-foreground shadow-button"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <CalcIcon className="w-5 h-5" />
            Calculator
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("game")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-fredoka font-semibold text-lg transition-all ${
              activeTab === "game"
                ? "gradient-warm text-primary-foreground shadow-button"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Gamepad2 className="w-5 h-5" />
            Math Game
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: activeTab === "calculator" ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: activeTab === "calculator" ? 20 : -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "calculator" ? <Calculator /> : <MathGame />}
        </motion.div>
      </AnimatePresence>

      {/* Footer decorations */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-4 left-4 text-4xl select-none pointer-events-none"
      >
        📐
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="fixed bottom-4 right-4 text-4xl select-none pointer-events-none"
      >
        ✏️
      </motion.div>
    </div>
  );
};

export default Index;
