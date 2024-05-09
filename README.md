# StudyCafe

## Get started

- `npm install`
- `touch .env` in the root directory
- Edit `.env`
- `npm run dev`

## `.env` Configuration

```
NEXT_PUBLIC_SERVER_URL="http://localhost:3000"
NEXT_PUBLIC_PHONE_TEST_URL="http://your-local-hostname:3000"

// Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=**********
CLERK_SECRET_KEY=**********
CLERK_WEBHOOK_SECRET=**********
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/welcome
NEXT_PUBLIC_CLERK_SIGN_OUT_FORCE_REDIRECT_URL=/welcome

//mongodb
MONGODB_URI=**********

// inworld
INWORLD_API_KEY=**********
INWORLD_SECRET_KEY=*********
INWORLD_SCENE=*********
INWORLD_BASE64_KEY=*********
```

## Branches

- `main`
- `develop`

## Deployment

https://emi-theta.vercel.app/

## Project Structure

---

StudyCafe team with Narutomaki 🍥
