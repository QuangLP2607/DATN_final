import { useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import img1 from "@/assets/loginSlide/slide1.png";
import img2 from "@/assets/loginSlide/slide2.png";
import img3 from "@/assets/loginSlide/slide3.png";
import styles from "./LeftSlide.module.scss";

const cx = classNames.bind(styles);

interface Slide {
  image: string;
  jp: string;
  vn: string;
}

const slides: Slide[] = [
  {
    image: img1,
    jp: "毎日少しずつ、夢に近づく。",
    vn: "Mỗi ngày một chút, tiến gần tới ước mơ.",
  },
  {
    image: img2,
    jp: "学問に王道なし。",
    vn: "Không có con đường tắt trong học tập.",
  },
  {
    image: img3,
    jp: "千里の道も一歩から。",
    vn: "Đường ngàn dặm cũng bắt đầu từ một bước.",
  },
];

export default function LeftSlide() {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      const next = (current + 1) % slides.length;
      setCurrent(next);
      containerRef.current?.scrollTo({
        left: next * (containerRef.current.offsetWidth ?? 0),
        behavior: "smooth",
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [current]);

  // Sync dots khi vuốt/scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const slideWidth = container.offsetWidth;
      const index = Math.round(container.scrollLeft / slideWidth);
      setCurrent(index);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const goToSlide = (index: number) => {
    setCurrent(index);
    containerRef.current?.scrollTo({
      left: index * (containerRef.current?.offsetWidth ?? 0),
      behavior: "smooth",
    });
  };

  return (
    <div className={cx("slide")}>
      <div className={cx("slide__container")} ref={containerRef}>
        {slides.map((slide, i) => (
          <div className={cx("slide__item")} key={i}>
            <div className={cx("slide__image-wrapper")}>
              <img
                className={cx("slide__image")}
                src={slide.image}
                alt={`Slide ${i + 1}`}
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
              />
            </div>
            <h1 className={cx("slide__title")}>
              <span className={cx("slide__title-jp")}>{slide.jp}</span>
              <span className={cx("slide__title-sub")}>{slide.vn}</span>
            </h1>
          </div>
        ))}
      </div>

      <ul className={cx("slide__dots")}>
        {slides.map((_, i) => (
          <li key={i} className={cx("slide__dots-item")}>
            <button
              className={cx("slide__dots-btn", { active: i === current })}
              onClick={() => goToSlide(i)}
              aria-label={`Slide ${i + 1}`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
