# IMSizex

IMSizex is an image manipulation and management web application with various admin and user functionalities, including image compression, cropping, format conversions, PDF generation, and more. Admins have access to manage navbar items, send messages to users in real-time, view all users, and export data in CSV and PDF formats.

## Features

### Admin Features:
1. **Navbar Management**: Admin can add and remove navbar items and dropdown options.
2. **Real-time Messaging**: Admin can send messages to all users in real-time using Socket.IO.
3. **User Management**: Admin can view all users with pagination.
4. **Export Data**: Admin has the option to export data to CSV and PDF formats.
5. **View User Messages**: Admin can instantly view the messages sent by users.

### User Features:
1. **Image Compression**: Users can compress images to reduce file size.
2. **Image Cropping**: Users can crop images to the desired size.
3. **Image Format Conversion**:
   - Convert PNG to JPG.
   - Convert JPG to PNG.
4. **Image to PDF**: Users can convert images to PDF files.
5. **PDF to Image**: Users can convert PDF files into images.
6. **Downloadable Files**: Users can download processed images and PDFs.

## Technologies Used
- **Frontend**: React.js, TailwindCSS
- **Backend**: Node.js, Express.js
- **Real-time Communication**: Socket.IO
- **Database**: MongoDB
- **Authentication**: Google Auth, JWT
- **PDF and CSV Export**: `pdf-lib`, `json2csv`
- **Image Processing**: Sharp, Jimp, PDF.js

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/imsizex.git
cd imsizex
