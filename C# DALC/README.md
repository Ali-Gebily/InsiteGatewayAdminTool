# Barton C# DALC and API Component
This project provides a Data Access Layer component over a Mongo DB and a REST API on top of the DAL.
The DAL component is represented by Barton.DAL project and the REST API interface by Barton.API.

## Prerequisites
1. Install Mongo DB - https://www.mongodb.com/
2. Visual Studio 2015-2017

## Configuration
The configuration file is in `Barton.API/Web.config`, it can be adjusted to fit your environment:
1. The `barton` DB connection string (by default points to localhost)
2. Log4net configuration (by default it writes to a `weblog.txt` file)
3. Dependency Injection through Unity (this can stay as it is)

## Build / Run
1. Open Barton.sln in Visual Studio.
2. Restore nuget packages and build the solution.
3. Run the project with Ctrl+F5, it should start in the browser (You might get HTTP Error 403.14 - Forbidden, that's normal).
The url in my environment is http://localhost:58226/, might be different on other machines.

## Postman Verification
To verify with postman, please import the collection and environment from `docs` folder. The postman `URL` environment variable should be updated to what was received when following the Build/Run step above.
Take a look at the `docs/VerificationGuide.docx` to see examples of requests/responses.