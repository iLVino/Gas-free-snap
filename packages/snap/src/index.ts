import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { panel, text } from '@metamask/snaps-ui';

async function askAI(): Promise<any> {
  const apiKey = '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';
  const apiUrl = 'https://api.openai.com/v1/chat/completions';
  const model = 'gpt-3.5-turbo';
  const messages = [{ role: 'user', content: 'Speak like a concierge' }];
  const temperature = 0.7;
  const body = {
    model,
    messages,
    temperature
  };
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });
  const data = await response.json();
  return data;
}


export const onRpcRequest: OnRpcRequestHandler = ({ origin, request }) => {
  switch (request.method) {
    case 'WhatToDo':
      return askAI().then(question  => { 
        return snap.request({
          method: 'snap_dialog', 
          params: { 
            type: 'prompt', 
            content: panel([
              text(`How can I help?, **${origin}**!`), 
              text(`Current gas fee estimates: ${question}`), 
            ]), 
          }
        }); 
      }); 

    case 'whatDo':
      console.log('Second method');
      return Promise.resolve();

    default:
      throw new Error('Method not found.');
  }
};

