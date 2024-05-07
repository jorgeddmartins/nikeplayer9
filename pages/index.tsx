import type { NextPage, GetStaticProps } from 'next';

import Page from '@components/Page';
import PageStart from '@components/PageStart';

import { readCopy } from '@utils/page';

type ARProps = {
  copy: Record<string, string>;
};

export const getStaticProps: GetStaticProps<ARProps> = async () => {
  const copy = await readCopy();
  return {
    props: {
      copy
    }
  };
};

const HomePage: NextPage<ARProps> = ({ copy }) => {
  return (
    <Page copy={copy}>
      <PageStart />
    </Page>
  );
};

export default HomePage;
