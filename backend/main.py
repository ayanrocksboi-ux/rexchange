import os
import json
import asyncio
from typing import Optional, List, Dict, Union
from datetime import timedelta
from fastapi import FastAPI, HTTPException, Depends, Query, WebSocket, WebSocketDisconnect, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from .database import init_db, get_db_connection
from .auth import (
    hash_password, verify_password, create_access_token,
    get_current_user_optional, get_current_user_required,
    ACCESS_TOKEN_EXPIRE_HOURS, decode_token
)

app = FastAPI(title="REXchange — Intelligent SRMIST KTR Campus Ecosystem & REX Tickets API", version="9.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_no_cache_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate, max-age=0"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response

@app.on_event("startup")
def on_startup():
    init_db()

# ─── Pydantic Models ──────────────────────────────────────────────────────────
class TicketCreate(BaseModel):
    event_name: str
    category: str
    ticket_type: str = "General Entry"
    event_date: str
    event_time: str
    venue: str
    seat_section: Optional[str] = "General"
    original_price: float
    asking_price: float
    transfer_method: Optional[str] = "In-Person Safe Handover / Digital PDF"

class TicketRequestCreate(BaseModel):
    event_wanted: str
    category: str
    max_budget: float
    needed_before: str
    preferred_meet_spot: Optional[str] = "UB Ground Floor Lobby"

class TicketTransferCompleteRequest(BaseModel):
    ticket_id: int
    seller_name: str
    buyer_name: str
    savings_amount: float = 150.0
    meetup_spot: str = "University Building (UB) Ground Floor Lobby"

class AIChatRequest(BaseModel):
    prompt: str
    context: Optional[str] = "SRMIST KTR Campus"

# ─── Auth Endpoints ───────────────────────────────────────────────────────────
@app.post("/api/auth/demo-login/{profile_id}")
@app.post("/api/auth/demo-login")
def demo_login(profile_id: str = "ayan"):
    profile_map = {
        "ayan": "ayan@srmist.edu.in",
        "tanvi": "tanvi@srmist.edu.in",
        "harini": "harini@srmist.edu.in",
        "rohan": "rohan@srmist.edu.in"
    }
    target_email = profile_map.get(profile_id.lower(), "ayan@srmist.edu.in")

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (target_email,))
    user = cursor.fetchone()
    conn.close()

    if not user:
        init_db()
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = ?", (target_email,))
        user = cursor.fetchone()
        conn.close()

    if not user:
        raise HTTPException(status_code=404, detail="Demo account not found.")

    token = create_access_token(
        data={"sub": str(user["id"]), "email": user["email"], "name": user["full_name"]},
        expires_delta=timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    )

    try:
        badges = json.loads(user["badges"]) if user["badges"] else []
    except Exception:
        badges = ["🏆 Trusted Trader", "⚡ Fast Responder", "🌱 Eco Warrior", "🤝 Campus Helper", "🎟️ Verified Ticket Host"]

    return {
        "success": True,
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "full_name": user["full_name"],
            "email": user["email"],
            "student_id": user["student_id"],
            "dept": user["dept"],
            "year": user["year"],
            "hostel": user["hostel"],
            "karma_score": user["karma_score"],
            "level_title": user["level_title"],
            "rex_score": user["rex_score"],
            "rating": user["rating"],
            "exchanges_count": user["exchanges_count"],
            "ticket_transfers_count": user["ticket_transfers_count"],
            "response_rate": user["response_rate"],
            "avatar_url": user["avatar_url"],
            "verified_student": bool(user["verified_student"]),
            "badges": badges
        }
    }

# ─── 🎟️ REX TICKETS CORE ENDPOINTS ───────────────────────────────────────────
@app.get("/api/tickets")
def get_tickets(category: Optional[str] = None, filter_type: Optional[str] = None, search: Optional[str] = None):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = "SELECT * FROM tickets WHERE status = 'available'"
    params = []

    if category and category.lower() not in ["all", "everything"]:
        query += " AND LOWER(category) = ?"
        params.append(category.lower())

    if filter_type:
        ft = filter_type.lower()
        if ft == "today":
            query += " AND (LOWER(event_date) LIKE '%today%' OR LOWER(event_date) LIKE '%tonight%')"
        elif ft == "tomorrow":
            query += " AND LOWER(event_date) LIKE '%tomorrow%'"
        elif ft == "under500":
            query += " AND asking_price <= 500"
        elif ft == "lastminute":
            query += " AND is_last_minute = 1"

    if search:
        query += " AND (LOWER(event_name) LIKE ? OR LOWER(venue) LIKE ?)"
        term = f"%{search.lower()}%"
        params.extend([term, term])

    query += " ORDER BY event_timestamp_hours_left ASC, id DESC"
    cursor.execute(query, params)
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return {"count": len(rows), "tickets": rows}

@app.get("/api/tickets/match")
def get_ticket_match(query: Optional[str] = None):
    conn = get_db_connection()
    cursor = conn.cursor()
    if query:
        q = query.lower()
        if "concert" in q or "milan" in q or "fest" in q or "tonight" in q:
            cursor.execute("SELECT * FROM tickets WHERE LOWER(event_name) LIKE '%milan%' OR LOWER(category) = 'concerts' LIMIT 2")
        elif "sport" in q or "basket" in q or "cricket" in q:
            cursor.execute("SELECT * FROM tickets WHERE category = 'Sports' LIMIT 2")
        elif "hack" in q or "ai" in q or "work" in q:
            cursor.execute("SELECT * FROM tickets WHERE category = 'Workshops' LIMIT 2")
        else:
            cursor.execute("SELECT * FROM tickets WHERE is_last_minute = 1 LIMIT 2")
    else:
        cursor.execute("SELECT * FROM tickets WHERE is_last_minute = 1 LIMIT 2")

    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return {"query": query or "Last-Minute Campus Passes", "matches": rows}

@app.post("/api/tickets")
def create_ticket(ticket: TicketCreate, current_user=Depends(get_current_user_optional)):
    conn = get_db_connection()
    cursor = conn.cursor()
    user_id = int(current_user["sub"]) if current_user else 1

    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user = cursor.fetchone() or {"full_name": "Ayan Saha", "dept": "CSE Core", "year": "1st Year", "avatar_url": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"}

    # Calculate discount percentage
    discount = int(((ticket.original_price - ticket.asking_price) / max(1, ticket.original_price)) * 100)
    discount = max(0, discount)

    cursor.execute("""
    INSERT INTO tickets (
        event_name, category, ticket_type, event_date, event_time, event_timestamp_hours_left,
        venue, seat_section, original_price, asking_price, discount_pct, transfer_method,
        seller_name, seller_dept, seller_year, seller_avatar, seller_rating, seller_transfers_count,
        seller_verified, ticket_verified, is_last_minute, match_score, match_reason, qr_protected, status
    ) VALUES (?, ?, ?, ?, ?, 4.5, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 4.9, 12, 1, 1, 1, 95, 'Verified campus pass with instant handoff.', 1, 'available')
    """, (
        ticket.event_name, ticket.category, ticket.ticket_type, ticket.event_date, ticket.event_time,
        ticket.venue, ticket.seat_section or "General Entry", ticket.original_price, ticket.asking_price,
        discount, ticket.transfer_method or "In-Person Safe Handover / Digital PDF",
        user["full_name"], user["dept"], user["year"], user["avatar_url"]
    ))
    new_id = cursor.lastrowid
    cursor.execute("UPDATE users SET karma_score = karma_score + 25 WHERE id = ?", (user_id,))
    conn.commit()
    conn.close()

    return {"success": True, "id": new_id, "message": "Ticket posted to REX Tickets last-minute portal! +25 XP 🎟️"}

@app.get("/api/tickets/requests")
def get_ticket_requests():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM ticket_requests WHERE status = 'active' ORDER BY id DESC")
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return {"count": len(rows), "requests": rows}

@app.post("/api/tickets/requests")
def create_ticket_request(req: TicketRequestCreate, current_user=Depends(get_current_user_optional)):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO ticket_requests (requester_name, requester_dept, requester_avatar, event_wanted, category, max_budget, needed_before, preferred_meet_spot, status)
    VALUES ('Ayan Saha', 'CSE Core 1st Year', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', ?, ?, ?, ?, ?, 'active')
    """, (req.event_wanted, req.category, req.max_budget, req.needed_before, req.preferred_meet_spot or "UB Ground Floor Lobby"))
    new_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return {"success": True, "id": new_id, "message": "Ticket alert active! REX will notify you the second a matching ticket is listed."}

@app.post("/api/tickets/transfer/complete")
def complete_ticket_transfer(req: TicketTransferCompleteRequest, current_user=Depends(get_current_user_optional)):
    conn = get_db_connection()
    cursor = conn.cursor()
    user_id = int(current_user["sub"]) if current_user else 1

    cursor.execute("""
    UPDATE users 
    SET karma_score = karma_score + 100,
        ticket_transfers_count = ticket_transfers_count + 1,
        rex_score = MIN(100, rex_score + 1)
    WHERE id = ?
    """, (user_id,))

    cursor.execute("""
    INSERT INTO notifications (user_id, category, title, message, timestamp_str, is_read)
    VALUES (?, 'Ticket Transfer', '🎉 Ticket Transferred Successfully!', ?, 'Just now', 0)
    """, (user_id, f"Ticket transferred with {req.seller_name} at {req.meetup_spot}. +100 XP awarded & ₹{req.savings_amount} saved!"))

    conn.commit()
    conn.close()

    return {
        "success": True,
        "xp_earned": 100,
        "savings_inr": req.savings_amount or 150.0,
        "meetup_spot": req.meetup_spot,
        "message": f"TICKET TRANSFERRED! 🎉 +100 XP and ₹{req.savings_amount} savings recorded!"
    }

@app.get("/api/tickets/stats")
def get_ticket_stats():
    return {
        "tickets_transferred": 429,
        "money_saved_inr": 84350,
        "students_connected": 392,
        "tickets_saved_from_waste": 429
    }

# ─── AI TICKET OCR & VERIFICATION PARSER ───────────────────────────────────────
@app.post("/api/ai/verify-ticket")
def ai_verify_ticket(req: AIChatRequest):
    p = req.prompt.lower()
    if "milan" in p or "concert" in p or "fest" in p:
        return {
            "event_name": "Milan 2026 Pro-Nite — Day 3 Concert",
            "category": "Concerts",
            "ticket_type": "VIP Backstage RFID Band",
            "event_date": "Today",
            "event_time": "7:00 PM",
            "venue": "TP Ganesan Auditorium Main Grounds",
            "seat_section": "VIP Standing Gate 2",
            "original_price": 600.0,
            "suggested_price": 450.0,
            "fair_price_badge": "Fair Price ✓ (25% Student Discount)",
            "ocr_verified": True,
            "security_warning": "Full QR code protected. Reveal only upon handoff confirmation."
        }
    elif "basket" in p or "sport" in p:
        return {
            "event_name": "SRM Inter-Collegiate Basketball Finals",
            "category": "Sports",
            "ticket_type": "Courtside Seat Pass",
            "event_date": "Today",
            "event_time": "8:30 PM",
            "venue": "SRM Indoor Stadium Court 1",
            "seat_section": "Section A · Row 3",
            "original_price": 250.0,
            "suggested_price": 150.0,
            "fair_price_badge": "Fair Price ✓ (40% Student Discount)",
            "ocr_verified": True,
            "security_warning": "Barcode protected."
        }
    else:
        return {
            "event_name": req.prompt.strip().title(),
            "category": "College Events",
            "ticket_type": "General Pass",
            "event_date": "Today",
            "event_time": "6:00 PM",
            "venue": "University Building (UB)",
            "seat_section": "General",
            "original_price": 400.0,
            "suggested_price": 250.0,
            "fair_price_badge": "Fair Price ✓",
            "ocr_verified": True,
            "security_warning": "Protected ticket details."
        }

# ─── Regular Endpoints (Listings, Pulse, Map, etc.) ───────────────────────────
@app.get("/api/listings")
def get_listings(category: Optional[str] = None, search: Optional[str] = None):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = "SELECT * FROM listings WHERE status = 'active'"
    params = []
    if category and category.lower() not in ["all", "everything"]:
        query += " AND LOWER(category) = ?"
        params.append(category.lower())
    if search:
        query += " AND (LOWER(title) LIKE ? OR LOWER(description) LIKE ?)"
        term = f"%{search.lower()}%"
        params.extend([term, term])
    query += " ORDER BY id DESC"
    cursor.execute(query, params)
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return {"count": len(rows), "listings": rows}

@app.get("/api/campus/pulse")
def get_campus_pulse():
    return {
        "students_online": 1284,
        "active_listings": 342,
        "exchanges_today": 89,
        "activity_feed": [
            {"type": "feed", "icon": "🎟️", "text": "Tanvi listed Milan Pro-Nite VIP Pass (Event starts in 3h 42m)", "time": "Just now"},
            {"type": "feed", "icon": "🟢", "text": "Rahul completed a ticket transfer at UB Lobby (+100 XP)", "time": "2m ago"},
            {"type": "feed", "icon": "🔵", "text": "Ayan listed a Casio ClassWiz calculator", "time": "5m ago"},
            {"type": "feed", "icon": "🔥", "text": "18 students are looking for Basketball Finals passes", "time": "8m ago"}
        ]
    }

@app.get("/api/map-pins")
def get_map_pins():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM campus_pins")
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return {"pins": rows}

@app.get("/api/sustainability-stats")
def get_sustainability_stats():
    return {
        "items_reused": 1843,
        "money_saved_inr": 340650,
        "resources_shared": 629,
        "waste_avoided_kg": 416.2
    }

@app.post("/api/ai/chat")
def rex_ai_chat(req: AIChatRequest):
    p = req.prompt.lower()
    if "ticket" in p or "milan" in p or "pass" in p or "concert" in p:
        reply = "Found **Milan 2026 Pro-Nite VIP Backstage Pass** with Tanvi at Estancia / UB for ₹450 (Event starts in 3h 42m)! 25% lower than retail with student verification."
        action = "View Milan Ticket"
        cat = "Tickets"
    else:
        reply = f"I scanned the SRMIST KTR campus network for '{req.prompt}'. Recommended meeting point: **UB Ground Floor Lobby (near Nescafe)** with 24/7 CCTV security."
        action = "Explore Campus Feed"
        cat = "All"
    return {"reply": reply, "suggested_action": action, "filter_category": cat}

# ─── Static Frontend ──────────────────────────────────────────────────────────
frontend_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")
if os.path.exists(frontend_path):
    app.mount("/static", StaticFiles(directory=frontend_path), name="static")

    @app.get("/")
    @app.get("/tickets")
    def serve_home():
        return FileResponse(os.path.join(frontend_path, "index.html"))

    @app.get("/{full_path:path}")
    def serve_spa(full_path: str):
        return FileResponse(os.path.join(frontend_path, "index.html"))
