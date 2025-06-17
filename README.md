# INBOX: Decentralized Inbox Web App

## Overview
INBOX is a decentralized inbox web application that enables users to onboard with their wallet, register an ENS subname, and communicate securely using XMTP. The project is built with Next.js and leverages modern web3 technologies for seamless onboarding and messaging.

## Features
- **Wallet Onboarding:** Secure wallet connection using Privy SDK
- **ENS Subname Registration:** Register a unique ENS subname via NameStone SDK
- **Inbox & Messaging:** Decentralized messaging powered by XMTP (coming soon)
- **Notifications:** Real-time notifications for new messages (planned)
- **Test Coverage:** Comprehensive tests using Jest and React Testing Library
- **CI/CD:** Automated testing and linting with GitHub Actions

## Tech Stack
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Privy SDK](https://docs.privy.io/) (wallet onboarding)
- [NameStone SDK](https://namestone.com/docs/sdk-quickstart) (ENS subname registration)
- [XMTP](https://xmtp.org/) (messaging, planned)
- [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Zustand](https://zustand-demo.pmnd.rs/) (state management)
- [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/)

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/inbox.git
   cd inbox/inbox-app
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Configure environment variables:**
   Create a `.env.local` file in this folder with the following:
   ```env
   NEXT_PUBLIC_NAMESTONE_ENS_DOMAIN=yourbrand.eth
   NEXT_PUBLIC_NAMESTONE_API_KEY=your-namestone-api-key
   NAMESTONE_API_KEY=your-namestone-api-key
   ```
   Replace values with your actual ENS domain and NameStone API key.

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000)

### Running Tests
```bash
npm test
# or
yarn test
```

## Project Structure
```
src/
  app/
    onboarding/           # Onboarding modal and logic
    api/namestone/        # API route for ENS registration (CORS proxy)
  ...
public/
.env.local               # Environment variables
...
```

## Roadmap
- [x] Wallet onboarding (Privy)
- [x] ENS subname registration (NameStone)
- [ ] Messaging and inbox (XMTP)
- [ ] Notification system
- [ ] Documentation and coverage

## License
MIT

---

*Built with ❤️ by the INBOX team.*
