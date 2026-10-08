/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize server-side Gemini client
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// --- SECURE PROXY ROUTE FOR UNIFINANCE AI ASSISTANT ---
app.post('/api/ai', async (req: express.Request, res: express.Response) => {
  const { prompt, context } = req.body;

  if (!prompt) {
    res.status(400).json({ error: 'prompt is required' });
    return;
  }

  // If Gemini API Key is missing or default placeholder, let client know to trigger fallback
  if (!ai) {
    res.status(503).json({ error: 'Gemini API not configured' });
    return;
  }

  try {
    const systemPrompt = `Você é o UniFinance AI, um assistente inteligente de gestão financeira pessoal desenhado especificamente para utilizadores em Moçambique (comunidade académica e público em geral).
Seu objetivo é dar conselhos práticos, claros, responsáveis e de fácil compreensão sobre poupança, controle de despesas e uso de carteiras móveis (como M-Pesa, e-Mola, mKesh).
Use a moeda padrão de Moçambique: MZN (Metical moçambicano).

O utilizador possui o seguinte contexto financeiro actual:
- Saldo Disponível: ${context?.saldoAtual || 0} MZN
- Total de Receitas Registadas: ${context?.totalReceitas || 0} MZN
- Total de Despesas Registadas: ${context?.totalDespesas || 0} MZN
- Número de transações recentes: ${context?.transactionsCount || 0}
- Número de metas de poupança: ${context?.goalsCount || 0}
- Número de orçamentos mensais ativos: ${context?.budgetsCount || 0}

Responda de forma profissional e encorajadora em português de Moçambique, de forma concisa e útil.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      }
    });

    res.json({ reply: response.text });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error communicating with Gemini' });
  }
});

// --- ENHANCED STATIC ASSETS & VITE DEVELOPMENT CONFIGURATION ---
const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) {
  // Mount Vite development middlewares when in development
  import('vite').then((vite) => {
    vite.createServer({
      server: { middlewareMode: true },
      appType: 'custom'
    }).then((viteDevServer) => {
      app.use(viteDevServer.middlewares);
      
      // Fallback route for SPA router
      app.use('*', async (req, res, next) => {
        const url = req.originalUrl;
        try {
          // Read index.html template and inject Vite
          const fs = await import('fs');
          let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
          template = await viteDevServer.transformIndexHtml(url, template);
          res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
        } catch (e) {
          viteDevServer.ssrFixStacktrace(e as Error);
          next(e);
        }
      });
    });
  });
} else {
  // Serve static assets out of the built /dist folder in production
  app.use(express.static(path.join(__dirname, 'dist')));
  
  // Direct all unknown routes to index.html for Single Page App routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Start Server listening
app.listen(port, () => {
  console.log(`UniFinance backend server running at http://localhost:${port}`);
});
