import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, IconButton, Grid, useTheme } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import './HomePage.css';
import { Hero, images, ImageWrapper, Indicator, IndicatorDot } from './constants';
import LoginForm from '../login/LoginForm';


const HomePage: React.FC = () => {
  const theme = useTheme(); // 使用主题上下文
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const cardsRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    const handleScroll = () => {
      if (cardsRef.current) {
        const rect = cardsRef.current.getBoundingClientRect();
        if (rect.top <= window.innerHeight) {
          setIsHovering(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <Grid
      container
      sx={{
        backgroundColor: theme.palette.background.default, // 使用主题背景色
        color: theme.palette.text.primary, // 使用主题文本颜色
        minHeight: '100vh',
      }}
    >
      {/* 左侧主页内容 */}
      <Grid item xs={12} md={8}>
        <Hero
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
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

          <IconButton
            onClick={handlePrev}
            sx={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              color: theme.palette.primary.main, // 使用主题的主色
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
      </Grid>

      {/* 右侧登录窗口 */}
      <Grid
        item
        xs={12}
        md={4}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.palette.background.paper, // 使用主题的纸张背景色
          boxShadow: theme.shadows[3],
        }}
      >
        <LoginForm />
      </Grid>
    </Grid>
  );
};

export default HomePage;
