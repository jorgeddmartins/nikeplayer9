import type { NextPage, GetStaticProps } from 'next';

import Page from '@components/Page';
import PageDebug from '@components/PageDebug';

import { readCopy } from '@utils/page';

type DebugProps = {
  copy: Record<string, string>;
};

export const getStaticProps: GetStaticProps<DebugProps> = async () => {
  const copy = await readCopy();
  return {
    props: {
      copy
    }
  };
};

const HomePage: NextPage<DebugProps> = ({ copy }) => {
  return (
    <Page copy={copy} desktopSupport>
      <PageDebug />
    </Page>
  );
};

export default HomePage;
