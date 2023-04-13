import { createContext } from 'react';

const ApplicationContext = createContext({
  sessionId: null,
  token: null,
  username: null
});

export default ApplicationContext;
