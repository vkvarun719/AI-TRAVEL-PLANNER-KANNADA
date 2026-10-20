import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    # =========================================================================
    # KANNADA FLAG & HERITAGE COLOR PALETTE
    # Karnataka Flag: Vibrant Yellow (Haladi - #FFCC00) & Crimson Red (Kempu - #C8102E)
    # Background: Elegant Warm Cream / Ivory (#FAF6F0) with crisp white cards
    # =========================================================================
    FLAG_RED = RGBColor(200, 16, 46)        # Iconic Karnataka Flag Red
    FLAG_YELLOW = RGBColor(245, 175, 15)    # Iconic Karnataka Flag Yellow / Gold
    DARK_TEXT = RGBColor(26, 22, 19)        # Deep Charcoal for sharp readability
    MUTED_TEXT = RGBColor(95, 90, 85)       # Elegant Muted Gray-Brown
    BG_CREAM = RGBColor(250, 246, 240)      # Clean Warm Kannada Canvas (#FAF6F0)
    CARD_WHITE = RGBColor(255, 255, 255)    # Crisp White Card Background
    WHITE = RGBColor(255, 255, 255)         # Pure White Text
    BORDER_LIGHT = RGBColor(230, 224, 215)  # Subtle divider border
    FOREST_GREEN = RGBColor(26, 122, 74)    # Western Ghats Green

    blank_layout = prs.slide_layouts[6]

    def set_slide_background(slide):
        # 1. Main warm canvas
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_CREAM
        bg.line.fill.background()

        # 2. Kannada Flag Top Accent Bar (Half Yellow, Half Red)
        bar_y = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(6.666), Inches(0.12))
        bar_y.fill.solid()
        bar_y.fill.fore_color.rgb = FLAG_YELLOW
        bar_y.line.fill.background()

        bar_r = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(6.666), 0, Inches(6.667), Inches(0.12))
        bar_r.fill.solid()
        bar_r.fill.fore_color.rgb = FLAG_RED
        bar_r.line.fill.background()

        # 3. Bottom Subtle Bar
        bot_r = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, Inches(7.42), Inches(6.666), Inches(0.08))
        bot_r.fill.solid()
        bot_r.fill.fore_color.rgb = FLAG_RED
        bot_r.line.fill.background()

        bot_y = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(6.666), Inches(7.42), Inches(6.667), Inches(0.08))
        bot_y.fill.solid()
        bot_y.fill.fore_color.rgb = FLAG_YELLOW
        bot_y.line.fill.background()

    def add_header(slide, title_text, category_text="KANNADA HACKATHON · PROBLEM STATEMENT 6"):
        # Header Badge with Kannada Flag Yellow Background
        badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.38), Inches(4.8), Inches(0.35))
        badge.fill.solid()
        badge.fill.fore_color.rgb = FLAG_YELLOW
        badge.line.fill.background()
        tf_b = badge.text_frame
        tf_b.margin_left = Inches(0.15)
        tf_b.margin_top = Inches(0.05)
        p_b = tf_b.paragraphs[0]
        p_b.text = f"★  {category_text.upper()}"
        p_b.font.size = Pt(10)
        p_b.font.bold = True
        p_b.font.color.rgb = DARK_TEXT

        # Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.75), Inches(11.7), Inches(0.8))
        tf_t = title_box.text_frame
        tf_t.word_wrap = True
        p_t = tf_t.paragraphs[0]
        p_t.text = title_text
        p_t.font.size = Pt(25)
        p_t.font.bold = True
        p_t.font.color.rgb = FLAG_RED

    # =========================================================================
    # SLIDE 1: TITLE SLIDE (BOLD KANNADA FLAG DUAL-TONE BANNER)
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1)

    # Top Kannada Flag Block (Yellow)
    top_block = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.2), Inches(11.733), Inches(2.2))
    top_block.fill.solid()
    top_block.fill.fore_color.rgb = FLAG_YELLOW
    top_block.line.fill.background()

    tf_top = top_block.text_frame
    tf_top.word_wrap = True
    tf_top.margin_left = Inches(0.4)
    tf_top.margin_top = Inches(0.25)
    
    p = tf_top.paragraphs[0]
    p.text = "🏆 KANNADA HACKATHON · PROBLEM STATEMENT 6"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = FLAG_RED
    p.space_after = Pt(8)

    p = tf_top.add_paragraph()
    p.text = "ಯಾತ್ರಾ AI — Yatra AI: Discover Karnataka Like a Local"
    p.font.size = Pt(30)
    p.font.bold = True
    p.font.color.rgb = DARK_TEXT

    # Bottom Kannada Flag Block (Crimson Red)
    bot_block = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(3.4), Inches(11.733), Inches(1.7))
    bot_block.fill.solid()
    bot_block.fill.fore_color.rgb = FLAG_RED
    bot_block.line.fill.background()

    tf_bot = bot_block.text_frame
    tf_bot.word_wrap = True
    tf_bot.margin_left = Inches(0.4)
    tf_bot.margin_top = Inches(0.25)

    p = tf_bot.paragraphs[0]
    p.text = "Hyper-Local AI Travel Planner with Ghat Routes, ASI Timings, Stays & Iconic Regional Dining"
    p.font.size = Pt(17)
    p.font.bold = True
    p.font.color.rgb = WHITE
    p.space_after = Pt(6)

    p = tf_bot.add_paragraph()
    p.text = "Personalized Karnataka itineraries based on interests, available time, budget & authentic cultural experiences."
    p.font.size = Pt(13)
    p.font.color.rgb = RGBColor(255, 235, 235)

    # Production links white card
    links_card = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(5.3), Inches(11.733), Inches(1.5))
    links_card.fill.solid()
    links_card.fill.fore_color.rgb = CARD_WHITE
    links_card.line.color.rgb = BORDER_LIGHT
    links_card.line.width = Pt(1.5)

    tf_l = links_card.text_frame
    tf_l.word_wrap = True
    tf_l.margin_left = Inches(0.4)
    tf_l.margin_top = Inches(0.2)

    p = tf_l.paragraphs[0]
    p.text = "LIVE DEPLOYMENT & OPEN SOURCE LINKS:"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = FLAG_RED
    p.space_after = Pt(6)

    p = tf_l.add_paragraph()
    p.text = "🌐 Live Application (Vercel):  https://ai-travel-planner-kannada.vercel.app\n⚡ Production API (Render):    https://ai-travel-planner-kannada.onrender.com\n💻 GitHub Repository:           https://github.com/vkvarun719/AI-TRAVEL-PLANNER-KANNADA"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = DARK_TEXT

    # =========================================================================
    # SLIDE 2: PROBLEM STATEMENT
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2)
    add_header(s2, "Problem Statement: Why Karnataka Needs a Dedicated AI Planner")

    cards_data_2 = [
        ("THE CHOSEN PROBLEM", "Problem Statement 6: AI Travel Planner for Karnataka", 
         "Creating tailored itineraries dynamically taking into account user time, budget, starting point, and authentic regional travel style.", FLAG_RED),
        ("WHO IS AFFECTED?", "Tourists, Bikers & Weekend Explorers", 
         "• Domestic & international heritage seekers.\n• Road-trippers & motorcycle enthusiasts navigating Western Ghats passes.\n• Solo explorers needing seasonal safety & local food advice.", FLAG_YELLOW),
        ("WHY IT MATTERS", "Vast Regional Nuance Across Districts", 
         "Karnataka encompasses boulder ruins in Hampi, dense rainforests in Agumbe & Coorg, and coastal Gokarna. Generic planners fail to account for real local conditions.", FLAG_RED)
    ]

    for idx, (head, sub, desc, border_color) in enumerate(cards_data_2):
        left = Inches(0.8 + idx * 4.0)
        card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(1.8), Inches(3.7), Inches(4.9))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_WHITE
        card.line.color.rgb = border_color
        card.line.width = Pt(2)

        # Top decorative flag stripe on card
        stripe = s2.shapes.add_shape(MSO_SHAPE.RECTANGLE, left, Inches(1.8), Inches(3.7), Inches(0.15))
        stripe.fill.solid()
        stripe.fill.fore_color.rgb = border_color
        stripe.line.fill.background()

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.3)
        tf.margin_right = Inches(0.3)
        tf.margin_top = Inches(0.35)

        p = tf.paragraphs[0]
        p.text = head
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = border_color
        p.space_after = Pt(8)

        p = tf.add_paragraph()
        p.text = sub
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = DARK_TEXT
        p.space_after = Pt(14)

        p = tf.add_paragraph()
        p.text = desc
        p.font.size = Pt(13)
        p.font.color.rgb = MUTED_TEXT

    # =========================================================================
    # SLIDE 3: EXISTING SYSTEM & LIMITATIONS
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3)
    add_header(s3, "Existing Systems & Critical Real-World Gaps")

    gaps = [
        ("1. Zero Road & Monsoon Safety Nuance", 
         "Generic planners blindly route travelers through Bandipur after 9:00 PM (when roads are legally locked down for tiger preservation) or recommend flooded Western Ghats trails during active monsoon landslides.", FLAG_RED),
        ("2. Commercial Buffets & Tourist Traps", 
         "Existing platforms recommend generic chain restaurants instead of Karnataka's legendary GI-tagged institutions (MTR, Vinayaka Mylari, Shetty Lunch Home, Mitra Samaj).", FLAG_YELLOW),
        ("3. Rigid & Impractical Timing Schedules", 
         "Fail to account for ASI monument timings (Hampi 6AM-6PM, Virupaksha afternoon break), temple dress codes, or manual Tungabhadra coracle river crossings.", FLAG_RED),
        ("4. Fragmented User Experience", 
         "Users are forced to juggle between blogs for inspiration, Google Maps for distances, and spreadsheets for budget estimates with zero local language assistance.", FLAG_YELLOW)
    ]

    for idx, (title, body, col) in enumerate(gaps):
        col_idx = idx % 2
        row_idx = idx // 2
        left = Inches(0.8 + col_idx * 5.95)
        top = Inches(1.8 + row_idx * 2.5)

        card = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(5.7), Inches(2.2))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_WHITE
        card.line.color.rgb = col
        card.line.width = Pt(1.8)

        # Left border indicator
        accent = s3.shapes.add_shape(MSO_SHAPE.RECTANGLE, left, top, Inches(0.12), Inches(2.2))
        accent.fill.solid()
        accent.fill.fore_color.rgb = col
        accent.line.fill.background()

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.3)
        tf.margin_right = Inches(0.3)
        tf.margin_top = Inches(0.25)

        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = DARK_TEXT
        p.space_after = Pt(6)

        p = tf.add_paragraph()
        p.text = body
        p.font.size = Pt(12)
        p.font.color.rgb = MUTED_TEXT

    # =========================================================================
    # SLIDE 4: HOW YOUR SOLUTION IS DIFFERENT
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4)
    add_header(s4, "How Yatra AI Is Different: Kannada-Centric Architecture")

    diff_cards = [
        ("Domain Intelligence", "500-Line Knowledge Base",
         "Generic travel blogs.",
         "Engineered prompt with NH-75 ghats, SH-17 biker curves, ASI temple hours & monsoon landslide warnings.", FLAG_RED),
        ("Curated Culinary Spots", "Iconic Regional Food",
         "Hotel buffet chains.",
         "Recommends specific must-order dishes: Coorg Pandi Curry, Mangaluru Kori Rotti, Udupi Goli Baje, Dharwad Pedha.", FLAG_YELLOW),
        ("Dynamic Budget Engine", "Interactive SVG Donut",
         "Single lump-sum guess.",
         "Live switcher between Budget, Mid-Range & Luxury with dynamic stay, food & permit percentage allocations.", FLAG_RED),
        ("Language Companion", "Local Kannada Companion",
         "Zero linguistic help.",
         "Built-in Kannada phrasebook with script, phonetics, English translation, audio-copy tool, and temple etiquette.", FLAG_YELLOW)
    ]

    for idx, (feature, ours_title, trad_txt, our_txt, col) in enumerate(diff_cards):
        left = Inches(0.8 + idx * 2.95)
        card = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(1.8), Inches(2.8), Inches(4.9))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_WHITE
        card.line.color.rgb = col
        card.line.width = Pt(1.8)

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.2)
        tf.margin_right = Inches(0.2)
        tf.margin_top = Inches(0.25)

        p = tf.paragraphs[0]
        p.text = feature.upper()
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = col
        p.space_after = Pt(10)

        p = tf.add_paragraph()
        p.text = "Traditional Planners:"
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = MUTED_TEXT

        p = tf.add_paragraph()
        p.text = trad_txt
        p.font.size = Pt(11)
        p.font.color.rgb = MUTED_TEXT
        p.space_after = Pt(14)

        p = tf.add_paragraph()
        p.text = "Yatra AI Advantage:"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = FLAG_RED

        p = tf.add_paragraph()
        p.text = our_txt
        p.font.size = Pt(11)
        p.font.color.rgb = DARK_TEXT

    # =========================================================================
    # SLIDE 5: METHODOLOGY & WORKFLOW
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5)
    add_header(s5, "Methodology: End-to-End Execution Pipeline")

    steps = [
        ("Step 1: User Parameter Intake", "Captures origin hub (Bangalore, Mysore, Hampi, etc.), duration (1-14 days), budget tier, and custom interest chips (Western Ghats, Heritage, Motorcycle, Food).", FLAG_RED),
        ("Step 2: Contextual AI Prompting", "Injects 20+ years of Karnataka highway and district intelligence into Gemini 3 Flash, enforcing strict JSON output containing hotel stays, spots & food.", FLAG_YELLOW),
        ("Step 3: Lightweight Async Processing", "FastAPI validates requests using Pydantic, calls Gemini via asynchronous non-blocking HTTP pipelines, keeping local RAM usage under 30MB.", FLAG_RED),
        ("Step 4: Interactive Dashboard Display", "Renders a responsive two-column view: sticky sidebar with transit route map and budget donut, paired with daily photo thumbnails and Kannada companion.", FLAG_YELLOW)
    ]

    for idx, (title, body, col) in enumerate(steps):
        top = Inches(1.8 + idx * 1.25)
        card = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), top, Inches(11.7), Inches(1.05))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_WHITE
        card.line.color.rgb = col
        card.line.width = Pt(1.5)

        # Left Accent Tag
        accent = s5.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), top, Inches(0.12), Inches(1.05))
        accent.fill.solid()
        accent.fill.fore_color.rgb = col
        accent.line.fill.background()

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.35)
        tf.margin_right = Inches(0.3)
        tf.margin_top = Inches(0.15)

        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = col

        p2 = tf.add_paragraph()
        p2.text = body
        p2.font.size = Pt(12)
        p2.font.color.rgb = DARK_TEXT

    # =========================================================================
    # SLIDE 6: TECH STACK & ARCHITECTURE
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6)
    add_header(s6, "Tech Stack & System Architecture")

    # Left: Tech Stack Box
    card_ts = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(4.5), Inches(4.9))
    card_ts.fill.solid()
    card_ts.fill.fore_color.rgb = CARD_WHITE
    card_ts.line.color.rgb = FLAG_RED
    card_ts.line.width = Pt(2)

    tf_ts = card_ts.text_frame
    tf_ts.word_wrap = True
    tf_ts.margin_left = Inches(0.3)
    tf_ts.margin_right = Inches(0.3)
    tf_ts.margin_top = Inches(0.3)

    p = tf_ts.paragraphs[0]
    p.text = "CORE TECHNOLOGIES"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = FLAG_RED
    p.space_after = Pt(10)

    p = tf_ts.add_paragraph()
    p.text = "• Frontend:\n  React 18 + Vite + Tailwind CSS + Lucide Icons\n  (Hosted on Vercel Edge Network)\n\n• Backend:\n  FastAPI (Python) + Async HTTPX Engine\n  (Hosted on Render Cloud)\n\n• AI Model:\n  Google Gemini 3 Flash REST Engine\n  (Zero heavy Rust/compile dependencies)\n\n• Design Philosophy:\n  All heavy cognitive load offloaded to API; 100% lightweight local execution."
    p.font.size = Pt(12)
    p.font.color.rgb = DARK_TEXT

    # Right: Architecture Flow Steps
    card_af = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(5.6), Inches(1.8), Inches(6.9), Inches(4.9))
    card_af.fill.solid()
    card_af.fill.fore_color.rgb = CARD_WHITE
    card_af.line.color.rgb = FLAG_YELLOW
    card_af.line.width = Pt(2)

    tf_af = card_af.text_frame
    tf_af.word_wrap = True
    tf_af.margin_left = Inches(0.3)
    tf_af.margin_right = Inches(0.3)
    tf_af.margin_top = Inches(0.3)

    p = tf_af.paragraphs[0]
    p.text = "SYSTEM ARCHITECTURE & DATA FLOW"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = FLAG_RED
    p.space_after = Pt(10)

    p = tf_af.add_paragraph()
    p.text = "[Client: React 18 Browser]\n   ↓  1. POST /api/generate-itinerary (Parameters: days, budget, interests)\n[Backend: FastAPI on Render]\n   ↓  2. Enriches with 500-Line Karnataka Knowledge Base\n[AI Core: Google Gemini 3 Flash]\n   ↓  3. Generates Structured JSON (Day Plan, Stays, Places, Dishes)\n[Backend: Validation & Sanitization Engine]\n   ↓  4. Returns Schema-Conformant Response\n[Client UI: Responsive 2-Column Dashboard]\n   • Renders Vector Transit Map & Landmark Photos\n   • Displays Dynamic Budget Donut & Kannada Phrasebook"
    p.font.size = Pt(12)
    p.font.color.rgb = DARK_TEXT

    # =========================================================================
    # SLIDE 7: LIVE DEMO & KEY CAPABILITIES
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7)
    add_header(s7, "Production Features: Live Platform Showcase")

    features = [
        ("📍 Interactive Route Map", "Clickable SVG Karnataka corridor connecting transit waypoints. Clicking any node instantly updates high-res landmark photography and district overviews.", FLAG_RED),
        ("🏨 Stay & Dining Dossier", "Every day includes recommended hotel/homestay names with exact area & nightly pricing, paired with must-order local dishes (e.g. Coorg Pandi Curry, Mangaluru Kori Rotti).", FLAG_YELLOW),
        ("💰 Dynamic Budget Donut", "SVG breakdown dividing trip expenditure across Homestays (40%), Dining (25%), Transit (20%), and Entry fees (15%), with live tier switching.", FLAG_RED),
        ("🗣️ Local Kannada Companion", "Empowers travelers with conversational Kannada phrases, phonetic pronunciation, one-click clipboard copy, and temple etiquette guidelines.", FLAG_YELLOW),
        ("🖨️ 1-Click Offline PDF Export", "Full day-by-day itinerary printable directly to PDF for offline navigation through zero-network Western Ghats forest zones.", FLAG_RED),
        ("📱 100% Mobile Responsive", "Fluid responsive layout that expands to a 2-column dashboard on desktop and smoothly collapses to single-column scroll on mobile.", FLAG_YELLOW)
    ]

    for idx, (title, desc, col) in enumerate(features):
        c_idx = idx % 3
        r_idx = idx // 3
        left = Inches(0.8 + c_idx * 4.0)
        top = Inches(1.8 + r_idx * 2.5)

        card = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(3.7), Inches(2.2))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_WHITE
        card.line.color.rgb = col
        card.line.width = Pt(1.8)

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.25)
        tf.margin_right = Inches(0.25)
        tf.margin_top = Inches(0.2)

        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = col
        p.space_after = Pt(6)

        p = tf.add_paragraph()
        p.text = desc
        p.font.size = Pt(11)
        p.font.color.rgb = MUTED_TEXT

    # =========================================================================
    # SLIDE 8: CONCLUSION & FUTURE SCOPE
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_background(s8)
    add_header(s8, "Conclusion, Impact & Future Horizons")

    # Left: Impact & Summary
    card_c = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(5.7), Inches(4.9))
    card_c.fill.solid()
    card_c.fill.fore_color.rgb = CARD_WHITE
    card_c.line.color.rgb = FLAG_RED
    card_c.line.width = Pt(2)

    tf_c = card_c.text_frame
    tf_c.word_wrap = True
    tf_c.margin_left = Inches(0.3)
    tf_c.margin_right = Inches(0.3)
    tf_c.margin_top = Inches(0.3)

    p = tf_c.paragraphs[0]
    p.text = "SOLUTION SUMMARY & IMPACT"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = FLAG_RED
    p.space_after = Pt(12)

    p = tf_c.add_paragraph()
    p.text = "• Bridges the Gap in Travel AI:\n  Transforms generic AI travel advice into a grounded, hyper-local Karnataka itinerary engine.\n\n• Promotes Local Cultural Economy:\n  Highlights authentic local eateries, homestays, and lesser-known ASI heritage structures beyond standard tourist hotspots.\n\n• Enhances Traveler Safety:\n  Provides preventative seasonal intelligence regarding monsoon road conditions and wildlife sanctuary transit restrictions.\n\n• Production Ready:\n  Fully deployed live on Vercel + Render with zero ongoing infrastructure costs."
    p.font.size = Pt(12)
    p.font.color.rgb = DARK_TEXT

    # Right: Future Scope
    card_f = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.8), Inches(5.7), Inches(4.9))
    card_f.fill.solid()
    card_f.fill.fore_color.rgb = CARD_WHITE
    card_f.line.color.rgb = FLAG_YELLOW
    card_f.line.width = Pt(2)

    tf_f = card_f.text_frame
    tf_f.word_wrap = True
    tf_f.margin_left = Inches(0.3)
    tf_f.margin_right = Inches(0.3)
    tf_f.margin_top = Inches(0.3)

    p = tf_f.paragraphs[0]
    p.text = "FUTURE ROADMAP"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = FLAG_RED
    p.space_after = Pt(12)

    p = tf_f.add_paragraph()
    p.text = "1. Kannada Voice Narration (TTS):\n   Integration of voice playback for day plans and authentic audio pronunciation for native speakers.\n\n2. Direct KSRTC & Railway Booking Links:\n   One-click deep integration with KSRTC Airavat buses and Vande Bharat train schedules.\n\n3. Crowdsourced Ghat Weather Updates:\n   Community-driven live condition reports for Shiradi Ghat, Charmadi Ghat, and Agumbe passes during monsoon.\n\n4. AR Heritage Walking Tours:\n   Augmented reality overlays for Hampi stone monuments and Hoysala temples."
    p.font.size = Pt(12)
    p.font.color.rgb = DARK_TEXT

    # Save to file with dedicated Kannada Flag Theme name
    output_path = os.path.join(os.getcwd(), "Yatra_AI_Karnataka_Flag_Theme.pptx")
    prs.save(output_path)
    print(f"Presentation successfully created at: {output_path}")

if __name__ == "__main__":
    create_presentation()
