# BIAB Mobile Scanning & Verification Utility

This repository contains the source code for the "BIAB Mobile Scanning Utility," a bespoke Android application designed for Zebra handheld devices. Its primary purpose is to eliminate packing errors in the warehouse by enforcing a strict "Scan-to-Verify" workflow before shipping labels are generated.

## Project Structure

The project is divided into two main components:

1.  **`client/`**: A React Native (Expo) application that runs on the Zebra devices. It handles the UI, barcode scanning (via DataWedge intents or keyboard emulation), and local verification logic.
2.  **`middleware/`**: A Node.js Express server that acts as a bridge between the mobile app and the backend systems (e.g., Mintsoft). It currently mocks the order retrieval and dispatch APIs for development purposes.

## Tech Stack

*   **Client:** React Native, Expo, React Native Web (for development testing), `expo-haptics`, `axios`.
*   **Middleware:** Node.js, Express, `cors`, `dotenv`.
*   **Target Hardware:** Zebra TC-Series Android Handhelds (supports DataWedge Intents).

## Prerequisites

*   Node.js (v18 or higher recommended)
*   npm or yarn
*   Android Studio & Android Emulator (for mobile testing) or a physical Android device.
*   (Optional) Expo Go app on a physical device.

## Setup Instructions

### 1. Middleware Setup

The middleware simulates the backend API.

1.  Navigate to the middleware directory:
    ```bash
    cd middleware
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables:
    ```bash
    cp .env.example .env
    ```
    (Ensure `PORT=3000` is set in `.env`)
4.  Start the server:
    ```bash
    npm start
    ```
    The server will run on `http://localhost:3000`.

### 2. Client Setup

The client application can be run in three modes: Web (for quick UI dev), Android Emulator, or Physical Device.

1.  Navigate to the client directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

#### Running on Web (Development/Testing)
This is useful for quick UI verification but does not support native modules like Haptics or DataWedge.
```bash
npx expo start --web
```
*   Open `http://localhost:8081` in your browser.
*   **Note:** Use your keyboard to type simulated barcodes into the input field.

#### Running on Android Emulator
1.  Ensure an Android Virtual Device (AVD) is running via Android Studio.
2.  Start the app:
    ```bash
    npx expo run:android
    ```
    *   **Note:** The app is configured to connect to the middleware at `http://10.0.2.2:3000` when running on the Android Emulator, which maps to the host machine's `localhost`.

#### Running on Physical Zebra Device
1.  Connect your Zebra device via USB debugging or use Expo Go.
2.  Start the development server:
    ```bash
    npx expo start
    ```
3.  Scan the QR code with the Expo Go app on your device.
    *   **Note:** Ensure your device is on the same Wi-Fi network as your computer. You may need to update `client/src/services/api.js` to point to your computer's local IP address (e.g., `http://192.168.1.X:3000/api`) instead of `localhost`.

## Usage

1.  **Start the Middleware** (`npm start` in `middleware/`).
2.  **Start the Client** (`npx expo start --web` or on device).
3.  **Dashboard:** You will see a "Scan Tote/Order to Begin" screen.
4.  **Scan Order:**
    *   Enter/Scan `ORDER-001`.
5.  **Verify Items:**
    *   The app will list required items (e.g., Premium Gin, Tonic Water).
    *   Scan `SKU-ABC` (Premium Gin). It should turn green (Verified).
    *   Scan `SKU-DEF` (Tonic Water) twice.
6.  **Gift Message (If applicable):**
    *   If the order has a gift message (e.g., `ORDER-002`), you must scan the unique gift message code (`GIFT-123`) to proceed.
7.  **Error Handling:**
    *   Scanning a wrong SKU (e.g., `WRONG-SKU`) or scanning an item too many times will trigger a **Blocking Error Modal**. You must tap "DISMISS" to continue.
8.  **Complete Order:**
    *   Once all items are verified (green), the "Complete Order" button becomes active.
    *   Tapping it sends a dispatch request to the middleware and resets the app for the next order.

## Testing DataWedge (Zebra Devices)

The app includes a listener for Zebra DataWedge intents (`com.symbol.datawedge.api.RESULT_ACTION`).
*   Ensure your DataWedge profile is configured to output via **Intent**.
*   Intent Action: `com.symbol.datawedge.api.RESULT_ACTION`
*   Intent Category: `android.intent.category.DEFAULT`
*   Delivery: `Broadcast Intent`
