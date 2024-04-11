import { useEffect } from 'react';

const MeetupOAuthProvider = (props: { children: JSX.Element }) => {
  useEffect(() => {
    window.open('/api/oauth');
  }, []);

  return props.children;
};

export default MeetupOAuthProvider;
