import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, AppBar, Toolbar, IconButton, Button } from '@mui/material';
import { styled } from '@mui/system';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import './HomePage.css'
import { Hero, images, ImageWrapper, Indicator, IndicatorDot } from './constants';

const HomePage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  // 自动轮转
  useEffect(() => {
    const interval = isHovering ? null : setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // 每3秒切换

    return () => {
      if (interval!=null) {
        clearInterval(interval)
      }};
  }, [isHovering]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div>
      <Hero
        onMouseEnter={() => {
          setOverlayVisible(false);
          setIsHovering(true);
        }}
        onMouseLeave={() => {
          setOverlayVisible(true);
          setIsHovering(false);
        }}
      >
        <ImageWrapper shift={-1}>
          <img
            src={images[(currentIndex - 1 + images.length) % images.length]}
            alt="Previous"
            className="image"
          />
        </ImageWrapper>

        <ImageWrapper shift={0}>
          <img
            src={images[currentIndex]}
            alt="Current"
            className="image"
          />
        </ImageWrapper>

        <ImageWrapper shift={1}>
          <img
            src={images[(currentIndex + 1) % images.length]}
            alt="Next"
            className="image"
          />
        </ImageWrapper>

        {/* <Overlay visible={overlayVisible} />
        <Typography variant="h3" align="center" sx={{ color: '#fff', position: 'relative', zIndex: 1 }}>
          Welcome to My Website
        </Typography> */}

        {/* 左箭头 */}
        <IconButton
          onClick={handlePrev}
          sx={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#fff' }}
        >
          <ArrowBackIosIcon fontSize="large" />
        </IconButton>

        {/* 右箭头 */}
        <IconButton
          onClick={handleNext}
          sx={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: '#fff' }}
        >
          <ArrowForwardIosIcon fontSize="large" />
        </IconButton>

        {/* 指示器 */}
        <Indicator>
          {images.map((_, index) => (
            <IndicatorDot
               key={index}
                active={index === currentIndex}
                onClick={() => setCurrentIndex(index)} // 点击指示器时切换图片
                sx={{ cursor: 'pointer' }} // 鼠标悬停时显示手形光标
             />
          ))}
        </Indicator>
      </Hero>

    </div>
  );
};

export default HomePage;
