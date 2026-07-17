import './globals.css';

export const metadata = {
  title: 'Zenithire — Your Career Begins with One Minute',
  description: 'The video-first recruitment platform.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
