import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/eventhub-hero.png';
import './styles/Home.css';

function Home() {
  return (
    <div className="home-page">
      <section className="home-hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(6, 24, 40, 0.92), rgba(6, 24, 40, 0.66), rgba(6, 24, 40, 0.18)), url(${heroImage})` }}>
        <div className="home-hero-content">
          <p className="home-eyebrow">EventHUB event management platform</p>
          <h1>Explore, register, and manage events in one professional hub.</h1>
          <p>
            Discover seminars, conferences, workshops, webinars, and community meetups. EventHUB makes it simple to find the right event and reserve your place.
          </p>
          <div className="home-actions">
            <Link to="/events" className="home-primary-btn">Explore Events</Link>
            <Link to="/register" className="home-secondary-btn">Create Account</Link>
          </div>
        </div>
      </section>

      <section className="home-section home-overview">
        <div>
          <p className="home-eyebrow">Built for attendees</p>
          <h2>Everything you need before the event starts.</h2>
        </div>
        <div className="home-feature-grid">
          <article className="home-feature">
            <span>01</span>
            <h3>Explore by category</h3>
            <p>Browse focused event types like seminars, conferences, workshops, meetups, and webinars.</p>
          </article>
          <article className="home-feature">
            <span>02</span>
            <h3>Register quickly</h3>
            <p>Choose an event, check the important details, and register with a smooth attendee flow.</p>
          </article>
          <article className="home-feature">
            <span>03</span>
            <h3>Track your events</h3>
            <p>Keep registered events in one place so your upcoming plans stay clear and organized.</p>
          </article>
        </div>
      </section>

      <section className="home-section home-band">
        <div>
          <p className="home-eyebrow">For organizers</p>
          <h2>Manage events with confidence.</h2>
          <p>
            Admin tools help teams create events, view registrations, understand capacity, and keep event information accurate.
          </p>
        </div>
        <Link to="/events" className="home-primary-btn">Browse Event Page</Link>
      </section>
    </div>
  );
}

export default Home;
