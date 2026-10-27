# trade-frontend
Taro + React frontend for fresh food WeChat mini-program

## Overview
This is a WeChat mini-program frontend built with Taro and React, matching the `trade-backend` fresh food trading backend.
It implements shopping cart, product detail, order settlement and other e-commerce interaction logic. The screenshot shows a draggable floating shopping cart component.

## Core Features
- Draggable floating cart button (touch drag, click jump to cart page)
- Local storage for cart data
- Cart quantity statistics
- Product detail page
- Mini-program page routing & navigation
- Responsive layout adapting to phone status bar

## Tech Stack
- Taro
- React
- TypeScript
- CSS Modules / SCSS
- Taro Storage API
- WeChat Mini Program runtime

## Design Note
The floating cart component uses native touch events to implement drag logic.
Cart data is persisted locally for offline user experience.
This frontend works with the corresponding `trade-backend` service to complete the whole fresh food shopping process.

## Related Repository
Backend: [trade-backend](https://github.com/yourname/trade-backend)
