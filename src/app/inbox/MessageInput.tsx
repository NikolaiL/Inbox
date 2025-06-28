import React, { useState } from 'react';

export function MessageInput({ conversationId, onSend, isLoading }: {
  conversationId: string;
  onSend: (value: string) => void;
  isLoading: boolean;
}) {
  const [value, setValue] = useState('');

  function handleSend() {
    if (!value) return;
    onSend(value);
    setValue('');
  }

  return (
    <div>
      <input
        placeholder="Type a message"
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={isLoading}
      />
      <button onClick={handleSend} disabled={isLoading}>Send</button>
    </div>
  );
} 