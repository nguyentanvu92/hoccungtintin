type ChatMsg = {
  role: 'user' | 'tutor';
  text: string;
};

export async function askTutor(
  prompt: string,
  history: ChatMsg[]
): Promise<string> {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      history,
    }),
  });

  if (!res.ok) {
    throw new Error('Tutor API failed');
  }

  const data = await res.json();
  return data.text;
}
