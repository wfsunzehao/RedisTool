import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, IconButton, Grid, Button, Container, Paper } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import './HomePage.css';
import { Hero, images, ImageWrapper, Indicator, IndicatorDot, services } from './constants';


const HomePage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
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
          setIsVisible(true);
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
    <div>
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
              onClick={() => setCurrentIndex(index)}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Indicator>
      </Hero>

      {/* 关于我们的区域 */}
      <Paper>
        <Box
        className="about-section"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
          About Us
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, fontSize: '1.1rem', lineHeight: 1.5 }}>
          We are committed to providing the best possible service
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, fontSize: '1.1rem', lineHeight: 1.5 }}>
          More professional
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, fontSize: '1.1rem', lineHeight: 1.5 }}>
          More accurate
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, fontSize: '1.1rem', lineHeight: 1.5 }}>
          More efficient
        </Typography>
      </Box>

      </Paper>
      


      {/* 卡片区域使用 Grid */}
      <Paper >
        <Container>
          <Box ref={cardsRef} className={`cards-section ${isVisible ? 'visible' : ''}`} sx={{ display: 'flex', justifyContent: 'center', my: 0 }}>
          <Grid container spacing={2} justifyContent="center">
            {services.map((service, index) => (
              <Grid item md={4} key={index}>
                <Box className="card" sx={{ textAlign: 'center', padding: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    {/* {service.icon} */}
                  </Box>
                  <Typography variant="h6">{service.title}</Typography>
                  <Typography variant="body2">{service.description}</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    href={service.link}
                    sx={{ mt: 2 }}
                  >
                    Learn More
                  </Button>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Paper>  
    </div>
  );
};

export default HomePage;
