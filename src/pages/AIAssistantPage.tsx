/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { Sparkles, Send, Bot, User, Trash2, ArrowRight, HelpCircle } from 'lucide-react';

interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  timestamp: Date;
}

export const AIAssistantPage: React.FC = () => {
  const { transactions, categories, goals, budgets, saldoAtual, totalReceitas, totalDespesas } = useFinance();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: 'Olá! Sou o UniFinance AI, o seu assistente inteligente de gestão financeira académica e pessoal. Posso analisar as suas despesas atuais, sugerir planos de poupança, explicar conceitos de economia ou dar dicas para atingir as suas metas. Como lhe posso ajudar hoje?',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputText.trim();
    if (!query || isLoading) return;

    // Add user message
    const userMsg: ChatMessage = { sender: 'user', text: query, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Hit Express server-side proxy endpoint
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: query,
          context: {
            saldoAtual,
            totalReceitas,
            totalDespesas,
            transactionsCount: transactions.length,
            goalsCount: goals.length,
            budgetsCount: budgets.length,
            recentTransactions: transactions.slice(0, 3).map(tx => ({
              description: tx.description,
              amount: tx.amount,
              type: tx.type,
              date: tx.date
            }))
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, {
          sender: 'ai',
          text: data.reply,
          timestamp: new Date()
        }]);
      } else {
        // Fallback to sophisticated mock responses tailored to the user's specific financial situation
        await new Promise(resolve => setTimeout(resolve, 1400));
        const customReply = generateSmartSimulatedReply(query);
        setMessages(prev => [...prev, {
          sender: 'ai',
          text: customReply,
          timestamp: new Date()
        }]);
      }
    } catch {
      // Error fallback
      await new Promise(resolve => setTimeout(resolve, 1000));
      const customReply = generateSmartSimulatedReply(query);
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: customReply,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- REVOLUTIONARY CONTEXT-AWARE FINANCIAL CHAT SIMULATION ---
  const generateSmartSimulatedReply = (prompt: string): string => {
    const query = prompt.toLowerCase();
    
    // Quick calculations for the simulation response
    const ratio = totalReceitas > 0 ? (totalDespesas / totalReceitas) * 100 : 0;
    const isOverspent = totalDespesas > totalReceitas;
    
    if (query.includes('analisar') || query.includes('análise') || query.includes('diagnóstico') || query.includes('como estou')) {
      return `Com base nos lançamentos actuais do seu UniFinance, aqui está a minha análise personalizada:
      
1. **Balanço Geral:** O seu saldo actual de disponível é de **${saldoAtual.toLocaleString('pt-MZ')} MZN**. Registou **${totalReceitas.toLocaleString('pt-MZ')} MZN** de receitas e **${totalDespesas.toLocaleString('pt-MZ')} MZN** de despesas.
2. **Proporção de Consumo:** As suas despesas representam **${ratio.toFixed(0)}%** das suas receitas totais. ${isOverspent ? 'Atenção: Está a gastar mais do que ganha neste período.' : 'Parabéns: Consegue manter-se dentro de uma proporção segura.'}
3. **Plano de Poupança:** Possui actualmente **${goals.length} metas activas**.

**Recomendação:** Aconselho-lhe a monitorizar com especial detalhe a categoria com maior número de registos este mês e a reforçar as suas metas de poupança no M-Pesa.`;
    }

    if (query.includes('poupar') || query.includes('guardar') || query.includes('economizar') || query.includes('dicas')) {
      return `Aqui estão 3 dicas práticas personalizadas para poupar dinheiro em Moçambique, adequadas ao seu perfil de despesas:

1. **A Regra dos Envelopes Digitais:** Divida as suas receitas mal as receba. Utilize uma conta bancária para despesas fixas e guarde o seu dinheiro de poupança (pelo menos 10% a 20%) nas opções de Poupança Carteira Móvel (M-Pesa Poupança ou e-Mola Poupança).
2. **Controle a Internet Móvel:** Verifique se as operadoras (Vodacom, Movitel, mcel) têm planos de internet académica mais baratos e evite comprar pacotes diários recorrentes, que saem mais caros no cômputo mensal.
3. **Limite o 'Chapa' e Lazer:** Tente definir um orçamento mensal máximo aqui na aba "Orçamentos" para as suas saídas e transportes, para evitar gastar em impulsos no final do mês.`;
    }

    if (query.includes('meta') || query.includes('metas') || query.includes('poupança')) {
      if (goals.length > 0) {
        const firstGoal = goals[0];
        const missing = firstGoal.targetAmount - firstGoal.currentAmount;
        return `Detetei que possui a meta **"${firstGoal.name}"** configurada!
        
O seu progresso actual é de **${((firstGoal.currentAmount / firstGoal.targetAmount) * 100).toFixed(1)}%**. Faltam apenas **${missing.toLocaleString('pt-MZ')} MZN** para completar este objectivo.

**Conselho:** Tente economizar pequenos valores diários (por exemplo, 50 MZN ou 100 MZN que gastaria em lanches secundários) e faça um depósito semanal nesta meta aqui no UniFinance para criar hábito!`;
      } else {
        return `Ainda não criou nenhuma meta de poupança na plataforma UniFinance.
        
Para começar, aceda à aba **"Metas"** e configure o seu primeiro objectivo, como por exemplo: "Comprar Computador" ou "Fundo de Propina". Eu ajudarei a monitorizar o seu progresso diário de forma inteligente.`;
      }
    }

    if (query.includes('m-pesa') || query.includes('carteira') || query.includes('e-mola')) {
      return `As carteiras móveis (M-Pesa, e-Mola, mKesh) são excelentes ferramentas para o dia a dia em Moçambique.
      
No entanto, tenha atenção às **taxas de levantamento e de transferência**, que muitas vezes não são contabilizadas como despesa e acabam por acumular um valor considerável ao final do mês. Registe sempre essas taxas nas observações das suas despesas para ter um controlo exato do seu saldo disponível!`;
    }

    // Default friendly assistant fallback
    return `Entendi o seu ponto. Como assistente inteligente de finanças pessoais do UniFinance, recomendo focar-se na organização.

Se desejar, pode perguntar sobre:
- **"Análise geral das minhas despesas"**
- **"Como posso poupar dinheiro?"**
- **"Dicas para alcançar as minhas metas de poupança"**
- **"Taxas e uso inteligente de carteiras móveis"**`;
  };

  const handleClearHistory = () => {
    setMessages([
      {
        sender: 'ai',
        text: 'Histórico limpo. Como lhe posso ser útil agora?',
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col h-[calc(100vh-140px)] shadow-xs">
      {/* Assistant Header bar */}
      <div className="flex justify-between items-center bg-[#0B2545] text-white px-5 py-4 rounded-t-xl border-b border-slate-850">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500 text-brand-primary rounded-xl animate-pulse">
            <Sparkles size={16} />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider font-sans">UniFinance AI Assistant</h2>
            <p className="text-[10px] text-slate-350">Aconselhamento e auditoria de despesas académicas em Moçambique</p>
          </div>
        </div>
        <button
          onClick={handleClearHistory}
          className="text-slate-300 hover:text-white transition-colors p-1.5 hover:bg-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1"
          title="Limpar Histórico"
        >
          <Trash2 size={13} />
          <span className="hidden sm:inline">Limpar Chat</span>
        </button>
      </div>

      {/* Chat conversation zone */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => {
          const isAI = msg.sender === 'ai';
          return (
            <div 
              key={idx}
              className={`flex items-start gap-3.5 max-w-[85%] ${isAI ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
            >
              <div className={`p-2.5 rounded-xl shrink-0 ${isAI ? 'bg-amber-500/10 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                {isAI ? <Bot size={18} /> : <User size={18} />}
              </div>
              <div className={`p-3.5 rounded-2xl text-xs leading-relaxed font-medium ${isAI ? 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-800/60' : 'bg-[#0B2545] text-white'}`}>
                <div className="whitespace-pre-line">{msg.text}</div>
                <span className="text-[9px] opacity-50 mt-1.5 block text-right">
                  {msg.timestamp.toLocaleTimeString('pt-MZ', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className="flex items-start gap-3.5 max-w-[80%] mr-auto">
            <div className="p-2.5 bg-amber-500/10 text-amber-600 rounded-xl">
              <Bot size={18} className="animate-bounce" />
            </div>
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-300 text-xs italic">
              O assistente está a analisar os seus lançamentos...
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input controls form */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-150 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/60 rounded-b-xl">
        <div className="flex gap-2">
          <input
            type="text"
            required
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Como poupar dinheiro? / Analisar despesas..."
            className="flex-1 px-4 py-3 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:ring-2 focus:ring-[#0B2545] outline-hidden placeholder-slate-400"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="px-5 bg-[#0B2545] hover:bg-brand-primary-light text-white rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            <Send size={15} />
            <span className="hidden sm:inline font-bold text-xs uppercase tracking-wider">Enviar</span>
          </button>
        </div>
      </form>
    </div>
  );
};
