# ChatNow — frontend

Minimal React + Vite chat frontend with authentication, one-to-one and group chat, and real-time messaging via Socket.IO.

Quick start
- Install & run:
  ```sh
  npm install
  npm run dev
  ```
- Build:
  ```sh
  npm run build
  npm run preview
  ```

Major features
- Authentication: signup & login with token storage.
- Real-time chat: messages via Socket.IO and REST.
- One-to-one and group chats: create and manage group members.
- Responsive UI: built with Chakra UI primitives.
- Typing indicator and auto-scrolling for messages.

Technologies
- React + Vite
- Chakra UI
- Socket.IO (client)
- Lottie (typing animation)
- JavaScript, CSS

Important files (high level)
- App entry and router
- Context providers for auth & chat state
- Components: chat list, chat box, single chat, scrollable messages, side drawer
- UI helpers: theme provider, toaster, password input

Config notes
- Backend base URL is assumed to be http://localhost:3000 — update in code if different.
- Path aliases are configured for cleaner imports.

Troubleshooting
- Restart dev server if aliases fail to resolve.
- Clear localStorage token to reset auth state.
- Check console for socket connection logs.

Demo:


https://github.com/user-attachments/assets/a0f6e1db-9156-446a-83ff-e4c3e1e909f2

