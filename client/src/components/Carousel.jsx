import React from "react";
import { Carousel } from "antd";
// const contentStyle = {
//   margin: 0,
//   height: "160px",
//   color: "#fff",
//   lineHeight: "160px",
//   textAlign: "center",
//   background: "#364d79",
// };
const CarouselUI = () => (
  <>
    <Carousel effect="fade" autoplay arrows infinite={false} className="p-1">
      <div className="">
        <img
          src="https://wallpapers.com/images/featured/hdb30wtkjbn08xlf.jpg"
          alt=""
          srcset=""
          className="h-60 w-full object-cover rounded-lg"
        />
      </div>
      <div>
        <img
          src="https://wallpapers.com/images/featured/hdb30wtkjbn08xlf.jpg"
          alt=""
          srcset=""
          className="h-60 w-full object-cover rounded-lg"
        />
      </div>
    </Carousel>
  </>
);
export default CarouselUI;
