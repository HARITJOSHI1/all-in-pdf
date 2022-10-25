<p align = "center"> <img src="https://i.ibb.co/tz3v7GW/sp-logo.png" alt="Superpdf" width="120px" height = "120px" /> </p>

<h1 align = "center">  Superpdf 👨‍💻 📁 </h1>
<p align = "center"> Welcome to Superpdf, a web application that will provide an interface to the users providing services that will operate & manage PDF documents. It consists of an easy-to-navigate user interface so users can easily access and focus on performing their tasks with productivity tracking suit builtin.</p>

_<h3 align = "center"> Languages Used 💡 </h3>_
<p align = "center">
   <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="Javascript" width="30px" />
   <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" alt="Javascript" width="30px" />
   <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" width="30px" />
   <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node JS" width="30px" />
   <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original-wordmark.svg" alt="Express JS" width="30px" />
   <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-plain-wordmark.svg" alt="MongoDB" width="30px" />
   <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain-wordmark.svg" alt="Firebase" width="30px" />
</p>


## Features 🛠
* A web app capable of **merging**, **splitting**, **optimized compress/ion**, **rotation**, **converting word docs to pdf's**, **JPG**, **PNG to PDFs** interface to **edit multiple pdf** documents.  

* Allows users to **digitally sign the PDFs** and also **verify the signs** to check the authenticity of the sign also provides users to 
  **highlight certain sections** of PDFs, **copy texts**, and **add custom annotations**.

* Provide encryption of PDFs using **e_AES_256 cryptography standards** for security and many other operations supported using
  **PDFTRON library** results in **sharable & downloadable** documents to the device or **saved in Google Drive** and **Dropbox** using Node 
  js Stream API.

* Signing from **Google** and **Facebook** using OAuth firebase for authorization.

* Cookies-based fixed **refresh tokens** are used to keep users signed in for a fixed time period. 

* All PDFs are **saved in zip formats** using **JSZip** and docs can be imported using **Google Picker API** and **cronjob** to clear 
  temporary docs after an hour from the server with a dashboard for monitoring and managing workflows.

* **Recurring payments** are powered via **stripe and paypal** and can be managed within the application with **stripe webhooks** to manage 
    payment states and their confirmation at the application's server side.


## Tech Stack 🚀
| Core tech                  | Purpose                                     |
|----------------------------|---------------------------------------------|
| React JS                   | Create front-end of the app                 |
| Node JS                    | Create back end of the app                  |
| Express JS                 | Used middlewares for Node JS                |
| MongoDB                    | Database                                    |
| Typescript                 | For type safety                             |
| Firebase                   | Used OAuth providers                        |
| JWT                        | Implemented refresh tokens                  |
| PDFTRON                    | Server side PDF renderer, supports PDF suit |
| PSPDFKIT                   | Client side PDF renderer                    |
| Multer                     | Processing multipart-form data              |
| React Router               | For client side routing                     |
| Axios                      | For data fetching                           |
| SWR                        | For optimized data fetching                 |
| Redux                      | Globle State management                     |
| MUI                        | For material UI components                  |
| Stripe and stripe elements | For client side payment processing          |
| Paypal SDK                 | Paypal payment gateway                      |
| GAPI                       | For google GIS authentication               |
| bcrypt                     | For hashing passwords with salt             |
| Mongoose                   | Object Relational Mapping (ORM) for MongoDB |


## Prerequisites 🔴
* <a href = "https://yarnpkg.com/" >Yarn</a> 
* <a href = "https://nodejs.org/en/" >Node</a> 

## Running Locally 🏃
Clone this repository and install dependencies by running:
``` bash 
npm install 
#or 
yarn install
```

Create a new file named ``config.env`` with the following environment variables in the root of the **api** folder:
``` js
NODE_ENV=
JWT_SECRET_A=
JWT_SECRET_R=
JWT_EXPIRES_A=
JWT_EXPIRES_R=
PDFTRON_INIT=
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USERNAME=
EMAIL_PASS=
DB_URL=
DB_PASSWORD=
STRIPE_SK_TEST=
STRIPE_SK_PROD=

```

_for PDFTRON_INIT used the value as ``"demo:1656489012631:7a705f89030000000099d30cf22434dc5223f070825aca6f02d8157de5"`` as it will initialize the library in trial mode._

For development mode, run these in client and api folders in the terminal:
``` bash
npm run dev
```

For production mode, run these in client and api folders in the terminal:
``` bash
npm run build
npm start
```

Visit <a href= '#'> http://localhost:3000/ </a> and run server on <a href= '#'> localhost:5000/ </a> or your custom port environment variable to view the app.
