# **App Name**: Forever Us

## Core Features:

- Runaway 'No' Button: A 'No' button on the landing page that moves away from the mouse cursor using framer-motion to playfully prevent the user from selecting it.
- 'Yes' Button & Confetti Explosion: Upon clicking the 'Yes' button, trigger a confetti explosion (using react-confetti) and navigate to the Dashboard.
- Authentication: Email/password login (or a hardcoded access for the two of us).
- Real-time Chat Interface: A WhatsApp-style chat interface with messages stored in Firestore with timestamps. Implements real-time syncing using Firestore snapshot listeners.
- Date Night Calendar: Monthly calendar view where users can click on a date and add a 'Date Night' event, saving these events to Firestore.
- Content Generation Tool: Integrate a generative AI model to generate ideas for activities given specific filters, to provide date night suggestions and romantic messages. It incorporates the preferences for restaurants, cuisines, and the activities to decide on the activities.

## Style Guidelines:

- Primary color: Soft pink (#F4B4C6) for a romantic and gentle feel.
- Background color: Light blush (#F9E7EA) for a warm and inviting backdrop.
- Accent color: Pale violet (#D0BCD5) to complement the pinks and add depth.
- Body and headline font: 'Alegreya', a humanist serif with an elegant, intellectual, contemporary feel; for both headings and body text.
- Lucide React icons used throughout the application for a clean and consistent look.
- Responsive design ensuring the application is functional and visually appealing on all devices.
- Framer Motion for complex animations to enhance user experience, especially on the landing page with the 'No' button and confetti explosion.