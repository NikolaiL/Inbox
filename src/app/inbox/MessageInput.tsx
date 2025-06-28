import React, { useState } from 'react';

export function MessageInput({ onSend, disabled }: { onSend: (msg: string) => void; disabled: boolean }) {
  const [value, setValue] = useState('');
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        if (!value.trim()) return;
        onSend(value);
        setValue('');
      }}
    >
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={disabled}
        placeholder="Type a message..."
      />
      <button type="submit" disabled={disabled || !value.trim()}>
        Send
      </button>
    </form>
  );
} 