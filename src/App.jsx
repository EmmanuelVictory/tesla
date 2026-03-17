import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// ─── Supercharger Data ────────────────────────────────────────────────────────
const superchargerStations = [
  { lat: 37.3861, lng: -122.0839, name: "Mountain View Supercharger", city: "Mountain View", state: "CA", stalls: 20, kw: 250, address: "1001 N Shoreline Blvd" },
  { lat: 34.0522, lng: -118.2437, name: "Los Angeles Supercharger", city: "Los Angeles", state: "CA", stalls: 16, kw: 250, address: "1234 S Figueroa St" },
  { lat: 32.7157, lng: -117.1611, name: "San Diego Supercharger", city: "San Diego", state: "CA", stalls: 12, kw: 250, address: "2345 Camino Del Rio" },
  { lat: 37.7749, lng: -122.4194, name: "San Francisco Supercharger", city: "San Francisco", state: "CA", stalls: 14, kw: 250, address: "450 Fremont St" },
  { lat: 38.5816, lng: -121.4944, name: "Sacramento Supercharger", city: "Sacramento", state: "CA", stalls: 20, kw: 250, address: "1600 Expo Pkwy" },
  { lat: 36.7378, lng: -119.7871, name: "Fresno Supercharger", city: "Fresno", state: "CA", stalls: 12, kw: 150, address: "7672 N Blackstone Ave" },
  { lat: 33.8366, lng: -117.9143, name: "Anaheim Supercharger", city: "Anaheim", state: "CA", stalls: 16, kw: 250, address: "1160 W Katella Ave" },
  { lat: 34.4208, lng: -119.6982, name: "Santa Barbara Supercharger", city: "Santa Barbara", state: "CA", stalls: 8, kw: 150, address: "3891 State St" },
  { lat: 33.1959, lng: -117.3795, name: "Carlsbad Supercharger", city: "Carlsbad", state: "CA", stalls: 10, kw: 250, address: "5620 Paseo Del Norte" },
  { lat: 35.3733, lng: -119.0187, name: "Bakersfield Supercharger", city: "Bakersfield", state: "CA", stalls: 14, kw: 250, address: "5601 Colony St" },
  { lat: 34.1478, lng: -118.1445, name: "Pasadena Supercharger", city: "Pasadena", state: "CA", stalls: 12, kw: 250, address: "171 E Walnut St" },
  { lat: 33.6846, lng: -117.8265, name: "Irvine Supercharger", city: "Irvine", state: "CA", stalls: 18, kw: 250, address: "550 Spectrum Center Dr" },
  { lat: 36.9741, lng: -122.0308, name: "Santa Cruz Supercharger", city: "Santa Cruz", state: "CA", stalls: 8, kw: 150, address: "1010 Ocean St" },
  { lat: 37.5485, lng: -121.9886, name: "Fremont Supercharger", city: "Fremont", state: "CA", stalls: 24, kw: 250, address: "45500 Fremont Blvd" },
  { lat: 34.6868, lng: -118.1542, name: "Palmdale Supercharger", city: "Palmdale", state: "CA", stalls: 10, kw: 250, address: "39919 10th St W" },
  { lat: 33.9425, lng: -118.4081, name: "LAX Supercharger", city: "Los Angeles", state: "CA", stalls: 12, kw: 250, address: "9800 S Sepulveda Blvd" },
  { lat: 45.5051, lng: -122.6750, name: "Portland Supercharger", city: "Portland", state: "OR", stalls: 14, kw: 250, address: "1525 NE Grand Ave" },
  { lat: 47.6062, lng: -122.3321, name: "Seattle Supercharger", city: "Seattle", state: "WA", stalls: 16, kw: 250, address: "2001 Westlake Ave" },
  { lat: 44.0521, lng: -123.0868, name: "Eugene Supercharger", city: "Eugene", state: "OR", stalls: 8, kw: 150, address: "1000 Valley River Way" },
  { lat: 44.9429, lng: -123.0351, name: "Salem Supercharger", city: "Salem", state: "OR", stalls: 8, kw: 150, address: "3125 Ryan Dr SE" },
  { lat: 47.2529, lng: -122.4443, name: "Tacoma Supercharger", city: "Tacoma", state: "WA", stalls: 12, kw: 250, address: "4502 S Steele St" },
  { lat: 48.7519, lng: -122.4787, name: "Bellingham Supercharger", city: "Bellingham", state: "WA", stalls: 8, kw: 150, address: "4180 Meridian St" },
  { lat: 47.6588, lng: -117.4260, name: "Spokane Supercharger", city: "Spokane", state: "WA", stalls: 10, kw: 250, address: "15727 E Indiana Ave" },
  { lat: 45.6387, lng: -122.6615, name: "Vancouver WA Supercharger", city: "Vancouver", state: "WA", stalls: 10, kw: 250, address: "7809 NE Vancouver Mall Dr" },
  { lat: 36.1699, lng: -115.1398, name: "Las Vegas Supercharger", city: "Las Vegas", state: "NV", stalls: 20, kw: 250, address: "3200 Las Vegas Blvd" },
  { lat: 39.5296, lng: -119.8138, name: "Reno Supercharger", city: "Reno", state: "NV", stalls: 12, kw: 250, address: "2500 E Second St" },
  { lat: 36.0395, lng: -114.9817, name: "Boulder City Supercharger", city: "Boulder City", state: "NV", stalls: 8, kw: 250, address: "1631 Boulder City Pkwy" },
  { lat: 33.4484, lng: -112.0740, name: "Phoenix Supercharger", city: "Phoenix", state: "AZ", stalls: 16, kw: 250, address: "2402 E Camelback Rd" },
  { lat: 32.2226, lng: -110.9747, name: "Tucson Supercharger", city: "Tucson", state: "AZ", stalls: 12, kw: 250, address: "4821 E Grant Rd" },
  { lat: 33.4152, lng: -111.8315, name: "Scottsdale Supercharger", city: "Scottsdale", state: "AZ", stalls: 10, kw: 250, address: "7014 E Camelback Rd" },
  { lat: 35.1983, lng: -111.6513, name: "Flagstaff Supercharger", city: "Flagstaff", state: "AZ", stalls: 8, kw: 150, address: "2500 E Lucky Ln" },
  { lat: 33.3528, lng: -111.7890, name: "Tempe Supercharger", city: "Tempe", state: "AZ", stalls: 12, kw: 250, address: "1900 E Rio Salado Pkwy" },
  { lat: 40.7608, lng: -111.8910, name: "Salt Lake City Supercharger", city: "Salt Lake City", state: "UT", stalls: 14, kw: 250, address: "120 S Main St" },
  { lat: 39.7392, lng: -104.9903, name: "Denver Supercharger", city: "Denver", state: "CO", stalls: 16, kw: 250, address: "7505 E 35th Ave" },
  { lat: 40.5853, lng: -105.0844, name: "Fort Collins Supercharger", city: "Fort Collins", state: "CO", stalls: 10, kw: 250, address: "3541 S College Ave" },
  { lat: 38.8339, lng: -104.8214, name: "Colorado Springs Supercharger", city: "Colorado Springs", state: "CO", stalls: 12, kw: 250, address: "1685 Briargate Pkwy" },
  { lat: 40.2338, lng: -111.6585, name: "Provo Supercharger", city: "Provo", state: "UT", stalls: 8, kw: 150, address: "1200 Towne Centre Blvd" },
  { lat: 37.1041, lng: -113.5841, name: "St George Supercharger", city: "St George", state: "UT", stalls: 10, kw: 250, address: "1091 N Bluff St" },
  { lat: 43.6150, lng: -116.2023, name: "Boise Supercharger", city: "Boise", state: "ID", stalls: 10, kw: 250, address: "350 S Capitol Blvd" },
  { lat: 46.8721, lng: -113.9940, name: "Missoula Supercharger", city: "Missoula", state: "MT", stalls: 8, kw: 150, address: "2901 Brooks St" },
  { lat: 41.1400, lng: -104.8202, name: "Cheyenne Supercharger", city: "Cheyenne", state: "WY", stalls: 8, kw: 150, address: "1400 Dell Range Blvd" },
  { lat: 29.7604, lng: -95.3698, name: "Houston Supercharger", city: "Houston", state: "TX", stalls: 20, kw: 250, address: "1200 McKinney St" },
  { lat: 30.2672, lng: -97.7431, name: "Austin Supercharger", city: "Austin", state: "TX", stalls: 18, kw: 250, address: "2901 S Capital of Texas Hwy" },
  { lat: 32.7767, lng: -96.7970, name: "Dallas Supercharger", city: "Dallas", state: "TX", stalls: 16, kw: 250, address: "2323 N Field St" },
  { lat: 29.4241, lng: -98.4936, name: "San Antonio Supercharger", city: "San Antonio", state: "TX", stalls: 14, kw: 250, address: "849 E Commerce St" },
  { lat: 32.7555, lng: -97.3308, name: "Fort Worth Supercharger", city: "Fort Worth", state: "TX", stalls: 12, kw: 250, address: "5601 Edwards Ranch Rd" },
  { lat: 31.7619, lng: -106.4850, name: "El Paso Supercharger", city: "El Paso", state: "TX", stalls: 8, kw: 150, address: "8889 Gateway Blvd W" },
  { lat: 41.8781, lng: -87.6298, name: "Chicago Supercharger", city: "Chicago", state: "IL", stalls: 20, kw: 250, address: "540 N Michigan Ave" },
  { lat: 42.3314, lng: -83.0458, name: "Detroit Supercharger", city: "Detroit", state: "MI", stalls: 14, kw: 250, address: "2727 E Grand Blvd" },
  { lat: 41.4993, lng: -81.6944, name: "Cleveland Supercharger", city: "Cleveland", state: "OH", stalls: 12, kw: 250, address: "2850 Euclid Ave" },
  { lat: 39.7684, lng: -86.1581, name: "Indianapolis Supercharger", city: "Indianapolis", state: "IN", stalls: 14, kw: 250, address: "49 W Maryland St" },
  { lat: 39.1031, lng: -84.5120, name: "Cincinnati Supercharger", city: "Cincinnati", state: "OH", stalls: 12, kw: 250, address: "160 E Fourth St" },
  { lat: 39.9612, lng: -82.9988, name: "Columbus Supercharger", city: "Columbus", state: "OH", stalls: 12, kw: 250, address: "3900 Morse Crossing" },
  { lat: 42.9634, lng: -85.6681, name: "Grand Rapids Supercharger", city: "Grand Rapids", state: "MI", stalls: 10, kw: 250, address: "3665 28th St SE" },
  { lat: 44.9778, lng: -93.2650, name: "Minneapolis Supercharger", city: "Minneapolis", state: "MN", stalls: 16, kw: 250, address: "821 Marquette Ave" },
  { lat: 43.0389, lng: -87.9065, name: "Milwaukee Supercharger", city: "Milwaukee", state: "WI", stalls: 12, kw: 250, address: "333 W Kilbourn Ave" },
  { lat: 41.5868, lng: -93.6250, name: "Des Moines Supercharger", city: "Des Moines", state: "IA", stalls: 10, kw: 250, address: "101 Jordan Creek Pkwy" },
  { lat: 39.0997, lng: -94.5786, name: "Kansas City Supercharger", city: "Kansas City", state: "MO", stalls: 14, kw: 250, address: "1601 Main St" },
  { lat: 38.6270, lng: -90.1994, name: "St. Louis Supercharger", city: "St. Louis", state: "MO", stalls: 14, kw: 250, address: "701 Convention Plaza" },
  { lat: 41.2565, lng: -95.9345, name: "Omaha Supercharger", city: "Omaha", state: "NE", stalls: 12, kw: 250, address: "10000 California St" },
  { lat: 37.6872, lng: -97.3301, name: "Wichita Supercharger", city: "Wichita", state: "KS", stalls: 10, kw: 250, address: "7700 E Kellogg Dr" },
  { lat: 40.7128, lng: -74.0060, name: "New York City Supercharger", city: "New York", state: "NY", stalls: 20, kw: 250, address: "233 Park Ave" },
  { lat: 40.7282, lng: -74.0776, name: "Jersey City Supercharger", city: "Jersey City", state: "NJ", stalls: 12, kw: 250, address: "30 Montgomery St" },
  { lat: 39.9526, lng: -75.1652, name: "Philadelphia Supercharger", city: "Philadelphia", state: "PA", stalls: 14, kw: 250, address: "1500 Market St" },
  { lat: 42.8864, lng: -78.8784, name: "Buffalo Supercharger", city: "Buffalo", state: "NY", stalls: 10, kw: 250, address: "4545 Transit Rd" },
  { lat: 42.6526, lng: -73.7562, name: "Albany Supercharger", city: "Albany", state: "NY", stalls: 8, kw: 150, address: "1 Crossgates Mall Rd" },
  { lat: 40.2732, lng: -76.8867, name: "Harrisburg Supercharger", city: "Harrisburg", state: "PA", stalls: 10, kw: 250, address: "3501 Paxton St" },
  { lat: 40.4406, lng: -79.9959, name: "Pittsburgh Supercharger", city: "Pittsburgh", state: "PA", stalls: 12, kw: 250, address: "100 Art Rooney Ave" },
  { lat: 42.3601, lng: -71.0589, name: "Boston Supercharger", city: "Boston", state: "MA", stalls: 14, kw: 250, address: "100 Cambridge Side Pl" },
  { lat: 41.8240, lng: -71.4128, name: "Providence Supercharger", city: "Providence", state: "RI", stalls: 8, kw: 250, address: "10 Memorial Blvd" },
  { lat: 41.3083, lng: -72.9279, name: "New Haven Supercharger", city: "New Haven", state: "CT", stalls: 10, kw: 250, address: "100 York St" },
  { lat: 43.6591, lng: -70.2568, name: "Portland ME Supercharger", city: "Portland", state: "ME", stalls: 8, kw: 150, address: "100 Waterman Dr" },
  { lat: 25.7617, lng: -80.1918, name: "Miami Supercharger", city: "Miami", state: "FL", stalls: 16, kw: 250, address: "200 S Biscayne Blvd" },
  { lat: 28.5383, lng: -81.3792, name: "Orlando Supercharger", city: "Orlando", state: "FL", stalls: 16, kw: 250, address: "9101 International Dr" },
  { lat: 27.9506, lng: -82.4572, name: "Tampa Supercharger", city: "Tampa", state: "FL", stalls: 14, kw: 250, address: "3102 N Rocky Point Dr" },
  { lat: 30.3322, lng: -81.6557, name: "Jacksonville Supercharger", city: "Jacksonville", state: "FL", stalls: 12, kw: 250, address: "10281 Midtown Pkwy" },
  { lat: 33.7490, lng: -84.3880, name: "Atlanta Supercharger", city: "Atlanta", state: "GA", stalls: 18, kw: 250, address: "3393 Peachtree Rd NE" },
  { lat: 35.2271, lng: -80.8431, name: "Charlotte Supercharger", city: "Charlotte", state: "NC", stalls: 14, kw: 250, address: "6801 Morrison Blvd" },
  { lat: 35.7796, lng: -78.6382, name: "Raleigh Supercharger", city: "Raleigh", state: "NC", stalls: 12, kw: 250, address: "4325 Glenwood Ave" },
  { lat: 38.9072, lng: -77.0369, name: "Washington DC Supercharger", city: "Washington", state: "DC", stalls: 14, kw: 250, address: "750 9th St NW" },
  { lat: 39.2904, lng: -76.6122, name: "Baltimore Supercharger", city: "Baltimore", state: "MD", stalls: 12, kw: 250, address: "100 E Pratt St" },
  { lat: 36.1627, lng: -86.7816, name: "Nashville Supercharger", city: "Nashville", state: "TN", stalls: 14, kw: 250, address: "201 Broadway" },
  { lat: 35.1495, lng: -90.0490, name: "Memphis Supercharger", city: "Memphis", state: "TN", stalls: 12, kw: 250, address: "5100 Poplar Ave" },
  { lat: 38.2527, lng: -85.7585, name: "Louisville Supercharger", city: "Louisville", state: "KY", stalls: 12, kw: 250, address: "201 E Jefferson St" },
  { lat: 33.5207, lng: -86.8025, name: "Birmingham Supercharger", city: "Birmingham", state: "AL", stalls: 10, kw: 250, address: "2000 Riverchase Galleria" },
  { lat: 29.9511, lng: -90.0715, name: "New Orleans Supercharger", city: "New Orleans", state: "LA", stalls: 12, kw: 250, address: "333 Poydras St" },
  { lat: 34.7465, lng: -92.2896, name: "Little Rock Supercharger", city: "Little Rock", state: "AR", stalls: 10, kw: 250, address: "11500 Financial Centre Pkwy" },
  { lat: 36.1540, lng: -95.9928, name: "Tulsa Supercharger", city: "Tulsa", state: "OK", stalls: 12, kw: 250, address: "7021 S Memorial Dr" },
  { lat: 35.4676, lng: -97.5164, name: "Oklahoma City Supercharger", city: "Oklahoma City", state: "OK", stalls: 12, kw: 250, address: "3000 W Memorial Rd" },
  { lat: 35.0844, lng: -106.6504, name: "Albuquerque Supercharger", city: "Albuquerque", state: "NM", stalls: 12, kw: 250, address: "6600 Menaul Blvd NE" },
  { lat: 35.6870, lng: -105.9378, name: "Santa Fe Supercharger", city: "Santa Fe", state: "NM", stalls: 8, kw: 150, address: "4250 Cerrillos Rd" },
  { lat: 27.3364, lng: -82.5307, name: "Sarasota Supercharger", city: "Sarasota", state: "FL", stalls: 10, kw: 250, address: "3501 S Tamiami Trail" },
  { lat: 26.6406, lng: -81.8723, name: "Fort Myers Supercharger", city: "Fort Myers", state: "FL", stalls: 10, kw: 250, address: "13499 S Cleveland Ave" },
  { lat: 37.5407, lng: -77.4360, name: "Richmond Supercharger", city: "Richmond", state: "VA", stalls: 12, kw: 250, address: "100 S 14th St" },
  { lat: 36.8529, lng: -75.9780, name: "Virginia Beach Supercharger", city: "Virginia Beach", state: "VA", stalls: 10, kw: 250, address: "1169 Nimmo Pkwy" },
  { lat: 43.0481, lng: -76.1474, name: "Syracuse Supercharger", city: "Syracuse", state: "NY", stalls: 10, kw: 250, address: "9090 Destiny USA Dr" },
  { lat: 42.2711, lng: -83.7263, name: "Ann Arbor Supercharger", city: "Ann Arbor", state: "MI", stalls: 10, kw: 250, address: "3365 Washtenaw Ave" },
  { lat: 40.1164, lng: -88.2434, name: "Champaign Supercharger", city: "Champaign", state: "IL", stalls: 8, kw: 150, address: "2000 N Neil St" },
  { lat: 41.5236, lng: -88.0816, name: "Joliet Supercharger", city: "Joliet", state: "IL", stalls: 10, kw: 250, address: "1401 Renaissance Dr" },
  { lat: 47.0379, lng: -122.9007, name: "Olympia Supercharger", city: "Olympia", state: "WA", stalls: 8, kw: 150, address: "625 Black Lake Blvd" },
  { lat: 30.4515, lng: -91.1871, name: "Baton Rouge Supercharger", city: "Baton Rouge", state: "LA", stalls: 10, kw: 250, address: "6401 Bluebonnet Blvd" },
  { lat: 30.4213, lng: -87.2169, name: "Pensacola Supercharger", city: "Pensacola", state: "FL", stalls: 8, kw: 150, address: "5100 N Davis Hwy" },
  { lat: 43.5446, lng: -96.7311, name: "Sioux Falls Supercharger", city: "Sioux Falls", state: "SD", stalls: 8, kw: 150, address: "5000 S Louise Ave" },
  { lat: 46.8772, lng: -96.7898, name: "Fargo Supercharger", city: "Fargo", state: "ND", stalls: 8, kw: 150, address: "5680 23rd Ave S" },
];

// ─── Styles ───────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
:root{
  --bg:#fff;--fg:#1a1d21;--muted:#5c5e62;--muted-40:rgba(92,94,98,0.4);
  --border:#e5e5e5;--secondary:#f5f5f5;--accent:#3366ff;--accent-hover:#2952cc;
  --btn-dark:rgba(57,60,65,0.85);--btn-dark-hover:#393c41;
  --btn-light:rgba(245,245,245,0.9);--btn-light-hover:#f5f5f5;
  --font:'Montserrat',sans-serif;
}
html{scroll-behavior:smooth}
body{font-family:var(--font);background:var(--bg);color:var(--fg)}
.nav{position:fixed;top:0;left:0;right:0;z-index:100;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:0 24px;height:52px;background:#ffffff;border-bottom:1px solid rgba(0,0,0,0.1);}
.nav-logo{font-size:13px;font-weight:700;letter-spacing:0.25em;text-decoration:none;color:#1a1d21;font-family:var(--font);justify-self:start;}
.nav-center{display:flex;gap:0;justify-self:center;}
.nav-center a{font-size:13px;font-weight:400;color:rgba(26,29,33,0.82);text-decoration:none;padding:6px 14px;border-radius:4px;transition:background .15s,color .15s;white-space:nowrap;}
.nav-center a:hover{background:rgba(0,0,0,0.06);color:#1a1d21}
.nav-right{display:flex;align-items:center;gap:2px;justify-self:end;}
.nav-icon{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;border:none;background:none;cursor:pointer;color:rgba(26,29,33,0.7);transition:background .15s,color .15s;}
.nav-icon:hover{background:rgba(0,0,0,0.07);color:#1a1d21}
.hero{position:relative;width:100%;height:100vh;overflow:hidden;background:#000}
.hero-slide{position:absolute;inset:0;transition:opacity 1.2s ease}
.hero-slide img{width:100%;height:100%;object-fit:cover;display:block}
.hero-grad{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.06) 0%,rgba(0,0,0,0.01) 40%,rgba(0,0,0,0.58) 100%)}
.fsd-wrap{position:absolute;inset:0;overflow:hidden}
.fsd-wrap img{width:100%;height:100%;object-fit:cover;filter:brightness(0.82)}
.fsd-tint{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(4,10,4,0.55) 0%,rgba(4,10,4,0.08) 42%,rgba(0,0,0,0.7) 100%)}
.fsd-screen{position:absolute;top:50%;left:50%;transform:translate(-50%,-44%);width:210px;height:148px;background:#0b0f16;border-radius:8px;border:1px solid rgba(255,255,255,0.18);overflow:hidden;box-shadow:0 0 48px rgba(0,90,255,0.22)}
.fsd-wheel{position:absolute;bottom:-90px;left:50%;transform:translateX(-50%);width:360px;height:360px;opacity:0.42;pointer-events:none}
.hero-ui{position:absolute;inset:0;z-index:5;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:100px 24px 54px;pointer-events:none}
.hero-text{text-align:center;color:#fff;text-shadow:0 2px 24px rgba(0,0,0,0.4)}
.hero-tag{font-size:12px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;opacity:0.82;margin-bottom:8px;min-height:16px}
.hero-title{font-size:clamp(2rem,5.5vw,3.8rem);font-weight:700;line-height:1.08;letter-spacing:-0.02em;margin-bottom:9px}
.hero-sub{font-size:clamp(13px,1.8vw,16px);color:rgba(255,255,255,0.75)}
.hero-bottom{display:flex;flex-direction:column;align-items:center;gap:18px;pointer-events:all}
.hero-btns{display:flex;gap:12px}
.btn-primary{padding:11px 28px;font-size:13.5px;font-weight:500;border-radius:4px;border:none;cursor:pointer;background:var(--btn-dark);color:#fff;font-family:var(--font);backdrop-filter:blur(8px);transition:background .2s}
.btn-primary:hover{background:var(--btn-dark-hover)}
.btn-secondary{padding:11px 28px;font-size:13.5px;font-weight:500;border-radius:4px;border:none;cursor:pointer;background:var(--btn-light);color:var(--fg);font-family:var(--font);backdrop-filter:blur(8px);transition:background .2s}
.btn-secondary:hover{background:var(--btn-light-hover)}
.btn-accent{padding:11px 28px;font-size:13.5px;font-weight:500;border-radius:4px;border:none;cursor:pointer;background:var(--accent);color:#fff;font-family:var(--font);transition:background .2s}
.btn-accent:hover{background:var(--accent-hover)}
.hero-dots{display:flex;gap:9px}
.hero-dot{width:9px;height:9px;border-radius:50%;border:none;cursor:pointer;transition:background .3s,transform .2s}
.hero-dot:hover{transform:scale(1.3)}
.hero-arrow{position:absolute;top:50%;transform:translateY(-50%);z-index:6;background:rgba(255,255,255,0.13);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,0.22);color:rgba(255,255,255,0.9);font-size:26px;cursor:pointer;width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:all .2s;pointer-events:all}
.hero-arrow:hover{background:rgba(255,255,255,0.28)}
.hero-arrow.left{left:20px}
.hero-arrow.right{right:20px}
.pause-btn{position:absolute;bottom:26px;left:26px;z-index:6;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);color:#fff;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:10px;pointer-events:all;backdrop-filter:blur(4px)}
.features{padding:64px 20px;background:var(--bg)}
.features-grid{max-width:1280px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:24px}
.feature-card{position:relative;border-radius:4px;overflow:hidden}
.feature-card img{width:100%;aspect-ratio:16/9;object-fit:cover;transition:transform .7s}
.feature-card:hover img{transform:scale(1.05)}
.feature-card .overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(26,29,33,0.6),transparent)}
.feature-card .info{position:absolute;bottom:32px;left:32px}
.feature-card h3{font-size:clamp(1.2rem,3vw,1.8rem);font-weight:700;color:#fff;margin-bottom:4px}
.feature-card p{font-size:14px;color:rgba(255,255,255,0.8);margin-bottom:16px}
.feature-card .btns{display:flex;gap:12px}
.energy{padding:64px 20px;background:var(--bg)}
.energy-card{position:relative;border-radius:4px;overflow:hidden}
.energy-card img{width:100%;aspect-ratio:16/9;object-fit:cover;transition:transform .7s}
.energy-card:hover img{transform:scale(1.05)}
.energy-card .overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(26,29,33,0.6),transparent)}
.energy-card .info{position:absolute;bottom:32px;left:32px}
.energy-card h3{font-size:clamp(1.2rem,3vw,1.8rem);font-weight:700;color:#fff;margin-bottom:4px}
.energy-card p{font-size:14px;color:rgba(255,255,255,0.8);margin-bottom:16px}
.energy-card .btns{display:flex;gap:12px}
.footer{padding:32px 20px;border-top:1px solid var(--border)}
.footer-inner{max-width:1280px;margin:0 auto}
.footer-note{font-size:12px;color:var(--muted);margin-bottom:24px}
.footer-links{display:flex;flex-wrap:wrap;justify-content:center;gap:16px;font-size:12px;color:var(--muted)}
.footer-links a{color:var(--muted);text-decoration:none;transition:color .2s}
.footer-links a:hover{color:var(--fg)}
/* Map popup */
.tesla-popup .leaflet-popup-content-wrapper{border-radius:12px;box-shadow:0 10px 40px rgba(0,0,0,0.12);border:1px solid rgba(0,0,0,0.06);padding:0}
.tesla-popup .leaflet-popup-content{margin:8px;min-width:220px}
.leaflet-control-zoom{display:none!important}
@media(max-width:768px){
  .nav-center{display:none}
  .features-grid{grid-template-columns:1fr}
}
`;

// ─── Images ───────────────────────────────────────────────────────────────────
const IMAGES = {
  heroModel3: "https://static.vecteezy.com/system/resources/thumbnails/055/672/799/small/red-modern-red-sport-car-driving-fast-on-scenic-road-in-forest-at-sunset-automotive-background-tuning-template-auto-transport-photo.jpg",
  heroModelS: "https://i.insider.com/592f4169b74af41b008b5977?width=1200&format=jpeg",
  heroFsd:    "https://cdn.aarp.net/content/dam/aarp/auto/2018/10/1140-self-driving-car.jpg",
  features:   "https://cdn.punchng.com/wp-content/uploads/2018/01/03092606/Luxury-cars.jpg",
  fsdVision:  "https://static.vecteezy.com/system/resources/previews/040/742/444/large_2x/yong-pretty-woman-standing-near-a-big-all-terrain-car-outdoors-driver-girl-in-casual-clothes-outside-her-vehicle-photo.jpg",
  solar:      "https://media.wired.com/photos/66f6d9e8edd5b22be7017791/16:9/w_4336,h_2439,c_limit/GettyImages-1681913304.jpg",
  powerwall:  "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80",
};

const HERO_SLIDES = [
  { type:"image", image:IMAGES.heroModel3, tag:"Sport Sedan",       title:"Model 3", subtitle:"0.99% APR Available",           primaryBtn:"Order Now",            secondaryBtn:"View Inventory", accent:false },
  { type:"image", image:IMAGES.heroModelS, tag:"Performance Sedan", title:"Model S", subtitle:"Ludicrous Mode. 0–60 in 1.99s", primaryBtn:"Order Now",            secondaryBtn:"View Inventory", accent:false },
  { type:"fsd",   image:IMAGES.heroFsd,    tag:"",                  title:"Full Self-Driving (Supervised)", subtitle:"Available for $99/mo¹", primaryBtn:"Demo FSD (Supervised)", secondaryBtn:"Learn More", accent:true },
];

const VEHICLES = [
  { image:"https://static0.hotcarsimages.com/wordpress/wp-content/uploads/2022/07/2022_Lexus_IS_350_001-Cropped.jpg", tag:"Sport Sedan", title:"Model 3" },
  { image:"https://cdn.jdpower.com/JDPA_2020%20Chevrolet%20Blazer%20RS%20Red%20Front%20View.jpg", tag:"Midsize SUV", title:"Model Y" },
  { image:"https://torquecafe.b-cdn.net/wp-content/uploads/2025/01/2025-BMW-M5_1.jpg", tag:"Performance Sedan", title:"Model S" },
  { image:"https://www.apetogentleman.com/wp-content/uploads/2021/05/bestsuvsmain3.jpg", tag:"Performance SUV", title:"Model X" },
  { image:"https://carlots.ng/oc-content/uploads/blog/blog/58.jpg", tag:"Full-Size Truck", title:"Cybertruck" },
];

// ─── Map Sub-components ───────────────────────────────────────────────────────
function StationPopup({ station }) {
  return (
    <div style={{ minWidth: 220, padding: 4 }}>
      <div style={{ display:"flex", alignItems:"flex-start", gap:8, marginBottom:8 }}>
        <div style={{ background:"#fef2f2", borderRadius:6, padding:4 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        </div>
        <div>
          <p style={{ margin:0, fontWeight:600, fontSize:13, color:"#111" }}>{station.name}</p>
          <p style={{ margin:"2px 0 0", fontSize:11, color:"#888" }}>{station.city}, {station.state}</p>
        </div>
      </div>
      <div style={{ fontSize:12, color:"#555", lineHeight:"1.8", marginBottom:10 }}>
        <div>⚡ {station.stalls} Superchargers · {station.kw}kW</div>
        <div>🕐 Open 24/7</div>
        <div>📍 {station.address}</div>
      </div>
      <button style={{ width:"100%", background:"#111", color:"#fff", border:"none", borderRadius:6, padding:"7px 0", fontSize:12, fontWeight:500, cursor:"pointer" }}>
        Get Directions ›
      </button>
    </div>
  );
}

function ZoomControls() {
  const map = useMap();
  const btn = { background:"#fff", width:36, height:36, border:"1px solid #e5e7eb", borderRadius:6, boxShadow:"0 2px 6px rgba(0,0,0,0.1)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, color:"#374151" };
  return (
    <div style={{ position:"absolute", bottom:24, right:16, zIndex:1000, display:"flex", flexDirection:"column", gap:4 }}>
      <button style={btn} onClick={() => map.zoomIn()}>+</button>
      <button style={btn} onClick={() => map.zoomOut()}>−</button>
    </div>
  );
}

function SearchOverlay({ stations }) {
  const map = useMap();
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  const filtered = query.length > 1
    ? stations.filter(s =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.city.toLowerCase().includes(query.toLowerCase()) ||
        s.state.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : [];

  const handleSelect = (station) => {
    map.flyTo([station.lat, station.lng], 12, { duration: 1.5 });
    setQuery(""); setShowResults(false);
  };

  return (
    <div style={{ position:"absolute", top:16, left:16, zIndex:1000, width:280 }}>
      <div style={{ position:"relative" }}>
        <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"#9ca3af", pointerEvents:"none" }}>🔍</span>
        <input
          type="text"
          placeholder="Search Superchargers..."
          value={query}
          onChange={e => { setQuery(e.target.value); setShowResults(true); }}
          onFocus={() => setShowResults(true)}
          style={{ width:"100%", paddingLeft:34, paddingRight:query?34:12, paddingTop:9, paddingBottom:9, background:"#fff", border:"1px solid #e5e7eb", borderRadius:8, boxShadow:"0 4px 16px rgba(0,0,0,0.1)", fontSize:13, outline:"none", boxSizing:"border-box" }}
        />
        {query && (
          <button onClick={() => { setQuery(""); setShowResults(false); }} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#9ca3af", fontSize:16 }}>×</button>
        )}
      </div>
      {showResults && filtered.length > 0 && (
        <div style={{ marginTop:4, background:"#fff", border:"1px solid #e5e7eb", borderRadius:8, boxShadow:"0 4px 16px rgba(0,0,0,0.1)", maxHeight:240, overflowY:"auto" }}>
          {filtered.map((station, i) => (
            <button key={i} onClick={() => handleSelect(station)}
              style={{ width:"100%", textAlign:"left", padding:"9px 14px", background:"none", border:"none", borderBottom: i < filtered.length-1?"1px solid #f3f4f6":"none", cursor:"pointer", display:"flex", alignItems:"center", gap:10 }}
              onMouseOver={e => e.currentTarget.style.background="#f9fafb"}
              onMouseOut={e => e.currentTarget.style.background="none"}
            >
              <div style={{ background:"#fef2f2", borderRadius:4, padding:5 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              </div>
              <div>
                <p style={{ margin:0, fontSize:13, fontWeight:500, color:"#111" }}>{station.city}, {station.state}</p>
                <p style={{ margin:0, fontSize:11, color:"#888" }}>{station.stalls} stalls · {station.kw}kW</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── FSD Canvas ───────────────────────────────────────────────────────────────
function FSDScreen() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let t = 0, raf;
    function draw() {
      const W = 210, H = 148;
      ctx.fillStyle = "#0a0e18"; ctx.fillRect(0,0,W,H);
      ctx.fillStyle = "#111827"; ctx.fillRect(0,0,W,55);
      const hg = ctx.createLinearGradient(0,42,0,58);
      hg.addColorStop(0,"rgba(30,80,180,0)"); hg.addColorStop(.5,"rgba(30,80,180,0.18)"); hg.addColorStop(1,"rgba(30,80,180,0)");
      ctx.fillStyle = hg; ctx.fillRect(0,42,W,16);
      ctx.fillStyle = "#171e2e";
      ctx.beginPath(); ctx.moveTo(52,H); ctx.lineTo(76,56); ctx.lineTo(134,56); ctx.lineTo(158,H); ctx.closePath(); ctx.fill();
      ctx.strokeStyle="rgba(255,255,255,0.2)"; ctx.lineWidth=.8; ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(52,H); ctx.lineTo(76,56); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(158,H); ctx.lineTo(134,56); ctx.stroke();
      const off=(t*2.4)%18;
      for(let y=H;y>58;y-=18){const p=(y-58)/(H-58);ctx.strokeStyle=`rgba(255,210,0,${0.55*p})`;ctx.lineWidth=1.2*p;ctx.setLineDash([7*p,11*p]);ctx.lineDashOffset=-off*p;ctx.beginPath();ctx.moveTo(W/2,y);ctx.lineTo(W/2,y-7*p);ctx.stroke();}
      ctx.setLineDash([]); ctx.lineDashOffset=0;
      ctx.fillStyle="rgba(20,40,20,0.6)";ctx.beginPath();ctx.ellipse(22,60,18,30,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(188,58,16,28,0,0,Math.PI*2);ctx.fill();
      const lx=88+Math.sin(t*.04)*2,ly=62+Math.sin(t*.03)*2;ctx.strokeStyle="rgba(70,160,255,0.92)";ctx.lineWidth=1.3;ctx.strokeRect(lx,ly,20,12);
      ctx.fillStyle="rgba(255,60,60,0.8)";ctx.fillRect(lx,ly+1,3,4);ctx.fillRect(lx+17,ly+1,3,4);
      ctx.strokeStyle="rgba(70,160,255,0.2)";ctx.lineWidth=.5;ctx.strokeRect(lx-2,ly+12,24,3);
      const sx=118+Math.sin(t*.025+1)*1.5;ctx.strokeStyle="rgba(70,160,255,0.8)";ctx.lineWidth=1.2;ctx.strokeRect(sx,72,18,11);
      const ex=87,ey=112;ctx.strokeStyle="rgba(60,220,110,0.96)";ctx.lineWidth=1.6;ctx.strokeRect(ex,ey,26,18);ctx.fillStyle="rgba(60,220,110,0.08)";ctx.fillRect(ex,ey,26,18);
      ctx.fillStyle="rgba(220,230,255,0.7)";ctx.fillRect(ex+1,ey,5,3);ctx.fillRect(ex+20,ey,5,3);
      ctx.strokeStyle="rgba(60,220,110,0.55)";ctx.lineWidth=1.1;ctx.setLineDash([3,6]);ctx.beginPath();ctx.moveTo(ex+13,ey);ctx.quadraticCurveTo(W/2,92,W/2,58);ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle="rgba(255,255,255,0.6)";ctx.font="bold 10px sans-serif";ctx.textAlign="right";ctx.fillText("72",W-6,H-14);ctx.font="7px sans-serif";ctx.fillStyle="rgba(255,255,255,.32)";ctx.fillText("mph",W-6,H-6);ctx.textAlign="left";
      ctx.fillStyle="rgba(60,220,110,0.8)";ctx.font="bold 7px sans-serif";ctx.fillText("FSD",6,12);ctx.fillStyle="rgba(60,220,110,0.9)";ctx.beginPath();ctx.arc(6,H-8,3.5,0,Math.PI*2);ctx.fill();
      t++; raf=requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={canvasRef} width={210} height={148} style={{display:"block",width:"100%",height:"100%"}} />;
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
const NAV_LINK = { fontSize:"13px", fontWeight:"400", color:"rgba(26,29,33,0.82)", textDecoration:"none", padding:"6px 10px", borderRadius:"4px", whiteSpace:"nowrap", fontFamily:"'Montserrat',sans-serif", cursor:"pointer" };
const ICON_BTN = { display:"flex", alignItems:"center", justifyContent:"center", width:"36px", height:"36px", borderRadius:"50%", border:"none", background:"none", cursor:"pointer", color:"rgba(26,29,33,0.72)", flexShrink:0 };

function Navbar() {
  return (
    <header style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, display:"grid", gridTemplateColumns:"200px 1fr 200px", alignItems:"center", padding:"0 40px", height:"52px", background:"#ffffff", borderBottom:"1px solid rgba(0,0,0,0.1)" }}>
      <a href="#" style={{ fontSize:"13px", fontWeight:"700", letterSpacing:"0.18em", textDecoration:"none", color:"#1a1d21", fontFamily:"'Montserrat',sans-serif", justifySelf:"start", whiteSpace:"nowrap" }}>TESLA</a>
      <nav style={{ display:"flex", gap:"0", justifyContent:"center" }}>
        {["Vehicles","Energy","Charging","Discover","Shop"].map(link => (
          <a key={link} href="#" style={NAV_LINK}>{link}</a>
        ))}
      </nav>
      <div style={{ display:"flex", alignItems:"center", gap:"2px", justifySelf:"end" }}>
        <button style={ICON_BTN} title="Help">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </button>
        <button style={ICON_BTN} title="Language">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        </button>
        <button style={ICON_BTN} title="Account">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </button>
      </div>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);
  useEffect(() => {
    clearInterval(timerRef.current);
    if (!paused) timerRef.current = setInterval(() => setIdx(i => (i+1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(timerRef.current);
  }, [paused]);
  const slide = HERO_SLIDES[idx];
  return (
    <section className="hero">
      <div className="hero-slide" style={{ opacity: idx===0?1:0 }}><img src={IMAGES.heroModel3} alt="Model 3" /><div className="hero-grad"/></div>
      <div className="hero-slide" style={{ opacity: idx===1?1:0 }}><img src={IMAGES.heroModelS} alt="Model S" /><div className="hero-grad"/></div>
      <div className="hero-slide" style={{ opacity: idx===2?1:0 }}>
        <div className="fsd-wrap">
          <img src={IMAGES.heroFsd} alt="FSD" /><div className="fsd-tint"/>
          <div className="fsd-screen"><FSDScreen/></div>
          <div className="fsd-wheel">
            <svg viewBox="0 0 360 360" fill="none">
              <circle cx="180" cy="180" r="163" stroke="rgba(255,255,255,0.65)" strokeWidth="22"/>
              <line x1="180" y1="17" x2="180" y2="107" stroke="rgba(255,255,255,0.52)" strokeWidth="19" strokeLinecap="round"/>
              <line x1="31" y1="255" x2="107" y2="213" stroke="rgba(255,255,255,0.52)" strokeWidth="19" strokeLinecap="round"/>
              <line x1="329" y1="255" x2="253" y2="213" stroke="rgba(255,255,255,0.52)" strokeWidth="19" strokeLinecap="round"/>
              <circle cx="180" cy="180" r="37" fill="rgba(25,25,25,0.92)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
              <text x="180" y="188" textAnchor="middle" fontSize="24" fill="rgba(255,255,255,0.82)" fontFamily="Montserrat,sans-serif" fontWeight="600">T</text>
            </svg>
          </div>
        </div>
      </div>
      <div className="hero-ui">
        <div className="hero-text">
          <div className="hero-tag">{slide.tag}</div>
          <div className="hero-title">{slide.title}</div>
          <div className="hero-sub">{slide.subtitle}</div>
        </div>
        <div className="hero-bottom">
          <div className="hero-btns">
            <button className={slide.accent?"btn-accent":"btn-primary"}>{slide.primaryBtn}</button>
            <button className="btn-secondary">{slide.secondaryBtn}</button>
          </div>
          <div className="hero-dots">
            {HERO_SLIDES.map((_,i) => <button key={i} className="hero-dot" onClick={() => setIdx(i)} style={{ background: i===idx?"#fff":"rgba(255,255,255,0.38)" }}/>)}
          </div>
        </div>
      </div>
      <button className="hero-arrow left" onClick={() => setIdx(i => (i-1+HERO_SLIDES.length)%HERO_SLIDES.length)}>‹</button>
      <button className="hero-arrow right" onClick={() => setIdx(i => (i+1)%HERO_SLIDES.length)}>›</button>
      <button className="pause-btn" onClick={() => setPaused(p=>!p)}>{paused?"▶":"⏸"}</button>
    </section>
  );
}

// ─── Vehicle Showcase ─────────────────────────────────────────────────────────
function VehicleShowcase() {
  const [idx, setIdx] = useState(0);
  const current = VEHICLES[idx];
  const next = VEHICLES[(idx+1)%VEHICLES.length];
  return (
    <section style={{ background:"#fff" }}>
      <div style={{ maxWidth:"1280px", margin:"0 auto", padding:"16px 16px 0" }}>
        <div style={{ display:"flex", gap:"10px", height:"460px" }}>
          <div style={{ position:"relative", flex:1, borderRadius:"8px", overflow:"hidden", cursor:"pointer" }}>
            <img src={current.image} alt={current.title} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
            <span style={{ position:"absolute", top:"20px", left:"20px", fontSize:"14px", fontWeight:"500", color:"#fff", textShadow:"0 1px 4px rgba(0,0,0,0.4)", fontFamily:"'Montserrat',sans-serif" }}>{current.tag}</span>
            <h2 style={{ position:"absolute", bottom:"24px", left:"24px", fontSize:"clamp(2rem,4vw,3rem)", fontWeight:"600", color:"#fff", textShadow:"0 2px 12px rgba(0,0,0,0.4)", fontFamily:"'Montserrat',sans-serif", margin:0 }}>{current.title}</h2>
          </div>
          <div onClick={() => setIdx(i => (i+1)%VEHICLES.length)} style={{ position:"relative", width:"200px", borderRadius:"8px", overflow:"hidden", cursor:"pointer", flexShrink:0 }}>
            <img src={next.image} alt={next.title} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
            <span style={{ position:"absolute", top:"16px", left:"16px", fontSize:"12px", fontWeight:"500", color:"#fff", fontFamily:"'Montserrat',sans-serif" }}>{next.tag}</span>
            <h3 style={{ position:"absolute", bottom:"16px", left:"16px", fontSize:"22px", fontWeight:"600", color:"#fff", fontFamily:"'Montserrat',sans-serif", margin:0 }}>{next.title}</h3>
            <button style={{ position:"absolute", right:"12px", top:"50%", transform:"translateY(-50%)", width:"32px", height:"32px", borderRadius:"50%", background:"rgba(255,255,255,0.25)", border:"1px solid rgba(255,255,255,0.4)", color:"#fff", fontSize:"20px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>›</button>
          </div>
        </div>
      </div>
      <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:"12px", padding:"20px 0", background:"#f5f5f5" }}>
        {VEHICLES.map((_,i) => <button key={i} onClick={() => setIdx(i)} style={{ width:"11px", height:"11px", borderRadius:"50%", border:"none", cursor:"pointer", transition:"background .3s", padding:0, background: i===idx?"#1a1d21":"rgba(92,94,98,0.32)" }}/>)}
      </div>
    </section>
  );
}

// ─── Offers ───────────────────────────────────────────────────────────────────
function Offers() {
  const CARD = { background:"#fff", borderRadius:"6px", overflow:"hidden", display:"flex", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" };
  const TEXT = { padding:"32px 28px", flex:1, display:"flex", flexDirection:"column", justifyContent:"center" };
  const H3 = { fontSize:"22px", fontWeight:"700", color:"#1a1d21", marginBottom:"10px", fontFamily:"'Montserrat',sans-serif" };
  const P = { fontSize:"14px", color:"#5c5e62", marginBottom:"24px", lineHeight:"1.6", fontFamily:"'Montserrat',sans-serif" };
  const BTN = { display:"inline-block", padding:"9px 20px", fontSize:"13px", fontWeight:"500", border:"1px solid #1a1d21", borderRadius:"4px", background:"#fff", color:"#1a1d21", cursor:"pointer", fontFamily:"'Montserrat',sans-serif" };
  const IMG = { width:"220px", flexShrink:0, overflow:"hidden" };
  return (
    <section style={{ padding:"48px 20px", background:"#f5f5f5" }}>
      <div style={{ maxWidth:"1280px", margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px" }}>
        <div style={CARD}>
          <div style={TEXT}><h3 style={H3}>Current Offers</h3><p style={P}>Explore limited-time offers on Tesla vehicles.</p><button style={BTN}>Learn More</button></div>
          <div style={IMG}><img src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&q=85" alt="Offers" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/></div>
        </div>
        <div style={CARD}>
          <div style={TEXT}><h3 style={H3}>American Heroes</h3><p style={P}>$500 off for military, first responders, healthcare, teachers and students.</p><button style={BTN}>Learn More</button></div>
          <div style={IMG}><img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=85" alt="Heroes" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/></div>
        </div>
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────
function Features() {
  return (
    <section className="features">
      <div className="features-grid">
        <div className="feature-card">
          <img src={IMAGES.features} alt="Standard Features"/>
          <div className="overlay"/>
          <div className="info">
            <h3>Standard Features</h3><p>Autopilot & premium connectivity included</p>
            <div className="btns">
              <button className="btn-accent" style={{ fontSize:12, padding:"8px 16px" }}>Order Now</button>
              <button className="btn-secondary" style={{ fontSize:12, padding:"8px 16px" }}>Learn More</button>
            </div>
          </div>
        </div>
        <div className="feature-card">
          <img src={IMAGES.fsdVision} alt="FSD"/>
          <div className="overlay"/>
          <div className="info">
            <h3>Full Self-Driving</h3><p>Navigate on Autopilot</p>
            <div className="btns">
              <button className="btn-accent" style={{ fontSize:12, padding:"8px 16px" }}>Order Now</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Charging (with embedded map) ────────────────────────────────────────────
function Charging() {
  return (
    <section style={{ background:"#fff", padding:"0" }}>

      {/* ── Interactive Map ── */}
      <div style={{ position:"relative", width:"100%", height:"480px" }}>
        <MapContainer center={[39.5, -98.35]} zoom={4} style={{ height:"100%", width:"100%" }} zoomControl={false} attributionControl={false}>
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"/>
          {superchargerStations.map((station, i) => (
            <CircleMarker key={i} center={[station.lat, station.lng]} radius={5}
              pathOptions={{ fillColor:"#e12d39", fillOpacity:0.85, color:"#e12d39", weight:1.5, opacity:0.9 }}
            >
              <Popup closeButton={false} className="tesla-popup" offset={[0,-4]}>
                <StationPopup station={station}/>
              </Popup>
            </CircleMarker>
          ))}
          <SearchOverlay stations={superchargerStations}/>
          <ZoomControls/>
        </MapContainer>
      </div>

      {/* ── Info Bar ── */}
      <div style={{ padding:"32px 40px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"24px", background:"#fff", borderBottom:"1px solid #e5e5e5" }}>
        <div style={{ maxWidth:"480px" }}>
          <h2 style={{ fontSize:"clamp(1.6rem,3.5vw,2.2rem)", fontWeight:"700", color:"#1a1d21", marginBottom:"8px", fontFamily:"'Montserrat',sans-serif" }}>Find Your Charge</h2>
          <p style={{ fontSize:"14px", color:"#5c5e62", lineHeight:"1.6", fontFamily:"'Montserrat',sans-serif", margin:0 }}>
            View the network of Tesla Superchargers and Destination Chargers available near you.
          </p>
          <div style={{ display:"flex", gap:"12px", marginTop:"20px" }}>
            <button style={{ padding:"10px 22px", fontSize:"13px", fontWeight:"600", background:"#1a1d21", color:"#fff", border:"none", borderRadius:"4px", cursor:"pointer", fontFamily:"'Montserrat',sans-serif" }}>View Network</button>
            <button style={{ padding:"10px 22px", fontSize:"13px", fontWeight:"500", background:"transparent", color:"#1a1d21", border:"1px solid transparent", borderRadius:"4px", cursor:"pointer", fontFamily:"'Montserrat',sans-serif" }}>Learn More</button>
          </div>
        </div>
        <div style={{ display:"flex", gap:"40px", flexShrink:0 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
              <span style={{ fontSize:"clamp(1.6rem,3vw,2rem)", fontWeight:"700", color:"#1a1d21", fontFamily:"'Montserrat',sans-serif" }}>31,461</span>
              <span style={{ width:"26px", height:"26px", background:"#e31937", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="#fff"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </span>
            </div>
            <p style={{ fontSize:"13px", color:"#5c5e62", margin:"4px 0 0", fontFamily:"'Montserrat',sans-serif" }}>Superchargers</p>
          </div>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
              <span style={{ fontSize:"clamp(1.6rem,3vw,2rem)", fontWeight:"700", color:"#1a1d21", fontFamily:"'Montserrat',sans-serif" }}>412</span>
              <span style={{ width:"26px", height:"26px", background:"#1a1d21", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/></svg>
              </span>
            </div>
            <p style={{ fontSize:"13px", color:"#5c5e62", margin:"4px 0 0", fontFamily:"'Montserrat',sans-serif" }}>Destination<br/>Chargers</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Energy ───────────────────────────────────────────────────────────────────
const ENERGY_CARDS = [
  { key:"solar",     title:"Solar Panels", subtitle:"Power Your Home and Reduce Your Bill" },
  { key:"powerwall", title:"Powerwall",    subtitle:"Keep Your Lights On During Outages"   },
];
function Energy() {
  const [dot, setDot] = useState(0);
  return (
    <section className="energy">
      <div style={{ maxWidth:"1280px", margin:"0 auto", padding:"64px 20px 0" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px" }}>
          {ENERGY_CARDS.map((card,i) => (
            <div key={i} className="energy-card">
              <img src={IMAGES[card.key]} alt={card.title}/>
              <div className="overlay"/>
              <div className="info">
                <h3>{card.title}</h3><p>{card.subtitle}</p>
                <div className="btns">
                  <button className="btn-accent" style={{ fontSize:12, padding:"8px 16px" }}>Order Now</button>
                  <button className="btn-secondary" style={{ fontSize:12, padding:"8px 16px" }}>Learn More</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:"12px", padding:"20px 0 28px" }}>
        {[0,1,2,3].map(i => <button key={i} onClick={() => setDot(i)} style={{ width:"11px", height:"11px", borderRadius:"50%", border:"none", cursor:"pointer", transition:"background .3s", padding:0, background: i===dot?"#1a1d21":"rgba(92,94,98,0.32)" }}/>)}
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p className="footer-note">¹ Price reflects monthly subscription, subject to terms and conditions.</p>
        <div className="footer-links">
          <span>Tesla © 2026</span>
          <a href="#">Privacy & Legal</a><a href="#">Vehicle Recalls</a>
          <a href="#">Contact</a><a href="#">News</a>
          <a href="#">Get Updates</a><a href="#">Locations</a>
        </div>
      </div>
    </footer>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  useEffect(() => {
    if (!document.getElementById("tesla-styles")) {
      const tag = document.createElement("style");
      tag.id = "tesla-styles";
      tag.textContent = css;
      document.head.appendChild(tag);
    }
  }, []);

  return (
    <>
      <Navbar/>
      <Hero/>
      <VehicleShowcase/>
      <Offers/>
      <Features/>
      <Charging/>
      <Energy/>
      <Footer/>
    </>
  );
}











