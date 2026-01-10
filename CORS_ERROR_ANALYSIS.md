The CORS error you are seeing is a symptom of a deeper problem. The backend application is failing to connect to your PostgreSQL database.

Here's a summary of what's happening:
1.  Your browser makes a `POST` request to `/api/auth/login`.
2.  The backend server receives the request and tries to process it.
3.  The login process requires a database connection to look up the user.
4.  The backend fails to connect to the PostgreSQL database at `localhost:5432`.
5.  This causes a `500 Internal Server Error` on the backend.
6.  Because of the error, the CORS middleware doesn't run, and the error response is sent without the `Access-Control-Allow-Origin` header.
7.  Your browser sees the missing header and reports a CORS error, even though the real issue is the database connection.

To resolve this, you need to make sure your PostgreSQL database is running and accessible to the backend.

**How to fix this:**

The easiest way to run the required PostgreSQL database is by using the provided `docker-compose.yml` file.

1.  **Install and run Docker Desktop.**
2.  Open a terminal in the root of the project and run the following command:
    ```
    docker-compose up -d postgres
    ```
This will start a PostgreSQL database in a Docker container with the correct credentials and on the correct port.

Once the database is running, you can restart your backend application, and the login requests should succeed.
