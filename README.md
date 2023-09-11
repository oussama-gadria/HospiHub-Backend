# HospiHub

HospiHub is a web-based platform that connects healthcare providers and medical facilities with job seekers in the healthcare industry. The platform allows healthcare organizations to post job listings and enables users to search and apply for available positions.

## Features

- Job listing creation and management for healthcare providers
- Job search and filtering for job seekers
- User registration and profile creation
- Application submission and tracking
- Notifications for application status updates

## Installation

To get started with HospiHub, follow these steps:

1. Clone the repository:

   git clone https://github.com/oussama-gadria/hospihub.git
   
2. Install dependencies:
   
   cd hospihub
   npm install
   
4. Set up the database:

Create a PostgreSQL database
Update the database configuration in config/database.js   

4. Run database migrations:
npx sequelize-cli db:migrate


5. Start the server:
  npm start
6. Access the application by opening your web browser and visiting: http://localhost:3000

## Contributing

Contributions are welcome! If you'd like to contribute to HospiHub, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your changes to your forked repository.
5. Submit a pull request detailing your changes.

## License

This project is licensed under the [MIT License](LICENSE).
