/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Delete, Percent } from 'lucide-react';
import { useFinance } from '../contexts/FinanceContext';

export const Calculator: React.FC = () => {
  const { showCalculator, setShowCalculator } = useFinance();
  const [display, setDisplay] = useState<string>('0');
  const [equation, setEquation] = useState<string>('');
  const [shouldReset, setShouldReset] = useState<boolean>(false);

  if (!showCalculator) return null;

  const handleDigit = (digit: string) => {
    if (display === '0' || shouldReset) {
      setDisplay(digit);
      setShouldReset(false);
    } else {
      setDisplay(display + digit);
    }
    setEquation(equation + digit);
  };

  const handleOperator = (op: string) => {
    setShouldReset(true);
    // Replace standard math symbols for evaluation
    let mathOp = op;
    if (op === '×') mathOp = '*';
    if (op === '÷') mathOp = '/';
    
    const lastChar = equation.slice(-1);
    if (['+', '-', '*', '/'].includes(lastChar)) {
      setEquation(equation.slice(0, -1) + mathOp);
    } else {
      setEquation(equation + ' ' + mathOp + ' ');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
    setShouldReset(false);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
      setEquation(equation.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handlePercent = () => {
    try {
      const val = parseFloat(display) / 100;
      setDisplay(val.toString());
      setEquation(equation + '/100');
    } catch {
      setDisplay('Erro');
    }
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
      setEquation(equation + '.');
    }
  };

  const handleEqual = () => {
    try {
      // Evaluate expression securely using Function constructor
      // Clean up multiple spaces or operators
      const sanitizedEq = equation.trim();
      if (!sanitizedEq) return;
      
      const result = new Function(`return (${sanitizedEq})`)();
      
      // Handle decimals limit
      const formattedResult = Number(result.toFixed(4)).toString();
      setDisplay(formattedResult);
      setEquation(formattedResult);
      setShouldReset(true);
    } catch (e) {
      setDisplay('Erro');
      setEquation('');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-[#0F172A] border border-slate-800 text-white rounded-2xl shadow-2xl w-full max-w-xs overflow-hidden">
        {/* Header bar */}
        <div className="flex justify-between items-center bg-[#0B2545] px-4 py-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-semibold text-slate-300 ml-2">Calculadora UniFinance</span>
          </div>
          <button 
            onClick={() => setShowCalculator(false)}
            className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-800 rounded-lg"
          >
            <X size={16} />
          </button>
        </div>

        {/* Display Screen */}
        <div className="p-4 bg-[#0A0F1D] flex flex-col justify-end items-end h-28">
          <div className="text-slate-500 text-xs font-mono truncate max-w-full mb-1">
            {equation || '0'}
          </div>
          <div className="text-3xl font-mono tracking-tight text-white font-medium truncate max-w-full select-all">
            {display}
          </div>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-1 p-2 bg-[#0F172A]">
          {/* Row 1 */}
          <button 
            onClick={handleClear}
            className="bg-slate-800 hover:bg-slate-700 active:bg-slate-600 py-3 text-sm font-semibold rounded-lg text-amber-400 transition-colors"
          >
            C
          </button>
          <button 
            onClick={handleBackspace}
            className="bg-slate-800 hover:bg-slate-700 active:bg-slate-600 py-3 flex items-center justify-center rounded-lg text-slate-300 transition-colors"
          >
            <Delete size={16} />
          </button>
          <button 
            onClick={handlePercent}
            className="bg-slate-800 hover:bg-slate-700 active:bg-slate-600 py-3 flex items-center justify-center rounded-lg text-slate-300 transition-colors"
          >
            <Percent size={16} />
          </button>
          <button 
            onClick={() => handleOperator('÷')}
            className="bg-[#0B2545] hover:bg-brand-primary-light active:bg-[#0B2545] py-3 text-lg font-bold rounded-lg text-amber-500 transition-colors"
          >
            ÷
          </button>

          {/* Row 2 */}
          <button 
            onClick={() => handleDigit('7')}
            className="bg-slate-800/50 hover:bg-slate-700 active:bg-slate-600 py-3 text-lg font-medium rounded-lg text-white transition-colors"
          >
            7
          </button>
          <button 
            onClick={() => handleDigit('8')}
            className="bg-slate-800/50 hover:bg-slate-700 active:bg-slate-600 py-3 text-lg font-medium rounded-lg text-white transition-colors"
          >
            8
          </button>
          <button 
            onClick={() => handleDigit('9')}
            className="bg-slate-800/50 hover:bg-slate-700 active:bg-slate-600 py-3 text-lg font-medium rounded-lg text-white transition-colors"
          >
            9
          </button>
          <button 
            onClick={() => handleOperator('×')}
            className="bg-[#0B2545] hover:bg-brand-primary-light active:bg-[#0B2545] py-3 text-lg font-bold rounded-lg text-amber-500 transition-colors"
          >
            ×
          </button>

          {/* Row 3 */}
          <button 
            onClick={() => handleDigit('4')}
            className="bg-slate-800/50 hover:bg-slate-700 active:bg-slate-600 py-3 text-lg font-medium rounded-lg text-white transition-colors"
          >
            4
          </button>
          <button 
            onClick={() => handleDigit('5')}
            className="bg-slate-800/50 hover:bg-slate-700 active:bg-slate-600 py-3 text-lg font-medium rounded-lg text-white transition-colors"
          >
            5
          </button>
          <button 
            onClick={() => handleDigit('6')}
            className="bg-slate-800/50 hover:bg-slate-700 active:bg-slate-600 py-3 text-lg font-medium rounded-lg text-white transition-colors"
          >
            6
          </button>
          <button 
            onClick={() => handleOperator('-')}
            className="bg-[#0B2545] hover:bg-brand-primary-light active:bg-[#0B2545] py-3 text-lg font-bold rounded-lg text-amber-500 transition-colors"
          >
            -
          </button>

          {/* Row 4 */}
          <button 
            onClick={() => handleDigit('1')}
            className="bg-slate-800/50 hover:bg-slate-700 active:bg-slate-600 py-3 text-lg font-medium rounded-lg text-white transition-colors"
          >
            1
          </button>
          <button 
            onClick={() => handleDigit('2')}
            className="bg-slate-800/50 hover:bg-slate-700 active:bg-slate-600 py-3 text-lg font-medium rounded-lg text-white transition-colors"
          >
            2
          </button>
          <button 
            onClick={() => handleDigit('3')}
            className="bg-slate-800/50 hover:bg-slate-700 active:bg-slate-600 py-3 text-lg font-medium rounded-lg text-white transition-colors"
          >
            3
          </button>
          <button 
            onClick={() => handleOperator('+')}
            className="bg-[#0B2545] hover:bg-brand-primary-light active:bg-[#0B2545] py-3 text-lg font-bold rounded-lg text-amber-500 transition-colors"
          >
            +
          </button>

          {/* Row 5 */}
          <button 
            onClick={() => handleDigit('0')}
            className="col-span-2 bg-slate-800/50 hover:bg-slate-700 active:bg-slate-600 py-3 text-lg font-medium rounded-lg text-white transition-colors"
          >
            0
          </button>
          <button 
            onClick={handleDecimal}
            className="bg-slate-800/50 hover:bg-slate-700 active:bg-slate-600 py-3 text-lg font-semibold rounded-lg text-white transition-colors"
          >
            ,
          </button>
          <button 
            onClick={handleEqual}
            className="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 py-3 text-lg font-bold rounded-lg text-brand-primary transition-colors"
          >
            =
          </button>
        </div>
      </div>
    </div>
  );
};
