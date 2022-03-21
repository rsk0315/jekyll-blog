function generateThumbnailLink(renderMathInElement: Function) {
    Array.from(document.querySelectorAll('a.thumbnail')).forEach(e => {
        let pageTitle = e.getAttribute('data-page-title');
        let siteTitle = e.getAttribute('data-site-title');
        e.addEventListener('click', ev => {
            generateThumbnail(pageTitle, siteTitle, renderMathInElement);
            ev.preventDefault();
        });
    });
}

const GH_PAGES_LOGO = `
M98.955,23.733h-2.081V0.78h7.009c5.723,0,7.682,3.305,7.682,6.886s-1.959,6.886-7.682,6.886h-4.927V23.733z
M98.955,12.624h5.203c4.315,0,5.141-2.755,5.141-4.958s-0.827-4.958-5.141-4.958h-5.203V12.624z M119.193,10.023
c-2.05,0-3.397,0.367-4.591,0.765V8.951c1.347-0.581,3.122-0.826,4.591-0.826c4.591,0,5.785,2.081,5.785,5.141v10.466h-1.194
l-0.459-1.224c-1.377,1.01-3.091,1.53-4.621,1.53c-4.009,0-5.356-2.357-5.356-4.928c0-2.601,1.439-4.529,5.448-4.774l4.04-0.245
v-0.857C122.835,11.002,122.04,10.023,119.193,10.023z M118.642,15.991c-2.173,0.214-3.122,1.347-3.122,3.121
c0,1.377,0.337,3.03,3.244,3.03c1.653,0,2.754-0.46,4.07-1.224v-5.325L118.642,15.991z M131.71,19.449
c-0.337,0.336-0.582,0.765-0.582,1.132c0,0.765,0.367,1.102,1.163,1.193l5.203,0.612c2.877,0.306,4.193,1.439,4.193,4.101
c0,3.734-3.734,5.203-7.957,5.203c-4.285,0-6.855-1.255-6.855-4.621c0-2.081,1.439-3.459,3.153-4.04v-0.031
c-0.582-0.398-0.979-1.01-0.979-2.02c0-0.856,0.52-1.56,1.163-2.081c-1.836-1.01-2.448-2.877-2.448-5.019
c0-3.152,1.346-5.754,5.968-5.754c0.949,0,1.745,0.122,2.449,0.306h5.203v1.163l-2.571,0.735c0.643,0.979,0.887,2.203,0.887,3.55
c0,3.153-1.347,5.754-5.968,5.754C132.965,19.633,132.291,19.571,131.71,19.449z M132.597,23.58c-2.02,0.46-3.734,1.408-3.734,3.367
c0,2.265,1.714,2.908,4.866,2.908c3.061,0,5.937-0.765,5.937-3.367c0-1.561-0.735-2.173-2.601-2.388L132.597,23.58z M137.708,13.879
c0-2.02-0.398-3.887-3.979-3.887s-3.978,1.867-3.978,3.887s0.398,3.886,3.978,3.886S137.708,15.899,137.708,13.879z M149.206,8.125
c5.203,0,5.815,3.55,5.815,7.957v0.979h-10.1c0.123,2.662,0.827,5.081,4.285,5.081c2.203,0,3.55-0.214,5.05-0.857v1.836
c-1.714,0.765-3.55,0.918-5.05,0.918c-5.172,0-6.427-3.55-6.427-7.957S144.033,8.125,149.206,8.125z M144.921,15.317h7.957
c0-2.724-0.153-5.295-3.673-5.295C145.655,10.023,145.013,12.563,144.921,15.317z M163.191,14.95
c4.346,0.398,5.387,1.867,5.387,4.376c0,2.356-1.5,4.713-6.151,4.713c-1.469,0-3.581-0.368-4.56-0.765v-1.836
c0.949,0.336,2.418,0.704,4.591,0.704c3.183,0,4.04-1.347,4.04-2.785c0-1.408-0.429-2.387-3.458-2.632
c-4.438-0.398-5.356-1.959-5.356-4.07c0-2.173,1.408-4.529,5.723-4.529c1.438,0,3.06,0.183,4.407,0.765v1.837
c-1.193-0.398-2.387-0.704-4.438-0.704c-3.03,0-3.673,1.133-3.673,2.632C159.703,14.001,160.253,14.705,163.191,14.95z
M17.184,10.327H9.687c-0.194,0-0.35,0.157-0.35,0.35v3.666c0,0.193,0.157,0.35,0.35,0.35h2.925v4.555c0,0-0.657,0.223-2.472,0.223
c-2.142,0-5.134-0.783-5.134-7.362c0-6.582,3.116-7.447,6.041-7.447c2.532,0,3.623,0.446,4.317,0.66
c0.218,0.067,0.42-0.15,0.42-0.344l0.837-3.541c0-0.09-0.031-0.199-0.134-0.274C16.204,0.963,14.484,0,10.139,0
C5.134,0,0,2.129,0,12.366c0,10.241,5.878,11.766,10.832,11.766c4.102,0,6.589-1.752,6.589-1.752c0.102-0.057,0.114-0.2,0.114-0.265
V10.678C17.535,10.484,17.378,10.327,17.184,10.327z M56.129,1.226c0-0.195-0.155-0.352-0.349-0.352h-4.221
c-0.193,0-0.349,0.157-0.349,0.352c0,0.001,0.001,8.158,0.001,8.158h-6.58V1.226c0-0.195-0.156-0.352-0.349-0.352h-4.221
c-0.192,0-0.349,0.157-0.349,0.352v22.095c0,0.194,0.157,0.353,0.349,0.353h4.221c0.193,0,0.349-0.158,0.349-0.353v-9.453h6.58
c0,0-0.012,9.452-0.012,9.453c0,0.194,0.157,0.353,0.349,0.353h4.232c0.193,0,0.348-0.158,0.349-0.353V1.226z M25.303,4.125
c0-1.52-1.218-2.748-2.722-2.748c-1.502,0-2.722,1.228-2.722,2.748c0,1.519,1.22,2.751,2.722,2.751
C24.085,6.876,25.303,5.644,25.303,4.125z M25.002,18.657c0-0.566,0-10.197,0-10.197c0-0.194-0.156-0.352-0.349-0.352h-4.208
c-0.192,0-0.365,0.199-0.365,0.393c0,0,0,12.27,0,14.613c0,0.429,0.268,0.556,0.614,0.556c0,0,1.796,0,3.792,0
c0.416,0,0.518-0.203,0.518-0.564C25.002,22.323,25.002,19.252,25.002,18.657z M72.511,8.141h-4.189
c-0.192,0-0.349,0.158-0.349,0.353v10.831c0,0-1.064,0.779-2.575,0.779c-1.511,0-1.911-0.685-1.911-2.165c0-1.48,0-9.444,0-9.444
c0-0.195-0.156-0.353-0.349-0.353h-4.251c-0.192,0-0.349,0.158-0.349,0.353c0,0,0,5.768,0,10.16c0,4.397,2.448,5.472,5.816,5.472
c2.763,0,4.991-1.526,4.991-1.526s0.106,0.804,0.154,0.9c0.048,0.096,0.173,0.19,0.309,0.19l2.705-0.012
c0.192,0,0.349-0.157,0.349-0.351L72.86,8.495C72.86,8.3,72.704,8.141,72.511,8.141z M84.19,7.645c-2.379,0-3.997,1.061-3.997,1.061
v-7.48c0-0.195-0.156-0.352-0.348-0.352h-4.233c-0.193,0-0.349,0.157-0.349,0.352v22.095c0,0.194,0.156,0.353,0.349,0.353
c0,0,2.937,0,2.937,0c0.132,0,0.232-0.069,0.306-0.188c0.073-0.118,0.178-1.018,0.178-1.018s1.732,1.64,5.009,1.64
c3.847,0,6.053-1.952,6.053-8.764C90.094,8.535,86.571,7.645,84.19,7.645z M82.538,20.091c-1.453-0.045-2.438-0.704-2.438-0.704
v-6.995c0,0,0.971-0.596,2.165-0.702c1.509-0.135,2.962,0.321,2.962,3.919C85.227,19.404,84.571,20.152,82.538,20.091z
M37.058,8.106h-3.166c0,0-0.005-4.183-0.005-4.184c0-0.158-0.081-0.238-0.265-0.238h-4.315c-0.168,0-0.258,0.074-0.258,0.235v4.322
c0,0-2.162,0.522-2.309,0.564c-0.145,0.043-0.253,0.177-0.253,0.337v2.716c0,0.195,0.156,0.353,0.349,0.353h2.212
c0,0,0,2.841,0,6.535c0,4.858,3.404,5.335,5.702,5.335c1.05,0,2.305-0.338,2.513-0.414c0.125-0.045,0.198-0.175,0.198-0.317
l0.004-2.991c0-0.195-0.164-0.353-0.35-0.353c-0.184,0-0.657,0.076-1.142,0.076c-1.556,0-2.082-0.723-2.082-1.66
c0-0.935-0.001-6.211-0.001-6.211h3.167c0.193,0,0.349-0.158,0.349-0.353V8.458C37.407,8.263,37.25,8.106,37.058,8.106z
`;

const GITHUB_LOGO_1 = `
m 0,0 c -33.347,0 -60.388,-27.035 -60.388,-60.388 0,-26.68 17.303,-49.316 41.297,-57.301 3.018,-0.559 4.126,1.31 4.126,2.905 0,1.439 -0.056,6.197 -0.082,11.243 -16.8,-3.653 -20.345,7.125 -20.345,7.125 -2.747,6.979 -6.705,8.836 -6.705,8.836 -5.479,3.748 0.413,3.671 0.413,3.671 6.064,-0.426 9.257,-6.224 9.257,-6.224 5.386,-9.231 14.127,-6.562 17.573,-5.019 0.543,3.902 2.107,6.567 3.834,8.075 -13.413,1.526 -27.513,6.705 -27.513,29.844 0,6.592 2.359,11.98 6.222,16.209 -0.627,1.521 -2.694,7.663 0.586,15.981 0,0 5.071,1.622 16.61,-6.191 4.817,1.338 9.983,2.009 15.115,2.033 5.132,-0.024 10.302,-0.695 15.128,-2.033 11.526,7.813 16.59,6.191 16.59,6.191 3.287,-8.318 1.22,-14.46 0.593,-15.981 3.872,-4.229 6.214,-9.617 6.214,-16.209 0,-23.195 -14.127,-28.301 -27.574,-29.796 2.166,-1.874 4.096,-5.549 4.096,-11.183 0,-8.08 -0.069,-14.583 -0.069,-16.572 0,-1.608 1.086,-3.49 4.147,-2.898 23.982,7.994 41.263,30.622 41.263,57.294 C 60.388,-27.035 33.351,0 0,0
`;
const GITHUB_LOGO_2 = `
m 0,0 c -0.133,-0.301 -0.605,-0.391 -1.035,-0.185 -0.439,0.198 -0.684,0.607 -0.542,0.908 0.13,0.308 0.602,0.394 1.04,0.188 C -0.099,0.714 0.151,0.301 0,0
`;
const GITHUB_LOGO_3 = `
M 0,0 C -0.288,-0.267 -0.852,-0.143 -1.233,0.279 -1.629,0.7 -1.702,1.264 -1.41,1.534 -1.113,1.801 -0.567,1.676 -0.172,1.255 0.224,0.829 0.301,0.271 0,0
`;
const GITHUB_LOGO_4 = `
M 0,0 C -0.37,-0.258 -0.976,-0.017 -1.35,0.52 -1.72,1.058 -1.72,1.702 -1.341,1.96 -0.967,2.218 -0.37,1.985 0.009,1.453 0.378,0.907 0.378,0.263 0,0
`;
const GITHUB_LOGO_5 = `
M 0,0 C -0.331,-0.365 -1.036,-0.267 -1.552,0.232 -2.08,0.718 -2.227,1.409 -1.896,1.774 -1.56,2.14 -0.851,2.037 -0.331,1.543 0.193,1.057 0.352,0.361 0,0
`;
const GITHUB_LOGO_6 = `
m 0,0 c -0.147,-0.473 -0.825,-0.687 -1.509,-0.486 -0.683,0.207 -1.13,0.76 -0.992,1.238 0.142,0.476 0.824,0.7 1.513,0.485 C -0.306,1.031 0.142,0.481 0,0
`;
const GITHUB_LOGO_7 = `
m 0,0 c 0.017,-0.498 -0.563,-0.911 -1.281,-0.92 -0.722,-0.016 -1.307,0.387 -1.315,0.877 0,0.503 0.568,0.911 1.289,0.924 C -0.589,0.895 0,0.494 0,0
`;
const GITHUB_LOGO_8 = `
m 0,0 c 0.086,-0.485 -0.413,-0.984 -1.126,-1.117 -0.701,-0.129 -1.35,0.172 -1.439,0.653 -0.087,0.498 0.42,0.997 1.121,1.126 C -0.73,0.786 -0.091,0.494 0,0
`;

function generateThumbnail(pageTitle: string, siteTitle: string, renderMathInElement: Function) {
    let [width, height] = [1200, 630];

    let html = `
<!DOCTYPE html>
<html>
  <head>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.min.css" integrity="sha384-R4558gYOUz8mP9YWpZJjofhk+zx0AS11p36HnD2ZKj/6JR5z27gSSULCNHIRReVs" crossorigin="anonymous">

<!-- The loading of KaTeX is deferred to speed up page rendering -->
<script src="https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.min.js" integrity="sha384-z1fJDqw8ZApjGO3/unPWUPsIymfsJmyrDVWC8Tv/a1HeOtGmkwNd/7xUS0Xcnvsx" crossorigin="anonymous"></script>

<!-- To automatically render math in text elements, include the auto-render extension: -->
<script src="https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/contrib/auto-render.min.js" integrity="sha384-+XBljXPPiv+OzfbB3cVmLHf4hdUFHlWNZN5spNQ7rmHTXpd7WvJum6fIACpNNfIR" crossorigin="anonymous"></script>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.css" integrity="sha384-WsHMgfkABRyG494OmuiNmkAOk8nhO1qE+Y6wns6v+EoNoTNxrWxYpl5ZYWFOLPCM" crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.js" integrity="sha384-lhN3C1JSmmvbT89RGOy6nC8qFBS8X/PLsBWIqiNdD4WGNsYOWpS2Il0x4TBrK8E2" crossorigin="anonymous"></script>

<script>
  window.WebFontConfig = {
      custom: {
          families: ['KaTeX_AMS', 'KaTeX_Caligraphic:n4,n7', 'KaTeX_Fraktur:n4,n7',
                     'KaTeX_Main:n4,n7,i4,i7', 'KaTeX_Math:i4,i7', 'KaTeX_Script',
                     'KaTeX_SansSerif:n4,n7,i4', 'KaTeX_Size1', 'KaTeX_Size2', 'KaTeX_Size3',
                     'KaTeX_Size4', 'KaTeX_Typewriter'],
      },
  };
</script>
<script src="https://cdn.jsdelivr.net/npm/webfontloader@1.6.28/webfontloader.js" integrity="sha256-4O4pS1SH31ZqrSO2A/2QJTVjTPqVe+jnYgOWUVr7EEc=" crossorigin="anonymous">
</script>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fresca&display=swap" rel="stylesheet">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cantora+One&display=swap" rel="stylesheet">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Merriweather+Sans:ital,wght@0,600;1,600&display=swap" rel="stylesheet">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Ubuntu+Mono:wght@700&display=swap" rel="stylesheet">

<link rel="stylesheet" href="/jekyll-blog/assets/css/style.css">
<link rel="stylesheet" href="/jekyll-blog/assets/css/styles.css">
<style>
  .thumbnail-page-title h1 {
      font-family: 'Merriweather Sans', '07YasashisaGothic', 'Lato', sans-serif;
      font-weight: bold;
      font-size: 350%;
      width: calc(1120px - 15em / 3.5);
      transform: translateY(-50%);
  }
  .thumbnail-page-title code {
      font-family: 'Ubuntu Mono';
      color: #111;
  }
  .thumbnail-site-title h2 {
      font-family: 'Merriweather Sans', '07YasashisaGothic', 'Lato', sans-serif;
      font-weight: bold;
      font-size: 150%;
  }
</style>
  </head>

  <body>
    <div style="position: relative; width: 1200px; height: 630px; background-color: #eee;">
      <div style="position: absolute; width: 1120px; height: 550px; background-color: #fff; margin: 40px;">
        <div style="position: absolute; top: 85px; left: 5em">
          <!-- <h2>[WIP] サムネイル用画像</h2> -->
        </div>
        <div style="position: relative; top: 50%; left: 7.5em;" class="thumbnail-page-title">
          <h1 class="post-title">${pageTitle}</h1>
        </div>
        <div style="position: absolute; top: 485px; left: 5em" class="thumbnail-site-title">
          <h2>${siteTitle}</h2>
        </div>
        <div style="position: absolute; top: 0; right: 0">
          <svg width="707.96399" height="735.98132" viewBox="0 0 707.96399 735.98132">
            <!--
            <path d="M0,0L707.96399,735.98132" stroke="red"/>
            <path d="M0,0L0,735.98132" stroke="red"/>
            <path d="M0,0L707.96399,0" stroke="red"/>
            <path d="M0,735.98132L707.96399,0" stroke="red"/>
            -->
            <g transform="matrix(1,0,0,-1,0,735.98133)">
              <g transform="translate(190,-175)">
              <g transform="translate(350.6088,493.5547)">
                <path d="${GITHUB_LOGO_1}" fill="#1b1817"/>
              </g>
              <g transform="translate(313.0932,406.8515)">
                <path d="${GITHUB_LOGO_2}" fill="#1b1817"/>
              </g>
              <g transform="translate(315.5395,404.123)">
                <path d="${GITHUB_LOGO_3}" fill="#1b1817"/>
              </g>
              <g transform="translate(317.9204,400.6455)">
                <path d="${GITHUB_LOGO_4}" fill="#1b1817"/>
              </g>
              <g transform="translate(321.1821,397.2851)">
                <path d="${GITHUB_LOGO_5}" fill="#1b1817"/>
              </g>
              <g transform="translate(325.6821,395.334)">
                <path d="${GITHUB_LOGO_6}" fill="#1b1817"/>
              </g>
              <g transform="translate(330.6245,394.9726)">
                <path d="${GITHUB_LOGO_7}" fill="#1b1817"/>
              </g>
              <g transform="translate(335.2231,395.7549)">
                <path d="${GITHUB_LOGO_8}" fill="#1b1817"/>
              </g>
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  </body>
</html>
`;

    let newWin = open('', '_blank');
    newWin.document.write(html);
    renderMathInElement(newWin.document.body);
}
