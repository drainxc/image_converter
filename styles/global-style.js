import { createGlobalStyle } from "styled-components";
import { normalize } from "styled-normalize";
export const GlobalStyle = createGlobalStyle`
  ${normalize} 
  * {
     margin: 0;
     padding: 0;
     box-sizing: border-box;
  }

  html { 
     box-sizing: border-box;   
     font-size: 20px; 
     min-width: 320px;
  }

  a { cursor: pointer; text-decoration: none; }

  body {
     background-color: var(--dark-color);
     overflow: hidden;
     -webkit-user-select:none;
     -moz-user-select:none;
     -ms-user-select:none;
     user-select:none;
     padding: 0;
     margin: 0;
  }

  :root {
    --main-color: #2DFFDB;
    --sub-color: #D8FFED;
    --dark-color: #0C1020;
    --box-color: #1B2630;
  }
`;
