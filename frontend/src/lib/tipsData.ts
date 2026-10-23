export interface HealthTip {
  id: string
  title: string
  description: string
  category: string
  content: string
  is_featured: boolean
  views: number
  author?: string
  readTime?: string
  level?: 'Essential' | 'Daily Habit' | 'Pro Tip'
  tags?: string[]
  created_at?: string
}

export const INITIAL_TIPS: HealthTip[] = [
  {
    id: 'tip-1',
    title: 'The 20-Second Scientific Handwashing Rule',
    description: 'Learn the exact technique endorsed by the WHO to eliminate 99.8% of daily surface germs.',
    category: 'Personal Hygiene',
    content: `Effective handwashing is the single most powerful defense against pathogens.
    
1. Wet hands with warm or cold clean running water and apply enough soap to cover all surfaces.
2. Rub palms together to create a rich lather.
3. Interlace fingers and scrub the backs of hands, wrists, and between each finger.
4. Clean under fingernails and around thumbs specifically, where bacteria harbor most.
5. Scrub vigorously for at least 20 seconds (the time it takes to sing "Happy Birthday" twice).
6. Rinse thoroughly and dry completely using a single-use towel or clean air dryer. Damp hands transfer 1,000x more bacteria than dry hands!`,
    is_featured: true,
    views: 1240,
    author: 'Dr. Sarah Lin, Epidemic Hygiene Specialist',
    readTime: '2 min read',
    level: 'Essential',
    tags: ['Hands', 'Germs', 'Daily Defense'],
    created_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 'tip-2',
    title: 'Precision Dental Hygiene: Beyond Just Brushing',
    description: 'Protect your enamel, gum line, and cardiovascular health with modern oral hygiene practices.',
    category: 'Dental Health',
    content: `Oral health directly influences heart and metabolic wellness.
    
- Use a soft-bristled toothbrush held at a 45-degree angle to the gum line.
- Brush for a full two minutes twice a day—divide your mouth into 4 quadrants (30 seconds each).
- Don't rinse immediately after spitting toothpaste; leaving fluoride residue enhances remineralization.
- Floss daily or use a water flosser to remove plaque colonies that brushing misses between tight teeth.
- Gently scrape your tongue from back to front to eliminate volatile sulfur compounds causing morning breath.`,
    is_featured: true,
    views: 980,
    author: 'Dr. Marcus Vance, Dental Surgeon',
    readTime: '3 min read',
    level: 'Daily Habit',
    tags: ['Teeth', 'Oral Care', 'Gums'],
    created_at: '2026-01-12T11:00:00Z',
  },
  {
    id: 'tip-3',
    title: 'Kitchen Cross-Contamination & Cutting Board Protocols',
    description: 'Stop dangerous foodborne pathogens by mastering safe food preparation zones.',
    category: 'Food Hygiene',
    content: `Cross-contamination in domestic kitchens is the primary cause of household food poisoning.
    
- Keep separate color-coded cutting boards: Red/dedicated board for raw meat & poultry, green for produce.
- Never wash raw chicken under the tap—splashes can disperse campylobacter up to 3 feet across your counter!
- Refrigerator shelf hygiene: Store raw meats in leakproof sealed bins on the bottom shelf so drippings never reach cooked foods or vegetables.
- Wash sponges with boiling water or microwave wet sponges for 1 minute every 48 hours, and replace monthly.`,
    is_featured: true,
    views: 840,
    author: 'Chef Elena Ramos & Nutrition Safety Board',
    readTime: '3 min read',
    level: 'Essential',
    tags: ['Kitchen', 'Food Safety', 'Cooking'],
    created_at: '2026-01-15T09:30:00Z',
  },
  {
    id: 'tip-4',
    title: 'Sleep Space & Bedding Microbiology Hygiene',
    description: 'Why washing sheets every 7 days transforms skin health and allergy defense.',
    category: 'Home Hygiene',
    content: `Humans shed approximately 500 million skin cells every night, turning pillows and bed sheets into microscopic breeding grounds for dust mites and bacteria.
    
- Wash pillowcases every 3-4 days and bedsheets weekly at 60°C (140°F) to kill allergens and mites.
- Use breathable hypoallergenic mattress and pillow protectors.
- Never sleep with daily street clothes on your bed, as they carry outdoor pollen and transit dust.
- Air out your duvet each morning before making the bed to evaporate overnight body moisture.`,
    is_featured: false,
    views: 650,
    author: 'Dr. Julian Ross, Sleep & Allergy Specialist',
    readTime: '2 min read',
    level: 'Daily Habit',
    tags: ['Bedding', 'Sleep', 'Allergies'],
    created_at: '2026-01-18T14:15:00Z',
  },
  {
    id: 'tip-5',
    title: 'Smartphone & Personal Tech Sanitization Protocol',
    description: 'Your phone carries 10x more bacteria than a toilet seat. Here is how to clean it safely.',
    category: 'Personal Hygiene',
    content: `We touch our smartphones over 2,500 times a day, transferring oils, sweat, and transit germs directly to our facial skin.
    
- Wipe device screens daily with 70% isopropyl alcohol wipes or microfiber cloths dampened with electronics-safe disinfectant.
- Remove phone cases at least once a week to clean grime accumulated in the crevices.
- Avoid bringing smartphones into bathroom environments where aerosolized toilet plumes settle.
- Disinfect headphones and keyboard surfaces regularly, especially if shared.`,
    is_featured: true,
    views: 1120,
    author: 'HealthHub Tech Wellness Editorial',
    readTime: '2 min read',
    level: 'Daily Habit',
    tags: ['Smartphones', 'Gadgets', 'Skin Health'],
    created_at: '2026-01-20T16:00:00Z',
  },
  {
    id: 'tip-6',
    title: 'Clean Drinking Water: Storage & Filtration Standards',
    description: 'Ensure everyday water purity and prevent stagnant bacterial biofilms.',
    category: 'Environmental Health',
    content: `Clean water is foundational to metabolic function and digestive integrity.
    
- Clean reusable water bottles daily with hot water and dish soap, giving extra attention to silicone straws and bite valves.
- Change carbon and reverse-osmosis filter cartridges promptly according to manufacturer schedules.
- If using water pitchers, always keep them refrigerated rather than at room temperature to prevent microbial bloom.
- In emergencies or during municipal boil notices, maintain a rolling boil for at least 1 minute.`,
    is_featured: false,
    views: 430,
    author: 'Environmental Hydration Taskforce',
    readTime: '2 min read',
    level: 'Essential',
    tags: ['Water', 'Hydration', 'Filtration'],
    created_at: '2026-01-22T08:45:00Z',
  },
  {
    id: 'tip-7',
    title: 'Post-Workout Gym Gear & Skin Barrier Protection',
    description: 'Prevent folliculitis, ringworm, and acne mechanica after intense exercise.',
    category: 'Health Protection',
    content: `Damp synthetic workout fabrics trap sweat, sebum, and environmental bacteria against active pores.
    
- Shower within 20 minutes after intense workouts using gentle, pH-balanced antibacterial cleansers.
- Never re-wear workout apparel without washing; active fungi multiply rapidly in damp gym bags.
- Always use a clean barrier towel on communal gym benches and wipe down equipment before and after use.
- Air dry running sneakers thoroughly between sessions to prevent tinea pedis (athlete's foot).`,
    is_featured: false,
    views: 520,
    author: 'Dr. Kevin Cole, Sports Dermatologist',
    readTime: '3 min read',
    level: 'Pro Tip',
    tags: ['Gym', 'Fitness', 'Skin Protection'],
    created_at: '2026-01-25T12:00:00Z',
  },
  {
    id: 'tip-8',
    title: 'Indoor Air Quality & Ventilation Hygiene',
    description: 'Reduce CO2 buildup, VOCs, and indoor airborne spores with simple air management.',
    category: 'Environmental Health',
    content: `Indoor air is frequently 2 to 5 times more polluted than outdoor air due to cooking fumes, furniture off-gassing, and closed windows.
    
- Open opposite windows for 10-15 minutes twice daily to create cross-ventilation and purge accumulated CO2.
- Run range hoods while frying or boiling to vent combustion particles outdoors.
- Utilize HEPA air purifiers in bedrooms to capture PM2.5 particulates and airborne mold spores.
- Maintain indoor relative humidity between 40% and 55% to discourage mold growth while keeping mucus membranes moist.`,
    is_featured: false,
    views: 490,
    author: 'Clean Air Engineering Advisory',
    readTime: '3 min read',
    level: 'Pro Tip',
    tags: ['Air Quality', 'Home', 'Breathing'],
    created_at: '2026-01-28T17:30:00Z',
  },
  {
    id: 'tip-9',
    title: 'Respiratory Etiquette & Public Transit Protection',
    description: 'Prevent seasonal airborne viral transmission with hygienic respiratory habits.',
    category: 'Health Protection',
    content: `Coughs and sneezes can project microbial droplets up to 20 feet at velocities over 50 mph.
    
- Always cough or sneeze into the crook of your elbow, never into bare hands.
- Dispose of used facial tissues immediately into lined bins and sanitize hands immediately.
- In crowded public transit during peak respiratory seasons, wearing a well-fitted KN95 or surgical mask protects both yourself and vulnerable commuters.
- Keep a 60%+ alcohol-based hand rub accessible in your pocket or bag for rapid hand hygiene on the go.`,
    is_featured: true,
    views: 790,
    author: 'WHO Infection Prevention Framework',
    readTime: '2 min read',
    level: 'Essential',
    tags: ['Respiratory', 'Flu Prevention', 'Public Transit'],
    created_at: '2026-02-02T10:10:00Z',
  },
  {
    id: 'tip-10',
    title: 'Bathroom Surface & High-Touch Disinfection',
    description: 'The science of contact time: how to disinfect surfaces so cleaners actually work.',
    category: 'Home Hygiene',
    content: `Most people spray a disinfectant and immediately wipe it off—rendering it virtually useless!
    
- Check the "Dwell Time": Most disinfectants require 3 to 10 minutes of wet contact time to neutralize norovirus and staphylococcus.
- Prioritize high-touch vectors: Flush handles, doorknobs, faucet levers, and light switches.
- Close the toilet lid before flushing to prevent aerosolized bacterial plumes from settling on open toothbrushes and hand towels.
- Replace damp bathroom hand towels every 2 to 3 days to prevent fungal odor and bacterial colonies.`,
    is_featured: false,
    views: 610,
    author: 'Hospital Sanitation Best Practice Group',
    readTime: '3 min read',
    level: 'Essential',
    tags: ['Bathroom', 'Sanitizing', 'Disinfection'],
    created_at: '2026-02-05T11:45:00Z',
  },
  {
    id: 'tip-11',
    title: 'Nail Care & Subungual Microbe Management',
    description: 'Underneath fingernails is the primary reservoir for skin-to-mouth pathogens.',
    category: 'Personal Hygiene',
    content: `The area beneath your fingernails harbors high concentrations of coagulase-negative staphylococci and gram-negative rods.
    
- Keep nails trimmed neatly and filed smoothly to eliminate crevices where dirt and food particles get trapped.
- Use a dedicated soft nail brush during handwashing, especially after handling soil, pets, or raw foods.
- Avoid biting nails or picking at cuticles, which creates microscopic epidermal breaks that allow infections like paronychia.
- Disinfect nail clippers and manicure tools with rubbing alcohol after each use.`,
    is_featured: false,
    views: 380,
    author: 'Dermatological Hygiene Guild',
    readTime: '2 min read',
    level: 'Daily Habit',
    tags: ['Nails', 'Grooming', 'Infection Control'],
    created_at: '2026-02-08T13:20:00Z',
  },
  {
    id: 'tip-12',
    title: 'Produce Washing: Removing Pesticides and Soil Bacteria',
    description: 'The vinegar and baking soda soak vs. running cold water methods compared.',
    category: 'Food Hygiene',
    content: `Raw fruits and vegetables carry surface residues, agricultural runoff, and potential listeria bacteria.
    
- Wash all fruits and vegetables under cold running water, even those with rinds you do not eat (like avocados, melons, and citrus), so knife slicing does not transfer surface bacteria into the edible flesh.
- For leafy greens and berries, soak in a solution of 1 part white vinegar to 4 parts water for 5 minutes, then rinse thoroughly.
- For apples and firm fruits, a 10-minute soak in a solution of 1 teaspoon baking soda per 2 cups of water removes significantly more surface pesticides than water alone.
- Dry produce with clean paper towels before storage to prevent rapid mold deterioration.`,
    is_featured: true,
    views: 1040,
    author: 'Agricultural Food Safety Council',
    readTime: '3 min read',
    level: 'Essential',
    tags: ['Produce', 'Fruit', 'Pesticides'],
    created_at: '2026-02-12T09:00:00Z',
  },
  {
    id: 'tip-13',
    title: 'Laundry Hygiene for Towels, Bedding, and Synthetics',
    description: 'Why cold water washing might leave microbial odors and how to properly sanitize fabrics.',
    category: 'Home Hygiene',
    content: `While cold water washes are eco-friendly for lightly soiled shirts, certain items require thermal or chemical sanitization.
    
- Bath towels must dry completely between uses on wide bars, not crumpled on hooks where mildew flourishes.
- Wash towels in hot water (minimum 60°C / 140°F) or use oxygen-based laundry sanitizers.
- Avoid excessive fabric softeners on athletic wear and bath towels; softeners leave a waxy silicone coating that traps odors and destroys fabric absorbency.
- Clean your washing machine drum once a month by running a hot cycle with white vinegar or machine-cleaning tablets.`,
    is_featured: false,
    views: 470,
    author: 'Textile Care & Environmental Science',
    readTime: '2 min read',
    level: 'Daily Habit',
    tags: ['Laundry', 'Towels', 'Washing'],
    created_at: '2026-02-15T15:10:00Z',
  },
  {
    id: 'tip-14',
    title: 'Contact Lens Care & Ocular Infection Prevention',
    description: 'Prevent severe acanthamoeba keratitis and cornea abrasions with strict lens hygiene.',
    category: 'Personal Hygiene',
    content: `The eye cornea has delicate epithelial defenses easily breached by dirty contact lenses.
    
- Never, under any circumstances, expose contact lenses or lens cases to tap water, saliva, or shower water.
- Wash hands thoroughly with fragrance-free soap and dry with lint-free towels before touching eyes or lenses.
- Replace your lens case every 3 months; clean it daily by rubbing with fresh multipurpose solution and air drying upside down on clean tissue.
- Never sleep in lenses unless specifically prescribed for extended overnight wear by your optometrist.`,
    is_featured: false,
    views: 530,
    author: 'Dr. Clara Gomez, Optometrist',
    readTime: '3 min read',
    level: 'Essential',
    tags: ['Eyes', 'Contact Lenses', 'Vision'],
    created_at: '2026-02-18T10:40:00Z',
  },
  {
    id: 'tip-15',
    title: 'Ergonomic & Screen Hygiene for Digital Workers',
    description: 'Maintain healthy eyes, spine posture, and circadian rhythms during screen time.',
    category: 'Health Protection',
    content: `Sedentary screen use creates strain on musculoskeletal and neurological health.
    
- Follow the 20-20-20 Rule: Every 20 minutes, look at an object at least 20 feet away for 20 seconds to relax ciliary eye muscles.
- Position your computer monitor so the top third of the display is at eye level, roughly an arm length away.
- Blink consciously: Screen users blink 66% less frequently, causing tear film evaporation and dry eyes.
- Use blue light reduction filters after sunset to protect melatonin synthesis and circadian sleep hygiene.`,
    is_featured: false,
    views: 710,
    author: 'Occupational Health & Ergonomics Institute',
    readTime: '2 min read',
    level: 'Daily Habit',
    tags: ['Screen Time', 'Posture', 'Eye Health'],
    created_at: '2026-02-22T14:00:00Z',
  },
  {
    id: 'tip-16',
    title: 'Safe Food Storage Temperatures & Refrigerator Zones',
    description: 'Keep perishables out of the dangerous 4°C - 60°C bacterial reproduction zone.',
    category: 'Food Hygiene',
    content: `Bacteria multiply exponentially between 40°F (4°C) and 140°F (60°C), doubling in number every 20 minutes.
    
- Keep your home refrigerator set at or below 38°F (3.3°C) and freezer at 0°F (-18°C).
- Do not store milk or eggs in the refrigerator door shelves; temperatures fluctuate drastically each time the door opens. Keep them in the colder central shelf.
- Cool leftover foods quickly in shallow containers before refrigerating; never leave hot cooked foods on countertops for more than 2 hours.
- Consume leftovers within 3 to 4 days, or freeze them in airtight portion containers.`,
    is_featured: true,
    views: 890,
    author: 'National Food Safety Directorate',
    readTime: '3 min read',
    level: 'Essential',
    tags: ['Fridge', 'Leftovers', 'Food Storage'],
    created_at: '2026-02-26T16:20:00Z',
  },
  {
    id: 'tip-17',
    title: 'Skin Microbiome Care: Why Over-Exfoliation Backfires',
    description: 'Preserve your acid mantle and beneficial cutaneous bacteria for glowing, rash-free skin.',
    category: 'Personal Hygiene',
    content: `Cleanliness does not mean sterilizing your skin. Your natural skin barrier is slightly acidic (pH ~5.5).
    
- Avoid scalding hot showers, which strip essential lipids and ceramides, causing compensatory oil overproduction and eczema flare-ups.
- Limit physical scrub exfoliators to once a week; harsh walnut or apricot shells create micro-tears in the stratum corneum.
- Use lukewarm water and gentle, syndet (synthetic detergent) cleansers rather than harsh alkaline bar soaps.
- Apply moisturizer immediately after patting skin damp to seal in hydration within the critical 3-minute window.`,
    is_featured: false,
    views: 640,
    author: 'Dr. Audrey Thorne, Dermatologist',
    readTime: '2 min read',
    level: 'Pro Tip',
    tags: ['Skin', 'Skincare', 'Microbiome'],
    created_at: '2026-03-01T11:00:00Z',
  },
  {
    id: 'tip-18',
    title: 'Hydration Rhythm & Electrolyte Balance Guide',
    description: 'How to hydrate intelligently throughout the day rather than chugging water at night.',
    category: 'Environmental Health',
    content: `Proper hydration regulates body temperature, joint lubrication, waste excretion, and cognitive focus.
    
- Drink a glass of room-temperature water first thing upon waking to rehydrate after 7-8 hours of respiratory moisture loss.
- Monitor urine color: Pale straw or light yellow signifies optimal hydration; dark amber warns of dehydration; completely clear may indicate over-dilution.
- Add a pinch of unrefined sea salt or a squeeze of lemon to your water if sweating heavily to replenish essential sodium and potassium.
- Taper fluid intake 1.5 hours before bedtime to avoid disrupted sleep cycles from frequent nocturia.`,
    is_featured: false,
    views: 820,
    author: 'Clinical Nutrition & Hydration Institute',
    readTime: '2 min read',
    level: 'Daily Habit',
    tags: ['Hydration', 'Water', 'Wellness'],
    created_at: '2026-03-05T09:15:00Z',
  },
]
