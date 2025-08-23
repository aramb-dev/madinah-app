# Madinah Arabic Lessons

![App Icon Placeholder](https://placehold.co/128x128/096/FFFFFF?text=Madinah%20\nArabic%20Lessons)

An elegant and modern mobile application for iOS and Android designed to help students learn the Arabic language through the renowned Madinah Books series. This app provides a clean, intuitive, and customizable learning experience.

<!-- ---

## 📸 Screenshots

| Lessons Screen | Vocabulary Screen | Settings Screen |
| :---: | :---: | :---: |
| ![Lessons Screen](https://i.imgur.com/your-lessons-screenshot.png) | ![Vocabulary Screen](https://i.imgur.com/your-vocabulary-screenshot.png) | ![Settings Screen](https://i.imgur.com/your-settings-screenshot.png) |

| Filter Modal | Dark Mode | Changelog |
| :---: | :---: | :---: |
| ![Filter Modal](https://i.imgur.com/your-filter-screenshot.png) | ![Dark Mode](https://i.imgur.com/your-darkmode-screenshot.png) | ![Changelog](https://i.imgur.com/your-changelog-screenshot.png) | -->

<!-- *(**Note:** You will need to replace the placeholder image URLs with actual screenshots of your app.)* -->

---

## ✨ Features

This application is packed with features designed to create a seamless and effective learning environment.

* **📚 Browse Lessons:** Easily navigate through the Madinah Books and their corresponding lessons.
* **📖 Detailed Vocabulary:** Each lesson comes with a comprehensive vocabulary list. Tap on any word to see a detailed view with definitions, examples, word type, and more.
* **🔍 Advanced Filtering:** Quickly find the vocabulary you need with a powerful, two-level filter for both books and specific lessons.
* **🎨 Highly Customizable Appearance:**
    * **Theme Support:** Choose between Light, Dark, or a theme that follows your device's system settings.
    * **Dynamic Font Size:** Adjust the text size across the entire app using an accessible stepped slider for comfortable reading.
    * **Custom Arabic Fonts:** Select from a curated list of beautiful Arabic fonts to personalize your reading experience.
* **🔔 Daily Reminders:** Set a daily notification to remind you to study at a time that works for you.
* **📱 Cross-Platform Design:** A single codebase that delivers a native look and feel on both iOS and Android, respecting platform-specific UI conventions.
* **🔄 In-App Changelog:** Stay up-to-date with the latest features and fixes through a beautifully designed "What's New" screen.

---

## 🛠️ Tech Stack

This project is built with a modern, cross-platform tech stack:

* **Framework:** [React Native](https://reactnative.dev/)
* **Platform:** [Expo](https://expo.dev/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Navigation:** [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
* **UI Components:**
    * `@gorhom/bottom-sheet` for the native filter modal.
    * `@expo/vector-icons` for cross-platform icons.
* **State Management:** React Context for global theme and font size management.

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (LTS version recommended)
* Yarn or npm
* Expo Go app on your iOS or Android device, or a device simulator.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/aramb-dev/madinah-app.git](https://github.com/aramb-dev/madinah-app.git)
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd madinah-app
    ```
3.  **Install dependencies:**
    ```sh
    npm install
    # or
    yarn install
    ```
4.  **Run the application:**
    ```sh
    npx expo start
    ```
    This will open the Metro bundler. You can then scan the QR code with the Expo Go app on your phone to launch the project.

---

## 📂 Project Structure

This project uses Expo's file-based routing system. The `app` directory is the heart of the navigation.

```
app/
├── (tabs)/                # Defines the main bottom tab bar layout
│   ├── _layout.tsx        # The layout component for the tabs
│   ├── lessons.tsx        # The Lessons screen
│   ├── vocabulary.tsx     # The Vocabulary screen
│   ├── exercises.tsx      # The Exercises screen
│   └── (settings)/        # A nested stack navigator for all settings pages
│       ├── _layout.tsx    # The layout for the settings stack
│       ├── index.tsx      # The main settings menu screen
│       ├── appearance.tsx # The Appearance settings screen
│       └── ...            # Other settings pages
│
└── _layout.tsx            # The root layout of the entire app
```

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📧 Contact & Feedback

Your feedback is invaluable! If you encounter any bugs or have suggestions, please open an issue on GitHub or reach out directly via email.

Aram B. - [aramb@aramb.dev](mailto:aramb@aramb.dev)

Project Link: [https://github.com/aramb-dev/madinah-app](https://github.com/aramb-dev/madinah-app)

---

## 📄 License

Distributed under the MIT License. See `LICENSE.txt` for more information.
