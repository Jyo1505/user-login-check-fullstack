. Track user login information: 
Determine the system/computer(type of browser, OS and system desktop or mobile of laptop) 
and IP address from which the user is logging in, and store it in the database and also show it as login history to the user.
if the user log into google chrome they should be able to access the website using OTP which we will trigger from email ,
if the user login from microsoft browser we should allow user without any authentication . 
if the device is mobile we should be able to access the website only during 10 AM to 1 PM apart from that time


i host that on render(for backend) railway( for databse) vercel(frontend)
email trigges needs resend api(with paid domain) so i used ddemo otp that means it login in chrome you can get otp on screen via backend
the code of resend in databse will work if you are using just on localhost with you credentials

https://user-login-check-fullstack.vercel.app/

IMPORTANT NOTE: while deploy the project i used render(for backend ) and vercel(for frontend) All platforms i used are free tier so basically while using the site while click on link refresh the page first ( for awaken the backend) . dont rush if it dont response immediately wait for bit cause(as per free tier it will take time) for response to your requests like login regiter etc



