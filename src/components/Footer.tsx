import { useContext } from 'react';
import { PageContext } from './Page';
import Cookies from './Cookies';
import s from './Footer.module.scss';

const Footer = () => {
  const { copy, cookies } = useContext(PageContext);
  return (
    <div className={s.wrap}>
      <span
        className={s.cookiesSettings}
        onClick={() => cookies.setShowPopup(true)}
      >
        {copy('footer.cookies-settings')}
      </span>
      <a
        href="https://agreementservice.svs.nike.com/rest/agreement?agreementType=adnetwork&uxId=default&country=GB&language=en&requestType=redirect"
        rel="noreferrer"
        target="_blank"
      >
        {copy('footer.cookie-policy')}
      </a>
      <a
        href="https://agreementservice.svs.nike.com/rest/agreement?agreementType=privacyPolicy&uxId=default&country=GB&language=en&requestType=redirect"
        rel="noreferrer"
        target="_blank"
      >
        {copy('footer.privacy')}
      </a>
      <a
        href="https://agreementservice.svs.nike.com/rest/agreement?agreementType=termsOfUse&uxId=default&country=GB&language=en&requestType=redirect"
        rel="noreferrer"
        target="_blank"
      >
        {copy('footer.terms')}
      </a>
      <span className={s.copyright}>{copy('footer.rights')}</span>
      {!cookies.showPopup && <Cookies />}
    </div>
  );
};

export default Footer;
