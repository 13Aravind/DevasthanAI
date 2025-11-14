import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button, Stack, Fade, keyframes } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const templeImages = [
  'https://static.toiimg.com/photo/msid-46918897,width-96,height-65.cms',
  'https://www.indiantempletour.com/wp-content/uploads/2023/05/Somanath_mandir-scaled.jpg',
  'https://cdn.getyourguide.com/image/format=auto,fit=crop,gravity=auto,quality=60,width=620,height=400,dpr=2/tour_img/c27a477d652bce2e.jpeg',
  'https://www.wallpaperuse.com/wallp/65-658795_m.jpg',
];

// Floating gentle up-down animation for emoji
const floating = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
`;

// Shine animation for heading text
const shine = keyframes`
  0% {
    background-position: -200%;
  }
  100% {
    background-position: 200%;
  }
`;

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const sliderRef = useRef<any>(null);
  const [offsetY, setOffsetY] = useState(0);

  // Parallax scroll effect for background blur container
  useEffect(() => {
    const handleScroll = () => setOffsetY(window.pageYOffset);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 4000,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: 'linear',
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: false,
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', fontFamily: "'Merriweather', serif" }}>
      {/* Parallax Background Slider */}
      <Box
        ref={sliderRef}
        sx={{
          position: 'fixed',
          top: -offsetY * 0.3,   // parallax effect
          left: 0,
          width: '100%',
          height: '110vh',
          filter: 'brightness(0.55) blur(2px)',
          zIndex: 0,
          pointerEvents: 'none', // disable interaction
          userSelect: 'none',
          transition: 'top 0.1s ease-out',
          '& .slick-slider, & .slick-list, & .slick-track, & .slick-slide > div': { height: '110vh' },
        }}
      >
        {/* @ts-ignore */}
        <Slider {...sliderSettings}>
          {templeImages.map((img, i) => (
            <Box key={i} sx={{ height: '110vh' }}>
              <Box
                component="img"
                src={img}
                alt={`Temple ${i + 1}`}
                sx={{
                  width: '100%',
                  height: '110vh',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </Box>
          ))}
        </Slider>
      </Box>

      {/* Overlay - glassmorphic effect */}
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(20, 33, 78, 0.35)', // indigo glass tone
          zIndex: 1,
        }}
      />

      {/* Content container */}
      <Box
        sx={{
          position: 'relative',
          minHeight: '100vh',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 2, sm: 3 },
          textAlign: 'center',
          color: '#fffde7',
          maxWidth: 960,
          mx: 'auto',
          mb: 6,
        }}
      >

        {/* Header with shine effect and floating emoji */}
        <Box
          sx={{
            mb: 6,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              letterSpacing: 6,
              background: 'linear-gradient(90deg, #FFC966, #FF9933, #FFC966)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: `${shine} 3.5s linear infinite`,
              userSelect: 'none',
            }}
          >
            DevasthanAI
          </Typography>
          <Box
            sx={{
              fontSize: { xs: 54, sm: 72 },
              animation: `${floating} 4s ease-in-out infinite`,
              userSelect: 'none',
              lineHeight: 1,
            }}
          >
            🛕
          </Box>
        </Box>

        {/* Login buttons with glow */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} justifyContent="center" mb={8} width="100%" maxWidth={500}>
          <Button
            variant="outlined"
            onClick={() => navigate('/admin/dashboard')}
            sx={{
              color: '#FFC966',
              borderColor: '#FFC966',
              fontWeight: 600,
              borderWidth: 1.8,
              px: 5,
              py: 1.5,
              fontSize: '1.2rem',
              textTransform: 'capitalize',
              transition: 'all 0.3s ease',
              boxShadow: '0 0 6px #FFC966',
              '&:hover': {
                bgcolor: '#FFC966',
                borderColor: '#FFC966',
                color: '#1a237e',
                boxShadow: '0 0 20px #FFC966',
                transform: 'scale(1.1)',
              },
              width: '100%',
              maxWidth: 230,
            }}
          >
            Admin Login
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/pilgrim/dashboard')}
            sx={{
              bgcolor: '#FFC966',
              color: '#1a237e',
              fontWeight: 700,
              px: 6,
              py: 1.5,
              fontSize: '1.2rem',
              textTransform: 'capitalize',
              boxShadow: '0 0 8px #FFC966',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: '#FF9933',
                boxShadow: '0 0 25px #FF9933',
                transform: 'scale(1.1)',
              },
              width: '100%',
              maxWidth: 230,
            }}
          >
            Pilgrim Login
          </Button>
        </Stack>

        {/* Description with glass panel */}
        <Box
          sx={{
            bgcolor: 'rgba(26,35,126,0.7)',
            borderRadius: 4,
            px: { xs: 3, md: 8 },
            py: 5,
            maxWidth: 720,
            boxShadow: '0 0 30px rgba(255,153,51,0.9)',
            userSelect: 'none',
          }}
        >
          <Fade in timeout={2000}>
            <Typography
              variant="h4"
              component="h3"
              sx={{
                fontWeight: 600,
                letterSpacing: 2,
                color: '#fffde7',
                textShadow: '3px 3px 14px rgba(0,0,0,0.9)',
                mb: 4,
              }}
            >
              Divine Insight, Modern Management
            </Typography>
          </Fade>
          <Fade in timeout={3000}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 400,
                fontStyle: 'italic',
                color: '#fffde7',
                textShadow: '2px 2px 10px rgba(0,0,0,0.7)',
                mb: 6,
              }}
            >
              Leveraging advanced AI technologies to elevate spiritual experiences, safeguard devotees, and optimize temple operations for reverent harmony and seamless journeys.
            </Typography>
          </Fade>

          <Fade in timeout={3600}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                color: '#ffc107',
                letterSpacing: 3,
                textShadow: '1px 1px 9px rgba(0,0,0,0.9)',
              }}
            >
              Presented with devotion
            </Typography>
          </Fade>
          <Fade in timeout={3800}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                color: '#ffc107',
                letterSpacing: 4,
                textShadow: '1px 1px 9px rgba(0,0,0,0.9)',
                mt: 1,
              }}
            >
              Team SudarshanX
            </Typography>
          </Fade>
        </Box>
      </Box>
    </Box>
  );
};

export default LandingPage;
