import { request } from 'https';
require('dotenv').config();

export async function chatWithGPT(prompt: string): Promise<string | undefined> {
  const model = "text-davinci-002";
  const temperature = "0.7";
  const maxTokens = "150";

  const options = JSON.stringify({
    prompt: prompt,
    model: model,
    temperature: temperature,
    max_tokens: maxTokens
  });

  const postData = JSON.stringify({
    api_key: process.env.OPENAI_API_KEY,
    options: options
  });

  const requestHeaders = {
    "Content-Type": "application/json",
    "Content-Length": postData.length
  };

  const requestOptions = {
    hostname: "api.openai.com",
    path: "/v1/engines/davinci-codex/completions",
    method: "POST",
    headers: requestHeaders
  };

  return new Promise<string | undefined>((resolve, reject) => {
    const req = request(requestOptions, (res) => {
      let responseData = "";
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        const responseJson = JSON.parse(responseData);
        if (responseJson.choices && responseJson.choices.length > 0) {
          resolve(responseJson.choices[0].text);
        } else {
          resolve(undefined);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}