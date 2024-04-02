import { GetServerSideProps } from 'next';
import App from '../App';

export interface AppProps {
  userLocation: string;
  timeZone: string;
  nodeEnv: 'development' | 'test' | 'production';
}

export const getServerSideProps: GetServerSideProps<AppProps> = async (ctx) => {
  const userLocation = ctx.req.cookies.userLocation || '';
  const timeZone = ctx.req.cookies.tz || '';
  const nodeEnv = process.env.NODE_ENV || 'development';

  return {
    props: {
      userLocation,
      timeZone,
      nodeEnv,
    },
  };
};

const Home = (props: AppProps) => <App {...props} />;

export default Home;
