let mockPrivyState: unknown = {
  login: jest.fn(),
  ready: true,
  authenticated: false,
  user: null,
};

jest.mock('@privy-io/react-auth', () => ({
  usePrivy: () => mockPrivyState,
}));

// Mock Zustand store for notifications
jest.mock('../../../store/useNotificationStore', () => ({
  useNotificationStore: () => ({
    showToast: jest.fn(),
  }),
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
    // Suppress console.error for this test suite
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders connect wallet button', () => {
    render(<OnboardingModal />);
    // Should show connect button
    const connectBtn = screen.getAllByRole('button', { name: /connect wallet/i })[1];
    expect(connectBtn).toBeInTheDocument();
  });

  it('displays wallet address when authenticated', async () => {
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
    // Should show wallet address
    await waitFor(() => {
      expect(screen.getByText(/0x1234abcd5678efgh/i)).toBeInTheDocument();
    });
  });

  it('renders ENS input and register button in ENS step', async () => {
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
    await waitFor(() => {
      const input = screen.getByPlaceholderText(/your-name/i);
      expect(input).toBeInTheDocument();
    });
    // Register button should be present
    const registerBtn = screen.getByRole('button', { name: /register name/i });
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
    await waitFor(() => {
      const input = screen.getByPlaceholderText(/your-name/i);
      expect(input).toBeInTheDocument();
    });
    const input = screen.getByPlaceholderText(/your-name/i);

    // Test available name
    fireEvent.change(input, { target: { value: 'myinbox' } });
    await waitFor(() => expect(screen.getByText(/checking availability/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText(/name is available/i)).toBeInTheDocument());

    // Test taken name
    fireEvent.change(input, { target: { value: 'takenname' } });
    await waitFor(() => expect(screen.getByText(/name is unavailable/i)).toBeInTheDocument());

    // Test error case
    fireEvent.change(input, { target: { value: 'errorname' } });
    await waitFor(() => expect(screen.getByText(/error checking name/i)).toBeInTheDocument());
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
    await waitFor(() => {
      const input = screen.getByPlaceholderText(/your-name/i);
      expect(input).toBeInTheDocument();
    })
    const input = screen.getByPlaceholderText(/your-name/i);
    fireEvent.change(input, { target: { value: 'registerme' } });
    await waitFor(() => expect(screen.getByText(/Name is available/i)).toBeInTheDocument());

    // Test successful registration
    const registerBtn = screen.getByRole('button', { name: /register name/i });
    fireEvent.click(registerBtn);
    await waitFor(() => expect(screen.getByText(/registration successful/i)).toBeInTheDocument());

    // Test failed registration
    shouldSucceed = false;
    // Reset the state to go back to the ENS step for the failure test
    const changeButton = screen.getByText(/change/i);
    fireEvent.click(changeButton);

    await waitFor(() => {
      const input = screen.getByPlaceholderText(/your-name/i);
      expect(input).toBeInTheDocument();
    });
    const failInput = screen.getByPlaceholderText(/your-name/i);
    fireEvent.change(failInput, { target: { value: 'failme' } }); 
    await waitFor(() => expect(screen.getByText(/Name is available/i)).toBeInTheDocument());
    const failRegisterBtn = screen.getByRole('button', { name: /register name/i });
    fireEvent.click(failRegisterBtn);
    await waitFor(() => expect(screen.getByText(/registration failed/i)).toBeInTheDocument());
  });
});
