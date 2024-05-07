import type { ReactNode } from 'react';
import Landscape from '@components/Landscape';
import Desktop from '@components/Desktop';

type LayoutProps = {
  hasFooter?: boolean;
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <Desktop>
      <Landscape>{children}</Landscape>
    </Desktop>
  );
};

export default Layout;
