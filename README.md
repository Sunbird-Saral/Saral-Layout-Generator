# Sunbird Saral

Project Sunbird Saral aims to revolutionize the process of creating layouts and templates across various industries. With a user-friendly interface and a plethora of customization options, this project simplifies the creation of templates, from school attendance sheets to hospitality brochures.

## Table of Contents

- [Introduction](#introduction)
- [Technical Overview](#technical-overview)
- [Getting Started](#getting-started)
- [Features](#features)
- [Demo](#demo)

## Introduction

Project Sunbird Saral addresses the challenges of manual layout design by offering intuitive tools that empower users to customize and adapt existing templates. This enhancement results in time and resource savings across diverse sectors.

## Technical Overview

The project is developed using a combination of JavaScript, React, and basic HTML/CSS. The frontend is built with React to ensure a dynamic and responsive user interface. The utilization of Electron allows the creation of a standalone web application, thus elevating the overall user experience. The template creation logic is orchestrated using JavaScript and ReactJS. The project incorporates various libraries and technologies to streamline template customization and generation.

## Getting Started

To embark on your Sunbird Saral journey, follow these steps:

1. Clone the repository: `git clone https://github.com/your-username/sunbird-saral.git`
2. Navigate to the project directory: `cd sunbird-saral`
3. Install the necessary dependencies: `npm install`
4. Launch the development server: `npm start`

## Features

- A user-friendly interface simplifying template selection and customization.
- Effortless customization of fields within selected templates.
- Flexibility to update, add, or remove fields to tailor templates to specific requirements.
- Generation of finalized templates, available for digital download or printing.
- Versatile customization options catering to different industries and scenarios.
- Web application developed using React.js and Node.js.

## Demo

Upon entering the Main Page, the interface offers a clear view:

![Screenshot](readme_images/screenshot1.png)

Let's delve into a demo of creating a template from scratch. Navigate to the 'User Configurable' Page:

![Screenshot](readme_images/screenshot2.png)

Key points to note:

1. The central white canvas is where the primary template is constructed.
2. A small box at the top left corner marks the initial cell of the template.
3. Three buttons on the right facilitate the addition of various objects.
4. The 'Export PDF' option generates a downloadable PDF of the template.

### How It Works

The template is built using the starting cell. Resize cells by dragging their edges. Add cells by clicking the plus button and specifying direction.

Example:

![Start](readme_images/gif2.gif)

- **Cell Features**

Each cell boasts the following functionalities:

\- Resize to the right or down by dragging edges.
\- Add a new cell of similar size to the right or down.
\- Double-click to edit and add text.
\- Triple-click to modify basic text properties like boldness and text size.

Let's explore the button options:

- **Add OMR**

Click to insert an OMR filling component. Features:

\- Red cross button for removal (on hover).
\- Drag the OMR anywhere on the canvas.
\- Scroll to adjust pixel size.
\- Double-click to toggle filled/unfilled status.

![OMR](readme_images/gif1.gif)

- **Add ID**

This creates a horizontal row for ID, Class, Section, etc. Features:

\- Delete button (top right) for component removal.
\- Increase/decrease the number of cells in the row.
\- Scroll to adjust pixel size.

- **Add Free Text**

Create free text components for headlines, text fields, etc. Features:

\- Drag the text field.
\- Double-click to edit text.
\- Triple-click for advanced text options.

- **Export PDF**

After creating the template, export it as a PDF. Four dots in the corners mark the ROI scanning boundary.

Let's create a simple template:

![Template](readme_images/screenshot4.png)

Post-creation:

![Web](readme_images/screenshot5.png)

Exported PDF:

![PDF](readme_images/screenshot6.png)


#### Note 
Embrace the professionalism of Sunbird Saral in your template endeavors!
