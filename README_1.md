# Test User Credentials:

Email: testuser.math@gmail.com

Password: Testuser@1234

# If you don't have the option to sign up, then use the bellow url pattern for signup :

URL: https://math-editor-self.vercel.app/sign_up#5af81aea-ad6d-4227-9469-a993cbbe085d

https://math-editor-self.vercel.app/sign_up - this is FE url for signup page

[5af81aea-ad6d-4227-9469-a993cbbe085d] - this is token for signup in FE (replace this token with new token from Token table in DB)

# Must do before BE deploymention on onrender

build the jar file using following steps:

1. echo $JAVA_HOME
2. java -version
3. export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
4. echo $JAVA_HOME
5. chmod +x mvnw
6. ./mvnw clean package

commit the code to git repo and push the changes

1. git status
2. git add .
3. git commit -m ""
4. git push origin main

# Backend running url
https://matheditor-be.onrender.com/

# Frontend running url
https://math-editor-self.vercel.app/
