import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, useTheme } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import './HomePage.css';
import { Hero, images, ImageWrapper, Indicator, IndicatorDot } from './constants';
import LoginForm from '../login/LoginForm';

const HomePage: React.FC = () => {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const interval = isHovering ? null : setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => {
      if (interval != null) {
        clearInterval(interval);
      }
    };
  }, [isHovering]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '90vh',
        overflow: 'hidden', // 裁剪内容
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      {/* 图片轮播区域 */}
      <Hero
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        sx={{
          position: 'relative',
        }}
      >
        {/* LoginForm 组件 */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '80%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10, // 确保 LoginForm 显示在图片上方
          }}
        >
          <LoginForm />
        </Box>

        {/* 图片轮播 */}
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

        {/* 导航箭头 */}
        <IconButton
          onClick={handlePrev}
          sx={{
            position: 'absolute',
            left: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            color: theme.palette.primary.main,
          }}
        >
          <ArrowBackIosIcon fontSize="large" />
        </IconButton>

        <IconButton
          onClick={handleNext}
          sx={{
            position: 'absolute',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            color: theme.palette.primary.main,
          }}
        >
          <ArrowForwardIosIcon fontSize="large" />
        </IconButton>

        {/* 指示点 */}
        <Indicator>
          {images.map((_, index) => (
            <IndicatorDot
              key={index}
              active={index === currentIndex}
              onClick={() => setCurrentIndex(index)}
              sx={{
                cursor: 'pointer',
                backgroundColor: index === currentIndex
                  ? theme.palette.primary.main
                  : theme.palette.grey[500],
              }}
            />
          ))}
        </Indicator>
      </Hero>
    </Box>
  );
};

export default HomePage;
