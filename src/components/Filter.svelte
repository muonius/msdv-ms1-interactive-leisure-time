<svg>
  <filter id="watercolor-1">
    <!-- procedural textures -->
    <feTurbulence
      result="noise-lg"
      type="fractalNoise"
      baseFrequency=".04"
      NumOctaves="2"
      seed="8"
    />
    <!-- BaseGraphic w/ chroma variation -->
    <feComposite
      result="BaseGraphic"
      in="SourceGraphic"
      in2="noise-lg"
      operator="arithmetic"
      k1="0.2"
      k2="0.6"
      k4="0"
    />

    <!-- 2nd layer of paint w/more pigment -->
    <feDisplacementMap
      result="layer-2"
      in="BaseGraphic"
      in2="noise-lg"
      xChannelSelector="G"
      yChannelSelector="R"
      scale="6"
    />

    <!-- <feMorphology result="glow-diff" in="glow" operator="erode" radius="2" /> -->
    <!-- <feComposite result="glow" in="glow" in2="glow-diff" operator="out" /> -->
    <!-- <feGaussianBlur result="glow" in="glow" stdDeviation="0.6" /> -->
  </filter>

  <filter id="watercolor-2">
    <!-- procedural textures -->
    <feTurbulence
      result="noise-lg"
      type="fractalNoise"
      baseFrequency=".04"
      NumOctaves="2"
      seed="8"
    />
    <feTurbulence
      result="noise-md"
      type="fractalNoise"
      baseFrequency=".2"
      NumOctaves="3"
      seed="8"
    />

    <!-- BaseGraphic w/ chroma variation -->
    <feComposite
      result="BaseGraphic"
      in="SourceGraphic"
      in2="noise-lg"
      operator="arithmetic"
      k1="0.2"
      k2="0.6"
      k4="0"
    />

    <!-- 1st layer of paint w/more water -->
    <feMorphology
      result="layer-1"
      in="BaseGraphic"
      operator="dilate"
      radius="2"
    />
    <feDisplacementMap
      result="layer-1"
      in="layer-1"
      in2="noise-lg"
      xChannelSelector="R"
      yChannelSelector="B"
      scale="2"
    />
    <feDisplacementMap
      result="layer-1"
      in="layer-1"
      in2="noise-md"
      xChannelSelector="R"
      yChannelSelector="B"
      scale="4"
    />
    <feDisplacementMap
      result="mask"
      in="layer-1"
      in2="noise-lg"
      xChannelSelector="A"
      yChannelSelector="A"
      scale="6"
    />
    <feGaussianBlur result="mask" in="mask" stdDeviation="1" />
    <feComposite
      result="layer-1"
      in="layer-1"
      in2="mask"
      operator="arithmetic"
      k1="0.1"
      k2="-.25"
      k3="-.25"
      k4="0"
    />

    <!-- 2nd layer of paint w/more pigment -->
    <feDisplacementMap
      result="layer-2"
      in="BaseGraphic"
      in2="noise-lg"
      xChannelSelector="G"
      yChannelSelector="R"
      scale="4"
    />
    <feDisplacementMap
      result="layer-2"
      in="layer-2"
      in2="noise-md"
      xChannelSelector="A"
      yChannelSelector="G"
      scale="2"
    />
    <feDisplacementMap
      result="glow"
      in="BaseGraphic"
      in2="noise-lg"
      xChannelSelector="R"
      yChannelSelector="A"
      scale="8"
    />
    <feMorphology result="glow-diff" in="glow" operator="erode" radius="1" />
    <feComposite result="glow" in="glow" in2="glow-diff" operator="out" />
    <feGaussianBlur result="glow" in="glow" stdDeviation="1.6" />
    <feComposite
      result="layer-2"
      in="layer-2"
      in2="glow"
      operator="arithmetic"
      k1="1.5"
      k2="0"
      k3=".3"
    />
    <!-- k1="-.1" k2="1" k3="-.6" />-->

    <!-- merge 'em all (like multiply) -->
    <feComposite
      in="layer-1"
      in2="layer-2"
      operator="arithmetic"
      k1="-0.8"
      k2="0.8"
      k3="1.4"
    />
  </filter>

  <filter id="watercolor-3">
    <feTurbulence baseFrequency="0.05" />
    <feDisplacementMap in="SourceGraphic" scale="2" />
  </filter>
</svg>
