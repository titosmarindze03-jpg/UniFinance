/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, GraduationCap, ArrowRight, HelpCircle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface Article {
  title: string;
  category: string;
  readTime: string;
  summary: string;
  content: string[];
}

export const EducationPage: React.FC = () => {
  const [selectedArticleIndex, setSelectedArticleIndex] = useState<number | null>(null);

  const articles: Article[] = [
    {
      title: "Como Gerir o Orçamento Sendo Estudante Universitário",
      category: "Dicas Práticas",
      readTime: "4 min de leitura",
      summary: "Aprenda a distribuir a sua mesada, bolsa ou primeiro salário sem passar por sufocos antes do final do mês.",
      content: [
        "A vida universitária em Moçambique traz grandes desafios, especialmente no controlo das despesas do dia a dia. Para não depender constantemente de ajudas de emergência, o primeiro passo é registar exatamente todas as despesas diárias, por mais pequenas que sejam.",
        "Divida o seu dinheiro assim que o receber: separe imediatamente o valor necessário para as despesas essenciais e fixas do mês (como alojamento/quarto, propinas, pacotes de internet para estudos e transporte diário).",
        "Utilize a regra dos envelopes ou uma conta digital separada para evitar gastar o dinheiro das despesas fixas em saídas casuais com colegas.",
        "Crie uma pequena reserva para fotocópias de manuais, taxas académicas surpresa ou trabalhos práticos que surgem durante o semestre."
      ]
    },
    {
      title: "A Regra dos 50/30/20 Aplicada à Realidade de Moçambique",
      category: "Planeamento",
      readTime: "5 min de leitura",
      summary: "Adapte este popular método internacional de divisão financeira para a moeda nacional (MZN).",
      content: [
        "A regra dos 50/30/20 propõe dividir os seus rendimentos mensais líquidos em três categorias de gastos:",
        "50% para Necessidades Básicas: Aqui entram gastos inadiáveis como alimentação, transporte público (chapa ou táxi), internet essencial para estudos e aluguer de quarto.",
        "30% para Desejos Pessoais: Lazer, jantares fora, cinema ou saídas com amigos na Av. Julius Nyerere, roupas novas ou hobbies.",
        "20% para Poupança e Metas: Canalize esta percentagem para a sua conta poupança móvel (ex: M-Pesa Poupança) ou para a sua meta criada aqui no UniFinance.",
        "Se os seus rendimentos forem limitados, ajuste para uma proporção mais realista como 70/20/10, mas garanta que guarda sempre uma percentagem fixa mensal."
      ]
    },
    {
      title: "Cuidado com Aplicações de Crédito Rápido e Juros Abusivos",
      category: "Prevenção",
      readTime: "3 min de leitura",
      summary: "Dicas essenciais para evitar cair em esquemas de empréstimos fáceis com taxas de juros que consomem todo o seu orçamento.",
      content: [
        "Com a facilidade de acesso a smartphones e carteiras móveis em Moçambique, multiplicaram-se as plataformas que prometem crédito imediato com poucos cliques.",
        "Muitas destas aplicações aplicam taxas de juros ocultas extremamente elevadas (por vezes superiores a 30% ou 50% em poucas semanas). Isto cria um efeito 'bola de neve' onde o estudante utiliza uma nova dívida para cobrir a anterior.",
        "Evite contrair créditos de consumo rápido para desejos casuais. Se precisar de fundos com urgência, procure sempre o apoio de familiares ou linhas de crédito institucionais credíveis e reguladas pelo Banco de Moçambique."
      ]
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#0B2545] to-[#1E3E62] text-white p-6 rounded-2xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 translate-x-12 -translate-y-6 select-none pointer-events-none">
          <GraduationCap size={180} />
        </div>
        <div className="relative z-10 space-y-1">
          <h1 className="font-serif text-xl font-bold tracking-tight">Academia UniFinance de Educação Financeira 🎓</h1>
          <p className="text-slate-350 text-xs">Desenvolva competências práticas de economia doméstica, planeamento a longo prazo e gestão inteligente do Metical.</p>
        </div>
      </div>

      {/* Grid of Articles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left and center main column: Articles list */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Artigos Recomendados</h3>
          
          <div className="space-y-4">
            {articles.map((art, idx) => {
              const isSelected = selectedArticleIndex === idx;
              return (
                <div 
                  key={idx}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => setSelectedArticleIndex(isSelected ? null : idx)}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 text-[9px] font-bold uppercase px-2 py-0.5 rounded">
                          {art.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">{art.readTime}</span>
                      </div>
                      
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-serif leading-tight">
                        {art.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                        {art.summary}
                      </p>
                    </div>

                    <button className="text-slate-400 hover:text-slate-700 p-1 rounded-full bg-slate-50 dark:bg-slate-800 shrink-0">
                      {isSelected ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>

                  {/* Expanded article content display */}
                  {isSelected && (
                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3.5 animate-fade-in text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {art.content.map((paragraph, pIdx) => (
                        <p key={pIdx}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right side helper column */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-xs">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sparkles size={14} className="text-amber-500" />
              Saber mais
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Deseja obter conselhos adicionais personalizados especificamente para as suas despesas mensais? 
            </p>
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800/60 rounded-xl text-xs font-medium leading-relaxed">
              Consulte o nosso <strong className="text-brand-accent font-bold">Assistente Inteligente AI</strong> na barra lateral para fazer perguntas livres e simular cenários de investimento.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
