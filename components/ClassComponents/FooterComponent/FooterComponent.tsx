'use client'
import React from 'react';
import styles from './FooterComponent.module.scss';
import IconButton from '@mui/material/IconButton';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const FooterComponent = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Logo and Tagline */}
        <div className={styles.logoSection}>
          <h2>Comic Hub</h2>
          <p>
            Comic Hub is your ultimate destination for exploring, reading, and collecting comics from a vast library of
            genres and universes. Whether you're a fan of superheroes, fantasy, science fiction, or slice-of-life
            stories, Comic Hub offers something for everyone.
          </p>
        </div>

        {/* Contact Details */}
        <div className={styles.contactSection}>
          <h3>Contact Us</h3>
          <ul>
            <li>Email: contact@yourdomain.com</li>
            <li>Phone: +123-456-7890</li>
            <li>Address: 123 Main Street, City, Country</li>
          </ul>
        </div>

        {/* Social Media Links */}
        <div className={styles.socialSection}>
          <h3>Follow Us</h3>
          <div className={styles.socialIcons}>
            <IconButton
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className={styles.iconButton}
            >
              <FacebookIcon style={{ color: '#4267B2' }} />
            </IconButton>
            <IconButton
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className={styles.iconButton}
            >
              <TwitterIcon style={{ color: '#1DA1F2' }} />
            </IconButton>
            <IconButton
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className={styles.iconButton}
            >
              <InstagramIcon style={{ color: '#E4405F' }} />
            </IconButton>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className={styles.copyright}>
        <p>&copy; {new Date().getFullYear()} Your Brand. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default FooterComponent;
