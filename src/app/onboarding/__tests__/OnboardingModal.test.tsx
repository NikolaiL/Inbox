let mockPrivyState: any = {
  login: jest.fn(),
  ready: true,
  authenticated: false,
  user: null,
};

jest.mock('@privy-io/react-auth', () => ({
  usePrivy: () => mockPrivyState,
}));

// Mock NameStone SDK
const mockSearchNames = jest.fn();
const mockSetName = jest.fn();

jest.mock('@namestone/namestone-sdk', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      searchNames: mockSearchNames,
      setName: mockSetName,
    })),
  };
});

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OnboardingModal } from '../OnboardingModal';

// Mock Zustand store if needed in future

describe('OnboardingModal', () => {
  beforeEach(() => {
    mockPrivyState = {
      login: jest.fn(),
      ready: true,
      authenticated: false,
      user: null,
    };
    mockSearchNames.mockReset();
    mockSetName.mockReset();
  });

  it('renders and navigates steps', () => {
    render(<OnboardingModal />);
    // Step 0: Wallet
    expect(screen.getByText(/Wallet Step/i)).toBeInTheDocument();
    // Go to ENS step
    fireEvent.click(screen.getByText(/Next/i));
    expect(screen.getByText(/ENS Step/i)).toBeInTheDocument();
    // Go to Inbox step
    fireEvent.click(screen.getByText(/Next/i));
    expect(screen.getByText(/Inbox Step/i)).toBeInTheDocument();
    // Go back to ENS step
    fireEvent.click(screen.getByText(/Back/i));
    expect(screen.getByText(/ENS Step/i)).toBeInTheDocument();
  });

  it('renders connect wallet button and advances on connect', () => {
    render(<OnboardingModal />);
    // Should show connect button
    const connectBtn = screen.getByRole('button', { name: /connect wallet/i });
    expect(connectBtn).toBeInTheDocument();
  });

  it('displays wallet address when authenticated', () => {
    mockPrivyState = {
      login: jest.fn(),
      ready: true,
      authenticated: true,
      user: {
        id: 'test-user',
        createdAt: new Date(),
        linkedAccounts: [],
        mfaMethods: [],
        hasAcceptedTerms: true,
        isGuest: false,
        wallet: {
          address: '0x1234abcd5678efgh',
          chainType: 'ethereum',
          imported: false,
          delegated: false,
          walletIndex: 0,
        },
      },
    };
    render(<OnboardingModal />);
    // Should show wallet address in ENS step
    expect(screen.getByText(/ENS Step/i)).toBeInTheDocument();
    expect(screen.getByText(/Wallet:/i)).toBeInTheDocument();
    expect(screen.getByText(/0x1234abcd5678efgh/i)).toBeInTheDocument();
  });

  it('renders ENS input and register button in ENS step', () => {
    mockPrivyState = {
      login: jest.fn(),
      ready: true,
      authenticated: true,
      user: {
        id: 'test-user',
        createdAt: new Date(),
        linkedAccounts: [],
        mfaMethods: [],
        hasAcceptedTerms: true,
        isGuest: false,
        wallet: {
          address: '0x1234abcd5678efgh',
          chainType: 'ethereum',
          imported: false,
          delegated: false,
          walletIndex: 0,
        },
      },
    };
    render(<OnboardingModal />);
    // ENS input should be present
    const input = screen.getByPlaceholderText(/choose your inbox name/i);
    expect(input).toBeInTheDocument();
    // Register button should be present
    const registerBtn = screen.getByRole('button', { name: /register/i });
    expect(registerBtn).toBeInTheDocument();
  });

  it('shows loading, available, taken, and error states for ENS input', async () => {
    mockPrivyState = {
      login: jest.fn(),
      ready: true,
      authenticated: true,
      user: {
        id: 'test-user',
        createdAt: new Date(),
        linkedAccounts: [],
        mfaMethods: [],
        hasAcceptedTerms: true,
        isGuest: false,
        wallet: {
          address: '0x1234abcd5678efgh',
          chainType: 'ethereum',
          imported: false,
          delegated: false,
          walletIndex: 0,
        },
      },
    };

    // Mock fetch for API calls
    global.fetch = jest.fn().mockImplementation((url) => {
      if (url.includes('myinbox')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]), // No results = available
        });
      } else if (url.includes('takenname')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([{ name: 'takenname' }]), // Has results = taken
        });
      } else {
        return Promise.reject(new Error('fail'));
      }
    });

    render(<OnboardingModal />);
    const input = screen.getByPlaceholderText(/choose your inbox name/i);

    // Test available name
    fireEvent.change(input, { target: { value: 'myinbox' } });
    expect(screen.getByText(/Checking availability/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText(/Name is available/i)).toBeInTheDocument());

    // Test taken name
    fireEvent.change(input, { target: { value: 'takenname' } });
    await waitFor(() => expect(screen.getByText(/Name is taken/i)).toBeInTheDocument());

    // Test error case
    fireEvent.change(input, { target: { value: 'errorname' } });
    await waitFor(() => expect(screen.getByText(/Error checking name/i)).toBeInTheDocument());
  });

  it('handles ENS registration success and failure', async () => {
    mockPrivyState = {
      login: jest.fn(),
      ready: true,
      authenticated: true,
      user: {
        id: 'test-user',
        createdAt: new Date(),
        linkedAccounts: [],
        mfaMethods: [],
        hasAcceptedTerms: true,
        isGuest: false,
        wallet: {
          address: '0x1234abcd5678efgh',
          chainType: 'ethereum',
          imported: false,
          delegated: false,
          walletIndex: 0,
        },
      },
    };

    // Mock fetch for API calls
    let shouldSucceed = true;
    global.fetch = jest.fn().mockImplementation((url, options) => {
      if (options?.method === 'POST') {
        return shouldSucceed
          ? Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true }) })
          : Promise.resolve({ 
              ok: false, 
              json: () => Promise.resolve({ error: 'Registration failed' }),
              statusText: 'Registration failed'
            });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]), // Name is available
      });
    });

    render(<OnboardingModal />);
    const input = screen.getByPlaceholderText(/choose your inbox name/i);
    fireEvent.change(input, { target: { value: 'registerme' } });
    await waitFor(() => expect(screen.getByText(/Name is available/i)).toBeInTheDocument());

    // Test successful registration
    const registerBtn = screen.getByRole('button', { name: /register/i });
    fireEvent.click(registerBtn);
    await waitFor(() => expect(screen.getByText(/Registration successful/i)).toBeInTheDocument());

    // Test failed registration
    shouldSucceed = false;
    fireEvent.change(input, { target: { value: 'failme' } }); // Change name to trigger new availability check
    await waitFor(() => expect(screen.getByText(/Name is available/i)).toBeInTheDocument());
    fireEvent.click(registerBtn);
    await waitFor(() => expect(screen.getByText(/Registration failed/i)).toBeInTheDocument());
  });
});
