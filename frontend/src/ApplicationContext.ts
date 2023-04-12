import { createContext } from 'react';

const ApplicationContext = createContext({
  session: null,
  username: null
});

export default ApplicationContext;
