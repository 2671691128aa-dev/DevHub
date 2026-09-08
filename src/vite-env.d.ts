/// <reference types="vite/client" />

declare module 'react-syntax-highlighter/dist/esm/prism-light' {
  import SyntaxHighlighter from 'react-syntax-highlighter';
  export default SyntaxHighlighter;
}

declare module 'react-syntax-highlighter/dist/esm/languages/prism/*' {
  const language: any;
  export default language;
}

declare module 'react-syntax-highlighter/dist/esm/styles/prism/*' {
  const style: any;
  export default style;
}
