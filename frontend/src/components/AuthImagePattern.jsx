import React from "react";
import Lottie from "lottie-react";
import animationData from "../../../frontend/public/animation.json"; // Ensure the path is correct

const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center">
        {/* Single Lottie Animation */}
        <div className="aspect-square rounded-2xl bg-primary/10 mb-8 flex items-center justify-center">
          <Lottie
            animationData={animationData}
            loop={true}  // If you want the animation to loop
            className="w-full h-full"
          />
        </div>

        {/* Title and Subtitle */}
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
