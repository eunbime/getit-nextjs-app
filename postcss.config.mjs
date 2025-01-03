/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    // 자동 벤더 프리픽스 추가
    autoprefixer: {
      flexbox: "no-2009", // 2009 이전 버전의 flexbox 사용 금지
      grid: "autoplace", // 자동 플레이스 그리드 사용
    },

    // 최신 CSS 기능 지원
    "postcss-preset-env": {
      stage: 3, // W3C 프로세스의 stage 3 기능까지 지원
      features: {
        "custom-properties": false, // CSS 커스텀 속성 비활성화
      },
    },
  },
};

export default config;
