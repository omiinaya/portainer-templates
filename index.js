const root = require("./api/root");
const templates = require('./api/templates');
const express = require("express");
const app = express();

const { version } = require('./package.json')
global.AO_VERSION = version

const processRequest = require('./app/process-request')

function enableCORS(req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*')
  res.header('Access-Control-Allow-Credentials', true)
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Content-Encoding, Accept'
  )
  res.header(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PATCH, PUT, DELETE'
  )
  res.header('Via', `allOrigins v${version}`)
  next()
}

app.use(express.json({ extended: false }));


app.use("/", root);
app.use("/templates", templates);
app.set('case sensitive routing', false)
app.set('jsonp callback name', 'callback')
app.disable('x-powered-by')
app.enable("trust proxy")
app.use(enableCORS)

app.all('/:format(get|raw|json|info)', processRequest)

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));

/*                                            
                           .'\                
                          //  ;               
                         /'   |               
        .----..._    _../ |   \               
         \'---._ `.-'      `  .'              
          `.    '              `.     <--- dog 
            :            _,.    '.            
            |     ,_    (() '    |            
            ;   .'(().  '      _/__..-        
            \ _ '       __  _.-'--._          
            ,'.'...____'::-'  \     `'        
           / |   /         .---.              
     .-.  '  '  / ,---.   (     )             
    / /       ,' (     )---`-`-`-.._          
   : '       /  '-`-`-`..........--'\         
   ' :      /  /                     '.       
   :  \    |  .'         o             \      
    \  '  .' /          o       .       '     
     \  `.|  :      ,    : _o--'.\      |     
      `. /  '       ))    (   )  \>     |     
        ;   |      ((      \ /    \___  |     
        ;   |      _))      `'.-'. ,-'` '     
        |    `.   ((`            |/    /      
        \     ).  .))            '    .       
     ----`-'-'  `''.::._________:::.'' ---                                          
*/