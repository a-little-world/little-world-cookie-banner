export const cookieBannerCSS = `
.banner-img-container {
    width: 100%;
    height: fit-content;
    display: flex;
    justify-content: center;
    flex-direction: row;
    position: relative;
}

.banner-body h1 {
    width: 100%;
    padding-bottom: 10px;
    text-align: center;
}

.banner-body {

}

.banner-dynamic-break {
    position: relative;
    display: flex;
    flex-direction: column;
}

.banner-img-container img {
    width: 100px;
    height: 100px;
}

.banner-button-container {
    width: 100%;
}

.banner-small-container {
    width: 60%;
}

.clearfix:after {
    content: ".";
    display: block;
    clear: both;
    visibility: hidden;
    line-height: 0;
    height: 0;
}

.clearfix {
    display: inline-block;
}

html[xmlns] .clearfix {
    display: block;
}

* html .clearfix {
    height: 1%;
}

.banner-button-container .left {
    position: relative;
    float: left;
}

.banner-button-container .right {
    position: relative;
    float: right;
}

.banner-more-options {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
}

.banner-more-options a {
    color: blue;
    font-weight: bold;
}

.banner-body p {
    padding-bottom: 10px;
}

.banner-body ul {
    list-style-type: disc; 
    list-style-position: inside;
}


@media screen and (min-width: 685px) {
    .banner-img-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex-grow: 1;
        height: 100%;
        width: 300px;
    }
    .banner-body {
        flex-grow: 1;
    }
    .banner-img-container img {
        width: 300px;
        height: 300px;
    }

    .banner-dynamic-break {
        display: flex;
        flex-direction: row;
        height: fit-content;
    }

    .banner-body {
        padding-left: 10px;
        padding-right: 10px;
    }

    .banner-body h1 {
        width: 100%;
        text-align: left;
    }
    .banner-more-options {
        width: auto;
        padding-left: 10px;
    }

    .banner-extra-options-dyn-container {
        display: flex;
        flex-direction: row;
    }

    .banner-small-container {
        width: auto;
        display: flex;
        flex-direction: row;
    }

    .banner-small-container .right{
        padding-left: 10px;
    }

    .banner-spacer {
        flex-grow: 1;
    }

}

#cookie-root .overlay {
  z-index: 9;
}

#cookie-root button {
    font-size: 100%;
}

#cookie-root .link-button {
background-color: transparent; /* Green */
  border: none;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}

.cookieBannerHidden {
  position: absolute;
  padding: 5px;
  width: 60px;
  height: 60px;
  border-radius: 80px;
  background-color: transparent;
  background-repeat: no-repeat;
  background-size: contain;
  left: 0;
  bottom: 0;
}

@import url('https://fonts.googleapis.com/css2?family=Signika+Negative:wght@300;400;500;600;700&family=Work+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Work Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
}

body {
  margin: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
`;

export const overlayCSS = `
.floating-close-button{
  position: fixed;
  bottom: 0px;
  z-index: 10;
  left: 50%;
  transform: translate(-50%, 0%);
}

.overlay {
  display: flex;
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 10;
  backdrop-filter: blur(5px);
  transition: 1s;
  background: rgba(0, 0, 0, 0.3);
  overflow-y: scroll;
  padding-top: 4px;
  justify-content: center;
}

.overlay.hidden {
  backdrop-filter: blur(0);
  background: none;
  pointer-events: none;
}

.modal-header .title {
  color: #374151;
  font-size: 24px;
}

h3 {
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
}

.overlay-modal {
  margin: auto;
  padding: 24px;
  display: flex;
  background-color: white;
  flex-direction: column;
  border: 1px solid #e6e8ec;
  box-shadow: 1px 2px 5px rgb(0 0 0 / 7%);
  background: white;
  border-radius: 30px;
  box-sizing: border-box;
  padding: 20px;
  height: fit-content;
}

.av-setup-button-container {
  display: flex;
  flex-wrap: wrap;
}

.av-setup-confirm {
  margin-top: auto;
  min-width: min-content;
  border-radius: 100px;
  padding: 0px 20px;
  color: white;
  background: linear-gradient(43.07deg, #db590b -3.02%, #f39325 93.96%);
  line-height: 58px;
  text-align: center;
  flex-grow: 1;
  max-width: 200px;
  white-space: nowrap;
  margin-left: auto;
}

.av-setup-decline {
  margin-top: auto;
  min-width: min-content;
  border-radius: 100px;
  padding: 0px 20px;
  color: white;
  line-height: 58px;
  text-align: center;
  max-width: 200px;
  white-space: nowrap;
  color: #0063af;
  background-color: #ffffff;
  border: 2px solid #0063af;
}



.cookie-table table {
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
}

.cookie-table thead th:nth-child(1) {
  width: 30%;
}

.cookie-table thead th:nth-child(2) {
  width: 20%;
}

.cookie-table thead th:nth-child(3) {
  width: 15%;
}

.cookie-table th,
td {
  text-align: left;
}

.cookie-table table tr:nth-child(odd) {
  background-color: #ff33cc;
}

.cookie-table table tr:nth-child(even) {
  background-color: #e495e4;
}
`;

export const indexCSS = `
body {
  padding: 0;
  margin: 0;
  font-size: 16px;
  overflow-x: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}

button {
  cursor: pointer;
  padding: 0;
  background: none;
  border: none;
  font-size: 1rem;
}

`;