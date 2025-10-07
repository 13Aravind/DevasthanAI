# 🏛️ DevasthanAI - Digital Sanctuary

DevasthanAI is a comprehensive, AI-powered ecosystem designed for the complete management of large-scale pilgrimage sites like Somnath and Dwarka. It moves beyond simple crowd counting to become a "Digital Sanctuary" that ensures pilgrim safety, provides a serene spiritual experience, and empowers organizers with predictive, actionable intelligence.

## 🌟 Features

### For Administrators (Divya Drishti Dashboard)
- **Live Dashboard**: Real-time crowd monitoring with video feed and live heatmap
- **Analytics & Forecasting**: Historical data analysis and 12-hour crowd predictions
- **Emergency Management**: SOS alert system with location tracking and response management
- **Digital Twin**: 3D visualization of temple premises (placeholder)
- **Prescriptive Alerts**: AI-powered suggestions for crowd management

### For Pilgrims (Yatra Sahayak Portal)
- **Peace-of-Mind Meter**: Real-time crowd status and wait time estimation
- **Darshan Booking**: Online slot booking with QR code generation
- **My Yatra Plan**: Personal booking management and QR code access
- **Temple Map**: Interactive map with facility locations
- **SOS Button**: Emergency assistance with location sharing

### AI & Automation
- **Sutradhar Orchestration Engine**: Rule-based system for automated responses
- **Real-time Data Processing**: WebSocket-based live updates
- **Predictive Analytics**: Crowd forecasting with confidence levels
- **Intelligent Alerts**: Context-aware recommendations for administrators

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   AI Simulator  │    │   Backend API   │    │  React Frontend │
│                 │    │   (FastAPI)     │    │   (Material-UI) │
│ - Crowd Data    │───▶│ - Authentication│◀───│ - Admin Dashboard│
│ - Real-time     │    │ - WebSockets    │    │ - Pilgrim Portal│
│ - Simulation    │    │ - Sutradhar     │    │ - Mobile-First  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   PostgreSQL    │
                       │  + TimescaleDB  │
                       │                 │
                       │ - Crowd Data    │
                       │ - User Accounts │
                       │ - SOS Alerts    │
                       │ - Tickets       │
                       └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+**
- **Node.js 16+**
- **PostgreSQL 12+**
- **TimescaleDB Extension**

### 1. Database Setup

#### Install PostgreSQL and TimescaleDB

**Ubuntu/Debian:**
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Install TimescaleDB
sudo sh -c "echo 'deb https://packagecloud.io/timescale/timescaledb/ubuntu/ $(lsb_release -c -s) main' > /etc/apt/sources.list.d/timescaledb.list"
wget --quiet -O - https://packagecloud.io/timescale/timescaledb/gpgkey | sudo apt-key add -
sudo apt update
sudo apt install timescaledb-postgresql-14

# Configure TimescaleDB
sudo timescaledb-tune --quiet --yes
sudo systemctl restart postgresql
```

**macOS:**
```bash
# Install using Homebrew
brew install postgresql timescaledb

# Start PostgreSQL
brew services start postgresql
```

**Windows:**
1. Download and install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Install TimescaleDB extension from [timescale.com](https://docs.timescale.com/install/latest/installation-windows/)

#### Create Database

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE devasthanai;
CREATE USER devasthanai_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE devasthanai TO devasthanai_user;
\q
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp env.example .env
# Edit .env with your database credentials:
# DATABASE_URL=postgresql://devasthanai_user:your_password@localhost:5432/devasthanai
# SECRET_KEY=your-secret-key-here

# Setup database
python setup_database.py

# Start the backend server
python run.py
```

The backend will be available at:
- **API**: http://localhost:8000
- **Documentation**: http://localhost:8000/docs
- **WebSocket**: ws://localhost:8000/ws/live

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will be available at:
- **Admin Dashboard**: http://localhost:3000/admin/login
- **Pilgrim Portal**: http://localhost:3000/pilgrim/home

### 4. AI Simulator

```bash
# In a new terminal, navigate to backend directory
cd backend

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Run the AI simulator
python ai_simulator.py
```

## 🔐 Default Credentials

### Admin Access
- **Username**: `admin`
- **Password**: `admin123`
- **URL**: http://localhost:3000/admin/login

### Pilgrim Registration
- Visit: http://localhost:3000/pilgrim/home
- Click "Register" tab to create a new account

## 📱 Usage Guide

### For Administrators

1. **Login to Admin Dashboard**
   - Go to http://localhost:3000/admin/login
   - Use default credentials: admin/admin123

2. **Live Dashboard**
   - Monitor real-time crowd data
   - View prescriptive alerts from Sutradhar
   - Check live heatmap of temple premises

3. **Analytics & Forecasting**
   - Review historical crowd patterns
   - View 12-hour predictions
   - Analyze crowd trends

4. **Emergency Management**
   - Monitor active SOS alerts
   - Acknowledge and resolve emergencies
   - View emergency locations on map

### For Pilgrims

1. **Access Pilgrim Portal**
   - Go to http://localhost:3000/pilgrim/home
   - Register for a new account or login

2. **Check Peace-of-Mind Meter**
   - View current crowd status
   - See estimated wait times
   - Get recommendations for best visit times

3. **Book Darshan Slot**
   - Select date and time
   - Receive QR code for entry
   - Manage bookings in "My Yatra Plan"

4. **Emergency SOS**
   - Use floating SOS button for emergencies
   - Automatic location sharing
   - Direct communication with security

## 🛠️ Development

### Project Structure

```
DevasthanAI_Project/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI application
│   │   ├── config.py            # Configuration settings
│   │   ├── database.py          # Database connection
│   │   ├── models.py            # SQLAlchemy models
│   │   ├── schemas.py           # Pydantic schemas
│   │   ├── auth.py              # Authentication logic
│   │   ├── sutradhar.py         # Orchestration engine
│   │   ├── websocket.py         # WebSocket handling
│   │   └── routers/
│   │       ├── auth.py          # Authentication endpoints
│   │       ├── crowd_data.py    # Crowd data endpoints
│   │       ├── sos.py           # SOS alert endpoints
│   │       └── tickets.py       # Ticket booking endpoints
│   ├── ai_simulator.py          # AI data simulator
│   ├── setup_database.py        # Database setup script
│   ├── run.py                   # Backend runner
│   ├── requirements.txt         # Python dependencies
│   └── prediction_data.json     # Mock prediction data
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/           # Admin dashboard components
│   │   │   ├── pilgrim/         # Pilgrim portal components
│   │   │   └── common/          # Shared components
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx  # Authentication context
│   │   ├── App.tsx              # Main application
│   │   └── index.tsx            # Application entry point
│   ├── package.json             # Node.js dependencies
│   └── tsconfig.json            # TypeScript configuration
└── README.md                    # This file
```

### API Endpoints

#### Authentication
- `POST /api/v1/auth/register` - Register new pilgrim
- `POST /api/v1/auth/login` - Pilgrim login
- `POST /api/v1/auth/admin/login` - Admin login
- `GET /api/v1/auth/me` - Get current user info

#### Crowd Data
- `POST /api/v1/crowd_data` - Submit crowd data (AI simulator)
- `GET /api/v1/live_data` - Get latest crowd count
- `GET /api/v1/prediction_data` - Get 12-hour forecast
- `GET /api/v1/crowd_data/history` - Get historical data (admin)

#### SOS Alerts
- `POST /api/v1/sos` - Send SOS alert
- `GET /api/v1/sos_alerts` - Get active alerts (admin)
- `PUT /api/v1/sos_alerts/{id}/acknowledge` - Acknowledge alert (admin)
- `PUT /api/v1/sos_alerts/{id}/resolve` - Resolve alert (admin)

#### Tickets
- `POST /api/v1/tickets/book` - Book darshan slot
- `GET /api/v1/my_tickets` - Get user's tickets
- `GET /api/v1/tickets/{id}` - Get specific ticket

#### WebSocket
- `ws://localhost:8000/ws/live` - Real-time updates

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    username VARCHAR UNIQUE NOT NULL,
    full_name VARCHAR NOT NULL,
    hashed_password VARCHAR NOT NULL,
    role VARCHAR DEFAULT 'pilgrim',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Crowd Data Table (TimescaleDB Hypertable)
```sql
CREATE TABLE crowd_data (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    location_id VARCHAR(50) NOT NULL,
    person_count INTEGER NOT NULL
);
SELECT create_hypertable('crowd_data', 'timestamp');
```

#### SOS Alerts Table
```sql
CREATE TABLE sos_alerts (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    location_lat FLOAT NOT NULL,
    location_lon FLOAT NOT NULL,
    status VARCHAR DEFAULT 'new',
    user_id INTEGER,
    description TEXT
);
```

#### Tickets Table
```sql
CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    slot_timestamp TIMESTAMPTZ NOT NULL,
    qr_code_hash VARCHAR UNIQUE NOT NULL,
    status VARCHAR DEFAULT 'booked',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/devasthanai
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend Configuration

The frontend is configured to connect to the backend at `http://localhost:8000`. To change this, update the `API_BASE_URL` in:
- `frontend/src/contexts/AuthContext.tsx`
- All API calls in components

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Error**
   ```bash
   # Check if PostgreSQL is running
   sudo systemctl status postgresql
   
   # Verify database exists
   sudo -u postgres psql -l
   ```

2. **TimescaleDB Extension Not Found**
   ```bash
   # Install TimescaleDB extension
   sudo apt install timescaledb-postgresql-14
   sudo timescaledb-tune --quiet --yes
   ```

3. **Port Already in Use**
   ```bash
   # Kill process using port 8000
   sudo lsof -ti:8000 | xargs kill -9
   
   # Or change port in run.py
   uvicorn.run(app, host="0.0.0.0", port=8001)
   ```

4. **Frontend Build Errors**
   ```bash
   # Clear npm cache
   npm cache clean --force
   
   # Delete node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

### Logs and Debugging

- **Backend logs**: Check terminal where `python run.py` is running
- **Frontend logs**: Check browser console (F12)
- **Database logs**: Check PostgreSQL logs in `/var/log/postgresql/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **FastAPI** for the robust backend framework
- **Material-UI** for the beautiful React components
- **TimescaleDB** for time-series data management
- **Leaflet** for interactive maps
- **Chart.js** for data visualization

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the troubleshooting section above
- Review the API documentation at http://localhost:8000/docs

---

**DevasthanAI** - Bringing the divine experience into the digital age 🏛️✨
