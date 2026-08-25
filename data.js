// RExchange Campus Demo Dataset - Single College: Bangalore Institute of Technology & Sciences (BITS)
window.REXCHANGE_DATA = {
  college: {
    id: "bits-blr",
    name: "Bangalore Institute of Technology & Sciences (BITS)",
    shortName: "BITS Bangalore",
    domain: "bits-bangalore.edu.in",
    location: "Bangalore, Karnataka",
    campusArea: "Electronic City & Sarjapur Corridor Campus",
    activeStudents: 2480,
    activeListings: 1320,
    safeSpots: [
      "Central Library Lobby (Ground Floor)",
      "Student Activity Center (SAC) Cafe",
      "Block-C Innovation Hub & Atrium",
      "Campus Main Quadrangle & Amphitheatre"
    ],
    departments: [
      "Computer Science & Engineering (CSE)",
      "Electronics & Communication (ECE)",
      "Artificial Intelligence & Data Science (AI/DS)",
      "Information Science & Engineering (ISE)",
      "Mechanical Engineering (ME)",
      "Electrical & Electronics (EEE)",
      "Civil Engineering (CE)",
      "Biotechnology (BT)"
    ],
    hostels: [
      "Hostel Block 1 (Boys - Senior Wing)",
      "Hostel Block 2 (Boys - Junior Wing)",
      "Hostel Block 3 (Girls - Diamond Block)",
      "Hostel Block 4 (Girls - Emerald Block)",
      "Day Scholar / Off-Campus PG"
    ]
  },

  registeredUsers: [
    {
      id: "u_aarav",
      name: "Aarav Patel",
      email: "aarav.patel@bits-bangalore.edu.in",
      usn: "1BT23CS084",
      password: "password123",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
      college: "Bangalore Institute of Technology & Sciences (BITS)",
      branch: "Computer Science & Engineering (3rd Year)",
      department: "Computer Science & Engineering (CSE)",
      year: "3rd Year",
      hostel: "Hostel Block 1 (Boys - Senior Wing)",
      verified: true,
      rating: 4.95,
      exchangeCount: 12,
      savedItems: ["item_02", "item_07", "item_15"]
    },
    {
      id: "u_priya",
      name: "Priya Deshmukh",
      email: "priya.d@bits-bangalore.edu.in",
      usn: "1BT24EC052",
      password: "password123",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      college: "Bangalore Institute of Technology & Sciences (BITS)",
      branch: "Electronics & Communication (2nd Year)",
      department: "Electronics & Communication (ECE)",
      year: "2nd Year",
      hostel: "Hostel Block 3 (Girls - Diamond Block)",
      verified: true,
      rating: 4.9,
      exchangeCount: 8,
      savedItems: ["item_04", "item_13"]
    },
    {
      id: "u_ananya",
      name: "Ananya Murthy",
      email: "ananya.m@bits-bangalore.edu.in",
      usn: "1BT22IS019",
      password: "password123",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
      college: "Bangalore Institute of Technology & Sciences (BITS)",
      branch: "Information Science & Engineering (4th Year)",
      department: "Information Science & Engineering (ISE)",
      year: "4th Year",
      hostel: "Hostel Block 3 (Girls - Diamond Block)",
      verified: true,
      rating: 5.0,
      exchangeCount: 19,
      savedItems: ["item_01", "item_17"]
    },
    {
      id: "u_rahul",
      name: "Rahul Sharma",
      email: "rahul.s@bits-bangalore.edu.in",
      usn: "1BT23ME091",
      password: "password123",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
      college: "Bangalore Institute of Technology & Sciences (BITS)",
      branch: "Mechanical Engineering (3rd Year)",
      department: "Mechanical Engineering (ME)",
      year: "3rd Year",
      hostel: "Hostel Block 2 (Boys - Junior Wing)",
      verified: true,
      rating: 4.88,
      exchangeCount: 15,
      savedItems: ["item_08", "item_21"]
    }
  ],

  categories: [
    {
      id: "events-tickets",
      name: "Events & Tickets",
      icon: "ticket",
      count: 14,
      desc: "BITS fest passes, college concert wristbands, workshops, sports events, hackathons",
      color: "from-amber-500/20 to-orange-500/10",
      accent: "#f59e0b"
    },
    {
      id: "essentials",
      name: "Essentials",
      icon: "briefcase",
      count: 22,
      desc: "Everyday campus gear, calculators, bags, lamps, cycle locks",
      color: "from-emerald-500/20 to-teal-500/10",
      accent: "#10b981"
    },
    {
      id: "electronic-accessories",
      name: "Electronic Accessories",
      icon: "headphones",
      count: 31,
      desc: "Cables, mice, laptop stands, USB hubs, keyboards, earphones",
      color: "from-cyan-500/20 to-blue-500/10",
      accent: "#06b6d4"
    },
    {
      id: "study-materials",
      name: "Study Materials",
      icon: "book-open",
      count: 48,
      desc: "Engineering textbooks, GATE prep, physics guides, coding manuals",
      color: "from-indigo-500/20 to-purple-500/10",
      accent: "#6366f1"
    },
    {
      id: "notes-resources",
      name: "Notes & Resources",
      icon: "file-text",
      count: 56,
      desc: "Semester handwritten notes, lab manuals, formula sheets, previous year papers",
      color: "from-purple-500/20 to-pink-500/10",
      accent: "#a855f7"
    },
    {
      id: "skills-services",
      name: "Skills & Services",
      icon: "code",
      count: 19,
      desc: "Peer tutoring, resume review, poster design, photo shoots, coding help",
      color: "from-rose-500/20 to-red-500/10",
      accent: "#f43f5e"
    },
    {
      id: "free-giveaways",
      name: "Free / Giveaways",
      icon: "gift",
      count: 27,
      desc: "Senior books, extra lab coats, notebooks, free study PDFs",
      color: "from-emerald-400/20 to-cyan-400/10",
      accent: "#34d399"
    }
  ],

  events: [
    {
      id: "evt_01",
      title: "BITS Techfest 2026 All-Access Delegate Pass",
      category: "Tech & Innovation",
      date: "Aug 28-30, 2026",
      time: "9:30 AM - 5:00 PM",
      venue: "BITS Main Auditorium & Innovation Hub",
      price: 350,
      originalPrice: 700,
      availableTickets: 18,
      organizer: "BITS Tech Club & IEEE Student Branch",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80",
      seller: {
        name: "Rahul Sharma",
        college: "BITS Bangalore",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80"
      },
      tags: ["Hackathon", "Robotics", "AI Keynotes", "Networking"]
    },
    {
      id: "evt_02",
      title: "AURA '26 - BITS Cultural Fest Pro-Night VIP Pass",
      category: "Cultural & Concert",
      date: "Sep 05, 2026",
      time: "4:00 PM - 10:30 PM",
      venue: "Open Air Amphitheatre, BITS Campus",
      price: 200,
      originalPrice: 450,
      availableTickets: 24,
      organizer: "BITS Student Cultural Association",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80",
      seller: {
        name: "Ananya Murthy",
        college: "BITS Bangalore",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
      },
      tags: ["Pro Night", "Band Battle", "EDM", "Food Stalls"]
    },
    {
      id: "evt_03",
      title: "BITS Founders & Student Entrepreneurship Summit",
      category: "Startup & Networking",
      date: "Sep 12, 2026",
      time: "2:00 PM - 6:00 PM",
      venue: "Block-C Innovation Hub & Incubator",
      price: 499,
      originalPrice: 999,
      availableTickets: 9,
      organizer: "BITS E-Cell (Entrepreneurship Cell)",
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&auto=format&fit=crop&q=80",
      seller: {
        name: "Dev Mehta",
        college: "BITS Bangalore",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
      },
      tags: ["Pitch Deck", "Angel Investors", "Student Founders"]
    },
    {
      id: "evt_04",
      title: "DevSprint 2026 - 36-Hour Autonomous Agent Hackathon",
      category: "Hackathon",
      date: "Sep 19-20, 2026",
      time: "8:00 AM onwards",
      venue: "Computer Science Dept Labs, BITS",
      price: 300,
      originalPrice: 600,
      availableTickets: 12,
      organizer: "BITS ACM Student Chapter",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=80",
      seller: {
        name: "Aarav Patel",
        college: "BITS Bangalore",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80"
      },
      tags: ["₹1.5L Prize Pool", "Food & Swag", "Cloud Credits"]
    }
  ],

  listings: [
    // 1. Events & Tickets
    {
      id: "item_01",
      title: "Techfest 2026 All-Access Delegate Pass",
      category: "events-tickets",
      categoryName: "Events & Tickets",
      price: 350,
      originalPrice: 700,
      listingType: "sale",
      condition: "Brand New",
      distance: "0.2 km away",
      pickupSpot: "Central Library Quad",
      timeAgo: "20 mins ago",
      featured: true,
      images: [
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80"
      ],
      description: "Got an extra student delegate pass for the upcoming national tech fest. Includes entry to robot wars, guest lectures from top tech leads, and hackathon lounge access.",
      seller: {
        id: "u_rahul",
        name: "Rahul Sharma",
        college: "Bangalore Institute of Technology & Sciences (BITS)",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
        verified: true,
        rating: 4.9,
        reviewsCount: 28,
        responseTime: "< 10 mins"
      }
    },
    {
      id: "item_02",
      title: "College Cultural Fest 'Aura' Pro-Night Pass",
      category: "events-tickets",
      categoryName: "Events & Tickets",
      price: 200,
      originalPrice: 400,
      listingType: "sale",
      condition: "Brand New",
      distance: "0.5 km away",
      pickupSpot: "Student Activity Center",
      timeAgo: "1 hour ago",
      featured: false,
      images: [
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80"
      ],
      description: "Original verified QR wristband pass for Saturday pro-night musical concert. Selling because I have a family event.",
      seller: {
        id: "u_ananya",
        name: "Ananya Murthy",
        college: "Bangalore Institute of Technology & Sciences (BITS)",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
        verified: true,
        rating: 5.0,
        reviewsCount: 19,
        responseTime: "< 15 mins"
      }
    },
    {
      id: "item_03",
      title: "BITS Founders & Startup Meetup Ticket",
      category: "events-tickets",
      categoryName: "Events & Tickets",
      price: 499,
      originalPrice: 1200,
      listingType: "exchange",
      condition: "Brand New",
      exchangeFor: "Will trade for an Arduino Uno Starter Kit or DSA Textbook",
      distance: "0.4 km away",
      pickupSpot: "Block-C Innovation Hub",
      timeAgo: "3 hours ago",
      featured: false,
      images: [
        "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&auto=format&fit=crop&q=80"
      ],
      description: "Direct entry pass to BITS Incubator Pitch Night. Open to exchanging for electronics starter kit or useful CSE reference book.",
      seller: {
        id: "u_rahul",
        name: "Rahul Sharma",
        college: "Bangalore Institute of Technology & Sciences (BITS)",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
        verified: true,
        rating: 4.8,
        reviewsCount: 14,
        responseTime: "< 30 mins"
      }
    },

    // 2. Essentials
    {
      id: "item_04",
      title: "Casio FX-991CW ClassWiz Scientific Calculator",
      category: "essentials",
      categoryName: "Essentials",
      price: 650,
      originalPrice: 1495,
      listingType: "sale",
      condition: "Like New",
      distance: "0.3 km away",
      pickupSpot: "Hostel Block 2 Gate",
      timeAgo: "45 mins ago",
      featured: true,
      images: [
        "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80"
      ],
      description: "Latest 4-line Natural textbook display scientific calculator. Allowed in all university and autonomous exams. Barely used 1 semester with original hard case.",
      seller: {
        id: "u_priya",
        name: "Priya Deshmukh",
        college: "Bangalore Institute of Technology & Sciences (BITS)",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
        verified: true,
        rating: 4.9,
        reviewsCount: 31,
        responseTime: "< 5 mins"
      }
    },
    {
      id: "item_05",
      title: "Wildcraft Ergonomic Campus Backpack (30L)",
      category: "essentials",
      categoryName: "Essentials",
      price: 700,
      originalPrice: 2199,
      listingType: "sale",
      condition: "Good Condition",
      distance: "0.4 km away",
      pickupSpot: "Cafeteria Outdoor Seating",
      timeAgo: "2 hours ago",
      featured: false,
      images: [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80"
      ],
      description: "Durable water-resistant backpack with padded 15.6 inch laptop compartment and rain cover included. Zippers work smoothly.",
      seller: {
        id: "u_rahul",
        name: "Rahul Sharma",
        college: "Bangalore Institute of Technology & Sciences (BITS)",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
        verified: true,
        rating: 4.7,
        reviewsCount: 16,
        responseTime: "< 25 mins"
      }
    },
    {
      id: "item_06",
      title: "Rechargeable LED Desk Lamp with Phone Stand",
      category: "essentials",
      categoryName: "Essentials",
      price: 450,
      originalPrice: 999,
      listingType: "sale",
      condition: "Like New",
      distance: "0.2 km away",
      pickupSpot: "Library Entrance",
      timeAgo: "4 hours ago",
      featured: false,
      images: [
        "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=600&auto=format&fit=crop&q=80"
      ],
      description: "3 color temperature modes (Warm, Cool, Natural) with touch brightness control. Built-in battery gives 6 hours backup during power cuts.",
      seller: {
        id: "u_ananya",
        name: "Ananya Murthy",
        college: "Bangalore Institute of Technology & Sciences (BITS)",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
        verified: true,
        rating: 5.0,
        reviewsCount: 22,
        responseTime: "< 10 mins"
      }
    },
    {
      id: "item_07",
      title: "Heavy-Duty 5-Digit Combination Cycle Lock",
      category: "essentials",
      categoryName: "Essentials",
      price: 250,
      originalPrice: 650,
      listingType: "sale",
      condition: "Good Condition",
      distance: "0.1 km away",
      pickupSpot: "Hostel Bicycle Stand",
      timeAgo: "5 hours ago",
      featured: false,
      images: [
        "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80"
      ],
      description: "Braided steel cable cycle lock, 1.2m length. Reset to standard code 00000. Super secure for campus cycle parking.",
      seller: {
        id: "u_priya",
        name: "Priya Deshmukh",
        college: "Bangalore Institute of Technology & Sciences (BITS)",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
        verified: true,
        rating: 4.8,
        reviewsCount: 11,
        responseTime: "< 20 mins"
      }
    },

    // 3. Electronic Accessories
    {
      id: "item_08",
      title: "Sony-style Noise Isolating Wireless Headphones",
      category: "electronic-accessories",
      categoryName: "Electronic Accessories",
      price: 1200,
      originalPrice: 2999,
      listingType: "sale",
      condition: "Good Condition",
      distance: "0.3 km away",
      pickupSpot: "Central Quad",
      timeAgo: "30 mins ago",
      featured: true,
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
      ],
      description: "Comfortable over-ear Bluetooth headphones with bass boost mode, 30+ hour battery life, and Type-C fast charging. Perfect for late night study sessions in the hostel.",
      seller: {
        id: "u_rahul",
        name: "Rahul Sharma",
        college: "Bangalore Institute of Technology & Sciences (BITS)",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
        verified: true,
        rating: 4.9,
        reviewsCount: 28,
        responseTime: "< 10 mins"
      }
    },
    {
      id: "item_09",
      title: "Logitech Silent Click Wireless Mouse M221",
      category: "electronic-accessories",
      categoryName: "Electronic Accessories",
      price: 450,
      originalPrice: 995,
      listingType: "exchange",
      condition: "Like New",
      exchangeFor: "Willing to exchange for a Type-C OTG flash drive 64GB",
      distance: "0.4 km away",
      pickupSpot: "SAC Common Room",
      timeAgo: "1 hour ago",
      featured: false,
      images: [
        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80"
      ],
      description: "90% noise reduction silent clicks. Ideal for library study areas without clicking distractions. Includes USB nano dongle and fresh Duracell battery.",
      seller: {
        id: "u_ananya",
        name: "Ananya Murthy",
        college: "Bangalore Institute of Technology & Sciences (BITS)",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
        verified: true,
        rating: 5.0,
        reviewsCount: 19,
        responseTime: "< 15 mins"
      }
    },
    {
      id: "item_10",
      title: "Ergonomic Foldable Aluminum Laptop Stand",
      category: "electronic-accessories",
      categoryName: "Electronic Accessories",
      price: 650,
      originalPrice: 1499,
      listingType: "sale",
      condition: "Like New",
      distance: "0.3 km away",
      pickupSpot: "Block-B Cafe",
      timeAgo: "2 hours ago",
      featured: false,
      images: [
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80"
      ],
      description: "6 adjustable height angles with silicone anti-slip pads. Keeps laptop cool during heavy compilation and prevents neck strain.",
      seller: {
        id: "u_priya",
        name: "Priya Deshmukh",
        college: "Bangalore Institute of Technology & Sciences (BITS)",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
        verified: true,
        rating: 4.9,
        reviewsCount: 31,
        responseTime: "< 5 mins"
      }
    },
    {
      id: "item_11",
      title: "7-in-1 Type-C Multiport Adapter Hub (4K HDMI)",
      category: "electronic-accessories",
      categoryName: "Electronic Accessories",
      price: 550,
      originalPrice: 1599,
      listingType: "sale",
      condition: "Good Condition",
      distance: "0.5 km away",
      pickupSpot: "Innovation Lab",
      timeAgo: "6 hours ago",
      featured: false,
      images: [
        "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=600&auto=format&fit=crop&q=80"
      ],
      description: "Includes HDMI 4K@30Hz, 3x USB 3.0, SD/TF card readers, 87W Power Delivery passthrough. Works with MacBooks and Windows laptops.",
      seller: {
        id: "u_rahul",
        name: "Rahul Sharma",
        college: "Bangalore Institute of Technology & Sciences (BITS)",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
        verified: true,
        rating: 4.8,
        reviewsCount: 14,
        responseTime: "< 30 mins"
      }
    },
    {
      id: "item_12",
      title: "Braided 100W PD Fast Charging Type-C Cable (2m)",
      category: "electronic-accessories",
      categoryName: "Electronic Accessories",
      price: 180,
      originalPrice: 499,
      listingType: "sale",
      condition: "Brand New",
      distance: "0.1 km away",
      pickupSpot: "Hostel Block 1 Lobby",
      timeAgo: "1 day ago",
      featured: false,
      images: [
        "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80"
      ],
      description: "Tangle-free nylon braided 100 Watt E-Marker Type-C cable. Brand new sealed pack extra from 2-pack combo.",
      seller: {
        id: "u_priya",
        name: "Priya Deshmukh",
        college: "Bangalore Institute of Technology & Sciences (BITS)",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
        verified: true,
        rating: 4.9,
        reviewsCount: 11,
        responseTime: "< 20 mins"
      }
    },

    // 4. Study Materials
    {
      id: "item_13",
      title: "Higher Engineering Mathematics — B.S. Grewal (44th Ed)",
      category: "study-materials",
      categoryName: "Study Materials",
      price: 300,
      originalPrice: 850,
      listingType: "sale",
      condition: "Good Condition",
      distance: "0.2 km away",
      pickupSpot: "Central Library Steps",
      timeAgo: "15 mins ago",
      featured: true,
      images: [
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80"
      ],
      description: "Standard essential textbook for 1st & 2nd year Engineering Mathematics at BITS. All pages intact with clean pencil underlines. No torn pages.",
      seller: {
        id: "u_priya",
        name: "Priya Deshmukh",
        college: "Bangalore Institute of Technology & Sciences (BITS)",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
        verified: true,
        rating: 4.9,
        reviewsCount: 31,
        responseTime: "< 5 mins"
      }
    },
    {
      id: "item_14",
      title: "Concepts of Physics (Vol 1 & 2) — H.C. Verma",
      category: "study-materials",
      categoryName: "Study Materials",
      price: 250,
      originalPrice: 790,
      listingType: "exchange",
      condition: "Good Condition",
      exchangeFor: "Will trade for Basic Electrical Engineering reference book",
      distance: "0.3 km away",
      pickupSpot: "Physics Dept Atrium",
      timeAgo: "3 hours ago",
      featured: false,
      images: [
        "https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=600&auto=format&fit=crop&q=80"
      ],
      description: "Both volumes included together. Excellent for engineering physics foundation and competitive concepts.",
      seller: {
        id: "u_rahul",
        name: "Rahul Sharma",
        college: "Bangalore Institute of Technology & Sciences (BITS)",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
        verified: true,
        rating: 4.7,
        reviewsCount: 16,
        responseTime: "< 25 mins"
      }
    },
    {
      id: "item_15",
      title: "GATE 2026 Computer Science Topicwise Solved Papers",
      category: "study-materials",
      categoryName: "Study Materials",
      price: 500,
      originalPrice: 1150,
      listingType: "sale",
      condition: "Like New",
      distance: "0.2 km away",
      pickupSpot: "CSE Dept 2nd Floor",
      timeAgo: "5 hours ago",
      featured: false,
      images: [
        "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80"
      ],
      description: "Comprehensive 35-year topic-wise solved paper collection for GATE CSE/IT by Made Easy. Clean copies with bookmark ribbons.",
      seller: {
        id: "u_aarav",
        name: "Aarav Patel",
        college: "Bangalore Institute of Technology & Sciences (BITS)",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80",
        verified: true,
        rating: 4.95,
        reviewsCount: 12,
        responseTime: "< 10 mins"
      }
    },
    {
      id: "item_16",
      title: "Introduction to Algorithms (CLRS 3rd Edition)",
      category: "study-materials",
      categoryName: "Study Materials",
      price: 450,
      originalPrice: 1250,
      listingType: "sale",
      condition: "Good Condition",
      distance: "0.4 km away",
      pickupSpot: "Central Library Quad",
      timeAgo: "1 day ago",
      featured: false,
      images: [
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80"
      ],
      description: "The bible of algorithms. Hardcover edition, perfect for 3rd semester DSA and technical interview preparation.",
      seller: {
        id: "u_rahul",
        name: "Rahul Sharma",
        college: "Bangalore Institute of Technology & Sciences (BITS)",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
        verified: true,
        rating: 4.9,
        reviewsCount: 28,
        responseTime: "< 10 mins"
      }
    },

    // 5. Notes & Resources
    {
      id: "item_17",
      title: "Data Structures & Algorithms Handwritten Semester Notes (Complete)",
      category: "notes-resources",
      categoryName: "Notes & Resources",
      price: 100,
      originalPrice: 250,
      listingType: "sale",
      condition: "Brand New",
      distance: "0.2 km away",
      pickupSpot: "SAC Reading Hall or Digital PDF",
      timeAgo: "10 mins ago",
      featured: true,
      images: [
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80"
      ],
      description: "Crystal clear handwritten notes with diagrams for Trees, Graphs, DP, Sorting algorithms, and BITS exam question breakdowns. Hardcopy spiral bound or instant digital copy.",
      seller: {
        id: "u_ananya",
        name: "Ananya Murthy",
        college: "Bangalore Institute of Technology & Sciences (BITS)",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
        verified: true,
        rating: 5.0,
        reviewsCount: 19,
        responseTime: "< 15 mins"
      }
    },
    {
      id: "item_18",
      title: "DBMS Complete Lab Manual, SQL Queries & Schema Notes",
      category: "notes-resources",
      categoryName: "Notes & Resources",
      price: 100,
      originalPrice: 200,
      listingType: "sale",
      condition: "Like New",
      distance: "0.3 km away",
      pickupSpot: "IT Dept Lab 3",
      timeAgo: "2 hours ago",
      featured: false,
      images: [
        "https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&auto=format&fit=crop&q=80"
      ],
      description: "Includes all 12 BITS CSE lab experiment queries, ER diagrams, normalization cheatsheets, and viva question bank.",
      seller: {
        id: "u_ananya",
        name: "Ananya Murthy",
        college: "Bangalore Institute of Technology & Sciences (BITS)",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
        verified: true,
        rating: 5.0,
        reviewsCount: 15,
        responseTime: "< 15 mins"
      }
    },
    {
      id: "item_19",
      title: "Engineering Mathematics III Formula Cheatsheet & Summary",
      category: "notes-resources",
      categoryName: "Notes & Resources",
      price: 80,
      originalPrice: 150,
      listingType: "sale",
      condition: "Like New",
      distance: "0.2 km away",
      pickupSpot: "Library Entrance",
      timeAgo: "4 hours ago",
      featured: false,
      images: [
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80"
      ],
      description: "Condensed 14-page laminated summary covering Fourier Series, Laplace Transforms, Z-transforms, and Numerical Methods.",
      seller: {
        id: "u_priya",
        name: "Priya Deshmukh",
        college: "Bangalore Institute of Technology & Sciences (BITS)",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
        verified: true,
        rating: 4.9,
        reviewsCount: 22,
        responseTime: "< 10 mins"
      }
    },
    {
      id: "item_20",
      title: "Previous 5 Years BITS Autonomous Solved Question Papers Booklet",
      category: "notes-resources",
      categoryName: "Notes & Resources",
      price: 50,
      originalPrice: 150,
      listingType: "sale",
      condition: "Good Condition",
      distance: "0.3 km away",
      pickupSpot: "Student Canteen",
      timeAgo: "6 hours ago",
      featured: false,
      images: [
        "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80"
      ],
      description: "Includes model answer keys and repeated marks breakdown for 2nd year core subjects.",
      seller: {
        id: "u_rahul",
        name: "Rahul Sharma",
        college: "Bangalore Institute of Technology & Sciences (BITS)",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
        verified: true,
        rating: 4.8,
        reviewsCount: 11,
        responseTime: "< 20 mins"
      }
    },

    // 6. Skills & Services
    {
      id: "item_21",
      title: "Engineering Mathematics & Calculus Peer Tutoring",
      category: "skills-services",
      categoryName: "Skills & Services",
      price: 300,
      originalPrice: 500,
      listingType: "sale",
      condition: "Brand New",
      distance: "Campus Library / Online",
      pickupSpot: "Library Discussion Room 2",
      timeAgo: "1 hour ago",
      featured: true,
      images: [
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop&q=80"
      ],
      description: "1-on-1 tutoring (₹300/hr) by 9.4 CGPA senior. Helped 18+ students clear backlogs with distinction. Covers M1, M2, M3, and Transform Calculus.",
      seller: {
        id: "u_rahul",
        name: "Rahul Sharma",
        college: "Bangalore Institute of Technology & Sciences (BITS)",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
        verified: true,
        rating: 4.9,
        reviewsCount: 28,
        responseTime: "< 10 mins"
      }
    },
    {
      id: "item_22",
      title: "Tech Resume Review, ATS Formatting & Interview Prep",
      category: "skills-services",
      categoryName: "Skills & Services",
      price: 150,
      originalPrice: 400,
      listingType: "sale",
      condition: "Brand New",
      distance: "Online / Google Meet",
      pickupSpot: "Online Consultation",
      timeAgo: "3 hours ago",
      featured: false,
      images: [
        "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&auto=format&fit=crop&q=80"
      ],
      description: "Placed at Tier-1 product company. Will review your single-page tech resume, fix bullet point metrics (XYZ format), and optimize ATS keyword matching.",
      seller: {
        id: "u_aarav",
        name: "Aarav Patel",
        college: "Bangalore Institute of Technology & Sciences (BITS)",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80",
        verified: true,
        rating: 4.95,
        reviewsCount: 12,
        responseTime: "< 10 mins"
      }
    },
    {
      id: "item_23",
      title: "Club Event Posters, Fest Banners & UI/UX Design",
      category: "skills-services",
      categoryName: "Skills & Services",
      price: 250,
      originalPrice: 600,
      listingType: "exchange",
      condition: "Brand New",
      exchangeFor: "Open to trading design work for coding backend support or cloud credits",
      distance: "On Campus",
      pickupSpot: "Design Lab Block-A",
      timeAgo: "7 hours ago",
      featured: false,
      images: [
        "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&auto=format&fit=crop&q=80"
      ],
      description: "Figma & Photoshop expert. Will design clean social media posters, event banners, badges, or mobile app UI components with fast 24-hour turnaround.",
      seller: {
        id: "u_ananya",
        name: "Ananya Murthy",
        college: "Bangalore Institute of Technology & Sciences (BITS)",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
        verified: true,
        rating: 5.0,
        reviewsCount: 19,
        responseTime: "< 15 mins"
      }
    },
    {
      id: "item_24",
      title: "Campus Portfolio, LinkedIn Headshot & Convocation Photography",
      category: "skills-services",
      categoryName: "Skills & Services",
      price: 500,
      originalPrice: 1200,
      listingType: "sale",
      condition: "Brand New",
      distance: "Campus Quadrangle",
      pickupSpot: "Campus Amphitheatre",
      timeAgo: "1 day ago",
      featured: false,
      images: [
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80"
      ],
      description: "Sony Alpha Full-Frame camera. 45-min shoot on campus with 10 high-resolution color-graded photos for LinkedIn, club profiles, and grad memories.",
      seller: {
        id: "u_rahul",
        name: "Rahul Sharma",
        college: "Bangalore Institute of Technology & Sciences (BITS)",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
        verified: true,
        rating: 4.8,
        reviewsCount: 14,
        responseTime: "< 30 mins"
      }
    },

    // 7. Free / Giveaways
    {
      id: "item_25",
      title: "Set of 3rd Sem Electronics Reference Books",
      category: "free-giveaways",
      categoryName: "Free / Giveaways",
      price: 0,
      originalPrice: 950,
      listingType: "free",
      condition: "Good Condition",
      distance: "0.3 km away",
      pickupSpot: "Hostel 3 Common Room",
      timeAgo: "25 mins ago",
      featured: true,
      images: [
        "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&auto=format&fit=crop&q=80"
      ],
      description: "Passing these down to junior batches at BITS! Includes Microelectronics by Sedra & Smith and Analog Circuits fundamentals. Completely FREE to any enrolled student.",
      seller: {
        id: "u_priya",
        name: "Priya Deshmukh",
        college: "Bangalore Institute of Technology & Sciences (BITS)",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
        verified: true,
        rating: 4.9,
        reviewsCount: 16,
        responseTime: "< 25 mins"
      }
    },
    {
      id: "item_26",
      title: "Set of 4 Unused Classmate Long Ruled Notebooks",
      category: "free-giveaways",
      categoryName: "Free / Giveaways",
      price: 0,
      originalPrice: 280,
      listingType: "free",
      condition: "Brand New",
      distance: "0.2 km away",
      pickupSpot: "Library Parking",
      timeAgo: "1 hour ago",
      featured: false,
      images: [
        "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80"
      ],
      description: "Bought extra notebook pack during orientation semester. Brand new, unwritten pages. Free for anyone who needs them for the new sem.",
      seller: {
        id: "u_priya",
        name: "Priya Deshmukh",
        college: "Bangalore Institute of Technology & Sciences (BITS)",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
        verified: true,
        rating: 4.9,
        reviewsCount: 31,
        responseTime: "< 5 mins"
      }
    },
    {
      id: "item_27",
      title: "Pure Cotton Chemistry Lab Coat (Unisex Size L)",
      category: "free-giveaways",
      categoryName: "Free / Giveaways",
      price: 0,
      originalPrice: 350,
      listingType: "free",
      condition: "Like New",
      distance: "0.4 km away",
      pickupSpot: "Chemistry Dept Lab 1",
      timeAgo: "2 hours ago",
      featured: false,
      images: [
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80"
      ],
      description: "Freshly washed and ironed laboratory coat. Mandatory for 1st-year BITS Chemistry & Bio labs. Free for 1st year fresher students.",
      seller: {
        id: "u_ananya",
        name: "Ananya Murthy",
        college: "Bangalore Institute of Technology & Sciences (BITS)",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
        verified: true,
        rating: 5.0,
        reviewsCount: 22,
        responseTime: "< 10 mins"
      }
    },
    {
      id: "item_28",
      title: "Complete Operating Systems & Linux Handwritten Notes",
      category: "free-giveaways",
      categoryName: "Free / Giveaways",
      price: 0,
      originalPrice: 200,
      listingType: "free",
      condition: "Like New",
      distance: "Digital Download / On-Campus",
      pickupSpot: "Library 1st Floor",
      timeAgo: "5 hours ago",
      featured: false,
      images: [
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80"
      ],
      description: "Includes process synchronization, semaphores, paging, deadlock prevention algorithms, and memory management summary.",
      seller: {
        id: "u_rahul",
        name: "Rahul Sharma",
        college: "Bangalore Institute of Technology & Sciences (BITS)",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
        verified: true,
        rating: 4.9,
        reviewsCount: 28,
        responseTime: "< 10 mins"
      }
    }
  ],

  campusTicker: [
    { text: "Priya D. just shared Free Chemistry Lab Coat with a 1st-year junior in Chem Lab", time: "2m ago" },
    { text: "Aarav Patel accepted an exchange offer for GATE Solved Papers", time: "8m ago" },
    { text: "Rahul Sharma listed BITS Techfest 2026 Delegate Pass for ₹350", time: "19m ago" },
    { text: "Ananya Murthy gave away 4 Classmate Notebooks to a student in Hostel 2", time: "34m ago" },
    { text: "Dev Mehta booked a ticket for DevSprint Autonomous Agent Hackathon", time: "1h ago" }
  ],

  initialMessages: {
    "u_rahul": [
      {
        id: "m_1",
        sender: "u_rahul",
        senderName: "Rahul Sharma",
        text: "Hey! Saw your interest in the Techfest Pass / Sony Headphones. Are you free around 4:30 PM near the Central Library?",
        timestamp: "10:15 AM",
        isUser: false
      }
    ],
    "u_ananya": [
      {
        id: "m_2",
        sender: "u_ananya",
        senderName: "Ananya Murthy",
        text: "Hi! Yes, the DSA Handwritten Notes are available. I can hand over the spiral-bound copy at SAC cafeteria.",
        timestamp: "Yesterday",
        isUser: false
      }
    ]
  }
};
