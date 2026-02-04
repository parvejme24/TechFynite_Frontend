"use client";
import React from "react";
import StarRatings from "react-star-ratings";

interface StarRatingProps {
  rating: number;
  changeRating?: (newRating: number) => void;
  size?: number;
  spacing?: number;
  starRatedColor?: string;
  starEmptyColor?: string;
  starHoverColor?: string;
  readOnly?: boolean;
  name?: string;
}

export default function StarRating({
  rating,
  changeRating,
  size = 20,
  spacing = 2,
  starRatedColor = "#FFD700",
  starEmptyColor = "#CCCCCC",
  starHoverColor = "#FFED4E",
  readOnly = false,
  name = "rating",
}: StarRatingProps) {
  return (
    <StarRatings
      rating={rating}
      changeRating={changeRating}
      numberOfStars={5}
      starRatedColor={starRatedColor}
      starEmptyColor={starEmptyColor}
      starHoverColor={starHoverColor}
      starDimension={`${size}px`}
      starSpacing={`${spacing}px`}
      name={name}
      readOnly={readOnly}
    />
  );
}
