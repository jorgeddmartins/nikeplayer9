import React from 'react';
import Head from 'next/head';

import shareImage from '../assets/img/social.png';

type MetaProps = {
  copy: Record<string, string>;
};

const Meta = ({ copy }: MetaProps) => {
  return (
    <Head>
      <title key="title">{copy['meta.title']}</title>
      <meta key="x-ua" httpEquiv="x-ua-compatible" content="ie=edge" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      />
      <meta key="author" name="author" content={copy['meta.author']} />
      <meta
        key="description"
        name="description"
        content={copy['meta.description']}
      />
      <meta key="keywords" name="keywords" content={copy['meta.keywords']} />

      <meta key="og.locale" property="og:locale" content="en_GB" />
      <meta key="og.type" property="og:type" content="website" />
      <meta
        key="og.site_name"
        property="og:site_name"
        content={copy['meta.og.site_name']}
      />

      <meta
        key="og.title"
        property="og:title"
        content={copy['meta.og.title']}
      />
      {/* <meta key="og.url" property="og:url" content="https://tjxar.com/" /> */}
      <meta key="og.image" property="og:image" content={shareImage.src} />
      <meta key="og.image.width" property="og:image:width" content="512" />
      <meta key="og.image.height" property="og:image:height" content="512" />
      <meta
        key="og.description"
        property="og:description"
        content={copy['meta.og.description']}
      />

      <meta
        key="twitter.card"
        name="twitter:card"
        content="summary_large_image"
      />
      <meta
        key="twitter.title"
        name="twitter:title"
        content={copy['meta.twitter.title']}
      />
      <meta
        key="twitter.description"
        name="twitter:description"
        content={copy['meta.twitter.description']}
      />
      <meta key="twitter.image" name="twitter:image" content={shareImage.src} />

      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />

      <link
        rel="manifest"
        href="/site.webmanifest"
        crossOrigin="use-credentials"
      />

      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <meta name="msapplication-TileColor" content="#da532c" />
      <meta name="theme-color" content="#ffffff" />
    </Head>
  );
};

export default Meta;
