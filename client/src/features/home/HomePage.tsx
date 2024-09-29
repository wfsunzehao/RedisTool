import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, AppBar, Toolbar, IconButton, Button } from '@mui/material';
import { styled } from '@mui/system';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Hero = styled(Box)({
  height: '70vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
});

const Overlay = styled(Box)<{ visible: boolean }>(({ visible }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: visible ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
  transition: 'background-color 0.3s ease',
}));

const images = [
  '../../../public/images/wicrecend.jpg',
  '../../../public/images/wicrecend2.jpg',
];

const ImageWrapper = styled(Box)<{ shift: number }>(({ shift }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  transition: 'transform 0.5s ease',
  transform: `translateX(${shift * 100}%)`,
}));

const Indicator = styled(Box)({
  position: 'absolute',
  bottom: 16,
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
});

const IndicatorDot = styled(Box)<{ active: boolean }>(({ active }) => ({
  width: 10,
  height: 10,
  borderRadius: '50%',
  backgroundColor: active ? '#fff' : 'rgba(255, 255, 255, 0.5)',
  margin: '0 5px',
}));

const HomePage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  // 自动轮转
  useEffect(() => {
    const interval = isHovering ? null : setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // 每3秒切换

    return () => clearInterval(interval);
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
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </ImageWrapper>

        <ImageWrapper shift={0}>
          <img
            src={images[currentIndex]}
            alt="Current"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </ImageWrapper>

        <ImageWrapper shift={1}>
          <img
            src={images[(currentIndex + 1) % images.length]}
            alt="Next"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
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
          <ArrowBackIcon fontSize="large" />
        </IconButton>

        {/* 右箭头 */}
        <IconButton
          onClick={handleNext}
          sx={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: '#fff' }}
        >
          <ArrowForwardIcon fontSize="large" />
        </IconButton>

        {/* 指示器 */}
        <Indicator>
          {images.map((_, index) => (
            <IndicatorDot key={index} active={index === currentIndex} />
          ))}
        </Indicator>
      </Hero>

      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          About us
        </Typography>
        <Typography variant="body1" paragraph>
        Redis team
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box p={2} border={1} borderRadius={8}>
              <Typography variant="h6">Feature 1</Typography>
              <Typography variant="body2">
                Description of feature 1 goes here. It's engaging and useful.
              </Typography>
              <Button variant="contained" color="primary">
                Learn More
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box p={2} border={1} borderRadius={8}>
              <Typography variant="h6">Feature 2</Typography>
              <Typography variant="body2">
                Description of feature 2 goes here. It's interactive and interesting.
              </Typography>
              <Button variant="contained" color="primary">
                Learn More
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box p={2} border={1} borderRadius={8}>
              <Typography variant="h6">Feature 3</Typography>
              <Typography variant="body2">
                Description of feature 3 goes here. It's designed to help users.
              </Typography>
              <Button variant="contained" color="primary">
                Learn More
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default HomePage;
