'use client';
import React, { useState } from 'react';
import './serp_callout.css';

const SerpCallout = () => {
    return (  
      <a href="https://serpapi.com/">
        <img id = "serp_callout" src="/serp_api.png" alt = "Powered by SerpAPI" href = "https://serpapi.com/"/>  
      </a>
    );
};

export default SerpCallout;
