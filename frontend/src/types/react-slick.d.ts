import React from 'react';
import Slider from 'react-slick';

declare module 'react-slick' {
  interface Settings {
    responsive?: {
      breakpoint: number;
      settings: Partial<Settings>;
    }[];
  }

  export default class Slider extends React.Component<Settings> {}
}