import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

function Smoke() {
  return <div>Hello, INBOX!</div>;
}

test('renders hello message', () => {
  render(<Smoke />);
  expect(screen.getByText('Hello, INBOX!')).toBeInTheDocument();
}); 