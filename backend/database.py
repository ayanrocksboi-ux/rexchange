import sqlite3
import json
import os
from passlib.context import CryptContext

DB_PATH = os.path.join(os.path.dirname(__file__), "rexchange.db")
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Users Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        student_id TEXT NOT NULL DEFAULT 'RA2311003010001',
        dept TEXT NOT NULL DEFAULT 'CSE Core',
        year TEXT NOT NULL DEFAULT '1st Year',
        hostel TEXT DEFAULT 'Paari Hostel',
        avatar_url TEXT DEFAULT '',
        karma_score INTEGER DEFAULT 1240,
        level_title TEXT DEFAULT 'Level 12 — Campus Connector',
        rex_score INTEGER DEFAULT 92,
        rating REAL DEFAULT 4.9,
        exchanges_count INTEGER DEFAULT 23,
        ticket_transfers_count INTEGER DEFAULT 12,
        response_rate TEXT DEFAULT '96%',
        member_since TEXT DEFAULT 'Aug 2024',
        verified_student BOOLEAN DEFAULT 1,
        badges TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Regular Listings Table (Supply)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS listings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        exchange_type TEXT NOT NULL,
        price REAL DEFAULT 0.0,
        original_price REAL DEFAULT 0.0,
        condition TEXT,
        location TEXT NOT NULL,
        distance_tag TEXT DEFAULT '150m away',
        safe_meet_spot TEXT DEFAULT 'University Building (UB) Ground Floor Lobby',
        safe_spot_lat REAL DEFAULT 12.8234,
        safe_spot_lng REAL DEFAULT 80.0442,
        image_url TEXT,
        seller_name TEXT NOT NULL,
        seller_dept TEXT NOT NULL,
        seller_year TEXT NOT NULL,
        seller_avatar TEXT,
        seller_rating REAL DEFAULT 4.9,
        seller_rex_score INTEGER DEFAULT 92,
        seller_id INTEGER,
        verified_student BOOLEAN DEFAULT 1,
        match_score INTEGER DEFAULT 94,
        match_reason TEXT DEFAULT 'Within your budget, nearby and highly rated.',
        tags TEXT,
        views INTEGER DEFAULT 0,
        saves INTEGER DEFAULT 0,
        is_trending BOOLEAN DEFAULT 1,
        is_smart_match BOOLEAN DEFAULT 1,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (seller_id) REFERENCES users(id)
    );
    """)

    # 🎟️ REX Tickets Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS tickets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_name TEXT NOT NULL,
        category TEXT NOT NULL,
        ticket_type TEXT NOT NULL DEFAULT 'General Entry',
        event_date TEXT NOT NULL,
        event_time TEXT NOT NULL,
        event_timestamp_hours_left REAL DEFAULT 3.7,
        venue TEXT NOT NULL,
        seat_section TEXT DEFAULT 'VIP Standing Arena',
        original_price REAL NOT NULL,
        asking_price REAL NOT NULL,
        discount_pct INTEGER DEFAULT 25,
        transfer_method TEXT DEFAULT 'In-Person Safe Handover / Digital PDF',
        seller_name TEXT NOT NULL,
        seller_dept TEXT NOT NULL,
        seller_year TEXT NOT NULL,
        seller_avatar TEXT,
        seller_rating REAL DEFAULT 4.95,
        seller_transfers_count INTEGER DEFAULT 14,
        seller_verified BOOLEAN DEFAULT 1,
        ticket_verified BOOLEAN DEFAULT 1,
        is_last_minute BOOLEAN DEFAULT 1,
        match_score INTEGER DEFAULT 96,
        match_reason TEXT DEFAULT 'Event starts in under 4 hours, verified student pass, 25% lower than retail.',
        qr_protected BOOLEAN DEFAULT 1,
        status TEXT DEFAULT 'available',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 🎟️ Ticket Requests / Demands Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ticket_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        requester_name TEXT NOT NULL,
        requester_dept TEXT NOT NULL,
        requester_avatar TEXT,
        event_wanted TEXT NOT NULL,
        category TEXT NOT NULL,
        max_budget REAL NOT NULL,
        needed_before TEXT NOT NULL,
        preferred_meet_spot TEXT DEFAULT 'UB Ground Floor Lobby',
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Demands Table (Need Something? General)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS demands (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        requester_name TEXT NOT NULL,
        requester_dept TEXT NOT NULL,
        requester_year TEXT NOT NULL,
        requester_avatar TEXT,
        item_needed TEXT NOT NULL,
        category TEXT NOT NULL,
        budget_type TEXT NOT NULL DEFAULT 'Free',
        max_budget REAL DEFAULT 0.0,
        needed_by TEXT NOT NULL,
        preferred_location TEXT NOT NULL,
        matched_listing_id INTEGER DEFAULT NULL,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Campus Map & Radar Pins Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS campus_pins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        lat REAL NOT NULL,
        lng REAL NOT NULL,
        icon TEXT NOT NULL,
        distance_m INTEGER DEFAULT 200,
        active_listings INTEGER DEFAULT 8,
        students_nearby INTEGER DEFAULT 35,
        exchanges_today INTEGER DEFAULT 6,
        description TEXT,
        is_cctv_safe BOOLEAN DEFAULT 1,
        timing TEXT DEFAULT '24/7'
    );
    """)

    # Notifications Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        category TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        timestamp_str TEXT DEFAULT 'Just now',
        is_read BOOLEAN DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Check and Seed
    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        seed_ecosystem(cursor)

    conn.commit()
    conn.close()

def seed_ecosystem(cursor):
    default_pwd = pwd_context.hash("srm123")

    # 1. Seed Users (Verified SRM Students)
    demo_badges = json.dumps(["🏆 Trusted Trader", "⚡ Fast Responder", "🌱 Eco Warrior", "🤝 Campus Helper", "🎟️ Verified Ticket Host"])
    users_data = [
        ("Ayan Saha", "ayan@srmist.edu.in", default_pwd, "RA2311003010001", "CSE Core", "1st Year", "Paari Hostel", "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80", 1240, "Level 12 — Campus Connector", 92, 4.9, 23, 12, "96%", "Aug 2024", 1, demo_badges),
        ("Tanvi Sharma", "tanvi@srmist.edu.in", default_pwd, "RA2111003020045", "Biotechnology", "Final Year", "Estancia Tower 3", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", 1850, "Level 18 — REX Legend", 98, 4.98, 42, 18, "100%", "Jul 2023", 1, demo_badges),
        ("Harini Venkatesh", "harini@srmist.edu.in", default_pwd, "RA2211003020110", "ECE Core", "3rd Year", "Meenakshi Hostel", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80", 1380, "Level 13 — Hardware Guru", 94, 4.9, 28, 9, "95%", "Aug 2023", 1, demo_badges),
        ("Rohan Sundaram", "rohan@srmist.edu.in", default_pwd, "RA2111003010188", "CSE (CINTEL)", "3rd Year", "Kaari Hostel", "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80", 1120, "Level 10 — Campus Connector", 91, 4.85, 21, 6, "94%", "Jan 2024", 1, demo_badges),
        ("Kavya Krishnan", "kavya@srmist.edu.in", default_pwd, "RA2111003010290", "CSE Core", "4th Year", "Senbagam Hostel", "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80", 1640, "Level 16 — Tech Mentor", 96, 4.95, 36, 15, "98%", "Sep 2022", 1, demo_badges)
    ]
    cursor.executemany("""
    INSERT INTO users (full_name, email, password_hash, student_id, dept, year, hostel, avatar_url, karma_score, level_title, rex_score, rating, exchanges_count, ticket_transfers_count, response_rate, member_since, verified_student, badges)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, users_data)

    # 2. Seed 🎟️ REX Tickets (Last-Minute & Upcoming Campus Events)
    tickets_data = [
        (
            "Milan 2026 Pro-Nite — Day 3 Bollywood Celebrity Concert",
            "Concerts", "VIP Backstage RFID Band", "Today", "7:00 PM", 3.7,
            "TP Ganesan Auditorium Main Grounds", "VIP Standing Gate 2",
            600.0, 450.0, 25, "Physical RFID Wristband Handoff at UB",
            "Tanvi Sharma", "Biotechnology", "Final Year",
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
            4.98, 18, 1, 1, 1, 96,
            "Event starts in 3h 42m, verified student council QR pass, 25% lower than retail.", 1, "available"
        ),
        (
            "SRM Inter-Collegiate Basketball Championship Finals",
            "Sports", "Courtside Seat Pass", "Today", "8:30 PM", 5.2,
            "SRM Indoor Stadium Court 1", "Section A · Row 3",
            250.0, 150.0, 40, "Digital QR Pass Transfer",
            "Rohan Sundaram", "CSE (CINTEL)", "3rd Year",
            "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150",
            4.85, 6, 1, 1, 1, 94,
            "Starting in 5 hours, courtside seating, verified student pass.", 1, "available"
        ),
        (
            "Aarush 2026 National GenAI & LLM Agent Hackathon Ticket",
            "Workshops", "Team Delegate Pass", "Tomorrow", "9:00 AM", 17.5,
            "Tech Park 7th Floor Auditorium", "Delegate Bay 4",
            500.0, 300.0, 40, "Official Delegate ID Reassignment",
            "Kavya Krishnan", "CSE Core", "4th Year",
            "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
            4.95, 15, 1, 1, 0, 92,
            "Includes all-day buffet & official certification, 40% discount.", 1, "available"
        ),
        (
            "SRM Esports League — Valorant Grand Finals Stage Pass",
            "Gaming Events", "Arena Pass + Merch Kit", "Tomorrow", "2:00 PM", 22.0,
            "Mini Auditorium 1 (Dr. T.P. Ganesan)", "Row F · Seat 12",
            350.0, 200.0, 43, "PDF Ticket with Entry Barcode",
            "Harini Venkatesh", "ECE Core", "3rd Year",
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
            4.9, 9, 1, 1, 0, 90,
            "Live stage casting & official jersey voucher included.", 1, "available"
        ),
        (
            "PVR Inox Grand Galada — Late Night IMAX Movie Pass",
            "Movies", "Recliner Gold Seat", "Tonight", "10:45 PM", 7.4,
            "PVR Inox Grand Galada (Direct SRM Metro)", "Gold Recliner D8",
            450.0, 300.0, 33, "BookMyShow Ticket Transfer",
            "Aditya Nair", "Robotics Eng.", "4th Year",
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
            4.85, 4, 1, 1, 1, 88,
            "Center screen recliner seat for tonight's late show.", 1, "available"
        )
    ]

    cursor.executemany("""
    INSERT INTO tickets (
        event_name, category, ticket_type, event_date, event_time, event_timestamp_hours_left,
        venue, seat_section, original_price, asking_price, discount_pct, transfer_method,
        seller_name, seller_dept, seller_year, seller_avatar, seller_rating, seller_transfers_count,
        seller_verified, ticket_verified, is_last_minute, match_score, match_reason, qr_protected, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, tickets_data)

    # 3. Seed 🎟️ Ticket Requests / Demands
    ticket_requests_data = [
        ("Ayan Saha", "CSE Core 1st Year", "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150", "Milan 2026 Day 3 Pro-Nite VIP Pass", "Concerts", 500.0, "Today before 6:00 PM", "UB Ground Floor Lobby", "active"),
        ("Rahul Sharma", "Mech Eng 2nd Year", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", "Basketball Finals Pass", "Sports", 200.0, "Today before 8:00 PM", "Indoor Stadium Gate", "active"),
        ("Sneha Iyer", "Biotech 3rd Year", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", "GenAI Hackathon Team Pass", "Workshops", 350.0, "Tomorrow 8:30 AM", "Tech Park Atrium", "active")
    ]
    cursor.executemany("""
    INSERT INTO ticket_requests (requester_name, requester_dept, requester_avatar, event_wanted, category, max_budget, needed_before, preferred_meet_spot, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, ticket_requests_data)

    # 4. Seed Regular Supply Listings
    listings_data = [
        (
            "Casio FX-991EX ClassWiz Scientific Solar Calculator",
            "Solar and battery powered. Linear algebra, calculus, matrices approved for SRMIST end-sem examinations. Clean with protective cover.",
            "Electronics", "sell", 650.0, 1900.0, "Like New",
            "Tech Park 5th Floor", "4 min away · Tech Park",
            "University Building (UB) Ground Floor Lobby", 12.8234, 80.0442,
            "https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48f?w=600&auto=format&fit=crop&q=80",
            "Harini Venkatesh", "ECE Core", "3rd Year",
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
            4.9, 94, 3, 1, 95, "Within your budget (₹650 < ₹800), 4 min away, and 4.9⭐ seller rating.",
            json.dumps(["Casio", "FX991EX", "Calculator", "Electronics", "Exams"]), 312, 84, 1, 1
        ),
        (
            "21CSC201J Data Structures & Algorithms Handcrafted Cycle Test + EndSem Notes",
            "Complete hand-drawn diagrams, Big-O analysis, AVL trees, Dijkstra's algorithm, and 5 years of solved SRM end-sem papers.",
            "Notes", "give", 0.0, 450.0, "Mint Condition",
            "Paari Hostel (Block B)", "2 min away · Paari",
            "UB Ground Floor Lobby", 12.8234, 80.0442,
            "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80",
            "Rohan Sundaram", "CSE (CINTEL)", "3rd Year",
            "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150",
            4.85, 91, 4, 1, 92, "Free campus resource, verified 1st year CSE syllabus, 150m from Paari Hostel.",
            json.dumps(["21CSC201J", "DSA", "Notes", "CSE", "Freebox"]), 410, 112, 1, 1
        )
    ]
    cursor.executemany("""
    INSERT INTO listings (
        title, description, category, exchange_type, price, original_price, condition,
        location, distance_tag, safe_meet_spot, safe_spot_lat, safe_spot_lng,
        image_url, seller_name, seller_dept, seller_year, seller_avatar, seller_rating,
        seller_rex_score, seller_id, verified_student, match_score, match_reason,
        tags, views, saves, is_trending, is_smart_match
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, listings_data)

    # 5. Seed Campus Map Pins
    pins_data = [
        ("🏢 University Building (UB) Ground Floor Lobby", "Exchange Points", 12.8234, 80.0442, "shield-check", 150, 18, 54, 12, "Primary CCTV-monitored safe exchange zone with 24/7 central campus security guard desk.", 1, "7:30 AM - 9:30 PM"),
        ("📖 SRM Central Library Foyer", "Libraries", 12.8242, 80.0451, "book-open", 220, 14, 48, 9, "Quiet, turnstile-verified meetup spot ideal for exchanging notes and textbooks.", 1, "8:00 AM - 11:00 PM"),
        ("💻 Tech Park (TP) Atrium", "Buildings", 12.8228, 80.0425, "cpu", 300, 22, 65, 14, "Engineering innovation hub for hardware kits, calculators, and placement prep barters.", 1, "8:00 AM - 8:30 PM"),
        ("☕ Java Green / Gazebo Lounge", "Cafeterias", 12.8239, 80.0436, "coffee", 180, 11, 38, 8, "Vibrant social hub for skill barters, project discussions, and informal handoffs.", 1, "8:00 AM - 10:00 PM")
    ]
    cursor.executemany("""
    INSERT INTO campus_pins (title, category, lat, lng, icon, distance_m, active_listings, students_nearby, exchanges_today, description, is_cctv_safe, timing)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, pins_data)

    # 6. Seed Notifications
    notifs_data = [
        (1, "Ticket Alert", "🎟️ Last-Minute Ticket Match Found!", "Tanvi Sharma posted a Milan Day 3 VIP Pass for ₹450 (Starts in 3h 42m).", "Just now", 0),
        (1, "Achievements", "🏆 +100 XP Ticket Transfer Verified", "Your last ticket transfer was verified at UB Ground Floor Lobby!", "2h ago", 1)
    ]
    cursor.executemany("""
    INSERT INTO notifications (user_id, category, title, message, timestamp_str, is_read)
    VALUES (?, ?, ?, ?, ?, ?)
    """, notifs_data)
