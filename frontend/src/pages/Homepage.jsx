import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.css';

const DESTINATIONS = [
  { name: 'New York', img: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=400', desc: 'The City That Never Sleeps' },
  { name: 'Miami', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', desc: 'Sun, Sand & Vibes' },
  { name: 'Aspen', img: 'https://images.unsplash.com/photo-1520209759809-a9bcb6cb3241?w=400', desc: 'Mountain Escape' },
  { name: 'Chicago', img: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400', desc: 'The Windy City' },
  { name: 'Los Angeles', img: 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=400', desc: 'City of Angels' },
  { name: 'San Francisco', img: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400', desc: 'Bay Area Magic' },
];

const EXPERIENCES = [
  { title: 'Online Experiences', img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400', tag: 'Virtual' },
  { title: 'Adventures', img: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400', tag: 'Outdoor' },
  { title: 'Food & Drink', img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400', tag: 'Culinary' },
  { title: 'Arts & Culture', img: 'https://images.unsplash.com/photo-1578926375605-eaf7559b1458?w=400', tag: 'Creative' },
];

const GETAWAY_TABS = ['New York', 'Miami', 'Los Angeles', 'Chicago'];

export default function HomePage() {
  const [activeTab, setActiveTab] = React.useState('New York');
  const navigate = useNavigate();

  return (
    <main className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <h1>Find your next adventure</h1>
          <p>Discover unique places to stay around the world</p>
          <div className="hero-actions">
            <button className="btn btn-gradient" onClick={() => navigate('/locations/New York')}>
              Explore Stays
            </button>
            <button className="btn btn-outline hero-outline" onClick={() => navigate('/locations/Miami')}>
              View Experiences
            </button>
          </div>
        </div>
      </section>

      {/* Inspiration */}
      <section className="section container">
        <h2 className="section-title">Inspiration for your next trip</h2>
        <div className="destinations-grid">
          {DESTINATIONS.map((d) => (
            <Link key={d.name} to={`/locations/${encodeURIComponent(d.name)}`} className="destination-card">
              <div className="dest-img-wrap">
                <img src={d.img} alt={d.name} />
              </div>
              <div className="dest-info">
                <h3>{d.name}</h3>
                <p>{d.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Experiences */}
      <section className="section container">
        <h2 className="section-title">Discover Airbnb Experiences</h2>
        <p className="section-sub">Unique activities hosted by locals</p>
        <div className="experiences-grid">
          {EXPERIENCES.map((e) => (
            <div key={e.title} className="experience-card">
              <img src={e.img} alt={e.title} />
              <span className="exp-tag">{e.tag}</span>
              <h3>{e.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Things to do - On your trip */}
      <section className="things-section trip-section">
        <div className="things-content">
          <h2>Things to do on your trip</h2>
          <p>Explore local experiences and hidden gems at your destination</p>
          <button className="btn btn-gradient">Explore Activities</button>
        </div>
      </section>

      {/* Things to do - At home */}
      <section className="things-section home-section">
        <div className="things-content things-right">
          <h2>Things to do at home</h2>
          <p>Stay curious with online experiences from anywhere in the world</p>
          <button className="btn btn-gradient">Join an Experience</button>
        </div>
      </section>

      {/* Shop Airbnb */}
      <section className="shop-section container">
        <div className="shop-inner">
          <div className="shop-text">
            <h2>Shop Airbnb Gift Cards</h2>
            <p>Give the gift of travel to someone you love. Redeemable on millions of stays worldwide.</p>
            <button className="btn btn-gradient">Shop now</button>
          </div>
          <div className="shop-img">
            <img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500" alt="Gift Cards" />
          </div>
        </div>
      </section>

      {/* Inspiration for future getaways */}
      <section className="section container">
        <h2 className="section-title">Inspiration for future getaways</h2>
        <div className="getaway-tabs">
          {GETAWAY_TABS.map(tab => (
            <button
              key={tab}
              className={`getaway-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="getaway-list">
          {['Apartments', 'Houses', 'Cabins', 'Beach houses', 'Unique stays', 'Villas'].map(type => (
            <div key={type} className="getaway-item">
              <Link to={`/locations/${encodeURIComponent(activeTab)}`}>
                <span>{type} in {activeTab}</span>
                <span className="getaway-arrow">›</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-links">
          {[
            { title: 'Support', links: ['Help Centre', 'Safety information', 'Cancellation options', 'Our COVID-19 Response', 'Supporting people with disabilities'] },
            { title: 'Community', links: ['Airbnb.org: disaster relief housing', 'Support: Afghan refugees', 'Celebrating diversity & belonging', 'Combating discrimination'] },
            { title: 'Hosting', links: ['Try hosting', 'AirCover for Hosts', 'Explore hosting resources', 'Visit our community forum', 'How to host responsibly'] },
            { title: 'Airbnb', links: ['Newsroom', 'Learn about new features', 'Letter from our founders', 'Careers', 'Investors'] },
          ].map(col => (
            <div key={col.title} className="footer-col">
              <h4>{col.title}</h4>
              <ul>
                {col.links.map(l => <li key={l}><a href="/">{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="copyright-footer container">
          <span>© 2024 Airbnb Clone. All rights reserved.</span>
          <div className="copyright-right">
            <a href="/">Privacy</a>
            <a href="/">Terms</a>
            <a href="/">Sitemap</a>
            <select defaultValue="en"><option value="en">English</option><option value="fr">Français</option></select>
            <select defaultValue="usd"><option value="usd">USD</option><option value="eur">EUR</option></select>
          </div>
        </div>
      </footer>
    </main>
  );
}
