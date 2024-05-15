### Purpose and Overview
The Naperville Central High School bus web application’s purpose is to make it easier for students to get on their bus and for administrators to direct this process. Administrators are able to display bus statuses on the web app for students to see in real time while they are waiting for their bus after school. With this application we hope to abolish the use of the intercom to announce bus changes and whether the buses have arrived, substantially decrease the amount of work for administrators, and ensure that no student misses their bus. 

### Intended Experience
To open the bus app on their device, students and administrators can enter the url ([nchsbusapp.org](https://nchsbusapp.org)) into a browser. The intended experience is different for students and administrators, however. This is elaborated upon below:

#### Admin Experience
After typing in the url and opening the web app, administrators will see the Bus Status Page. This is where their changes will be reflected once they are made. Administrators can press the login button in the top right corner and complete authentication with google to make any sort of changes. If they are on the whitelist, they will be redirected to the admin page. 

Administrators will automatically see the Bus Status Changes page, with a menu on the left side. In the Bus Status Changes page, administrators will see a grid of rectangles that represent each bus’s status. The default status of each bus will be gray - meaning that the bus has Not Arrived. When administrators see that a new bus has entered the loading area, they can simply tap the corresponding button on this page, the color of the button will change to green, which means the bus has Arrived. When this happens, the time of the button press will show up on the previous Bus Status page, so that students can see when their bus has arrived. When administrators see that the bus is leaving the circle, they can press the bus’s button again and it will turn red, which means the bus has Departed. Again, the timestamp of the button press will be displayed to students. If an administrator makes a mistake and taps the button too many times, they can cycle through the statuses until they reach the one they want. At midnight, all of the bus statuses will be reset to the default status of Not Arrived.  

The Bus Changes page is the second option on the left-side menu. There are two tabs at the top of the page: Edit Bus Changes and View Bus Changes. Here administrators can change the bus numbers which will be displayed on the Bus Status page for students to see, and clearly see all of the bus changes, isolated from other information. 

The Logs page is the third button on the left side menu. On this page, administrators can see all of the changes that have been made by themselves and other administrators that day, which can be useful to go back to if ever needed. 

The Settings page is the fourth button on the left-side menu. This is where administrators can change what the list of buses is, if there are any permanent changes for that year. There are two text boxes available, one for adding buses, and one for deleting buses, and administrators have to submit the change for it to be saved and reflected on all other pages. On this page there is also a Reset All Buses button in case that is needed.  

The last button on the left-side menu, when pressed, will take the administrator back to the Bus Status page. If administrators want to go back to the admin side, they will have to login with google once again. 

#### Student Experience
Immediately upon opening the NCHS Bus App, students are able to see a table of the information they need on the Bus Status Page. This information includes all of the bus numbers, bus changes (if there are any), the current status of the bus, and the timestamp of the current status. The admin pages are not accessible to students. 

As administrators make changes on their side, students will be able to see them live on the Bus Status within about 5 seconds. They should check their bus status periodically while waiting for their bus to arrive. 

### Project Setup
Follow these steps to set up the NCHS Bus App project:
Install node on your computer. Node download page: https://nodejs.org/en/download/. The current build is running on Node v16.15.1 (run node --version to verify). Functionality is unknown on other versions. Make sure you also have git on your computer. 
Clone the git repository onto your computer using git clone : https://github.com/NCHS-SE22-23/busApp.git. 
Run npm install to install all dependencies.  

### Running the NCHS Bus App
#### On Local Host
To run the NCHS Bus App on local host, press F5 while on VS Code to debug and run the server. Then type localhost:8080 into your browser to go to the functional web app. 

### Working with the NCHS Bus App
The NCHS Bus App is built using Node, and works with Express. The entire project is started from the file server.js. 

#### Technologies
How to get started with the various technologies that the NCHS Bus App uses:

Express
Official documentation: https://expressjs.com/

Javascript 
Tutorial: https://www.w3schools.com/js/default.asp

Ejs
A form of html that allows javascript to be run during the creation of the html. The official documentation: https://ejs.co/

### Notes and Instructions for Raspberry Pi GPS Tracker
1. Here are the two tutorials I followed to set up the Raspberry Pi which also include all the instructions of how to configure the Pi properly to function as a GPS
    - Connecting GPS module to the Pi: https://sparklers-the-makers.github.io/blog/robotics/use-neo-6m-module-with-raspberry-pi/
    - Creating real time GPS with the Pi and module: https://sparklers-the-makers.github.io/blog/robotics/realtime-gps-tracker-with-raspberry-pi/
2. Here is the link to the gps module that was bought off of Amazon: https://www.amazon.com/Microcontroller-Compatible-Sensitivity-Navigation-Positioning/dp/B07P8YMVNT/ref=sr_1_5?dib=eyJ2IjoiMSJ9.5NFiPGTIPD7CER9_21znC_OYP-yW9ut2BbUaQ-pBU34a9wy-N-ss1hz-hLKAMlhg3JE_YAIyHrVQB3uQOvRj7EV0wTqnBOBIcmXXeEJTw0X5V_FkSR3jnrAxUqZti7iOZT50OsY39aA1TU8eC9Evf1bPZMyirIkg7pSj3t2McKLE8cCZgNhWs5MHrOw-FN6TjCLakKH-XGQaQUUiF7VTxjxAk2DQxImYbhw4sHMMS2c.AX4M4rgP_qPA29CWWJHp_hOwgeXmGF3_9z35Qq6bQos&dib_tag=se&keywords=GPS%2BNEO-6m&qid=1710357200&sr=8-5&th=1
3. The current plan for the Pi’s is to set them up on school buses once they have been proved to work and display the gps data to students so they can know where their bus is
4. The current proof of concept Raspberry Pi that Dr. Miller should have has already followed all the instructions in the tutorial I used and has all the code written on it
5. The API keys for both PubNub and Google Cloud Services are still needed to get the tracking fully functional
6. Right now the Raspberry Pi does properly pull latitude and longitude data, however the API keys are needed to display this information on a website
7. The gps module attached to the Pi can struggle to properly connect, particularly on cloudy days but the closer you get to being outside the more quickly it connects
8. A power bank of some kind will likely be needed along with the Pi’s unless our school buses have power outlets in them
9. May want students to have to sign into their google account to access the bus tracking data for security reasons
10. If implementation goes well, this could be brought to the entire district 203 for implementation at other schools

