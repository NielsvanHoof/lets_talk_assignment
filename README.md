# Let's Talk Assignment

**Made by Niels**

---

## 🚀 Getting Started

Before you begin, ensure you have **Docker** and **Composer** installed on your machine.

When you visit the website, you will be landed on the welcome page, from here you can either login or register for an
account to access the dashboard.
When logging in, you will be redirected to the ip-addresses page, where you can view the list of allowed IP addresses
and add your own IP address to the list.
you are required to enter your IP address to access the dashboard.

to view your IP address, you can visit the following link: [What is my IP address?](https://www.whatismyip.com/)

or you can run the following command in your terminal:

```bash
  curl ifconfig.me
```

---

## 🛠️ Setup

1. **Configure the `.env` File**
    - Copy the example environment file and rename it to `.env`:
      ```bash
      cp .env.example .env
      ```  
    - Generate the application key:
      ```bash
      ./vendor/bin/sail artisan key:generate
      ```  

2. **Set Up Database Credentials**  
   Update the `.env` file with the following default database credentials:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=mysql
   DB_PORT=3306
   DB_DATABASE=laravel
   DB_USERNAME=sail
   DB_PASSWORD=password
    ```

🐳 Starting Docker Containers

Run the following command to start the Docker containers:

```bash
  ./vendor/bin/sail up -d
```

📦 Installing Dependencies

1. Backend Dependencies
   Install Laravel and other dependencies:

```bash
  ./vendor/bin/sail composer install
```

2. Frontend Dependencies

Install and compile front-end assets:

```bash
  ./vendor/bin/sail npm install && ./vendor/bin/sail npm run dev
```

📋 Database Setup

Run the necessary migrations to create database tables:

```bash
  ./vendor/bin/sail artisan migrate
```

🌐 Accessing the Application

Your application is now ready! You can access it in your browser by visiting:
http://localhost

if the above link doesn't work, try opening the link in an incognito window.


---

⚙️ Additional Commands

1. Start the Scheduler

    ```bash
    ./vendor/bin/sail artisan schedule:work
    ```

2. Run the Queue Worker

    ```bash
    ./vendor/bin/sail artisan queue:work
    ```

3. Fetch Initial Data

To populate the database with data, run:

 ```bash
  ./vendor/bin/sail artisan schedule:test
  ```

4. Adding your IP to the database

To add your IP to the database, run:

 ```bash
  ./vendor/bin/sail artisan add:ip-address-to-data-base
 ```
the above command wil prompt you to enter your IP address.

Or you can manually access the database and add your IP address to the `allowed_ip_addresses` table.
