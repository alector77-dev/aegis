import { useState } from "react";
import "./CalculatorModal.css";

type CalculatorModalProps = {
  currentLP: number;
  position: 1 | 2;

  onClose: () => void;

  onSubmit: (
    currentDisplayLP: number,
    operation: {
      type: "+" | "-" | "/2";
      value?: number;
    },
  ) => number;
};

type CalcButtonProps = {
  label: string;
  className?: string;
  onClick: (label: string) => void;
};

function CalcButton({ label, className = "", onClick }: CalcButtonProps) {
  return (
    <button
      className={`calc-button ${className}`}
      onClick={() => onClick(label)}
    >
      {label}
    </button>
  );
}

export default function CalculatorModal({
  currentLP,
  position,
  onClose,
  onSubmit,
}: CalculatorModalProps) {
  const [calculatorOperator, setCalculatorOperator] = useState<
    "+" | "-" | "/2" | null
  >(null);

  const [calculatorValue, setCalculatorValue] = useState("");

  const [displayLP, setDisplayLP] = useState(currentLP);

  const ghostZeros =
    calculatorValue.length === 1 || calculatorValue.length === 2 ? "00" : "";

  function handleCalculatorInput(input: string) {
    if (input === "CLR") {
      setCalculatorOperator(null);
      setCalculatorValue("");
      return;
    }

    if (input === "⌫") {
      if (!calculatorOperator) {
        return;
      }

      if (calculatorValue === "") {
        setCalculatorOperator(null);
        return;
      }

      setCalculatorValue(calculatorValue.slice(0, -1));
      return;
    }

    if (input === "+" || input === "-" || input === "½") {
      if (calculatorOperator !== null) {
        if (!calculatorValue) {
          if (input === "½") {
            setCalculatorOperator("/2");
          } else {
            setCalculatorOperator(input as "+" | "-");
          }
        }

        return;
      }

      if (input === "½") {
        setCalculatorOperator("/2");
      } else {
        setCalculatorOperator(input as "+" | "-");
      }

      return;
    }

    if (input === "=") {
      if (!calculatorOperator) {
        return;
      }

      if (calculatorOperator !== "/2" && !calculatorValue) {
        return;
      }

      const resultLP = onSubmit(displayLP, {
        type: calculatorOperator,
        value:
          calculatorOperator === "/2" ? undefined : Number(calculatorValue),
      });

      setDisplayLP(resultLP);

      setCalculatorOperator(null);
      setCalculatorValue("");

      return;
    }

    if (!calculatorOperator || calculatorOperator === "/2") {
      return;
    }

    setCalculatorValue((prev) => prev + input);
  }

  function commitGhostZeros() {
    if (calculatorValue.length === 1 || calculatorValue.length === 2) {
      setCalculatorValue((prev) => prev + "00");
    }
  }

  return (
    <div
      className={`calculator-overlay ${
        position === 1 ? "calculator-left" : "calculator-right"
      }`}
    >
      <div className="calculator-top-row">
        <button className="back-button" onClick={onClose}>
          ←
        </button>

        <button className="display-container" onClick={commitGhostZeros}>
          <div className="display-text">
            {displayLP}
            {calculatorOperator ?? ""}
            {calculatorValue}

            <span className="ghost-text">{ghostZeros}</span>
          </div>
        </button>
      </div>

      <div className="calculator-grid">
        <div className="calculator-row">
          <CalcButton label="CLR" onClick={handleCalculatorInput} />
          <CalcButton label="7" onClick={handleCalculatorInput} />
          <CalcButton label="8" onClick={handleCalculatorInput} />
          <CalcButton label="9" onClick={handleCalculatorInput} />
          <CalcButton label="⌫" onClick={handleCalculatorInput} />
        </div>

        <div className="calculator-row">
          <CalcButton label="+" onClick={handleCalculatorInput} />
          <CalcButton label="4" onClick={handleCalculatorInput} />
          <CalcButton label="5" onClick={handleCalculatorInput} />
          <CalcButton label="6" onClick={handleCalculatorInput} />

          <div className="equals-button-container">
            <button
              className="calc-button equals-button"
              onClick={() => handleCalculatorInput("=")}
            >
              =
            </button>
          </div>
        </div>

        <div className="calculator-row">
          <CalcButton label="-" onClick={handleCalculatorInput} />
          <CalcButton label="1" onClick={handleCalculatorInput} />
          <CalcButton label="2" onClick={handleCalculatorInput} />
          <CalcButton label="3" onClick={handleCalculatorInput} />
        </div>

        <div className="calculator-row">
          <CalcButton label="½" onClick={handleCalculatorInput} />
          <CalcButton label="0" onClick={handleCalculatorInput} />
          <CalcButton label="00" onClick={handleCalculatorInput} />
          <CalcButton label="000" onClick={handleCalculatorInput} />
        </div>
      </div>
    </div>
  );
}
