import { useContext, useState } from 'react';
import { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import Button, { ButtonTypes } from '@components/Button';
import s from './PageStartCarousel.module.scss';
import { PageContext } from './Page';

import map from '../assets/img/map.jpg';
import building from '../assets/img/building.jpg';
import { ReactComponent as Arrow } from '../assets/img/arrow.svg';

const data = [
  { title: 'carousel.heading.1', image: map },
  { title: 'carousel.heading.2', image: building }
];

type CarouselProps = {
  goBack: () => void;
  start: () => void;
};

const PageStartCarousel = ({ goBack, start }: CarouselProps) => {
  const { copy } = useContext(PageContext);
  const [index, setIndex] = useState(0);

  return (
    <div className={s.wrap}>
      <span className={s.goBack} onClick={goBack}>
        <Arrow />
      </span>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={false}
        pagination={{ clickable: true }}
        onSlideChange={swiper => {
          setIndex(swiper.activeIndex);
        }}
        className={s.container}
      >
        {data.map((item, index) => (
          <SwiperSlide key={index}>
            <div className={s.slide}>
              <div className={s.contentImg}>
                <Image src={item.image} fill objectFit="cover" alt="" />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <section className={s.content}>
        <div className={s.titleContainer}>
          <span className={s.title}>{index + 1}.</span>
          <span className={s.title}>{copy(data[index].title)}</span>
        </div>
        <span className={s.direction}>
          <Link
            href="https://goo.gl/maps/8gGTyRL5o8xCwhpy7"
            target="_blank"
            rel="noopener"
          >
            <Button type={ButtonTypes.WHITE_BORDER}>
              {copy('carousel.cta.directions')}
            </Button>
          </Link>
        </span>
        <Button onClick={start} type={ButtonTypes.BLACK}>
          {copy('carousel.cta.start')}
        </Button>
      </section>
    </div>
  );
};

export default PageStartCarousel;
