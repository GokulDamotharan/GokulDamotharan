import React from 'react';
import Lottie from 'lottie-react';

const LottieAnimation = ({ 
  animationData, 
  loop = true, 
  autoplay = true,
  style = {},
  className = ''
}) => {
  return (
    <div className={className} style={style}>
      <Lottie 
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
      />
    </div>
  );
};

export default LottieAnimation;
