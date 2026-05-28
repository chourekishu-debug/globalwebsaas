// VERSION: 3.0 — niche-aware audience AI
import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

function extractText(data: any): string {
  try {
    const choice = data?.choices?.[0];
    if (!choice) return '';
    const content = choice?.message?.content;
    if (content && typeof content === 'string' && content.trim()) return content.trim();
    const reasoning = choice?.message?.reasoning;
    if (reasoning && typeof reasoning === 'string' && reasoning.trim()) return reasoning.trim();
    const delta = choice?.delta?.content;
    if (delta && typeof delta === 'string' && delta.trim()) return delta.trim();
    const text = choice?.text;
    if (text && typeof text === 'string' && text.trim()) return text.trim();
    return '';
  } catch { return ''; }
}

// ─── NICHE DETECTOR ───────────────────────────────────────────
type NicheKey = 'dental' | 'salon' | 'coaching' | 'restaurant' | 'realestate' | 'gym' | 'hospital' | 'clothing' | 'jewellery' | 'default';

function detectNiche(business: string): NicheKey {
  const b = business.toLowerCase();
  if (/dental|dentist|teeth|tooth|orthodont|smile|clinic.*tooth/.test(b)) return 'dental';
  if (/salon|beauty|hair|spa|nail|makeup|parlour|parlor|skin|glow/.test(b)) return 'salon';
  if (/coaching|tuition|classes|institute|academy|neet|jee|upsc|psc|iit|education|school|college/.test(b)) return 'coaching';
  if (/restaurant|food|dhaba|cafe|hotel.*food|biryani|pizza|tiffin|catering|mess/.test(b)) return 'restaurant';
  if (/real.?estate|property|plot|flat|apartment|builder|construction|home.*sale|buy.*home/.test(b)) return 'realestate';
  if (/gym|fitness|yoga|zumba|workout|weight.?loss|health.*club/.test(b)) return 'gym';
  if (/hospital|clinic|doctor|physician|surgeon|health|medical|medicine|ayurved/.test(b)) return 'hospital';
  if (/cloth|fashion|boutique|saree|kurti|dress|wear|apparel|lehenga/.test(b)) return 'clothing';
  if (/jewel|gold|diamond|silver|ornament|ring|necklace/.test(b)) return 'jewellery';
  return 'default';
}

// ─── NICHE-SPECIFIC AUDIENCE SEGMENTS ─────────────────────────
function getAudienceSegments(b: string, niche: NicheKey, platform: string): object {
  const niches: Record<NicheKey, object> = {

    dental: {
      segments: [
        {
          name: 'Parents with Children (28–45)',
          size: '72,000 families in Indore',
          income: '₹40K–₹1.2L/month',
          painPoints: ['Kids refusing dentist', 'Fear of dental pain', 'Cavities & milk teeth issues'],
          interests: ['Child health', 'Parenting', 'School activities', 'Family wellbeing'],
          platforms: [platform, 'WhatsApp'],
          bestTime: '8–10 AM & 7–9 PM',
          cpl: '₹60–90',
          adAngle: 'Painless treatment for kids, friendly environment',
          message: `${b} — Gentle, Painless Dental Care for Your Children 🦷`
        },
        {
          name: 'Working Professionals (25–40)',
          size: '48,000 in Indore',
          income: '₹50K–₹1.5L/month',
          painPoints: ['Teeth staining from coffee/tea', 'No time for dentist', 'Smile confidence for meetings'],
          interests: ['Teeth whitening', 'Braces', 'Cosmetic dentistry', 'Personal grooming'],
          platforms: ['Instagram', platform],
          bestTime: '7–9 PM weekdays, 11 AM–1 PM weekends',
          cpl: '₹80–120',
          adAngle: 'Quick appointments, cosmetic results, confidence boost',
          message: `Get Your Perfect Smile at ${b} — Whitening, Braces & More ✨`
        },
        {
          name: 'Senior Citizens & Their Families (55+)',
          size: '35,000 in Indore',
          income: '₹20K–₹60K/month',
          painPoints: ['Dentures & missing teeth', 'Gum disease', 'Difficulty eating', 'High treatment cost fear'],
          interests: ['Affordable healthcare', 'Trusted doctors', 'Home care tips', 'Senior health'],
          platforms: ['Facebook', 'WhatsApp'],
          bestTime: '10 AM–12 PM & 5–7 PM',
          cpl: '₹45–70',
          adAngle: 'Affordable dentures, trusted care, easy EMI options',
          message: `${b} — Affordable Dental Solutions for Every Age in Indore 🙏`
        }
      ]
    },

    salon: {
      segments: [
        {
          name: 'Brides-to-Be & Wedding Guests (20–35)',
          size: '18,000 active in Indore per season',
          income: '₹30K–₹1L/month',
          painPoints: ['Finding reliable bridal makeup artist', 'Last-minute booking stress', 'Budget vs quality'],
          interests: ['Bridal looks', 'Mehendi', 'Hair styling', 'Instagram aesthetics'],
          platforms: ['Instagram', platform],
          bestTime: '7–10 PM daily',
          cpl: '₹70–110',
          adAngle: 'Bridal packages, portfolio showcase, trial sessions',
          message: `Look Stunning on Your Big Day — Bridal Packages at ${b} 💍`
        },
        {
          name: 'Working Women (22–40)',
          size: '55,000 in Indore',
          income: '₹25K–₹80K/month',
          painPoints: ['Hair damage from pollution', 'No time for self-care', 'Finding trusted salon'],
          interests: ['Hair care', 'Skin treatments', 'Quick services', 'Trending styles'],
          platforms: [platform, 'Instagram'],
          bestTime: '6–9 PM weekdays, all day weekends',
          cpl: '₹55–85',
          adAngle: 'Quick appointments, premium products, visible results',
          message: `${b} — Premium Salon Services That Fit Your Busy Life ✨`
        },
        {
          name: 'College Students (18–24)',
          size: '40,000 in Indore',
          income: '₹5K–₹20K/month (pocket money)',
          painPoints: ['Expensive salons', 'Hair coloring gone wrong', 'Acne & skin issues'],
          interests: ['Trending hair colors', 'Budget beauty', 'Skincare', 'Reels & Instagram looks'],
          platforms: ['Instagram', 'Facebook'],
          bestTime: '12–2 PM & 7–10 PM',
          cpl: '₹30–55',
          adAngle: 'Student discounts, trendy styles, before/after content',
          message: `Glow Up at ${b} — Special Student Offers This Month 💅`
        }
      ]
    },

    coaching: {
      segments: [
        {
          name: 'NEET/JEE Aspirants (16–20)',
          size: '25,000 active students in Indore',
          income: 'Parents: ₹40K–₹1.5L/month',
          painPoints: ['Struggling with Physics/Chemistry', 'Low mock test scores', 'Need structured guidance'],
          interests: ['Study tips', 'Rank improvement', 'Medical/Engineering colleges', 'Online tests'],
          platforms: ['Instagram', 'YouTube'],
          bestTime: '6–9 PM daily',
          cpl: '₹90–140',
          adAngle: 'Result-proven faculty, free demo class, rank improvement',
          message: `${b} — Crack NEET/JEE with Indore's Most Trusted Faculty 🎯`
        },
        {
          name: 'Parents of 10th/12th Students (38–52)',
          size: '45,000 in Indore',
          income: '₹35K–₹1L/month',
          painPoints: ['Child not studying seriously', 'Choosing right coaching', 'Fear of wasted year'],
          interests: ['Education news', 'Board results', 'Career guidance', 'Parenting'],
          platforms: ['Facebook', 'WhatsApp'],
          bestTime: '8–10 AM & 8–10 PM',
          cpl: '₹75–120',
          adAngle: 'Proven results, past toppers, free counselling session',
          message: `Give Your Child the Best Start — Free Demo at ${b} 📚`
        },
        {
          name: 'Government Job Aspirants (21–30)',
          size: '30,000 in Indore',
          income: '₹10K–₹30K/month',
          painPoints: ['Multiple exam failures', 'No proper study material', 'Lack of motivation'],
          interests: ['UPSC/MPPSC/SSC prep', 'Current affairs', 'Job news', 'Study schedule'],
          platforms: ['Facebook', 'Telegram', 'YouTube'],
          bestTime: '6–8 AM & 8–10 PM',
          cpl: '₹50–80',
          adAngle: 'Affordable fees, selection track record, free test series',
          message: `${b} — Indore's #1 Choice for Govt Exam Preparation 🏆`
        }
      ]
    },

    restaurant: {
      segments: [
        {
          name: 'Office Lunch Crowd (22–40)',
          size: '60,000 daily in Indore commercial areas',
          income: '₹25K–₹80K/month',
          painPoints: ['Boring office food', 'No time to cook', 'Clean & hygienic options'],
          interests: ['Quick meals', 'Healthy food', 'Delivery apps', 'Value for money'],
          platforms: [platform, 'Instagram'],
          bestTime: '11 AM–1 PM weekdays',
          cpl: '₹25–45',
          adAngle: 'Fast delivery, office combo deals, hygiene certifications',
          message: `${b} — Fresh, Fast Lunch Delivered to Your Office in Indore 🍱`
        },
        {
          name: 'Families for Weekend Dining (30–50)',
          size: '85,000 Indore families',
          income: '₹40K–₹1.2L/month',
          painPoints: ['Finding family-friendly restaurants', 'Kids menu options', 'Value for group dining'],
          interests: ['Family outings', 'Food reviews', 'Weekend plans', 'Special occasions'],
          platforms: ['Facebook', 'WhatsApp'],
          bestTime: 'Fri–Sun 5–9 PM',
          cpl: '₹35–60',
          adAngle: 'Family packages, kids meals, birthday celebrations',
          message: `${b} — Perfect Family Dining Experience in Indore 👨‍👩‍👧‍👦`
        },
        {
          name: 'Foodies & Young Couples (18–30)',
          size: '50,000 in Indore',
          income: '₹15K–₹50K/month',
          painPoints: ['Boring dinner options', 'Want Insta-worthy food', 'Date night ideas'],
          interests: ['Food photography', 'New restaurants', 'Cafe culture', 'Street food'],
          platforms: ['Instagram', 'YouTube'],
          bestTime: '7–10 PM daily',
          cpl: '₹30–55',
          adAngle: 'Aesthetic dishes, couple packages, trending dishes',
          message: `${b} — Indore's Most Instagrammable Food Experience 📸`
        }
      ]
    },

    realestate: {
      segments: [
        {
          name: 'First-Time Home Buyers (28–40)',
          size: '38,000 active buyers in Indore',
          income: '₹50K–₹1.5L/month',
          painPoints: ['Home loan confusion', 'Right location selection', 'Fear of fraud builders'],
          interests: ['Home loans', 'Vastu tips', 'Interior design', 'New launches'],
          platforms: [platform, 'Facebook'],
          bestTime: '7–9 PM weekdays, all day weekends',
          cpl: '₹300–500',
          adAngle: 'RERA approved, easy loan assistance, site visit offer',
          message: `${b} — Your Dream Home in Indore, RERA Approved 🏠`
        },
        {
          name: 'Investors & NRIs (35–55)',
          size: '12,000 active investors in Indore region',
          income: '₹1.5L+/month',
          painPoints: ['Safe investment options', 'Rental yield concerns', 'Market timing'],
          interests: ['Property investment', 'Rental income', 'Commercial plots', 'ROI analysis'],
          platforms: ['LinkedIn', 'Facebook'],
          bestTime: '8–10 AM & 6–8 PM',
          cpl: '₹500–800',
          adAngle: 'High rental yield, capital appreciation, investment grade',
          message: `Invest Smart in Indore Real Estate — ${b} Guarantees Returns 📈`
        },
        {
          name: 'Upgrade Buyers (38–55)',
          size: '22,000 in Indore',
          income: '₹1L–₹3L/month',
          painPoints: ['Outgrown current home', 'Need better locality', 'Premium amenities'],
          interests: ['Luxury homes', 'Gated communities', 'Club facilities', 'Premium lifestyle'],
          platforms: [platform, 'Instagram'],
          bestTime: 'Weekends 10 AM–6 PM',
          cpl: '₹600–1000',
          adAngle: 'Premium location, luxury amenities, limited units',
          message: `Upgrade to Luxury Living — Premium Homes by ${b} 👑`
        }
      ]
    },

    gym: {
      segments: [
        {
          name: 'Weight Loss Seekers (25–45)',
          size: '65,000 in Indore',
          income: '₹25K–₹80K/month',
          painPoints: ['Tried diets that failed', 'No motivation alone', 'Busy schedule'],
          interests: ['Weight loss tips', 'Diet plans', 'Transformation stories', 'Before/after content'],
          platforms: ['Instagram', platform],
          bestTime: '6–8 AM & 6–9 PM',
          cpl: '₹40–70',
          adAngle: 'Transformation results, personal trainer, free trial week',
          message: `${b} — Real Transformations, Real Results in Indore 💪`
        },
        {
          name: 'Young Fitness Enthusiasts (18–28)',
          size: '45,000 in Indore',
          income: '₹10K–₹35K/month',
          painPoints: ['Expensive gym memberships', 'Crowded gyms', 'No proper guidance'],
          interests: ['Bodybuilding', 'Protein supplements', 'Workout reels', 'Fitness influencers'],
          platforms: ['Instagram', 'YouTube'],
          bestTime: '5–8 PM daily',
          cpl: '₹30–55',
          adAngle: 'Modern equipment, expert trainers, affordable plans',
          message: `${b} — Level Up Your Fitness Game in Indore 🔥`
        },
        {
          name: 'Corporate Wellness (30–50)',
          size: '28,000 in Indore',
          income: '₹70K–₹2L/month',
          painPoints: ['Sitting job health issues', 'Back pain & posture', 'Stress management'],
          interests: ['Yoga', 'Stress relief', 'Flexibility', 'Work-life balance'],
          platforms: ['LinkedIn', platform],
          bestTime: '7–9 AM & 7–9 PM',
          cpl: '₹60–95',
          adAngle: 'Yoga & wellness programs, corporate memberships, health ROI',
          message: `${b} — Wellness Programs for Indore's Busy Professionals 🧘`
        }
      ]
    },

    hospital: {
      segments: [
        {
          name: 'Patients with Chronic Conditions (40–65)',
          size: '55,000 in Indore',
          income: '₹20K–₹80K/month',
          painPoints: ['Managing diabetes/BP/heart issues', 'Frequent hospital visits', 'High medicine costs'],
          interests: ['Health tips', 'Diet for conditions', 'Trusted doctors', 'Health insurance'],
          platforms: ['Facebook', 'WhatsApp'],
          bestTime: '9–11 AM & 5–7 PM',
          cpl: '₹50–85',
          adAngle: 'Specialist doctors, OPD availability, health packages',
          message: `${b} — Expert Specialists for Chronic Care in Indore 🏥`
        },
        {
          name: 'Young Families (25–40)',
          size: '80,000 families in Indore',
          income: '₹35K–₹1L/month',
          painPoints: ['Pediatric emergencies', 'Maternity care', 'Finding trusted hospital'],
          interests: ['Child health', 'Maternity', 'Vaccinations', 'Family health plans'],
          platforms: [platform, 'Instagram'],
          bestTime: '8–10 AM & 7–9 PM',
          cpl: '₹55–90',
          adAngle: 'NICU, maternity packages, pediatric specialists, lady doctors',
          message: `${b} — Trusted Family Healthcare in Indore 👨‍👩‍👧`
        },
        {
          name: 'Emergency & Accident Cases (All ages)',
          size: 'High urgency — search-based targeting',
          income: 'All income groups',
          painPoints: ['Need immediate care', 'Nearest hospital', '24/7 availability'],
          interests: ['Emergency care', 'Ambulance services', 'ICU facilities'],
          platforms: ['Google Ads', 'Facebook'],
          bestTime: '24/7 — always on',
          cpl: '₹30–60',
          adAngle: '24/7 emergency, trauma center, fast response ambulance',
          message: `${b} — 24/7 Emergency Care in Indore | Dial Now 🚨`
        }
      ]
    },

    clothing: {
      segments: [
        {
          name: 'Festive & Wedding Shoppers (22–45)',
          size: '90,000 in Indore per season',
          income: '₹30K–₹1.5L/month',
          painPoints: ['Finding unique designs', 'Last-minute availability', 'Matching outfits for family'],
          interests: ['Ethnic wear', 'Sarees', 'Lehenga trends', 'Festive fashion'],
          platforms: ['Instagram', platform],
          bestTime: 'Evening 6–10 PM, weekends all day',
          cpl: '₹35–65',
          adAngle: 'New collection launch, festive discounts, exclusive designs',
          message: `${b} — Indore's Latest Festive Collection Is Here 🎉`
        },
        {
          name: 'Working Women (22–38)',
          size: '55,000 in Indore',
          income: '₹25K–₹80K/month',
          painPoints: ['Office-appropriate yet stylish', 'Comfort & quality', 'Affordable fashion'],
          interests: ['Western wear', 'Kurtis', 'Workwear fashion', 'Online shopping'],
          platforms: ['Instagram', 'Facebook'],
          bestTime: '8–10 PM weekdays',
          cpl: '₹30–55',
          adAngle: 'Work-to-weekend styles, comfort fabrics, new arrivals',
          message: `${b} — Stylish Office Wear & Weekend Looks in Indore 👗`
        },
        {
          name: 'College Students (17–24)',
          size: '42,000 in Indore',
          income: '₹5K–₹20K/month',
          painPoints: ['Trendy but affordable', 'Unique styles', 'Quality at low price'],
          interests: ['Western trends', 'Streetwear', 'Instagram fashion', 'Sale events'],
          platforms: ['Instagram', 'Snapchat'],
          bestTime: '7–10 PM daily',
          cpl: '₹20–40',
          adAngle: 'Student discounts, trendy styles, buy 2 get 1 offers',
          message: `${b} — Stay Trendy Without Breaking the Bank 🔥`
        }
      ]
    },

    jewellery: {
      segments: [
        {
          name: 'Wedding Buyers & Families (28–55)',
          size: '25,000 per wedding season in Indore',
          income: '₹60K–₹3L/month',
          painPoints: ['Purity & authenticity concerns', 'Unique bridal designs', 'Heavy investment trust'],
          interests: ['Bridal jewellery', 'Gold rates', 'Diamond jewellery', 'Heritage designs'],
          platforms: ['Facebook', 'Instagram'],
          bestTime: 'Evenings & weekends during wedding season',
          cpl: '₹120–200',
          adAngle: 'BIS hallmark, bridal sets, easy EMI, custom designs',
          message: `${b} — Exquisite Bridal Jewellery for Your Special Day 💍`
        },
        {
          name: 'Gold Investors (35–60)',
          size: '30,000 in Indore',
          income: '₹80K–₹3L/month',
          painPoints: ['Gold purity concerns', 'Best rate guarantee', 'Safe purchase'],
          interests: ['Gold rates', 'Investment', 'SGB vs physical gold', 'Gifting'],
          platforms: ['Facebook', 'WhatsApp'],
          bestTime: '10 AM–1 PM weekdays',
          cpl: '₹80–150',
          adAngle: 'Best gold rate, hallmark guaranteed, exchange facility',
          message: `${b} — Certified Pure Gold at the Best Rates in Indore 🥇`
        },
        {
          name: 'Young Women (20–35) — Daily Wear',
          size: '48,000 in Indore',
          income: '₹20K–₹70K/month',
          painPoints: ['Affordable silver & imitation', 'Trending lightweight jewellery', 'Office-wear pieces'],
          interests: ['Minimalist jewellery', 'Silver', 'Daily wear', 'Trending designs'],
          platforms: ['Instagram', 'Facebook'],
          bestTime: '7–10 PM daily',
          cpl: '₹30–60',
          adAngle: 'Affordable silver, lightweight gold, modern designs',
          message: `${b} — Elegant Everyday Jewellery Starting ₹499 ✨`
        }
      ]
    },

    default: {
      segments: [
        {
          name: 'Primary Customers — Local Indore (25–45)',
          size: '50,000+ in Indore',
          income: '₹30K–₹1L/month',
          painPoints: ['Finding trusted local service', 'Value for money', 'Quality assurance'],
          interests: ['Local recommendations', 'Google reviews', 'Word of mouth', 'Best in city'],
          platforms: [platform, 'Facebook'],
          bestTime: '7–9 PM weekdays, weekends all day',
          cpl: '₹50–90',
          adAngle: 'Local trust, proven results, strong testimonials',
          message: `${b} — Indore's Most Trusted Choice 🏆`
        },
        {
          name: 'Premium Segment (35–55)',
          size: '18,000 in Indore',
          income: '₹1L–₹3L/month',
          painPoints: ['Expect premium quality', 'Time is money', 'Personalized experience'],
          interests: ['Premium brands', 'Exclusive deals', 'VIP service', 'Quality over price'],
          platforms: ['Instagram', 'LinkedIn'],
          bestTime: '8–10 AM & 7–9 PM',
          cpl: '₹120–200',
          adAngle: 'Premium quality, exclusive access, personalized service',
          message: `${b} — Premium Experience for Discerning Customers 👑`
        },
        {
          name: 'Value-Conscious Buyers (22–35)',
          size: '65,000 in Indore',
          income: '₹15K–₹50K/month',
          painPoints: ['Budget constraints', 'Getting best deal', 'Comparison shopping'],
          interests: ['Offers & discounts', 'Cashback', 'EMI options', 'Reviews'],
          platforms: ['Facebook', 'WhatsApp'],
          bestTime: '8–10 PM daily',
          cpl: '₹30–60',
          adAngle: 'Best price guarantee, EMI options, limited-time offers',
          message: `${b} — Best Quality at the Best Price in Indore 💰`
        }
      ]
    }
  };

  return niches[niche] || niches['default'];
}

// ─── PLATFORM-SPECIFIC AD COPY ─────────────────────────────────
function getAdCopyForPlatform(b: string, platform: string) {
  const configs: Record<string, { variations: any[] }> = {
    'Facebook': {
      variations: [
        { headline: `${b} — Trusted by Thousands in Indore`, body: `Looking for the best care in Indore? ${b} has helped thousands of families get the results they deserve. Our expert team is ready for you. Book your free consultation today! 🙌`, cta: 'Book Free Consultation', platform: 'Facebook', score: 91 },
        { headline: `Special Offer: ${b}`, body: `Don't miss out! ${b} is currently offering exclusive deals for new patients/clients. Limited slots available — claim yours before it's gone. Tag a friend who needs this! 👇`, cta: 'Claim Offer Now', platform: 'Facebook', score: 86 },
        { headline: `Why Indore Chooses ${b}`, body: `With years of experience and hundreds of happy clients, ${b} is Indore's most trusted name. See what everyone is talking about — visit us today or DM to know more.`, cta: 'Learn More', platform: 'Facebook', score: 82 },
      ]
    },
    'Instagram': {
      variations: [
        { headline: `${b} ✨`, body: `Transform your experience with ${b}. Trusted by thousands, delivering results you can see. Book your consultation today.`, cta: 'Book Now', platform: 'Instagram', score: 89 },
        { headline: `Why Choose ${b}? 🔥`, body: `At ${b}, we combine expertise with passion. Your success is our mission. Join our growing community of satisfied customers.`, cta: 'DM Us', platform: 'Instagram', score: 84 },
        { headline: `${b} — Excellence Every Day 💯`, body: `Looking for the best? ${b} offers unmatched quality and service. Don't settle for less — experience the difference today.`, cta: 'Visit Profile', platform: 'Instagram', score: 80 },
      ]
    },
    'LinkedIn': {
      variations: [
        { headline: `${b}: Setting New Standards in Indore`, body: `We're proud to announce that ${b} continues to lead the way in delivering exceptional professional services. Our commitment to excellence and client satisfaction remains our top priority.`, cta: 'Connect With Us', platform: 'LinkedIn', score: 88 },
        { headline: `Why Professionals Choose ${b}`, body: `${b} has earned the trust of hundreds of professionals across Indore. Our data-driven approach and personalized solutions deliver measurable results for every client.`, cta: 'Learn More', platform: 'LinkedIn', score: 84 },
        { headline: `${b} — Building Success Together`, body: `At ${b}, we believe in building long-term partnerships. Our expert team brings years of experience to help you achieve your goals efficiently and effectively.`, cta: 'Get In Touch', platform: 'LinkedIn', score: 80 },
      ]
    },
    'WhatsApp': {
      variations: [
        { headline: `Hi! Enquiring about ${b}`, body: `Hello! I came across ${b} and would love to know more. Could you share details about your services, pricing, and availability? Thank you! 🙏`, cta: 'Send Message', platform: 'WhatsApp', score: 90 },
        { headline: `${b} — Quick Info`, body: `Hey! ${b} is now available in Indore. Best quality, great prices. Reply YES to get our full brochure and current offers! 📲`, cta: 'Reply YES', platform: 'WhatsApp', score: 85 },
        { headline: `Exclusive Deal from ${b}`, body: `🎉 Special offer just for you! ${b} is running a limited-time promotion. Contact us now to avail this exclusive deal before it expires!`, cta: 'Contact Now', platform: 'WhatsApp', score: 81 },
      ]
    },
    'YouTube': {
      variations: [
        { headline: `${b} — Watch What Everyone's Talking About`, body: `Discover why thousands in Indore trust ${b}. In this video, we show you exactly what makes us different — real results, real stories, real impact. Subscribe for more!`, cta: 'Subscribe Now', platform: 'YouTube', score: 87 },
        { headline: `HONEST Review: ${b} in Indore`, body: `We let our results speak for themselves. Watch our latest video to see how ${b} is changing lives in Indore — and how we can help you too.`, cta: 'Watch Now', platform: 'YouTube', score: 83 },
        { headline: `${b} — The Complete Guide`, body: `Everything you need to know about ${b} in one video. From services to pricing to real customer testimonials — we've got it all covered. Like and share if this helped!`, cta: 'Watch & Share', platform: 'YouTube', score: 79 },
      ]
    },
    'Twitter': {
      variations: [
        { headline: `${b} is trending in Indore 🔥`, body: `Thousands are choosing ${b} for a reason. Quality service, expert team, proven results. Find out why → link in bio #Indore #${b.replace(/\s+/g, '')}`, cta: 'Check Bio Link', platform: 'Twitter', score: 86 },
        { headline: `Hot take: ${b} is the best in Indore`, body: `Bold claim? Maybe. But our results back it up. ${b} delivers every time. Come see for yourself. #IndoreBusiness #Quality`, cta: 'Learn More', platform: 'Twitter', score: 82 },
        { headline: `⚡ ${b} — Limited slots open`, body: `We only take limited clients to ensure 100% quality. ${b} has a few spots open this week. DM now before they're gone! #Indore`, cta: 'DM Now', platform: 'Twitter', score: 78 },
      ]
    },
  };
  return configs[platform] || configs['Facebook'];
}

// ─── DEMO CONTENT ─────────────────────────────────────────────
function getDemoContent(tool: string, business: string, platform: string = 'Facebook'): object {
  const b = business || 'Your Business';
  const p = platform || 'Facebook';

  if (tool === 'ad-copy') return getAdCopyForPlatform(b, p);

  if (tool === 'audience-ai') {
    const niche = detectNiche(b);
    return getAudienceSegments(b, niche, p);
  }

  const demos: Record<string, object> = {
    'headlines': {
      headlines: [
        { text: `${b}: Where Quality Meets Excellence`, type: 'Benefit-led', score: 91 },
        { text: `Why Thousands Trust ${b} Every Day`, type: 'Social proof', score: 88 },
        { text: `Transform Your Life with ${b}`, type: 'Transformation', score: 85 },
        { text: `${b} — The #1 Choice in Indore`, type: 'Authority', score: 83 },
        { text: `Limited Time: Experience ${b} Today`, type: 'Urgency', score: 80 }
      ]
    },
    'social-post': {
      hook: p === 'LinkedIn' ? `Proud to share something exciting about ${b} 🚀` : `🚀 Big news from ${b}!`,
      body: p === 'LinkedIn'
        ? `At ${b}, we've been working hard to deliver exceptional value to our clients in Indore.\n\nHere's what sets us apart:\n✅ Expert team with years of experience\n✅ Personalized solutions for every client\n✅ Proven results and measurable outcomes`
        : `We're passionate about serving you better every day. At ${b}, we believe in delivering exceptional quality.\n\nHere's what sets us apart:\n✅ Expert team with years of experience\n✅ Personalized solutions for every client\n✅ Proven results you can trust`,
      cta: p === 'LinkedIn' ? `Interested in learning more? Connect with us or visit our page.` : `📲 DM us or visit our profile to learn more about ${b}!`,
      hashtags: `#${b.replace(/\s+/g, '')} #Indore #Excellence #Quality #${p}Marketing`,
      platform: p
    },
    'article': {
      title: `Why ${b} is Changing the Game in Indore`,
      intro: `In today's competitive landscape, ${b} has emerged as a leading force, setting new standards for quality and customer satisfaction.`,
      sections: [
        { heading: 'The Story Behind the Success', content: `${b} was founded with a simple mission: to deliver exceptional value to every customer. Over the years, this commitment has translated into a loyal customer base and a reputation built on trust.` },
        { heading: 'What Makes Us Different', content: `Unlike others in the industry, ${b} focuses on personalized service and measurable outcomes. Every client receives dedicated attention and customized solutions tailored to their unique needs.` },
        { heading: 'Our Commitment to You', content: `At ${b}, we believe that your success is our success. That's why we continually invest in the best practices, technology, and talent to serve you better every day.` }
      ],
      conclusion: `Whether you're a first-time customer or a long-time partner, ${b} is here to exceed your expectations. Reach out today and discover the difference excellence makes.`,
      wordCount: 312
    },
    'reel-script': {
      hook: `Stop scrolling! Here's something you NEED to know about ${b}... 👀`,
      voiceover: [
        { time: '0-3s', text: `Did you know ${b} is transforming lives right here in Indore?` },
        { time: '3-8s', text: `Most people don't realize the difference quality service can make.` },
        { time: '8-15s', text: `At ${b}, we've helped hundreds of clients achieve their goals — and we can help you too.` },
        { time: '15-20s', text: `Our expert team is ready to give you the personalized attention you deserve.` },
        { time: '20-27s', text: `Don't wait — your best experience with ${b} is just one call away.` },
        { time: '27-30s', text: `Click the link in bio or DM us NOW!` }
      ],
      slides: ['Brand intro shot', 'Team/facility footage', 'Happy customer testimonial', 'Service highlight', 'CTA with contact'],
      music: 'Upbeat, motivational background track'
    },
    'hashtags': {
      primary: [`#${b.replace(/\s+/g, '')}`, '#Indore', '#IndoreBusiness', '#MadhyaPradesh'],
      niche: ['#SmallBusiness', '#LocalBusiness', '#IndoreLocal', '#MadeInIndia', '#IndianBusiness'],
      trending: [`#${p}Marketing`, '#Trending2026', '#ViralContent', '#BusinessGrowth', '#DigitalMarketing'],
      engagement: ['#Follow', '#Like', '#Share', '#Comment', '#SaveThis'],
      strategy: `Use 3-5 primary tags + 5-8 niche tags per post. Rotate trending tags weekly. Always include location tags for local ${p} reach.`
    },
    'captions': {
      instagram: {
        caption: `✨ Excellence is not a destination — it's a journey. And at ${b}, we walk that journey with you every step of the way.\n\n💬 Drop a comment below: What does excellence mean to you?\n\n📲 DM us for more info | Link in bio\n.\n.\n#${b.replace(/\s+/g, '')} #Indore #Excellence`,
        length: 'Medium (recommended for engagement)'
      },
      facebook: {
        caption: `We at ${b} are proud to serve our wonderful community in Indore! 🙌\n\nEvery day, we strive to deliver the best experience possible. Your trust means everything to us, and we promise to always go above and beyond.\n\n👉 Visit us today or send us a message — we'd love to hear from you!\n\n#${b.replace(/\s+/g, '')} #Indore #LocalBusiness`,
        length: 'Long (Facebook favors detailed posts)'
      }
    }
  };

  return demos[tool] || { message: `Demo content for ${tool} — ${b}` };
}

// ─── PROMPT BUILDER ────────────────────────────────────────────
function buildPrompt(tool: string, business: string, platform: string, tone: string): string {
  const toneStr = tone || 'professional';
  const platformStr = platform || 'Facebook';

  const prompts: Record<string, string> = {
    'ad-copy': `You are an expert Indian digital marketing copywriter. Create 3 ad copy variations specifically for ${platformStr} for: "${business}"
Tone: ${toneStr}. All 3 variations must be labeled platform: "${platformStr}".
Return ONLY valid JSON:
{"variations":[{"headline":"...","body":"...","cta":"...","platform":"${platformStr}","score":85},{"headline":"...","body":"...","cta":"...","platform":"${platformStr}","score":82},{"headline":"...","body":"...","cta":"...","platform":"${platformStr}","score":79}]}`,

    'headlines': `You are a conversion copywriter. Create 5 powerful headlines for: "${business}". Tone: ${toneStr}
Return ONLY valid JSON:
{"headlines":[{"text":"...","type":"Benefit-led","score":90},{"text":"...","type":"Social proof","score":87},{"text":"...","type":"Transformation","score":84},{"text":"...","type":"Authority","score":81},{"text":"...","type":"Urgency","score":78}]}`,

    'social-post': `You are a social media expert. Write a viral ${platformStr} post for: "${business}". Tone: ${toneStr}
Return ONLY valid JSON:
{"hook":"opening line","body":"main post content","cta":"call to action","hashtags":"#tag1 #tag2","platform":"${platformStr}"}`,

    'article': `You are a content marketer. Write a 300+ word article for: "${business}". Tone: ${toneStr}
Return ONLY valid JSON:
{"title":"...","intro":"...","sections":[{"heading":"...","content":"..."},{"heading":"...","content":"..."},{"heading":"...","content":"..."}],"conclusion":"...","wordCount":320}`,

    'reel-script': `You are a viral video scriptwriter. Create a 30-second Reel script for: "${business}". Tone: ${toneStr}
Return ONLY valid JSON:
{"hook":"attention grabber","voiceover":[{"time":"0-3s","text":"..."},{"time":"3-8s","text":"..."},{"time":"8-15s","text":"..."},{"time":"15-20s","text":"..."},{"time":"20-27s","text":"..."},{"time":"27-30s","text":"..."}],"slides":["s1","s2","s3","s4","s5"],"music":"suggestion"}`,

    'hashtags': `You are a hashtag strategist. Generate hashtags for: "${business}" on ${platformStr}
Return ONLY valid JSON:
{"primary":["#t1","#t2","#t3","#t4"],"niche":["#t1","#t2","#t3","#t4","#t5"],"trending":["#t1","#t2","#t3","#t4","#t5"],"engagement":["#t1","#t2","#t3","#t4"],"strategy":"strategy note"}`,

    'captions': `You are a caption writer. Write Instagram and Facebook captions for: "${business}". Tone: ${toneStr}
Return ONLY valid JSON:
{"instagram":{"caption":"full caption with emojis","length":"Medium"},"facebook":{"caption":"full caption","length":"Long"}}`,

    'audience-ai': `You are a digital marketing strategist in India. Identify 3 specific target audience segments for: "${business}" in Indore.
Be very specific to this business type — think about who actually needs this product/service, their real pain points, and what ad message would convert them.
Return ONLY valid JSON:
{"segments":[{"name":"segment name with age","size":"size in Indore","income":"income range","painPoints":["pain1","pain2","pain3"],"interests":["i1","i2","i3","i4"],"platforms":["p1","p2"],"bestTime":"best time","cpl":"CPL in INR","adAngle":"ad strategy","message":"specific ad message"},{"name":"...","size":"...","income":"...","painPoints":["..."],"interests":["..."],"platforms":["..."],"bestTime":"...","cpl":"...","adAngle":"...","message":"..."},{"name":"...","size":"...","income":"...","painPoints":["..."],"interests":["..."],"platforms":["..."],"bestTime":"...","cpl":"...","adAngle":"...","message":"..."}]}`
  };

  return prompts[tool] || `Generate ${tool} content for: "${business}". Return as JSON.`;
}

// ─── API HANDLER ───────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tool, business, platform, tone } = body;

    if (!tool || !business) {
      return NextResponse.json({ error: 'tool and business are required' }, { status: 400 });
    }

    const prompt = buildPrompt(tool, business, platform, tone);

    if (!OPENROUTER_API_KEY) {
      return NextResponse.json({ result: getDemoContent(tool, business, platform), demo: true });
    }

    const models = [
      'mistralai/mistral-7b-instruct:free',
      'meta-llama/llama-3.2-3b-instruct:free',
      'google/gemma-3-1b-it:free',
    ];

    let lastError = '';

    for (const model of models) {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://globalwebsaas.vercel.app',
            'X-Title': 'GlobalWebSaaS AI Generator'
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: 'You are a marketing AI. Always respond with valid JSON only. No markdown, no explanation, just raw JSON.' },
              { role: 'user', content: prompt }
            ],
            max_tokens: 1500,
            temperature: 0.7
          })
        });

        if (!response.ok) { lastError = `${model}: ${response.status}`; continue; }

        const data = await response.json();
        let rawText = extractText(data);
        if (!rawText) { lastError = `${model}: empty`; continue; }

        rawText = rawText.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
        const jsonStart = rawText.search(/[{[]/);
        if (jsonStart > 0) rawText = rawText.slice(jsonStart);
        const jsonEnd = Math.max(rawText.lastIndexOf('}'), rawText.lastIndexOf(']'));
        if (jsonEnd !== -1) rawText = rawText.slice(0, jsonEnd + 1);

        try {
          const parsed = JSON.parse(rawText);
          return NextResponse.json({ result: parsed, model, demo: false });
        } catch {
          lastError = `${model}: JSON parse failed`; continue;
        }
      } catch (err: any) {
        lastError = `${model}: ${err.message}`; continue;
      }
    }

    return NextResponse.json({ result: getDemoContent(tool, business, platform), demo: true, error: lastError });

  } catch (err: any) {
    return NextResponse.json(
      { result: getDemoContent('ad-copy', 'Your Business', 'Facebook'), demo: true, error: err.message },
      { status: 200 }
    );
  }
}
