import { useContext, useState } from 'react';
import { PageContext } from './Page';
import Button, { ButtonTypes } from '@components/Button';
import Checkbox from '@components/Checkbox';
import s from './Cookies.module.scss';
import classNames from 'classnames';
import { ReactComponent as Close } from '../assets/img/close.svg';

const Cookies = () => {
  const { copy, cookies } = useContext(PageContext);
  const [isFunctionalExpanded, setIsFunctionalExpanded] = useState(true);
  const [showInformation, setShowInformation] = useState(false);

  return (
    <div
      className={classNames({ [s.wrap]: true, [s.hide]: !cookies.showPopup })}
    >
      <div className={s.overlay}></div>
      <div className={s.cookiesContent}>
        <span
          className={s.closeBtn}
          onClick={() => {
            cookies.setShowPopup(false);
          }}
        >
          <Close />
        </span>

        <section>
          <h1 className={s.h1}>{copy('cookies.heading')}</h1>

          {!showInformation ? (
            <div className={s.cookieInfo}>
              <p
                className={s.topParagraph}
                dangerouslySetInnerHTML={{ __html: copy('cookies.copy') }}
              />
            </div>
          ) : (
            <div className={s.cookieFunctional}>
              <div className={s.container}>
                <div className={s.title}>
                  <Checkbox checked />
                  <h2 className={s.h2}>{copy('cookies.functional.heading')}</h2>
                  <span
                    className={classNames({
                      [s.open]: true,
                      [s.close]: isFunctionalExpanded
                    })}
                    style={{ display: 'none' }}
                    onClick={() =>
                      setIsFunctionalExpanded(!isFunctionalExpanded)
                    }
                  >
                    +
                  </span>
                </div>
                {isFunctionalExpanded && (
                  <p className={s.containerText}>
                    {copy('cookies.functional.copy')}
                  </p>
                )}
              </div>
            </div>
          )}

          {!showInformation ? (
            <>
              <Button
                type={ButtonTypes.WHITE_BORDER}
                onClick={() => setShowInformation(true)}
              >
                {copy('cookies.moreinfo.CTA')}
              </Button>
              <Button
                type={ButtonTypes.BLACK}
                onClick={() => {
                  cookies.setAccepted('functional', true);
                  cookies.setShowPopup(false);
                }}
              >
                {copy('cookies.cta')}
              </Button>
            </>
          ) : (
            <>
              <Button
                type={ButtonTypes.BLACK}
                onClick={() => {
                  cookies.setAccepted('functional', true);
                  cookies.setShowPopup(false);
                }}
              >
                {copy('cookies.done.CTA')}
              </Button>
              <p
                className={s.viewPriacy}
                dangerouslySetInnerHTML={{
                  __html: copy('cookies.view.policy')
                }}
              />
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default Cookies;
