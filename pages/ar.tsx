import type { NextPage, GetStaticProps } from 'next';

import Page from '@components/Page';
import PageAR from '@components/PageAR';

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

const ARPage: NextPage<ARProps> = ({ copy }) => {
  return (
    <Page copy={copy}>
      <PageAR
        options={{
          position: 'top',
          blackWhite: true
        }}
      />
    </Page>
  );
};

export default ARPage;
