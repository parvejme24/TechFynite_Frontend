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
  // react-star-ratings doesn't have a readOnly prop
  // It becomes read-only when changeRating is not provided
  const starRatingProps: any = {
    rating,
    numberOfStars: 5,
    starRatedColor,
    starEmptyColor,
    starHoverColor,
    starDimension: `${size}px`,
    starSpacing: `${spacing}px`,
    name,
  };

  // Only add changeRating if not read-only and changeRating is provided
  if (!readOnly && changeRating) {
    starRatingProps.changeRating = changeRating;
  }

  return <StarRatings {...starRatingProps} />;
}
